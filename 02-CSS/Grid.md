# 🔲 CSS Grid — Interview Q&A

> **Category:** CSS | **Level:** Beginner → Advanced
> **Last Updated:** 2026-07-22

---

## 🔵 Basics

---

### Q1. What is CSS Grid and how is it different from Flexbox?

**Answer:**

| | CSS Grid | Flexbox |
|--|----------|---------|
| Dimensions | **Two-dimensional** (rows AND columns) | **One-dimensional** (row OR column) |
| Best for | Page layouts, complex 2D designs | Component-level alignment |
| Control | Precise placement in both axes | Flow-based layout |
| Item placement | Items placed in defined cells | Items flow naturally |

```css
/* Grid: 2D layout */
.grid { display: grid; grid-template-columns: repeat(3, 1fr); }

/* Flexbox: 1D layout */
.flex { display: flex; }
```

> 💡 **Rule of thumb:** Use Grid for the overall page layout, Flexbox for components within those layouts.

---

### Q2. What are `grid-template-columns` and `grid-template-rows`?

**Answer:**
They define the number and size of columns and rows in the grid.

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 1fr;  /* 3 columns: fixed, flexible, flexible */
  grid-template-rows: 100px auto 100px;  /* 3 rows: fixed, auto, fixed */
}
```

**Common patterns:**
```css
/* 3 equal columns */
grid-template-columns: repeat(3, 1fr);

/* Sidebar + main */
grid-template-columns: 250px 1fr;

/* Auto-fill responsive */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
```

---

### Q3. What is the `fr` unit in CSS Grid?

**Answer:**
`fr` (fraction) represents a fraction of the **available free space** in the grid container.

```css
.container {
  grid-template-columns: 1fr 2fr 1fr;
  /* Total: 4fr */
  /* Col 1: 25% | Col 2: 50% | Col 3: 25% */
}
```

Unlike `%`, `fr` distributes remaining space **after fixed-size** columns are accounted for:
```css
grid-template-columns: 200px 1fr; /* 200px fixed, rest goes to 1fr */
```

---

### Q4. What does `gap` (or `grid-gap`) do?

**Answer:**
`gap` sets the space between rows and columns in a grid.

```css
.container {
  display: grid;
  gap: 20px;           /* Same gap for rows and columns */
  gap: 20px 10px;      /* row-gap: 20px, column-gap: 10px */
  row-gap: 20px;
  column-gap: 10px;
}
```

> ✅ `gap` works in both Grid and Flexbox.

---

### Q5. What are grid lines, grid tracks, and grid cells?

**Answer:**

```
     1   2   3   4     ← Grid lines (vertical)
1  ┌───┬───┬───┐
   │   │   │   │  ← Grid track (column)
2  ├───┼───┼───┤
   │   │   │   │  ← Grid cell (intersection)
