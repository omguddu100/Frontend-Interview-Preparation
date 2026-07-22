# 🤝 Promise — Interview Q&A

> **Category:** JavaScript | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-22

---

## 🔵 Promise Fundamentals

---

### Q1. What is a Promise and what problem does it solve?

**Answer:**
A Promise is an object representing the **eventual completion or failure** of an asynchronous operation. It solves **callback hell** — deeply nested callbacks that are hard to read and maintain.

```javascript
// ❌ Callback hell
getData(function(data) {
  processData(data, function(processed) {
    saveData(processed, function(result) {
      sendEmail(result, function(resp) {
        // 4 levels deep — nightmare!
      });
    });
  });
});

// ✅ Promises — flat and readable
getData()
  .then(data => processData(data))
  .then(processed => saveData(processed))
  .then(result => sendEmail(result))
  .then(resp => console.log('Done!'))
  .catch(err => console.error('Error:', err));
```

---

### Q2. What are the 3 states of a Promise?

**Answer:**

| State | Description | Can transition to |
|-------|-------------|------------------|
| **Pending** | Initial state — async op in progress | Fulfilled or Rejected |
| **Fulfilled** | Operation completed successfully | None (final) |
| **Rejected** | Operation failed | None (final) |

```javascript
// Creating a Promise
const promise = new Promise((resolve, reject) => {
  // Executor runs SYNCHRONOUSLY!
  console.log('Executor running'); // Runs immediately

  // Resolve → Fulfilled
  resolve('Success data');

  // Reject → Rejected
  // reject(new Error('Something went wrong'));
});

promise
  .then(data => console.log('Fulfilled:', data))    // Success path
  .catch(err => console.error('Rejected:', err))    // Error path
  .finally(() => console.log('Always runs!'));      // Always runs
```

---

### Q3. What is Promise chaining?

**Answer:**
Each `.then()` returns a **new Promise**, enabling chaining. The return value of one `.then()` is passed to the next.

```javascript
fetch('/api/user')
  .then(response => response.json())          // Returns a Promise
  .then(user => fetch(`/api/posts/${user.id}`)) // Returns another Promise
  .then(response => response.json())
  .then(posts => {
    console.log(posts);
    return posts.length; // Can return plain values too
  })
  .then(count => console.log(`${count} posts`))
  .catch(err => console.error(err)); // Catches ANY error in the chain

// Key: return a value/promise from .then() to pass it to the next .then()
// Forgetting to return breaks the chain!
```

---

### Q4. What is `Promise.all()`, `Promise.race()`, `Promise.allSettled()`, `Promise.any()`?

**Answer:**

```javascript
const p1 = fetch('/api/users');
const p2 = fetch('/api/posts');
const p3 = fetch('/api/comments');

// Promise.all — ALL must succeed (fails fast)
Promise.all([p1, p2, p3])
  .then(([users, posts, comments]) => { /* All resolved */ })
  .catch(err => { /* Any ONE rejection → catch runs */ });

// Promise.allSettled — waits for ALL (never rejects)
Promise.allSettled([p1, p2, p3])
  .then(results => {
    results.forEach(r => {
      if (r.status === 'fulfilled') console.log(r.value);
      if (r.status === 'rejected')  console.log(r.reason);
    });
  });

// Promise.race — FIRST to resolve OR reject wins
Promise.race([p1, p2, p3])
  .then(firstResult => console.log('First resolved!'))
  .catch(firstErr => console.log('First rejected!'));

// Promise.any — FIRST to RESOLVE (ignores rejections)
Promise.any([p1, p2, p3])
  .then(firstSuccess => console.log('First success!'))
  .catch(err => console.log('ALL failed!')); // AggregateError

// Timeout pattern using Promise.race:
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), ms)
  );
  return Promise.race([promise, timeout]);
}
```

---

## 🟡 Intermediate

---

### Q5. What is the difference between `Promise.resolve()` and `new Promise(resolve => resolve())`?

**Answer:**
```javascript
// new Promise — creates a new promise with executor (sync)
const p1 = new Promise((resolve) => {
  // Executor runs SYNCHRONOUSLY
  resolve(42);
});

// Promise.resolve — shortcut, wraps a value in resolved promise
const p2 = Promise.resolve(42);

// Both are equivalent, but Promise.resolve is cleaner

// Special case: if you pass a Promise to Promise.resolve, it returns the same promise
const original = new Promise(resolve => resolve(1));
const wrapped = Promise.resolve(original);
console.log(original === wrapped); // true! Not a new promise
```

---

### Q6. How does error handling work in Promise chains?

