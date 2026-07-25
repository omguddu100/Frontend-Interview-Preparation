# 📋 Angular Forms — Interview Q&A

> **Category:** Angular | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 🔵 Reactive Forms vs Template-Driven Forms

---

### Q1. Compare Reactive Forms vs Template-Driven Forms.

**Answer:**

| Feature | Reactive Forms (`ReactiveFormsModule`) | Template-Driven Forms (`FormsModule`) |
|---|---|---|
| Data Flow | Synchronous & explicit model | Asynchronous (`ngModel`) |
| Form Setup | Created in TypeScript class (`FormGroup`, `FormControl`) | Created in HTML template via directives |
| Validation | Defined in TypeScript (`Validators.required`) | Defined via HTML attributes (`required`, `minlength`) |
| Scalability | High (complex dynamic forms, nested controls) | Low to medium (simple forms) |
| Unit Testing | Simple (test class logic directly without DOM) | Harder (requires DOM testing) |

---

### Q2. How do Typed Reactive Forms work in Angular (Angular 14+)?

**Answer:**
Typed Reactive Forms ensure full type-safety for `FormControl`, `FormGroup`, `FormArray`, and form values.

```typescript
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
  rememberMe: FormControl<boolean>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="email" type="email" />
      <input formControlName="password" type="password" />
      <button [disabled]="form.invalid">Login</button>
    </form>
  `
})
export class LoginComponent {
  private fb = inject(NonNullableFormBuilder);

  form = this.fb.group<LoginForm>({
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [Validators.required, Validators.minLength(8)]),
    rememberMe: this.fb.control(false)
  });

  onSubmit() {
    if (this.form.valid) {
      // Fully typed! rawValue has type { email: string, password: string, rememberMe: boolean }
      const credentials = this.form.getRawValue();
      console.log(credentials.email);
    }
  }
}
```

---

## 🟡 Advanced Custom Validation & Async Validation

---

### Q3. How do you create Custom Validators and Async Validators?

**Answer:**

```typescript
import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, timer, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

// 1. Synchronous Custom Validator (e.g., Match Password)
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (password && confirmPassword && password !== confirmPassword) {
    return { passwordMismatch: true };
  }
  return null;
}

// 2. Asynchronous Custom Validator (e.g., Check Username Availability)
export function uniqueUsernameValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);

    return timer(400).pipe(
      switchMap(() => userService.checkUsernameExists(control.value)),
      map(exists => (exists ? { usernameTaken: true } : null)),
      catchError(() => of(null))
    );
  };
}
```

---

### Q4. What is `ControlValueAccessor` (CVA) and when is it used?

**Answer:**
`ControlValueAccessor` is an interface that acts as a bridge between Angular's Forms API and a native or custom HTML form element in the DOM. Implement CVA when building reusable custom form components (e.g., custom Star Rating, Datepicker, Toggle Switch).

```typescript
@Component({
  selector: 'app-star-rating',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StarRatingComponent),
      multi: true
    }
  ],
  template: `...`
})
export class StarRatingComponent implements ControlValueAccessor {
  rating = signal(0);
  disabled = signal(false);

  private onChange: (val: number) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: number): void {
    this.rating.set(value || 0);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  selectRating(star: number) {
    if (!this.disabled()) {
      this.rating.set(star);
      this.onChange(star);
      this.onTouched();
    }
  }
}
```

---

## 📝 Quick Reference

```typescript
// Typed Reactive Form Controls
const form = fb.group({
  name: fb.control('', { nonNullable: true, validators: [Validators.required] }),
  email: fb.control('', { validators: [Validators.email], asyncValidators: [asyncVal] })
});

// ControlValueAccessor methods:
// • writeValue(obj)
// • registerOnChange(fn)
// • registerOnTouched(fn)
// • setDisabledState(isDisabled)
```

---

*Senior UI Developer Interview Prep — Angular Forms*
