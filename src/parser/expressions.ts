import { nextToken } from '../lexer/scan';
import { Context, ParserState, optional, expect } from '../common';
import { Token, KeywordDescTable } from '../token';
import * as ESTree from '../estree';
import { report, Errors } from '../errors';
import { scanTemplateTail } from '../lexer/template';
import { parseLabelledStatement } from './statements';

/**
 * Parse expression
 *
 * @param {ParserState} state
 * @param {Context} context
 * @param {boolean} isAssignable
 * @returns {*}
 */
export function parseExpression(state: ParserState, context: Context, isAssignable: boolean): ESTree.Expression {
  return parseAssignmentExpression(state, context, isAssignable, parseLeftHandSide(state, context));
}

/**
 * Parse sequence expression
 *
 * @param {ParserState} state
 * @param {Context} context
 * @param {ESTree.AssignmentExpression} expr
 * @returns {ESTree.SequenceExpression}
 */
export function parseSequenceExpression(
  state: ParserState,
  context: Context,
  expr: ESTree.AssignmentExpression
): ESTree.SequenceExpression {
  const expressions: ESTree.Expression[] = [expr];
  while (optional(state, context | Context.AllowRegExp, Token.Comma)) {
    expressions.push(parseExpression(state, context, true));
  }
  return {
    type: 'SequenceExpression',
    expressions
  };
}

/**
 * Parse assignment expression
 *
 * @param {ParserState} state
 * @param {Context} context
 * @param {(ESTree.LogicalExpression | ESTree.BinaryExpression | ESTree.Identifier | ESTree.ConditionalExpression)} left
 * @returns {(ESTree.AssignmentExpression | ESTree.Expression)}
 */
export function parseAssignmentExpression(
  state: ParserState,
  context: Context,
  left:
    | ESTree.AssignmentExpression
    | ESTree.LogicalExpression
    | ESTree.BinaryExpression
    | ESTree.Identifier
    | ESTree.ConditionalExpression
): ESTree.AssignmentExpression | ESTree.Expression {
  const { assignable } = state;

  /** AssignmentExpression
   *
   * https://tc39.github.io/ecma262/#prod-AssignmentExpression
   *
   * AssignmentExpression ::
   *   ConditionalExpression
   *   ArrowFunction
   *   YieldExpression
   *   LeftHandSideExpression AssignmentOperator AssignmentExpression
   */
  if (state.assignable & AssignmentState.Assignable && (state.token & Token.IsAssignOp) > 0) {
    const operator = state.token;
    if (state.token === Token.Assign) {
      if ((left.type as string) === 'ArrayExpression' || (left.type as string) === 'ObjectExpression') {
        reinterpretToPattern(state, left);
      }
    }
    nextToken(state, context | Context.AllowRegExp);
    state.assignable = AssignmentState.Assignable;

    left = {
      type: 'AssignmentExpression',
      left,
      operator: KeywordDescTable[operator & Token.Type] as ESTree.AssignmentOperator,
      right: parseExpression(state, context)
    };

    // Resets destructibility
    state.assignable =
      ((state.assignable | DestructuringState.NotDestructible | DestructuringState.Assignable) ^ (DestructuringState.NotDestructible | DestructuringState.Assignable)) |
      ((assignable | AssignmentState.NotAssignable | AssignmentState.Assignable) ^
        (AssignmentState.NotAssignable | AssignmentState.Assignable));

    return left;
  }

 /** BinaryExpression
   *
   * https://tc39.github.io/ecma262/#sec-multiplicative-operators
   *
   */
  if ((state.token & Token.IsBinaryOp) > 0) {
    // We start using the binary expression parser for prec >= 4 only!
    left = parseBinaryExpression(state, context, 4, left);
    state.assignable =
      (state.assignable | assignable | AssignmentState.Assignable | AssignmentState.NotAssignable) ^ AssignmentState.Assignable;
  }

  /**
   * ConditionalExpression
   * https://tc39.github.io/ecma262/#prod-ConditionalExpression
   *
   */
  if (optional(state, context, Token.QuestionMark)) {
    left = parseConditionalExpression(state, context, left);
    state.assignable =
      (state.assignable | assignable | AssignmentState.Assignable | AssignmentState.NotAssignable) ^ AssignmentState.Assignable;
  }

  return left;
}
/**
 * Parse conditional expression
 *
 * @param {ParserState} state
 * @param {Context} context
 * @param {ESTree.Expression} test
 * @returns {ESTree.ConditionalExpression}
 */
