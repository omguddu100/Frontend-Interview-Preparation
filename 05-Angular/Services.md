# ⚙️ Angular Services — Interview Q&A

> **Category:** Angular | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 🔵 Fundamentals

---

### Q1. What is an Angular Service and why is it used?

**Answer:**
A service is a class with a specific, narrow purpose designed to separate business logic, state management, or API interaction from UI components.

Services promote:
1. **Reusability**: Shared across multiple components.
2. **Testability**: Easy to mock or stub in unit tests.
3. **Separation of Concerns**: Keeps components clean and focused purely on view rendering.

```typescript
import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);

  // Private state using Signals
  private itemsState = signal<CartItem[]>([]);

  // Public read-only signals & computed state
  items = this.itemsState.asReadonly();
  totalPrice = computed(() => this.items().reduce((sum, item) => sum + item.price * item.qty, 0));
  itemCount = computed(() => this.items().reduce((sum, item) => sum + item.qty, 0));

  addToCart(product: Product) {
    this.itemsState.update(items => {
      const existing = items.find(i => i.id === product.id);
      if (existing) {
        return items.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...items, { ...product, qty: 1 }];
    });
  }
}
```

---

### Q2. How do Singleton Services work vs Component-Scoped Services?

**Answer:**

- **Singleton Service (`providedIn: 'root'`)**:
  - Registered in the Root Injector.
  - Only ONE single instance exists across the whole application.
  - Tree-shakeable if not imported.
- **Component-Scoped Service (`providers: [MyService]`)**:
  - Registered inside a `@Component({ providers: [MyService] })`.
  - A NEW instance is created for each component instance.
  - Destroyed when the component instance is destroyed.

---

## 🟡 State Management Patterns in Services

---

### Q3. Modern Signal-Based Service vs BehaviorSubject (RxJS) Service.

**Answer:**

```typescript
// ❌ Legacy RxJS BehaviorSubject Pattern
@Injectable({ providedIn: 'root' })
export class RxjsStateService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  setUser(user: User) {
    this.userSubject.next(user);
  }
}

// ✅ Modern Signal-Based State Service
@Injectable({ providedIn: 'root' })
export class SignalStateService {
  private userState = signal<User | null>(null);

  // Expose as Readonly Signal
  user = this.userState.asReadonly();
  isLoggedIn = computed(() => !!this.user());

  setUser(user: User) {
    this.userState.set(user);
  }
}
```

---

## 📝 Quick Reference

```typescript
// Service Decorator Signature
@Injectable({
  providedIn: 'root' // Singleton, tree-shakeable
})
export class UserService {
  private http = inject(HttpClient);
  // Business logic & reactive state
}
```

---

*Senior UI Developer Interview Prep — Angular Services*
