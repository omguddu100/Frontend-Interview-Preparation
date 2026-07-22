# JavaScript Performance Optimization — Interview Q&A

---
**Category:** JavaScript / Performance  
**Level:** Intermediate → Advanced  
**Date:** 2026-07-22  
**Topics:** Debounce, Throttle, Memoization, Lazy Loading, Web Workers, rAF, Core Web Vitals

---

## Table of Contents

1. [Debounce](#1-debounce)
2. [Throttle](#2-throttle)
3. [Debounce vs Throttle Comparison](#3-debounce-vs-throttle-comparison)
4. [Memoization](#4-memoization)
5. [Lazy Loading](#5-lazy-loading)
6. [Code Splitting](#6-code-splitting)
7. [Virtual Scrolling / Windowing](#7-virtual-scrolling--windowing)
8. [Web Workers](#8-web-workers)
9. [requestAnimationFrame vs setTimeout](#9-requestanimationframe-vs-settimeout)
10. [Script Loading: defer vs async vs normal](#10-script-loading-defer-vs-async-vs-normal)
11. [Critical Rendering Path Optimization](#11-critical-rendering-path-optimization)
12. [Layout Thrashing](#12-layout-thrashing)
13. [Caching Strategies](#13-caching-strategies)
14. [Bundle Size Optimization](#14-bundle-size-optimization)
15. [Core Web Vitals: LCP, FID/INP, CLS](#15-core-web-vitals-lcp-fidinp-cls)
16. [Performance Measurement APIs](#16-performance-measurement-apis)
17. [Quick Reference](#17-quick-reference)

---

## 1. Debounce

### Q: What is debounce, how do you implement it, and when should you use it?

**A:** Debounce delays execution of a function until after a specified time has passed **since the last call**. It resets the timer on every new call.

> **Mental model:** "Wait until you stop calling me."

### Implementation

```javascript
// ─── Basic Debounce ────────────────────────────────────────
function debounce(fn, delay) {
  let timerId = null;

  return function (...args) {
    // Clear previous pending invocation
    clearTimeout(timerId);

    // Schedule new invocation
    timerId = setTimeout(() => {
      fn.apply(this, args);
      timerId = null;
    }, delay);
  };
}

// ─── Usage ────────────────────────────────────────────────
const searchInput = document.getElementById("search");

function searchAPI(query) {
  console.log(`Searching for: "${query}"`);
  // fetch(`/api/search?q=${query}`)...
}

const debouncedSearch = debounce(searchAPI, 400);

searchInput.addEventListener("input", (e) => {
  debouncedSearch(e.target.value); // only fires 400ms after typing stops
});

// ─── Full-Featured Debounce ────────────────────────────────
function debounceAdvanced(fn, delay, options = {}) {
  const { leading = false, trailing = true } = options;
  let timerId = null;
  let lastArgs = null;
  let lastThis = null;
  let result;

  function invokeFunc() {
    result = fn.apply(lastThis, lastArgs);
    lastThis = lastArgs = null;
    return result;
  }

  function debounced(...args) {
    lastArgs = args;
    lastThis = this;

    const isFirstCall = !timerId;

    clearTimeout(timerId);

    timerId = setTimeout(() => {
      timerId = null;
      if (trailing && lastArgs) {
        invokeFunc();
      }
    }, delay);

    // Execute on leading edge (immediately on first call)
    if (leading && isFirstCall) {
      return invokeFunc();
    }

    return result;
  }

  // Cancel pending execution
  debounced.cancel = function () {
    clearTimeout(timerId);
    timerId = lastArgs = lastThis = null;
  };

  // Flush immediately (execute now)
  debounced.flush = function () {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
      return invokeFunc();
    }
  };

  return debounced;
}

// ─── Leading-edge debounce (fire immediately, then wait) ───
const debouncedLeading = debounceAdvanced(searchAPI, 400, { leading: true, trailing: false });

// ─── React-style custom hook (for reference) ──────────────
/*
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer); // cleanup on every value change
  }, [value, delay]);

  return debouncedValue;
}
*/

// ─── Common Debounce Use Cases ─────────────────────────────
// 1. Search input (wait for user to finish typing)
const debouncedSearch2 = debounce(fetchResults, 400);
function fetchResults(query) { /* API call */ }

// 2. Window resize handler
const debouncedResize = debounce(() => {
  recalculateLayout();
}, 200);
window.addEventListener("resize", debouncedResize);

// 3. Form auto-save
const debouncedSave = debounce((formData) => {
  saveToServer(formData);
}, 1000);

// 4. Validate on input (after typing stops)
const debouncedValidate = debounce((value) => {
  validateEmail(value);
}, 300);

function recalculateLayout() {}
function saveToServer(data) {}
function validateEmail(v) {}
```

---

## 2. Throttle

### Q: What is throttle, how do you implement it, and when should you use it?

**A:** Throttle ensures a function executes **at most once per specified time interval**, regardless of how many times it's called.

> **Mental model:** "Execute at most once every N milliseconds."

### Implementation

```javascript
// ─── Basic Throttle (time-based) ──────────────────────────
function throttle(fn, limit) {
  let lastRan = 0;

  return function (...args) {
    const now = Date.now();
    if (now - lastRan >= limit) {
      lastRan = now;
      return fn.apply(this, args);
    }
  };
}

// ─── Throttle with Trailing Call ──────────────────────────
// Ensures the LAST call is also executed (even if throttled)
function throttleWithTrailing(fn, limit) {
  let lastRan = 0;
  let timerId = null;

  return function (...args) {
    const now = Date.now();
    const remaining = limit - (now - lastRan);

    clearTimeout(timerId);

    if (remaining <= 0) {
      // Enough time has passed — execute immediately
      lastRan = now;
      fn.apply(this, args);
    } else {
      // Schedule trailing call
      timerId = setTimeout(() => {
        lastRan = Date.now();
        fn.apply(this, args);
      }, remaining);
    }
  };
}

// ─── Timer-based Throttle ─────────────────────────────────
function throttleTimer(fn, limit) {
  let waiting = false;

  return function (...args) {
    if (!waiting) {
      fn.apply(this, args);
      waiting = true;
      setTimeout(() => {
        waiting = false;
      }, limit);
    }
  };
}

// ─── Usage ────────────────────────────────────────────────
function onScroll() {
  const scrollY = window.scrollY;
  updateProgressBar(scrollY);
  lazyLoadImages(scrollY);
}

const throttledScroll = throttle(onScroll, 100); // max once per 100ms
window.addEventListener("scroll", throttledScroll, { passive: true });

// ─── Throttled Mouse Move ──────────────────────────────────
function onMouseMove(e) {
  updateTooltipPosition(e.clientX, e.clientY);
}
const throttledMouseMove = throttle(onMouseMove, 16); // ~60fps
document.addEventListener("mousemove", throttledMouseMove);

function updateProgressBar(y) {}
function lazyLoadImages(y) {}
function updateTooltipPosition(x, y) {}

// ─── Common Throttle Use Cases ─────────────────────────────
// 1. Scroll events (progress bars, infinite scroll, sticky headers)
const throttledScrollHandler = throttle(handleScroll, 100);

// 2. Mousemove (drag-and-drop, cursor effects, game loops)
const throttledDrag = throttle(handleDrag, 16);

// 3. API rate limiting (prevent exceeding rate limit)
const throttledAPICall = throttle(callAPI, 1000);

// 4. Button click (prevent double-submit)
const throttledSubmit = throttle(submitForm, 2000);

// 5. Real-time game loop actions
const throttledFire = throttle(fireProjectile, 500);

function handleScroll() {}
function handleDrag() {}
function callAPI() {}
function submitForm() {}
function fireProjectile() {}
```

---

## 3. Debounce vs Throttle Comparison

### Q: When do you use debounce vs throttle?

**A:**

| Feature                  | **Debounce**                              | **Throttle**                              |
|--------------------------|-------------------------------------------|-------------------------------------------|
| **Execution**            | After N ms of **silence**                 | At most once every N ms                   |
| **Call pattern**         | Waits for burst to end                    | Executes at regular intervals             |
| **Missed calls**         | Only last call matters                    | Regular sampling throughout calls         |
| **Timer reset**          | ✅ Yes — reset on every call              | ❌ No — fixed rate                        |
| **Leading/trailing**     | Both supported                            | Both supported                            |
| **Best for**             | Search input, resize, auto-save           | Scroll, mousemove, rate-limiting          |

```
DEBOUNCE: User types "hello world" quickly
─────────────────────────────────────────
Input events: h-e-l-l-o- -w-o-r-l-d
              ↑↑↑↑↑ ↑↑↑↑↑↑ (rapid keystrokes)
              (timer resets each time)
              
Execution:                              ↑
                                      (after 400ms silence)
                                      
Only ONE call — with final value "hello world" ✓

THROTTLE: User scrolls continuously for 2 seconds
──────────────────────────────────────────────────
Scroll events: ||||||||||||||||||||||||||||||||||||
               (continuous stream, 60 events/sec)

Execution:     ↑   ↑   ↑   ↑   ↑   ↑   ↑   ↑
               (every 100ms)
               
Regular sampling — keeps UI responsive ✓
```

```javascript
// Decision helper:
function chooseRateLimit(scenario) {
  const rules = {
    // Use DEBOUNCE when:
    "search input":         "debounce(fn, 300-500ms)",
    "window resize":        "debounce(fn, 150-300ms)",
    "form auto-save":       "debounce(fn, 1000-2000ms)",
    "email validation":     "debounce(fn, 300ms)",
    "autocomplete":         "debounce(fn, 400ms)",

    // Use THROTTLE when:
    "scroll handler":       "throttle(fn, 100ms)",
    "mousemove tracking":   "throttle(fn, 16ms) // 60fps",
    "drag and drop":        "throttle(fn, 16ms)",
    "infinite scroll":      "throttle(fn, 200ms)",
    "real-time game":       "throttle(fn, 16ms)",
    "API rate limiting":    "throttle(fn, 1000ms)",
    "button click guard":   "throttle(fn, 2000ms)",
  };

  return rules[scenario] || "evaluate your use case";
}
```

---

## 4. Memoization

### Q: What is memoization and how do you implement it?

**A:** Memoization caches the result of a function for given arguments, so repeated calls with the same arguments return the cached result instead of re-computing.

### Basic Implementation

```javascript
// ─── Simple Memoize (single argument) ─────────────────────
function memoize(fn) {
  const cache = new Map();

  return function (arg) {
    if (cache.has(arg)) {
      console.log("Cache hit:", arg);
      return cache.get(arg);
    }

    const result = fn.call(this, arg);
    cache.set(arg, result);
    return result;
  };
}

// ─── Multi-argument Memoize ────────────────────────────────
function memoizeMulti(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args); // serialize args as cache key

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// ─── Usage: Expensive computation ─────────────────────────
function expensiveCalc(n) {
  console.log(`Computing for ${n}...`);
  // Simulate expensive work
  let result = 0;
  for (let i = 0; i <= n; i++) result += i;
  return result;
}

const memoizedCalc = memoize(expensiveCalc);

memoizedCalc(1000); // Computing for 1000... → 500500
memoizedCalc(1000); // Cache hit: 1000 → 500500 (instant!)
memoizedCalc(500);  // Computing for 500...

// ─── Fibonacci with Memoization ───────────────────────────
// Without memoization: O(2^n)
function fibSlow(n) {
  if (n <= 1) return n;
  return fibSlow(n - 1) + fibSlow(n - 2);
}

// With memoization: O(n)
function memoizeFib() {
  const cache = { 0: 0, 1: 1 };

  return function fib(n) {
    if (n in cache) return cache[n];
    cache[n] = fib(n - 1) + fib(n - 2);
    return cache[n];
  };
}

const fib = memoizeFib();
console.log(fib(40)); // instant! (slow version would take seconds)
console.log(fib(41)); // instant! uses cached fib(40)

// ─── Memoize with WeakMap (for object args) ────────────────
function memoizeWeak(fn) {
  const cache = new WeakMap();

  return function (obj) {
    if (cache.has(obj)) {
      return cache.get(obj);
    }
    const result = fn.call(this, obj);
    cache.set(obj, result); // auto-GC'd when obj is collected ✓
    return result;
  };
}

// ─── Memoize with LRU eviction ────────────────────────────
function memoizeLRU(fn, maxSize = 100) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      // LRU: move to end (most recently used)
      const value = cache.get(key);
      cache.delete(key);
      cache.set(key, value);
      return value;
    }

    if (cache.size >= maxSize) {
      // Evict least recently used (first entry)
      cache.delete(cache.keys().next().value);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// ─── Common Use Cases ─────────────────────────────────────
// 1. Recursive algorithms (fib, factorial, combinatorics)
// 2. Expensive DOM computations (getBoundingClientRect — avoid repeatedly)
// 3. API response caching
// 4. Complex format/transform functions called repeatedly with same data
// 5. React useMemo / useCallback (built-in memoization)
```

### Complexity Improvement

| Algorithm         | Without Memo | With Memo |
|-------------------|--------------|-----------|
| Fibonacci(n)      | O(2ⁿ)        | O(n)      |
| Factorial(n)      | O(n)         | O(1)*     |
| Grid paths(m,n)   | O(2^(m+n))   | O(m×n)    |
| Coin change       | Exponential  | O(n×k)    |

---

## 5. Lazy Loading

### Q: What is lazy loading and how do you implement it for images, components, and routes?

**A:** Lazy loading defers loading resources until they are **actually needed**, reducing initial page load time.

### Lazy Loading Images

```javascript
// ─── Native HTML lazy loading (simplest) ──────────────────
// <img src="hero.jpg" loading="lazy" alt="Hero">
// Browser-native; supported in all modern browsers.

// ─── Intersection Observer API ────────────────────────────
function lazyLoadImages() {
  const images = document.querySelectorAll("img[data-src]");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const img = entry.target;
      img.src = img.dataset.src;             // swap placeholder for real src
      img.srcset = img.dataset.srcset || ""; // also handle srcset

      img.classList.add("loaded");
      obs.unobserve(img); // stop watching once loaded ✓
    });
  }, {
    root: null,        // viewport
    rootMargin: "200px", // start loading 200px before entering viewport
    threshold: 0.01    // trigger when 1% visible
  });

  images.forEach(img => observer.observe(img));
}

lazyLoadImages();

// HTML usage:
// <img
//   data-src="https://example.com/large-image.jpg"
//   src="data:image/svg+xml,<svg/>"  (tiny placeholder)
//   loading="lazy"
//   alt="Product photo"
//   class="lazy-img"
// >

// ─── CSS for smooth loading ────────────────────────────────
/*
.lazy-img {
  opacity: 0;
  transition: opacity 0.4s ease;
}
.lazy-img.loaded {
  opacity: 1;
}
*/
```

### Lazy Loading JS Modules (Dynamic Import)

```javascript
// ─── Dynamic import() — loads module only when needed ─────
const button = document.getElementById("open-chart");

button.addEventListener("click", async () => {
  // Module NOT loaded until first click
  const { Chart } = await import("./chart.js");
  const chart = new Chart("#canvas", { type: "bar", data: getData() });
});

function getData() {
  return { labels: ["A", "B", "C"], datasets: [{ data: [1, 2, 3] }] };
}

// ─── Lazy load with loading state ─────────────────────────
async function loadFeature(featureName) {
  const loadingEl = document.getElementById("loading");
  loadingEl.style.display = "block";

  try {
    const module = await import(`./features/${featureName}.js`);
    module.init();
  } catch (err) {
    console.error("Failed to load feature:", err);
  } finally {
    loadingEl.style.display = "none";
  }
}

// ─── React lazy + Suspense (for reference) ────────────────
/*
const HeavyComponent = React.lazy(() => import("./HeavyComponent"));

function App() {
  return (
    <React.Suspense fallback={<Spinner />}>
      <HeavyComponent />
    </React.Suspense>
  );
}
*/

// ─── Route-based lazy loading (vanilla SPA) ───────────────
const routes = {
  "/home":     () => import("./pages/Home.js"),
  "/about":    () => import("./pages/About.js"),
  "/dashboard":() => import("./pages/Dashboard.js"),
};

async function navigate(path) {
  const loader = routes[path];
  if (!loader) {
    console.error("Route not found:", path);
    return;
  }

  const module = await loader();
  const app = document.getElementById("app");
  app.innerHTML = "";
  module.render(app);
}
```

---

## 6. Code Splitting

### Q: What is code splitting and how does it improve performance?

**A:** Code splitting breaks a large JavaScript bundle into smaller chunks that are **loaded on demand**. It reduces the amount of JavaScript that must be parsed and executed on initial page load.

```javascript
// ─── Without code splitting ───────────────────────────────
// One huge bundle.js (3MB) — ALL code loaded upfront
// import { featureA } from "./featureA"; // always loaded
// import { featureB } from "./featureB"; // always loaded
// import { featureC } from "./featureC"; // always loaded — even if never used!

// ─── With code splitting (dynamic import) ─────────────────
// bundle.js (200KB) — only critical code
// featureA.chunk.js, featureB.chunk.js — loaded only when needed

// Entry point — loads fast
async function initApp() {
  // Core functionality — loaded immediately
  const { setupRouter } = await import("./router.js");
  setupRouter();
}

// Feature loaded only when user accesses it
document.getElementById("analytics-btn").addEventListener("click", async () => {
  const { initAnalytics } = await import("./analytics/index.js");
  initAnalytics(); // 150KB chunk, only loaded once, then cached
});

// ─── Webpack/Vite magic comments for optimization ──────────
// Named chunk — helps identify in DevTools
const module1 = await import(/* webpackChunkName: "analytics" */ "./analytics.js");

// Prefetch — loads during browser idle time AFTER current page loads
import(/* webpackPrefetch: true */ "./heavy-feature.js");
// <link rel="prefetch" href="heavy-feature.chunk.js"> injected automatically

// Preload — loads during current page load (high priority)
import(/* webpackPreload: true */ "./critical-chart.js");
// <link rel="preload" href="critical-chart.chunk.js"> injected automatically

// ─── Code splitting strategies ────────────────────────────
// 1. Route-based: split by page/route (most common)
// 2. Component-based: split heavy components (charts, editors, maps)
// 3. Vendor splitting: separate node_modules from app code (better caching)
// 4. Feature-flag based: load code only if feature enabled
// 5. User-role based: admin bundle separate from user bundle

// ─── Bundle analysis ─────────────────────────────────────
// webpack-bundle-analyzer: visualize what's in your bundle
// vite build --reporter verbose: see chunk sizes
// source-map-explorer: analyze bundle with source maps
```

---

## 7. Virtual Scrolling / Windowing

### Q: What is virtual scrolling and when should it be used?

**A:** Virtual scrolling (windowing) renders **only visible items** in the DOM at any time, even if the full list has millions of items.

```javascript
// ─── Without virtual scroll: 10,000 DOM nodes ────────────
function renderAllItems(data) {
  const list = document.getElementById("list");
  data.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.name;
    list.appendChild(li);
  });
  // 10,000 DOM nodes: slow initial render, massive memory usage 💥
}

// ─── Simple Virtual Scroller Implementation ───────────────
class VirtualScroller {
  constructor(container, items, itemHeight) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.visibleCount = Math.ceil(container.clientHeight / itemHeight) + 2; // +2 buffer

    this.setup();
  }

  setup() {
    // Total height = all items, but only rendered items exist in DOM
    this.totalHeight = this.items.length * this.itemHeight;

    // Outer scroll container — creates scrollbar
    this.outer = document.createElement("div");
    this.outer.style.cssText = `
      height: ${this.container.clientHeight}px;
      overflow-y: auto;
      position: relative;
    `;

    // Inner height spacer — makes scrollbar the right size
    this.inner = document.createElement("div");
    this.inner.style.height = `${this.totalHeight}px`;
    this.inner.style.position = "relative";

    this.outer.appendChild(this.inner);
    this.container.appendChild(this.outer);

    // Render initial viewport
    this.render(0);

    // Listen to scroll
    this.outer.addEventListener("scroll", () => {
      this.render(this.outer.scrollTop);
    }, { passive: true });
  }

  render(scrollTop) {
    const startIndex = Math.max(0, Math.floor(scrollTop / this.itemHeight) - 1);
    const endIndex = Math.min(this.items.length, startIndex + this.visibleCount + 2);

    // Build only visible items
    const fragment = document.createDocumentFragment();

    for (let i = startIndex; i < endIndex; i++) {
      const item = document.createElement("div");
      item.className = "virtual-item";
      item.style.cssText = `
        position: absolute;
        top: ${i * this.itemHeight}px;
        height: ${this.itemHeight}px;
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0 16px;
        box-sizing: border-box;
        border-bottom: 1px solid #eee;
      `;
      item.textContent = `${i + 1}. ${this.items[i].name}`;
      fragment.appendChild(item);
    }

    // Clear previous rendered items and render new ones
    this.inner.innerHTML = "";
    this.inner.appendChild(fragment);
  }
}

// Usage:
const bigData = Array.from({ length: 100_000 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1} — some description text`
}));

const container = document.getElementById("scroll-container");
// container must have a fixed height via CSS

const scroller = new VirtualScroller(container, bigData, 50); // 50px per item

// ─── Production Libraries ─────────────────────────────────
// react-window (by Brian Vaughn)    — lightweight, recommended
// react-virtualized                 — more features, heavier
// @tanstack/virtual                 — framework-agnostic
// vue-virtual-scroller              — for Vue

// ─── When to use virtual scrolling ───────────────────────
// ✓ Lists > 500 items
// ✓ Complex item templates (images, nested components)
// ✓ Real-time feeds (chat, logs, metrics)
// ✗ Small lists (< 100 items) — overhead not worth it
// ✗ Items with variable/unknown height — harder to implement
```

---

## 8. Web Workers

### Q: What are Web Workers and when should you use them?

**A:** Web Workers run JavaScript in **background threads**, keeping the main thread free for UI rendering. They communicate via message passing.

```javascript
// ─── Main Thread: create and communicate with worker ──────
// worker is created from a separate JS file
const worker = new Worker("./heavy-worker.js");

// Send data to worker
worker.postMessage({
  type: "SORT",
  payload: generateHugeArray(1_000_000)
});

// Receive result from worker (non-blocking!)
worker.onmessage = function (event) {
  const { type, payload } = event.data;
  if (type === "SORT_DONE") {
    renderResults(payload);
  }
};

// Handle errors
worker.onerror = function (error) {
  console.error("Worker error:", error.message);
  worker.terminate();
};

// Terminate worker when done
function cleanup() {
  worker.terminate();
}

function generateHugeArray(size) {
  return Array.from({ length: size }, () => Math.random());
}

function renderResults(data) {
  console.log("Sorted first 5:", data.slice(0, 5));
}
```

```javascript
// ─── heavy-worker.js ──────────────────────────────────────
// (this runs in a separate thread)

self.onmessage = function (event) {
  const { type, payload } = event.data;

  if (type === "SORT") {
    // This runs in background — main thread stays responsive!
    const sorted = payload.sort((a, b) => a - b);

    // Send result back to main thread
    self.postMessage({
      type: "SORT_DONE",
      payload: sorted
    });
  }

  if (type === "COMPUTE_PRIMES") {
    const primes = findPrimesUpTo(payload.limit);
    self.postMessage({ type: "PRIMES_DONE", payload: primes });
  }
};

function findPrimesUpTo(limit) {
  const sieve = new Uint8Array(limit + 1).fill(1);
  sieve[0] = sieve[1] = 0;
  for (let i = 2; i * i <= limit; i++) {
    if (sieve[i]) {
      for (let j = i * i; j <= limit; j += i) {
        sieve[j] = 0;
      }
    }
  }
  const primes = [];
  for (let i = 2; i <= limit; i++) {
    if (sieve[i]) primes.push(i);
  }
  return primes;
}
```

### Transferable Objects (Zero-Copy Transfer)

```javascript
// ─── Transferring large buffers without copying ────────────
const buffer = new ArrayBuffer(1024 * 1024 * 64); // 64MB
const view = new Float64Array(buffer);
view.fill(Math.random());

// Transfer ownership (zero-copy) — buffer detached from main thread
worker.postMessage({ type: "PROCESS", buffer }, [buffer]);

// buffer is now detached — don't use it in main thread anymore!
// console.log(buffer.byteLength); // 0 — transferred!

// ─── Inline Worker (no separate file needed) ───────────────
function createInlineWorker(fn) {
  const blob = new Blob([`(${fn.toString()})()`], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);
  URL.revokeObjectURL(url); // cleanup URL after worker created
  return worker;
}

const inlineWorker = createInlineWorker(function () {
  self.onmessage = function (e) {
    // Do work
    const result = e.data * 2;
    self.postMessage(result);
  };
});

inlineWorker.postMessage(21);
inlineWorker.onmessage = (e) => console.log("Result:", e.data); // 42

// ─── Worker Pool ──────────────────────────────────────────
class WorkerPool {
  constructor(workerScript, size = navigator.hardwareConcurrency || 4) {
    this.workers = Array.from({ length: size }, () => new Worker(workerScript));
    this.queue = [];
    this.idle = [...this.workers];
  }

  run(data) {
    return new Promise((resolve, reject) => {
      const task = { data, resolve, reject };

      if (this.idle.length > 0) {
        this.dispatch(this.idle.pop(), task);
      } else {
        this.queue.push(task); // wait for a free worker
      }
    });
  }

  dispatch(worker, task) {
    worker.onmessage = (e) => {
      task.resolve(e.data);
      if (this.queue.length > 0) {
        this.dispatch(worker, this.queue.shift()); // process next task
      } else {
        this.idle.push(worker); // return to idle pool
      }
    };
    worker.onerror = (e) => task.reject(e);
    worker.postMessage(task.data);
  }

  terminate() {
    this.workers.forEach(w => w.terminate());
  }
}
```

---

## 9. requestAnimationFrame vs setTimeout

### Q: Why should you use requestAnimationFrame instead of setTimeout for animations?

**A:**

| Feature                    | `requestAnimationFrame`              | `setTimeout`                          |
|----------------------------|--------------------------------------|---------------------------------------|
| **Timing**                 | Synced to display refresh (60fps)    | Timer-based, may not align with paint |
| **Accuracy**               | Precise — fired just before repaint  | Imprecise — can drift                 |
| **Tab inactive**           | Pauses automatically (battery-saving)| Keeps firing                          |
| **GPU optimization**       | CSS animations in rAF are GPU-synced | Not coordinated with GPU              |
| **Cancelable**             | `cancelAnimationFrame(id)` ✓        | `clearTimeout(id)` ✓                 |
| **Callback argument**      | High-res timestamp (DOMHighResTimestamp) | None                               |
| **Interval equivalent**    | Must re-schedule each frame          | `setInterval(fn, 0)` possible         |

```javascript
// ─── BAD: setTimeout for animation ────────────────────────
let position = 0;

function animateBad() {
  position += 2;
  document.getElementById("box").style.left = position + "px";

  if (position < 500) {
    setTimeout(animateBad, 16); // ~60fps but NOT synced to screen refresh
    // Problems:
    // - May fire at wrong time in render cycle → jank
    // - Fires even when tab is hidden → wastes battery
    // - 16ms is approximate; actual interval varies
  }
}
setTimeout(animateBad, 16);

// ─── GOOD: requestAnimationFrame ──────────────────────────
let pos = 0;
let animId = null;

function animateGood(timestamp) {
  // timestamp = DOMHighResTimestamp (ms since page load, high precision)
  pos += 2;
  document.getElementById("box").style.transform = `translateX(${pos}px)`;

  if (pos < 500) {
    animId = requestAnimationFrame(animateGood); // schedule next frame ✓
  }
}

animId = requestAnimationFrame(animateGood);

// Cancel animation
function stopAnimation() {
  cancelAnimationFrame(animId);
}

// ─── Time-based animation (frame-rate independent) ────────
function createAnimation(duration) {
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1); // 0 to 1

    // Easing function (ease-in-out)
    const eased = progress < 0.5
      ? 2 * progress * progress
      : -1 + (4 - 2 * progress) * progress;

    const x = eased * 500; // 0 to 500px
    document.getElementById("box").style.transform = `translateX(${x}px)`;

    if (progress < 1) {
      requestAnimationFrame(step); // continue until done
    } else {
      console.log("Animation complete!");
    }
  }

  requestAnimationFrame(step);
}

createAnimation(1000); // 1 second animation

// ─── rAF for scroll-synced effects ───────────────────────
let ticking = false;

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateScrollEffects(window.scrollY);
      ticking = false;
    });
    ticking = true; // prevent multiple rAF per scroll event
  }
}, { passive: true });

function updateScrollEffects(scrollY) {
  const parallax = document.getElementById("parallax");
  parallax.style.transform = `translateY(${scrollY * 0.5}px)`;
}
```

---

## 10. Script Loading: defer vs async vs normal

### Q: What are the differences between normal, defer, and async script loading?

**A:**

```
Normal <script>:
HTML Parse ──► [STOP] ──► Fetch + Execute ──► [RESUME] ──► HTML Parse
               ↑ blocking!

Async <script async>:
HTML Parse ─────────────────────────────────────────► HTML Parse
                  Fetch ──► [STOP] ─► Execute ─► [RESUME]
                  ↑ fetch parallel, but execution still blocks!
                  ↑ order NOT guaranteed

Defer <script defer>:
HTML Parse ──────────────────────────────────────────────────────►
              Fetch (parallel) ──────────────────► Execute (after parse)
              ↑ fetch parallel + DOM ready first + order preserved ✓
```

| Feature                  | `<script>`        | `<script async>`   | `<script defer>`   |
|--------------------------|-------------------|--------------------|--------------------|
| **HTML parsing**         | Blocked           | NOT blocked        | NOT blocked        |
| **Fetch timing**         | Blocks parse      | Parallel           | Parallel           |
| **Execute timing**       | Immediately       | When fetched       | After DOM parsed   |
| **Execution order**      | In order          | NOT guaranteed     | Preserved          |
| **DOMContentLoaded**     | Before            | Not related        | Before DCL fires   |
| **Use case**             | Inline scripts    | Independent scripts| Most JS files      |

```html
<!-- Normal: blocks rendering (avoid in <head>) -->
<script src="app.js"></script>

<!-- Async: good for independent scripts (analytics, ads) -->
<script async src="analytics.js"></script>
<script async src="ads.js"></script>
<!-- These may run in any order! Don't use if they depend on each other -->

<!-- Defer: best for most app scripts -->
<script defer src="vendor.js"></script>
<script defer src="app.js"></script>
<!-- These run in order, after HTML parsed, before DOMContentLoaded -->

<!-- Module scripts are deferred by default -->
<script type="module" src="app.mjs"></script>
<!-- Same as defer + supports import/export -->
```

```javascript
// ─── Dynamic script loading ────────────────────────────────
function loadScript(src, options = {}) {
  return new Promise((resolve, reject) => {
    // Don't load same script twice
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = options.async !== false; // default true
    script.defer = options.defer || false;
    script.crossOrigin = options.crossOrigin || "anonymous";

    script.onload = resolve;
    script.onerror = () => reject(new Error(`Script load failed: ${src}`));

    document.head.appendChild(script);
  });
}

// Usage
async function loadAnalytics() {
  await loadScript("https://cdn.example.com/analytics.js", { async: true });
  window.Analytics.init("UA-12345");
}

// Load scripts in sequence (order matters)
async function loadDependencies() {
  await loadScript("/vendor/jquery.min.js");    // must load first
  await loadScript("/vendor/jquery-ui.min.js"); // depends on jQuery
  await loadScript("/app.js");                  // depends on both
}

// Load scripts in parallel (independent)
async function loadIndependent() {
  await Promise.all([
    loadScript("/analytics.js"),
    loadScript("/chat-widget.js"),
    loadScript("/ads.js"),
  ]);
}
```

---

## 11. Critical Rendering Path Optimization

### Q: What is the Critical Rendering Path and how do you optimize it?

**A:** The CRP is the sequence of steps the browser must complete before displaying content:

```
1. HTML → DOM
2. CSS → CSSOM
3. DOM + CSSOM → Render Tree
4. Layout (calculate positions/sizes)
5. Paint (draw pixels)
6. Composite (layer painting, GPU)
```

### Optimization Techniques

```javascript
// ─── 1. Minimize render-blocking resources ─────────────────
// CSS blocks rendering — inline critical CSS, load rest async
/*
<style>
  /* Inline critical above-the-fold CSS */
  body { margin: 0; font-family: sans-serif; }
  header { background: #1a1a2e; color: white; }
</style>
<link rel="preload" href="styles.css" as="style" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="styles.css"></noscript>
*/

// ─── 2. Preconnect, Preload, Prefetch ─────────────────────
/*
<!-- Establish connection early to third-party domains -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://cdn.example.com">

<!-- Preload critical resources (fonts, hero image, main JS) -->
<link rel="preload" href="/fonts/Inter.woff2" as="font" crossorigin>
<link rel="preload" href="/hero.jpg" as="image">
<link rel="preload" href="/app.js" as="script">

<!-- Prefetch resources needed for next navigation -->
<link rel="prefetch" href="/about.html">
*/

// ─── 3. Font loading optimization ─────────────────────────
/*
@font-face {
  font-family: "Inter";
  src: url("/fonts/Inter.woff2") format("woff2");
  font-display: swap; /* show fallback font immediately, swap when loaded */
}
*/

// ─── 4. Image optimization ────────────────────────────────
/*
<!-- Modern image formats + responsive images -->
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="Hero" width="1200" height="630"
       fetchpriority="high">  <!-- hint: this is important -->
</picture>

<!-- Specify dimensions to prevent CLS (Cumulative Layout Shift) -->
<img src="product.jpg" width="400" height="300" loading="lazy">
*/

// ─── 5. Measure and improve Time to First Byte (TTFB) ─────
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === "navigation") {
      const ttfb = entry.responseStart - entry.requestStart;
      const fcp = entry.loadEventStart;
      console.log("TTFB:", ttfb.toFixed(2), "ms");
    }
  }
});
observer.observe({ type: "navigation", buffered: true });
```

---

## 12. Layout Thrashing

### Q: What is layout thrashing and how do you prevent it?

**A:** Layout thrashing (also called forced synchronous layouts) occurs when JavaScript **reads** layout properties after **writing** style changes, forcing the browser to recalculate layout synchronously.

```javascript
// ─── BAD: Thrashing ───────────────────────────────────────
const panels = document.querySelectorAll(".panel");

panels.forEach(panel => {
  panel.style.width = "200px";         // WRITE — invalidates layout
  const height = panel.offsetHeight;   // READ — forced layout recalc!
  panel.style.height = height + 10 + "px"; // WRITE — invalidates again
  const newWidth = panel.offsetWidth;  // READ — another forced recalc!
  console.log(newWidth);
});
// n panels = 2n forced layout recalculations 💥

// ─── GOOD: Batch reads, then batch writes ──────────────────
const panels2 = Array.from(document.querySelectorAll(".panel"));

// Phase 1: Read all measurements (one layout calculation)
const measurements = panels2.map(panel => ({
  height: panel.offsetHeight,
  width: panel.offsetWidth
}));

// Phase 2: Write all changes (one layout invalidation)
panels2.forEach((panel, i) => {
  panel.style.width = "200px";
  panel.style.height = measurements[i].height + 10 + "px";
});
// Only 2 layout calculations total ✓

// ─── Using fastdom library pattern ────────────────────────
// fastdom batches reads/writes using requestAnimationFrame

class FastDom {
  constructor() {
    this.readQueue = [];
    this.writeQueue = [];
    this.scheduled = false;
  }

  measure(fn) {
    this.readQueue.push(fn);
    this.schedule();
  }

  mutate(fn) {
    this.writeQueue.push(fn);
    this.schedule();
  }

  schedule() {
    if (!this.scheduled) {
      this.scheduled = true;
      requestAnimationFrame(() => this.flush());
    }
  }

  flush() {
    const reads = this.readQueue.splice(0);
    const writes = this.writeQueue.splice(0);

    reads.forEach(fn => fn());    // all reads first
    writes.forEach(fn => fn());   // all writes after

    this.scheduled = false;
  }
}

const fastdom = new FastDom();

// Usage — automatically batched:
panels2.forEach(panel => {
  fastdom.measure(() => {
    const h = panel.offsetHeight;     // safe read
    fastdom.mutate(() => {
      panel.style.height = h + 10 + "px"; // safe write
    });
  });
});

// ─── Properties that trigger layout/reflow ────────────────
/*
Avoid reading these after writing styles:
- element.offsetWidth/Height/Top/Left
- element.scrollWidth/Height/Top/Left
- element.clientWidth/Height/Top/Left
- element.getBoundingClientRect()
- window.getComputedStyle(element)
- window.scrollX, window.scrollY
- document.body.scrollTop/Left
*/

// ─── CSS containment (prevent reflow propagation) ─────────
/*
.card {
  contain: layout;     /* layout changes don't affect outside */
  /* contain: content;  /* also isolates paint/size */
  /* contain: strict;   /* most aggressive containment */
}
*/
```

---

## 13. Caching Strategies

### Q: What are common caching strategies for JavaScript applications?

```javascript
// ─── 1. HTTP Cache (browser) ──────────────────────────────
// Server sets headers:
// Cache-Control: max-age=31536000, immutable  (for hashed assets)
// Cache-Control: no-cache  (always revalidate)
// Cache-Control: no-store  (never cache — sensitive data)
// ETag: "abc123"  (conditional requests)

// ─── 2. Service Worker Cache ──────────────────────────────
// sw.js — registered service worker

const CACHE_NAME = "app-v1";
const ASSETS_TO_CACHE = ["/", "/app.js", "/styles.css", "/offline.html"];

// Install: cache core assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first strategy
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached; // serve from cache ✓
      return fetch(event.request).then(response => {
        // Cache dynamic responses
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});

// ─── 3. In-Memory Cache (JS) ──────────────────────────────
// See LRUCache and TTLCache in Memory-Management.md

// ─── 4. localStorage / sessionStorage ────────────────────
const StorageCache = {
  set(key, value, ttlMs) {
    const item = {
      value,
      expiresAt: ttlMs ? Date.now() + ttlMs : null
    };
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (e) {
      // QuotaExceededError — localStorage full (5-10MB limit)
      console.warn("localStorage full:", e);
    }
  },

  get(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const item = JSON.parse(raw);
      if (item.expiresAt && Date.now() > item.expiresAt) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value;
    } catch {
      return null;
    }
  },

  remove(key) { localStorage.removeItem(key); },
  clear() { localStorage.clear(); }
};

// Cache API response for 10 minutes
async function fetchWithCache(url) {
  const cached = StorageCache.get(url);
  if (cached) return cached;

  const data = await fetch(url).then(r => r.json());
  StorageCache.set(url, data, 10 * 60 * 1000); // 10 minutes
  return data;
}
```

---

## 14. Bundle Size Optimization

### Q: How do you reduce JavaScript bundle size?

```javascript
// ─── 1. Tree Shaking (remove unused exports) ──────────────
// BAD: imports entire library
import _ from "lodash"; // ~530KB!
const result = _.chunk([1, 2, 3, 4], 2);

// GOOD: import only what you need
import chunk from "lodash/chunk"; // ~2KB ✓
// or ES module version:
import { chunk } from "lodash-es"; // tree-shakeable ✓

// ─── 2. Replace heavy libraries ───────────────────────────
// moment.js (~70KB) → date-fns (~13KB) or day.js (~2KB)
// import moment from "moment";
import { format, parseISO } from "date-fns"; // much smaller ✓
const formatted = format(new Date(), "yyyy-MM-dd");

// ─── 3. Dynamic imports for code splitting ─────────────────
// See Section 6: Code Splitting

// ─── 4. Analyze your bundle ───────────────────────────────
// webpack:
//   npm install --save-dev webpack-bundle-analyzer
//   webpack --profile --json > stats.json
//   webpack-bundle-analyzer stats.json

// vite:
//   npx vite build --reporter verbose
//   or use rollup-plugin-visualizer

// ─── 5. Compression ───────────────────────────────────────
// gzip: typically 60-70% size reduction
// brotli: typically 70-80% size reduction (better than gzip)
// Configure on server (Nginx, CDN) or in build tool

// ─── 6. Minification & Mangling ───────────────────────────
// Webpack production mode / Vite build — automatically:
// - Removes whitespace and comments
// - Shortens variable names (mangling)
// - Removes dead code (unused variables, unreachable)

// ─── 7. Use lightweight alternatives ──────────────────────
const alternatives = {
  "axios":       ["fetch (built-in)", "ky (3KB)"],
  "moment":      ["date-fns (13KB)", "day.js (2KB)", "luxon (23KB)"],
  "lodash":      ["lodash-es (tree-shakeable)", "native array methods"],
  "jquery":      ["vanilla JS (0KB)", "cash (8KB)"],
  "chart.js":    ["uPlot (25KB)", "lightweight-charts"],
  "redux":       ["zustand (3KB)", "jotai (5KB)"],
};

// ─── 8. Defer non-critical CSS ────────────────────────────
/*
function loadCSS(href) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}
// Call after page interactive
window.addEventListener("load", () => loadCSS("/styles/non-critical.css"));
*/
```

---

## 15. Core Web Vitals: LCP, FID/INP, CLS

### Q: What are Core Web Vitals and what are the targets?

**A:**

| Metric                              | Measures                              | Good      | Needs Improvement | Poor     |
|-------------------------------------|---------------------------------------|-----------|-------------------|----------|
| **LCP** (Largest Contentful Paint)  | Loading performance                   | ≤ 2.5s    | 2.5s – 4s         | > 4s     |
| **FID** (First Input Delay) *(deprecated)* | Interactivity               | ≤ 100ms   | 100ms – 300ms     | > 300ms  |
| **INP** (Interaction to Next Paint) | Overall interactivity responsiveness  | ≤ 200ms   | 200ms – 500ms     | > 500ms  |
| **CLS** (Cumulative Layout Shift)   | Visual stability                      | ≤ 0.1     | 0.1 – 0.25        | > 0.25   |

```javascript
// ─── Measuring LCP ────────────────────────────────────────
const lcpObserver = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lastEntry = entries[entries.length - 1]; // last = largest
  console.log("LCP:", lastEntry.startTime.toFixed(2), "ms");
  console.log("LCP Element:", lastEntry.element);
});
lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

