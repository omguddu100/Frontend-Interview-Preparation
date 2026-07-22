# 🎓 TypeScript Interview Questions — Master Compendium

> **Category:** TypeScript | **Level:** Senior UI Developer
> **Last Updated:** 2026-07-22

---

## 🗂️ Index

1. [Type System & Fundamentals](#1-type-system--fundamentals)
2. [Interface vs Type](#2-interface-vs-type)
3. [Generics & Type Manipulation](#3-generics--type-manipulation)
4. [Advanced & Utility Types](#4-advanced--utility-types)
5. [Decorators & Metadata](#5-decorators--metadata)
6. [TypeScript Config & Compiler](#6-typescript-config--compiler)
7. [Tricky / Code Output Questions](#7-tricky--code-output-questions)

---

## 1. Type System & Fundamentals

---

### Q1. What are the main benefits of TypeScript over vanilla JavaScript?

**Answer:**
1. **Static Typing & Compile-Time Catching**: Errors like typos, `undefined` access, and argument mismatches are caught during compilation rather than at runtime.
2. **Enhanced IDE Support**: Autocomplete, self-documenting code refactoring, and code navigation (`Go to Definition`).
3. **Explicit Contracts**: Interfaces and types serve as clear API contracts between frontend and backend or modular components.
4. **Modern ECMAScript Features**: Transpiles modern features down to older ES targets.

---

### Q2. What is the difference between `any`, `unknown`, and `never`?

**Answer:**

| Type | Description | Type Checks | Operations Allowed |
|------|-------------|-------------|-------------------|
| `any` | Disables type checking completely | ❌ No | Any operation allowed (unsafe) |
| `unknown` | Safe counterpart to `any` | ✅ Yes | Must narrow type before operating |
| `never` | Represents values that never occur | ✅ N/A | Bottom type; assignable to everything, nothing assignable to it |

```typescript
let a: any = "hello";
a.foo.bar(); // ✅ Compiles (may crash at runtime)

let u: unknown = "hello";
// u.toUpperCase(); // ❌ Error!
if (typeof u === "string") {
  u.toUpperCase(); // ✅ Works after type guard
}

function fail(msg: string): never {
  throw new Error(msg);
}
```

---

### Q3. What are Type Guards and how do you write a custom Type Predicate?

**Answer:**
Type Guards are expressions that perform runtime checks to narrow down types.

**Common built-in guards:** `typeof`, `instanceof`, `'prop' in obj`, `Array.isArray()`.

**Custom Type Predicate (`val is Type`):**
```typescript
interface User {
  name: string;
  email: string;
}

// User-defined type guard
function isUser(obj: any): obj is User {
  return obj && typeof obj.name === "string" && typeof obj.email === "string";
}

const input: unknown = { name: "Alice", email: "alice@example.com" };

if (isUser(input)) {
  console.log(input.name); // ✅ TypeScript knows input is User
}
```

---

### Q4. What is a Discriminated Union?

**Answer:**
A pattern where multiple types share a common literal property (the **discriminant**), allowing TypeScript to exhaustively narrow union types.

```typescript
type NetworkState =
  | { status: "loading" }
  | { status: "success"; data: string }
  | { status: "error"; error: Error };

function render(state: NetworkState) {
  switch (state.status) {
    case "loading":
      return "Loading...";
    case "success":
      return `Data: ${state.data}`; // ✅ TS knows 'data' exists
    case "error":
      return `Error: ${state.error.message}`; // ✅ TS knows 'error' exists
  }
}
```

---

## 2. Interface vs Type

---

### Q5. What is the difference between `interface` and `type`? When do you choose which?

**Answer:**

| Feature | `interface` | `type` |
|---------|------------|--------|
| Object shape definition | ✅ Yes | ✅ Yes |
| Primitive / Union / Tuple | ❌ No | ✅ Yes |
| Declaration Merging | ✅ Yes (Auto-merges) | ❌ Syntax Error |
| Extends syntax | `extends` | Intersections `&` |

```typescript
// Interface declaration merging
interface User {
  name: string;
}
interface User {
  age: number;
}
// User has both name and age!

// Type for Unions & Aliases
type ID = string | number;
type Point = [number, number];
```

**Rule of Thumb:**
- Use `interface` for public APIs, object shapes, and object-oriented class implementations.
- Use `type` for unions, intersections, primitive aliases, tuples, and mapped/conditional types.

---

## 3. Generics & Type Manipulation

---

### Q6. What is a generic constraint (`extends`) and how does `keyof` work with it?

**Answer:**
Generic constraints limit the types that can be passed to a generic parameter.

```typescript
// Constrain T to have a length property
function logLength<T extends { length: number }>(item: T): number {
  return item.length;
}

// Ensure key K is a valid property name of object T
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "Alice", age: 30 };
getProperty(person, "name"); // ✅ Returns string
// getProperty(person, "invalid"); // ❌ Error: Argument of type '"invalid"' is not assignable to keyof person
```

---

### Q7. What does the `infer` keyword do in TypeScript?

**Answer:**
`infer` is used inside conditional types to declare a type variable that is inferred from another type during evaluation.

```typescript
// Extract return type of a function
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function add(a: number, b: number): number {
  return a + b;
}

type AddResult = MyReturnType<typeof add>; // number

// Extract element type of an array
type ElementType<T> = T extends (infer E)[] ? E : T;

type StringItem = ElementType<string[]>; // string
```

---

## 4. Advanced & Utility Types

---

### Q8. Explain `Partial<T>`, `Required<T>`, `Readonly<T>`, `Pick<T, K>`, and `Omit<T, K>`.

**Answer:**

```typescript
interface User {
  id: string;
  name: string;
  email?: string;
}

// Partial<T> - all properties optional
type PartialUser = Partial<User>; // { id?: string; name?: string; email?: string }

// Required<T> - all properties required
type RequiredUser = Required<User>; // { id: string; name: string; email: string }

// Readonly<T> - all properties readonly
type ImmutableUser = Readonly<User>;

// Pick<T, K> - selects subset of properties
type UserHeader = Pick<User, "id" | "name">; // { id: string; name: string }

// Omit<T, K> - removes specified properties
type UserWithoutId = Omit<User, "id">; // { name: string; email?: string }
```

---

### Q9. What is the `satisfies` operator (TS 4.9+)?

**Answer:**
`satisfies` allows you to validate that an expression matches a type **without widening or changing the inferred type**.

```typescript
type Colors = "red" | "green" | "blue";
type RGB = [number, number, number];

// With type annotation: palette.green is typed as string | RGB (widened)
// With satisfies: validates against record while keeping exact literal types!
const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255]
} satisfies Record<Colors, string | RGB>;

// Exact string methods available on green without casting!
palette.green.toUpperCase(); // ✅ Works because green is inferred specifically as string
```

---

## 5. Decorators & Metadata

---

### Q10. How do Decorators work in TypeScript?

**Answer:**
Decorators are special declarations attached to class declarations, methods, accessors, properties, or parameters using the `@expression` syntax. They are functions called at runtime with details about the decorated target.

```typescript
// Method decorator to log execution time
function LogExecutionTime(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const start = performance.now();
    const result = originalMethod.apply(this, args);
    const finish = performance.now();
    console.log(`${propertyKey} took ${finish - start}ms`);
    return result;
  };

  return descriptor;
}

class CalculationService {
  @LogExecutionTime
  heavyTask() {
    for (let i = 0; i < 1000000; i++) {}
  }
}
```

---

## 6. TypeScript Config & Compiler

---

### Q11. What are key `tsconfig.json` options every senior developer should know?

**Answer:**

| Option | Purpose |
|--------|---------|
| `strict: true` | Enables all strict type-checking options (`noImplicitAny`, `strictNullChecks`, etc.) |
| `strictNullChecks` | Ensures `null` and `undefined` are not assignable to other types unless explicitly unioned |
| `noImplicitAny` | Raises errors on expressions and declarations with an implied `any` type |
| `target` | Sets JS version output (e.g., `ES2022`, `ES6`) |
| `moduleResolution` | Specifies module resolution strategy (`node`, `nodenext`, `bundler`) |
| `skipLibCheck` | Skips type checking of `.d.ts` declaration files (speeds up build) |
| `noUnusedLocals` / `noUnusedParameters` | Errors on unused local variables/parameters |

---

## 7. Tricky / Code Output Questions

---

### Q12. What is the type of `x` and `y`?

```typescript
const x = "hello";
let y = "hello";
```

**Answer:**
- `x` is literal type `"hello"` (because `const` prevents re-assignment).
- `y` is type `string` (type widening occurs for `let`).

---

### Q13. What is the type error in this code and how do you fix it?

```typescript
const user = {
  name: "Alice",
  role: "admin"
};

function setRole(role: "admin" | "user") {
  console.log(role);
}

setRole(user.role);
```

**Answer:**
**Error:** Argument of type `string` is not assignable to parameter of type `"admin" | "user"`. TypeScript infers `user.role` as `string`.

**Fix Options:**
1. `const user = { name: "Alice", role: "admin" as const };`
2. `const user = { name: "Alice", role: "admin" as "admin" };`
3. Declare explicit interface for `user`.

---

## 📝 Top 10 Most Asked TypeScript Interview Questions

1. `interface` vs `type` — key differences and when to use which.
2. `any` vs `unknown` vs `never`.
3. How type narrowing and custom type guards (`is`) work.
4. Explain Generics and generic constraints (`extends keyof`).
5. How `infer` works in conditional types with real examples.
6. Key utility types (`Pick`, `Omit`, `Partial`, `Readonly`, `ReturnType`).
7. What is `as const` assertion and how does it change type inference?
8. What is the `satisfies` operator and how is it different from type annotations or `as` assertions?
9. Explain Discriminated Unions and exhaustive checking.
10. How `strictNullChecks` affects code safety.

---

*Senior UI Developer Interview Prep — Complete TypeScript Q&A*