export function parseConditionalExpression(
  state: ParserState,
  context: Context,
  test: ESTree.Expression
): ESTree.ConditionalExpression {
  const consequent: ESTree.Expression = parseExpression(state, context);
  expect(state, context, Token.Colon);
  const alternate: ESTree.Expression = parseExpression(state, context);
  return {
    type: 'ConditionalExpression',
    test,
    consequent,
    alternate
  };
}

/**
 * Parse binary expression
 *
 * @param {ParserState} state
 * @param {Context} context
 * @param {number} minPrec
 * @param {(ESTree.BinaryExpression | ESTree.LogicalExpression | ESTree.Identifier | ESTree.ConditionalExpression)} left
 * @returns {(ESTree.LogicalExpression | ESTree.BinaryExpression | ESTree.Identifier | ESTree.ConditionalExpression)}
 */
export function parseBinaryExpression(
  state: ParserState,
  context: Context,
  minPrec: number,
  left:
    | ESTree.AssignmentExpression
    | ESTree.BinaryExpression
    | ESTree.LogicalExpression
    | ESTree.Identifier
    | ESTree.ConditionalExpression
):
  | ESTree.AssignmentExpression
  | ESTree.LogicalExpression
  | ESTree.BinaryExpression
  | ESTree.Identifier
  | ESTree.ConditionalExpression {
  const bit = -((context & Context.DisallowInContext) > 0) & Token.InKeyword;
  let t: Token;
  let prec: number;
  let assignable = AssignmentState.NotAssignable;
  while ((state.token & Token.IsBinaryOp) > 0) {
    t = state.token;
    prec = t & Token.Precedence;
    if (prec + (((t === Token.Exponentiate) as any) << 8) - (((bit === t) as any) << 12) <= minPrec) break;
    nextToken(state, context | Context.AllowRegExp);
    // Note: The 'assignable' state will change during the 'expression' parsing, so this is just to
    // prevent any assignability on RHS
    state.assignable = AssignmentState.NotAssignable;
    left = {
      type: t & Token.IsLogical ? 'LogicalExpression' : 'BinaryExpression',
      left,
      right: parseBinaryExpression(
        state,
        context,
        prec,
        parseLeftHandSide(state, context | Context.DisallowAssignment)
      ),
      operator: KeywordDescTable[t & Token.Type] as ESTree.LogicalOperator
    } as ESTree.BinaryExpression | ESTree.LogicalExpression;
    assignable =
      state.assignable |
      ((assignable | AssignmentState.NotAssignable | AssignmentState.Assignable) ^
        (AssignmentState.NotAssignable | AssignmentState.Assignable));
  }

  // Set the updated assignable state
  state.assignable = assignable;

  return left;
}

/**
 * Parse yield expression or 'yield' identifier
 *
 * @param {ParserState} state
 * @param {Context} context
 * @returns {(ESTree.Identifier | ESTree.YieldExpression)}
 */
export function parseYieldExpressionOrIdentifier(
  state: ParserState,
  context: Context
): ESTree.Identifier | ESTree.YieldExpression {
  // Yield as identifier
  if ((context & Context.InYieldContext) < 1) {
    if (context & Context.Strict) report(state, Errors.Unexpected);
    state.assignable = AssignmentState.Assignable;
    return parseIdentifier(state, context);
  }

  // YieldExpression ::
  //   'yield' ([no line terminator] '*'? AssignmentExpression)?
  nextToken(state, context | Context.AllowRegExp);
  if (context & Context.InArgList) report(state, Errors.YieldInParameter);
  state.flags |= Flags.SeenYield;
  let argument: ESTree.Expression | null = null;
  let delegate = false; // yield*
  if ((state.flags & Flags.PrecedingLineBreak) < 1) {
    delegate = consumeOpt(state, context, Token.Multiply);
    // 'Token.IsExpressionStart' contains the complete set of tokens that can appear
    // after an AssignmentExpression, and none of them can start an
    // AssignmentExpression.
    if (state.token & Token.IsExpressionStart || delegate) {
      argument = parseExpression(state, context, true);
    }
  }
  state.assignable = AssignmentState.NotAssignable;

  return {
    type: 'YieldExpression',
    argument,
    delegate
  };
}

/**
 * Parse await expression
 *
 * @param {ParserState} state
 * @param {Context} context
 * @returns {(ESTree.ArrowFunctionExpression | ESTree.LabeledStatement | ESTree.AssignmentExpression)}
 */
