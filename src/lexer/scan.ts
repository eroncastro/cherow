import { Context, ParserState, fromCodePoint, Flags } from '../common';
import { Chars, AsciiLookup, CharType } from '../chars';
import { nextChar, advance, ScannerFlags, isExoticWhiteSpace, getMostLikelyUnicodeChar } from './common';
import { Token } from '../token';
import { scanNumericLiterals } from './numeric';
import { scanIdentifierOrKeyword, scanPrivatemame } from './identifier';
import { scanStringLiteral } from './string';
import { scanTemplate } from './template';
import { reportAt, Errors } from '../errors';
import { isIdentifierStart } from '../unicode';
import { skipSingleLineComment, skipMultilineComment } from './comments';

const tableLookup = [
  1073741824,
  1073741824,
  1073741824,
  1073741824,
  1073741824,
  1073741824,
  1073741824,
  1073741824,
  1073741824,
  268435580,
  268435579,
  268435581,
  268435582,
  268435578,
  1073741824,
  1073741824,
  1073741824,
  1073741824,
  1073741824,
  1073741824,
  1073741824,
  1073741824,
  1073741824,
  1073741824,
  1073741824,
  1073741824,
  1073741824,
  1073741824,
  1073741824,
  1073741824,
  1073741824,
  1073741824,
  268435583,
  16842799,
  536936451,
  196728,
  1073741824,
  8456758,
  8455494,
  536936451,
  65549,
  18,
  8456757,
  25233713,
  20,
  25233714,
  15,
  8456759,
  536936450,
  536936450,
  536936450,
  536936450,
  536936450,
  536936450,
  536936450,
  536936450,
  536936450,
  536936450,
  23,
  19,
  8456001,
  2097183,
  8456002,
  24,
  1073741824,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  1114133,
  196609,
  22,
  8455240,
  1073741824,
  4259840,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  196609,
  1114126,
  8454983,
  17,
  16842800,
  1073741824
];

/**
 * Scans for next token in the stream and skip whitespace and
 * comments if needed
 *
 * @param {ParserState} state
 * @param {Context} context
 * @returns {Token}
 */
export function nextToken(state: ParserState, context: Context): Token {
  state.flags &= ~Flags.PrecedingLineBreak;
  state.endIndex = state.index;
  state.endLine = state.line;
  state.endColumn = state.column;
  return (state.token = scanSingleToken(state, context) as Token);
}

/**
 * Scans for a single token
 *
 * @param {ParserState} state
 * @param {Context} context
 * @param {ScannerFlags} type
 * @returns {(Token | void)}
 */
