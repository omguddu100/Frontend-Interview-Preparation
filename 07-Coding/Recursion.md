# 🔄 Recursion & Tree Coding Problems — Senior UI Interview

> **Category:** Coding | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 1. Memoized Fibonacci Sequence

### Problem
Calculate the $n$-th Fibonacci number with $O(n)$ time complexity using recursion and memoization.

```javascript
/**
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function memoizedFibonacci() {
  const cache = new Map();

  function fib(n) {
    if (n <= 1) return n;
    if (cache.has(n)) return cache.get(n);

    const result = fib(n - 1) + fib(n - 2);
    cache.set(n, result);
    return result;
  }

  return fib;
}

const fib = memoizedFibonacci();
console.log(fib(50)); // 12586269025 (Runs instantly without crashing execution stack!)
```

---

## 2. Directory Structure / Folder Tree Search

### Problem
Given a nested directory object structure, find a file by name and return its full absolute path.

```javascript
const fileSystem = {
  name: 'root',
  type: 'folder',
  children: [
    {
      name: 'src',
      type: 'folder',
      children: [
        { name: 'app.js', type: 'file' },
        { name: 'styles.css', type: 'file' }
      ]
    },
    { name: 'package.json', type: 'file' }
  ]
};

function findFilePath(node, targetName, currentPath = '') {
  const path = currentPath ? `${currentPath}/${node.name}` : node.name;

  if (node.name === targetName) return path;

  if (node.type === 'folder' && node.children) {
    for (const child of node.children) {
      const result = findFilePath(child, targetName, path);
      if (result) return result;
    }
  }

  return null;
}

// Test
console.log(findFilePath(fileSystem, 'styles.css')); // "root/src/styles.css"
console.log(findFilePath(fileSystem, 'missing.js'));  // null
```

---

## 3. Deep Equal Comparison

### Problem
Implement `isDeepEqual(val1, val2)` to perform a true recursive deep comparison between two values/objects.

```javascript
function isDeepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (!keys2.includes(key) || !isDeepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

// Test
console.log(isDeepEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })); // true
console.log(isDeepEqual({ a: 1 }, { a: 2 }));                       // false
```

---

## 📝 Quick Reference

```
Recursion Patterns:
• Always define base cases first.
• Use Memoization (Map / WeakMap) to optimize overlapping subproblems.
• Recursion stack depth limit in JS ~ 10,000 calls.
```

---

*Senior UI Developer Interview Prep — Recursion Coding Problems*
