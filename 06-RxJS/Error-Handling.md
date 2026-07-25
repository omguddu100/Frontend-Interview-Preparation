# 🚨 RxJS Error Handling — Interview Q&A

> **Category:** RxJS | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 🔵 Fundamentals

---

### Q1. How does Error Handling work in RxJS streams?

**Answer:**
When an error occurs in an Observable stream, the stream sends an `error` notification and **immediately terminates**. No further values will be emitted by that stream instance.

To handle errors without breaking the stream permanently, RxJS provides operators:
1. **`catchError`**: Intercepts an error and returns a fallback Observable (or re-throws).
2. **`retry`**: Resubscribes to the source Observable up to $N$ times upon error.
3. **`retryWhen` / `retry` with config**: Resubscribes with custom delay/exponential backoff strategy.

```typescript
import { of, catchError, retry } from 'rxjs';

http.get('/api/data').pipe(
  retry(3), // Retry up to 3 times on failure
  catchError(err => {
    console.error('API Error:', err);
    // Return fallback Observable stream so subscriber doesn't break
    return of({ items: [], fallback: true });
  })
).subscribe(data => console.log(data));
```

---

## 🟡 Advanced Error Patterns & Gotchas

---

### Q2. Where should `catchError` be placed in higher-order mappings (`switchMap` / `mergeMap`)?

**Answer:**
This is one of the most critical RxJS interview questions!

- **Outer Catch Error (WRONG for search/streams)**: Placing `catchError` on the outer pipe will catch the error, but **permanently dies/terminates the outer stream** (e.g., search box stops listening to input clicks forever).
- **Inner Catch Error (RIGHT)**: Placing `catchError` inside the inner Observable (`switchMap` pipe) catches the error for that single request and returns a fallback, leaving the outer stream active!

```typescript
// ❌ WRONG: Outer catch Error kills search control permanently on 1st error!
searchControl.valueChanges.pipe(
  switchMap(term => http.get(`/api/search?q=${term}`)),
  catchError(err => of([])) // Outer stream terminates! Search input is now DEAD!
);

// ✅ RIGHT: Inner catch Error preserves outer stream!
searchControl.valueChanges.pipe(
  switchMap(term =>
    http.get(`/api/search?q=${term}`).pipe(
      catchError(err => of([])) // Inner stream fails, returns [], outer stream stays ALIVE!
    )
  )
);
```

---

### Q3. Exponential Backoff Retry Strategy using `retry()`.

**Answer:**

```typescript
import { timer, retry } from 'rxjs';

http.get('/api/unstable').pipe(
  retry({
    count: 3,
    delay: (error, retryCount) => {
      console.log(`Retry attempt #${retryCount} after error:`, error.message);
      // Exponential backoff delay: 1s, 2s, 4s...
      return timer(Math.pow(2, retryCount - 1) * 1000);
    }
  }),
  catchError(err => of({ error: 'Service Unavailable' }))
);
```

---

## 📝 Quick Reference

```typescript
// Error Recovery Rule
source$.pipe(
  switchMap(val =>
    inner$.pipe(
      catchError(err => of(fallbackValue)) // Keep outer stream alive!
    )
  )
);
```

---

*Senior UI Developer Interview Prep — RxJS Error Handling*
