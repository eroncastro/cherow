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

  fail('fails on unclosed multi line comment', '/** ', Context.Strict);
  //fail('fails on unclosed multi line comment', '//\m ', Context.Strict);
  //fail('fails on unclosed multi line comment', '\u180Ef', Context.Strict);

  pass('skips nothing', {
    source: '',
    token: Token.EndOfSource,
    value: '',
    raw: '',
    newline: false,
    start: 0,
    end: 0,

    line: 1,
    column: 0
  });

  pass('skips spaces', {
    source: '        ',
    token: Token.EndOfSource,
    value: '',
    raw: '',
    newline: false,
    start: 8,
    end: 8,

    line: 1,
    column: 8
  });

  pass('skips tabs', {
    source: '\t\t\t\t\t\t\t\t',
    token: Token.EndOfSource,
    value: '',
    raw: '',
    newline: false,
    start: 8,
    end: 8,

    line: 1,
    column: 8
  });

  pass('skips vertical tabs', {
    source: '\v\v\v\v\v\v\v\v',
    token: Token.EndOfSource,
    value: '',
    raw: '',
    newline: false,
    start: 8,
    end: 8,

    line: 1,
    column: 8
  });

  passAll(
    lt => `skips ${lt}s`,
    lt => ({
      source: `${lt}${lt}${lt}${lt}${lt}${lt}${lt}${lt}`,
      token: Token.EndOfSource,
      value: '',
      raw: '',
      newline: true,
      start: 8,
      end: 8,

      line: 9,
      column: 0
    })
  );

  pass('skips mixed whitespace', {
    source: '    \t \r\n \n\r \v\f\t ',
    token: Token.EndOfSource,
    value: '',
    raw: '',
    newline: true,
    start: 16,
    end: 16,

    line: 4,
    column: 5
  });

  pass('skips multiline comment with space', {
    source: '/*\\u0020 multi line \\u0020 comment \\u0020*/',
    token: Token.EndOfSource,
    value: '',
    raw: '',
    newline: false,
    start: 43,
    end: 43,
    line: 1,
    column: 43
  });

  pass('skips multiline comment with vertical tab', {
    source: '/*\\u000B multi line \\u000B comment \\u000B x = 1;*/',
    token: Token.EndOfSource,
    value: '',
    raw: '',
    newline: false,
    start: 50,
    end: 50,
    line: 1,
    column: 50
  });

  pass('skips multiline comment with space', {
    source: '//\\u00A0 single line \\u00A0 comment \\u00A0 x = 1;',
    token: Token.EndOfSource,
    value: '',
    raw: '',
    newline: false,
    start: 49,
    end: 49,
    line: 1,
    column: 49
  });

  pass('skips single and multi line comments used together', {
    source: `/* var
    *///x*/`,
    token: Token.EndOfSource,
    value: '',
    raw: '',
    newline: true,
    start: 18,
    end: 18,
    line: 2,
    column: 11
  });

  pass('skips single line comment with multiple new line', {
    source: '//\n\n\n\n\n\n\n\n\n\n\n',
    token: Token.EndOfSource,
    value: '',
    raw: '',
    newline: true,
    start: 13,
    end: 13,
    line: 12,
    column: 0
  });

  pass('skips single line comment with multiple carriage return', {
    source: '//\r\r\r\r\r\r\r\r\r\r\r',
    token: Token.EndOfSource,
    value: '',
    raw: '',
    newline: true,
    start: 13, // should have been 24
    end: 13,
    line: 12, // should have been 1
    column: 0
  });

  pass('skips single line comment with multiple carriage return and line feed', {
    source: '//\r\r\n\n\r\r\r\r\n\r\n',
    token: Token.EndOfSource,
    value: '',
    raw: '',
    newline: true,
    start: 13,
    end: 13, // should have been 24
    line: 9,
    column: 0
  });

  pass('skips multiline comment with space', {
    source: '/* multi line comment x = 1;*/',
    token: Token.EndOfSource,
    value: '',
    raw: '',
    newline: false,
    start: 30,
    end: 30,
    line: 1,
    column: 30
  });

  pass('skips multiline comment with space', {
    source: '/* multi line comment x = 1;*/',
    token: Token.EndOfSource,
    value: '',
    raw: '',
    newline: false,
    start: 30,
    end: 30,
    line: 1,
    column: 30
  });

  pass('skips multiline comment with space', {
    source: '/* multi line comment x = 1;*/',
    token: Token.EndOfSource,
    value: '',
    raw: '',
    newline: false,
    start: 30,
    end: 30,
    line: 1,
    column: 30
  });

  pass('skips multiline comment with space', {
    source: '/* multi line comment x = 1;*/',
    token: Token.EndOfSource,
    value: '',
    raw: '',
    newline: false,
    start: 30,
    end: 30,
    line: 1,
    column: 30
  });

  pass('skips multiline comment with space', {
    source: '/* multi line comment x = 1;*/',
    token: Token.EndOfSource,
    value: '',
    raw: '',
    newline: false,
    start: 30,
    end: 30,
    line: 1,
    column: 30
  });

  pass('skips multiline comment with space', {
    source: '/* multi line comment x = 1;*/',
    token: Token.EndOfSource,
    value: '',
    raw: '',
    newline: false,
    start: 30,
    end: 30,
    line: 1,
    column: 30
  });

  function passAll(name: (lt: string) => string, opts: (lt: string) => any) {
    pass(name('line feed'), opts('\n'));
    pass(name('carriage return'), opts('\r'));
    pass(name('Windows newline'), opts('\r'));
    pass(name('line separators'), opts('\u2028'));
    pass(name('paragraph separators'), opts('\u2029'));
  }

  pass('skips multiline comments with nothing', {
    source: '  \t /* foo * /* bar */  ',
    token: Token.EndOfSource,
    value: '',
    raw: '',
    newline: false,
    start: 24,
    end: 24,
    line: 1,
    column: 24
  });

  passAll(
    lt => `skips multiple single line comments with ${lt}`,
    lt => ({
      source: `  \t // foo bar${lt} // baz ${lt} //`,
      token: Token.EndOfSource,
      value: '',
      raw: '',
      newline: true,
      start: 27,
      end: 27,

      line: 3,
      column: 3
    })
  );

  passAll(
    lt => `skips single line comments with ${lt}`,
    lt => ({
      source: `  \t // foo bar${lt}  `,
      token: Token.EndOfSource,
      value: '',
      raw: '',
      newline: true,
      start: 17,
      end: 17,

      line: 2,
      column: 2
    })
  );

  passAll(
    lt => `skips multiline comments with ${lt}`,
    lt => ({
      source: `  \t /* foo * /* bar ${lt} */  `,
      token: Token.EndOfSource,
      value: '',
      raw: '',
      newline: true,
      start: 26,
      end: 26,

      line: 2,
      column: 5
    })
  );

  passAll(
    lt => `skips multiple multiline comments with ${lt}`,
    lt => ({
      source: `  \t /* foo bar${lt} *//* baz*/ ${lt} /**/`,
      token: Token.EndOfSource,
      value: '',
      raw: '',
      newline: true,
      start: 33,
      end: 33,

      line: 3,
      column: 5
    })
  );

  pass('avoids single HTML close comment w/o line terminator', {
    source: '<!--  ',
    token: Token.EndOfSource,
    value: '',
    raw: '',
    newline: false,
    start: 6,
    end: 6,
    hasNext: true,
    line: 1,
    column: 6
  });
});
