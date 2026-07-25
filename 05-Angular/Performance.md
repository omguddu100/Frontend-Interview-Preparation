# 🚀 Angular Performance Optimization — Interview Q&A

> **Category:** Angular | **Level:** Advanced
> **Last Updated:** 2026-07-26

---

## 🔵 Core Optimization Techniques

---

### Q1. Top performance optimization strategies in Angular?

**Answer:**

1. **Signals & Fine-Grained Reactivity**: Use Signals instead of heavy Zone.js change detection.
2. **`ChangeDetectionStrategy.OnPush`**: Avoid default top-down change detection sweeps.
3. **Deferrable Views (`@defer`)**: Lazy load non-critical component templates when scrolled into view or idle.
4. **Standalone & Tree-Shaking**: Use Standalone Components to eliminate `NgModule` overhead and enable effective dead-code elimination.
5. **Track By in Loops**: Always use `@for (item of list; track item.id)` to avoid re-rendering entire list DOM elements.
6. **`NgOptimizedImage`**: Use `@angular/common` `NgOptimizedImage` directive (`ngSrc`) for automatic LCP optimization, responsive `srcset` generation, and lazy loading.
7. **Web Workers**: Offload heavy computational loops (image processing, sorting 100k items) outside the main UI thread.

---

## 🟡 Deferrable Views (`@defer`)

---

### Q2. What are Deferrable Views (`@defer`) in Angular 17+?

**Answer:**
`@defer` allows lazy loading a section of a template (and its associated components, directives, pipes, and CSS) based on explicit triggers.

```html
<!-- Defer loading of heavy comments until user scrolls to them -->
@defer (on viewport) {
  <app-heavy-comments [postId]="post.id" />
} @placeholder {
  <div class="skeleton">Scroll down to view comments</div>
} @loading (after 100ms; minimum 500ms) {
  <app-spinner />
} @error {
  <p>Failed to load comments</p>
}
```

---

### Q3. What `@defer` triggers exist?

**Answer:**

- **`on idle` (Default)**: Defers loading until the browser enters an idle state (`requestIdleCallback`).
- **`on viewport`**: Defers loading until the placeholder enters the browser viewport (uses `IntersectionObserver`).
- **`on interaction`**: Defers loading until user clicks or types in the placeholder.
- **`on hover`**: Defers loading when user hovers over placeholder.
- **`on immediate`**: Begins fetching immediately after the main view finishes rendering.
- **`when condition`**: Defers loading until a custom boolean / signal evaluates to `true`.

---

## 📝 Quick Reference

```html
<!-- @defer Block Syntax -->
@defer (on viewport; prefetch on idle) {
  <app-heavy-chart />
} @placeholder {
  <div>Chart Placeholder</div>
} @loading {
  <div>Loading...</div>
}
```

---

*Senior UI Developer Interview Prep — Angular Performance Optimization*
