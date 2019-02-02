import * as t from 'assert';
import { scanSingleToken } from '../../src/scanner';
import { Context } from '../../src/common';
import { create } from '../../src/state';

describe('Lexer - OnComment', () => {
  interface Opts {
    source: string;
    type: string;
    value: string;
    hasNext: boolean;
    start: number;
    end: number;
    column: number;
  }
  function pass(name: string, opts: Opts) {
    it(name, () => {
      let token: any;
      const state = create(opts.source, function(type: any, value: any, start: number | void, end: number | void) {
        token = {
          type,
          value,
          start,
          end
        };
      });
      scanSingleToken(state, Context.OptionsNext | Context.OptionsRanges);
      t.deepEqual(
        {
          hasNext: state.index < state.length,
          type: token.type,
          value: token.value,
          start: token.start,
          end: token.end,
          column: state.column
        },
        {
          hasNext: state.index < state.length,
          type: opts.type,
          value: opts.value,
          start: opts.start,
          end: opts.end,
          column: opts.column
        }
      );
    });
  }

  pass('skip single line comment', {
    source: '// }',
    type: 'SingleLine',
    value: ' }',
    hasNext: false,
    start: 2,
    end: 4,
    column: 4
  });

  pass('skip multiLine comment', {
    source: '/** cherow */',
    type: 'MultiLine',
    value: '* cherow ',
    hasNext: false,
    start: 2,
    end: 13,
    column: 13
  });

  pass('skip multiLine comment with newline', {
    source: '/** cherow \n 2.0 */',
    type: 'MultiLine',
    value: '* cherow \n 2.0 ',
    hasNext: false,
    start: 2,
    end: 19,
    column: 7
  });

  pass('skip multiLine comment with newline', {
    source: `/** cherow
       2.0 */`,
    type: 'MultiLine',
    value: '* cherow\n       2.0 ',
    hasNext: false,
    column: 13,
    start: 2,
    end: 24
  });
});
