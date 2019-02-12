import * as t from 'assert';
import { Context } from '../../src/common';
import { Token } from '../../src/token';
import { create } from '../../src/state';
import { nextToken } from '../../src/lexer/scan';

describe('src/scanner/seek', () => {
  function pass(name: string, opts: any) {
    it(name, () => {
      const state = create(opts.source);
      const token = nextToken(state, opts.ctx);
      t.deepEqual(
        {
          token,
          line: state.line,
          column: state.column,
          index: state.index,
          octalMessage: state.octalMessage,
          octalPos: state.octalPos
        },
        {
          token: opts.token,
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

  fail('fails on "\\xFG"', '"\\xFG"', Context.None);
  fail('fails on "\\xFG"', '"\\xFG"', Context.None);
  fail('fails on "\\u{67"', '"\\u{67"', Context.None);
  fail('fails on "\\u{"', '"\\u{"', Context.None);

  fail('fails on "\\8"', '"\\8"', Context.None);
  fail('fails on "\\9"', '"\\9"', Context.None);
  fail('fails on "a\\u{10401"', '"a\\u{110000}"', Context.None);
  fail('fails on "\\u67"', '"\\u67"', Context.None);
  fail('fails on "\\u"', '"\\u"', Context.None);
  fail('fails on "\\ua!"', '"\\ua!"', Context.None);
  fail('fails on unterminated string', '"', Context.None);
  fail('fails on unterminated string (LT)', '"\r"', Context.None);
  fail('fails on unterminated string (LT)', '"\n"', Context.None);
  fail('fails on unterminated string (LT)', '"\n\r"', Context.None);
  fail('fails on "\\xFG"', '"\\xFG"', Context.None);

  pass('skips nothing', {
    source: '""',
    token: Token.StringLiteral,
    value: '',
    raw: '""',
    newline: false,
    line: 1,
    column: 2,
    start: 0,
    end: 2
  });

  pass('skips nothing', {
    source: '"string"',
    token: Token.StringLiteral,
    value: 'string',
    raw: '"string"',
    newline: false,
    line: 1,
    column: 8,
    start: 0,
    end: 8
  });

  pass('skips nothing', {
    source: '"string"',
    token: Token.StringLiteral,
    value: 'string',
    raw: '"string"',
    newline: false,
    line: 1,
    column: 8,
    start: 0,
    end: 8
  });

  pass('skips nothing', {
    source: '"Francisco"',
    token: Token.StringLiteral,
    value: 'Francisco',
    raw: '"Francisco"',
    newline: false,
    line: 1,
    column: 11,
    start: 0,
    end: 11
  });

  pass('skips nothing', {
    source: '"\\n"',
    token: Token.StringLiteral,
    value: '\n',
    raw: '"\\n"',
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('skips nothing', {
    source: '"\\n\\r"',
    token: Token.StringLiteral,
    value: '\n\r',
    raw: '"\\n\\r"',
    newline: false,
    line: 1,
    column: 6,
    start: 0,
    end: 6
  });

  pass('skips nothing', {
    source: '"\\r"',
    token: Token.StringLiteral,
    value: '\r',
    raw: '"\\r"',
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('skips nothing', {
    source: '"\\b"',
    token: Token.StringLiteral,
    value: '\b',
    raw: '"\\b"',
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('skips nothing', {
    source: '"\\r"',
    token: Token.StringLiteral,
    value: '\r',
    raw: '"\\r"',
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('skips nothing', {
    source: '"\\v"',
    token: Token.StringLiteral,
    value: '\v',
    raw: '"\\v"',
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('skips nothing', {
    source: '"\\t"',
    token: Token.StringLiteral,
    value: '\t',
    raw: '"\\t"',
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('skips nothing', {
    source: '"\\f"',
    token: Token.StringLiteral,
    value: '\f',
    raw: '"\\f"',
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('skips nothing', {
    source: '"\\\\"',
    token: Token.StringLiteral,
    value: '\\',
    raw: '"\\\\"',
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('skips nothing', {
    source: '"\\v"',
    token: Token.StringLiteral,
    value: '\v',
    raw: '"\\v"',
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('skips nothing', {
    source: '"\\""',
    token: Token.StringLiteral,
    value: '"',
    raw: '"\\""',
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('skips nothing', {
    source: `"\\'"`,
    token: Token.StringLiteral,
    value: "'",
    raw: '"\\\'"',
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });
  pass('skips nothing', {
    source: '"\\u{67}"',
    token: Token.StringLiteral,
    value: 'g',
    raw: '"\\u{67}"',
    newline: false,
    line: 1,
    column: 8,
    start: 0,
    end: 8
  });

  pass('skips nothing', {
    source: '"\\u0037"',
    token: Token.StringLiteral,
    value: '7',
    raw: '"\\u0037"',
    newline: false,
    line: 1,
    column: 8,
    start: 0,
    end: 8
  });

  pass('skips nothing', {
    source: '"\\x53"',
    token: Token.StringLiteral,
    value: 'S',
    raw: '"\\x53"',
    newline: false,
    line: 1,
    column: 6,
    start: 0,
    end: 6
  });

  pass('skips nothing', {
    source: '"\\7"',
    token: Token.StringLiteral,
    value: '\u0007',
    raw: '"\\7"',
    octalMessage: 0,
    octalPos: {
      column: 2,
      index: 3,
      line: 1
    },
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('skips nothing', {
    source: '"\\77"',
    token: Token.StringLiteral,
    value: '?',
    raw: '"\\77"',
    octalMessage: 0,
    octalPos: {
      column: 3,
      index: 4,
      line: 1
    },
    newline: false,
    line: 1,
    column: 5,
    start: 0,
    end: 5
  });

  pass('skips nothing', {
    source: '"\\x00"',
    token: Token.StringLiteral,
    value: '\u0000',
    raw: '"\\x00"',
    newline: false,
    line: 1,
    column: 6,
    start: 0,
    end: 6
  });

  pass('skips nothing', {
    source: '"\\u000E2"',
    token: Token.StringLiteral,
    value: '\u000e2',
    raw: '"\\u000E2"',
    newline: false,
    line: 1,
    column: 9,
    start: 0,
    end: 9
  });

  pass('skips nothing', {
    source: '"\\u000E2"',
    token: Token.StringLiteral,
    value: '\u000e2',
    raw: '"\\u000E2"',
    newline: false,
    line: 1,
    column: 9,
    start: 0,
    end: 9
  });

  pass('skips nothing', {
    source: '"\\u000E2"',
    token: Token.StringLiteral,
    value: '\u000e2',
    raw: '"\\u000E2"',
    newline: false,
    line: 1,
    column: 9,
    start: 0,
    end: 9
  });

  pass('skips nothing', {
    source: '"\\u000E2"',
    token: Token.StringLiteral,
    value: '\u000e2',
    raw: '"\\u000E2"',
    newline: false,
    line: 1,
    column: 9,
    start: 0,
    end: 9
  });

  pass('skips nothing', {
    source: '"Hello\\nworld"',
    token: Token.StringLiteral,
    value: 'Hello\nworld',
    raw: '"Hello\\nworld"',
    octalMessage: undefined,
    octalPos: undefined,
    newline: false,
    line: 1,
    column: 14,
    start: 0,
    end: 14
  });

  pass('skips nothing', {
    source: '"Hello\\1World"',
    token: Token.StringLiteral,
    value: 'Hello\u0001World',
    raw: '"Hello\\1World"',
    octalMessage: 0,
    octalPos: {
      column: 7,
      index: 8,
      line: 1
    },
    newline: false,
    line: 1,
    column: 14,
    start: 0,
    end: 14
  });

  pass('skips nothing', {
    source: '"Hello\\412World"',
    token: Token.StringLiteral,
    value: 'Hello!2World',
    raw: '"Hello\\412World"',
    octalMessage: 0,
    octalPos: {
      column: 8,
      index: 9,
      line: 1
    },
    newline: false,
    line: 1,
    column: 16,
    start: 0,
    end: 16
  });

  pass('skips nothing', {
    source: '"\\b"',
    token: Token.StringLiteral,
    value: '\b',
    raw: '"\\b"',
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });
});
