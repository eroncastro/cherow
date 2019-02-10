import * as t from 'assert';
import { Context } from '../../src/common';
import { Token } from '../../src/token';
import { create } from '../../src/state';
import { nextToken } from '../../src/lexer/scan';

describe('lexer - numbers', () => {
  function pass(name: string, opts: any) {
    it(name, () => {
      const state = create(opts.source);
      const token = nextToken(state, opts.ctx);
      t.deepEqual(
        {
          token,
          value: state.tokenValue,
          line: state.line,
          column: state.column,
          index: state.index,
          octalMessage: state.octalMessage,
          octalPos: state.octalPos
        },
        {
          token: opts.token,
          value: opts.value,
          octalMessage: opts.octalMessage,
          octalPos: opts.octalPos,
          line: opts.line,
          column: opts.column,
          index: opts.end
        }
      );
    });
  }

  function fail(name: string, source: string, context: Context) {
    it(name, () => {
      const state = create(source);
      t.throws(() => nextToken(state, context));
    });
  }

  fail('fails on 008.3', '008.3', Context.Strict);
  fail('fails on 008.3n', '008.3n', Context.None);
  fail('fails on .3n', '.3n', Context.None);
  fail('fails on 008.3n', '008.3n', Context.OptionsNext);
  fail('fails on .3n', '.3n', Context.OptionsNext);

  fail('fails on 04.0E-100', '04.0E-100', Context.OptionsNext);

  //fail('fails on 0x9a.0E-100', '0x9a.0E-100', Context.OptionsNext);

  fail('fails on 0b001E-100', '0b001E-100', Context.None);
  fail('fails on 0OB001E-100', '0OB001E-100', Context.None);
  fail('fails on 0x', '0x', Context.None);
  fail('fails on 10e', '10e', Context.None);
  fail('fails on 07e8', '07e8', Context.None);
  fail('fails on 10e-', '10e-', Context.None);
  fail('fails on decimal integer followed by identifier', '12adf00', Context.None);
  fail('fails on decimal integer followed by identifier', '3in1', Context.None);
  fail('fails on decimal integer followed by identifier', '3.e', Context.None);
  fail('fails on decimal integer followed by identifier', '3.e+abc', Context.None);
  fail('fails on Binary-integer-literal-like sequence with a leading 0', '00b0;', Context.None);
  fail('fails on Octal-integer-literal-like sequence containing an invalid digit', '0o8', Context.Strict);
  fail('fails on Octal-integer-literal-like sequence containing an invalid digit', '0b3', Context.Strict);
  fail('fails on Octal-integer-literal-like sequence without any digits', '0o', Context.Strict);
  fail('fails on Binary-integer-literal-like sequence without any digits', '0b;', Context.Strict);
  fail('fails on Binary-integer-literal-like sequence containing an invalid digit', '0b2;', Context.Strict);
  fail('fails on Binary-integer-literal-like sequence containing an invalid digit', '0077', Context.Strict);

  pass('scan single digit with following whitespace', {
    source: '1 ',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 1,
    raw: '1',
    newline: false,
    line: 1,
    column: 1,
    start: 0,
    end: 1
  });

  pass('scan 7890', {
    source: '7890',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 7890,
    raw: '7890',
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('scan 0o1', {
    source: '0o1',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 1,
    raw: '0o1',
    newline: false,
    line: 1,
    column: 3,
    start: 0,
    end: 3
  });

  pass('scan 0o7', {
    source: '0o7',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 7,
    raw: '7890',
    newline: false,
    line: 1,
    column: 3,
    start: 0,
    end: 3
  });

  pass('scan 0o77', {
    source: '0o77',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 63,
    raw: '7890',
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('scan 077', {
    source: '077',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 63,
    octalMessage: 7,
    octalPos: {
      column: 3,
      index: 0,
      line: 1
    },
    raw: '7890',
    newline: false,
    line: 1,
    column: 3,
    start: 0,
    end: 3
  });

  pass('scan 00', {
    source: '00',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 0,
    raw: '7890',
    octalMessage: 7,
    octalPos: {
      column: 2,
      index: 0,
      line: 1
    },
    newline: false,
    line: 1,
    column: 2,
    start: 0,
    end: 2
  });

  pass('scan 0000000000', {
    source: '0000000000',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 0,
    raw: '7890',
    octalMessage: 7,
    octalPos: {
      column: 10,
      index: 0,
      line: 1
    },
    newline: false,
    line: 1,
    column: 10,
    start: 0,
    end: 10
  });

  pass('scan 0B0', {
    source: '0B0',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 0,
    raw: '7890',
    newline: false,
    line: 1,
    column: 3,
    start: 0,
    end: 3
  });

  pass('scan 0b11', {
    source: '0b11',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 3,
    raw: '7890',
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('scan 08e7', {
    source: '08e7',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 80000000,
    raw: '7890',
    octalMessage: 6,
    octalPos: {
      column: 3,
      index: 4,
      line: 1
    },
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('scan 08.7', {
    source: '08.7',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 8.7,
    raw: '7890',
    octalMessage: 6,
    octalPos: {
      column: 3,
      index: 4,
      line: 1
    },
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('scan 0.', {
    source: '0.',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 0,
    raw: '7890',
    octalMessage: 6,
    octalPos: {
      column: 1,
      index: 2,
      line: 1
    },
    newline: false,
    line: 1,
    column: 2,
    start: 0,
    end: 2
  });

  pass('scan 0e+100000', {
    source: '0e+100000',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 0,
    raw: '7890',
    octalMessage: 6,
    octalPos: {
      column: 8,
      index: 9,
      line: 1
    },
    newline: false,
    line: 1,
    column: 9,
    start: 0,
    end: 9
  });

  pass('scan 7890', {
    source: '7890',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 7890,
    raw: '7890',
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('scan 7890', {
    source: `1.
    0
    1`,
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 1,
    raw: '7890',
    newline: false,
    line: 1,
    column: 2,
    start: 0,
    end: 2
  });

  pass('scan 847003580761626016356864581135848683152156368691976240370422601', {
    source: '847003580761626016356864581135848683152156368691976240370422601',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 8.47003580761626e62,
    raw: '7890',
    newline: false,
    line: 1,
    column: 63,
    start: 0,
    end: 63
  });

  pass('scan 7890', {
    source: '7890',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 7890,
    raw: '7890',
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('scan 08', {
    source: '08',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 8,
    raw: '08',
    octalMessage: 6,
    octalPos: {
      column: 1,
      index: 2,
      line: 1
    },
    newline: false,
    line: 1,
    column: 2,
    start: 0,
    end: 2
  });

  pass('scan 1234567890.0987654321', {
    source: '1234567890.0987654321',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 1234567890.0987654,
    raw: '1234567890.0987654321',
    newline: false,
    line: 1,
    column: 21,
    start: 0,
    end: 21
  });

  pass('scan 43.78', {
    source: '43.78',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 43.78,
    raw: '43.78',
    newline: false,
    line: 1,
    column: 5,
    start: 0,
    end: 5
  });

  pass('scan 6e7', {
    source: '6e7',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 60000000,
    raw: '6e7',
    newline: false,
    line: 1,
    column: 3,
    start: 0,
    end: 3
  });

  pass('scan 1e100', {
    source: '1e+100',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 1e100,
    raw: '1e+100',
    newline: false,
    line: 1,
    column: 6,
    start: 0,
    end: 6
  });

  pass('scan 0o12345670', {
    source: '0o12345670',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 2739128,
    raw: '0o12345670',
    newline: false,
    line: 1,
    column: 10,
    start: 0,
    end: 10
  });

  pass('scan 0x9a', {
    source: '0x9a',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 154,
    raw: '0x9a',
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('scan 0B011', {
    source: '0B011',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 3,
    raw: '0B011',
    newline: false,
    line: 1,
    column: 5,
    start: 0,
    end: 5
  });

  pass('scan .123', {
    source: '.123',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 0.123,
    raw: '.123',
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('scan 0e-1', {
    source: '0e-1',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 0,
    raw: '0e-1',
    octalMessage: 6,
    octalPos: {
      column: 3,
      index: 4,
      line: 1
    },
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('scan 0123', {
    source: '0123',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 83,
    raw: '0123',
    octalMessage: 7,
    octalPos: {
      column: 4,
      index: 0,
      line: 1
    },
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('scan 009.33', {
    source: '009.33',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 9.33,
    octalMessage: 6,
    octalPos: {
      column: 5,
      index: 6,
      line: 1
    },
    raw: '009.33',
    newline: false,
    line: 1,
    column: 6,
    start: 0,
    end: 6
  });

  pass('scan 42n', {
    source: '42n',
    ctx: Context.OptionsNext,
    token: Token.BigIntLiteral,
    value: 42,
    raw: '42n',
    newline: false,
    line: 1,
    column: 3,
    start: 0,
    end: 3
  });

  pass('scan 08.0E-100', {
    source: '08.0E-100',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 8e-100,
    octalMessage: 6,
    octalPos: {
      column: 8,
      index: 9,
      line: 1
    },
    raw: '08.0E-100',
    newline: false,
    line: 1,
    column: 9,
    start: 0,
    end: 9
  });

  pass('scan 0x12', {
    source: '0x12',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 18,
    raw: '0x12',
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('scan .0E-100', {
    source: '.0E-100',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 0.0e-100,
    raw: '.0E-100',
    newline: false,
    line: 1,
    column: 7,
    start: 0,
    end: 7
  });

  pass('skips nothing', {
    source: '008.3',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: '8.3',
    octalMessage: 6,
    octalPos: {
      column: 4,
      index: 5,
      line: 1
    },
    raw: '008.3',
    newline: false,
    line: 1,
    column: 5,
    start: 0,
    end: 5
  });

  pass('skips nothing', {
    source: '00003',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 3,
    octalMessage: 7,
    octalPos: {
      column: 5,
      index: 0,
      line: 1
    },
    raw: '00003',
    newline: false,
    line: 1,
    column: 5,
    start: 0,
    end: 5
  });

  pass('skips nothing', {
    source: '09',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 9,
    octalMessage: 6,
    octalPos: {
      column: 1,
      index: 2,
      line: 1
    },
    raw: '09',
    newline: false,
    line: 1,
    column: 2,
    start: 0,
    end: 2
  });

  pass('skips nothing', {
    source: '0o345',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 229,
    raw: '0o345',
    newline: false,
    line: 1,
    column: 5,
    start: 0,
    end: 5
  });

  pass('skips nothing', {
    source: '0o345',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 229,
    raw: '0o345',
    newline: false,
    line: 1,
    column: 5,
    start: 0,
    end: 5
  });

  pass('skips nothing', {
    source: '0b000000000101010101011110011010101',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 11189461,
    raw: '0b000000000101010101011110011010101',
    newline: false,
    line: 1,
    column: 35,
    start: 0,
    end: 35
  });

  pass('skips nothing', {
    source: '0b00000000010101010101111001101010110101010101111001101010110101010101111001101010110011010101',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 6.450285490396792e24,
    raw: '0b00000000010101010101111001101010110101010101111001101010110101010101111001101010110011010101',
    newline: false,
    line: 1,
    column: 94,
    start: 0,
    end: 94
  });

  pass('skips nothing', {
    source: '0b00101',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 5,
    raw: '0b00101',
    newline: false,
    line: 1,
    column: 7,
    start: 0,
    end: 7
  });

  pass('skips nothing', {
    source: '0xFF76FE',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 16742142,
    raw: '0xFF76FE',
    newline: false,
    line: 1,
    column: 8,
    start: 0,
    end: 8
  });

  pass('skips nothing', {
    source: '0',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 0,
    raw: '0',
    newline: false,
    line: 1,
    column: 1,
    start: 0,
    end: 1
  });

  pass('skips nothing', {
    source: '123',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 123,
    raw: '123',
    newline: false,
    line: 1,
    column: 3,
    start: 0,
    end: 3
  });

  pass('skips nothing', {
    source: '1.23',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 1.23,
    raw: '1.23',
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('skips nothing', {
    source: '1e+3',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 1000,
    raw: '1e+3',
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('skips nothing', {
    source: '21.34e+3',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 21340,
    raw: '21.34e+3',
    newline: false,
    line: 1,
    column: 8,
    start: 0,
    end: 8
  });

  pass('skips nothing', {
    source: '.7890',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 0.789,
    raw: '.7890',
    newline: false,
    line: 1,
    column: 5,
    start: 0,
    end: 5
  });

  pass('skips nothing', {
    source: '32e32',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 3.2e33,
    raw: '32e32',
    newline: false,
    line: 1,
    column: 5,
    start: 0,
    end: 5
  });

  pass('skips nothing', {
    source: '0x1234567890abcdefABCEF',
    ctx: Context.None,
    token: Token.NumericLiteral,
    value: 1.3754889323622168e24,
    raw: '0x1234567890abcdefABCEF',
    newline: false,
    line: 1,
    column: 23,
    start: 0,
    end: 23
  });
});
