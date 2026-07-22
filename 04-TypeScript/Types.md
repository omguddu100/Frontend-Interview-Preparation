# 🔷 TypeScript Types — Interview Q&A

> **Category:** TypeScript | **Level:** Beginner → Advanced
> **Last Updated:** 2026-07-22

---

## 🔵 Primitive & Basic Types

---

### Q1. What are the basic types in TypeScript?

**Answer:**

```typescript
// Primitives
let name: string    = "Alice";
let age: number     = 30;
let active: boolean = true;
let id: bigint      = 9007199254740991n;
let sym: symbol     = Symbol("id");

// Special
let nothing: null      = null;
let missing: undefined = undefined;

// Any — opt out of type checking (avoid!)
let anything: any = 42;
anything = "now a string"; // No error
anything.foo.bar;          // No error — dangerous!

// Unknown — safer alternative to any
let input: unknown = getUserInput();
input.toUpperCase();                    // ❌ Error — must narrow first
if (typeof input === "string") {
  input.toUpperCase();                  // ✅ OK after narrowing
}

// Never — function that never returns
function throwError(msg: string): never {
  throw new Error(msg);                 // Never returns
}

// Void — function that returns nothing
function log(msg: string): void {
  console.log(msg);                     // Returns undefined implicitly
}
```

---

### Q2. What is the difference between `any` and `unknown`?

**Answer:**

| | `any` | `unknown` |
|--|-------|-----------|
| Type checking | ❌ Disabled | ✅ Enforced |
| Can assign to | Any type | Only `unknown` / `any` |
| Can access properties | ✅ Yes (unsafe) | ❌ Must narrow type first |
| Use case | Legacy code migration | Safe dynamic input |

```typescript
let a: any     = "hello";
let b: unknown = "hello";

// any — no errors (dangerous)
a.toUpperCase();    // ✅ compiles, might crash at runtime
a.foo.bar.baz();    // ✅ compiles, crashes at runtime!

// unknown — forces type checking
b.toUpperCase();    // ❌ Error: Object is of type 'unknown'

// Must narrow unknown before use
if (typeof b === "string") {
  b.toUpperCase();  // ✅ Safe
}

function processInput(input: unknown) {
  if (typeof input === "string")        console.log(input.toUpperCase());
  if (typeof input === "number")        console.log(input.toFixed(2));
  if (input instanceof Date)            console.log(input.toISOString());
  if (Array.isArray(input))            console.log(input.length);
}
```

---

### Q3. What is `never` type and when do you use it?

**Answer:**
`never` represents a value that **never occurs** — functions that always throw or loop forever, and the "bottom" type in type narrowing.

```typescript
// 1. Functions that never return
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) { }
}

// 2. Exhaustive checks (ensure all cases are handled)
type Shape = "circle" | "square" | "triangle";

function getArea(shape: Shape): number {
  switch (shape) {
    case "circle":   return Math.PI * 5 ** 2;
    case "square":   return 4 ** 2;
    case "triangle": return 0.5 * 3 * 4;
    default:
      // If you add a new Shape without handling it, this line errors!
      const _exhaustive: never = shape; // ← compile error catches missing case
      throw new Error(`Unhandled: ${_exhaustive}`);
  }
}

// 3. Intersection of incompatible types
type NeverType = string & number; // never — no value can be both
```

---

## 🟡 Arrays, Tuples & Enums

---

### Q4. What are the different ways to type arrays, tuples, and enums?

**Answer:**

```typescript
// Arrays — two syntaxes (equivalent)
let nums: number[]       = [1, 2, 3];
let strs: Array<string>  = ["a", "b"];
let mixed: (string | number)[] = ["a", 1, "b", 2];

// Tuples — fixed-length array with specific types per position
let person: [string, number] = ["Alice", 30];
let [personName, personAge] = person;

// Tuple with label (TS 4.0+)
let coord: [x: number, y: number, z?: number] = [10, 20];

// Rest in tuples
type StringThenNumbers = [string, ...number[]];
const s: StringThenNumbers = ["hello", 1, 2, 3];

// Enums
enum Direction {
  Up    = "UP",
  Down  = "DOWN",
  Left  = "LEFT",
  Right = "RIGHT",
}

function move(dir: Direction) { }
move(Direction.Up);    // ✅
move("UP");            // ❌ Type '"UP"' is not assignable to type 'Direction'

// Const enum — inlined at compile time (no JS object generated)
const enum Status {
  Active   = 1,
  Inactive = 0,
}

// Numeric enum (auto-increments)
enum Priority { Low, Medium, High } // 0, 1, 2
Priority[1]  // "Medium" — reverse mapping!
Priority.High // 2
```

