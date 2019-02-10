import { Token } from '../token';
import { reportAt, Errors } from '../errors';
import { Chars, CharType, AsciiLookup } from '../chars';
import { Context } from '../common';
import { ParserState } from '../common';
import { Escape, nextChar, toHex, fromCodePoint } from './common';

/**
 * Scans string literal
 *
 * @param {ParserState} state
 * @param {Context} context
 * @returns {(Token | void)}
 */
export function scanStringLiteral(state: ParserState, context: Context): Token | void {
  const quote = state.currentChar;
  nextChar(state); // consume quote

  let marker = state.index;

  while (state.index < state.length) {
    if (state.currentChar === quote) {
      state.tokenValue += state.source.slice(marker, state.index);
      nextChar(state);
      return Token.StringLiteral;
    }

    if (AsciiLookup[state.currentChar] & CharType.Backslash) {
      state.tokenValue += state.source.slice(marker, state.index);
      nextChar(state);
      const code = scanEscape(state, context, /* isTemplate */ false);
      if (code < 0) return Token.Invalid; // Note: This will throw in the parser
      state.tokenValue += fromCodePoint(code);
      marker = state.index;
      continue;
    }

    // Optimized to make JSON subset of JS, and it also do a
    // fast check for characters that require special handling.
    if (state.currentChar - 0xe && AsciiLookup[state.currentChar] & CharType.LineTerminator) {
      break;
    }

    nextChar(state);
  }

  reportAt(state, marker, state.line, marker, Errors.UnterminatedString);
}

/**
 * Scans string and template escapes
 *
 * @param {ParserState} state
 * @param {Context} context
 * @param {boolean} isTemplate
 * @returns {number}
 */
export function scanEscape(state: ParserState, context: Context, isTemplate: boolean): number {
  const char = state.currentChar;
  nextChar(state);

  switch (char) {
    case Chars.LowerB:
      return Chars.Backspace;
    case Chars.LowerT:
      return Chars.Tab;
    case Chars.LowerN:
      return Chars.LineFeed;
    case Chars.LowerV:
      return Chars.VerticalTab;
    case Chars.LowerF:
      return Chars.FormFeed;
    case Chars.LowerR:
      return Chars.CarriageReturn;
    case Chars.DoubleQuote:
      return Chars.DoubleQuote;
    case Chars.SingleQuote:
      return Chars.SingleQuote;
    case Chars.Backslash:
      return Chars.Backslash;
    case Chars.LowerU: {
      let codePoint = 0;

      if (state.currentChar === Chars.LeftBrace) {
        const beginPos = state.index - 2;
        nextChar(state);
        let digit = toHex(state.currentChar);
        if (digit < 0) reportAt(state, state.index, state.line, beginPos, Errors.InvalidUnicodeEscapeSequence);
        while (digit >= 0) {
          codePoint = codePoint * 0x10 + digit;
          if (codePoint > Chars.LastUnicodeChar) {
            reportAt(state, beginPos, state.line, state.index - 1, Errors.InvalidCodePoint, `${codePoint}`);
          }
          nextChar(state);
          digit = toHex(state.currentChar);
        }
        if (codePoint < 0 || (state.currentChar as number) !== Chars.RightBrace) {
          reportAt(state, state.index, state.line, beginPos, Errors.InvalidUnicodeEscapeSequence);
        }
        nextChar(state); // '}'
      } else {
        const beginPos = state.index - 2;
        for (let i = 0; i < 4; i++) {
          const digit = toHex(state.currentChar);
          if (digit < 0) {
            reportAt(
              state,
              state.index,
              state.line,
              beginPos,
              isTemplate ? Errors.InvalidHexEscapeSequence : Errors.InvalidUnicodeEscapeSequence
            );
          }
          codePoint = codePoint * 0x10 + digit;
          nextChar(state);
        }
      }

      return codePoint;
    }
    case Chars.LowerX: {
      let codePoint = 0;
      const beginPos = state.index - 2;
      for (let i = 0; i < 2; i++) {
        const digit = toHex(state.currentChar);

        if (digit < 0) {
          reportAt(
            state,
            state.startIndex,
            state.line,
            beginPos + 3,
            isTemplate ? Errors.InvalidHexEscapeSequence : Errors.InvalidUnicodeEscapeSequence
          );
        }
        codePoint = codePoint * 0x10 + digit;
        nextChar(state);
      }

      return codePoint;
    }
    case Chars.Zero:
    case Chars.One:
    case Chars.Two:
    case Chars.Three:
    case Chars.Four:
    case Chars.Five:
    case Chars.Six:
    case Chars.Seven: {
      let codePoint = char - Chars.Zero;
      let idx = 0;
      for (; idx < 2; idx++) {
        const digit = state.currentChar - Chars.Zero;
        if (digit < 0 || digit > 7) break;
        const nx = codePoint * 8 + digit;
        if (nx >= 256) break;
        codePoint = nx;
        nextChar(state);
      }
      // The only valid numeric escape in strict mode is '\0', and this must not be followed by a decimal digit.
      if (char !== Chars.Zero || idx > 0 || (state.currentChar >= Chars.Zero && state.currentChar <= Chars.Seven)) {
        // Octal escape sequences are not allowed inside string template literals
        if (context & Context.Strict || isTemplate)
          reportAt(
            state,
            state.index,
            state.line,
            state.index - 1,
            isTemplate ? Errors.TemplateOctalLiteral : Errors.StrictOctalEscape
          );
        state.octalPos = { index: state.index, line: state.line, column: state.index - 1 };
        state.octalMessage = isTemplate ? Errors.TemplateOctalLiteral : Errors.StrictOctalEscape;
      }

      return codePoint;
    }
    case Chars.Eight:
    case Chars.Nine:
      reportAt(state, state.startIndex, state.line, state.index + 3, Errors.InvalidEightAndNine);

    // Line continuations
    case Chars.CarriageReturn: {
      const i = state.index;

      if (i < state.length) {
        const ch = state.source.charCodeAt(i);
        if (ch === Chars.LineFeed) {
          state.index = i + 1;
        }
      }
    }
    // Falls through
    case Chars.LineSeparator: // 0x2028, classifies as new line
    case Chars.ParagraphSeparator: // 0x2029, classifies as new line
    case Chars.LineFeed: // 0xA
      state.column = -1;
      state.line++;
      return Escape.None;
    default:
      return char;
  }
}
