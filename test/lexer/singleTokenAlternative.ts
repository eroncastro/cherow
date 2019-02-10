import * as t from 'assert';
import { Context } from '../../src/common';
import { Token } from '../../src/token';
import { create } from '../../src/state';
import { nextToken } from '../../src/lexer/scan';

describe('src/scanner/seek', () => {
  function pass(name: string, opts: any) {
    it(name, () => {
      const state = create(opts.source);
      const token = nextToken(state, opts.ctx, function() {
        return Token.StringLiteral;
      });
      t.deepEqual(
        { token },
        {
          token: opts.token
        }
      );
    });
  }

  pass('should only return "Token.StringLiteral"', {
    source: ' ',
    token: Token.StringLiteral,
    value: '',
    raw: '',
    newline: false,
    start: 0,
    end: 0,
    hasNext: false,
    line: 1,
    column: 0
  });
});
