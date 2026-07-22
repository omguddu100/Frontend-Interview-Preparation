# ⚖️ Interface vs Type — Interview Q&A

> **Category:** TypeScript | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-22

---

## 🔵 Basics

---

### Q1. What is the difference between `interface` and `type` in TypeScript?

**Answer:**

| Feature | `interface` | `type` |
|---------|------------|--------|
| Object shape | ✅ Yes | ✅ Yes |
| Primitives | ❌ No | ✅ Yes (`type Name = string`) |
| Union types | ❌ No | ✅ Yes (`type A = B \| C`) |
| Intersection | ✅ `extends` | ✅ `&` |
| Declaration merging | ✅ Yes | ❌ No |
| Computed properties | ❌ Limited | ✅ Mapped types |
| Tuples | ❌ No | ✅ Yes |
| Error messages | More readable | Can be verbose |

```typescript
// Both work identically for object shapes:
interface UserInterface {
  name: string;
  age: number;
  greet(): string;
}

type UserType = {
  name: string;
  age: number;
  greet(): string;
};

// Only type can do:
type ID = string | number;           // Union
type Pair = [string, number];        // Tuple
type Callback = (e: Event) => void;  // Function alias
type Flag = boolean;                 // Primitive alias
```

---

### Q2. What is declaration merging and why is it unique to `interface`?

**Answer:**
Declaration merging allows you to define the same interface multiple times — TypeScript **merges** them into one. `type` aliases do not support this.

```typescript
// Interface — merges automatically!
interface Window {
  title: string;
}

interface Window {
  width: number; // Merged with above
}

// Result: Window = { title: string; width: number }
const w: Window = { title: "App", width: 1024 }; // ✅

// Type — duplicate identifier error!
type Config = { host: string; }
type Config = { port: number; } // ❌ Error: Duplicate identifier 'Config'
```

**Real-world use case — augmenting library types:**
```typescript
// Extend Express Request with custom user property
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
    }
  }
}

// Now in your handlers:
app.get("/profile", (req, res) => {
  console.log(req.user?.id); // ✅ TypeScript knows about user!
});
```

---

### Q3. How do you extend interfaces vs type aliases?

**Answer:**

```typescript
// INTERFACE — extends keyword
interface Animal {
  name: string;
  age: number;
}

interface Dog extends Animal {
  breed: string;
  bark(): void;
}

// Multiple inheritance (interface only!)
interface PoliceDog extends Dog, Trained {
  badgeNumber: string;
}

// TYPE — intersection (&)
type Animal = {
  name: string;
  age: number;
};

type Dog = Animal & {
  breed: string;
  bark(): void;
};

// Mix interface and type (both work as base):
type HybridDog = Dog & { isVaccinated: boolean };
interface AnotherDog extends Dog { isVaccinated: boolean; } // Extending type with interface!
```

---

### Q4. Can a `class` implement both `interface` and `type`?

**Answer:**
Yes! A class can implement both, but only **object-shape** types (not union/intersection/primitive aliases).

```typescript
interface Serializable {
  serialize(): string;
}

type Printable = {
  print(): void;
};

// Class implements both
class Document implements Serializable, Printable {
  constructor(private content: string) {}

  serialize() { return JSON.stringify({ content: this.content }); }
  print()     { console.log(this.content); }
}

// ❌ Cannot implement union types
type StringOrNumber = string | number;
class Foo implements StringOrNumber {} // ❌ Error!
```

---

## 🟡 When to Use Which

---

### Q5. When should you use `interface` vs `type`?

**Answer:**

**Use `interface` when:**
```typescript
// 1. Defining object/class contracts (OOP style)
interface Repository<T> {
  findById(id: string): Promise<T>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

// 2. Library public APIs (allows consumers to extend via declaration merging)
interface PluginOptions {
  debug?: boolean;
  timeout?: number;
}
// Consumer can add more options:
interface PluginOptions { customProp: string; }

// 3. Class implementation contracts
interface Comparable {
  compareTo(other: this): number;
}
class Temperature implements Comparable {
  compareTo(other: Temperature): number { return this.value - other.value; }
  constructor(private value: number) {}
}
```

**Use `type` when:**
```typescript
// 1. Union types
type Theme = "light" | "dark" | "auto";
type Status = "pending" | "success" | "error";
type ID = string | number;

// 2. Tuple types
type Coordinates = [lat: number, lng: number];
type RGB = [number, number, number];

// 3. Function types
type EventHandler<T> = (event: T) => void;
type Transform<T, U> = (input: T) => U;

// 4. Computed/mapped types
type Optional<T> = { [K in keyof T]?: T[K] };
type Nullable<T> = { [K in keyof T]: T[K] | null };

// 5. Conditional types
type NonNullable<T> = T extends null | undefined ? never : T;
type Awaited<T> = T extends Promise<infer U> ? U : T;

// 6. Aliases for primitives and complex expressions
type Milliseconds = number;
type HexColor = `#${string}`;
```

---

### Q6. What is a practical naming convention for `interface` vs `type`?

**Answer:**
```typescript
// Convention 1: Prefix interface with I (older, common in C#/Java style)
interface IUserService { ... }  // Some teams do this
type UserState = { ... };       // Types for state

// Convention 2: No prefix — most modern TS code (recommended by TS team)
interface UserService { ... }
type UserState = { ... };

// Convention 3: Suffix Interface
interface UserRepository { ... }
type ApiResponse<T> = { data: T; status: number };

