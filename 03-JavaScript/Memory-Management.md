# Memory Management in JavaScript

---
**Category:** JavaScript Internals  
**Level:** Intermediate → Advanced  
**Date:** 2026-07-22  
**Topics:** V8, Stack, Heap, GC, Memory Leaks, WeakMap, WeakRef, FinalizationRegistry

---

## Table of Contents

1. [How JavaScript Manages Memory (V8)](#1-how-javascript-manages-memory-v8)
2. [Stack vs Heap Memory](#2-stack-vs-heap-memory)
3. [Garbage Collection — Mark and Sweep](#3-garbage-collection--mark-and-sweep-algorithm)
4. [Reference Counting GC & Cyclic References](#4-reference-counting-gc--cyclic-reference-problem)
5. [Memory Leaks — 6 Common Causes](#5-memory-leaks--6-common-causes)
6. [Detecting Memory Leaks with DevTools](#6-detecting-memory-leaks-with-devtools)
7. [WeakMap, WeakSet, WeakRef](#7-weakmap-weakset-weakref)
8. [FinalizationRegistry](#8-finalizationregistry)
9. [Best Practices](#9-best-practices)
10. [Quick Reference](#10-quick-reference)

---

## 1. How JavaScript Manages Memory (V8)

### Q: Explain how JavaScript (V8 engine) manages memory lifecycle.

**A:** Memory management in JavaScript happens automatically through a lifecycle:

```
Allocate → Use → Release (GC)
```

### V8 Memory Structure

```
┌─────────────────────────────────────────────────┐
│                  V8 Heap Memory                 │
│  ┌───────────────────────────────────────────┐  │
│  │           New Space (Young Gen)           │  │
│  │  ┌────────────────┐ ┌────────────────┐   │  │
│  │  │  From-Space    │ │   To-Space     │   │  │
│  │  │  (Semi-Space)  │ │  (Semi-Space)  │   │  │
│  │  └────────────────┘ └────────────────┘   │  │
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │           Old Space (Old Gen)             │  │
│  │  ┌────────────┐  ┌──────────────────────┐│  │
│  │  │  Old Data  │  │   Old Pointer Space   ││  │
│  │  │   Space    │  │  (objects with refs)  ││  │
│  │  └────────────┘  └──────────────────────┘│  │
│  └───────────────────────────────────────────┘  │
│  ┌─────────────┐  ┌──────────────────────────┐  │
│  │ Large Object│  │  Code Space (compiled)   │  │
│  │   Space     │  │                          │  │
│  └─────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### V8 Garbage Collection — Two Collectors

| Collector      | Targets        | Algorithm              | Frequency |
|----------------|----------------|------------------------|-----------|
| **Scavenger**  | New Space      | Semi-space Copying     | Frequent  |
| **Major GC**   | Old Space      | Mark-Sweep-Compact     | Occasional|

### Memory Allocation Steps

```javascript
// Step 1: Declaration — no memory yet (hoisted)
let user;

// Step 2: Allocation — V8 allocates memory in heap
user = {
  name: "Alice",
  scores: [10, 20, 30]
};

// Step 3: Use the memory
console.log(user.name); // "Alice"

// Step 4: Release — GC collects when no references exist
user = null; // original object eligible for GC
```

### Generational Hypothesis

V8 uses **generational garbage collection** based on the observation:
> "Most objects die young."

- **Young Generation (New Space):** Newly allocated objects. Collected frequently with fast Scavenger GC.
- **Old Generation (Old Space):** Objects that survive 2+ GC cycles are promoted. Collected less often with Mark-Sweep.

---

## 2. Stack vs Heap Memory

### Q: What is the difference between Stack and Heap memory in JavaScript?

**A:**

| Feature              | **Stack**                           | **Heap**                            |
|----------------------|-------------------------------------|-------------------------------------|
| **Stores**           | Primitives, function call frames    | Objects, arrays, functions          |
| **Size**             | Fixed, small (~1–8 MB)             | Dynamic, large (up to system RAM)   |
| **Allocation**       | Automatic (LIFO)                    | Managed by GC                       |
| **Access speed**     | Very fast                           | Slower (pointer lookup)             |
| **Lifetime**         | Scoped to function call             | Until no references remain          |
| **Thread**           | Per-thread                          | Shared (single-threaded in JS)      |

```javascript
// ─── STACK ──────────────────────────────────────
// Primitive values stored directly on stack
let age = 30;           // number → stack
let isActive = true;    // boolean → stack
let name = "Alice";     // string → stack (small strings may be interned)

// ─── HEAP ───────────────────────────────────────
// Objects/arrays stored on heap; variable holds reference (pointer)
let user = { name: "Alice", age: 30 }; // object → heap
let scores = [10, 20, 30];             // array → heap
let greet = function () {};            // function → heap

// ─── Demonstrating Value vs Reference ───────────
let a = 10;
let b = a;      // b gets a COPY of the value
b = 99;
console.log(a); // 10 — unchanged (stack copy)

let obj1 = { x: 1 };
let obj2 = obj1; // obj2 holds SAME reference (pointer to heap)
obj2.x = 999;
console.log(obj1.x); // 999 — both point to same heap object
```

### Call Stack Visualization

```javascript
function multiply(a, b) {
  return a * b;           // frame 3
}
function square(n) {
  return multiply(n, n);  // frame 2
}
function main() {
  return square(5);       // frame 1
}
main(); // → 25

// Call stack at peak:
// ┌──────────────────┐
// │  multiply(5, 5)  │  ← top
// │  square(5)       │
// │  main()          │
// │  global          │  ← bottom
// └──────────────────┘
```

### Stack Overflow Example

```javascript
// RangeError: Maximum call stack size exceeded
function infiniteRecursion() {
  return infiniteRecursion(); // no base case!
}
infiniteRecursion(); // 💥 Stack Overflow
```

---

## 3. Garbage Collection — Mark and Sweep Algorithm

### Q: Explain the Mark and Sweep garbage collection algorithm used by modern JS engines.

**A:** Mark and Sweep is the primary GC algorithm in V8 (for Old Generation):

### Phases

```
Phase 1: MARK
  → Start from GC Roots (global, stack variables)
  → Traverse all reachable objects (DFS/BFS)
  → Mark each reachable object as "alive"

Phase 2: SWEEP
  → Iterate through entire heap
  → Reclaim memory of all UNMARKED (unreachable) objects

Phase 3: COMPACT (optional)
  → Move live objects together to reduce fragmentation
```

### Visual Example

```
GC Roots: [global, stack frames]

       global
         │
         ▼
       [A] ──────► [B]
         │
         ▼
       [C] ──────► [D]

       [E] ──────► [F]  ← NOT reachable from roots

After Mark:  A✓ B✓ C✓ D✓  |  E✗ F✗
After Sweep: A  B  C  D  |  E and F memory reclaimed
```

### Code Demonstration

```javascript
// All objects below reachable → NOT collected
let root = {
  child: {
    data: [1, 2, 3],
    nested: {
      value: "deep"
    }
  }
};

// Cut the reference chain:
root.child = null;
// Now { data: [...], nested: {...} } is unreachable → GC collects it

// Both objects become unreachable:
root = null;
// { child: null } itself is now unreachable → collected
```

### V8 GC Optimizations

```javascript
// 1. INCREMENTAL MARKING — GC work split into small slices
//    (avoids long stop-the-world pauses)

// 2. CONCURRENT MARKING — GC marks in background thread
//    while JS continues running

// 3. LAZY SWEEPING — sweeps page-by-page as memory is needed

// 4. PARALLEL SCAVENGE — multiple threads work on young-gen GC

// You can observe GC pressure using:
// Chrome DevTools → Memory → Record Allocation Timeline
```

---

## 4. Reference Counting GC & Cyclic Reference Problem

### Q: What is reference counting GC and why does it fail with cyclic references?

**A:** Reference counting tracks how many references point to each object. When count reaches 0, the object is freed.

### Reference Counting Basics

```javascript
// Pseudo-code illustration of reference counting:

let a = { name: "Alice" };  // ref count of object = 1
let b = a;                   // ref count = 2
a = null;                    // ref count = 1
b = null;                    // ref count = 0 → FREED ✓
```

### The Cyclic Reference Problem

```javascript
// A and B reference EACH OTHER
// Even though both become unreachable from outside,
// their ref counts never reach 0!

function createCycle() {
  let a = {};
  let b = {};

  a.partner = b; // b's ref count = 2 (b variable + a.partner)
  b.partner = a; // a's ref count = 2 (a variable + b.partner)

  // After function returns:
  // - 'a' local var gone → a ref count = 1 (only b.partner)
  // - 'b' local var gone → b ref count = 1 (only a.partner)
  // Neither reaches 0 → MEMORY LEAK with ref counting!
}
createCycle();

// Mark-and-Sweep SOLVES this:
// Neither a nor b is reachable from GC roots → both are collected ✓
```

### Real-World Cyclic Reference (DOM + JS — Old IE issue)

```javascript
// This was a real problem in Internet Explorer (before IE8):
function createLeak() {
  let div = document.createElement("div");

  // JS object references DOM element
  // DOM element references JS object via event handler
  // → cycle between JS heap and DOM heap
  div.onclick = function () {
    console.log(div.id); // closure captures 'div'
  };

  document.body.appendChild(div);
}

// Modern browsers use Mark-and-Sweep, so this is safe today.
// But it's still good practice to clean up references explicitly.
```

---

## 5. Memory Leaks — 6 Common Causes

### Q: What are common causes of memory leaks in JavaScript? Show examples and fixes.

---

### Cause 1: Global Variables

```javascript
// ─── BAD: Accidental global variable ─────────────────────────────
function processData() {
  // Missing 'let/const/var' → leaks to global scope!
  userData = { name: "Alice", scores: new Array(100000).fill(0) };
}
processData();
// 'userData' is now on window object and never collected

// ─── ALSO BAD: Explicit global reference that grows ───────────────
window.cache = {};
function addToCache(key, value) {
  window.cache[key] = value; // grows forever if never cleared
}

// ─── FIX: Use proper scoping ──────────────────────────────────────
function processDataFixed() {
  const userData = { name: "Alice", scores: new Array(100000).fill(0) };
  // scoped to function → eligible for GC after function returns
}

// ─── FIX: Use 'use strict' to prevent accidental globals ──────────
"use strict";
function strictFunction() {
  // undeclaredVar = 1; // ReferenceError! — caught early
}
```

---

### Cause 2: Forgotten Timers / Intervals

```javascript
// ─── BAD: setInterval never cleared ──────────────────────────────
function startMonitoring() {
  const data = new Array(100000).fill("monitoring data");

  setInterval(() => {
    // 'data' is captured in closure and held alive as long as interval runs
    console.log("Monitoring:", data.length);
  }, 1000);
  // interval ID never stored → can NEVER be cleared! Memory never freed.
}
startMonitoring();

// ─── BAD: setTimeout that re-schedules itself ─────────────────────
function pollServer() {
  const heavyState = new Array(50000).fill("state");
  setTimeout(function poll() {
    console.log("polling...", heavyState.length);
    setTimeout(poll, 2000); // never stops, never releases heavyState
  }, 2000);
}

// ─── FIX: Store and clear the timer ID ───────────────────────────
class DataMonitor {
  constructor() {
    this.data = new Array(100000).fill("monitoring data");
    this.intervalId = null;
  }

  start() {
    this.intervalId = setInterval(() => {
      console.log("Monitoring:", this.data.length);
    }, 1000);
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId); // ✓ clears interval
      this.intervalId = null;
    }
    this.data = null; // ✓ release data reference
  }
}

const monitor = new DataMonitor();
monitor.start();
// Later, when done:
monitor.stop(); // clean up properly
```

---

### Cause 3: DOM References (Detached Nodes)

```javascript
// ─── BAD: Storing reference to removed DOM node ───────────────────
const cache = {};

function cacheElement() {
  const el = document.getElementById("my-list");
  cache.listElement = el; // store reference

  // Later, element is removed from DOM
  el.parentNode.removeChild(el);
  // 'el' is now a detached DOM node
  // BUT cache.listElement still holds a reference → NOT collected!
}

// ─── BAD: Array of DOM nodes from a removed subtree ───────────────
let detachedRows = [];

function buildTable() {
  const table = document.createElement("table");
  for (let i = 0; i < 100; i++) {
    const row = table.insertRow();
    detachedRows.push(row); // storing each row
    row.insertCell().textContent = `Row ${i}`;
  }
  document.body.appendChild(table);

  // Remove table later
  table.parentNode.removeChild(table);
  // table is detached, but detachedRows still holds all 100 row references!
}

// ─── FIX: Clear references when removing elements ─────────────────
function cacheElementFixed() {
  const el = document.getElementById("my-list");

  // Use WeakRef so GC can collect it if needed
  const weakRef = new WeakRef(el);

  el.parentNode.removeChild(el);

  // Use weak reference — returns undefined if collected
  const deref = weakRef.deref();
  if (deref) {
    console.log("Still alive:", deref.id);
  }
}

// ─── FIX: Clear array when done ───────────────────────────────────
function cleanup() {
  detachedRows.length = 0; // clear array → rows eligible for GC
  detachedRows = null;
}
```

---

### Cause 4: Closures Holding Large Objects

```javascript
// ─── BAD: Outer closure unnecessarily captures large data ─────────
function createProcessor() {
  const HUGE_DATA = new Array(1_000_000).fill("x"); // 1M strings

  // This inner function only needs 'threshold', NOT HUGE_DATA
  // But because it's in the same closure scope, HUGE_DATA is retained!
  const threshold = 100;

  return function isOverThreshold(value) {
    return value > threshold; // doesn't use HUGE_DATA at all
  };
}

const check = createProcessor();
// HUGE_DATA is stuck in memory even though 'check' never uses it!

// ─── FIX: Extract the closure to avoid capturing large data ───────
function createProcessorFixed() {
  const HUGE_DATA = new Array(1_000_000).fill("x");
  const threshold = 100;

  // Process huge data here, extract only what's needed
  const result = HUGE_DATA.length > threshold; // compute immediately

  // Return closure that only needs the computed result
  return function isOverThreshold(value) {
    return value > threshold && result;
  };
  // HUGE_DATA goes out of scope → eligible for GC ✓
}

// ─── BAD: Closure in event handler capturing DOM + large state ────
function setupBadHandler() {
  const hugeReport = generateHugeReport(); // 50MB of data

  document.getElementById("btn").addEventListener("click", function () {
    // only needs one tiny value from hugeReport
    console.log("Total:", hugeReport.summary.total);
    // But entire hugeReport is retained in closure!
  });
}

// ─── FIX: Extract only what's needed ─────────────────────────────
function setupGoodHandler() {
  const hugeReport = generateHugeReport();
  const total = hugeReport.summary.total; // extract needed value

  // hugeReport can now be GC'd; closure only captures 'total'
  document.getElementById("btn").addEventListener("click", function () {
    console.log("Total:", total);
  });
}

function generateHugeReport() {
  return { summary: { total: 42 }, data: new Array(1_000_000).fill("data") };
}
```

---

### Cause 5: Event Listeners Not Removed

```javascript
// ─── BAD: Adding listeners on every component mount ───────────────
class SearchComponent {
  constructor() {
    this.results = new Array(10000).fill("result");
    this.handleKeyup = this.handleKeyup.bind(this);
  }

  mount() {
    // New listener added every time mount() is called
    // Old ones are NEVER removed!
    window.addEventListener("keyup", this.handleKeyup);
    document.addEventListener("scroll", this.onScroll.bind(this));
    // Note: .bind() creates a NEW function each time → can't remove!
  }

  handleKeyup(e) {
    console.log("Key:", e.key, "Results:", this.results.length);
  }

  onScroll() {
    console.log("scrolling");
  }
}

// Mount 100 times without unmounting → 100 listeners accumulate!
for (let i = 0; i < 100; i++) {
  const comp = new SearchComponent();
  comp.mount();
}

// ─── FIX: Track and remove listeners on cleanup ───────────────────
class SearchComponentFixed {
  constructor() {
    this.results = new Array(10000).fill("result");
    // Bind ONCE in constructor → same reference for add/remove
    this.handleKeyup = this.handleKeyup.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  mount() {
    window.addEventListener("keyup", this.handleKeyup);
    window.addEventListener("scroll", this.handleScroll);
  }

  unmount() {
    window.removeEventListener("keyup", this.handleKeyup);   // ✓
    window.removeEventListener("scroll", this.handleScroll); // ✓
    this.results = null; // ✓ release large data
  }

  handleKeyup(e) {
    console.log("Key:", e.key);
  }

  handleScroll() {
    console.log("scrolling");
  }
}

// ─── FIX: AbortController for bulk listener cleanup ───────────────
function setupListenersWithAbort() {
  const controller = new AbortController();
  const { signal } = controller;

  document.addEventListener("click", handleClick, { signal });
  document.addEventListener("keydown", handleKeydown, { signal });
  window.addEventListener("resize", handleResize, { signal });

  // One call removes ALL listeners ✓
  return () => controller.abort();
}

function handleClick() {}
function handleKeydown() {}
function handleResize() {}

const cleanup = setupListenersWithAbort();
// Later:
cleanup(); // removes all 3 listeners at once
```

---

### Cause 6: Caches Growing Unbounded

```javascript
// ─── BAD: Simple Map used as cache that grows forever ─────────────
const apiCache = new Map();

async function fetchUser(userId) {
  if (apiCache.has(userId)) {
    return apiCache.get(userId);
  }

  const user = await fetch(`/api/users/${userId}`).then(r => r.json());
  apiCache.set(userId, user); // cache grows indefinitely!
  return user;
}

// With thousands of unique users, apiCache holds them all forever.

// ─── FIX Option A: LRU Cache with max size ─────────────────────────
class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new Map(); // Map preserves insertion order
  }

  get(key) {
    if (!this.cache.has(key)) return undefined;
    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Delete least recently used (first entry in Map)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  has(key) {
    return this.cache.has(key);
  }

  get size() {
    return this.cache.size;
  }
}

const lruCache = new LRUCache(100);

async function fetchUserFixed(userId) {
  if (lruCache.has(userId)) {
    return lruCache.get(userId);
  }
  const user = await fetch(`/api/users/${userId}`).then(r => r.json());
  lruCache.set(userId, user); // max 100 entries ✓
  return user;
}

// ─── FIX Option B: TTL Cache (Time-To-Live) ───────────────────────
class TTLCache {
  constructor(ttlMs = 5 * 60 * 1000) { // 5 minutes default
    this.ttl = ttlMs;
    this.store = new Map();
  }

  set(key, value) {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + this.ttl
    });
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key); // lazy eviction ✓
      return undefined;
    }
    return entry.value;
  }
}

// ─── FIX Option C: WeakMap for object-keyed cache ─────────────────
// Keys are weakly held — when DOM element is GC'd, cache entry too!
const elementDataCache = new WeakMap();

function getElementData(element) {
  if (elementDataCache.has(element)) {
    return elementDataCache.get(element);
  }
  const data = computeExpensiveData(element);
  elementDataCache.set(element, data);
  return data;
}

function computeExpensiveData(el) {
  return { rect: el.getBoundingClientRect(), tag: el.tagName };
}
```

---

## 6. Detecting Memory Leaks with DevTools

### Q: How do you detect and diagnose memory leaks using Chrome DevTools?

**A:**

### Method 1: Performance Monitor

```
Chrome DevTools → More Tools → Performance Monitor
Watch: JS heap size, DOM Nodes, JS event listeners
If heap/nodes keep growing without stabilizing → potential leak
```

### Method 2: Memory Heap Snapshot

```
DevTools → Memory → Heap Snapshot → Take Snapshot

Steps:
1. Take snapshot (baseline)
2. Perform the action suspected of leaking
3. Trigger GC (trash icon in DevTools)
4. Take another snapshot
5. Select "Comparison" view
6. Sort by "# Delta" — positive delta = possible leak
```

### Method 3: Allocation Timeline

```
DevTools → Memory → Allocation instrumentation on timeline → Start
→ Interact with your app
→ Stop recording
→ Blue bars = memory allocated that was NOT collected (leak candidates)
→ Grey bars = memory allocated then collected (normal)
```

### Method 4: performance.memory API

```javascript
// Available in Chrome only (non-standard)
if (performance.memory) {
  const mem = performance.memory;
  console.log({
    heapLimit:    (mem.jsHeapSizeLimit  / 1024 / 1024).toFixed(2) + " MB",
    totalHeap:    (mem.totalJSHeapSize  / 1024 / 1024).toFixed(2) + " MB",
    usedHeap:     (mem.usedJSHeapSize   / 1024 / 1024).toFixed(2) + " MB",
  });
}

// Programmatic leak detection helper
function monitorMemory(label, intervalMs = 2000) {
  if (!performance.memory) {
    console.warn("performance.memory not available");
    return () => {};
  }

  const readings = [];
  const id = setInterval(() => {
    const used = performance.memory.usedJSHeapSize;
    readings.push(used);
    const delta = readings.length > 1
      ? used - readings[readings.length - 2]
      : 0;
    console.log(`[${label}] Heap: ${(used / 1e6).toFixed(2)} MB | Δ: ${(delta / 1e6).toFixed(3)} MB`);
  }, intervalMs);

  return () => clearInterval(id);
}

const stopMonitoring = monitorMemory("App", 3000);
// ... do operations ...
// stopMonitoring();
```

### Method 5: Node.js — process.memoryUsage()

```javascript
// Node.js memory profiling
function logMemory(label) {
  const mem = process.memoryUsage();
  console.log(`[${label}]`, {
    rss:       `${(mem.rss       / 1024 / 1024).toFixed(2)} MB`, // resident set
    heapTotal: `${(mem.heapTotal / 1024 / 1024).toFixed(2)} MB`,
    heapUsed:  `${(mem.heapUsed  / 1024 / 1024).toFixed(2)} MB`,
    external:  `${(mem.external  / 1024 / 1024).toFixed(2)} MB`,
  });
}

logMemory("Before");
// ... run suspected leaky code ...
global.gc && global.gc(); // requires --expose-gc flag
logMemory("After");
```

---

## 7. WeakMap, WeakSet, WeakRef

### Q: How do WeakMap, WeakSet, and WeakRef help prevent memory leaks?

**A:** These "weak" data structures hold **weak references** — they don't prevent GC from collecting the referenced objects.

### WeakMap

```javascript
// Map holds STRONG references → prevents GC
const strongMap = new Map();
let element = document.getElementById("app");
strongMap.set(element, { clicks: 0 });
element = null; // ← object still in Map! NOT collected.

// ─────────────────────────────────────────────────────────────────

// WeakMap holds WEAK references → allows GC
const weakMap = new WeakMap();
let el = document.getElementById("app");
weakMap.set(el, { clicks: 0 });
el = null; // ← object CAN be collected, weakMap entry auto-removed ✓

// WeakMap characteristics:
// ✓ Keys must be objects (not primitives)
// ✓ Not iterable (no .keys(), .values(), .forEach())
// ✓ No .size property
// ✓ Ideal for associating private data with objects

// Use case: private data for class instances
const _private = new WeakMap();

class User {
  constructor(name, password) {
    _private.set(this, { password }); // private data tied to instance
    this.name = name;
  }

  authenticate(pwd) {
    return _private.get(this).password === pwd;
  }
}

const user = new User("Alice", "s3cr3t");
console.log(user.authenticate("s3cr3t")); // true
console.log(user.password); // undefined — truly private!
// When 'user' goes out of scope, _private entry is auto-cleaned ✓
```

### WeakSet

```javascript
// WeakSet: set of weakly-held objects

// Use case: tracking visited nodes without preventing GC
const visited = new WeakSet();

function processNode(node) {
  if (visited.has(node)) {
    return; // already processed
  }
  visited.add(node);
  // process...
  for (const child of node.children || []) {
    processNode(child);
  }
  // When DOM nodes are removed, WeakSet entries are auto-removed ✓
}

// Use case: preventing duplicate processing
const processing = new WeakSet();

async function handleRequest(requestObj) {
  if (processing.has(requestObj)) {
    return; // deduplicate concurrent calls
  }
  processing.add(requestObj);
  try {
    await doWork(requestObj);
  } finally {
    processing.delete(requestObj);
  }
}

async function doWork(req) {
  // simulate async work
}
```

### WeakRef

```javascript
// WeakRef: hold a weak reference to an object
// .deref() returns the object if alive, or undefined if GC'd

// Use case: optional caching
class OptionalCache {
  constructor() {
    this.refs = new Map(); // Map<string, WeakRef<object>>
  }

  set(key, value) {
    this.refs.set(key, new WeakRef(value));
  }

  get(key) {
    const ref = this.refs.get(key);
    if (!ref) return undefined;

    const value = ref.deref(); // check if still alive
    if (value === undefined) {
      this.refs.delete(key); // cleanup dead entry
      return undefined;
    }
    return value;
  }
}

// Use case: weakly referencing expensive computed objects
let expensiveObj = { data: new Array(100000).fill("x") };
const ref = new WeakRef(expensiveObj);

// Access later:
const obj = ref.deref();
if (obj !== undefined) {
  console.log("Object still alive:", obj.data.length);
} else {
  console.log("Object was GC'd, need to recompute");
}

// Allow GC to collect it:
expensiveObj = null;
// At some future GC cycle, ref.deref() will return undefined
```

---

## 8. FinalizationRegistry

### Q: What is FinalizationRegistry and when should you use it?

**A:** `FinalizationRegistry` lets you register a callback that runs **after** an object is garbage collected.

```javascript
// Basic usage
const registry = new FinalizationRegistry((heldValue) => {
  // Called after the registered object is GC'd
  console.log(`Object with key "${heldValue}" was collected`);
});

// Register an object with a held value (identifier)
let target = { name: "Alice", data: new Array(10000).fill(0) };
registry.register(target, "alice-key"); // 2nd arg = held value passed to callback

// Allow GC
target = null;
// At some future GC cycle → callback fires: "Object with key 'alice-key' was collected"

// ─── Use case: cleanup external resources ─────────────────────────
class FileHandle {
  constructor(path) {
    this.path = path;
    this.fd = openFile(path); // hypothetical native file descriptor
  }
}

const fileRegistry = new FinalizationRegistry((fd) => {
  closeFile(fd); // cleanup native resource when JS object is GC'd
  console.log(`File descriptor ${fd} closed via FinalizationRegistry`);
});

function createFileHandle(path) {
  const handle = new FileHandle(path);
  fileRegistry.register(handle, handle.fd);
  return handle;
}

// Mock implementations
function openFile(path) { return Math.floor(Math.random() * 1000); }
function closeFile(fd) { /* close native handle */ }

// ─── Important caveats ────────────────────────────────────────────
// 1. Callback timing is NOT deterministic — may fire late or never
// 2. Do NOT use for critical cleanup — use explicit cleanup + FinalizationRegistry
// 3. The held value must NOT reference the target (would prevent GC!)
// 4. Available since V8 8.4, modern browsers (2021+)

// ─── With unregister token ────────────────────────────────────────
const token = {}; // unregister token
let obj = { important: true };
const reg = new FinalizationRegistry(() => console.log("cleaned up"));
reg.register(obj, "my-held-value", token);

// Cancel the callback before object is GC'd:
reg.unregister(token);
obj = null;
// Callback will NOT fire ✓
```

---

## 9. Best Practices

### Q: What are best practices for memory management in JavaScript?

```javascript
// ──────────────────────────────────────────────────────────────────
// 1. Always use const/let (never accidentally create globals)
"use strict";

// 2. Null out large references when no longer needed
function processLargeData() {
  let data = new Array(1_000_000).fill("x");
  const result = data.reduce((acc, v) => acc + v.length, 0);
  data = null; // ✓ release immediately after use
  return result;
}

// 3. Clean up timers
const timers = new Set();
function safeSetInterval(fn, ms) {
  const id = setInterval(fn, ms);
  timers.add(id);
  return id;
}
function clearAllTimers() {
  timers.forEach(id => clearInterval(id));
  timers.clear();
}

// 4. Use AbortController for fetch + listeners
async function fetchWithCleanup(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return await res.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

// 5. Prefer WeakMap/WeakSet for object-keyed metadata
const metadata = new WeakMap();
function attachMeta(obj, data) {
  metadata.set(obj, data); // auto-cleaned when obj is GC'd
}

// 6. Avoid storing references to DOM elements long-term
// If you must, use WeakRef
function trackElement(el) {
  return new WeakRef(el);
}

// 7. Limit closure scope
function makeCounter(start) {
  // Only capture what's needed
  let count = start;
  return { increment: () => ++count, get: () => count };
}

// 8. Use object pooling for frequently created/destroyed objects
class ObjectPool {
  constructor(factory, maxSize = 50) {
    this.factory = factory;
    this.pool = [];
    this.maxSize = maxSize;
  }

  acquire() {
    return this.pool.pop() || this.factory();
  }

  release(obj) {
    if (this.pool.length < this.maxSize) {
      // Reset state before returning to pool
      if (typeof obj.reset === "function") obj.reset();
      this.pool.push(obj);
    }
  }
}
```

---

## 10. Quick Reference

| Concept              | Key Point                                                    |
|----------------------|--------------------------------------------------------------|
| **V8 Heap**          | New Space (young gen) + Old Space (old gen) + Code Space    |
| **Scavenger GC**     | Fast, semi-space copy for young gen, very frequent          |
| **Mark-and-Sweep**   | GC roots → mark reachable → sweep unreachable               |
| **Cyclic Refs**      | Not a problem for Mark-and-Sweep (only ref counting)        |
| **Global vars**      | Leak — always attached to window/global, never GC'd         |
| **Intervals**        | Leak — hold closure alive; always store & clear ID          |
| **Detached DOM**     | Leak — JS reference keeps node in memory after DOM removal  |
| **Closures**         | Leak — capture only what's needed, not entire outer scope   |
| **Event listeners**  | Leak — use removeEventListener or AbortController           |
| **Unbounded cache**  | Leak — use LRU (size limit) or TTL (time limit)             |
| **WeakMap**          | Object keys, weak refs, allows GC, not iterable             |
| **WeakSet**          | Object values, weak refs, allows GC, not iterable           |
| **WeakRef**          | Explicit weak reference; .deref() returns obj or undefined  |
| **FinalizationRegistry** | Post-GC callback; non-deterministic, not for critical logic |
| **Heap Snapshot**    | DevTools Memory tab → compare before/after for leaks        |

### Memory Leak Detection Checklist

```
□ Run action 10+ times in DevTools recording
□ Trigger GC manually (DevTools trash icon)
□ Check heap growth in Performance Monitor
□ Take heap snapshots and compare deltas
□ Look for detached DOM nodes in snapshot
□ Check event listener count (Performance Monitor)
□ Search for growing arrays/maps in Retainers view
□ Profile with Allocation Timeline for continuous leaks
```

---

*Last updated: 2026-07-22 | Category: JavaScript Internals | Level: Intermediate → Advanced*
