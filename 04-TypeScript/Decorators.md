# 🎨 TypeScript Decorators — Interview Q&A

> **Category:** TypeScript | **Level:** Advanced
> **Last Updated:** 2026-07-22
> **Note:** Decorators are stage 3 TC39 proposal. Enable with `"experimentalDecorators": true` in tsconfig.

---

## 🔵 Understanding Decorators

---

### Q1. What are TypeScript Decorators?

**Answer:**
Decorators are a **special kind of declaration** that can be attached to classes, methods, accessors, properties, or parameters. They are functions that run at **class declaration time** (not instantiation time) and can modify or annotate the target.

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true   // For reflect-metadata
  }
}

// Basic decorator — a function
function readonly(target: any, key: string, descriptor: PropertyDescriptor) {
  descriptor.writable = false;
  return descriptor;
}

class User {
  @readonly
  getName() { return "Alice"; }
}

const u = new User();
u.getName = () => "Bob"; // ❌ TypeError in strict mode — readonly!
```

---

### Q2. What are the different types of Decorators?

**Answer:**

| Decorator Type | Applies To | Arguments |
|---------------|-----------|-----------|
| **Class** | The class constructor | `constructor` |
| **Method** | Class method | `target, propertyKey, descriptor` |
| **Accessor** | get/set accessor | `target, propertyKey, descriptor` |
| **Property** | Class property | `target, propertyKey` |
| **Parameter** | Function parameter | `target, propertyKey, paramIndex` |

```typescript
// 1. CLASS DECORATOR
function Singleton<T extends new (...args: any[]) => {}>(constructor: T) {
  let instance: InstanceType<T>;
  return class extends constructor {
    constructor(...args: any[]) {
      if (instance) return instance;
      super(...args);
      instance = this as InstanceType<T>;
    }
  };
}

@Singleton
class DatabaseConnection {
  constructor(public url: string) {}
}

const db1 = new DatabaseConnection("postgres://...");
const db2 = new DatabaseConnection("mysql://...");
console.log(db1 === db2); // true — singleton!

// 2. METHOD DECORATOR
function log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${key} with`, args);
    const result = original.apply(this, args);
    console.log(`${key} returned`, result);
    return result;
  };
  return descriptor;
}

class Calculator {
  @log
  add(a: number, b: number) { return a + b; }
}

const calc = new Calculator();
calc.add(2, 3);
// "Calling add with [2, 3]"
// "add returned 5"

// 3. PROPERTY DECORATOR
function required(target: any, key: string) {
  let value: any;
  const getter = () => value;
  const setter = (newVal: any) => {
    if (newVal === null || newVal === undefined) {
      throw new Error(`${key} is required`);
    }
    value = newVal;
  };
  Object.defineProperty(target, key, { get: getter, set: setter });
}

class Product {
  @required
  name!: string;
}

// 4. PARAMETER DECORATOR
function validate(target: any, key: string, index: number) {
  const existingParams: number[] = Reflect.getMetadata("validate", target, key) || [];
  existingParams.push(index);
  Reflect.defineMetadata("validate", existingParams, target, key);
}

class OrderService {
  createOrder(@validate userId: string, @validate productId: string) { }
}

// 5. ACCESSOR DECORATOR
function clamp(min: number, max: number) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const set = descriptor.set!;
    descriptor.set = function(value: number) {
      set.call(this, Math.max(min, Math.min(max, value)));
    };
    return descriptor;
  };
}

class Temperature {
  private _celsius: number = 0;

  @clamp(-273.15, 1000)
  set celsius(value: number) { this._celsius = value; }
  get celsius() { return this._celsius; }
}
```

---

## 🟡 Decorator Factories

---

### Q3. What is a Decorator Factory?

**Answer:**
A decorator factory is a **function that returns a decorator**. Used when you need to pass arguments to a decorator.

```typescript
// Without factory — no arguments
@log
method() {}

// With factory — can pass arguments
function log(level: "info" | "warn" | "error" = "info") {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      console[level](`[${level.toUpperCase()}] Calling: ${key}`);
      return original.apply(this, args);
    };
    return descriptor;
  };
}

class Service {
  @log("info")
  getData() { return "data"; }

  @log("warn")
  deleteData() { return "deleted"; }
}

// Practical decorator factory — retry on failure
function retry(maxAttempts: number = 3, delayMs: number = 1000) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          return await original.apply(this, args);
        } catch (err) {
          if (attempt === maxAttempts) throw err;
          console.warn(`Attempt ${attempt} failed, retrying in ${delayMs}ms...`);
          await new Promise(r => setTimeout(r, delayMs));
        }
      }
    };
    return descriptor;
  };
}

class ApiService {
  @retry(3, 2000)
  async fetchUser(id: string) {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }
}
```

---

### Q4. What is decorator composition and execution order?

**Answer:**
When multiple decorators are applied, they compose like functions — **evaluated top-to-bottom but executed bottom-to-top**.

```typescript
function outer(target: any, key: string, descriptor: PropertyDescriptor) {
  console.log("outer: evaluated");
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    console.log("outer: called");
    return descriptor;
  };
}

function inner(target: any, key: string, descriptor: PropertyDescriptor) {
  console.log("inner: evaluated");
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    console.log("inner: called");
    return descriptor;
  };
}

class Example {
  @outer
  @inner
  method() {}
}

// Output order:
// outer: evaluated  ← top to bottom (evaluation)
// inner: evaluated
// inner: called     ← bottom to top (execution/application)
// outer: called
```

