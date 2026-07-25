# 🎓 RxJS Interview Questions — Master Compendium

> **Category:** RxJS | **Level:** Senior UI Developer
> **Last Updated:** 2026-07-26

---

## 🗂️ Index

1. [Core Concepts & Architecture](#1-core-concepts--architecture)
2. [Subjects & Multicasting](#2-subjects--multicasting)
3. [Operators & Higher-Order Mapping](#3-operators--higher-order-mapping)
4. [Error Handling & Memory Leaks](#4-error-handling--memory-leaks)
5. [Tricky Code Output & Scenarios](#5-tricky-code-output--scenarios)

---

## 1. Core Concepts & Architecture

---

### Q1. Push vs Pull Architecture (RxJS vs Iterators / Functions).

**Answer:**

| Paradigm | Producer | Consumer | Examples |
|---|---|---|---|
| **Pull** | Passive (computes when asked) | Active (decides when to request data) | Function calls, Iterators, Generators |
| **Push** | Active (computes and sends data) | Passive (reacts when data arrives) | Promises, RxJS Observables, DOM Events |

---

### Q2. How do you prevent memory leaks when working with Observables?

**Answer:**
1. **Use Signals / `toSignal()`**: Automatically managed lifecycle without manual subscriptions.
2. **`takeUntilDestroyed()` (Angular 16+)**: Automatically unsubscribes when current injection context (component/service) is destroyed.
3. **`take(1)` / `takeUntil(destroy$)`**: Unsubscribe operator patterns.
4. **`AsyncPipe` in HTML**: Automatically manages subscriptions in Angular templates.

```typescript
export class UserComponent {
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    interval(1000).pipe(
      takeUntilDestroyed(this.destroyRef) // Auto unsubscribe on destroy!
    ).subscribe();
  }
}
```

---

## 2. Subjects & Multicasting

---

### Q3. When would you use Subject vs BehaviorSubject vs ReplaySubject vs AsyncSubject?

**Answer:**
- **`Subject`**: Event notification bus where subscribers only care about future events (e.g., Global click handler, Toast notification).
- **`BehaviorSubject`**: State container representing a current value (e.g., Auth User State, Cart Items).
- **`ReplaySubject`**: Replaying past $N$ events to late subscribers (e.g., Chat message history, Audit logs).
- **`AsyncSubject`**: Emitting only the final computed value when job completes (e.g., Long running calculation).

---

## 3. Operators & Higher-Order Mapping

---

### Q4. `switchMap` vs `mergeMap` vs `concatMap` vs `exhaustMap` scenario questions.

**Answer:**

- **Search Typeahead / Autocomplete**: `switchMap` (Cancel outdated API requests if user types new query).
- **File Uploader (Sequential)**: `concatMap` (Ensure file 1 finishes uploading before file 2 begins).
- **Double Click / Submit Button Preventer**: `exhaustMap` (Ignore new clicks while submit API request is running).
- **Parallel Image Downloading**: `mergeMap` (Fetch all image thumbnails concurrently).

---

## 4. Tricky Code Output Questions

---

### Q5. What is the output of this code?

```typescript
import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

const stream$ = of(1, 2, 3).pipe(
  tap(x => console.log('Tap 1:', x)),
  map(x => x * 10),
  tap(x => console.log('Tap 2:', x))
);

console.log('Before Subscribe');
stream$.subscribe(val => console.log('Sub:', val));
console.log('After Subscribe');
```

**Answer:**
```
Before Subscribe
Tap 1: 1
Tap 2: 10
Sub: 10
Tap 1: 2
Tap 2: 20
Sub: 20
Tap 1: 3
Tap 2: 30
Sub: 30
After Subscribe
```

**Explanation:**
`of()` is a **synchronous** cold observable! It executes all emissions synchronously during `.subscribe()` before moving to the next line of code.

---

### Q6. What is the output of this code?

```typescript
import { Subject } from 'rxjs';

const subject = new Subject<number>();

subject.next(1);

subject.subscribe(val => console.log('Sub A:', val));

subject.next(2);

subject.subscribe(val => console.log('Sub B:', val));

subject.next(3);
```

**Answer:**
```
Sub A: 2
Sub A: 3
Sub B: 3
```

**Explanation:**
- `subject.next(1)` emitted before any subscriber existed -> lost.
- `Sub A` subscribes -> receives `2` and `3`.
- `Sub B` subscribes after `2` was emitted -> misses `2`, receives `3`.

---

## 📝 Top 5 Most Asked RxJS Questions

1. Difference between `Observable` and `Subject`.
2. Compare `switchMap`, `mergeMap`, `concatMap`, and `exhaustMap`.
3. Difference between `Subject`, `BehaviorSubject`, and `ReplaySubject`.
4. How to prevent memory leaks in Angular/RxJS applications.
5. Why placement of `catchError` inside vs outside `switchMap` matters.

---

*Senior UI Developer Interview Prep — Complete RxJS Q&A*
