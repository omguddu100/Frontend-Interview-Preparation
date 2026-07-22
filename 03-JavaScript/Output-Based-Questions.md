# 🧩 JavaScript Output-Based Questions — Master Compendium

> **Category:** JavaScript | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-22

---

## 1. Hoisting & Scope

---

### Q1. What is the output?
```javascript
var x = 21;
var girl = function () {
  console.log(x);
  var x = 20;
};
girl();
```

**Answer:** `undefined`

**Explanation:**
Inside the function `girl()`, `var x` is hoisted to the top of function scope. It masks the global `x`. When `console.log(x)` executes, `x` has been declared locally but not yet assigned, so its value is `undefined`.

---

### Q2. What is the output?
```javascript
(function() {
  var a = b = 5;
})();

console.log(typeof a);
console.log(typeof b);
```

**Answer:**
```
"undefined"
"number"
```

**Explanation:**
`var a = b = 5;` is evaluated right-to-left as `b = 5; var a = b;`. Since `b` is assigned without declaration (in non-strict mode), it becomes an implicit global variable. `a` is declared with `var` inside the IIFE, so it is function-scoped. Outside the function, `a` is undefined, while `b` is accessible globally with value `5`.

---

### Q3. What is the output?
```javascript
let x = 1;
{
  console.log(x);
  let x = 2;
}
```

**Answer:** `ReferenceError: Cannot access 'x' before initialization`

**Explanation:**
Inside the block, `let x = 2` hoists `x` to the top of the block scope, creating a Temporal Dead Zone (TDZ) from the start of the block until the declaration line. Accessing `x` inside the TDZ throws a `ReferenceError`.

---

### Q4. What is the output?
```javascript
function foo() {
  return bar();
  var bar = function() {
    return 1;
  };
  function bar() {
    return 2;
  }
}
console.log(foo());
```

**Answer:** `2`

**Explanation:**
Function declarations are hoisted before variable declarations. First, `function bar() { return 2; }` is hoisted. Then `var bar` is hoisted, but since `bar` is already a function declaration, `var bar` does not overwrite it. When `foo()` executes, `return bar();` runs immediately before the assignment `bar = function() ...` occurs, so the function declaration returning `2` is executed.

---

### Q5. What is the output?
```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1);
}

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 1);
}
```

**Answer:**
```
3
3
3
0
1
2
```

**Explanation:**
`var` is function-scoped, so all iterations share the same variable `i`. By the time the `setTimeout` callbacks run, the loop has completed and `i` is 3. `let` is block-scoped, creating a fresh binding of `j` for each loop iteration.

---

## 2. Closures & Functions

---

### Q6. What is the output?
```javascript
const createCounter = () => {
  let count = 0;
  return {
    increment: () => ++count,
    getCount: () => count
  };
};

const counter1 = createCounter();
const counter2 = createCounter();

counter1.increment();
counter1.increment();

console.log(counter1.getCount());
console.log(counter2.getCount());
```

**Answer:**
```
2
0
```

**Explanation:**
Each call to `createCounter()` creates a new closure with its own independent `count` variable in memory.

---

### Q7. What is the output?
```javascript
let count = 0;
(function immediate() {
  if (count === 0) {
    let count = 1;
    console.log(count);
  }
  console.log(count);
})();
```

**Answer:**
```
1
0
```

**Explanation:**
Inside the `if` block, `let count = 1` creates a block-scoped variable that shadows the outer `count`. Inside the block, it logs `1`. Outside the `if` block, it accesses the outer `count` which remains `0`.

---

### Q8. What is the output?
```javascript
function setup() {
  var arr = [];
  for (var i = 0; i < 3; i++) {
    arr.push(function() {
      return i;
    });
  }
  return arr;
}

var funcs = setup();
console.log(funcs[0]());
console.log(funcs[1]());
```

**Answer:**
```
3
3
```

**Explanation:**
All functions in `arr` close over the single `var i` in `setup`'s scope. By the time `funcs` are invoked, `setup` has finished running and `i` equals 3.

---

## 3. `this` Keyword

---

### Q9. What is the output?
```javascript
const obj = {
  name: 'JavaScript',
  getName: function() {
    return this.name;
  },
  getArrowName: () => {
    return this.name;
  }
};

const getName = obj.getName;

console.log(obj.getName());
console.log(getName());
console.log(obj.getArrowName());
```

**Answer:**
```
"JavaScript"
undefined (or window.name in browser)
undefined (or window.name in browser)
```

**Explanation:**
- `obj.getName()`: Implicit binding to `obj`, returns `'JavaScript'`.
- `getName()`: Invoked standalone, `this` defaults to global object (or `undefined` in strict mode).
- `obj.getArrowName()`: Arrow functions do not have their own `this`. They inherit `this` from the enclosing scope at declaration time (global scope here).

