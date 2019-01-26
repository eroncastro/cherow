System.register('cherow', [], function (exports, module) {
  'use strict';
  return {
    execute: function () {

      exports({
        parseSource: parseSource,
        parse: parse,
        parseScript: parseScript,
        parseModule: parseModule
      });

      const KeywordDescTable = [
          'end of source',
          'identifier',
          'number',
          'string',
          'regular expression',
          'false',
          'true',
          'null',
          'template continuation',
          'template end',
          '=>',
          '(',
          '{',
          '.',
          '...',
          '}',
          ')',
          ';',
          ',',
          '[',
          ']',
          ':',
          '?',
          '\'',
          '"',
          '</',
          '/>',
          '++',
          '--',
          '=',
          '<<=',
          '>>=',
          '>>>=',
          '**=',
          '+=',
          '-=',
          '*=',
          '/=',
          '%=',
          '^=',
          '|=',
          '&=',
          'typeof',
          'delete',
          'void',
          '!',
          '~',
          '+',
          '-',
          'in',
          'instanceof',
          '*',
          '%',
          '/',
          '**',
          '&&',
          '||',
          '===',
          '!==',
          '==',
          '!=',
          '<=',
          '>=',
          '<',
          '>',
          '<<',
          '>>',
          '>>>',
          '&',
          '|',
          '^',
          'var',
          'let',
          'const',
          'break',
          'case',
          'catch',
          'class',
          'continue',
          'debugger',
          'default',
          'do',
          'else',
          'export',
          'extends',
          'finally',
          'for',
          'function',
          'if',
          'import',
          'new',
          'return',
          'super',
          'switch',
          'this',
          'throw',
          'try',
          'while',
          'with',
          'implements',
          'interface',
          'package',
          'private',
          'protected',
          'public',
          'static',
          'yield',
          'as',
          'async',
          'await',
          'constructor',
          'get',
          'set',
          'from',
          'of',
          'enum',
          '@',
          'BigInt',
          'JSXText',
          '#',
          'Global'
      ];
      const descKeywordTable = Object.create(null, {
          this: { value: 151646 },
          function: { value: 151639 },
          if: { value: 20568 },
          return: { value: 20571 },
          var: { value: 268587079 },
          else: { value: 20562 },
          for: { value: 20566 },
          new: { value: 151642 },
          in: { value: 33707825 },
          typeof: { value: 33706026 },
          while: { value: 20577 },
          case: { value: 20555 },
          break: { value: 20554 },
          try: { value: 20576 },
          catch: { value: 20556 },
          delete: { value: 33706027 },
          throw: { value: 151647 },
          switch: { value: 151645 },
          continue: { value: 20558 },
          default: { value: 20560 },
          instanceof: { value: 16930610 },
          do: { value: 20561 },
          void: { value: 33706028 },
          finally: { value: 20565 },
          async: { value: 1060972 },
          await: { value: 667757 },
          class: { value: 151629 },
          const: { value: 402804809 },
          constructor: { value: 12398 },
          debugger: { value: 20559 },
          export: { value: 20563 },
          extends: { value: 20564 },
          false: { value: 151557 },
          from: { value: 12401 },
          get: { value: 12399 },
          implements: { value: 36963 },
          import: { value: 151641 },
          interface: { value: 36964 },
          let: { value: 402821192 },
          null: { value: 151559 },
          of: { value: 12402 },
          package: { value: 36965 },
          private: { value: 36966 },
          protected: { value: 36967 },
          public: { value: 36968 },
          set: { value: 12400 },
          static: { value: 36969 },
          super: { value: 151644 },
          true: { value: 151558 },
          with: { value: 20578 },
          yield: { value: 2265194 },
          as: { value: 16920683 }
      });

      const errorMessages = {
          [0]: 'Unexpected token',
          [2]: 'Nothing to repeat',
          [3]: '\\ at end of pattern',
          [4]: 'Invalid property name',
          [5]: 'Invalid decimal escape',
          [6]: 'Back references can not have more two or more consecutive numbers',
          [7]: 'Invalid named reference',
          [8]: 'Invalid regular expression',
          [9]: 'Invalid Escape',
          [24]: 'Invalid named capture referenced',
          [11]: 'Invalid regular expression without u-flag',
          [12]: 'Invalid regular expression with u-flag',
          [10]: 'Invalid unicode Escape',
          [13]: 'Range out of order in character class',
          [14]: 'Invalid character class',
          [15]: 'Unterminated character class',
          [23]: 'No group to terminate',
          [16]: 'Invalid quantifier',
          [17]: 'Invalid quantifier without u-flag and web compatible mode',
          [18]: 'Unclosed group',
          [19]: 'Invalid group',
          [20]: 'Invalid capture group name',
          [21]: 'Invalid extended unicode escape',
          [22]: "Already declared group name '%0'",
          [25]: 'Lone quantifier brackets',
          [26]: "Duplicate regular expression flag '%0'",
          [27]: 'Unterminated MultiLineComment',
          [28]: 'HTML comments are not allowed in modules',
          [29]: "Illegal character '%0'",
          [34]: 'Unterminated string literal',
          [35]: 'Unterminated template literal',
          [33]: 'Octal escapes are not allowed in strict mode',
          [32]: 'Escapes \\8 or \\9 are not syntactically valid escapes',
          [31]: 'Invalid hexadecimal escape sequence',
          [30]: 'Unicode codepoint must not be greater than 0x10FFFF',
          [36]: 'Missing exponent',
          [38]: 'Invalid BigIntLiteral',
          [37]: 'Identifier starts immediately after numeric literal',
          [39]: 'Expected number in radix %0',
          [40]: 'Legacy octal literals are not allowed in strict mode',
          [41]: "Identifier '%0' has already been declared",
          [45]: "Duplicate binding '%0'",
          [42]: "The `catch` var '%0' can't be redefined",
          [44]: 'In strict mode code, functions can only be declared at top level or inside a block',
          [43]: 'In non-strict mode code, functions can only be declared at top level, inside a block, or as the body of an if statement',
          [46]: "let can't be a variable name in strict mode",
          [47]: "Exported binding '%0' is not declared",
          [48]: "Exported binding '%0' has already been declared",
          [49]: 'Missing initializer in const declaration',
          [54]: 'Illegal newline after throw',
          [55]: 'Illegal return statement',
          [50]: 'Illegal continue statement: no surrounding iteration statement',
          [51]: 'Illegal break statement',
          [53]: "Label '%0' has already been declared",
          [52]: 'Strict mode code may not include a with statement',
          [56]: 'Delete of an unqualified identifier in strict mode',
          [57]: 'Unary expressions as the left operand of an exponentation expression must be disambiguated with parentheses',
          [58]: 'Calls to super must be in the "constructor" method of a class expression or class declaration that has a superclass',
          [59]: 'Member access on super must be in a method',
          [1]: "Unexpected token '%0'",
          [60]: 'Duplicate constructor method in class',
          [61]: 'Function name may not be eval or arguments in strict mode',
          [62]: "Classes may not have a static property named 'prototype'",
          [63]: 'Class constructor may not be a %0',
          [64]: 'Unterminated regular expression',
          [65]: 'Unexpected regular expression flag',
          [66]: "'yield' is a reserved keyword within generator function bodies",
          [67]: "'%0' may not be used as an identifier in this context",
          [68]: "Can not use 'let' as a class name",
          [69]: 'Can not use `let` when binding through `let` or `const`',
          [70]: 'Can not use `let` as variable name in strict mode',
          [71]: 'Await is only valid in async functions',
          [72]: 'Invalid use of reserved word as variable name',
          [73]: '`Static` is a reserved word in strict mode',
          [74]: ' Invalid use of reserved word as a variable name in strict mode',
          [75]: "%0 can't appear in single-statement context",
          [76]: 'Async functions can only be declared at the top level or inside a block',
          [77]: "Classes may not have a private field named '#constructor'",
          [78]: "Classes may not have a field named 'constructor'",
          [79]: "Classes may not have a static private property named '#prototype'",
          [80]: 'Async methods are a restricted production and cannot have a newline following it',
          [81]: 'Only methods are allowed in classes',
          [82]: 'Private fields can not be deleted',
          [83]: 'Private fields can not be deleted',
          [83]: '%0 increment/decrement may not have eval or arguments operand in strict mode',
          [84]: 'Invalid left-hand side in assignment',
          [85]: 'Unexpected eval or arguments in strict mode',
          [86]: 'Unexpected strict mode reserved word',
          [87]: 'Invalid shorthand property initializer',
          [88]: 'Illegal arrow function parameter list',
          [89]: 'Invalid left-hand side in for-in',
          [90]: 'Invalid left-hand side in for-loop',
          [91]: 'Enable the experimental option for V8 experimental features',
          [92]: 'A trailing comma is not permitted after the rest element ',
          [93]: 'Legacy octal literals are not allowed in strict mode',
          [94]: '%0 functions must have %1 argument%2',
          [95]: 'Setter function argument must not be a rest parameter',
          [96]: '%0  statement must be nested within an iteration statement',
          [97]: '`let \n [` is a restricted production at the start of a statement',
          [98]: '%0 is already bound as a lexical binding',
          [99]: 'The lexical binding %0 has been bound multiple times',
          [101]: 'Cannot use `let` or `const` with the same name as bound to a parameter',
          [100]: 'Double declaration of the same binding name in a `catch` var',
          [103]: 'Missing initializer in %0 declaration',
          [102]: "'for-%0' loop variable declaration may not have an initializer",
          [104]: 'Invalid left-hand side in for-%0 loop: Must have a single binding.',
          [105]: 'Await expression not allowed in formal parameter',
          [106]: 'Yield expression not allowed in formal parameter'
      };
      function constructError(index, line, column, description) {
          const error = new SyntaxError(`Line ${line}, column ${column}: ${description}`);
          error.index = index;
          error.line = line;
          error.column = column;
          error.description = description;
          return error;
      }
      function report(parser, type, ...params) {
          const { index, line, column } = parser;
          const message = errorMessages[type].replace(/%(\d+)/g, (_, i) => params[i]);
          const error = constructError(index, line, column, message);
          throw error;
      }

      const unicodeLookup = ((compressed, lookup) => {
          const result = new Uint32Array(104448);
          let index = 0;
          let subIndex = 0;
          while (index < 3392) {
              const inst = compressed[index++];
              if (inst < 0) {
                  subIndex -= inst;
              }
              else {
                  let code = compressed[index++];
                  if (inst & 2)
                      code = lookup[code];
                  if (inst & 1) {
                      result.fill(code, subIndex, (subIndex += compressed[index++]));
                  }
                  else {
                      result[subIndex++] = code;
                  }
              }
          }
          return result;
      })([
          -1,
          2,
          28,
          2,
          29,
          2,
          5,
          -1,
          0,
          77595648,
          3,
          46,
          2,
          3,
          0,
          14,
          2,
          57,
          2,
          58,
          3,
          0,
          3,
          0,
          3168796671,
          0,
          4294956992,
          2,
          1,
          2,
          0,
          2,
          59,
          3,
          0,
          4,
          0,
          4294966523,
          3,
          0,
          4,
          2,
          15,
          2,
          60,
          2,
          0,
          0,
          4294836735,
          0,
          3221225471,
          0,
          4294901942,
          2,
          61,
          0,
          134152192,
          3,
          0,
          2,
          0,
          4294951935,
          3,
          0,
          2,
          0,
          2683305983,
          0,
          2684354047,
          2,
          17,
          2,
          0,
          0,
          4294961151,
          3,
          0,
          2,
          2,
          20,
          2,
          0,
          0,
          608174079,
          2,
          0,
          2,
          127,
          2,
          6,
          2,
          62,
          -1,
          2,
          64,
          2,
          26,
          2,
          1,
          3,
          0,
          3,
          0,
          4294901711,
          2,
          40,
          0,
          4089839103,
          0,
          2961209759,
          0,
          1342439375,
          0,
          4294543342,
          0,
          3547201023,
          0,
          1577204103,
          0,
          4194240,
          0,
          4294688750,
          2,
          2,
          0,
          80831,
          0,
          4261478351,
          0,
          4294549486,
          2,
          2,
          0,
          2965387679,
          0,
          196559,
          0,
          3594373100,
          0,
          3288319768,
          0,
          8469959,
          2,
          171,
          0,
          4294828031,
          0,
          3825204735,
          0,
          123747807,
          0,
          65487,
          2,
          3,
          0,
          4092591615,
          0,
          1080049119,
          0,
          458703,
          2,
          3,
          2,
          0,
          0,
          2163244511,
          0,
          4227923919,
          0,
          4236247020,
          2,
          68,
          0,
          4284449919,
          0,
          851904,
          2,
          4,
          2,
          16,
          0,
          67076095,
          -1,
          2,
          69,
          0,
          1006628014,
          0,
          4093591391,
          -1,
          0,
          50331649,
          0,
          3265266687,
          2,
          34,
          0,
          4294844415,
          0,
          4278190047,
          2,
          23,
          2,
          125,
          -1,
          3,
          0,
          2,
          2,
          33,
          2,
          0,
          2,
          9,
          2,
          0,
          2,
          13,
          2,
          14,
          3,
          0,
          10,
          2,
          71,
          2,
          0,
          2,
          72,
          2,
          73,
          2,
          74,
          2,
          0,
          2,
          75,
          2,
          0,
          2,
          10,
          0,
          261632,
          2,
          19,
          3,
          0,
          2,
          2,
          11,
          2,
          4,
          3,
          0,
          18,
          2,
          76,
          2,
          5,
          3,
          0,
          2,
          2,
          77,
          0,
          2088959,
          2,
          31,
          2,
          8,
          0,
          909311,
          3,
          0,
          2,
          0,
          814743551,
          2,
          42,
          0,
          67057664,
          3,
          0,
          2,
          2,
          45,
          2,
          0,
          2,
          32,
          2,
          0,
          2,
          18,
          2,
          7,
          0,
          268374015,
          2,
          30,
          2,
          51,
          2,
          0,
          2,
          78,
          0,
          134153215,
          -1,
          2,
          6,
          2,
          0,
          2,
          7,
          0,
          2684354559,
          0,
          67044351,
          0,
          1073676416,
          -2,
          3,
          0,
          2,
          2,
          43,
          0,
          1046528,
          3,
          0,
          3,
          2,
          8,
          2,
          0,
          2,
          41,
          0,
          4294960127,
          2,
          9,
          2,
          39,
          2,
          10,
          0,
          4294377472,
          2,
          21,
          3,
          0,
          7,
          0,
          4227858431,
          3,
          0,
          8,
          2,
          11,
          2,
          0,
          2,
          80,
          2,
          9,
          2,
          0,
          2,
          81,
          2,
          82,
          2,
          83,
          -1,
          2,
          122,
          0,
          1048577,
          2,
          84,
          2,
          12,
          -1,
          2,
          12,
          0,
          131042,
          2,
          85,
          2,
          86,
          2,
          87,
          2,
          0,
          2,
          35,
          -83,
          2,
          0,
          2,
          53,
          2,
          7,
          3,
          0,
          4,
          0,
          1046559,
          2,
          0,
          2,
          13,
          2,
          0,
          0,
          2147516671,
          2,
          24,
          3,
          88,
          2,
          2,
          0,
          -16,
          2,
          89,
          0,
          524222462,
          2,
          4,
          2,
          0,
          0,
          4269801471,
          2,
          4,
          2,
          0,
          2,
          14,
          2,
          79,
          2,
          15,
          3,
          0,
          2,
          2,
          49,
          2,
          16,
          -1,
          2,
          17,
          -16,
          3,
          0,
          205,
          2,
          18,
          -2,
          3,
          0,
          655,
          2,
          19,
          3,
          0,
          36,
          2,
          70,
          -1,
          2,
          17,
          2,
          9,
          3,
          0,
          8,
          2,
          91,
          2,
          119,
          2,
          0,
          0,
          3220242431,
          3,
          0,
          3,
          2,
          20,
          2,
          22,
          2,
          92,
          3,
          0,
          2,
          2,
          93,
          2,
          21,
          -1,
          2,
          22,
          2,
          0,
          2,
          27,
          2,
          0,
          2,
          8,
          3,
          0,
          2,
          0,
          67043391,
          0,
          3909091327,
          2,
          0,
          2,
          25,
          2,
          8,
          2,
          23,
          3,
          0,
          2,
          0,
          67076097,
          2,
          7,
          2,
          0,
          2,
          24,
          0,
          67059711,
          0,
          4236247039,
          3,
          0,
          2,
          0,
          939524103,
          0,
          8191999,
          2,
          97,
          2,
          98,
          2,
          14,
          2,
          95,
          3,
          0,
          3,
          0,
          67057663,
          3,
          0,
          349,
          2,
          99,
          2,
          100,
          2,
          6,
          -264,
          3,
          0,
          11,
          2,
          25,
          3,
          0,
          2,
          2,
          21,
          -1,
          0,
          3774349439,
          2,
          101,
          2,
          102,
          3,
          0,
          2,
          2,
          20,
          2,
          26,
          3,
          0,
          10,
          2,
          9,
          2,
          17,
          2,
          0,
          2,
          47,
          2,
          0,
          2,
          27,
          2,
          103,
          2,
          19,
          0,
          1638399,
          2,
          169,
          2,
          104,
          3,
          0,
          3,
          2,
          23,
          2,
          28,
          2,
          29,
          2,
          5,
          2,
          30,
          2,
          0,
          2,
          7,
          2,
          105,
          -1,
          2,
          106,
          2,
          107,
          2,
          108,
          -1,
          3,
          0,
          3,
          2,
          16,
          -2,
          2,
          0,
          2,
          31,
          -3,
          2,
          146,
          -4,
          2,
          23,
          2,
          0,
          2,
          37,
          0,
          1,
          2,
          0,
          2,
          63,
          2,
          32,
          2,
          16,
          2,
          9,
          2,
          0,
          2,
          109,
          -1,
          3,
          0,
          4,
          2,
          9,
          2,
          33,
          2,
          110,
          2,
          6,
          2,
          0,
          2,
          111,
          2,
          0,
          2,
          50,
          -4,
          3,
          0,
          9,
          2,
          24,
          2,
          18,
          2,
          27,
          -4,
          2,
          112,
          2,
          113,
          2,
          18,
          2,
          24,
          2,
          7,
          -2,
          2,
          114,
          2,
          18,
          2,
          21,
          -2,
          2,
          0,
          2,
          115,
          -2,
          0,
          4277137519,
          0,
          2269118463,
          -1,
          3,
          23,
          2,
          -1,
          2,
          34,
          2,
          38,
          2,
          0,
          3,
          18,
          2,
          2,
          36,
          2,
          20,
          -3,
          3,
          0,
          2,
          2,
          35,
          -1,
          2,
          0,
          2,
          36,
          2,
          0,
          2,
          36,
          2,
          0,
          2,
          48,
          -14,
          2,
          23,
          2,
          44,
          2,
          37,
          -5,
          3,
          0,
          2,
          2,
          38,
          0,
          2147549120,
          2,
          0,
          2,
          16,
          2,
          17,
          2,
          130,
          2,
          0,
          2,
          52,
          0,
          4294901872,
          0,
          5242879,
          3,
          0,
          2,
          0,
          402595359,
          -1,
          2,
          118,
          0,
          1090519039,
          -2,
          2,
          120,
          2,
          39,
          2,
          0,
          2,
          55,
          2,
          40,
          0,
          4226678271,
          0,
          3766565279,
          0,
          2039759,
          -4,
          3,
          0,
          2,
          0,
          1140787199,
          -1,
          3,
          0,
          2,
          0,
          67043519,
          -5,
          2,
          0,
          0,
          4282384383,
          0,
          1056964609,
          -1,
          3,
          0,
          2,
          0,
          67043345,
          -1,
          2,
          0,
          2,
          41,
          2,
          42,
          -1,
          2,
          10,
          2,
          43,
          -6,
          2,
          0,
          2,
          16,
          -3,
          3,
          0,
          2,
          0,
          2147484671,
          -8,
          2,
          0,
          2,
          7,
          2,
          44,
          2,
          0,
          0,
          603979727,
          -1,
          2,
          0,
          2,
          45,
          -8,
          2,
          54,
          2,
          46,
          0,
          67043329,
          2,
          123,
          2,
          47,
          0,
          8388351,
          -2,
          2,
          124,
          0,
          3028287487,
          2,
          48,
          2,
          126,
          0,
          33259519,
          2,
          42,
          -9,
          2,
          24,
          -8,
          3,
          0,
          28,
          2,
          21,
          -3,
          3,
          0,
          3,
          2,
          49,
          3,
          0,
          6,
          2,
          50,
          -85,
          3,
          0,
          33,
          2,
          49,
          -126,
          3,
          0,
          18,
          2,
          38,
          -269,
          3,
          0,
          17,
          2,
          45,
          2,
          7,
          2,
          42,
          -2,
          2,
          17,
          2,
          51,
          2,
          0,
          2,
          24,
          0,
          67043343,
          2,
          128,
          2,
          19,
          -21,
          3,
          0,
          2,
          -4,
          3,
          0,
          2,
          0,
          4294901791,
          2,
          7,
          2,
          164,
          -2,
          0,
          3,
          3,
          0,
          191,
          2,
          20,
          3,
          0,
          23,
          2,
          36,
          -296,
          3,
          0,
          8,
          2,
          7,
          -2,
          2,
          17,
          3,
          0,
          11,
          2,
          6,
          -72,
          3,
          0,
          3,
          2,
          129,
          0,
          1677656575,
          -166,
          0,
          4161266656,
          0,
          4071,
          0,
          15360,
          -4,
          0,
          28,
          -13,
          3,
          0,
          2,
          2,
          52,
          2,
          0,
          2,
          131,
          2,
          132,
          2,
          56,
          2,
          0,
          2,
          133,
          2,
          134,
          2,
          135,
          3,
          0,
          10,
          2,
          136,
          2,
          137,
          2,
          14,
          3,
          52,
          2,
          3,
          53,
          2,
          3,
          54,
          2,
          0,
          4294954999,
          2,
          0,
          -16,
          2,
          0,
          2,
          90,
          2,
          0,
          0,
          2105343,
          0,
          4160749584,
          0,
          65534,
          -42,
          0,
          4194303871,
          0,
          2011,
          -62,
          3,
          0,
          6,
          0,
          8323103,
          -1,
          3,
          0,
          2,
          2,
          55,
          -37,
          2,
          56,
          2,
          140,
          2,
          141,
          2,
          142,
          2,
          143,
          2,
          144,
          -138,
          3,
          0,
          1334,
          2,
          24,
          -1,
          3,
          0,
          129,
          2,
          31,
          3,
          0,
          6,
          2,
          9,
          3,
          0,
          180,
          2,
          145,
          3,
          0,
          233,
          0,
          1,
          -96,
          3,
          0,
          16,
          2,
          9,
          -22583,
          3,
          0,
          7,
          2,
          19,
          -6130,
          3,
          5,
          2,
          -1,
          0,
          69207040,
          3,
          46,
          2,
          3,
          0,
          14,
          2,
          57,
          2,
          58,
          -3,
          0,
          3168731136,
          0,
          4294956864,
          2,
          1,
          2,
          0,
          2,
          59,
          3,
          0,
          4,
          0,
          4294966275,
          3,
          0,
          4,
          2,
          15,
          2,
          60,
          2,
          0,
          2,
          35,
          -1,
          2,
          17,
          2,
          61,
          -1,
          2,
          0,
          2,
          62,
          0,
          4294885376,
          3,
          0,
          2,
          0,
          3145727,
          0,
          2617294944,
          0,
          4294770688,
          2,
          19,
          2,
          63,
          3,
          0,
          2,
          0,
          131135,
          2,
          94,
          0,
          70256639,
          0,
          71303167,
          0,
          272,
          2,
          45,
          2,
          62,
          -1,
          2,
          64,
          -2,
          2,
          96,
          0,
          603979775,
          0,
          4278255616,
          0,
          4294836227,
          0,
          4294549473,
          0,
          600178175,
          0,
          2952806400,
          0,
          268632067,
          0,
          4294543328,
          0,
          57540095,
          0,
          1577058304,
          0,
          1835008,
          0,
          4294688736,
          2,
          65,
          2,
          66,
          0,
          33554435,
          2,
          121,
          2,
          65,
          2,
          147,
          0,
          131075,
          0,
          3594373096,
          0,
          67094296,
          2,
          66,
          -1,
          2,
          67,
          0,
          603979263,
          2,
          156,
          0,
          3,
          0,
          4294828001,
          0,
          602930687,
          2,
          180,
          0,
          393219,
          2,
          67,
          0,
          671088639,
          0,
          2154840064,
          0,
          4227858435,
          0,
          4236247008,
          2,
          68,
          2,
          38,
          -1,
          2,
          4,
          0,
          917503,
          2,
          38,
          -1,
          2,
          69,
          0,
          537783470,
          0,
          4026531935,
          -1,
          0,
          1,
          -1,
          2,
          34,
          2,
          70,
          0,
          7936,
          -3,
          2,
          0,
          0,
          2147485695,
          0,
          1010761728,
          0,
          4292984930,
          0,
          16387,
          2,
          0,
          2,
          13,
          2,
          14,
          3,
          0,
          10,
          2,
          71,
          2,
          0,
          2,
          72,
          2,
          73,
          2,
          74,
          2,
          0,
          2,
          75,
          2,
          0,
          2,
          16,
          -1,
          2,
          19,
          3,
          0,
          2,
          2,
          11,
          2,
          4,
          3,
          0,
          18,
          2,
          76,
          2,
          5,
          3,
          0,
          2,
          2,
          77,
          0,
          253951,
          3,
          20,
          2,
          0,
          122879,
          2,
          0,
          2,
          8,
          0,
          276824064,
          -2,
          3,
          0,
          2,
          2,
          45,
          2,
          0,
          0,
          4294903295,
          2,
          0,
          2,
          18,
          2,
          7,
          -1,
          2,
          17,
          2,
          51,
          2,
          0,
          2,
          78,
          2,
          42,
          -1,
          2,
          24,
          2,
          0,
          2,
          31,
          -2,
          0,
          128,
          -2,
          2,
          79,
          2,
          8,
          0,
          4064,
          -1,
          2,
          117,
          0,
          4227907585,
          2,
          0,
          2,
          116,
          2,
          0,
          2,
          50,
          2,
          196,
          2,
          9,
          2,
          39,
          2,
          10,
          -1,
          0,
          6544896,
          3,
          0,
          6,
          -2,
          3,
          0,
          8,
          2,
          11,
          2,
          0,
          2,
          80,
          2,
          9,
          2,
          0,
          2,
          81,
          2,
          82,
          2,
          83,
          -3,
          2,
          84,
          2,
          12,
          -3,
          2,
          85,
          2,
          86,
          2,
          87,
          2,
          0,
          2,
          35,
          -83,
          2,
          0,
          2,
          53,
          2,
          7,
          3,
          0,
          4,
          0,
          817183,
          2,
          0,
          2,
          13,
          2,
          0,
          0,
          33023,
          2,
          24,
          3,
          88,
          2,
          -17,
          2,
          89,
          0,
          524157950,
          2,
          4,
          2,
          0,
          2,
          90,
          2,
          4,
          2,
          0,
          2,
          14,
          2,
          79,
          2,
          15,
          3,
          0,
          2,
          2,
          49,
          2,
          16,
          -1,
          2,
          17,
          -16,
          3,
          0,
          205,
          2,
          18,
          -2,
          3,
          0,
          655,
          2,
          19,
          3,
          0,
          36,
          2,
          70,
          -1,
          2,
          17,
          2,
          9,
          3,
          0,
          8,
          2,
          91,
          0,
          3072,
          2,
          0,
          0,
          2147516415,
          2,
          9,
          3,
          0,
          2,
          2,
          19,
          2,
          22,
          2,
          92,
          3,
          0,
          2,
          2,
          93,
          2,
          21,
          -1,
          2,
          22,
          0,
          4294965179,
          0,
          7,
          2,
          0,
          2,
          8,
          2,
          92,
          2,
          8,
          -1,
          0,
          1761345536,
          2,
          94,
          2,
          95,
          2,
          38,
          2,
          23,
          2,
          96,
          2,
          36,
          2,
          162,
          0,
          2080440287,
          2,
          0,
          2,
          35,
          2,
          138,
          0,
          3296722943,
          2,
          0,
          0,
          1046675455,
          0,
          939524101,
          0,
          1837055,
          2,
          97,
          2,
          98,
          2,
          14,
          2,
          95,
          3,
          0,
          3,
          0,
          7,
          3,
          0,
          349,
          2,
          99,
          2,
          100,
          2,
          6,
          -264,
          3,
          0,
          11,
          2,
          25,
          3,
          0,
          2,
          2,
          21,
          -1,
          0,
          2700607615,
          2,
          101,
          2,
          102,
          3,
          0,
          2,
          2,
          20,
          2,
          26,
          3,
          0,
          10,
          2,
          9,
          2,
          17,
          2,
          0,
          2,
          47,
          2,
          0,
          2,
          27,
          2,
          103,
          -3,
          2,
          104,
          3,
          0,
          3,
          2,
          23,
          -1,
          3,
          5,
          2,
          2,
          30,
          2,
          0,
          2,
          7,
          2,
          105,
          -1,
          2,
          106,
          2,
          107,
          2,
          108,
          -1,
          3,
          0,
          3,
          2,
          16,
          -2,
          2,
          0,
          2,
          31,
          -8,
          2,
          23,
          2,
          0,
          2,
          37,
          -1,
          2,
          0,
          2,
          63,
          2,
          32,
          2,
          18,
          2,
          9,
          2,
          0,
          2,
          109,
          -1,
          3,
          0,
          4,
          2,
          9,
          2,
          17,
          2,
          110,
          2,
          6,
          2,
          0,
          2,
          111,
          2,
          0,
          2,
          50,
          -4,
          3,
          0,
          9,
          2,
          24,
          2,
          18,
          2,
          27,
          -4,
          2,
          112,
          2,
          113,
          2,
          18,
          2,
          24,
          2,
          7,
          -2,
          2,
          114,
          2,
          18,
          2,
          21,
          -2,
          2,
          0,
          2,
          115,
          -2,
          0,
          4277075969,
          2,
          18,
          -1,
          3,
          23,
          2,
          -1,
          2,
          34,
          2,
          139,
          2,
          0,
          3,
          18,
          2,
          2,
          36,
          2,
          20,
          -3,
          3,
          0,
          2,
          2,
          35,
          -1,
          2,
          0,
          2,
          36,
          2,
          0,
          2,
          36,
          2,
          0,
          2,
          50,
          -14,
          2,
          23,
          2,
          44,
          2,
          116,
          -5,
          2,
          117,
          2,
          41,
          -2,
          2,
          117,
          2,
          19,
          2,
          17,
          2,
          35,
          2,
          117,
          2,
          38,
          0,
          4294901776,
          0,
          4718591,
          2,
          117,
          2,
          36,
          0,
          335544350,
          -1,
          2,
          118,
          2,
          119,
          -2,
          2,
          120,
          2,
          39,
          2,
          7,
          -1,
          2,
          121,
          2,
          65,
          0,
          3758161920,
          0,
          3,
          -4,
          2,
          0,
          2,
          31,
          2,
          174,
          -1,
          2,
          0,
          2,
          19,
          0,
          176,
          -5,
          2,
          0,
          2,
          49,
          2,
          182,
          -1,
          2,
          0,
          2,
          19,
          2,
          194,
          -1,
          2,
          0,
          2,
          62,
          -2,
          2,
          16,
          -7,
          2,
          0,
          2,
          119,
          -3,
          3,
          0,
          2,
          2,
          122,
          -8,
          0,
          4294965249,
          0,
          67633151,
          0,
          4026597376,
          2,
          0,
          0,
          536871887,
          -1,
          2,
          0,
          2,
          45,
          -8,
          2,
          54,
          2,
          49,
          0,
          1,
          2,
          123,
          2,
          19,
          -3,
          2,
          124,
          2,
          37,
          2,
          125,
          2,
          126,
          0,
          16778239,
          -10,
          2,
          36,
          -8,
          3,
          0,
          28,
          2,
          21,
          -3,
          3,
          0,
          3,
          2,
          49,
          3,
          0,
          6,
          2,
          50,
          -85,
          3,
          0,
          33,
          2,
          49,
          -126,
          3,
          0,
          18,
          2,
          38,
          -269,
          3,
          0,
          17,
          2,
          45,
          2,
          7,
          -3,
          2,
          17,
          2,
          127,
          2,
          0,
          2,
          19,
          2,
          50,
          2,
          128,
          2,
          19,
          -21,
          3,
          0,
          2,
          -4,
          3,
          0,
          2,
          0,
          65567,
          -1,
          2,
          26,
          -2,
          0,
          3,
          3,
          0,
          191,
          2,
          20,
          3,
          0,
          23,
          2,
          36,
          -296,
          3,
          0,
          8,
          2,
          7,
          -2,
          2,
          17,
          3,
          0,
          11,
          2,
          6,
          -72,
          3,
          0,
          3,
          2,
          129,
          2,
          130,
          -187,
          3,
          0,
          2,
          2,
          52,
          2,
          0,
          2,
          131,
          2,
          132,
          2,
          56,
          2,
          0,
          2,
          133,
          2,
          134,
          2,
          135,
          3,
          0,
          10,
          2,
          136,
          2,
          137,
          2,
          14,
          3,
          52,
          2,
          3,
          53,
          2,
          3,
          54,
          2,
          2,
          138,
          -129,
          3,
          0,
          6,
          2,
          139,
          -1,
          3,
          0,
          2,
          2,
          50,
          -37,
          2,
          56,
          2,
          140,
          2,
          141,
          2,
          142,
          2,
          143,
          2,
          144,
          -138,
          3,
          0,
          1334,
          2,
          24,
          -1,
          3,
          0,
          129,
          2,
          31,
          3,
          0,
          6,
          2,
          9,
          3,
          0,
          180,
          2,
          145,
          3,
          0,
          233,
          0,
          1,
          -96,
          3,
          0,
          16,
          2,
          9,
          -28719,
          2,
          0,
          0,
          1,
          -1,
          2,
          122,
          2,
          0,
          0,
          8193,
          -21,
          0,
          50331648,
          0,
          10255,
          0,
          4,
          -11,
          2,
          66,
          2,
          168,
          -1,
          0,
          71680,
          -1,
          2,
          157,
          0,
          4292900864,
          0,
          805306431,
          -5,
          2,
          146,
          -1,
          2,
          176,
          -1,
          0,
          6144,
          -2,
          2,
          123,
          -1,
          2,
          150,
          -1,
          2,
          153,
          2,
          147,
          2,
          161,
          2,
          0,
          0,
          3223322624,
          2,
          36,
          0,
          4,
          -4,
          2,
          188,
          0,
          205128192,
          0,
          1333757536,
          0,
          2147483696,
          0,
          423953,
          0,
          747766272,
          0,
          2717763192,
          0,
          4286578751,
          0,
          278545,
          2,
          148,
          0,
          4294886464,
          0,
          33292336,
          0,
          417809,
          2,
          148,
          0,
          1329579616,
          0,
          4278190128,
          0,
          700594195,
          0,
          1006647527,
          0,
          4286497336,
          0,
          4160749631,
          2,
          149,
          0,
          469762560,
          0,
          4171219488,
          0,
          16711728,
          2,
          149,
          0,
          202375680,
          0,
          3214918176,
          0,
          4294508592,
          0,
          139280,
          -1,
          0,
          983584,
          2,
          190,
          0,
          58720275,
          0,
          3489923072,
          0,
          10517376,
          0,
          4293066815,
          0,
          1,
          0,
          2013265920,
          2,
          175,
          2,
          0,
          0,
          17816169,
          0,
          3288339281,
          0,
          201375904,
          2,
          0,
          -2,
          0,
          256,
          0,
          122880,
          0,
          16777216,
          2,
          146,
          0,
          4160757760,
          2,
          0,
          -6,
          2,
          163,
          -11,
          0,
          3263218176,
          -1,
          0,
          49664,
          0,
          2160197632,
          0,
          8388802,
          -1,
          0,
          12713984,
          -1,
          2,
          150,
          2,
          155,
          2,
          158,
          -2,
          2,
          159,
          -20,
          0,
          3758096385,
          -2,
          2,
          151,
          0,
          4292878336,
          2,
          22,
          2,
          166,
          0,
          4294057984,
          -2,
          2,
          160,
          2,
          152,
          2,
          172,
          -2,
          2,
          151,
          -1,
          2,
          179,
          -1,
          2,
          167,
          2,
          122,
          0,
          4026593280,
          0,
          14,
          0,
          4292919296,
          -1,
          2,
          154,
          0,
          939588608,
          -1,
          0,
          805306368,
          -1,
          2,
          122,
          0,
          1610612736,
          2,
          152,
          2,
          153,
          3,
          0,
          2,
          -2,
          2,
          154,
          2,
          155,
          -3,
          0,
          267386880,
          -1,
          2,
          156,
          0,
          7168,
          -1,
          0,
          65024,
          2,
          150,
          2,
          157,
          2,
          158,
          -7,
          2,
          165,
          -8,
          2,
          159,
          -1,
          0,
          1426112704,
          2,
          160,
          -1,
          2,
          185,
          0,
          271581216,
          0,
          2149777408,
          2,
          19,
          2,
          157,
          2,
          122,
          0,
          851967,
          0,
          3758129152,
          -1,
          2,
          19,
          2,
          178,
          -4,
          2,
          154,
          -20,
          2,
          192,
          2,
          161,
          -56,
          0,
          3145728,
          2,
          184,
          -1,
          2,
          191,
          2,
          122,
          -1,
          2,
          162,
          2,
          122,
          -4,
          0,
          32505856,
          -1,
          2,
          163,
          -1,
          0,
          2147385088,
          2,
          22,
          1,
          2155905152,
          2,
          -3,
          2,
          164,
          2,
          0,
          2,
          165,
          -2,
          2,
          166,
          -6,
          2,
          167,
          0,
          4026597375,
          0,
          1,
          -1,
          0,
          1,
          -1,
          2,
          168,
          -3,
          2,
          139,
          2,
          66,
          -2,
          2,
          162,
          2,
          177,
          -1,
          2,
          173,
          2,
          122,
          -6,
          2,
          122,
          -213,
          2,
          167,
          -657,
          2,
          17,
          -36,
          2,
          169,
          -1,
          2,
          186,
          -10,
          0,
          4294963200,
          -5,
          2,
          170,
          -5,
          2,
          158,
          2,
          0,
          2,
          24,
          -1,
          0,
          4227919872,
          -1,
          2,
          170,
          -2,
          0,
          4227874752,
          -3,
          0,
          2146435072,
          2,
          155,
          -2,
          0,
          1006649344,
          2,
          122,
          -1,
          2,
          22,
          0,
          201375744,
          -3,
          0,
          134217720,
          2,
          22,
          0,
          4286677377,
          0,
          32896,
          -1,
          2,
          171,
          -3,
          2,
          172,
          -349,
          2,
          173,
          2,
          174,
          2,
          175,
          3,
          0,
          264,
          -11,
          2,
          176,
          -2,
          2,
          158,
          2,
          0,
          0,
          520617856,
          0,
          2692743168,
          0,
          36,
          -3,
          0,
          524284,
          -11,
          2,
          19,
          -1,
          2,
          183,
          -1,
          2,
          181,
          0,
          3221291007,
          2,
          158,
          -1,
          0,
          524288,
          0,
          2158720,
          -3,
          2,
          155,
          0,
          1,
          -4,
          2,
          122,
          0,
          3808625411,
          0,
          3489628288,
          0,
          4096,
          0,
          1207959680,
          0,
          3221274624,
          2,
          0,
          -3,
          2,
          177,
          0,
          120,
          0,
          7340032,
          -2,
          0,
          4026564608,
          2,
          4,
          2,
          19,
          2,
          160,
          3,
          0,
          4,
          2,
          155,
          -1,
          2,
          178,
          2,
          175,
          -1,
          0,
          8176,
          2,
          179,
          2,
          177,
          2,
          180,
          -1,
          0,
          4290773232,
          2,
          0,
          -4,
          2,
          160,
          2,
          187,
          0,
          15728640,
          2,
          175,
          -1,
          2,
          157,
          -1,
          0,
          4294934512,
          3,
          0,
          4,
          -9,
          2,
          22,
          2,
          167,
          2,
          181,
          3,
          0,
          4,
          0,
          704,
          0,
          1849688064,
          0,
          4194304,
          -1,
          2,
          122,
          0,
          4294901887,
          2,
          0,
          0,
          130547712,
          0,
          1879048192,
          0,
          2080374784,
          3,
          0,
          2,
          -1,
          2,
          182,
          2,
          183,
          -1,
          0,
          17829776,
          0,
          2025848832,
          0,
          4261477888,
          -2,
          2,
          0,
          -1,
          0,
          4286580608,
          -1,
          0,
          29360128,
          2,
          184,
          0,
          16252928,
          0,
          3791388672,
          2,
          39,
          3,
          0,
          2,
          -2,
          2,
          193,
          2,
          0,
          -1,
          2,
          26,
          -1,
          0,
          66584576,
          -1,
          2,
          189,
          3,
          0,
          9,
          2,
          122,
          3,
          0,
          4,
          -1,
          2,
          157,
          2,
          158,
          3,
          0,
          5,
          -2,
          0,
          245760,
          0,
          2147418112,
          -1,
          2,
          146,
          2,
          199,
          0,
          4227923456,
          -1,
          2,
          185,
          2,
          186,
          2,
          22,
          -2,
          2,
          176,
          0,
          4292870145,
          0,
          262144,
          2,
          122,
          3,
          0,
          2,
          0,
          1073758848,
          2,
          187,
          -1,
          0,
          4227921920,
          2,
          188,
          0,
          68289024,
          0,
          528402016,
          0,
          4292927536,
          3,
          0,
          4,
          -2,
          0,
          2483027968,
          2,
          0,
          -2,
          2,
          189,
          3,
          0,
          5,
          -1,
          2,
          184,
          2,
          160,
          2,
          0,
          -2,
          0,
          4227923936,
          2,
          63,
          -1,
          2,
          170,
          2,
          94,
          2,
          0,
          2,
          150,
          2,
          154,
          3,
          0,
          6,
          -1,
          2,
          175,
          3,
          0,
          3,
          -2,
          0,
          2146959360,
          3,
          0,
          8,
          -2,
          2,
          157,
          -1,
          2,
          190,
          2,
          117,
          -1,
          2,
          151,
          3,
          0,
          8,
          2,
          191,
          0,
          8388608,
          2,
          171,
          2,
          169,
          2,
          183,
          0,
          4286578944,
          3,
          0,
          2,
          0,
          1152,
          0,
          1266679808,
          2,
          189,
          0,
          576,
          0,
          4261707776,
          2,
          94,
          3,
          0,
          9,
          2,
          151,
          3,
          0,
          8,
          -28,
          2,
          158,
          3,
          0,
          3,
          -3,
          0,
          4292902912,
          -6,
          2,
          96,
          3,
          0,
          85,
          -33,
          2,
          164,
          3,
          0,
          126,
          -18,
          2,
          192,
          3,
          0,
          269,
          -17,
          2,
          151,
          2,
          122,
          0,
          4294917120,
          3,
          0,
          2,
          2,
          19,
          0,
          4290822144,
          -2,
          0,
          67174336,
          0,
          520093700,
          2,
          17,
          3,
          0,
          21,
          -2,
          2,
          177,
          3,
          0,
          3,
          -2,
          0,
          65504,
          2,
          122,
          2,
          49,
          3,
          0,
          2,
          2,
          92,
          -191,
          2,
          123,
          -23,
          2,
          26,
          3,
          0,
          296,
          -8,
          2,
          122,
          3,
          0,
          2,
          2,
          19,
          -11,
          2,
          175,
          3,
          0,
          72,
          -3,
          0,
          3758159872,
          0,
          201391616,
          3,
          0,
          155,
          -7,
          2,
          167,
          -1,
          0,
          384,
          -1,
          0,
          133693440,
          -3,
          2,
          193,
          -2,
          2,
          30,
          3,
          0,
          4,
          2,
          166,
          -2,
          2,
          22,
          2,
          151,
          3,
          0,
          4,
          -2,
          2,
          185,
          -1,
          2,
          146,
          0,
          335552923,
          2,
          194,
          -1,
          0,
          538974272,
          0,
          2214592512,
          0,
          132000,
          -10,
          0,
          192,
          -8,
          0,
          12288,
          -21,
          0,
          134213632,
          0,
          4294901761,
          3,
          0,
          42,
          0,
          100663424,
          0,
          4294965284,
          3,
          0,
          62,
          -6,
          0,
          4286578784,
          2,
          0,
          -2,
          0,
          1006696448,
          3,
          0,
          24,
          2,
          37,
          -1,
          2,
          195,
          3,
          0,
          10,
          2,
          194,
          0,
          4110942569,
          0,
          1432950139,
          0,
          2701658217,
          0,
          4026532864,
          0,
          4026532881,
          2,
          0,
          2,
          47,
          3,
          0,
          8,
          -1,
          2,
          154,
          -2,
          2,
          166,
          0,
          98304,
          0,
          65537,
          2,
          167,
          2,
          169,
          -2,
          2,
          154,
          -1,
          2,
          63,
          2,
          0,
          2,
          116,
          2,
          197,
          2,
          175,
          0,
          4294770176,
          2,
          30,
          3,
          0,
          4,
          -30,
          2,
          195,
          2,
          196,
          -3,
          2,
          166,
          -2,
          2,
          151,
          2,
          0,
          2,
          154,
          -1,
          2,
          189,
          -1,
          2,
          157,
          2,
          198,
          3,
          0,
          2,
          2,
          154,
          2,
          122,
          -1,
          0,
          193331200,
          -1,
          0,
          4227923960,
          2,
          197,
          -1,
          3,
          0,
          3,
          2,
          198,
          3,
          0,
          44,
          -1334,
          2,
          22,
          2,
          0,
          -129,
          2,
          195,
          -6,
          2,
          160,
          -180,
          2,
          199,
          -233,
          2,
          4,
          3,
          0,
          96,
          -16,
          2,
          160,
          3,
          0,
          22583,
          -7,
          2,
          17,
          3,
          0,
          6128
      ], [
          4294967295,
          4294967291,
          4092460543,
          4294828015,
          4294967294,
          134217726,
          268435455,
          2147483647,
          1048575,
          1073741823,
          3892314111,
          1061158911,
          536805376,
          4294910143,
          4160749567,
          4294901759,
          134217727,
          4294901760,
          4194303,
          65535,
          262143,
          67108863,
          4286578688,
          536870911,
          8388607,
          4294918143,
          4294443008,
          255,
          67043328,
          2281701374,
          4294967232,
          2097151,
          4294903807,
          4294902783,
          4294967039,
          511,
          524287,
          131071,
          127,
          4294902271,
          4294549487,
          16777215,
          1023,
          67047423,
          4294901888,
          33554431,
          4286578687,
          4294770687,
          67043583,
          32767,
          15,
          2047999,
          4292870143,
          4294934527,
          4294966783,
          67045375,
          4294967279,
          262083,
          20511,
          4290772991,
          41943039,
          493567,
          2047,
          4294959104,
          1071644671,
          602799615,
          65536,
          4294828000,
          805044223,
          4277151126,
          8191,
          1031749119,
          4294917631,
          2134769663,
          4286578493,
          4282253311,
          4294942719,
          33540095,
          4294905855,
          4294967264,
          2868854591,
          1608515583,
          265232348,
          534519807,
          2147614720,
          1060109444,
          4093640016,
          17376,
          2139062143,
          224,
          4169138175,
          4294909951,
          4294967292,
          4294965759,
          4294966272,
          4294901823,
          4294967280,
          8289918,
          4294934399,
          4294901775,
          4294965375,
          1602223615,
          4294967259,
          268369920,
          4292804608,
          486341884,
          4294963199,
          3087007615,
          1073692671,
          4128527,
          4279238655,
          4294902015,
          4294966591,
          2445279231,
          3670015,
          3238002687,
          63,
          4294967288,
          4294705151,
          4095,
          3221208447,
          4294549472,
          2147483648,
          4294705152,
          4294966143,
          64,
          4294966719,
          16383,
          3774873592,
          536807423,
          67043839,
          3758096383,
          3959414372,
          3755993023,
          2080374783,
          4294835295,
          4294967103,
          4160749565,
          4087,
          31,
          184024726,
          2862017156,
          1593309078,
          268434431,
          268434414,
          4294901763,
          536870912,
          2952790016,
          202506752,
          139264,
          402653184,
          4261412864,
          4227922944,
          2147532800,
          61440,
          3758096384,
          117440512,
          65280,
          4227858432,
          3233808384,
          3221225472,
          4294965248,
          32768,
          57152,
          4294934528,
          67108864,
          4293918720,
          4290772992,
          25165824,
          57344,
          4278190080,
          65472,
          4227907584,
          65520,
          1920,
          4026531840,
          49152,
          4160749568,
          4294836224,
          63488,
          1073741824,
          4294967040,
          251658240,
          196608,
          12582912,
          2097152,
          65408,
          64512,
          417808,
          4227923712,
          48,
          512,
          4294967168,
          4294966784,
          16,
          4292870144,
          4227915776,
          65528,
          4294950912,
          65532
      ]);

      function scanNext(state, err) {
          state.index++;
          state.column++;
          if (state.index >= state.length)
              report(state, err);
          return state.source.charCodeAt(state.index);
      }
      function nextChar(parser) {
          return parser.source.charCodeAt(parser.index);
      }
      function consumeOpt(state, code) {
          if (state.source.charCodeAt(state.index) !== code)
              return false;
          state.index++;
          state.column++;
          return true;
      }
      function consumeLineFeed(state, lastIsCR) {
          state.index++;
          if (!lastIsCR) {
              state.column = 0;
              state.line++;
          }
      }
      function fromCodePoint(code) {
          if (code > 0xffff) {
              return String.fromCharCode(code >>> 10) + String.fromCharCode(code & 0x3ff);
          }
          else {
              return String.fromCharCode(code);
          }
      }
      function toHex(code) {
          if (code < 48)
              return -1;
          if (code <= 57)
              return code - 48;
          if (code < 65)
              return -1;
          if (code <= 70)
              return code - 65 + 10;
          if (code < 97)
              return -1;
          if (code <= 102)
              return code - 97 + 10;
          return -1;
      }
      function isDigit(ch) {
          return ch >= 48 && ch <= 57;
      }

      const CommentTypes = ['SingleLine', 'MultiLine', 'HTMLOpen', 'HTMLClose', 'HashbangComment'];
      function skipHashBang(state, context) {
          let index = state.index;
          if (index === state.source.length)
              return;
          if (state.source.charCodeAt(index) === 65519) {
              index++;
              state.index = index;
          }
          if (context & 1 && index < state.source.length && state.source.charCodeAt(index) === 35) {
              index++;
              if (index < state.source.length && state.source.charCodeAt(index) === 33) {
                  state.index = index + 1;
                  skipSingleLineComment(state, 4);
              }
              else {
                  report(state, 0);
              }
          }
      }
      function skipSingleHTMLComment(state, context, type) {
          if (context & 2048)
              report(state, 28);
          return skipSingleLineComment(state, type);
      }
      function skipSingleLineComment(state, type) {
          const { index: start } = state;
          while (state.index < state.length) {
              const next = state.source.charCodeAt(state.index);
              if ((next & 8) === 8 && (next & 83) < 3) {
                  if (next === 13) {
                      ++state.index;
                      state.column = 0;
                      ++state.line;
                      if (state.index < state.length && state.source.charCodeAt(state.index) === 10)
                          state.index++;
                      state.flags |= 1;
                      break;
                  }
                  else if (next === 10 || (next ^ 8233) <= 1) {
                      ++state.index;
                      state.column = 0;
                      ++state.line;
                      state.flags |= 1;
                      break;
                  }
                  else {
                      ++state.index;
                      ++state.column;
                  }
              }
              else {
                  ++state.index;
                  ++state.column;
              }
          }
          if (state.onComment)
              state.onComment(CommentTypes[type & 0xff], state.source.slice(start, state.index), start, state.index);
          return 1073741824;
      }
      function skipBlockComment(state) {
          const { index: start } = state;
          while (state.index < state.length) {
              const next = state.source.charCodeAt(state.index);
              if (next === 42) {
                  state.index++;
                  state.column++;
                  state.flags &= ~2;
                  if (consumeOpt(state, 47)) {
                      if (state.onComment)
                          state.onComment(CommentTypes[1 & 0xff], state.source.slice(start, state.index - 2), start, state.index);
                      return 1073741824;
                  }
              }
              else if ((next & 8) === 8) {
                  if ((next & 83) < 3 && next === 13) {
                      state.flags |= 1 | 2;
                      state.index++;
                      state.column = 0;
                      state.line++;
                  }
                  else if (next === 10) {
                      consumeLineFeed(state, (state.flags & 2) !== 0);
                      state.flags = (state.flags & ~2) | 1;
                  }
                  else if ((next ^ 8233) <= 1) {
                      state.flags = (state.flags & ~2) | 1;
                      state.index++;
                      state.column = 0;
                      state.line++;
                  }
                  else {
                      state.flags &= ~2;
                      state.index++;
                      state.column++;
                  }
              }
              else {
                  state.flags &= ~2;
                  state.index++;
                  state.column++;
              }
          }
          return report(state, 27);
      }

      const AsciiLookup = new Uint8Array(0x80)
          .fill(3, 0x24, 0x25)
          .fill(4, 0x30, 0x3a)
          .fill(3, 0x41, 0x5b)
          .fill(3, 0x5f, 0x60)
          .fill(3, 0x61, 0x7b);
      function isIdentifierPart(code) {
          return (AsciiLookup[code] & 1) > 0 || ((unicodeLookup[(code >>> 5) + 0] >>> code) & 31 & 1) > 0;
      }
      function isIdentifierStart(code) {
          return (AsciiLookup[code] & 2) > 0 || ((unicodeLookup[(code >>> 5) + 34816] >>> code) & 31 & 1) > 0;
      }

      function scanMaybeIdentifier(state, _, first) {
          switch (first) {
              case 160:
              case 5760:
              case 8192:
              case 8193:
              case 8194:
              case 8195:
              case 8196:
              case 8197:
              case 8198:
              case 8199:
              case 8200:
              case 8201:
              case 8202:
              case 8239:
              case 8287:
              case 12288:
              case 8205:
              case 8204:
                  state.index++;
                  state.column++;
                  return 1073741824;
              case 8232:
              case 8233:
                  state.flags = (state.flags & ~2) | 1;
                  state.index++;
                  state.column = 0;
                  state.line++;
                  return 1073741824;
          }
          report(state, 29, String.fromCharCode(first));
      }
      function scanIdentifierOrKeyword(state, context) {
          let { index, column } = state;
          while (isIdentifierPart(state.source.charCodeAt(index))) {
              index++;
              column++;
          }
          state.tokenValue = state.source.slice(state.startIndex, index);
          if (state.source.charCodeAt(index) === 92) ;
          state.index = index;
          state.column = column;
          const len = state.tokenValue.length;
          if (len >= 2 && len <= 11) {
              const keyword = descKeywordTable[state.tokenValue];
              if (keyword !== undefined)
                  return keyword;
          }
          if (context & 8)
              state.tokenRaw = state.source.slice(state.startIndex, index);
          return 405505;
      }
      function scanIdentifier(state, context) {
          let { index, column } = state;
          while (isIdentifierPart(state.source.charCodeAt(index))) {
              index++;
              column++;
          }
          state.tokenValue = state.source.slice(state.startIndex, index);
          if (state.source.charCodeAt(index) === 92) ;
          state.index = index;
          state.column = column;
          if (context & 8)
              state.tokenRaw = state.source.slice(state.startIndex, index);
          return 405505;
      }
      function scanPrivateName(state, _) {
          let { index, column } = state;
          index++;
          column++;
          const start = index;
          if (!isIdentifierStart(state.source.charCodeAt(index))) {
              report(state, 1, fromCodePoint(state.source.charCodeAt(index)));
          }
          while (isIdentifierStart(state.source.charCodeAt(index))) {
              index++;
              column++;
          }
          state.tokenValue = state.source.slice(start, index);
          state.index = index;
          state.column = column;
          return 119;
      }

      function scanStringLiteral(state, context, quote) {
          const { index: start, lastChar } = state;
          let ret = '';
          let ch = scanNext(state, 34);
          while (ch !== quote) {
              if ((ch & 8) === 8) {
                  if (ch === 92) {
                      ch = scanNext(state, 34);
                      if (ch >= 128) {
                          ret += fromCodePoint(ch);
                      }
                      else {
                          state.lastChar = ch;
                          const code = table[ch](state, context, ch);
                          if (code >= 0)
                              ret += fromCodePoint(code);
                          else
                              reportInvalidEscapeError(state, code);
                          ch = state.lastChar;
                      }
                  }
                  else if (((ch & 83) < 3 && ch === 13) || ch === 10) {
                      report(state, 0);
                  }
                  else
                      ret += fromCodePoint(ch);
              }
              else
                  ret += fromCodePoint(ch);
              ch = scanNext(state, 34);
          }
          state.index++;
          state.column++;
          if (context & 8)
              state.tokenRaw = state.source.slice(start, state.index);
          state.tokenValue = ret;
          state.lastChar = lastChar;
          return 131075;
      }
      const table = new Array(128).fill(nextChar);
      table[98] = () => 8;
      table[102] = () => 12;
      table[114] = () => 13;
      table[110] = () => 10;
      table[116] = () => 9;
      table[118] = () => 11;
      table[13] = state => {
          state.column = -1;
          state.line++;
          const { index } = state;
          if (index < state.source.length) {
              const ch = state.source.charCodeAt(index);
              if (ch === 10) {
                  state.lastChar = ch;
                  state.index = index + 1;
              }
          }
          return -1;
      };
      table[10] = table[8232] = table[8233] = state => {
          state.column = -1;
          state.line++;
          return -1;
      };
      table[48] = table[49] = table[50] = table[51] = (state, context, first) => {
          let code = first - 48;
          let index = state.index + 1;
          let column = state.column + 1;
          if (index < state.source.length) {
              const next = state.source.charCodeAt(index);
              if (next < 48 || next > 55) {
                  if (code !== 0 || next === 56 || next === 57) {
                      if (context & 1024)
                          return -2;
                      state.flags = state.flags | 8;
                  }
              }
              else if (context & 1024) {
                  return -2;
              }
              else {
                  state.flags = state.flags | 8;
                  state.lastChar = next;
                  code = code * 8 + (next - 48);
                  index++;
                  column++;
                  if (index < state.source.length) {
                      const next = state.source.charCodeAt(index);
                      if (next >= 48 && next <= 55) {
                          state.lastChar = next;
                          code = code * 8 + (next - 48);
                          index++;
                          column++;
                      }
                  }
                  state.index = index - 1;
                  state.column = column - 1;
              }
          }
          return code;
      };
      table[52] = table[53] = table[54] = table[55] = (state, context, first) => {
          if (context & 1024)
              return -2;
          let code = first - 48;
          const index = state.index + 1;
          const column = state.column + 1;
          if (index < state.source.length) {
              const next = state.source.charCodeAt(index);
              if (next >= 48 && next <= 55) {
                  code = code * 8 + (next - 48);
                  state.lastChar = next;
                  state.index = index;
                  state.column = column;
              }
          }
          return code;
      };
      table[56] = table[57] = () => -3;
      table[120] = state => {
          const ch1 = (state.lastChar = scanNext(state, 31));
          const hi = toHex(ch1);
          if (hi < 0)
              return -4;
          const ch2 = (state.lastChar = scanNext(state, 31));
          const lo = toHex(ch2);
          if (lo < 0)
              return -4;
          return hi * 16 + lo;
      };
      table[117] = state => {
          let ch = (state.lastChar = scanNext(state, 10));
          if (ch === 123) {
              ch = state.lastChar = scanNext(state, 10);
              let code = toHex(ch);
              if (code < 0)
                  return -4;
              ch = state.lastChar = scanNext(state, 10);
              while (ch !== 125) {
                  const digit = toHex(ch);
                  if (digit < 0)
                      return -4;
                  code = code * 16 + digit;
                  if (code > 0x10fff)
                      return -5;
                  ch = state.lastChar = scanNext(state, 10);
              }
              return code;
          }
          else {
              let code = toHex(ch);
              if (code < 0)
                  return -4;
              for (let i = 0; i < 3; i++) {
                  ch = state.lastChar = scanNext(state, 10);
                  const digit = toHex(ch);
                  if (digit < 0)
                      return -4;
                  code = code * 16 + digit;
              }
              return code;
          }
      };
      function reportInvalidEscapeError(state, code) {
          switch (code) {
              case -2:
                  return report(state, 33);
              case -3:
                  return report(state, 32);
              case -4:
                  return report(state, 31);
              case -5:
                  return report(state, 30);
              default:
                  return;
          }
      }

      function scanTemplate(state, context) {
          const { index: start, lastChar } = state;
          let tail = true;
          let ret = '';
          let ch = scanNext(state, 35);
          loop: while (ch !== 96) {
              switch (ch) {
                  case 36: {
                      if (state.index + 1 < state.source.length && state.source.charCodeAt(state.index + 1) === 123) {
                          state.index++;
                          state.column++;
                          tail = false;
                          break loop;
                      }
                      ret += '$';
                      break;
                  }
                  case 92:
                      ch = scanNext(state, 35);
                      if (ch >= 128) {
                          ret += fromCodePoint(ch);
                      }
                      else {
                          state.lastChar = ch;
                          const code = table[ch](state, context, ch);
                          if (code >= 0) {
                              ret += fromCodePoint(code);
                          }
                          else if (code !== -1 && context & 65536) {
                              ret = undefined;
                              ch = scanLooserTemplateSegment(state, state.lastChar);
                              if (ch < 0) {
                                  ch = -ch;
                                  tail = false;
                              }
                              break loop;
                          }
                          else {
                              reportInvalidEscapeError(state, code);
                          }
                          ch = state.lastChar;
                      }
                      break;
                  case 13:
                      if (state.index < state.length && state.source.charCodeAt(state.index) === 10) {
                          if (ret != null)
                              ret += fromCodePoint(ch);
                          ch = state.source.charCodeAt(state.index);
                          state.index++;
                      }
                  case 10:
                  case 8232:
                  case 8233:
                      state.column = -1;
                      state.line++;
                  default:
                      if (ret != null)
                          ret += fromCodePoint(ch);
              }
              ch = scanNext(state, 35);
          }
          state.index++;
          state.column++;
          state.tokenValue = ret;
          state.lastChar = lastChar;
          if (tail) {
              state.tokenRaw = state.source.slice(start + 1, state.index - 1);
              return 131081;
          }
          else {
              state.tokenRaw = state.source.slice(start + 1, state.index - 2);
              return 131080;
          }
      }
      function scanLooserTemplateSegment(state, ch) {
          while (ch !== 96) {
              if (ch === 36 && state.source.charCodeAt(state.index + 1) === 123) {
                  state.index++;
                  state.column++;
                  return -ch;
              }
              ch = scanNext(state, 35);
          }
          return ch;
      }
      function scanTemplateTail(state, context) {
          if (state.index >= state.length)
              return report(state, 0);
          state.index--;
          state.column--;
          return scanTemplate(state, context);
      }

      var RegexState;
      (function (RegexState) {
          RegexState[RegexState["Empty"] = 0] = "Empty";
          RegexState[RegexState["Escape"] = 1] = "Escape";
          RegexState[RegexState["Class"] = 2] = "Class";
      })(RegexState || (RegexState = {}));
      var RegexFlags;
      (function (RegexFlags) {
          RegexFlags[RegexFlags["Empty"] = 0] = "Empty";
          RegexFlags[RegexFlags["IgnoreCase"] = 1] = "IgnoreCase";
          RegexFlags[RegexFlags["Global"] = 2] = "Global";
          RegexFlags[RegexFlags["Multiline"] = 4] = "Multiline";
          RegexFlags[RegexFlags["Unicode"] = 8] = "Unicode";
          RegexFlags[RegexFlags["Sticky"] = 16] = "Sticky";
          RegexFlags[RegexFlags["DotAll"] = 32] = "DotAll";
      })(RegexFlags || (RegexFlags = {}));
      function scanRegularExpression(state, context) {
          const bodyStart = state.index;
          let preparseState = RegexState.Empty;
          loop: while (true) {
              const ch = state.source.charCodeAt(state.index);
              state.index++;
              state.column++;
              if (preparseState & RegexState.Escape) {
                  preparseState &= ~RegexState.Escape;
              }
              else {
                  switch (ch) {
                      case 47:
                          if (!preparseState)
                              break loop;
                          else
                              break;
                      case 92:
                          preparseState |= RegexState.Escape;
                          break;
                      case 91:
                          preparseState |= RegexState.Class;
                          break;
                      case 93:
                          preparseState &= RegexState.Escape;
                          break;
                      case 13:
                      case 10:
                      case 8232:
                      case 8233:
                          report(state, 64);
                      default:
                  }
              }
              if (state.index >= state.source.length) {
                  report(state, 64);
              }
          }
          const bodyEnd = state.index - 1;
          let mask = RegexFlags.Empty;
          const { index: flagStart } = state;
          loop: while (state.index < state.source.length) {
              const code = state.source.charCodeAt(state.index);
              switch (code) {
                  case 103:
                      if (mask & RegexFlags.Global)
                          report(state, 26, 'g');
                      mask |= RegexFlags.Global;
                      break;
                  case 105:
                      if (mask & RegexFlags.IgnoreCase)
                          report(state, 26, 'i');
                      mask |= RegexFlags.IgnoreCase;
                      break;
                  case 109:
                      if (mask & RegexFlags.Multiline)
                          report(state, 26, 'm');
                      mask |= RegexFlags.Multiline;
                      break;
                  case 117:
                      if (mask & RegexFlags.Unicode)
                          report(state, 26, 'u');
                      mask |= RegexFlags.Unicode;
                      break;
                  case 121:
                      if (mask & RegexFlags.Sticky)
                          report(state, 26, 'y');
                      mask |= RegexFlags.Sticky;
                      break;
                  case 115:
                      if (mask & RegexFlags.DotAll)
                          report(state, 26, 's');
                      mask |= RegexFlags.DotAll;
                      break;
                  default:
                      if (!isIdentifierPart(code))
                          break loop;
                      report(state, 65, fromCodePoint(code));
              }
              state.index++;
              state.column++;
          }
          const flags = state.source.slice(flagStart, state.index);
          const pattern = state.source.slice(bodyStart, bodyEnd);
          state.tokenRegExp = { pattern, flags };
          if (context & 8)
              state.tokenRaw = state.source.slice(state.startIndex, state.index);
          state.tokenValue = validate(state, pattern, flags);
          return 131076;
      }
      function validate(state, pattern, flags) {
          try {
          }
          catch (e) {
              report(state, 64);
          }
          try {
              return new RegExp(pattern, flags);
          }
          catch (e) {
              return null;
          }
      }

      function returnBigIntOrNumericToken(state) {
          if (state.source.charCodeAt(state.index) === 110) {
              if (state.flags & 4)
                  report(state, 38);
              state.index++;
              state.column++;
              return 116;
          }
          else {
              if ((state.flags & (16 | 8)) === 0)
                  state.tokenValue = +state.tokenValue;
              return 131074;
          }
      }
      function scanNumeric(state, context) {
          let { index, column } = state;
          while (isDigit(state.source.charCodeAt(index))) {
              index++;
              column++;
          }
          if (state.source.charCodeAt(index) === 46) {
              index++;
              column++;
              state.flags = 4;
              while (isDigit(state.source.charCodeAt(index))) {
                  index++;
                  column++;
              }
          }
          let end = index;
          switch (state.source.charCodeAt(index)) {
              case 69:
              case 101: {
                  index++;
                  column++;
                  state.flags = 4;
                  if (state.source.charCodeAt(index) === 43 || state.source.charCodeAt(index) === 45) {
                      index++;
                      column++;
                  }
                  if (!isDigit(state.source.charCodeAt(index)))
                      report(state, 36);
                  index++;
                  column++;
                  while (isDigit(state.source.charCodeAt(index))) {
                      index++;
                      column++;
                  }
                  end = index;
              }
              default:
          }
          const code = state.source.charCodeAt(index);
          if (code !== 110 && (isDigit(code) || isIdentifierStart(code)))
              report(state, 37);
          state.index = index;
          state.column = column;
          state.tokenValue = state.source.slice(state.startIndex, end);
          if (context & 8)
              state.tokenRaw = state.tokenValue;
          return returnBigIntOrNumericToken(state);
      }
      function scanHexIntegerLiteral(state) {
          let { index, column } = state;
          let value = toHex(state.source.charCodeAt(index));
          if (value < 0)
              report(state, 0);
          index++;
          column++;
          while (index < state.length) {
              const digit = toHex(state.source.charCodeAt(index));
              if (digit < 0)
                  break;
              value = value * 16 + digit;
              index++;
              column++;
          }
          state.index = index;
          state.column = column;
          state.tokenValue = value;
          return returnBigIntOrNumericToken(state);
      }
      function scanBinaryOrOctalDigits(state, base) {
          let { index, column } = state;
          let value = 0;
          let numberOfDigits = 0;
          while (index < state.length) {
              const ch = state.source.charCodeAt(index);
              const converted = ch - 48;
              if (!(ch >= 48 && ch <= 57) || converted >= base)
                  break;
              value = value * base + converted;
              index++;
              column++;
              numberOfDigits++;
          }
          if (numberOfDigits === 0)
              report(state, 39, '' + base);
          state.flags |= 16;
          state.index = index;
          state.column = column;
          state.tokenValue = value;
          return returnBigIntOrNumericToken(state);
      }
      function scanImplicitOctalDigits(state, context) {
          if ((context & 1024) !== 0)
              report(state, 40);
          let { index, column } = state;
          let code = 0;
          while (index < state.length) {
              const next = state.source.charCodeAt(index);
              if (next < 48 || next > 55) {
                  state.flags |= 4;
                  return scanNumeric(state, context);
              }
              else {
                  code = code * 8 + (next - 48);
                  index++;
                  column++;
              }
          }
          state.flags |= 8;
          state.index = index;
          state.column = column;
          state.tokenValue = code;
          return 131074;
      }

      const OneCharPunc = new Array(128).fill(0);
      const table$1 = new Array(0xffff).fill(scanMaybeIdentifier, 0x80);
      function scanChar(state, _, first) {
          state.index++;
          state.column++;
          return OneCharPunc[first];
      }
      table$1[35] = scanPrivateName;
      table$1[36] = scanIdentifier;
      table$1[34] = scanStringLiteral;
      table$1[39] = scanStringLiteral;
      table$1[40] = scanChar;
      OneCharPunc[40] = 131083;
      table$1[41] = scanChar;
      OneCharPunc[41] = 16;
      for (let i = 49; i <= 57; i++) {
          table$1[i] = scanNumeric;
      }
      table$1[58] = scanChar;
      OneCharPunc[58] = 21;
      table$1[59] = scanChar;
      OneCharPunc[59] = 536870929;
      table$1[48] = (state, context) => {
          const index = state.index + 1;
          if (index < state.length) {
              const next = state.source.charCodeAt(index);
              if (next === 88 || next === 120) {
                  state.index = index + 1;
                  state.column += 2;
                  return scanHexIntegerLiteral(state);
              }
              else if (next === 66 || next === 98) {
                  state.index = index + 1;
                  state.column += 2;
                  return scanBinaryOrOctalDigits(state, 2);
              }
              else if (next === 79 || next === 111) {
                  state.index = index + 1;
                  state.column += 2;
                  return scanBinaryOrOctalDigits(state, 8);
              }
              else if (index < state.length && (next >= 48 && next <= 57)) {
                  return scanImplicitOctalDigits(state, context);
              }
          }
          return scanNumeric(state, context);
      };
      table$1[33] = state => {
          state.index++;
          state.column++;
          if (consumeOpt(state, 61)) {
              if (consumeOpt(state, 61)) {
                  return 16909882;
              }
              return 16909884;
          }
          return 33685549;
      };
      table$1[37] = state => {
          state.index++;
          state.column++;
          return consumeOpt(state, 61) ? 8388646 : 16910900;
      };
      table$1[38] = state => {
          state.index++;
          state.column++;
          if (state.index < state.length) {
              const next = state.source.charCodeAt(state.index);
              if (next === 38) {
                  state.index++;
                  state.column++;
                  return 16974391;
              }
              else if (next === 61) {
                  state.index++;
                  state.column++;
                  return 8388649;
              }
          }
          return 16909636;
      };
      table$1[42] = state => {
          state.index++;
          state.column++;
          if (state.index < state.length) {
              const next = state.source.charCodeAt(state.index);
              if (next === 42) {
                  state.index++;
                  state.column++;
                  return consumeOpt(state, 61) ? 8388641 : 16911158;
              }
              else if (next === 61) {
                  state.index++;
                  state.column++;
                  return 8388644;
              }
          }
          return 21105203;
      };
      table$1[43] = state => {
          state.index++;
          state.column++;
          if (state.index < state.length) {
              const next = state.source.charCodeAt(state.index);
              if (next === 43) {
                  state.index++;
                  state.column++;
                  return 67239963;
              }
              else if (next === 61) {
                  state.index++;
                  state.column++;
                  return 8388642;
              }
          }
          return 50465071;
      };
      table$1[44] = scanChar;
      OneCharPunc[44] = 18;
      table$1[45] = (state, context) => {
          state.index++;
          state.column++;
          if (state.index < state.length) {
              const next = state.source.charCodeAt(state.index);
              if (next === 45) {
                  state.index++;
                  state.column++;
                  if (context & 16 &&
                      ((state.flags & 1 || state.startIndex === 0) && consumeOpt(state, 62))) {
                      return skipSingleHTMLComment(state, context, 3);
                  }
                  return 67239964;
              }
              else if (next === 61) {
                  state.index++;
                  state.column++;
                  return 8388643;
              }
          }
          return 50465072;
      };
      table$1[46] = (state, context) => {
          let index = state.index + 1;
          if (index < state.length) {
              const next = state.source.charCodeAt(index);
              if (next === 46) {
                  index++;
                  if (index < state.length && state.source.charCodeAt(index) === 46) {
                      state.index = index + 1;
                      state.column += 3;
                      return 14;
                  }
              }
              else if (next >= 48 && next <= 57) {
                  scanNumeric(state, context);
                  return 131074;
              }
          }
          state.index++;
          state.column++;
          return 13;
      };
      table$1[47] = (state, context) => {
          state.index++;
          state.column++;
          if (state.index < state.length) {
              const next = state.source.charCodeAt(state.index);
              if (context & 32768 && (next !== 42 && next !== 47)) {
                  return scanRegularExpression(state, context);
              }
              else if (next === 47) {
                  state.index++;
                  state.column++;
                  return skipSingleLineComment(state, 0);
              }
              else if (next === 42) {
                  state.index++;
                  state.column++;
                  return skipBlockComment(state);
              }
              else if (next === 61) {
                  state.index++;
                  state.column++;
                  return 8519717;
              }
              else if (next === 62) {
                  state.index++;
                  state.column++;
                  return 26;
              }
          }
          return 16910901;
      };
      table$1[60] = (state, context) => {
          state.index++;
          state.column++;
          if (state.index < state.length) {
              switch (state.source.charCodeAt(state.index)) {
                  case 60:
                      state.index++;
                      state.column++;
                      return consumeOpt(state, 61) ? 8388638 : 16910401;
                  case 61:
                      state.index++;
                      state.column++;
                      return 16910141;
                  case 33: {
                      const index = state.index + 1;
                      const next = state.source.charCodeAt(index);
                      if (next === 45 && state.source.charCodeAt(index + 1) === 45) {
                          state.index = index;
                          state.column++;
                          return skipSingleHTMLComment(state, context, 2);
                      }
                  }
                  case 47: {
                      if (!(context & 4))
                          break;
                      const index = state.index + 1;
                      if (index < state.length) {
                          const next = state.source.charCodeAt(index);
                          if (next === 42 || next === 47)
                              break;
                      }
                      state.index++;
                      state.column++;
                      return 25;
                  }
                  default:
              }
          }
          return 16910143;
      };
      table$1[61] = state => {
          state.index++;
          state.column++;
          if (state.index < state.length) {
              const next = state.source.charCodeAt(state.index);
              if (next === 61) {
                  state.index++;
                  state.column++;
                  return consumeOpt(state, 61) ? 16909881 : 16909883;
              }
              else if (next === 62) {
                  state.index++;
                  state.column++;
                  return 131082;
              }
          }
          return 8388637;
      };
      table$1[62] = state => {
          state.index++;
          state.column++;
          if (state.index < state.length) {
              const next = state.source.charCodeAt(state.index);
              if (next === 62) {
                  state.index++;
                  state.column++;
                  if (state.index < state.length) {
                      const next = state.source.charCodeAt(state.index);
                      if (next === 62) {
                          state.index++;
                          state.column++;
                          return consumeOpt(state, 61) ? 8388640 : 16910403;
                      }
                      else if (next === 61) {
                          state.index++;
                          state.column++;
                          return 8388639;
                      }
                  }
                  return 16910402;
              }
              else if (next === 61) {
                  state.index++;
                  state.column++;
                  return 16910142;
              }
          }
          return 16910144;
      };
      table$1[63] = scanChar;
      OneCharPunc[63] = 22;
      for (let i = 65; i <= 90; i++) {
          table$1[i] = scanIdentifier;
      }
      for (let i = 97; i <= 122; i++) {
          table$1[i] = scanIdentifierOrKeyword;
      }
      table$1[91] = scanChar;
      OneCharPunc[91] = 131091;
      table$1[92] = scanIdentifierOrKeyword;
      table$1[93] = scanChar;
      OneCharPunc[93] = 20;
      table$1[95] = scanIdentifier;
      table$1[96] = scanTemplate;
      table$1[123] = scanChar;
      OneCharPunc[123] = 131084;
      table$1[125] = scanChar;
      OneCharPunc[125] = 536870927;
      table$1[126] = scanChar;
      OneCharPunc[126] = 33685550;
      table$1[94] = state => {
          state.index++;
          state.column++;
          return consumeOpt(state, 61) ? 8388647 : 16909382;
      };
      table$1[124] = state => {
          state.index++;
          state.column++;
          if (state.index < state.length) {
              const next = state.source.charCodeAt(state.index);
              if (next === 124) {
                  state.index++;
                  state.column++;
                  return 16974136;
              }
              else if (next === 61) {
                  state.index++;
                  state.column++;
                  return 8388648;
              }
          }
          return 16909125;
      };
      table$1[32] = table$1[9] = table$1[12] = table$1[11] = state => {
          state.index++;
          state.column++;
          return 1073741824;
      };
      table$1[10] = state => {
          consumeLineFeed(state, (state.flags & 2) > 0);
          state.flags = (state.flags & ~2) | 1;
          return 1073741824;
      };
      table$1[13] = state => {
          state.flags |= 1 | 2;
          state.index++;
          state.column = 0;
          state.line++;
          return 1073741824;
      };
      function next(state, context) {
          state.flags &= ~1;
          while (state.index < state.length) {
              state.startIndex = state.index;
              const first = state.source.charCodeAt(state.index);
              if (((state.token = table$1[first](state, context, first)) & 1073741824) !== 1073741824) {
                  if (state.onToken)
                      state.onToken(state.token, state.startIndex, state.index);
                  return state.token;
              }
          }
          return (state.token = 536870912);
      }

      function pushComment(context, array) {
          return function (type, value, start, end) {
              const comment = {
                  type,
                  value
              };
              if (context & 32) {
                  comment.start = start;
                  comment.end = end;
              }
              array.push(comment);
          };
      }
      function pushToken(context, array) {
          return function (token, value, start, end) {
              const tokens = {
                  token,
                  value
              };
              if (context & 32) {
                  tokens.start = start;
                  tokens.end = end;
              }
              array.push(tokens);
          };
      }
      function optional(state, context, t) {
          if (state.token === t) {
              next(state, context);
              return true;
          }
          return false;
      }
      function expect(state, context, t) {
          if (state.token === t) {
              next(state, context);
          }
          else {
              report(state, 1, KeywordDescTable[state.token & 255]);
          }
      }
      function consumeSemicolon(state, context) {
          if ((state.token & 536870912) === 536870912) {
              optional(state, context, 536870929);
          }
          else if ((state.flags & 1) !== 1) {
              report(state, 1, KeywordDescTable[state.token & 255]);
          }
      }
      function addVariable(state, context, scope, bindingType, origin, checkDuplicates, isVarDecl, key) {
          if (scope === -1)
              return;
          if (bindingType & 2) {
              let lex = scope.lex;
              while (lex) {
                  const type = lex.type;
                  if (lex['@' + key] !== undefined) {
                      if (type === 4) {
                          if (isVarDecl && context & 16) {
                              state.inCatch = true;
                          }
                          else {
                              report(state, 42, key);
                          }
                      }
                      else if (type === 2) {
                          report(state, 98);
                      }
                      else if (type !== 5) {
                          if (checkForDuplicateLexicals(scope, '@' + key, context, origin) === true) {
                              report(state, 98, key);
                          }
                      }
                  }
                  lex = lex['@'];
              }
              let x = scope.var['@' + key];
              if (x === undefined) {
                  x = 1;
              }
              else {
                  ++x;
              }
              scope.var['@' + key] = x;
              let lexVars = scope.lexVars;
              while (lexVars) {
                  lexVars['@' + key] = true;
                  lexVars = lexVars['@'];
              }
          }
          else {
              const lex = scope.lex;
              if (checkDuplicates) {
                  checkIfExistInLexicalParentScope(state, context, scope, origin, '@' + key);
                  if (lex['@' + key] !== undefined) {
                      if (checkForDuplicateLexicals(scope, '@' + key, context, origin) === true) {
                          report(state, 41, key);
                      }
                  }
              }
              let x = lex['@' + key];
              if (x === undefined)
                  x = 1;
              else if (checkDuplicates) {
                  if (checkForDuplicateLexicals(scope, '@' + key, context, origin) === true) {
                      report(state, 99, key);
                  }
              }
              else {
                  ++x;
              }
              lex['@' + key] = x;
          }
      }
      function checkForDuplicateLexicals(scope, key, context, origin) {
          return context & 1024
              ? true
              : (context & 16) === 0
                  ? true
                  : origin & 512
                      ? true
                      : (scope.lex.funcs[key] === true) === false
                          ? true
                          : false;
      }
      function checkIfExistInLexicalBindings(state, context, scope, origin, skipParent) {
          const lex = scope.lex;
          for (const key in lex) {
              if (key[0] === '@' && key.length > 1) {
                  if (lex[key] > 1)
                      return true;
                  if (!skipParent)
                      checkIfExistInLexicalParentScope(state, context, scope, origin, key);
              }
          }
          return false;
      }
      function checkIfExistInLexicalParentScope(state, context, scope, origin, key) {
          const lex = scope.lex;
          const lexParent = lex['@'];
          if (lexParent !== undefined && lexParent[key] !== undefined) {
              if (lexParent.type === 5) {
                  report(state, 101);
              }
              else if (lexParent.type === 4) {
                  report(state, 100);
              }
          }
          if (scope.lexVars[key] !== undefined) {
              if (checkForDuplicateLexicals(scope, key, context, origin) === true) {
                  report(state, 41, key.slice(1));
              }
          }
      }
      function addFunctionName(state, context, scope, bindingType, origin, isVarDecl) {
          addVariable(state, context, scope, bindingType, origin, true, isVarDecl, state.tokenValue);
          if (context & 16 && !scope.lex.funcs['@' + state.tokenValue]) {
              scope.lex.funcs['@' + state.tokenValue] = true;
          }
      }
      function validateFunctionArgs(state, arg) {
          for (const key in arg) {
              if (key[0] === '@' && key.length > 1 && arg[key] > 1) {
                  report(state, 41, key.slice(1));
              }
          }
      }
      function lookAheadOrScan(state, context, callback, isLookahead) {
          const savedIndex = state.index;
          const savedLine = state.line;
          const savedColumn = state.column;
          const startIndex = state.startIndex;
          const savedFlags = state.flags;
          const savedTokenValue = state.tokenValue;
          const savedNextChar = state.currentChar;
          const savedToken = state.token;
          const savedTokenRegExp = state.tokenRegExp;
          const result = callback(state, context);
          if (!result || isLookahead) {
              state.index = savedIndex;
              state.line = savedLine;
              state.column = savedColumn;
              state.startIndex = startIndex;
              state.flags = savedFlags;
              state.tokenValue = savedTokenValue;
              state.currentChar = savedNextChar;
              state.token = savedToken;
              state.tokenRegExp = savedTokenRegExp;
          }
          return result;
      }
      function isLexical(state, context) {
          next(state, context);
          const { token } = state;
          return !!((token & 405505) === 274432 ||
              (token & 12288) === 12288 ||
              token === 131084 ||
              token === 131091 ||
              state.token & 2097152 ||
              state.token & 524288 ||
              token === 402821192);
      }
      function reinterpret(state, ast) {
          switch (ast.type) {
              case 'ArrayExpression':
                  ast.type = 'ArrayPattern';
                  const elements = ast.elements;
                  for (let i = 0, n = elements.length; i < n; ++i) {
                      const element = elements[i];
                      if (element)
                          reinterpret(state, element);
                  }
                  break;
              case 'ObjectExpression':
                  ast.type = 'ObjectPattern';
                  const properties = ast.properties;
                  for (let i = 0, n = properties.length; i < n; ++i) {
                      reinterpret(state, properties[i]);
                  }
                  break;
              case 'AssignmentExpression':
                  ast.type = 'AssignmentPattern';
                  if (ast.operator !== '=')
                      report(state, 0);
                  delete ast.operator;
                  reinterpret(state, ast.left);
                  break;
              case 'Property':
                  reinterpret(state, ast.value);
                  break;
              case 'SpreadElement':
                  ast.type = 'RestElement';
                  reinterpret(state, ast.argument);
          }
      }
      function nameIsArgumentsOrEval(value) {
          return value === 'eval' || value === 'arguments';
      }
      function isValidIdentifier(context, t) {
          if (context & 1024) {
              if (context & 2048 && t & 524288)
                  return false;
              if (t & 2097152)
                  return false;
              return (t & 274432) === 274432 || (t & 12288) === 12288;
          }
          return ((t & 274432) === 274432 ||
              (t & 12288) === 12288 ||
              (t & 36864) === 36864);
      }
      function validateBindingIdentifier(state, context, type, token = state.token) {
          if (context & 1024 && token === 36969)
              report(state, 73);
          if (context & (4194304 | 2048) && token & 524288) {
              report(state, 71);
          }
          if (context & (2097152 | 1024) && token & 2097152) {
              report(state, 67, 'yield');
          }
          if ((token & 36864) === 36864) {
              if (context & 1024)
                  report(state, 72);
          }
          if ((token & 20480) === 20480) {
              report(state, 72);
          }
          if (token === 402821192) {
              if (type & 16)
                  report(state, 68);
              if (type & (4 | 8))
                  report(state, 69);
              if (context & 1024)
                  report(state, 70);
          }
          return true;
      }
      function addToExportedNamesAndCheckForDuplicates(state, exportedName) {
          if (state.exportedNames !== undefined && exportedName !== '') {
              const hashed = '@' + exportedName;
              if (state.exportedNames[hashed])
                  report(state, 48, exportedName);
              state.exportedNames[hashed] = 1;
          }
      }
      function addToExportedBindings(state, exportedName) {
          if (state.exportedBindings !== undefined && exportedName !== '') {
              const hashed = '@' + exportedName;
              state.exportedBindings[hashed] = 1;
          }
      }
      function nextTokenIsFuncKeywordOnSameLine(state, context) {
          const line = state.line;
          next(state, context);
          return state.token === 151639 && state.line === line;
      }
      function isIterationStatement(state) {
          return state.token === 20577 || state.token === 20561 || state.token === 20566;
      }
      function addLabel(state, label) {
          if (state.labelSet === undefined)
              state.labelSet = {};
          state.labelSet[`@${label}`] = true;
          state.labelSetStack[state.labelDepth] = state.labelSet;
          state.iterationStack[state.labelDepth] = isIterationStatement(state);
          state.labelSet = undefined;
          state.labelDepth++;
      }
      function addCrossingBoundary(state) {
          state.labelSetStack[state.labelDepth] = state.functionBoundaryStack;
          state.iterationStack[state.labelDepth] = 0;
          state.labelDepth++;
      }
      function validateContinueLabel(state, label) {
          const sstate = getLabel(state, `@${label}`, true);
          if ((sstate & 1) !== 1) {
              if (sstate & 2) {
                  report(state, 0);
              }
              else {
                  report(state, 96, 'continue');
              }
          }
      }
      function validateBreakStatement(state, label) {
          if ((getLabel(state, `@${label}`) & 1) !== 1)
              report(state, 96);
      }
      function getLabel(state, label, iterationStatement = false, crossBoundary = false) {
          if (!iterationStatement && state.labelSet && state.labelSet[label] === true) {
              return 1;
          }
          if (!state.labelSetStack)
              return 0;
          let stopAtTheBorder = false;
          for (let i = state.labelDepth - 1; i >= 0; i--) {
              const labelSet = state.labelSetStack[i];
              if (labelSet === state.functionBoundaryStack) {
                  if (crossBoundary) {
                      break;
                  }
                  else {
                      stopAtTheBorder = true;
                      continue;
                  }
              }
              if (iterationStatement && state.iterationStack[i] === false) {
                  continue;
              }
              if (labelSet[label] === true) {
                  return stopAtTheBorder ? 2 : 1;
              }
          }
          return 0;
      }
      function addVariableAndDeduplicate(state, context, scope, type, origin, isVarDecl, name) {
          addVariable(state, context, scope, type, origin, true, isVarDecl, name);
          if (context & 16) {
              scope.lex.funcs['#' + state.tokenValue] = false;
          }
      }
      function createScope(type) {
          return {
              var: {},
              lexVars: {},
              lex: {
                  '@': undefined,
                  type,
                  funcs: {}
              }
          };
      }
      function createSubScope(parent, type) {
          return {
              var: parent.var,
              lexVars: {
                  '@': parent.lexVars
              },
              lex: {
                  '@': parent.lex,
                  type,
                  funcs: []
              }
          };
      }
      function nextTokenIsLeftParenOrPeriod(state, context) {
          next(state, context);
          return state.token === 131083 || state.token === 13;
      }
      function nextTokenIsLeftParen(parser, context) {
          next(parser, context);
          return parser.token === 131083;
      }
      function secludeGrammar(state, context, minprec = 0, callback) {
          const { assignable, bindable, pendingCoverInitializeError } = state;
          state.bindable = true;
          state.assignable = true;
          state.pendingCoverInitializeError = null;
          const result = callback(state, context, minprec);
          if (state.pendingCoverInitializeError !== null) {
              report(state, state.pendingCoverInitializeError);
          }
          state.bindable = bindable;
          state.assignable = assignable;
          state.pendingCoverInitializeError = pendingCoverInitializeError;
          return result;
      }
      function acquireGrammar(state, context, minprec, callback) {
          const { assignable, bindable, pendingCoverInitializeError } = state;
          state.bindable = true;
          state.assignable = true;
          state.pendingCoverInitializeError = null;
          const result = callback(state, context, minprec);
          state.bindable = state.bindable && bindable;
          state.assignable = state.assignable && assignable;
          state.pendingCoverInitializeError = pendingCoverInitializeError || state.pendingCoverInitializeError;
          return result;
      }
      function isValidSimpleAssignmentTarget(node) {
          return node.type === 'Identifier' || node.type === 'MemberExpression' ? true : false;
      }

      function create(source, onComment, onToken) {
          return {
              source,
              onComment,
              onToken,
              flags: 0,
              grammar: 3,
              index: 0,
              line: 1,
              column: 0,
              startIndex: 0,
              startLine: 1,
              startColumn: 0,
              token: 536870912,
              tokenValue: undefined,
              tokenRaw: '',
              tokenRegExp: undefined,
              lastRegExpError: undefined,
              numCapturingParens: 0,
              largestBackReference: 0,
              length: source.length,
              currentChar: source.charCodeAt(0),
              lastChar: 0,
              inCatch: false,
              assignable: true,
              bindable: true,
              exportedNames: [],
              exportedBindings: [],
              labelSet: undefined,
              labelSetStack: [],
              iterationStack: [],
              labelDepth: 0,
              switchStatement: 0,
              iterationStatement: 0,
              functionBoundaryStack: undefined,
              pendingCoverInitializeError: null
          };
      }
      function parseModuleItem(state, context, scope) {
          next(state, context | 32768);
          const statements = [];
          while (state.token === 131075) {
              const tokenValue = state.tokenValue;
              if (!(context & 1024) && tokenValue.length === 10 && tokenValue === 'use strict') {
                  context |= 1024;
              }
              statements.push(parseDirective(state, context, scope));
          }
          while (state.token !== 536870912) {
              statements.push(parseModuleItemList(state, context, scope));
          }
          return statements;
      }
      function parseStatementList(state, context, scope) {
          next(state, context | 32768);
          const statements = [];
          while (state.token === 131075) {
              const tokenValue = state.tokenValue;
              if (!(context & 1024) && tokenValue.length === 10 && tokenValue === 'use strict') {
                  context |= 1024;
              }
              statements.push(parseDirective(state, context, scope));
          }
          while (state.token !== 536870912) {
              statements.push(parseStatementListItem(state, context, scope));
          }
          return statements;
      }
      function parseDirective(state, context, scope) {
          if ((context & 131072) < 1)
              return parseStatementListItem(state, context, scope);
          const directive = state.tokenRaw.slice(1, -1);
          const expression = parseExpression(state, context);
          consumeSemicolon(state, context);
          return {
              type: 'ExpressionStatement',
              expression,
              directive
          };
      }
      function parseAsyncFunctionOrAssignmentExpression(state, context, scope, isDefault) {
          return lookAheadOrScan(state, context, nextTokenIsFuncKeywordOnSameLine, false)
              ? parseHoistableFunctionDeclaration(state, context, scope, isDefault, true)
              : parseAssignmentExpression(state, context);
      }
      function parseStatementListItem(state, context, scope) {
          state.assignable = state.bindable = true;
          switch (state.token) {
              case 151639:
                  return parseFunctionDeclaration(state, context, scope, 128, false);
              case 151629:
                  return parseClassDeclaration(state, context, scope);
              case 402804809:
                  return parseLexicalDeclaration(state, context, 8, 1, scope);
              case 402821192:
                  return parseLetOrExpressionStatement(state, context, scope);
              case 1060972:
                  return parseAsyncFunctionOrExpressionStatement(state, context, scope);
              default:
                  return parseStatement(state, (context | 4096) ^ 4096, scope, 1);
          }
      }
      function parseAsyncFunctionOrExpressionStatement(state, context, scope) {
          return lookAheadOrScan(state, context, nextTokenIsFuncKeywordOnSameLine, false)
              ? parseFunctionDeclaration(state, context, scope, 512, true)
              : parseExpressionOrLabelledStatement(state, context, scope, 2);
      }
      function parseLetOrExpressionStatement(state, context, scope) {
          return lookAheadOrScan(state, context, isLexical, true)
              ? parseLexicalDeclaration(state, context, 4, 1, scope)
              : parseExpressionOrLabelledStatement(state, context, scope, 2);
      }
      function parseStatement(state, context, scope, label) {
          switch (state.token) {
              case 268587079:
                  return parseVariableStatement(state, context, 2, 1, scope);
              case 151645:
                  return parseSwitchStatement(state, context, scope);
              case 20561:
                  return parseDoWhileStatement(state, context, scope);
              case 20571:
                  return parseReturnStatement(state, context);
              case 20577:
                  return parseWhileStatement(state, context, scope);
              case 20578:
                  return parseWithStatement(state, context, scope);
              case 20554:
                  return parseBreakStatement(state, context);
              case 20558:
                  return parseContinueStatement(state, context);
              case 20559:
                  return parseDebuggerStatement(state, context);
              case 20576:
                  return parseTryStatement(state, context, scope);
              case 151647:
                  return parseThrowStatement(state, context);
              case 20568:
                  return parseIfStatement(state, context, scope);
              case 536870929:
                  return parseEmptyStatement(state, context);
              case 131084:
                  return parseBlockStatement(state, (context | 4096) ^ 4096, createSubScope(scope, 1));
              case 20566:
                  return parseForStatement(state, context, scope);
              case 1060972:
                  if (lookAheadOrScan(state, context, nextTokenIsFuncKeywordOnSameLine, false)) {
                      report(state, 76);
                  }
                  return parseExpressionOrLabelledStatement(state, context, scope, label);
              case 151639:
                  report(state, context & 1024 ? 44 : 43);
              case 151629:
                  report(state, 75, KeywordDescTable[state.token & 255]);
              default:
                  return parseExpressionOrLabelledStatement(state, context, scope, label);
          }
      }
      function parseModuleItemList(state, context, scope) {
          state.assignable = state.bindable = true;
          switch (state.token) {
              case 20563:
                  return parseExportDeclaration(state, context, scope);
              case 151641:
                  if (!(context & 1 && lookAheadOrScan(state, context, nextTokenIsLeftParenOrPeriod, true))) {
                      return parseImportDeclaration(state, context, scope);
                  }
              default:
                  return parseStatementListItem(state, context, scope);
          }
      }
      function parseExportDeclaration(state, context, scope) {
          expect(state, context, 20563);
          const specifiers = [];
          let declaration = null;
          let source = null;
          if (optional(state, context | 32768, 20560)) {
              switch (state.token) {
                  case 151639: {
                      declaration = parseHoistableFunctionDeclaration(state, context | 512, scope, true, false);
                      break;
                  }
                  case 151629:
                      declaration = parseHostedClassDeclaration(state, context | 512, scope, true);
                      break;
                  case 1060972:
                      declaration = parseAsyncFunctionOrAssignmentExpression(state, context | 512, scope, true);
                      break;
                  default:
                      declaration = parseAssignmentExpression(state, context);
                      consumeSemicolon(state, context);
              }
              addToExportedNamesAndCheckForDuplicates(state, 'default');
              addToExportedBindings(state, '*default*');
              addVariable(state, context, scope, 0, 0, true, false, '*default*');
              return {
                  type: 'ExportDefaultDeclaration',
                  declaration
              };
          }
          switch (state.token) {
              case 21105203: {
                  next(state, context);
                  expect(state, context, 12401);
                  if (state.token !== 131075)
                      report(state, 0);
                  source = parseLiteral(state, context, state.tokenValue);
                  consumeSemicolon(state, context);
                  return {
                      type: 'ExportAllDeclaration',
                      source
                  };
              }
              case 131084: {
                  const exportedNames = [];
                  const exportedBindings = [];
                  expect(state, context, 131084);
                  while (state.token !== 536870927) {
                      const tokenValue = state.tokenValue;
                      const token = state.token;
                      const local = parseIdentifier(state, context);
                      let exported;
                      if (state.token === 16920683) {
                          next(state, context);
                          if (!(state.token & 274432))
                              report(state, 0);
                          exportedNames.push(state.tokenValue);
                          exportedBindings.push(tokenValue);
                          exported = parseIdentifier(state, context);
                      }
                      else {
                          validateBindingIdentifier(state, context, 8, token);
                          exportedNames.push(state.tokenValue);
                          exportedBindings.push(state.tokenValue);
                          exported = local;
                      }
                      specifiers.push({
                          type: 'ExportSpecifier',
                          local,
                          exported
                      });
                      if (state.token !== 536870927)
                          expect(state, context, 18);
                  }
                  expect(state, context, 536870927);
                  if (state.token === 12401) {
                      next(state, context);
                      if (state.token !== 131075)
                          report(state, 0);
                      source = parseLiteral(state, context, state.tokenValue);
                  }
                  else {
                      let i = 0;
                      let iMax = exportedNames.length;
                      for (; i < iMax; i++) {
                          addToExportedNamesAndCheckForDuplicates(state, exportedNames[i]);
                      }
                      i = 0;
                      iMax = exportedBindings.length;
                      for (; i < iMax; i++) {
                          addToExportedBindings(state, exportedBindings[i]);
                      }
                  }
                  consumeSemicolon(state, context);
                  break;
              }
              case 151629:
                  declaration = parseHostedClassDeclaration(state, context, scope, false);
                  break;
              case 402821192:
                  declaration = parseLexicalDeclaration(state, context, 4, 4, scope);
                  if (checkIfExistInLexicalBindings(state, context, scope, 0, false))
                      report(state, 0);
                  break;
              case 402804809:
                  declaration = parseLexicalDeclaration(state, context, 8, 4, scope);
                  if (checkIfExistInLexicalBindings(state, context, scope, 0, false))
                      report(state, 0);
                  break;
              case 268587079:
                  declaration = parseVariableStatement(state, context, 2, 4, scope);
                  break;
              case 151639:
                  declaration = parseHoistableFunctionDeclaration(state, context, scope, true, false);
                  break;
              case 1060972:
                  declaration = parseAsyncFunctionOrAssignmentExpression(state, context, scope, false);
                  break;
              default:
                  report(state, 0);
          }
          return {
              type: 'ExportNamedDeclaration',
              source,
              specifiers,
              declaration
          };
      }
      function parseImportDeclaration(state, context, scope) {
          expect(state, context, 151641);
          let source;
          const specifiers = [];
          if (state.token & 274432) {
              validateBindingIdentifier(state, context, 8);
              addVariable(state, context, scope, 0, 0, true, false, state.tokenValue);
              specifiers.push({
                  type: 'ImportDefaultSpecifier',
                  local: parseIdentifier(state, context)
              });
              if (optional(state, context, 18)) {
                  if (state.token === 21105203) {
                      parseImportNamespace(state, context, scope, specifiers);
                  }
                  else if (state.token === 131084) {
                      parseImportSpecifierOrNamedImports(state, context, scope, specifiers);
                  }
                  else
                      report(state, 0);
              }
              source = parseModuleSpecifier(state, context);
          }
          else if (state.token === 131075) {
              source = parseLiteral(state, context, state.tokenValue);
          }
          else {
              if (state.token === 21105203) {
                  parseImportNamespace(state, context, scope, specifiers);
              }
              else if (state.token === 131084) {
                  parseImportSpecifierOrNamedImports(state, context, scope, specifiers);
              }
              else
                  report(state, 0);
              source = parseModuleSpecifier(state, context);
          }
          consumeSemicolon(state, context);
          return {
              type: 'ImportDeclaration',
              specifiers,
              source
          };
      }
      function parseImportSpecifierOrNamedImports(state, context, scope, specifiers) {
          expect(state, context, 131084);
          while (state.token !== 536870927) {
              const tokenValue = state.tokenValue;
              const token = state.token;
              if (!(state.token & 274432))
                  report(state, 0);
              const imported = parseIdentifier(state, context);
              let local;
              if (optional(state, context, 16920683)) {
                  validateBindingIdentifier(state, context, 8);
                  addVariable(state, context, scope, 8, 0, true, false, state.tokenValue);
                  local = parseIdentifier(state, context);
              }
              else {
                  validateBindingIdentifier(state, context, 8, token);
                  addVariable(state, context, scope, 8, 0, true, false, tokenValue);
                  local = imported;
              }
              specifiers.push({
                  type: 'ImportSpecifier',
                  local,
                  imported
              });
              if (state.token !== 536870927)
                  expect(state, context, 18);
          }
          expect(state, context, 536870927);
      }
      function parseImportNamespace(state, context, scope, specifiers) {
          next(state, context);
          expect(state, context, 16920683);
          validateBindingIdentifier(state, context, 8);
          addVariable(state, context, scope, 8, 0, true, false, state.tokenValue);
          const local = parseIdentifier(state, context);
          specifiers.push({
              type: 'ImportNamespaceSpecifier',
              local
          });
      }
      function parseModuleSpecifier(state, context) {
          expect(state, context, 12401);
          if (state.token !== 131075)
              report(state, 0);
          return parseLiteral(state, context, state.tokenValue);
      }
      function parseBlockStatement(state, context, scope) {
          const body = [];
          next(state, context);
          while (state.token !== 536870927) {
              body.push(parseStatementListItem(state, context, scope));
          }
          expect(state, context | 32768, 536870927);
          return {
              type: 'BlockStatement',
              body
          };
      }
      function parseEmptyStatement(state, context) {
          next(state, context | 32768);
          return {
              type: 'EmptyStatement'
          };
      }
      function parseThrowStatement(state, context) {
          next(state, context);
          if (state.flags & 1)
              report(state, 54);
          const argument = parseExpression(state, context);
          consumeSemicolon(state, context);
          return {
              type: 'ThrowStatement',
              argument
          };
      }
      function parseIfStatement(state, context, scope) {
          next(state, context);
          expect(state, context | 32768, 131083);
          const test = parseExpression(state, context);
          expect(state, context, 16);
          const consequent = parseConsequentOrAlternate(state, context, scope);
          const alternate = optional(state, context, 20562)
              ? parseConsequentOrAlternate(state, context, scope)
              : null;
          return {
              type: 'IfStatement',
              test,
              consequent,
              alternate
          };
      }
      function parseConsequentOrAlternate(state, context, scope) {
          return context & 1024 || (context & 16) === 0 || state.token !== 151639
              ? parseStatement(state, (context | 4096) ^ 4096, scope, 2)
              : parseFunctionDeclaration(state, context, scope, 1, false);
      }
      function parseSwitchStatement(state, context, scope) {
          next(state, context);
          expect(state, context | 32768, 131083);
          const discriminant = parseExpression(state, context);
          expect(state, context, 16);
          expect(state, context, 131084);
          const cases = [];
          let seenDefault = false;
          const switchScope = createSubScope(scope, 3);
          const previousSwitchStatement = state.switchStatement;
          state.switchStatement = 1;
          while (state.token !== 536870927) {
              let test = null;
              if (optional(state, context, 20555)) {
                  test = parseExpression(state, context);
              }
              else {
                  expect(state, context, 20560);
                  if (seenDefault)
                      report(state, 0);
                  seenDefault = true;
              }
              cases.push(parseCaseOrDefaultClauses(state, context, test, switchScope));
          }
          state.switchStatement = previousSwitchStatement;
          expect(state, context, 536870927);
          return {
              type: 'SwitchStatement',
              discriminant,
              cases
          };
      }
      function parseReturnStatement(state, context) {
          if ((context & (64 | 134217728)) < 1)
              report(state, 55);
          next(state, context | 32768);
          const argument = (state.token & 536870912) < 1 && (state.flags & 1) < 1
              ? parseExpression(state, context & ~134217728)
              : null;
          consumeSemicolon(state, context);
          return {
              type: 'ReturnStatement',
              argument
          };
      }
      function parseWhileStatement(state, context, scope) {
          next(state, context);
          expect(state, context | 32768, 131083);
          const test = parseExpression(state, context);
          expect(state, context, 16);
          const previousIterationStatement = state.iterationStatement;
          state.iterationStatement = 1;
          const body = parseStatement(state, (context | 4096) ^ 4096, scope, 2);
          state.iterationStatement = previousIterationStatement;
          return {
              type: 'WhileStatement',
              test,
              body
          };
      }
      function parseContinueStatement(state, context) {
          next(state, context);
          let label = null;
          if (!(state.flags & 1) && state.token & 4096) {
              const tokenValue = state.tokenValue;
              label = parseIdentifier(state, context);
              validateContinueLabel(state, tokenValue);
          }
          consumeSemicolon(state, context);
          if (label === null && state.iterationStatement === 0 && state.switchStatement === 0) {
              report(state, 50);
          }
          return {
              type: 'ContinueStatement',
              label
          };
      }
      function parseBreakStatement(state, context) {
          next(state, context);
          let label = null;
          if (!(state.flags & 1) && state.token & 4096) {
              const tokenValue = state.tokenValue;
              label = parseIdentifier(state, context);
              validateBreakStatement(state, tokenValue);
          }
          else if (state.iterationStatement === 0 && state.switchStatement === 0) {
              report(state, 51);
          }
          consumeSemicolon(state, context);
          return {
              type: 'BreakStatement',
              label
          };
      }
      function parseWithStatement(state, context, scope) {
          if (context & 1024)
              report(state, 52);
          next(state, context);
          expect(state, context | 32768, 131083);
          const object = parseExpression(state, context);
          expect(state, context, 16);
          const body = parseStatement(state, (context | 4096) ^ 4096, scope, 2);
          return {
              type: 'WithStatement',
              object,
              body
          };
      }
      function parseDebuggerStatement(state, context) {
          next(state, context);
          consumeSemicolon(state, context);
          return {
              type: 'DebuggerStatement'
          };
      }
      function parseTryStatement(state, context, scope) {
          next(state, context);
          const block = parseBlockStatement(state, context, createSubScope(scope, 1));
          const handler = optional(state, context, 20556) ? parseCatchBlock(state, context, scope) : null;
          const finalizer = optional(state, context, 20565)
              ? parseBlockStatement(state, (context | 4096) ^ 4096, createSubScope(scope, 1))
              : null;
          if (!handler && !finalizer)
              report(state, 0);
          return {
              type: 'TryStatement',
              block,
              handler,
              finalizer
          };
      }
      function parseCatchBlock(state, context, scope) {
          let param = null;
          let secondScope = scope;
          if (optional(state, context, 131083)) {
              const catchScope = createSubScope(scope, 4);
              if (state.token === 16)
                  report(state, 0);
              param = parseBindingIdentifierOrPattern(state, context, catchScope, 1, 8, false);
              if (state.token === 8388637)
                  report(state, 0);
              if (checkIfExistInLexicalBindings(state, context, catchScope, 0, true))
                  report(state, 45, state.tokenValue);
              expect(state, context, 16);
              secondScope = createSubScope(catchScope, 1);
          }
          const body = parseBlockStatement(state, context, secondScope);
          return {
              type: 'CatchClause',
              param,
              body
          };
      }
      function parseDoWhileStatement(state, context, scope) {
          expect(state, context, 20561);
          const previousIterationStatement = state.iterationStatement;
          state.iterationStatement = 1;
          const body = parseStatement(state, (context | 4096) ^ 4096, scope, 2);
          state.iterationStatement = previousIterationStatement;
          expect(state, context, 20577);
          expect(state, context, 131083);
          const test = parseExpression(state, context);
          expect(state, context, 16);
          optional(state, context, 536870929);
          return {
              type: 'DoWhileStatement',
              body,
              test
          };
      }
      function parseCaseOrDefaultClauses(state, context, test, scope) {
          expect(state, context, 21);
          const consequent = [];
          while (state.token !== 20555 &&
              state.token !== 536870927 &&
              state.token !== 20560) {
              consequent.push(parseStatementListItem(state, (context | 4096) ^ 4096, scope));
          }
          return {
              type: 'SwitchCase',
              test,
              consequent
          };
      }
      function parseForStatement(state, context, scope) {
          next(state, context);
          const forAwait = context & 4194304 ? optional(state, context, 667757) : false;
          scope = createSubScope(scope, 2);
          expect(state, context, 131083);
          let init = null;
          let declarations = null;
          let test = null;
          let update = null;
          let right;
          let isPattern = false;
          if (state.token !== 536870929) {
              if ((state.token & 268435456) > 0) {
                  const kind = KeywordDescTable[state.token & 255];
                  if (optional(state, context, 268587079)) {
                      init = {
                          type: 'VariableDeclaration',
                          kind,
                          declarations: parseVariableDeclarationList(state, context | 8192, 2, 2, false, scope)
                      };
                  }
                  else if (state.token === 402821192) {
                      if (lookAheadOrScan(state, context, isLexical, false)) {
                          init = {
                              type: 'VariableDeclaration',
                              kind,
                              declarations: parseVariableDeclarationList(state, context, 4, 2, true, scope)
                          };
                      }
                      else {
                          isPattern = true;
                          init = acquireGrammar(state, context | 8192, 0, parseAssignmentExpression);
                      }
                  }
                  else if (optional(state, context, 402804809)) {
                      declarations = parseVariableDeclarationList(state, context, 8, 2, false, scope);
                      if (checkIfExistInLexicalBindings(state, context, scope, 0, true))
                          report(state, 45, state.tokenValue);
                      init = { type: 'VariableDeclaration', kind, declarations };
                  }
              }
              else {
                  isPattern = state.token === 131091 || state.token === 131084;
                  init = acquireGrammar(state, context | 8192, 0, parseAssignmentExpression);
              }
          }
          if (optional(state, context | 32768, 12402)) {
              if (state.inCatch)
                  report(state, 0);
              if (isPattern) {
                  if (!state.assignable || init.type === 'AssignmentExpression') {
                      report(state, 90);
                  }
                  reinterpret(state, init);
              }
              right = parseAssignmentExpression(state, context);
              expect(state, context, 16);
              const previousIterationStatement = state.iterationStatement;
              state.iterationStatement = 1;
              const body = parseStatement(state, (context | 4096) ^ 4096, scope, 2);
              state.iterationStatement = previousIterationStatement;
              return {
                  type: 'ForOfStatement',
                  body,
                  left: init,
                  right,
                  await: forAwait
              };
          }
          if (optional(state, context, 33707825)) {
              if (isPattern) {
                  if (!state.assignable || init.type === 'AssignmentExpression') {
                      report(state, 89);
                  }
                  reinterpret(state, init);
              }
              right = parseExpression(state, context);
              expect(state, context, 16);
              const previousIterationStatement = state.iterationStatement;
              state.iterationStatement = 1;
              const body = parseStatement(state, (context | 4096) ^ 4096, scope, 2);
              state.iterationStatement = previousIterationStatement;
              return {
                  type: 'ForInStatement',
                  body,
                  left: init,
                  right
              };
          }
          if (state.token === 18) {
              init = parseSequenceExpression(state, context, init);
          }
          expect(state, context, 536870929);
          if (state.token !== 536870929) {
              test = parseExpression(state, context);
          }
          expect(state, context, 536870929);
          if (state.token !== 16)
              update = parseExpression(state, context);
          expect(state, context, 16);
          const previousIterationStatement = state.iterationStatement;
          state.iterationStatement = 1;
          const body = parseStatement(state, (context | 4096) ^ 4096, scope, 2);
          state.iterationStatement = previousIterationStatement;
          return {
              type: 'ForStatement',
              body,
              init,
              test,
              update
          };
      }
      function parseExpressionOrLabelledStatement(state, context, scope, label) {
          const token = state.token;
          const tokenValue = state.tokenValue;
          const expr = parseExpression(state, context);
          if (token & 4096 && state.token === 21) {
              next(state, context | 32768);
              validateBindingIdentifier(state, context, 0, token);
              if (getLabel(state, `@${tokenValue}`, false, true)) {
                  report(state, 53, tokenValue);
              }
              addLabel(state, tokenValue);
              let body = null;
              if (state.token === 151639 &&
                  (context & 1024) === 0 &&
                  context & 16 &&
                  label === 1) {
                  body = parseFunctionDeclaration(state, context, scope, 1, false);
              }
              else
                  body = parseStatement(state, (context | 4096) ^ 4096, scope, label);
              state.labelDepth--;
              return {
                  type: 'LabeledStatement',
                  label: expr,
                  body
              };
          }
          consumeSemicolon(state, context);
          return {
              type: 'ExpressionStatement',
              expression: expr
          };
      }
      function parseBindingIdentifierOrPattern(state, context, scope, type, origin, verifyDuplicates) {
          switch (state.token) {
              case 131084:
                  return parserObjectAssignmentPattern(state, context, scope, type, origin, verifyDuplicates);
              case 131091:
                  return parseArrayAssignmentPattern(state, context, scope, type, origin, verifyDuplicates);
              default:
                  return parseBindingIdentifier(state, context, scope, type, origin, verifyDuplicates);
          }
      }
      function parseBindingIdentifier(state, context, scope, type, origin, checkForDuplicates) {
          const name = state.tokenValue;
          if (context & 1024) {
              if (nameIsArgumentsOrEval(name) || name === 'enum')
                  report(state, 0);
          }
          else if (name === 'enum')
              report(state, 0);
          validateBindingIdentifier(state, context, type);
          addVariable(state, context, scope, type, origin, checkForDuplicates, (origin === 1 || origin === 2 || origin === 4) &&
              type === 2
              ? true
              : false, name);
          if (origin === 4) {
              addToExportedNamesAndCheckForDuplicates(state, state.tokenValue);
              addToExportedBindings(state, state.tokenValue);
          }
          next(state, context | 32768);
          return {
              type: 'Identifier',
              name
          };
      }
      function parseAssignmentRestElement(state, context, scope, type, origin, verifyDuplicates) {
          expect(state, context, 14);
          const argument = parseBindingIdentifierOrPattern(state, context, scope, type, origin, verifyDuplicates);
          return {
              type: 'RestElement',
              argument
          };
      }
      function AssignmentRestProperty(state, context, scope, type, origin, verifyDuplicates) {
          expect(state, context, 14);
          const argument = parseBindingIdentifierOrPattern(state, context, scope, type, origin, verifyDuplicates);
          return {
              type: 'RestElement',
              argument
          };
      }
      function parseArrayAssignmentPattern(state, context, scope, type, origin, verifyDuplicates) {
          expect(state, context, 131091);
          const elements = [];
          while (state.token !== 20) {
              if (optional(state, context, 18)) {
                  elements.push(null);
              }
              else {
                  if (state.token === 14) {
                      elements.push(parseAssignmentRestElement(state, context, scope, type, origin, verifyDuplicates));
                      break;
                  }
                  else {
                      elements.push(parseBindingInitializer(state, context, scope, type, origin, verifyDuplicates));
                  }
                  if (state.token !== 20)
                      expect(state, context, 18);
              }
          }
          expect(state, context, 20);
          return {
              type: 'ArrayPattern',
              elements
          };
      }
      function parserObjectAssignmentPattern(state, context, scope, type, origin, verifyDuplicates) {
          const properties = [];
          expect(state, context, 131084);
          while (state.token !== 536870927) {
              if (state.token === 14) {
                  properties.push(AssignmentRestProperty(state, context, scope, type, origin, verifyDuplicates));
                  break;
              }
              properties.push(parseAssignmentProperty(state, context, scope, type, origin, verifyDuplicates));
              if (state.token !== 536870927)
                  expect(state, context, 18);
          }
          expect(state, context, 536870927);
          return {
              type: 'ObjectPattern',
              properties
          };
      }
      function parseAssignmentPattern(state, context, left) {
          return {
              type: 'AssignmentPattern',
              left,
              right: secludeGrammar(state, context, 0, parseAssignmentExpression)
          };
      }
      function parseBindingInitializer(state, context, scope, type, origin, verifyDuplicates) {
          const left = parseBindingIdentifierOrPattern(state, context, scope, type, origin, verifyDuplicates);
          return !optional(state, context, 8388637)
              ? left
              : {
                  type: 'AssignmentPattern',
                  left,
                  right: secludeGrammar(state, context, 0, parseAssignmentExpression)
              };
      }
      function parseComputedPropertyName(state, context) {
          expect(state, context, 131091);
          const key = secludeGrammar(state, context, 0, parseAssignmentExpression);
          expect(state, context, 20);
          return key;
      }
      function parseAssignmentProperty(state, context, scope, type, origin, verifyDuplicates) {
          const { token } = state;
          let key;
          let value;
          let computed = false;
          let shorthand = false;
          if (token & 4096) {
              key = parseBindingIdentifier(state, context, scope, type, origin, verifyDuplicates);
              shorthand = !optional(state, context, 21);
              if (shorthand) {
                  const hasInitializer = optional(state, context, 8388637);
                  value = hasInitializer ? parseAssignmentPattern(state, context, key) : key;
              }
              else
                  value = parseBindingInitializer(state, context, scope, type, origin, verifyDuplicates);
          }
          else {
              if (state.token === 131075 || state.token === 131074) {
                  key = parseLiteral(state, context, state.tokenValue);
              }
              else if (state.token === 131091) {
                  computed = true;
                  key = parseComputedPropertyName(state, context);
              }
              else
                  key = parseBindingIdentifier(state, context, scope, type, origin, verifyDuplicates);
              expect(state, context, 21);
              value = parseBindingInitializer(state, context, scope, type, origin, verifyDuplicates);
          }
          return {
              type: 'Property',
              kind: 'init',
              key,
              computed,
              value,
              method: false,
              shorthand
          };
      }
      function parseFunctionDeclaration(state, context, scope, origin, isAsync) {
          next(state, context);
          const isGenerator = (origin & 1) < 1 && optional(state, context, 21105203);
          let funcScope = createScope(1);
          let id = null;
          let firstRestricted;
          if (state.token & 274432) {
              validateBindingIdentifier(state, ((context | (2097152 | 4194304)) ^ (2097152 | 4194304)) |
                  (context & 1024
                      ? 2097152
                      : context & 2097152
                          ? 2097152
                          : 0 | (context & 2048)
                              ? 4194304
                              : context & 4194304
                                  ? 4194304
                                  : 0), context & 4096 && (context & 2048) < 1 ? 2 : 4);
              if (origin & 1) {
                  scope = createSubScope(scope, 1);
              }
              addFunctionName(state, context, scope, context & 4096 && (context & 2048) < 1 ? 2 : 4, origin, true);
              funcScope = createSubScope(funcScope, 1);
              firstRestricted = state.tokenValue;
              id = parseIdentifier(state, context);
          }
          else if (!(context & 512))
              report(state, 0);
          context =
              (context |
                  4194304 |
                  2097152 |
                  8388608 |
                  262144 |
                  524288 |
                  16777216) ^
                  (4194304 |
                      2097152 |
                      8388608 |
                      262144 |
                      524288 |
                      16777216);
          if (isAsync)
              context |= 4194304;
          if (isGenerator)
              context |= 2097152;
          const paramScoop = createSubScope(funcScope, 5);
          const params = parseFormalParameters(state, context | 67108864, paramScoop, 32, 0);
          const body = parseFunctionBody(state, context | 67108864, createSubScope(paramScoop, 1), firstRestricted, origin);
          return {
              type: 'FunctionDeclaration',
              params,
              body,
              async: (context & 4194304) > 0,
              generator: isGenerator,
              id
          };
      }
      function parseHostedClassDeclaration(state, context, scope, isNotDefault) {
          next(state, context);
          context = (context | 1024 | 16777216) ^ (1024 | 16777216);
          let id = null;
          let superClass = null;
          let name = '';
          if (state.token & 274432 && state.token !== 20564) {
              name = state.tokenValue;
              validateBindingIdentifier(state, context, 16);
              addVariableAndDeduplicate(state, context, scope, 4, 0, true, name);
              id = parseIdentifier(state, context);
          }
          if (isNotDefault)
              addToExportedNamesAndCheckForDuplicates(state, name);
          addToExportedBindings(state, name);
          if (optional(state, context, 20564)) {
              superClass = parseLeftHandSideExpression(state, context);
              context |= 524288;
          }
          else
              context = (context | 524288) ^ 524288;
          context |= 262144;
          const body = parseClassBodyAndElementList(state, context, 128);
          return {
              type: 'ClassDeclaration',
              id,
              superClass,
              body
          };
      }
      function parseHoistableFunctionDeclaration(state, context, scope, isNotDefault, isAsync) {
          next(state, context);
          const isGenerator = optional(state, context, 21105203);
          let funcScope = createScope(1);
          let id = null;
          let name = '';
          if (state.token & 274432) {
              name = state.tokenValue;
              validateBindingIdentifier(state, context, 4);
              addFunctionName(state, context, scope, 4, 0, true);
              funcScope = createSubScope(funcScope, 1);
              id = parseIdentifier(state, context);
          }
          if (isNotDefault)
              addToExportedNamesAndCheckForDuplicates(state, name);
          addToExportedBindings(state, name);
          context =
              (context | 4194304 | 2097152 | 8388608 | 262144) ^
                  (4194304 | 2097152 | 8388608 | 262144);
          if (isAsync)
              context |= 4194304;
          if (isGenerator)
              context |= 2097152;
          const paramScoop = createSubScope(funcScope, 5);
          const params = parseFormalParameters(state, context | 67108864, paramScoop, 32, 0);
          const body = parseFunctionBody(state, context | 67108864, createSubScope(paramScoop, 1), undefined, 0);
          return {
              type: 'FunctionDeclaration',
              params,
              body,
              async: (context & 4194304) > 0,
              generator: isGenerator,
              id
          };
      }
      function parseFormalParameters(state, context, scope, origin, objState) {
          expect(state, context, 131083);
          const params = [];
          state.flags &= ~64;
          context = context | 8388608;
          if (state.token === 18)
              report(state, 0);
          let hasComplexArgs = false;
          while (state.token !== 16) {
              if (state.token === 14) {
                  state.flags |= 64;
                  if (objState & 512)
                      report(state, 95);
                  params.push(parseRestElement(state, context, scope, 1, 0));
                  break;
              }
              if ((state.token & 405505) !== 405505)
                  state.flags |= 64;
              let left = parseBindingIdentifierOrPattern(state, context, scope, 1, origin, false);
              if (optional(state, context | 32768, 8388637)) {
                  state.flags |= 64;
                  if ((state.token & 405505) === 405505) {
                      hasComplexArgs = true;
                  }
                  else if (state.token & 2097152 && context & (1024 | 2097152))
                      report(state, 0);
                  left = parseAssignmentPattern(state, context, left);
              }
              params.push(left);
              if (optional(state, context, 18)) {
                  if (state.token === 18)
                      report(state, 0);
              }
          }
          if (objState & 512 && params.length !== 1) {
              report(state, 94, 'Setter', 'one', '');
          }
          if (objState & 256 && params.length > 0) {
              report(state, 94, 'Getter', 'no', 's');
          }
          expect(state, context, 16);
          if (hasComplexArgs || (context & (1024 | 33554432)) > 0) {
              validateFunctionArgs(state, scope.lex);
          }
          return params;
      }
      function parseRestElement(state, context, scope, type, origin) {
          expect(state, context, 14);
          const argument = parseBindingIdentifierOrPattern(state, context, scope, type, origin, false);
          return {
              type: 'RestElement',
              argument
          };
      }
      function parseFunctionBody(state, context, scope, firstRestricted, origin) {
          const body = [];
          expect(state, context, 131084);
          const isStrict = (context & 1024) === 1024;
          context = context | (4096 | 134217728);
          while (state.token === 131075) {
              if (state.tokenValue.length === 10 && state.tokenValue === 'use strict') {
                  if (state.flags & 64)
                      report(state, 61);
                  context |= 1024;
              }
              body.push(parseDirective(state, context, scope));
          }
          if (context & 1024) {
              if ((state.flags & 512) === 512)
                  report(state, 86);
              if (state.flags & 1024) {
                  report(state, 85);
              }
              if ((firstRestricted && firstRestricted === 'eval') || firstRestricted === 'arguments')
                  report(state, 61);
          }
          state.flags =
              (state.flags | (1024 | 512)) ^
                  (1024 | 512);
          if (!isStrict && (context & 1024) > 0)
              validateFunctionArgs(state, scope.lex['@']);
          if (state.token !== 536870927) {
              const previousSwitchStatement = state.switchStatement;
              const previousIterationStatement = state.iterationStatement;
              if ((state.iterationStatement & 1) === 1) {
                  state.iterationStatement = 2;
              }
              addCrossingBoundary(state);
              while (state.token !== 536870927) {
                  body.push(parseStatementListItem(state, context, scope));
              }
              state.labelDepth--;
              state.switchStatement = previousSwitchStatement;
              state.iterationStatement = previousIterationStatement;
          }
          expect(state, origin & 128 ? context | 32768 : context, 536870927);
          if (state.token === 8388637 || state.token === 131082)
              report(state, 0);
          return {
              type: 'BlockStatement',
              body
          };
      }
      function parseVariableStatement(state, context, type, origin, scope) {
          const { token } = state;
          next(state, context);
          const declarations = parseVariableDeclarationList(state, context, type, origin, false, scope);
          consumeSemicolon(state, context);
          return {
              type: 'VariableDeclaration',
              kind: KeywordDescTable[token & 255],
              declarations
          };
      }
      function parseLexicalDeclaration(state, context, type, origin, scope) {
          const { token } = state;
          next(state, context);
          const declarations = parseVariableDeclarationList(state, context, type, origin, false, scope);
          if (checkIfExistInLexicalBindings(state, context, scope, origin, false))
              report(state, 0);
          consumeSemicolon(state, context);
          return {
              type: 'VariableDeclaration',
              kind: KeywordDescTable[token & 255],
              declarations
          };
      }
      function parseVariableDeclarationList(state, context, type, origin, checkForDuplicates, scope) {
          let bindingCount = 1;
          const list = [parseVariableDeclaration(state, context, type, origin, checkForDuplicates, scope)];
          while (optional(state, context, 18)) {
              list.push(parseVariableDeclaration(state, context, type, origin, checkForDuplicates, scope));
              ++bindingCount;
          }
          if (origin & 2 && isInOrOf(state) && bindingCount > 1) {
              report(state, 104, KeywordDescTable[state.token & 255]);
          }
          return list;
      }
      function isInOrOf(state) {
          return state.token === 33707825 || state.token === 12402;
      }
      function parseVariableDeclaration(state, context, type, origin, checkForDuplicates, scope) {
          const isBinding = state.token === 131084 || state.token === 131091;
          const id = parseBindingIdentifierOrPattern(state, context, scope, type, origin, checkForDuplicates);
          let init = null;
          if (optional(state, context | 32768, 8388637)) {
              init = secludeGrammar(state, context, 0, parseAssignmentExpression);
              if (isInOrOf(state) && (origin & 2 || isBinding)) {
                  if ((type & 2) < 1 ||
                      ((context & 16) === 0 || context & 1024) ||
                      isBinding) {
                      report(state, 102);
                  }
              }
          }
          else if ((type & 8 || isBinding) && !isInOrOf(state)) {
              report(state, 103, type & 8 ? 'const' : 'destructuring');
          }
          return {
              type: 'VariableDeclarator',
              init,
              id
          };
      }
      function parseExpression(state, context) {
          const expr = secludeGrammar(state, context, 0, parseAssignmentExpression);
          if (state.token !== 18)
              return expr;
          return parseSequenceExpression(state, context, expr);
      }
      function parseSequenceExpression(state, context, left) {
          const expressions = [left];
          while (optional(state, context | 32768, 18)) {
              expressions.push(secludeGrammar(state, context, 0, parseAssignmentExpression));
          }
          return {
              type: 'SequenceExpression',
              expressions
          };
      }
      function parseYieldExpression(state, context) {
          if (context & 8388608) {
              report(state, 106);
          }
          expect(state, context | 32768, 2265194);
          let argument = null;
          let delegate = false;
          if ((state.flags & 1) < 1) {
              delegate = optional(state, context, 21105203);
              if (state.token & 131072 || delegate) {
                  argument = parseAssignmentExpression(state, context);
              }
          }
          return {
              type: 'YieldExpression',
              argument,
              delegate
          };
      }
      function parseAssignmentExpression(state, context) {
          const { token, tokenValue } = state;
          if (token & 2097152 && context & 2097152)
              return parseYieldExpression(state, context);
          const expr = acquireGrammar(state, context, 0, parseBinaryExpression);
          if (token & 1048576 &&
              (state.flags & 1) < 1 &&
              ((state.token & 274432) === 274432 || (state.token & 2097152) === 2097152)) {
              const scope = createScope(5);
              addVariableAndDeduplicate(state, context, scope, 1, 0, true, state.tokenValue);
              const arg = parseIdentifier(state, context);
              if (state.flags & 1)
                  report(state, 0);
              return parseArrowFunctionExpression(state, context, scope, [arg], true, 64);
          }
          if (state.token === 131082) {
              let { type, scope: arrowScope, params } = expr;
              if (type & (2 | 4)) {
                  if (state.flags & 1)
                      report(state, 0);
                  state.pendingCoverInitializeError = null;
                  state.bindable = state.assignable = false;
              }
              else {
                  if ((token & 36864) === 36864) {
                      state.flags |= 512;
                  }
                  else if (tokenValue === 'eval' || tokenValue === 'arguments') {
                      if (context & 1024)
                          report(state, 85);
                      state.flags |= 1024;
                  }
                  arrowScope = createScope(5);
                  params = [expr];
                  type = 64;
                  addVariableAndDeduplicate(state, context, arrowScope, 1, 0, true, tokenValue);
              }
              return parseArrowFunctionExpression(state, context, arrowScope, params, (type & 4) > 0, type);
          }
          if ((state.token & 8388608) === 8388608) {
              if (context & 1024 && nameIsArgumentsOrEval(expr.name)) {
                  report(state, 0);
              }
              else if (state.token === 8388637) {
                  if (!state.assignable)
                      report(state, 84);
                  reinterpret(state, expr);
              }
              else {
                  if (!state.assignable || !isValidSimpleAssignmentTarget(expr))
                      report(state, 84);
                  state.bindable = state.assignable = false;
              }
              const operator = state.token;
              next(state, context | 32768);
              const right = secludeGrammar(state, context, 0, parseAssignmentExpression);
              state.pendingCoverInitializeError = null;
              return {
                  type: 'AssignmentExpression',
                  left: expr,
                  operator: KeywordDescTable[operator & 255],
                  right
              };
          }
          return parseConditionalExpression(state, context, expr);
      }
      function parseConditionalExpression(state, context, test) {
          if (!optional(state, context | 32768, 22))
              return test;
          const consequent = secludeGrammar(state, context, 0, parseAssignmentExpression);
          expect(state, context | 32768, 21);
          const alternate = secludeGrammar(state, context, 0, parseAssignmentExpression);
          state.bindable = state.assignable = false;
          return {
              type: 'ConditionalExpression',
              test,
              consequent,
              alternate
          };
      }
      function parseBinaryExpression(state, context, minPrec, left = parseUnaryExpression(state, context)) {
          const bit = -((context & 8192) > 0) & 33707825;
          let t;
          let prec;
          while (state.token & 16908288) {
              t = state.token;
              prec = t & 3840;
              if (prec + ((t === 16911158) << 8) - ((bit === t) << 12) <= minPrec)
                  break;
              next(state, context | 32768);
              left = {
                  type: t & 65536 ? 'LogicalExpression' : 'BinaryExpression',
                  left,
                  right: secludeGrammar(state, context, prec, parseBinaryExpression),
                  operator: KeywordDescTable[t & 255]
              };
              state.assignable = state.bindable = false;
          }
          return left;
      }
      function parseAwaitExpression(state, context) {
          next(state, context | 32768);
          return {
              type: 'AwaitExpression',
              argument: parseUnaryExpression(state, context)
          };
      }
      function parseUnaryExpression(state, context) {
          if ((state.token & 33685504) === 33685504) {
              const unaryOperator = state.token;
              next(state, context | 32768);
              const argument = secludeGrammar(state, context, 0, parseUnaryExpression);
              if (state.token === 16911158)
                  report(state, 57);
              if (context & 1024 && (unaryOperator & 33706027) === 33706027) {
                  if (argument.type === 'Identifier') {
                      report(state, 56);
                  }
                  else if (context & 1 && state.flags & 128) {
                      report(state, 82);
                  }
              }
              state.bindable = state.assignable = false;
              return {
                  type: 'UnaryExpression',
                  operator: KeywordDescTable[unaryOperator & 255],
                  argument,
                  prefix: true
              };
          }
          return context & 4194304 && state.token & 524288
              ? parseAwaitExpression(state, context)
              : parseUpdateExpression(state, context);
      }
      function parseUpdateExpression(state, context) {
          const { token } = state;
          if ((state.token & 67239936) === 67239936) {
              next(state, context | 32768);
              const expr = parseLeftHandSideExpression(state, context);
              if (context & 1024 && (expr.name === 'eval' || expr.name === 'arguments')) {
                  report(state, 83, 'Prefix');
              }
              if (!state.assignable)
                  report(state, 84);
              state.bindable = state.assignable = false;
              return {
                  type: 'UpdateExpression',
                  argument: expr,
                  operator: KeywordDescTable[token & 255],
                  prefix: true
              };
          }
          const expression = parseLeftHandSideExpression(state, context);
          if ((state.token & 67239936) === 67239936 && (state.flags & 1) < 1) {
              if (context & 1024 && (expression.name === 'eval' || expression.name === 'arguments')) {
                  report(state, 83, 'PostFix');
              }
              if (!state.assignable)
                  report(state, 84);
              const operator = state.token;
              next(state, context | 32768);
              state.bindable = state.assignable = false;
              return {
                  type: 'UpdateExpression',
                  argument: expression,
                  operator: KeywordDescTable[operator & 255],
                  prefix: false
              };
          }
          return expression;
      }
      function parseLeftHandSideExpression(state, context) {
          const expr = context & 1 && state.token === 151641
              ? parseCallImportOrMetaProperty(state, context)
              : state.token === 151644
                  ? parseSuperExpression(state, context)
                  : parseMemberExpression(state, context, parsePrimaryExpression(state, context));
          return parseCallExpression(state, context, expr);
      }
      function parseCallExpression(state, context, callee) {
          const scope = state.bindable && callee.name === 'async' ? createScope(1) : null;
          const { flags } = state;
          while (true) {
              callee = parseMemberExpression(state, context, callee);
              if (state.token !== 131083)
                  return callee;
              expect(state, context | 32768, 131083);
              let seenSpread = false;
              let spreadCount = 0;
              const params = [];
              while (state.token !== 16) {
                  if (state.token === 14) {
                      params.push(parseSpreadElement(state, context));
                      seenSpread = true;
                  }
                  else {
                      params.push(secludeGrammar(state, context, 0, parseAsyncArgument));
                  }
                  if (state.token === 16)
                      break;
                  expect(state, context | 32768, 18);
                  state.assignable = false;
                  if (seenSpread)
                      spreadCount++;
              }
              expect(state, context, 16);
              if (state.token === 131082) {
                  if (flags & 1)
                      report(state, 0);
                  if (!state.bindable)
                      report(state, 0);
                  state.bindable = state.assignable = false;
                  if (spreadCount > 0)
                      report(state, 92);
                  state.bindable = false;
                  return {
                      type: 4,
                      scope,
                      params
                  };
              }
              state.bindable = state.assignable = false;
              callee = {
                  type: 'CallExpression',
                  callee,
                  arguments: params
              };
          }
      }
      function parseCallImportOrMetaProperty(state, context) {
          const id = parseIdentifier(state, context);
          if (optional(state, context, 13)) {
              if (context & 2048 && state.tokenValue === 'meta')
                  return parseMetaProperty(state, context, id);
              report(state, 1, KeywordDescTable[state.token & 255]);
          }
          const expr = parseImportExpression();
          return parseCallExpression(state, context, expr);
      }
      function parseImportExpression() {
          return {
              type: 'Import'
          };
      }
      function parseMetaProperty(state, context, id) {
          return {
              meta: id,
              type: 'MetaProperty',
              property: parseIdentifier(state, context)
          };
      }
      function parseSuperExpression(state, context) {
          next(state, context);
          state.assignable = state.bindable = false;
          switch (state.token) {
              case 131083:
                  if ((context & 524288) < 1)
                      report(state, 58);
                  break;
              case 131091:
              case 13:
                  if ((context & 262144) < 1)
                      report(state, 59);
                  state.assignable = true;
                  break;
              default:
                  report(state, 1, 'super');
          }
          return { type: 'Super' };
      }
      function parseIdentifierNameOrPrivateName(state, context) {
          if (!optional(state, context, 119))
              return parseIdentifierName(state, context);
          state.flags |= 128;
          return {
              type: 'PrivateName',
              name: state.tokenValue
          };
      }
      function parseIdentifierName(state, context) {
          if ((state.token & (274432 | 4096)) !== 274432 &&
              (state.token & 4096) !== 4096)
              report(state, 0);
          return parseIdentifier(state, context);
      }
      function parseMemberExpression(state, context, expr) {
          while (true) {
              switch (state.token) {
                  case 13:
                      next(state, context);
                      state.bindable = false;
                      state.assignable = true;
                      expr = {
                          type: 'MemberExpression',
                          object: expr,
                          computed: false,
                          property: context & 1
                              ? parseIdentifierNameOrPrivateName(state, context)
                              : parseIdentifierName(state, context)
                      };
                      continue;
                  case 131091:
                      next(state, context | 32768);
                      state.bindable = false;
                      state.assignable = true;
                      expr = {
                          type: 'MemberExpression',
                          object: expr,
                          computed: true,
                          property: parseExpression(state, context)
                      };
                      expect(state, context, 20);
                      break;
                  case 131081:
                      state.bindable = state.assignable = false;
                      expr = {
                          type: 'TaggedTemplateExpression',
                          tag: expr,
                          quasi: parseTemplateLiteral(state, context)
                      };
                      break;
                  case 131080:
                      state.bindable = state.assignable = false;
                      expr = {
                          type: 'TaggedTemplateExpression',
                          tag: expr,
                          quasi: parseTemplate(state, context | 65536)
                      };
                      break;
                  default:
                      return expr;
              }
          }
      }
      function parseTemplateLiteral(parser, context) {
          return {
              type: 'TemplateLiteral',
              expressions: [],
              quasis: [parseTemplateTail(parser, context)]
          };
      }
      function parseTemplateSpans(state, tail) {
          return {
              type: 'TemplateElement',
              value: {
                  cooked: state.tokenValue,
                  raw: state.tokenRaw
              },
              tail
          };
      }
      function parseTemplate(state, context) {
          const quasis = [parseTemplateSpans(state, false)];
          expect(state, context | 32768, 131080);
          const expressions = [parseExpression(state, context)];
          while ((state.token = scanTemplateTail(state, context)) !== 131081) {
              quasis.push(parseTemplateSpans(state, false));
              expect(state, context | 32768, 131080);
              expressions.push(parseExpression(state, context));
          }
          quasis.push(parseTemplateSpans(state, true));
          state.assignable = state.bindable = false;
          next(state, context);
          return {
              type: 'TemplateLiteral',
              expressions,
              quasis
          };
      }
      function parseTemplateTail(state, context) {
          const { tokenValue, tokenRaw } = state;
          expect(state, context | 32768, 131081);
          return {
              type: 'TemplateElement',
              value: {
                  cooked: tokenValue,
                  raw: tokenRaw
              },
              tail: true
          };
      }
      function parseArgumentList(state, context) {
          expect(state, context | 32768, 131083);
          const expressions = [];
          while (state.token !== 16) {
              if (state.token === 14) {
                  expressions.push(parseSpreadElement(state, context));
                  if (state.token === 16)
                      break;
                  expect(state, context, 18);
                  continue;
              }
              else {
                  expressions.push(secludeGrammar(state, context, 0, parseAssignmentExpression));
              }
              if (!optional(state, context | 32768, 18))
                  break;
          }
          expect(state, context, 16);
          return expressions;
      }
      function parseSpreadElement(state, context) {
          expect(state, context | 32768, 14);
          const argument = acquireGrammar(state, context, 0, parseAssignmentExpression);
          return {
              type: 'SpreadElement',
              argument
          };
      }
      function parseAsyncArgument(state, context) {
          const arg = parseAssignmentExpression(state, context);
          state.pendingCoverInitializeError = null;
          return arg;
      }
      function parseNewExpression(state, context) {
          const id = parseIdentifier(state, context | 32768);
          if (optional(state, context, 13)) {
              return (context & 67108864) < 1 || state.tokenValue !== 'target'
                  ? report(state, 0)
                  : parseMetaProperty(state, context, id);
          }
          let callee;
          if (context & 1 && state.token === 151641) {
              if (lookAheadOrScan(state, context, nextTokenIsLeftParen, true))
                  report(state, 1, KeywordDescTable[state.token & 255]);
              callee = parseCallImportOrMetaProperty(state, context);
          }
          else {
              callee = secludeGrammar(state, context, 0, parseMemberExpressionOrHigher);
          }
          return {
              type: 'NewExpression',
              callee,
              arguments: state.token === 131083 ? parseArgumentList(state, context) : []
          };
      }
      function parseMemberExpressionOrHigher(state, context) {
          return parseMemberExpression(state, context, parsePrimaryExpression(state, context));
      }
      function parsePrimaryExpression(state, context) {
          switch (state.token) {
              case 131074:
              case 131075:
                  state.bindable = state.assignable = false;
                  return parseLiteral(state, context, state.tokenValue);
              case 116:
                  state.bindable = state.assignable = false;
                  return parseBigIntLiteral(state, context);
              case 131076:
                  state.bindable = state.assignable = false;
                  return parseRegularExpressionLiteral(state, context);
              case 151558:
              case 151557:
                  state.bindable = state.assignable = false;
                  return parseLiteral(state, context, state.tokenValue === 'true');
              case 151559:
                  state.bindable = state.assignable = false;
                  return parseLiteral(state, context, null);
              case 151646:
                  state.bindable = state.assignable = false;
                  return parseThisExpression(state, context);
              case 131091:
                  return parseArrayLiteral(state, context & ~8192);
              case 131083:
                  return parseParenthesizedExpression(state, context);
              case 131084:
                  return parseObjectLiteral(state, context & ~8192, -1, 0);
              case 151639:
                  state.bindable = state.assignable = false;
                  return parseFunctionExpression(state, context, false);
              case 151629:
                  state.bindable = state.assignable = false;
                  return parseClassExpression(state, context);
              case 131081:
                  state.bindable = state.assignable = false;
                  return parseTemplateLiteral(state, context);
              case 131080:
                  state.bindable = state.assignable = false;
                  return parseTemplate(state, context);
              case 151642:
                  state.bindable = state.assignable = false;
                  return parseNewExpression(state, context);
              case 151644:
                  state.bindable = state.assignable = false;
                  return parseSuperExpression(state, context);
              case 119:
                  state.bindable = state.assignable = false;
                  return parseIdentifierNameOrPrivateName(state, context);
              case 1060972: {
                  if (lookAheadOrScan(state, context, nextTokenIsFuncKeywordOnSameLine, false)) {
                      state.bindable = state.assignable = false;
                      return parseFunctionExpression(state, context, true);
                  }
                  return parseIdentifier(state, context);
              }
              case 402821192: {
                  if (context & 1024)
                      report(state, 86);
                  next(state, context);
                  if (state.flags & 1 && state.token === 131091) {
                      report(state, 97);
                  }
                  return context & 8
                      ? {
                          type: 'Identifier',
                          name: 'let',
                          raw: 'let'
                      }
                      : {
                          type: 'Identifier',
                          name: 'let'
                      };
              }
              case 20561:
                  return parseDoExpression(state, context);
              case 2265194:
                  if (context & (2097152 | 1024)) {
                      report(state, 67, KeywordDescTable[state.token & 255]);
                  }
              default:
                  if (isValidIdentifier(context, state.token)) {
                      return parseIdentifier(state, context | 65536);
                  }
                  report(state, 0);
          }
      }
      function parseDoExpression(state, context) {
          if ((context & 128) < 1)
              report(state, 91);
          expect(state, context, 20561);
          return {
              type: 'DoExpression',
              body: parseBlockStatement(state, context, createScope(1))
          };
      }
      function parseArrayLiteral(state, context) {
          next(state, context | 32768);
          const elements = [];
          while (state.token !== 20) {
              if (optional(state, context, 18)) {
                  elements.push(null);
                  if (state.token === 131091) {
                      break;
                  }
              }
              else if (state.token === 14) {
                  expect(state, context | 32768, 14);
                  const argument = acquireGrammar(state, context, 0, parseAssignmentExpression);
                  if (!state.assignable && state.pendingCoverInitializeError)
                      report(state, 0);
                  if (argument.type !== 'ArrayExpression' &&
                      argument.type !== 'ObjectExpression' &&
                      !isValidSimpleAssignmentTarget(argument)) {
                      state.bindable = state.assignable = false;
                  }
                  elements.push({
                      type: 'SpreadElement',
                      argument
                  });
                  if (state.token !== 20) {
                      state.bindable = state.assignable = false;
                      expect(state, context, 18);
                  }
              }
              else {
                  elements.push(acquireGrammar(state, context, 0, parseAssignmentExpression));
                  if (optional(state, context, 18)) {
                      if (state.token === 20) {
                          break;
                      }
                  }
                  else {
                      break;
                  }
              }
          }
          expect(state, context, 20);
          return {
              type: 'ArrayExpression',
              elements
          };
      }
      function parseFunctionExpression(state, context, isAsync) {
          expect(state, context, 151639);
          const isGenerator = optional(state, context, 21105203);
          let functionScope = createScope(1);
          let id = null;
          let firstRestricted;
          if (state.token & 274432) {
              validateBindingIdentifier(state, ((context | (2097152 | 4194304)) ^ (2097152 | 4194304)) |
                  (context & 1024 ? 2097152 : isGenerator ? 2097152 : 0) |
                  (context & 2048 ? 4194304 : isAsync ? 4194304 : 0), 2);
              addVariableAndDeduplicate(state, context, functionScope, 2, 0, true, state.tokenValue);
              functionScope = createSubScope(functionScope, 1);
              firstRestricted = state.tokenValue;
              id = parseIdentifier(state, context);
          }
          context =
              (context |
                  4194304 |
                  2097152 |
                  8388608 |
                  262144 |
                  524288 |
                  16777216) ^
                  (4194304 |
                      2097152 |
                      8388608 |
                      262144 |
                      524288 |
                      16777216);
          if (isAsync)
              context |= 4194304;
          if (isGenerator)
              context |= 2097152;
          const paramScoop = createSubScope(functionScope, 5);
          const params = parseFormalParameters(state, context | 67108864, paramScoop, 32, 0);
          const body = parseFunctionBody(state, context | 67108864, createSubScope(paramScoop, 1), firstRestricted, 0);
          return {
              type: 'FunctionExpression',
              params,
              body,
              async: isAsync,
              generator: isGenerator,
              id
          };
      }
      function parseArrowFunctionExpression(state, context, scope, params, isAsync, type) {
          if (type & 64) {
              expect(state, context | 32768, 131082);
          }
          else {
              expect(state, context, 131082);
              for (let i = 0; i < params.length; ++i)
                  reinterpret(state, params[i]);
          }
          if (state.flags & 1)
              report(state, 0);
          if (checkIfExistInLexicalBindings(state, context, scope, 0, true))
              report(state, 41);
          context =
              (context | 4194304 | 2097152 | 8388608) ^
                  (4194304 | 2097152 | 8388608);
          if (isAsync)
              context |= 4194304;
          const expression = state.token !== 131084;
          const body = expression
              ? secludeGrammar(state, context, 0, parseAssignmentExpression)
              : parseFunctionBody(state, context, createSubScope(scope, 1), state.tokenValue, 0);
          return {
              type: 'ArrowFunctionExpression',
              body,
              params,
              id: null,
              async: isAsync,
              expression
          };
      }
      function parseParenthesizedExpression(state, context) {
          expect(state, context | 32768, 131083);
          const scope = createScope(5);
          if (optional(state, context, 16)) {
              if (state.token !== 131082)
                  report(state, 0);
              state.assignable = state.bindable = false;
              return {
                  type: 2,
                  scope,
                  params: []
              };
          }
          else if (state.token === 14) {
              const rest = parseRestElement(state, context, scope, 1, 0);
              expect(state, context, 16);
              if (state.token !== 131082)
                  report(state, 0);
              state.assignable = state.bindable = false;
              return {
                  type: 2,
                  scope,
                  params: [rest]
              };
          }
          let expr = acquireGrammar(state, context, 0, parseAssignmentExpression);
          let isSequence = false;
          if (state.token === 18) {
              state.assignable = false;
              isSequence = true;
              const params = [expr];
              while (optional(state, context | 32768, 18)) {
                  if (optional(state, context, 16)) {
                      if (state.token !== 131082)
                          report(state, 0);
                      return {
                          type: 2,
                          scope,
                          params: params
                      };
                  }
                  state.assignable = false;
                  if (state.token === 14) {
                      if (!state.bindable)
                          report(state, 0);
                      const restElement = parseRestElement(state, context, scope, 1, 0);
                      expect(state, context, 16);
                      if (state.token !== 131082)
                          report(state, 0);
                      state.bindable = false;
                      params.push(restElement);
                      return {
                          type: 2,
                          scope,
                          params: params
                      };
                  }
                  else if (optional(state, context, 16)) {
                      if (state.token !== 131082)
                          report(state, 0);
                      return {
                          type: 2,
                          scope,
                          params: params
                      };
                  }
                  else {
                      params.push(acquireGrammar(state, context, 0, parseAssignmentExpression));
                  }
              }
              expr = {
                  type: 'SequenceExpression',
                  expressions: params
              };
          }
          expect(state, context, 16);
          if ((state.flags & 1) < 1 && state.token === 131082) {
              if (!state.bindable)
                  report(state, 88);
              state.bindable = false;
              return {
                  type: 2,
                  scope,
                  params: isSequence ? expr.expressions : [expr],
                  async: false
              };
          }
          state.bindable = false;
          if (!isValidSimpleAssignmentTarget(expr))
              state.assignable = false;
          return expr;
      }
      function parseClassDeclaration(state, context, scope) {
          next(state, context);
          context = (context | 1024 | 16777216) ^ 16777216;
          let id = null;
          let superClass = null;
          if (state.token & 274432 && state.token !== 20564) {
              validateBindingIdentifier(state, context | 1024, 16);
              addVariableAndDeduplicate(state, context, scope, 4, 0, true, state.tokenValue);
              id = parseIdentifier(state, context);
          }
          else if (!(context & 512))
              report(state, 0);
          if (optional(state, context, 20564)) {
              superClass = secludeGrammar(state, context, 0, parseLeftHandSideExpression);
              context |= 524288;
          }
          else
              context = (context | 524288) ^ 524288;
          context |= 262144;
          const body = parseClassBodyAndElementList(state, context | 1024, 128);
          return {
              type: 'ClassDeclaration',
              id,
              superClass,
              body
          };
      }
      function parseClassExpression(state, context) {
          next(state, context);
          context = (context | (1024 | 16777216)) ^ (1024 | 16777216);
          let id = null;
          let superClass = null;
          if (state.token & 274432 && state.token !== 20564) {
              validateBindingIdentifier(state, context | 1024, 16);
              addVariable(state, context, -1, 4, 0, false, false, state.tokenValue);
              id = parseIdentifier(state, context);
          }
          if (optional(state, context, 20564)) {
              superClass = secludeGrammar(state, context, 0, parseLeftHandSideExpression);
              context |= 524288;
          }
          else
              context = (context | 524288) ^ 524288;
          context |= 262144;
          const body = parseClassBodyAndElementList(state, context | 1024, 0);
          return {
              type: 'ClassExpression',
              id,
              superClass,
              body
          };
      }
      function parseClassBodyAndElementList(state, context, origin) {
          expect(state, context | 32768, 131084);
          const body = [];
          while (state.token !== 536870927) {
              if (optional(state, context, 536870929))
                  continue;
              body.push(parseClassElementList(state, context, 0));
          }
          expect(state, origin & 128 ? context | 32768 : context, 536870927);
          state.flags &= ~2048;
          return {
              type: 'ClassBody',
              body
          };
      }
      function parseClassElementList(state, context, modifier) {
          let key;
          let { token, tokenValue } = state;
          if (state.token & 274432) {
              key = parseIdentifier(state, context);
              switch (token) {
                  case 36969:
                      if ((modifier & 32) === 0 && state.token !== 131083) {
                          return parseClassElementList(state, context, 32);
                      }
                      break;
                  case 1060972:
                      if (state.token !== 131083 && (state.flags & 1) === 0) {
                          if (optional(state, context, 21105203))
                              modifier |= 8;
                          tokenValue = state.tokenValue;
                          if (state.token & 274432) {
                              key = parseIdentifier(state, context);
                              if (state.flags & 1)
                                  report(state, 0);
                          }
                          else if (state.token === 131074 || state.token === 131075) {
                              key = parseLiteral(state, context, state.tokenValue);
                          }
                          else if (state.token === 131091) {
                              modifier |= 2;
                              key = parseComputedPropertyName(state, context);
                          }
                          else {
                              report(state, 0);
                          }
                          modifier |= 16;
                      }
                      break;
                  case 12399:
                      if (state.token !== 131083) {
                          tokenValue = state.tokenValue;
                          if (state.token & 274432) {
                              key = parseIdentifier(state, context);
                          }
                          else if (state.token === 131074 || state.token === 131075) {
                              key = parseLiteral(state, context, state.tokenValue);
                          }
                          else if (state.token === 131091) {
                              modifier |= 2;
                              key = parseComputedPropertyName(state, context);
                          }
                          else {
                              report(state, 0);
                          }
                          modifier |= 256;
                      }
                      break;
                  case 12400:
                      if (state.token !== 131083) {
                          tokenValue = state.tokenValue;
                          if (state.token & 274432) {
                              key = parseIdentifier(state, context);
                          }
                          else if (state.token === 131074 || state.token === 131075) {
                              key = parseLiteral(state, context, state.tokenValue);
                          }
                          else if (state.token === 131091) {
                              modifier |= 2;
                              key = parseComputedPropertyName(state, context);
                          }
                          else {
                              report(state, 0);
                          }
                          modifier |= 512;
                      }
                      break;
                  default:
              }
          }
          else if (state.token === 131091) {
              modifier |= 2;
              key = parseComputedPropertyName(state, context);
          }
          else if (state.token === 131074 || state.token === 131075) {
              if (state.tokenValue === 'constructor')
                  modifier |= 64;
              key = parseLiteral(state, context, state.tokenValue);
          }
          else if (state.token === 21105203) {
              next(state, context);
              tokenValue = state.tokenValue;
              if (state.token & 274432) {
                  key = parseIdentifier(state, context);
              }
              else if (state.token === 131074 || state.token === 131075) {
                  key = parseLiteral(state, context, state.tokenValue);
              }
              else if (state.token === 131091) {
                  modifier |= 2;
                  key = parseComputedPropertyName(state, context);
              }
              else {
                  report(state, 0);
              }
              modifier |= 8;
          }
          else if (state.token === 536870929) {
              next(state, context);
          }
          else {
              report(state, 1, KeywordDescTable[state.token & 255]);
          }
          if ((modifier & 2) === 0 &&
              modifier & (32 | 768) &&
              state.tokenValue === 'prototype') {
              report(state, 62);
          }
          if (tokenValue === 'constructor') {
              if ((modifier & 32) === 0) {
                  if (modifier & (768 | 16 | 8))
                      report(state, 63, 'accessor');
                  if ((context & 524288) === 0 && (modifier & 2) === 0) {
                      if (state.flags & 2048)
                          report(state, 60);
                      else
                          state.flags |= 2048;
                  }
              }
              modifier |= 64;
          }
          if (state.token !== 131083)
              report(state, 0);
          return {
              type: 'MethodDefinition',
              kind: (modifier & 32) === 0 && modifier & 64
                  ? 'constructor'
                  : modifier & 256
                      ? 'get'
                      : modifier & 512
                          ? 'set'
                          : 'method',
              static: (modifier & 32) !== 0,
              computed: (modifier & 2) !== 0,
              key,
              value: parseMethodDeclaration(state, context, modifier)
          };
      }
      function parseObjectLiteral(state, context, scope, type) {
          next(state, context);
          let key = null;
          let token = state.token;
          let tokenValue = state.tokenValue;
          let value;
          let hasProto = false;
          const properties = [];
          let objState = 0;
          const { assignable, bindable, pendingCoverInitializeError } = state;
          state.bindable = true;
          state.assignable = true;
          state.pendingCoverInitializeError = null;
          while (state.token !== 536870927) {
              if (state.token === 14) {
                  properties.push(parseSpreadElement(state, context));
              }
              else {
                  if (state.token & 274432) {
                      token = state.token;
                      tokenValue = state.tokenValue;
                      objState = 0;
                      key = parseIdentifier(state, context);
                      const newLine = (state.flags & 1) > 0;
                      if (state.token === 18 ||
                          state.token === 536870927 ||
                          state.token === 8388637) {
                          objState |= 4;
                          if (tokenValue !== 'eval' || tokenValue !== 'arguments')
                              validateBindingIdentifier(state, context, type, token);
                          addVariable(state, context, scope, type, 0, false, false, tokenValue);
                          if (state.token === 8388637) {
                              state.pendingCoverInitializeError = 87;
                              expect(state, context, 8388637);
                              value = parseAssignmentPattern(state, context, key);
                          }
                          else {
                              value = key;
                          }
                      }
                      else if (optional(state, context | 32768, 21)) {
                          if (tokenValue === '__proto__') {
                              if (hasProto) {
                                  state.pendingCoverInitializeError = 87;
                              }
                              else
                                  hasProto = true;
                          }
                          if ((state.token & 274432) > 0)
                              addVariable(state, context, scope, type, 0, false, false, tokenValue);
                          value = acquireGrammar(state, context, 0, parseAssignmentExpression);
                      }
                      else if (state.token === 131091) {
                          key = parseComputedPropertyName(state, context);
                          if (token === 1060972) {
                              if (newLine)
                                  report(state, 0);
                              objState |= 16 | 2 | 1;
                          }
                          else {
                              if (token === 12399)
                                  objState = (objState & ~512) | 256;
                              else if ((token & 12400) === 12400)
                                  objState = (objState & ~256) | 512;
                              objState |= 2 & ~1;
                          }
                          if (state.token !== 131083)
                              report(state, 0);
                          state.bindable = state.assignable = false;
                          value = parseMethodDeclaration(state, context, objState);
                      }
                      else if (state.token === 131083) {
                          objState = objState | (1 & ~(16 | 8));
                          state.bindable = state.assignable = false;
                          value = parseMethodDeclaration(state, context, objState);
                      }
                      else {
                          if (optional(state, context, 21105203))
                              objState |= 8;
                          if ((state.token & 274432) > 0) {
                              key = parseIdentifier(state, context);
                              if (state.token !== 131083)
                                  report(state, 0);
                              if (token === 1060972) {
                                  if (newLine)
                                      report(state, 0);
                                  objState |= 16 | 1;
                              }
                              else if (token === 12399) {
                                  objState = (objState & ~512) | 256;
                              }
                              else if (token === 12400) {
                                  objState = (objState & ~256) | 512;
                              }
                              state.bindable = state.assignable = false;
                              value = parseMethodDeclaration(state, context, objState);
                          }
                          else if (state.token === 131074 || state.token === 131075) {
                              key = parseLiteral(state, context, state.tokenValue);
                              if (state.token !== 131083)
                                  report(state, 0);
                              if (token === 1060972) {
                                  if (newLine)
                                      report(state, 0);
                                  objState |= 16 | 1;
                              }
                              else if (token === 12399) {
                                  objState = (objState & ~512) | 256;
                              }
                              else if (token === 12400) {
                                  objState = (objState & ~256) | 512;
                              }
                              state.bindable = state.assignable = false;
                              value = parseMethodDeclaration(state, context, objState);
                          }
                          else if (state.token === 131091) {
                              if (token === 1060972) {
                                  if (newLine)
                                      report(state, 0);
                                  objState |= 16 | 1;
                              }
                              else if (token === 12399) {
                                  objState = (objState & ~512) | 256;
                              }
                              else if (token === 12400) {
                                  objState = (objState & ~256) | 512;
                              }
                              key = parseComputedPropertyName(state, context);
                              value = parseMethodDeclaration(state, context, objState);
                          }
                      }
                  }
                  else if (state.token === 131074 || state.token === 131075) {
                      tokenValue = state.tokenValue;
                      key = parseLiteral(state, context, tokenValue);
                      if (state.token === 8388637)
                          report(state, 0);
                      if (optional(state, context | 32768, 21)) {
                          if (tokenValue === '__proto__') {
                              if (hasProto) {
                                  state.pendingCoverInitializeError = 87;
                              }
                              else
                                  hasProto = true;
                          }
                          value = acquireGrammar(state, context, 0, parseAssignmentExpression);
                          addVariable(state, context, scope, type, 0, false, false, tokenValue);
                      }
                      else {
                          state.bindable = state.assignable = false;
                          value = parseMethodDeclaration(state, context, objState);
                          objState |= 1;
                      }
                  }
                  else if (state.token === 131091) {
                      key = parseComputedPropertyName(state, context);
                      objState = (objState & ~(16 | 8 | 768)) | 2;
                      if (state.token === 21) {
                          next(state, context);
                          value = parseAssignmentExpression(state, context | 32768);
                      }
                      else {
                          objState |= 1;
                          if (state.token !== 131083)
                              report(state, 0);
                          state.bindable = state.assignable = false;
                          value = parseMethodDeclaration(state, context, objState);
                      }
                  }
                  else if (state.token & 21105203) {
                      next(state, context);
                      if (state.token & 274432) {
                          token = state.token;
                          objState &= ~(1 | 16);
                          key = parseIdentifier(state, context);
                          if (state.token === 131083) {
                              state.bindable = state.assignable = false;
                              value = parseMethodDeclaration(state, context, objState | 8);
                              objState |= 1 | 8;
                          }
                          else {
                              if (token === 1060972)
                                  report(state, 0);
                              if (token === 12399 || (token & 12400) === 12400)
                                  report(state, 0);
                              if (token === 21)
                                  report(state, 0);
                              report(state, 0);
                          }
                      }
                      else if (state.token === 131074 || state.token === 131075) {
                          key = parseLiteral(state, context, state.tokenValue);
                          state.bindable = state.assignable = false;
                          value = parseMethodDeclaration(state, context, objState | 8);
                          objState |= 1;
                      }
                      else if (state.token === 131091) {
                          key = parseComputedPropertyName(state, context);
                          state.bindable = state.assignable = false;
                          value = parseMethodDeclaration(state, context, objState | 8);
                          objState |= 1 | 2;
                      }
                      else {
                          report(state, 1, KeywordDescTable[state.token & 255]);
                      }
                  }
                  else {
                      report(state, 1, KeywordDescTable[state.token & 255]);
                  }
                  properties.push({
                      type: 'Property',
                      key,
                      value,
                      kind: !(objState & 768) ? 'init' : objState & 512 ? 'set' : 'get',
                      computed: (objState & 2) > 0,
                      method: (objState & 1) > 0,
                      shorthand: (objState & 4) > 0
                  });
              }
              optional(state, context, 18);
          }
          expect(state, context, 536870927);
          state.flags &= ~32;
          state.bindable = state.bindable && bindable;
          state.assignable = state.assignable && assignable;
          state.pendingCoverInitializeError = pendingCoverInitializeError || state.pendingCoverInitializeError;
          return {
              type: 'ObjectExpression',
              properties
          };
      }
      function parseMethodDeclaration(state, context, objState) {
          state.assignable = state.bindable = false;
          const { assignable, bindable, pendingCoverInitializeError } = state;
          state.bindable = state.assignable = true;
          state.pendingCoverInitializeError = null;
          const result = parsePropertyMethod(state, context | 33554432, objState);
          if (state.pendingCoverInitializeError !== null) {
              report(state, 0);
          }
          state.bindable = bindable;
          state.assignable = assignable;
          state.pendingCoverInitializeError = pendingCoverInitializeError;
          return result;
      }
      function parsePropertyMethod(state, context, objState) {
          let functionScope = createScope(1);
          let id = null;
          let firstRestricted;
          if (state.token & 274432) {
              validateBindingIdentifier(state, context & 1024
                  ? 2097152
                  : (objState & 8) > 0
                      ? 2097152
                      : 0 | (context & 2048) || (objState & 8) > 0
                          ? 4194304
                          : 0, 2);
              addVariableAndDeduplicate(state, context, functionScope, 2, 0, true, state.tokenValue);
              functionScope = createSubScope(functionScope, 1);
              firstRestricted = state.tokenValue;
              id = parseIdentifier(state, context);
          }
          context =
              (context |
                  262144 |
                  4194304 |
                  2097152 |
                  8388608 |
                  ((objState & 64) === 0 ? 16777216 | 524288 : 0)) ^
                  (4194304 |
                      2097152 |
                      8388608 |
                      ((objState & 64) < 1 ? 16777216 | 524288 : 0));
          if (objState & 16)
              context |= 4194304;
          if (objState & 8)
              context |= 2097152;
          if (objState & 64)
              context |= 16777216;
          const paramScoop = createSubScope(functionScope, 5);
          const params = parseFormalParameters(state, context | 67108864 | 33554432, paramScoop, 32, objState);
          const body = parseFunctionBody(state, context | 67108864 | 33554432, createSubScope(paramScoop, 1), firstRestricted, 0);
          return {
              type: 'FunctionExpression',
              params,
              body,
              async: (objState & 16) > 0,
              generator: (objState & 8) > 0,
              id
          };
      }
      function parseLiteral(state, context, value) {
          const { tokenRaw: raw } = state;
          if (context & 1024 && state.flags & 8)
              report(state, 93);
          next(state, context);
          return context & 8
              ? {
                  type: 'Literal',
                  value,
                  raw
              }
              : {
                  type: 'Literal',
                  value
              };
      }
      function parseThisExpression(state, context) {
          next(state, context);
          return {
              type: 'ThisExpression'
          };
      }
      function parseIdentifier(state, context) {
          const { tokenRaw: raw, tokenValue: name } = state;
          next(state, context);
          return context & 8
              ? {
                  type: 'Identifier',
                  name,
                  raw
              }
              : {
                  type: 'Identifier',
                  name
              };
      }
      function parseRegularExpressionLiteral(state, context) {
          const { tokenRegExp: regex, tokenValue: value } = state;
          next(state, context);
          return {
              type: 'Literal',
              value,
              regex
          };
      }
      function parseBigIntLiteral(state, context) {
          const { tokenRaw: raw, tokenValue: value } = state;
          next(state, context);
          return {
              type: 'Literal',
              value,
              bigint: raw,
              raw
          };
      }

      const version = exports('version', '2.0');
      function parseSource(source, options, context) {
          let onComment;
          let onToken;
          if (options != null) {
              if (options.module)
                  context |= 2048;
              if (options.next)
                  context |= 1;
              if (options.jsx)
                  context |= 4;
              if (options.ranges)
                  context |= 2;
              if (options.loc)
                  context |= 32;
              if (options.raw)
                  context |= 8;
              if (options.globalReturn)
                  context |= 64;
              if (options.impliedStrict)
                  context |= 1024;
              if (options.experimental)
                  context |= 128;
              if (options.native)
                  context |= 256;
              if (options.webCompat)
                  context |= 16;
              if (options.next)
                  context |= 1;
              if (options.ranges)
                  context |= 2;
              if (options.directives)
                  context |= 131072 | 8;
              if (options.raw)
                  context |= 8;
              if (options.onComment != null) {
                  onComment = Array.isArray(options.onComment) ? pushComment(context, options.onComment) : options.onComment;
              }
              if (options.onToken != null) {
                  onToken = Array.isArray(options.onToken) ? pushToken(context, options.onToken) : options.onToken;
              }
          }
          const state = create(source, onComment, onToken);
          skipHashBang(state, context);
          const scope = createScope(1);
          let body;
          let sourceType = 'script';
          if (context & 2048) {
              sourceType = 'module';
              body = parseModuleItem(state, context | 4096, scope);
              for (const key in state.exportedBindings) {
                  if (key[0] === '@' && key !== '#default' && (scope.var[key] === undefined && scope.lex[key] === undefined)) {
                      report(state, 47, key.slice(1));
                  }
              }
          }
          else {
              body = parseStatementList(state, context | 4096, scope);
          }
          const node = {
              type: 'Program',
              sourceType,
              body
          };
          if (context & 2) {
              node.start = 0;
              node.end = source.length;
          }
          if (context & 32) {
              node.loc = {
                  start: { line: 1, column: 0 },
                  end: { line: state.line, column: state.column }
              };
          }
          return node;
      }
      function parse(source, options) {
          return parseSource(source, options, options && options.module ? 1024 | 2048 : 0);
      }
      function parseScript(source, options) {
          return parseSource(source, options, 0);
      }
      function parseModule(source, options) {
          return parseSource(source, options, 1024 | 2048);
      }

    }
  };
});
