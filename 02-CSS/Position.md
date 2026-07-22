# 📍 CSS Position — Interview Q&A

> **Category:** CSS | **Level:** Beginner → Advanced
> **Last Updated:** 2026-07-22

---

## 🔵 Basics

---

### Q1. What are all the CSS `position` values and their differences?

**Answer:**

| Value | Removed from flow? | Relative to | Use case |
|-------|-------------------|-------------|----------|
| `static` | No | N/A (normal flow) | Default, ignore top/left/etc. |
| `relative` | No | Itself (original position) | Nudging, creating stacking context |
| `absolute` | **Yes** | Nearest positioned ancestor | Tooltips, dropdowns, badges |
| `fixed` | **Yes** | Viewport | Sticky nav bars, modals |
| `sticky` | No (until threshold) | Scroll container | Sticky headers within a section |

---

### Q2. What does `position: static` mean?

**Answer:**
`static` is the **default** value. The element follows the normal document flow. `top`, `right`, `bottom`, `left`, and `z-index` have **no effect** on it.

```css
.box {
  position: static; /* Default — top/left do nothing */
  top: 20px;        /* IGNORED */
}
```

---

### Q3. What is `position: relative`?

**Answer:**
The element stays in the normal flow but can be offset from its **original position** using `top`, `right`, `bottom`, `left`. The space it occupied is **still reserved**.

```css
.box {
  position: relative;
  top: 20px;  /* Moves 20px down from its normal position */
  left: 30px; /* Moves 30px right from its normal position */
}
```

**Key use:**
- Creating a **stacking context**
- As a **containing block** for absolutely positioned children

---

### Q4. What is `position: absolute`?

**Answer:**
The element is **removed from normal flow** — no space is reserved. It positions itself relative to the **nearest ancestor with a non-static position** (or `<html>` if none exists).

```css
/* Parent must be positioned! */
.parent {
  position: relative; /* Containing block for .child */
}

.child {
  position: absolute;
  top: 0;
  right: 0; /* Top-right corner of .parent */
}
```

> ⚠️ Common mistake: forgetting to set `position: relative` on the parent.

---

### Q5. What is `position: fixed`?

**Answer:**
Element is removed from flow and positioned relative to the **viewport**. It stays in the same position **even when the page scrolls**.

```css
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  z-index: 1000;
}
```

**Use cases:** Sticky navigation, floating action buttons, cookie banners, modals.

> ⚠️ On mobile, `position: fixed` can have unexpected behavior inside transformed or scrollable containers.

---

### Q6. What is `position: sticky` and how is it different from `fixed`?

**Answer:**
`sticky` is a hybrid of `relative` and `fixed`. The element stays in flow **until** it hits a defined threshold, then it sticks.

```css
.section-header {
  position: sticky;
  top: 0; /* Sticks to top of scroll container when it reaches the top */
  background: white;
  z-index: 10;
}
```

| | `fixed` | `sticky` |
|--|---------|---------|
| Removed from flow | Yes | **No** — space is preserved |
| Positions relative to | Viewport | Scroll container |
| Scope | Full page | **Within its parent container** |
| Requires `top/left` | Optional | **Required** to activate |

---

## 🟡 Intermediate

---

### Q7. What is a "containing block" and why does it matter?

**Answer:**
A containing block is the reference box for positioning and sizing. For `position: absolute`, it's the **nearest positioned ancestor** (non-static).

```css
/* Without positioned parent → absolute item uses <html> */
.grandparent { /* position: static */ }
.parent      { /* position: static */ }
.child       { position: absolute; top: 0; right: 0; } /* Goes to <html> corner! */

/* With positioned parent → absolute item uses that parent */
.parent {
  position: relative; /* Now this is the containing block */
}
.child {
  position: absolute;
  top: 0; right: 0; /* Goes to parent's corner */
}
```

---

### Q8. How does `z-index` work and what is a stacking context?

**Answer:**
`z-index` controls the **stack order** — which elements appear in front. It only works on **positioned elements** (non-static).

```css
.behind { position: relative; z-index: 1; }
.front  { position: relative; z-index: 2; } /* Appears in front */
```

**Stacking Context:**
A stacking context is a self-contained "bubble" of z-index values. Created by:
- `position: relative/absolute/fixed/sticky` + `z-index` (not `auto`)
- `opacity < 1`
- `transform`, `filter`, `perspective`
- `isolation: isolate`

```css
/* z-index of children is scoped to this context */
.context {
  position: relative;
  z-index: 10;
  /* Children z-index won't compete with elements outside! */
}
```

> ⚠️ Common bug: A child with `z-index: 9999` still sits behind another element because its parent has a lower stacking context.