/**
 * Parse await expression
 *
 * @param {ParserState} state
 * @param {Context} context
 * @returns {(ESTree.ArrowFunctionExpression | ESTree.LabeledStatement | ESTree.AssignmentExpression)}
 */
export function parseAwaitExpression(
  state: ParserState,
  context: Context,
  isNew: boolean
): ESTree.Identifier | ESTree.ArrowFunctionExpression {
  let expr = parseIdentifier(state, context);
  if (context & Context.InAwaitContext) {
    if (isNew) report(state, Errors.AwaitInParameter);
    // For correct error location, we must subtract 5 (the length of await keyword) and add 2 for space.
    // So we end up with 7, and this formula (state.index - 7) for correct column position.
    if (context & Context.InArgList) reportAt(state, state.index, state.line, state.index - 7, Errors.AwaitInParameter);
    state.assignable = false;
    const argument = parseMemberExpression(
      state,
      context,
      parsePrimaryExpressionExtended(state, context, false),
      false
    );
    return {
      type: 'AwaitExpression',
      argument
    } as any;
  }
  state.assignable = true;
  if (state.token === Token.Arrow) {
    // '[await][no LineTerminator here]=>ConciseBody[?In]'
    // '[await][no LineTerminator here]=>{FunctionBody[~Yield, ~Await]}'
    if (state.flags & Flags.PrecedingLineBreak) report;
    if (!state.assignable) report;
    if (context & (Context.InYieldContext | Context.InAwaitContext) && state.token === Token.YieldKeyword) report;
    return parseNonParenthesizedArrow(state, context, expr);
  }

  return parseMemberExpression(state, context, expr, false);
}

/**
 * Parses prefixed unary expression
 *
 * @param {ParserState} state
 * @param {Context} context
 * @returns {ESTree.UnaryExpression}
 */
export function parsePrefixUnaryExpression(state: ParserState, context: Context): ESTree.UnaryExpression {
  const unaryOperator = state.token;
  nextToken(state, context | Context.AllowRegExp);
  return {
    type: 'UnaryExpression',
    operator: KeywordDescTable[unaryOperator & Token.Type] as 'typeof' | 'delete',
    argument: parseLeftHandSide(state, context),
    prefix: true
  };
}

/**
 * Parses non-parenthesized arrow function
 *
 * @param {ParserState} state
 * @param {Context} context
 * @param {ESTree.Identifier} expr
 * @returns {ESTree.ArrowFunctionExpression}
 */
export function parseNonParenthesizedArrow(
  state: ParserState,
  context: Context,
  expr: ESTree.Identifier
): ESTree.ArrowFunctionExpression {
  expect(state, context, Token.Arrow);
  return {
    type: 'ArrowFunctionExpression',
    body: parseFunctionBody(state, context),
    params: [expr],
    id: null,
    async: false,
    generator: false,
    expression: false
  };
}

/**
 * Parses function body
 *
 * @param {ParserState} state
 * @param {Context} context
 * @returns {ESTree.BlockStatement}
 */
export function parseFunctionBody(state: ParserState, context: Context): ESTree.BlockStatement {
  expect(state, context, Token.LeftBrace);
  expect(state, context, Token.RightBrace);
  return {
    type: 'BlockStatement',
    body: []
  };
}

/**
 * Parses left hand side
 *
 * @param {ParserState} state
 * @param {Context} context
 * @returns {*}
 */
function parseLeftHandSide(state: ParserState, context: Context): any {
  return parseMemberExpression(state, context, parsePrimaryExpression(state, context));
}

/**
 * Parses member expression
 *
 * @param {ParserState} state
 * @param {Context} context
 * @param {ESTree.Expression} expr
 * @returns {*}
 */
export function parseMemberExpression(state: ParserState, context: Context, expr: ESTree.Expression): any {
  if (state.token === Token.Period) {
    nextToken(state, context);
    expr = parseMemberExpression(state, context, {
      type: 'MemberExpression',
      object: expr,
      computed: false,
      property: parseIdentifier(state, context)
    });
    return expr;
  } else if (optional(state, context, Token.LeftBracket)) {
    expr = {
      type: 'MemberExpression',
      object: expr,
      computed: true,
      property: parseExpression(state, context, true)
    };
    expect(state, context, Token.RightBracket);
    return parseMemberExpression(state, context, expr);
  } else if (state.token === Token.LeftParen) {
    return parseMemberExpression(state, context, {
      type: 'CallExpression',
      callee: expr,
      arguments: parseArguments(state, context)
    });
  } else if (state.token === Token.TemplateTail) {
    return parseMemberExpression(state, context, {
      type: 'TaggedTemplateExpression',
      tag: expr,
      quasi: parseTemplateLiteral(state, context)
    } as any);
  } else if (state.token === Token.TemplateContinuation) {
    return parseMemberExpression(state, context, {
      type: 'TaggedTemplateExpression',
      tag: expr,
      quasi: parseTemplate(state, context)
    });
  }

  return expr;
}

