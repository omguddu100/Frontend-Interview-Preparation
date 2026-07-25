# ⚙️ RxJS Operators — Interview Q&A

> **Category:** RxJS | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 🔵 Higher-Order Mapping Operators

---

### Q1. Compare `switchMap`, `mergeMap`, `concatMap`, and `exhaustMap`.

**Answer:**

| Operator | Inner Observable Handling | Cancellation Behavior | Best Use Case |
|---|---|---|---|
| **`switchMap`** | Cancels previous inner observable when new outer value arrives | **Cancels Previous** | Search Typeahead, Tab switching |
| **`mergeMap`** | Subscribes to ALL inner observables concurrently | **No Cancellation (Concurrent)** | Parallel background fetches, independent writes |
| **`concatMap`** | Queues inner observables and executes them sequentially | **Sequential Queue** | Order-dependent operations (Form steps, sequential saves) |
| **`exhaustMap`** | Ignores new outer values while current inner observable is active | **Ignores New (Lockout)** | Submit buttons, Login requests to prevent double submission |

```typescript
// 1. switchMap: Cancels previous HTTP request if user types again
searchTerm$.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => http.get(`/api/search?q=${term}`))
);

// 2. exhaustMap: Discards extra clicks until login request completes
loginClicks$.pipe(
  exhaustMap(() => http.post('/api/login', credentials))
);

// 3. concatMap: Ensures sequential save operations
saveQueue$.pipe(
  concatMap(item => http.post('/api/save', item))
);

// 4. mergeMap: Parallel fetching for multiple IDs
userIds$.pipe(
  mergeMap(id => http.get(`/api/users/${id}`))
);
```

---

## 🟡 Combination & Filtering Operators

---

### Q2. Compare `combineLatest`, `forkJoin`, `zip`, and `withLatestFrom`.

**Answer:**

- **`forkJoin([obs1$, obs2$])`**:
  - Waits for ALL input observables to **complete**, then emits an array of their **final** values. (Equivalent to `Promise.all`).
- **`combineLatest([obs1$, obs2$])`**:
  - Waits for all observables to emit at least ONCE, then emits an array of the **latest** value from each whenever ANY observable emits.
- **`withLatestFrom(obs2$)`**:
  - Primary stream drives emissions. When primary emits, it grabs the latest value from `obs2$`.
- **`zip(obs1$, obs2$)`**:
  - Pairs values strictly by index (1st with 1st, 2nd with 2nd).

```typescript
// forkJoin: Load page data once all complete
forkJoin({
  user: http.get('/api/user'),
  settings: http.get('/api/settings')
}).subscribe(({ user, settings }) => { ... });

// combineLatest: Reactive Filter Form
combineLatest([searchQuery$, categoryFilter$]).pipe(
  switchMap(([query, category]) => http.get(`/api/items?q=${query}&cat=${category}`))
);
```

---

### Q3. Rate Limiting: `debounceTime` vs `throttleTime` vs `auditTime` vs `sampleTime`.

**Answer:**

- **`debounceTime(300)`**: Waits for a quiet period of 300ms without emissions before emitting the latest value.
- **`throttleTime(300)`**: Emits immediately, then silences emissions for the next 300ms window.
- **`auditTime(300)`**: Waits 300ms after an emission, then emits the latest value in that window.
- **`sampleTime(300)`**: Periodically checks every 300ms and emits the latest value if one occurred.

---

## 📝 Quick Reference

```typescript
// Mapping Cheat Sheet:
// • switchMap  -> Cancel & Switch
// • mergeMap   -> Parallel
// • concatMap  -> Sequential Queue
// • exhaustMap -> Ignore until done

// Combination Cheat Sheet:
// • forkJoin      -> Promise.all (Final values on completion)
// • combineLatest -> Any latest emission
// • withLatestFrom-> Primary stream driven
```

---

*Senior UI Developer Interview Prep — RxJS Operators*
