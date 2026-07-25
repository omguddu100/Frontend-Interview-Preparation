# 🛠️ JavaScript Polyfills — Senior UI Interview

> **Category:** Coding | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 1. Polyfill for Array.prototype.map

```javascript
Array.prototype.myMap = function(callback, thisArg) {
  if (this == null) throw new TypeError('Array.prototype.myMap called on null or undefined');
  if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');

  const O = Object(this);
  const len = O.length >>> 0;
  const A = new Array(len);

  for (let i = 0; i < len; i++) {
    if (i in O) {
      A[i] = callback.call(thisArg, O[i], i, O);
    }
  }

  return A;
};

// Test
console.log([1, 2, 3].myMap(x => x * 2)); // [2, 4, 6]
```

---

## 2. Polyfill for Array.prototype.filter

```javascript
Array.prototype.myFilter = function(callback, thisArg) {
  if (this == null) throw new TypeError('Array.prototype.myFilter called on null or undefined');
  if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');

  const O = Object(this);
  const len = O.length >>> 0;
  const res = [];

  for (let i = 0; i < len; i++) {
    if (i in O) {
      const val = O[i];
      if (callback.call(thisArg, val, i, O)) {
        res.push(val);
      }
    }
  }

  return res;
};

// Test
console.log([1, 2, 3, 4].myFilter(x => x % 2 === 0)); // [2, 4]
```

---

## 3. Polyfill for Array.prototype.reduce

```javascript
Array.prototype.myReduce = function(callback, initialValue) {
  if (this == null) throw new TypeError('Array.prototype.myReduce called on null or undefined');
  if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');

  const O = Object(this);
  const len = O.length >>> 0;
  let k = 0;
  let accumulator;

  if (arguments.length >= 2) {
    accumulator = initialValue;
  } else {
    while (k < len && !(k in O)) k++;
    if (k >= len) throw new TypeError('Reduce of empty array with no initial value');
    accumulator = O[k++];
  }

  while (k < len) {
    if (k in O) {
      accumulator = callback(accumulator, O[k], k, O);
    }
    k++;
  }

  return accumulator;
};

// Test
console.log([1, 2, 3, 4].myReduce((acc, curr) => acc + curr, 0)); // 10
```

---

## 4. Polyfill for Promise.all

```javascript
Promise.myAll = function(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an Array'));
    }

    const results = [];
    let completedCount = 0;
    const total = promises.length;

    if (total === 0) return resolve([]);

    promises.forEach((item, index) => {
      Promise.resolve(item).then(value => {
        results[index] = value;
        completedCount++;

        if (completedCount === total) {
          resolve(results);
        }
      }).catch(err => {
        reject(err);
      });
    });
  });
};

// Test
Promise.myAll([Promise.resolve(1), Promise.resolve(2)]).then(console.log); // [1, 2]
```

---

## 5. Polyfill for Function.prototype.bind

```javascript
Function.prototype.myBind = function(context, ...args) {
  if (typeof this !== 'function') {
    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
  }

  const self = this;

  return function BoundFn(...innerArgs) {
    // Check if called as a constructor with 'new'
    if (this instanceof BoundFn) {
      return new self(...args, ...innerArgs);
    }
    return self.apply(context, [...args, ...innerArgs]);
  };
};

// Test
function greet(greeting, punctuation) {
  return `${greeting} ${this.name}${punctuation}`;
}
const bound = greet.myBind({ name: 'Alice' }, 'Hello');
console.log(bound('!')); // "Hello Alice!"
```

---

## 📝 Quick Reference

```
Essential Polyfill Checklist:
• Check `this == null` guard.
• Sparse Array handling using `i in O`.
• Constructor instantiation support in Function.prototype.bind (`new BoundFn()`).
• Unhandled promise rejections handling in `Promise.all`.
```

---

*Senior UI Developer Interview Prep — Essential Polyfills*
