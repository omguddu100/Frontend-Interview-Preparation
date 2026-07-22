# 🧬 TypeScript Generics — Interview Q&A

> **Category:** TypeScript | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-22

---

## 🔵 Generic Fundamentals

---

### Q1. What are Generics in TypeScript and why are they needed?

**Answer:**
Generics allow you to create **reusable components that work with multiple types** while preserving type safety. They're TypeScript's solution to the "I want to write one function that works on many types but keeps them typed" problem.

```typescript
// Without generics — uses any (loses type info)
function identity(arg: any): any {
  return arg;
}
const result = identity("hello");
result.toFixed(); // ❌ No error at compile time! Crashes at runtime

// With generics — type safe!
function identity<T>(arg: T): T {
  return arg;
}

const str = identity("hello");    // T = string, returns string
const num = identity(42);         // T = number, returns number
const arr = identity([1, 2, 3]);  // T = number[], returns number[]

str.toUpperCase(); // ✅
num.toFixed();     // ✅
arr.map(x => x);  // ✅
```

---

### Q2. How do you write generic functions?

**Answer:**

```typescript
// Basic generic function
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}
firstElement([1, 2, 3]);         // number
firstElement(["a", "b"]);        // string
firstElement<boolean>([true]);   // boolean (explicit)

// Multiple type parameters
function pair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}
const p = pair("name", 42); // [string, number]

// Generic arrow function (JSX requires comma trick)
const wrap = <T,>(val: T): { value: T } => ({ value: val });
// In .tsx files: <T extends unknown>(val: T) to disambiguate from JSX

// Generic with inference
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}
const doubled = map([1, 2, 3], x => x * 2); // number[]
const strings = map([1, 2, 3], x => `${x}`); // string[]

// Generic return type
function merge<T extends object, U extends object>(a: T, b: U): T & U {
  return { ...a, ...b };
}
const merged = merge({ name: "Alice" }, { age: 30 });
merged.name; // ✅ string
merged.age;  // ✅ number
```

---

### Q3. What are Generic Constraints?

**Answer:**
Constraints restrict what types can be used as type arguments using `extends`.

```typescript
// Unconstrained — T can be anything
function getLength<T>(arg: T): number {
  return arg.length; // ❌ Error: Property 'length' doesn't exist on type 'T'
}

// Constrained — T must have a length property
interface HasLength { length: number; }

function getLength<T extends HasLength>(arg: T): number {
  return arg.length; // ✅ We know T has length!
}

getLength("hello");      // 5
getLength([1, 2, 3]);    // 3
getLength({ length: 10 }); // 10
getLength(42);           // ❌ Error: number doesn't have length

// Constrain to object keys (keyof)
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Alice", age: 30 };
getProperty(user, "name");   // string ✅
getProperty(user, "age");    // number ✅
getProperty(user, "email");  // ❌ Error: "email" not in keyof user

// Multiple constraints
function clone<T extends object & { id: string }>(obj: T): T {
  return { ...obj };
}

// Constraint with other type params
function copyFields<T, K extends keyof T>(target: T, source: T, keys: K[]): T {
  keys.forEach(key => { target[key] = source[key]; });
  return target;
}
```

---

## 🟡 Generic Classes & Interfaces

---

### Q4. How do you create generic classes and interfaces?

**Answer:**

```typescript
// Generic class
class Stack<T> {
  private items: T[] = [];

  push(item: T): void    { this.items.push(item); }
  pop(): T | undefined   { return this.items.pop(); }
  peek(): T | undefined  { return this.items[this.items.length - 1]; }
  isEmpty(): boolean     { return this.items.length === 0; }
  size(): number         { return this.items.length; }
}

const numStack = new Stack<number>();
numStack.push(1);
numStack.push(2);
numStack.pop(); // number

const strStack = new Stack<string>();
strStack.push("a");
strStack.push(1); // ❌ Error: number not assignable to string

// Generic class with constraints
class Repository<T extends { id: string }> {
  private store = new Map<string, T>();

  save(entity: T): void   { this.store.set(entity.id, entity); }
  findById(id: string): T | undefined { return this.store.get(id); }
  findAll(): T[]          { return [...this.store.values()]; }
  delete(id: string): void { this.store.delete(id); }
}

interface User { id: string; name: string; }
const userRepo = new Repository<User>();
userRepo.save({ id: "1", name: "Alice" });

// Generic interface
interface Transformer<TInput, TOutput> {
  transform(input: TInput): TOutput;
  transformAll(inputs: TInput[]): TOutput[];
}

class StringToNumber implements Transformer<string, number> {
  transform(input: string): number { return parseInt(input); }
  transformAll(inputs: string[]): number[] { return inputs.map(this.transform); }
}
```

