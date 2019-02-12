import * as t from 'assert';
import { Context } from '../../src/common';
import { Token } from '../../src/token';
import { create } from '../../src/state';
import { nextToken } from '../../src/lexer/scan';

describe('src/scanner/scan', () => {
  describe('scan()', () => {
    interface Opts {
      source: string;
      context: Context;
      token: Token;
      hasNext: boolean;
      line: number;
      column: number;
    }

    function pass(name: string, opts: Opts) {
      it(name, () => {
        const parser = create(opts.source);

        t.deepEqual(
          {
            token: nextToken(parser, opts.context),
            hasNext: parser.index < parser.source.length,
            line: parser.line,
            column: parser.column
          },
          {
            token: opts.token,
            hasNext: opts.hasNext,
            line: opts.line,
            column: opts.column
          }
        );
      });
    }

    pass('scans end of source', {
      source: '',
      context: Context.None,
      token: Token.EndOfSource,
      hasNext: false,
      line: 1,
      column: 0
    });

    const tokens: Array<[Context, Token, string]> = [
      [Context.None, Token.LeftParen, '('],
      [Context.None, Token.LeftParen, '('],
      [Context.None, Token.LeftBrace, '{'],
      [Context.None, Token.RightBrace, '}'],
      [Context.None, Token.RightParen, ')'],
      [Context.None, Token.Semicolon, ';'],
      [Context.None, Token.Comma, ','],
      [Context.None, Token.LeftBracket, '['],
      [Context.None, Token.RightBracket, ']'],
      [Context.None, Token.Colon, ':'],
      [Context.None, Token.QuestionMark, '?'],
      [Context.None, Token.Arrow, '=>'],
      [Context.None, Token.Period, '.'],
      [Context.None, Token.Ellipsis, '...'],
      [Context.OptionsJSX, Token.JSXClose, '</'],
      [Context.OptionsJSX, Token.JSXAutoClose, '/>'],
      [Context.None, Token.Increment, '++'],
      [Context.None, Token.Decrement, '--'],
      [Context.None, Token.Assign, '='],
      [Context.None, Token.ShiftLeftAssign, '<<='],
      [Context.None, Token.ShiftRightAssign, '>>='],
      [Context.None, Token.LogicalShiftRightAssign, '>>>='],
      [Context.None, Token.ExponentiateAssign, '**='],
      [Context.None, Token.AddAssign, '+='],
      [Context.None, Token.SubtractAssign, '-='],
      [Context.None, Token.MultiplyAssign, '*='],
      [Context.None, Token.DivideAssign, '/='],
      [Context.None, Token.ModuloAssign, '%='],
      [Context.None, Token.BitwiseXorAssign, '^='],
      [Context.None, Token.BitwiseOrAssign, '|='],
      [Context.None, Token.BitwiseAndAssign, '&='],
      [Context.None, Token.Negate, '!'],
      [Context.None, Token.Complement, '~'],
      [Context.None, Token.Add, '+'],
      [Context.None, Token.Subtract, '-'],
      [Context.None, Token.Multiply, '*'],
      [Context.None, Token.Modulo, '%'],
      [Context.None, Token.Divide, '/'],
      [Context.None, Token.Exponentiate, '**'],
      [Context.None, Token.LogicalAnd, '&&'],
      [Context.None, Token.LogicalOr, '||'],
      [Context.None, Token.StrictEqual, '==='],
      [Context.None, Token.StrictNotEqual, '!=='],
      [Context.None, Token.LooseEqual, '=='],
      [Context.None, Token.LooseNotEqual, '!='],
      [Context.None, Token.LessThanOrEqual, '<='],
      [Context.None, Token.GreaterThanOrEqual, '>='],
      [Context.None, Token.LessThan, '<'],
      [Context.None, Token.GreaterThan, '>'],
      [Context.None, Token.ShiftLeft, '<<'],
      [Context.None, Token.ShiftRight, '>>'],
      [Context.None, Token.LogicalShiftRight, '>>>'],
      [Context.None, Token.BitwiseAnd, '&'],
      [Context.None, Token.BitwiseOr, '|'],
      [Context.None, Token.BitwiseXor, '^']
    ];

    for (const [ctx, token, op] of tokens) {
      it(`scans '${op}' at the end`, () => {
        const parser = create(op);
        const found = nextToken(parser, ctx);

        t.deepEqual(
          {
            token: found,
            hasNext: parser.index < parser.source.length,
            line: parser.line,
            column: parser.column
          },
          {
            token: token,
            hasNext: false,
            line: 1,
            column: op.length
          }
        );
      });

      it(`scans '${op}' with more to go`, () => {
        const parser = create(`${op} rest`);
        const found = nextToken(parser, ctx);

        t.deepEqual(
          {
            token: found,
            hasNext: parser.index < parser.source.length,
            line: parser.line,
            column: parser.column
          },
          {
            token: token,
            hasNext: true,
            line: 1,
            column: op.length
          }
        );
      });
    }
  });
});
