# 📢 RxJS Subject — Interview Q&A

> **Category:** RxJS | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 🔵 Fundamentals

---

### Q1. What is a Subject in RxJS?

**Answer:**
A **Subject** is both an **Observable** and an **Observer**.

1. **As an Observer**: It has `.next(val)`, `.error(err)`, and `.complete()` methods to emit values manually.
2. **As an Observable**: Multiple subscribers can call `.subscribe()` to listen to its emitted values.

Subjects are **Hot** and **Multicasted** — all subscribers share the exact same execution path and data stream.

```typescript
import { Subject } from 'rxjs';

const subject = new Subject<number>();

// Subscriber 1
subject.subscribe(val => console.log('Sub A:', val));

// Subscriber 2
subject.subscribe(val => console.log('Sub B:', val));

// Emitting values to ALL current subscribers
subject.next(1); // Logs: Sub A: 1, Sub B: 1
subject.next(2); // Logs: Sub A: 2, Sub B: 2
```

---

### Q2. Subject vs Plain Observable.

**Answer:**

| Feature | Observable | Subject |
|---|---|---|
| Multicasting | Unicast (Each sub gets independent stream) | Multicast (Shared stream among all subs) |
| Producer Origin | Code inside `new Observable(...)` | External imperative calls (`subject.next(val)`) |
| State | Stateless | Maintains list of active subscribers |
| Usage | Data sources (HTTP, events, streams) | Event Busses, state notifications |

---

### Q3. How do you safely expose a Subject as a Read-Only Observable?

**Answer:**
Use the `.asObservable()` method to prevent external consumers from calling `.next()` on the Subject directly.

```typescript
export class EventBusService {
  // Private Subject for internal emissions
  private eventSubject = new Subject<string>();

  // Public read-only Observable for external consumers
  events$ = this.eventSubject.asObservable();

  triggerEvent(msg: string) {
    this.eventSubject.next(msg);
  }
}
```

---

## 📝 Quick Reference

```typescript
const subject = new Subject<T>();

// Producer side (Observer)
subject.next(value);
subject.error(err);
subject.complete();

// Consumer side (Observable)
const readOnly$ = subject.asObservable();
readOnly$.subscribe(val => {});
```

---

*Senior UI Developer Interview Prep — RxJS Subject*
