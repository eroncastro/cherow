import { Context, ParserState, Flags } from '../common';
import {
  RegexpState,
  Type,
  consumeOpt,
  toHex,
  scanIntervalQuantifier,
  setState,
  updateState,
  parseRegexCapturingGroupNameRemainder,
  fromCodePoint,
  nextUnicodeChar,
  isFlagStart
} from './common';
import { Chars, AsciiLookup, CharType, isIdentifierPart, isIdentifierStart } from '../chars';
import { Token } from '../token';
import { Errors, report, reportRegExp } from '../errors';
import { unicodeLookup } from '../unicode';

/**
 * TODO:
 *
 * Adopt this V8 code to make the last non-failing tests work
 *
 * https://github.com/v8/v8/blob/master/src/regexp/regexp-parser.cc#L1274
 */

/**
 * Scan and validate regex flags
 *
 * @param {ParserState} state
 * @returns {RegexpState}
 */
function scanRegexFlags(state: ParserState): RegexpState {
  const enum Flags {
    Empty = 0,
    Global = 0x01,
    IgnoreCase = 0x02,
    Multiline = 0x04,
    Unicode = 0x08,
    Sticky = 0x10,
    DotAll = 0x20
  }

  let mask = Flags.Empty;

  loop: while (state.index < state.length) {
    let code = state.source.charCodeAt(state.index);
    switch (code) {
      case Chars.LowerG:
        if (mask & Flags.Global) return reportRegExp(state, Errors.DuplicateRegExpFlag, 'g');
        mask |= Flags.Global;
        break;

      case Chars.LowerI:
        if (mask & Flags.IgnoreCase) return reportRegExp(state, Errors.DuplicateRegExpFlag, 'i');
        mask |= Flags.IgnoreCase;
        break;

      case Chars.LowerM:
        if (mask & Flags.Multiline) return reportRegExp(state, Errors.DuplicateRegExpFlag, 'm');
        mask |= Flags.Multiline;
        break;

      case Chars.LowerU:
        if (mask & Flags.Unicode) return reportRegExp(state, Errors.DuplicateRegExpFlag, 'u');
        mask |= Flags.Unicode;
        break;

      case Chars.LowerY:
        if (mask & Flags.Sticky) return reportRegExp(state, Errors.DuplicateRegExpFlag, 'y');
        mask |= Flags.Sticky;
        break;

      case Chars.LowerS:
        if (mask & Flags.DotAll) return reportRegExp(state, Errors.DuplicateRegExpFlag, 's');
        mask |= Flags.DotAll;
        break;

      default:
        if (code >= 0xd800 && code <= 0xdc00) code = nextUnicodeChar(state);
        if (!isFlagStart(code)) break loop;
        return RegexpState.Invalid;
    }

    state.index++;
  }

  return mask & Flags.Unicode ? RegexpState.Unicode : RegexpState.Plain;
}

/**
 * Scans regular expression pattern
 *
 * @export
 * @param parser Parser object
 * @param context Context masks
 */

export function scanRegularExpression(state: ParserState, context: Context): Token {
  // TODO: Merge this function with the function above - flag scanning

  const bodyStart = state.index;
  const regExpState = RegexpState.Valid;
  let regexpBody = validateRegularExpression(state, context, 0, regExpState, Type.None);
  const bodyEnd = state.index - 1;
  const { index: flagStart } = state;
  const regexpFlags = scanRegexFlags(state);
  if (state.numCapturingParens < state.largestBackReference) {
    regexpBody =
      (context & Context.OptionsDisableWebCompat) === 0
        ? setState(state, regexpBody, RegexpState.Plain, Errors.InvalidRegExp)
        : reportRegExp(state, Errors.Unexpected);
  }

  if (regexpBody & RegexpState.Invalid || regexpFlags & RegexpState.Invalid) throw state.lastRegExpError;

  if (regexpBody & RegexpState.Unicode) {
    if (regexpFlags & RegexpState.Unicode) return Token.RegularExpression;
    reportRegExp(state, Errors.InvalidRegExpNoUFlag);
    throw state.lastRegExpError;
  } else if (regexpBody & RegexpState.Plain) {
    if (regexpFlags !== RegexpState.Unicode) return Token.RegularExpression;
    reportRegExp(state, Errors.InvalidRegExpWithUFlag);
    throw state.lastRegExpError;
  }

  const flags = state.source.slice(flagStart, state.index);
  const pattern = state.source.slice(bodyStart, bodyEnd);

  state.tokenRegExp = { pattern, flags };

  if (context & Context.OptionsRaw) state.tokenRaw = state.source.slice(state.startIndex, state.index);

  try {
    state.tokenValue = new RegExp(pattern, flags);
  } catch (e) {
    state.tokenValue = null;
  }
  return Token.RegularExpression;
}

