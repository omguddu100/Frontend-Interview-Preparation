# 🧪 Angular Pipes — Interview Q&A

> **Category:** Angular | **Level:** Beginner → Advanced
> **Last Updated:** 2026-07-26

---

## 🔵 Fundamentals

---

### Q1. What is an Angular Pipe and how is it used?

**Answer:**
Pipes are simple functions used in HTML templates to transform output data visually without altering the underlying data model.

```html
<!-- Built-in Pipes -->
<p>{{ birthday | date:'mediumDate' }}</p>
<p>{{ price | currency:'USD' }}</p>
<p>{{ user() | json }}</p>
<p>{{ name | uppercase }}</p>

<!-- Pipe Chaining -->
<p>{{ product.createdAt | date:'shortDate' | uppercase }}</p>
```

---

### Q2. Pure Pipes vs Impure Pipes.

**Answer:**

| Feature | Pure Pipe (Default) | Impure Pipe (`pure: false`) |
|---|---|---|
| Execution | Executes ONLY when a **primitive value** changes or an **object reference** changes | Executes on **EVERY change detection cycle** |
| Performance | Fast & efficient | Can cause heavy performance degradation if misused |
| Use Case | Pure math, string formatting, date formatting | Dynamic filtering on mutated arrays, data streams |

```typescript
// Pure Pipe (Default)
@Pipe({
  name: 'exponential',
  standalone: true,
  pure: true
})
export class ExponentialPipe implements PipeTransform {
  transform(value: number, exponent = 1): number {
    return Math.pow(value, exponent);
  }
}

// Impure Pipe
@Pipe({
  name: 'filterList',
  standalone: true,
  pure: false // Runs on every CD cycle
})
export class FilterListPipe implements PipeTransform {
  transform(items: any[], filter: string): any[] {
    if (!items || !filter) return items;
    return items.filter(item => item.name.includes(filter));
  }
}
```

---

## 🟡 Advanced Pipes & Async Handling

---

### Q3. What is AsyncPipe and how does it handle observables/promises?

**Answer:**
`AsyncPipe` (`async`) subscribes to an Observable or Promise and returns the latest value emitted. When the component is destroyed, `AsyncPipe` **automatically unsubscribes** to prevent memory leaks.

```html
<!-- AsyncPipe automatically manages subscription & unsubscription -->
@if (user$ | async; as user) {
  <div>{{ user.name }}</div>
}
```

*Note: With Signals (`toSignal()`), `AsyncPipe` usage is often replaced by reading signals directly in templates.*

---

## 📝 Quick Reference

```typescript
// Pipe Interface Signature
@Pipe({
  name: 'customPipe',
  standalone: true,
  pure: true // Default
})
export class CustomPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return transformedValue;
  }
}
```

---

*Senior UI Developer Interview Prep — Angular Pipes*