**Class decorator order (all types):**
```
For a class:
1. Parameter decorators (innermost first)
2. Method decorators
3. Accessor decorators
4. Property decorators
5. Class decorator (last)
```

---

## 🟡 Real-World Use Cases

---

### Q5. How do Angular uses decorators?

**Answer:**
Angular is built entirely on TypeScript decorators:

```typescript
import { Component, Injectable, Input, Output, EventEmitter, HostListener } from '@angular/core';

// @Component — class decorator
@Component({
  selector: 'app-user',
  template: `<h1>{{ user.name }}</h1>`,
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  // @Input — property decorator
  @Input() user!: { name: string; id: string };

  // @Output — property decorator
  @Output() selected = new EventEmitter<string>();

  // @HostListener — method decorator
  @HostListener('click')
  onClick() {
    this.selected.emit(this.user.id);
  }
}

// @Injectable — class decorator (DI metadata)
@Injectable({ providedIn: 'root' })
export class UserService {
  getUsers() { return fetch('/api/users'); }
}
```

---

### Q6. Build a `@Memoize` method decorator:

**Answer:**

```typescript
function Memoize(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const cache = new Map<string, any>();

  descriptor.value = function (...args: any[]) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log(`Cache hit for ${propertyKey}(${key})`);
      return cache.get(key);
    }

    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    return result;
  };

  return descriptor;
}

class MathService {
  @Memoize
  fibonacci(n: number): number {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }

  @Memoize
  factorial(n: number): number {
    if (n <= 1) return 1;
    return n * this.factorial(n - 1);
  }
}

const math = new MathService();
math.fibonacci(10); // Computes
math.fibonacci(10); // Cache hit!
```

---

### Q7. Build a `@Validate` class decorator with schema:

**Answer:**

```typescript
interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

type ValidationSchema<T> = { [K in keyof T]?: ValidationRule };

function Validate<T extends Record<string, any>>(schema: ValidationSchema<T>) {
  return function (constructor: new (...args: any[]) => T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);
        this.validate(schema);
      }

      private validate(schema: ValidationSchema<T>) {
        for (const [field, rules] of Object.entries(schema)) {
          const value = (this as any)[field];
          if (rules?.required && !value) {
            throw new Error(`${field} is required`);
          }
          if (rules?.minLength && value?.length < rules.minLength) {
            throw new Error(`${field} must be at least ${rules.minLength} chars`);
          }
          if (rules?.maxLength && value?.length > rules.maxLength) {
            throw new Error(`${field} must be at most ${rules.maxLength} chars`);
          }
          if (rules?.pattern && !rules.pattern.test(value)) {
            throw new Error(`${field} does not match pattern`);
          }
        }
      }
    };
  };
}

@Validate<User>({
  name:  { required: true, minLength: 2, maxLength: 50 },
  email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
})
class User {
  constructor(
    public name: string,
    public email: string
  ) {}
}

new User("Alice", "alice@example.com"); // ✅
new User("", "alice@example.com");      // ❌ Error: name is required
new User("Alice", "not-an-email");      // ❌ Error: email does not match pattern
```

---

## 🔴 Stage 3 Decorators (TC39 Proposal)

---

### Q8. What changed in the new Stage 3 TC39 Decorators vs experimental?

**Answer:**

```typescript
// NEW Stage 3 Decorators (TS 5.0+)
// tsconfig: "experimentalDecorators": false (or omit)

// Class decorator — receives class, returns new class
function logged<T extends { new(...args: any[]): {} }>(Base: T) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args);
      console.log(`New ${Base.name} created`);
    }
  };
}

// Method decorator — different signature
function bound(
  originalMethod: any,
  context: ClassMethodDecoratorContext
) {
  const methodName = context.name;
  context.addInitializer(function (this: any) {
    this[methodName] = this[methodName].bind(this);
  });
}

class EventHandler {
  @bound
  handleClick(event: Event) {
    console.log(this); // 'this' is correctly bound even as callback!
  }
}

const handler = new EventHandler();
document.addEventListener("click", handler.handleClick); // Works correctly!
// Without @bound, 'this' would be undefined
```

---

## 📝 Quick Reference

```typescript
// Enable: tsconfig.json
"experimentalDecorators": true
"emitDecoratorMetadata": true  // With reflect-metadata

// Types:
@ClassDecorator
class MyClass {}

class MyClass {
  @PropertyDecorator
  prop: string;

  @MethodDecorator
  method() {}

  @AccessorDecorator
  get value() {}

  method(@ParameterDecorator param: string) {}
}

// Decorator function signatures:
// Class:     (constructor: Function) => Function | void
// Method:    (target, key, descriptor) => PropertyDescriptor | void
// Property:  (target, key) => void
// Accessor:  (target, key, descriptor) => PropertyDescriptor | void
// Parameter: (target, key, paramIndex) => void

// Execution order: Parameters → Methods → Properties → Class
// Multiple on same target: top-down evaluation, bottom-up execution

// Common patterns:
@Singleton          // One instance
@Memoize            // Cache results
@Log                // Log calls
@Retry(3)           // Retry on failure
@Validate(schema)   // Input validation
@readonly           // Prevent modification
@Injectable         // Angular DI
@Component          // Angular components
```

---

*Senior UI Developer Interview Prep — TypeScript Decorators*