/**
 * Validate regular expression pattern
 *
 * @param state Parser object
 * @param context Contexts masks
 * @param depth Tracks level
 * @param regExpState Masks to track regExp state
 * @param type  Masks to track internal state
 */
export function validateRegularExpression(
  state: ParserState,
  context: Context,
  depth: number,
  regExpState: RegexpState,
  type: Type
): RegexpState {
  const groupNames = new Set();
  const backreferenceNames: string[] = [];

  while (state.index !== state.length) {
    switch (state.source.charCodeAt(state.index++)) {
      // `^`, `$`, `|`
      case Chars.Caret:
      case Chars.Dollar:
      case Chars.VerticalBar:
        type &= ~Type.MaybeQuantifier;
        break;

      // `/`,
      case Chars.Slash: {
        if (depth !== 0) return reportRegExp(state, Errors.UnterminatedGroup);
        if (context & Context.OptionsDisableWebCompat) {
          for (const i in backreferenceNames) {
            if (!groupNames.has(backreferenceNames[i])) {
              report(state, Errors.InvalidCaptureRef, backreferenceNames[i]);
            }
          }
        }
        return regExpState;
      }

      // `.`
      case Chars.Period:
        type |= Type.MaybeQuantifier;
        break;

      // Atom ::
      //   \ AtomEscape
      case Chars.Backslash: {
        if (state.index === state.length) return reportRegExp(state, Errors.AtEndOfPattern);

        type |= Type.MaybeQuantifier;

        if (consumeOpt(state, Chars.LowerB) || consumeOpt(state, Chars.UpperB)) {
          type &= ~Type.MaybeQuantifier;
        } else {
          regExpState = updateState(
            state,
            regExpState,
            validateAtomEscape(state, context, backreferenceNames, state.source.charCodeAt(state.index))
          );
        }

        break;
      }

      // `(`
      case Chars.LeftParen:
        {
          // Reset the internal state
          type &= ~(Type.MaybeQuantifier | Type.SeenUnfixableAssertion | Type.SeenAssertion);

          if (consumeOpt(state, Chars.QuestionMark)) {
            let next = state.source.charCodeAt(state.index);

            if (
              next === Chars.Colon ||
              next === Chars.EqualSign ||
              next === Chars.Exclamation ||
              next === Chars.LessThan
            ) {
              if (consumeOpt(state, Chars.LessThan)) {
                next = state.source.charCodeAt(state.index);

                if (consumeOpt(state, Chars.EqualSign) || consumeOpt(state, Chars.Exclamation)) {
                  type |= Type.SeenUnfixableAssertion;
                } else if (consumeOpt(state, Chars.Backslash)) {
                  if (!consumeOpt(state, Chars.LowerU)) return reportRegExp(state, Errors.InvalidUnicodeEscape);

                  next = parseRegexUnicodeEscape(state);

                  if (next === RegexpState.InvalidClass) {
                    regExpState = reportRegExp(state, Errors.InvalidUnicodeEscape);
                    break;
                  }

                  if (next & RegexpState.InvalidPlainClass) {
                    regExpState =
                      RegexpState.InvalidPlainClass & RegexpState.InvalidUnicodeClass
                        ? setState(state, regExpState, RegexpState.Plain, Errors.InvalidExtendedUnicodeEscape)
                        : RegexpState.InvalidPlainClass & RegexpState.InvalidPlainClass
                        ? setState(state, regExpState, RegexpState.Unicode, Errors.InvalidExtendedUnicodeEscape)
                        : RegexpState.InvalidPlainClass & RegexpState.InvalidClass
                        ? setState(state, regExpState, RegexpState.Invalid, Errors.InvalidExtendedUnicodeEscape)
                        : regExpState;

                    next = next ^ RegexpState.InvalidPlainClass;
                  }

                  const subState = parseRegexCapturingGroupNameRemainder(state, context, next, groupNames);

                  if ((subState & RegexpState.Valid) === 0) {
                    regExpState = subState;
                    break;
                  }
                } else {
                  if (
                    (AsciiLookup[next] & CharType.IDStart) > 0 ||
                    ((unicodeLookup[(next >>> 5) + 34816] >>> next) & 31 & 1) > 0
                  ) {
                    ++state.index;
                  } else {
                    if ((context & Context.OptionsDisableWebCompat) === 0) break;
                    return reportRegExp(state, Errors.InvalidCaptureGroupName);
                  }

                  const subState = parseRegexCapturingGroupNameRemainder(state, context, next, groupNames);
                  if ((subState & RegexpState.Valid) === 0) {
                    regExpState = subState;
                    break;
                  }

                  next = Chars.GreaterThan;
                }
              } else if (consumeOpt(state, Chars.EqualSign) || consumeOpt(state, Chars.Exclamation)) {
                type |= Type.SeenAssertion;
              }

              if (state.index === state.length) {
                regExpState = reportRegExp(state, Errors.AtEndOfPattern);
                break;
              }
              next = state.source.charCodeAt(state.index);
            } else {
              regExpState = reportRegExp(state, Errors.InvalidRegExpGroup);
            }
          } else {
            ++state.numCapturingParens;
          }

          const subState = validateRegularExpression(state, context, depth + 1, RegexpState.Valid, Type.None);

          switch (state.source.charCodeAt(state.index)) {
            case Chars.QuestionMark:
            case Chars.LeftBrace:
            case Chars.Asterisk:
            case Chars.Plus: {
              if (type & (Type.SeenAssertion | Type.SeenUnfixableAssertion)) {
                regExpState =
                  (context & Context.OptionsDisableWebCompat) === 0
                    ? setState(state, regExpState, RegexpState.Plain, Errors.NothingToRepat)
                    : reportRegExp(state, Errors.NothingToRepat);
              }
            }
            // falls through
            default:
              type |= Type.MaybeQuantifier;
              regExpState = updateState(state, regExpState, subState);
          }
        }
        break;

      // `)`
      case Chars.RightParen: {
        if (depth > 0) return regExpState;
        regExpState = reportRegExp(state, Errors.UnterminatedGroup);
        type |= Type.MaybeQuantifier;
        break;
      }

      // '['
      case Chars.LeftBracket: {
        regExpState = updateState(state, regExpState, parseCharacterClass(state, context));
        type |= Type.MaybeQuantifier;
        break;
      }

      // ']'
      case Chars.RightBracket: {
        regExpState =
          (context & Context.OptionsDisableWebCompat) === 0
            ? setState(state, regExpState, RegexpState.Plain, Errors.LoneQuantifierBrackets)
            : (regExpState = reportRegExp(state, Errors.NothingToRepat));
        type |= Type.MaybeQuantifier;
      }

      // '*', '+', '?',
      case Chars.Asterisk:
      case Chars.Plus:
      case Chars.QuestionMark: {
        if (type & Type.MaybeQuantifier) {
          type &= ~Type.MaybeQuantifier;
          if (state.index < state.length) consumeOpt(state, Chars.QuestionMark);
        } else {
          regExpState = reportRegExp(state, Errors.NothingToRepat);
        }
        break;
      }

      // '{'
      case Chars.LeftBrace: {
        if (type & Type.MaybeQuantifier) {
          if (!scanIntervalQuantifier(state) && context & Context.OptionsDisableWebCompat) {
            regExpState = reportRegExp(state, Errors.NothingToRepat);
          }
          if (state.index < state.length && consumeOpt(state, Chars.QuestionMark)) {
          }
          type &= ~Type.MaybeQuantifier;
        } else {
          if ((context & Context.OptionsDisableWebCompat) === 0) {
            regExpState = setState(state, regExpState, RegexpState.Plain, Errors.InvalidRegExp);
          } else {
            regExpState = reportRegExp(state, Errors.InvalidQuantifier);
          }
        }
        break;
      }

      // '}'
      case Chars.RightBrace: {
        regExpState =
          context & Context.OptionsDisableWebCompat
            ? reportRegExp(state, Errors.InvalidQuantifier)
            : setState(state, regExpState, RegexpState.Plain, Errors.InvalidQuantifierNoUFlagAB);
        type &= ~Type.MaybeQuantifier;
        break;
      }
      case Chars.CarriageReturn:
      case Chars.LineFeed:
      case Chars.LineSeparator:
      case Chars.ParagraphSeparator:
        return reportRegExp(state, Errors.AtEndOfPattern);
      default:
        type |= Type.MaybeQuantifier;
    }
  }

  return reportRegExp(state, Errors.AtEndOfPattern);
}

