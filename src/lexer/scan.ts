import { Token } from '../token';
import { reportAt, Errors } from '../errors';
import { Chars, AsciiLookup, CharType } from '../chars';
import { Context, ParserState } from '../common';
import { ScannerFlags, nextChar, fromCodePoint } from './common';
import { scanNumericLiterals } from './numeric';
import { scanTemplate } from './template';
import { scanStringLiteral } from './string';
import { skipSingleLineComment, skipMultilineComment } from './comments';
import { scanMaybeIdentifier, scanIdentifierOrKeyword, scanPrivatemame } from './identifier';

export type ScanSingleTokenAlternativeCallback = (state: ParserState, context: Context) => Token;

// Table of one-character tokens
const oneCharTokens = new Array(128).fill(0) as Token[];

// `,`, `?`, `[`, `]`, `{`, `}`, `~`, `(`, `)`,  `:` , `;`
oneCharTokens[Chars.Comma] = Token.Comma;
oneCharTokens[Chars.QuestionMark] = Token.QuestionMark;
oneCharTokens[Chars.LeftBracket] = Token.LeftBracket;
oneCharTokens[Chars.RightBracket] = Token.RightBracket;
oneCharTokens[Chars.LeftBrace] = Token.LeftBrace;
oneCharTokens[Chars.Tilde] = Token.Complement;
oneCharTokens[Chars.LeftParen] = Token.LeftParen;
oneCharTokens[Chars.RightParen] = Token.RightParen;
oneCharTokens[Chars.Colon] = Token.Colon;
oneCharTokens[Chars.Semicolon] = Token.Semicolon;

/**
 * Scans a single token
 *
 * @param {ParserState} state
 * @param {Context} context
 * @returns {(Token | void)}
 */
