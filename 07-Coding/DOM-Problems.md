# 🌐 DOM & Machine Coding Problems — Senior UI Interview

> **Category:** Coding | **Level:** Advanced
> **Last Updated:** 2026-07-26

---

## 1. Custom Event Emitter (Pub / Sub Pattern)

### Problem
Implement an `EventEmitter` class with `on`, `off`, `emit`, and `once` subscription capabilities.

```javascript
class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(eventName, callback) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    this.events.get(eventName).push(callback);

    // Return unsubscribe function
    return () => this.off(eventName, callback);
  }

  off(eventName, callback) {
    if (!this.events.has(eventName)) return;
    const callbacks = this.events.get(eventName).filter(cb => cb !== callback);
    this.events.set(eventName, callbacks);
  }

  emit(eventName, ...args) {
    if (!this.events.has(eventName)) return;
    this.events.get(eventName).forEach(callback => callback(...args));
  }

  once(eventName, callback) {
    const wrapper = (...args) => {
      callback(...args);
      this.off(eventName, wrapper);
    };
    this.on(eventName, wrapper);
  }
}

// Test
const emitter = new EventEmitter();
const unsub = emitter.on('login', (user) => console.log('Welcome', user));

emitter.emit('login', 'Alice'); // "Welcome Alice"
unsub(); // Unsubscribe
emitter.emit('login', 'Bob');   // Nothing logged
```

---

## 2. Event Delegation Pattern

### Problem
Implement a function `delegate(parentEl, selector, eventType, handler)` that listens to events on child elements dynamically matching a selector.

```javascript
function delegate(parentEl, selector, eventType, handler) {
  parentEl.addEventListener(eventType, function(event) {
    const targetElement = event.target.closest(selector);

    if (targetElement && parentEl.contains(targetElement)) {
      handler.call(targetElement, event);
    }
  });
}

// Usage Example:
// delegate(document.getElementById('user-table'), 'button.delete-btn', 'click', function(e) {
//   console.log('Delete button clicked for row:', this.dataset.id);
// });
```

---

## 3. DOM Tree Traversal — Find Path to Element

### Problem
Given a DOM node inside a root container, return the array of element tag names forming the path from root to node.

```javascript
function getDomPath(root, target) {
  const path = [];
  let current = target;

  while (current && current !== root.parentNode) {
    path.unshift(current.tagName.toLowerCase());
    current = current.parentNode;
  }

  return path;
}

// Example Output: ["div#app", "main.content", "section", "button"]
```

---

## 📝 Quick Reference

```
DOM Patterns:
• EventEmitter: Map of array of callbacks.
• Event Delegation: Use event.target.closest(selector) to handle dynamic elements.
• Dom Traversal: Loop parentNode until container root.
```

---

*Senior UI Developer Interview Prep — DOM Coding Problems*
