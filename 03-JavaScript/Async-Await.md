# ⚡ Async/Await — Interview Q&A

> **Category:** JavaScript | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-22

---

## 🔵 Fundamentals

---

### Q1. What is `async/await` and what problem does it solve?

**Answer:**
`async/await` is syntactic sugar over Promises that makes async code look and behave like synchronous code — easier to read, write, and debug.

```javascript
// With Promises
function getUser() {
  return fetch('/api/user')
    .then(res => res.json())
    .then(user => fetch(`/api/posts/${user.id}`))
    .then(res => res.json())
    .then(posts => ({ user, posts }))
    .catch(err => console.error(err));
}

// With async/await — reads like sync code!
async function getUser() {
  try {
    const res  = await fetch('/api/user');
    const user = await res.json();

    const postsRes = await fetch(`/api/posts/${user.id}`);
    const posts    = await postsRes.json();

    return { user, posts };
  } catch (err) {
    console.error(err);
  }
}
```

---

### Q2. What does `async` do to a function?

**Answer:**
- Makes the function **always return a Promise**
- Allows use of `await` inside it

```javascript
async function greet() {
  return 'Hello!';
}

// Is equivalent to:
function greet() {
  return Promise.resolve('Hello!');
}

greet().then(console.log); // 'Hello!'

// If async function throws:
async function fail() {
  throw new Error('Oops!');
}
// Returns a rejected Promise
fail().catch(err => console.log(err.message)); // 'Oops!'
```

---

### Q3. What does `await` do?

**Answer:**
- **Pauses** execution of the async function until the Promise settles
- **Unwraps** the resolved value
- **Throws** if the Promise rejects (caught by try/catch)

```javascript
async function example() {
  console.log('Before await');

  const result = await Promise.resolve(42);
  // JS pauses here, frees up the event loop
  // When promise resolves, resumes here

  console.log('After await:', result); // 'After await: 42'
  return result;
}

console.log('Before function');
example();
console.log('After function call'); // Runs BEFORE 'After await'!

// Output:
// Before function
// Before await
// After function call    ← not blocked by await!
// After await: 42
```

---

## 🟡 Error Handling

---

### Q4. How do you handle errors in async/await?

**Answer:**

**Method 1: try/catch (most common)**
```javascript
async function fetchData() {
  try {
    const res = await fetch('/api/data');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Fetch failed:', err.message);
    return null; // Return fallback
  } finally {
    console.log('Always runs');
  }
}
```

**Method 2: .catch() on the async function**
```javascript
async function fetchData() {
  const res = await fetch('/api/data');
  return res.json();
}

fetchData()
  .then(data => console.log(data))
  .catch(err => console.error(err)); // Handles Promise rejection
```

**Method 3: Error handling utility (no try/catch)**
```javascript
// Helper — returns [error, data] tuple
async function safe(promise) {
  try {
    const data = await promise;
    return [null, data];
  } catch (err) {
    return [err, null];
  }
}

async function main() {
  const [err, data] = await safe(fetch('/api/data'));
  if (err) {
    console.error('Failed:', err);
    return;
  }
  console.log(data);
}
```

---

### Q5. What is the common `await` in a loop mistake?

**Answer:**

```javascript
const userIds = [1, 2, 3, 4, 5];

// ❌ Sequential — waits for each one before starting next (SLOW!)
async function sequential() {
  const users = [];
  for (const id of userIds) {
    const user = await fetchUser(id); // Waits for each
    users.push(user);
  }
  return users; // Total time = sum of all requests
}

// ✅ Parallel — all start at the same time (FAST!)
async function parallel() {
  const promises = userIds.map(id => fetchUser(id)); // All start now
  const users = await Promise.all(promises);          // Wait for all
  return users; // Total time = longest single request
}

// ✅ Concurrent with limit (don't overwhelm the server):
async function chunked(ids, chunkSize = 3) {
  const results = [];
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize);
    const chunkResults = await Promise.all(chunk.map(fetchUser));
    results.push(...chunkResults);
  }
  return results;
}
```

---

### Q6. Can you `await` a non-Promise value?

**Answer:**
Yes! `await` wraps non-Promise values in `Promise.resolve()`.

```javascript
async function test() {
  const a = await 42;       // await Promise.resolve(42) → 42
  const b = await 'hello';  // await Promise.resolve('hello') → 'hello'
  const c = await null;     // → null
  const d = await Promise.resolve(100); // → 100

  console.log(a, b, c, d); // 42 'hello' null 100
}
```

---

## 🟡 Patterns

---