// ─── Improving LCP ────────────────────────────────────────
// 1. Preload hero image:
//    <link rel="preload" href="/hero.jpg" as="image" fetchpriority="high">
// 2. Use fetchpriority="high" on LCP element's <img>
// 3. Reduce TTFB (fast server, CDN, edge caching)
// 4. Inline critical CSS
// 5. Remove render-blocking scripts from <head>

// ─── Measuring INP (replaces FID in 2024) ─────────────────
const inpObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === "event") {
      const inp = entry.processingEnd - entry.startTime;
      if (inp > 200) {
        console.warn("Slow interaction:", entry.name, inp.toFixed(2), "ms");
      }
    }
  }
});
inpObserver.observe({ type: "event", buffered: true, durationThreshold: 16 });

// ─── Improving INP ────────────────────────────────────────
// 1. Break up long tasks (> 50ms) with scheduler.yield() or setTimeout 0
// 2. Use Web Workers for heavy computation
// 3. Debounce/throttle event handlers
// 4. Avoid synchronous layout reads in event handlers

// ─── Measuring CLS ────────────────────────────────────────
let clsValue = 0;
let clsEntries = [];

const clsObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) { // only count unexpected shifts
      clsValue += entry.value;
      clsEntries.push(entry);
      console.log("CLS so far:", clsValue.toFixed(4));
    }
  }
});
clsObserver.observe({ type: "layout-shift", buffered: true });

