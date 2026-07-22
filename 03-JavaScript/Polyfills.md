# JavaScript Polyfills — Interview Q&A
> Category: JavaScript | Level: Intermediate → Advanced | Last Updated: 2026-07-22

---

## Table of Contents
1. [Array Polyfills](#-array-polyfills)
   - [Array.prototype.map()](#array-prototypemap)
   - [Array.prototype.filter()](#array-prototypefilter)
   - [Array.prototype.reduce()](#array-prototypereduce)
   - [Array.prototype.forEach()](#array-prototypeforeach)
   - [Array.prototype.flat()](#array-prototypeflat)
   - [Array.prototype.find()](#array-prototypefind)
   - [Array.prototype.findIndex()](#array-prototypefindindex)
2. [Function Polyfills](#-function-polyfills)
   - [Function.prototype.call()](#functionprototypecall)
   - [Function.prototype.apply()](#functionprototypeapply)
   - [Function.prototype.bind()](#functionprototypebind)
3. [Promise Polyfills](#-promise-polyfills)
   - [Promise.all()](#promiseall)
   - [Promise.race()](#promiserace)
   - [Promise.allSettled()](#promiseallsettled)
4. [Object Polyfills](#-object-polyfills)
   - [Object.create()](#objectcreate)
   - [Object.assign()](#objectassign)
5. [Utility Polyfills / Implementations](#-utility-implementations)
   - [debounce()](#debounce)
   - [throttle()](#throttle)
   - [memoize()](#memoize)
   - [curry()](#curry)
6. [typeof Operator Behavior](#-typeof-operator-behavior)
7. [Quick Reference](#quick-reference)

---

## 📦 Array Polyfills

---

### Array.prototype.map()

#### Q1. What does Array.prototype.map() do? Write its polyfill.
**Level: Intermediate**

**What it does:**
`map()` creates a **new array** populated with the results of calling a provided callback function on every element. It does **not mutate** the original array.

```javascript
[1, 2, 3].map(x => x * 2); // [2, 4, 6]
```

**Polyfill:**
```javascript
Array.prototype.myMap = function (callback, thisArg) {
  // Validate: callback must be a function
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const result = [];
  const arr = this; // the array myMap is called on

  for (let i = 0; i < arr.length; i++) {
    // Only process indices that actually exist (skip holes in sparse arrays)
    if (i in arr) {
      // callback receives: currentValue, index, originalArray
      result[i] = callback.call(thisArg, arr[i], i, arr);
    }
  }

  return result;
};

// ✅ Test
const nums = [1, 2, 3, 4, 5];
console.log(nums.myMap(x => x * 2));           // [2, 4, 6, 8, 10]
console.log(nums.myMap((x, i) => `${i}:${x}`)); // ["0:1","1:2","2:3","3:4","4:5"]

// Test with thisArg
const multiplier = { factor: 3 };
console.log(nums.myMap(function(x) { return x * this.factor; }, multiplier));
// [3, 6, 9, 12, 15]
```

---

### Array.prototype.filter()

#### Q2. What does Array.prototype.filter() do? Write its polyfill.
**Level: Intermediate**

**What it does:**
`filter()` creates a **new array** with all elements that pass the test implemented by the callback (returns truthy).

```javascript
[1, 2, 3, 4, 5].filter(x => x % 2 === 0); // [2, 4]
```

**Polyfill:**
```javascript
Array.prototype.myFilter = function (callback, thisArg) {
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const result = [];
  const arr = this;

  for (let i = 0; i < arr.length; i++) {
    if (i in arr) {
      // If callback returns truthy, include element in result
      if (callback.call(thisArg, arr[i], i, arr)) {
        result.push(arr[i]);
      }
    }
  }

  return result;
};

// ✅ Test
const nums = [1, 2, 3, 4, 5, 6];
console.log(nums.myFilter(x => x % 2 === 0));    // [2, 4, 6]
console.log(nums.myFilter(x => x > 3));           // [4, 5, 6]

const words = ["hello", "hi", "world", "hey"];
console.log(words.myFilter(w => w.startsWith("h"))); // ["hello", "hi", "hey"]
```

---

### Array.prototype.reduce()

#### Q3. What does Array.prototype.reduce() do? Write its polyfill.
**Level: Advanced**

**What it does:**
`reduce()` executes a reducer callback on each element, accumulating a single return value. The accumulator carries the running result.

```javascript
[1, 2, 3, 4].reduce((acc, cur) => acc + cur, 0); // 10
```

**Polyfill:**
```javascript
Array.prototype.myReduce = function (callback, initialValue) {
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const arr = this;
  const hasInitialValue = arguments.length >= 2;

  // Cannot reduce an empty array without an initial value
  if (arr.length === 0 && !hasInitialValue) {
    throw new TypeError("Reduce of empty array with no initial value");
  }

  let accumulator;
  let startIndex;

  if (hasInitialValue) {
    accumulator = initialValue;
    startIndex = 0;
  } else {
    // Find first defined index in case of sparse array
    let firstIndex = -1;
    for (let i = 0; i < arr.length; i++) {
      if (i in arr) {
        firstIndex = i;
        break;
      }
    }
    if (firstIndex === -1) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
    accumulator = arr[firstIndex];
    startIndex = firstIndex + 1;
  }

  // Iterate from startIndex
  for (let i = startIndex; i < arr.length; i++) {
    if (i in arr) {
      // callback: (accumulator, currentValue, index, array)
      accumulator = callback(accumulator, arr[i], i, arr);
    }
  }

  return accumulator;
};

// ✅ Test
const nums = [1, 2, 3, 4, 5];
console.log(nums.myReduce((acc, cur) => acc + cur, 0));  // 15
console.log(nums.myReduce((acc, cur) => acc * cur, 1));  // 120
console.log(nums.myReduce((acc, cur) => acc + cur));     // 15 (no initialValue)

// Flatten with reduce
const nested = [[1, 2], [3, 4], [5]];
console.log(nested.myReduce((acc, cur) => acc.concat(cur), [])); // [1,2,3,4,5]

// Count occurrences
const fruits = ["apple", "banana", "apple", "cherry", "banana", "apple"];
const count = fruits.myReduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
console.log(count); // { apple: 3, banana: 2, cherry: 1 }
```

---

### Array.prototype.forEach()

#### Q4. What does Array.prototype.forEach() do? Write its polyfill.
**Level: Intermediate**

**What it does:**
`forEach()` executes the provided callback **once for each array element**. It always returns `undefined` and cannot be stopped (unlike `for...of` with `break`).

```javascript
[1, 2, 3].forEach(x => console.log(x)); // 1 2 3
```

**Polyfill:**
```javascript
Array.prototype.myForEach = function (callback, thisArg) {
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const arr = this;

  for (let i = 0; i < arr.length; i++) {
    if (i in arr) {
      // callback(currentValue, index, array)
      callback.call(thisArg, arr[i], i, arr);
    }
  }

  // forEach always returns undefined
  return undefined;
};

// ✅ Test
const nums = [10, 20, 30];
nums.myForEach((val, idx) => {
  console.log(`Index ${idx}: ${val}`);
});
// Index 0: 10
// Index 1: 20
// Index 2: 30

// With thisArg
const logger = { prefix: ">>>" };
nums.myForEach(function(val) {
  console.log(`${this.prefix} ${val}`);
}, logger);
// >>> 10
// >>> 20
// >>> 30
```

---

### Array.prototype.flat()

#### Q5. What does Array.prototype.flat() do? Write its polyfill.
**Level: Advanced**

**What it does:**
`flat()` creates a new array with all sub-array elements concatenated recursively up to the specified `depth`. Default depth is 1.

```javascript
[1, [2, [3, [4]]]].flat();    // [1, 2, [3, [4]]]
[1, [2, [3, [4]]]].flat(2);   // [1, 2, 3, [4]]
[1, [2, [3, [4]]]].flat(Infinity); // [1, 2, 3, 4]
```

**Polyfill:**
```javascript
Array.prototype.myFlat = function (depth = 1) {
  // Inner recursive helper
  function flatHelper(arr, currentDepth) {
    const result = [];

    for (let i = 0; i < arr.length; i++) {
      if (i in arr) {
        const item = arr[i];
        // If item is an array AND we still have depth to flatten
        if (Array.isArray(item) && currentDepth > 0) {
          // Recursively flatten with reduced depth
          const flattened = flatHelper(item, currentDepth - 1);
          // Push each element (not the array itself)
          for (let j = 0; j < flattened.length; j++) {
            result.push(flattened[j]);
          }
        } else {
          result.push(item);
        }
      }
    }

    return result;
  }

  return flatHelper(this, depth);
};

// ✅ Test
console.log([1, [2, 3], [4, [5]]].myFlat());          // [1, 2, 3, 4, [5]]
console.log([1, [2, [3, [4]]]].myFlat(Infinity));     // [1, 2, 3, 4]
console.log([1, [2, [3]]].myFlat(1));                  // [1, 2, [3]]
console.log([1, [2, [3]]].myFlat(2));                  // [1, 2, 3]

// Handles sparse arrays
console.log([1, , [3, , 5]].myFlat()); // [1, 3, 5] (holes skipped via `i in arr`)
```

---

### Array.prototype.find()

#### Q6. What does Array.prototype.find() do? Write its polyfill.
**Level: Intermediate**

**What it does:**
`find()` returns the **first element** that satisfies the provided testing function. Returns `undefined` if no element passes.

```javascript
[1, 2, 3, 4].find(x => x > 2); // 3
```

**Polyfill:**
```javascript
Array.prototype.myFind = function (callback, thisArg) {
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const arr = this;

  for (let i = 0; i < arr.length; i++) {
    // Note: find checks ALL indices including holes (unlike map/filter)
    // callback(element, index, array)
    if (callback.call(thisArg, arr[i], i, arr)) {
      return arr[i]; // return the element itself, not the index
    }
  }

  return undefined; // not found
};

// ✅ Test
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Carol" }
];

console.log(users.myFind(u => u.id === 2)); // { id: 2, name: "Bob" }
console.log(users.myFind(u => u.id === 99)); // undefined

const nums = [5, 12, 8, 130, 44];
console.log(nums.myFind(x => x > 10)); // 12 (first match)
```

---

### Array.prototype.findIndex()

#### Q7. What does Array.prototype.findIndex() do? Write its polyfill.
**Level: Intermediate**

**What it does:**
`findIndex()` returns the **index** of the first element satisfying the test, or `-1` if none found. Similar to `find()` but returns the index instead of the value.

```javascript
[1, 2, 3, 4].findIndex(x => x > 2); // 2 (index of 3)
```

**Polyfill:**
```javascript
Array.prototype.myFindIndex = function (callback, thisArg) {
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const arr = this;

  for (let i = 0; i < arr.length; i++) {
    // callback(element, index, array)
    if (callback.call(thisArg, arr[i], i, arr)) {
      return i; // return INDEX (not the element)
    }
  }

  return -1; // not found
};

// ✅ Test
const nums = [10, 20, 30, 40, 50];
console.log(nums.myFindIndex(x => x === 30));  // 2
console.log(nums.myFindIndex(x => x > 25));   // 2 (index of 30)
console.log(nums.myFindIndex(x => x > 100));  // -1

const items = [
  { id: "a", active: false },
  { id: "b", active: true },
  { id: "c", active: true }
];
console.log(items.myFindIndex(item => item.active)); // 1
```

---

## ⚙️ Function Polyfills

---

### Function.prototype.call()

#### Q8. Write a polyfill for Function.prototype.call().
**Level: Advanced**

**What it does:**
`call()` invokes a function immediately with an explicitly set `this` and arguments passed individually.

**Polyfill:**
```javascript
Function.prototype.myCall = function (context, ...args) {
  // Handle null/undefined context (non-strict: default to global)
  if (context === null || context === undefined) {
    context = globalThis;
  }

  // Wrap primitives in their object equivalents
  context = Object(context);

  // Create a unique symbol key to avoid property name collisions
  const uniqueKey = Symbol("temporaryFn");

  // Assign the function (this) to the context object
  // This makes it a method of context, so calling it uses implicit binding
  context[uniqueKey] = this;

  // Call it — implicit binding sets 'this' to context
  const result = context[uniqueKey](...args);

  // Remove the temporary property
  delete context[uniqueKey];

  return result;
};

// ✅ Test
function add(a, b) {
  return `${this.label}: ${a + b}`;
}

const obj = { label: "Sum" };
console.log(add.myCall(obj, 5, 3));    // "Sum: 8"
console.log(add.myCall(null, 1, 2));   // "undefined: 3" (global this)

// Borrow array method
function showArgs() {
  const arr = Array.prototype.slice.myCall(arguments);
  console.log(arr);
}
showArgs(1, 2, 3); // [1, 2, 3]
```

---

### Function.prototype.apply()

#### Q9. Write a polyfill for Function.prototype.apply().
**Level: Advanced**

**What it does:**
`apply()` invokes a function immediately with an explicitly set `this`, and arguments passed as an array.

**Polyfill:**
```javascript
Function.prototype.myApply = function (context, argsArray) {
  // Handle null/undefined
  if (context === null || context === undefined) {
    context = globalThis;
  }

  // Wrap primitives
  context = Object(context);

  // Validate argsArray if provided
  if (argsArray !== undefined && !Array.isArray(argsArray) && !isArrayLike(argsArray)) {
    throw new TypeError("CreateListFromArrayLike called on non-object");
  }

  const uniqueKey = Symbol("temporaryFn");
  context[uniqueKey] = this;

  let result;
  // If no args or empty args
  if (!argsArray || argsArray.length === 0) {
    result = context[uniqueKey]();
  } else {
    result = context[uniqueKey](...argsArray);
  }

  delete context[uniqueKey];
  return result;
};

function isArrayLike(obj) {
  return obj != null && typeof obj.length === "number";
}

// ✅ Test
function multiply(a, b, c) {
  return this.prefix + (a * b * c);
}

const ctx = { prefix: "Result: " };
console.log(multiply.myApply(ctx, [2, 3, 4])); // "Result: 24"

// Math with array
const nums = [3, 1, 4, 1, 5, 9, 2];
console.log(Math.max.myApply(null, nums)); // 9
console.log(Math.min.myApply(null, nums)); // 1
```

---

### Function.prototype.bind()

#### Q10. Write a polyfill for Function.prototype.bind().
**Level: Advanced**

**What it does:**
`bind()` returns a **new function** permanently bound to a `this` value, with optional partial application of arguments.

**Polyfill:**
```javascript
Function.prototype.myBind = function (context, ...presetArgs) {
  if (typeof this !== "function") {
    throw new TypeError("myBind must be called on a function");
  }

  const originalFn = this;

  // The function returned by bind
  function BoundFunction(...laterArgs) {
    const allArgs = [...presetArgs, ...laterArgs];

    // When called with 'new', BoundFunction is the constructor
    // 'this instanceof BoundFunction' is true in that case
    // new should override the bound context
    if (this instanceof BoundFunction) {
      return originalFn.apply(this, allArgs);
    }

    return originalFn.apply(context, allArgs);
  }

  // Maintain prototype chain for instanceof checks
  if (originalFn.prototype) {
    BoundFunction.prototype = Object.create(originalFn.prototype);
    BoundFunction.prototype.constructor = BoundFunction;
  }

  // Set function name and length (optional, for spec compliance)
  Object.defineProperty(BoundFunction, "length", {
    value: Math.max(0, originalFn.length - presetArgs.length)
  });

  return BoundFunction;
};

// ✅ Test 1: Basic usage
function greet(hi, punct) {
  return `${hi} ${this.name}${punct}`;
}
const user = { name: "Eve" };
const greetEve = greet.myBind(user, "Hello");
console.log(greetEve("!"));     // "Hello Eve!"
console.log(greetEve("?"));     // "Hello Eve?"

// ✅ Test 2: Partial application
const double = Math.pow.myBind(null, 2);
console.log(double(8));   // 256
console.log(double(10));  // 1024

// ✅ Test 3: Constructor (new overrides bound this)
function Animal(name, sound) {
  this.name = name;
  this.sound = sound;
}
const BoundAnimal = Animal.myBind(null, "Dog");
const dog = new BoundAnimal("Woof");
console.log(dog.name, dog.sound); // "Dog" "Woof"

// ✅ Test 4: bind is permanent
console.log(greetEve.call({ name: "Other" }, "!!")); // "Hello Eve!!" — bind wins
```

---

## 🔮 Promise Polyfills

---

### Promise.all()

#### Q11. What does Promise.all() do? Write its polyfill.
**Level: Advanced**

**What it does:**
`Promise.all()` takes an iterable of promises and returns a single Promise that:
- **Resolves** when ALL promises resolve — with an array of their results (preserving order)
- **Rejects** immediately when ANY promise rejects — with that rejection reason

```javascript
Promise.all([p1, p2, p3]).then(values => console.log(values));
```

**Polyfill:**
```javascript
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    // Handle non-iterable
    if (!Array.isArray(promises)) {
      return reject(new TypeError("Argument must be an array"));
    }

    const results = [];
    let resolvedCount = 0;
    const total = promises.length;

    // Edge case: empty array resolves immediately
    if (total === 0) {
      return resolve([]);
    }

    promises.forEach((promise, index) => {
      // Wrap in Promise.resolve to handle non-promise values
      Promise.resolve(promise)
        .then(value => {
          results[index] = value;   // preserve order (NOT push)
          resolvedCount++;

          if (resolvedCount === total) {
            resolve(results);        // all done
          }
        })
        .catch(error => {
          reject(error);             // first rejection wins
        });
    });
  });
}

// ✅ Test
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = new Promise(res => setTimeout(() => res(3), 100));

promiseAll([p1, p2, p3]).then(values => console.log(values)); // [1, 2, 3]

// Rejection test
const p4 = Promise.reject("Error!");
promiseAll([p1, p4, p3]).catch(err => console.log(err)); // "Error!"

// Empty array
promiseAll([]).then(v => console.log(v)); // []

// Non-promise values
promiseAll([1, 2, 3]).then(v => console.log(v)); // [1, 2, 3]
```

---

### Promise.race()

#### Q12. What does Promise.race() do? Write its polyfill.
**Level: Advanced**

**What it does:**
`Promise.race()` returns a promise that settles (resolves or rejects) as soon as the **first** promise in the iterable settles — with that value or reason.

**Polyfill:**
```javascript
function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError("Argument must be an array"));
    }

    // Attach handlers to all promises — first one to settle wins
    promises.forEach(promise => {
      Promise.resolve(promise)
        .then(resolve)   // first resolve triggers outer resolve
        .catch(reject);  // first reject triggers outer reject
    });
  });
}

// ✅ Test
const fast = new Promise(res => setTimeout(() => res("fast"), 100));
const slow = new Promise(res => setTimeout(() => res("slow"), 500));

promiseRace([fast, slow]).then(v => console.log(v)); // "fast"

// Rejection wins if it's first
const earlyReject = new Promise((_, rej) => setTimeout(() => rej("early error"), 50));
promiseRace([earlyReject, slow]).catch(e => console.log(e)); // "early error"
```

---

### Promise.allSettled()

#### Q13. What does Promise.allSettled() do? Write its polyfill.
**Level: Advanced**

**What it does:**
`Promise.allSettled()` waits for ALL promises to settle (resolve or reject) and returns an array of objects describing each outcome. Never rejects.

```javascript
// Each result: { status: "fulfilled", value: ... } or { status: "rejected", reason: ... }
```

**Polyfill:**
```javascript
function promiseAllSettled(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError("Argument must be an array"));
    }

    const results = [];
    let settledCount = 0;
    const total = promises.length;

    if (total === 0) {
      return resolve([]);
    }

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          results[index] = { status: "fulfilled", value };
        })
        .catch(reason => {
          results[index] = { status: "rejected", reason };
        })
        .finally(() => {
          // Count every settled promise (fulfilled OR rejected)
          settledCount++;
          if (settledCount === total) {
            resolve(results); // resolve with ALL results, never reject
          }
        });
    });
  });
}

// ✅ Test
const p1 = Promise.resolve("success");
const p2 = Promise.reject("failure");
const p3 = Promise.resolve(42);

promiseAllSettled([p1, p2, p3]).then(results => {
  results.forEach(r => console.log(r));
});
// { status: "fulfilled", value: "success" }
// { status: "rejected", reason: "failure" }
// { status: "fulfilled", value: 42 }
```

---

## 🏗️ Object Polyfills

---

### Object.create()

#### Q14. What does Object.create() do? Write its polyfill.
**Level: Advanced**

**What it does:**
`Object.create(proto, propertiesObject)` creates a new object using the provided object as the prototype. Enables prototypal inheritance directly.

```javascript
const animal = { speak() { console.log("..."); } };
const dog = Object.create(animal); // dog.__proto__ === animal
```

**Polyfill:**
```javascript
// Simple version (without propertiesObject support)
function objectCreate(proto) {
  if (proto !== null && typeof proto !== "object" && typeof proto !== "function") {
    throw new TypeError("Argument must be an object or null");
  }

  // Create an empty constructor function
  function F() {}

  // Set its prototype to the desired proto
  F.prototype = proto;

  // Create an instance — its __proto__ will be proto
  return new F();
}

// ✅ Test — simple
const animal = {
  speak() {
    return `${this.name} says ${this.sound}`;
  }
};

const dog = objectCreate(animal);
dog.name = "Rex";
dog.sound = "Woof";
console.log(dog.speak());           // "Rex says Woof"
console.log(Object.getPrototypeOf(dog) === animal); // true

// null prototype object
const pure = objectCreate(null);
pure.x = 1;
console.log(pure.hasOwnProperty); // undefined — no Object prototype

// Enhanced version with property descriptors
function objectCreateFull(proto, propertiesObject) {
  if (proto !== null && typeof proto !== "object" && typeof proto !== "function") {
    throw new TypeError("Argument must be an object or null");
  }

  function F() {}
  F.prototype = proto;
  const obj = new F();

  if (propertiesObject !== undefined && propertiesObject !== null) {
    Object.defineProperties(obj, propertiesObject);
  }

  return obj;
}
```

---

### Object.assign()

#### Q15. What does Object.assign() do? Write its polyfill.
**Level: Intermediate**

**What it does:**
`Object.assign(target, ...sources)` copies all **enumerable own properties** from source objects to the target. Performs a **shallow copy**. Returns the target.

```javascript
Object.assign({}, { a: 1 }, { b: 2 }); // { a: 1, b: 2 }
```

**Polyfill:**
```javascript
function objectAssign(target, ...sources) {
  // target cannot be null or undefined
  if (target === null || target === undefined) {
    throw new TypeError("Cannot convert undefined or null to object");
  }

  // Ensure target is an object
  const to = Object(target);

  for (const source of sources) {
    // Skip null/undefined sources (they're valid in native Object.assign)
    if (source === null || source === undefined) continue;

    const from = Object(source);

    // Copy only own enumerable string-keyed properties
    for (const key of Object.keys(from)) {
      to[key] = from[key];
    }

    // Also copy own Symbol properties (spec-compliant)
    if (Object.getOwnPropertySymbols) {
      for (const sym of Object.getOwnPropertySymbols(from)) {
        const descriptor = Object.getOwnPropertyDescriptor(from, sym);
        if (descriptor && descriptor.enumerable) {
          to[sym] = from[sym];
        }
      }
    }
  }

  return to;
}

// ✅ Test
const target = { a: 1 };
const result = objectAssign(target, { b: 2 }, { c: 3, a: 99 });
console.log(result); // { a: 99, b: 2, c: 3 }
console.log(result === target); // true — modifies and returns target

// Shallow copy
const obj = { x: { deep: true } };
const copy = objectAssign({}, obj);
copy.x.deep = false;
console.log(obj.x.deep); // false — shallow copy, same reference

// null/undefined sources are skipped
console.log(objectAssign({ a: 1 }, null, { b: 2 })); // { a: 1, b: 2 }
```

---

## 🛠️ Utility Implementations

---

### debounce()

#### Q16. What is debounce? Implement it.
**Level: Intermediate**

**What it does:**
Debounce delays invoking a function until after a specified wait time has elapsed since the **last time it was called**. Resets the timer on every call. Ideal for search inputs, resize events.

```
Calls:   |--A--B--C-----------D--|
Wait:         [===][===][========][===]
Fires:                        C         D
```

**Implementation:**
```javascript
function debounce(fn, delay) {
  let timerId = null;

  // The debounced wrapper function
  function debounced(...args) {
    // Cancel any pending invocation
    clearTimeout(timerId);

    // Schedule a new invocation after 'delay' ms
    timerId = setTimeout(() => {
      fn.apply(this, args); // preserve 'this' and args
      timerId = null;
    }, delay);
  }

  // Allow manual cancellation
  debounced.cancel = function () {
    clearTimeout(timerId);
    timerId = null;
  };

  return debounced;
}

// ✅ Test
function search(query) {
  console.log(`Searching for: ${query}`);
}

const debouncedSearch = debounce(search, 300);

// Rapid calls — only last one fires after 300ms silence
debouncedSearch("j");
debouncedSearch("ja");
debouncedSearch("jav");
debouncedSearch("java");  // Only this fires after 300ms

// Cancel
debouncedSearch("test");
debouncedSearch.cancel(); // cancels the pending call
```

---

### throttle()

#### Q17. What is throttle? Implement it.
**Level: Intermediate**

**What it does:**
Throttle ensures a function is called **at most once** within a specified time interval, no matter how many times it's triggered. Ideal for scroll, mousemove events.

```
Calls:   |--A--B--C--D--E--F--|
Interval: [====][====][====]
Fires:    A         D      F(maybe)
```

**Implementation:**
```javascript
function throttle(fn, interval) {
  let lastCallTime = 0;
  let timerId = null;

  function throttled(...args) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;
    const remainingTime = interval - timeSinceLastCall;

    if (remainingTime <= 0) {
      // Enough time has passed — call immediately
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
      lastCallTime = now;
      fn.apply(this, args);
    } else {
      // Schedule a trailing call for the remaining time
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        lastCallTime = Date.now();
        timerId = null;
        fn.apply(this, args);
      }, remainingTime);
    }
  }

  throttled.cancel = function () {
    clearTimeout(timerId);
    timerId = null;
    lastCallTime = 0;
  };

  return throttled;
}

// ✅ Test
function logScroll(e) {
  console.log("Scroll position:", window.scrollY);
}

const throttledScroll = throttle(logScroll, 200);
// Even if scroll fires 100x per second, logScroll only runs every 200ms
window.addEventListener("scroll", throttledScroll);

// Simple timer test
const throttledLog = throttle((msg) => console.log(msg, Date.now()), 1000);
throttledLog("a"); // fires immediately
throttledLog("b"); // throttled
throttledLog("c"); // throttled
// After 1000ms, "c" fires as trailing call
```

---

### memoize()

#### Q18. What is memoization? Implement a memoize() function.
**Level: Intermediate**

**What it does:**
Memoization is an optimization technique that caches the results of expensive function calls based on their arguments, returning the cached result for the same inputs.

**Implementation:**
```javascript
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    // Create a cache key from the arguments
    // JSON.stringify handles most cases; for complex args, a custom serializer may be needed
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log(`[Cache hit] key: ${key}`);
      return cache.get(key);
    }

    console.log(`[Computing] key: ${key}`);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// ✅ Test 1: Expensive computation
function slowAdd(a, b) {
  // Simulate expensive work
  return a + b;
}

const memoAdd = memoize(slowAdd);
console.log(memoAdd(1, 2)); // [Computing] 3
console.log(memoAdd(1, 2)); // [Cache hit] 3
console.log(memoAdd(3, 4)); // [Computing] 7

// ✅ Test 2: Fibonacci with memoization
function memoFib(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = memoFib(n - 1, memo) + memoFib(n - 2, memo);
  return memo[n];
}
console.log(memoFib(50)); // 12586269025 (fast)

// ✅ Test 3: Using memoize() wrapper
function fibonacci(n) {
  if (n <= 1) return n;
  return memoizedFib(n - 1) + memoizedFib(n - 2);
}
const memoizedFib = memoize(fibonacci);
console.log(memoizedFib(40)); // 102334155
```

---

### curry()

#### Q19. What is currying? Implement a curry() function.
**Level: Advanced**

**What it does:**
Currying transforms a function with multiple arguments into a **sequence of functions**, each taking one argument at a time. The function executes only when all required arguments are collected.

```javascript
curry(add)(1)(2)(3) === add(1, 2, 3)
```

**Implementation:**
```javascript
function curry(fn) {
  // fn.length = number of parameters fn expects
  const arity = fn.length;

  function curried(...args) {
    if (args.length >= arity) {
      // All arguments collected — invoke the original function
      return fn.apply(this, args);
    }

    // Not enough args yet — return a function that collects more
    return function (...moreArgs) {
      return curried.apply(this, [...args, ...moreArgs]);
    };
  }

  return curried;
}

// ✅ Test 1: One arg at a time
function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3));    // 6
console.log(curriedAdd(1, 2)(3));    // 6
console.log(curriedAdd(1)(2, 3));    // 6
console.log(curriedAdd(1, 2, 3));    // 6 (all at once)

// ✅ Test 2: Real-world use
const curriedMultiply = curry((a, b) => a * b);
const double = curriedMultiply(2);
const triple = curriedMultiply(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15

// ✅ Test 3: Logging utility
const log = curry((level, message, data) => {
  console.log(`[${level}] ${message}`, data);
});

const info = log("INFO");
const warn = log("WARN");

info("User logged in")({ userId: 42 });  // [INFO] User logged in { userId: 42 }
warn("Rate limit reached")({ limit: 100 }); // [WARN] Rate limit reached { limit: 100 }
```

---

## 🔍 typeof Operator Behavior

#### Q20. Explain typeof behavior and its quirks.
**Level: Intermediate**

**What it does:**
`typeof` returns a string indicating the type of a value. It has some notable quirks.

```javascript
// typeof returns a STRING in all cases
typeof 42           // "number"
typeof 3.14         // "number"
typeof NaN          // "number" ⚠️ (NaN is technically a number type)
typeof "hello"      // "string"
typeof true         // "boolean"
typeof undefined    // "undefined"
typeof Symbol()     // "symbol"
typeof 42n          // "bigint"
typeof {}           // "object"
typeof []           // "object" ⚠️ (arrays are objects)
typeof null         // "object" ⚠️ THE CLASSIC BUG (historical error in JS)
typeof function(){} // "function"
typeof (() => {})   // "function"
typeof class {}     // "function" (classes are functions)

// typeof undeclaredVar  → "undefined" (no ReferenceError!)
typeof notDeclared  // "undefined" — safe to check existence
```

**Reliable type checking helper:**
```javascript
function getType(value) {
  // null check first (typeof null === "object" is a bug)
  if (value === null) return "null";

  // For arrays, typeof returns "object" — use Array.isArray
  if (Array.isArray(value)) return "array";

  // For everything else, use Object.prototype.toString for accuracy
  const type = Object.prototype.toString.call(value);
  // Returns "[object Number]", "[object String]", etc.
  return type.slice(8, -1).toLowerCase(); // extract "number", "string", etc.
}

console.log(getType(42));          // "number"
console.log(getType("hi"));        // "string"
console.log(getType(null));        // "null"
console.log(getType([]));          // "array"
console.log(getType({}));          // "object"
console.log(getType(undefined));   // "undefined"
console.log(getType(/regex/));     // "regexp"
console.log(getType(new Date())); // "date"
console.log(getType(NaN));         // "number"
```

---

## 📋 Quick Reference

### Array Polyfills Summary

| Method       | Returns         | Mutates | Key Behavior                              |
|--------------|-----------------|---------|-------------------------------------------|
| `map()`      | New array       | No      | Same length, transformed elements        |
| `filter()`   | New array       | No      | Subset, truthy test                       |
| `reduce()`   | Single value    | No      | Accumulates, needs initial value ideally  |
| `forEach()`  | `undefined`     | No      | Side effects only, no break              |
| `flat()`     | New array       | No      | Flattens nested arrays by depth          |
| `find()`     | Element or `undefined` | No | First match, element itself         |
| `findIndex()`| Index or `-1`   | No      | First match, index                       |

### Promise Methods Summary

| Method          | Resolves when         | Rejects when          |
|-----------------|-----------------------|-----------------------|
| `Promise.all`   | ALL resolve           | ANY rejects (first)   |
| `Promise.race`  | FIRST settles         | FIRST settles (reject)|
| `Promise.allSettled` | ALL settle (never rejects) | Never      |

### Utility Functions Summary

| Function    | Use Case                           | Trigger                    |
|-------------|------------------------------------|----------------------------|
| `debounce`  | Search input, form validation      | After silence period       |
| `throttle`  | Scroll, resize, mousemove          | At most once per interval  |
| `memoize`   | Expensive pure functions           | Cache by args              |
| `curry`     | Partial application, composition   | When all args collected    |

### typeof Quick Table

```javascript
typeof null        // "object"    ⚠️ BUG — use === null
typeof []          // "object"    ⚠️ use Array.isArray()
typeof NaN         // "number"    ⚠️ use Number.isNaN()
typeof undeclared  // "undefined" ✅ safe (no ReferenceError)
typeof function(){} // "function" ✅
```

### Polyfill Pattern Template

```javascript
Array.prototype.myMethod = function(callback, thisArg) {
  // 1. Validate callback
  if (typeof callback !== "function") throw new TypeError("...");

  const result = [];
  const arr = this;

  // 2. Iterate
  for (let i = 0; i < arr.length; i++) {
    if (i in arr) { // skip holes in sparse arrays
      // 3. Call callback with (value, index, array)
      result.push(callback.call(thisArg, arr[i], i, arr));
    }
  }

  // 4. Return
  return result;
};
```

---

*💡 Interview Tip: When asked to write a polyfill, always:*
*1. State what the native method does*
*2. Handle edge cases (null/undefined, empty array, sparse arrays)*
*3. Validate input types*
*4. Demonstrate with tests*
