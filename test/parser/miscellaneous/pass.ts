import { pass, fail } from '../../test-utils';
import { Context } from '../../../src/common';
import * as t from 'assert';
import { parseSource } from '../../../src/cherow';

describe('Miscellaneous - Passing tests', () => {
  const programs = [
    //`/}?/u;`,
    //`/{*/u;`,
    //`/.{.}/;`,
    '004',
    '004',
    '004',
    '077',
    '00',
    '00',
    '05',
    '004',
    '004',
    '004',
    '077',
    '00',
    '00',
    '05',
    '078',
    '0708',
    '019',
    '0719',
    '0782',
    'var x = 42;',
    'var x = function () { this.foo = 42 };',
    '"use strict"; while (true) { let x; this, arguments; }',
    'while (true) { this.f() }',
    'this.foo();',
    '"use strict"; if (foo()) { let x; this.f() }',
    'function foo(x, y) { return x + y; }',
    'with ({}) { block; }',
    '  try {} catch(e) { block; }',
    'var arguments',
    'var foo, eval;',
    'try { } catch (eval) { }',
    'try { } catch (arguments) { }',
    'function foo(arguments) { }',
    'eval = 1;',
    'var foo = eval = 1;',
    '++arguments;',
    'arguments++',
    'var yield;',
    'var foo, yield;',
    'try { } catch (yield) { }',
    'function yield() { }',
    '(function yield() { })',
    'function foo(yield) { }',
    'function foo(bar, yield) { }',
    'yield = 1;',
    'var foo = yield = 1;',
    'yield * 2;',
    '++yield;',
    'yield++;',
    'yield: 34',
    'function yield(yield) { yield: yield (yield + yield(0)); }',
    '({ yield: 1 })',
    '({ get yield() { 1 } })',
    'yield(100)',
    'yield[100]',
    'function not_gen() {var yield;}',
    'function not_gen() {var foo, yield;}',
    'function not_gen() {try { } catch (yield) { }}',
    'function not_gen() {function yield() {}}',
    'function not_gen() {(function yield() { })}',
    'function not_gen() {function foo(yield) { }}',
    'function not_gen() {function foo(bar, yield) { }}',
    'function not_gen() {yield = 1;}',
    'function not_gen() { var foo = yield = 1;}',
    '(function not_gen() {yield * 2;})',
    '(function not_gen() {++yield;})',
    '(function not_gen() {yield++;})',
    '(function not_gen() {function yield(yield) { yield: yield (yield + yield(0)); }})',
    '(function not_gen() {({ yield: 1 })})',
    '(function not_gen() {({ get yield() { 1 } })})',
    '(function not_gen() {yield(100)})',
    '(function not_gen() {yield[100]})',
    'function * gen() { function not_gen() {var yield;} }',
    'function * gen() { function not_gen() {var foo, yield;} }',
    'function * gen() { function not_gen() {try { } catch (yield) { }} }',
    'function * gen() { function not_gen() {function yield() { }} }',
    'function * gen() { function not_gen() {(function yield() { })} }',
    'function * gen() { function not_gen() {function foo(yield) { }} }',
    'function * gen() { function not_gen() {function foo(bar, yield) { }} }',
    'function * gen() { function not_gen() {function * yield() { }} }',
    '(function * gen() { (function not_gen() {yield = 1;}) })',
    '(function * gen() { (function not_gen() {var foo = yield = 1;}) })',
    '(function * gen() { (function not_gen() {yield * 2;}) })',
    '(function * gen() { (function not_gen() {++yield;}) })',
    '(function * gen() { (function not_gen() {yield++;}) })',
    '(function * gen() { (function not_gen() {yield: 34}) })',
    '(function * gen() { (function not_gen() {function yield(yield) { yield: yield (yield + yield(0)); }}) })',
    '(function * gen() { (function not_gen() {({ yield: 1 })}) })',
    '(function * gen() { (function not_gen() {({ get yield() { 1 } })}) })',
    '(function * gen() { (function not_gen() {yield(100)}) })',
    '(function * gen() { (function not_gen() {yield[100]}) })',
    'function * gen() {yield yield 1;}',
    'function * gen() {yield * yield * 1;}',
    'function * gen() {yield 3 + (yield 4);}',
    'function * gen() {yield * 3 + (yield * 4);}',
    'function * gen() {(yield * 3) + (yield * 4);}',
    'function * gen() {({ yield: 1 })}',
    'function * gen() {({ get yield() { } })}',
    // And in assignment pattern computed properties
    'function * gen() {({ [yield]: x } = { })}',
    // Yield without RHS.
    'function * gen() {yield /* comment */}',
    'function * gen() {yield // comment\n}',
    '(function * () {(yield)})',
    '(function * () {[yield]})',
    '(function * () {{yield}})',
    // If there is a newline before the next token, we don't look for RHS.
    '(function * () {yield\nfor (;;) {}})',
    '(function * () {x = class extends (yield) {}})',
    '(function * () {x = class extends f(yield) {}})',
    '(function * () {x = class extends (null, yield) { }})',
    '(function * () {x = class extends (a ? null : yield) { }})',
    'let foo; ',
    'let foo = 0; ',
    'let [foo] = [1]; ',
    'let {foo} = {foo: 2}; ',
    'let {foo=3} = {}; ',
    'var foo; ',
    'var foo = 0; ',
    'var [foo] = [1]; ',
    'var {foo} = {foo: 2}; ',
    'var {foo=3} = {}; ',
    '{ var foo; }; ',
    '{ var foo = 0; }; ',
    '{ var [foo] = [1]; }; ',
    '{ var {foo} = {foo: 2}; }; ',
    '{ var {foo=3} = {}; }; ',
    'function foo() {}; ',
    'function* foo() {}; ',
    'async function foo() {}; ',
    'class foo {}; ',
    'class foo extends null {}; ',
    'function bar() {foo = 42}; ext(bar); ext(foo)',
    'ext(function() {foo++}); ext(foo)',
    'bar = () => --foo; ext(bar); ext(foo)',
    'function* bar() {eval(ext)}; ext(bar); ext(foo)',
    '',
    "'use strict';(function(...args){ return args;})",
    "'use strict';(function(a, ...args){ return args;})",
    "'use strict';(function(...   args){ return args;})",
    "'use strict';(function(a, ...   args){ return args;})",
    "'use strict';(function(...\targs){ return args;})",
    "'use strict';(function(a, ...\targs){ return args;})",
    "'use strict';(function(...\r\nargs){ return args;})",
    "'use strict';(function(a, ...\r\nargs){ return args;})",
    "'use strict';(function(...\rargs){ return args;})",
    "'use strict';(function(a, ...\rargs){ return args;})",
    "'use strict';(function(...\t\n\t\t\n  args){ return args;})",
    "'use strict';(function(a, ...  \n  \n  args){ return args;})",
    "'use strict';(function(...{ length, 0: a, 1: b}){ return args;})",
    "'use strict';(function(...{}){ return args;})",
    "'use strict';(function(...[a, b]){ return args;})",
    "'use strict';(function(...[]){ return args;})",
    'function f() {} function f() {}',
    'function foo() {function  a(b,) {}}',
    'function foo() {function* a(b,) {}}',

    'my_var;',
    'if (true) { let my_var; } my_var;',
    "eval('foo');",
    'function inner2() { my_var; }',
    "function inner2() { eval('foo'); }",
    'var {my_var : a} = {my_var};',
    'let {my_var : a} = {my_var};',
    'const {my_var : a} = {my_var};',
    'var [a, b = my_var] = [1, 2];',
    'var [a, b = my_var] = [1, 2]; my_var;',
    'let [a, b = my_var] = [1, 2];',
    'let [a, b = my_var] = [1, 2]; my_var;',
    'const [a, b = my_var] = [1, 2];',
    'const [a, b = my_var] = [1, 2]; my_var;',
    'var {a = my_var} = {}',
    'var {a: b = my_var} = {}',
    'let {a = my_var} = {}',
    'let {a: b = my_var} = {}',
    'const {a = my_var} = {}',
    'const {a: b = my_var} = {}',
    'a = my_var',
    '',
    'a = my_var',
    'let my_var;',
    'function inner2(a = my_var) { }',
    '(a = my_var) => { }',
    'function inner2({a} = {a: my_var}) { }',
    '[a] = [my_var]',
    '',
    'function inner2([a] = [my_var]) { }',
    '([a] = [my_var]) => { }',
    "function inner2(a = eval('')) { }",
    "(a = eval('')) => { }",
    'try { } catch (my_var) { } my_var;',
    'for (my_var in {}) { my_var; }',
    'for (my_var in {}) { }',
    'for (my_var of []) { my_var; }',
    'for (my_var of []) { }',
    'for ([a, my_var, b] in {}) { my_var; }',
    'for ([a, my_var, b] of []) { my_var; }',
    'for ({x: my_var} in {}) { my_var; }',
    'for ({x: my_var} of []) { my_var; }',
    'for ({my_var} in {}) { my_var; }',
    'for ({my_var} of []) { my_var; }',
    'for ({y, x: my_var} in {}) { my_var; }',
    'for ({y, x: my_var} of []) { my_var; }',
    'for ({a, my_var} in {}) { my_var; }',
    'for ({a, my_var} of []) { my_var; }',
    'for (let my_var in {}) { } my_var;',
    'for (let my_var of []) { } my_var;',
    'for (let [a, my_var, b] in {}) { } my_var;',
    'for (let [a, my_var, b] of []) { } my_var;',
    'for (let {x: my_var} in {}) { } my_var;',
    'for (let {x: my_var} of []) { } my_var;',
    'for (let {my_var} in {}) { } my_var;',
    'for (let {my_var} of []) { } my_var;',
    'for (let {y, x: my_var} in {}) { } my_var;',
    'for (let {y, x: my_var} of []) { } my_var;',
    'for (let {a, my_var} in {}) { } my_var;',
    'for (let {a, my_var} of []) { } my_var;',
    'for (let my_var = 0; my_var < 1; ++my_var) { } my_var;',
    "'use strict'; if (true) { function my_var() {} } my_var;",
    'function inner2(a = my_var) {}',
    'function inner2(a = my_var) { let my_var; }',
    '(a = my_var) => {}',
    '(a = my_var) => { let my_var; }',
    // No pessimistic context allocation:
    'var my_var; my_var;',
    'var my_var;',
    'var my_var = 0;',
    'if (true) { var my_var; } my_var;',
    'let my_var; my_var;',
    'let my_var;',
    'let my_var = 0;',
    'const my_var = 0; my_var;',
    'const my_var = 0;',
    'var [a, my_var] = [1, 2]; my_var;',
    'let [a, my_var] = [1, 2]; my_var;',
    'const [a, my_var] = [1, 2]; my_var;',
    'var {a: my_var} = {a: 3}; my_var;',
    'let {a: my_var} = {a: 3}; my_var;',
    'const {a: my_var} = {a: 3}; my_var;',
    'var {my_var} = {my_var: 3}; my_var;',
    'let {my_var} = {my_var: 3}; my_var;',
    'const {my_var} = {my_var: 3}; my_var;',
    'my_var',
    'my_var;',
    'my_var',
    '',
    'my_var = 5',
    'my_var;',
    'my_var = 5',
    '',
    '[a, my_var, b]',
    'my_var;',
    '[a, my_var, b]',
    '',
    '[a, my_var, b] = [1, 2, 3]',
    'my_var;',
    '[a, my_var, b] = [1, 2, 3]',
    '',
    '{x: my_var}',
    'my_var;',
    '{x: my_var}',
    '',
    '{my_var}',
    'my_var;',
    '{my_var}',
    '',
    `function assert(a, e) {
      if (a !== e)
          throw new Error("Expected: " + e + " but got: " + a);
  }

  function bitAnd(a, b) {
      return a & b;
  }
  noInline(bitAnd);

  var o = { valueOf: () => 0b1101 };

  for (var i = 0; i < 10000; i++)
      assert(bitAnd(0b11, o), 0b1);

  assert(numberOfDFGCompiles(bitAnd) <= 1, true);

  function bitOr(a, b) {
      return a | b;
  }
  noInline(bitOr);

  for (var i = 0; i < 10000; i++)
      assert(bitOr(0b11, o), 0b1111);

  assert(numberOfDFGCompiles(bitOr) <= 1, true);

  function bitXor(a, b) {
      return a ^ b;
  }
  noInline(bitXor);

  for (var i = 0; i < 10000; i++)
      assert(bitXor(0b0011, o), 0b1110);

  assert(numberOfDFGCompiles(bitXor) <= 1, true);`,
    `for (var i = 0; i < 1e6; ++i)
    foo();
for (var i = 0; i < 1e6; ++i)
    shouldBe(get(), 4);
`,
    `function foo() {
      bar = 4;
  }
  function get() {
      return bar;
  }`,
    `var invokeCount = 0;

     Object.defineProperty(Function.prototype, 'prototype', {
         get: function () {
             invokeCount++;
         }
     });

     new Promise(resolve => {
         for (var i = 0; i < 10000; ++i)
             new resolve();

         if (invokeCount != 10000)
             $vm.crash();
     });`,
    `forEach({ length: 5 }, function() {
      for (var i = 0; i < 10; i++) {
          forEach([1], function() {});
      }
  });

  function forEach(a, b) {
      for (var c = 0; c < a.length; c++)
          b();
  }`,
    `function shouldBe(actual, expected)
     {
         if (actual !== expected)
             throw new Error('bad value: ' + actual);
     }
     noInline(shouldBe);

     function test(value)
     {
         return Object.prototype.toString.call(value);
     }
     noInline(test);

     for (var i = 0; i < 1e6; ++i) {
         switch (i % 3) {
         case 0:
             shouldBe(test(null), "[object Null]");
             break;
         case 1:
             shouldBe(test(undefined), "[object Undefined]");
             break;
         case 2:
             shouldBe(test(true), "[object Boolean]");
             break;
         }
     }`,
    `for (var i = 0; i < 1e6; ++i) {
      if (i & 0x1)
          shouldBe(test(null), "[object Null]");
      else
          shouldBe(test(undefined), "[object Undefined]");
  }`,
    `function f(x, y) {
      x.y = y;
  };

  function g(x) {
      return x.y + 42;
  }
  noInline(f);
  noInline(g);

  var x = {};
  var y = {};
  f(x, 42);
  f(y, {});

  while (!numberOfDFGCompiles(g)) {
      optimizeNextInvocation(g);
      if (typeof g(x) !== 'number')
          throw 'failed warming up';
  }

  if (typeof g(y) !== 'string')
      throw 'failed after compilation';`,
    `function __isPropertyOfType(obj, name, type) {
      desc = Object.getOwnPropertyDescriptor(obj, name)
      return typeof type === 'undefined' || typeof desc.value === type;
  }
  function __getProperties(obj, type) {
      let properties = [];
      for (let name of Object.getOwnPropertyNames(obj)) {
          if (__isPropertyOfType(obj, name, type)) properties.push(name);
      }
      let proto = Object.getPrototypeOf(obj);
      while (proto && proto != Object.prototype) {
          Object.getOwnPropertyNames(proto).forEach(name => {
          });
          proto = Object.getPrototypeOf(proto);
      }
      return properties;
  }
  function* __getObjects(root = this, level = 0) {
      if (level > 4) return;
      let obj_names = __getProperties(root, 'object');
      for (let obj_name of obj_names) {
          let obj = root[obj_name];
          yield* __getObjects(obj, level + 1);
      }
  }
  function __getRandomObject() {
      for (let obj of __getObjects()) {
      }
  }
  var theClass = class {
      constructor() {
          if (242487 != null && typeof __getRandomObject() == "object") try {
          } catch (e) {}
      }
  };
  var childClass = class Class extends theClass {
      constructor() {
          var arrow = () => {
              try {
                  super();
              } catch (e) {}
              this.idValue
          };
          arrow()()();
      }
  };
  for (var counter = 0; counter < 1000; counter++) {
      try {
          new childClass();
      } catch (e) {}
  }`,
    `function Hello(y) {
    this.y = y;
    this.x = foo(this.y);
  }
  function foo(z) {
    try {
      for (var i = 0; i < 1; i++) {
        z[i];
      }
    } catch {
    }
  }
  new Hello('a');
  new Hello('a');
  for (let i = 0; i < 100; ++i) {
    new Hello();
  }

  // Busy loop to let the crash reporter have a chance to capture the crash log for the Compiler thread.
  for (let i = 0; i < 1000000; ++i) {
      $vm.ftlTrue();
  }`,
    `function foo(o) {
    for (var i = 0; i < 100; ++i) {
        o.f = o.f;
    }
}

let typedArrays = [
    Uint8Array,
    Uint32Array,
    Uint8Array,
];

for (let constructor of typedArrays) {
    let a = new constructor(0);
    for (let i = 0; i < 10000; i++) {
        foo(a);
    }
}`,
    '[ b, a ] = [ a, b ]',
    `var list = [ 1, 2, 3 ]
var [ a, , b ] = list
[ b, a ] = [ a, b ]`,
    `var obj = { a: 1 }
var list = [ 1 ]
var { a, b = 2 } = obj
var [ x, y = 2 ] = list`,
    `var list = [ 7, 42 ]
var [ a = 1, b = 2, c = 3, d ] = list
a === 7
b === 42
c === 3
d === undefined`,
    `function f ([ name, val ]) {
  console.log(name, val)
}
function g ({ name: n, val: v }) {
  console.log(n, v)
}
function h ({ name, val }) {
  console.log(name, val)
}
f([ "bar", 42 ])
g({ name: "foo", val:  7 })
h({ name: "bar", val: 42 })`,

    'let [a] = [];',

    'let {a:b} = {};',
    'function f([x] = [1]) {};',
    '({f: function({x} = {x: 10}) {}});',
    'f = function({x} = {x: 10}) {};',
    '[a, b] = [b, a];',
    '[ok.v] = 20;',
    'var [x = 10, y, z] = a;',
    '[x = 10, [ z = 10]] = a;',
    'var {x = 10, y = 5, z = 1} = a;',
    'var {x: x = 10, y: y = 10, z: z = 10} = a;',
    'var { x: x = 10 } = x;',
    'var {x, y: y = 10, z} = a;',
    'var {x = 10, y: { z = 10}} = a;',
    'var {x = 10, y: { z }} = a;',
    `function x({a}) {
  try {
    var {b} = a;
  }
  catch([stack]) {
  }
};`,
    '({ responseText: text } = res);',
    'var {x: y, z: { a: b } } = { x: "3", z: { a: "b" } };',
    'function a({x = 10}) {}',
    'function x([ a, b ]){};',
    'function a([x, , [, z]]) {};',
    '(function x({ a, b }){});',
    'function x({ a, b }){};',
    '[a,,b] = array;',
    'var let = a;',
    '(let[a] = b);',
    `(x=1) => x * x;`,
    'for (const {a} of /b/) {}',
    '({ a = 42, [b]: c.d } = e);',
    `const test = ({ t, ...v }) => {
  console.log(t, v);
};`,

    'switch (answer) { case 42: let t = 42; break; }',
    'e => { 42; }',
    'e => ({ property: 42 })',
    '(a, b) => { 42; }',
    '([a, , b]) => 42',
    '(() => {})()',
    '(x=1) => x * x',
    '(a) => 00',
    '(eval = 10) => 42',
    '(eval, a = 10) => 42',
    '(x) => ((y, z) => (x, y, z))',
    'foo((x, y) => {})',
    'x = { method() { } }',
    'x = { method(test) { } }',
    'x = { "method"() { } }',
    'x = { set() { } }',
    'x = { y, z }',
    '[a.r] = b',
    'let [a,,b] = c',
    '({ responseText: text } = res)',
    'const {a} = {}',
    'const [a] = []',
    'let [a] = []',
    'var [a] = []',
    'var {a:b} = {}',
    'class A {get() {}}',
    'class A extends B { static get foo() {}}',
    'class A {set a(v) {}}',
    'class A { static set(v) {};}',
    'class A {*gen(v) { yield v; }}',
    '(class { *static() {} })',
    "class A { get ['constructor']() {} }",
    'class A { foo() {} bar() {}}',
    'class A { get foo() {} set foo(v) {}}',
    'class A { static get foo() {} get foo() {}}',
    'class A { static get foo() {} static set foo(v) {} get foo() {} set foo(v) {}}',
    'var {[x]: y} = {y}',
    'function f({[x]: y}) {}',
    'var x = {*[test]() { yield *v; }}',
    'class A {[x]() {}}',
    'function f([x] = [1]) {}',
    'function f([x] = [1]) { "use strict"; }',
    'function f({x} = {x: 10}) {}',
    'f = function({x} = {x: 10}) {}',
    '({f: function({x} = {x: 10}) {}})',
    '({f({x} = {x: 10}) {}})',
    '(class {f({x} = {x: 10}) {}})',
    '(({x} = {x: 10}) => {})',
    'x = function(y = 1) {}',
    'x = { f: function(a=1) {} }',
    'x = { f(a=1) {} }',
    'function f(a, ...b) {}',
    'function x([ a, b ]){}',
    'function x({ a, b }){}',
    '(function x([ a, b ]){})',
    '({ x([ a, b ]){} })',
    '({ a }) => {}',
    '({ a }, ...b) => {}',
    '({ a: [a, b] }, ...c) => {}',
    '({ a: b, c }, [d, e], ...f) => {}',
    '[...a] = b',
    '[a, ...b] = c',
    '[{ a, b }, ...c] = d',
    '[a, ...[b, c]] = d',
    'var [a, ...b] = c',
    'var [{ a, b }, ...c] = d',
    'var [a, ...[b, c]] = d',
    'func(...a)',
    'func(...a, b)',
    '/[a-z]/u',
    'e => yield* 10',
    'var {get} = obj;',
    'var {propName: localVar = defaultValue} = obj',
    'var {propName = defaultValue} = obj',
    'var {get = defaultValue} = obj',
    'var [localVar = defaultValue] = obj',
    '({x = 0} = obj)',
    '({x = 0}) => x',
    '[a, {b: {c = 1}}] = arr',
    'for ({x = 0} in arr);',
    'try {} catch ({message}) {}',
    'class A { static() {} }',
    '`${/\\d/.exec("1")[0]}`',
    'let [x,] = [1]',
    'for (var [name, value] in obj) {}',
    'function foo() { new.target; }',
    '(([,]) => 0)',
    'function foo() { return {arguments} }',
    'function foo() { return {eval} }',
    'function foo() { "use strict"; return {arguments} }',
    'function foo() { return {yield} }',
    'function* foo(a = function*(b) { yield b }) { }',
    'function* foo(a = function* foo() { yield b }) {}',
    'async function f() { for await (x of xs); }',
    'async function f() { for await (var x of xs); }',
    'async function f() { for await (let x of xs); }',
    'async function f() { for\nawait (x of xs); }',
    'f = async function() { for await (x of xs); }',
    'f = async() => { for await (x of xs); }',
    'obj = { async f() { for await (x of xs); } }',
    'class A { async f() { for await (x of xs); } }',
    'for (x of xs);',
    'async function* f() { await a; yield b; }',
    'f = async function*() { await a; yield b; }',
    'obj = { async* f() { await a; yield b; } }',
    'class A { async* f() { await a; yield b; } }',
    'class A { static async* f() { await a; yield b; } }',
    'var gen = { async *method() {} }',
    '3 % 5 ** 1',
    '`a${b=c}d`',
    '`a${await foo}d`',
    'f`x${/foo/}y`',
    'f`x`\n/foo/',
    'foo\n++bar',
    '(x, /y/);',
    'async("foo".bar) => x',
    'async("foo".bar);',
    'async(a);',
    '(foo[x])',
    '(foo.x)',
    'async (foo = yield) => foo',
    'async (foo = yield)',
    'function *f(){ async (foo = yield) }',
    'function *f(){ async (foo = yield x) }',
    'async yield => foo',
    'async (yield) => foo',
    'function *f(){  async yield => foo  }',
    'function *f(){  async (yield) => foo  }',
    'async \n (a, b, c);',
    'async (a, b, c);',
    '(...[destruct]) => x',
    '(...{destruct}) => x',
    'async(...ident) => x',
    'async(...[destruct]) => x',
    'async(...{destruct}) => x',
    'const [a] = b;',
    'function b([a]){};',
    'function b([a] = b){};',
    '([a]) => b;',
    '([a] = b) => c;',
    '[a] = b;',
    '[{x: y.z}]',
    '[{x: y.z}] = a',
    '([{x: y.z}]) => b',
    '([{x: y.z}] = a) => b',
    '([{x: y.z} = a]) => b',
    `[x = y]`,
    `[x = y, z]`,
    `[true = x]`,
    `[await = x]`,
    `[x = true]`,
    '[{}]',
    '[{}.foo] = x',
    '[{}[foo]] = x',
    `[x]`,
    `[x, y]`,
    `[x = y]`,
    `[x.y]`,
    `[x.y = z]`,
    `[x + y]`,
    `[this]`,
    `[this=x]`,
    `[this]=x`,
    '([...x]);',
    '([...x, y]);',
    '([...x+y]);',
    '([...x.y] = z)',
    '(z = [...x.y] = z) => z',
    '[{}.foo]=x',
    '[5[foo]]=x',
    '["x".foo]=x',
    '[`x`.foo]=x',
    `[x]=y`,
    `[x=y]=z`,
    `[...{a = b} = c] = x`,
    `({"a b c": bar});`,
    `({"a b c"(){}});`,
    `({"a b c": bar}) => x`,
    `({15: bar});`,
    `({15(){}});`,
    `({15: bar}) => x`,
    '({5(){}})',
    '({...x}); ',
    '({...x=y});',
    '({...x.y} = z)',
    '({...x, ...y}); ',
    ' ({...x, y});',
    '({...x+y});',
    '({[foo]: bar} = baz)',
    '({[foo]: a + b} = baz)',
    '({ident: [foo].length} = x)',
    '({ident: [foo].length = x} = x)',
    '[...new x];',
    'const {get = foo} = {}',
    'var {get = defaultValue} = obj',
    'var [localVar = defaultValue] = obj',
    'x = function(y = 1) {}',
    'function inner2(my_var) { my_var; }',
    'function inner2(my_var) { }',
    'function inner2(my_var = 5) { my_var; }',
    'function inner2(my_var = 5) { }',
    'function inner2(...my_var) { my_var; }',
    'function inner2(...my_var) { }',
    'function inner2([a, my_var, b]) { my_var; }',
    'function inner2([a, my_var, b]) { }',
    'function inner2([a, my_var, b] = [1, 2, 3]) { my_var; }',
    'function inner2([a, my_var, b] = [1, 2, 3]) { }',
    'function inner2({x: my_var}) { my_var; }',
    'function inner2({x: my_var}) { }',
    'function inner2({x: my_var} = {x: 0}) { my_var; }',
    'function inner2({x: my_var} = {x: 0}) { }',
    'function inner2({my_var}) { my_var; }',
    'function inner2({my_var}) { }',
    'function inner2({my_var} = {my_var: 8}) { my_var; } ',
    'function inner2({my_var} = {my_var: 8}) { }',
    'my_var => my_var;',
    'my_var => { }',
    '(my_var = 5) => my_var;',
    '(my_var = 5) => { }',
    '(...my_var) => my_var;',
    '(...my_var) => { }',
    '([a, my_var, b]) => my_var;',
    '([a, my_var, b]) => { }',
    '([a, my_var, b] = [1, 2, 3]) => my_var;',
    '([a, my_var, b] = [1, 2, 3]) => { }',
    '({x: my_var}) => my_var;',
    '({x: my_var}) => { }',
    '({x: my_var} = {x: 0}) => my_var;',
    '({x: my_var} = {x: 0}) => { }',
    '({my_var}) => my_var;',
    '({my_var}) => { }',
    '({my_var} = {my_var: 5}) => my_var;',
    '({my_var} = {my_var: 5}) => { }',
    '({a, my_var}) => my_var;',
    '({a, my_var}) => { }',
    '({a, my_var} = {a: 0, my_var: 5}) => my_var;',
    '({a, my_var} = {a: 0, my_var: 5}) => { }',
    '({y, x: my_var}) => my_var;',
    '({y, x: my_var}) => { }',
    '({y, x: my_var} = {y: 0, x: 0}) => my_var;',
    '({y, x: my_var} = {y: 0, x: 0}) => { }',
    'try { } catch (my_var) { my_var; }',
    'try { } catch ([a, my_var, b]) { my_var; }',
    'try { } catch ({x: my_var}) { my_var; }',
    'try { } catch ({y, x: my_var}) { my_var; }',
    'try { } catch ({my_var}) { my_var; }',
    'for (let my_var in {}) { my_var; }',
    'for (let my_var in {}) { }',
    'for (let my_var of []) { my_var; }',
    'for (let my_var of []) { }',
    'for (let [a, my_var, b] in {}) { my_var; }',
    'for (let [a, my_var, b] of []) { my_var; }',
    'for (let {x: my_var} in {}) { my_var; }',
    'for (let {x: my_var} of []) { my_var; }',
    'for (let {my_var} in {}) { my_var; }',
    'for (let {my_var} of []) { my_var; }',
    'for (let {y, x: my_var} in {}) { my_var; }',
    'for (let {y, x: my_var} of []) { my_var; }',
    'for (let {a, my_var} in {}) { my_var; }',
    'for (let {a, my_var} of []) { my_var; }',
    'for (var my_var in {}) { my_var; }',
    'for (var my_var in {}) { }',
    'for (var my_var of []) { my_var; }',
    'for (var my_var of []) { }',
    'for (var [a, my_var, b] in {}) { my_var; }',
    'for (var [a, my_var, b] of []) { my_var; }',
    'for (var {x: my_var} in {}) { my_var; }',
    'for (var {x: my_var} of []) { my_var; }',
    'for (var {my_var} in {}) { my_var; }',
    'for (var {my_var} of []) { my_var; }',
    'for (var {y, x: my_var} in {}) { my_var; }',
    'for (var {y, x: my_var} of []) { my_var; }',
    'for (var {a, my_var} in {}) { my_var; }',
    'for (var {a, my_var} of []) { my_var; }',
    'for (var my_var in {}) { } my_var;',
    'for (var my_var of []) { } my_var;',
    'for (var [a, my_var, b] in {}) { } my_var;',
    'for (var [a, my_var, b] of []) { } my_var;',
    'for (var {x: my_var} in {}) { } my_var;',
    'for (var {x: my_var} of []) { } my_var;',
    'for (var {my_var} in {}) { } my_var;',
    'for (var {my_var} of []) { } my_var;',
    'for (var {y, x: my_var} in {}) { } my_var;',
    'for (var {y, x: my_var} of []) { } my_var;',
    'for (var {a, my_var} in {}) { } my_var;',
    'for (var {a, my_var} of []) { } my_var;',
    'for (let my_var = 0; my_var < 1; ++my_var) { my_var; }',
    'for (var my_var = 0; my_var < 1; ++my_var) { my_var; }',
    'for (var my_var = 0; my_var < 1; ++my_var) { } my_var; ',
    'for (let a = 0, my_var = 0; my_var < 1; ++my_var) { my_var }',
    'for (var a = 0, my_var = 0; my_var < 1; ++my_var) { my_var }',
    'class my_var {}; my_var; ',
    'function my_var() {} my_var;',
    'if (true) { function my_var() {} }  my_var;',
    'function inner2() { if (true) { function my_var() {} }  my_var; }',
    '() => { if (true) { function my_var() {} }  my_var; }',
    'if (true) { var my_var; if (true) { function my_var() {} } }  my_var;',

    ' function  a(b,) {}',
    ' function* a(b,) {}',
    '(function  a(b,) {});',
    '(function* a(b,) {});',
    '(function   (b,) {});',
    '(function*  (b,) {});',
    ' function  a(b,c,d,) {}',
    ' function* a(b,c,d,) {}',
    '(function  a(b,c,d,) {});',
    '(function* a(b,c,d,) {});',
    '(function   (b,c,d,) {});',
    '(function*  (b,c,d,) {});',
    '(b,) => {};',
    '(b,c,d,) => {};',
    'a(1,);',
    'a(1,2,3,);',
    'a(...[],);',
    'a(1, 2, ...[],);',
    'a(...[], 2, ...[],);',

    'var f; function f() {}',
    'function f() {} var f;',
    'function* f() {} function* f() {}',
    'var f; function* f() {}',
    'function* f() {} var f;',
    'function f() {} function* f() {}',
    'if (true) function foo() {}',
    'if (false) {} else function f() { };',
    'label: function f() { }',
    'label: if (true) function f() { }',
    'label: if (true) {} else function f() { }',
    'label: label2: function f() { }',
    'function* f() {} function f() {}',
    "'use strict';(function(...[...[a, b, ...c]]){ return args;})",
    "function fn() { 'use strict';} fn(...([1, 2, 3]));",
    "function fn() { 'use strict';} fn(...'123', ...'456');",
    "function fn() { 'use strict';} fn(...new Set([1, 2, 3]), 4);",
    "function fn() { 'use strict';} fn(1, ...[2, 3], 4);",
    "function fn() { 'use strict';} fn(...Array(...[1,2,3,4]));",
    "function fn() { 'use strict';} fn(...NaN);",
    "function fn() { 'use strict';} fn(0, 1, ...[2, 3, 4], 5, 6, 7, ...'89');",
    "function fn() { 'use strict';} fn(0, 1, ...[2, 3, 4], 5, 6, 7, ...'89', 10);",
    "function fn() { 'use strict';} fn(...[0, 1, 2], 3, 4, 5, 6, ...'7', 8, 9);",
    "function fn() { 'use strict';} fn(...[0, 1, 2], 3, 4, 5, 6, ...'7', 8, 9, ...[10]);",
    '{ function foo() {}; }; ',
    '{ function* foo() {}; }; ',
    '{ async function foo() {}; }; ',
    'eval++;',
    '(function let() { })',
    'var let;',
    'var foo, let;',
    'try { } catch (let) { }',
    'function let() { }',
    '(function let() { })',
    'function foo(let) { }',
    'function foo(bar, let) { }',
    'let = 1;',
    'var foo = let = 1;',
    'let * 2;',
    'function f() { let = 1; }',
    'function f() { var foo = let = 1; }',
    '++let;',
    'let++;',
    'let: 34',
    'function let(let) { let: let(let + let(0)); }',
    '({ let: 1 })',
    '({ get let() { 1 } })',
    'let(100)',
    'L: let\nx',
    'L: let\n{x}',
    'function arguments() { }',
    'function arguments() { }',
    'function foo(bar, eval) { }',
    'function arguments() { }',
    '(function f() { 0, function g() { var a; } })();',
    '(function f() { 0, { g() { var a; } } })();',
    '(function f() { 0, class c { g() { var a; } } })();',
    '(function f() { function g() { var a; } })();',
    '(function f() { function g() { { function h() { } } } })();',
    "var x = new new Function('this.x = 42');",
    'var f = (x, y) => x + y;',
    '0790',
    '[ 1 ]',
    'for([a,b[a],{c,d=e,[f]:[g,h().a,(1).i,...j[2]]}] in 3);',
    '1 - 2',
    'a: while (true) { continue a }',
    '({ if: 1 })',
    '!a',
    `{;}
    a();
    {};
    {
        {};
    };
    b();
    {}`,
    'for (var {a, b} in c);',
    '({a: b = c = 1} = 2)',
    'function *a(){yield ++a;}',
    '`$$$`',
    '[...a[1]] = 2;',
    `(function () {
      var a = {
          '1e2000': 1
      };
  }());`,
    '/[a-c]/i',
    `(function () {
    }(1,2,3))`,
    'a: while (true) { break a }',
    `/*a
    b*/ 1`,
    'class a {b(){};c(){};}',
    `var a;
    if (b()) {
        new a(1);
    } else {
        a(2);
    }`,
    '``',
    'a >= b',
    'function a({ b, c }){}',
    `c: {
      a();
      switch (1) {
        case 2:
          b();
          if (a) break c;
          d();
        case 3+4:
          e();
          break;
        default:
          f();
      }
  }`,
    '`${ a + 1 }`;',
    '(1, a.a)();',
    '[a, ...{0: b}] = 1',
    '("a")',
    `var a, b, c, d;
    a = (b(), c(), d()) ? 1 : 2;`,
    '(a) => b',
    //    'function *a(){({get b(){yield}})}',
    '({ *a() {} })',
    'a["b"] = "c";',
    '[, a,,] = 1',
    'a = {"__proto__": 1 }',
    'class a { ; }',
    `function a() {
    }
    function b() {
        return c;
    }
    function d() {
        return void 1;
    }
    function e() {
        return void 2;
    }
    function f() {
        return;
    }
    function g(h, i) {
        j.k(h, i);
        l(h);
        return;
    }
    function m(h, i) {
        j.k(h, i);
        if (h) {
            n(i);
            l(h);
            return h + i;
        }
        return c;
    }
    function o(h, i) {
        j.k(h, i);
        if (h) {
            n(i);
            l(h);
            return void 3;
        }
        return h + i;
    }
    function p(h, i) {
        n(h);
        q(i);
        return void 4;
    }
    function r(h, i) {
        n(h);
        q(i);
        return c;
    }
    function s() {
        return false;
    }
    function t() {
        return null;
    }
    function u() {
        return 5;
    }`,
    `for (var a in b)
    // do not optimize it
    (function () {
      c('d');
    }());`,
    'var eval = 1, arguments = 2',
    'for(var a = 1, b = 2;;);',
    `a(
      b(c + 'd'),
      b('d' + c)
    );`,
    // 'a: c: b: while (true) { continue a; }',
    'class a extends b { constructor() { super() } }',
    'const {a:b} = {}',
    'let a',
    `'use strict';
    var a = {
        delete: 1
    };`,
    `// optimize this
    (function () {
      a('b');
    }());
    try {
    } catch (c) {
    }`,
    '"use strict"; ({ yield() {} })',
    `function a() {
      if (b) {
          let c;
          let d;
          var e;
          var f;
      }
  }`,
    '(function({a = 1}){})',
    `(function () {
      if (true) {
          var a = 1;
      }
  }());`,
    'a++',
    'class a extends b { constructor() { super.c } }',
    '(a)=>{"use strict";}',
    'function* a() {}',
    'while (true) { break }',
    `(function () {
      var a = 1;  // should not hoist this
      arguments[2] = 3;
      (function () {
          eval('');
      }());
  }());`,
    '(class {set a(b) {"use strict";}})',
    `var a = {};
    a.b = 1;
    a.c = 2;
    d.e(a.c);`,
    `(function () {
      (function () {
      }());
  }());`,
    '````',
    'class a { static *[b]() {} }',
    'a && (() => {});',
    'for(let a in [1,2]) 3',
    `(function () {
      a(typeof b !== 'c');
  }());`,
    `(function () {
      void ((a) ? 1 : b);
  }());`,
    `(function(){ return/* Multiline
      Comment */a; })`,
    'let {a} = {}',
    '(yield) => 1;',
    'a++',
    `while (a) {
      {
          b();
          b();
      }
  }`,
    'a( `<span>${b}</span>`,     `<a href="${c}">${d}</a>`  );',
    '// line comment',
    '"use strict";var a = function(){}(b())',
    `(function () {
      (function () {
      }());
  }());`,
    '/* header */ (function(){ var a = 1; }).b(this)',
    'a << b << c',
    '({a,b,} = 1)',
    '{ let a }',
    `(function (a, ...b){});
    (function (...c){});`,
    'a()``',
    `b: for (var a = 1; a < 2; ++a) {
      if (a < 3) continue b;
      c.d(a);
  }`,
    `(function () {
      function arguments() {
        a(arguments);
      }
      a(arguments);
    }());`,
    `+{} / 1`,
    `with({}) {
    };`,
    '(a) => ((b, c) => (a, b, c))',
    '(class {3() {}})',
    'a !== b',
    '({ __proto__() { return 1 }, __proto__: 2 })',
    'if (a) { b() /* Some comment */ }',
    'for(a; a < 1; a++) b(a);',
    'a => ({ b: 1 })',
    'let [{a}] = 1',
    '+ /test/',
    'let {} = 1',
    `(class {;;;
      ;a(){}})`,
    'true;false',
    '({ get "a"() {} })',
    '[a, a] = 1',
    /*   `stream.end = function (data) {
      if(ended) return
      ended = true
      if(arguments.length) stream.write(data)
      _end() // will emit or queue
      return stream
    }
  `,*/
    'a instanceof b',
    'a in b',
    '[a, {b:d}, c] = obj',
    '[a, {[b]:d}, c] = obj',
    '[a, {[b]: c}, d] = e',
    'eval; log(eval); eval.foo; eval[foo]; eval.foo = bar; eval[foo] = bar;',
    '[a = [b] = c, {[d]: e}, f] = g',
    'log({foo: [bar]});',
    'log({foo: [bar]} = obj);',
    'a<b',
    'a>=b',
    'function f(){   return;    }',
    '[...{a = b} = c];',
    '([...{a = b} = c]) => d;',
    'arguments; log(arguments); arguments.foo; arguments[foo]; arguments.foo = bar; arguments[foo] = bar;',
    'class a extends b { c() { [super.d] = e } }',
    '1 + (a(), b(), c())',
    '(a) => a * yield;',
    'a - b',
    'new a()',
    'switch (x) { default: class X {} }',
    'switch (x) { case x: class X {} }',
    'try { } finally { class X {} }',
    'try { class X {} } finally {}',
    '{ const y = x }',
    'switch (x) { case x: const y = x }',
    'try { } catch (e) { const y = x }',
    'try { } finally { let y = x }',
    'switch (x) { default: function * f() {} }',
    'switch (x) { case x: function * f() {} }',
    'try { } finally { function * f() {} }',
    'try { } catch (e) { function * f() {} }',
    'switch (x) { default: async function f() {} }',
    'try { } catch (e) { async function f() {} }',
    'switch (x) { default: function f() {} }',
    'switch (x) { case x: function f() {} }',
    'try { } catch (e) { function f() {} }',
    '(a)--',
    `for (;;) {
      if (a) {
          if (b) {
              continue;
          }
          c()  // This should not removed and translation should not occur.
      }
  }`,
    'a(....0)',
    'delete (1, a, 2)',
    '1 instanceof 2',
    '(a = b("100")) != a ',
    'var let',
    `
    var a;
    // compress these

    a = true     && b;
    a = 1        && c.d("a");
    a = 2 * 3    && 4 * b;
    a = 5 == 6   && b + 7;
    a = "e" && 8 - b;
    a = 9 + ""   && b / 10;
    a = -4.5     && 11 << b;
    a = 12        && 13;

    a = false     && b;
    a = NaN       && c.d("f");
    a = 14         && c.d("g");
    a = h && 15 * b;
    a = null      && b + 16;
    a = 17 * 18 - 19 && 20 - b;
    a = 21 == 22   && b / 23;
    a = !"e" && 24 % b;
    a = 25         && 26;

    // don't compress these

    a = b        && true;
    a = c.d("a") && 27;
    a = 28 - b    && "e";
    a = 29 << b   && -4.5;

    a = b        && false;
    a = c.d("f") && NaN;
    a = c.d("g") && 30;
    a = 31 * b    && h;
    a = b + 32    && null;`,
    'function a() {} function a() {}',
    `(/* comment */{
      a: null
  })`,
    'a = { }',
    '/test/ && /test/',
    'a => { return 1; }',
    'a||(b||(c||(d||(e||f))))',
    'for(let a of [1,2]) 3',
    '({})=>1;',
    '({ "a": 1 })',
    `// mangle to the same name 'a'
    c: {
              a("b");
              break c;
    }
    c: {
              a("b");
              break c;
    }`,
    'if (!a) debugger;',
    'a ** b',
    'new a(...b, ...c, ...d);',
    'a = { set b (c) {} } ',
    /*'"\\0"',
  '"\\x05"',
  '"\\x06"',
  '"\\18"',
  '"\\00"',
  '"\\218"',
  '"\\66"',
  '"\\210"',
  `'\\48'`,
  `'\\07'`,
  `'\\168'`,
  `'\\318'`,
  `'\\500'`,
  `'\\160'`,
  `'\\301'`,
  `'\\377'`,*/
    'if (x) function f() { return 23; } else function f() { return 42; }',
    'if (x) function f() {}',
    `var foo = [23]
  -->[0];`,
    'x = -1 <!--x;',
    'if (true) function f() {  } else function _f() {}',
    'if (true) function f() { return "foo"; } else function _f() {}',
    'for (let f of [0]) {}',
    'for (let f; ; ) {}',
    'for (let f; ; ) {}',
    'for (let f in { key: 0 }) {}',
    `(function(f) {
  init = f;
  switch (1) {
    case 1:
      function f() {  }
  }
  after = f;
}(123));`,
    ` try {
  throw {};
} catch ({ f }) {
switch (1) {
  default:
    function f() {  }
}
}
`,
    `{
  function f() {
    return 'first declaration';
  }
}`,
    `{
  function f() { return 'declaration'; }
}`,
    'if (true) function f() {} else function _f() {}',
    'if (false) function _f() {} else function f() { }',
    `for (let f; ; ) {
  if (false) ; else function f() {  }
    break;
  }`,
    `try {
throw {};
} catch ({ f }) {
switch (1) {
case 1:
function f() {  }
}
}`,
    'if (true) function f() {  } else function _f() {}',
    'if (true) function f() {  } else function _f() {}',
    `switch (1) {
  default:
    function f() {  }
}`,
    `try {
  throw {};
} catch ({ f }) {
switch (1) {
  case 1:
    function f() {  }
}
}`,
    `{
  let f = 123;
  switch (1) {
    case 1:
      function f() {  }
  }
  }`,
    `
  for (let f in { key: 0 }) {
  switch (1) {
    case 1:
      function f() {  }
  }
  }`
  ];

  for (const arg of programs) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Empty);
      });
    });
  }
});
