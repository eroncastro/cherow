import { Token } from '../token';
import { reportAt, Errors } from '../errors';
import { isIdentifierStart } from '../unicode';
import { Chars, AsciiLookup, CharType } from '../chars';
import { ParserState, Context, fromCodePoint } from '../common';
import { ScannerFlags, Escape, nextChar, toHex } from './common';

/**
 * Scan numbers
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-NumericLiteral)
 *
 * @param {ParserState} state
 * @param {Context} context
 * @param {boolean} isFloat
 * @returns {Token}
 */
export function scanNumericLiterals(state: ParserState, context: Context, type: ScannerFlags): Token {
  let isNotFloat = (type & ScannerFlags.IsFloat) === 0;
  const marker = state.index;
  let leadingErrPos = marker;

  if ((type & ScannerFlags.IsFloat) === 0) {
    if (state.currentChar === Chars.Zero) {
      nextChar(state);
      const lowerCasedLetters = state.currentChar | 32;
      // Hex
      if (lowerCasedLetters === Chars.LowerX) {
        nextChar(state);
        type = ScannerFlags.Hex;
        state.tokenValue = scanHexDigits(state, marker);
        // Octal
      } else if (lowerCasedLetters === Chars.LowerO) {
        nextChar(state);
        type = ScannerFlags.Octal;
        state.tokenValue = scanOctalDigits(state, marker);
        // Binary
      } else if (lowerCasedLetters === Chars.LowerB) {
        nextChar(state);
        type = ScannerFlags.Binary;
        state.tokenValue = scanBinaryDigits(state, marker);
      } else if (AsciiLookup[state.currentChar] & CharType.Decimal) {
        type = ScannerFlags.ImplicitOctal;
        state.tokenValue = scanImplicitOctalDigits(state, context, marker);
        if (state.tokenValue === Escape.Invalid) {
          type = ScannerFlags.LeadingDecimal;
          leadingErrPos = state.index;
          isNotFloat = false;
        }
      } else if (state.currentChar < Chars.Zero || state.currentChar > Chars.Seven) {
        type = ScannerFlags.LeadingDecimal;
      } else isNotFloat = false;
    }
  }

  if (type & (ScannerFlags.Decimal | ScannerFlags.LeadingDecimal)) {
    if (isNotFloat) {
      let digit = 9;
      while (AsciiLookup[state.currentChar] & CharType.Decimal && digit >= 0) {
        state.tokenValue = 0xa * (state.tokenValue as number) + (state.currentChar - Chars.Zero);
        nextChar(state);
        --digit;
      }
      if (digit >= 0 && state.currentChar !== Chars.Period && !isIdentifierStart(state.currentChar)) {
        return Token.NumericLiteral;
      }
      // Note: There will be remaining digits if the length of the significant digits exceeds 10 (*more than 4-bit*), so
      // we need to continue scanning until we reach the maximum numbers of digits.
      while (AsciiLookup[state.currentChar] & CharType.Decimal) {
        nextChar(state);
      }
    }

    if (state.currentChar === Chars.Period) {
      nextChar(state);
      while (AsciiLookup[state.currentChar] & CharType.Decimal) {
        nextChar(state);
      }
    }
  }

  let isBigInt = false;

  if (
    context & Context.OptionsNext &&
    (type & ScannerFlags.IsFloat) === 0 &&
    state.currentChar === Chars.LowerN &&
    type & ScannerFlags.DecimalOrHexOrOctalOrBinary
  ) {
    isBigInt = true;

    nextChar(state);
  } else if ((state.currentChar | 32) === Chars.LowerE) {
    if ((type & (ScannerFlags.Decimal | ScannerFlags.LeadingDecimal)) < 1) {
      reportAt(state, marker, state.line, state.column, Errors.StrictDecimalWithLeadingZero);
    }
    nextChar(state);

    // '_', '+'
    if (AsciiLookup[state.currentChar] & CharType.Exponent) {
      nextChar(state);
    }

    // we must have at least one decimal digit after 'e'/'E'
    if ((AsciiLookup[state.currentChar] & CharType.Decimal) < 1)
      reportAt(state, marker, state.line, state.index, Errors.MissingExponent);

    while (AsciiLookup[state.currentChar] & CharType.Decimal) {
      nextChar(state);
    }
  }

  // This case is only to prevent `3in x` and `3instanceof x` cases.
  // The next character must not be an identifier start or decimal digit.
  if (AsciiLookup[state.currentChar] & (CharType.Decimal | CharType.Letters) || isIdentifierStart(state.currentChar)) {
    type & ScannerFlags.LeadingDecimal
      ? reportAt(state, marker, state.line, leadingErrPos - 1, Errors.InvalidImplicitOctals)
      : reportAt(state, marker, state.line, marker, Errors.IDStartAfterNumber);
  }
  if (type & ScannerFlags.LeadingDecimal) {
    state.octalPos = { index: state.index, line: state.line, column: state.index - 1 };
    state.octalMessage = Errors.StrictDecimalWithLeadingZero;
  }
  if ((type & ScannerFlags.HexOrOctalOrBinaryOrImplicit) < 1) {
    state.tokenValue =
      type & ScannerFlags.LeadingDecimal
        ? parseFloat(state.source.slice(marker, state.index))
        : isBigInt
        ? parseInt(state.source.slice(marker, state.index), 0xa)
        : +state.source.slice(marker, state.index);
  }

  return isBigInt ? Token.BigIntLiteral : Token.NumericLiteral;
}

