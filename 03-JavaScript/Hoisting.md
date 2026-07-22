# 🏗️ Hoisting — Interview Q&A

> **Category:** JavaScript | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-22

---

## 🔵 Understanding Hoisting

---

### Q1. What is hoisting in JavaScript?

**Answer:**
Hoisting is JavaScript's behavior of **moving declarations to the top of their scope** before code execution. The JS engine processes declarations in a first pass before running the code.

> ⚠️ Only **declarations** are hoisted — not initializations!

```javascript
// What you write:
console.log(x); // What happens?
var x = 5;
console.log(x); // What happens?

// What JS "sees" (after hoisting):
var x;          // Declaration hoisted, initialized to undefined
console.log(x); // undefined
x = 5;          // Assignment stays in place
console.log(x); // 5
```

---

### Q2. How is `var` hoisted differently from `let` and `const`?

**Answer:**

| | `var` | `let` / `const` |
|--|-------|-----------------|
| Hoisted | ✅ Yes | ✅ Yes |
| Initialized | ✅ `undefined` | ❌ **Not initialized (TDZ)** |
| Accessible before declaration | ✅ `undefined` | ❌ `ReferenceError` |

```javascript
// var — hoisted AND initialized to undefined
console.log(a); // undefined (no error)
var a = 10;
console.log(a); // 10

// let — hoisted but in TDZ
console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 20;

// const — same as let
console.log(c); // ReferenceError
const c = 30;
```

---

### Q3. What is the Temporal Dead Zone (TDZ)?

**Answer:**
The TDZ is the period from when a `let`/`const` variable enters scope (hoisted) until its declaration is reached in the code. Accessing it during TDZ throws `ReferenceError`.

```javascript
{
  // ← TDZ for 'name' begins here
  console.log(name); // ReferenceError! (TDZ)
  console.log(typeof name); // ReferenceError! (even typeof!)

  let name = 'Alice'; // ← TDZ ends here
  console.log(name);  // 'Alice'
}
```

```javascript
// Why TDZ exists — prevents this confusion:
let x = 1;
function fn() {
  console.log(x); // Should this be 1 (outer) or undefined (inner)?
  let x = 2;      // TDZ makes this an error — clearer intent!
}
```

---

### Q4. How are function declarations hoisted vs function expressions?

**Answer:**

**Function declarations — fully hoisted (declaration + body):**
```javascript
greet(); // ✅ Works! "Hello Alice"

function greet() {       // Entire function is hoisted
  console.log('Hello Alice');
}
```

**Function expressions — only variable declaration hoisted:**
```javascript
greet(); // ❌ TypeError: greet is not a function

var greet = function() { // var hoisted as undefined, assignment not hoisted
  console.log('Hello');
};

// What JS sees:
var greet;     // undefined
greet();       // TypeError — calling undefined()
greet = function() { ... };
```

**Arrow functions (assigned to `let`/`const`) — TDZ:**
```javascript
greet(); // ❌ ReferenceError (TDZ)

const greet = () => {
  console.log('Hello');
};
```

---

### Q5. What output does this produce?

```javascript
var x = 1;

function fn() {
  console.log(x); // A
  var x = 2;
  console.log(x); // B
}

fn();
console.log(x);   // C
```

**Answer:**
```
A: undefined   — var x is hoisted inside fn(), shadows outer x, but not yet assigned
B: 2           — after assignment
C: 1           — outer var x unchanged
```

Inside `fn()`, JS sees:
```javascript
function fn() {
  var x;           // Hoisted to top of function
  console.log(x);  // undefined
  x = 2;
  console.log(x);  // 2
}
```

---

## 🟡 Intermediate

---

### Q6. Are class declarations hoisted?

**Answer:**
Classes are hoisted like `let`/`const` — they enter the TDZ and cannot be used before declaration.

```javascript
const p = new Person(); // ❌ ReferenceError (TDZ)

class Person {
  constructor(name) { this.name = name; }
}

const p2 = new Person('Alice'); // ✅ Works
```

---

