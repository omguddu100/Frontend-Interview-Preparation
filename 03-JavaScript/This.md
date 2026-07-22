# `this` Keyword — Interview Q&A
> Category: JavaScript | Level: Basic → Advanced | Last Updated: 2026-07-22

---

## Table of Contents
1. [What is `this`?](#what-is-this)
2. [Rule 1: Default Binding](#rule-1-default-binding)
3. [Rule 2: Implicit Binding](#rule-2-implicit-binding)
4. [Rule 3: Explicit Binding](#rule-3-explicit-binding)
5. [Rule 4: new Binding](#rule-4-new-binding)
6. [Arrow Functions & `this`](#arrow-functions--this)
7. [`this` in Class Methods](#this-in-class-methods)
8. [`this` in Event Handlers](#this-in-event-handlers)
9. [Strict Mode & `this`](#strict-mode--this)
10. [Common Bugs & Fixes](#common-bugs--fixes)
11. [Output-Based Questions](#output-based-questions)
12. [Quick Reference](#quick-reference)

---

## 🟢 What is `this`?

### Q1. What is `this` in JavaScript? How is it determined?
**Level: Basic**

**Answer:**
`this` is a special keyword in JavaScript that refers to the **execution context** — the object that is currently executing the function. Unlike most languages, `this` in JavaScript is **not** determined at definition time; it is determined **at call time** (dynamically), except for arrow functions.

The value of `this` depends on **how** a function is called, not **where** it is defined.

```javascript
function greet() {
  console.log(this); // depends on how greet() is called
}

const obj = { name: "Alice", greet };

greet();        // this → global object (or undefined in strict mode)
obj.greet();    // this → obj
```

### Q2. How many rules determine the value of `this`?
**Level: Basic**

**Answer:**
There are **4 primary rules** (in order of precedence):

| Priority | Rule             | How it's called                        |
|----------|------------------|----------------------------------------|
| 4 (lowest) | Default Binding  | `fn()`                                 |
| 3        | Implicit Binding | `obj.fn()`                             |
| 2        | Explicit Binding | `fn.call(ctx)`, `fn.apply(ctx)`, `fn.bind(ctx)` |
| 1 (highest) | new Binding   | `new Fn()`                             |

> Arrow functions are a special case — they **lexically** capture `this` from their enclosing scope and **none of the above rules apply** to them.

---

## 🟢 Rule 1: Default Binding

### Q3. What is Default Binding?
**Level: Basic**

**Answer:**
Default binding applies when a function is called **as a standalone function** — not as a method, not with `call/apply/bind`, and not with `new`.

- In **non-strict mode**: `this` → **global object** (`window` in browsers, `global` in Node.js)
- In **strict mode**: `this` → `undefined`

```javascript
function showThis() {
  console.log(this);
}

showThis(); // non-strict: Window { ... }
            // strict:     undefined
```

```javascript
"use strict";
function strictFn() {
  console.log(this); // undefined
}
strictFn();
```

### Q4. What happens with `this` inside a nested function?
**Level: Intermediate**

**Answer:**
A nested (inner) function called without an explicit receiver also uses **default binding**, which surprises many developers.

```javascript
const user = {
  name: "Bob",
  greet() {
    console.log(this.name); // "Bob" — implicit binding

    function inner() {
      console.log(this.name); // undefined (default binding, this = window/undefined)
    }
    inner();
  }
};

user.greet();
```

**Fix 1: Save reference**
```javascript
greet() {
  const self = this;
  function inner() {
    console.log(self.name); // "Bob" ✅
  }
  inner();
}
```

**Fix 2: Arrow function (recommended)**
```javascript
greet() {
  const inner = () => {
    console.log(this.name); // "Bob" ✅ (lexical this)
  };
  inner();
}
```

---

## 🟡 Rule 2: Implicit Binding

### Q5. What is Implicit Binding?
**Level: Basic**

**Answer:**
Implicit binding occurs when a function is called **as a method of an object**. The object to the **left of the dot** becomes `this`.

```javascript
const person = {
  name: "Charlie",
  sayHi() {
    console.log(`Hi, I'm ${this.name}`);
  }
};

person.sayHi(); // Hi, I'm Charlie  →  this = person
```

### Q6. What is "Implicit Binding Loss"?
**Level: Intermediate**

**Answer:**
Implicit binding is lost when a method is **detached** from its object — assigned to a variable or passed as a callback.

```javascript
const person = {
  name: "Dave",
  greet() {
    console.log(this.name);
  }
};

// Case 1: Assignment loses binding
const greetFn = person.greet;
greetFn(); // undefined (or global name) — default binding applies

// Case 2: Callback loses binding
setTimeout(person.greet, 1000); // undefined — default binding

// Fix: Use bind to preserve context
const greetBound = person.greet.bind(person);
greetBound(); // "Dave" ✅
```

### Q7. What happens with chained object references?
**Level: Intermediate**

**Answer:**
Only the **immediately preceding object** (closest to the dot) matters.

```javascript
const a = {
  name: "a",
  b: {
    name: "b",
    greet() {
      console.log(this.name);
    }
  }
};

a.b.greet(); // "b" — this refers to a.b, not a
```

---

## 🟡 Rule 3: Explicit Binding

### Q8. What is Explicit Binding?
**Level: Basic**

**Answer:**
Explicit binding lets you **manually set** the value of `this` using:
- `call(thisArg, arg1, arg2, ...)` — invokes immediately, args passed individually
- `apply(thisArg, [arg1, arg2, ...])` — invokes immediately, args passed as array
- `bind(thisArg, arg1, ...)` — returns a **new function** with `this` permanently bound

```javascript
function introduce(city, country) {
  console.log(`I'm ${this.name} from ${city}, ${country}`);
}

const user = { name: "Eve" };

introduce.call(user, "Mumbai", "India");         // I'm Eve from Mumbai, India
introduce.apply(user, ["Mumbai", "India"]);      // I'm Eve from Mumbai, India
const boundFn = introduce.bind(user, "Mumbai");
boundFn("India");                                // I'm Eve from Mumbai, India
```

### Q9. Can you override explicit binding with another call/apply/bind?
**Level: Advanced**

**Answer:**
- `call` and `apply` can be overridden by calling them again with a different context.
- `bind` creates a **hard-bound** function — calling `.call` or `.apply` on a bound function does **not** change `this`.

```javascript
function greet() {
  console.log(this.name);
}

const obj1 = { name: "First" };
const obj2 = { name: "Second" };

const bound = greet.bind(obj1);
bound.call(obj2); // "First" — bind wins, call is ignored
```

---

## 🟡 Rule 4: new Binding

### Q10. What is new Binding?
**Level: Basic**

**Answer:**
When a function is called with `new`, JavaScript:
1. Creates a **new empty object** `{}`
2. Sets `this` to that new object
3. Links the object to the function's `prototype`
4. Returns `this` (unless the function explicitly returns another object)

```javascript
function Person(name, age) {
  this.name = name; // this = new empty object
  this.age = age;
}

const p = new Person("Frank", 30);
console.log(p.name); // "Frank"
console.log(p.age);  // 30
```

### Q11. What happens if a constructor explicitly returns an object?
**Level: Advanced**

**Answer:**
If the constructor returns a **plain object**, `new` will return that object instead of `this`. If it returns a **primitive** (or nothing), `this` is returned normally.

```javascript
function A() {
  this.x = 1;
  return { x: 99 }; // returns object → overrides this
}

function B() {
  this.x = 1;
  return 42; // returns primitive → this is returned
}

console.log(new A()); // { x: 99 }
console.log(new B()); // B { x: 1 }
```

---

## 🟡 Arrow Functions & `this`

### Q12. How does `this` work in arrow functions?
**Level: Intermediate**

**Answer:**
Arrow functions do **not** have their own `this`. They **lexically inherit** `this` from the surrounding scope at the time they are **defined**.

```javascript
const obj = {
  name: "Grace",
  regularFn: function () {
    console.log(this.name); // "Grace" — implicit binding
  },
  arrowFn: () => {
    console.log(this.name); // undefined — this from outer (global) scope
  }
};

obj.regularFn(); // "Grace"
obj.arrowFn();   // undefined (this = window/global)
```

### Q13. When is an arrow function ideal for `this`?
**Level: Intermediate**

**Answer:**
Arrow functions are ideal when you want to **preserve `this` from an outer method** — especially in callbacks and timers.

```javascript
class Timer {
  constructor() {
    this.seconds = 0;
  }

  start() {
    // Arrow function captures this from start() method
    setInterval(() => {
      this.seconds++;
      console.log(this.seconds); // correctly refers to Timer instance
    }, 1000);
  }
}

const t = new Timer();
t.start(); // 1, 2, 3, ...
```

### Q14. Can you use call/apply/bind to change `this` in arrow functions?
**Level: Advanced**

**Answer:**
**No.** Arrow functions have a **fixed** `this` from their lexical scope. `call`, `apply`, and `bind` are silently ignored for `this` (though args still work).

```javascript
const arrow = () => console.log(this);

const obj = { x: 10 };

arrow.call(obj);  // still prints global/undefined — obj is ignored
arrow.apply(obj); // same
arrow.bind(obj)(); // same
```

---

## 🟡 `this` in Class Methods

### Q15. How does `this` work in ES6 Classes?
**Level: Intermediate**

**Answer:**
Inside class methods, `this` refers to the **instance** of the class (when called as a method). Classes always run in **strict mode**, so losing binding results in `undefined`.

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a sound.`);
  }
}

const dog = new Animal("Dog");
dog.speak(); // "Dog makes a sound."

// Binding loss in classes
const speakFn = dog.speak;
speakFn(); // TypeError: Cannot read properties of undefined (strict mode)
```

### Q16. How do you fix `this` binding in class event handlers?
**Level: Intermediate**

**Answer:**

**Option 1: Bind in constructor**
```javascript
class Button {
  constructor() {
    this.count = 0;
    this.handleClick = this.handleClick.bind(this); // ✅
  }

  handleClick() {
    this.count++;
    console.log(this.count);
  }
}
```

**Option 2: Class field arrow function**
```javascript
class Button {
  count = 0;

  handleClick = () => { // ✅ arrow function as class field
    this.count++;
    console.log(this.count);
  };
}
```

**Option 3: Arrow wrapper in JSX/event**
```javascript
// In JSX: onClick={() => this.handleClick()}
```

---

## 🟡 `this` in Event Handlers

### Q17. What is `this` inside a DOM event handler?
**Level: Intermediate**

**Answer:**
In a **regular function** event handler, `this` refers to the **DOM element** that triggered the event (same as `event.currentTarget`).

In an **arrow function** event handler, `this` is from the **outer (lexical) scope**, NOT the element.

```javascript
const btn = document.querySelector("#myBtn");

// Regular function — this = the button element
btn.addEventListener("click", function () {
  console.log(this); // <button id="myBtn">
  this.style.color = "red"; // works ✅
});

// Arrow function — this = outer scope (window or class instance)
btn.addEventListener("click", () => {
  console.log(this); // window (in browser, non-strict)
  // this.style.color = "red"; // ❌ won't work
});
```

### Q18. How do you use `this` in a class-based event handler correctly?
**Level: Advanced**

```javascript
class App {
  constructor() {
    this.name = "MyApp";
    const btn = document.querySelector("#btn");
    // Option A: bind
    btn.addEventListener("click", this.handleClick.bind(this));
    // Option B: arrow
    btn.addEventListener("click", () => this.handleClick());
  }

  handleClick() {
    console.log(`Clicked from ${this.name}`); // "Clicked from MyApp"
  }
}
```

---

## 🔴 Strict Mode & `this`

### Q19. How does strict mode affect `this`?
**Level: Intermediate**

**Answer:**

| Context                   | Non-strict `this`     | Strict `this`   |
|---------------------------|-----------------------|-----------------|
| Global function call      | `window` / `global`   | `undefined`     |
| Method call               | Calling object        | Calling object  |
| Arrow function            | Lexical scope         | Lexical scope   |
| `call/apply` with `null`  | `window` / `global`   | `null`          |
| `call/apply` with value   | That value            | That value      |

```javascript
function nonStrict() {
  console.log(this); // window
}

function strict() {
  "use strict";
  console.log(this); // undefined
}

nonStrict();
strict();

// With call/apply
nonStrict.call(null); // window
strict.call(null);    // null
```

---

## 🔴 Common Bugs & Fixes

### Q20. What are the most common `this` bugs?
**Level: Intermediate**

**Bug 1: Method used as callback (binding loss)**
```javascript
const counter = {
  count: 0,
  increment() { this.count++; }
};

setInterval(counter.increment, 1000); // ❌ this = window

// Fix:
setInterval(counter.increment.bind(counter), 1000); // ✅
// or:
setInterval(() => counter.increment(), 1000); // ✅
```

**Bug 2: Destructured method loses `this`**
```javascript
const { greet } = person;
greet(); // ❌ this = undefined/window

// Fix:
const greet = person.greet.bind(person); // ✅
```

**Bug 3: Arrow function as object method**
```javascript
const obj = {
  val: 42,
  getVal: () => this.val // ❌ this = window, not obj
};
console.log(obj.getVal()); // undefined

// Fix: Use regular function
const obj2 = {
  val: 42,
  getVal() { return this.val; } // ✅
};
```

**Bug 4: `this` in setTimeout**
```javascript
class Foo {
  bar() {
    setTimeout(function () {
      console.log(this.name); // ❌ undefined
    }, 100);
  }
}

// Fix: arrow function
class Foo2 {
  bar() {
    setTimeout(() => {
      console.log(this.name); // ✅
    }, 100);
  }
}
```

---

## 🔴 Output-Based Questions

### Q21. What is the output?
**Level: Intermediate**

```javascript
const obj = {
  name: "Obj",
  greet: function () {
    console.log(this.name);
  }
};

const greet = obj.greet;
greet(); // ?
obj.greet(); // ?
```

**Answer:**
```
undefined   // (or global name) — default binding
"Obj"       // implicit binding
```

---

### Q22. What is the output?
**Level: Advanced**

```javascript
function Foo() {
  this.name = "Foo";
  this.bar = function () {
    console.log(this.name);
    const baz = function () {
      console.log(this.name);
    };
    baz();
  };
}

const f = new Foo();
f.bar();
```

**Answer:**
```
"Foo"       // f.bar() — this = f (new binding)
undefined   // baz() — default binding, this = window (or undefined in strict)
```

---

### Q23. What is the output?
**Level: Advanced**

```javascript
const obj1 = { name: "obj1" };
const obj2 = { name: "obj2" };

function greet() {
  console.log(this.name);
}

const bound = greet.bind(obj1);
bound.call(obj2);
bound.apply(obj2);
```

**Answer:**
```
"obj1"   // bind wins over call
"obj1"   // bind wins over apply
```

---

### Q24. What is the output?
**Level: Advanced**

```javascript
class C {
  constructor() {
    this.x = 10;
  }

  getX = () => this.x;

  getXRegular() {
    return this.x;
  }
}

const c = new C();
const { getX, getXRegular } = c;

console.log(getX());        // ?
console.log(getXRegular()); // ?
```

**Answer:**
```
10          // arrow class field: this is lexically bound to instance
TypeError   // strict mode: this = undefined, cannot read .x
```

---

### Q25. What is the output?
**Level: Advanced**

```javascript
var name = "Global";

const obj = {
  name: "Local",
  getName: function () {
    return () => this.name;
  }
};

const fn = obj.getName();
console.log(fn()); // ?

const getName = obj.getName;
const fn2 = getName();
console.log(fn2()); // ?
```

**Answer:**
```
"Local"    // Arrow captures this from getName() call where this = obj
"Global"   // getName() called without context, this = window, arrow captures window
```

---

## 📋 Quick Reference

### `this` Binding Rules — Cheat Sheet

```
┌─────────────────────────────────────────────────────────────────┐
│                    THIS DETERMINATION RULES                     │
├─────────────────┬───────────────────────────────────────────────┤
│ Rule            │ How function is called                        │
├─────────────────┼───────────────────────────────────────────────┤
│ Default         │ fn()                   → window / undefined   │
│ Implicit        │ obj.fn()               → obj                  │
│ Explicit        │ fn.call/apply/bind(x)  → x                    │
│ new             │ new fn()               → new object           │
│ Arrow           │ () => {}               → lexical this         │
└─────────────────┴───────────────────────────────────────────────┘
```

### Priority Order (highest → lowest)
1. `new` binding
2. Explicit binding (`call`, `apply`, `bind`)
3. Implicit binding (method call)
4. Default binding (standalone call)

> Arrow functions are **exempt from all rules** — they always use lexical `this`.

### Common Fixes Summary

| Problem                          | Fix                                    |
|----------------------------------|----------------------------------------|
| Method used as callback          | `.bind(obj)` or `() => obj.method()`  |
| `this` in nested function        | Arrow function or `const self = this` |
| `this` in setTimeout             | Arrow function                         |
| Arrow function as object method  | Use regular function                   |
| `this` in class event handler    | Bind in constructor or class field arrow|

### One-Liner Rules
- **Arrow function** = `this` from where it was **written**
- **Regular function** = `this` from where it was **called**
- **`bind` is permanent** — `.call`/`.apply` cannot override it
- **Strict mode** turns `window` → `undefined` for default binding

---

*💡 Tip: When in doubt, `console.log(this)` at the top of any function to see what it refers to.*
