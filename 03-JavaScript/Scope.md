# 🔭 Scope — Interview Q&A

> **Category:** JavaScript | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-22

---

## 🔵 Types of Scope

---

### Q1. What is scope in JavaScript?

**Answer:**
Scope defines **where variables and functions are accessible** in your code. It's determined at the time of writing (lexically) — not at runtime.

**3 main scope types:**
1. **Global Scope** — accessible everywhere
2. **Function Scope** — accessible only inside the function
3. **Block Scope** — accessible only inside `{}` (ES6 with `let`/`const`)

```javascript
const global = 'I am global'; // Global scope

function outer() {
  const funcVar = 'I am function-scoped'; // Function scope

  if (true) {
    const blockVar = 'I am block-scoped'; // Block scope
    let alsoBlock  = 'also block-scoped';
    var leaks      = 'I leak to function scope!'; // var — no block scope!

    console.log(global);   // ✅
    console.log(funcVar);  // ✅
    console.log(blockVar); // ✅
  }

  console.log(funcVar);  // ✅
  console.log(leaks);    // ✅ var leaks out of block
  console.log(blockVar); // ❌ ReferenceError — block scoped
}
```

---

### Q2. What is lexical scope?

**Answer:**
Lexical scope means **scope is determined by where functions/variables are written in the code** (at declaration time), not where they're called from.

```javascript
const x = 10;

function outer() {
  const y = 20;

  function inner() {
    const z = 30;
    console.log(x + y + z); // 60 — access to outer AND global scope!
  }

  inner();
}

outer(); // Works
inner(); // ❌ ReferenceError — inner not in scope here
```

The scope chain is fixed at **write time**. `inner` always has access to `outer` and global — regardless of how or where `inner` is called.

---

### Q3. What is the scope chain?

**Answer:**
When JavaScript looks up a variable, it searches:
1. Current scope
2. Outer scope
3. Further outer scopes...
4. Global scope
5. Not found → `ReferenceError`

```javascript
const a = 'global';

function level1() {
  const b = 'level1';

  function level2() {
    const c = 'level2';

    function level3() {
      // Scope chain lookup:
      console.log(c); // Found in level3? No → level2? Yes → 'level2'
      console.log(b); // Found in level3? No → level2? No → level1? Yes
      console.log(a); // Found in level3? No → ... → global? Yes
      console.log(d); // Not found anywhere → ReferenceError!
    }

    level3();
  }
  level2();
}
level1();
```

---

### Q4. What is the difference between `var`, `let`, `const` in terms of scope?

**Answer:**

```javascript
function test() {
  // var — function scoped
  if (true) {
    var x = 10; // Accessible anywhere in test()
  }
  console.log(x); // 10 ✅ — var leaks from block

  // let — block scoped
  if (true) {
    let y = 20; // Only accessible in this if block
  }
  console.log(y); // ❌ ReferenceError

  // const — block scoped
  if (true) {
    const z = 30; // Only accessible in this if block
  }
  console.log(z); // ❌ ReferenceError
}
```

---

## 🟡 Intermediate

---

### Q5. What is variable shadowing?

**Answer:**
A variable in an inner scope **shadows** (hides) a variable with the same name in an outer scope.

```javascript
const name = 'Global Alice';

function greet() {
  const name = 'Function Alice'; // Shadows global 'name'
  console.log(name); // 'Function Alice' — inner wins
}

greet();
console.log(name); // 'Global Alice' — outer unchanged
```

```javascript
let count = 0;

function update() {
  let count = 10; // Shadows outer count
  count++;
  console.log(count); // 11 — inner count, not outer!
}

update();
console.log(count); // 0 — outer count unchanged!
```

> ⚠️ Shadowing can cause bugs — the outer variable appears to not update when you meant to.

---

### Q6. Can `let` shadow `var` and vice versa?

**Answer:**
`let` can shadow `var` in an inner block, but **`let` cannot re-declare in the same scope where `var` already exists**:

```javascript
var x = 1;
let x = 2; // ❌ SyntaxError — can't let-declare where var already declared in same scope

// But in inner block — shadowing is OK:
var y = 1;
{
  let y = 2; // ✅ Shadows outer var y in this block
  console.log(y); // 2
}
console.log(y); // 1
```

---

### Q7. What is the global scope and what is the danger of global variables?

**Answer:**
Global variables are accessible everywhere. In browsers, global `var` declarations become properties of `window`.