### Q7. What happens with duplicate `var` declarations?

**Answer:**
`var` allows re-declaration — the second declaration is ignored, but assignment takes effect.

```javascript
var x = 1;
var x = 2; // No error — re-declaration ignored
console.log(x); // 2 — but the assignment (= 2) still runs!

// var in different if blocks
if (true) { var msg = 'hello'; }
if (true) { var msg = 'world'; } // OK — just overwrites
console.log(msg); // 'world'

// let/const throw:
let y = 1;
let y = 2; // SyntaxError: Identifier 'y' has already been declared
```

---

### Q8. What about hoisting with function declarations inside blocks?

**Answer:**
This is a well-known source of confusion. Function declarations inside blocks behave differently in strict mode vs sloppy mode.

```javascript
// Sloppy mode (browsers) — function hoisted to function scope but as undefined
if (true) {
  function test() { return 'inside'; }
}
console.log(typeof test); // 'function' — but only because if(true) ran

// Strict mode — block-scoped
'use strict';
if (true) {
  function test() { return 'inside'; }
}
console.log(typeof test); // 'undefined' in strict mode

// ✅ Always use function expressions in blocks to be safe:
if (condition) {
  const test = () => 'safe';
}
```

---

### Q9. Does `import` get hoisted?

**Answer:**
Yes! ES6 `import` declarations are **fully hoisted** — they are evaluated before any code in the module runs. This is why you can use imports at the top of functions even if the import is declared later (though best practice is to always put imports at the top).

```javascript
// This works — import is hoisted
console.log(add(2, 3)); // 5

import { add } from './math.js'; // Hoisted! Evaluated first.
```

> ✅ Unlike `require()` (CommonJS), ES6 `import` is always at the top and hoisted.

---

### Q10. What is the output?

```javascript
function foo() {
  console.log(1);
}

foo(); // A

function foo() {
  console.log(2);
}

foo(); // B
```

**Answer:**
```
A: 2
B: 2
```

Both function declarations are hoisted. The **second declaration overwrites the first** during hoisting. So by the time any code runs, `foo` is already the function that logs `2`.

What JS sees:
```javascript
// After hoisting:
function foo() { console.log(2); } // Second one wins!

foo(); // 2
foo(); // 2
```

---

## 🔴 Advanced

---

### Q11. What is the output of this tricky example?

```javascript
var a = 1;

function outer() {
  var b = 2;
  function inner() {
    var c = 3;
    console.log(a, b, c); // A
  }
  inner();
  console.log(a, b);      // B
}

outer();
console.log(a);            // C
```

**Answer:**
```
A: 1 2 3
B: 1 2
C: 1
```
- `inner()` has access to `a`, `b`, `c` via scope chain
- `outer()` has access to `a`, `b` but not `c`
- Global has access to only `a`

---

### Q12. How does hoisting interact with `let` in a loop?

**Answer:**
```javascript
// var — single binding, shared across iterations
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 3, 3, 3 — one var i, hoisted to function scope

// let — new binding per iteration, NOT just TDZ
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 0, 1, 2 — each iteration has its own let binding
```

---

## 📝 Quick Reference

```
Hoisting order of precedence (highest wins):
1. Function declarations (fully hoisted — declaration + body)
2. var (hoisted + initialized as undefined)
3. let/const (hoisted but in TDZ — ReferenceError if accessed early)
4. Class declarations (TDZ — like let/const)

Rule of thumb:
- Always declare before use
- Prefer let/const over var
- Put function declarations at the top of their scope
- TDZ = "hoisted but not initialized" = ReferenceError
```

```javascript
// What runs first:
// 1. All function declarations are hoisted (full body)
// 2. var declarations hoisted (undefined)
// 3. Code executes top to bottom
// 4. Assignments happen when reached

greet();              // ✅ Function declarations work before definition
function greet() { }

sayHi();              // ❌ undefined — var hoisted as undefined
var sayHi = () => {};
```

---

*Senior UI Developer Interview Prep — JavaScript Hoisting*
