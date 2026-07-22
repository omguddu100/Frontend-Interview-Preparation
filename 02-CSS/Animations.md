# 🎬 CSS Animations — Interview Q&A

> **Category:** CSS | **Level:** Beginner → Advanced
> **Last Updated:** 2026-07-22

---

## 🔵 Basics

---

### Q1. What is the difference between CSS `transition` and CSS `animation`?

**Answer:**

| | `transition` | `animation` |
|--|-------------|-------------|
| Trigger | Requires a state change (hover, class, JS) | Runs automatically |
| Keyframes | No — interpolates between 2 states | Yes — `@keyframes` with multiple steps |
| Loop | Cannot loop | Can loop with `animation-iteration-count` |
| Control | Limited | Full control (delay, direction, fill-mode) |
| Complexity | Simple A→B | Complex multi-step sequences |

```css
/* Transition: state change triggered */
.btn { transition: background 0.3s ease; }
.btn:hover { background: blue; }

/* Animation: runs on its own */
.loader { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
```

---

### Q2. What is the `transition` property and what are its sub-properties?

**Answer:**
`transition` smoothly interpolates CSS property values when they change.

```css
/* Shorthand: property duration timing-function delay */
.box { transition: all 0.3s ease 0s; }

/* Individual */
.box {
  transition-property: background, transform;
  transition-duration: 0.3s;
  transition-timing-function: ease-in-out;
  transition-delay: 0.1s;
}

/* Multiple transitions */
.box {
  transition:
    background 0.3s ease,
    transform 0.5s ease-in-out 0.1s;
}
```

---

### Q3. What are the timing function options for `transition-timing-function`?

**Answer:**

| Value | Behavior |
|-------|----------|
| `linear` | Constant speed |
| `ease` (default) | Slow start, fast middle, slow end |
| `ease-in` | Slow start, fast end |
| `ease-out` | Fast start, slow end |
| `ease-in-out` | Slow start and end |
| `cubic-bezier(x1,y1,x2,y2)` | Custom curve |
| `steps(n, end)` | Stepped (non-smooth) intervals |

```css
.box { transition-timing-function: cubic-bezier(0.68, -0.55, 0.27, 1.55); } /* Elastic bounce */
.clock { transition-timing-function: steps(60, end); } /* Tick like a clock */
```

---

### Q4. What is `@keyframes` and how do you use it?

**Answer:**
`@keyframes` defines the stages (keyframes) of a CSS animation. You name it and reference it in `animation-name`.

```css
/* Named animation */
@keyframes slideIn {
  from {                        /* 0% */
    opacity: 0;
    transform: translateY(-20px);
  }
  to {                          /* 100% */
    opacity: 1;
    transform: translateY(0);
  }
}

/* With percentage steps */
@keyframes pulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.element { animation: slideIn 0.4s ease forwards; }
```

---

### Q5. What are all the `animation` sub-properties?

**Answer:**
```css
.element {
  animation-name: slideIn;            /* @keyframes name */
  animation-duration: 0.4s;           /* How long one cycle takes */
  animation-timing-function: ease;    /* Speed curve */
  animation-delay: 0.2s;              /* Wait before starting */
  animation-iteration-count: 3;       /* 3 times, or 'infinite' */
  animation-direction: alternate;     /* alternate, reverse, alternate-reverse */
  animation-fill-mode: forwards;      /* What happens before/after */
  animation-play-state: running;      /* 'paused' to pause */
}

/* Shorthand: name duration timing delay iteration direction fill-mode */
animation: slideIn 0.4s ease 0.2s 1 normal forwards;
```

---

## 🟡 Intermediate

---

### Q6. What does `animation-fill-mode` do?

**Answer:**
Controls the element's styles **before and after** the animation runs.

| Value | Before (`delay` period) | After (animation ends) |
|-------|--------------------------|------------------------|
| `none` (default) | No animation styles | No animation styles |
| `forwards` | No animation styles | **Keeps last keyframe styles** |
| `backwards` | Applies **first keyframe** styles | No animation styles |
| `both` | Applies first keyframe | Keeps last keyframe |

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.element {
  opacity: 0; /* Starting state */
  animation: fadeIn 0.5s ease forwards; /* Keeps opacity: 1 after done */
}
```

---

### Q7. What is `animation-direction` and what does `alternate` do?

**Answer:**

| Value | Behavior |
|-------|----------|
| `normal` (default) | Plays forward every cycle |
| `reverse` | Plays backward every cycle |
| `alternate` | Forward, then backward, then forward... |
| `alternate-reverse` | Backward, then forward, then backward... |

```css
@keyframes bounce {
  from { transform: translateY(0); }
  to   { transform: translateY(-20px); }
}

.ball {
  animation: bounce 0.5s ease-in-out infinite alternate;
  /* Goes up, comes down, goes up, comes down... smoothly */
}
```

---

### Q8. How do you pause and resume an animation with JavaScript?

**Answer:**
```css
.animated { animation: spin 2s linear infinite; }
.paused   { animation-play-state: paused; }
```

```javascript
const el = document.querySelector('.animated');

// Pause
el.style.animationPlayState = 'paused';
// or
el.classList.add('paused');