// ─── Preventing CLS ───────────────────────────────────────
// 1. Always specify width + height on images:
//    <img src="photo.jpg" width="400" height="300">
// 2. Reserve space for ads/embeds:
//    .ad-container { min-height: 250px; }
// 3. Don't insert content above existing content without user action
// 4. Use CSS transform for animations (not top/left)
// 5. Preload fonts with font-display: optional or swap

// ─── web-vitals library ───────────────────────────────────
// npm install web-vitals
/*
import { onLCP, onINP, onCLS, onFCP, onTTFB } from "web-vitals";

function sendToAnalytics({ name, value, rating, id }) {
  navigator.sendBeacon("/analytics", JSON.stringify({ name, value, rating, id }));
}

onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);
onFCP(sendToAnalytics);
onTTFB(sendToAnalytics);
*/
```

---

## 16. Performance Measurement APIs

### Q: How do you use performance.now() and PerformanceObserver to measure performance?

**A:**

```javascript
// ─── performance.now() ────────────────────────────────────
// High-resolution timestamp (sub-millisecond precision)
// Relative to page load, NOT system clock

const start = performance.now();

// Simulate expensive work
const arr = new Array(1_000_000).fill(0).map((_, i) => i * 2);
const sum = arr.reduce((a, b) => a + b, 0);

