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
 * @param {boolean} isAssignable
 * @param {(ESTree.LogicalExpression | ESTree.BinaryExpression | ESTree.Identifier | ESTree.ConditionalExpression)} left
 * @returns {(ESTree.AssignmentExpression | ESTree.Expression)}
 */
export function parseAssignmentExpression(
  state: ParserState,
  context: Context,
  isAssignable: boolean,
  left: ESTree.LogicalExpression | ESTree.BinaryExpression | ESTree.Identifier | ESTree.ConditionalExpression
): ESTree.AssignmentExpression | ESTree.Expression {
  if ((state.token & Token.IsAssignOp) === Token.IsAssignOp) {
    if (!isAssignable) report(state, Errors.InvalidLHS);
    const operator = state.token;
    nextToken(state, context);
    return {
      type: 'AssignmentExpression',
      left,
      operator: KeywordDescTable[operator & Token.Type] as ESTree.AssignmentOperator,
      right: parseExpression(state, context, /* isAssignable */ true)
    };
  }

  if (state.token & Token.IsBinaryOp) {
    left = parseBinaryExpression(state, context, 0, left);
    if (state.token === Token.Assign) report(state, Errors.InvalidLHS);
  }

  if (optional(state, context, Token.QuestionMark)) {
    left = parseConditionalExpression(state, context, left);
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
  const consequent: ESTree.Expression = parseExpression(state, context, /* isAssignable */ true);
  expect(state, context, Token.Colon);
  const alternate: ESTree.Expression = parseExpression(state, context, /* isAssignable */ true);
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
  left: ESTree.BinaryExpression | ESTree.LogicalExpression | ESTree.Identifier | ESTree.ConditionalExpression
): ESTree.LogicalExpression | ESTree.BinaryExpression | ESTree.Identifier | ESTree.ConditionalExpression {
  const bit = -((context & Context.DisallowInContext) > 0) & Token.InKeyword;
  while ((state.token & Token.IsBinaryOp) > 0) {
    const opToken = state.token;
    const prec = opToken & Token.Precedence;
    if (prec + (((opToken === Token.Exponentiate) as any) << 8) - (((bit === opToken) as any) << 12) <= minPrec) break;
    nextToken(state, context | Context.AllowRegExp);
    left = {
      type: opToken & Token.IsLogical ? 'LogicalExpression' : 'BinaryExpression',
      left,
      right: parseBinaryExpression(state, context, prec, parseLeftHandSide(state, context)),
      operator: KeywordDescTable[opToken & Token.Type] as ESTree.LogicalOperator
    } as ESTree.BinaryExpression | ESTree.LogicalExpression;
  }

  return left;
}

/**
 * Parse yield expression
 *
 * @param {ParserState} state
 * @param {Context} context
 * @returns {(ESTree.ArrowFunctionExpression | ESTree.LabeledStatement | ESTree.AssignmentExpression)}
 */
export function parseYieldExpression(
  state: ParserState,
  context: Context
): ESTree.ArrowFunctionExpression | ESTree.LabeledStatement | ESTree.AssignmentExpression {
  let expr = parseIdentifier(state, context);
  return state.token === Token.Arrow
    ? parseNonParenthesizedArrow(state, context, expr)
    : optional(state, context, Token.Colon)
    ? parseLabelledStatement(state, context, expr)
    : parseAssignmentExpression(state, context, true, parseMemberExpression(state, context, expr));
}

/**
 * Parse await expression
 *
 * @param {ParserState} state
 * @param {Context} context
 * @returns {(ESTree.ArrowFunctionExpression | ESTree.LabeledStatement | ESTree.AssignmentExpression)}
 */
export function parseAwaitExpression(
  state: ParserState,
  context: Context
): ESTree.ArrowFunctionExpression | ESTree.LabeledStatement | ESTree.AssignmentExpression {
  let expr = parseIdentifier(state, context);
  return state.token === Token.Arrow
    ? parseNonParenthesizedArrow(state, context, expr)
    : optional(state, context, Token.Colon)
    ? parseLabelledStatement(state, context, expr)
    : parseAssignmentExpression(state, context, true, parseMemberExpression(state, context, expr));
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