/**
 * Parses primary expression
 *
 * @param {ParserState} state
 * @param {Context} context
 * @returns {*}
 */
export function parsePrimaryExpression(state: ParserState, context: Context): any {
  return parseIdentifier(state, context);
}

/**
 * Parses template literal
 *
 * @param {ParserState} state
 * @param {Context} context
 * @returns
 */
export function parseTemplateLiteral(state: ParserState, context: Context) {
  return {
    type: 'TemplateLiteral',
    expressions: [],
    quasis: [parseTemplateTail(state, context)]
  };
}

/**
 * Parses template tail
 *
 * @param {ParserState} state
 * @param {Context} context
 * @returns {ESTree.TemplateElement}
 */
export function parseTemplateTail(state: ParserState, context: Context): ESTree.TemplateElement {
  const { tokenValue, tokenRaw } = state;
  expect(state, context, Token.TemplateTail);
  return {
    type: 'TemplateElement',
    value: {
      cooked: tokenValue,
      raw: tokenRaw
    },
    tail: true
  };
}

/**
 * Parses template
 *
 * @param {ParserState} state
 * @param {Context} context
 * @returns {*}
 */
export function parseTemplate(state: ParserState, context: Context): any {
  const quasis = [parseTemplateSpans(state, false)];
  expect(state, context, Token.TemplateContinuation);
  const expressions = [parseExpression(state, context, true)];
  while ((state.token = scanTemplateTail(state, context)) !== Token.TemplateTail) {
    quasis.push(parseTemplateSpans(state, /* tail */ false));
    expect(state, context, Token.TemplateContinuation);
    expressions.push(parseExpression(state, context, true));
  }
  quasis.push(parseTemplateSpans(state, /* tail */ true));

  nextToken(state, context);

  return {
    type: 'TemplateLiteral',
    expressions,
    quasis
  };
}

/**
 * Parses template spans
 *
 * @param {ParserState} state
 * @param {boolean} tail
 * @returns {ESTree.TemplateElement}
 */
export function parseTemplateSpans(state: ParserState, tail: boolean): ESTree.TemplateElement {
  return {
    type: 'TemplateElement',
    value: {
      cooked: state.tokenValue,
      raw: state.tokenRaw
    },
    tail
  };
}

/**
 * Parses arguments
 *
 * @param {ParserState} state
 * @param {Context} context
 * @returns {*}
 */
export function parseArguments(state: ParserState, context: Context): any {
  expect(state, context, Token.LeftParen);
  const args: any[] = [];
  while (state.token !== Token.RightParen) {
    args.push(parseExpression(state, context, true));
    if (state.token === Token.RightParen) {
      break;
    }
    expect(state, context, Token.Comma);
    if (state.token === Token.RightParen) {
      break;
    }
  }
  expect(state, context, Token.RightParen);
  return args;
}

/**
 * Parses identifier
 *
 * @param {ParserState} state
 * @param {Context} context
 * @returns {ESTree.Identifier}
 */
export function parseIdentifier(state: ParserState, context: Context): ESTree.Identifier {
  const { tokenValue } = state;
  nextToken(state, context);
  return {
    type: 'Identifier',
    name: tokenValue
  };
}

/**
 * Parses literal
 *
 * @param {ParserState} state
 * @param {Context} context
 * @returns {ESTree.Literal}
 */
export function parseNullOrTrueOrFalseLiteral(state: ParserState, context: Context): ESTree.Literal {
  const value = state.token === Token.NullKeyword ? null : KeywordDescTable[state.token & Token.Type] === 'true';
  nextToken(state, context);
  return {
    type: 'Literal',
    value
  };
}

/**
 * Parses this expression
 *
 * @param {ParserState} state
 * @param {Context} context
 * @returns {ESTree.ThisExpression}
 */
export function parseThisExpression(state: ParserState, context: Context): ESTree.ThisExpression {
  nextToken(state, context);
  return {
    type: 'ThisExpression'
  };
}

