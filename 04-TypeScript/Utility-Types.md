# 🛠️ TypeScript Utility Types — Interview Q&A

> **Category:** TypeScript | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-22

---

## 🔵 Built-in Utility Types

---

### Q1. What are Utility Types in TypeScript?

**Answer:**
Utility types are **built-in generic types** that transform existing types into new ones. They're implemented using mapped types, conditional types, and `keyof`/`infer` internally.

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  createdAt: Date;
}
```

---

### Q2. Explain `Partial<T>`, `Required<T>`, and `Readonly<T>`.

**Answer:**

```typescript
// Partial<T> — makes ALL properties optional
type PartialUser = Partial<User>;
// { id?: string; name?: string; email?: string; ... }

// Used for update/patch operations
function updateUser(id: string, updates: Partial<User>): User {
  // updates can have only the fields you want to change
  return { ...currentUser, ...updates };
}

updateUser("1", { name: "Alice" });             // ✅ Only name
updateUser("1", { name: "Alice", role: "admin" }); // ✅ Two fields

// Required<T> — makes ALL properties required (removes optional)
interface Config {
  host?: string;
  port?: number;
  debug?: boolean;
}

type RequiredConfig = Required<Config>;
// { host: string; port: number; debug: boolean }

function connect(config: Required<Config>) {
  // All fields guaranteed to exist
}

// Readonly<T> — makes ALL properties readonly
type ImmutableUser = Readonly<User>;

const user: ImmutableUser = { id: "1", name: "Alice", ...rest };
user.name = "Bob"; // ❌ Error: Cannot assign to 'name' — it is a read-only property

// Implementation (for understanding):
type MyPartial<T>  = { [K in keyof T]?: T[K] };
type MyRequired<T> = { [K in keyof T]-?: T[K] };  // -? removes optional
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
```

---

### Q3. Explain `Pick<T, K>` and `Omit<T, K>`.

**Answer:**

```typescript
// Pick<T, K> — select a SUBSET of properties
type UserPreview = Pick<User, "id" | "name" | "role">;
// { id: string; name: string; role: "admin" | "user" }

// Great for API responses — send only needed fields
function getPublicProfile(user: User): Pick<User, "id" | "name"> {
  return { id: user.id, name: user.name };
}

// Omit<T, K> — exclude specific properties
type UserWithoutPassword = Omit<User, "password">;
// { id: string; name: string; email: string; role: "admin" | "user"; createdAt: Date }

// Safe to send to client
function toPublicUser(user: User): Omit<User, "password"> {
  const { password, ...publicUser } = user;
  return publicUser;
}

// Pick multiple with union
type SafeUser = Omit<User, "password" | "createdAt">;

// Combine Pick + Omit
type EditableFields = Pick<Omit<User, "id" | "createdAt">, "name" | "email" | "role">;

// Implementation:
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
type MyOmit<T, K extends keyof T> = { [P in Exclude<keyof T, K>]: T[P] };
// OR simpler:
type MyOmit2<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
```

---

### Q4. Explain `Record<K, V>`.

**Answer:**

```typescript
// Record<K, V> — maps keys of type K to values of type V
type UserRoles = Record<string, "admin" | "user" | "guest">;
const roles: UserRoles = {
  alice: "admin",
  bob:   "user",
  carol: "guest",
};

// With literal union keys
type PagePermissions = Record<
  "home" | "dashboard" | "settings" | "admin",
  { read: boolean; write: boolean; delete: boolean }
>;

const permissions: PagePermissions = {
  home:      { read: true,  write: false, delete: false },
  dashboard: { read: true,  write: true,  delete: false },
  settings:  { read: true,  write: true,  delete: false },
  admin:     { read: true,  write: true,  delete: true  },
};

// Dynamic lookup table
type CountryDialCode = Record<string, string>;
const dialCodes: CountryDialCode = {
  IN: "+91",
  US: "+1",
  GB: "+44",
};

// vs index signature — Record is cleaner:
// { [key: string]: string } vs Record<string, string>

// Implementation:
type MyRecord<K extends keyof any, V> = { [P in K]: V };
```

---

### Q5. Explain `Exclude<T, U>` and `Extract<T, U>`.

**Answer:**

```typescript
// Exclude<T, U> — remove types from union T that are assignable to U
type T1 = Exclude<string | number | boolean, boolean>;
// string | number

type T2 = Exclude<"a" | "b" | "c" | "d", "b" | "d">;
// "a" | "c"

