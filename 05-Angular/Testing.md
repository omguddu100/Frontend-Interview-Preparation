# 🧪 Angular Testing — Interview Q&A

> **Category:** Angular | **Level:** Intermediate → Advanced
> **Last Updated:** 2026-07-26

---

## 🔵 Component & Unit Testing

---

### Q1. How do you test Standalone Components with `TestBed`?

**Answer:**
`TestBed` initializes an isolated Angular testing environment for testing components, services, and directives.

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCardComponent } from './user-card.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent], // Standalone component imported directly!
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;

    // Set signal inputs (Angular 17+)
    fixture.componentRef.setInput('user', { id: '1', name: 'Alice' });
    fixture.detectChanges();
  });

  it('should create and display user name', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Alice');
  });
});
```

---

### Q2. How do you test HTTP Services using `HttpTestingController`?

**Answer:**

```typescript
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should fetch user by id', () => {
    const mockUser = { id: '123', name: 'Bob' };

    service.getUserById('123').subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('https://api.com/users/123');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser); // Emit mock response
  });
});
```

---

## 📝 Quick Reference

```typescript
// Test Inputs / Signals Setup
fixture.componentRef.setInput('inputName', value);

// HTTP Mocking Workflow
const req = httpMock.expectOne('/api/endpoint');
req.flush(mockResponseData);
httpMock.verify();
```

---

*Senior UI Developer Interview Prep — Angular Testing*