function scanSingleToken(state: ParserState, context: Context): Token | void {
  // One char punctuator lookup
  const token = oneCharTokens[state.currentChar];
  if (token) {
    nextChar(state);
    return token;
  }

  // `a`...`z`, `A`...`Z`, `_`, `$`
  if ((AsciiLookup[state.currentChar] & CharType.Letters) > 0) return scanIdentifierOrKeyword(state, context);

  // `0`...`9`
  if ((AsciiLookup[state.currentChar] & CharType.Decimal) > 0) return scanNumericLiterals(state, context, false);

  if (state.currentChar >= 128) return scanMaybeIdentifier(state) as Token;

  switch (state.currentChar) {
    /* line terminators */
    case Chars.CarriageReturn:
      state.flags |= ScannerFlags.PrecedingLineBreak | ScannerFlags.LastIsCR;
      state.currentChar = state.source.charCodeAt(++state.index);
      state.column = 0;
      state.line++;
      return Token.WhiteSpace;

    case Chars.LineFeed:
      state.currentChar = state.source.charCodeAt(++state.index);
      if ((state.flags & ScannerFlags.LastIsCR) === 0) {
        state.column = 0;
        state.line++;
      }
      state.flags = (state.flags & ~ScannerFlags.LastIsCR) | ScannerFlags.PrecedingLineBreak;
      return Token.WhiteSpace;

    /* general whitespace */
    case Chars.Tab:
    case Chars.VerticalTab:
    case Chars.FormFeed:
    case Chars.Space:
      nextChar(state);
      return Token.WhiteSpace;

    // `\\u{N}var`
    case Chars.Backslash:
      return scanIdentifierOrKeyword(state, context);

    // `}`
    case Chars.RightBrace:
      nextChar(state);
      if (context & Context.AllowTemplate) return scanTemplate(state, context, /* fromTick */ false) as Token;
      return Token.RightBrace;

    case Chars.DoubleQuote:
    case Chars.SingleQuote:
      return scanStringLiteral(state, context) as Token;

    // `#`
    case Chars.Hash:
      return scanPrivatemame(state, context);

    // ``string``
    case Chars.Backtick:
      return scanTemplate(state, context, /* fromTick */ true) as Token;

    /* normal comments */
    case Chars.Slash: {
      nextChar(state);
      if (context & Context.AllowRegExp) {
        // return scanRegExp(parser, context);
      }
      if (state.index < state.source.length) {
        const next = state.currentChar;
        if (next === Chars.Slash) {
          nextChar(state);
          state.seenDelimitedCommentEnd = true;
          return skipSingleLineComment(state);
        } else if (next === Chars.Asterisk) {
          nextChar(state);
          state.seenDelimitedCommentEnd = true;
          return skipMultilineComment(state) as Token;
        } else if (next === Chars.EqualSign) {
          nextChar(state);
          return Token.DivideAssign;
        } else if (next === Chars.GreaterThan) {
          nextChar(state);
          return Token.JSXAutoClose;
        }
      }
      return Token.Divide;
    }

    // `!`, `!=`, `!==`
    case Chars.Exclamation:
      nextChar(state);
      if ((state.currentChar as number) !== Chars.EqualSign) return Token.Negate;
      nextChar(state);
      if ((state.currentChar as number) !== Chars.EqualSign) return Token.LooseNotEqual;
      nextChar(state);
      return Token.StrictNotEqual;

    // `%`, `%=`
    case Chars.Percent:
      nextChar(state);
      if ((state.currentChar as number) !== Chars.EqualSign) return Token.Modulo;
      nextChar(state);
      return Token.ModuloAssign;

    // `&`, `&&`, `&=`
    case Chars.Ampersand: {
      nextChar(state);
      const next = state.currentChar;
      if (next === Chars.Ampersand) {
        nextChar(state);
        return Token.LogicalAnd;
      }

      if (next === Chars.EqualSign) {
        nextChar(state);
        return Token.BitwiseAndAssign;
      }

      return Token.BitwiseAnd;
    }

    // `*`, `**`, `*=`, `**=`
    case Chars.Asterisk: {
      nextChar(state);
      if (state.index >= state.length) return Token.Multiply;
      const next = state.currentChar;
      if ((next as number) === Chars.EqualSign) {
        nextChar(state);
        return Token.MultiplyAssign;
      }
      nextChar(state);
      if ((state.currentChar as number) !== Chars.EqualSign) return Token.Exponentiate;
      nextChar(state);
      return Token.ExponentiateAssign;
    }

    // `+`, `++`, `+=`
    case Chars.Plus: {
      nextChar(state);
      if (state.index >= state.length) return Token.Add;
      const next = state.currentChar;

      if (next === Chars.Plus) {
        nextChar(state);
        return Token.Increment;
      }

      if (next === Chars.EqualSign) {
        nextChar(state);
        return Token.AddAssign;
      }

      return Token.Add;
    }

    // `<`, `<=`, `<<`, `<<=`, `</`
    case Chars.LessThan:
      nextChar(state);
      if (state.index >= state.length) return Token.LessThan;

      if (state.currentChar === Chars.LessThan) {
        nextChar(state);
        if ((state.currentChar as number) === Chars.EqualSign) {
          nextChar(state);
          return Token.ShiftLeftAssign;
        } else {
          return Token.ShiftLeft;
        }
      } else if (state.currentChar === Chars.EqualSign) {
        nextChar(state);
        return Token.LessThanOrEqual;
      } else if (state.currentChar === Chars.Exclamation) {
        if (
          (context & Context.Module) < 1 &&
          state.source.charCodeAt(state.index + 1) === Chars.Hyphen &&
          state.source.charCodeAt(state.index + 2) === Chars.Hyphen
        ) {
          state.index += 2;
          state.column += 2;
          // <!-- marks the beginning of a line comment (for www usage)
          return skipSingleLineComment(state);
        }
      }
      return Token.LessThan;

    // `-`, `--`, `-=`
    case Chars.Hyphen: {
      nextChar(state); // skip `-`
      if (state.index >= state.length) return Token.Subtract;
      const next = state.currentChar;

      if (next === Chars.Hyphen) {
        nextChar(state);
        if (
          context & Context.OptionsWebCompat &&
          (context & Context.Module) < 1 &&
          ((state.flags |= ScannerFlags.PrecedingLineBreak) !== 0 || state.seenDelimitedCommentEnd) &&
          (state.currentChar as number) === Chars.GreaterThan
        ) {
          // https://tc39.github.io/ecma262/#prod-annexB-MultiLineComment
          nextChar(state);
          return skipSingleLineComment(state);
        }
        return Token.Decrement;
      }

      if (next === Chars.EqualSign) {
        nextChar(state);
        return Token.SubtractAssign;
      }

      return Token.Subtract;
    }

    // `=`, `==`, `===`, `=>`
    case Chars.EqualSign: {
      nextChar(state);
      if (state.index >= state.length) return Token.Assign;
      const next = state.currentChar;

      if (next === Chars.EqualSign) {
        nextChar(state);
        if ((state.currentChar as number) === Chars.EqualSign) {
          nextChar(state);
          return Token.StrictEqual;
        } else {
          return Token.LooseEqual;
        }
      } else if (next === Chars.GreaterThan) {
        nextChar(state);
        return Token.Arrow;
      }

      return Token.Assign;
    }

    // `>`, `>=`, `>>`, `>>>`, `>>=`, `>>>=`
    case Chars.GreaterThan: {
      nextChar(state);
      if (state.index >= state.length) return Token.GreaterThan;
      const next = state.currentChar;

      if ((next as number) === Chars.EqualSign) {
        nextChar(state);
        return Token.GreaterThanOrEqual;
      }

      if (next !== Chars.GreaterThan) return Token.GreaterThan;
      nextChar(state);

      if (state.index < state.source.length) {
        const next = state.currentChar;

        if (next === Chars.GreaterThan) {
          nextChar(state);
          if ((state.currentChar as number) === Chars.EqualSign) {
            nextChar(state);
            return Token.LogicalShiftRightAssign;
          } else {
            return Token.LogicalShiftRight;
          }
        } else if (next === Chars.EqualSign) {
          nextChar(state);
          return Token.ShiftRightAssign;
        }
      }

      return Token.ShiftRight;
    }

    // `^`, `^=`
    case Chars.Caret:
      nextChar(state);
      if ((state.currentChar as number) !== Chars.EqualSign) return Token.BitwiseXor;
      nextChar(state);
      return Token.BitwiseXorAssign;

    // `|`, `||`, `|=`
    case Chars.VerticalBar: {
      nextChar(state);
      if (state.index >= state.length) return Token.BitwiseOr;
      const next = state.currentChar;

      if (next === Chars.VerticalBar) {
        nextChar(state);
        return Token.LogicalOr;
      } else if (next === Chars.EqualSign) {
        nextChar(state);
        return Token.BitwiseOrAssign;
      }

      return Token.BitwiseOr;
    }

    // `.`, `...`, `.123` (numeric literal)
    case Chars.Period: {
      let idx = state.index + 1;
      if (idx < state.length) {
        const next = state.source.charCodeAt(idx);

        if (next === Chars.Period) {
          idx++;
          if (idx < state.length && state.source.charCodeAt(state.index) === Chars.Period) {
            state.index = idx + 1;
            state.column += 3;
            return Token.Ellipsis;
          }
        } else if (next >= Chars.Zero && next <= Chars.Nine) {
          return scanNumericLiterals(state, context, true);
        }
      }
      nextChar(state);
      return Token.Period;
    }
    default:
      reportAt(
        state,
        state.index,
        state.line,
        state.startIndex,
        Errors.IllegalCaracter,
        fromCodePoint(state.currentChar)
      );
  }
}

/**
 * Search for the next token in the stream. Skips whitespace if necessary
 *
 * @param {ParserState} state
 * @param {Context} context
 * @param {(ScanSingleTokenAlternativeCallback | undefined)} [scanSingleTokenAlternative]
 * @returns {Token}
 */
export function nextToken(
  state: ParserState,
  context: Context,
  scanSingleTokenAlternative?: ScanSingleTokenAlternativeCallback | undefined
): Token {
  const lookupCallback = scanSingleTokenAlternative ? scanSingleTokenAlternative : scanSingleToken;
  while (state.index < state.length) {
    state.startIndex = state.index;
    // Continue scanning for tokens as long as we're just skipping whitespace.
    if (((state.token = lookupCallback(state, context) as Token) & Token.WhiteSpace) !== Token.WhiteSpace) {
      return state.token;
    }
  }

  return (state.token = Token.EndOfSource);
}
