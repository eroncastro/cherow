import { ParserState } from '../common';
import { Chars } from '../chars';
import { Token } from '../token';
import { report, Errors } from '../errors';
import { ScannerFlags, nextChar } from './common';

/**
 * Skips a multiline comment. It's highly optimized
 * and does a fast check for characters that require special handling.
 *
 * @param {ParserState} state
 * @returns {(Token | void)}
 */
export function skipMultilineComment(state: ParserState): Token | void {
  while (state.index < state.length) {
    const next = state.currentChar;
    if ((next - 0xe) & 0x2000) {
      if (next === Chars.CarriageReturn) {
        state.flags |= ScannerFlags.PrecedingLineBreak | ScannerFlags.LastIsCR;
        state.currentChar = state.source.charCodeAt(++state.index);
        state.column = 0;
        state.line++;
      } else if (next === Chars.LineFeed) {
        state.currentChar = state.source.charCodeAt(++state.index);
        if ((state.flags & ScannerFlags.LastIsCR) === 0) {
          state.column = 0;
          state.line++;
        }
        state.flags = (state.flags & ~ScannerFlags.LastIsCR) | ScannerFlags.PrecedingLineBreak;
      } else if ((state.currentChar ^ Chars.ParagraphSeparator) <= 1) {
        state.flags = (state.flags & ~ScannerFlags.LastIsCR) | ScannerFlags.PrecedingLineBreak;
        state.currentChar = state.source.charCodeAt(++state.index);
        state.column = 0;
        state.line++;
      }
    } else if (next === Chars.Asterisk) {
      nextChar(state);
      state.flags &= ~ScannerFlags.LastIsCR;
      if (state.currentChar === Chars.Slash) {
        nextChar(state);
        return Token.WhiteSpace;
      }
    } else {
      nextChar(state);
    }
  }

  // Unterminated multi-line comment.
  report(state, Errors.UnterminatedComment);
}

/**
 * Skips single line comments
 *
 * @param {ParserState} state
 * @returns {Token}
 */
export function skipSingleLineComment(state: ParserState): Token {
  while (state.index < state.source.length) {
    const next = state.currentChar;
    if ((next - 0xe) & 0x2000) {
      if (next === Chars.CarriageReturn) {
        state.currentChar = state.source.charCodeAt(++state.index);
        state.column = 0;
        state.line++;
        if (state.index < state.source.length && state.source.charCodeAt(state.index) === Chars.LineFeed) state.index++;
        state.flags |= ScannerFlags.PrecedingLineBreak;
        return Token.WhiteSpace;
      } else if (next === Chars.LineFeed || (next ^ Chars.ParagraphSeparator) <= 1) {
        state.flags |= ScannerFlags.PrecedingLineBreak;
        ++state.line;
        state.currentChar = state.source.charCodeAt(++state.index);
        state.column = 0;
        return Token.WhiteSpace;
      }
    }
    nextChar(state);
  }

  return Token.WhiteSpace;
}
