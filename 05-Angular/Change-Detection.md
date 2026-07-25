# ⚡ Angular Change Detection — Interview Q&A

> **Category:** Angular | **Level:** Advanced
> **Last Updated:** 2026-07-26

---

## 🔵 Fundamentals

---

### Q1. How does Angular Change Detection work under the hood?

**Answer:**
Change Detection is Angular's process of synchronizing the component's data model state with its HTML DOM view.

Two mechanisms power change detection:
1. **Zone.js (Traditional)**: Monkey-patches asynchronous browser APIs (`setTimeout`, `fetch`, event listeners). When an async operation finishes, Zone.js triggers a top-down re-evaluation of the component tree starting from the Root component.
2. **Signals / Zoneless (Modern Angular 18/19+)**: Fine-grained reactivity system where signals notify Angular of the precise node needing updates without scanning the entire component tree or relying on Zone.js.

---

### Q2. ChangeDetectionStrategy.Default vs ChangeDetectionStrategy.OnPush.

**Answer:**

| Feature | Default Strategy | OnPush Strategy |
|---|---|---|
| When it runs | On ANY async event in the application | ONLY when specific trigger criteria are met |
| Component tree check | Scans entire component tree top-down | Skips component subtree if not marked dirty |
| Performance | Sub-optimal for large apps | Highly optimized |

**OnPush Components ONLY re-evaluate when:**
1. An `@Input()` or `input()` signal reference changes.
2. An event listener bound inside the component template fires.
3. A Signal read inside the template emits a change.
4. An Observable bound via `AsyncPipe` emits.
5. Manually triggered via `ChangeDetectorRef.markForCheck()`.

```typescript
@Component({
  selector: 'app-user-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h2>{{ user().name }}</h2>`
})
export class UserCardComponent {
  user = input.required<User>();
}
```

---

## 🟡 Modern Zoneless Angular & Signals

---

### Q3. How do you configure a Zoneless Angular Application (Angular 18+)?

**Answer:**
`provideExperimentalZonelessChangeDetection()` removes `Zone.js` completely from your application bundle, reducing polyfill size and speeding up runtime performance.

```typescript
// main.ts (Zoneless Angular Setup)
import { bootstrapApplication } from '@angular/platform-browser';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes)
  ]
});
```

---

### Q4. ChangeDetectorRef methods (`markForCheck`, `detectChanges`, `detach`, `reattach`).

**Answer:**

- **`markForCheck()`**: Marks the component and all its parent components up to the root as dirty so they get checked in the current or next change detection cycle (essential for OnPush).
- **`detectChanges()`**: Immediately runs change detection on the current component and its children synchronously.
- **`detach()`**: Detaches the component view from the change detection tree (useful for heavy real-time data streaming components like live stock charts).
- **`reattach()`**: Re-attaches a detached component view back to the change detection tree.

---

## 📝 Quick Reference

```typescript
// OnPush Component Configuration
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// Manual CD Control
private cdr = inject(ChangeDetectorRef);
this.cdr.markForCheck(); // Schedule check
this.cdr.detectChanges(); // Run check synchronously
this.cdr.detach();       // Stop CD checks
```

---

*Senior UI Developer Interview Prep — Angular Change Detection*
