export const enum Token {
  Type = 0xff,

  /* Precedence for binary operators (always positive) */
  PrecStart = 8,
  Precedence = 15 << PrecStart, // 8-11

  /* Attribute names */
  Contextual     = 1 << 12,
  Reserved       = 1 << 13,
  FutureReserved = 1 << 14,
  Keyword        = 1 << 15 | Contextual | Reserved | FutureReserved,
  IdentifierName  = 1 << 16,
  IsPatternStart    = 1 << 17,
  IsLogical      = 1 << 18,
  IsExpressionStart = 1 << 19,
  IsIdentifier   = 1 << 20,
  IsAwait      = 1 << 21,
  IsAsync                = 1 << 22,
  IsYield        = 1 << 23,
  IsGenerator  = 1 << 24,
  IsAssignOp     = 1 << 25,
  IsBinaryOp   = 1 << 26 | IsExpressionStart,
  IsUnaryOp   = 1 << 27 | IsExpressionStart,
  IsUpdateOp   = 1 << 28 | IsExpressionStart,
  IsVarDecl   = 1 << 29,
  ASI      = 1 << 30,
  WhiteSpace  = 1 << 31,

  /* Node types */
  EndOfSource = 0, // Pseudo

  /* Constants/Bindings */
 /* Constants/Bindings */
 Identifier        = 1 | IsExpressionStart | IsIdentifier,
 NumericLiteral    = 2 | IsExpressionStart,
 StringLiteral     = 3 | IsExpressionStart,
 RegularExpression = 4 | IsExpressionStart,
 FalseKeyword      = 5 | IsExpressionStart | Reserved,
 TrueKeyword       = 6 | IsExpressionStart | Reserved,
 NullKeyword       = 7 | IsExpressionStart | Reserved,

  /* Template nodes */
  TemplateCont = 8 | IsExpressionStart,
  TemplateTail = 9 | IsExpressionStart,

  /* Punctuators */
  Arrow        = 10, // =>
  LeftParen    = 11 | IsExpressionStart, // (
  LeftBrace    = 12 | IsExpressionStart | IsPatternStart, // {
  Period       = 13, // .
  Ellipsis     = 14, // ...
  RightBrace   = 15, // }
  RightParen   = 16, // )
  Semicolon    = 17 | ASI, // ;
  Comma        = 18, // ,
  LeftBracket  = 19 | IsPatternStart | IsExpressionStart , // [
  RightBracket = 20, // ]
  Colon        = 21, // :
  QuestionMark = 22, // ?
  SingleQuote  = 23, // '
  DoubleQuote  = 24, // "
  JSXClose     = 25, // </
  JSXAutoClose = 26, // />

  /* Update operators */
  Increment = 27, // ++
  Decrement = 28, // --

  /* Assign operators */
  Assign                  = 29 | IsAssignOp, // =
  ShiftLeftAssign         = 30 | IsAssignOp, // <<=
  ShiftRightAssign        = 31 | IsAssignOp, // >>=
  LogicalShiftRightAssign = 32 | IsAssignOp, // >>>=
  ExponentiateAssign      = 33 | IsAssignOp, // **=
  AddAssign               = 34 | IsAssignOp, // +=
  SubtractAssign          = 35 | IsAssignOp, // -=
  MultiplyAssign          = 36 | IsAssignOp, // *=
  DivideAssign            = 37 | IsAssignOp | IsExpressionStart, // /=
  ModuloAssign            = 38 | IsAssignOp, // %=
  BitwiseXorAssign        = 39 | IsAssignOp, // ^=
  BitwiseOrAssign         = 40 | IsAssignOp, // |=
  BitwiseAndAssign        = 41 | IsAssignOp, // &=

  /* Unary/binary operators */
  TypeofKeyword      = 42 | IsUnaryOp   | Reserved,
  DeleteKeyword      = 43 | IsUnaryOp   | Reserved,
  VoidKeyword        = 44 | IsUnaryOp   | Reserved,
  Negate             = 45 | IsUnaryOp, // !
  Complement         = 46 | IsUnaryOp, // ~
  Add                = 47 | IsUnaryOp   | IsBinaryOp | 9 << PrecStart, // +
  Subtract           = 48 | IsUnaryOp   | IsBinaryOp | 9 << PrecStart, // -
  InKeyword          = 49 | IsBinaryOp  | 7 << PrecStart   | Reserved,
  InstanceofKeyword  = 50 | IsBinaryOp  | 7 << PrecStart   | Reserved,
  Multiply           = 51 | IsBinaryOp  |  10 << PrecStart, // *
  Modulo             = 52 | IsBinaryOp  | 10 << PrecStart, // %
  Divide             = 53 | IsExpressionStart | IsBinaryOp  | 10 << PrecStart, // /
  Exponentiate       = 54 | IsBinaryOp  | 11 << PrecStart, // **
  LogicalAnd         = 55 | IsLogical         | IsBinaryOp  | 2 << PrecStart, // &&
  LogicalOr          = 56 | IsLogical         | IsBinaryOp  | 1 << PrecStart, // ||
  StrictEqual        = 57 | IsBinaryOp  | 6 << PrecStart, // ===
  StrictNotEqual     = 58 | IsBinaryOp  | 6 << PrecStart, // !==
  LooseEqual         = 59 | IsBinaryOp  | 6 << PrecStart, // ==
  LooseNotEqual      = 60 | IsBinaryOp  | 6 << PrecStart, // !=
  LessThanOrEqual    = 61 | IsBinaryOp  | 7 << PrecStart, // <=
  GreaterThanOrEqual = 62 | IsBinaryOp  | 7 << PrecStart, // >=
  LessThan           = 63 | IsExpressionStart | IsBinaryOp  | 7 << PrecStart, // <
  GreaterThan        = 64 | IsBinaryOp  | 7 << PrecStart, // >
  ShiftLeft          = 65 | IsBinaryOp  | 8 << PrecStart, // <<
  ShiftRight         = 66 | IsBinaryOp  | 8 << PrecStart, // >>
  LogicalShiftRight  = 67 | IsBinaryOp  | 8 << PrecStart, // >>>
  BitwiseAnd         = 68 | IsBinaryOp  | 5 << PrecStart, // &
  BitwiseOr          = 69 | IsBinaryOp  | 3 << PrecStart, // |
  BitwiseXor         = 70 | IsBinaryOp  | 4 << PrecStart, // ^


  /* Variable declaration kinds */
  VarKeyword   = 71 | Reserved       | IsExpressionStart | IsVarDecl,
  LetKeyword   = 72 | FutureReserved       | IsExpressionStart | IsVarDecl,
  ConstKeyword = 73 | Reserved       | IsExpressionStart | IsVarDecl,

  /* Other reserved words */
  BreakKeyword    = 74 | Reserved,
  CaseKeyword     = 75 | Reserved,
  CatchKeyword    = 76 | Reserved,
  ClassKeyword    = 77 | Reserved | IsExpressionStart,
  ContinueKeyword = 78 | Reserved,
  DebuggerKeyword = 79 | Reserved,
  DefaultKeyword  = 80 | Reserved,
  DoKeyword       = 81 | Reserved,
  ElseKeyword     = 82 | Reserved,
  ExportKeyword   = 83 | Reserved,
  ExtendsKeyword  = 84 | Reserved,
  FinallyKeyword  = 85 | Reserved,
  ForKeyword      = 86 | Reserved,
  FunctionKeyword = 87 | Reserved | IsExpressionStart,
  IfKeyword       = 88 | Reserved,
  ImportKeyword   = 89 | Reserved | IsExpressionStart,
  NewKeyword      = 90 | Reserved | IsExpressionStart,
  ReturnKeyword   = 91 | Reserved,
  SuperKeyword    = 92 | Reserved | IsExpressionStart,
  SwitchKeyword   = 93 | Reserved | IsExpressionStart,
  ThisKeyword     = 94 | Reserved | IsExpressionStart,
  ThrowKeyword    = 95 | Reserved | IsExpressionStart,
  TryKeyword      = 96 | Reserved,
  WhileKeyword    = 97 | Reserved,
  WithKeyword     = 98 | Reserved,

  /* Strict mode reserved words */
  ImplementsKeyword = 99 | FutureReserved,
  InterfaceKeyword  = 100 | FutureReserved,
  PackageKeyword    = 101 | FutureReserved,
  PrivateKeyword    = 102 | FutureReserved,
  ProtectedKeyword  = 103 | FutureReserved,
  PublicKeyword     = 104 | FutureReserved,
  StaticKeyword     = 105 | FutureReserved,
  YieldKeyword      = 106 | FutureReserved | IsExpressionStart | IsYield,

  /* Contextual keywords */
  AsKeyword          = 107 | Contextual,
  AsyncKeyword       = 108 | Contextual | IsExpressionStart | IsAsync,
  AwaitKeyword       = 109 | Contextual | IsExpressionStart | IsAwait,
  ConstructorKeyword = 110 | Contextual,
  GetKeyword         = 111 | Contextual,
  SetKeyword         = 112 | Contextual,
  FromKeyword        = 113 | Contextual,
  OfKeyword          = 114 | Contextual,
  EnumKeyword        = 115 | Contextual | IsIdentifier,
  At                      = 116,
  BigIntLiteral           = 117 | IsExpressionStart,
  JSXText                 = 118,
  PrivateName             = 119 | IsIdentifier,
  Global                  = 120 | IsIdentifier,
  EscapedStrictReserved   = 121 | IsIdentifier,
  EscapedKeyword          = 122 | IsIdentifier,
}

