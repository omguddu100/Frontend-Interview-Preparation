# 📼 RxJS ReplaySubject — Interview Q&A

> **Category:** RxJS | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 🔵 Fundamentals

---

### Q1. What is a ReplaySubject in RxJS?

**Answer:**
A **ReplaySubject** records multiple past values emitted by the stream and replays them to any new subscriber upon subscribing.

Unlike `BehaviorSubject`:
- It does **NOT** require an initial value.
- It can replay **N previous values** (buffer size), rather than just 1 value.
- It can limit replay memory by **time window** (windowTime in ms).

```typescript
import { ReplaySubject } from 'rxjs';

// Buffer size of 3 (Replays last 3 values to new subscribers)
const history$ = new ReplaySubject<number>(3);

history$.next(1);
history$.next(2);
history$.next(3);
history$.next(4);

// Subscriber arrives LATER -> gets last 3 values (2, 3, 4)
history$.subscribe(val => console.log('Sub A:', val));
// Output:
// Sub A: 2
// Sub A: 3
// Sub A: 4
```

---

### Q2. ReplaySubject Time Window (Windowing).

**Answer:**
You can specify both a buffer size AND a time window parameter to replay values emitted only within the last $X$ milliseconds.

```typescript
// Replay up to 100 items emitted within the last 500ms
const recentLogs$ = new ReplaySubject<string>(100, 500);

recentLogs$.next('Log 1');

setTimeout(() => recentLogs$.next('Log 2'), 200);
setTimeout(() => recentLogs$.next('Log 3'), 400);

// Subscriber arrives at 600ms -> Log 1 expired (>500ms ago), receives Log 2 & Log 3!
setTimeout(() => {
  recentLogs$.subscribe(val => console.log('Recent:', val));
}, 600);
```

---

## 🟡 Comparison Table

---

### Q3. Subject vs BehaviorSubject vs ReplaySubject vs AsyncSubject.

**Answer:**

| Subject Variant | Initial Value Required? | Replayed Values on Subscribe | When Emitted to Subscriber |
|---|---|---|---|
| **Subject** | No | 0 | Only values emitted *after* subscription |
| **BehaviorSubject** | **Yes** | 1 (The latest value) | Immediately on subscribe + future emissions |
| **ReplaySubject** | No | **N values** (Configurable buffer / time) | Immediately on subscribe (buffered) + future emissions |
| **AsyncSubject** | No | 1 (The final value) | **ONLY upon completion** (`.complete()`) |

---

## 📝 Quick Reference

```typescript
// ReplaySubject Signatures
const buffer$ = new ReplaySubject<T>(bufferSize);
const timeBuffer$ = new ReplaySubject<T>(bufferSize, windowTimeMs);
```

---

*Senior UI Developer Interview Prep — RxJS ReplaySubject*
