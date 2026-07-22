# ✨ ES6+ Features — Interview Q&A

> **Category:** JavaScript | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-22

---

## 🔵 ES6 (ES2015)

---

### Q1. What are template literals and what are their benefits over string concatenation?

**Answer:**
Template literals use backticks (`` ` ``) and support multi-line strings, embedded expressions, and tagged templates.

```javascript
const name = 'Alice';
const age  = 30;

// Old way
const msg1 = 'Hello ' + name + ', you are ' + age + ' years old.';

// Template literal
const msg2 = `Hello ${name}, you are ${age} years old.`;

// Multi-line
const html = `
  <div class="card">
    <h2>${name}</h2>
    <p>Age: ${age}</p>
  </div>
`;

// Expressions inside ${}
const price = `Total: $${(9.99 * 1.1).toFixed(2)}`;

// Tagged templates (advanced)
function highlight(strings, ...values) {
  return strings.reduce((acc, str, i) =>
    acc + str + (values[i] ? `<strong>${values[i]}</strong>` : ''), '');
}
const result = highlight`Hello ${name}, age ${age}`;
// "Hello <strong>Alice</strong>, age <strong>30</strong>"
```

---

### Q2. Explain destructuring with examples — arrays and objects.

**Answer:**

**Array destructuring:**
```javascript
const [a, b, c] = [1, 2, 3];
console.log(a, b, c); // 1 2 3

// Skip values
const [first, , third] = [10, 20, 30];
console.log(first, third); // 10 30

// Default values
const [x = 0, y = 0] = [5];
console.log(x, y); // 5 0

// Swap variables (elegant!)
let p = 1, q = 2;
[p, q] = [q, p];
console.log(p, q); // 2 1

// Rest
const [head, ...tail] = [1, 2, 3, 4];
console.log(head, tail); // 1  [2, 3, 4]
```

**Object destructuring:**
```javascript
const user = { name: 'Alice', age: 30, city: 'Delhi' };

const { name, age } = user;
console.log(name, age); // Alice 30

// Rename
const { name: userName, age: userAge } = user;
console.log(userName); // Alice

// Default values
const { country = 'India' } = user;
console.log(country); // India

// Nested
const { address: { street } } = { address: { street: 'MG Road' } };
console.log(street); // MG Road

// Rest
const { name: n, ...rest } = user;
console.log(rest); // { age: 30, city: 'Delhi' }

// In function parameters
function greet({ name, age = 0 }) {
  console.log(`${name} is ${age}`);
}
greet(user);
```

---

### Q3. What is the spread operator `...` vs rest parameter `...`?

**Answer:**

**Spread** — expands an iterable **into individual elements**:
```javascript
// Arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const merged = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]
const copy   = [...arr1];          // Shallow copy

// Objects (ES2018)
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 };   // { a: 1, b: 2, c: 3 }

// Function calls
Math.max(...arr1); // 3 — same as Math.max(1, 2, 3)
```

**Rest** — collects multiple arguments **into an array**:
```javascript
// Function parameters
function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}
sum(1, 2, 3, 4); // 10

// Destructuring
const [first, second, ...remaining] = [1, 2, 3, 4, 5];
// remaining = [3, 4, 5]

const { a, ...others } = { a: 1, b: 2, c: 3 };
// others = { b: 2, c: 3 }
```

> **Key difference:** Rest is in **function definitions** / **destructuring** (collects). Spread is in **function calls** / **literals** (expands).

---

### Q4. What are arrow functions and how do they differ from regular functions?

**Answer:**

```javascript
// Regular function
function add(a, b) { return a + b; }