/**
 * Scans implicit octal digits
 *
 * @param {ParserState} state
 * @param {Context} context
 * @param {number} startPos
 * @returns {number}
 */
function scanImplicitOctalDigits(state: ParserState, context: Context, startPos: number): number {
  if (context & Context.Strict) {
    reportAt(state, startPos, state.line, state.column, Errors.StrictDecimalWithLeadingZero);
  }

  let implicitValue = 0;
  while (state.index < state.length) {
    if (state.currentChar < Chars.Zero || state.currentChar > Chars.Seven) {
      nextChar(state);
      return Escape.Invalid;
    }
    implicitValue = implicitValue * 8 + (state.currentChar - Chars.Zero);
    nextChar(state);
  }
  state.octalPos = { index: startPos, line: state.line, column: state.column };
  state.octalMessage = Errors.StrictOctalLiteral;

  return implicitValue;
}

/**
 * Scan hex decimal literal
 *
 * @param {ParserState} state
 * @param {number} startPos
 * @returns {number}
 */
function scanHexDigits(state: ParserState, startPos: number): number {
  let hexValue = 0;
  let digit = toHex(state.currentChar);

  if (digit < 0) reportAt(state, startPos, state.line, startPos + 2, Errors.MissingHexDigits);
  do {
    hexValue = hexValue * 0x10 + digit;
    nextChar(state);
    digit = toHex(state.currentChar);
  } while (digit >= 0);

  return hexValue;
}

/**
 * Scans octal digits
 *
 * @param {ParserState} state
 * @param {number} startPos
 * @returns {number}
 */
function scanOctalDigits(state: ParserState, startPos: number): number {
  let octalValue = 0;
  let digits = 0;
  while (state.currentChar >= Chars.Zero && state.currentChar <= Chars.Seven) {
    octalValue = octalValue * 8 + (state.currentChar - Chars.Zero);
    nextChar(state);
    digits++;
  }
  if (digits < 1) reportAt(state, startPos, state.line, startPos + 2, Errors.ExpectedNumberInRadix, `${8}`);
  return octalValue;
}

/**
 * Scans binary digits
 *
 * @param {ParserState} state
 * @param {number} startPos
 * @returns {number}
 */
function scanBinaryDigits(state: ParserState, startPos: number): number {
  let binaryValue = 0;
  let digits = 0;
  while (state.currentChar >= Chars.Zero && state.currentChar <= Chars.One) {
    binaryValue = binaryValue * 2 + (state.currentChar - Chars.Zero);
    nextChar(state);
    digits++;
  }
  if (digits < 1) reportAt(state, startPos, state.line, startPos + 2, Errors.ExpectedNumberInRadix, `${2}`);
  return binaryValue;
}
