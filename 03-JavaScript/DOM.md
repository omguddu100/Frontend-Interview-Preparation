# DOM (Document Object Model) — JavaScript Interview Q&A

---
**Category:** JavaScript / Browser APIs  
**Level:** Beginner → Advanced  
**Date:** 2026-07-22  
**Topics:** DOM, BOM, Events, Delegation, MutationObserver, Virtual DOM, Performance

---

## Table of Contents

1. [What is the DOM?](#1-what-is-the-dom)
2. [DOM vs BOM vs JavaScript Engine](#2-dom-vs-bom-vs-javascript-engine)
3. [Selecting Elements](#3-selecting-elements)
4. [Creating & Modifying Elements](#4-creating--modifying-elements)
5. [innerHTML vs textContent vs innerText](#5-innerhtml-vs-textcontent-vs-innertext)
6. [Attributes vs Properties](#6-attributes-vs-properties)
7. [Event Handling Patterns](#7-event-handling-patterns)
8. [Event Object Properties](#8-event-object-properties)
9. [Event Delegation](#9-event-delegation)
10. [Event Bubbling and Capturing](#10-event-bubbling-and-capturing)
11. [Custom Events](#11-custom-events)
12. [DOM Traversal](#12-dom-traversal)
13. [DocumentFragment](#13-documentfragment)
14. [MutationObserver](#14-mutationobserver)
15. [Virtual DOM vs Real DOM](#15-virtual-dom-vs-real-dom)
16. [Performance — Reflow vs Repaint](#16-performance--reflow-vs-repaint)
17. [Quick Reference](#17-quick-reference)

---

## 1. What is the DOM?

### Q: What is the DOM and how is it structured?

**A:** The **Document Object Model (DOM)** is a programming interface for web documents. It represents the HTML document as a **tree of nodes** that can be manipulated with JavaScript.

```
document (root)
└── <html>
    ├── <head>
    │   ├── <title> → "My Page"
    │   └── <meta>
    └── <body>
        ├── <header>
        │   └── <h1> → "Hello"
        ├── <main>
        │   ├── <p> → "Paragraph text"
        │   └── <ul>
        │       ├── <li> → "Item 1"
        │       └── <li> → "Item 2"
        └── <footer>
```

### Node Types

| Node Type              | `nodeType` | Description                         |
|------------------------|------------|-------------------------------------|
| `Element`              | 1          | HTML element (`<div>`, `<p>`, etc.) |
| `Text`                 | 3          | Text content inside elements        |
| `Comment`              | 8          | `<!-- comment -->`                  |
| `Document`             | 9          | Root `document` object              |
| `DocumentType`         | 10         | `<!DOCTYPE html>`                   |
| `DocumentFragment`     | 11         | Lightweight container (off-screen)  |

```javascript
const p = document.querySelector("p");
console.log(p.nodeType);     // 1 (Element)
console.log(p.nodeName);     // "P"
console.log(p.nodeValue);    // null (elements have no value)

const text = p.firstChild;
console.log(text.nodeType);  // 3 (Text)
console.log(text.nodeValue); // "Paragraph text"
```

---

## 2. DOM vs BOM vs JavaScript Engine

### Q: What is the difference between DOM, BOM, and the JavaScript engine?

**A:**

```
┌─────────────────────────────────────────────────────┐
│                    Browser                          │
│  ┌───────────────┐  ┌──────────────────────────┐   │
│  │ JS Engine(V8) │  │      Web APIs             │   │
│  │               │  │  ┌─────────┐ ┌────────┐  │   │
│  │ - Call Stack  │  │  │  DOM    │ │  BOM   │  │   │
│  │ - Event Loop  │  │  │         │ │        │  │   │
│  │ - Memory Heap │  │  │document │ │window  │  │   │
│  │               │  │  │Element  │ │history │  │   │
│  └───────────────┘  │  │Node     │ │location│  │   │
│                     │  │Event    │ │navigator│ │   │
│                     │  └─────────┘ └────────┘  │   │
│                     └──────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

| Aspect         | **JavaScript Engine** | **DOM**                     | **BOM**                     |
|----------------|-----------------------|-----------------------------|-----------------------------|
| **What**       | Executes JS code      | HTML document model         | Browser environment model   |
| **Spec**       | ECMAScript (ECMA-262) | W3C / WHATWG                | No formal standard          |
| **Root**       | —                     | `document`                  | `window`                    |
| **Examples**   | V8, SpiderMonkey      | `getElementById`, `querySelector` | `window.location`, `history`, `navigator` |

```javascript
// DOM — accessing the document
document.title = "New Title";
document.querySelector("h1").textContent = "Updated";

// BOM — browser environment
console.log(window.innerWidth);         // viewport width
console.log(navigator.userAgent);       // browser info
console.log(location.href);             // current URL
history.pushState({}, "", "/new-path"); // SPA navigation

// JavaScript Engine
const x = [1, 2, 3].map(n => n * 2);   // pure ECMAScript
```

---

## 3. Selecting Elements

### Q: What are the different ways to select DOM elements and when should each be used?

**A:**

```javascript
// ── getElementById ─────────────────────────────────────────
// Fastest — uses internal ID hash map; returns Element or null
const header = document.getElementById("main-header");

// ── getElementsByClassName ─────────────────────────────────
// Returns live HTMLCollection — updates automatically when DOM changes
const items = document.getElementsByClassName("list-item");
console.log(items.length); // live!
document.body.appendChild(Object.assign(document.createElement("li"), {
  className: "list-item"
}));
console.log(items.length); // increased by 1 automatically!

// ── getElementsByTagName ───────────────────────────────────
// Returns live HTMLCollection
const allDivs = document.getElementsByTagName("div");
const allElements = document.getElementsByTagName("*"); // everything

// ── querySelector ──────────────────────────────────────────
// Returns FIRST matching element or null; uses CSS selector syntax
// Static (not live)
const firstBtn = document.querySelector("button.primary");
const nested = document.querySelector("#sidebar > ul > li:first-child");
const dataEl = document.querySelector("[data-user-id='42']");

// Scoped to a specific element (not just document)
const nav = document.getElementById("nav");
const navLinks = nav.querySelectorAll("a"); // only links inside nav

// ── querySelectorAll ───────────────────────────────────────
// Returns static NodeList — does NOT update when DOM changes
const allButtons = document.querySelectorAll("button[type='submit']");

// Convert NodeList to Array for full array methods
const buttonsArray = Array.from(allButtons);
// or: [...allButtons]
buttonsArray.forEach(btn => console.log(btn.textContent));

// ── Performance Comparison ─────────────────────────────────
// Fastest to slowest (roughly):
// getElementById > getElementsByClassName > getElementsByTagName
//   > querySelector > querySelectorAll

// ── Checking if element exists ─────────────────────────────
const el = document.querySelector(".optional-element");
if (el) {
  el.style.display = "none";
}

// Optional chaining — safe access
document.querySelector(".optional")?.classList.add("active");
```

### Selector Cheat Sheet

| Method                        | Returns              | Live? | Notes                         |
|-------------------------------|----------------------|-------|-------------------------------|
| `getElementById(id)`          | `Element \| null`   | N/A   | Fastest, unique IDs only      |
| `getElementsByClassName(cls)` | `HTMLCollection`     | ✅ Yes | Multiple classes OK           |
| `getElementsByTagName(tag)`   | `HTMLCollection`     | ✅ Yes | Use `"*"` for all             |
| `querySelector(sel)`          | `Element \| null`   | ❌ No  | First match, CSS selector     |
| `querySelectorAll(sel)`       | `NodeList`           | ❌ No  | All matches, CSS selector     |
| `closest(sel)`                | `Element \| null`   | ❌ No  | Nearest ancestor matching sel |
| `matches(sel)`                | `boolean`            | ❌ No  | Does element match selector?  |

---

## 4. Creating & Modifying Elements

### Q: How do you create, insert, modify, and remove DOM elements?

**A:**

```javascript
// ── createElement ──────────────────────────────────────────
const div = document.createElement("div");
div.id = "card";
div.className = "card featured";
div.textContent = "Hello World";
div.setAttribute("data-id", "123");
div.style.backgroundColor = "#1a1a2e";

// ── appendChild ────────────────────────────────────────────
// Moves element if already in DOM
document.body.appendChild(div);

// ── prepend / append (modern) ─────────────────────────────
const container = document.getElementById("container");
container.prepend(div);           // insert as first child
container.append(div, "text");    // append element OR text string

// ── insertBefore ───────────────────────────────────────────
const list = document.getElementById("list");
const newItem = document.createElement("li");
newItem.textContent = "New First Item";
const firstItem = list.firstElementChild;
list.insertBefore(newItem, firstItem); // insert before firstItem

// ── insertAdjacentHTML / insertAdjacentElement ─────────────
const target = document.querySelector(".target");

// positions: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend'
target.insertAdjacentHTML("beforebegin", "<p>Before target</p>");
target.insertAdjacentHTML("afterbegin",  "<span>First inside</span>");
target.insertAdjacentHTML("beforeend",   "<span>Last inside</span>");
target.insertAdjacentHTML("afterend",    "<p>After target</p>");

// ── removeChild ────────────────────────────────────────────
const parent = document.getElementById("parent");
const child = document.getElementById("child");
parent.removeChild(child); // returns removed node

// ── remove() — modern, no parent needed ──────────────────
child.remove(); // ✓ clean and simple

// ── replaceChild ───────────────────────────────────────────
const newEl = document.createElement("span");
newEl.textContent = "Replaced!";
parent.replaceChild(newEl, child); // replaces child with newEl

// ── replaceWith() — modern ────────────────────────────────
child.replaceWith(newEl); // same result, cleaner API

// ── cloneNode ─────────────────────────────────────────────
const original = document.getElementById("template-card");
const clone = original.cloneNode(true);  // true = deep clone (with children)
const shallowClone = original.cloneNode(false); // false = element only
clone.id = "template-card-2"; // IDs must be unique!
document.body.appendChild(clone);

// ── Building complex structure ─────────────────────────────
function createCard(data) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.id = data.id; // sets data-id attribute

  const title = document.createElement("h2");
  title.textContent = data.title;

  const desc = document.createElement("p");
  desc.textContent = data.description;

  const btn = document.createElement("button");
  btn.textContent = "Read More";
  btn.className = "btn btn-primary";
  btn.addEventListener("click", () => handleCardClick(data.id));

  card.appendChild(title);
  card.appendChild(desc);
  card.appendChild(btn);

  return card;
}

function handleCardClick(id) {
  console.log("Card clicked:", id);
}

document.getElementById("cards").appendChild(
  createCard({ id: 1, title: "Hello", description: "World" })
);
```

---

## 5. innerHTML vs textContent vs innerText

### Q: What are the differences between innerHTML, textContent, and innerText?

**A:**

| Feature              | `innerHTML`                   | `textContent`             | `innerText`              |
|----------------------|-------------------------------|---------------------------|--------------------------|
| **Reads**            | HTML markup as string         | All text (raw)            | Visible rendered text    |
| **Writes**           | Parses and renders HTML       | Sets text (no HTML)       | Sets text (no HTML)      |
| **XSS Risk**         | ✅ YES — very dangerous       | ❌ No                     | ❌ No                    |
| **Hidden elements**  | Included                      | Included                  | ❌ Excluded              |
| **`<script>` tags**  | Included but not executed     | Included as text          | Excluded                 |
| **Performance**      | Slower (triggers parse)       | Faster                    | Slower (triggers layout) |
| **CSS awareness**    | No                            | No                        | ✅ Yes (respects display)|
| **Newlines**         | Collapses                     | Preserves                 | Respects CSS white-space |

```html
<!-- HTML Structure for examples below -->
<div id="demo">
  Hello <strong>World</strong>
  <span style="display:none">Hidden</span>
</div>
```

```javascript
const el = document.getElementById("demo");

// ── innerHTML ─────────────────────────────────────────────
console.log(el.innerHTML);
// → "Hello <strong>World</strong>\n  <span style="display:none">Hidden</span>"

el.innerHTML = "<em>New Content</em>"; // parses HTML, renders <em>
el.innerHTML = "<img src=x onerror=alert('XSS')>"; // 🚨 XSS ATTACK!

// ── textContent ───────────────────────────────────────────
console.log(el.textContent);
// → "Hello World\n  Hidden"  (includes hidden, strips tags)

el.textContent = "<strong>Safe</strong>"; // displays literally as text
// Renders: <strong>Safe</strong> (not bold — it's text!) ✓

// ── innerText ─────────────────────────────────────────────
console.log(el.innerText);
// → "Hello World"  (excludes hidden, triggers layout reflow!)

el.innerText = "New Text"; // sets visible text

// ── Safe HTML insertion alternatives ─────────────────────
// Option 1: textContent (safest)
function setUserContent(el, userInput) {
  el.textContent = userInput; // ✓ always safe
}

// Option 2: DOMPurify (sanitize before innerHTML)
// import DOMPurify from "dompurify";
// el.innerHTML = DOMPurify.sanitize(userInput); // ✓ sanitized

// Option 3: Template with createElement
function renderUserName(container, name) {
  const span = document.createElement("span");
  span.textContent = name; // safe
  container.appendChild(span);
}
```

---

## 6. Attributes vs Properties

### Q: What is the difference between HTML attributes and DOM properties?

**A:**

- **Attributes** — defined in HTML; always strings; initial/default values
- **Properties** — live on DOM objects; can be any type; current values

```javascript
// HTML: <input id="username" type="text" value="initial" checked>
const input = document.querySelector("#username");

// ── Attributes (getAttribute/setAttribute) ────────────────
input.getAttribute("value");       // "initial" — always original HTML value
input.getAttribute("type");        // "text"
input.getAttribute("checked");     // "" (empty string — attribute exists)
input.getAttribute("nonexistent"); // null

input.setAttribute("value", "newDefault"); // changes the HTML attribute
input.removeAttribute("disabled");

// ── Properties (direct access) ────────────────────────────
input.value;            // CURRENT value the user typed (live)
input.type;             // "text"
input.checked;          // true/false (boolean, not string!)
input.disabled;         // false (boolean)
input.id;               // "username"

// ── Key Difference ─────────────────────────────────────────
// User types "hello" into the input, then:
input.getAttribute("value"); // "initial" — attribute unchanged
input.value;                 // "hello" — property is live

// ── Sync Behavior ─────────────────────────────────────────
// Setting property does NOT always sync attribute:
input.value = "world";
input.getAttribute("value"); // "initial" — attribute NOT updated!

// Setting attribute DOES sync to property (for most):
input.setAttribute("value", "fresh");
input.value; // "fresh" — property updated

// ── href: attribute vs property ───────────────────────────
// HTML: <a id="link" href="/path">Click</a>
const link = document.querySelector("#link");
link.getAttribute("href"); // "/path" — relative URL
link.href;                 // "https://example.com/path" — absolute URL!

// ── data-* attributes and dataset ─────────────────────────
// HTML: <div data-user-id="42" data-user-name="Alice">
const dataEl = document.querySelector("[data-user-id]");
dataEl.getAttribute("data-user-id"); // "42" (string)
dataEl.dataset.userId;               // "42" — camelCase access
dataEl.dataset.userName;             // "Alice"

// Setting:
dataEl.dataset.role = "admin";
// creates: data-role="admin" attribute in HTML
```

---

## 7. Event Handling Patterns

### Q: What are the different ways to handle events and which is best practice?

**A:**

```javascript
// ── 1. Inline HTML (worst practice) ───────────────────────
// HTML: <button onclick="handleClick()">Click</button>
// Problems: mixes HTML/JS, can't remove, one handler only, uses eval-like scope

// ── 2. DOM property (legacy) ──────────────────────────────
const btn = document.getElementById("btn");
btn.onclick = function (e) {
  console.log("Clicked!", e.target);
};
// Problem: only ONE handler per event type — gets overwritten!
btn.onclick = function () { console.log("Second"); }; // replaces first!

// ── 3. addEventListener (best practice) ───────────────────
btn.addEventListener("click", function handleClick(e) {
  console.log("First handler", e.target);
});
btn.addEventListener("click", function handleClick2(e) {
  console.log("Second handler"); // BOTH fire! ✓
});

// Remove listener — requires SAME function reference
function myHandler(e) {
  console.log("Handled:", e.type);
}
btn.addEventListener("click", myHandler);
btn.removeEventListener("click", myHandler); // ✓ removed

// ── addEventListener Options ───────────────────────────────
btn.addEventListener("click", myHandler, {
  once: true,       // auto-removes after first invocation ✓
  passive: true,    // hint: won't call preventDefault (scroll perf boost)
  capture: true,    // use capture phase instead of bubble phase
});

// ── Passive listeners for scroll performance ───────────────
// Marking scroll/touch listeners as passive allows browser to
// start scrolling immediately without waiting for JS handler
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("touchstart", onTouch, { passive: true });

function onScroll() {}
function onTouch() {}

// ── Once option ───────────────────────────────────────────
btn.addEventListener("click", () => {
  console.log("Only fires once!");
}, { once: true });
```

---

## 8. Event Object Properties

### Q: What are the important properties of the Event object?

**A:**

```javascript
document.addEventListener("click", function (event) {
  // ── Target vs currentTarget ────────────────────────────
  event.target;        // element that was ACTUALLY clicked
  event.currentTarget; // element the listener is ATTACHED TO

  // Example: click on <li> inside <ul id="list">
  // If listener is on ul:
  //   target = <li>  (what was clicked)
  //   currentTarget = <ul>  (where listener lives)

  // ── Event type and timing ─────────────────────────────
  event.type;          // "click"
  event.timeStamp;     // ms since page load

  // ── Mouse event specifics ─────────────────────────────
  event.clientX;       // X relative to viewport
  event.clientY;       // Y relative to viewport
  event.pageX;         // X relative to full document
  event.pageY;         // Y relative to full document
  event.button;        // 0=left, 1=middle, 2=right
  event.buttons;       // bitmask of pressed buttons

  // ── Keyboard modifiers ────────────────────────────────
  event.ctrlKey;       // Ctrl held?
  event.shiftKey;      // Shift held?
  event.altKey;        // Alt held?
  event.metaKey;       // Cmd (Mac) / Win key held?

  // ── Propagation control ───────────────────────────────
  event.bubbles;             // does event bubble?
  event.cancelable;          // can preventDefault be called?
  event.defaultPrevented;    // was preventDefault called?
  event.stopPropagation();   // stop bubbling/capturing
  event.stopImmediatePropagation(); // stop ALL handlers for this event
  event.preventDefault();    // prevent browser's default action

  // ── Related target (for mouse events) ─────────────────
  event.relatedTarget; // mouseover: element left; mouseout: element entered
});

// ── Keyboard Events ────────────────────────────────────────
document.addEventListener("keydown", function (e) {
  console.log(e.key);       // "Enter", "ArrowUp", "a", etc.
  console.log(e.code);      // "Enter", "ArrowUp", "KeyA" (physical key)
  console.log(e.keyCode);   // deprecated! use e.key instead
  console.log(e.repeat);    // true if key is held down

  if (e.key === "Enter" && e.ctrlKey) {
    console.log("Ctrl+Enter pressed");
    e.preventDefault(); // stop default action
  }
});

// ── Form Events ────────────────────────────────────────────
const form = document.getElementById("myForm");
form.addEventListener("submit", function (e) {
  e.preventDefault(); // stop form submission → handle with JS
  const formData = new FormData(e.target);
  console.log(Object.fromEntries(formData));
});

// ── Input Events ───────────────────────────────────────────
const input = document.querySelector("input");
input.addEventListener("input", (e) => {
  console.log("Live value:", e.target.value); // fires on every keystroke
});
input.addEventListener("change", (e) => {
  console.log("Committed:", e.target.value); // fires on blur/enter
});
```

---

## 9. Event Delegation

### Q: What is event delegation and why is it preferred for dynamic lists?

**A:** Event delegation attaches **one listener to a parent** element instead of many listeners on children. It uses event bubbling — child events bubble up to the parent.

### Without Delegation (Problem)

```javascript
// BAD: Adding listener to each item individually
const items = document.querySelectorAll(".list-item");

items.forEach(item => {
  item.addEventListener("click", function () {
    this.classList.toggle("selected");
  });
});
// Problems:
// 1. N listeners for N items — memory intensive
// 2. New items added dynamically have NO listener!
// 3. Must re-attach listeners after DOM updates
```

### With Delegation (Solution)

```javascript
// GOOD: One listener on parent handles ALL children
const list = document.getElementById("dynamic-list");

list.addEventListener("click", function (event) {
  // event.target = the element that was actually clicked
  const item = event.target.closest(".list-item"); // find closest ancestor

  if (!item) return; // click was on something else inside list

  item.classList.toggle("selected");
  console.log("Toggled:", item.dataset.id);
});

// Now dynamically added items work automatically! ✓
function addItem(id, text) {
  const li = document.createElement("li");
  li.className = "list-item";
  li.dataset.id = id;
  li.textContent = text;
  list.appendChild(li); // click handled by existing parent listener ✓
}

addItem(101, "New Item");
addItem(102, "Another Item");
```

### Advanced Delegation — Multiple Actions

```javascript
// Handle different actions based on button inside each row
const tableBody = document.getElementById("table-body");

tableBody.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const row = button.closest("tr");
  const id = row?.dataset.id;

  switch (action) {
    case "edit":
      openEditModal(id);
      break;
    case "delete":
      deleteRow(id, row);
      break;
    case "view":
      viewDetails(id);
      break;
  }
});

function openEditModal(id) { console.log("Edit:", id); }
function deleteRow(id, row) {
  if (confirm(`Delete item ${id}?`)) row.remove();
}
function viewDetails(id) { console.log("View:", id); }

// HTML structure:
// <tbody id="table-body">
//   <tr data-id="1">
//     <td>Alice</td>
//     <td>
//       <button data-action="edit">Edit</button>
//       <button data-action="delete">Delete</button>
//       <button data-action="view">View</button>
//     </td>
//   </tr>
// </tbody>
```

---

## 10. Event Bubbling and Capturing

### Q: Explain event bubbling and capturing phases with examples.

**A:**

```
Event Phases:
                         ┌──────────────────────┐
CAPTURE  ──────────────► │      document        │ ◄──────── BUBBLE
(top-down)               ├──────────────────────┤  (bottom-up)
                         │        body          │
                         ├──────────────────────┤
                         │        div           │
                         ├──────────────────────┤
                         │       button ← 🖱️ CLICK (target phase)
                         └──────────────────────┘
```

```javascript
// event.eventPhase: 1=Capturing, 2=Target, 3=Bubbling
const div = document.getElementById("outer");
const btn = document.getElementById("inner-btn");

// ── Bubbling (default — useCapture: false) ─────────────────
div.addEventListener("click", (e) => {
  console.log("div BUBBLE", e.eventPhase); // 3 — fires 2nd
});
btn.addEventListener("click", (e) => {
  console.log("btn TARGET", e.eventPhase); // 2 — fires 1st
});

// ── Capturing (useCapture: true) ──────────────────────────
div.addEventListener("click", (e) => {
  console.log("div CAPTURE", e.eventPhase); // 1 — fires 1st (before btn!)
}, true);

// Click on btn → order: div(capture) → btn(target) → div(bubble)

// ── stopPropagation ───────────────────────────────────────
btn.addEventListener("click", (e) => {
  e.stopPropagation(); // stop bubbling — div bubble handler won't fire
  console.log("btn clicked, bubble stopped");
});

// ── stopImmediatePropagation ──────────────────────────────
btn.addEventListener("click", (e) => {
  e.stopImmediatePropagation(); // stops ALL remaining handlers for this event
  console.log("First handler — stops everything");
});
btn.addEventListener("click", () => {
  console.log("Second handler — will NOT fire");
});

// ── Events that don't bubble ──────────────────────────────
// focus, blur, load, unload, scroll, resize do NOT bubble
// Use focusin/focusout instead (they do bubble)
document.addEventListener("focus", handler, true);    // must use capture!
document.addEventListener("focusin", handler);        // bubbles ✓
```

---

## 11. Custom Events

### Q: How do you create and dispatch custom events in JavaScript?

**A:**

```javascript
// ── Creating a Custom Event ────────────────────────────────
const event = new CustomEvent("user:login", {
  detail: {               // arbitrary data payload
    userId: 42,
    username: "Alice",
    timestamp: Date.now()
  },
  bubbles: true,          // allow event to bubble up DOM
  cancelable: true,       // allow preventDefault
  composed: false,        // cross shadow DOM? (default false)
});

// ── Dispatching ───────────────────────────────────────────
document.getElementById("app").dispatchEvent(event);

// Or on window for global events:
window.dispatchEvent(new CustomEvent("app:ready", { detail: { version: "1.0" } }));

// ── Listening ─────────────────────────────────────────────
document.addEventListener("user:login", function (e) {
  console.log("User logged in:", e.detail.username);
  console.log("User ID:", e.detail.userId);
  console.log("Time:", new Date(e.detail.timestamp).toISOString());
});

// ── Real-World Pattern: Event Bus ─────────────────────────
class EventBus {
  constructor() {
    this.element = new EventTarget(); // use EventTarget as bus
  }

  on(eventName, handler) {
    this.element.addEventListener(eventName, handler);
    return () => this.off(eventName, handler); // return unsubscribe fn
  }

  off(eventName, handler) {
    this.element.removeEventListener(eventName, handler);
  }

  emit(eventName, detail = {}) {
    this.element.dispatchEvent(new CustomEvent(eventName, {
      detail,
      bubbles: false,
      cancelable: false
    }));
  }
}

const bus = new EventBus();

const unsubscribe = bus.on("cart:updated", (e) => {
  console.log("Cart updated:", e.detail);
  updateCartUI(e.detail);
});

function updateCartUI(detail) {
  console.log("UI updated with:", detail);
}

// Emit from anywhere in the app
bus.emit("cart:updated", { itemCount: 3, total: 59.99 });

// Cleanup
unsubscribe();
```

---

## 12. DOM Traversal

### Q: What DOM traversal properties are available and what are their differences?

**A:**

```javascript
const parent = document.getElementById("parent");
const child = document.getElementById("child");

// ── Parent traversal ──────────────────────────────────────
child.parentNode;       // parent Node (could be Document)
child.parentElement;    // parent Element (null if parent is Document)

// ── Children traversal ────────────────────────────────────
parent.childNodes;         // NodeList: ALL nodes (elements + text + comments)
parent.children;           // HTMLCollection: ONLY Element children
parent.firstChild;         // first Node (might be text node!)
parent.firstElementChild;  // first Element (skips text/comments) ✓
parent.lastChild;          // last Node
parent.lastElementChild;   // last Element ✓
parent.childElementCount;  // number of child elements

// ── Sibling traversal ─────────────────────────────────────
child.nextSibling;         // next Node (might be text node!)
child.nextElementSibling;  // next Element ✓
child.previousSibling;     // previous Node
child.previousElementSibling; // previous Element ✓

// ── Ancestor search ───────────────────────────────────────
// closest() — searches UP through ancestors for matching selector
const btn = document.querySelector("button");
const card = btn.closest(".card");          // nearest .card ancestor
const form = btn.closest("form");           // nearest form ancestor
const result = btn.closest("[data-role]");  // nearest with data-role attr

if (card) {
  card.classList.add("active");
}

// ── matches() — check if element matches selector ─────────
const el = document.querySelector(".item");
el.matches(".item");           // true
el.matches(".item.active");    // depends on classes
el.matches("[data-id]");       // does it have data-id?

// ── contains() — check if element is descendant ───────────
const container = document.getElementById("container");
const inner = document.querySelector(".inner");
container.contains(inner); // true if inner is inside container

// ── Practical traversal: walk all descendants ─────────────
function walkDOM(node, callback) {
  callback(node);
  node.children && Array.from(node.children).forEach(child => {
    walkDOM(child, callback);
  });
}

walkDOM(document.body, (el) => {
  if (el.nodeType === 1) { // Element nodes only
    console.log(el.tagName, el.className);
  }
});
```

---

## 13. DocumentFragment

### Q: What is DocumentFragment and why should you use it for batch DOM insertions?

**A:** `DocumentFragment` is a **lightweight off-screen container** that holds DOM nodes without being part of the live DOM tree.

```javascript
// ─── Problem: Each appendChild triggers reflow ─────────────
const list = document.getElementById("list");

// BAD: 1000 DOM mutations = 1000 potential reflows!
for (let i = 0; i < 1000; i++) {
  const li = document.createElement("li");
  li.textContent = `Item ${i}`;
  list.appendChild(li); // forces potential layout recalculation each time
}

// ─── Solution: DocumentFragment ────────────────────────────
const fragment = document.createDocumentFragment();

// Build everything off-screen (no reflow triggered)
for (let i = 0; i < 1000; i++) {
  const li = document.createElement("li");
  li.textContent = `Item ${i}`;
  fragment.appendChild(li); // no DOM interaction, no reflow
}

// ONE single DOM mutation — ONE reflow ✓
list.appendChild(fragment);
// Note: fragment itself is NOT inserted — only its children are

// ─── Fragment is emptied after append ─────────────────────
console.log(fragment.childNodes.length); // 0 — children moved to list

// ─── Practical Example: Render table rows ─────────────────
function renderRows(data) {
  const tbody = document.getElementById("tbody");
  const fragment = document.createDocumentFragment();

  data.forEach(({ id, name, score }) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${id}</td><td>${name}</td><td>${score}</td>`;
    // Note: Using innerHTML here is safe since data is controlled
    fragment.appendChild(tr);
  });

  tbody.appendChild(fragment); // single DOM update ✓
}

renderRows([
  { id: 1, name: "Alice", score: 95 },
  { id: 2, name: "Bob",   score: 87 },
  { id: 3, name: "Carol", score: 92 },
]);

// ─── Alternative: innerHTML string concatenation ──────────
// (faster for large static lists, but unsafe with user data)
function renderRowsFast(data) {
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = data.map(({ id, name, score }) =>
    `<tr><td>${id}</td><td>${name}</td><td>${score}</td></tr>`
  ).join("");
}
```

---

## 14. MutationObserver

### Q: What is MutationObserver and how is it used?

**A:** `MutationObserver` watches for changes to the DOM and fires a callback when they occur.

```javascript
// ─── Basic Usage ───────────────────────────────────────────
const targetNode = document.getElementById("app");

const observer = new MutationObserver(function (mutationList, observer) {
  for (const mutation of mutationList) {
    console.log("Mutation type:", mutation.type);

    if (mutation.type === "childList") {
      console.log("  Added nodes:", mutation.addedNodes);
      console.log("  Removed nodes:", mutation.removedNodes);
    }

    if (mutation.type === "attributes") {
      console.log("  Changed attribute:", mutation.attributeName);
      console.log("  Old value:", mutation.oldValue);
      console.log("  New value:", targetNode.getAttribute(mutation.attributeName));
    }

    if (mutation.type === "characterData") {
      console.log("  Text changed:", mutation.oldValue, "→", mutation.target.data);
    }
  }
});

// ─── Configuration ─────────────────────────────────────────
observer.observe(targetNode, {
  childList: true,           // watch for child nodes added/removed
  subtree: true,             // watch all descendants, not just direct children
  attributes: true,          // watch for attribute changes
  attributeOldValue: true,   // record old attribute value in mutation
  characterData: true,       // watch for text content changes
  characterDataOldValue: true, // record old text value
  attributeFilter: ["class", "data-state"], // only watch specific attributes
});

// ─── Stop observing ────────────────────────────────────────
observer.disconnect(); // stop watching

// ─── Use Case 1: Detect lazy-loaded images ─────────────────
const imageObserver = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType !== 1) return; // only elements
      if (node.tagName === "IMG" && node.dataset.src) {
        node.src = node.dataset.src; // trigger lazy load
        delete node.dataset.src;
      }
      // Also check descendants
      node.querySelectorAll?.("img[data-src]").forEach(img => {
        img.src = img.dataset.src;
        delete img.dataset.src;
      });
    });
  });
});

imageObserver.observe(document.body, { childList: true, subtree: true });

// ─── Use Case 2: Track class changes for analytics ─────────
const analyticsObserver = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.type === "attributes" && mutation.attributeName === "class") {
      const el = mutation.target;
      if (el.classList.contains("modal-open")) {
        trackEvent("modal_opened", { id: el.id });
      }
    }
  });
});

analyticsObserver.observe(document.body, {
  attributes: true,
  attributeFilter: ["class"],
  subtree: true
});

function trackEvent(name, data) { console.log("Track:", name, data); }
```

---

## 15. Virtual DOM vs Real DOM

### Q: What is the Virtual DOM and how does it differ from the Real DOM?

**A:**

| Aspect                | **Real DOM**                              | **Virtual DOM**                          |
|-----------------------|-------------------------------------------|------------------------------------------|
| **Nature**            | Actual browser DOM objects                | Lightweight JS object representation     |
| **Mutation speed**    | Slow (triggers reflow/repaint)            | Fast (pure JS object manipulation)       |
| **Memory**            | Heavy (full browser objects)             | Lightweight JS plain objects             |
| **Re-renders**        | Entire subtree may update                 | Diffed, only changes applied             |
| **Used by**           | Native browser APIs                       | React, Vue (internally)                  |

```javascript
// ─── Real DOM Node (simplified mental model) ───────────────
// {
//   tagName: "DIV",
//   id: "app",
//   className: "container",
//   children: [...DOM objects...],
//   style: CSSStyleDeclaration {...},
//   // + ~300 more properties/methods
// }

// ─── Virtual DOM Node (React's JSX compiles to) ────────────
// React.createElement("div", { className: "container" }, [...children])
// → plain JS object:
// {
//   type: "div",
//   props: { className: "container", children: [...] },
//   key: null,
//   ref: null,
// }

// ─── Virtual DOM Diffing (simplified) ─────────────────────
function diff(oldVNode, newVNode) {
  // Different type → replace entirely
  if (oldVNode.type !== newVNode.type) {
    return { type: "REPLACE", newNode: newVNode };
  }

  // Same type → compare props
  const patches = [];
  const allProps = new Set([
    ...Object.keys(oldVNode.props || {}),
    ...Object.keys(newVNode.props || {})
  ]);

  for (const prop of allProps) {
    if (oldVNode.props?.[prop] !== newVNode.props?.[prop]) {
      patches.push({ type: "PROP", key: prop, value: newVNode.props?.[prop] });
    }
  }

  return { type: "UPDATE", patches };
}

// React's reconciliation is far more sophisticated (Fiber architecture),
// but this illustrates the core concept of comparing old and new trees
// and only applying the minimum necessary real DOM changes.

// ─── Why Virtual DOM? ─────────────────────────────────────
// 1. Batches multiple state changes → single DOM update
// 2. Computes minimum diff before touching real DOM
// 3. Enables declarative UI (describe what, not how)
// 4. Enables server-side rendering (render to string)
// 5. Enables React Native (render to native components)
```

---

## 16. Performance — Reflow vs Repaint

### Q: What are reflow and repaint, and how do you avoid layout thrashing?

**A:**

| Term          | What triggers it                                 | Cost        |
|---------------|--------------------------------------------------|-------------|
| **Repaint**   | Visual changes (color, background, visibility)   | Moderate    |
| **Reflow**    | Layout changes (size, position, DOM structure)   | Expensive   |
| **Composite** | Transform, opacity (GPU-accelerated)             | Cheapest    |

### Layout Thrashing (The Problem)

```javascript
// ─── BAD: Forces browser to recalculate layout repeatedly ──
const boxes = document.querySelectorAll(".box");

// This loop causes layout thrashing!
boxes.forEach(box => {
  const width = box.offsetWidth;        // READ — forces layout
  box.style.width = width * 2 + "px";  // WRITE — invalidates layout
  // Next iteration: READ again → must recalculate layout!
});
// With 100 boxes = 100 forced layout recalculations 💥

// ─── GOOD: Batch reads, then batch writes ──────────────────
const boxes2 = document.querySelectorAll(".box");

// First: collect ALL measurements (batch reads)
const widths = Array.from(boxes2).map(box => box.offsetWidth);

// Then: apply ALL changes (batch writes)
boxes2.forEach((box, i) => {
  box.style.width = widths[i] * 2 + "px";
});
// Layout calculated ONCE ✓

// ─── Properties that trigger reflow ───────────────────────
// offsetWidth, offsetHeight, offsetTop, offsetLeft
// scrollWidth, scrollHeight, scrollTop, scrollLeft
// clientWidth, clientHeight, clientTop, clientLeft
// getBoundingClientRect()
// getComputedStyle()
// scrollIntoView()

// ─── requestAnimationFrame for visual updates ─────────────
function animateWidth(element, targetWidth) {
  let currentWidth = element.offsetWidth;

  function step() {
    currentWidth = Math.min(currentWidth + 5, targetWidth);
    element.style.width = currentWidth + "px";

    if (currentWidth < targetWidth) {
      requestAnimationFrame(step); // synced to browser paint cycle ✓
    }
  }

  requestAnimationFrame(step);
}

// ─── Use CSS transforms for animations (avoids reflow) ─────
// BAD — causes reflow:
// element.style.left = "100px";
// element.style.top = "200px";

// GOOD — GPU composited (no reflow):
// element.style.transform = "translate(100px, 200px)";
// element.style.opacity = "0.5";
```

### Batch DOM Updates with DocumentFragment

```javascript
function batchUpdate(container, items) {
  // Hide during updates (reduces visible repaints)
  container.style.visibility = "hidden";

  const fragment = document.createDocumentFragment();
  items.forEach(item => {
    const el = document.createElement("div");
    el.textContent = item;
    fragment.appendChild(el);
  });

  container.innerHTML = ""; // clear
  container.appendChild(fragment); // single DOM mutation
  container.style.visibility = "visible";
}
```

---

## 17. Quick Reference

| Topic                     | Key Point                                                              |
|---------------------------|------------------------------------------------------------------------|
| **DOM**                   | Tree of nodes representing HTML; manipulated via JavaScript            |
| **getElementById**        | Fastest selector; returns single element or null                       |
| **querySelectorAll**      | Static NodeList; CSS selector syntax; most flexible                    |
| **Live vs Static**        | getElementsBy* = live; querySelectorAll = static (snapshot)            |
| **innerHTML**             | Parses HTML; 🚨 XSS risk with user data; use textContent instead      |
| **textContent**           | Fast, safe text; ignores hidden elements; no HTML parsing              |
| **innerText**             | CSS-aware; triggers layout; use textContent for performance            |
| **Attribute vs Property** | Attribute = HTML initial value; Property = live DOM value              |
| **addEventListener**      | Best practice; multiple handlers; can be removed; supports options     |
| **Event delegation**      | One listener on parent; handles dynamic children; uses bubbling        |
| **Bubbling**              | Events propagate upward (child → parent → document)                   |
| **Capturing**             | Events propagate downward; set `{capture: true}` on listener           |
| **stopPropagation**       | Stops bubbling/capturing; doesn't prevent other handlers on same el    |
| **stopImmediatePropagation** | Stops ALL remaining handlers for this event                         |
| **CustomEvent**           | Create with `new CustomEvent(name, {detail, bubbles, cancelable})`     |
| **DocumentFragment**      | Off-screen container; batch insertions; ONE DOM mutation on append     |
| **MutationObserver**      | Watch DOM changes; disconnect when done; supports subtree              |
| **Virtual DOM**           | JS object representation; diffed against old; minimizes real DOM ops   |
| **Reflow**                | Layout recalculation; avoid triggering in loops; batch reads/writes    |
| **GPU compositing**       | Use `transform` and `opacity` for animations; avoids reflow            |

---

*Last updated: 2026-07-22 | Category: JavaScript / Browser APIs | Level: Beginner → Advanced*
