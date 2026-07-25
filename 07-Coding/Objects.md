# 📦 Object Coding Problems — Senior UI Interview

> **Category:** Coding | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 1. Deep Clone Object (Without JSON.parse / JSON.stringify)

### Problem
Write a function that deep clones an object, handling nested objects, arrays, Date objects, RegExps, and circular references.

```javascript
/**
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);

  // Handle Circular References
  if (hash.has(obj)) return hash.get(obj);

  const clone = Array.isArray(obj) ? [] : {};
  hash.set(obj, clone);

  for (const key of Reflect.ownKeys(obj)) {
    clone[key] = deepClone(obj[key], hash);
  }

  return clone;
}

// Test Circular Reference Handling
const original = { a: 1, b: { c: 2 } };
original.self = original;

const cloned = deepClone(original);
console.log(cloned !== original);          // true
console.log(cloned.self === cloned);        // true (circular link preserved!)
console.log(cloned.b !== original.b);       // true
```

---

## 2. Flatten Nested Object to Dot Notation

### Problem
Flatten a deeply nested object into a single-level key-value map using dot notation for nested keys.

```javascript
/**
 * Input:  { a: { b: { c: 1 } }, d: 2 }
 * Output: { 'a.b.c': 1, 'd': 2 }
 */
function flattenObject(obj, prefix = '', result = {}) {
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        flattenObject(obj[key], newKey, result);
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  return result;
}

// Test
console.log(flattenObject({
  user: {
    name: 'Alice',
    address: { city: 'Paris', zip: 75000 }
  },
  active: true
}));
// { 'user.name': 'Alice', 'user.address.city': 'Paris', 'user.address.zip': 75000, 'active': true }
```

---

## 3. Deep Merge Two Objects

### Problem
Merge two objects deeply, merging nested properties rather than overwriting objects completely.

```javascript
function deepMerge(target, source) {
  const isObject = (item) => item && typeof item === 'object' && !Array.isArray(item);

  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }

  return output;
}

// Test
const obj1 = { a: { b: 1, c: 2 }, d: 3 };
const obj2 = { a: { c: 99, e: 4 }, f: 5 };
console.log(deepMerge(obj1, obj2));
// { a: { b: 1, c: 99, e: 4 }, d: 3, f: 5 }
```

---

## 📝 Quick Reference

```
Object Utilities:
• WeakMap used in Deep Clone to solve Circular References.
• Dot Notation Flattening via recursion & key prefixes.
• Deep Merge via recursive property assignment.
```

---

*Senior UI Developer Interview Prep — Object Coding Problems*
