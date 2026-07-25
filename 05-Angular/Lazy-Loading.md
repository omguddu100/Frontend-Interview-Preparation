# 📦 Angular Lazy Loading — Interview Q&A

> **Category:** Angular | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 🔵 Fundamentals

---

### Q1. What is Lazy Loading in Angular and why is it essential?

**Answer:**
Lazy loading is an optimization technique that defers downloading JavaScript feature modules/components until the user navigates to their specific route.

Benefits:
1. **Reduces Initial Bundle Size**: Smaller initial main JS payload.
2. **Improves Core Web Vitals**: Dramatically speeds up First Contentful Paint (FCP) and Largest Contentful Paint (LCP).
3. **Saves Bandwidth**: Users only download code for views they actually visit.

---

### Q2. How do you Lazy-Load Standalone Components vs Routes?

**Answer:**

```typescript
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  // 1. Lazy load a single Standalone Component
  {
    path: 'reports',
    loadComponent: () => import('./reports/reports.component').then(m => m.ReportsComponent)
  },

  // 2. Lazy load an entire child routes configuration tree
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  }
];
```

---

## 🟡 Advanced Preloading Strategies

---

### Q3. What are Angular Preloading Strategies?

**Answer:**
Preloading downloads lazy-loaded routes **in the background after the initial application finishes loading**, giving users instant navigation without initial payload bloat.

Strategies:
1. **`NoPreloading` (Default)**: Don't preload any lazy routes.
2. **`PreloadAllModules`**: Preloads ALL lazy-loaded routes in background.
3. **Custom Preloading Strategy**: Preloads routes selectively based on network conditions or custom flags.

```typescript
// Configuring PreloadAllModules
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules))
  ]
});
```

---

### Q4. How do you implement a Custom Selective Preloading Strategy?

**Answer:**

```typescript
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NetworkAwarePreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Check if network connection is fast / not data saver mode
    const conn = (navigator as any).connection;
    if (conn && (conn.saveData || conn.effectiveType.includes('2g'))) {
      return of(null); // Skip preloading on slow networks
    }

    // Check custom route data flag
    if (route.data && route.data['preload'] === true) {
      return load();
    }
    return of(null);
  }
}
```

---

## 📝 Quick Reference

```typescript
// Lazy Loading Syntax
{ path: 'feature', loadComponent: () => import('./feature.component').then(m => m.Comp) }
{ path: 'feature-tree', loadChildren: () => import('./feature.routes').then(m => m.ROUTES) }

// Router Preloading Provider
provideRouter(routes, withPreloading(PreloadAllModules))
```

---

*Senior UI Developer Interview Prep — Angular Lazy Loading*