---

### Q5. What is a Generic Factory Pattern?

**Answer:**

```typescript
// Factory function with generics
function createInstance<T>(ctor: new (...args: any[]) => T, ...args: any[]): T {
  return new ctor(...args);
}

class Dog { constructor(public name: string) {} }
class Cat { constructor(public name: string) {} }

const dog = createInstance(Dog, "Rex");  // Dog
const cat = createInstance(Cat, "Whiskers"); // Cat

// More type-safe factory:
function createWithId<T extends { id: string }>(
  factory: (id: string) => T
): T {
  return factory(crypto.randomUUID());
}

// Builder pattern with generics
class Builder<T extends object> {
  private obj: Partial<T> = {};

  set<K extends keyof T>(key: K, value: T[K]): this {
    this.obj[key] = value;
    return this; // Fluent API
  }

  build(): T {
    return this.obj as T;
  }
}

const user = new Builder<{ name: string; age: number }>()
  .set("name", "Alice")
  .set("age", 30)
  .build();
```

---

## 🟡 Advanced Generic Patterns

---

### Q6. What are Conditional Types with Generics?

**Answer:**

```typescript
// Basic conditional type
type IsArray<T> = T extends any[] ? true : false;
type A = IsArray<string[]>;  // true
type B = IsArray<string>;    // false

// Built-in utility types use conditional types
type ReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : any;

type Awaited<T> =
  T extends null | undefined ? T :
  T extends object & { then(onfulfilled: infer F, ...args: any): any } ?
    F extends ((value: infer V, ...args: any) => any) ? Awaited<V> : never
  : T;

// Infer to extract parts of types
type FirstArgument<T> = T extends (first: infer F, ...rest: any[]) => any ? F : never;

function greet(name: string, age: number): string { return `${name} ${age}`; }
type GreetFirst = FirstArgument<typeof greet>; // string

// Distributive conditional types
type Nullable<T> = T extends any ? T | null : never;
type NullableStringOrNum = Nullable<string | number>; // string | null | number | null

// Non-distributive (prevent distribution with tuple)
type NullableAll<T> = [T] extends [any] ? T | null : never;
type NullableTuple = NullableAll<string | number>; // string | number | null

// Template literal conditional
type EventName = "click" | "focus" | "blur";
type HandlerName<T extends string> = `on${Capitalize<T>}`;
type Handlers = HandlerName<EventName>; // "onClick" | "onFocus" | "onBlur"
```

---

### Q7. What are Mapped Types and how do they relate to Generics?

**Answer:**

```typescript
// Mapped type — transform all properties of T
type Optional<T> = { [K in keyof T]?: T[K] };
type Readonly_<T> = { readonly [K in keyof T]: T[K] };
type Nullable<T> = { [K in keyof T]: T[K] | null };
type Stringify<T> = { [K in keyof T]: string };

interface User { name: string; age: number; active: boolean }

type OptionalUser    = Optional<User>;    // { name?: string; age?: number; active?: boolean }
type ReadonlyUser    = Readonly_<User>;   // { readonly name: string; ... }
type NullableUser    = Nullable<User>;    // { name: string | null; age: number | null; ... }

// Filter properties by type (using conditional)
type FilterByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

type StringOnly = FilterByType<User, string>; // { name: string }

// Rename keys with template literals
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<User>;
// { getName(): string; getAge(): number; getActive(): boolean }
```

---

### Q8. What is `infer` keyword?

**Answer:**
`infer` allows you to **capture and reuse a type within a conditional type**. It's like a "type variable" within the condition.

