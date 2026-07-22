# 🔒 Closures — Interview Q&A

> **Category:** JavaScript | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-22

---

## 🔵 Understanding Closures

---

### Q1. What is a closure in JavaScript?

**Answer:**
A closure is a function that **remembers the variables from its outer (lexical) scope** even after that outer function has finished executing. The inner function "closes over" the outer variables.

```javascript
function outer() {
  let count = 0; // Outer variable

  function inner() {
    count++;       // inner "closes over" count
    console.log(count);
  }

  return inner;
}

const counter = outer(); // outer() has finished, but...
counter(); // 1  — count still accessible!
counter(); // 2  — count is remembered!
counter(); // 3
```

> 💡 A closure = function + its surrounding **lexical environment**.

---

### Q2. Why are closures important? What problems do they solve?

**Answer:**

1. **Data privacy / encapsulation** — hide internal state
2. **Stateful functions** — functions that remember state between calls
3. **Factory functions** — create multiple instances with private data
4. **Partial application / currying**
5. **Event handlers** — remember context

---

### Q3. How do closures enable data privacy?

**Answer:**
```javascript
// Without closure — data is exposed
let _count = 0; // Public — anyone can modify
function increment() { _count++; }

// With closure — data is private
function createCounter() {
  let count = 0; // Private — only accessible via returned methods

  return {
    increment() { count++; },
    decrement() { count--; },
    getCount()  { return count; }
  };
}

const counter = createCounter();
counter.increment();
counter.increment();
console.log(counter.getCount()); // 2
console.log(counter.count);      // undefined — truly private!
```

---

### Q4. Give a real-world use case of closures.

**Answer:**

**1. Memoization (caching):**
```javascript
function memoize(fn) {
  const cache = {}; // Closed over — persists between calls

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache[key] !== undefined) {
      console.log('Cache hit!');
      return cache[key];
    }
    cache[key] = fn(...args);
    return cache[key];
  };
}

const expensiveCalc = memoize((n) => {
  console.log('Computing...');
  return n * n;
});

expensiveCalc(5); // Computing... → 25
expensiveCalc(5); // Cache hit!   → 25
```

**2. Event handler with context:**
```javascript
function setupButton(buttonId, message) {
  const btn = document.getElementById(buttonId);

  btn.addEventListener('click', function() {
    // Closes over 'message' — different for each button
    alert(message);
  });
}

setupButton('btn1', 'Hello from button 1');
setupButton('btn2', 'Hello from button 2');
```

**3. Module pattern:**
```javascript
const BankAccount = (function() {
  let balance = 0; // Private

  return {
    deposit(amount)  { balance += amount; },
    withdraw(amount) {
      if (amount > balance) throw new Error('Insufficient funds');
      balance -= amount;
    },
    getBalance()     { return balance; }
  };
})();
```

---

## 🟡 Classic Closure Problems

---

### Q5. The classic `var` in loop closure bug — explain and fix it.

**Answer:**

**Problem:**
```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
}
// Output: 3 3 3 — NOT 0 1 2!
```

**Why:** `var` is function-scoped. All 3 callbacks share the **same `i`**. By the time they run (1 second later), the loop has finished and `i === 3`.

**Fix 1 — Use `let` (block-scoped):**
```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
}
// Output: 0 1 2 ✅ — let creates a new binding per iteration
```

**Fix 2 — IIFE (ES5 way):**
```javascript
for (var i = 0; i < 3; i++) {
  (function(j) { // j is a new copy of i
    setTimeout(() => console.log(j), 1000);
  })(i);
}
// Output: 0 1 2 ✅
```

**Fix 3 — Bind:**
```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(console.log.bind(null, i), 1000);
}
```

---

### Q6. What is an IIFE (Immediately Invoked Function Expression)?

**Answer:**
An IIFE is a function that's **defined and called immediately**. Creates a private scope.

```javascript
// Syntax
(function() {
  const private = 'Cannot access from outside';
  console.log('Runs immediately!');
})();

// Arrow IIFE
(() => {
  console.log('Arrow IIFE');
})();

// With parameters
(function(name) {
  console.log(`Hello, ${name}!`);
})('Alice'); // Hello, Alice!

// Why use IIFE?
// 1. Avoid polluting global scope
// 2. Create private scope (pre-ES6 modules)
// 3. One-time initialization code
```

