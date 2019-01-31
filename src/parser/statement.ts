import * as ESTree from '../estree';
import {
  Context,
  Flags,
  LabelState,
  LabelledState,
  ParserState,
  consumeSemicolon,
  Type,
  Origin,
  reinterpret,
  validateBindingIdentifier,
  nextTokenIsFuncKeywordOnSameLine,
  getLabel,
  validateContinueLabel,
  validateBreakStatement,
  addLabel,
  ScopeState,
  ScopeType,
  createSubScope,
  acquireGrammar,
  finishNode
} from '../common';
import { Token, KeywordDescTable } from '../token';
import { next } from '../scanner';
import { optional, expect, checkIfExistInLexicalBindings, isLexical, lookAheadOrScan } from '../common';
import { report, Errors } from '../errors';
import {
  parseFunctionDeclaration,
  parseClassDeclaration,
  parseLexicalDeclaration,
  parseVariableDeclarationList
} from './declarations';
import { parseBindingIdentifierOrPattern } from './pattern';
import {
  parseExpression,
  parseSequenceExpression,
  parseAssignmentExpression,
  parseIdentifier,
  parseLiteral
} from './expression';

/**
 * Parses statement list item
 *
 * @param state  Parser object
 * @param context Context masks
 * @param scope scope state
 */
export function parseStatementList(state: ParserState, context: Context, scope: ScopeState): ESTree.Statement[] {
  const statements: ESTree.Statement[] = [];
  while (state.token === Token.StringLiteral) {
    const tokenValue = state.tokenValue;
    if (tokenValue.length === 10 && tokenValue === 'use strict') {
      context |= Context.Strict;
    }
    statements.push(parseDirective(state, context, scope));
  }

  while (state.token !== Token.EndOfSource) {
    statements.push(parseStatementListItem(state, context, scope));
  }

  return statements;
}

export function parseStatementListItem(state: ParserState, context: Context, scope: ScopeState): any {
  state.assignable = state.bindable = true;
  switch (state.token) {
    case Token.ExportKeyword:
      report(state, Errors.InvalidImportExportSloppy, KeywordDescTable[state.token & Token.Type]);
    case Token.ImportKeyword:
      return (context & Context.OptionsNext) !== 0
        ? parseStatement(state, (context | Context.TopLevel) ^ Context.TopLevel, scope, LabelledState.AllowAsLabelled)
        : report(state, Errors.InvalidImportExportSloppy, KeywordDescTable[state.token & Token.Type]);
    case Token.FunctionKeyword:
      return parseFunctionDeclaration(state, context, scope, Origin.Declaration, false);
    case Token.ClassKeyword:
      return parseClassDeclaration(state, context, scope);
    case Token.ConstKeyword:
      return parseLexicalDeclaration(state, context, Type.Const, Origin.Statement, scope);
    case Token.LetKeyword:
      return parseLetOrExpressionStatement(state, context, scope);
    case Token.AsyncKeyword:
      return parseAsyncFunctionOrExpressionStatement(state, context, scope);
    default:
      return parseStatement(
        state,
        (context | Context.TopLevel) ^ Context.TopLevel,
        scope,
        LabelledState.AllowAsLabelled
      );
  }
}

/**
 * Parses either an async function declaration or an expression statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-let-and-const-declarations)
 * @see [Link](https://tc39.github.io/ecma262/#prod-ExpressionStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseAsyncFunctionOrExpressionStatement(
  state: ParserState,
  context: Context,
  scope: ScopeState
): ReturnType<typeof parseFunctionDeclaration | typeof parseExpressionOrLabelledStatement> {
  return lookAheadOrScan(state, context, nextTokenIsFuncKeywordOnSameLine, false)
    ? parseFunctionDeclaration(state, context, scope, Origin.AsyncFunction, true)
    : parseExpressionOrLabelledStatement(state, context, scope, LabelledState.Disallow);
}

function parseLetOrExpressionStatement(
  state: ParserState,
  context: Context,
  scope: ScopeState
): ReturnType<typeof parseVariableStatement | typeof parseExpressionOrLabelledStatement> {
  return lookAheadOrScan(state, context, isLexical, true)
    ? parseLexicalDeclaration(state, context, Type.Let, Origin.Statement, scope)
    : parseExpressionOrLabelledStatement(state, context, scope, LabelledState.Disallow);
}

/**
 * Parses statements
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-Statement)
 *
 * @param state Parser object
 * @param context Context masks
 * @param scope Scope instance
 */