// Resume
el.style.animationPlayState = 'running';
el.classList.remove('paused');
```

---

### Q9. What properties are safe to animate for performance?

**Answer:**
Animating most CSS properties triggers layout recalculation (expensive). Only these are GPU-composited (cheap):

| ✅ Safe (Composited) | ❌ Expensive (Triggers layout/paint) |
|---------------------|--------------------------------------|
| `transform` | `width`, `height`, `margin`, `padding` |
| `opacity` | `top`, `left`, `right`, `bottom` |
| `filter` | `background`, `color`, `font-size` |

```css
/* ❌ Expensive — triggers layout */
.bad { transition: width 0.3s; }

/* ✅ Performant — GPU composited */
.good { transition: transform 0.3s; }
.box { transform: scaleX(2); } /* Visually same, but GPU-handled */
```

---

### Q10. What is `will-change` and when should you use it?

**Answer:**
`will-change` hints to the browser that an element will change, letting it **optimize** (create a compositor layer) ahead of time.

```css
/* Tells browser: this element will animate its transform */
.animated-card {
  will-change: transform;
}
```

**When to use:**
- Before heavy animations (add via JS just before animating)
- Elements that animate very frequently (like scroll-linked effects)

**⚠️ Overuse causes memory issues:**
```css
/* ❌ Don't do this on everything! */
* { will-change: transform; } /* Wastes GPU memory */

/* ✅ Add only when needed */
.card:hover { will-change: transform; }
```

---

### Q11. How does `transition` interact with `display: none`?

**Answer:**
You **cannot** transition to/from `display: none` because it's not a numeric value — the browser can't interpolate between "none" and "block".

```css
/* ❌ This won't animate */
.menu { display: none; transition: display 0.3s; }
.menu.open { display: block; }

/* ✅ Use opacity + visibility instead */
.menu {
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
}
.menu.open {
  opacity: 1;
  visibility: visible;
}
```

> ✅ Modern browsers now support `transition` with `display` via `@starting-style` (Chrome 117+).

---

## 🔴 Advanced

---

### Q12. What is `@starting-style` and how does it enable entry animations?

**Answer:**
`@starting-style` defines the styles an element **starts from** when it first appears in the DOM — enabling entry animations without JavaScript.

```css
.dialog {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.3s, transform 0.3s;
}

@starting-style {
  .dialog {
    opacity: 0;
    transform: translateY(-20px);
  }
}
```

> ✅ Chrome 117+, Safari 17.4+. A massive CSS win for JavaScript-free animations!

---

### Q13. What is the `animation` event system in JavaScript?

**Answer:**
```javascript
const el = document.querySelector('.animated');

el.addEventListener('animationstart',     (e) => console.log('Started:', e.animationName));
el.addEventListener('animationend',       (e) => console.log('Ended:',   e.animationName));
el.addEventListener('animationiteration', (e) => console.log('Iteration:', e.elapsedTime));
```

**Useful for:** Chaining animations, cleaning up after animation, showing/hiding elements after fade out.

---

### Q14. What is the Web Animations API (WAAPI)?

**Answer:**
WAAPI is a JavaScript API for creating animations programmatically — more powerful than CSS animations.

```javascript
const el = document.querySelector('.box');

const animation = el.animate(
  [
    { opacity: 0, transform: 'translateY(-20px)' },  // keyframe 0%
    { opacity: 1, transform: 'translateY(0)' }        // keyframe 100%
  ],
  {
    duration: 400,
    easing: 'ease-out',
    fill: 'forwards'
  }
);

animation.play();
animation.pause();
animation.cancel();
animation.finish();

animation.onfinish = () => console.log('Done!');
```

---

### Q15. How would you create a staggered animation for a list of items?

**Answer:**
```css
.list-item {
  opacity: 0;
  animation: fadeInUp 0.4s ease forwards;
}

/* Stagger each item with animation-delay */
.list-item:nth-child(1) { animation-delay: 0.0s; }
.list-item:nth-child(2) { animation-delay: 0.1s; }
.list-item:nth-child(3) { animation-delay: 0.2s; }
.list-item:nth-child(4) { animation-delay: 0.3s; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(15px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

```javascript
// Dynamic stagger with JavaScript (for any list length)
const items = document.querySelectorAll('.list-item');
items.forEach((item, i) => {
  item.style.animationDelay = `${i * 0.1}s`;
});
```

---

## 📝 Quick Reference

```css
/* Transition */
transition: property duration timing-function delay;
transition: all 0.3s ease 0s;

/* Animation */
@keyframes name {
  0%   { /* from */ }
  50%  { /* middle */ }
  100% { /* to */ }
}

.element {
  animation: name duration timing delay iterations direction fill-mode;
  animation: slideIn 0.4s ease 0s 1 normal forwards;
}

/* Performance: only animate these! */
transform: translate() scale() rotate() skew();
opacity: 0 to 1;
filter: blur() brightness();

/* Timing functions */
ease | ease-in | ease-out | ease-in-out | linear
cubic-bezier(x1, y1, x2, y2)
steps(n, start | end)
```

---

*Senior UI Developer Interview Prep — CSS Animations*