// Arrow function
const add = (a, b) => a + b;        // Implicit return
const square = x => x * x;          // Single param — no parens needed
const greet = () => 'Hello!';        // No params — empty parens
const getObj = () => ({ name: 'A'}); // Returning object — wrap in ()
```

**Key differences:**

| | Regular Function | Arrow Function |
|--|-----------------|----------------|
| `this` binding | Has own `this` (dynamic) | Inherits `this` from enclosing scope (lexical) |
| `arguments` object | ✅ Has `arguments` | ❌ No `arguments` (use rest `...args`) |
| `new` keyword | ✅ Can be constructor | ❌ Cannot be used with `new` |
| `prototype` | Has `prototype` | No `prototype` |
| Hoisting | ✅ Hoisted (function declarations) | ❌ Not hoisted (const/let) |

```javascript
// this — key difference
const timer = {
  count: 0,
  start() {
    // Regular: this inside setTimeout is window/undefined
    setTimeout(function() {
      this.count++; // ❌ 'this' is NOT timer
    }, 1000);

    // Arrow: this is inherited from start() = timer
    setTimeout(() => {
      this.count++; // ✅ 'this' IS timer
    }, 1000);
  }
};
```

---

### Q5. What are default parameters?

**Answer:**
```javascript
// Old way
function greet(name) {
  name = name || 'World';
  return `Hello, ${name}!`;
}

// ES6 default parameters
function greet(name = 'World') {
  return `Hello, ${name}!`;
}

greet();         // "Hello, World!"
greet('Alice');  // "Hello, Alice!"
greet(undefined);// "Hello, World!" — undefined triggers default
greet(null);     // "Hello, null!"  — null does NOT trigger default

// Can reference previous parameters
function createEl(tag, text = '', cls = `${tag}-class`) {
  return `<${tag} class="${cls}">${text}</${tag}>`;
}
```

---

### Q6. What are ES6 Classes?

**Answer:**
Classes are syntactic sugar over prototype-based inheritance.

```javascript
class Animal {
  #sound; // Private field (ES2022)

  constructor(name, sound) {
    this.name = name;
    this.#sound = sound;
  }

  speak() {           // Instance method
    return `${this.name} says ${this.#sound}`;
  }

  static create(name, sound) { // Static method
    return new Animal(name, sound);
  }

  get info() {        // Getter
    return `${this.name}`;
  }

  set info(val) {     // Setter
    this.name = val;
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name, 'Woof'); // Must call super first!
  }

  fetch() { return `${this.name} fetches!`; }

  speak() {
    return super.speak() + ' 🐶'; // Call parent method
  }
}

const dog = new Dog('Rex');
console.log(dog.speak());  // "Rex says Woof 🐶"
console.log(dog instanceof Dog);    // true
console.log(dog instanceof Animal); // true
```

---

## 🟡 ES2017–ES2019

---

### Q7. What is `Object.entries()`, `Object.keys()`, `Object.values()`?

**Answer:**
```javascript
const user = { name: 'Alice', age: 30, city: 'Delhi' };

Object.keys(user);    // ['name', 'age', 'city']
Object.values(user);  // ['Alice', 30, 'Delhi']
Object.entries(user); // [['name','Alice'], ['age',30], ['city','Delhi']]

// Practical: transform object
const doubled = Object.fromEntries(
  Object.entries({ a: 1, b: 2, c: 3 }).map(([k, v]) => [k, v * 2])
);
// { a: 2, b: 4, c: 6 }

// Iterate
for (const [key, value] of Object.entries(user)) {
  console.log(`${key}: ${value}`);
}
```

---

### Q8. What is optional chaining `?.` and nullish coalescing `??`?

**Answer:**
```javascript
// Optional chaining (ES2020)
const user = { profile: { name: 'Alice' } };

user?.profile?.name       // 'Alice'
user?.address?.city       // undefined (no error!)
user?.getName?.()         // undefined (no error if method missing)
user?.hobbies?.[0]        // undefined

// Nullish coalescing (ES2020)
const val = null ?? 'default'; // 'default'
const val2 = 0 ?? 'default';   // 0  (0 is not null/undefined)
const val3 = '' ?? 'default';  // '' ('' is not null/undefined)

// Combine — perfect for config defaults
const config = {
  timeout: 0,
  name: ''
};
const timeout = config?.timeout ?? 30000; // 0 — not 30000!
const name    = config?.name    ?? 'App'; // '' — not 'App'!
```

---

## 🔴 ES2020–ES2024

---

### Q9. What is `Promise.allSettled()` vs `Promise.all()`?

**Answer:**
```javascript
const p1 = Promise.resolve(1);
const p2 = Promise.reject('Error');
const p3 = Promise.resolve(3);

