# 🛡️ Angular Route Guards — Interview Q&A

> **Category:** Angular | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 🔵 Fundamentals

---

### Q1. What are Route Guards in Angular and what types exist?

**Answer:**
Route Guards control navigation access to/from routes based on business conditions (e.g., authentication, permissions, unsaved form changes).

Types:
1. **`canActivate`**: Determines if a route can be navigated to.
2. **`canActivateChild`**: Determines if child routes of a route can be navigated to.
3. **`canDeactivate`**: Determines if user can navigate AWAY from the current route (e.g., warn unsaved changes).
4. **`canMatch`**: Determines if a route definition matches (used for feature flags / permissions before loading code).

---

### Q2. Class-Based Guards (Legacy) vs Functional Guards (Modern Angular 15+).

**Answer:**

| Aspect | Class-Based Guard (Legacy) | Functional Guard (Modern) |
|---|---|---|
| Introduced | Angular 2+ (Deprecated in 15+) | Angular 14/15+ |
| Syntax | Class implementing `CanActivate` interface | Pure function returning `boolean \| UrlTree \| Observable` |
| Boilerplate | High (class, `@Injectable`, interface) | Low (single arrow function) |
| Dependency Injection | Constructor DI | `inject()` function inside guard body |

```typescript
// ✅ Modern Functional Guard
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Redirect to login with return URL
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

// Route Configuration:
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [authGuard]
}
```

---

## 🟡 Advanced Guard Patterns

---

### Q3. How to implement a `canDeactivate` Guard for unsaved forms?

**Answer:**

```typescript
export interface ComponentWithUnsavedChanges {
  hasUnsavedChanges(): boolean;
}

export const pendingChangesGuard: CanDeactivateFn<ComponentWithUnsavedChanges> = (component) => {
  if (component.hasUnsavedChanges()) {
    return confirm('You have unsaved changes. Do you really want to leave?');
  }
  return true;
};
```

---

### Q4. What is `canMatch` vs `canActivate`?

**Answer:**
- **`canActivate`**: Downloads the route JS bundle, THEN evaluates permission. If false, navigation fails.
- **`canMatch`**: Evaluates permission BEFORE downloading the bundle. If false, skips this route definition and continues searching down the route configuration list. (Ideal for role-based route switching and saving bandwidth).

---

## 📝 Quick Reference

```typescript
// Functional Guard Signatures
export const myGuard: CanActivateFn = (route, state) => {
  const service = inject(MyService);
  return service.isValid() ? true : inject(Router).parseUrl('/login');
};

export const matchGuard: CanMatchFn = (route, segments) => true;
export const leaveGuard: CanDeactivateFn<MyComp> = (comp) => !comp.isDirty();
```

---

*Senior UI Developer Interview Prep — Angular Guards*
