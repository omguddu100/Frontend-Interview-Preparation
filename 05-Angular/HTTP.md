# 🌐 Angular HTTP & Interceptors — Interview Q&A

> **Category:** Angular | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 🔵 Fundamentals

---

### Q1. How do you configure HTTP Client in Standalone Angular?

**Answer:**
`HttpClient` is configured using `provideHttpClient()` in `main.ts` / `bootstrapApplication()`.

```typescript
// main.ts
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withFetch(), // Uses browser fetch API (SSR compatible)
      withInterceptors([authInterceptor, errorInterceptor])
    )
  ]
});
```

---

### Q2. Class-Based Interceptors vs Functional Interceptors.

**Answer:**

| Feature | Class Interceptor (Legacy) | Functional Interceptor (Modern) |
|---|---|---|
| Introduced | Angular 4.3+ (Deprecated in 15+) | Angular 15+ |
| Definition | Class implementing `HttpInterceptor` | Pure `HttpInterceptorFn` function |
| Configuration | `{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }` | `provideHttpClient(withInterceptors([authInterceptor]))` |
| Dependencies | Inject via constructor | Inject via `inject()` |

```typescript
// Modern Functional Auth Interceptor
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(authReq);
  }

  return next(req);
};
```

---

## 🟡 Advanced Resource & Async Patterns

---

### Q3. What is `rxResource` / `resource` (Angular 19+)?

**Answer:**
Angular 19 introduced `resource` and `rxResource` to directly bridge asynchronous data fetching (Promises or RxJS Observables) into Signals with automatic loading state management.

```typescript
import { Component, signal, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user',
  standalone: true,
  template: `
    @if (userResource.isLoading()) {
      <p>Loading user...</p>
    } @else if (userResource.error()) {
      <p>Error: {{ userResource.error() }}</p>
    } @else if (userResource.value()) {
      <h2>{{ userResource.value()?.name }}</h2>
    }
  `
})
export class UserComponent {
  private userService = inject(UserService);
  userId = signal('123');

  // Resource automatically refetches when userId signal changes!
  userResource = rxResource({
    request: () => ({ id: this.userId() }),
    loader: ({ request }) => this.userService.getUser(request.id)
  });
}
```

---

## 📝 Quick Reference

```typescript
// Functional Interceptor Signature
export const customInterceptor: HttpInterceptorFn = (req, next) => {
  const modifiedReq = req.clone({ ... });
  return next(modifiedReq).pipe(
    tap(event => { /* Log response */ }),
    catchError(err => { /* Handle error */ })
  );
};
```

---

*Senior UI Developer Interview Prep — Angular HTTP*