---

### Q5. What are Union types and Intersection types?

**Answer:**

```typescript
// UNION — value can be ONE of these types (OR)
type StringOrNumber = string | number;

function formatId(id: string | number): string {
  if (typeof id === "string") return id.toUpperCase();
  return id.toString().padStart(6, "0");
}

// Discriminated Union — union with a "tag" field
type Shape =
  | { kind: "circle";   radius: number }
  | { kind: "square";   side: number }
  | { kind: "rectangle"; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":    return Math.PI * shape.radius ** 2;
    case "square":    return shape.side ** 2;
    case "rectangle": return shape.width * shape.height;
  }
}

// INTERSECTION — value must satisfy ALL types (AND)
type Admin = { role: "admin"; permissions: string[] };
type User  = { name: string; email: string };

type AdminUser = Admin & User; // Must have ALL properties

const adminUser: AdminUser = {
  name: "Alice",
  email: "alice@example.com",
  role: "admin",
  permissions: ["read", "write"],
};
```

---

### Q6. What is Type Narrowing and what are the narrowing techniques?

**Answer:**
Type narrowing is TypeScript **narrowing down a wider type to a more specific one** based on runtime checks.

```typescript
// 1. typeof narrowing
function process(val: string | number) {
  if (typeof val === "string") {
    val.toUpperCase(); // string here
  } else {
    val.toFixed(2);    // number here
  }
}

// 2. instanceof narrowing
function handleDate(val: Date | string) {
  if (val instanceof Date) {
    val.toISOString();    // Date here
  } else {
    new Date(val);        // string here
  }
}

// 3. in operator narrowing
type Cat = { meow(): void };
type Dog = { bark(): void };

function makeSound(animal: Cat | Dog) {
  if ("meow" in animal) {
    animal.meow(); // Cat here
  } else {
    animal.bark(); // Dog here
  }
}

// 4. Truthiness narrowing
function printName(name: string | null) {
  if (name) {
    console.log(name.toUpperCase()); // name is string (not null)
  }
}

// 5. Equality narrowing
function compare(a: string | number, b: string | boolean) {
  if (a === b) {
    a.toUpperCase(); // Both must be string here!
  }
}

// 6. Discriminated union narrowing
type Result<T> =
  | { success: true;  data: T }
  | { success: false; error: string };

function handle<T>(result: Result<T>) {
  if (result.success) {
    console.log(result.data);  // T
  } else {
    console.log(result.error); // string
  }
}

// 7. Type predicates (custom type guards)
function isString(val: unknown): val is string {
  return typeof val === "string";
}

function isUser(obj: unknown): obj is User {
  return typeof obj === "object" && obj !== null && "name" in obj;
}
```

---

## 🟡 Type Assertions & Casting

---

### Q7. What is type assertion and when should you use it?

**Answer:**

```typescript
// Type assertion — "I know better than TypeScript"
const input = document.getElementById("name") as HTMLInputElement;
input.value = "Alice"; // ✅ Without assertion: Property 'value' doesn't exist on HTMLElement

// Alternative syntax (not in JSX files!)
const input2 = <HTMLInputElement>document.getElementById("name");

// Double assertion (use sparingly!)
const mystery = (someValue as unknown) as SpecificType;

// Non-null assertion operator !
const el = document.querySelector(".btn")!; // Assert it's not null
el.addEventListener("click", handler);

// When to use assertions:
// ✅ When you know more than TS (API return types, DOM elements)
// ❌ Never to bypass legitimate type errors
// ❌ Never instead of proper type narrowing

// const assertion — makes object deeply readonly
const config = {
  host: "localhost",
  port: 3000,
} as const;

config.port = 4000; // ❌ Error — readonly
type Port = typeof config.port; // 3000 (literal type, not number!)
```