function parseStatement(
  state: ParserState,
  context: Context,
  scope: ScopeState,
  label: LabelledState
): ESTree.Statement {
  const { token } = state;
  if (
    (token & Token.IsIdentifier) === Token.IsIdentifier ||
    (token & Token.Contextual) === Token.Contextual ||
    (token & Token.IsYield) === Token.IsYield ||
    token === Token.EscapedKeyword ||
    token === Token.EscapedStrictReserved
  ) {
    if ((token & Token.IsAsync) === Token.IsAsync) {
      if (lookAheadOrScan(state, context, nextTokenIsFuncKeywordOnSameLine, false)) {
        report(state, Errors.AsyncFunctionInSingleStatementContext);
      }
    }
    return parseExpressionOrLabelledStatement(state, context, scope, label);
  }

  if ((token & Token.Keyword) === Token.Keyword) {
    switch (token) {
      case Token.VarKeyword:
        return parseVariableStatement(state, context, Type.Variable, Origin.Statement, scope);
      case Token.SwitchKeyword:
        return parseSwitchStatement(state, context, scope);
      case Token.DoKeyword:
        return parseDoWhileStatement(state, context, scope);
      case Token.ReturnKeyword:
        return parseReturnStatement(state, context);
      case Token.WhileKeyword:
        return parseWhileStatement(state, context, scope);
      case Token.WithKeyword:
        return parseWithStatement(state, context, scope);
      case Token.BreakKeyword:
        return parseBreakStatement(state, context);
      case Token.ContinueKeyword:
        return parseContinueStatement(state, context);
      case Token.DebuggerKeyword:
        return parseDebuggerStatement(state, context);
      case Token.TryKeyword:
        return parseTryStatement(state, context, scope);
      case Token.ThrowKeyword:
        return parseThrowStatement(state, context);
      case Token.IfKeyword:
        return parseIfStatement(state, context, scope);
      case Token.ForKeyword:
        return parseForStatement(state, context, scope);
      case Token.FunctionKeyword:
        report(
          state,
          context & Context.Strict
            ? Errors.StrictFunction
            : (context & Context.OptionsWebCompat) === 0
            ? Errors.WebCompatFunction
            : Errors.SloppyFunction
        );

      case Token.ClassKeyword:
        report(state, Errors.ForbiddenAsStatement, KeywordDescTable[token & Token.Type]);
      default: // ignore
    }
  }

  switch (token) {
    case Token.Semicolon:
      return parseEmptyStatement(state, context);
    case Token.LeftBrace:
      return parseBlockStatement(
        state,
        (context | Context.TopLevel) ^ Context.TopLevel,
        createSubScope(scope, ScopeType.BlockStatement)
      );

    default:
      return parseExpressionStatement(state, context);
  }
}

/**
 * Parses either expression or labelled statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ExpressionStatement)
 * @see [Link](https://tc39.github.io/ecma262/#prod-LabelledStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseExpressionStatement(state: ParserState, context: Context): ESTree.ExpressionStatement {
  const { startIndex } = state;
  const expr: ESTree.Expression = parseExpression(
    state,
    (context | Context.DisallowInContext) ^ Context.DisallowInContext
  );
  consumeSemicolon(state, context);
  return finishNode(state, context, startIndex, {
    type: 'ExpressionStatement',
    expression: expr
  });
}

/**
 * Parses block statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-BlockStatement)
 * @see [Link](https://tc39.github.io/ecma262/#prod-Block)
 *
 * @param state Parser object
 * @param context Context masks
 * @param scope Scope instance
 */
export function parseBlockStatement(state: ParserState, context: Context, scope: ScopeState): ESTree.BlockStatement {
  const body: ESTree.Statement[] = [];
  const { startIndex: start } = state;
  next(state, context);
  while (state.token !== Token.RightBrace) {
    body.push(parseStatementListItem(state, context, scope));
  }
  expect(state, context | Context.AllowPossibleRegEx, Token.RightBrace);

  return finishNode(state, context, start, {
    type: 'BlockStatement',
    body
  });
}

/**
 * Parses empty statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-EmptyStatement)
 *
 * @param state  Parser object
 * @param context Context masks
 */
