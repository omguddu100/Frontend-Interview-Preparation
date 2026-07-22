# call(), apply(), bind() — Interview Q&A
> Category: JavaScript | Level: Basic → Advanced | Last Updated: 2026-07-22

---

## Table of Contents
1. [Overview & Differences](#overview--differences)
2. [call()](#call)
3. [apply()](#apply)
4. [bind()](#bind)
5. [Method Borrowing](#method-borrowing)
6. [Partial Application with bind](#partial-application-with-bind)
7. [Polyfill: Function.prototype.call](#polyfill-functionprototypecall)
8. [Polyfill: Function.prototype.apply](#polyfill-functionprototypeapply)
9. [Polyfill: Function.prototype.bind](#polyfill-functionprototypebind)
10. [Real-World Use Cases](#real-world-use-cases)
11. [Output-Based Questions](#output-based-questions)
12. [Quick Reference](#quick-reference)

---

## 🟢 Overview & Differences

### Q1. What are call(), apply(), and bind()?
**Level: Basic**

**Answer:**
All three are methods on `Function.prototype` that allow you to **explicitly set the `this` context** when invoking a function. They differ in **how** they invoke the function and **how** they pass arguments.

| Feature          | `call()`               | `apply()`              | `bind()`                      |
|------------------|------------------------|------------------------|-------------------------------|
| Invokes immediately | ✅ Yes              | ✅ Yes                 | ❌ No (returns new function)  |
| Args format      | Comma-separated        | Array (or array-like)  | Comma-separated (partial ok)  |
| Returns          | Function's return value| Function's return value| New bound function            |
| `this` override  | ✅                     | ✅                     | ✅ (permanent)                |

```javascript
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const user = { name: "Alice" };

console.log(greet.call(user, "Hello", "!"));     // "Hello, Alice!"
console.log(greet.apply(user, ["Hello", "!"]));  // "Hello, Alice!"

const boundGreet = greet.bind(user, "Hello");
console.log(boundGreet("!"));                    // "Hello, Alice!"
```

---

## 🟢 call()

### Q2. What is Function.prototype.call()?
**Level: Basic**

**Answer:**
`call()` invokes a function **immediately** with a specified `this` value and arguments passed **individually** (comma-separated).

**Syntax:**
```javascript
func.call(thisArg, arg1, arg2, ...argN)
```

- `thisArg`: The value to use as `this`. If `null` or `undefined` in non-strict mode, defaults to global.
- `arg1, arg2, ...`: Arguments passed to the function.

```javascript
function introduce(city, country) {
  console.log(`I'm ${this.name}, from ${city}, ${country}`);
}

const person = { name: "Bob" };

introduce.call(person, "Delhi", "India");
// I'm Bob, from Delhi, India
```

### Q3. What happens when null/undefined is passed as thisArg to call()?
**Level: Intermediate**

```javascript
function show() {
  console.log(this);
}

show.call(null);      // non-strict: window | strict: null
show.call(undefined); // non-strict: window | strict: undefined
show.call(0);         // Number(0) wrapper in non-strict | 0 in strict
```

**Note:** In strict mode, `this` is exactly what you pass — no boxing/coercion.

---

## 🟢 apply()

### Q4. What is Function.prototype.apply()?
**Level: Basic**

**Answer:**
`apply()` is identical to `call()` except arguments are passed as an **array** (or array-like object). Useful when arguments are already in an array.

**Syntax:**
```javascript
func.apply(thisArg, [argsArray])
```

```javascript
function sum(a, b, c) {
  return a + b + c;
}

const nums = [1, 2, 3];

console.log(sum.apply(null, nums)); // 6
// Equivalent with spread:
console.log(sum(...nums));          // 6
```

### Q5. What are practical uses of apply() with built-ins?
**Level: Intermediate**

**Answer:**

**1. Math.max / Math.min with arrays (pre-spread syntax)**
```javascript
const numbers = [5, 3, 9, 1, 7];

// Old way (before spread)
console.log(Math.max.apply(null, numbers)); // 9
console.log(Math.min.apply(null, numbers)); // 1

// Modern way (spread)
console.log(Math.max(...numbers)); // 9
```

**2. Array.prototype.push for appending arrays**
```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

Array.prototype.push.apply(arr1, arr2);
console.log(arr1); // [1, 2, 3, 4, 5, 6]
```

**3. Convert arguments to array (legacy)**
```javascript
function toArray() {
  return Array.prototype.slice.apply(arguments);
}
console.log(toArray(1, 2, 3)); // [1, 2, 3]
```

---

## 🟡 bind()

### Q6. What is Function.prototype.bind()?
**Level: Basic**

**Answer:**
`bind()` creates a **new function** with `this` permanently bound to the specified value. It does NOT invoke the function immediately. The bound function can be called later.

**Syntax:**
```javascript
const boundFn = func.bind(thisArg, arg1, arg2, ...);
```

```javascript
function greet(greeting) {
  return `${greeting}, ${this.name}!`;
}

const user = { name: "Carol" };
const greetCarol = greet.bind(user, "Hello");

console.log(greetCarol()); // "Hello, Carol!"

// Even call/apply can't override it:
console.log(greetCarol.call({ name: "Dave" })); // "Hello, Carol!" (bind wins)
```

### Q7. How is bind() different from call()/apply()?
**Level: Basic**

```javascript
function logThis() {
  console.log(this.x);
}

const ctx = { x: 42 };

logThis.call(ctx);   // 42 — runs immediately
logThis.apply(ctx);  // 42 — runs immediately

const bound = logThis.bind(ctx);
// Does not run yet...
setTimeout(bound, 1000); // 42 — runs later, this is preserved
```

### Q8. Can bind() be used with new?
**Level: Advanced**

**Answer:**
Yes, but `new` **overrides** the bound `this`. The `new` keyword creates a fresh object, ignoring the bound `this`. Pre-bound arguments are still applied.

```javascript
function Point(x, y) {
  this.x = x;
  this.y = y;
}

const BoundPoint = Point.bind({ ignored: true }, 10); // pre-bind x=10

const p = new BoundPoint(20); // new overrides this
console.log(p.x); // 10 (pre-bound arg)
console.log(p.y); // 20
console.log(p.ignored); // undefined — bound this was ignored
```

---

## 🟡 Method Borrowing

### Q9. How do you borrow methods using call/apply?
**Level: Intermediate**

**Answer:**
Method borrowing allows one object to use a method that belongs to another, without copying it. This is a powerful pattern in JavaScript.

```javascript
// Borrowing Array methods for array-like objects
function showArgs() {
  // arguments is array-like, not a real array
  const args = Array.prototype.slice.call(arguments);
  console.log(args); // real array
  
  const joined = Array.prototype.join.call(arguments, " - ");
  console.log(joined);
}

showArgs(1, 2, 3);
// [1, 2, 3]
// "1 - 2 - 3"
```

```javascript
// Borrowing toString for type checking
function getType(val) {
  return Object.prototype.toString.call(val);
}

console.log(getType([]));        // "[object Array]"
console.log(getType({}));        // "[object Object]"
console.log(getType(null));      // "[object Null]"
console.log(getType(undefined)); // "[object Undefined]"
console.log(getType(42));        // "[object Number]"
```

```javascript
// Borrowing between similar objects
const calculator = {
  value: 0,
  add(n) {
    this.value += n;
    return this;
  },
  result() {
    return this.value;
  }
};

const myCalc = { value: 100 };
calculator.add.call(myCalc, 50);
console.log(calculator.result.call(myCalc)); // 150
```

### Q10. How do you convert NodeList / arguments to an array?
**Level: Intermediate**

```javascript
// Method 1: call with Array.prototype.slice
const nodeList = document.querySelectorAll("div");
const divArray = Array.prototype.slice.call(nodeList);

// Method 2: apply
const args = Array.prototype.slice.apply(arguments);

// Method 3: Modern (ES6+)
const arr1 = Array.from(nodeList);
const arr2 = [...nodeList];
```

---

## 🟡 Partial Application with bind

### Q11. What is partial application and how does bind() enable it?
**Level: Intermediate**

**Answer:**
Partial application means **pre-filling some arguments** of a function to create a specialized version. `bind()` naturally supports this by accepting arguments after `thisArg`.

```javascript
function multiply(a, b) {
  return a * b;
}

// Pre-fill first argument (partial application)
const double = multiply.bind(null, 2);  // a = 2 is fixed
const triple = multiply.bind(null, 3);  // a = 3 is fixed

console.log(double(5));  // 10
console.log(triple(5));  // 15
console.log(double(7));  // 14
```

```javascript
// Real-world: API call helper
function fetchData(baseURL, endpoint, id) {
  console.log(`GET ${baseURL}${endpoint}/${id}`);
}

const apiCall = fetchData.bind(null, "https://api.example.com");
const userCall = apiCall.bind(null, "/users");

userCall(42);  // GET https://api.example.com/users/42
userCall(99);  // GET https://api.example.com/users/99
```

```javascript
// Event handler with pre-bound data
function handleItemClick(itemId, event) {
  console.log(`Clicked item ${itemId}`, event);
}

document.getElementById("item-1")
  .addEventListener("click", handleItemClick.bind(null, 1));
document.getElementById("item-2")
  .addEventListener("click", handleItemClick.bind(null, 2));
```

---

## 🔴 Polyfill: Function.prototype.call

### Q12. Write a polyfill for Function.prototype.call
**Level: Advanced**

**Answer:**
The key idea: temporarily attach the function to the context object as a property, call it (so `this` = that object via implicit binding), then remove it.

```javascript
Function.prototype.myCall = function (context, ...args) {
  // Step 1: If context is null/undefined, default to global
  context = context || globalThis;

  // Step 2: Convert primitives to objects (non-strict boxing)
  context = Object(context);

  // Step 3: Create a unique key to avoid overwriting existing properties
  const fnKey = Symbol("fn");

  // Step 4: Attach this (the function) to the context object
  context[fnKey] = this;

  // Step 5: Call the function via the context (implicit binding sets this = context)
  const result = context[fnKey](...args);

  // Step 6: Clean up — remove the temporary property
  delete context[fnKey];

  // Step 7: Return the result
  return result;
};

// ✅ Test
function greet(greeting, punct) {
  return `${greeting}, ${this.name}${punct}`;
}

const user = { name: "Alice" };
console.log(greet.myCall(user, "Hello", "!"));  // "Hello, Alice!"
console.log(greet.myCall(null, "Hi", "."));     // "Hi, undefined." (global)
```

---

## 🔴 Polyfill: Function.prototype.apply

### Q13. Write a polyfill for Function.prototype.apply
**Level: Advanced**

**Answer:**
Same as `call` polyfill, but accepts args as an array.

```javascript
Function.prototype.myApply = function (context, args) {
  // Step 1: Default context
  context = context || globalThis;
  context = Object(context);

  // Step 2: Unique property key
  const fnKey = Symbol("fn");

  // Step 3: Attach function to context
  context[fnKey] = this;

  // Step 4: args may be null/undefined — handle that
  let result;
  if (!args || args.length === 0) {
    result = context[fnKey]();
  } else {
    // Spread the args array
    result = context[fnKey](...args);
  }

  // Step 5: Cleanup
  delete context[fnKey];

  return result;
};

// ✅ Test
function introduce(city, country) {
  return `${this.name} from ${city}, ${country}`;
}

const person = { name: "Bob" };
console.log(introduce.myApply(person, ["Mumbai", "India"]));
// "Bob from Mumbai, India"

// Math.max example
console.log(Math.max.myApply(null, [5, 3, 9, 1])); // 9
```

---

## 🔴 Polyfill: Function.prototype.bind

### Q14. Write a polyfill for Function.prototype.bind
**Level: Advanced**

**Answer:**
`bind` must return a new function. It also needs to handle `new` properly (when used as a constructor, `new` overrides the bound `this`).

```javascript
Function.prototype.myBind = function (context, ...presetArgs) {
  // Validate: this must be a function
  if (typeof this !== "function") {
    throw new TypeError("myBind called on non-function");
  }

  const originalFn = this; // the function being bound

  // The bound function returned to the caller
  function BoundFn(...laterArgs) {
    // Combine preset args with later args
    const allArgs = [...presetArgs, ...laterArgs];

    // If called with 'new', this instanceof BoundFn is true
    // In that case, use the newly created object (this), not the bound context
    const ctx = this instanceof BoundFn ? this : context;

    return originalFn.apply(ctx, allArgs);
  }

  // Preserve prototype chain so instanceof works correctly
  // when bound function is used as constructor
  if (originalFn.prototype) {
    BoundFn.prototype = Object.create(originalFn.prototype);
  }

  return BoundFn;
};

// ✅ Test 1: Basic bind
function greet(greeting, punct) {
  return `${greeting}, ${this.name}${punct}`;
}
const user = { name: "Carol" };
const greetCarol = greet.myBind(user, "Hello");
console.log(greetCarol("!"));  // "Hello, Carol!"

// ✅ Test 2: Bind can't be overridden by call
console.log(greetCarol.call({ name: "Dave" }, "?")); // "Hello, Carol!"

// ✅ Test 3: Used with new
function Point(x, y) {
  this.x = x;
  this.y = y;
}
const BoundPoint = Point.myBind(null, 10);
const p = new BoundPoint(20);
console.log(p.x, p.y); // 10 20

// ✅ Test 4: Partial application
const double = Math.pow.myBind(null, 2);
console.log(double(10)); // 1024
```

---

## 🟡 Real-World Use Cases

### Q15. List real-world scenarios for each method
**Level: Intermediate**

**call() use cases:**
```javascript
// 1. Super constructor calling
function Animal(name) { this.name = name; }
function Dog(name, breed) {
  Animal.call(this, name); // borrow Animal's constructor
  this.breed = breed;
}

// 2. Type checking
Object.prototype.toString.call(value); // reliable typeof

// 3. Immediate invocation with context
(function log() { console.log(this.id); }).call({ id: 99 });
```

**apply() use cases:**
```javascript
// 1. Spread array into Math functions
const nums = [10, 20, 5, 30];
Math.max.apply(null, nums); // 30

// 2. Push array into another array
Array.prototype.push.apply(target, source);

// 3. Dynamically invoke with unknown number of args
someFunction.apply(ctx, dynamicArgs);
```

**bind() use cases:**
```javascript
// 1. Preserve this in event handlers
btn.addEventListener("click", this.handleClick.bind(this));

// 2. Partial application
const log = console.log.bind(console);
log("Bound log"); // always uses console as this

// 3. setTimeout with context
setTimeout(obj.method.bind(obj), 500);

// 4. React class component methods
this.handleChange = this.handleChange.bind(this);

// 5. Currying-like patterns
const add = (a, b) => a + b;
const add5 = add.bind(null, 5);
add5(3); // 8
```

---

## 🔴 Output-Based Questions

### Q16. What is the output?
**Level: Intermediate**

```javascript
const obj = { x: 10 };

function getX() {
  return this.x;
}

const bound = getX.bind(obj);
console.log(bound());           // ?
console.log(bound.call({ x: 99 })); // ?
console.log(bound.apply({ x: 99 })); // ?
```

**Answer:**
```
10   // bound to obj
10   // call cannot override bind
10   // apply cannot override bind
```

---

### Q17. What is the output?
**Level: Intermediate**

```javascript
function Timer() {
  this.count = 0;
}

Timer.prototype.start = function () {
  return setInterval(function tick() {
    this.count++;
    console.log(this.count);
  }.bind(this), 1000);
};

const t = new Timer();
t.start();
```

**Answer:**
```
1
2
3
...
```
`.bind(this)` inside `start()` captures `t` as `this`, so `tick` correctly increments `t.count`.

---

### Q18. What is the output?
**Level: Advanced**

```javascript
function foo(a, b) {
  console.log(this.name, a, b);
}

const obj = { name: "test" };
const bar = foo.bind(obj, 1);

bar(2);       // ?
bar(3, 4);    // ?
bar.call({name: "other"}, 5); // ?
```

**Answer:**
```
"test" 1 2     // bind pre-fills a=1, bar(2) fills b=2
"test" 1 3     // bind pre-fills a=1, bar(3,4) fills b=3 (4 is extra)
"test" 1 5     // bind's this wins, a=1 (pre-filled), b=5
```

---

### Q19. What is the output?
**Level: Advanced**

```javascript
const obj1 = { val: 1 };
const obj2 = { val: 2 };

function show() {
  console.log(this.val);
}

show.call(obj1);             // ?
show.apply(obj2);            // ?
const b = show.bind(obj1);
b.call(obj2);                // ?
b.apply(obj2);               // ?
```

**Answer:**
```
1   // call with obj1
2   // apply with obj2
1   // bind(obj1) is permanent — call(obj2) ignored
1   // bind(obj1) is permanent — apply(obj2) ignored
```

---

### Q20. What is the output?
**Level: Advanced**

```javascript
function Person(name) {
  this.name = name;
}

const BoundPerson = Person.bind({ name: "Bound" });

const p1 = new BoundPerson("Alice");
const p2 = BoundPerson.call({}, "Bob");

console.log(p1.name);  // ?
console.log(p2);       // ?
```

**Answer:**
```
"Alice"     // new overrides bound this, Person("Alice") sets this.name = "Alice"
undefined   // BoundPerson.call({}) — call is ignored, bound this is { name: "Bound" }
            // but Person("Bob") sets this.name = "Bob" on the bound context
            // Hmm: actually p2 = "Bob" set on { name: "Bound" } → { name: "Bob" }
            // BoundPerson.call({}, "Bob") → this = { name: "Bound" }, name = "Bob"
            // returns undefined (no return value in Person)
```
> `p2` is `undefined` because `Person` doesn't return anything, and we're not using `new`.

---

## 📋 Quick Reference

### Method Comparison Table

| Aspect            | `call()`                    | `apply()`                  | `bind()`                        |
|-------------------|-----------------------------|----------------------------|---------------------------------|
| Execution         | Immediate                   | Immediate                  | Returns new function            |
| Arguments         | Individual: `(ctx, a, b)`   | Array: `(ctx, [a, b])`     | Individual + partial: `(ctx, a)` |
| Returns           | Function result             | Function result            | Bound function                  |
| Overrideable?     | Yes (by another call)       | Yes                        | No — permanently bound          |
| Works with `new`? | N/A                         | N/A                        | Yes, `new` overrides `this`     |

### Syntax at a Glance

```javascript
// call — invoke immediately, args individually
fn.call(thisArg, arg1, arg2);

// apply — invoke immediately, args as array
fn.apply(thisArg, [arg1, arg2]);

// bind — returns new function, partial application possible
const newFn = fn.bind(thisArg, arg1);
newFn(arg2); // call later
```

### Memory Aid
```
call   → Comma (args as comma-separated)
apply  → Array (args as array)
bind   → returns a Bound function (not called yet)
```

### When to Use Which?

| Use Case                                | Method    |
|-----------------------------------------|-----------|
| Immediate call with custom `this`       | `call()`  |
| Spread array into function args         | `apply()` |
| Preserve `this` for later invocation    | `bind()`  |
| Partial application                     | `bind()`  |
| Method borrowing                        | `call()`  |
| Dynamic args from array at runtime      | `apply()` |
| Event handler context preservation      | `bind()`  |

---

*💡 Modern alternative: Use spread `...` instead of `apply()` and arrow functions instead of `bind()` for most cases in ES6+.*
