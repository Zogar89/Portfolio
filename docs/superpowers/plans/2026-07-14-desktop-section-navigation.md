# Desktop Section Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar a la home una guía lateral de escritorio que permita saltar libremente entre Inicio, Método, Proyectos y Cierre y muestre la sección activa.

**Architecture:** La navegación será HTML progresivo con anchors nativos. CSS la presentará como un rail fijo sólo desde `1180px`; JavaScript reutilizará `IntersectionObserver` para sincronizar el estado activo y `aria-current` sin interceptar el scroll.

**Tech Stack:** HTML5, CSS, JavaScript sin dependencias, Node.js test runner.

## Global Constraints

- Mantener scroll libre; no usar `scroll-snap` ni interceptar rueda o trackpad.
- Mostrar la guía únicamente mediante `@media (min-width: 1180px)`.
- Mantener funcionalidad básica sin JavaScript.
- Respetar `prefers-reduced-motion: reduce`.
- No modificar las páginas de proyectos ni los archivos sin seguimiento existentes.

---

### Task 1: Contrato semántico y visual del rail

**Files:**
- Modify: `tests/portfolio.test.mjs`
- Modify: `index.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: anchors existentes `#inicio` y `#proyectos`.
- Produces: `[data-section-nav]`, enlaces `[data-section-link]` y destinos `[data-section]` con IDs `inicio`, `metodo`, `proyectos` y `cierre`.

- [x] **Step 1: Write the failing test**

Agregar a `tests/portfolio.test.mjs`:

```js
test("home exposes accessible desktop section navigation", () => {
  const html = read("index.html");
  const css = read("styles.css");
  const sectionIds = ["inicio", "metodo", "proyectos", "cierre"];

  assert.match(html, /data-section-nav/);
  assert.match(html, /aria-label="Secciones de la página"/);

  for (const id of sectionIds) {
    assert.match(html, new RegExp(`id="${id}"[^>]*data-section`));
    assert.match(html, new RegExp(`href="#${id}"[^>]*data-section-link`));
  }

  assert.match(css, /@media\s*\(min-width:\s*1180px\)/);
  assert.match(css, /\.section-nav/);
  assert.match(css, /scroll-margin-top/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `node --test tests/portfolio.test.mjs`

Expected: FAIL en `home exposes accessible desktop section navigation` porque `data-section-nav` todavía no existe.

- [x] **Step 3: Write minimal HTML and CSS**

En `index.html`, agregar antes de `<main>`:

```html
<nav class="section-nav" data-section-nav aria-label="Secciones de la página">
  <a class="section-nav-link is-active" href="#inicio" data-section-link aria-label="Inicio" aria-current="location"><span aria-hidden="true">01</span><span class="section-nav-label">Inicio</span></a>
  <a class="section-nav-link" href="#metodo" data-section-link aria-label="Método"><span aria-hidden="true">02</span><span class="section-nav-label">Método</span></a>
  <a class="section-nav-link" href="#proyectos" data-section-link aria-label="Proyectos"><span aria-hidden="true">03</span><span class="section-nav-label">Proyectos</span></a>
  <a class="section-nav-link" href="#cierre" data-section-link aria-label="Cierre"><span aria-hidden="true">04</span><span class="section-nav-label">Cierre</span></a>
</nav>
```

Marcar los destinos como:

```html
<main id="inicio" data-section>
<section class="method" id="metodo" data-section ...>
<section class="selected-work" id="proyectos" data-section>
<section class="closing-statement" id="cierre" data-section ...>
```

Agregar a `styles.css`:

```css
[data-section] {
  scroll-margin-top: 88px;
}

.section-nav {
  display: none;
}

@media (min-width: 1180px) {
  .section-nav {
    position: fixed;
    top: 50%;
    right: clamp(8px, 1.6vw, 28px);
    z-index: 18;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transform: translateY(-50%);
  }

  .section-nav-link {
    position: relative;
    display: grid;
    width: 44px;
    min-height: 44px;
    place-items: center;
    border-right: 2px solid var(--line-strong);
    color: var(--steel);
    font-family: var(--mono);
    font-size: 0.68rem;
    font-weight: 700;
    transition: color 180ms ease, border-color 180ms ease;
  }

  .section-nav-link:hover,
  .section-nav-link:focus-visible,
  .section-nav-link.is-active {
    border-color: var(--signal);
    color: var(--signal);
  }

  .section-nav-label {
    position: absolute;
    top: 50%;
    right: calc(100% + 10px);
    padding: 6px 9px;
    border: 1px solid var(--line);
    background: rgba(12, 12, 15, 0.94);
    color: var(--paper);
    font-family: var(--sans);
    font-size: 0.72rem;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transform: translate(6px, -50%);
    transition: opacity 160ms ease, transform 160ms ease;
  }

  .section-nav-link:hover .section-nav-label,
  .section-nav-link:focus-visible .section-nav-label {
    opacity: 1;
    transform: translate(0, -50%);
  }
}
```

- [x] **Step 4: Run test to verify it passes**

Run: `node --test tests/portfolio.test.mjs`

Expected: todos los tests PASS.

### Task 2: Sincronización progresiva de sección activa

**Files:**
- Modify: `tests/portfolio.test.mjs`
- Modify: `script.js`

**Interfaces:**
- Consumes: `[data-section-nav]`, `[data-section-link]` y `[data-section]` de Task 1.
- Produces: `setActiveSection(id)` que sincroniza `.is-active` y `aria-current="location"`.

- [x] **Step 1: Write the failing test**

Extender `javascript is progressive and exposes the approved interactions` con:

```js
assert.match(javascript, /data-section-link/);
assert.match(javascript, /data-section/);
assert.match(javascript, /aria-current/);
assert.match(javascript, /setActiveSection/);
assert.doesNotMatch(javascript, /addEventListener\(["']scroll["']/);
```

- [x] **Step 2: Run test to verify it fails**

Run: `node --test tests/portfolio.test.mjs`

Expected: FAIL porque `script.js` todavía no contiene `data-section-link`.

- [x] **Step 3: Write minimal JavaScript**

Agregar a `script.js`:

```js
const sectionLinks = document.querySelectorAll("[data-section-link]");
const pageSections = document.querySelectorAll("[data-section]");

const setActiveSection = (id) => {
  sectionLinks.forEach((link) => {
    const isActive = link.hash === `#${id}`;
    link.classList.toggle("is-active", isActive);

    if (isActive) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
};

if ("IntersectionObserver" in window && sectionLinks.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) setActiveSection(visible.target.id);
    },
    { rootMargin: "-20% 0px -55%", threshold: [0, 0.15, 0.35, 0.6] },
  );

  pageSections.forEach((section) => sectionObserver.observe(section));
}
```

- [x] **Step 4: Run tests and inspect the diff**

Run: `node --test tests/portfolio.test.mjs`

Expected: todos los tests PASS.

Run: `git diff --check`

Expected: sin salida y exit code `0`.

- [x] **Step 5: Verify automated behavior and commit**

Verificar de forma automatizada que los cuatro anchors existen, el estado activo se sincroniza con `IntersectionObserver`, no hay listener continuo de `scroll` ni `scroll-snap`, y el rail sólo se habilita desde `1180px`. La revisión visual fue omitida por decisión del usuario.

```bash
git add index.html styles.css script.js tests/portfolio.test.mjs docs/superpowers/plans/2026-07-14-desktop-section-navigation.md
git commit -m "feat: add desktop section navigation"
```
