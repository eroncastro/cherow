import { ParserState, Context, Flags } from '../common';
import { Chars } from '../chars';
import { report, Errors } from '../errors';
import { ScannerFlags, nextChar } from './common';

/**
 * Skips hashbang - Stage 3 proposal
 *
 * @param {ParserState} state
 * @param {Context} context
 */
export function skipHashBang(state: ParserState, context: Context, type: ScannerFlags): void {
  if (
    context & Context.OptionsNext &&
    state.currentChar === Chars.Hash &&
    state.source.charCodeAt(state.index + 1) === Chars.Exclamation
  ) {
    skipSingleLineComment(state, type);
  }
}

/**
 * Skips single line comments
 *
 * @param {ParserState} state
 * @param {ScannerFlags} type
 * @returns {ScannerFlags}
 */
export function skipSingleLineComment(state: ParserState, type: ScannerFlags): ScannerFlags {
  while (state.index < state.length) {
    const next = state.source.charCodeAt(state.index);

    if ((next - 0xe) & 0x2000) {
      if (next === Chars.CarriageReturn) {
        state.index++;
        state.column = 0;
        state.line++;
        if (state.index < state.length && state.source.charCodeAt(state.index) === Chars.LineFeed) state.index++;
        state.flags |= Flags.PrecedingLineBreak;
        return (type |= ScannerFlags.NewLine);
      } else if (next === Chars.LineFeed || (next ^ Chars.ParagraphSeparator) <= 1) {
        state.index++;
        state.column = 0;
        state.line++;
        state.flags |= Flags.PrecedingLineBreak;
        return (type |= ScannerFlags.NewLine);
      }
    }
    nextChar(state);
  }

  return type;
}

/**
 * Skips a multiline comment. It's highly optimized
 * and does a fast check for characters that require special handling.
 *
 * @param {ParserState} state
 * @param {ScannerFlags} type
 * @returns {*}
 */
export function skipMultilineComment(state: ParserState, type: ScannerFlags): any {
  while (state.index < state.length) {
    const next = state.source.charCodeAt(state.index);
    if ((next - 0xe) & 0x2000) {
      if (next === Chars.CarriageReturn) {
        state.flags |= Flags.PrecedingLineBreak;
        type |= ScannerFlags.NewLine | ScannerFlags.LastIsCR;
        state.index++;
        state.column = 0;
        state.line++;
      } else if (next === Chars.LineFeed) {
        state.index++;
        if ((type & ScannerFlags.LastIsCR) < 1) {
          state.column = 0;
          state.line++;
        }
        type = (type & ~ScannerFlags.LastIsCR) | ScannerFlags.NewLine;
      } else if ((next ^ Chars.ParagraphSeparator) <= 1) {
        type = (type & ~ScannerFlags.LastIsCR) | ScannerFlags.NewLine;
        state.flags |= Flags.PrecedingLineBreak;
        state.index++;
        state.column = 0;
        state.line++;
      }
    } else if (next === Chars.Asterisk) {
      nextChar(state);
      type = type & ~ScannerFlags.LastIsCR;
      if (state.currentChar === Chars.Slash) {
        nextChar(state);
        return type;
      }
    } else {
      type = type & ~ScannerFlags.LastIsCR;
      nextChar(state);
    }
  }
  // Unterminated multi-line comment.
  report(state, Errors.UnterminatedComment);
}
