import { ParserState } from './common';

/*@internal*/
export const enum Errors {
  StrictOctalEscape,
  TemplateOctalLiteral,
  InvalidPrivateName,
  InvalidUnicodeEscapeSequence,
  InvalidCodePoint,
  InvalidHexEscapeSequence,
  StrictDecimalWithLeadingZero,
  StrictOctalLiteral,
  ExpectedNumberInRadix,
  MissingExponent,
  InvalidBigInt,
  IDStartAfterNumber,
  InvalidEightAndNine,
  UnterminatedString,
  UnterminatedTemplate,
  UnterminatedComment,
  InvalidDynamicUnicode,
  IllegalCaracter,
  MissingHexDigits,
  InvalidImplicitOctals,
  InvalidStringLT,
  InvalidEscapeIdentifier
}
/*@internal*/
export const errorMessages: {
  [key: string]: string;
} = {
  [Errors.StrictOctalEscape]: 'Octal escape sequences are not allowed in strict mode',
  [Errors.TemplateOctalLiteral]: 'Octal escape sequences are not allowed in template strings',
  [Errors.InvalidPrivateName]: 'Unexpected token `#`',
  [Errors.InvalidUnicodeEscapeSequence]: 'Invalid Unicode escape sequence',
  [Errors.InvalidCodePoint]: 'Invalid code point %0',
  [Errors.InvalidHexEscapeSequence]: 'Invalid hexadecimal escape sequence',
  [Errors.StrictOctalLiteral]: 'Octal literals are not allowed in strict mode',
  [Errors.StrictDecimalWithLeadingZero]: 'Decimal integer literals with a leading zero are forbidden in strict mode',
  [Errors.ExpectedNumberInRadix]: 'Expected number in radix %0',
  [Errors.MissingExponent]: 'Non-number found after exponent indicator',
  [Errors.InvalidBigInt]: 'Invalid BigIntLiteral',
  [Errors.IDStartAfterNumber]: 'No identifiers allowed directly after numeric literal',
  [Errors.InvalidEightAndNine]: 'Escapes \\8 or \\9 are not syntactically valid escapes',
  [Errors.UnterminatedString]: 'Unterminated string literal',
  [Errors.UnterminatedTemplate]: 'Unterminated template literal',
  [Errors.UnterminatedComment]: 'Multiline comment was not closed properly',
  [Errors.InvalidDynamicUnicode]: 'The identifier contained dynamic unicode escape that was not closed',
  [Errors.IllegalCaracter]: "Illegal character '%0'",
  [Errors.MissingHexDigits]: 'Missing hex digits',
  [Errors.InvalidImplicitOctals]: 'Invalid implicit octal',
  [Errors.InvalidStringLT]: 'Invalid line break in string literal',
  [Errors.InvalidEscapeIdentifier]: 'Only unicode escapes are legal in identifier names'
};

export class ParseError extends SyntaxError {
  public index: number;
  public line: number;
  public column: number;
  public description: string;
  constructor(index: number, line: number, column: number, source: string, type: Errors, ...params: string[]) {
    let message =
      errorMessages[type].replace(/%(\d+)/g, (_: string, i: number) => params[i]) + ' (' + line + ':' + column + ')';
    const lines = source.split('\n');
    message = message + '\n' + lines[line - 1] + '\n';
    for (let i = 0; i < column; i++) {
      message += ' ';
    }
    message += '^\n';

    super(`${message}`);

    this.index = index;
    this.line = line;
    this.column = column;
    this.description = message;
  }
}

/**
 * Throws an error
 *
 * @export
 * @param {ParserState} state
 * @param {Errors} type
 * @param {...string[]} params
 * @returns {never}
 */
export function report(state: ParserState, type: Errors, ...params: string[]): never {
  throw new ParseError(state.index, state.line, state.column, state.source, type, ...params);
}

/**
 * Throws an error at a given position
 *
 * @export
 * @param {ParserState} state
 * @param {number} index
 * @param {number} line
 * @param {number} column
 * @param {Errors} type
 * @param {...string[]} params
 * @returns {never}
 */
export function reportAt(
  state: ParserState,
  index: number,
  line: number,
  column: number,
  type: Errors,
  ...params: string[]
): never {
  throw new ParseError(index, line, column, state.source, type, ...params);
}