export function parseEmptyStatement(state: ParserState, context: Context): ESTree.EmptyStatement {
  const { startIndex } = state;
  next(state, context | Context.AllowPossibleRegEx);
  return finishNode(state, context, startIndex, {
    type: 'EmptyStatement'
  });
}

/**
 * Parses throw statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ThrowStatement)
 *
 * @param state  Parser object
 * @param context Context masks
 */
export function parseThrowStatement(state: ParserState, context: Context): ESTree.ThrowStatement {
  const { startIndex } = state;
  next(state, context);
  if (state.flags & Flags.NewLine) report(state, Errors.NewlineAfterThrow);
  const argument: ESTree.Expression = parseExpression(
    state,
    (context | Context.DisallowInContext) ^ Context.DisallowInContext
  );
  consumeSemicolon(state, context);
  return finishNode(state, context, startIndex, {
    type: 'ThrowStatement',
    argument
  });
}

/**
 * Parses the if statement production
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-if-statement)
 *
 * @param state Parser object
 * @param context Context masks
 * @param scope Scope instance
 */
export function parseIfStatement(state: ParserState, context: Context, scope: ScopeState): ESTree.IfStatement {
  const { startIndex } = state;
  next(state, context);
  expect(state, context | Context.AllowPossibleRegEx, Token.LeftParen);
  const test = parseExpression(state, (context | Context.DisallowInContext) ^ Context.DisallowInContext);
  expect(state, context, Token.RightParen);
  const consequent = parseConsequentOrAlternate(state, context, scope);
  const alternate = optional(state, context, Token.ElseKeyword)
    ? parseConsequentOrAlternate(state, context, scope)
    : null;
  return finishNode(state, context, startIndex, {
    type: 'IfStatement',
    test,
    consequent,
    alternate
  });
}

/**
 * Parse either consequent or alternate. Supports AnnexB.
 *
 * @param state Parser object
 * @param context Context masks
 * @param scope Scope instance
 */

function parseConsequentOrAlternate(state: ParserState, context: Context, scope: ScopeState): any {
  return context & Context.Strict || (context & Context.OptionsWebCompat) === 0 || state.token !== Token.FunctionKeyword
    ? parseStatement(state, (context | Context.TopLevel) ^ Context.TopLevel, scope, LabelledState.Disallow)
    : parseFunctionDeclaration(state, context, scope, Origin.Statement, false);
}

/**
 * Parses switch statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-SwitchStatement)
 *
 * @param state Parser object
 * @param context Context masks
 * @param scope Scope instance
 */
function parseSwitchStatement(state: ParserState, context: Context, scope: ScopeState): ESTree.SwitchStatement {
  const { startIndex: start } = state;
  next(state, context);
  expect(state, context | Context.AllowPossibleRegEx, Token.LeftParen);
  const discriminant = parseExpression(state, (context | Context.DisallowInContext) ^ Context.DisallowInContext);
  expect(state, context, Token.RightParen);
  expect(state, context, Token.LeftBrace);
  const cases: ESTree.SwitchCase[] = [];
  let seenDefault = false;
  const switchScope = createSubScope(scope, ScopeType.SwitchStatement);
  const previousSwitchStatement = state.switchStatement;
  state.switchStatement = LabelState.Iteration;
  while (state.token !== Token.RightBrace) {
    let test: ESTree.Expression | null = null;
    const { startIndex: subStart } = state;
    if (optional(state, context, Token.CaseKeyword)) {
      test = parseExpression(state, (context | Context.DisallowInContext) ^ Context.DisallowInContext);
    } else {
      expect(state, context, Token.DefaultKeyword);
      if (seenDefault) report(state, Errors.DupDefault);
      seenDefault = true;
    }
    cases.push(parseCaseOrDefaultClauses(state, context, test, switchScope, subStart));
  }
  state.switchStatement = previousSwitchStatement;
  expect(state, context, Token.RightBrace);
  return finishNode(state, context, start, {
    type: 'SwitchStatement',
    discriminant,
    cases
  });
}

/**
 * Parses return statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ReturnStatement)
 *
 * @param state Parser object
 * @param context Context masks
 */
