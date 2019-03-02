import { Context, ParserState, PeekedState, fromCodePoint, Flags } from '../common';
import { Chars, AsciiLookup, CharType } from '../chars';
import { nextChar, ScannerFlags, isExoticWhiteSpace, getMostLikelyUnicodeChar } from './common';
import { Token } from '../token';
import { scanNumericLiterals } from './numeric';
import { scanIdentifierOrKeyword, scanPrivatemame } from './identifier';
import { scanStringLiteral } from './string';
import { scanTemplate } from './template';
import { reportAt, Errors } from '../errors';
import { isIdentifierStart } from '../unicode';
import { skipSingleLineComment, skipMultilineComment } from './comments';

/*
// NOTE! (fkleuver) This code is here so you can see how I generated the table below

const oneCharTokens = new Array(128).fill(0) as Token[];
oneCharTokens[Chars.Comma] = Token.Comma;
oneCharTokens[Chars.QuestionMark] = Token.QuestionMark;
oneCharTokens[Chars.LeftBracket] = Token.LeftBracket;
oneCharTokens[Chars.RightBracket] = Token.RightBracket;
oneCharTokens[Chars.LeftBrace] = Token.LeftBrace;
oneCharTokens[Chars.RightBrace] = Token.RightBrace;
oneCharTokens[Chars.Tilde] = Token.Complement;
oneCharTokens[Chars.LeftParen] = Token.LeftParen;
oneCharTokens[Chars.RightParen] = Token.RightParen;
oneCharTokens[Chars.Colon] = Token.Colon;
oneCharTokens[Chars.Semicolon] = Token.Semicolon;
oneCharTokens[Chars.Hash] = Token.PrivateName;
oneCharTokens[Chars.VerticalBar] = Token.BitwiseOr;
oneCharTokens[Chars.Caret] = Token.BitwiseXor;
oneCharTokens[Chars.EqualSign] = Token.Assign;
oneCharTokens[Chars.GreaterThan] = Token.GreaterThan;
oneCharTokens[Chars.Hyphen] = Token.Subtract;
oneCharTokens[Chars.LessThan] = Token.LessThan;
oneCharTokens[Chars.Plus] = Token.Add;
oneCharTokens[Chars.Asterisk] = Token.Multiply;
oneCharTokens[Chars.Ampersand] = Token.BitwiseAnd;
oneCharTokens[Chars.Period] = Token.Period;
oneCharTokens[Chars.Percent] = Token.Modulo;
oneCharTokens[Chars.Exclamation] = Token.Negate;
oneCharTokens[Chars.Slash] = Token.Divide;
oneCharTokens[Chars.Space] = Token.Space;
oneCharTokens[Chars.VerticalTab] = Token.VerticalTab;
oneCharTokens[Chars.Tab] = Token.Tab;
oneCharTokens[Chars.LineFeed] = Token.LineFeed;
oneCharTokens[Chars.CarriageReturn] = Token.CarriageReturn;
oneCharTokens[Chars.FormFeed] = Token.FormFeed;
oneCharTokens[Chars.SingleQuote] = Token.StringLiteral;
oneCharTokens[Chars.DoubleQuote] = Token.StringLiteral;
oneCharTokens[Chars.Backslash] = Token.Identifier;
oneCharTokens[Chars.Underscore] = Token.Identifier;
oneCharTokens[Chars.Dollar] = Token.Identifier;
oneCharTokens[Chars.Backtick] = Token.Template;
oneCharTokens[Chars.Zero] = Token.NumericLiteral;
oneCharTokens[Chars.One] = Token.NumericLiteral;
oneCharTokens[Chars.Two] = Token.NumericLiteral;
oneCharTokens[Chars.Three] = Token.NumericLiteral;
oneCharTokens[Chars.Four] = Token.NumericLiteral;
oneCharTokens[Chars.Five] = Token.NumericLiteral;
oneCharTokens[Chars.Six] = Token.NumericLiteral;
oneCharTokens[Chars.Seven] = Token.NumericLiteral;
oneCharTokens[Chars.Eight] = Token.NumericLiteral;
oneCharTokens[Chars.Nine] = Token.NumericLiteral;

// `A`...`Z`
for (let i = Chars.UpperA; i <= Chars.UpperZ; i++) {
  oneCharTokens[i] = Token.Identifier;
}

// `a`...`z`
for (let i = Chars.LowerA; i <= Chars.LowerZ; i++) {
  oneCharTokens[i] = Token.Identifier;
}
*/

