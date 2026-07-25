# 🏛️ Angular Architecture — Interview Q&A

> **Category:** Angular | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 🔵 Fundamentals

---

### Q1. What is Angular's high-level architecture?

**Answer:**
Angular is a component-based, opinionated web framework. Its core building blocks are:

1. **Components**: UI blocks defined by `@Component()` managing HTML template + logic.
2. **Templates**: Extended HTML syntax (`@if`, `@for`, property binding `[]`, event binding `()`).
3. **Services & Dependency Injection (DI)**: Business logic, state, and API communication decoupled from UI components.
4. **Directives**: Attach behavior to DOM elements (`@Directive()`).
5. **Pipes**: Transform template output (`@Pipe()`).
6. **Modules / Standalone**: Organization units (`@NgModule` or modern Standalone primitives).
7. **Routing**: Manages view navigation based on URL paths (`provideRouter`).

---

### Q2. How does Angular compilation work (JIT vs AoT)?

**Answer:**

| Feature | Just-In-Time (JIT) | Ahead-Of-Time (AoT) |
|---|---|---|
| When compiled | In browser at runtime | At build time (during `ng build`) |
| Bundle size | Larger (includes Angular compiler) | Smaller (compiler stripped out) |
| Bootstrapping | Slower | Faster |
| Security | Vulnerable to evaluation bugs | Safer (no runtime evaluation) |
| Standard | Development mode | Production standard (default since Angular 9) |

AoT compiles HTML templates and TypeScript code into efficient JS code instructions before the browser downloads them.

---

### Q3. What is Ivy engine and what benefits did it bring?

**Answer:**
Ivy is Angular's generation 3 rendering engine (introduced Angular 9). Key benefits:
- **Smaller bundle sizes**: Tree-shakeable engine instructions.
- **Faster compilation**: Incremental build support.
- **Better debugging**: Enhanced stack traces and runtime inspection (`ng.getComponent`).
- **Locality Principle**: Compiles components independently without needing global module context.
- Enabled modern features like **Standalone Components** and **Signals**.

---

## 🟡 Advanced Architectural Concepts

---

### Q4. Explain the Locality Principle in Angular.

**Answer:**
Locality means the Angular compiler (`ngtsc`) only needs information from the component itself and its declared metadata to generate runtime code. It does NOT need to analyze the entire application dependency graph.

**Why it matters:**
- Enables super-fast incremental builds.
- Makes third-party libraries independently compilable into npm packages.
- Formed the foundation for standalone components in Angular 14+.

---

### Q5. Modular vs Standalone Architecture — what is the modern standard?

**Answer:**
- **NgModule Architecture (Legacy/Classic)**: Grouped related components, directives, pipes, and providers into an `@NgModule`. High boilerplate and hidden dependency issues.
- **Standalone Architecture (Angular 14+ / Default in 17+)**: Components, directives, and pipes declare their own dependencies directly in the `imports` array.

```typescript
@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, UserAvatarComponent],
  template: `
    <div class="card">
      <app-user-avatar [url]="user.avatarUrl" />
      <h3>{{ user.name }}</h3>
    </div>
  `
})
export class UserCardComponent {
  @Input({ required: true }) user!: User;
}
```

---

## 📝 Quick Reference

```
Angular Architecture Core:
Component (UI & Controller) ──> Service (Data/Business Logic) ──> HTTP (Backend)
     │
     └──> Template (Directives, Pipes, Signals/RxJS)

Key Principles:
• Standalone First (No NgModules required)
• AoT Compilation by default
• Hierarchical Dependency Injection
• Unidirectional Data Flow
```

---

*Senior UI Developer Interview Prep — Angular Architecture*
