# JavaScript Coding Interview Questions

> **27 essential coding problems** with complete solutions, complexity analysis, and examples.
> Categories: Strings · Arrays · Objects · Functions · Algorithms

---

## Table of Contents

| # | Problem | Category |
|---|---------|----------|
| 1 | [Reverse a String](#1-reverse-a-string) | Strings |
| 2 | [Check if Palindrome](#2-check-if-palindrome) | Strings |
| 3 | [Count Character Occurrences](#3-count-character-occurrences) | Strings |
| 4 | [First Non-Repeating Character](#4-first-non-repeating-character) | Strings |
| 5 | [Check if Two Strings are Anagrams](#5-check-if-two-strings-are-anagrams) | Strings |
| 6 | [Longest Substring Without Repeating Characters](#6-longest-substring-without-repeating-characters) | Strings |
| 7 | [Remove Duplicates Without Set](#7-remove-duplicates-without-set) | Arrays |
| 8 | [Flatten Nested Array](#8-flatten-nested-array) | Arrays |
| 9 | [Maximum Sum Subarray (Kadane's)](#9-maximum-sum-subarray-kadanes-algorithm) | Arrays |
| 10 | [Two Sum — Return Indices](#10-two-sum--return-indices) | Arrays |
| 11 | [Rotate Array by K Positions](#11-rotate-array-by-k-positions) | Arrays |
| 12 | [Find All Pairs That Sum to Target](#12-find-all-pairs-that-sum-to-target) | Arrays |
| 13 | [Group Array of Objects by Key](#13-group-array-of-objects-by-key) | Objects |
| 14 | [Deep Clone Without JSON](#14-deep-clone-an-object-without-json) | Objects |
| 15 | [Merge Two Deeply Nested Objects](#15-merge-two-deeply-nested-objects) | Objects |
| 16 | [Flatten Nested Object to Dot Notation](#16-flatten-nested-object-to-dot-notation) | Objects |
| 17 | [Implement Debounce](#17-implement-debounce) | Functions |
| 18 | [Implement Throttle](#18-implement-throttle) | Functions |
| 19 | [Implement Memoize](#19-implement-memoize) | Functions |
| 20 | [Implement Curry](#20-implement-curry-function) | Functions |
| 21 | [Implement Pipe and Compose](#21-implement-pipe-and-compose) | Functions |
| 22 | [Binary Search](#22-binary-search) | Algorithms |
| 23 | [Fibonacci](#23-fibonacci--iterative--recursive--memoized) | Algorithms |
| 24 | [Find Duplicate Elements](#24-find-duplicate-elements-in-array) | Algorithms |
| 25 | [Basic Event Emitter (Pub/Sub)](#25-implement-a-basic-event-emitter-pubsub) | Algorithms |
| 26 | [Stack Using an Array](#26-implement-a-stack-using-an-array) | Algorithms |
| 27 | [LRU Cache](#27-implement-lru-cache) | Algorithms |

---

## STRINGS

---

### 1. Reverse a String

**Problem:** Reverse a given string without using the built-in `.reverse()` method on a split array directly.

```javascript
/**
 * Approach 1: Two-pointer technique
 * Time:  O(n)
 * Space: O(n) — for the char array copy
 */
function reverseString(str) {
  const chars = str.split('');
  let left = 0;
  let right = chars.length - 1;

  while (left < right) {
    // Swap characters at left and right pointers
    [chars[left], chars[right]] = [chars[right], chars[left]];
    left++;
    right--;
  }

  return chars.join('');
}

/**
 * Approach 2: Using reduce (functional style)
 * Time:  O(n)
 * Space: O(n)
 */
function reverseStringReduce(str) {
  return str.split('').reduce((acc, char) => char + acc, '');
}

/**
 * Approach 3: Recursion
 * Time:  O(n)
 * Space: O(n) — call stack
 */
function reverseStringRecursive(str) {
  if (str.length <= 1) return str;
  return reverseStringRecursive(str.slice(1)) + str[0];
}

// Examples
console.log(reverseString('hello'));          // 'olleh'
console.log(reverseString('JavaScript'));     // 'tpircSavaJ'
console.log(reverseString(''));               // ''
console.log(reverseString('a'));              // 'a'
console.log(reverseStringReduce('world'));    // 'dlrow'
console.log(reverseStringRecursive('abc'));   // 'cba'
```

> **Complexity:** Time O(n) · Space O(n)

---

### 2. Check if Palindrome

**Problem:** Determine if a string reads the same forwards and backwards. Ignore case and non-alphanumeric characters.

```javascript
/**
 * Approach 1: Two-pointer (optimal)
 * Time:  O(n)
 * Space: O(1)
 */
function isPalindrome(str) {
  // Normalize: lowercase and remove non-alphanumeric chars
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');

  let left = 0;
  let right = clean.length - 1;

  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }

  return true;
}

/**
 * Approach 2: Reverse comparison
 * Time:  O(n)
 * Space: O(n)
 */
function isPalindromeSimple(str) {
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
}

// Examples
console.log(isPalindrome('racecar'));           // true
console.log(isPalindrome('A man a plan a canal Panama')); // true
console.log(isPalindrome('hello'));             // false
console.log(isPalindrome('Was it a car or a cat I saw')); // true
console.log(isPalindrome(''));                  // true
```

> **Complexity:** Time O(n) · Space O(1) for two-pointer approach

---

### 3. Count Character Occurrences

**Problem:** Return a frequency map of all characters in a string.

```javascript
/**
 * Time:  O(n)
 * Space: O(k) — k is number of unique characters
 */
function countCharOccurrences(str) {
  const freq = {};

  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }

  return freq;
}

/**
 * Bonus: Count occurrences of a specific character
 * Time:  O(n)
 * Space: O(1)
 */
function countChar(str, target) {
  let count = 0;
  for (const char of str) {
    if (char === target) count++;
  }
  return count;
}

/**
 * Using reduce (functional approach)
 */
function countCharFunctional(str) {
  return str.split('').reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});
}

// Examples
console.log(countCharOccurrences('hello'));
// { h: 1, e: 1, l: 2, o: 1 }

console.log(countCharOccurrences('javascript'));
// { j:1, a:3, v:1, s:1, c:1, r:1, i:1, p:1, t:1 }

console.log(countChar('banana', 'a'));  // 3
```

> **Complexity:** Time O(n) · Space O(k)

---

### 4. First Non-Repeating Character

**Problem:** Find the first character in a string that does not repeat. Return -1 if none exists.

```javascript
/**
 * Approach 1: Two-pass with frequency map
 * Time:  O(n)
 * Space: O(k)
 */
function firstNonRepeatingChar(str) {
  const freq = {};

  // Pass 1: build frequency map
  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }

  // Pass 2: find first char with frequency 1
  for (let i = 0; i < str.length; i++) {
    if (freq[str[i]] === 1) return str[i];
  }

  return -1; // no unique char found
}

/**
 * Approach 2: Using indexOf and lastIndexOf
 * Time:  O(n^2)
 * Space: O(1)
 */
function firstNonRepeatingCharSimple(str) {
  for (let i = 0; i < str.length; i++) {
    if (str.indexOf(str[i]) === str.lastIndexOf(str[i])) {
      return str[i];
    }
  }
  return -1;
}

// Examples
console.log(firstNonRepeatingChar('leetcode'));   // 'l'
console.log(firstNonRepeatingChar('loveleetcode')); // 'v'
console.log(firstNonRepeatingChar('aabb'));        // -1
console.log(firstNonRepeatingChar('stress'));      // 't'
```

> **Complexity:** Time O(n) · Space O(k) — preferred approach

---

### 5. Check if Two Strings are Anagrams

**Problem:** Determine if two strings contain the same characters with the same frequency.

```javascript
/**
 * Approach 1: Frequency map comparison
 * Time:  O(n)
 * Space: O(k)
 */
function isAnagram(str1, str2) {
  if (str1.length !== str2.length) return false;

  const freq = {};

  // Increment for str1, decrement for str2
  for (const char of str1) {
    freq[char] = (freq[char] || 0) + 1;
  }

  for (const char of str2) {
    if (!freq[char]) return false; // char not in str1 or exhausted
    freq[char]--;
  }

  return true;
}

/**
 * Approach 2: Sort and compare
 * Time:  O(n log n)
 * Space: O(n)
 */
function isAnagramSort(str1, str2) {
  if (str1.length !== str2.length) return false;

  const sort = (s) => s.split('').sort().join('');
  return sort(str1) === sort(str2);
}

// Examples
console.log(isAnagram('anagram', 'nagaram'));   // true
console.log(isAnagram('rat', 'car'));            // false
console.log(isAnagram('listen', 'silent'));      // true
console.log(isAnagram('hello', 'world'));        // false
console.log(isAnagram('', ''));                  // true
```

> **Complexity:** Time O(n) · Space O(k) — frequency map approach

---

### 6. Longest Substring Without Repeating Characters

**Problem:** Find the length of the longest substring without any repeating characters.

```javascript
/**
 * Sliding Window approach
 * Time:  O(n)
 * Space: O(min(m, n)) — m is charset size
 */
function lengthOfLongestSubstring(str) {
  const charIndexMap = new Map(); // stores last seen index of each char
  let maxLength = 0;
  let windowStart = 0; // left boundary of sliding window

  for (let windowEnd = 0; windowEnd < str.length; windowEnd++) {
    const char = str[windowEnd];

    // If char was seen and is inside current window, shrink the window
    if (charIndexMap.has(char) && charIndexMap.get(char) >= windowStart) {
      windowStart = charIndexMap.get(char) + 1;
    }

    // Update last seen index for this character
    charIndexMap.set(char, windowEnd);

    // Update max length if current window is larger
    maxLength = Math.max(maxLength, windowEnd - windowStart + 1);
  }

  return maxLength;
}

/**
 * Bonus: Return the actual substring
 */
function longestSubstring(str) {
  const charIndexMap = new Map();
  let maxStart = 0;
  let maxLen = 0;
  let windowStart = 0;

  for (let windowEnd = 0; windowEnd < str.length; windowEnd++) {
    const char = str[windowEnd];

    if (charIndexMap.has(char) && charIndexMap.get(char) >= windowStart) {
      windowStart = charIndexMap.get(char) + 1;
    }

    charIndexMap.set(char, windowEnd);

    const currentLen = windowEnd - windowStart + 1;
    if (currentLen > maxLen) {
      maxLen = currentLen;
      maxStart = windowStart;
    }
  }

  return str.slice(maxStart, maxStart + maxLen);
}

// Examples
console.log(lengthOfLongestSubstring('abcabcbb')); // 3 ("abc")
console.log(lengthOfLongestSubstring('bbbbb'));    // 1 ("b")
console.log(lengthOfLongestSubstring('pwwkew'));   // 3 ("wke")
console.log(lengthOfLongestSubstring(''));         // 0
console.log(longestSubstring('abcabcbb'));         // "abc"
```

> **Complexity:** Time O(n) · Space O(min(m, n))

---

## ARRAYS

---

### 7. Remove Duplicates Without Set

**Problem:** Remove duplicate values from an array without using the `Set` data structure.

```javascript
/**
 * Approach 1: Using an object as a lookup (O(n) time)
 * Time:  O(n)
 * Space: O(n)
 */
function removeDuplicates(arr) {
  const seen = {};
  const result = [];

  for (const item of arr) {
    if (!seen[item]) {
      seen[item] = true;
      result.push(item);
    }
  }

  return result;
}

/**
 * Approach 2: Using filter + indexOf (O(n^2) time)
 * Time:  O(n^2)
 * Space: O(n)
 */
function removeDuplicatesFilter(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

/**
 * Approach 3: Using reduce
 * Time:  O(n^2) — indexOf inside reduce
 * Space: O(n)
 */
function removeDuplicatesReduce(arr) {
  return arr.reduce((acc, item) => {
    if (!acc.includes(item)) acc.push(item);
    return acc;
  }, []);
}

// Examples
console.log(removeDuplicates([1, 2, 2, 3, 4, 4, 5]));       // [1, 2, 3, 4, 5]
console.log(removeDuplicates(['a', 'b', 'a', 'c']));         // ['a', 'b', 'c']
console.log(removeDuplicates([1, 1, 1, 1]));                 // [1]
console.log(removeDuplicates([]));                           // []
```

> **Complexity:** Time O(n) · Space O(n) — object lookup approach

---

### 8. Flatten Nested Array

**Problem:** Flatten an arbitrarily nested array into a single-level array.

```javascript
/**
 * Approach 1: Recursive
 * Time:  O(n) — n is total elements across all levels
 * Space: O(n + d) — d is max depth (recursion stack)
 */
function flattenRecursive(arr) {
  const result = [];

  for (const item of arr) {
    if (Array.isArray(item)) {
      // Spread the recursively flattened sub-array
      result.push(...flattenRecursive(item));
    } else {
      result.push(item);
    }
  }

  return result;
}

/**
 * Approach 2: Iterative using a stack
 * Time:  O(n)
 * Space: O(n)
 */
function flattenIterative(arr) {
  const stack = [...arr]; // copy to avoid mutating original
  const result = [];

  while (stack.length > 0) {
    const item = stack.pop(); // take from end

    if (Array.isArray(item)) {
      // Push array items back onto stack (reversed to maintain order)
      stack.push(...item);
    } else {
      // Prepend to result since we're using pop (LIFO)
      result.unshift(item);
    }
  }

  return result;
}

/**
 * Approach 3: Using reduce + recursion (functional)
 * Time:  O(n)
 * Space: O(n)
 */
function flattenReduce(arr) {
  return arr.reduce((acc, item) => {
    return acc.concat(Array.isArray(item) ? flattenReduce(item) : item);
  }, []);
}

/**
 * Approach 4: Flatten to specific depth
 * Time:  O(n)
 * Space: O(n)
 */
function flattenToDepth(arr, depth = Infinity) {
  if (depth === 0) return arr.slice();

  const result = [];
  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      result.push(...flattenToDepth(item, depth - 1));
    } else {
      result.push(item);
    }
  }
  return result;
}

// Examples
console.log(flattenRecursive([1, [2, [3, [4]], 5]])); // [1, 2, 3, 4, 5]
console.log(flattenIterative([1, [2, 3], [4, [5]]])); // [1, 2, 3, 4, 5]
console.log(flattenReduce([[1, 2], [3, [4, 5]]]));    // [1, 2, 3, 4, 5]
console.log(flattenToDepth([1, [2, [3, [4]]]], 2));   // [1, 2, 3, [4]]
```

> **Complexity:** Time O(n) · Space O(n)

---

### 9. Maximum Sum Subarray (Kadane's Algorithm)

**Problem:** Find the contiguous subarray with the largest sum.

```javascript
/**
 * Kadane's Algorithm
 * Time:  O(n)
 * Space: O(1)
 */
function maxSubarraySum(arr) {
  if (!arr.length) return 0;

  let maxSoFar = arr[0];    // overall max sum found
  let maxEndingHere = arr[0]; // max sum ending at current position

  for (let i = 1; i < arr.length; i++) {
    // Either extend existing subarray or start fresh from current element
    maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }

  return maxSoFar;
}

/**
 * Bonus: Also return the subarray indices
 * Time:  O(n)
 * Space: O(1)
 */
function maxSubarrayWithIndices(arr) {
  let maxSum = arr[0];
  let currentSum = arr[0];
  let start = 0, end = 0, tempStart = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > currentSum + arr[i]) {
      currentSum = arr[i];
      tempStart = i; // potential new start
    } else {
      currentSum += arr[i];
    }

    if (currentSum > maxSum) {
      maxSum = currentSum;
      start = tempStart;
      end = i;
    }
  }

  return {
    maxSum,
    subarray: arr.slice(start, end + 1),
  };
}

// Examples
console.log(maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
console.log(maxSubarraySum([1]));                               // 1
console.log(maxSubarraySum([-1, -2, -3, -4]));                 // -1
console.log(maxSubarraySum([5, 4, -1, 7, 8]));                 // 23

console.log(maxSubarrayWithIndices([-2, 1, -3, 4, -1, 2, 1, -5, 4]));
// { maxSum: 6, subarray: [4, -1, 2, 1] }
```

> **Complexity:** Time O(n) · Space O(1)

---

### 10. Two Sum — Return Indices

**Problem:** Given an array of integers and a target, return indices of the two numbers that add up to target.

```javascript
/**
 * Approach 1: Hash map — one pass (optimal)
 * Time:  O(n)
 * Space: O(n)
 */
function twoSum(nums, target) {
  const map = new Map(); // stores { value: index }

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement), i]; // found the pair
    }

    map.set(nums[i], i); // store current number with its index
  }

  return []; // no pair found
}

/**
 * Approach 2: Brute force O(n^2) — for reference
 */
function twoSumBrute(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}

// Examples
console.log(twoSum([2, 7, 11, 15], 9));  // [0, 1]
console.log(twoSum([3, 2, 4], 6));       // [1, 2]
console.log(twoSum([3, 3], 6));          // [0, 1]
console.log(twoSum([1, 2, 3], 7));       // []
```

> **Complexity:** Time O(n) · Space O(n)

---

### 11. Rotate Array by K Positions

**Problem:** Rotate an array to the right by `k` positions.

```javascript
/**
 * Approach 1: Using extra space
 * Time:  O(n)
 * Space: O(n)
 */
function rotateArray(arr, k) {
  const n = arr.length;
  if (n === 0) return arr;

  k = k % n; // handle k > n
  if (k === 0) return arr;

  // Last k elements go to front, rest go to back
  return [...arr.slice(n - k), ...arr.slice(0, n - k)];
}

/**
 * Approach 2: In-place using reverse trick
 * Time:  O(n)
 * Space: O(1)
 */
function rotateInPlace(arr, k) {
  const n = arr.length;
  k = k % n;

  function reverse(arr, start, end) {
    while (start < end) {
      [arr[start], arr[end]] = [arr[end], arr[start]];
      start++;
      end--;
    }
  }

  // Step 1: Reverse entire array
  reverse(arr, 0, n - 1);
  // Step 2: Reverse first k elements
  reverse(arr, 0, k - 1);
  // Step 3: Reverse remaining elements
  reverse(arr, k, n - 1);

  return arr;
}

// Examples
console.log(rotateArray([1, 2, 3, 4, 5, 6, 7], 3));  // [5, 6, 7, 1, 2, 3, 4]
console.log(rotateArray([-1, -100, 3, 99], 2));       // [3, 99, -1, -100]
console.log(rotateInPlace([1, 2, 3, 4, 5], 2));       // [4, 5, 1, 2, 3]
```

> **Complexity:** Time O(n) · Space O(1) for in-place

---

### 12. Find All Pairs That Sum to Target

**Problem:** Find all unique pairs of numbers from an array that sum to the target value.

```javascript
/**
 * Approach 1: Hash set — O(n) time
 * Time:  O(n)
 * Space: O(n)
 */
function findPairsWithSum(arr, target) {
  const seen = new Set();
  const pairs = [];
  const usedPairs = new Set(); // avoid duplicates

  for (const num of arr) {
    const complement = target - num;

    if (seen.has(complement)) {
      const pair = [Math.min(num, complement), Math.max(num, complement)];
      const key = pair.join(',');

      if (!usedPairs.has(key)) {
        pairs.push(pair);
        usedPairs.add(key);
      }
    }

    seen.add(num);
  }

  return pairs;
}

/**
 * Approach 2: Two-pointer (sorted array)
 * Time:  O(n log n) due to sort
 * Space: O(1) extra
 */
function findPairsTwoPointer(arr, target) {
  const sorted = [...arr].sort((a, b) => a - b);
  const pairs = [];
  let left = 0;
  let right = sorted.length - 1;

  while (left < right) {
    const sum = sorted[left] + sorted[right];

    if (sum === target) {
      pairs.push([sorted[left], sorted[right]]);
      left++;
      right--;
      // Skip duplicates
      while (left < right && sorted[left] === sorted[left - 1]) left++;
      while (left < right && sorted[right] === sorted[right + 1]) right--;
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return pairs;
}

// Examples
console.log(findPairsWithSum([1, 5, 3, 7, 2, 6], 8));
// [[5, 3], [1, 7], [2, 6]] or similar order

console.log(findPairsTwoPointer([4, 1, 2, 3, 1, 5], 5));
// [[1, 4], [2, 3]]

console.log(findPairsWithSum([1, 1, 2, 2], 3));
// [[1, 2]]
```

> **Complexity:** Time O(n) · Space O(n) for hash-set approach

---

## OBJECTS

---

### 13. Group Array of Objects by Key

**Problem:** Group an array of objects by a specific key property.

```javascript
/**
 * Time:  O(n)
 * Space: O(n)
 */
function groupBy(arr, key) {
  return arr.reduce((groups, item) => {
    const groupKey = item[key]; // value to group by

    if (!groups[groupKey]) {
      groups[groupKey] = []; // create group if it doesn't exist
    }

    groups[groupKey].push(item);
    return groups;
  }, {});
}

/**
 * Generic groupBy with key as a function
 */
function groupByFn(arr, keyFn) {
  return arr.reduce((groups, item) => {
    const groupKey = typeof keyFn === 'function' ? keyFn(item) : item[keyFn];
    groups[groupKey] = groups[groupKey] || [];
    groups[groupKey].push(item);
    return groups;
  }, {});
}

// Examples
const people = [
  { name: 'Alice', age: 25, dept: 'Engineering' },
  { name: 'Bob',   age: 30, dept: 'Marketing' },
  { name: 'Carol', age: 25, dept: 'Engineering' },
  { name: 'Dave',  age: 30, dept: 'HR' },
];

console.log(groupBy(people, 'dept'));
// {
//   Engineering: [{ name: 'Alice', ...}, { name: 'Carol', ...}],
//   Marketing:   [{ name: 'Bob',   ...}],
//   HR:          [{ name: 'Dave',  ...}]
// }

console.log(groupBy(people, 'age'));
// { 25: [...], 30: [...] }

console.log(groupByFn(people, (p) => p.age > 27 ? 'senior' : 'junior'));
// { junior: [...], senior: [...] }
```

> **Complexity:** Time O(n) · Space O(n)

---

### 14. Deep Clone an Object Without JSON

**Problem:** Create a true deep clone of an object without using `JSON.parse(JSON.stringify())`. Handle special types like Date, RegExp, Arrays, circular references.

```javascript
/**
 * Deep Clone with circular reference handling
 * Time:  O(n) — n is total number of nodes
 * Space: O(n)
 */
function deepClone(obj, visited = new WeakMap()) {
  // Handle primitives and null
  if (obj === null || typeof obj !== 'object') return obj;

  // Handle circular references
  if (visited.has(obj)) return visited.get(obj);

  // Handle Date
  if (obj instanceof Date) return new Date(obj.getTime());

  // Handle RegExp
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);

  // Handle Array
  if (Array.isArray(obj)) {
    const clonedArr = [];
    visited.set(obj, clonedArr); // register before recursing
    for (const item of obj) {
      clonedArr.push(deepClone(item, visited));
    }
    return clonedArr;
  }

  // Handle plain Object
  const cloned = Object.create(Object.getPrototypeOf(obj));
  visited.set(obj, cloned); // register before recursing

  for (const key of Object.keys(obj)) {
    cloned[key] = deepClone(obj[key], visited);
  }

  return cloned;
}

// Examples
const original = {
  name: 'Alice',
  scores: [95, 87, 92],
  address: { city: 'NYC', zip: '10001' },
  createdAt: new Date('2024-01-01'),
  pattern: /hello/gi,
};

const clone = deepClone(original);
clone.name = 'Bob';
clone.scores.push(100);
clone.address.city = 'LA';

console.log(original.name);           // 'Alice' — unchanged
console.log(original.scores);         // [95, 87, 92] — unchanged
console.log(original.address.city);   // 'NYC' — unchanged
console.log(clone.createdAt instanceof Date); // true

// Circular reference test
const circular = { a: 1 };
circular.self = circular;
const circularClone = deepClone(circular);
console.log(circularClone.self === circularClone); // true
```

> **Complexity:** Time O(n) · Space O(n)

---

### 15. Merge Two Deeply Nested Objects

**Problem:** Merge two objects deeply so that nested properties are merged rather than overwritten.

```javascript
/**
 * Deep Merge (non-destructive)
 * Time:  O(n) — n is total properties across both objects
 * Space: O(n)
 */
function deepMerge(target, source) {
  // Start with a shallow copy of target
  const result = { ...target };

  for (const key of Object.keys(source)) {
    const sourceVal = source[key];
    const targetVal = result[key];

    if (
      sourceVal !== null &&
      typeof sourceVal === 'object' &&
      !Array.isArray(sourceVal) &&
      targetVal !== null &&
      typeof targetVal === 'object' &&
      !Array.isArray(targetVal)
    ) {
      // Both values are plain objects — recurse
      result[key] = deepMerge(targetVal, sourceVal);
    } else {
      // Primitive, array, or null — source wins
      result[key] = sourceVal;
    }
  }

  return result;
}

// Examples
const objA = {
  user: {
    name: 'Alice',
    prefs: { theme: 'dark', lang: 'en' },
  },
  version: 1,
};

const objB = {
  user: {
    age: 30,
    prefs: { lang: 'fr', fontSize: 14 },
  },
  debug: true,
};

console.log(deepMerge(objA, objB));
// {
//   user: {
//     name: 'Alice',
//     age: 30,
//     prefs: { theme: 'dark', lang: 'fr', fontSize: 14 }
//   },
//   version: 1,
//   debug: true
// }
```

> **Complexity:** Time O(n) · Space O(n)

---

### 16. Flatten Nested Object to Dot Notation

**Problem:** Flatten a nested object so keys represent the full path using dot notation.

```javascript
/**
 * Time:  O(n) — n is total number of key-value pairs
 * Space: O(n)
 */
function flattenObject(obj, prefix = '', result = {}) {
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];

    if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      // Recurse for nested objects
      flattenObject(value, fullKey, result);
    } else {
      // Leaf value — store with full dot-notation key
      result[fullKey] = value;
    }
  }

  return result;
}

/**
 * Bonus: Unflatten a dot-notation object back to nested
 */
function unflattenObject(obj) {
  const result = {};

  for (const key of Object.keys(obj)) {
    const parts = key.split('.');
    let current = result;

    for (let i = 0; i < parts.length - 1; i++) {
      current[parts[i]] = current[parts[i]] || {};
      current = current[parts[i]];
    }

    current[parts[parts.length - 1]] = obj[key];
  }

  return result;
}

// Examples
const nested = {
  user: {
    name: 'Alice',
    address: {
      city: 'NYC',
      zip: '10001',
    },
  },
  active: true,
  scores: [95, 87],
};

console.log(flattenObject(nested));
// {
//   'user.name': 'Alice',
//   'user.address.city': 'NYC',
//   'user.address.zip': '10001',
//   'active': true,
//   'scores': [95, 87]
// }

const flat = { 'a.b.c': 1, 'a.b.d': 2, 'e': 3 };
console.log(unflattenObject(flat));
// { a: { b: { c: 1, d: 2 } }, e: 3 }
```

> **Complexity:** Time O(n) · Space O(n)

---

## FUNCTIONS

---

### 17. Implement Debounce

**Problem:** Implement a debounce function that delays invoking `fn` until after `delay` ms have elapsed since the last call.

```javascript
/**
 * Debounce — delays execution until after idle period
 *
 * Use case: Search input — only fire API call after user stops typing
 *
 * Time:  O(1) per call
 * Space: O(1)
 */
function debounce(fn, delay) {
  let timerId = null;

  return function (...args) {
    // Cancel any pending timer
    clearTimeout(timerId);

    // Schedule a new timer
    timerId = setTimeout(() => {
      fn.apply(this, args);  // preserve 'this' context
      timerId = null;
    }, delay);
  };
}

/**
 * Advanced debounce with leading + trailing options
 */
function debounceAdvanced(fn, delay, { leading = false, trailing = true } = {}) {
  let timerId = null;

  return function (...args) {
    const isFirstCall = !timerId;

    clearTimeout(timerId);

    timerId = setTimeout(() => {
      timerId = null;
      if (trailing && !isFirstCall) {
        fn.apply(this, args);
      }
    }, delay);

    if (leading && isFirstCall) {
      fn.apply(this, args);
    }
  };
}

// Usage
const handleSearch = debounce((query) => {
  console.log(`Searching for: ${query}`);
}, 300);

// Simulate rapid user input — only last call fires after 300ms idle
handleSearch('j');
handleSearch('ja');
handleSearch('jav');
handleSearch('java'); // only this fires after 300ms
```

> **Complexity:** Time O(1) per call · Space O(1)

---

### 18. Implement Throttle

**Problem:** Implement a throttle function that ensures `fn` is called at most once per `limit` ms period.

```javascript
/**
 * Throttle — limits execution rate
 *
 * Use case: Window resize, scroll events — cap at max N calls per second
 *
 * Time:  O(1) per call
 * Space: O(1)
 */
function throttle(fn, limit) {
  let lastCallTime = 0;
  let timerId = null;

  return function (...args) {
    const now = Date.now();
    const remainingTime = limit - (now - lastCallTime);

    if (remainingTime <= 0) {
      // Enough time has passed — execute immediately
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
      lastCallTime = now;
      fn.apply(this, args);
    } else {
      // Schedule for when the remaining time elapses
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        lastCallTime = Date.now();
        timerId = null;
        fn.apply(this, args);
      }, remainingTime);
    }
  };
}

// Usage
const handleScroll = throttle(() => {
  console.log('Scroll event processed at', Date.now());
}, 200);

// Even if scroll fires 100 times/second, handleScroll only executes ~5 times/second
window.addEventListener('scroll', handleScroll);
```

> **Complexity:** Time O(1) per call · Space O(1)

---

### 19. Implement Memoize

**Problem:** Create a memoize function that caches the results of expensive function calls.

```javascript
/**
 * Basic memoize (works for single primitive args)
 * Time:  O(1) for cached results
 * Space: O(n) — n is number of unique arg combinations
 */
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args); // serialize args as cache key

    if (cache.has(key)) {
      console.log('Cache hit for:', key);
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    console.log('Computed and cached:', key);
    return result;
  };
}

/**
 * Advanced memoize with cache size limit (LRU-lite)
 */
function memoizeWithLimit(fn, maxSize = 100) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      const val = cache.get(key);
      cache.delete(key);
      cache.set(key, val); // move to end (most recently used)
      return val;
    }

    if (cache.size >= maxSize) {
      cache.delete(cache.keys().next().value); // remove oldest
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Usage
const memoFib = memoize(function fib(n) {
  if (n <= 1) return n;
  return memoFib(n - 1) + memoFib(n - 2);
});

console.log(memoFib(40)); // instant after first call
console.log(memoFib(40)); // Cache hit

const add = memoize((a, b) => a + b);
console.log(add(2, 3)); // Computed: 5
console.log(add(2, 3)); // Cache hit: 5
```

> **Complexity:** First call O(f(n)) · Subsequent calls O(1) · Space O(n)

---

### 20. Implement Curry Function

**Problem:** Implement a curry function that converts a function with multiple arguments into a chain of single-argument functions.

```javascript
/**
 * Curry — transforms f(a, b, c) into f(a)(b)(c)
 * Time:  O(1) per partial application
 * Space: O(n) — n is call depth
 */
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      // We have enough arguments — call original function
      return fn.apply(this, args);
    }

    // Return a new function collecting remaining arguments
    return function (...moreArgs) {
      return curried.apply(this, [...args, ...moreArgs]);
    };
  };
}

// Examples
function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3));     // 6 — fully curried
console.log(curriedAdd(1, 2)(3));     // 6 — partial application
console.log(curriedAdd(1)(2, 3));     // 6 — partial application
console.log(curriedAdd(1, 2, 3));     // 6 — all at once

// Real-world use: partially apply configuration
const multiply = curry((factor, value) => factor * value);
const double = multiply(2);
const triple = multiply(3);

console.log([1, 2, 3, 4].map(double)); // [2, 4, 6, 8]
console.log([1, 2, 3, 4].map(triple)); // [3, 6, 9, 12]

// Tagged template style
const greet = curry((greeting, name) => `${greeting}, ${name}!`);
const sayHello = greet('Hello');
console.log(sayHello('Alice')); // Hello, Alice!
console.log(sayHello('Bob'));   // Hello, Bob!
```

> **Complexity:** Time O(1) per step · Space O(n) for argument accumulation

---

### 21. Implement Pipe and Compose

**Problem:** Implement `pipe` (left-to-right) and `compose` (right-to-left) function composition utilities.

```javascript
/**
 * pipe — executes functions left to right
 * pipe(f, g, h)(x) === h(g(f(x)))
 *
 * Time:  O(n) — n is number of functions
 * Space: O(1)
 */
function pipe(...fns) {
  return function (value) {
    return fns.reduce((acc, fn) => fn(acc), value);
  };
}

/**
 * compose — executes functions right to left
 * compose(f, g, h)(x) === f(g(h(x)))
 *
 * Time:  O(n)
 * Space: O(1)
 */
function compose(...fns) {
  return function (value) {
    return fns.reduceRight((acc, fn) => fn(acc), value);
  };
}

// Examples
const double = (x) => x * 2;
const addTen = (x) => x + 10;
const square = (x) => x * x;

const piped = pipe(double, addTen, square);
console.log(piped(3));  // square(addTen(double(3))) = square(16) = 256

const composed = compose(square, addTen, double);
console.log(composed(3)); // same result: 256

// Real-world: data transformation pipeline
const processUser = pipe(
  (user) => ({ ...user, name: user.name.trim() }),
  (user) => ({ ...user, email: user.email.toLowerCase() }),
  (user) => ({ ...user, age: parseInt(user.age) }),
);

const user = processUser({ name: '  Alice  ', email: 'ALICE@EXAMPLE.COM', age: '25' });
console.log(user);
// { name: 'Alice', email: 'alice@example.com', age: 25 }
```

> **Complexity:** Time O(n) · Space O(1)

---

## ALGORITHMS

---

### 22. Binary Search

**Problem:** Implement binary search on a sorted array. Return the index of the target, or -1 if not found.

```javascript
/**
 * Iterative Binary Search (preferred)
 * Time:  O(log n)
 * Space: O(1)
 */
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid; // found
    } else if (arr[mid] < target) {
      left = mid + 1; // target is in right half
    } else {
      right = mid - 1; // target is in left half
    }
  }

  return -1; // not found
}

/**
 * Recursive Binary Search
 * Time:  O(log n)
 * Space: O(log n) — call stack
 */
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;

  const mid = Math.floor((left + right) / 2);

  if (arr[mid] === target) return mid;
  if (arr[mid] < target) return binarySearchRecursive(arr, target, mid + 1, right);
  return binarySearchRecursive(arr, target, left, mid - 1);
}

/**
 * Find leftmost (first) occurrence of target
 */
function binarySearchFirst(arr, target) {
  let left = 0, right = arr.length - 1, result = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      result = mid;
      right = mid - 1; // keep searching left
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result;
}

// Examples
const sorted = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
console.log(binarySearch(sorted, 7));            // 3
console.log(binarySearch(sorted, 6));            // -1
console.log(binarySearchRecursive(sorted, 15));  // 7
console.log(binarySearchFirst([1, 2, 2, 2, 3], 2)); // 1 — leftmost index
```

> **Complexity:** Time O(log n) · Space O(1) iterative

---

### 23. Fibonacci — Iterative + Recursive + Memoized

**Problem:** Return the Nth Fibonacci number using three approaches.

```javascript
/**
 * Approach 1: Naive Recursion — DO NOT USE IN PRODUCTION
 * Time:  O(2^n) — exponential!
 * Space: O(n) — call stack
 */
function fibRecursive(n) {
  if (n <= 1) return n;
  return fibRecursive(n - 1) + fibRecursive(n - 2);
}

/**
 * Approach 2: Memoized Recursion (top-down DP)
 * Time:  O(n)
 * Space: O(n)
 */
function fibMemo(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n] !== undefined) return memo[n]; // cache hit

  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}

/**
 * Approach 3: Iterative (bottom-up DP) — BEST
 * Time:  O(n)
 * Space: O(1)
 */
function fibIterative(n) {
  if (n <= 1) return n;

  let prev = 0, curr = 1;

  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }

  return curr;
}

/**
 * Bonus: Generate first n Fibonacci numbers
 */
function fibSequence(n) {
  if (n <= 0) return [];
  if (n === 1) return [0];

  const seq = [0, 1];
  for (let i = 2; i < n; i++) {
    seq.push(seq[i - 1] + seq[i - 2]);
  }
  return seq;
}

// Examples
console.log(fibIterative(0));  // 0
console.log(fibIterative(1));  // 1
console.log(fibIterative(10)); // 55
console.log(fibIterative(20)); // 6765
console.log(fibMemo(50));      // 12586269025

console.log(fibSequence(8));   // [0, 1, 1, 2, 3, 5, 8, 13]
```

> **Complexity:** Iterative: Time O(n) · Space O(1) | Memoized: Time O(n) · Space O(n)

---

### 24. Find Duplicate Elements in Array

**Problem:** Find all elements that appear more than once in the array.

```javascript
/**
 * Approach 1: Using frequency map
 * Time:  O(n)
 * Space: O(n)
 */
function findDuplicates(arr) {
  const freq = {};
  const duplicates = [];

  for (const item of arr) {
    freq[item] = (freq[item] || 0) + 1;
  }

  for (const [key, count] of Object.entries(freq)) {
    if (count > 1) duplicates.push(isNaN(key) ? key : Number(key));
  }

  return duplicates;
}

/**
 * Approach 2: Single-pass with a Set
 * Time:  O(n)
 * Space: O(n)
 */
function findDuplicatesSinglePass(arr) {
  const seen = new Set();
  const duplicates = new Set();

  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }

  return [...duplicates];
}

/**
 * Bonus: Find first duplicate
 */
function findFirstDuplicate(arr) {
  const seen = new Set();
  for (const item of arr) {
    if (seen.has(item)) return item;
    seen.add(item);
  }
  return null;
}

// Examples
console.log(findDuplicates([1, 2, 3, 2, 4, 3, 5]));       // [2, 3]
console.log(findDuplicatesSinglePass([4, 3, 2, 7, 8, 2, 3, 1])); // [2, 3]
console.log(findFirstDuplicate([2, 1, 3, 5, 3, 2]));       // 3
console.log(findDuplicates(['a', 'b', 'a', 'c', 'b']));    // ['a', 'b']
```

> **Complexity:** Time O(n) · Space O(n)

---

### 25. Implement a Basic Event Emitter (Pub/Sub)

**Problem:** Implement a publish/subscribe event system with `on`, `off`, `emit`, and `once` methods.

```javascript
/**
 * EventEmitter — Observer / Pub-Sub pattern
 */
class EventEmitter {
  constructor() {
    this.events = {}; // { eventName: [listeners] }
  }

  /** Register a listener for an event */
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return this; // chainable
  }

  /** Remove a specific listener for an event */
  off(event, listener) {
    if (!this.events[event]) return this;

    this.events[event] = this.events[event].filter((l) => l !== listener);

    if (this.events[event].length === 0) {
      delete this.events[event];
    }

    return this;
  }

  /** Emit an event, calling all registered listeners */
  emit(event, ...args) {
    if (!this.events[event]) return false;

    this.events[event].forEach((listener) => listener.apply(this, args));
    return true;
  }

  /** Register a listener that fires only once */
  once(event, listener) {
    const wrapper = (...args) => {
      listener.apply(this, args);
      this.off(event, wrapper); // auto-remove after first call
    };

    wrapper._original = listener;
    this.on(event, wrapper);
    return this;
  }

  /** Remove all listeners for an event (or all events) */
  removeAllListeners(event) {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
    return this;
  }

  /** Get listener count for an event */
  listenerCount(event) {
    return this.events[event] ? this.events[event].length : 0;
  }
}

// Usage
const emitter = new EventEmitter();

const greetHandler = (name) => console.log(`Hello, ${name}!`);
const logHandler   = (name) => console.log(`User: ${name}`);

emitter.on('greet', greetHandler);
emitter.on('greet', logHandler);
emitter.emit('greet', 'Alice');
// Hello, Alice!
// User: Alice

emitter.off('greet', logHandler);
emitter.emit('greet', 'Bob');
// Hello, Bob!

emitter.once('connect', () => console.log('Connected!'));
emitter.emit('connect'); // Connected!
emitter.emit('connect'); // (nothing — once already fired)

// Chaining
emitter
  .on('data', (d) => console.log('Received:', d))
  .on('error', (e) => console.error('Error:', e))
  .emit('data', { id: 1 });
```

> **Complexity:** `on/off/once` O(1) or O(n) · `emit` O(k) where k = listener count

---

### 26. Implement a Stack Using an Array

**Problem:** Implement a Stack data structure with `push`, `pop`, `peek`, `isEmpty`, and `size` operations.

```javascript
/**
 * Stack — Last In, First Out (LIFO)
 */
class Stack {
  constructor() {
    this.data = [];
  }

  /** Push an item to the top — Time: O(1) amortized */
  push(item) {
    this.data.push(item);
    return this; // chainable
  }

  /** Remove and return the top item — Time: O(1) */
  pop() {
    if (this.isEmpty()) throw new Error('Stack underflow — stack is empty');
    return this.data.pop();
  }

  /** View the top item without removing it — Time: O(1) */
  peek() {
    if (this.isEmpty()) return null;
    return this.data[this.data.length - 1];
  }

  /** Check if stack is empty — Time: O(1) */
  isEmpty() {
    return this.data.length === 0;
  }

  /** Return the number of items — Time: O(1) */
  size() {
    return this.data.length;
  }

  /** Clear all items — Time: O(1) */
  clear() {
    this.data = [];
    return this;
  }

  toArray() {
    return [...this.data];
  }

  toString() {
    return `Stack [${this.data.join(', ')}] <- top`;
  }
}

// Usage
const stack = new Stack();

stack.push(1).push(2).push(3);
console.log(stack.peek());    // 3
console.log(stack.size());    // 3
console.log(stack.pop());     // 3
console.log(stack.pop());     // 2
console.log(stack.size());    // 1
console.log(stack.isEmpty()); // false

// Classic use: check balanced parentheses
function isBalanced(str) {
  const stack = new Stack();
  const map = { ')': '(', ']': '[', '}': '{' };

  for (const ch of str) {
    if ('([{'.includes(ch)) {
      stack.push(ch);
    } else if (')]}'.includes(ch)) {
      if (stack.pop() !== map[ch]) return false;
    }
  }

  return stack.isEmpty();
}

console.log(isBalanced('({[]})'));   // true
console.log(isBalanced('({[})'));    // false
console.log(isBalanced('((()))'));   // true
```

> **Complexity:** All operations O(1) · Space O(n)

---

### 27. Implement LRU Cache

**Problem:** Design a data structure that follows the Least Recently Used (LRU) cache eviction policy.
Implement `get(key)` and `put(key, value)` — both must run in O(1).

```javascript
/**
 * LRU Cache using Map (preserves insertion order)
 *
 * Key insight: JavaScript's Map maintains insertion order.
 * Move accessed/updated items to the "end" (most recently used).
 * Evict from the "front" (least recently used).
 *
 * Time:  O(1) for get and put
 * Space: O(capacity)
 */
class LRUCache {
  constructor(capacity) {
    if (capacity <= 0) throw new Error('Capacity must be positive');
    this.capacity = capacity;
    this.cache = new Map(); // preserves insertion order
  }

  /**
   * Get value by key.
   * Returns -1 if key does not exist.
   * Marks key as recently used.
   */
  get(key) {
    if (!this.cache.has(key)) return -1;

    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  /**
   * Insert or update a key-value pair.
   * Evicts LRU item if capacity is exceeded.
   */
  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key); // remove then re-insert to move to end
    } else if (this.cache.size >= this.capacity) {
      const lruKey = this.cache.keys().next().value; // first = oldest
      this.cache.delete(lruKey);
    }

    this.cache.set(key, value);
  }

  size() {
    return this.cache.size;
  }

  has(key) {
    return this.cache.has(key);
  }

  toString() {
    return `LRU [${[...this.cache.entries()].map(([k, v]) => `${k}:${v}`).join(' -> ')}]`;
  }
}

// Usage
const lru = new LRUCache(3);

lru.put(1, 'one');
lru.put(2, 'two');
lru.put(3, 'three');
console.log(lru.toString()); // LRU [1:one -> 2:two -> 3:three]

lru.get(1);                  // access key 1 — moves to end
console.log(lru.toString()); // LRU [2:two -> 3:three -> 1:one]

lru.put(4, 'four');          // evicts key 2 (LRU)
console.log(lru.toString()); // LRU [3:three -> 1:one -> 4:four]

console.log(lru.get(2));     // -1 (evicted)
console.log(lru.get(3));     // 'three'

lru.put(5, 'five');          // evicts key 1 (LRU)
console.log(lru.get(1));     // -1 (evicted)
console.log(lru.get(4));     // 'four'
console.log(lru.get(5));     // 'five'
```

> **Complexity:** `get` O(1) · `put` O(1) · Space O(capacity)

---

## Quick Reference Summary

| # | Problem | Algorithm / Pattern | Time | Space |
|---|---------|---------------------|------|-------|
| 1 | Reverse String | Two Pointer | O(n) | O(n) |
| 2 | Palindrome | Two Pointer | O(n) | O(1) |
| 3 | Char Frequency | Hash Map | O(n) | O(k) |
| 4 | First Unique Char | Two-Pass Hash | O(n) | O(k) |
| 5 | Anagram Check | Frequency Map | O(n) | O(k) |
| 6 | Longest No-Repeat Substr | Sliding Window | O(n) | O(k) |
| 7 | Remove Duplicates | Hash Object | O(n) | O(n) |
| 8 | Flatten Array | Recursion / Stack | O(n) | O(n) |
| 9 | Max Subarray Sum | Kadane's | O(n) | O(1) |
| 10 | Two Sum | Hash Map | O(n) | O(n) |
| 11 | Rotate Array | Reverse Trick | O(n) | O(1) |
| 12 | Pairs with Sum | Hash Set / Two Ptr | O(n) | O(n) |
| 13 | Group By Key | reduce | O(n) | O(n) |
| 14 | Deep Clone | Recursion + WeakMap | O(n) | O(n) |
| 15 | Deep Merge | Recursion | O(n) | O(n) |
| 16 | Flatten Object | Recursion | O(n) | O(n) |
| 17 | Debounce | Closure + Timer | O(1) | O(1) |
| 18 | Throttle | Closure + Timer | O(1) | O(1) |
| 19 | Memoize | Closure + Cache | O(1) cached | O(n) |
| 20 | Curry | Closure + Recursion | O(1) | O(n) |
| 21 | Pipe / Compose | reduce / reduceRight | O(n) | O(1) |
| 22 | Binary Search | Divide and Conquer | O(log n) | O(1) |
| 23 | Fibonacci | DP / Memoization | O(n) | O(1) |
| 24 | Find Duplicates | Hash Set | O(n) | O(n) |
| 25 | Event Emitter | Pub/Sub Pattern | O(k) | O(n) |
| 26 | Stack | Array + OOP | O(1) | O(n) |
| 27 | LRU Cache | Map + Order | O(1) | O(cap) |

---

*Last updated: 2026 · Category: JavaScript Interview Preparation*