// Note: this *must* be kept in sync with the enum's order.
//
// It exploits the enum value ordering, and it's necessarily a complete and
// utter hack.
//
// All to lower it to a single monomorphic array access.
export const KeywordDescTable = [
  "end of source",

  /* Constants/Bindings */
  "identifier", "number", "string", "regular expression",
  "false", "true", "null",

  /* Template nodes */
  "template continuation", "template end",

  /* Punctuators */
  "=>", "(", "{", ".", "...", "}", ")", ";", ",", "[", "]", ":", "?", "'", "\"", "</", "/>",

  /* Update operators */
  "++", "--",

  /* Assign operators */
  "=", "<<=", ">>=", ">>>=", "**=", "+=", "-=", "*=", "/=", "%=", "^=", "|=",
  "&=",

  /* Unary/binary operators */
  "typeof", "delete", "void", "!", "~", "+", "-", "in", "instanceof", "*", "%", "/", "**", "&&",
  "||", "===", "!==", "==", "!=", "<=", ">=", "<", ">", "<<", ">>", ">>>", "&", "|", "^",

  /* Variable declaration kinds */
  "var", "let", "const",

  /* Other reserved words */
  "break", "case", "catch", "class", "continue", "debugger", "default", "do", "else", "export",
  "extends", "finally", "for", "function", "if", "import", "new", "return", "super", "switch",
  "this", "throw", "try", "while", "with",

  /* Strict mode reserved words */
  "implements", "interface", "package", "private", "protected", "public", "static", "yield",

  /* Contextual keywords */
  "as", "async", "await", "constructor", "get", "set", "from", "of",

  /* Others */
  "enum", "@", "BigInt", "JSXText", "#", "Identifier", "Identifier", "Identifier",
];