const tableLookup = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  124,
  123,
  125,
  126,
  122,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  127,
  16842799,
  536936451,
  196728,
  196609,
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
  0,
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
  196609,
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
  0
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

  if (state.peekedState) {
    rewindState(state, state.peekedState);
    state.peekedState = undefined;
    return state.peekedToken;
  }
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
        state.currentChar = state.source.charCodeAt(++state.index);
        state.flags |= Flags.PrecedingLineBreak;
        if ((type & ScannerFlags.LastIsCR) < 1) {
            state.column = 0;
            ++state.line;
          }
          type = (type & ~ScannerFlags.LastIsCR) | ScannerFlags.NewLine;
          break;

        case Token.CarriageReturn:
          type |= ScannerFlags.NewLine | ScannerFlags.LastIsCR;
          state.flags |= Flags.PrecedingLineBreak;
          state.currentChar = state.source.charCodeAt(++state.index);
          state.column = 0;
          ++state.line;
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
                // fixes '[...a]'
                state.currentChar = state.source.charCodeAt(state.index);
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
          nextChar(state);
          return Token.StrictNotEqual;

        // `%`, `%=`
        case Token.Modulo:
          nextChar(state);
          if (state.currentChar !== Chars.EqualSign) return Token.Modulo;
          nextChar(state);
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
          nextChar(state);
          return Token.BitwiseXorAssign;

        // `+`, `++`, `+=`
        case Token.Add: {
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
            nextChar(state);
            return Token.Decrement;
          }

          if (next === Chars.EqualSign) {
            nextChar(state);
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
              nextChar(state);
              return Token.DivideAssign;
            } else if (ch === Chars.GreaterThan) {
              nextChar(state);
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
                nextChar(state);
                return Token.ShiftLeftAssign;
              } else {
                return Token.ShiftLeft;
              }

            case Chars.EqualSign:
              nextChar(state);
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

              nextChar(state);
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

        // `|`, `||`, `|=`
        case Token.BitwiseOr: {
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

        // `&`, `&&`, `&=`
        case Token.BitwiseAnd: {
          nextChar(state);
          if (state.index >= state.length) return Token.BitwiseAnd;
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

/**
 * Improved lookahead. What it does is to simply peak ahead, and re-use the new token
 * instead of doing a new 'nextToken' if you already have peeked ahead.
 *
 * Usage:
 *
 *        peekToken(state, context);
 *        if (state.peekedToken === Token.Kleuver') return false;
 *
 * @param {ParserState} state
 * @param {Context} context
 * @returns {*}
 */
export function peekAhead(state: ParserState, context: Context): any {
  // 1) Save current state
  const {
    index,
    line,
    column,
    startIndex,
    endIndex,
    flags,
    tokenValue,
    currentChar,
    token,
    tokenRegExp,
    tokenRaw,
    endLine,
    endColumn,
    startLine,
    startColumn,
    octalPos,
    octalMessage
  } = state;

  // 2) Save the new peeked token
  state.peekedToken = nextToken(state, context);
  // 3) Save the new state
  state.peekedState = {
    index: state.index,
    line: state.line,
    column: state.column,
    startIndex: state.startIndex,
    endIndex: state.endIndex,
    flags: state.flags,
    tokenValue: state.tokenValue,
    currentChar: state.currentChar,
    token: state.token,
    tokenRegExp: state.tokenRegExp,
    tokenRaw: state.tokenRaw,
    endLine: state.endLine,
    endColumn: state.endColumn,
    startLine: state.startLine,
    startColumn: state.startColumn,
    octalPos: state.octalPos,
    octalMessage: state.octalMessage
  };

  // 4) Rewind
  state.index = index;
  state.line = line;
  state.column = column;
  state.startIndex = startIndex;
  state.endIndex = endIndex;
  state.flags = flags;
  state.tokenValue = tokenValue;
  state.currentChar = currentChar;
  state.tokenRaw = tokenRaw;
  state.token = token;
  state.tokenRegExp = tokenRegExp;
  state.endLine = endLine;
  state.endColumn = endColumn;
  state.startLine = startLine;
  state.startColumn = startColumn;
  state.octalPos = octalPos;
  state.octalMessage = octalMessage;
}

/**
 * Rewind parser state to previous state
 *
 * @param {ParserState} state
 * @param {PeekedState} peekedState
 */
function rewindState(state: ParserState, peekedState: PeekedState) {
  state.index = peekedState.index;
  state.line = peekedState.line;
  state.column = peekedState.column;
  state.startIndex = peekedState.startIndex;
  state.endIndex = peekedState.endIndex;
  state.flags = peekedState.flags;
  state.tokenValue = peekedState.tokenValue;
  state.currentChar = peekedState.currentChar;
  state.tokenRaw = peekedState.tokenRaw;
  state.token = peekedState.token;
  state.tokenRegExp = peekedState.tokenRegExp;
  state.endLine = peekedState.endLine;
  state.endColumn = peekedState.endColumn;
  state.startLine = peekedState.startLine;
  state.startColumn = peekedState.startColumn;
  state.octalPos = peekedState.octalPos;
  state.octalMessage = peekedState.octalMessage;
}
