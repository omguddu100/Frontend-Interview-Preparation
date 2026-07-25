# ⏳ RxJS AsyncSubject — Interview Q&A

> **Category:** RxJS | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 🔵 Fundamentals

---

### Q1. What is an AsyncSubject in RxJS?

**Answer:**
An **AsyncSubject** is a variant of a Subject that **only emits its final value when the execution completes (`.complete()`)**.

If the stream does not complete, subscribers receive NOTHING. If it completes, all current and future subscribers receive only the last emitted value.

```typescript
import { AsyncSubject } from 'rxjs';

const asyncSub$ = new AsyncSubject<number>();

asyncSub$.subscribe(val => console.log('Sub A:', val));

asyncSub$.next(1);
asyncSub$.next(2);
asyncSub$.next(3);
// Nothing logged yet!

asyncSub$.complete(); // Execution completes!
// Output: Sub A: 3 (Only the last value is emitted on completion)

// Any NEW subscriber after completion instantly gets the final value 3
asyncSub$.subscribe(val => console.log('Sub B:', val));
// Output: Sub B: 3
```

---

### Q2. What are the primary use cases for AsyncSubject?

**Answer:**
- **Calculations / Computation Jobs**: Where you only care about the single final calculation result once the job finishes.
- **HTTP Request Caching Analogy**: Similar to how a Promise resolves once with its final response payload.

---

## 📝 Quick Reference

```typescript
const asyncSub$ = new AsyncSubject<T>();

asyncSub$.next(val1);
asyncSub$.next(val2); // Only this will be delivered
asyncSub$.complete(); // Triggers emission to all subscribers
```

---

*Senior UI Developer Interview Prep — RxJS AsyncSubject*
