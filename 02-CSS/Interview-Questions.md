# 🎓 CSS Interview Questions — Master Compendium

> **Category:** CSS | **Level:** Senior UI Developer
> **Last Updated:** 2026-07-22
> **Covers:** All CSS topics in one place for quick revision

---

## 🗂️ Index

1. [Box Model & Fundamentals](#1-box-model--fundamentals)
2. [Selectors & Specificity](#2-selectors--specificity)
3. [Flexbox](#3-flexbox)
4. [CSS Grid](#4-css-grid)
5. [Positioning & Stacking](#5-positioning--stacking)
6. [Typography](#6-typography)
7. [Animations & Transitions](#7-animations--transitions)
8. [Responsive Design](#8-responsive-design)
9. [CSS Variables & Modern CSS](#9-css-variables--modern-css)
10. [Performance](#10-performance)
11. [Accessibility](#11-accessibility)
12. [Output-Based Questions](#12-output-based-questions)

---

## 1. Box Model & Fundamentals

---

### Q1. Explain the CSS Box Model.

**Answer:**
Every HTML element is a rectangular box with 4 layers:

```
┌──────────────── margin ─────────────────┐
│   ┌──────────── border ──────────────┐  │
│   │   ┌──────── padding ──────────┐  │  │
│   │   │   ┌──── content ───────┐  │  │  │
│   │   │   │   width × height   │  │  │  │
│   │   │   └────────────────────┘  │  │  │
│   │   └───────────────────────────┘  │  │
│   └───────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

- **Content** — actual text/image area
- **Padding** — transparent space inside border
- **Border** — edge around padding
- **Margin** — transparent space outside border (collapses with siblings!)

---

### Q2. What is `box-sizing` and what does `border-box` do?

**Answer:**

| `box-sizing` | Width includes |
|-------------|----------------|
| `content-box` (default) | Content only — padding/border **added on top** |
| `border-box` | Content + padding + border — total size stays fixed |

```css
/* ✅ Best practice — always add this */
*, *::before, *::after {
  box-sizing: border-box;
}

.box {
  width: 200px;
  padding: 20px;
  border: 2px solid black;
}

/* content-box: actual width = 200 + 40 + 4 = 244px */
/* border-box:  actual width = 200px (padding + border fit inside) */
```

---

### Q3. What is margin collapse and when does it happen?

**Answer:**
Margin collapse occurs when **vertical margins of adjacent block elements merge** into a single margin (the larger one wins). It does **not** collapse with Flexbox or Grid children.

```css
.a { margin-bottom: 30px; }
.b { margin-top: 20px; }
/* Space between a and b = 30px (not 50px!) */
```

**When it happens:**
1. Adjacent block siblings
2. Parent and first/last child (if no border/padding/overflow separates them)
3. Empty blocks

**How to prevent:**
- Add `overflow: hidden` or `overflow: auto` to parent
- Add `padding` or `border` to parent
- Use Flexbox or Grid (margins don't collapse in flex/grid context)

---

### Q4. What is the difference between `display: block`, `inline`, and `inline-block`?

**Answer:**

| | `block` | `inline` | `inline-block` |
|--|---------|----------|----------------|
| Takes full width | Yes | No | No |
| New line | Yes | No | No |
| Respects width/height | Yes | **No** | Yes |
| Respects vertical margin | Yes | **No** | Yes |
| Examples | `div`, `p`, `h1` | `span`, `a`, `em` | `img`, `button` |

```css
span { display: inline-block; width: 100px; } /* Now respects width! */
```

---

## 2. Selectors & Specificity

---

### Q5. What is the difference between `:nth-child` and `:nth-of-type`?

**Answer:**

```html
<div>
  <p>Para 1</p>     <!-- p:nth-child(1) ✓, p:nth-of-type(1) ✓ -->
  <span>Span</span> <!-- span:nth-child(2) -->
  <p>Para 2</p>     <!-- p:nth-child(3) ✓, p:nth-of-type(2) ✓ -->
</div>
```

| | `:nth-child(n)` | `:nth-of-type(n)` |
|--|-----------------|-------------------|
| Counts | All siblings | Only same-type siblings |
| More precise | No | Yes |

```css
p:nth-child(2)   { } /* Empty — 2nd child is span, not p */
p:nth-of-type(2) { } /* Matches "Para 2" — 2nd p element */
```

---

### Q6. What are CSS combinators?

**Answer:**

| Combinator | Symbol | Selects |
|------------|--------|---------|
| Descendant | ` ` (space) | All descendants |
| Child | `>` | Direct children only |
| Adjacent sibling | `+` | Immediately following sibling |
| General sibling | `~` | All following siblings |

```css
div p      { } /* All <p> inside div (any depth) */
div > p    { } /* Only direct <p> children of div */
h2 + p     { } /* First <p> immediately after h2 */
h2 ~ p     { } /* All <p> siblings after h2 */
```

---

## 3. Flexbox

---

### Q7. What does `flex: 1` mean?

**Answer:**
`flex: 1` is shorthand for `flex-grow: 1; flex-shrink: 1; flex-basis: 0%`. The item will grow to fill available space equally with siblings.

```css
/* Three equal-width columns */
.col { flex: 1; }

/* Sidebar + main layout */
.sidebar { flex: 0 0 250px; } /* Fixed, no grow/shrink */
.main    { flex: 1; }         /* Takes remaining space */
```

---

### Q8. How do you create a sticky footer layout with Flexbox?

**Answer:**
```css
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main   { flex: 1; } /* Grows to fill space, pushing footer down */
footer { } /* Stays at bottom */
```

---

## 4. CSS Grid

---

### Q9. What is the difference between `fr` and `%` in CSS Grid?

**Answer:**

| | `fr` | `%` |
|--|------|-----|
| Based on | Remaining space after fixed tracks | Total container size |
| With `gap` | ✅ Gap doesn't break layout | ❌ Percentage + gap can overflow |

```css
/* 3 columns + 20px gap — fr handles the math */
grid-template-columns: repeat(3, 1fr);
gap: 20px; /* Works perfectly */

/* % + gap = potential overflow */
grid-template-columns: repeat(3, 33.33%);
gap: 20px; /* Total > 100%, may overflow! */
```

---

### Q10. What is the shorthand `grid-area` and how do you use it?

**Answer:**
```css
/* Assign to a named area */
.header { grid-area: header; }

/* OR: shorthand for row-start / col-start / row-end / col-end */
.item {
  grid-area: 1 / 2 / 3 / 4; /* row 1, col 2, to row 3, col 4 */
}
```

---

## 5. Positioning & Stacking

---

### Q11. What is the stacking order without `z-index`?

**Answer:**
Browsers paint elements in this default order (bottom to top):
1. Root element background
2. Non-positioned block elements (in source order)
3. Floating elements
4. Inline elements
5. Positioned elements (non-static, no z-index) — in source order

```css
/* Later in HTML = painted on top when same stacking level */
<div class="a">A</div> <!-- Behind -->
<div class="b">B</div> <!-- In front (same specificity, later in source) -->
```

---

### Q12. What triggers a new stacking context?

**Answer:**
- `position` (not `static`) + `z-index` (not `auto`)
- `opacity < 1`
- `transform`, `filter`, `perspective`, `clip-path`
- `isolation: isolate`
- `will-change` with above properties
- `contain: layout | paint | strict`
- Root element (`<html>`)

---

## 6. Typography

---

### Q13. What is the difference between `em` and `rem` for font sizing?

**Answer:**
```css
html { font-size: 16px; }

.parent { font-size: 20px; }

.child-em  { font-size: 1.5em;  } /* 1.5 × 20px = 30px (parent!) */
.child-rem { font-size: 1.5rem; } /* 1.5 × 16px = 24px (root!) */
```

> ✅ Use `rem` for font sizes to avoid compounding effects.

---

### Q14. What is the `line-height` best practice?

**Answer:**
```css
/* ✅ Use unitless value — scales with font-size */
body { line-height: 1.5; } /* 1.5 × current font-size */

/* ❌ Avoid fixed units — doesn't scale */
body { line-height: 24px; }
```

---

## 7. Animations & Transitions

---

### Q15. What CSS properties are GPU accelerated?

**Answer:**
Only these properties are handled by the GPU compositor (no layout/paint):
- `transform` (translate, scale, rotate, skew)
- `opacity`
- `filter`

```css
/* ✅ Performant */
.slide { transition: transform 0.3s; transform: translateX(100px); }

/* ❌ Causes layout — forces reflow */
.slide { transition: left 0.3s; left: 100px; }
```

---

### Q16. How does the browser rendering pipeline relate to animation performance?

**Answer:**
```
JavaScript → Style → Layout → Paint → Composite

• Layout change  → full pipeline (expensive): width, height, top, left, margin
• Paint change   → skips Layout: background, color, box-shadow
• Composite only → skips Layout+Paint (best): transform, opacity
```

---

## 8. Responsive Design

---

### Q17. What is the difference between `100vw` and `100%`?

**Answer:**
```css
.full-width { width: 100%; }   /* 100% of parent element */
.full-vw    { width: 100vw; }  /* 100% of viewport width */

/* Problem: 100vw includes scrollbar width, can cause horizontal scroll */
/* Fix: */
.full-vw-safe {
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
}
```

---

### Q18. How do you implement a dark mode?

**Answer:**
```css
/* Method 1: prefers-color-scheme media query */
:root {
  --bg: #ffffff;
  --text: #111111;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #111111;
    --text: #ffffff;
  }
}

/* Method 2: data attribute (user toggle) */
:root                    { --bg: #fff; --text: #111; }
[data-theme="dark"] :root { --bg: #111; --text: #fff; }

body {
  background: var(--bg);
  color: var(--text);
}
```

---

## 9. CSS Variables & Modern CSS

---

### Q19. What are CSS Custom Properties (variables) and how do they work?

**Answer:**
```css
/* Define */
:root {
  --primary: #6366f1;
  --spacing-md: 16px;
  --radius: 8px;
}

/* Use */
.button {
  background: var(--primary);
  padding: var(--spacing-md);
  border-radius: var(--radius);
  color: var(--text, white); /* Fallback value */
}

/* Override in scope */
.dark-card {
  --primary: #818cf8; /* Overrides for this subtree */
}
```

**Key facts:**
- Cascade-aware and inheritable
- Can be changed with JavaScript
- Can be used in `calc()`

```javascript
document.documentElement.style.setProperty('--primary', '#ff0000');
```

---

### Q20. What is `@layer` in CSS?

**Answer:**
`@layer` creates named layers that control cascade priority — later layers win **regardless of specificity**.

```css
@layer reset, base, components, utilities;

@layer reset     { * { margin: 0; padding: 0; } }
@layer base      { body { font-family: sans-serif; } }
@layer components { .btn { padding: 8px 16px; } }
@layer utilities  { .p-4 { padding: 1rem; } }
/* utilities always wins even if specificity is lower */
```

---

## 10. Performance

---

### Q21. What causes layout thrashing and how do you prevent it?

**Answer:**
Layout thrashing happens when JavaScript reads then writes DOM properties in a loop, forcing the browser to recalculate layout repeatedly.

```javascript
// ❌ Layout thrashing — read/write alternating
for (let i = 0; i < boxes.length; i++) {
  boxes[i].style.width = boxes[i].offsetWidth + 10 + 'px'; // Read then write!
}

// ✅ Batch reads, then batch writes
const widths = boxes.map(box => box.offsetWidth); // All reads
boxes.forEach((box, i) => {
  box.style.width = widths[i] + 10 + 'px';         // All writes
});
```

---

### Q22. What is `contain` and `content-visibility` for CSS performance?

**Answer:**
```css
/* contain: isolates element from affecting outside layout */
.widget {
  contain: layout paint; /* Changes inside don't affect outside */
}

/* content-visibility: skips rendering off-screen content */
.card {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px; /* Placeholder height while off-screen */
}
/* Can dramatically speed up initial page load! */
```

---

## 11. Accessibility

---

### Q23. How do you visually hide content but keep it accessible to screen readers?

**Answer:**
```css
/* ✅ Accessible hide (screen reader can still read it) */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ❌ These hide from screen readers too */
.hidden   { display: none; }
.invisible { visibility: hidden; }
```

---

### Q24. What is `outline` and why should you not remove it without a replacement?

**Answer:**
`outline` shows keyboard focus on interactive elements. Removing it breaks accessibility for keyboard-only users.

```css
/* ❌ Never do this alone */
* { outline: none; }

/* ✅ Remove only for mouse, keep for keyboard */
:focus:not(:focus-visible) { outline: none; }
:focus-visible { outline: 2px solid #6366f1; outline-offset: 2px; }
```

---

## 12. Output-Based Questions

---

### Q25. What is the final color of the `<p>` element?

```html
<div id="box" class="container">
  <p class="text">Hello</p>
</div>
```
```css
p              { color: black; }       /* 0-0-0-1 */
.text          { color: blue; }        /* 0-0-1-0 */
div p          { color: green; }       /* 0-0-0-2 */
#box .text     { color: red; }         /* 0-1-1-0 */
.container .text { color: orange; }    /* 0-0-2-0 */
```

**Answer:** `red` — `#box .text` has specificity `0-1-1-0`, which beats all others.

---

### Q26. What is the computed width of `.box`?

```css
.box {
  box-sizing: content-box;
  width: 200px;
  padding: 20px;
  border: 5px solid black;
}
```

**Answer:** `250px` — in `content-box`, padding (40px) and border (10px) are **added** to width: `200 + 40 + 10 = 250px`.

---

### Q27. Will the transition work?

```css
.menu {
  display: none;
  opacity: 0;
  transition: opacity 0.3s;
}
.menu.active {
  display: block;
  opacity: 1;
}
```

**Answer:** **No.** `display` cannot be transitioned. The element jumps from hidden to visible instantly. Use `visibility + opacity` instead.

---

### Q28. What is the margin between Box A and Box B?

```css
.a { margin-bottom: 40px; }
.b { margin-top: 20px; }
```

**Answer:** `40px` — vertical margins collapse. The larger value wins.

---

## 📝 Top 10 Most Asked CSS Questions in Senior Interviews

1. Explain the CSS box model and `box-sizing: border-box`
2. Flexbox vs Grid — when do you use each?
3. How does CSS specificity work?
4. What is the difference between `position: absolute`, `fixed`, and `sticky`?
5. How do you optimize CSS for performance?
6. How do you implement dark mode?
7. What are CSS custom properties and how do they differ from SCSS variables?
8. How do you make a layout responsive without media queries?
9. What is `z-index` and what creates a stacking context?
10. How do you center an element (5 different ways)?

---

*Senior UI Developer Interview Prep — Complete CSS Q&A*
