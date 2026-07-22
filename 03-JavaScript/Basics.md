# 🟨 JavaScript Basics — Interview Q&A

> **Category:** JavaScript | **Level:** Beginner → Intermediate
> **Last Updated:** 2026-07-22

---

## 🔵 Data Types

---

### Q1. What are the data types in JavaScript?

**Answer:**
JavaScript has **8 data types** — 7 primitive + 1 non-primitive.

| Type | Category | Example |
|------|----------|---------|
| `string` | Primitive | `"hello"` |
| `number` | Primitive | `42`, `3.14`, `NaN`, `Infinity` |
| `bigint` | Primitive | `9007199254740991n` |
| `boolean` | Primitive | `true`, `false` |
| `undefined` | Primitive | `let x;` → `x` is `undefined` |
| `null` | Primitive | `let x = null;` |
| `symbol` | Primitive | `Symbol('id')` |
| `object` | Non-Primitive | `{}`, `[]`, `function(){}`, `new Date()` |

> 💡 Primitives are **immutable** and stored by **value**. Objects are **mutable** and stored by **reference**.

---

### Q2. What is the difference between `null` and `undefined`?

**Answer:**

| | `undefined` | `null` |
|--|-------------|--------|
| Meaning | Variable declared but **not assigned** | Intentional **absence of value** |
| Type | `typeof undefined === 'undefined'` | `typeof null === 'object'` ← bug! |
| Set by | JS engine (automatically) | Developer (explicitly) |

```javascript
let a;
console.log(a);           // undefined — declared, not assigned

let b = null;
console.log(b);           // null — intentionally empty

console.log(null == undefined);  // true  — loose equality
console.log(null === undefined); // false — strict equality
```

---

### Q3. What are primitive vs reference types? How are they stored?

**Answer:**

**Primitives** — stored on the **stack** (by value):
```javascript
let a = 10;
let b = a;   // Copy of value
b = 20;
console.log(a); // 10 — a unchanged!
```

**Reference types** — stored on the **heap** (by reference):
```javascript
let obj1 = { name: 'Alice' };
let obj2 = obj1;         // Same reference
obj2.name = 'Bob';
console.log(obj1.name);  // 'Bob' — both point to same object!
```

---

### Q4. What is `typeof` and what are its quirks?

**Answer:**
```javascript
typeof 42            // "number"
typeof "hello"       // "string"
typeof true          // "boolean"
typeof undefined     // "undefined"
typeof Symbol()      // "symbol"
typeof 42n           // "bigint"
typeof function(){}  // "function"   ← special case (object but returns "function")
typeof {}            // "object"
typeof []            // "object"     ← arrays are objects!
typeof null          // "object"     ← famous bug in JS spec

// Better check for null:
value === null

// Better check for array:
Array.isArray([])    // true
```

---

## 🟡 Type Coercion

---

### Q5. What is type coercion in JavaScript?

**Answer:**
Type coercion is JS **automatically converting** one type to another.

**Implicit coercion:**
```javascript
"5" + 3       // "53"  — number coerced to string (+ prefers string)
"5" - 3       // 2     — string coerced to number (- only works on numbers)
"5" * "3"     // 15    — both coerced to number
true + 1      // 2     — true → 1
false + 1     // 1     — false → 0
null + 1      // 1     — null → 0
undefined + 1 // NaN   — undefined → NaN
```

**Explicit coercion:**
```javascript
Number("42")      // 42
Number(true)      // 1
Number(null)      // 0
Number(undefined) // NaN
Number("")        // 0
Number("abc")     // NaN

String(42)        // "42"
Boolean(0)        // false
Boolean("")       // false
Boolean(null)     // false
Boolean(undefined)// false
Boolean(NaN)      // false
Boolean([])       // true  ← gotcha! empty array is truthy
Boolean({})       // true  ← gotcha! empty object is truthy
```

---

### Q6. What is the difference between `==` and `===`?

**Answer:**

| | `==` (loose equality) | `===` (strict equality) |
|--|----------------------|------------------------|
| Type check | **Converts** types before comparing | **No** type conversion |
| Safer | No | Yes |

```javascript
0 == false    // true  — false coerced to 0
0 === false   // false — different types

"" == false   // true
"" === false  // false

null == undefined  // true
null === undefined // false

1 == "1"      // true  — "1" coerced to 1
1 === "1"     // false
```

> ✅ Always use `===` unless you specifically need type coercion (rare).

---

### Q7. What are falsy values in JavaScript?

**Answer:**
These 8 values are falsy (evaluate to `false` in boolean context):

```javascript
if (false)     { } // falsy
if (0)         { } // falsy
if (-0)        { } // falsy
if (0n)        { } // falsy (BigInt zero)
if ("")        { } // falsy (empty string)
if (null)      { } // falsy
if (undefined) { } // falsy
if (NaN)       { } // falsy

// Everything else is TRUTHY including:
if ([])   { console.log('truthy!') } // [] is truthy!
if ({})   { console.log('truthy!') } // {} is truthy!
if ("0")  { console.log('truthy!') } // non-empty string is truthy
```

---

## 🟡 Variables

---

### Q8. What is the difference between `var`, `let`, and `const`?

**Answer:**

| | `var` | `let` | `const` |
|--|-------|-------|---------|
| Scope | **Function** scoped | **Block** scoped | **Block** scoped |
| Hoisting | Hoisted + initialized to `undefined` | Hoisted but **TDZ** (not accessible) | Hoisted but **TDZ** |
| Re-declare | ✅ Yes | ❌ No | ❌ No |
| Re-assign | ✅ Yes | ✅ Yes | ❌ No |
| Global property | Becomes `window.x` | No | No |