---

### Q10. What is the output?
```javascript
var length = 10;
function fn() {
  console.log(this.length);
}

var obj = {
  length: 5,
  method: function(fn) {
    fn();
    arguments[0]();
  }
};

obj.method(fn, 1);
```

**Answer:**
```
10 (or undefined in strict mode)
2
```

**Explanation:**
- First call `fn()` is invoked without context, so `this` is global (`length = 10`).
- Second call `arguments[0]()` invokes `fn` as a method of the `arguments` object. `arguments.length` is the number of arguments passed to `method`, which is 2 (`fn` and `1`).

---

### Q11. What is the output?
```javascript
const hero = {
  name: 'Batman',
  getName() {
    return this.name;
  }
};

const boundGetName = hero.getName.bind({ name: 'Superman' });
console.log(boundGetName());
```

**Answer:** `Superman`

**Explanation:**
`bind` creates a new function with its `this` context explicitly bound to the provided object (`{ name: 'Superman' }`).

---

## 4. Promises & Async / Event Loop

---

### Q12. What is the output?
```javascript
console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
});

console.log('4');
```

**Answer:**
```
1
4
3
2
```

**Explanation:**
- `'1'` and `'4'` are synchronous (Call Stack).
- Promise `.then` callback goes to the **Microtask Queue**.
- `setTimeout` callback goes to the **Macrotask Queue**.
- Microtasks run before Macrotasks once sync execution finishes.

---

### Q13. What is the output?
```javascript
const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve(2);
  console.log(3);
});

promise.then((res) => {
  console.log(res);
});

console.log(4);
```

**Answer:**
```
1
3
4
2
```

**Explanation:**
The executor function passed to `new Promise()` executes **synchronously** immediately upon creation. Thus `1` and `3` are logged synchronously. `4` is logged next synchronously. `.then()` is queued as a microtask and logs `2` last.

---

### Q14. What is the output?
```javascript
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}

async function async2() {
  console.log('async2');
}

console.log('script start');

setTimeout(function () {
  console.log('setTimeout');
}, 0);

async1();

new Promise(function (resolve) {
  console.log('promise1');
  resolve();
}).then(function () {
  console.log('promise2');
});

console.log('script end');
```

**Answer:**
```
script start
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout
```

**Explanation:**
1. `script start` (sync)
2. `async1()` called -> logs `async1 start` (sync)
3. `async2()` called -> logs `async2` (sync)
4. `await` pauses `async1`, pushing the remainder of `async1` to the Microtask Queue.
5. Promise executor -> logs `promise1` (sync), resolves promise pushing `.then` to Microtask Queue.
6. `script end` (sync)
7. Microtask 1: `async1 end`
8. Microtask 2: `promise2`
9. Macrotask: `setTimeout`

---

## 5. Type Coercion & Equality

---

### Q15. What is the output?
```javascript
console.log([] + []);
console.log([] + {});
console.log({} + []);
console.log(true + false);
console.log("5" - - "3");
```

**Answer:**
```
""
"[object Object]"
"[object Object]" (or 0 in browser console depending on evaluation as block)
1
8
```

**Explanation:**
- `[] + []`: both arrays convert to `""`, resulting in `""`.
- `[] + {}`: `"" + "[object Object]"` = `"[object Object]"`.
- `true + false`: `1 + 0 = 1`.
- `"5" - - "3"`: `- - "3"` is positive 3. `"5" - 3` coerces `"5"` to number `5`, `5 - (-3) = 8`.

---

### Q16. What is the output?
```javascript
console.log(NaN == NaN);
console.log(NaN === NaN);
console.log(Object.is(NaN, NaN));
console.log(1 / 0 === 1 / -0);
console.log(Object.is(0, -0));
```

**Answer:**
```
false
false
true
false
false
```

**Explanation:**
`NaN` is never equal to anything including itself under `==` and `===`. `Object.is` correctly identifies `NaN` equals `NaN`. `1/0` is `Infinity` while `1/-0` is `-Infinity`. `0` and `-0` are strictly equal with `===`, but `Object.is(0, -0)` returns `false`.

---

## 📝 Quick Summary Checklist

- **Hoisting:** `var` hoisted as `undefined`, `let`/`const` in TDZ, function declarations fully hoisted.
- **`this` rules:** Arrow functions inherit `this` lexically; regular functions bind `this` based on how they are called.
- **Event Loop:** Call Stack (Sync) -> Microtask Queue (Promises, `queueMicrotask`) -> Macrotask Queue (`setTimeout`, `setInterval`).
- **Coercion:** `+` with strings concatenates; `-`, `*`, `/` coerce operands to numbers.

---

*Senior UI Developer Interview Prep — JavaScript Output-Based Questions*
