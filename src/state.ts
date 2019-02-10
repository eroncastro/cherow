import { Flags } from './common';
import { Token } from 'token';

export function create(source: string): any {
  return {
    flags: Flags.None,
    source,
    index: 0, // The current index
    line: 1, // Beginning of current line
    column: 0, // Beginning of current column
    length: source.length, // The length of source
    startIndex: 0,
    tokenValue: undefined,
    token: Token.EndOfSource,
    tokenRaw: '',
    tokenRegExp: undefined,
    currentChar: source.charCodeAt(0), // current character

    seenDelimitedCommentEnd: false, // Used to parse --> closing html comment properly

    // Used to remember the position of octal numbers / escape sequences
    // so that an error can be reported later (in strict mode).
    octalPos: undefined,
    octalMessage: undefined
  };
}