---

### Q8. What is the `satisfies` operator (TS 4.9)?

**Answer:**
`satisfies` validates that a value matches a type **while preserving the most specific type**.

```typescript
type Colors = "red" | "green" | "blue";
type ColorMap = Record<Colors, string | [number, number, number]>;

// ❌ Without satisfies — loses specific types
const palette: ColorMap = {
  red:   [255, 0, 0],
  green: "#00ff00",
  blue:  [0, 0, 255],
};
palette.green.toUpperCase(); // ❌ Error — might be array

// ✅ With satisfies — validates AND preserves types!
const palette2 = {
  red:   [255, 0, 0],
  green: "#00ff00",
  blue:  [0, 0, 255],
} satisfies ColorMap;

palette2.green.toUpperCase();   // ✅ TypeScript knows it's string
palette2.red.map(c => c / 255); // ✅ TypeScript knows it's number[]
```

---

## 🔴 Advanced Types

---

### Q9. What are Literal Types and Template Literal Types?

**Answer:**

```typescript
// Literal types — exact value, not just the type
type Status = "active" | "inactive" | "pending";
type One = 1;
type True = true;

let s: Status = "active"; // ✅
let s2: Status = "deleted"; // ❌ Error

// Template literal types (TS 4.1+)
type EventName = "click" | "focus" | "blur";
type Handler = `on${Capitalize<EventName>}`; // "onClick" | "onFocus" | "onBlur"

type Direction = "top" | "right" | "bottom" | "left";
type CSSProp = `margin-${Direction}` | `padding-${Direction}`;
// "margin-top" | "margin-right" | ... | "padding-left"

// Powerful: typed CSS-in-JS, API routes, event names
type Route = "/users" | "/posts" | "/comments";
type ApiRoute = `GET ${Route}` | `POST ${Route}`;
// "GET /users" | "POST /users" | "GET /posts" | ...

// Extract from template literals
type ExtractRouteParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractRouteParams<`/${Rest}`>
    : T extends `${string}:${infer Param}`
    ? Param
    : never;

type Params = ExtractRouteParams<"/users/:id/posts/:postId">;
// "id" | "postId"
```

---

### Q10. What are Conditional Types?

**Answer:**

```typescript
// Syntax: T extends U ? TrueType : FalseType
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<string>;  // "yes"
type B = IsString<number>;  // "no"

// Infer — extract types within conditional types
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type UnpackArray<T> = T extends (infer Item)[] ? Item : T;

type Fn = () => { name: string; age: number };
type FnReturn = ReturnType<Fn>; // { name: string; age: number }

type Unpacked = UnpackArray<string[]>; // string
type NotArray = UnpackArray<number>;   // number (not an array)

// Distributive conditional types
type ToArray<T> = T extends any ? T[] : never;
type StrOrNumArr = ToArray<string | number>; // string[] | number[]
// NOT (string | number)[] !

// Non-distributive (wrap in tuple)
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;
type Both = ToArrayNonDist<string | number>; // (string | number)[]
```

---

## 📝 Quick Reference

```typescript
// Primitives
string | number | boolean | bigint | symbol | null | undefined

// Special
any       // Opt out of type checking (avoid!)
unknown   // Safe dynamic type (must narrow before use)
never     // Never occurs (exhaustive checks, never-returning functions)
void      // Function returns nothing

// Collections
number[]           // Array
Array<string>      // Generic array
[string, number]   // Tuple

// Composition
string | number    // Union (OR)
A & B             // Intersection (AND)
"click" | "blur"  // Literal union

// Narrowing
typeof val === "string"
val instanceof Date
"prop" in obj
Array.isArray(val)
function isUser(x): x is User { }

// Assertion
value as Type
value!          // Non-null assertion
as const        // Readonly + literal types
satisfies Type  // Validate without widening

// Conditional
T extends U ? Yes : No
infer R         // Extract type within conditional
```

---

*Senior UI Developer Interview Prep — TypeScript Types*