function parseRegexUnicodeEscape(state: ParserState): RegexpState {
  if (consumeOpt(state, Chars.LeftBrace)) {
    // \u{N}
    let ch2 = state.source.charCodeAt(state.index);
    let code = toHex(ch2);
    if (code < 0) return RegexpState.InvalidClass;
    state.index++;
    ch2 = state.source.charCodeAt(state.index);
    while (ch2 !== Chars.RightBrace) {
      const digit = toHex(ch2);
      if (digit < 0) return RegexpState.InvalidClass;
      code = code * 16 + digit;
      // Code point out of bounds
      if (code > 0x10ffff) return RegexpState.InvalidClass;
      state.index++;
      ch2 = state.source.charCodeAt(state.index);
    }
    state.index++;
    return code | RegexpState.InvalidPlainClass;
  }

  // \uNNNN
  let codePoint = toHex(state.source.charCodeAt(state.index));
  if (codePoint < 0) return RegexpState.InvalidClass;
  for (let i = 0; i < 3; i++) {
    state.index++;
    const digit = toHex(state.source.charCodeAt(state.index));
    if (digit < 0) return RegexpState.InvalidClass;
    codePoint = codePoint * 16 + digit;
  }
  state.index++;
  return codePoint;
}

function parseOctalFromSecondDigit(state: ParserState, firstChar: number): RegexpState {
  if (firstChar >= Chars.Zero && firstChar <= Chars.Three) {
    const secondChar = state.source.charCodeAt(state.index);
    if (secondChar >= Chars.Zero && secondChar <= Chars.Seven) {
      ++state.index;

      const thirdChar = state.source.charCodeAt(state.index);
      if (thirdChar >= Chars.Zero && thirdChar <= Chars.Seven) {
        ++state.index;
        return (firstChar - Chars.Zero) * 8 * 8 + (secondChar - Chars.Zero) * 8 + (thirdChar - Chars.Zero);
      } else {
        return (firstChar - Chars.Zero) * 8 + (thirdChar - Chars.Zero);
      }
    } else {
      return firstChar - Chars.Zero;
    }
  } else {
    const secondChar = state.source.charCodeAt(state.index);
    if (secondChar >= Chars.Zero && secondChar <= Chars.Seven) {
      ++state.index;
      const thirdChar = state.source.charCodeAt(state.index);
      if (thirdChar >= Chars.Zero && thirdChar <= Chars.Three) {
        ++state.index;
        return (firstChar - Chars.Zero) * 8 * 8 + (secondChar - Chars.Zero) * 8 + (thirdChar - Chars.Zero);
      } else {
        return (firstChar - Chars.Zero) * 8 + (thirdChar - Chars.Zero);
      }
    } else {
      return firstChar - Chars.Zero;
    }
  }
}