```javascript
var globalVar = 'I am global';
console.log(window.globalVar); // 'I am global'

let globalLet = 'also global';
console.log(window.globalLet); // undefined — let doesn't attach to window!

// Dangers:
// 1. Name collisions with libraries
// 2. Hard to track changes
// 3. Creates tight coupling
// 4. Security issues (exposed to scripts)

// Accidental global (dangerous!):
function fn() {
  accidental = 'I am global!'; // ❌ No var/let/const — creates global!
}
fn();
console.log(accidental); // 'I am global!'

// Fix — use 'use strict' to prevent this:
'use strict';
function fn() {
  accident = 'error!'; // ReferenceError in strict mode ✅
}
```

---

### Q8. How does `'use strict'` affect scope?

**Answer:**
Strict mode prevents some dangerous scope-related behaviors:

```javascript
'use strict';

// 1. Prevents accidental globals
x = 10; // ReferenceError — must declare

// 2. Prevents duplicate parameters
function fn(a, a) { } // SyntaxError

// 3. this is undefined in standalone functions (not window)
function test() {
  console.log(this); // undefined in strict mode (not window)
}

// 4. Deleting variables throws
let x = 1;
delete x; // SyntaxError

// ES6 modules are automatically in strict mode
```

---

### Q9. What is function scope vs block scope for loops?

**Answer:**
```javascript
// var — one variable shared across all iterations
for (var i = 0; i < 5; i++) { }
console.log(i); // 5 — var leaks out!

// let — each iteration gets its own binding
for (let j = 0; j < 5; j++) { }
console.log(j); // ReferenceError — block scoped!

// Classic closure bug with var in loops:
const funcs = [];
for (var k = 0; k < 3; k++) {
  funcs.push(() => console.log(k)); // All capture the SAME k
}
funcs[0](); // 3 — not 0!
funcs[1](); // 3
funcs[2](); // 3

// Fix with let:
const funcs2 = [];
for (let k = 0; k < 3; k++) {
  funcs2.push(() => console.log(k)); // Each iteration gets own k
}
funcs2[0](); // 0 ✅
funcs2[1](); // 1 ✅
funcs2[2](); // 2 ✅
```

---

## 🔴 Advanced

---

### Q10. What is the Module Scope?

**Answer:**
ES6 Modules have their own scope — everything declared is **private to that module** unless explicitly exported.

```javascript
// math.js — module scope
const PI = 3.14159; // Private to this module
let count = 0;      // Private

export function add(a, b) { return a + b; }
export const multiply = (a, b) => a * b;

// app.js
import { add } from './math.js';
console.log(PI);   // ReferenceError — not exported
console.log(add(2, 3)); // 5 ✅
```

---

### Q11. What does `eval()` do to scope?

**Answer:**
`eval()` executes a string as code in the **current scope** — dangerous and can modify scope.

```javascript
function fn() {
  eval('var secret = 42'); // Creates a variable in fn's scope!
  console.log(secret); // 42
}
fn();

// In strict mode:
'use strict';
function fn2() {
  eval('var x = 1'); // In strict mode, eval gets its OWN scope
  console.log(x);   // ReferenceError — x is in eval's scope, not fn2
}
```

> ❌ Avoid `eval()` — security risk (XSS), performance (can't optimize), and breaks strict mode behavior.

---

### Q12. How does `with` affect scope (and why is it banned)?

**Answer:**
`with` extends the scope chain — `with(obj)` makes `obj`'s properties directly accessible. This makes it impossible to predict what variable refers to what, so it's banned in strict mode.

```javascript
const obj = { a: 1, b: 2 };

with (obj) {
  console.log(a); // 1 — refers to obj.a
  console.log(b); // 2 — refers to obj.b
}

// Banned in strict mode:
'use strict';
with (obj) { } // SyntaxError
```

---

## 📝 Quick Reference

```javascript
// Scope types
// Global:   accessible everywhere
// Module:   accessible within the module (ES6)
// Function: accessible within the function (var)
// Block:    accessible within {} (let, const)

// Scope chain — inner → outer → global → ReferenceError

// Key rules:
// • var     → function scoped (leaks from blocks!)
// • let     → block scoped (TDZ)
// • const   → block scoped (TDZ, no reassign)
// • Lexical → scope determined by WHERE code is WRITTEN
// • Shadowing → inner variable hides outer with same name

// Avoid:
// • Implicit globals (accidental = ...)
// • var in for loops (use let)
// • eval() — modifies scope at runtime
// • with — extends scope chain unpredictably
```

---

*Senior UI Developer Interview Prep — JavaScript Scope*
