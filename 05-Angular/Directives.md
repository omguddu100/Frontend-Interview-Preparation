# 🎯 Angular Directives — Interview Q&A

> **Category:** Angular | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 🔵 Fundamentals

---

### Q1. What are Directives in Angular and what types exist?

**Answer:**
Directives attach custom behavior to elements in Angular templates.

3 Types:
1. **Component Directives**: Directives with a template (`@Component()` inherits from `@Directive()`).
2. **Attribute Directives**: Change the appearance or behavior of an existing DOM element (e.g., `ngClass`, `ngStyle`, custom highlight directive).
3. **Structural Directives**: Alter DOM layout by adding, removing, or manipulating DOM nodes (e.g., `@if`, `@for`, `*ngIf`, `*ngFor`).

---

### Q2. Modern Built-In Control Flow vs Legacy Structural Directives (`*ngIf`, `*ngFor`).

**Answer:**

| Feature | Legacy Structural Directives | Modern Control Flow (Angular 17+) |
|---|---|---|
| Syntax | `*ngIf="cond"`, `*ngFor="let item of items"` | `@if (cond) {}`, `@for (item of items; track item.id) {}` |
| Imports required | Requires `NgIf`, `NgFor`, `CommonModule` | Built into compiler (No imports needed!) |
| Performance | Slower evaluation | Significantly faster execution |
| Track expression | Optional (`trackBy`) | **Required** in `@for` (`track item.id`) |
| Empty case | Manual `*ngIf` checks | `@empty` block built into `@for` |

```html
<!-- Modern Control Flow Syntax -->
@if (user(); as u) {
  <div class="user-card">{{ u.name }}</div>
} @else {
  <div class="placeholder">No user found</div>
}

@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
} @empty {
  <p>List is empty</p>
}
```

---

## 🟡 Custom Directives & Modern Composition

---

### Q3. How do you build a Custom Attribute Directive with Signal inputs?

**Answer:**

```typescript
import { Directive, ElementRef, inject, input, effect } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()'
  }
})
export class HighlightDirective {
  private el = inject(ElementRef);

  // Signal input for directive color
  highlightColor = input<string>('yellow', { alias: 'appHighlight' });

  constructor() {
    // React to highlightColor updates
    effect(() => {
      // Effect logic if needed
    });
  }

  onMouseEnter() {
    this.el.nativeElement.style.backgroundColor = this.highlightColor() || 'yellow';
  }

  onMouseLeave() {
    this.el.nativeElement.style.backgroundColor = '';
  }
}

// Usage in HTML:
// <p [appHighlight]="'cyan'">Hover over me!</p>
```

---

### Q4. What is Directive Composition API (Angular 15+)?

**Answer:**
The Directive Composition API allows applying multiple directives to a component host element **programmatically inside the component decorator**, reusing directive behaviors without class inheritance.

```typescript
@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective {
  text = input<string>('', { alias: 'appTooltip' });
}

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective {
  role = input.required<string>();
}

// Host Component combining directive behaviors cleanly!
@Component({
  selector: 'app-admin-button',
  standalone: true,
  hostDirectives: [
    {
      directive: TooltipDirective,
      inputs: ['appTooltip: tooltipText']
    },
    {
      directive: HasPermissionDirective,
      inputs: ['role: requiredRole']
    }
  ],
  template: `<button><ng-content /></button>`
})
export class AdminButtonComponent {}
```

---

## 📝 Quick Reference

```
Directive Types:
• Component Directive (With template)
• Attribute Directive (Modifies appearance/behavior)
• Structural Directive (Modifies DOM layout)

Directive Composition API:
hostDirectives: [
  DirectiveA,
  { directive: DirectiveB, inputs: ['inputA: aliasA'], outputs: ['outB'] }
]
```

---

*Senior UI Developer Interview Prep — Angular Directives*
