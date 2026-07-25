# 🔥 Most Asked JavaScript Programs — Senior UI Interview

> **Category:** Coding | **Level:** Senior UI Developer
> **Last Updated:** 2026-07-26

---

## 1. Debounce Function Implementation

```javascript
/**
 * Debounce delays executing a function until after `delay` ms
 * have elapsed since the last time it was invoked.
 */
function debounce(func, delay = 300) {
  let timerId;

  return function (...args) {
    const context = this;
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

// Immediate Debounce Variant (Leading edge)
function debounceLeading(func, delay = 300) {
  let timerId;

  return function (...args) {
    const context = this;
    const callNow = !timerId;

    clearTimeout(timerId);
    timerId = setTimeout(() => {
      timerId = null;
    }, delay);

    if (callNow) func.apply(context, args);
  };
}
```

---

## 2. Throttle Function Implementation

```javascript
/**
 * Throttle guarantees a function runs at most once every `limit` ms.
 */
function throttle(func, limit = 300) {
  let inThrottle = false;

  return function (...args) {
    const context = this;

    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
```

---

## 3. Currying Implementation (`curry`)

```javascript
/**
 * Transforms a function of N arguments into a sequence of N unary functions.
 */
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (...nextArgs) {
        return curried.apply(this, args.concat(nextArgs));
      };
    }
  };
}

// Test
const sum = (a, b, c) => a + b + c;
const curriedSum = curry(sum);

console.log(curriedSum(1)(2)(3)); // 6
console.log(curriedSum(1, 2)(3)); // 6
```

---

## 4. Infinite Currying (`sum(1)(2)(3)...()`)

```javascript
/**
 * Infinite currying function that returns accumulated sum when invoked with no arguments.
 */
function add(a) {
  return function (b) {
    if (b !== undefined) {
      return add(a + b);
    }
    return a;
  };
}

// Test
console.log(add(1)(2)(3)());       // 6
console.log(add(5)(10)(15)(20)()); // 50
```

---

## 5. Memoize Utility Function

```javascript
/**
 * Memoize caches function results based on arguments.
 */
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Test
const expensiveCalc = memoize((a, b) => {
  console.log('Computing...');
  return a * b;
});

console.log(expensiveCalc(4, 5)); // "Computing..." -> 20
console.log(expensiveCalc(4, 5)); // Returns cached 20 (No "Computing...")
```

---

## 6. Compose and Pipe Functions

```javascript
// Compose: Right-to-Left execution
const compose = (...fns) => (initialVal) =>
  fns.reduceRight((acc, fn) => fn(acc), initialVal);

// Pipe: Left-to-Right execution
const pipe = (...fns) => (initialVal) =>
  fns.reduce((acc, fn) => fn(acc), initialVal);

// Test
const add5 = x => x + 5;
const multiply2 = x => x * 2;

console.log(compose(multiply2, add5)(10)); // (10 + 5) * 2 = 30
console.log(pipe(add5, multiply2)(10));    // (10 + 5) * 2 = 30
```

---

## 7. LRU (Least Recently Used) Cache Implementation

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // Map preserves insertion order!
  }

  get(key) {
    if (!this.cache.has(key)) return -1;

    // Refresh key to make it most recently used
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);

    return val;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Delete first (oldest) key in Map
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }
}

// Test
const lru = new LRUCache(2);
lru.put(1, 1);
lru.put(2, 2);
console.log(lru.get(1)); // 1
lru.put(3, 3);          // Evicts key 2
console.log(lru.get(2)); // -1 (Evicted)
```

---

## 📝 Top 5 Mandatory Programs to Master Before Any Frontend Interview

1. **Debounce & Throttle** with context handling (`apply`).
2. **Infinite Currying** (`sum(1)(2)(3)...()`).
3. **`Promise.all` & `Array.prototype.reduce` Polyfills**.
4. **LRU Cache** using JS Map insertion order.
5. **Deep Clone** with WeakMap for circular references.

---

*Senior UI Developer Interview Prep — Most Asked Programs*