const end = performance.now();
console.log(`Operation took: ${(end - start).toFixed(3)}ms`);
console.log("Sum:", sum);

// ─── Performance Marks and Measures ───────────────────────
performance.mark("myFeature:start");

// ... some code ...
fetchUserData();

performance.mark("myFeature:end");

// Create a named measure between two marks
performance.measure("myFeature:duration", "myFeature:start", "myFeature:end");

// Get all measures
const measures = performance.getEntriesByName("myFeature:duration");
measures.forEach(m => {
  console.log(`${m.name}: ${m.duration.toFixed(2)}ms`);
});

// Clear marks to avoid memory buildup
performance.clearMarks("myFeature:start");
performance.clearMarks("myFeature:end");
performance.clearMeasures("myFeature:duration");

function fetchUserData() { /* simulate */ }

// ─── PerformanceObserver ──────────────────────────────────
const perfObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log({
      name:     entry.name,
      type:     entry.entryType,
      duration: entry.duration?.toFixed(2) + "ms",
      start:    entry.startTime?.toFixed(2) + "ms"
    });
  }
});

// Observe multiple entry types
perfObserver.observe({
  entryTypes: ["measure", "mark", "resource", "navigation", "paint"]
});

// ─── Resource Timing API ──────────────────────────────────
const resources = performance.getEntriesByType("resource");