function parseRegexPropertyEscape(state: ParserState, context: Context): RegexpState {
  if (!consumeOpt(state, Chars.LeftBrace)) {
    return (context & Context.OptionsDisableWebCompat) === 0
      ? RegexpState.Plain
      : reportRegExp(state, Errors.InvalidPropertyName);
  }

  if (consumeOpt(state, Chars.RightBrace)) return reportRegExp(state, Errors.InvalidPropertyName);

  // now skip the Unicode Property name until the first closing curly
  while (state.source.charCodeAt(state.index) !== Chars.RightBrace) {
    if (state.index === state.length) {
      if ((context & Context.OptionsDisableWebCompat) === 0) return RegexpState.Plain;
      return reportRegExp(state, Errors.AtEndOfPattern);
    }
    state.index++;
  }

  state.index++; // Consume '}'

  return RegexpState.Unicode;
}

function validateClassCharacterEscape(state: ParserState, context: Context): Chars | RegexpState {
  let next = state.source.charCodeAt(state.index++);

  switch (next) {
    case Chars.LowerB:
      return Chars.Backspace;
    case Chars.UpperB:
      return RegexpState.InvalidClassRange;

    case Chars.Caret:
    case Chars.Dollar:
    case Chars.Backslash:
    case Chars.Period:
    case Chars.Asterisk:
    case Chars.Plus:
    case Chars.QuestionMark:
    case Chars.LeftParen:
    case Chars.RightParen:
    case Chars.LeftBracket:
    case Chars.RightBracket:
    case Chars.LeftBrace:
    case Chars.RightBrace:
    case Chars.VerticalBar:
      return next;

    // ControlEscape :: one of
    //   f n r t v
    case Chars.LowerF:
      return 0x000c;
    case Chars.LowerN:
      return 0x000a;
    case Chars.LowerR:
      return 0x000d;
    case Chars.LowerT:
      return 0x0009;
    case Chars.LowerV:
      return 0x000b;

    // char class escapes \d \D \s \S \w \W
    case Chars.LowerD:
    case Chars.UpperD:
    case Chars.LowerS:
    case Chars.UpperS:
    case Chars.UpperW:
    case Chars.LowerW:
      return RegexpState.Escape;

    case Chars.LowerU:
      return parseRegexUnicodeEscape(state);

    case Chars.LowerX: {
      if (state.index >= state.length - 1) return RegexpState.InvalidClass;
      const ch1 = state.source.charCodeAt(state.index);
      const hi = toHex(ch1);
      if (hi < 0) return RegexpState.InvalidClass;
      state.index++;
      const ch2 = state.source.charCodeAt(state.index);
      const lo = toHex(ch2);
      if (lo < 0) return RegexpState.InvalidClass;
      state.index++;
      return (hi << 4) | lo;
    }

    case Chars.LowerC:
      if (state.index < state.length) {
        // Inside a character class, we also accept digits and underscore as
        // control characters, unless with /u. See Annex B:
        // ES#prod-annexB-ClassControlLetter
        const letter = state.source.charCodeAt(state.index) | 32;
        if (letter >= Chars.LowerA && letter <= Chars.LowerZ) {
          ++state.index;
          // Control letters mapped to ASCII control characters in the range
          // 0x00-0x1F.
          return letter & 0x1f;
        }
        if ((context & Context.OptionsDisableWebCompat) === 0) {
          return RegexpState.InvalidUnicodeClass;
        }
      }
      return RegexpState.InvalidClass;

    case Chars.LowerP:
    case Chars.UpperP:
      const regexPropState = parseRegexPropertyEscape(state, context);
      if (regexPropState & RegexpState.Invalid) return RegexpState.InvalidClass;

      if (regexPropState & RegexpState.Plain) {
        return (context & Context.OptionsDisableWebCompat) === 0
          ? RegexpState.InvalidUnicodeClass
          : RegexpState.InvalidClass;
      }
      return (context & Context.OptionsDisableWebCompat) === 0 ? RegexpState.Escape : RegexpState.InvalidPlainClass;

    case Chars.Zero:
      if ((context & Context.OptionsDisableWebCompat) === 0) {
        return parseOctalFromSecondDigit(state, next) | RegexpState.InvalidUnicodeClass;
      }
      next = state.source.charCodeAt(state.index);
      // With /u, \0 is interpreted as NUL if not followed by another digit.
      return state.index < state.length && next >= Chars.Zero && next <= Chars.Nine
        ? RegexpState.InvalidClass
        : Chars.Null;
    case Chars.One:
    case Chars.Two:
    case Chars.Three:
    case Chars.Four:
    case Chars.Five:
    case Chars.Six:
    case Chars.Seven:
      return (context & Context.OptionsDisableWebCompat) === 0
        ? parseOctalFromSecondDigit(state, next) | RegexpState.InvalidUnicodeClass
        : RegexpState.InvalidClass;
    case Chars.Eight:
    case Chars.Nine:
      return next === Chars.LowerC || next === Chars.LowerK
        ? RegexpState.Invalid
        : next | RegexpState.InvalidUnicodeClass;

    case Chars.Slash:
      return Chars.Slash;

    case Chars.Hyphen:
      if ((context & Context.OptionsDisableWebCompat) === 0) {
        return Chars.Hyphen;
      } else {
        return Chars.Hyphen | RegexpState.InvalidPlainClass;
      }

    default:
      // With /u, no identity escapes except for syntax characters and '-' are
      // allowed. Otherwise, all identity escapes are allowed.
      return (AsciiLookup[next] & CharType.IDContinue) > 0 || ((unicodeLookup[(next >>> 5) + 0] >>> next) & 31 & 1) > 0
        ? RegexpState.InvalidClass
        : next | RegexpState.InvalidUnicodeClass;
  }
}

