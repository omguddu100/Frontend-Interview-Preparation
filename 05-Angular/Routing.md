# 🛣️ Angular Routing — Interview Q&A

> **Category:** Angular | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 🔵 Fundamentals

---

### Q1. How does Angular Routing work in Standalone Applications?

**Answer:**
Routing maps URL paths to components. In standalone applications, routing is initialized using `provideRouter(routes)` inside `bootstrapApplication()`.

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'profile/:id',
    loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
  },
  { path: '**', loadComponent: () => import('./not-found.component').then(m => m.NotFoundComponent) }
];

// main.ts
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withViewTransitions())
  ]
});
```

---

### Q2. What is `withComponentInputBinding()` (Angular 16+)?

**Answer:**
`withComponentInputBinding()` automatically binds route parameters (`:id`), query parameters (`?query=foo`), and route data directly to component **inputs / signal inputs**.

```typescript
// Previously: Injected ActivatedRoute and subscribed to params/queryParams.
// Modern (withComponentInputBinding):
@Component({
  selector: 'app-profile',
  standalone: true,
  template: `<h2>User ID: {{ id() }}</h2>`
})
export class ProfileComponent {
  // Automatically bound from route path '/profile/:id'!
  id = input.required<string>();

  // Bound from query param '?filter=active'!
  filter = input<string>();
}
```

---

## 🟡 Advanced Routing & Features

---

### Q3. What is `withViewTransitions()`?

**Answer:**
Integrates the browser's native **View Transitions API** into Angular route transitions for smooth animations between pages without custom CSS animation libraries.

```typescript
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      routes,
      withViewTransitions({
        skipInitialTransition: true
      })
    )
  ]
});
```

---

### Q4. Route Resolvers (`resolve`) vs Signal-based Data Fetching.

**Answer:**
Route Resolvers fetch data BEFORE navigating to a route, preventing view rendering until data resolves.

```typescript
// Functional Route Resolver
export const userResolver: ResolveFn<User> = (route, state) => {
  const userService = inject(UserService);
  const id = route.paramMap.get('id')!;
  return userService.getUserById(id);
};

// Route Configuration:
{
  path: 'user/:id',
  component: UserComponent,
  resolve: { userData: userResolver }
}
```

---

## 📝 Quick Reference

```typescript
// Router Providers & Options
provideRouter(
  routes,
  withComponentInputBinding(), // Route params -> Signal inputs
  withViewTransitions(),       // Browser View Transitions
  withPreloading(PreloadAllModules) // Preloading strategy
)
```

---

*Senior UI Developer Interview Prep — Angular Routing*
