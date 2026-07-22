# ⛓️ Prototype & Inheritance — Interview Q&A

> **Category:** JavaScript | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-22

---

## 🔵 Prototypes

---

### Q1. What is the prototype in JavaScript?

**Answer:**
Every JavaScript object has an internal link called `[[Prototype]]` (accessible via `__proto__`) pointing to another object — its **prototype**. This forms the **prototype chain** used for property/method lookup.

```javascript
const arr = [1, 2, 3];

// arr doesn't have 'map' directly — it's on Array.prototype
console.log(arr.hasOwnProperty('map')); // false
console.log(arr.__proto__ === Array.prototype); // true
console.log(Array.prototype.hasOwnProperty('map')); // true

// Lookup chain: arr → Array.prototype → Object.prototype → null
```

---

### Q2. What is the prototype chain?

**Answer:**
When you access a property, JS looks in:
1. The object itself
2. Its `[[Prototype]]`
3. That prototype's `[[Prototype]]`
4. Continues until `null`

```javascript
function Animal(name) {
  this.name = name; // Own property
}
Animal.prototype.speak = function() {
  return `${this.name} makes a sound`;
};

const dog = new Animal('Rex');

// Lookup:
dog.name;         // Found on dog itself
dog.speak();      // Not on dog → found on Animal.prototype
dog.toString();   // Not on dog → not on Animal.prototype → found on Object.prototype
dog.xyz;          // Not found anywhere → undefined

// Chain: dog → Animal.prototype → Object.prototype → null
console.log(dog.__proto__ === Animal.prototype); // true
console.log(Animal.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__); // null — end of chain
```

---

### Q3. What is the difference between `prototype` and `__proto__`?

**Answer:**

| | `prototype` | `__proto__` |
|--|-------------|-------------|
| On | **Functions** (constructors) | **Objects** (instances) |
| Purpose | The object that will be assigned as `[[Prototype]]` of instances | The actual `[[Prototype]]` link of this object |
| Standard | Yes | Legacy (use `Object.getPrototypeOf()` instead) |

```javascript
function Person(name) {
  this.name = name;
}

// prototype — on the constructor function
Person.prototype.greet = function() { return `Hi, I'm ${this.name}`; };

const alice = new Person('Alice');

// __proto__ — on the instance
console.log(alice.__proto__ === Person.prototype); // true ✅

// Standard way:
Object.getPrototypeOf(alice) === Person.prototype; // true ✅
```

---

### Q4. How does the `new` keyword work?

**Answer:**
`new` does 4 things:

```javascript
function Person(name) {
  this.name = name;
}

const p = new Person('Alice');

// What new does internally:
// 1. Creates a new empty object: {}
// 2. Sets __proto__ to Constructor.prototype: {}.__proto__ = Person.prototype
// 3. Calls the constructor with this = new object: Person.call({}, 'Alice')
// 4. Returns the new object (unless constructor explicitly returns an object)

// Manual implementation of new:
function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype); // Steps 1 + 2
  const result = Constructor.apply(obj, args);       // Step 3
  return result instanceof Object ? result : obj;    // Step 4
}

const p2 = myNew(Person, 'Bob');
console.log(p2.name);    // 'Bob'
console.log(p2 instanceof Person); // true
```

---

## 🟡 Inheritance

---

### Q5. How do you implement inheritance in JavaScript (ES5 vs ES6)?

**Answer:**

**ES5 — Prototype-based:**
```javascript
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  return `${this.name} makes a sound`;
};

function Dog(name, breed) {
  Animal.call(this, name); // Call parent constructor
  this.breed = breed;
}

// Set up prototype chain
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog; // Fix constructor reference

Dog.prototype.bark = function() {
  return `${this.name} barks!`;
};

const rex = new Dog('Rex', 'Labrador');
rex.speak(); // "Rex makes a sound" — inherited from Animal
rex.bark();  // "Rex barks!" — own method
rex instanceof Dog;    // true
rex instanceof Animal; // true
```

**ES6 — Class syntax (syntactic sugar):**
```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Must call super first!
    this.breed = breed;
  }
  bark() {
    return `${this.name} barks!`;
  }
  speak() {
    return super.speak() + ' (woof)'; // Call parent method
  }
}

const rex = new Dog('Rex', 'Labrador');
console.log(rex.speak()); // "Rex makes a sound (woof)"
console.log(rex instanceof Dog);    // true
console.log(rex instanceof Animal); // true
```

---

### Q6. What is `Object.create()`?

**Answer:**
Creates a new object with a **specified prototype**, without using `new` or a constructor function.

```javascript
const animal = {
  speak() { return `${this.name} speaks`; }
};

// Create object with animal as prototype
const dog = Object.create(animal);
dog.name = 'Rex';
dog.speak(); // "Rex speaks" — found on prototype (animal)

console.log(Object.getPrototypeOf(dog) === animal); // true

// Create object with NO prototype (null)
const pureObj = Object.create(null);
pureObj.toString; // undefined — no Object.prototype methods!

