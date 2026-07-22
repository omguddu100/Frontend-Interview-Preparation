# 🔄 Event Loop — Interview Q&A

> **Category:** JavaScript | **Level:** Advanced
> **Last Updated:** 2026-07-22

---

## 🔵 Understanding the Event Loop

---

### Q1. How does JavaScript execute code? Explain the Event Loop.

**Answer:**
JavaScript is **single-threaded** — it has one call stack and executes one thing at a time. The Event Loop is the mechanism that allows JS to handle **asynchronous operations** without blocking.

**Components:**
```
┌─────────────────────────────────────────────────┐
│                   CALL STACK                    │
│  (LIFO — executes synchronous code)             │
└─────────────────────────────────────────────────┘
         ↑ pops tasks when stack is empty
┌─────────────────────────────────────────────────┐
│              MICROTASK QUEUE                    │
│  (Promises .then, queueMicrotask, MutationObs.) │
│  ← Drained COMPLETELY before macrotasks!        │
└─────────────────────────────────────────────────┘
         ↑ checked after microtasks exhausted
┌─────────────────────────────────────────────────┐
│             MACROTASK QUEUE (Task Queue)        │
│  (setTimeout, setInterval, setImmediate,        │
│   I/O callbacks, UI events)                     │
└─────────────────────────────────────────────────┘

                    WEB APIs
       (timer, fetch, DOM events — run outside JS)
```

**Execution order:**
1. Run all **synchronous code** (call stack)
2. Drain all **microtasks** (Promises, queueMicrotask)
3. Run **one** macrotask (setTimeout, setInterval)
4. Go back to step 2

---

### Q2. What is the Call Stack?

**Answer:**
The call stack is a LIFO (Last In, First Out) data structure that tracks function execution.

```javascript
function third()  { console.log('third');  }
function second() { third(); console.log('second'); }
function first()  { second(); console.log('first');  }

first();

// Call Stack frames:
// [first] pushed
//   [second] pushed
//     [third] pushed → logs 'third' → popped
//   second logs 'second' → popped
// first logs 'first' → popped
// Stack empty

// Output: third, second, first
```

---

### Q3. What is the difference between Microtask Queue and Macrotask Queue?

**Answer:**

| | Microtask Queue | Macrotask Queue (Task Queue) |
|--|----------------|------------------------------|
| Examples | `Promise.then/catch/finally`, `queueMicrotask()`, `MutationObserver` | `setTimeout`, `setInterval`, `setImmediate`, I/O, click events |
| Priority | **Higher** — runs BEFORE macrotasks | Lower |
| Draining | **Entire queue** drained per loop tick | **ONE** task per loop tick |
| When | After each task (or at end of sync code) | After microtasks are empty |

```javascript
console.log('1 - sync');

setTimeout(() => console.log('2 - setTimeout'), 0);  // Macrotask

Promise.resolve().then(() => console.log('3 - promise')); // Microtask

console.log('4 - sync');

// Output:
// 1 - sync      (call stack — sync)
// 4 - sync      (call stack — sync)
// 3 - promise   (microtask — runs before setTimeout!)
// 2 - setTimeout (macrotask — runs last)
```

---

### Q4. Predict the output of this Event Loop question:

```javascript
console.log('Start');

setTimeout(() => console.log('Timeout 1'), 0);
setTimeout(() => console.log('Timeout 2'), 0);

Promise.resolve()
  .then(() => {
    console.log('Promise 1');
    return Promise.resolve();
  })
  .then(() => console.log('Promise 2'));

console.log('End');
```

**Answer:**
```
Start
End
Promise 1
Promise 2
Timeout 1
Timeout 2
```

**Why:**
1. `Start` — sync
2. `setTimeout` callbacks → macrotask queue
3. Promise → microtask queue
4. `End` — sync
5. Microtasks drain: `Promise 1` → new microtask added → `Promise 2`
6. Macrotasks run one by one: `Timeout 1`, then `Timeout 2`

---

### Q5. What does `setTimeout(fn, 0)` actually mean?

**Answer:**
`setTimeout(fn, 0)` does NOT run immediately — it schedules `fn` as a **macrotask** with a minimum delay. In practice, browsers enforce a **minimum 1-4ms delay** even for 0ms timers.

```javascript
console.log('before');
setTimeout(() => console.log('timeout 0ms'), 0);
Promise.resolve().then(() => console.log('promise'));
console.log('after');

// Output:
// before
// after
// promise    ← microtask before macrotask!
// timeout 0ms
```

**Common use cases for `setTimeout(fn, 0)`:**
- Defer code to after current sync code and microtasks
- Allow DOM to update before running code
- Break up long-running tasks

---

## 🟡 Intermediate

---

### Q6. What is `queueMicrotask()`?

**Answer:**
`queueMicrotask()` schedules a function to run as a **microtask** (before next macrotask, after current sync code).