// ✅ Recommended modern approach:
// - interface for object shapes, class contracts, APIs
// - type for unions, intersections, mapped types, aliases
// - No "I" prefix (TypeScript team advises against it)
```

---

## 🟡 Readonly & Optional

---

### Q7. How do `readonly` and optional properties work in both?

**Answer:**

```typescript
// Both support readonly and optional
interface Config {
  readonly host: string;     // Cannot be reassigned
  port?: number;             // Optional (number | undefined)
  readonly apiKey: string;
}

type Config2 = {
  readonly host: string;
  port?: number;
  readonly apiKey: string;
};

const cfg: Config = { host: "localhost", apiKey: "abc" };
cfg.host = "other"; // ❌ Error: Cannot assign to 'host' — readonly

// readonly array
interface Store {
  readonly items: ReadonlyArray<string>;
  // OR:
  readonly items2: readonly string[];
}

// Readonly utility type (makes all props readonly)
type ImmutableConfig = Readonly<Config>;

// Required utility type (removes all optional)
type RequiredConfig = Required<Config>;

// Deep readonly (must use mapped types or utility-types library)
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};
```

---

### Q8. How do index signatures work in interfaces?

**Answer:**

```typescript
// Index signatures — keys of any string or number
interface StringMap {
  [key: string]: string; // Any string key, string value
}

const translations: StringMap = {
  hello: "नमस्ते",
  goodbye: "अलविदा",
  thanks: "धन्यवाद",
};

// Mix index signature with specific properties
interface UserRoles {
  admin: boolean;        // Must be boolean (consistent with index signature)
  [role: string]: boolean; // Any other role key
}

// Template literal index signature (TS 4.4+)
interface DataByEventName {
  [key: `on${string}`]: (event: Event) => void;
}

const handlers: DataByEventName = {
  onClick: (e) => console.log(e),
  onFocus: (e) => console.log(e),
};

// Readonly index signature
interface ReadonlyDictionary {
  readonly [key: string]: string;
}
```

---

## 🔴 Advanced

---

### Q9. What are callable and constructable interfaces?

**Answer:**

```typescript
// Callable interface — object that can be called as a function
interface Greet {
  (name: string): string;    // Call signature
  language: string;          // Also has property
}

const greet: Greet = (name) => `Hello, ${name}`;
greet.language = "en";
greet("Alice"); // "Hello, Alice"

// Constructable interface — defines a constructor
interface DateConstructor {
  new (value: string | number): Date;
  now(): number; // Static method
}

// Generic call signatures
interface Transformer {
  <T>(input: T): T;
  <T, U>(input: T, mapper: (t: T) => U): U;
}

// Type version of callable:
type MathFn = {
  (a: number, b: number): number;
  description: string;
};
```

---

### Q10. What is interface vs type with generic constraints?

**Answer:**

```typescript
// Generic interface
interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

// Generic type
type ApiResponse<T, E = Error> =
  | { success: true;  data: T }
  | { success: false; error: E };

// Conditional generic
type Flatten<T> = T extends Array<infer Item> ? Item : T;
type A = Flatten<string[]>;        // string
type B = Flatten<number>;          // number (not array)
type C = Flatten<Array<boolean>>;  // boolean

// Generic with interface extending type
type Serializable = { toJSON(): string };

interface Entity<T extends Serializable> {
  data: T;
  serialize(): string;
}

// Practical: API layer
interface HttpClient {
  get<T>(url: string): Promise<ApiResponse<T>>;
  post<T, B = unknown>(url: string, body: B): Promise<ApiResponse<T>>;
  put<T, B = unknown>(url: string, body: B): Promise<ApiResponse<T>>;
  delete(url: string): Promise<ApiResponse<void>>;
}
```

---

### Q11. What is the `interface` merging pitfall with `type`?

**Answer:**

```typescript
// ✅ Interface can extend a type
type Timestamped = { createdAt: Date; updatedAt: Date };
interface Post extends Timestamped {
  title: string;
  content: string;
}

// ✅ Type can intersect with interface
interface Named { name: string }
type NamedAge = Named & { age: number }; // Works!

// ❌ Type can't be merged (declaration merging) — this is a feature, not a bug!
type Config = { host: string };
type Config = { port: number }; // Error — must use intersection explicitly:
type FullConfig = Config & { port: number };

// ❌ Interface can't be a union
interface Bad { name: string } | { id: number }; // Syntax error!
// Use type:
type Good = { name: string } | { id: number };   // ✅
```

---

## 📝 Quick Reference

```typescript
// interface                         | type
// ----------------------------------|-------------------------------------------
interface Shape { area(): number }   | type Shape = { area(): number }
interface Dog extends Animal {}      | type Dog = Animal & { bark(): void }
// Declaration merging: ✅           | Declaration merging: ❌
// Union: ❌                         | Union: type A = B | C ✅
// Tuple: ❌                         | Tuple: type T = [string, number] ✅
// Primitive: ❌                     | Primitive: type ID = string ✅
// Mapped type: ❌                   | Mapped type: { [K in keyof T]: ... } ✅

// Rules of thumb:
// Use interface for:
//   - Object shapes & class contracts
//   - Library public APIs (extendable via merging)
//   - When you need extends with multiple bases

// Use type for:
//   - Unions, intersections, tuples
//   - Computed/mapped/conditional types
//   - Aliases for primitives and function types
//   - React component props (often type alias)

// Both work for most object definitions — be consistent within a codebase!
```

---

*Senior UI Developer Interview Prep — TypeScript Interface vs Type*
