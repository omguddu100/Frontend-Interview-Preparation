# 🔗 Linked Signal (`linkedSignal`) — Interview Q&A

> **Category:** Angular | **Level:** Advanced
> **Last Updated:** 2026-07-26

---

## 🔵 Fundamentals

---

### Q1. What is `linkedSignal` in Angular (introduced in Angular 19)?

**Answer:**
`linkedSignal` is a special **writable signal whose value automatically resets/updates when a source signal changes**, while still allowing user mutations (`.set()` or `.update()`).

It solves the common architectural problem of **writable derived state** (e.g., selecting a option from a dropdown, but resetting the selected option whenever the available options list changes).

---

### Q2. What problem does `linkedSignal` solve over `computed()` and `effect()`?

**Answer:**

**The Problem before Angular 19:**
- `computed()` is **read-only**. You cannot call `.set()` on a `computed()` signal when a user selects a custom value.
- `effect()` to set a writable signal when another signal changes was an anti-pattern causing `allowSignalWrites` errors, multi-pass rendering cycles, and bugs.

**The Solution with `linkedSignal`:**
```typescript
import { signal, linkedSignal } from '@angular/core';

export class ProductComponent {
  // Source signal
  products = signal<string[]>(['Apple', 'Banana', 'Cherry']);

  // linkedSignal: Defaults to first product, but user can change it via .set()!
  selectedProduct = linkedSignal(() => this.products()[0]);

  onUserSelect(product: string) {
    this.selectedProduct.set(product); // User overrides value!
  }

  onResetProducts() {
    this.products.set(['Dragonfruit', 'Elderberry']);
    // Automatically resets selectedProduct to 'Dragonfruit'!
  }
}
```

---

## 🟡 Advanced Usage & Signatures

---

### Q3. What is the explicit `source` and `computation` signature of `linkedSignal`?

**Answer:**
When you need access to both the new source value AND the previous value of the linked signal, use the full object configuration signature:

```typescript
export class QuantitySelectorComponent {
  shippingOption = signal({ id: 'express', defaultQty: 5 });

  quantity = linkedSignal({
    source: this.shippingOption,
    computation: (source, previous) => {
      // Retain custom quantity if valid, else fallback to defaultQty
      if (previous && previous.value <= 10) {
        return previous.value;
      }
      return source.defaultQty;
    }
  });
}
```

---

### Q4. Summary comparison of Signal primitives.

**Answer:**

| Signal Type | Mutable (`.set()`) | Resets on source change? | Primary Use Case |
|---|---|---|---|
| `signal()` | ✅ Yes | ❌ No | Pure local component state |
| `computed()` | ❌ Read-Only | ✅ Yes | Purely derived state |
| `linkedSignal()` | ✅ Yes | ✅ Yes | State dependent on a prop/signal that user can override (dropdown selection, form input reset) |

---

## 📝 Quick Reference

```typescript
// Simple shorthand signature:
const selected = linkedSignal(() => options()[0]);

// Object signature (with access to previous value):
const qty = linkedSignal({
  source: item,
  computation: (source, prev) => source.defaultQty
});

// Mutate manually like a regular signal:
selected.set('Custom Choice');
```

---

*Senior UI Developer Interview Prep — Linked Signal*