### Q7. How do you run async operations in parallel vs sequentially?

**Answer:**
```javascript
async function run() {
  // SEQUENTIAL — 3 seconds total (1+1+1)
  const a = await delay(1000).then(() => 'A');
  const b = await delay(1000).then(() => 'B');
  const c = await delay(1000).then(() => 'C');
  return [a, b, c];
}

async function runParallel() {
  // PARALLEL — 1 second total (all run at once)
  const [a, b, c] = await Promise.all([
    delay(1000).then(() => 'A'),
    delay(1000).then(() => 'B'),
    delay(1000).then(() => 'C'),
  ]);
  return [a, b, c];
}

// Start ALL first, then await results
async function runParallel2() {
  const promiseA = fetchA(); // Start immediately
  const promiseB = fetchB(); // Start immediately
  const promiseC = fetchC(); // Start immediately

  const a = await promiseA; // Now await
  const b = await promiseB;
  const c = await promiseC;
  return [a, b, c];
}
```

---

### Q8. How do you implement async retry logic?

**Answer:**
```javascript
async function fetchWithRetry(url, maxRetries = 3, delayMs = 1000) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      lastError = err;
      console.warn(`Attempt ${attempt} failed: ${err.message}`);

      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s
        await new Promise(r => setTimeout(r, delayMs * 2 ** (attempt - 1)));
      }
    }
  }

  throw new Error(`All ${maxRetries} attempts failed: ${lastError.message}`);
}
```

---

### Q9. How do you use `async/await` with `forEach`? What's the trap?

**Answer:**
`Array.forEach` does **not await** async callbacks — it fires them all and moves on.

```javascript
// ❌ BROKEN — forEach ignores the awaits!
async function processAll(items) {
  items.forEach(async (item) => {
    await process(item); // Not awaited by forEach!
  });
  console.log('Done?'); // Runs BEFORE items are processed!
}

// ✅ Use for...of (sequential)
async function processAll(items) {
  for (const item of items) {
    await process(item); // Properly awaited
  }
  console.log('All done!');
}

// ✅ Use Promise.all + map (parallel)
async function processAll(items) {
  await Promise.all(items.map(item => process(item)));
  console.log('All done!');
}
```

---

## 🔴 Advanced

---

### Q10. What is `async` IIFE and when is it useful?

**Answer:**
```javascript
// Top-level await (ESM modules support this natively)
// But in older environments or CJS, use async IIFE:

(async () => {
  const data = await fetchData();
  console.log(data);
})();

// Module-level initialization:
const db = await connectToDatabase(); // Works in ES modules (top-level await)

// Non-module — wrap in async IIFE:
(async () => {
  const db = await connectToDatabase();
  const app = express();
  // ... setup
  app.listen(3000);
})();
```

---

### Q11. How does `async/await` work under the hood?

**Answer:**
`async/await` is implemented using **generators** internally. The `await` is essentially a `yield` point.

```javascript
// async/await
async function fetchUser() {
  const res = await fetch('/api/user');
  return res.json();
}

// Roughly equivalent generator-based version:
function* fetchUserGen() {
  const res = yield fetch('/api/user');
  return res.json();
}

// Runner for generator (simplified)
function run(gen) {
  const iterator = gen();
  function handle({ value, done }) {
    if (done) return Promise.resolve(value);
    return value.then(res => handle(iterator.next(res)));
  }
  return handle(iterator.next());
}
```

---

### Q12. What is `AbortController` with async/await?

**Answer:**
```javascript
async function fetchWithTimeout(url, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    const data = await res.json();
    clearTimeout(timeoutId);
    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw err;
  }
}

// Usage
try {
  const user = await fetchWithTimeout('/api/user', 3000);
} catch (err) {
  console.error(err.message); // 'Request timed out after 3000ms'
}
```

---

## 📝 Quick Reference

```javascript
// Declare
async function fn() { ... }
const fn = async () => { ... };

// Use — only inside async functions (or top-level ES modules)
const result = await somePromise;
const [a, b] = await Promise.all([p1, p2]);

// Error handling
try {
  const data = await fetch('/api').then(r => r.json());
} catch(err) {
  console.error(err); // Catches both network and parse errors
} finally {
  cleanup();
}

// Parallel execution
// ❌ Sequential (slow):
const a = await fetchA();
const b = await fetchB();

// ✅ Parallel (fast):
const [a, b] = await Promise.all([fetchA(), fetchB()]);

// ❌ Avoid await in forEach — use for...of or Promise.all+map
```

---

*Senior UI Developer Interview Prep — Async/Await*
