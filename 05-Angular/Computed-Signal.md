# 🧮 Computed Signal — Interview Q&A

> **Category:** Angular | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 🔵 Fundamentals

---

### Q1. What is a Computed Signal (`computed()`) in Angular?

**Answer:**
A `computed()` signal creates a **read-only signal** that derives its value from other signals.

Key characteristics:
1. **Lazy Evaluation**: The computation function is NOT executed until the signal is read for the first time.
2. **Memoization**: The calculated result is cached. Subsequent reads return the cached value until any underlying signal dependency changes.
3. **Dynamic Dependency Tracking**: Dependencies are automatically tracked dynamically during execution.

```typescript
import { signal, computed } from '@angular/core';

const qty = signal(2);
const price = signal(50);

// Computed signal
const total = computed(() => qty() * price());

console.log(total()); // 100

qty.set(3);
console.log(total()); // 150
```

---

### Q2. How does dynamic dependency tracking work in computed signals?

**Answer:**
Angular tracks dependencies *only for the branches of code actually executed* during the computation.

```typescript
const showDiscount = signal(false);
const price = signal(100);
const discount = signal(20);

const finalPrice = computed(() => {
  if (showDiscount()) {
    return price() - discount();
  }
  return price();
});

// Initially showDiscount is false.
// finalPrice ONLY tracks [showDiscount, price]. It does NOT track [discount].
// Changing discount.set(50) will NOT cause finalPrice to recalculate!
```

---

## 🟡 Advanced Behavior & Gotchas

---

### Q3. Why can you not mutate state inside a `computed()` signal?

**Answer:**
`computed()` functions MUST be **pure functions** without side-effects. Calling `.set()` or `.update()` on another signal inside a `computed()` callback throws an Angular error (`NG0600: Writing to signals is not allowed in computed`).

```typescript
// ❌ WRONG — Side effect in computed!
const badComputed = computed(() => {
  const result = count() * 2;
  otherSignal.set(result); // 💥 ERROR!
  return result;
});
```

---

### Q4. Computed Signal vs RxJS `map` / `combineLatest`.

**Answer:**

| Aspect | `computed()` Signal | RxJS `combineLatest` + `map` |
|---|---|---|
| Execution | Lazy (evaluates on read) | Eager (evaluates immediately on emission) |
| Syntax | Clean JS function calls (`sig1() + sig2()`) | Complex pipe operators |
| Subscriptions | No manual subscription required | Requires `async` pipe or `.subscribe()` |
| Glitch-Freedom | Guaranteed | Requires careful operator usage |

---

## 📝 Quick Reference

```typescript
// Computed Signal Signature
const derivedSignal = computed(() => {
  return signalA() + signalB();
}, { equal: customEqualFn });

// Properties:
// • Read-only: derivedSignal.set() does not exist!
// • Pure function: Must not produce side-effects
// • Memoized: Only re-evaluates when signal dependencies change
```

---

*Senior UI Developer Interview Prep — Computed Signal*