resources.forEach(entry => {
  if (entry.initiatorType === "script" || entry.initiatorType === "img") {
    const networkTime = entry.responseEnd - entry.requestStart;
    const totalTime   = entry.responseEnd - entry.startTime;

    console.log(`
      Resource: ${entry.name.split("/").pop()}
      DNS:      ${(entry.domainLookupEnd - entry.domainLookupStart).toFixed(2)}ms
      TCP:      ${(entry.connectEnd - entry.connectStart).toFixed(2)}ms
      Request:  ${(entry.responseStart - entry.requestStart).toFixed(2)}ms
      Download: ${(entry.responseEnd - entry.responseStart).toFixed(2)}ms
      Total:    ${totalTime.toFixed(2)}ms
    `);
  }
});

// ─── Navigation Timing ────────────────────────────────────
const [nav] = performance.getEntriesByType("navigation");

const timings = {
  "DNS Lookup":   nav.domainLookupEnd - nav.domainLookupStart,
  "TCP Connect":  nav.connectEnd - nav.connectStart,
  "TTFB":         nav.responseStart - nav.requestStart,
  "Download":     nav.responseEnd - nav.responseStart,
  "DOM Parse":    nav.domContentLoadedEventEnd - nav.responseEnd,
  "Total Load":   nav.loadEventEnd - nav.startTime,
};

