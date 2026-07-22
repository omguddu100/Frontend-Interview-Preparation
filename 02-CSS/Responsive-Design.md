# 📱 CSS Responsive Design — Interview Q&A

> **Category:** CSS | **Level:** Beginner → Advanced
> **Last Updated:** 2026-07-22

---

## 🔵 Basics

---

### Q1. What is Responsive Web Design (RWD)?

**Answer:**
Responsive Web Design is an approach where web pages render well on all devices and screen sizes by using flexible layouts, images, and CSS media queries.

**Core pillars:**
1. **Fluid grids** — use `%` or `fr` instead of fixed `px`
2. **Flexible images** — `max-width: 100%`
3. **Media queries** — apply styles at breakpoints

```css
img { max-width: 100%; height: auto; } /* Flexible image */

@media (max-width: 768px) {
  .container { flex-direction: column; } /* Responsive layout */
}
```

---

### Q2. What is the viewport meta tag and why is it needed?

**Answer:**
Without this tag, mobile browsers zoom out to show the full desktop site (it "lies" about its width).

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

| Part | Meaning |
|------|---------|
| `width=device-width` | Use actual device width, not virtual width |
| `initial-scale=1` | Don't zoom in or out initially |

> ⚠️ Without this, media queries won't work correctly on mobile devices.

---

### Q3. What are CSS Media Queries?

**Answer:**
Media queries apply CSS rules conditionally based on device characteristics.

```css
/* Width-based */
@media (max-width: 768px)  { /* Mobile */ }
@media (min-width: 769px)  { /* Tablet+ */ }
@media (min-width: 1024px) { /* Desktop */ }

/* Device feature based */
@media (orientation: landscape)  { /* Landscape */ }
@media (prefers-color-scheme: dark) { /* Dark mode */ }
@media (prefers-reduced-motion: reduce) { /* Reduced motion */ }
@media (hover: hover) { /* Device supports hover */ }

/* Print */
@media print { .no-print { display: none; } }

/* Combined with AND */
@media (min-width: 768px) and (max-width: 1024px) { /* Tablet only */ }

/* Combined with OR (comma) */
@media (max-width: 600px), (orientation: portrait) { }
```

---

### Q4. What is Mobile-First vs Desktop-First design?

**Answer:**

| | Mobile-First | Desktop-First |
|--|-------------|---------------|
| Base styles | Written for **mobile** | Written for **desktop** |
| Media query direction | `min-width` (scale UP) | `max-width` (scale DOWN) |
| Performance | Better — mobile loads fewer overrides | Slightly worse for mobile |
| Recommended | ✅ Yes — industry standard | Use only for legacy |

```css
/* Mobile-First (min-width) */
.sidebar { display: none; }          /* Mobile: hidden */
@media (min-width: 1024px) {
  .sidebar { display: block; }       /* Desktop: shown */
}

/* Desktop-First (max-width) */
.sidebar { display: block; }         /* Desktop: shown */
@media (max-width: 1023px) {
  .sidebar { display: none; }        /* Mobile: hidden */
}
```

---

### Q5. What are common responsive breakpoints?

**Answer:**

| Name | Range | Target |
|------|-------|--------|
| **xs** | `< 576px` | Small phones |
| **sm** | `576px – 767px` | Large phones |
| **md** | `768px – 1023px` | Tablets |
| **lg** | `1024px – 1279px` | Small desktops |
| **xl** | `1280px – 1535px` | Desktops |
| **2xl** | `≥ 1536px` | Large screens |

```css
:root {
  --bp-sm: 576px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
}
```

> 💡 These are guidelines — use breakpoints where your **content breaks**, not specific device sizes.

---

## 🟡 Intermediate

---

### Q6. What is the difference between `em`, `rem`, `vw`, `vh`, and `%`?

**Answer:**

| Unit | Relative to | Use case |
|------|-------------|----------|
| `px` | Screen pixel | Fixed sizes |
| `em` | **Parent element** font-size | Component-level sizing |
| `rem` | **Root (`html`)** font-size | Global consistent sizing |
| `%` | Parent element | Fluid widths |
| `vw` | Viewport width | Full-width elements |
| `vh` | Viewport height | Full-height layouts |
| `svh` | Small viewport height | Mobile (avoids address bar issues) |
| `dvh` | Dynamic viewport height | Adapts to address bar show/hide |

```css
html { font-size: 16px; }

.box {
  font-size: 1.5rem;  /* 24px — relative to root */
  padding: 1em;       /* 24px — relative to this element's font-size */
  width: 80%;         /* Relative to parent */
  height: 100svh;     /* Full small viewport height — mobile safe */
}
```

---

### Q7. What is `clamp()` and how does it help with responsive design?

**Answer:**
`clamp(min, preferred, max)` returns a value that's constrained between a minimum and maximum. Perfect for fluid typography and spacing.

```css
/* Font size: min 16px, scales with viewport, max 32px */
h1 {
  font-size: clamp(1rem, 4vw, 2rem);
}

/* Padding: min 1rem, prefers 5%, max 2rem */
.container {
  padding: clamp(1rem, 5%, 2rem);
}

/* Width: min 300px, prefers 50%, max 600px */
.card {
  width: clamp(300px, 50%, 600px);
}
```

> ✅ `clamp()` replaces many media queries for fluid scaling.

---

### Q8. What is fluid typography and how do you implement it?