export function scanSingleToken(state: ParserState, context: Context): Token | void {
  let type = ScannerFlags.None;
  while (state.index < state.length) {
    const next = state.source.charCodeAt(state.index);

    // TODO! Find a better way - we loose performance on this!
    state.startIndex = state.index;
    state.startLine = state.line;
    state.startColumn = state.column;

    if (next < 0x7f) {
      const token = tableLookup[next];

      switch (token) {
        case Token.LeftParen:
        case Token.RightParen:
        case Token.LeftBrace:
        case Token.LeftBracket:
        case Token.RightBracket:
        case Token.QuestionMark:
        case Token.Complement:
        case Token.Colon:
        case Token.Semicolon:
        case Token.Comma:
          nextChar(state);
          return token;

        // `}`, `}``
        case Token.RightBrace:
          nextChar(state);
          if (context & Context.AllowTemplate) return scanTemplate(state, context, /* fromTick */ false) as Token;
          return token;

        // `a`...`z`, `A`...`Z`, `_`, `$`, `\\u{N}var`
        case Token.Identifier:
          return scanIdentifierOrKeyword(state, context);

        // `0`...`9`
        case Token.NumericLiteral:
          return scanNumericLiterals(state, context, ScannerFlags.Decimal);

        // `string`
        case Token.StringLiteral:
          return scanStringLiteral(state, context) as Token;

        // `#`
        case Token.PrivateName:
          return scanPrivatemame(state, context);

        // ``string``
        case Token.Template:
          return scanTemplate(state, context, /* fromTick */ true) as Token;

        // Whitespace
        case Token.Space:
        case Token.VerticalTab:
        case Token.Tab:
        case Token.FormFeed:
          nextChar(state);
          break;

        // line terminators
        case Token.LineFeed:
          state.index++;
          state.flags |= Flags.PrecedingLineBreak;
          if ((type & ScannerFlags.LastIsCR) < 1) {
            state.column = 0;
            state.line++;
          }
          type = (type & ~ScannerFlags.LastIsCR) | ScannerFlags.NewLine;
          break;

        case Token.CarriageReturn:
          type |= ScannerFlags.NewLine | ScannerFlags.LastIsCR;
          state.flags |= Flags.PrecedingLineBreak;
          state.index++;
          state.column = 0;
          state.line++;
          break;

        // `.`, `...`, `.123` (numeric literal)
        case Token.Period:
          let index = state.index + 1;
          if (index < state.length) {
            const next = state.source.charCodeAt(index);

            if (next === Chars.Period) {
              index++;
              if (index < state.length && state.source.charCodeAt(index) === Chars.Period) {
                state.index = index + 1;
                state.column += 3;
                return Token.Ellipsis;
              }
            } else if (AsciiLookup[next] & CharType.Decimal) {
              return scanNumericLiterals(state, context, ScannerFlags.Decimal | ScannerFlags.IsFloat);
            }
          }

          nextChar(state);

          return Token.Period;

        // `!`, `!=`, `!==`
        case Token.Negate:
          nextChar(state);
          if (state.currentChar !== Chars.EqualSign) return Token.Negate;
          nextChar(state);
          if (state.currentChar !== Chars.EqualSign) return Token.LooseNotEqual;
          advance(state);
          return Token.StrictNotEqual;

        // `%`, `%=`
        case Token.Modulo:
          nextChar(state);
          if (state.currentChar !== Chars.EqualSign) return Token.Modulo;
          advance(state);
          return Token.ModuloAssign;

        // `*`, `**`, `*=`, `**=`
        case Token.Multiply: {
          nextChar(state);
          if (state.index >= state.length) return Token.Multiply;
          const next = state.currentChar;

          if (next === Chars.EqualSign) {
            nextChar(state);
            return Token.MultiplyAssign;
          }

          if (next !== Chars.Asterisk) return Token.Multiply;
          nextChar(state);
          if (state.currentChar !== Chars.EqualSign) return Token.Exponentiate;
          nextChar(state);
          return Token.ExponentiateAssign;
        }

        // `^`, `^=`
        case Token.BitwiseXor:
          nextChar(state);
          if (state.currentChar !== Chars.EqualSign) return Token.BitwiseXor;
          advance(state);
          return Token.BitwiseXorAssign;

        // `+`, `++`, `+=`
        case Token.Add: {
          nextChar(state);
          if (state.index >= state.length) return Token.Add;
          const next = state.currentChar;

          if (next === Chars.Plus) {
            advance(state);
            return Token.Increment;
          }

          if (next === Chars.EqualSign) {
            advance(state);
            return Token.AddAssign;
          }

          return Token.Add;
        }

        // `-`, `--`, `-=`
        case Token.Subtract: {
          nextChar(state);
          if (state.index >= state.length) return Token.Subtract;
          const next = state.currentChar;

          if (next === Chars.Hyphen) {
            if (
              context & Context.OptionsWebCompat &&
              (context & Context.Module) < 1 &&
              state.source.charCodeAt(state.index + 1) === Chars.GreaterThan &&
              type & (ScannerFlags.SeenDelimitedCommentEnd | ScannerFlags.NewLine)
            ) {
              nextChar(state);
              type = skipSingleLineComment(state, type);
              continue;
            }
            advance(state);
            return Token.Decrement;
          }

          if (next === Chars.EqualSign) {
            advance(state);
            return Token.SubtractAssign;
          }

          return Token.Subtract;
        }

        case Token.Divide: {
          nextChar(state);
          if (state.index < state.length) {
            const ch = state.currentChar;
            if (ch === Chars.Slash) {
              nextChar(state);
              type = skipSingleLineComment(state, type | ScannerFlags.SeenDelimitedCommentEnd);
              break;
            } else if (ch === Chars.Asterisk) {
              nextChar(state);
              type = skipMultilineComment(state, type | ScannerFlags.SeenDelimitedCommentEnd);
              break;
            } else if (context & Context.AllowRegExp) {
              // return scanRegExp(state, context);
            } else if (ch === Chars.EqualSign) {
              advance(state);
              return Token.DivideAssign;
            } else if (ch === Chars.GreaterThan) {
              advance(state);
              return Token.JSXAutoClose;
            }
          }

          return Token.Divide;
        }

        // `<`, `<=`, `<<`, `<<=`, `</`
        case Token.LessThan:
          nextChar(state);
          if (state.index >= state.length) return Token.LessThan;

          switch (state.currentChar) {
            case Chars.LessThan:
              nextChar(state);
              if ((state.currentChar as number) === Chars.EqualSign) {
                advance(state);
                return Token.ShiftLeftAssign;
              } else {
                return Token.ShiftLeft;
              }

            case Chars.EqualSign:
              advance(state);
              return Token.LessThanOrEqual;

            case Chars.Exclamation:
              if (
                (context & Context.Module) < 1 &&
                state.source.charCodeAt(state.index + 1) === Chars.Hyphen &&
                state.source.charCodeAt(state.index + 2) === Chars.Hyphen
              ) {
                // <!-- marks the beginning of a line comment (for www usage)
                type = skipSingleLineComment(state, type);
                continue;
              }

            case Chars.Slash: {
              if ((context & Context.OptionsJSX) < 1) break;
              const index = state.index + 1;

              // Check that it's not a comment start.
              if (index < state.length) {
                const next = state.source.charCodeAt(index);
                if (next === Chars.Asterisk || next === Chars.Slash) break;
              }

              advance(state);
              return Token.JSXClose;
            }

            default:
              // ignore
              return Token.LessThan;
          }

        // `=`, `==`, `===`, `=>`
        case Token.Assign: {
          nextChar(state);
          if (state.index >= state.length) return Token.Assign;
          const next = state.currentChar;

          if (next === Chars.EqualSign) {
            nextChar(state);
            if (state.currentChar === Chars.EqualSign) {
              advance(state);
              return Token.StrictEqual;
            } else {
              return Token.LooseEqual;
            }
          } else if (next === Chars.GreaterThan) {
            advance(state);
            return Token.Arrow;
          }

          return Token.Assign;
        }

        // `|`, `||`, `|=`
        case Token.BitwiseOr: {
          nextChar(state);
          if (state.index >= state.length) return Token.BitwiseOr;
          const next = state.currentChar;

          if (next === Chars.VerticalBar) {
            advance(state);
            return Token.LogicalOr;
          } else if (next === Chars.EqualSign) {
            advance(state);
            return Token.BitwiseOrAssign;
          }

          return Token.BitwiseOr;
        }

        // `>`, `>=`, `>>`, `>>>`, `>>=`, `>>>=`
        case Token.GreaterThan: {
          nextChar(state);
          if (state.index >= state.length) return Token.GreaterThan;
          const next = state.currentChar;

          if (next === Chars.EqualSign) {
            nextChar(state);
            return Token.GreaterThanOrEqual;
          }

          if (next !== Chars.GreaterThan) return Token.GreaterThan;
          nextChar(state);

          if (state.index < state.length) {
            const next = state.currentChar;

            if (next === Chars.GreaterThan) {
              nextChar(state);
              if (state.currentChar === Chars.EqualSign) {
                advance(state);
                return Token.LogicalShiftRightAssign;
              } else {
                return Token.LogicalShiftRight;
              }
            } else if (next === Chars.EqualSign) {
              advance(state);
              return Token.ShiftRightAssign;
            }
          }

          return Token.ShiftRight;
        }

        // `&`, `&&`, `&=`
        case Token.BitwiseAnd: {
          nextChar(state);
          if (state.index >= state.length) return Token.BitwiseAnd;
          const next = state.currentChar;

          if (next === Chars.Ampersand) {
            advance(state);
            return Token.LogicalAnd;
          }

          if (next === Chars.EqualSign) {
            advance(state);
            return Token.BitwiseAndAssign;
          }

          return Token.BitwiseAnd;
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
    } else {
      if ((state.currentChar ^ Chars.ParagraphSeparator) <= 1) {
        type = (type & ~ScannerFlags.LastIsCR) | ScannerFlags.NewLine;
        state.flags |= Flags.PrecedingLineBreak;
        state.index++;
        state.column = 0;
        state.line++;
        continue;
      }

      // Exotic whitespace
      if (isExoticWhiteSpace(state.currentChar)) {
        nextChar(state);
        continue;
      }

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

  return Token.EndOfSource;
}