// Promise.all — rejects on FIRST failure
Promise.all([p1, p2, p3])
  .catch(err => console.log(err)); // "Error" — p3 ignored!

// Promise.allSettled — waits for ALL, never rejects
Promise.allSettled([p1, p2, p3]).then(results => {
  results.forEach(r => console.log(r));
});
// { status: 'fulfilled', value: 1 }
// { status: 'rejected',  reason: 'Error' }
// { status: 'fulfilled', value: 3 }
```

---

### Q10. What is `structuredClone()`?

**Answer:**
```javascript
// ES2022 — deep clone built into the browser/Node.js
const original = {
  name: 'Alice',
  address: { city: 'Delhi' },
  dates: [new Date()],
  map: new Map([['key', 'val']])
};

const clone = structuredClone(original);
clone.address.city = 'Mumbai';

console.log(original.address.city); // 'Delhi' — untouched!

// Handles: objects, arrays, Date, Map, Set, ArrayBuffer, RegExp
// Does NOT handle: functions, DOM nodes, class instances (loses methods)
```

---

### Q11. What are `Symbol`s used for?

**Answer:**
```javascript
// Every Symbol is unique
const id1 = Symbol('id');
const id2 = Symbol('id');
console.log(id1 === id2); // false

// Use as unique object keys — won't clash with other keys
const ID = Symbol('id');
const user = {
  [ID]: 123,        // Symbol key — hidden from normal enumeration
  name: 'Alice'
};

console.log(user[ID]);         // 123
console.log(Object.keys(user)); // ['name'] — Symbol not included!
console.log(JSON.stringify(user)); // '{"name":"Alice"}' — Symbol omitted

// Well-known symbols — customize built-in behavior
class Collection {
  [Symbol.iterator]() {
    let i = 0;
    const data = [1, 2, 3];
    return { next: () => ({ value: data[i++], done: i > data.length }) };
  }
}
for (const val of new Collection()) console.log(val); // 1, 2, 3
```

---

### Q12. What are `WeakMap` and `WeakSet`?

**Answer:**

| | `Map` / `Set` | `WeakMap` / `WeakSet` |
|--|--------------|----------------------|
| Key types | Any | **Objects only** |
| Prevents GC | Yes (strong refs) | No — **weak refs** (GC can collect) |
| Iterable | ✅ Yes | ❌ No |
| `.size` | ✅ Yes | ❌ No |

```javascript
// WeakMap — private data pattern
const _privateData = new WeakMap();

class User {
  constructor(name, password) {
    this.name = name;
    _privateData.set(this, { password }); // Hidden!
  }
  checkPassword(pwd) {
    return _privateData.get(this).password === pwd;
  }
}

const user = new User('Alice', 'secret123');
console.log(user.password);          // undefined — private!
console.log(user.checkPassword('secret123')); // true

// When `user` is GC'd, WeakMap entry is automatically cleaned up!
```

---

## 📝 Quick Reference — ES6+ Cheat Sheet

```javascript
// Template literals
`Hello ${name}!`

// Destructuring
const { a, b = 0 } = obj;
const [x, ...rest] = arr;

// Arrow functions
const fn = (a, b) => a + b;
const fn = x => ({ key: x }); // Return object

// Default params
function fn(x = 0, y = 'default') {}

// Spread / Rest
const merged = [...arr1, ...arr2];
function sum(...args) { }

// Classes
class Child extends Parent { constructor() { super(); } }

// Optional chaining + nullish coalescing
value?.prop?.method?.() ?? 'default'

// Object methods
Object.keys(obj)  / Object.values(obj) / Object.entries(obj)
Object.fromEntries(entries)
Object.assign({}, obj1, obj2)

// Promise combinators
Promise.all([])          // Fails fast
Promise.allSettled([])   // Waits for all
Promise.race([])         // First to resolve/reject
Promise.any([])          // First to RESOLVE (ignores rejections)

// Deep clone
structuredClone(obj)
```

---

*Senior UI Developer Interview Prep — ES6+ Features*
