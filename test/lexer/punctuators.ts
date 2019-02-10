import * as t from 'assert';
import { Context } from '../../src/common';
import { Token } from '../../src/token';
import { create } from '../../src/state';
import { nextToken } from '../../src/lexer/scan';

describe('src/scanner/seek', () => {
  const tokens: Array<[Context, Token, string]> = [
    [Context.None, Token.StrictNotEqual, '!=='],
    [Context.None, Token.LooseNotEqual, '!='],
    [Context.None, Token.Arrow, '=>'],
    [Context.None, Token.Assign, '='],
    [Context.None, Token.StrictEqual, '==='],
    [Context.None, Token.LooseEqual, '=='],
    [Context.None, Token.AddAssign, '+='],
    [Context.None, Token.ExponentiateAssign, '**='],
    [Context.None, Token.MultiplyAssign, '*='],
    [Context.None, Token.Exponentiate, '**'],
    [Context.None, Token.DivideAssign, '/='],
    [Context.None, Token.ModuloAssign, '%='],
    [Context.None, Token.LeftParen, '('],
    [Context.None, Token.LeftBrace, '{'],
    [Context.None, Token.Period, '.'],
    [Context.None, Token.JSXAutoClose, '/>'],
    //[Context.OptionsJSX, Token.JSXClose, '</'],
    [Context.None, Token.Divide, '/'],
    [Context.None, Token.Ellipsis, '...'],
    [Context.None, Token.RightBrace, '}'],
    [Context.None, Token.RightParen, ')'],
    [Context.None, Token.Semicolon, ';'],
    [Context.None, Token.Comma, ','],
    [Context.None, Token.LeftBracket, '['],
    [Context.None, Token.RightBracket, ']'],
    [Context.None, Token.Colon, ':'],
    [Context.None, Token.QuestionMark, '?'],
    [Context.None, Token.Increment, '++'],
    [Context.None, Token.Decrement, '--'],
    [Context.None, Token.SubtractAssign, '-='],
    [Context.None, Token.BitwiseOrAssign, '|='],
    [Context.None, Token.Negate, '!'],
    [Context.None, Token.Complement, '~'],
    [Context.None, Token.Add, '+'],
    [Context.None, Token.Subtract, '-'],
    [Context.None, Token.Multiply, '*'],
    [Context.None, Token.Modulo, '%'],
    [Context.None, Token.LogicalOr, '||'],
    [Context.None, Token.LessThanOrEqual, '<='],
    [Context.None, Token.BitwiseOr, '|'],
    [Context.None, Token.BitwiseAndAssign, '&='],
    [Context.None, Token.LogicalAnd, '&&'],
    [Context.None, Token.BitwiseAnd, '&'],
    [Context.None, Token.GreaterThanOrEqual, '>='],
    [Context.None, Token.ShiftRightAssign, '>>='],
    [Context.None, Token.LogicalShiftRightAssign, '>>>='],
    [Context.None, Token.GreaterThan, '>'],
    [Context.None, Token.ShiftRight, '>>'],
    [Context.None, Token.LogicalShiftRight, '>>>'],
    [Context.None, Token.LessThanOrEqual, '<='],
    [Context.None, Token.ShiftLeftAssign, '<<='],
    [Context.None, Token.LessThan, '<'],
    [Context.None, Token.ShiftLeft, '<<'],
    [Context.None, Token.BitwiseXorAssign, '^='],
    [Context.None, Token.BitwiseXor, '^']
  ];

  for (const [ctx, tokenn, op] of tokens) {
    it(`scans '${op}'`, () => {
      const scan = create(op);
      const token = nextToken(scan, ctx);
      t.deepEqual(
        {
          token,
          column: scan.column,
          line: scan.line,
          index: scan.index
        },
        {
          token: token,
          line: 1,
          column: op.length,
          index: op.length
        }
      );
    });
  }

  //    console.log(token.type === Token.Punctuator);
  //  console.log(token.value === '(');

  //const token1 = state(Context.AllowPossibleRegEx);

  //console.log(token1.type === Token.EndOfSource);

  //console.log(token1);

  //scanSingleToken(state);
});
