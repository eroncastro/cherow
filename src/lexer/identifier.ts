import { Token, descKeywordTable } from '../token';
import { reportAt, Errors } from '../errors';
import { isIdentifierPart } from '../unicode';
import { Chars, CharType, AsciiLookup } from '../chars';
import { Context } from '../common';
import { ParserState } from '../common';
import { fromCodePoint, Escape, nextChar, toHex } from './common';

/**
 * Scans private name
 *
 * @param {ParserState} state
 * @param {Context} context
 * @returns {Token}
 */
export function scanPrivatemame(state: ParserState, context: Context): Token {
  nextChar(state);
  const marker = state.index;
  while ((AsciiLookup[state.currentChar] & CharType.Letters) === CharType.Letters) {
    nextChar(state);
  }
  state.tokenValue = state.source.slice(marker, state.index);
  if (
    (context & Context.OptionsNext) === 0 ||
    AsciiLookup[state.currentChar] & (CharType.Decimal | CharType.WhiteSpace)
  ) {
    reportAt(state, state.index, state.line, state.startIndex, Errors.InvalidPrivateName);
  }
  return Token.PrivateName;
}

/**
 * Scans either identifier or keyword
 *
 * @export
 * @param {ParserState} state
 * @param {Context} context
 * @returns {Token}
 */
export function scanIdentifierOrKeyword(state: ParserState, context: Context): Token {
  let scanFlags = CharType.None;
  if (state.currentChar <= 0x7f) {
    while (AsciiLookup[state.currentChar] & (CharType.IDStart | CharType.Decimal)) {
      scanFlags = scanFlags | AsciiLookup[state.currentChar];
      nextChar(state);
    }

    if (state.index < state.length) scanFlags = scanFlags | AsciiLookup[state.currentChar];
    state.tokenValue = state.source.slice(state.startIndex, state.index);

    if ((scanFlags & CharType.MultiUnitChar) < 1) {
      if (scanFlags & CharType.CannotBeAKeyword) {
        return Token.Identifier;
      }
      // All keywords are of length 2 ≥ length ≥ 10, so we optimize for that
      const len = state.tokenValue.length;
      if (len >= 2 && len <= 11) {
        const keyword: Token | undefined = descKeywordTable[state.tokenValue];
        if (keyword !== undefined) return keyword;
      }
      return Token.Identifier;
    }
  }
  return scanIdentifierOrKeywordSlowPath(state, context, scanFlags);
}

/**
 * Scans either an identifier or keyword (slow path)
 *
 * @param {ParserState} state
 * @param {Context} context
 * @param {string} res
 * @param {CharType} scanFlags
 * @returns {Token}
 */
function scanIdentifierOrKeywordSlowPath(state: ParserState, context: Context, scanFlags: CharType): Token {
  let marker = state.index;
  while (state.index < state.length) {
    // Note: We could check if the 5th bit is set and the 7th bit is unset as we do in
    // string literal scanning, but this is already a "slow path"
    if (AsciiLookup[state.currentChar] & CharType.Backslash) {
      state.tokenValue += state.source.substring(marker, state.index);
      const cookedChar = scanIdentifierUnicodeEscape(state);
      if (!isIdentifierPart(cookedChar)) return Token.Invalid;
      state.tokenValue += fromCodePoint(cookedChar);
      marker = state.index;
    } else if (isIdentifierPart(state.currentChar)) {
      nextChar(state);
    } else {
      break;
    }
  }

  state.tokenValue += state.source.substring(marker, state.index);

  const length = state.tokenValue.length;

  if ((scanFlags & CharType.KeywordCandidate) === CharType.KeywordCandidate && (length >= 2 && length <= 11)) {
    const keyword: Token | undefined = descKeywordTable[state.tokenValue];

    if (keyword === undefined) return Token.Identifier;

    if (context & Context.Strict) {
      return (keyword & Token.FutureReserved) === Token.FutureReserved
        ? Token.EscapedFutureReserved
        : Token.EscapedReserved;
    }
    return (keyword & Token.FutureReserved) === Token.FutureReserved ? keyword : Token.EscapedReserved;
  }

  return Token.Identifier;
}

/**
 * Scans identifier unicode escape
 *
 * @param {ParserState} state
 * @returns {(number | Escape)}
 */
function scanIdentifierUnicodeEscape(state: ParserState): number | Escape {
  nextChar(state);
  if (state.currentChar !== Chars.LowerU)
    reportAt(state, state.index, state.line, state.index - 1, Errors.InvalidEscapeIdentifier);
  // Any escape errors should point to the 'u'
  const errPos = state.index;
  nextChar(state);
  return scanUnicodeEscape(state, errPos);
}

/**
 * Scans unicode escape
 *
 * @param {ParserState} state
 * @param {number} errPos
 * @returns {number}
 */
function scanUnicodeEscape(state: ParserState, errPos: number): number {
  let codePoint = 0;

  if (state.currentChar === Chars.LeftBrace) {
    nextChar(state);
    let hexValue = toHex(state.currentChar);
    if (hexValue < 0) reportAt(state, state.index, state.line, state.index - 1, Errors.InvalidUnicodeEscapeSequence);

    while (hexValue >= 0) {
      codePoint = codePoint * 0x10 + hexValue;
      if (codePoint > Chars.LastUnicodeChar) {
        reportAt(state, errPos, state.line, errPos + 2, Errors.InvalidCodePoint, `${codePoint}`);
      }
      nextChar(state);
      hexValue = toHex(state.currentChar);
    }

    if (codePoint < 0 || (state.currentChar as number) !== Chars.RightBrace) {
      reportAt(state, errPos, state.line, state.index, Errors.InvalidUnicodeEscapeSequence);
    }
    nextChar(state);
  } else {
    for (let i = 0; i < 4; i++) {
      const hexValue = toHex(state.currentChar);
      if (hexValue < 0) {
        reportAt(state, state.index, state.line, errPos, Errors.InvalidUnicodeEscapeSequence);
      }
      codePoint = codePoint * 0x10 + hexValue;
      nextChar(state);
    }
  }

  return codePoint;
}
