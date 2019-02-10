import { Chars } from './chars';
import { Token } from './token';
import { Errors } from './errors';

/**
 * The core context, passed around everywhere as a simple immutable bit set.
 */
export const enum Context {
  None = 0,

  OptionsNext = 1 << 0,
  OptionsRanges = 1 << 1,
  OptionsLoc = 1 << 2,
  OptionsDirectives = 1 << 3,
  OptionsJSX = 1 << 4,
  OptionsGlobalReturn = 1 << 5,
  OptionsGlobalAwait = 1 << 6,
  OptionsExperimental = 1 << 7,
  OptionsWebCompat = 1 << 8,
  OptionsRaw = 1 << 9,
  Strict = 1 << 10,
  Module = 1 << 11,

  AllowRegExp = 1 << 14,
  AllowTemplate = 1 << 15
}

/**
 * The mutable parser flags, in case any flags need passed by reference.
 */
export const enum Flags {
  None = 0
}

/**
 * The 'OctalPos' interface
 */
export interface OctalPos {
  index: number;
  line: number;
  column: number;
}

/**
 * The 'OctalPos' interface
 */
export interface OctalPos {
  index: number;
  line: number;
  column: number;
}
/**
 * The parser interface.
 */
export interface ParserState {
  source: string;

  flags: Flags;
  index: number;
  line: number;
  column: number;
  length: number;
  startIndex: number;
  token: Token;
  tokenValue: any;
  tokenRaw: string;
  tokenRegExp: void | {
    pattern: string;
    flags: string;
  };
  octalPos: OctalPos;
  octalMessage: Errors;
  currentChar: number;
  seenDelimitedCommentEnd: boolean;
}

export function toHex(code: number): number {
  if (code < Chars.Zero) return -1;
  if (code <= Chars.Nine) return code - Chars.Zero;
  if (code < Chars.UpperA) return -1;
  if (code <= Chars.UpperF) return code - Chars.UpperA + 10;
  if (code < Chars.LowerA) return -1;
  if (code <= Chars.LowerF) return code - Chars.LowerA + 10;
  return -1;
}

export function fromCodePoint(code: number): string {
  if (code > 0xffff) {
    return String.fromCharCode(code >>> 10) + String.fromCharCode(code & 0x3ff);
  } else {
    return String.fromCharCode(code);
  }
}
