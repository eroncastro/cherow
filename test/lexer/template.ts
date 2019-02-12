import * as t from 'assert';
import { Context } from '../../src/common';
import { Token } from '../../src/token';
import { create } from '../../src/state';
import { nextToken } from '../../src/lexer/scan';

describe('src/scanner/seek', () => {
  function pass(name: string, opts: any) {
    it(name, () => {
      const state = create(opts.source);
      const token = nextToken(state, Context.AllowTemplate);
      t.deepEqual(
        { token, column: state.column, line: state.line },
        {
          token: opts.token,
          column: opts.column,
          line: opts.line
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

  fail('fails on "\\xFG"', '`', Context.None);

  pass('should scan template head', {
    source: '`${a`',
    token: Token.TemplateHead,
    value: '`${',
    raw: '`${',
    newline: false,
    line: 1,
    column: 3,
    start: 0,
    end: 3
  });

  pass('scan template head and stop after "{"', {
    source: '`a${b}`',
    token: Token.TemplateHead,
    value: '`a${',
    raw: '`a${',
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('skips nothing', {
    source: '} a`',
    token: Token.TemplateTail,
    value: ' a',
    raw: '} a`',
    newline: false,
    line: 1,
    column: 4,
    start: 0,
    end: 4
  });

  pass('scan template body', {
    source: '`a \\ b `',
    token: Token.NoSubstitutionTemplate,
    value: ' b ',
    raw: '`a \\ b `',
    newline: false,
    line: 1,
    column: 8,
    start: 0,
    end: 8
  });
});