function validateAtomEscape(
  state: ParserState,
  context: Context,
  backreferenceNames: string[],
  prev: number
): RegexpState {
  let next = state.source.charCodeAt(state.index++);
  switch (next) {
    // ControlEscape :: one of
    //   f n r t v
    case Chars.LowerF:
    case Chars.LowerN:
    case Chars.LowerR:
    case Chars.LowerT:
    case Chars.LowerV:
    // AtomEscape ::
    //   CharacterClassEscape
    //
    // CharacterClassEscape :: one of
    //   d D s S w W
    case Chars.LowerD:
    case Chars.UpperD:
    case Chars.LowerS:
    case Chars.UpperS:
    case Chars.UpperW:
    case Chars.LowerW:
    case Chars.Caret:
    case Chars.Dollar:
    case Chars.Backslash:
    case Chars.Period:
    case Chars.Asterisk:
    case Chars.Plus:
    case Chars.QuestionMark:
    case Chars.LeftParen:
    case Chars.RightParen:
    case Chars.LeftBracket:
    case Chars.RightBracket:
    case Chars.LeftBrace:
    case Chars.RightBrace:
    case Chars.VerticalBar:
    case Chars.Slash:
      return RegexpState.Valid;

    case Chars.LowerC:
      // Special case if it is an ASCII letter.
      // Convert uppercase to lower case letters.
      const letter = state.source.charCodeAt(state.index) | 32;
      if (letter >= Chars.LowerA && letter <= Chars.LowerZ) {
        state.index++;
        return RegexpState.Valid;
      }
      // controlLetter is not in range 'A'-'Z' or 'a'-'z'.
      // Read the backslash as a literal character instead of as
      // starting an escape.
      // ES#prod-annexB-ExtendedPatternCharacter
      return (context & Context.OptionsDisableWebCompat) === 0
        ? RegexpState.Plain
        : reportRegExp(state, Errors.InvalidUnicodeEscape);

    case Chars.LowerU:
      if (state.index === state.length) return RegexpState.Invalid;

      if (consumeOpt(state, Chars.LeftBrace)) {
        // \u{N}
        let ch2 = state.source.charCodeAt(state.index);
        let code = toHex(ch2);
        if (code < 0) return reportRegExp(state, Errors.InvalidEscape);
        state.index++;
        ch2 = state.source.charCodeAt(state.index);
        while (ch2 !== Chars.RightBrace) {
          const digit = toHex(ch2);
          if (digit < 0) return reportRegExp(state, Errors.InvalidEscape);
          code = code * 16 + digit;
          // Code point out of bounds
          if (code > 0x10ffff) return reportRegExp(state, Errors.InvalidEscape);
          state.index++;
          ch2 = state.source.charCodeAt(state.index);
        }
        state.index++;
        return RegexpState.Unicode;
      }
      // \uNNNN
      let codePoint = toHex(state.source.charCodeAt(state.index));
      if (codePoint < 0)
        return (context & Context.OptionsDisableWebCompat) === 0
          ? RegexpState.Plain
          : reportRegExp(state, Errors.InvalidUnicodeEscape);
      for (let i = 0; i < 3; i++) {
        state.index++;
        const digit = toHex(state.source.charCodeAt(state.index));
        if (digit < 0)
          return (context & Context.OptionsDisableWebCompat) === 0
            ? RegexpState.Plain
            : reportRegExp(state, Errors.InvalidUnicodeEscape);
        codePoint = codePoint * 16 + digit;
      }
      state.index++;
      return RegexpState.Valid;

    case Chars.LowerX:
      if (state.index === state.length || toHex(state.source.charCodeAt(state.index)) < 0) {
        return (context & Context.OptionsDisableWebCompat) === 0
          ? RegexpState.Plain
          : reportRegExp(state, Errors.InvalidEscape);
      }
      if (state.index === state.length || toHex(state.source.charCodeAt(state.index + 1)) < 0) {
        return (context & Context.OptionsDisableWebCompat) === 0
          ? RegexpState.Plain
          : reportRegExp(state, Errors.InvalidEscape);
      }
      return RegexpState.Valid;

    case Chars.LowerP:
    case Chars.UpperP:
      const regexPropState = parseRegexPropertyEscape(state, context);
      if (regexPropState === RegexpState.Invalid) {
        return RegexpState.Invalid;
      } else if (regexPropState === RegexpState.Plain) {
        if ((context & Context.OptionsDisableWebCompat) === 0) return RegexpState.Plain;
        return RegexpState.Invalid;
      } else {
        if ((context & Context.OptionsDisableWebCompat) === 0) return RegexpState.Valid;
        return RegexpState.Unicode;
      }

    case Chars.Zero: {
      const next = state.source.charCodeAt(state.index);
      if (next >= Chars.Zero && next <= Chars.Nine) {
        return (context & Context.OptionsDisableWebCompat) === 0
          ? RegexpState.Plain
          : reportRegExp(state, Errors.InvalidBackReferenceNumber);
      }
      return RegexpState.Valid;
    }
    case Chars.One:
    case Chars.Two:
    case Chars.Three:
    case Chars.Four:
    case Chars.Five:
    case Chars.Six:
    case Chars.Seven:
    case Chars.Eight:
    case Chars.Nine: {
      const first = state.source.charCodeAt(state.index);
      if (first >= Chars.Zero && first <= Chars.Nine) {
        // Try to parse a decimal literal that is no greater than the total number
        // of left capturing parentheses in the input.
        ++state.index;
        const second = state.source.charCodeAt(state.index);
        if (second >= Chars.Zero && second <= Chars.Nine) {
          return (context & Context.OptionsDisableWebCompat) === 0
            ? RegexpState.Plain
            : reportRegExp(state, Errors.InvalidDecimalEscape);
        }

        state.largestBackReference = Math.max((prev - Chars.Zero) * 10 + (first - Chars.Zero));
      } else {
        state.largestBackReference = Math.max(state.largestBackReference, prev - Chars.Zero);
      }
      return RegexpState.Valid;
    }

    case Chars.LowerK: {
      const c = state.source.charCodeAt(state.index);
      if (!consumeOpt(state, Chars.LessThan)) {
        return context & Context.OptionsDisableWebCompat
          ? reportRegExp(state, Errors.InvalidNamedReference)
          : RegexpState.Plain;
      }
      next = state.source.charCodeAt(state.index);

      if ((AsciiLookup[next] & CharType.IDStart) !== 0 && ((unicodeLookup[(next >>> 5) + 0] >>> next) & 31 & 1) === 0) {
        return context & Context.OptionsDisableWebCompat
          ? reportRegExp(state, Errors.InvalidNamedReference)
          : RegexpState.Plain;
      }

      state.index++;

      if (next > 0xffff) state.index++;

      if (state.source.charCodeAt(state.index) === Chars.GreaterThan) {
        state.tokenValue = next > 0xffff ? state.source.slice(state.index - 2, state.index) : fromCodePoint(next);
      } else {
        state.tokenValue = fromCodePoint(next);
        while (isIdentifierPart(state.source.charCodeAt(state.index)))
          state.tokenValue += fromCodePoint(state.source.charCodeAt(state.index++));
      }
      backreferenceNames.push(state.tokenValue);

      if (!consumeOpt(state, Chars.GreaterThan)) {
        if (context & Context.OptionsDisableWebCompat) {
          return reportRegExp(state, Errors.InvalidNamedReference);
        }
        return RegexpState.Plain;
      }
      return RegexpState.Valid;
    }

    case Chars.CarriageReturn:
    case Chars.LineFeed:
    case Chars.ParagraphSeparator:
    case Chars.LineSeparator:
      return reportRegExp(state, Errors.InvalidRegExp);

    default:
      if ((AsciiLookup[prev] & CharType.IDContinue) > 0 || ((unicodeLookup[(prev >>> 5) + 0] >>> prev) & 31 & 1) > 0) {
        if ((context & Context.OptionsDisableWebCompat) === 0) return reportRegExp(state, Errors.InvalidEscape);
      }
      return RegexpState.Plain;
  }
}

