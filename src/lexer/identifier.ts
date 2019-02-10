import { Token, descKeywordTable } from '../token';
import { report, reportAt, Errors } from '../errors';
import { isIdentifierStart, isIdentifierPart } from '../unicode';
import { Chars, CharType, AsciiLookup } from '../chars';
import { Context } from '../common';
import { ParserState } from '../common';
import { ScannerFlags, Escape, nextChar, toHex, getMostLikelyUnicodeChar, fromCodePoint } from './common';

/**
 * Scans maybe identifier. This is a 'slow path', but optimized
 * to be a litle faster
 *
 * @param {ParserState} state
 * @returns {(Token | void)}
 */
export function scanMaybeIdentifier(state: ParserState): Token | void {
  if ((state.currentChar ^ Chars.ParagraphSeparator) <= 1) {
    state.flags = (state.flags & ~ScannerFlags.LastIsCR) | ScannerFlags.PrecedingLineBreak;
    state.currentChar = state.source.charCodeAt(++state.index);
    state.column = 0;
    state.line++;
    return Token.WhiteSpace;
  }

  /* exotic whitespace */
  switch (state.currentChar) {
    case Chars.NonBreakingSpace:
    case Chars.Ogham:
    case Chars.EnQuad:
    case Chars.EmQuad:
    case Chars.EnSpace:
    case Chars.EmSpace:
    case Chars.ThreePerEmSpace:
    case Chars.FourPerEmSpace:
    case Chars.SixPerEmSpace:
    case Chars.FigureSpace:
    case Chars.PunctuationSpace:
    case Chars.ThinSpace:
    case Chars.HairSpace:
    case Chars.NarrowNoBreakSpace:
    case Chars.MathematicalSpace:
    case Chars.IdeographicSpace:
    case Chars.ZeroWidthNoBreakSpace:
      nextChar(state);
      return Token.WhiteSpace;
    default:
      getMostLikelyUnicodeChar(state);
      if (!isIdentifierStart(state.currentChar)) {
        reportAt(
          state,
          state.index,
          state.line,
          state.startIndex,
          Errors.IllegalCaracter,
          fromCodePoint(state.currentChar)
        );
      }
      state.tokenValue = state.source.slice(state.startIndex, state.index);
      return Token.Identifier;
  }
}

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
  let scanFlags = AsciiLookup[state.currentChar];
  while (state.index < state.length) {
    const charFlags = AsciiLookup[state.currentChar];
    scanFlags |= state.currentChar > 127 ? CharType.SlowPath : charFlags;
    if (scanFlags & (CharType.SlowPath | CharType.WhiteSpace)) break;
    nextChar(state);
  }

  state.tokenValue = state.source.slice(state.startIndex, state.index);

  if ((scanFlags & CharType.SlowPath) !== CharType.SlowPath) {
    if ((scanFlags & CharType.NoKeywordCandidate) === CharType.NoKeywordCandidate) {
      return Token.Identifier;
    }

    const len = state.tokenValue.length;
    if (len >= 2 && len <= 11) {
      const keyword: Token | undefined = descKeywordTable[state.tokenValue];
      if (keyword !== undefined) return keyword;
    }
    return Token.Identifier;
  }

  return scanIdentifierOrKeywordSlowPath(state, context, state.tokenValue, scanFlags);
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
function scanIdentifierOrKeywordSlowPath(
  state: ParserState,
  context: Context,
  res: string,
  scanFlags: CharType
): Token {
  let identStart = state.index;

  while (state.index < state.length) {
    if (state.currentChar === Chars.Backslash) {
      res += state.source.substring(identStart, state.index);
      const cookedChar = scanIdentifierUnicodeEscape(state, context);
      if (!isIdentifierPart(cookedChar)) return Token.Invalid;
      res += String.fromCodePoint(cookedChar);
      identStart = state.index;
    } else if (isIdentifierPart(state.currentChar)) {
      nextChar(state);
    } else {
      break;
    }
  }

  state.tokenValue = res += state.source.substring(identStart, state.index);

  if (
    (scanFlags & CharType.KeywordCandidate) === CharType.KeywordCandidate &&
    (state.tokenValue.length >= 2 && state.tokenValue.length <= 11)
  ) {
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
 * @param {Context} _
 * @returns {(number | Escape)}
 */
function scanIdentifierUnicodeEscape(state: ParserState, _: Context): number | Escape {
  nextChar(state);
  if (state.currentChar !== Chars.LowerU)
    reportAt(state, state.index, state.line, state.index - 1, Errors.InvalidUnicodeEscapeSequence);
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