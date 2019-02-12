
/*@internal*/
export const enum CharType {
  None = 0,
  IDContinue = 1 << 0,
  IDStart = 1 << 1,
  Decimal = 1 << 2,
  KeywordCandidate = 1 << 3,
  CannotBeAKeyword = 1 << 4,
  Exponent = 1 << 5,
  SlowPath = 1 << 6,
  LineTerminator = 1 << 7,
  Quote = 1 << 8,
  WhiteSpace = 1 << 9 | LineTerminator,
  Letters = IDContinue | IDStart,
  Backslash = SlowPath,
  WhiteSpaceOrLineTerminator = WhiteSpace | LineTerminator
}

/*@internal*/
export const AsciiLookup = new Int8Array(0x80)
  .fill(CharType.Quote, 0x27, 0x28) /* ' */
  .fill(CharType.Quote, 0x22, 0x23) /* " */
  .fill(CharType.WhiteSpace, 0x20, 0x21) /* space */
  .fill(CharType.WhiteSpace, 0x9, 0xA) /* horizontal tab */
  .fill(CharType.WhiteSpace, 0xB, 0xC) /* vertical tab */
  .fill(CharType.LineTerminator, 0xD, 0xE) /* carriage return */
  .fill(CharType.WhiteSpace, 0xC, 0xD) /* form feed */
  .fill(CharType.LineTerminator, 0xA, 0xB) /* line feed */
  .fill(CharType.Exponent, 0x2B, 0x2C) /* + */
  .fill(CharType.Exponent, 0x2D, 0x2E) /* - */
  .fill(CharType.Letters, 0x24, 0x25) /* $ */
  .fill(CharType.SlowPath , 0x5C, 0x5D) /* \ */
  .fill(CharType.Decimal, 0x30, 0x3a) /* 0 - 9 */
  .fill(CharType.Letters | CharType.CannotBeAKeyword, 0x41, 0x5b) /* A-Z */
  .fill(CharType.Letters, 0x5f, 0x60) /* _ */
  // Note: Keywords are all lowercase and only contain letters
  .fill(CharType.Letters | CharType.KeywordCandidate, 0x61, 0x7b); /* a-z */

/**
 * A list of character constants with much more human-readable names.
 */
export const enum Chars {

  LastUnicodeChar = 0x10ffff,

  Null = 0x00,

  Backspace      = 0x08,
  Tab            = 0x09,
  LineFeed       = 0x0a,
  VerticalTab    = 0x0b,
  FormFeed       = 0x0c,
  CarriageReturn = 0x0d,

  Space       = 0x20,
  Exclamation = 0x21,
  DoubleQuote = 0x22,
  Hash        = 0x23,
  Dollar      = 0x24,
  Percent     = 0x25,
  Ampersand   = 0x26,
  SingleQuote = 0x27,
  LeftParen   = 0x28,
  RightParen  = 0x29,
  Asterisk    = 0x2a,
  Plus        = 0x2b,
  Comma       = 0x2c,
  Hyphen      = 0x2d,
  Period      = 0x2e,
  Slash       = 0x2f,

  Zero         = 0x30,
  One          = 0x31,
  Two          = 0x32,
  Three        = 0x33,
  Four         = 0x34,
  Five         = 0x35,
  Six          = 0x36,
  Seven        = 0x37,
  Eight        = 0x38,
  Nine         = 0x39,
  Colon        = 0x3a,
  Semicolon    = 0x3b,
  LessThan     = 0x3c,
  EqualSign    = 0x3d,
  GreaterThan  = 0x3e,
  QuestionMark = 0x3f,

  UpperA = 0x41,
  UpperB = 0x42,
  UpperC = 0x43,
  UpperD = 0x44,
  UpperE = 0x45,
  UpperF = 0x46,
  UpperG = 0x47,
  UpperH = 0x48,
  UpperI = 0x49,
  UpperJ = 0x4a,
  UpperK = 0x4b,
  UpperL = 0x4c,
  UpperM = 0x4d,
  UpperN = 0x4e,
  UpperO = 0x4f,

  UpperP       = 0x50,
  UpperQ       = 0x51,
  UpperR       = 0x52,
  UpperS       = 0x53,
  UpperT       = 0x54,
  UpperU       = 0x55,
  UpperV       = 0x56,
  UpperW       = 0x57,
  UpperX       = 0x58,
  UpperY       = 0x59,
  UpperZ       = 0x5a,
  LeftBracket  = 0x5b,
  Backslash    = 0x5c,
  RightBracket = 0x5d,
  Caret        = 0x5e,
  Underscore   = 0x5f,

  Backtick = 0x60,
  LowerA   = 0x61,
  LowerB   = 0x62,
  LowerC   = 0x63,
  LowerD   = 0x64,
  LowerE   = 0x65,
  LowerF   = 0x66,
  LowerG   = 0x67,
  LowerH   = 0x68,
  LowerI   = 0x69,
  LowerJ   = 0x6a,
  LowerK   = 0x6b,
  LowerL   = 0x6c,
  LowerM   = 0x6d,
  LowerN   = 0x6e,
  LowerO   = 0x6f,

  LowerP      = 0x70,
  LowerQ      = 0x71,
  LowerR      = 0x72,
  LowerS      = 0x73,
  LowerT      = 0x74,
  LowerU      = 0x75,
  LowerV      = 0x76,
  LowerW      = 0x77,
  LowerX      = 0x78,
  LowerY      = 0x79,
  LowerZ      = 0x7a,
  LeftBrace   = 0x7b,
  VerticalBar = 0x7c,
  RightBrace  = 0x7d,
  Tilde       = 0x7e,
  Delete      = 0x7f,

  NextLine         = 0x85,
  NonBreakingSpace = 0xa0,

  Ogham = 0x1680,

  EnQuad             = 0x2000,
  EmQuad             = 0x2001,
  EnSpace            = 0x2002,
  EmSpace            = 0x2003,
  ThreePerEmSpace    = 0x2004,
  FourPerEmSpace     = 0x2005,
  SixPerEmSpace      = 0x2006,
  FigureSpace        = 0x2007,
  PunctuationSpace   = 0x2008,
  ThinSpace          = 0x2009,
  HairSpace          = 0x200a,
  ZeroWidthSpace     = 0x200b,
  ZeroWidthJoiner    = 0x200c,
  ZeroWidthNonJoiner = 0x200d,

  LineSeparator      = 0x2028,
  ParagraphSeparator = 0x2029,

  NarrowNoBreakSpace = 0x202f,
  MathematicalSpace  = 0x205f,
  IdeographicSpace   = 0x3000,

  ZeroWidthNoBreakSpace = 0xfeff,

  ByteOrderMark = 0xffef,
}
