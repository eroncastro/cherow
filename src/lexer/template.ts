import { Token } from '../token';
import { reportAt, Errors } from '../errors';
import { Chars, CharType, AsciiLookup } from '../chars';
import { Context } from '../common';
import { ParserState } from '../common';
import { Escape, nextChar, fromCodePoint } from './common';
import { scanEscape } from './string';

/**
 * Scans template literal
 *
 * @export
 * @param {ParserState} state
 * @param {Context} context
 * @param {boolean} fromTick
 * @returns {(Token | void)}
 */
export function scanTemplate(state: ParserState, context: Context, fromTick: boolean): Token | void {
  let hasBadEscapes = false;
  let marker = state.index;

  while (state.index < state.length) {
    nextChar(state);
    while (state.currentChar === Chars.Dollar) {
      nextChar(state);
      if ((state.currentChar as number) === Chars.LeftBrace) {
        nextChar(state);
        state.tokenValue = state.source.slice(marker, state.index);
        return (fromTick ? Token.TemplateHead : Token.TemplateMiddle) | (hasBadEscapes ? Token.BadEscape : 0);
      }
    }

    if (state.currentChar === Chars.Backtick) {
      state.tokenValue += state.source.slice(marker, state.index);
      nextChar(state);
      return (fromTick ? Token.NoSubstitutionTemplate : Token.TemplateTail) | (hasBadEscapes ? Token.BadEscape : 0);
    }

    if (AsciiLookup[state.currentChar] & CharType.SlowPath) {
      nextChar(state);
      const code = scanEscape(state, context, /* isTemplate */ true);
      // For raw template literal syntax, we have already consumed `NotEscapeSequence`,
      // so all we have to do is to set the local boolean to 'true' if the escapes are incomplete
      if (code === Escape.Incomplete) hasBadEscapes = true;
      else if (code === Escape.Invalid) return Token.Invalid;
      state.tokenValue += fromCodePoint(code);
      marker = state.index;
    }
  }

  reportAt(state, marker, state.line, marker + 2, Errors.UnterminatedTemplate);
}