/**
 * Parses new or new target expression
 *
 * @param {ParserState} state
 * @param {Context} context
 * @returns {(ESTree.Expression | ESTree.MetaProperty)}
 */
export function parseNewExpression(state: ParserState, context: Context): ESTree.Expression | ESTree.MetaProperty {
  const id = parseIdentifier(state, context | Context.AllowRegExp);
  if (consumeOpt(state, context, Token.Period)) {
    if ((context & Context.AllowNewTarget) < 1 || state.tokenValue !== 'target') report(state, Errors.Unexpected);
    parseMetaProperty(state, context, id);
  }
  return parseAssignmentExpression(
    state,
    context,
    parseMemberExpression(
      state,
      context,
      parsePrimaryExpressionExtended(state, context, false, /* isNew*/ true),
      /* isNew*/ true
    )
  );
}

/**
 * Parses member or update expression
 *
 * @param {ParserState} state
 * @param {Context} context
 * @param {ESTree.Expression} expr
 * @returns {*}
 */
export function parseMemberOrUpdateExpression(
  state: ParserState,
  context: Context,
  expr: ESTree.Expression,
  isNew: boolean
): any {
  /** parseUpdateExpression
   *
   * https://tc39.github.io/ecma262/#prod-asi-rules-UpdateExpression
   *
   *  UpdateExpression ::
   *   ('++' | '--')? LeftHandSideExpression
   *
   */

  if ((state.token & Token.IsUpdateOp) === Token.IsUpdateOp) {
    return parseUpdateExpression(state, context, expr);
  }

  /** MemberExpression ::
   *   1. PrimaryExpression
   *   2. MemberExpression [ AssignmentExpression ]
   *   3. MemberExpression . IdentifierName
   *   4. MemberExpression TemplateLiteral
   *   5. MemberExpression [ NewExpression ]
   */
  const { assignable } = state;

  switch (state.token) {
    case Token.Period: {
      /* Property */
      nextToken(state, context);
      state.assignable = AssignmentState.Assignable;
      return parseMemberOrUpdateExpression(
        state,
        context,
        {
          type: 'MemberExpression',
          object: expr,
          computed: false,
          property: parseIdentifier(state, context)
        },
        isNew
      );
    }
    case Token.LeftBracket: {
      nextToken(state, context);
      const property = parseExpressions(state, context);
      state.assignable =
        state.assignable |
        ((assignable | AssignmentState.NotAssignable | AssignmentState.Assignable) ^
          (AssignmentState.NotAssignable | AssignmentState.Assignable));

      expr = {
        type: 'MemberExpression',
        object: expr,
        computed: true,
        property
      };
      consume(state, context, Token.RightBracket);
      // Note: The 'assignable' state may have changed during the 'expression' parsing
      state.assignable = AssignmentState.Assignable;
      return parseMemberOrUpdateExpression(state, context, expr, isNew);
    }
    case Token.LeftParen: {
      const args = parseArguments(state, context);
      state.assignable =
        (state.assignable |
          ((assignable | AssignmentState.NotAssignable | AssignmentState.Assignable) ^
            (AssignmentState.NotAssignable | AssignmentState.Assignable)) |
          AssignmentState.Assignable |
          AssignmentState.NotAssignable) ^
        AssignmentState.Assignable;
      if (isNew) {
        /* New expression with arguments */
        return parseMemberOrUpdateExpression(
          state,
          context,
          {
            type: 'NewExpression',
            callee: expr,
            arguments: args
          },
          false
        );
      } else {
        /* Call expression  */
        return parseMemberOrUpdateExpression(
          state,
          context,
          {
            type: 'CallExpression',
            callee: expr,
            arguments: args
          },
          isNew
        );
      }
    }
    case Token.TemplateTail: {
      nextToken(state, context);
      return parseMemberOrUpdateExpression(
        state,
        context,
        {
          type: 'TaggedTemplateExpression',
          tag: expr,
          quasi: parseTemplateLiteral(state, context)
        } as ESTree.TaggedTemplateExpression,
        isNew
      );
    }
    case Token.TemplateContinuation: {
      return parseMemberOrUpdateExpression(
        state,
        context,
        {
          type: 'TaggedTemplateExpression',
          tag: expr,
          quasi: parseTemplate(state, context)
        },
        isNew
      );
    }
    default:
      // New expression without arguments.
      if (isNew) {
        state.assignable = AssignmentState.NotAssignable;
        return {
          type: 'NewExpression',
          callee: expr,
          arguments: []
        };
      }
      return expr;
  }
}
