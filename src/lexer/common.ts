import { ParserState } from '../common';
import { Chars } from '../chars';

/* @internal */
export const enum ScannerFlags {
  None = 0,
  NewLine = 1 << 0,
  SameLine = 1 << 1,
  LastIsCR = 1 << 2,
  SeenDelimitedCommentEnd = 1 << 3, // Used to parse --> closing html comment properly
  Decimal = 1 << 4,
  IsFloat = 1 << 5,
  LeadingDecimal = 1 << 6,
  Hex = 1 << 8,
  Octal = 1 << 10,
  Binary = 1 << 12,
  ImplicitOctal = 1 << 14,
  DecimalOrHexOrOctalOrBinary = Decimal | Hex | Octal | Binary,
  HexOrOctalOrBinaryOrImplicit = Hex | Octal | Binary | ImplicitOctal
}

/* @internal */
export const enum Escape {
  None = 0,
  Incomplete = -2,
  Invalid = -1
}

/**
 * Returns the next char in the stream if not EOL
 *
 * @param {ParserState} state
 */
export function nextChar(state: ParserState): void {
  state.currentChar = 0;
  state.column++;
  state.index++;
  if (state.index <= state.length) state.currentChar = state.source.charCodeAt(state.index);
}

/**
 * Get next most likely unicode char in the stream
 *
 * @param {ParserState} state
 */
export function getMostLikelyUnicodeChar(state: ParserState): void {
  const hi = state.source.charCodeAt(state.index++);
  state.currentChar = hi;
  if (state.currentChar >= 0xd800 && state.currentChar <= 0xdbff) {
    const lo = state.source.charCodeAt(state.index);
    // Check if it's a low surrogate
    if (lo >= 0xdc00 && lo <= 0xdfff) {
      state.currentChar = ((hi & 0x3ff) << 10) | (lo & 0x3ff) | 0x10000;
      state.index++;
    }
  }

  state.column++;
}

/**
 * Converts a value to hex
 *
 * @param {number} code
 * @returns {number}
 */
export function toHex(code: number): number {
  if (code < Chars.Zero) return -1;
  if (code <= Chars.Nine) return code - Chars.Zero;
  if (code < Chars.UpperA) return -1;
  if (code <= Chars.UpperF) return code - Chars.UpperA + 10;
  if (code < Chars.LowerA) return -1;
  if (code <= Chars.LowerF) return code - Chars.LowerA + 10;
  return -1;
}

/**
 * Optimized version of 'fromCodePoint'
 *
 * @param {number} code
 * @returns {string}
 */
export function fromCodePoint(code: number): string {
  if (code > 0xffff) {
    return String.fromCharCode(code >>> 10) + String.fromCharCode(code & 0x3ff);
  } else {
    return String.fromCharCode(code);
  }
}
