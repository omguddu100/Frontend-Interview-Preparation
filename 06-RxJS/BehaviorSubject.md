# 🔄 RxJS BehaviorSubject — Interview Q&A

> **Category:** RxJS | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 🔵 Fundamentals

---

### Q1. What is a BehaviorSubject in RxJS?

**Answer:**
A **BehaviorSubject** is a specialized variant of a Subject that represents a "value over time" with **state**.

Key Characteristics:
1. **Requires an Initial Value**: Must be instantiated with a default initial value (`new BehaviorSubject(initialValue)`).
2. **Stores Current Value**: Retains the latest emitted value, which can be retrieved synchronously via `.getValue()`.
3. **Emits Immediately On Subscription**: Any new subscriber instantly receives the latest emitted value upon subscribing.

```typescript
import { BehaviorSubject } from 'rxjs';

// Initialized with default state
const user$ = new BehaviorSubject<string>('Guest');

// Subscriber A subscribes immediately -> receives 'Guest'
user$.subscribe(val => console.log('Sub A:', val)); // Output: Sub A: Guest

// Emit new value
user$.next('Alice'); // Output: Sub A: Alice

// Subscriber B subscribes LATER -> receives 'Alice' immediately!
user$.subscribe(val => console.log('Sub B:', val)); // Output: Sub B: Alice

// Synchronous access to current value
console.log('Current:', user$.getValue()); // Output: Current: Alice
```

---

### Q2. Subject vs BehaviorSubject.

**Answer:**

| Feature | Subject | BehaviorSubject |
|---|---|---|
| Initial Value | No initial value | Required initial value |
| Late Subscriber | Receives NO values emitted before subscribing | Instantly receives the LATEST emitted value |
| Synchronous Value Access | Cannot read current value synchronously | `.getValue()` returns current state |
| Primary Use Case | Event notifications (Button click, Toast alert) | Application State Management (User Auth, Cart State) |

---

### Q3. How do you implement a Simple RxJS State Store using BehaviorSubject?

**Answer:**

```typescript
interface UserState {
  user: User | null;
  loading: boolean;
}

const initialState: UserState = {
  user: null,
  loading: false
};

@Injectable({ providedIn: 'root' })
export class UserService {
  private state$ = new BehaviorSubject<UserState>(initialState);

  // Expose specific slices as Observables
  user$ = this.state$.pipe(map(s => s.user), distinctUntilChanged());
  loading$ = this.state$.pipe(map(s => s.loading), distinctUntilChanged());

  // Update State immutably
  setUser(user: User) {
    const currentState = this.state$.getValue();
    this.state$.next({
      ...currentState,
      user,
      loading: false
    });
  }
}
```

---

## 📝 Quick Reference

```typescript
// Instantiation
const state$ = new BehaviorSubject<T>(initialValue);

// Access
const currentVal = state$.getValue(); // Sync read
state$.next(newValue);                 // Emit new state
```

---

*Senior UI Developer Interview Prep — RxJS BehaviorSubject*