// Extract<T, U> — keep ONLY types from T that are assignable to U
type T3 = Extract<string | number | boolean, boolean | number>;
// number | boolean

type T4 = Extract<"a" | "b" | "c", "b" | "c" | "d">;
// "b" | "c"

// Practical: filter union types
type EventNames = "click" | "focus" | "blur" | "keydown" | "keyup";
type MouseEvents = Extract<EventNames, "click">; // "click"
type KeyboardEvents = Extract<EventNames, "keydown" | "keyup">; // "keydown" | "keyup"
type NonMouseEvents = Exclude<EventNames, "click">; // "focus" | "blur" | "keydown" | "keyup"

// Implementation:
type MyExclude<T, U> = T extends U ? never : T;
type MyExtract<T, U> = T extends U ? T : never;
```

---

### Q6. Explain `NonNullable<T>`, `ReturnType<T>`, `Parameters<T>`.

**Answer:**

```typescript
// NonNullable<T> — remove null and undefined from T
type T1 = NonNullable<string | null | undefined>; // string
type T2 = NonNullable<number | null>;              // number
type T3 = NonNullable<null | undefined>;           // never

function processName(name: string | null): string {
  // After null check, need NonNullable
  return name!; // or use NonNullable<typeof name>
}

// Practical:
type CleanArray<T> = NonNullable<T>[];
const clean: CleanArray<string | null> = ["a", "b"]; // Can't push null

// ReturnType<T> — extract return type of a function
function getUser() {
  return { id: "1", name: "Alice", age: 30 };
}

type User = ReturnType<typeof getUser>;
// { id: string; name: string; age: number }

// Useful with async functions:
async function fetchData() {
  return { data: [1, 2, 3], total: 100 };
}
type ApiData = Awaited<ReturnType<typeof fetchData>>;
// { data: number[]; total: number }

// Parameters<T> — extract parameter types as a tuple
function createUser(name: string, age: number, role: "admin" | "user") { }
type CreateUserParams = Parameters<typeof createUser>;
// [name: string, age: number, role: "admin" | "user"]

// Spread into another function:
function wrappedCreateUser(...args: Parameters<typeof createUser>) {
  console.log("Creating user...");
  return createUser(...args);
}

// Implementation:
type MyReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : any;

type MyParameters<T extends (...args: any) => any> =
  T extends (...args: infer P) => any ? P : never;
```

---

## 🟡 Intermediate Utility Types

---

### Q7. Explain `ConstructorParameters<T>` and `InstanceType<T>`.

**Answer:**

```typescript
class Database {
  constructor(
    public host: string,
    public port: number,
    public name: string
  ) {}

  query(sql: string) { }
}

// ConstructorParameters — extract constructor params as tuple
type DbParams = ConstructorParameters<typeof Database>;
// [host: string, port: number, name: string]

function createDb(...args: ConstructorParameters<typeof Database>) {
  return new Database(...args);
}

// InstanceType — get the instance type of a constructor
type DbInstance = InstanceType<typeof Database>;
// Database

// Useful in factory patterns:
function createInstance<T extends new (...args: any[]) => any>(
  ctor: T,
  ...args: ConstructorParameters<T>
): InstanceType<T> {
  return new ctor(...args);
}

const db = createInstance(Database, "localhost", 5432, "mydb");
db.query("SELECT 1"); // ✅ Fully typed!
```

---

### Q8. What is `Awaited<T>` and when do you need it?

**Answer:**

```typescript
// Awaited<T> — unwraps Promise (and nested Promises) to its resolved type
type T1 = Awaited<Promise<string>>;          // string
type T2 = Awaited<Promise<Promise<number>>>; // number (nested!)
type T3 = Awaited<string>;                   // string (non-Promise passes through)

// Without Awaited — wrong type
async function fetchUser() { return { id: "1", name: "Alice" }; }
type Wrong = ReturnType<typeof fetchUser>; // Promise<{ id: string; name: string }>
type Right  = Awaited<ReturnType<typeof fetchUser>>; // { id: string; name: string }

// Practical with Promise.all
const results = await Promise.all([
  fetch("/api/users").then(r => r.json()),
  fetch("/api/posts").then(r => r.json()),
]);
type Results = Awaited<typeof results>; // Properly unwrapped
```

---

### Q9. Explain `Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize`.

**Answer:**

```typescript
// String manipulation utility types (intrinsic — built into TS compiler)
type U = Uppercase<"hello">;      // "HELLO"
type L = Lowercase<"WORLD">;      // "world"
type C = Capitalize<"hello">;     // "Hello"
type UC = Uncapitalize<"Hello">;  // "hello"

