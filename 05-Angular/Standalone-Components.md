# 🚀 Standalone Components — Interview Q&A

> **Category:** Angular | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 🔵 Basics

---

### Q1. What are Standalone Components in Angular?

**Answer:**
Standalone Components (introduced in Angular 14, standard in Angular 17+) allow building Angular applications **without `NgModules`**.

A component, directive, or pipe is standalone when `standalone: true` is set in its decorator metadata (or omitted in Angular 19+ where standalone is default). It explicitly declares its own dependencies inside its `imports` array.

```typescript
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [UserCardComponent, DatePipe],
  template: `
    @for (user of users(); track user.id) {
      <app-user-card [user]="user" />
    }
  `
})
export class UserListComponent {
  users = input.required<User[]>();
}
```

---

### Q2. How do you bootstrap a Standalone Angular application?

**Answer:**
Instead of `platformBrowserDynamic().bootstrapModule(AppModule)`, you use `bootstrapApplication()` with `providers` supplied via `provideX()` helper functions.

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
}).catch(err => console.error(err));
```

---

## 🟡 Advanced Patterns

---

### Q3. How do you Lazy-Load Standalone Components in Routing?

**Answer:**
You use `loadComponent` or `loadChildren` with `import()`.

```typescript
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes')
      .then(m => m.ADMIN_ROUTES) // Routes array for admin feature
  }
];
```

---

### Q4. How do you provide Services scoped to a Standalone Route?

**Answer:**
Routes can define their own `providers` array, scoping services only to that route branch and its children.

```typescript
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
    providers: [
      AdminService, // Scoped provider created when entering /admin
      provideHttpClient(withInterceptors([adminAuthInterceptor]))
    ],
    children: [
      { path: 'users', component: AdminUsersComponent }
    ]
  }
];
```

---

## 📝 Quick Reference

```
Standalone Architecture:
• Bootstrap: bootstrapApplication(AppComponent, { providers: [...] })
• Route Lazy Load: loadComponent: () => import('./path').then(m => m.Comp)
• Providers: provideRouter(), provideHttpClient(), provideAnimations()
• Dependencies: imports: [Component, Directive, Pipe, CommonModule]
```

---

*Senior UI Developer Interview Prep — Standalone Components*