```javascript
// var — function scoped
function test() {
  if (true) {
    var x = 10; // accessible outside if block!
  }
  console.log(x); // 10 ← leaks out of block!
}

// let — block scoped
function test2() {
  if (true) {
    let y = 10;
  }
  console.log(y); // ReferenceError — y not defined
}

// const — must be initialized, can't reassign
const obj = { name: 'Alice' };
obj.name = 'Bob'; // ✅ OK — mutating the object
obj = {};         // ❌ TypeError — can't reassign const
```

---

### Q9. What is the Temporal Dead Zone (TDZ)?

**Answer:**
The TDZ is the period between when `let`/`const` variable is **hoisted** (lifted to top of scope) and when it's **initialized** (assigned a value). Accessing it during TDZ throws a `ReferenceError`.

```javascript
console.log(x); // ReferenceError — TDZ!
let x = 10;
console.log(x); // 10 — after initialization

// vs var:
console.log(y); // undefined — var is hoisted AND initialized
var y = 10;
```

---

## 🟡 Operators

---

### Q10. What is the difference between `&&`, `||`, and `??` (nullish coalescing)?

**Answer:**

```javascript
// && — returns first FALSY or last value
0 && "hello"      // 0     — 0 is falsy, returns it
"hi" && "hello"   // "hello" — "hi" is truthy, continues
null && "hello"   // null  — null is falsy

// || — returns first TRUTHY or last value
0 || "hello"      // "hello" — 0 is falsy, tries next
"hi" || "hello"   // "hi"   — "hi" is truthy, returns it
null || "default" // "default"

// ?? — returns right side only for null/undefined (not other falsy!)
0 ?? "default"    // 0      — 0 is not null/undefined!
"" ?? "default"   // ""     — "" is not null/undefined!
null ?? "default" // "default"
undefined ?? "default" // "default"
```

**Practical use:**
```javascript
// || can have bugs with 0 or ""
const count = userCount || 10; // Bug if userCount is 0!

// ?? is safer for default values
const count = userCount ?? 10; // Only defaults if undefined/null
```

---

### Q11. What does the optional chaining operator `?.` do?

**Answer:**
`?.` safely accesses properties/methods — returns `undefined` instead of throwing if a value is `null` or `undefined`.

```javascript
const user = null;

// Without optional chaining — throws!
user.address.city  // TypeError: Cannot read property of null

// With optional chaining — safe
user?.address?.city  // undefined — no error

// With methods
user?.getProfile?.()  // undefined — method might not exist

// With arrays
arr?.[0]              // undefined if arr is null/undefined

// Combine with nullish coalescing
user?.address?.city ?? 'Unknown City'
```

---

### Q12. What is the difference between `Object.is()` and `===`?

**Answer:**
```javascript
// === edge cases:
NaN === NaN   // false ← weird!
+0 === -0     // true  ← weird!

// Object.is() — mathematically correct:
Object.is(NaN, NaN)  // true  ✅
Object.is(+0, -0)    // false ✅
Object.is(1, 1)      // true
Object.is(1, '1')    // false
```

---

## 🔴 Advanced

---

### Q13. How does JavaScript handle numbers? What is `NaN`?

**Answer:**
JS uses **IEEE 754 double-precision floating point** for all numbers.

```javascript
// Floating point imprecision
0.1 + 0.2 === 0.3  // false!
0.1 + 0.2          // 0.30000000000000004

// Fix:
Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON // true

// NaN — Not a Number
NaN === NaN        // false ← NaN is the only value not equal to itself
isNaN("hello")     // true  (coerces string first)
Number.isNaN("hello") // false ← safer, no coercion
Number.isNaN(NaN)     // true

// Safe integer range
Number.MAX_SAFE_INTEGER // 9007199254740991 (2^53 - 1)
Number.MIN_SAFE_INTEGER // -9007199254740991

// Use BigInt for larger numbers
const big = 9007199254740991n + 1n // 9007199254740992n
```

---

### Q14. What is the difference between shallow copy and deep copy?

**Answer:**
```javascript
const original = { name: 'Alice', address: { city: 'Delhi' } };

// Shallow copy — nested objects still shared
const shallow1 = { ...original };
const shallow2 = Object.assign({}, original);

shallow1.name = 'Bob';          // ✅ original.name unchanged
shallow1.address.city = 'Mumbai'; // ❌ original.address.city ALSO changes!

// Deep copy options:
// 1. JSON (loses functions, undefined, Symbol, Date)
const deep1 = JSON.parse(JSON.stringify(original));

// 2. structuredClone (modern, handles most types)
const deep2 = structuredClone(original); // ✅ Best option

// 3. Recursive function (custom)
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, deepClone(v)])
  );
}
```

---

## 📝 Quick Reference

```javascript
// 8 Types: string, number, bigint, boolean, undefined, null, symbol, object
// Falsy: false, 0, -0, 0n, "", null, undefined, NaN
// Truthy: everything else ([], {}, "0", -1, Infinity)

// Equality
==  // loose — coerces types
=== // strict — no coercion (always prefer this)

// Variable scoping
var   // function scope, hoisted with undefined
let   // block scope, hoisted in TDZ
const // block scope, hoisted in TDZ, no reassign

// Operators
&&   // returns first falsy or last value
||   // returns first truthy or last value
??   // returns right side only if left is null/undefined
?.   // safe property access — returns undefined instead of error
```

---

*Senior UI Developer Interview Prep — JavaScript Basics*