**Answer:**
Fluid typography scales smoothly between screen sizes without breakpoints.

```css
/* Method 1: clamp */
h1 { font-size: clamp(1.5rem, 4vw, 3rem); }

/* Method 2: viewport units + calc */
h1 { font-size: calc(1rem + 2vw); }

/* Method 3: CSS variables fluid scale */
:root {
  --step-0: clamp(1rem,     0.9rem + 0.4vw, 1.25rem);
  --step-1: clamp(1.25rem,  1.1rem + 0.6vw, 1.75rem);
  --step-2: clamp(1.5rem,   1.3rem + 1vw,   2.5rem);
}
```

---

### Q9. How do you create a responsive grid without media queries?

**Answer:**
Using CSS Grid with `auto-fit` and `minmax()`:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
```

This creates a grid that:
- Shows as many columns as fit at `≥ 250px`
- Automatically wraps to fewer columns on smaller screens
- **No media queries needed!**

---

### Q10. What is the Container Query and how is it different from Media Query?

**Answer:**

| | Media Query | Container Query |
|--|-------------|----------------|
| Based on | **Viewport** size | **Parent container** size |
| Use case | Page-level layout | Component-level responsive design |
| Problem it solves | Components don't know their container | Components adapt to where they're placed |

```css
/* Container Query */
.card-wrapper {
  container-type: inline-size; /* Define as a container */
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    flex-direction: row; /* Wide container → horizontal layout */
  }
}
```

> ✅ Now supported in all major browsers (Chrome 105+, Safari 16+, Firefox 110+).

---

### Q11. How do you handle responsive images?

**Answer:**

**1. `max-width: 100%` (basic):**
```css
img { max-width: 100%; height: auto; }
```

**2. `srcset` (resolution-based):**
```html
<img src="small.jpg"
     srcset="small.jpg 480w, medium.jpg 768w, large.jpg 1200w"
     sizes="(max-width: 600px) 480px, (max-width: 1000px) 768px, 1200px"
     alt="Responsive image">
```

**3. `<picture>` (art direction):**
```html
<picture>
  <source media="(min-width: 1024px)" srcset="desktop.webp" type="image/webp">
  <source media="(min-width: 768px)"  srcset="tablet.webp"  type="image/webp">
  <img src="mobile.jpg" alt="Responsive">
</picture>
```

---

## 🔴 Advanced

---

### Q12. What is `aspect-ratio` and how is it useful?

**Answer:**
`aspect-ratio` maintains a width-to-height ratio as the element resizes.

```css
/* 16:9 video embed */
.video-wrapper {
  aspect-ratio: 16 / 9;
  width: 100%;
}

/* Square profile picture */
.avatar {
  width: 80px;
  aspect-ratio: 1; /* 1:1 — always square */
}

/* Golden ratio card */
.card { aspect-ratio: 1.618 / 1; }
```

---

### Q13. What is the difference between `min-width`, `max-width`, and `width` for responsive containers?

**Answer:**
```css
/* Fluid — takes full width */
.container { width: 100%; }

/* Never shrinks below 320px, never grows above 1200px */
.container {
  width: 100%;
  min-width: 320px;
  max-width: 1200px;
  margin: 0 auto; /* Center it */
}

/* Modern approach */
.container {
  width: min(100% - 2rem, 1200px); /* min() picks the smaller value */
  margin-inline: auto;
}
```

---

### Q14. How do you handle `prefers-reduced-motion` for accessibility?

**Answer:**
Users with vestibular disorders can set "reduce motion" in their OS. You should respect it:

```css
/* Base: animations on */
.spinner { animation: spin 1s linear infinite; }

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;  /* Disable animation */
  }

  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### Q15. What is the `@media (hover: hover)` query and why is it useful?

**Answer:**
Detects if the **primary input device supports hovering** (mouse) vs. touch-only devices.

```css
/* Hover effects only on devices that support hover (mouse/trackpad) */
@media (hover: hover) {
  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  }
}

/* Touch devices: use :active instead */
@media (hover: none) {
  .card:active { background: rgba(0,0,0,0.05); }
}
```

> ✅ Prevents "sticky hover" bug on touch devices where `:hover` styles get stuck.

---

### Q16. How would you implement a responsive navigation pattern?

**Answer:**
```css
/* Mobile-first nav */
.nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-links {
  display: none; /* Hidden on mobile */
  flex-direction: column;
  gap: 8px;
}

.nav-links.is-open {
  display: flex; /* JS toggles this class */
}

.hamburger { display: block; }

/* Tablet+ */
@media (min-width: 768px) {
  .nav {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .nav-links {
    display: flex;         /* Always visible on desktop */
    flex-direction: row;
    gap: 24px;
  }

  .hamburger { display: none; } /* Hide burger on desktop */
}
```

---

## 📝 Quick Reference

```css
/* Viewport meta — always include! */
<meta name="viewport" content="width=device-width, initial-scale=1">

/* Mobile-first breakpoints */
@media (min-width: 576px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }

/* Fluid units */
clamp(min, preferred, max);
min(a, b) | max(a, b);
vw | vh | svh | dvh | cqi (container query inline size)

/* Responsive grid — no media queries */
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

/* User preferences */
@media (prefers-color-scheme: dark)   { }
@media (prefers-reduced-motion: reduce) { }
@media (hover: hover)                 { }
@media print                          { }
```

---

*Senior UI Developer Interview Prep — Responsive Design*
