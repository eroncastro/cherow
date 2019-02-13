import { ParserState, Flags } from './common';
import { Token } from 'token';

export function create(source: string): ParserState {
  return {
    flags: Flags.None,
    source,
    index: 0, // The current index
    line: 1, // Beginning of current line
    column: 0, // Beginning of current column
    endIndex: 0,
    endLine: 0,
    endColumn: 0,
    length: source.length, // The length of source
    startIndex: 0,
    startLine: 0,
    startColumn: 0,
    tokenValue: '',
    token: Token.EndOfSource,
    tokenRaw: '',
    peekedToken: Token.EndOfSource,
    peekedState: undefined,
    tokenRegExp: undefined,
    currentChar: source.charCodeAt(0), // current character

    // Used to remember the position of octal numbers / escape sequences
    // so that an error can be reported later (in strict mode).
    octalPos: undefined,
    octalMessage: undefined
  };
}
