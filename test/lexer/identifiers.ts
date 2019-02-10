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

  //fail('fails on \\u003B;', '\\u003B;', Context.None);
  fail('fails on #foo123', '#foo123', Context.OptionsNext);
  fail('fails on #f oo', '#f oo', Context.OptionsNext);
  fail('fails on @', '@', Context.OptionsNext);
  fail('fails on # foo123', '# foo123', Context.OptionsNext);
  fail('fails on \\u{10401', '\\u{10401', Context.None);
  fail('fails on \\u104', '\\u104', Context.None);
  fail('fails on \\u{!', '\\u{!', Context.None);
  fail('fails on \\u', '\\u', Context.None);
  fail('fails on \\8', '\\8', Context.None);
  fail('fails on \\9', '\\9', Context.None);
  fail('fails on \\', '\\', Context.None);
  fail('fails on \\u0', '\\u0', Context.None);
  fail('fails on \\u00', '\\u00', Context.None);
  fail('fails on \\u00Xvwxyz', '\\u00Xvwxyz', Context.None);
  fail('fails on \\u{10401', '\\u{10401', Context.None);
  fail('fails on \\u{110000}', '\\u{110000}', Context.None);
  fail('fails on \\u0x11ffff', '\\u0x11ffff', Context.None);
  fail('fails on 🀒', '🀒', Context.None);

  pass('scan identifier with new line', {
    source: 'foo\n',
    ctx: Context.OptionsNext,
    token: Token.Identifier,
    value: 'foo',
    raw: 'foo',
    octalPos: undefined,
    octalMessage: undefined,
    newline: false,
    line: 1,
    column: 3,
    start: 0,
    end: 3
  });

  pass('scan identifier with carriage return', {
    source: 'foo\r',
    ctx: Context.OptionsNext,
    token: Token.Identifier,
    value: 'foo',
    raw: 'foo',
    octalPos: undefined,
    octalMessage: undefined,
    newline: false,
    line: 1,
    column: 3,
    start: 0,
    end: 3
  });

  pass('scan identifier tab', {
    source: 'foo\t',
    ctx: Context.OptionsNext,
    token: Token.Identifier,
    value: 'foo',
    raw: 'foo',
    octalPos: undefined,
    octalMessage: undefined,
    newline: false,
    line: 1,
    column: 3,
    start: 0,
    end: 3
  });

  pass('scan surrugate pair', {
    source: '𞸃',
    ctx: Context.OptionsNext,
    token: Token.Identifier,
    value: '𞸃',
    raw: '𞸃',
    octalPos: undefined,
    octalMessage: undefined,
    newline: false,
    line: 1,
    column: 1,
    start: 0,
    end: 2
  });

  pass('scan surrugate pair', {
    source: 'Ƀȃ',
    ctx: Context.None,
    token: Token.Identifier,
    value: 'Ƀ',
    raw: 'Ƀ',
    newline: false,
    line: 1,
    column: 1,
    start: 0,
    end: 1
  });

  /*
  pass('scan surrogate pair + identifier', {
    source: '𞸆_$',
    ctx: Context.None,
    token: Token.Identifier,
    value: '𞸆_$',
    raw: '𞸆_$',
    newline: false,
    line: 1,
    column: 2,
    start: 0,
    end: 2
  });*/

  pass('scan private name', {
    source: '#foo',
    ctx: Context.OptionsNext,
    token: Token.PrivateName,
    value: 'foo',
    raw: '#foo',
    octalPos: undefined,
    octalMessage: undefined,
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('scan private name', {
    source: '#foo',
    ctx: Context.OptionsNext,
    token: Token.PrivateName,
    value: 'foo',
    raw: '#foo',
    octalPos: undefined,
    octalMessage: undefined,
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('scan surrugate pair', {
    source: '\\u003B;',
    ctx: Context.None,
    token: Token.Invalid,
    value: '',
    raw: '\\u003B',
    octalPos: undefined,
    octalMessage: undefined,
    newline: false,
    line: 1,
    column: 6,
    start: 0,
    end: 6
  });

  pass('fails on a123\\uDAAA', {
    source: 'a123\\uDAAA',
    ctx: Context.None,
    token: Token.Invalid,
    value: 'a123',
    raw: 'a123\\uDAAA',
    octalPos: undefined,
    octalMessage: undefined,
    newline: false,
    line: 1,
    column: 10,
    start: 0,
    end: 10
  });

  pass('scan surrugate pair', {
    source: 'bullshit ',
    ctx: Context.None,
    token: Token.Identifier,
    value: 'bullshit',
    raw: 'bullshit',
    octalPos: undefined,
    octalMessage: undefined,
    newline: false,
    line: 1,
    column: 8,
    start: 0,
    end: 8
  });

  pass('scan surrugate pair', {
    source: 'abc123',
    ctx: Context.None,
    token: Token.Identifier,
    value: 'abc123',
    raw: 'abc123',
    octalPos: undefined,
    octalMessage: undefined,
    newline: false,
    line: 1,
    column: 6,
    start: 0,
    end: 6
  });

  pass('scan not a keyword', {
    source: 'CAN_NOT_BE_A_KEYWORD',
    ctx: Context.None,
    token: Token.Identifier,
    value: 'CAN_NOT_BE_A_KEYWORD',
    raw: 'CAN_NOT_BE_A_KEYWORD',
    octalPos: undefined,
    octalMessage: undefined,
    newline: false,
    line: 1,
    column: 20,
    start: 0,
    end: 20
  });

  pass('scan surrugate pair', {
    source: 'break',
    ctx: Context.None,
    token: Token.BreakKeyword,
    value: 'break',
    raw: 'break',
    octalPos: undefined,
    octalMessage: undefined,
    newline: false,
    line: 1,
    column: 5,
    start: 0,
    end: 5
  });

  pass('scan surrugate pair', {
    source: 'a\\u{65}',
    ctx: Context.None,
    token: Token.Identifier,
    value: 'ae',
    raw: 'a\\u{65}',
    octalPos: undefined,
    octalMessage: undefined,
    newline: false,
    line: 1,
    column: 7,
    start: 0,
    end: 7
  });

  pass('scan surrugate pair', {
    source: 'a\\u{65}b',
    ctx: Context.None,
    token: Token.Identifier,
    value: 'aeb',
    raw: 'a\\u{65}b',
    octalPos: undefined,
    octalMessage: undefined,
    newline: false,
    line: 1,
    column: 8,
    start: 0,
    end: 8
  });

  pass('scan br\\u0065ak', {
    source: 'br\\u0065ak',
    ctx: Context.None,
    token: Token.EscapedReserved,
    value: 'break',
    raw: 'br\\u0065ak',
    octalPos: undefined,
    octalMessage: undefined,
    newline: false,
    line: 1,
    column: 10,
    start: 0,
    end: 10
  });

  pass('scan br\\u0065ak', {
    source: 'br\\u0065ak',
    ctx: Context.Strict,
    token: Token.EscapedReserved,
    value: 'break',
    raw: 'br\\u0065ak',
    octalPos: undefined,
    octalMessage: undefined,
    newline: false,
    line: 1,
    column: 10,
    start: 0,
    end: 10
  });

  pass('scan int\\u0065rface', {
    source: 'int\\u0065rface',
    ctx: Context.Strict,
    token: Token.EscapedFutureReserved,
    value: 'interface',
    raw: 'int\\u0065rface',
    octalPos: undefined,
    octalMessage: undefined,
    newline: false,
    line: 1,
    column: 14,
    start: 0,
    end: 14
  });

  pass('scan int\\u0065rface', {
    source: 'int\\u0065rface',
    ctx: Context.None,
    token: Token.InterfaceKeyword,
    value: 'interface',
    raw: 'int\\u0065rface',
    octalPos: undefined,
    octalMessage: undefined,
    newline: false,
    line: 1,
    column: 14,
    start: 0,
    end: 14
  });
});