export function parseReturnStatement(state: ParserState, context: Context): ESTree.ReturnStatement {
  if ((context & (Context.OptionsGlobalReturn | Context.AllowReturn)) < 1) report(state, Errors.IllegalReturn);
  const { startIndex } = state;
  next(state, context | Context.AllowPossibleRegEx);
  const argument =
    (state.token & Token.ASI) < 1 && (state.flags & Flags.NewLine) < 1
      ? parseExpression(
          state,
          (context | Context.DisallowInContext) ^ (Context.DisallowInContext | Context.AllowReturn)
        )
      : null;
  consumeSemicolon(state, context);
  return finishNode(state, context, startIndex, {
    type: 'ReturnStatement',
    argument
  });
}

/**
 * Parses while statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-grammar-notation-WhileStatement)
 *
 * @param state Parser object
 * @param context Context masks
 * @param scope Scope instance
 */
export function parseWhileStatement(state: ParserState, context: Context, scope: ScopeState): ESTree.WhileStatement {
  const { startIndex } = state;
  next(state, context);
  expect(state, context | Context.AllowPossibleRegEx, Token.LeftParen);
  const test = parseExpression(state, (context | Context.DisallowInContext) ^ Context.DisallowInContext);
  expect(state, context, Token.RightParen);
  const previousIterationStatement = state.iterationStatement;
  state.iterationStatement = LabelState.Iteration;
  const body = parseStatement(state, (context | Context.TopLevel) ^ Context.TopLevel, scope, LabelledState.Disallow);
  state.iterationStatement = previousIterationStatement;
  return finishNode(state, context, startIndex, {
    type: 'WhileStatement',
    test,
    body
  });
}

/**
 * Parses the continue statement production
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ContinueStatement)
 *
 * @param state  Parser object
 * @param context Context masks
 */
export function parseContinueStatement(state: ParserState, context: Context): ESTree.ContinueStatement {
  const { startIndex } = state;
  next(state, context);
  let label: ESTree.Identifier | undefined | null = null;
  if (!(state.flags & Flags.NewLine) && state.token & Token.Keyword) {
    const tokenValue = state.tokenValue;
    label = parseIdentifier(state, context);
    validateContinueLabel(state, tokenValue);
  }
  consumeSemicolon(state, context);
  if (label === null && state.iterationStatement === LabelState.Empty && state.switchStatement === LabelState.Empty) {
    report(state, Errors.IllegalContinue);
  }
  return finishNode(state, context, startIndex, {
    type: 'ContinueStatement',
    label
  });
}

/**
 * Parses the break statement production
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-BreakStatement)
 *
 * @param state  Parser object
 * @param context Context masks
 */
export function parseBreakStatement(state: ParserState, context: Context): ESTree.BreakStatement {
  const { startIndex } = state;
  next(state, context);
  let label = null;
  if (!(state.flags & Flags.NewLine) && state.token & Token.Keyword) {
    const tokenValue = state.tokenValue;
    label = parseIdentifier(state, context);
    validateBreakStatement(state, tokenValue);
  } else if (state.iterationStatement === LabelState.Empty && state.switchStatement === LabelState.Empty) {
    report(state, Errors.IllegalBreak);
  }
  consumeSemicolon(state, context);
  return finishNode(state, context, startIndex, {
    type: 'BreakStatement',
    label
  });
}

/**
 * Parses with statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-WithStatement)
 *
 * @param state Parser object
 * @param context Context masks
 * @param scope Scope instance
 */
export function parseWithStatement(state: ParserState, context: Context, scope: ScopeState): ESTree.WithStatement {
  const { startIndex } = state;
  if (context & Context.Strict) report(state, Errors.StrictModeWith);
  next(state, context);
  expect(state, context | Context.AllowPossibleRegEx, Token.LeftParen);
  const object = parseExpression(state, (context | Context.DisallowInContext) ^ Context.DisallowInContext);
  expect(state, context, Token.RightParen);
  const body = parseStatement(state, (context | Context.TopLevel) ^ Context.TopLevel, scope, LabelledState.Disallow);
  return finishNode(state, context, startIndex, {
    type: 'WithStatement',
    object,
    body
  });
}

/**
 * Parses the debugger statement production
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-DebuggerStatement)
 *
 * @param state  Parser object
 * @param context Context masks
 */