function parseCharacterClass(state: ParserState, context: Context) {
  let prev = 0;
  let surrogate = 0;
  let isSurrogate = false;
  let isSurrogateHead = false;
  let wasSurrogate = true;
  let wasSurrogateHead = false;
  let urangeOpen = false;
  let urangeLeft = 0;
  let nrangeOpen = false;
  let nrangeLeft = 0;

  let flagState = RegexpState.Valid;
  let next = state.source.charCodeAt(state.index);
  if (next === Chars.Caret) {
    ++state.index;
    next = state.source.charCodeAt(state.index);
  }

  let n = 0;
  while (true) {
    if (consumeOpt(state, Chars.RightBracket)) {
      return flagState;
    } else if (consumeOpt(state, Chars.Backslash)) {
      next = state.index === state.length ? -1 : validateClassCharacterEscape(state, context);
      if (next === RegexpState.InvalidClass) {
        flagState = reportRegExp(state, Errors.UnterminatedCharClass);
      } else if (next & RegexpState.InvalidUnicodeClass) {
        next = next ^ RegexpState.InvalidUnicodeClass;
        flagState =
          next === RegexpState.InvalidClass
            ? reportRegExp(state, Errors.RangeInvalid)
            : setState(state, flagState, RegexpState.Plain, Errors.RangeInvalid);
      } else if (next & RegexpState.InvalidPlainClass) {
        flagState = setState(state, flagState, RegexpState.Unicode, Errors.RangeInvalid);
      }
    } else if (
      next === Chars.CarriageReturn ||
      next === Chars.LineFeed ||
      next === Chars.ParagraphSeparator ||
      next === Chars.LineSeparator
    ) {
      return reportRegExp(state, Errors.AtEndOfPattern);
    } else {
      ++state.index;
    }

    if (next === RegexpState.Escape) {
      isSurrogate = false;
      isSurrogateHead = false;
    } else if (wasSurrogateHead && (next & 0xfc00) == 0xdc00) {
      isSurrogate = true;
      isSurrogateHead = false;
      surrogate = ((prev - 0xd800) << 10) + (next - 0xdc00) + 0x0010000;
    } else if (!wasSurrogate && !wasSurrogateHead && (next & 0x1fffff) > 0xffff) {
      isSurrogate = true;
      isSurrogateHead = false;
      surrogate = next;
    } else {
      isSurrogate = false;
      isSurrogateHead = next >= 0xd800 && next <= 0xdbff;
    }

    if (urangeOpen) {
      const urangeRight = isSurrogate ? surrogate : wasSurrogateHead ? prev : next;
      if (!isSurrogateHead || wasSurrogateHead) {
        urangeOpen = false;
        if (
          urangeLeft === RegexpState.InvalidClassRange ||
          urangeRight === RegexpState.InvalidClassRange ||
          urangeLeft > urangeRight
        ) {
          flagState = setState(state, flagState, RegexpState.Plain, Errors.RangeOutOfOrder);
        }
      }
    } else if (next === Chars.Hyphen && n > 0) {
      urangeOpen = true;
    } else {
      urangeLeft = isSurrogate ? surrogate : next;
    }

    if (nrangeOpen) {
      nrangeOpen = false;
      if (nrangeLeft === RegexpState.Escape || next === RegexpState.Escape) {
        flagState =
          context & Context.OptionsDisableWebCompat
            ? reportRegExp(state, Errors.RangeInvalid)
            : (flagState = setState(state, flagState, RegexpState.Plain, Errors.RangeOutOfOrder));
      } else if (
        nrangeLeft === RegexpState.InvalidClassRange ||
        next === RegexpState.InvalidClassRange ||
        nrangeLeft > next
      ) {
        flagState = setState(state, flagState, RegexpState.Unicode, Errors.InvalidRegExpWithUFlag);
      }
    } else if (next === Chars.Hyphen && n > 0) {
      nrangeOpen = true;
    } else {
      nrangeLeft = next;
    }

    wasSurrogate = isSurrogate;
    wasSurrogateHead = isSurrogateHead;
    prev = next;

    ++n;
    if (state.index === state.length) break;
    next = state.source.charCodeAt(state.index);
  }
  return reportRegExp(state, Errors.AtEndOfPattern);
}
