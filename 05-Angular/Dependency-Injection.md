# 💉 Angular Dependency Injection — Interview Q&A

> **Category:** Angular | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 🔵 Fundamentals

---

### Q1. What is Dependency Injection (DI) in Angular?

**Answer:**
Dependency Injection is a design pattern where a class requests dependencies from external sources rather than creating them itself.

Angular has a built-in **Hierarchical Dependency Injection** framework consisting of:
1. **Injector**: The container that holds instances and resolves dependencies.
2. **Provider**: Configures the Injector on *how* to create an instance for a given Token.
3. **Token**: The lookup key used by the Injector (`InjectionToken` or Class type).
4. **Dependant**: The component/service requesting the dependency.

---

### Q2. Constructor Injection vs `inject()` Function.

**Answer:**

| Feature | Constructor Injection | `inject()` Function |
|---|---|---|
| Introduced | Angular 2+ | Angular 14+ |
| Syntax | `constructor(private api: ApiService) {}` | `private api = inject(ApiService);` |
| Inheritance | Child must pass params to `super()` | Child cleanly inherits without `super()` boilerplate |
| Context | Only inside constructor signature | Constructor context / initializers / functional guards |

```typescript
// Modern Angular standard: inject()
@Component({ ... })
export class UserListComponent {
  private userService = inject(UserService); // Clean & concise
  private route = inject(ActivatedRoute);
}
```

---

## 🟡 Hierarchical Injectors & Resolution Rules

---

### Q3. Explain Angular's Injector Hierarchy.

**Answer:**
Angular has two main injector hierarchies:

1. **EnvironmentInjector Hierarchy**:
   - `NullInjector`: Top root level. Throws error if token not found (unless `@Optional()`).
   - `ModuleInjector` / `RootInjector`: Configured via `@Injectable({ providedIn: 'root' })` or `bootstrapApplication({ providers: [...] })`. Singleton across app.
2. **ElementInjector Hierarchy**:
   - Created for every DOM element with a component or directive that has a `providers` or `viewProviders` array.

**Resolution Rule**: When a component requests a dependency, Angular starts searching at its local `ElementInjector`, moves UP through parent `ElementInjectors`, then falls back to `EnvironmentInjector` -> `RootInjector` -> `NullInjector`.

---

### Q4. What are `providedIn: 'root'`, `'any'`, and `'platform'`?

**Answer:**
- **`providedIn: 'root'`**: Registers service as a tree-shakeable singleton in the root EnvironmentInjector.
- **`providedIn: 'any'`**: Creates a unique instance in every lazy-loaded route environment injector.
- **`providedIn: 'platform'`**: Shared singleton across multiple Angular applications running on the same page.

---

### Q5. What are DI Resolution Modifiers (`@Optional`, `@Self`, `@SkipSelf`, `@Host`)?

**Answer:**

```typescript
export class Component {
  constructor(
    // 1. @Optional(): If dependency not found, returns null instead of throwing error
    @Optional() private logger: LoggerService | null,

    // 2. @Self(): Only looks in local ElementInjector (doesn't search parents)
    @Self() private localService: LocalService,

    // 3. @SkipSelf(): Starts searching from PARENT ElementInjector (ignores local)
    @SkipSelf() private parentService: ParentService,

    // 4. @Host(): Stops searching at the host component (useful for directives inside components)
    @Host() private hostComp: ParentComponent
  ) {}
}
```

---

## 🔴 Advanced DI Techniques

---

### Q6. Provider Configurations (`useClass`, `useValue`, `useFactory`, `useExisting`).

**Answer:**

```typescript
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

bootstrapApplication(AppComponent, {
  providers: [
    // 1. useClass: Substitute implementation
    { provide: LoggerService, useClass: AdvancedLoggerService },

    // 2. useValue: Inject static object / value
    { provide: APP_CONFIG, useValue: { apiUrl: 'https://api.com', timeout: 5000 } },

    // 3. useFactory: Dynamic creation with dependencies
    {
      provide: AuthService,
      useFactory: (http: HttpClient, config: AppConfig) => new AuthService(http, config),
      deps: [HttpClient, APP_CONFIG]
    },

    // 4. useExisting: Alias to existing token (no duplicate instance)
    { provide: OldLogger, useExisting: LoggerService }
  ]
});
```

---

## 📝 Quick Reference

```typescript
// Modern Injection Syntax
const service = inject(MyService);
const config = inject(APP_CONFIG, { optional: true, skipSelf: true });

// Provider Types:
// • { provide: Token, useClass: Class }
// • { provide: Token, useValue: value }
// • { provide: Token, useFactory: fn, deps: [...] }
// • { provide: Token, useExisting: Token }
```

---

*Senior UI Developer Interview Prep — Angular Dependency Injection*
