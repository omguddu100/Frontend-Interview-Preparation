# 📦 CSS Flexbox — Interview Q&A

> **Category:** CSS | **Level:** Beginner → Advanced
> **Last Updated:** 2026-07-22

---

## 🔵 Basics

---

### Q1. What is Flexbox and why is it used?

**Answer:**
Flexbox (Flexible Box Layout) is a one-dimensional CSS layout model that arranges items in a **row** or **column**. It provides powerful alignment, distribution, and ordering capabilities without using floats or positioning hacks.

**Use cases:**
- Centering content vertically and horizontally
- Evenly distributing items in a nav bar
- Creating responsive card layouts
- Aligning items of different sizes

```css
.container {
  display: flex; /* Activates flexbox on the container */
}
```

---

### Q2. What is the difference between the flex container and flex items?

**Answer:**

| | Flex Container | Flex Items |
|--|----------------|------------|
| **What** | The parent element with `display: flex` | Direct children of the flex container |
| **Properties** | `flex-direction`, `justify-content`, `align-items`, `flex-wrap`, `gap` | `flex-grow`, `flex-shrink`, `flex-basis`, `align-self`, `order` |

```html
<div class="container">   <!-- Flex Container -->
  <div class="item">A</div>  <!-- Flex Item -->
  <div class="item">B</div>  <!-- Flex Item -->
</div>
```

```css
.container { display: flex; }
```

---

### Q3. What is the difference between `display: flex` and `display: inline-flex`?

**Answer:**

| | `display: flex` | `display: inline-flex` |
|--|-----------------|------------------------|
| Container behavior | Block-level (takes full width) | Inline-level (shrinks to content width) |
| Flex behavior inside | Same | Same |

```css
.block-flex  { display: flex; }        /* Takes full row */
.inline-flex { display: inline-flex; } /* Sits inline like a word */
```

---

### Q4. Explain `flex-direction` and its values.

**Answer:**
`flex-direction` defines the **main axis** direction — how flex items are placed.

| Value | Direction |
|-------|-----------|
| `row` (default) | Left → Right (horizontal) |
| `row-reverse` | Right → Left |
| `column` | Top → Bottom (vertical) |
| `column-reverse` | Bottom → Top |

```css
.container {
  display: flex;
  flex-direction: column; /* Stack items vertically */
}
```

---

### Q5. What is the difference between `justify-content` and `align-items`?

**Answer:**

| Property | Axis | Controls |
|----------|------|----------|
| `justify-content` | Main axis | Horizontal alignment (in row direction) |
| `align-items` | Cross axis | Vertical alignment (in row direction) |

```css
.container {
  display: flex;
  justify-content: center;   /* Center horizontally */
  align-items: center;       /* Center vertically */
  height: 100vh;
}
/* Perfect centering! */
```

**Values for `justify-content`:**
- `flex-start` | `flex-end` | `center` | `space-between` | `space-around` | `space-evenly`

**Values for `align-items`:**
- `flex-start` | `flex-end` | `center` | `stretch` (default) | `baseline`

---

### Q6. What does `flex-wrap` do?

**Answer:**
By default, flex items try to fit on one line. `flex-wrap` controls whether they wrap to the next line.

| Value | Behavior |
|-------|----------|
| `nowrap` (default) | All items on one line, may overflow |
| `wrap` | Items wrap to next line |
| `wrap-reverse` | Items wrap in reverse order |

```css
.container {
  display: flex;
  flex-wrap: wrap; /* Items go to next row when they don't fit */
}
```

---

## 🟡 Intermediate

---

### Q7. Explain `flex-grow`, `flex-shrink`, and `flex-basis`.

**Answer:**

| Property | Default | Meaning |
|----------|---------|---------|
| `flex-grow` | `0` | How much an item **grows** relative to siblings when there's extra space |
| `flex-shrink` | `1` | How much an item **shrinks** relative to siblings when there's less space |
| `flex-basis` | `auto` | The **initial size** of the item before growing/shrinking |

```css
.item {
  flex-grow: 1;      /* Takes up equal share of remaining space */
  flex-shrink: 1;    /* Can shrink equally */
  flex-basis: 200px; /* Starts at 200px before distributing space */
}
```

**Shorthand `flex`:**
```css
.item { flex: 1; }           /* flex-grow:1, flex-shrink:1, flex-basis:0% */
.item { flex: 0 0 200px; }   /* No grow, no shrink, fixed 200px */
.item { flex: 1 1 auto; }    /* Grow and shrink freely */
```

---

### Q8. What is the difference between `align-items` and `align-content`?

**Answer:**

| Property | Applies to | Works when |
|----------|------------|------------|
| `align-items` | Cross-axis alignment of items **within a single line** | Always |
| `align-content` | Cross-axis alignment of **multiple lines** | Only with `flex-wrap: wrap` and multiple rows |

```css
/* align-content needs multiple rows to take effect */
.container {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between; /* Spaces rows apart */
  align-items: center;          /* Centers items within each row */
}
```

---

### Q9. What does `align-self` do?

**Answer:**
`align-self` overrides `align-items` for an individual flex item.

```css
.container {
  display: flex;
  align-items: center; /* All items centered */
}

.special-item {
  align-self: flex-end; /* This one item goes to bottom */
}
```