```typescript
// Extract the element type of an array
type ElementType<T> = T extends (infer E)[] ? E : never;
type E1 = ElementType<string[]>;       // string
type E2 = ElementType<number[]>;       // number
type E3 = ElementType<string>;         // never (not an array)

// Extract Promise resolution type
type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;
type R1 = UnwrapPromise<Promise<string>>;  // string
type R2 = UnwrapPromise<string>;           // string (not a promise)

// Extract function return type
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Extract function parameters
type MyParameters<T> = T extends (...args: infer P) => any ? P : never;

function add(a: number, b: number): number { return a + b; }
type AddReturn = MyReturnType<typeof add>;   // number
type AddParams = MyParameters<typeof add>;   // [a: number, b: number]

// Extract constructor parameters
type ConstructorParams<T> = T extends new (...args: infer P) => any ? P : never;

// Extract nested types
type UnpackNested<T> =
  T extends Promise<Array<infer Item>>
    ? Item
    : T;
type Unpacked = UnpackNested<Promise<string[]>>; // string
```

---

## 🔴 Real-World Patterns

---

### Q9. Implement a type-safe `pick` function:

**Answer:**

```typescript
function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => { result[key] = obj[key]; });
  return result;
}

const user = { name: "Alice", age: 30, email: "alice@example.com", role: "admin" };
const publicInfo = pick(user, ["name", "email"]);
// { name: string; email: string } — perfectly typed!

publicInfo.name;  // ✅ string
publicInfo.age;   // ❌ Error: Property 'age' does not exist
```

---

### Q10. Implement a type-safe `EventEmitter`:

**Answer:**

```typescript
type EventMap = Record<string, any>;

class TypedEventEmitter<Events extends EventMap> {
  private listeners: {
    [K in keyof Events]?: Array<(payload: Events[K]) => void>;
  } = {};

  on<K extends keyof Events>(
    event: K,
    listener: (payload: Events[K]) => void
  ): this {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
    return this;
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    this.listeners[event]?.forEach(fn => fn(payload));
  }

  off<K extends keyof Events>(
    event: K,
    listener: (payload: Events[K]) => void
  ): this {
    this.listeners[event] = this.listeners[event]?.filter(fn => fn !== listener);
    return this;
  }
}

// Usage with full type safety!
interface AppEvents {
  login:   { userId: string; timestamp: Date };
  logout:  { userId: string };
  error:   { message: string; code: number };
}

const emitter = new TypedEventEmitter<AppEvents>();

emitter.on("login", ({ userId, timestamp }) => {
  console.log(`User ${userId} logged in at ${timestamp}`);
});

emitter.emit("login", { userId: "123", timestamp: new Date() }); // ✅
emitter.emit("login", { userId: "123" });    // ❌ Missing timestamp
emitter.emit("unknown", {});                 // ❌ Event not in AppEvents
```

---

### Q11. Implement a generic `Result<T, E>` type:

**Answer:**

```typescript
type Result<T, E = Error> =
  | { ok: true;  value: T }
  | { ok: false; error: E };

function success<T>(value: T): Result<T> {
  return { ok: true, value };
}

function failure<E = Error>(error: E): Result<never, E> {
  return { ok: false, error };
}

// Usage:
async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const user = await db.find(id);
    if (!user) return failure(new Error("User not found"));
    return success(user);
  } catch (err) {
    return failure(err instanceof Error ? err : new Error("Unknown error"));
  }
}

const result = await fetchUser("123");
if (result.ok) {
  console.log(result.value.name); // Typed as User
} else {
  console.error(result.error.message); // Typed as Error
}
```

---

## 📝 Quick Reference

```typescript
// Basic generic
function fn<T>(arg: T): T { return arg; }

// Multiple params
function fn<T, U>(a: T, b: U): [T, U] { return [a, b]; }

// Constraints
function fn<T extends object>(arg: T): T { return arg; }
function fn<T, K extends keyof T>(obj: T, key: K): T[K] { return obj[key]; }

// Default type parameter
function fn<T = string>(arg: T): T { return arg; }

// Generic interface
interface Repo<T extends { id: string }> {
  findById(id: string): T | undefined;
}

// Generic class
class Stack<T> {
  private items: T[] = [];
  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
}

// Conditional with infer
type UnwrapArray<T> = T extends (infer E)[] ? E : T;
type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;

// Mapped types
type Optional<T> = { [K in keyof T]?: T[K] };
type Readonly<T> = { readonly [K in keyof T]: T[K] };
type FilterKeys<T, U> = { [K in keyof T as T[K] extends U ? K : never]: T[K] };
```

---

*Senior UI Developer Interview Prep — TypeScript Generics*
