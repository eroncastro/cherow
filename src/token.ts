export const enum Token {
  Type = 0xff,

  /* Precedence for binary operators (always positive) */
  PrecStart = 8,
  Precedence = 15 << PrecStart, // 8-11

  /* Attribute names */
  BadEscape      = 1 << 4,
  Keyword        = 1 << 12,
  Contextual     = 1 << 13 | Keyword,
  Reserved       = 1 << 14 | Keyword,
  FutureReserved = 1 << 15 | Keyword,

  IsExpressionStart    = 1 << 16,
  IsIdentifier = 1 << 17 | IsExpressionStart,

  IsLogical            = 1 << 18,
  IsEvalOrArguments    = 1 << 19 | IsIdentifier,
  IsPatternStart     = 1 << 20,
  IsAssignOp           = 1 << 21,
  Template = 1 << 22 | IsExpressionStart,
  IsBinaryOp           = 1 << 23 | IsExpressionStart,
  IsUnaryOp            = 1 << 24 | IsExpressionStart,
  IsUpdateOp           = 1 << 25 | IsExpressionStart,
  Punctuator           = 1 << 26,
  IsAnyIdentifier      = 1 << 27 | IsIdentifier,

  WhiteSpace           = 1 << 28,
  IsStringOrNumber     = 1 << 29,
  Invalid              = 1 << 30,

  /* Node types */
  EndOfSource = 0, // Pseudo

  /* Constants/Bindings */
  Identifier        = 1 | IsIdentifier | IsExpressionStart,
  NumericLiteral    = 2 | IsExpressionStart | IsStringOrNumber,
  StringLiteral     = 3 | IsExpressionStart | IsStringOrNumber,
  RegularExpression = 4 | IsExpressionStart,
  FalseKeyword      = 5 | Reserved | IsExpressionStart,
  TrueKeyword       = 6 | Reserved | IsExpressionStart,
  NullKeyword       = 7 | Reserved | IsExpressionStart,

  /* Template nodes */
  TemplateHead = 8 | Template,
  TemplateMiddle = 9 | Template,
  TemplateTail = 10 | Template,
  NoSubstitutionTemplate = 11 | Template,

  /* Punctuators */
  Arrow        = 12, // =>
  LeftParen    = 13 | IsExpressionStart , // (
  LeftBrace    = 14 | IsExpressionStart | IsPatternStart, // {
  Period       = 15, // .
  Ellipsis     = 16, // ...
  RightBrace   = 17, // }
  RightParen   = 18, // )
  Semicolon    = 19, // ;
  Comma        = 20, // ,
  LeftBracket  = 21 | IsExpressionStart | IsPatternStart, // [
  RightBracket = 22, // ]
  Colon        = 23, // :
  QuestionMark = 24, // ?
  SingleQuote  = 25, // '
  DoubleQuote  = 26, // "
  JSXClose     = 27, // </
  JSXAutoClose = 28, // />

  /* Update operators */
  Increment = 29, // ++
  Decrement = 30, // --

  /* Assign operators */
  Assign                  = 31 | IsAssignOp, // =
  ShiftLeftAssign         = 32 | IsAssignOp, // <<=
  ShiftRightAssign        = 33 | IsAssignOp, // >>=
  LogicalShiftRightAssign = 34 | IsAssignOp, // >>>=
  ExponentiateAssign      = 35 | IsAssignOp, // **=
  AddAssign               = 36 | IsAssignOp, // +=
  SubtractAssign          = 37 | IsAssignOp, // -=
  MultiplyAssign          = 38 | IsAssignOp, // *=
  DivideAssign            = 39 | IsAssignOp | IsExpressionStart, // /=
  ModuloAssign            = 40 | IsAssignOp, // %=
  BitwiseXorAssign        = 41 | IsAssignOp, // ^=
  BitwiseOrAssign         = 42 | IsAssignOp, // |=
  BitwiseAndAssign        = 43 | IsAssignOp, // &=

  /* Unary/binary operators */
  TypeofKeyword      = 44 | IsUnaryOp | Reserved,
  DeleteKeyword      = 45 | IsUnaryOp | Reserved,
  VoidKeyword        = 46 | IsUnaryOp | Reserved,
  Negate             = 47 | IsUnaryOp, // !
  Complement         = 48 | IsUnaryOp, // ~
  Add                = 49 | IsUnaryOp | IsBinaryOp | 9 << PrecStart, // +
  Subtract           = 50 | IsUnaryOp | IsBinaryOp | 9 << PrecStart, // -
  InKeyword          = 51 | IsBinaryOp | 7 << PrecStart | Reserved,
  InstanceofKeyword  = 52 | IsBinaryOp | 7 << PrecStart | Reserved,
  Multiply           = 53 | IsBinaryOp | 10 << PrecStart, // *
  Modulo             = 54 | IsBinaryOp | 10 << PrecStart, // %
  Divide             = 55 | IsBinaryOp | IsExpressionStart | 10 << PrecStart, // /
  Exponentiate       = 56 | IsBinaryOp | 11 << PrecStart, // **
  LogicalAnd         = 57 | IsBinaryOp | IsLogical | 2 << PrecStart, // &&
  LogicalOr          = 58 | IsBinaryOp | IsLogical | 1 << PrecStart, // ||
  StrictEqual        = 59 | IsBinaryOp | 6 << PrecStart, // ===
  StrictNotEqual     = 60 | IsBinaryOp | 6 << PrecStart, // !==
  LooseEqual         = 61 | IsBinaryOp | 6 << PrecStart, // ==
  LooseNotEqual      = 62 | IsBinaryOp | 6 << PrecStart, // !=
  LessThanOrEqual    = 63 | IsBinaryOp | 7 << PrecStart, // <=
  GreaterThanOrEqual = 64 | IsBinaryOp | 7 << PrecStart, // >=
  LessThan           = 65 | IsBinaryOp | IsExpressionStart | 7 << PrecStart, // <
  GreaterThan        = 66 | IsBinaryOp | 7 << PrecStart, // >
  ShiftLeft          = 67 | IsBinaryOp | 8 << PrecStart, // <<
  ShiftRight         = 68 | IsBinaryOp | 8 << PrecStart, // >>
  LogicalShiftRight  = 69 | IsBinaryOp | 8 << PrecStart, // >>>
  BitwiseAnd         = 70 | IsBinaryOp | 5 << PrecStart, // &
  BitwiseOr          = 71 | IsBinaryOp | 3 << PrecStart, // |
  BitwiseXor         = 72 | IsBinaryOp | 4 << PrecStart, // ^

  /* Variable declaration kinds */
  VarKeyword   = 73 | IsExpressionStart | Reserved,
  LetKeyword   = 74 | IsExpressionStart | FutureReserved | IsIdentifier,
  ConstKeyword = 75 | IsExpressionStart | Reserved,

  /* Other reserved words */
  BreakKeyword    = 76 | Reserved,
  CaseKeyword     = 77 | Reserved,
  CatchKeyword    = 78 | Reserved,
  ClassKeyword    = 79 | IsExpressionStart | Reserved,
  ContinueKeyword = 80 | Reserved,
  DebuggerKeyword = 81 | Reserved,
  DefaultKeyword  = 82 | Reserved,
  DoKeyword       = 83 | Reserved,
  ElseKeyword     = 84 | Reserved,
  ExportKeyword   = 85 | Reserved,
  ExtendsKeyword  = 86 | Reserved,
  FinallyKeyword  = 87 | Reserved,
  ForKeyword      = 88 | Reserved,
  FunctionKeyword = 89 | IsExpressionStart | Reserved,
  IfKeyword       = 90 | Reserved,
  ImportKeyword   = 91 | IsExpressionStart | Reserved,
  NewKeyword      = 92 | IsExpressionStart | Reserved,
  ReturnKeyword   = 93 | Reserved,
  SuperKeyword    = 94 | IsExpressionStart | Reserved,
  SwitchKeyword   = 95 | IsExpressionStart | Reserved,
  ThisKeyword     = 96 | IsExpressionStart | Reserved,
  ThrowKeyword    = 97 | IsExpressionStart | Reserved,
  TryKeyword      = 98 | Reserved,
  WhileKeyword    = 99 | Reserved,
  WithKeyword     = 100 | Reserved,

  /* Strict mode reserved words */
  ImplementsKeyword = 101 | FutureReserved,
  InterfaceKeyword  = 102 | FutureReserved,
  PackageKeyword    = 103 | FutureReserved,
  PrivateKeyword    = 104 | FutureReserved,
  ProtectedKeyword  = 105 | FutureReserved,
  PublicKeyword     = 106 | FutureReserved,
  StaticKeyword     = 107 | FutureReserved | IsIdentifier,
  YieldKeyword      = 108 | FutureReserved | IsExpressionStart | IsIdentifier,

  /* Contextual keywords */
  AsKeyword          = 109 | Contextual,
  AsyncKeyword       = 110 | Contextual | IsIdentifier,
  AwaitKeyword       = 111 | Contextual | IsExpressionStart | IsIdentifier,
  ConstructorKeyword = 112 | Contextual,
  GetKeyword         = 113 | Contextual,
  SetKeyword         = 114 | Contextual,
  FromKeyword        = 115 | Contextual,
  OfKeyword          = 116 | Contextual,
  EnumKeyword        = 117 | Contextual,

  Eval               = 117 | IsEvalOrArguments,
  Arguments          = 118 | IsEvalOrArguments,

  EscapedReserved  = 117 | IsAnyIdentifier,
  EscapedFutureReserved   = 118 | IsAnyIdentifier,
  ReservedIfStrict  = 119 | IsAnyIdentifier,

  PrivateName  = 120 | IsIdentifier,
  BigIntLiteral  = 121 | IsIdentifier,
  CarriageReturn  = 122,
  LineFeed  = 123,
  Tab  = 124,
  VerticalTab  = 125,
  FormFeed  = 126,
  Space  = 127,
}

