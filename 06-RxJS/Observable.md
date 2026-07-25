# 👁️ RxJS Observables — Interview Q&A

> **Category:** RxJS | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 🔵 Fundamentals

---

### Q1. What is an Observable in RxJS?

**Answer:**
An Observable is a push-based lazy collection of values emitted over time. Unlike Promises (which handle single async values eagerly), Observables:
1. Are **Lazy**: They execute only when subscribed to (`.subscribe()`).
2. Can emit **multiple values**: 0, 1, or many values over time.
3. Are **Cancellable**: Subscriptions can be unsubscribed (`subscription.unsubscribe()`).

```typescript
import { Observable } from 'rxjs';

// Creating a custom Observable
const customObservable$ = new Observable<number>(subscriber => {
  console.log('Observable execution started');
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);

  const timer = setTimeout(() => {
    subscriber.next(4);
    subscriber.complete();
  }, 1000);

  // Teardown logic (runs on unsubscribe or completion)
  return () => {
    clearTimeout(timer);
    console.log('Teardown & Cleanup');
  };
});

// Subscribing
const sub = customObservable$.subscribe({
  next: val => console.log('Value:', val),
  error: err => console.error('Error:', err),
  complete: () => console.log('Completed!')
});
```

---

### Q2. Cold Observables vs Hot Observables.

**Answer:**

| Feature | Cold Observable | Hot Observable |
|---|---|---|
| Data Producer | Created INSIDE the Observable | Created OUTSIDE the Observable |
| Execution | Unique for each subscriber (Unicast) | Shared across all subscribers (Multicast) |
| Emissions | Subscriber gets all values from beginning | Subscriber gets values emitted AFTER subscribing |
| Examples | `http.get()`, `of()`, `from()`, `interval()` | `fromEvent(document, 'click')`, `Subject`, `BehaviorSubject` |

```typescript
// Cold Observable Example: HTTP GET / interval
const cold$ = new Observable(subscriber => {
  // New Random ID generated for EACH subscriber!
  subscriber.next(Math.random());
});

cold$.subscribe(v => console.log('Sub 1:', v)); // Sub 1: 0.428
cold$.subscribe(v => console.log('Sub 2:', v)); // Sub 2: 0.912

// Hot Observable via share() / Subject
const hot$ = cold$.pipe(share());

hot$.subscribe(v => console.log('Hot Sub 1:', v)); // Shared value
hot$.subscribe(v => console.log('Hot Sub 2:', v)); // Shared value
```

---

### Q3. What are Observable Creation Operators?

**Answer:**

```typescript
import { of, from, interval, timer, defer } from 'rxjs';

// 1. of(): Emits arguments as values synchronously, then completes
const of$ = of(1, 2, 3); // 1, 2, 3 -> Complete

// 2. from(): Converts Array, Promise, Iterable, or Generator to Observable
const array$ = from([10, 20, 30]);
const promise$ = from(fetch('/api/data').then(r => r.json()));

// 3. interval(): Emits sequential numbers periodically
const clock$ = interval(1000); // 0, 1, 2, 3... every 1s

// 4. timer(): Wait initial delay, then emit (optionally repeat)
const delay$ = timer(2000); // Wait 2s, emit 0, complete
const periodic$ = timer(2000, 1000); // Wait 2s, then emit every 1s

// 5. defer(): Factory function evaluated lazily at subscription time
const deferred$ = defer(() => of(new Date()));
```

---

## 📝 Quick Reference

```typescript
// Anatomy of Subscription
const subscription = observable$.subscribe({
  next: (val) => {},
  error: (err) => {},
  complete: () => {}
});

// Always clean up subscriptions!
subscription.unsubscribe();
```

---

*Senior UI Developer Interview Prep — RxJS Observables*
