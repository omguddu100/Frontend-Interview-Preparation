# 🎯 CSS Specificity — Interview Q&A

> **Category:** CSS | **Level:** Beginner → Advanced
> **Last Updated:** 2026-07-22

---

## 🔵 Basics

---

### Q1. What is CSS Specificity?

**Answer:**
Specificity is the algorithm browsers use to decide **which CSS rule applies** when multiple rules target the same element. The rule with higher specificity wins.

```css
p { color: blue; }          /* Less specific */
.para { color: red; }       /* More specific → wins */
```

---

### Q2. How is specificity calculated?

**Answer:**
Specificity is calculated as a **4-part score**: `(inline, IDs, classes/attributes/pseudo-classes, elements/pseudo-elements)`

| Selector | Inline | IDs | Classes/Attrs/Pseudo-classes | Elements/Pseudo-elements | Score |
|----------|--------|-----|-------------------------------|--------------------------|-------|
| `*` | 0 | 0 | 0 | 0 | `0-0-0-0` |
| `p` | 0 | 0 | 0 | 1 | `0-0-0-1` |
| `.class` | 0 | 0 | 1 | 0 | `0-0-1-0` |
| `#id` | 0 | 1 | 0 | 0 | `0-1-0-0` |
| `style=""` | 1 | 0 | 0 | 0 | `1-0-0-0` |
| `!important` | — | Overrides everything (special rule) |

```css
p               /* 0-0-0-1 */
p.intro         /* 0-0-1-1 */
#nav p          /* 0-1-0-1 */
div#nav p.intro /* 0-1-1-2 */
```

---

### Q3. What wins when two rules have the same specificity?

**Answer:**
The rule that appears **later in the stylesheet** wins (cascade order).

```css
p { color: blue; }
p { color: red; }  /* Same specificity — this wins (comes last) */
```

---

### Q4. What does `!important` do and when should you use it?

**Answer:**
`!important` overrides **all** specificity calculations. It's the nuclear option.

```css
p { color: blue !important; } /* Beats #id.class styles */
```

**When it's acceptable:**
- Utility classes that must always apply (`.hidden`, `.sr-only`)
- Overriding third-party library styles you can't change
- Quick debugging (never leave in production)

**When to avoid:**
- In general application CSS — it creates specificity wars
- Makes code hard to maintain

---

## 🟡 Intermediate

---

### Q5. Calculate the specificity of these selectors:

**Answer:**

```css
a                        /* 0-0-0-1 */
a:hover                  /* 0-0-1-1   (:hover is pseudo-class) */
.nav a                   /* 0-0-1-1 */
.nav a:hover             /* 0-0-2-1 */
#nav .item a:hover       /* 0-1-2-1 */
div#nav .item > a:hover  /* 0-1-2-2 */
```

---

### Q6. What is the specificity of `:is()`, `:not()`, `:has()`, and `:where()`?

**Answer:**

| Pseudo-class | Specificity |
|-------------|-------------|
| `:not(X)` | Specificity of `X` (the argument) |
| `:is(X)` | Specificity of most specific argument |
| `:has(X)` | Specificity of most specific argument |
| `:where(X)` | **Always 0** — specificity-free |

```css
:not(.foo)       /* 0-0-1-0 — .foo is the specificity */
:is(h1, #title)  /* 0-1-0-0 — takes #title's specificity */
:where(h1, #id)  /* 0-0-0-0 — zero specificity, always! */
```

> 💡 `:where()` is perfect for base/reset styles that should be easy to override.

---

### Q7. Does the order of selectors in a rule matter?

**Answer:**
**No** — the order of selectors within a single rule doesn't affect specificity. But order matters between separate rules of the same specificity.

```css
/* These have identical specificity */
p.intro { color: blue; }
.intro p { color: red; } /* Wins — comes later, same specificity */
```

---

### Q8. What is the "specificity war" problem and how do you avoid it?

**Answer:**
When developers keep adding more specific selectors or `!important` to override each other, creating an escalating arms race.

```css
/* ❌ Specificity war */
#sidebar .widget h3 { color: blue; }
#main #sidebar .widget h3 { color: red; }  /* Had to be more specific */
#main #sidebar .widget h3.active { color: green !important; }  /* Nuclear option */
```

