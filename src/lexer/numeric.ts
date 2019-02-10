import { Token } from '../token';
import { reportAt, Errors } from '../errors';
import { isIdentifierStart } from '../unicode';
import { Chars } from '../chars';
import { Context } from '../common';
import { ParserState } from '../common';
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
export function scanNumericLiterals(state: ParserState, context: Context, isFloat: boolean): Token {
  let kind = ScannerFlags.Decimal;
  let isNotFloat = !isFloat;
  const marker = state.index;

  if (!isFloat) {
    if (state.currentChar === Chars.Zero) {
      nextChar(state);
      const lowerCasedLetters = state.currentChar | 32;
      // Hex
      if (lowerCasedLetters === Chars.LowerX) {
        nextChar(state);
        kind = ScannerFlags.Hex;
        state.tokenValue = scanHexDigits(state, marker);
        // Octal
      } else if (lowerCasedLetters === Chars.LowerO) {
        nextChar(state);
        kind = ScannerFlags.Octal;
        state.tokenValue = scanOctalDigits(state, marker);
        // Binary
      } else if (lowerCasedLetters === Chars.LowerB) {
        nextChar(state);
        kind = ScannerFlags.Binary;
        state.tokenValue = scanBinaryDigits(state, marker);
      } else if (state.currentChar >= Chars.Zero && state.currentChar <= Chars.Nine) {
        kind = ScannerFlags.ImplicitOctal;
        state.tokenValue = scanImplicitOctalDigits(state, context, marker);
        // It's invalid if we found a '8' or '9' during the scan
        if (state.tokenValue === Escape.Invalid) {
          kind = ScannerFlags.LeadingDecimal;
          isNotFloat = false;
        }
      } else if (state.currentChar < Chars.Zero || state.currentChar > Chars.Seven) {
        kind = ScannerFlags.LeadingDecimal;
      } else isNotFloat = false;
    }
  }

  if (kind & (ScannerFlags.Decimal | ScannerFlags.LeadingDecimal)) {
    if (isNotFloat) {
      let digit = 9;
      while (state.currentChar >= Chars.Zero && state.currentChar <= Chars.Nine && digit >= 0) {
        state.tokenValue = 10 * (state.tokenValue as number) + (state.currentChar - Chars.Zero);
        nextChar(state);
        --digit;
      }
      if (digit >= 0 && state.currentChar !== Chars.Period && !isIdentifierStart(state.currentChar)) {
        return Token.NumericLiteral;
      }
    }

    if (state.currentChar === Chars.Period) {
      nextChar(state);
      while (state.currentChar >= Chars.Zero && state.currentChar <= Chars.Nine) {
        nextChar(state);
      }
    }
  }

  let isBigInt = false;

  if (
    context & Context.OptionsNext &&
    !isFloat &&
    state.currentChar === Chars.LowerN &&
    kind & ScannerFlags.DecimalOrHexOrOctalOrBinary
  ) {
    isBigInt = true;

    nextChar(state);
  } else if ((state.currentChar | 32) === Chars.LowerE) {
    if ((kind & (ScannerFlags.Decimal | ScannerFlags.LeadingDecimal)) === 0) {
      reportAt(state, marker, state.line, state.column, Errors.StrictDecimalWithLeadingZero);
    }
    nextChar(state);

    if ((state.currentChar as number) === Chars.Plus || (state.currentChar as number) === Chars.Hyphen) {
      nextChar(state);
    }
    let digits = 0;

    while (state.currentChar >= Chars.Zero && state.currentChar <= Chars.Nine) {
      nextChar(state);
      digits++;
    }
    // we must have at least one decimal digit after 'e'/'E'
    if (digits < 1) reportAt(state, marker, state.line, state.column, Errors.MissingExponent);
  }
  if ((state.currentChar >= Chars.Zero && state.currentChar <= Chars.Nine) || isIdentifierStart(state.currentChar)) {
    reportAt(state, marker, state.line, state.column, Errors.IDStartAfterNumber);
  }
  if (kind & ScannerFlags.LeadingDecimal) {
    state.octalPos = { index: state.index, line: state.line, column: state.index - 1 };
    state.octalMessage = Errors.StrictDecimalWithLeadingZero;
  }
  if ((kind & ScannerFlags.HexOrOctalOrBinaryOrImplicit) < 1) {
    state.tokenValue =
      kind & ScannerFlags.LeadingDecimal
        ? parseFloat(state.source.slice(marker, state.index))
        : isBigInt
        ? parseInt(state.source.slice(marker, state.index), 10)
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