export function parseDebuggerStatement(state: ParserState, context: Context): ESTree.DebuggerStatement {
  const { startIndex } = state;
  next(state, context);
  consumeSemicolon(state, context);
  return finishNode(state, context, startIndex, {
    type: 'DebuggerStatement'
  });
}

/**
 * Parses try statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-TryStatement)
 *
 * @param state Parser object
 * @param context Context masks
 * @param scope Scope instance
 */
export function parseTryStatement(state: ParserState, context: Context, scope: ScopeState): ESTree.TryStatement {
  const { startIndex } = state;
  next(state, context);

  const block = parseBlockStatement(state, context, createSubScope(scope, ScopeType.BlockStatement));

  const handler = optional(state, context, Token.CatchKeyword) ? parseCatchBlock(state, context, scope) : null;

  const finalizer = optional(state, context, Token.FinallyKeyword)
    ? parseBlockStatement(
        state,
        (context | Context.TopLevel) ^ Context.TopLevel,
        createSubScope(scope, ScopeType.BlockStatement)
      )
    : null;
  if (!handler && !finalizer) report(state, Errors.NoCatchOrFinally);
  return finishNode(state, context, startIndex, {
    type: 'TryStatement',
    block,
    handler,
    finalizer
  });
}

/**
 * Parses catch block
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-Catch)
 *
 * @param state Parser object
 * @param context Context masks
 * @param scope Scope instance
 */
export function parseCatchBlock(state: ParserState, context: Context, scope: ScopeState): ESTree.CatchClause {
  // TryStatement ::
  //   'try' Block Catch
  //   'try' Block Finally
  //   'try' Block Catch Finally
  //
  // Catch ::
  //   'catch' '(' Identifier ')' Block
  //
  // Finally ::
  //   'finally' Block

  let param: any = null;
  let secondScope: ScopeState = scope;
  const { startIndex } = state;
  if (optional(state, context, Token.LeftParen)) {
    const catchScope = createSubScope(scope, ScopeType.CatchClause);
    param = parseBindingIdentifierOrPattern(state, context, catchScope, Type.ArgList, Origin.CatchClause, false);
    if (checkIfExistInLexicalBindings(state, context, catchScope, Origin.None, true))
      report(state, Errors.InvalidDuplicateBinding, state.tokenValue);
    expect(state, context, Token.RightParen);
    secondScope = createSubScope(catchScope, ScopeType.BlockStatement);
  }

  const body = parseBlockStatement(state, context, secondScope);

  return finishNode(state, context, startIndex, {
    type: 'CatchClause',
    param,
    body
  });
}
/**
 * Parses do while statement
 *
 * @param state Parser object
 * @param context Context masks
 * @param scope Scope instance
 */
export function parseDoWhileStatement(state: ParserState, context: Context, scope: ScopeState): any {
  const { startIndex } = state;
  expect(state, context, Token.DoKeyword);
  const previousIterationStatement = state.iterationStatement;
  state.iterationStatement = LabelState.Iteration;
  const body = parseStatement(state, (context | Context.TopLevel) ^ Context.TopLevel, scope, LabelledState.Disallow);
  state.iterationStatement = previousIterationStatement;
  expect(state, context, Token.WhileKeyword);
  expect(state, context, Token.LeftParen);
  const test = parseExpression(state, (context | Context.DisallowInContext) ^ Context.DisallowInContext);
  expect(state, context, Token.RightParen);
  optional(state, context, Token.Semicolon);
  return finishNode(state, context, startIndex, {
    type: 'DoWhileStatement',
    body,
    test
  });
}

/**
 * Parses either default clause or case clauses
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-CaseClauses)
 * @see [Link](https://tc39.github.io/ecma262/#prod-DefaultClause)
 *
 * @param state Parser object
 * @param context Context masks
 * @param scope Scope instance
 */
export function parseCaseOrDefaultClauses(
  state: ParserState,
  context: Context,
  test: ESTree.Expression | null,
  scope: ScopeState,
  start: number
): ESTree.SwitchCase {
  expect(state, context, Token.Colon);
  const consequent: ESTree.Statement[] = [];
  while (
    state.token !== Token.CaseKeyword &&
    state.token !== Token.RightBrace &&
    state.token !== Token.DefaultKeyword
  ) {
    consequent.push(parseStatementListItem(state, (context | Context.TopLevel) ^ Context.TopLevel, scope));
  }
  return finishNode(state, context, start, {
    type: 'SwitchCase',
    test,
    consequent
  });
}

