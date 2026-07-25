# 🔒 Angular Security — Interview Q&A

> **Category:** Angular | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 🔵 Fundamentals

---

### Q1. How does Angular handle Cross-Site Scripting (XSS) prevention?

**Answer:**
Angular treats all values as untrusted by default. When values are inserted into the DOM via property binding (`[innerHTML]`, `[src]`, `[href]`), Angular automatically **sanitizes** them before rendering.

Sanitization Contexts:
1. **HTML**: Sanitizes unsafe elements (e.g., `<script>`, `onload`).
2. **Style**: Sanitizes CSS bindings.
3. **URL**: Sanitizes link targets (`javascript:` links).
4. **Resource URL**: Must be trusted for executable code (e.g., `<iframe>` sources).

```typescript
import { Component, inject, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-safe-content',
  standalone: true,
  template: `<div [innerHTML]="trustedHtml"></div>`
})
export class SafeContentComponent {
  private sanitizer = inject(DomSanitizer);
  trustedHtml!: SafeHtml;

  setUntrustedHtml(userRawHtml: string) {
    // ⚠️ Use bypassSecurityTrustHtml ONLY when HTML source is 100% verified server content!
    this.trustedHtml = this.sanitizer.bypassSecurityTrustHtml(userRawHtml);
  }
}
```

---

### Q2. How does Angular prevent Cross-Site Request Forgery (CSRF / XSRF)?

**Answer:**
Angular's `HttpClient` has built-in support for the Cookie-to-Header XSRF token pattern.

Mechanism:
1. Server sets a cookie named `XSRF-TOKEN` on the browser.
2. `HttpClient` reads the cookie value and attaches a header named `X-XSRF-TOKEN` to every mutating HTTP request (`POST`, `PUT`, `DELETE`).
3. Server validates that header matches token.

```typescript
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'MY-XSRF-COOKIE',
        headerName: 'X-MY-XSRF-HEADER'
      })
    )
  ]
});
```

---

## 📝 Quick Reference

```
Security Best Practices:
• Avoid direct DOM manipulation (ElementRef.nativeElement.innerHTML = ... Bypass sanitization!). Use Renderer2 or Angular property bindings.
• Use DomSanitizer carefully when bypassing security context.
• Implement Content Security Policy (CSP) headers on backend.
• Enable HTTP-Only, Secure, SameSite flags on auth cookies.
```

---

*Senior UI Developer Interview Prep — Angular Security*