// Inheritance without classes:
const DogProto = Object.create(animal);
DogProto.bark = function() { return `${this.name} barks!`; };

const myDog = Object.create(DogProto);
myDog.name = 'Buddy';
myDog.speak(); // "Buddy speaks" — through prototype chain
myDog.bark();  // "Buddy barks!"
```

---

### Q7. What is `hasOwnProperty()` and why is it important?

**Answer:**
`hasOwnProperty()` returns `true` if the property exists **directly on the object** (not inherited).

```javascript
function Person(name) {
  this.name = name; // Own property
}
Person.prototype.greet = function() {}; // Inherited

const alice = new Person('Alice');

alice.hasOwnProperty('name');   // true  — own property
alice.hasOwnProperty('greet');  // false — inherited!

// Important for safe property iteration:
for (const key in alice) {
  // for...in loops over own AND inherited properties!
  if (alice.hasOwnProperty(key)) {
    console.log(key, alice[key]); // Only own: 'name Alice'
  }
}

// Better: use Object.keys() — only own enumerable properties
Object.keys(alice); // ['name'] — no inherited properties
```

---

### Q8. What is the difference between `for...in` and `for...of`?

**Answer:**

| | `for...in` | `for...of` |
|--|-----------|-----------|
| Iterates over | **Keys** (including inherited!) | **Values** of iterables |
| Works on | Objects, arrays | Arrays, strings, Map, Set, iterables |
| Inherited props | ✅ Yes | ❌ Not applicable |

```javascript
const obj = { a: 1, b: 2 };
const arr = [10, 20, 30];

// for...in — keys
for (const key in obj) console.log(key); // 'a', 'b'
for (const i in arr) console.log(i);     // '0', '1', '2' (string indices!)

// for...of — values
for (const val of arr) console.log(val); // 10, 20, 30
for (const char of 'hello') console.log(char); // h e l l o

// for...of on object — Error! Objects aren't iterable by default
for (const val of obj) {} // TypeError
// Fix:
for (const val of Object.values(obj)) console.log(val); // 1 2
```

---

## 🔴 Advanced

---

### Q9. What is prototypal vs classical inheritance?

**Answer:**

| | Classical (Java/C++) | Prototypal (JavaScript) |
|--|---------------------|------------------------|
| Template | Classes (blueprints) | Objects (instances) |
| Inheritance | Class → Class | Object → Object (via prototype) |
| Instances | Created from classes | Created from objects |
| Flexibility | Rigid hierarchy | Dynamic — can extend at runtime |

```javascript
// JS is prototypal — classes are just syntactic sugar
class Dog extends Animal {} // Still prototype chain under the hood!

// Runtime prototype modification (powerful, but risky):
Dog.prototype.fetch = function() { return 'fetching!'; };
const anyDog = new Dog('Buddy');
anyDog.fetch(); // 'fetching!' — all instances get the new method!
```

---

### Q10. What does `instanceof` check?

**Answer:**
`instanceof` checks if a constructor's `prototype` appears **anywhere in the object's prototype chain**.

```javascript
function Animal() {}
function Dog() {}
Dog.prototype = Object.create(Animal.prototype);

const d = new Dog();

d instanceof Dog;    // true — Dog.prototype in chain
d instanceof Animal; // true — Animal.prototype in chain
d instanceof Object; // true — Object.prototype in chain

// Custom instanceof (Symbol.hasInstance)
class MyArray {
  static [Symbol.hasInstance](instance) {
    return Array.isArray(instance);
  }
}
[] instanceof MyArray; // true!
```

---

### Q11. What is method overriding?

**Answer:**
```javascript
class Shape {
  area() { return 0; }
  toString() { return `Shape with area ${this.area()}`; }
}

class Circle extends Shape {
  constructor(r) {
    super();
    this.r = r;
  }
  area() {              // Override parent's area()
    return Math.PI * this.r ** 2;
  }
}

class Square extends Shape {
  constructor(s) {
    super();
    this.s = s;
  }
  area() {              // Override parent's area()
    return this.s ** 2;
  }
}

const c = new Circle(5);
const s = new Square(4);

console.log(c.toString()); // Uses overridden area() — "Shape with area 78.53..."
console.log(s.toString()); // Uses overridden area() — "Shape with area 16"
```

---

## 📝 Quick Reference

```javascript
// Prototype chain
obj → Constructor.prototype → Object.prototype → null

// Key APIs
Object.create(proto)            // Create obj with specified prototype
Object.getPrototypeOf(obj)      // Get prototype (instead of __proto__)
Object.setPrototypeOf(obj, proto) // Set prototype (avoid — slow)
obj.hasOwnProperty(key)         // Own property check

// Constructor functions
function Fn() { this.x = 1; }  // Own properties in constructor
Fn.prototype.method = function() {} // Shared methods on prototype

// ES6 Classes
class Child extends Parent {
  constructor() { super(); }  // super() required before this
  method() { super.method(); } // Call parent method
}

// instanceof checks
obj instanceof Constructor // Is Constructor.prototype in obj's chain?
```

---

*Senior UI Developer Interview Prep — Prototype & Inheritance*
