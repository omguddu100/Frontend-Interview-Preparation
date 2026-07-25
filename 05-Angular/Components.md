# 🧩 Angular Components — Interview Q&A

> **Category:** Angular | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 🔵 Component Fundamentals

---

### Q1. What is an Angular Component and how is it defined?

**Answer:**
A component is the fundamental building block of an Angular application UI. It consists of:
1. **TypeScript Class**: Handles logic and state.
2. **HTML Template**: Defines the view.
3. **CSS/SCSS Styles**: Encapsulated styling.
4. **Metadata Decorator (`@Component`)**: Configures selector, template, styles, imports, etc.

```typescript
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-greeting',
  standalone: true,
  template: `
    <div class="greeting">
      <h2>Hello, {{ name() }}!</h2>
      <button (click)="onGreet.emit('Logged')">Greet</button>
    </div>
  `,
  styles: [`
    .greeting { padding: 1rem; border-radius: 8px; background: #f4f4f5; }
  `]
})
export class GreetingComponent {
  // Signal inputs & outputs (Angular 17+)
  name = input.required<string>();
  onGreet = output<string>();
}
```

---

### Q2. What are input() and output() signals vs @Input and @Output decorators?

**Answer:**

| Feature | Legacy `@Input()` / `@Output()` | Modern `input()` / `output()` Signals |
|---|---|---|
| Introduced | Angular 2+ | Angular 17.1+ / 17.3+ |
| Reactive Type | Normal property | `Signal<T>` |
| Required Inputs | `@Input({ required: true })` | `input.required<T>()` |
| Transforms | `@Input({ transform: booleanAttribute })` | `input(false, { transform: booleanAttribute })` |
| Output type | `EventEmitter<T>` | `OutputEmitterRef<T>` |
| Type Safety | Moderate | Superior inferencing |

```typescript
// Modern Signal Input/Output
export class UserProfileComponent {
  userId = input.required<string>(); // Signal<string>
  role = input<string>('user'); // Signal<string> with default
  save = output<User>(); // OutputEmitterRef<User>

  onSave(user: User) {
    this.save.emit(user);
  }
}
```

---

### Q3. Explain ViewEncapsulation modes in Angular.

**Answer:**
ViewEncapsulation controls how component styles affect the rest of the DOM:

1. **`ViewEncapsulation.Emulated` (Default)**:
   - Emulates Shadow DOM by adding unique attributes (`_ngcontent-c12`) to component elements and scoping CSS rules to those attributes.
2. **`ViewEncapsulation.ShadowDom`**:
   - Uses native browser Shadow DOM. Styles are completely isolated inside a shadow root.
3. **`ViewEncapsulation.None`**:
   - Component styles leak globally into the DOM head without attribute scoping.

---

## 🟡 Advanced Component Patterns

---

### Q4. What is Content Projection (`<ng-content>`) and multi-slot projection?

**Answer:**
Content projection allows passing HTML templates from a parent component into a child component's view.

```typescript
// Card Component (Child)
@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="card">
      <header class="card-header">
        <ng-content select="[card-title]"></ng-content>
      </header>
      <main class="card-body">
        <ng-content></ng-content> <!-- Default slot -->
      </main>
    </div>
  `
})
export class CardComponent {}

// Usage in Parent:
// <app-card>
//   <h2 card-title>User Profile</h2>
//   <p>This is the main card body content.</p>
// </app-card>
```

---

### Q5. What is host binding (`host` property vs `@HostBinding` / `@HostListener`)?

**Answer:**
Modern Angular prefers configuring host elements directly inside the `@Component` decorator metadata rather than using `@HostBinding` / `@HostListener` decorators.

```typescript
// ✅ Modern approach (Angular 15+)
@Component({
  selector: 'button[appButton]',
  standalone: true,
  template: `<ng-content />`,
  host: {
    '[class.btn-active]': 'isActive()',
    '[attr.aria-disabled]': 'disabled()',
    '(click)': 'handleClick($event)',
    'role': 'button'
  }
})
export class ButtonComponent {
  isActive = signal(false);
  disabled = input(false);

  handleClick(event: MouseEvent) {
    if (this.disabled()) event.preventDefault();
  }
}
```

---

## 📝 Quick Reference

```typescript
// Component Creation API
@Component({
  selector: 'app-sample',
  standalone: true,
  imports: [ChildComponent],
  template: `...`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: { '[class.active]': 'isActive()' }
})
export class SampleComponent {
  // Inputs/Outputs
  id = input.required<string>();
  name = input('Guest');
  changed = output<string>();
}
```

---

*Senior UI Developer Interview Prep — Angular Components*
