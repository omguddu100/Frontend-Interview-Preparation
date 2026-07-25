# 🔄 Angular Lifecycle Hooks — Interview Q&A

> **Category:** Angular | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 🔵 Hook Execution Order & Fundamentals

---

### Q1. What are Angular Lifecycle Hooks and what is their execution order?

**Answer:**
Lifecycle hooks allow intercepting key events in a directive or component's lifecycle (creation, updates, destruction).

**Execution Sequence:**
1. **`constructor()`**: (Class instantiation, DI resolution. Inputs are NOT bound yet).
2. **`ngOnChanges()`**: Runs when data-bound `@Input()` properties change. Runs BEFORE `ngOnInit`.
3. **`ngOnInit()`**: Component initialized and `@Input()` properties set. Runs ONCE.
4. **`ngDoCheck()`**: Custom change detection cycle (runs on EVERY change detection check).
5. **`ngAfterContentInit()`**: Projected content (`<ng-content>`) initialized into component view. Runs ONCE.
6. **`ngAfterContentChecked()`**: Projected content checked by change detection.
7. **`ngAfterViewInit()`**: Component view and child views initialized (`ViewChild`). Runs ONCE.
8. **`ngAfterViewChecked()`**: Component view and child views checked by change detection.
9. **`ngOnDestroy()`**: Cleanup hook run right before component destruction.

---

### Q2. Compare `ngOnInit()` vs `constructor()`.

**Answer:**

| Feature | `constructor()` | `ngOnInit()` |
|---|---|---|
| Origin | ES6 TypeScript class constructor | Angular Lifecycle interface |
| Purpose | Inject dependencies via DI | Perform initial logic & API calls |
| Inputs state | `@Input()` values are `undefined` | `@Input()` values are populated |
| Best Practice | Keep lightweight (DI assignment only) | Heavy initialization (HTTP requests, subscriptions) |

---

## 🟡 Advanced Hooks & Modern Alternatives

---

### Q3. How do Signals change lifecycle hook requirements?

**Answer:**
With Signals (`input()`, `computed()`, `effect()`), traditional lifecycle hooks become largely unnecessary:
- **Replacing `ngOnChanges`**: Use `computed()` or `effect()` to react to input changes.
- **Replacing `ngOnInit`**: Signals can be initialized inline or with `computed()`.
- **Replacing `ngOnDestroy`**: Signal `effect()` automatically manages cleanup via `onCleanup()`, or subscriptions can use `takeUntilDestroyed()`.

```typescript
@Component({
  selector: 'app-user-detail',
  standalone: true,
  template: `<h2>{{ user()?.name }}</h2>`
})
export class UserDetailComponent {
  userId = input.required<string>();

  // Replaces ngOnInit / ngOnChanges logic reactively!
  user = rxResource({
    request: () => ({ id: this.userId() }),
    loader: ({ request }) => this.userService.getUser(request.id)
  });
}
```

---

### Q4. What is `afterNextRender` and `afterRender` (Angular 16+)?

**Answer:**
These SSR-safe rendering hooks run **only in the browser** after Angular has rendered the DOM.

- **`afterNextRender()`**: Runs ONCE after the next DOM render cycle. Ideal for initializing third-party JS libraries (e.g., Chart.js, D3) that require DOM nodes.
- **`afterRender()`**: Runs AFTER EVERY DOM render cycle. Ideal for manual DOM measurements.

```typescript
export class ChartComponent {
  @ViewChild('chartCanvas') canvas!: ElementRef<HTMLCanvasElement>;

  constructor() {
    // SSR-safe! Only runs in browser after DOM is painted
    afterNextRender(() => {
      new Chart(this.canvas.nativeElement, { type: 'line', data: {} });
    });
  }
}
```

---

## 📝 Quick Reference

```
Lifecycle Flow:
constructor -> ngOnChanges -> ngOnInit -> ngDoCheck
  -> ngAfterContentInit -> ngAfterContentChecked
  -> ngAfterViewInit -> ngAfterViewChecked
  -> ngOnDestroy

Browser-Only SSR Hooks:
• afterNextRender() (Runs once after next render)
• afterRender()     (Runs after every render)
```

---

*Senior UI Developer Interview Prep — Angular Lifecycle Hooks*