console.table(timings);

// ─── Profiling helper ─────────────────────────────────────
function profile(label, fn) {
  const mark1 = `${label}:start`;
  const mark2 = `${label}:end`;
  const measure = `${label}:duration`;

  performance.mark(mark1);
  const result = fn();
  performance.mark(mark2);
  performance.measure(measure, mark1, mark2);

  const [entry] = performance.getEntriesByName(measure);
  console.log(`[profile] ${label}: ${entry.duration.toFixed(3)}ms`);

  performance.clearMarks(mark1);
  performance.clearMarks(mark2);
  performance.clearMeasures(measure);

  return result;
}

// Usage:
const sorted = profile("Array sort 100k", () => {
  return Array.from({ length: 100_000 }, () => Math.random()).sort((a, b) => a - b);
});
```

---

## 17. Quick Reference

| Concept                    | Key Point                                                                   |
|----------------------------|-----------------------------------------------------------------------------|
| **Debounce**               | Waits N ms after LAST call; resets timer; good for input, resize, save      |
| **Throttle**               | Executes at most once per N ms; good for scroll, mousemove, game loops      |
| **Memoization**            | Cache results by args; trades memory for CPU; Fibonacci O(2ⁿ) → O(n)      |
| **Lazy loading images**    | `loading="lazy"` or IntersectionObserver; load only when near viewport      |
| **Code splitting**         | Dynamic `import()` splits bundle; load chunks on demand                     |
| **Virtual scrolling**      | Render only visible items; essential for 1000+ item lists                   |
| **Web Workers**            | Off-main-thread computation; postMessage API; no DOM access                 |
| **rAF vs setTimeout**      | rAF synced to screen refresh; pauses in hidden tabs; use for animations     |
| **`defer`**                | Fetch parallel, execute after DOM parsed, order preserved — best for app JS |
| **`async`**                | Fetch parallel, execute ASAP, order NOT guaranteed — for independent scripts |
| **Layout thrashing**       | Read-after-write forces synchronous layout; batch reads then writes         |
| **Reflow triggers**        | offsetWidth/Height, getBoundingClientRect, getComputedStyle                 |
| **GPU compositing**        | `transform` + `opacity` skip layout & paint; ideal for animations           |
| **Tree shaking**           | Dead code elimination; requires ES modules; use `import { fn } from "lib"`  |
| **LCP**                    | Largest paint ≤ 2.5s; optimize hero images, TTFB, render-blocking CSS      |
| **INP**                    | Interaction ≤ 200ms; break long tasks, use workers, debounce handlers       |
| **CLS**                    | Layout shift ≤ 0.1; set image dimensions, reserve space for dynamic content |
| **performance.now()**      | High-res timestamp, sub-ms precision, relative to page load                 |
| **PerformanceObserver**    | Watch LCP, CLS, INP, resource timing, marks/measures                        |

### Optimization Decision Tree

```
Slow initial load?
  ├─ Too much JS? → Code splitting + lazy loading
  ├─ Large images? → Lazy loading + modern formats (WebP/AVIF) + correct sizing
  ├─ Render-blocking CSS? → Inline critical CSS, defer rest
  └─ Slow server? → TTFB optimization, CDN, caching

Slow interactions?
  ├─ Long event handlers? → Debounce + move heavy work to Worker
  ├─ Frequent events (scroll/move)? → Throttle + rAF
  └─ DOM thrashing? → Batch reads/writes, use transforms

Large bundle?
  ├─ Heavy dependencies? → Replace with lighter alternatives, tree-shake
  ├─ All code loaded upfront? → Code splitting + dynamic imports
  └─ Not compressed? → Enable gzip/brotli on server

Long lists?
  └─ > 500 items? → Virtual scrolling (react-window, @tanstack/virtual)
```

---

*Last updated: 2026-07-22 | Category: JavaScript / Performance | Level: Intermediate → Advanced*
