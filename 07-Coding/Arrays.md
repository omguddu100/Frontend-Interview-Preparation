# 📊 Array Coding Problems — Senior UI Interview

> **Category:** Coding | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 1. Two Sum (Return Indices)

### Problem
Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

```javascript
/**
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function twoSum(nums, target) {
  const map = new Map(); // value -> index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }

  return [];
}

// Test
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
```

---

## 2. Maximum Subarray Sum (Kadane's Algorithm)

### Problem
Find the contiguous subarray (containing at least one number) which has the largest sum.

```javascript
/**
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function maxSubArray(nums) {
  let maxFar = nums[0];
  let maxEndingHere = nums[0];

  for (let i = 1; i < nums.length; i++) {
    maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
    maxFar = Math.max(maxFar, maxEndingHere);
  }

  return maxFar;
}

// Test
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6 (Subarray: [4,-1,2,1])
```

---

## 3. Move Zeroes to End (In-Place)

### Problem
Move all `0`s to the end of the array while maintaining the relative order of non-zero elements. Must be done in-place.

```javascript
/**
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function moveZeroes(nums) {
  let insertPos = 0;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      [nums[insertPos], nums[i]] = [nums[i], nums[insertPos]];
      insertPos++;
    }
  }

  return nums;
}

// Test
console.log(moveZeroes([0, 1, 0, 3, 12])); // [1, 3, 12, 0, 0]
```

---

## 4. Rotate Array Right by K Steps

### Problem
Rotate an array to the right by `k` steps, where `k` is non-negative.

```javascript
/**
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function rotate(nums, k) {
  k = k % nums.length;

  const reverse = (arr, start, end) => {
    while (start < end) {
      [arr[start], arr[end]] = [arr[end], arr[start]];
      start++;
      end--;
    }
  };

  reverse(nums, 0, nums.length - 1);
  reverse(nums, 0, k - 1);
  reverse(nums, k, nums.length - 1);

  return nums;
}

// Test
console.log(rotate([1, 2, 3, 4, 5, 6, 7], 3)); // [5, 6, 7, 1, 2, 3, 4]
```

---

## 5. Flatten Nested Array (Without Array.prototype.flat)

### Problem
Flatten an arbitrarily nested array into a single flat array.

```javascript
/**
 * Time Complexity: O(n) total elements
 * Space Complexity: O(d) recursion stack depth
 */
function flattenArray(arr) {
  return arr.reduce((acc, val) => {
    return Array.isArray(val) ? acc.concat(flattenArray(val)) : acc.concat(val);
  }, []);
}

// Iterative Stack Solution (O(n) time, no stack overflow for deep arrays)
function flattenIterative(arr) {
  const stack = [...arr];
  const result = [];

  while (stack.length) {
    const next = stack.pop();
    if (Array.isArray(next)) {
      stack.push(...next);
    } else {
      result.push(next);
    }
  }

  return result.reverse();
}

// Test
console.log(flattenArray([1, [2, [3, 4], 5], 6])); // [1, 2, 3, 4, 5, 6]
```

---

## 📝 Quick Reference

```
Array Time Complexities:
• Map Lookup Two-Sum: O(n)
• Kadane's Max Subarray: O(n)
• In-Place Swap Move Zeroes: O(n)
• 3-Step Reverse Rotate: O(n)
• Recursive/Stack Flatten: O(total elements)
```

---

*Senior UI Developer Interview Prep — Array Coding Problems*
