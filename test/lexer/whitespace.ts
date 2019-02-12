import * as t from 'assert';
import { Context } from '../../src/common';
import { Token } from '../../src/token';
import { create } from '../../src/state';
import { nextToken } from '../../src/lexer/scan';

describe('src/scanner/seek', () => {
  function pass(name: string, opts: any) {
    it(name, () => {
      const state = create(opts.source);
      nextToken(state, Context.OptionsWebCompat);
      t.deepEqual(
        {
          source: state.source,
          line: state.line,
          column: state.column
        },
        opts
      );
    });
  }

  function passAll(name: (lt: string) => string, opts: (lt: string) => any) {
    pass(name('line feed'), opts('\n'));
    pass(name('carriage return'), opts('\r'));
    pass(name('Windows newline'), opts('\r'));
    pass(name('line separators'), opts('\u2028'));
    pass(name('paragraph separators'), opts('\u2029'));
  }

  pass('skips nothing', {
    source: '',
    line: 1,
    column: 0
  });

  pass('skips spaces', {
    source: '        ',
    line: 1,
    column: 8
  });

  pass('skips tabs', {
    source: '\t\t\t\t\t\t\t\t',
    line: 1,
    column: 8
  });

  pass('skips vertical tabs', {
    source: '\v\v\v\v\v\v\v\v',
    line: 1,
    column: 8
  });

  passAll(
    lt => `skips ${lt}s`,
    lt => ({
      source: `${lt}${lt}${lt}${lt}${lt}${lt}${lt}${lt}`,
      line: 9,
      column: 0
    })
  );

  pass('skips mixed whitespace', {
    source: '    \t \r\n \n\r \v\f\t ',
    line: 4,
    column: 5
  });

  passAll(
    () => 'skips single line comments with line feed',
    lt => ({
      source: `  \t // foo bar${lt}  `,
      line: 2,
      column: 2
    })
  );

  passAll(
    lt => `skips multiple single line comments with ${lt}`,
    lt => ({
      source: `  \t // foo bar${lt} // baz ${lt} //`,
      line: 3,
      column: 3
    })
  );

  pass('skips multiline comments with nothing', {
    source: '  \t /* foo * /* bar */  ',
    line: 1,
    column: 24
  });

  passAll(
    lt => `skips multiline comments with ${lt}`,
    lt => ({
      source: `  \t /* foo * /* bar ${lt} */  `,
      line: 2,
      column: 5
    })
  );

  passAll(
    lt => `skips multiple multiline comments with ${lt}`,
    lt => ({
      source: `  \t /* foo bar${lt} *//* baz*/ ${lt} /**/`,
      line: 3,
      column: 5
    })
  );

  passAll(
    lt => `skips HTML single line comments with ${lt}`,
    lt => ({
      source: `  \t <!-- foo bar${lt}  `,
      line: 2,
      column: 2
    })
  );

  passAll(
    lt => `skips multiple HTML single line comments with ${lt}`,
    lt => ({
      source: `  \t <!-- foo bar${lt} <!-- baz ${lt} <!--`,
      line: 3,
      column: 5
    })
  );

  passAll(
    lt => `skips single HTML close comment after ${lt}`,
    lt => ({
      source: `  \t ${lt}-->  `,
      line: 2,
      column: 5
    })
  );

  passAll(
    lt => `skips line of single HTML close comment after ${lt}`,
    lt => ({
      source: `  \t ${lt}--> the comment extends to these characters${lt} `,
      line: 3,
      column: 1
    })
  );

  passAll(
    lt => `allows HTML close comment after ${lt} + WS`,
    lt => ({
      source: `  \t ${lt}   --> the comment extends to these characters${lt} `,
      line: 3,
      column: 1
    })
  );

  passAll(
    lt => `skips single-line block on line of HTML close after ${lt}`,
    lt => ({
      source: `  \t /*${lt}*/ /* optional SingleLineDelimitedCommentSequence */    ${''}--> the comment extends to these characters${lt} `,
      line: 3,
      column: 1
    })
  );

  passAll(
    lt => `skips 2 single-line block on line of HTML close after ${lt}`,
    lt => ({
      source: `  \t /*${lt}*/ /**/ /* second optional ${''}SingleLineDelimitedCommentSequence */    ${''}--> the comment extends to these characters${lt} `,
      line: 3,
      column: 1
    })
  );

  passAll(
    lt => `skips block HTML close with ${lt} + empty line`,
    lt => ({
      source: `  \t /*${lt}*/  -->${lt} `,
      line: 3,
      column: 1
    })
  );

  passAll(
    lt => `skips block HTML close with ${lt}`,
    lt => ({
      source: `  \t /*${lt}*/  --> the comment extends to these characters${lt} `,
      line: 3,
      column: 1
    })
  );

  passAll(
    lt => `skips first line block HTML close with ${lt}`,
    lt => ({
      source: `  \t /* optional FirstCommentLine ${lt}*/  --> ` + `the comment extends to these characters${lt} `,
      line: 3,
      column: 1
    })
  );

  passAll(
    lt => `skips multi block + HTML close with ${lt}`,
    lt => ({
      source: `  \t /*${lt}optional${lt}MultiLineCommentChars ${lt}*/  --> the comment extends to these characters${lt} `,
      line: 5,
      column: 1
    })
  );

  passAll(
    lt => `skips multi block + single block + HTML close with ${lt}`,
    lt => ({
      source: `  \t /*${lt}*/ /* optional SingleLineDelimitedCommentSequence ${lt}*/  --> the comment extends to these characters${lt} `,
      line: 4,
      column: 1
    })
  );

  passAll(
    lt => `skips multi block + 2 single block + HTML close with ${lt}`,
    lt => ({
      source: `  \t /*${lt}*/ /**/ /* optional SingleLineDelimitedCommentSequence ${lt}*/  --> the comment extends to these characters${lt} `,
      line: 4,
      column: 1
    })
  );
});