---

### Q10. How does the `order` property work in Flexbox?

**Answer:**
`order` changes the visual order of flex items **without changing the HTML**. Default is `0`. Items with lower order appear first.

```css
.item-1 { order: 3; } /* Shows last */
.item-2 { order: 1; } /* Shows first */
.item-3 { order: 2; } /* Shows second */
```

> ⚠️ Caution: `order` affects visual order only, not DOM order — screen readers still follow the HTML order, so be careful with accessibility.

---

### Q11. How do you perfectly center an element with Flexbox?

**Answer:**
```css
.container {
  display: flex;
  justify-content: center; /* Horizontal center */
  align-items: center;     /* Vertical center */
  height: 100vh;
}
```

Or using `margin: auto` on the child:
```css
.container {
  display: flex;
  height: 100vh;
}
.child {
  margin: auto; /* Centers in both directions! */
}
```

---

### Q12. What is the difference between `space-between`, `space-around`, and `space-evenly`?

**Answer:**

```
space-between:  |A    B    C|   (no space at edges)
space-around:   | A   B   C |  (half space at edges)
space-evenly:   |  A  B  C  |  (equal space everywhere)
```

```css
.container { display: flex; justify-content: space-between; }
.container { display: flex; justify-content: space-around; }
.container { display: flex; justify-content: space-evenly; }
```

---

## 🔴 Advanced

---

### Q13. What is the `gap` property in Flexbox?

**Answer:**
`gap` (formerly `grid-gap`) sets spacing between flex items. Cleaner than using `margin`.

```css
.container {
  display: flex;
  gap: 16px;          /* Same gap in both directions */
  gap: 16px 8px;      /* row-gap: 16px, column-gap: 8px */
  row-gap: 20px;
  column-gap: 10px;
}
```

> ✅ Preferred over margins because it doesn't add space at the edges.

---

### Q14. Can flex items also be flex containers?

**Answer:**
Yes! A flex item can also be a flex container by setting `display: flex` on it. This creates **nested flexbox**.

```css
.outer { display: flex; }

.inner {
  display: flex;          /* This flex item is also a flex container */
  flex-direction: column;
}
```

---

### Q15. What happens when `flex-basis` is `0` vs `auto`?

**Answer:**

| `flex-basis: 0` | `flex-basis: auto` |
|-----------------|-------------------|
| Item starts at 0 size; all space distributed by `flex-grow` ratio | Item starts at its content size; only **remaining** space distributed |
| All items get equal width if `flex-grow` is equal | Items grow proportionally from their natural size |

```css
/* Equal columns regardless of content */
.item { flex: 1 1 0; }

/* Grow from content width */
.item { flex: 1 1 auto; }
```

---

### Q16. How would you create a responsive navigation bar using Flexbox?

**Answer:**
```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
}

.nav-links {
  display: flex;
  gap: 24px;
  list-style: none;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
```

---

### Q17. How do you make one flex item take up all remaining space?

**Answer:**
```css
.container { display: flex; }

.sidebar { width: 250px; flex-shrink: 0; }  /* Fixed width */
.main    { flex: 1; }                        /* Takes ALL remaining space */
```

---

### Q18. What is `flex: none` and when do you use it?

**Answer:**
`flex: none` = `flex: 0 0 auto` — the item **won't grow or shrink**, it keeps its natural size.

```css
.fixed-item {
  flex: none; /* Don't stretch me! */
  width: 100px;
}
```

Use when you have a fixed-size element (avatar, icon, button) that should not be affected by the flex layout.

---

### Q19. Explain a common Flexbox gotcha with `min-width`.

**Answer:**
By default, flex items have `min-width: auto` which means they won't shrink smaller than their content. This can cause overflow.

```css
/* Fix: Allow items to shrink below content size */
.item {
  min-width: 0; /* Override the default min-width: auto */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

---

### Q20. What is the difference between `flex: 1` and `flex: auto`?

**Answer:**

| | `flex: 1` | `flex: auto` |
|--|-----------|--------------|
| Expands to | `flex: 1 1 0%` | `flex: 1 1 auto` |
| Basis | `0%` — starts from zero | `auto` — starts from content size |
| Result | All items get **equal** width | Items grow proportionally from their **natural width** |

```css
/* Equal columns */
.item { flex: 1; }

/* Proportional to content size */
.item { flex: auto; }
```

---

## 📝 Quick Reference

```css
/* Container */
.flex-container {
  display: flex | inline-flex;
  flex-direction: row | row-reverse | column | column-reverse;
  flex-wrap: nowrap | wrap | wrap-reverse;
  justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
  align-items: stretch | flex-start | flex-end | center | baseline;
  align-content: stretch | flex-start | flex-end | center | space-between | space-around;
  gap: <row-gap> <column-gap>;
}

/* Items */
.flex-item {
  order: <integer>;           /* Default: 0 */
  flex-grow: <number>;        /* Default: 0 */
  flex-shrink: <number>;      /* Default: 1 */
  flex-basis: <length> | auto;
  flex: <grow> <shrink> <basis>;
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

---

*Senior UI Developer Interview Prep — CSS Flexbox*
