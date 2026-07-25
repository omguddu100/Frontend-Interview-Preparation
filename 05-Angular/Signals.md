# ⚡ Angular Signals — Interview Q&A

> **Category:** Angular | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 🔵 Fundamentals

---

### Q1. What is an Angular Signal?

**Answer:**
A **Signal** is a reactive primitive that wraps a value and notifies interested consumers when that value changes.

Signals consist of:
1. **Getter**: A zero-argument function (`count()`) that reads the current value and registers the caller as a dependency.
2. **Value Producer**: Can update its value (`count.set(5)`, `count.update(n => n + 1)`).
3. **Notification System**: Efficiently tracks graph dependencies to trigger target DOM updates without Zone.js.

```typescript
import { signal, computed, effect } from '@angular/core';

const count = signal(0); // WritableSignal<number>

console.log(count()); // Read: 0

count.set(5); // Set absolute value
count.update(c => c + 1); // Update based on current value (6)
```

---

### Q2. Writable Signals vs Computed Signals vs Effects.

**Answer:**

| Type | API | Mutable? | Purpose |
|---|---|---|---|
| **Writable Signal** | `signal(initialValue)` | ✅ Yes (`set()`, `update()`) | Primary source of state |
| **Computed Signal** | `computed(() => expr)` | ❌ Read-Only | Derived reactive state (lazily evaluated, memoized) |
| **Effect** | `effect(() => fn)` | N/A | Side-effects (logging, DOM sync, external storage) |

```typescript
export class CounterComponent {
  count = signal(0);
  double = computed(() => this.count() * 2);

  constructor() {
    effect(() => {
      console.log(`Current count: ${this.count()}, Double: ${this.double()}`);
    });
  }
}
```

---

### Q3. Why did Angular introduce Signals? (Signals vs Zone.js / RxJS)

**Answer:**
- **Eliminates Zone.js Overhead**: Zone.js monkey-patches browser APIs (like `setTimeout`, `fetch`, `addEventListener`) to trigger global change detection. Signals enable **Fine-Grained Change Detection** — Angular knows *exactly* which component or node needs updating.
- **Glitch-Free Execution**: Computed signals avoid intermediate invalid states during dependency updates.
- **Simpler than RxJS for State**: No subscription management (`subscribe`, `unsubscribe`, `async` pipe memory leaks).
- **Interoperability**: RxJS remains ideal for asynchronous streams (websockets, debouncing inputs), while Signals are for local UI state. `rxjs-interop` bridges both (`toSignal`, `toObservable`).

---

## 🟡 Advanced Signal Features

---

### Q4. How do `toSignal` and `toObservable` work?

**Answer:**
The `@angular/core/rxjs-interop` package seamlessly converts between Signals and RxJS Observables.

```typescript
import { toSignal, toObservable } from '@angular/core/rxjs-interop';

@Component({ ... })
export class SearchComponent {
  private http = inject(HttpClient);

  searchControl = new FormControl('');

  // 1. Convert Observable to Signal
  searchQuery = toSignal(
    this.searchControl.valueChanges.pipe(debounceTime(300)),
    { initialValue: '' }
  );

  // 2. Convert Signal back to Observable for RxJS operators
  searchQuery$ = toObservable(this.searchQuery);
}
```

---

### Q5. What is the equality function in Signals and how does custom equality work?

**Answer:**
By default, Signals use `Object.is()` equality. If `.set()` is called with an identical primitive value, consumers are NOT notified.

For objects/arrays, custom equality functions can prevent unnecessary updates:

```typescript
interface User { id: number; name: string }

const user = signal<User>(
  { id: 1, name: 'Alice' },
  { equal: (a, b) => a.id === b.id && a.name === b.name }
);

// Will NOT trigger effects/computed since equal returns true!
user.set({ id: 1, name: 'Alice' });
```

---

## 📝 Quick Reference

```typescript
// Signal Cheat Sheet
const val = signal(10);             // Writable Signal
val.set(20);                       // Set value
val.update(v => v + 5);            // Update value
const double = computed(() => val() * 2); // Read-only Computed Signal

effect(() => {
  console.log(val());              // Auto-tracks dependencies
});

// RxJS Interop
const sig = toSignal(obs$, { initialValue: 0 });
const obs$ = toObservable(sig);
```

---

*Senior UI Developer Interview Prep — Angular Signals*