export const KeywordDescTable = [
  'end of source',

  /* Constants/Bindings */
  'identifier', 'number', 'string', 'regular expression',
  'false', 'true', 'null',

  /* Template nodes */
  'template head', 'template middle', 'template tail', 'No substitution template',

  /* Punctuators */
  '=>', '(', '{', '.', '...', '}', ')', ';', ',', '[', ']', ':', '?', '\'', '"', '</', '/>',

  /* Update operators */
  '++', '--',

  /* Assign operators */
  '=', '<<=', '>>=', '>>>=', '**=', '+=', '-=', '*=', '/=', '%=', '^=', '|=',
  '&=',

  /* Unary/binary operators */
  'typeof', 'delete', 'void', '!', '~', '+', '-', 'in', 'instanceof', '*', '%', '/', '**', '&&',
  '||', '===', '!==', '==', '!=', '<=', '>=', '<', '>', '<<', '>>', '>>>', '&', '|', '^',

  /* Variable declaration kinds */
  'var', 'let', 'const',

  /* Other reserved words */
  'break', 'case', 'catch', 'class', 'continue', 'debugger', 'default', 'do', 'else', 'export',
  'extends', 'finally', 'for', 'function', 'if', 'import', 'new', 'return', 'super', 'switch',
  'this', 'throw', 'try', 'while', 'with',

  /* Strict mode reserved words */
  'implements', 'interface', 'package', 'private', 'protected', 'public', 'static', 'yield',

  /* Contextual keywords */
  'as', 'async', 'await', 'constructor', 'get', 'set', 'from', 'of',

  /* Others */
  'enum', 'eval', 'arguments', 'escaped reserved', 'escaped future reserved', 'reserved if strict', '#',

  'BigIntLiteral'
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
  enum: { value: Token.EnumKeyword }
});