/**
 * Parses either For, ForIn or ForOf statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-for-statement)
 * @see [Link](https://tc39.github.io/ecma262/#sec-for-in-and-for-of-statements)
 *
 * @param parser  Parser object
 * @param context Context masks
 */

function parseForStatement(
  state: ParserState,
  context: Context,
  scope: ScopeState
): ESTree.ForStatement | ESTree.ForInStatement | ESTree.ForOfStatement {
  const { startIndex } = state;
  next(state, context);

  const forAwait = context & Context.AwaitContext ? optional(state, context, Token.AwaitKeyword) : false;
  scope = createSubScope(scope, ScopeType.ForStatement);

  expect(state, context, Token.LeftParen);

  let init: any = null;
  let declarations: any = null;
  let test: ESTree.Expression | null = null;
  let update: ESTree.Expression | null = null;
  let sequencePos: any = null;
  let right;
  let isPattern = false;

  if (state.token !== Token.Semicolon) {
    if ((state.token & Token.IsVarDecl) > 0) {
      const kind = KeywordDescTable[state.token & Token.Type];
      const { startIndex: varStart } = state;
      if (optional(state, context, Token.VarKeyword)) {
        init = finishNode(state, context, varStart, {
          type: 'VariableDeclaration',
          kind,
          declarations: parseVariableDeclarationList(
            state,
            context | Context.DisallowInContext,
            Type.Variable,
            Origin.ForStatement,
            false,
            scope
          )
        } as any);
      } else if (state.token === Token.LetKeyword) {
        if (lookAheadOrScan(state, context, isLexical, false)) {
          init = finishNode(state, context, varStart, {
            type: 'VariableDeclaration',
            kind,
            declarations: parseVariableDeclarationList(state, context, Type.Let, Origin.ForStatement, true, scope)
          } as any);
        } else {
          isPattern = true;
          init = acquireGrammar(state, context | Context.DisallowInContext, 0, parseAssignmentExpression);
        }
      } else if (optional(state, context, Token.ConstKeyword)) {
        declarations = parseVariableDeclarationList(state, context, Type.Const, Origin.ForStatement, false, scope);
        if (checkIfExistInLexicalBindings(state, context, scope, Origin.None, true))
          report(state, Errors.InvalidDuplicateBinding, state.tokenValue);
        init = finishNode(state, context, varStart, {
          type: 'VariableDeclaration',
          kind,
          declarations
        } as any);
      }
    } else {
      sequencePos = state.startIndex;
      isPattern = state.token === Token.LeftBracket || state.token === Token.LeftBrace;
      init = acquireGrammar(state, context | Context.DisallowInContext, 0, parseAssignmentExpression);
    }
  }

  if (optional(state, context | Context.AllowPossibleRegEx, Token.OfKeyword)) {
    if (state.inCatch) report(state, Errors.InvalidVarForOfCatch);
    if (isPattern) {
      if (!state.assignable || init.type === 'AssignmentExpression') {
        report(state, Errors.InvalidLHSInForLoop);
      }
      reinterpret(state, init);
    }
    right = parseAssignmentExpression(state, (context | Context.DisallowInContext) ^ Context.DisallowInContext);
    expect(state, context, Token.RightParen);
    const previousIterationStatement = state.iterationStatement;
    state.iterationStatement = LabelState.Iteration;
    const body = parseStatement(state, (context | Context.TopLevel) ^ Context.TopLevel, scope, LabelledState.Disallow);
    state.iterationStatement = previousIterationStatement;
    return finishNode(state, context, startIndex, {
      type: 'ForOfStatement',
      body,
      left: init,
      right,
      await: forAwait
    });
  }
  if (forAwait) report(state, Errors.InvalidForAwait);
  if (optional(state, context, Token.InKeyword)) {
    if (isPattern) {
      if (!state.assignable || init.type === 'AssignmentExpression') {
        if (context & Context.OptionsWebCompat && (context & Context.Strict) === 0) {
          // TODO
        } else {
          report(state, Errors.InvalidLHSInForIn);
        }
      }
      reinterpret(state, init);
    }
    right = parseExpression(state, (context | Context.DisallowInContext) ^ Context.DisallowInContext);
    expect(state, context, Token.RightParen);
    const previousIterationStatement = state.iterationStatement;
    state.iterationStatement = LabelState.Iteration;
    const body = parseStatement(state, (context | Context.TopLevel) ^ Context.TopLevel, scope, LabelledState.Disallow);
    state.iterationStatement = previousIterationStatement;
    return finishNode(state, context, startIndex, {
      type: 'ForInStatement',
      body,
      left: init,
      right
    });
  }

  if (state.token === Token.Comma) {
    init = parseSequenceExpression(
      state,
      (context | Context.DisallowInContext) ^ Context.DisallowInContext,
      init,
      sequencePos
    );
  }

  expect(state, context, Token.Semicolon);

  if (state.token !== Token.Semicolon) test = parseExpression(state, context);

  expect(state, context, Token.Semicolon);

  if (state.token !== Token.RightParen)
    update = parseExpression(state, (context | Context.DisallowInContext) ^ Context.DisallowInContext);

  expect(state, context, Token.RightParen);

  const previousIterationStatement = state.iterationStatement;
  state.iterationStatement = LabelState.Iteration;
  const body = parseStatement(state, (context | Context.TopLevel) ^ Context.TopLevel, scope, LabelledState.Disallow);
  state.iterationStatement = previousIterationStatement;

  return finishNode(state, context, startIndex, {
    type: 'ForStatement',
    body,
    init,
    test,
    update
  });
}
/**
 * Parses either expression or labelled statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ExpressionStatement)
 * @see [Link](https://tc39.github.io/ecma262/#prod-LabelledStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseExpressionOrLabelledStatement(
  state: ParserState,
  context: Context,
  scope: ScopeState,
  label: LabelledState
): any {
  const { token, tokenValue, startIndex } = state;
  const expr: ESTree.Expression = parseExpression(
    state,
    (context | Context.DisallowInContext) ^ Context.DisallowInContext
  );
  if ((token & Token.Keyword || Token.EscapedStrictReserved) && state.token === Token.Colon) {
    next(state, context | Context.AllowPossibleRegEx);
    validateBindingIdentifier(state, context, Type.None, token);
    if (getLabel(state, `@${tokenValue}`, false, true)) {
      report(state, Errors.LabelRedeclaration, tokenValue);
    }
    addLabel(state, tokenValue);
    let body: any = null;
    if (
      (state.token as Token) === Token.FunctionKeyword &&
      (context & Context.Strict) === 0 &&
      context & Context.OptionsWebCompat &&
      label === LabelledState.AllowAsLabelled
    ) {
      body = parseFunctionDeclaration(state, context, scope, Origin.Statement, false);
    } else body = parseStatement(state, (context | Context.TopLevel) ^ Context.TopLevel, scope, label);
    state.labelDepth--;
    return finishNode(state, context, startIndex, {
      type: 'LabeledStatement',
      label: expr as ESTree.Identifier,
      body
    });
  }
  consumeSemicolon(state, context);
  return finishNode(state, context, startIndex, {
    type: 'ExpressionStatement',
    expression: expr
  });
}

/**
 * Parse directive node
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-directive-prologues-and-the-use-strict-directive)
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function parseDirective(state: ParserState, context: Context, scope: ScopeState): any {
  const { startIndex } = state;
  if ((context & Context.OptionsDirectives) < 1) return parseStatementListItem(state, context, scope);
  const directive = state.tokenRaw.slice(1, -1);
  const expression = parseExpression(state, context);
  consumeSemicolon(state, context);
  return finishNode(state, context, startIndex, {
    type: 'ExpressionStatement',
    expression,
    directive
  });
}

/**
 * Parses variable statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-VariableStatement)
 *
 * @param state Parser object
 * @param context Context masks
 * @param type Binding type
 * @param origin Binding origin
 * @param scope Scope instance
 */
export function parseVariableStatement(
  state: ParserState,
  context: Context,
  type: Type,
  origin: Origin,
  scope: ScopeState
): ESTree.VariableDeclaration {
  const { token, startIndex: start } = state;
  next(state, context);
  const declarations = parseVariableDeclarationList(state, context, type, origin, false, scope);
  consumeSemicolon(state, context);
  return finishNode(state, context, start, {
    type: 'VariableDeclaration',
    kind: KeywordDescTable[token & Token.Type],
    declarations
  } as any);
}