---

### Q9. How do you center an element absolutely within its parent?

**Answer:**

**Method 1: Transform (most reliable)**
```css
.parent { position: relative; }

.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Offset by half its own size */
}
```

**Method 2: All sides + auto margin**
```css
.child {
  position: absolute;
  inset: 0; /* top:0; right:0; bottom:0; left:0 */
  margin: auto;
  width: 200px; /* Must have explicit dimensions */
  height: 100px;
}
```

---

### Q10. What is the `inset` property?

**Answer:**
`inset` is shorthand for `top`, `right`, `bottom`, and `left`.

```css
/* These are equivalent */
.box { top: 0; right: 0; bottom: 0; left: 0; }
.box { inset: 0; }

/* Sides */
.box { inset: 10px 20px; }      /* top+bottom: 10px, left+right: 20px */
.box { inset: 10px 20px 30px 40px; } /* top right bottom left */
```

---

### Q11. How does `position: sticky` fail and when does it not work?

**Answer:**
Common reasons sticky doesn't work:
1. **Missing `top`, `right`, `bottom`, or `left`** — at least one is required
2. **Parent has `overflow: hidden/auto/scroll`** — sticky needs to scroll through its parent
3. **Parent is not tall enough** — sticky only works within its parent's boundaries
4. **Parent has fixed height** — no room to scroll within

```css
/* ❌ Sticky won't work — parent clips it */
.parent { overflow: hidden; }
.child { position: sticky; top: 0; }

/* ✅ Sticky works */
.parent { /* No overflow clip */ }
.child { position: sticky; top: 0; }
```

---

### Q12. How would you create a tooltip that appears on hover?

**Answer:**
```css
.wrapper {
  position: relative;
  display: inline-block;
}

.tooltip {
  position: absolute;
  bottom: 125%; /* Above the wrapper */
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s;
}

.wrapper:hover .tooltip {
  opacity: 1;
  visibility: visible;
}
```

```html
<div class="wrapper">
  Hover me
  <div class="tooltip">Tooltip text</div>
</div>
```

---

## 🔴 Advanced

---

### Q13. What is `isolation: isolate` and when would you use it?

**Answer:**
`isolation: isolate` creates a **new stacking context** without requiring `z-index` or `position`. Useful when you want to control z-index without affecting the element's layout.

```css
/* Problem: modal z-index fights with a dropdown in a sidebar */
.sidebar { position: relative; z-index: 50; }
.modal   { position: fixed;    z-index: 100; } /* Doesn't go above sidebar! */

/* Solution: isolate the sidebar */
.sidebar {
  isolation: isolate; /* Creates new stacking context */
  /* Now .modal's z-index is evaluated at the root level */
}
```

---

### Q14. Explain the paint order of positioned elements.

**Answer:**
Browsers render elements in this order (bottom to top):
1. Background and borders of block elements
2. Floated elements
3. Inline elements
4. **Positioned elements** (non-static) — painted last, appear on top

This is why `position: relative` without `z-index` still renders on top of `float` elements.

---

### Q15. How does `position: fixed` behave inside a CSS transform?

**Answer:**
This is a known gotcha. If a parent has `transform`, `filter`, or `perspective`, it creates a **new containing block** for `fixed` elements, making them behave like `absolute` instead.

```css
/* ❌ Fixed modal won't cover the screen properly */
.parent { transform: translateX(0); }
.modal  { position: fixed; inset: 0; } /* Acts like absolute! */

/* ✅ Solution: Portal the modal to <body> */
/* In Angular/React, use portals/CDK overlays */
```

---

### Q16. How do you create a sticky sidebar that doesn't overflow its container?

**Answer:**
```css
.layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  align-items: start; /* Critical! Without this, sidebar stretches full height */
}

.sidebar {
  position: sticky;
  top: 80px; /* Offset for header */
  max-height: calc(100vh - 80px);
  overflow-y: auto;
}
```

---

## 📝 Quick Reference

```css
/* All position values */
position: static;    /* Default — top/left ignored */
position: relative;  /* Offset from self, stays in flow */
position: absolute;  /* Out of flow, relative to nearest positioned ancestor */
position: fixed;     /* Out of flow, relative to viewport */
position: sticky;    /* In flow until threshold, then sticks */

/* Offset properties */
top: 0; right: 0; bottom: 0; left: 0;
inset: 0; /* shorthand */

/* Stacking */
z-index: 10;         /* Only works on positioned elements */
isolation: isolate;  /* Create stacking context without z-index */
```

---

*Senior UI Developer Interview Prep — CSS Position*