// Normal object is much faster than Object.create(null), even with typeof check to avoid Object.prototype interference
export const descKeywordTable: { [key: string]: Token } = Object.create(null, {
  this: { value: Token.ThisKeyword },
  function: { value: Token.FunctionKeyword },
  if: { value: Token.IfKeyword },
  return: { value: Token.ReturnKeyword },
  var: { value: Token.VarKeyword },
  else: { value: Token.ElseKeyword },
  for: { value: Token.ForKeyword },
  new: { value: Token.NewKeyword },
  in: { value: Token.InKeyword },
  typeof: { value: Token.TypeofKeyword },
  while: { value: Token.WhileKeyword },
  case: { value: Token.CaseKeyword },
  break: { value: Token.BreakKeyword },
  try: { value: Token.TryKeyword },
  catch: { value: Token.CatchKeyword },
  delete: { value: Token.DeleteKeyword },
  throw: { value: Token.ThrowKeyword },
  switch: { value: Token.SwitchKeyword },
  continue: { value: Token.ContinueKeyword },
  default: { value: Token.DefaultKeyword },
  instanceof: { value: Token.InstanceofKeyword },
  do: { value: Token.DoKeyword },
  void: { value: Token.VoidKeyword },
  finally: { value: Token.FinallyKeyword },
  async: { value: Token.AsyncKeyword },
  await: { value: Token.AwaitKeyword },
  class: { value: Token.ClassKeyword },
  const: { value: Token.ConstKeyword },
  constructor: { value: Token.ConstructorKeyword },
  debugger: { value: Token.DebuggerKeyword },
  export: { value: Token.ExportKeyword },
  extends: { value: Token.ExtendsKeyword },
  false: { value: Token.FalseKeyword },
  from: { value: Token.FromKeyword },
  get: { value: Token.GetKeyword },
  implements: { value: Token.ImplementsKeyword },
  import: { value: Token.ImportKeyword },
  interface: { value: Token.InterfaceKeyword },
  let: { value: Token.LetKeyword },
  null: { value: Token.NullKeyword },
  of: { value: Token.OfKeyword },
  package: { value: Token.PackageKeyword },
  private: { value: Token.PrivateKeyword },
  protected: { value: Token.ProtectedKeyword },
  public: { value: Token.PublicKeyword },
  set: { value: Token.SetKeyword },
  static: { value: Token.StaticKeyword },
  super: { value: Token.SuperKeyword },
  true: { value: Token.TrueKeyword },
  with: { value: Token.WithKeyword },
  yield: { value: Token.YieldKeyword },
  as: { value: Token.AsKeyword }
});