3  └───┴───┴───┘
```

| Term | Description |
|------|-------------|
| **Grid lines** | Dividing lines (numbered 1 to n+1) |
| **Grid track** | Space between two grid lines (a row or column) |
| **Grid cell** | Single unit at row/column intersection |
| **Grid area** | One or more cells combined |

---

## 🟡 Intermediate

---

### Q6. How do `grid-column` and `grid-row` work?

**Answer:**
They place a grid item at a specific position using grid line numbers.

```css
.item {
  grid-column: 1 / 3;  /* Start at line 1, end at line 3 (spans 2 columns) */
  grid-row: 1 / 2;     /* Start at line 1, end at line 2 */
}
```

**Using `span`:**
```css
.item {
  grid-column: 1 / span 2; /* Start at line 1, span 2 columns */
  grid-row: span 3;         /* Span 3 rows from wherever it's placed */
}
```

---

### Q7. What is `grid-template-areas`?

**Answer:**
A visual, name-based way to define your layout. You draw the layout with string literals.

```css
.container {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr 60px;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

> ✅ Use `.` (dot) for an empty cell: `"sidebar . main"`

---

### Q8. What is the difference between `auto-fill` and `auto-fit`?

**Answer:**
Both work with `repeat()` to create responsive grids without media queries.

| | `auto-fill` | `auto-fit` |
|--|-------------|-----------|
| Empty columns | Keeps empty column tracks | **Collapses** empty tracks |
| Items | Don't stretch to fill | **Stretch** to fill the row |

```css
/* auto-fill: creates empty column slots */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

/* auto-fit: stretches items to fill row */
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
```

> 💡 In most cases `auto-fit` looks better because items expand to fill the space.

---

### Q9. What is `minmax()` and why is it useful?

**Answer:**
`minmax(min, max)` sets a size range for grid tracks. Extremely useful for responsive layouts.

```css
/* Column is minimum 200px, maximum 1fr */
grid-template-columns: repeat(3, minmax(200px, 1fr));

/* Responsive card grid — no media queries needed! */
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
```

---

### Q10. What is `justify-items` vs `justify-content` in Grid?

**Answer:**

| Property | Aligns | Axis |
|----------|--------|------|
| `justify-items` | Content **within each cell** | Inline (row) axis |
| `justify-content` | The entire **grid** within the container | Inline (row) axis |
| `align-items` | Content **within each cell** | Block (column) axis |
| `align-content` | The entire **grid** within the container | Block (column) axis |

```css
.container {
  display: grid;
  justify-items: center;   /* Centers content inside each cell */
  justify-content: center; /* Centers the whole grid within the container */
}
```

---

### Q11. What is `place-items` and `place-content`?

**Answer:**
Shorthand properties that combine `align-*` and `justify-*`.

```css
.container {
  place-items: center;       /* align-items: center; justify-items: center; */
  place-items: start end;    /* align-items: start; justify-items: end; */
  
  place-content: center;     /* align-content: center; justify-content: center; */
}
```

---

### Q12. How do you center an element with CSS Grid?

**Answer:**
```css
/* Method 1: place-items */
.container {
  display: grid;
  place-items: center;
  height: 100vh;
}

/* Method 2: explicit */
.container {
  display: grid;
  justify-items: center;
  align-items: center;
  height: 100vh;
}

/* Method 3: margin auto on child */
.container {
  display: grid;
  height: 100vh;
}
.child {
  margin: auto;
}
```

---

## 🔴 Advanced

---

### Q13. What is the `grid` shorthand property?

**Answer:**
`grid` is a shorthand for `grid-template-rows`, `grid-template-columns`, `grid-template-areas`, `grid-auto-rows`, `grid-auto-columns`, and `grid-auto-flow`.

```css
/* Equivalent to: grid-template-rows / grid-template-columns */
.container {
  grid: 60px auto 60px / 200px 1fr;
}

/* With areas */
.container {
  grid:
    "header" 60px
    "main"   1fr
    "footer" 60px
    / 1fr;
}
```

---

### Q14. What is `grid-auto-flow` and what does `dense` do?

**Answer:**
`grid-auto-flow` controls how auto-placed items fill the grid.

| Value | Behavior |
|-------|----------|
| `row` (default) | Fill row by row |
| `column` | Fill column by column |
| `dense` | Fill gaps with smaller items (reorders visually!) |

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-flow: dense; /* Fills holes with small items */
}
```

> ⚠️ `dense` can change visual order — be cautious with accessibility.

---

### Q15. How do you create a masonry-like layout with CSS Grid?

**Answer:**
By using `grid-auto-flow: dense` with items that span different numbers of rows:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 100px;
  gap: 10px;
  grid-auto-flow: dense;
}

.tall  { grid-row: span 2; }
.wide  { grid-column: span 2; }
.large { grid-row: span 2; grid-column: span 2; }
```

---

### Q16. What are implicit vs explicit grid tracks?

**Answer:**

| | Explicit | Implicit |
|--|----------|----------|
| Defined by | `grid-template-rows/columns` | Created automatically when items overflow |
| Size control | Precisely defined | `grid-auto-rows` / `grid-auto-columns` |

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Explicit: 3 columns */
  grid-auto-rows: 200px; /* Implicit: any new rows are 200px */
}
```

---

### Q17. Build a classic page layout (Header, Sidebar, Main, Footer) with Grid.

**Answer:**
```css
.page {
  display: grid;
  min-height: 100vh;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 64px 1fr 48px;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
}

.header  { grid-area: header;  background: #1a1a2e; }
.sidebar { grid-area: sidebar; background: #16213e; }
.main    { grid-area: main;    background: #0f3460; }
.footer  { grid-area: footer;  background: #1a1a2e; }

/* Responsive */
@media (max-width: 768px) {
  .page {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "main"
      "sidebar"
      "footer";
  }
}
```

---

### Q18. What is `subgrid` and why is it important?

**Answer:**
`subgrid` allows a nested grid item to inherit the parent's grid tracks, solving the classic "misaligned columns in nested grids" problem.

```css
.parent {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.child {
  grid-column: span 4;
  display: grid;
  grid-template-columns: subgrid; /* Inherits parent's 4 columns! */
}
```

> ✅ Now supported in all major browsers (Chrome 117+, Firefox 71+, Safari 16+).

---

## 📝 Quick Reference

```css
/* Container */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  grid-template-areas: "...";
  gap: 16px;
  justify-items: stretch | start | end | center;
  align-items: stretch | start | end | center;
  justify-content: start | end | center | space-between | space-around | space-evenly;
  align-content: start | end | center | space-between | space-around | space-evenly;
  grid-auto-flow: row | column | dense;
  grid-auto-rows: 200px;
  grid-auto-columns: 1fr;
}

/* Items */
.item {
  grid-column: 1 / 3;
  grid-row: 1 / span 2;
  grid-area: header;
  justify-self: stretch | start | end | center;
  align-self: stretch | start | end | center;
  order: 0;
}
```

---

*Senior UI Developer Interview Prep — CSS Grid*