// Most useful with template literal types
type EventName = "click" | "focus" | "blur";
type HandlerName = `on${Capitalize<EventName>}`;
// "onClick" | "onFocus" | "onBlur"

// CSS property builder
type CSSProperty = "margin" | "padding" | "border";
type CSSDirection = "top" | "right" | "bottom" | "left";
type DirectionalProp = `${CSSProperty}-${CSSDirection}`;
// "margin-top" | "margin-right" | ... | "border-left"

// Getter/setter type generation
type Getter<T extends string> = `get${Capitalize<T>}`;
type Setter<T extends string> = `set${Capitalize<T>}`;

type PersonGetters = Getter<"name" | "age">;   // "getName" | "getAge"
type PersonSetters = Setter<"name" | "age">;   // "setName" | "setAge"
```

---

## 🔴 Advanced — Custom Utility Types

---

### Q10. Build common custom utility types:

**Answer:**

```typescript
// 1. DeepPartial — recursively makes all properties optional
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

interface Config {
  server: { host: string; port: number };
  db: { url: string; name: string };
}

const partial: DeepPartial<Config> = {
  server: { host: "localhost" } // ✅ port is optional!
};

// 2. DeepReadonly — recursively makes all properties readonly
type DeepReadonly<T> = T extends (infer U)[]
  ? ReadonlyArray<DeepReadonly<U>>
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

// 3. Mutable — remove readonly from all properties
type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type MutableDeep<T> = { -readonly [K in keyof T]: MutableDeep<T[K]> };

// 4. KeysOfType — get keys whose value matches a type
type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

interface Model {
  id: string;
  name: string;
  age: number;
  active: boolean;
  score: number;
}

type StringKeys  = KeysOfType<Model, string>;  // "id" | "name"
type NumberKeys  = KeysOfType<Model, number>;  // "age" | "score"
type BooleanKeys = KeysOfType<Model, boolean>; // "active"

// 5. Flatten — flatten union of objects
type UnionToIntersection<U> =
  (U extends any ? (x: U) => void : never) extends (x: infer I) => void
    ? I : never;

// 6. Prettify — expand complex intersections for readability
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type ComplexType = { a: string } & { b: number } & { c: boolean };
type Clean = Prettify<ComplexType>; // { a: string; b: number; c: boolean }

// 7. Optional — make specific keys optional
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type UserCreate = Optional<User, "id" | "createdAt">;
// id and createdAt are now optional for creation

// 8. StrictOmit — prevent omitting non-existent keys
type StrictOmit<T, K extends keyof T> = Omit<T, K>;
// type Bad = StrictOmit<User, "nonExistent">; // ❌ Compile error

// 9. AtLeastOne — require at least one property from T
type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

type SearchFilter = AtLeastOne<{
  name?: string;
  email?: string;
  id?: string;
}>;
// Must provide at least one field
```

---

## 📝 Quick Reference

```typescript
// BUILT-IN UTILITY TYPES:

// Transform all properties
Partial<T>           // All optional         { x?: T }
Required<T>          // All required          { x: T } (removes ?)
Readonly<T>          // All readonly          { readonly x: T }
Mutable<T>           // Remove readonly       { -readonly x: T }

// Pick/Omit properties
Pick<T, "a" | "b">  // Only specified keys
Omit<T, "a" | "b">  // Exclude specified keys
Record<K, V>         // { [key in K]: V }

// Filter union types
Exclude<T, U>        // T without U (T = string | number | boolean, U = boolean → string | number)
Extract<T, U>        // Only T assignable to U
NonNullable<T>        // Remove null & undefined

// Function types
ReturnType<F>         // Return type of function F
Parameters<F>         // Parameter tuple of function F
ConstructorParameters<C>  // Constructor params
InstanceType<C>       // Instance type of constructor

// Async
Awaited<T>            // Unwrap Promise<T> → T

// String manipulation
Uppercase<S>  Lowercase<S>  Capitalize<S>  Uncapitalize<S>

// CUSTOM:
DeepPartial<T>      // Recursively Partial
DeepReadonly<T>     // Recursively Readonly
KeysOfType<T, V>    // Keys where value matches V
Optional<T, K>      // Make specific keys optional
Prettify<T>         // Expand intersection types
AtLeastOne<T>       // At least one property required
```

---

*Senior UI Developer Interview Prep — TypeScript Utility Types*