**Answer:**
```javascript
// .catch() at the end catches any error in the entire chain
fetch('/api/data')
  .then(res => {
    if (!res.ok) throw new Error('HTTP Error'); // Caught by .catch!
    return res.json();
  })
  .then(data => processData(data))    // Error here also caught below
  .catch(err => {
    console.error('Caught:', err);
    return 'fallback value';           // Returning from catch recovers the chain!
  })
  .then(result => console.log(result)); // 'fallback value'

// .catch() in the MIDDLE — recovers and continues:
fetchUser()
  .catch(err => ({ name: 'Anonymous' })) // Recover with default
  .then(user => displayUser(user));       // Still runs with default!

// Re-throwing in catch:
fetchUser()
  .catch(err => {
    if (err.code === 404) return null;  // Handle 404
    throw err;                          // Re-throw all others
  });
```

---

### Q7. What is the danger of unhandled Promise rejections?

**Answer:**
Unhandled rejections are silent bugs — the error is swallowed without any visible failure.

```javascript
// ❌ Silent failure!
fetch('/api/data').then(res => res.json()); // No .catch()!

// ❌ Forgotten catch
async function load() {
  const data = await fetch('/bad-url'); // Throws!
  // No try/catch — UnhandledPromiseRejection
}
load();

// ✅ Always handle:
// Node.js — global handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

// Browser — global handler
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled:', event.reason);
  event.preventDefault(); // Prevents default error logging
});
```

---

### Q8. Write a `Promise.all()` polyfill:

**Answer:**
```javascript
Promise.myAll = function(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an array'));
    }

    const results = [];
    let resolved = 0;
    const total = promises.length;

    if (total === 0) return resolve([]);

    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(value => {
        results[index] = value;
        resolved++;
        if (resolved === total) resolve(results);
      }).catch(reject); // Any rejection → reject all
    });
  });
};

// Test:
Promise.myAll([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
]).then(console.log); // [1, 2, 3]
```

---

### Q9. Implement a `delay` function using Promises:

**Answer:**
```javascript
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Usage
async function main() {
  console.log('Start');
  await delay(2000);   // Wait 2 seconds
  console.log('After 2 seconds');
  await delay(1000);
  console.log('After 1 more second');
}

// Retry with delay:
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url);
    } catch (err) {
      if (i === retries - 1) throw err; // Last attempt — rethrow
      await delay(1000 * (i + 1));      // Exponential backoff
    }
  }
}
```

---

## 🔴 Advanced

---

### Q10. What is Promise executor synchronicity?

**Answer:**
The Promise executor function (the callback you pass to `new Promise()`) runs **synchronously**!

```javascript
console.log('1');

const p = new Promise((resolve) => {
  console.log('2'); // Runs SYNCHRONOUSLY — part of the sync code!
  resolve('done');
});

p.then(val => console.log('4', val)); // Microtask — async

console.log('3');

// Output: 1, 2, 3, 4 done
```

---

### Q11. Implement `Promise.allSettled()` polyfill:

**Answer:**
```javascript
Promise.myAllSettled = function(promises) {
  return Promise.all(
    promises.map(promise =>
      Promise.resolve(promise)
        .then(value => ({ status: 'fulfilled', value }))
        .catch(reason => ({ status: 'rejected', reason }))
    )
  );
};

Promise.myAllSettled([
  Promise.resolve(1),
  Promise.reject('Error'),
  Promise.resolve(3)
]).then(console.log);
// [
//   { status: 'fulfilled', value: 1 },
//   { status: 'rejected',  reason: 'Error' },
//   { status: 'fulfilled', value: 3 }
// ]
```

---

### Q12. How do you cancel a Promise?

**Answer:**
Native Promises are **not cancellable**. Common patterns:

```javascript
// Pattern 1: AbortController (for fetch)
const controller = new AbortController();
const { signal } = controller;

fetch('/api/data', { signal })
  .then(res => res.json())
  .catch(err => {
    if (err.name === 'AbortError') console.log('Request cancelled');
  });

// Cancel after 3 seconds
setTimeout(() => controller.abort(), 3000);

// Pattern 2: Cancellation token
function cancellable(promise) {
  let cancelled = false;
  const wrapped = new Promise((resolve, reject) => {
    promise
      .then(val  => !cancelled && resolve(val))
      .catch(err => !cancelled && reject(err));
  });
  return {
    promise: wrapped,
    cancel: () => { cancelled = true; }
  };
}
```

---

## 📝 Quick Reference

```javascript
// Create
new Promise((resolve, reject) => { resolve(value) || reject(error) });
Promise.resolve(value);
Promise.reject(error);

// Consume
promise
  .then(value => { ... })     // On success
  .catch(err => { ... })      // On failure (or .then(null, handler))
  .finally(() => { ... });    // Always runs

// Combinators
Promise.all([p1, p2])         // All or fail fast (array result)
Promise.allSettled([p1, p2])  // All, never rejects (status+value/reason)
Promise.race([p1, p2])        // First to settle (resolve or reject)
Promise.any([p1, p2])         // First to RESOLVE (AggregateError if all fail)

// States: pending → fulfilled / rejected (immutable once settled)
// Executor is SYNCHRONOUS!
// .then() returns a NEW Promise
// Return value from .then() is passed to next .then()
// Throw in .then() → triggers .catch()
```

---

*Senior UI Developer Interview Prep — JavaScript Promises*
