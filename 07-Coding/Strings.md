# 🔤 String Coding Problems — Senior UI Interview

> **Category:** Coding | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 1. Longest Substring Without Repeating Characters

### Problem
Given a string `s`, find the length of the longest substring without repeating characters.

```javascript
/**
 * Time Complexity: O(n) - Sliding Window
 * Space Complexity: O(min(m, n))
 */
function lengthOfLongestSubstring(s) {
  const map = new Map(); // char -> last seen index
  let maxLen = 0;
  let start = 0;

  for (let end = 0; end < s.length; end++) {
    const char = s[end];
    if (map.has(char) && map.get(char) >= start) {
      start = map.get(char) + 1;
    }
    map.set(char, end);
    maxLen = Math.max(maxLen, end - start + 1);
  }

  return maxLen;
}

// Test
console.log(lengthOfLongestSubstring("abcabcbb")); // 3 ("abc")
console.log(lengthOfLongestSubstring("bbbbb"));    // 1 ("b")
```

---

## 2. Valid Anagram

### Problem
Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.

```javascript
/**
 * Time Complexity: O(n)
 * Space Complexity: O(1) - 26 lowercase English letters
 */
function isAnagram(s, t) {
  if (s.length !== t.length) return false;

  const count = {};

  for (let char of s) {
    count[char] = (count[char] || 0) + 1;
  }

  for (let char of t) {
    if (!count[char]) return false;
    count[char]--;
  }

  return true;
}

// Test
console.log(isAnagram("anagram", "nagaram")); // true
console.log(isAnagram("rat", "car"));         // false
```

---

## 3. First Non-Repeating Character in a String

### Problem
Given a string `s`, find the first non-repeating character in it and return its index. If it does not exist, return `-1`.

```javascript
/**
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function firstUniqChar(s) {
  const countMap = new Map();

  for (let char of s) {
    countMap.set(char, (countMap.get(char) || 0) + 1);
  }

  for (let i = 0; i < s.length; i++) {
    if (countMap.get(s[i]) === 1) {
      return i;
    }
  }

  return -1;
}

// Test
console.log(firstUniqChar("leetcode"));     // 0 ('l')
console.log(firstUniqChar("loveleetcode")); // 2 ('v')
```

---

## 4. Valid Palindrome (Ignoring Alphanumeric Case)

### Problem
Check if a string is a palindrome, considering only alphanumeric characters and ignoring cases.

```javascript
/**
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    while (left < right && !/[a-zA-Z0-9]/.test(s[left])) left++;
    while (left < right && !/[a-zA-Z0-9]/.test(s[right])) right--;

    if (s[left].toLowerCase() !== s[right].toLowerCase()) {
      return false;
    }
    left++;
    right--;
  }

  return true;
}

// Test
console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindrome("race a car"));                     // false
```

---

## 📝 Quick Reference

```
String Time Complexities:
• Sliding Window Longest Substring: O(n)
• Frequency Counter Anagram: O(n)
• Two Pointer Palindrome: O(n)
```

---

*Senior UI Developer Interview Prep — String Coding Problems*