```javascript
queueMicrotask(() => console.log('microtask 1'));
queueMicrotask(() => console.log('microtask 2'));
setTimeout(() => console.log('macrotask'), 0);
console.log('sync');

// Output:
// sync
// microtask 1
// microtask 2
// macrotask
```

---

### Q7. Can microtasks starve macrotasks?

**Answer:**
YES! If microtasks keep adding more microtasks, macrotasks (like UI rendering) can be indefinitely delayed — "microtask starvation".

```javascript
function starveMacrotasks() {
  Promise.resolve().then(() => {
    console.log('microtask');
    starveMacrotasks(); // Adds another microtask!
  });
}

setTimeout(() => console.log('This NEVER runs!'), 0);
starveMacrotasks(); // Infinite microtasks!
```

---

### Q8. How does `async/await` fit into the Event Loop?

**Answer:**
`async/await` is syntactic sugar over Promises — `await` pauses execution and **resumes it as a microtask**.

```javascript
async function fetchData() {
  console.log('A');            // Sync — runs immediately
  const data = await getData(); // Pauses here — resumes as microtask
  console.log('C');            // Runs after await resolves (microtask)
}

console.log('Before');
fetchData();
console.log('B');  // Runs before C!

// Output: Before → A → B → C
```

---

### Q9. Explain `requestAnimationFrame` and where it fits:

**Answer:**
`requestAnimationFrame(callback)` runs the callback **before the next browser repaint** — between macrotasks, after microtasks.

```
Tick cycle:
1. Macrotask (e.g., setTimeout callback)
2. Microtasks (drain all Promises)
3. requestAnimationFrame callbacks
4. Browser renders/paints
5. Next macrotask...
```

```javascript
// Perfect for smooth animations — runs at 60fps (every ~16.7ms)
function animate() {
  // Update animation state
  element.style.transform = `translateX(${x++}px)`;

  requestAnimationFrame(animate); // Schedule next frame
}
requestAnimationFrame(animate);
```

---

### Q10. What is the output? (Advanced Event Loop)

```javascript
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}

async function async2() {
  console.log('async2');
}

console.log('script start');

setTimeout(() => console.log('setTimeout'), 0);

async1();

new Promise(resolve => {
  console.log('promise1');
  resolve();
}).then(() => console.log('promise2'));

console.log('script end');
```

**Answer:**
```
script start     ← sync
async1 start     ← sync (inside async1)
async2           ← sync (inside async2, await doesn't suspend async2 itself)
promise1         ← sync (Promise executor is sync)
script end       ← sync

async1 end       ← microtask (await resumes)
promise2         ← microtask

setTimeout       ← macrotask
```

---

## 🔴 Advanced

---

### Q11. How does the Event Loop handle UI rendering?

**Answer:**
Browser rendering (style calc, layout, paint, composite) happens between macrotask cycles **only when the call stack is empty**. Long-running sync code blocks rendering.

```javascript
// ❌ Blocks rendering — UI freezes for 5 seconds
function block() {
  const start = Date.now();
  while (Date.now() - start < 5000) {} // 5 second block!
}
block();

// ✅ Use chunking — yield control back to event loop
function processChunks(data, chunkSize = 100) {
  let index = 0;

  function processNext() {
    const chunk = data.slice(index, index + chunkSize);
    chunk.forEach(processItem);
    index += chunkSize;

    if (index < data.length) {
      setTimeout(processNext, 0); // Yield — browser can render!
    }
  }
  processNext();
}
```

---

### Q12. What is a "task" vs "job" vs "microtask"?

**Answer:**

| Term | Where | Examples |
|------|-------|---------|
| **Task** (Macrotask) | Task Queue | `setTimeout`, `setInterval`, I/O, click events |
| **Microtask** (Job) | Microtask Queue | `Promise.then`, `queueMicrotask`, `MutationObserver` |
| **Animation Frame** | RAF Queue | `requestAnimationFrame` |

> 💡 ECMA spec calls microtasks "Jobs". Browser specs call them "Microtasks". Same concept!

---

## 📝 Quick Reference

```
Event Loop Order (per tick):
1. Run ALL synchronous code (call stack)
2. Drain ALL microtasks (Promises, queueMicrotask)
   - More microtasks added during draining are also run!
3. Run ONE macrotask (setTimeout, setInterval, event callback)
4. (Browser) requestAnimationFrame + rendering
5. Repeat from step 2

Microtasks: Promise.then/catch/finally, queueMicrotask, MutationObserver
Macrotasks: setTimeout, setInterval, setImmediate, I/O, UI events

Key rules:
• Microtasks ALWAYS run before macrotasks
• Entire microtask queue drains before next macrotask
• setTimeout(fn, 0) is NOT immediate — it's a macrotask
• async/await: code after await = microtask
• Long sync code blocks rendering!
```

---

*Senior UI Developer Interview Prep — JavaScript Event Loop*