---

### Q7. What will this closure output?

```javascript
function makeAdder(x) {
  return function(y) {
    return x + y;
  };
}

const add5  = makeAdder(5);
const add10 = makeAdder(10);

console.log(add5(3));   // ?
console.log(add10(3));  // ?
console.log(add5(10));  // ?
```

**Answer:**
```
8   — add5 closes over x=5,  5+3  = 8
13  — add10 closes over x=10, 10+3 = 13
15  — add5 closes over x=5,  5+10 = 15
```

Each call to `makeAdder` creates a **new closure with its own `x`**. `add5` and `add10` are independent.

---

### Q8. Explain closure with `setTimeout` in this example:

```javascript
function createTimer() {
  let seconds = 0;

  setInterval(() => {
    seconds++;
    console.log(`Time: ${seconds}s`);
  }, 1000);

  return () => seconds; // Getter
}

const getTime = createTimer();
// After 3 seconds...
console.log(getTime()); // ?
```

**Answer:**
After 3 seconds, `getTime()` returns `3`. The arrow function in `setInterval` and the returned getter function **both close over the same `seconds` variable**. They share the same reference — updates from the interval are visible to the getter.

---

## 🔴 Advanced

---

### Q9. What is a closure memory leak and how do you avoid it?

**Answer:**
Closures can prevent garbage collection if they hold references to large objects that are no longer needed.

```javascript
// ❌ Memory leak
function attachHandler() {
  const largeData = new Array(1000000).fill('data'); // 1M items!

  document.getElementById('btn').addEventListener('click', () => {
    console.log('clicked'); // Closes over largeData — never GC'd!
  });
}

// ✅ Fix — release reference
function attachHandler() {
  const largeData = new Array(1000000).fill('data');
  const result = processData(largeData); // Process first
  // largeData is no longer referenced in the closure
  document.getElementById('btn').addEventListener('click', () => {
    console.log(result); // Only result is captured
  });
}
```

---

### Q10. How does closure relate to the module pattern in ES6?

**Answer:**
ES6 modules are built on closure principles — each module has its own scope, private state, and exports only what it explicitly exports.

```javascript
// Manual module (closure-based)
const counter = (() => {
  let count = 0;
  return {
    inc: () => ++count,
    get: () => count
  };
})();

// ES6 module (same concept, cleaner syntax)
// counter.js
let count = 0;
export const inc = () => ++count;
export const get = () => count;
// count is private to this module — closure!
```

---

### Q11. Partial application using closures:

**Answer:**
```javascript
// Partial application — fix some arguments, return new function
function partial(fn, ...presetArgs) {
  return function(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

function multiply(a, b, c) {
  return a * b * c;
}

const double = partial(multiply, 2);
const triple = partial(multiply, 3);

console.log(double(5, 4));  // 40  — 2 * 5 * 4
console.log(triple(5, 4));  // 60  — 3 * 5 * 4

// Real use: API caller with preset base URL
const get = partial(fetch, 'https://api.example.com');
get('/users'); // Calls fetch('https://api.example.com', '/users')
```

---

### Q12. What is the difference between closure and scope?

**Answer:**

| | Scope | Closure |
|--|-------|---------|
| What | The **current context** where variables are accessible | A function + its **remembered** scope |
| When | Determined at declaration time (lexical) | Created when a function is defined inside another |
| Lifetime | Destroyed when execution context ends | **Persists** as long as the inner function exists |

```javascript
function outer() {
  const x = 10; // In scope during outer() execution

  return function inner() {
    // Scope: x is accessible because inner was DEFINED inside outer
    // Closure: inner REMEMBERS x even after outer() finishes
    return x;
  };
}

const fn = outer(); // outer() done — normally x would be GC'd
console.log(fn());  // 10 — closure keeps x alive!
```

---

## 📝 Quick Reference

```javascript
// Closure = function + its lexical environment
function outer() {
  let private = 'secret';
  return () => private; // inner closes over private
}

// Use cases:
// 1. Data privacy (counter, bank account)
// 2. Memoization (cache results)
// 3. Partial application / currying
// 4. Module pattern (IIFE)
// 5. Event handlers with context

// Classic bug: var in loop
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 3 3 3 ❌
}
// Fix with let:
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 0 1 2 ✅
}
```

---

*Senior UI Developer Interview Prep — JavaScript Closures*