**How to avoid:**
1. Keep selectors as short/flat as possible
2. Use class selectors, avoid ID selectors in CSS
3. Use BEM methodology to create unique, low-specificity class names
4. Use CSS custom properties and layers

```css
/* ✅ BEM — each component has unique, low-specificity class */
.widget__title { color: blue; }
.widget__title--active { color: green; }
```

---

### Q9. What is `@layer` (Cascade Layers) and how does it affect specificity?

**Answer:**
`@layer` groups styles into named layers. Layers declared **later** win, and importantly, **all styles in a higher layer beat all styles in a lower layer — even if the lower layer has higher specificity**.

```css
@layer base, components, utilities;

@layer base {
  #id { color: red; }           /* High specificity but low layer */
}

@layer utilities {
  .text-blue { color: blue; }   /* Low specificity but HIGH layer → WINS! */
}
```

> ✅ `@layer` eliminates specificity wars between layers — order of layers is what matters.

---

### Q10. What is the difference between `inherit`, `initial`, `unset`, and `revert`?

**Answer:**

| Value | Meaning |
|-------|---------|
| `inherit` | Take value from parent |
| `initial` | Reset to CSS spec default |
| `unset` | `inherit` if inheritable, else `initial` |
| `revert` | Reset to browser (UA) stylesheet default |

```css
.child {
  color: inherit;   /* Takes parent's color */
  color: initial;   /* Black (#000) — CSS spec default */
  color: unset;     /* Same as inherit for 'color' (inheritable) */
  color: revert;    /* Browser default color (usually black) */
}
```

---

## 🔴 Advanced

---

### Q11. Does inline style beat `!important` in a stylesheet?

**Answer:**
No! `!important` in a stylesheet beats inline styles **when it's `!important`**, but normal stylesheet styles lose to inline styles.

```html
<p style="color: blue"> <!-- Inline: specificity 1-0-0-0 -->
```

```css
p { color: red; }          /* 0-0-0-1 → loses to inline */
p { color: red !important;} /* !important → BEATS inline! */
```

Full order (weakest to strongest):
1. Normal stylesheets
2. Inline styles
3. `!important` stylesheet rules
4. `!important` inline styles

---

### Q12. What is the universal selector `*` specificity?

**Answer:**
The universal selector `*` has **zero specificity** `(0-0-0-0)`. It loses to every other selector.

```css
* { color: grey; }       /* 0-0-0-0 */
p { color: black; }      /* 0-0-0-1 — wins */
```

> ✅ Useful for CSS resets and overrides without specificity bloat.

---

### Q13. Explain how browser DevTools shows specificity.

**Answer:**
In browser DevTools → Elements → Styles:
- **Crossed-out** rules are overridden
- **Specificity** shown in the rule tooltip (e.g., `(0,1,1)`)
- Rules are sorted by specificity within the cascade

> 💡 Use DevTools "Computed" tab to see the final winning value for any property.

---

### Q14. How does specificity interact with CSS custom properties (variables)?

**Answer:**
Custom properties follow cascade and specificity like other properties — the most specific rule wins.

```css
:root  { --color: blue; }            /* 0-0-0-1 */
.card  { --color: green; }           /* 0-0-1-0 → wins for .card elements */
#hero  { --color: red; }             /* 0-1-0-0 → wins for #hero */

.card { background: var(--color); }  /* Gets green for .card */
```

---

## 📝 Quick Reference

```
Specificity Score: (Inline | IDs | Classes/Attrs/Pseudo-classes | Elements/Pseudo-elements)

Universal *        → 0-0-0-0
Element/pseudo-el  → 0-0-0-1  (h1, ::before)
Class/attr/pseudo  → 0-0-1-0  (.class, [attr], :hover)
ID                 → 0-1-0-0  (#id)
Inline style       → 1-0-0-0  (style="")
!important         → Overrides all (use sparingly!)

Comparison: compare left to right. First different digit wins.
Tie: cascade order (last one wins)
```

---

*Senior UI Developer Interview Prep — CSS Specificity*
