# Editorial Hero Balance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reequilibrar el hero de la home en pantallas anchas y altas sin alterar el contenido ni los breakpoints de tablet y móvil.

**Architecture:** El cambio se implementa como una mejora CSS progresiva dentro de una media query combinada. Un test estructural sobre el stylesheet fija el contrato responsive y permite demostrar el ciclo rojo-verde antes de modificar producción.

**Tech Stack:** HTML estático, CSS nativo, Node.js `node:test`.

## Global Constraints

- Activar el ajuste únicamente desde `1440px` de ancho y `900px` de alto.
- Usar `clamp(820px, 88dvh, 1200px)` para la altura del hero.
- Conservar contenido, paleta, tipografías, rutas, JavaScript y páginas de proyectos.
- No modificar los breakpoints existentes de tablet y móvil.
- No tocar `.codex-remote-attachments/`, `landing-mock.html` ni `landing-mock.css`.

---

### Task 1: Reequilibrar el hero editorial en desktop ancho y alto

**Files:**
- Modify: `tests/portfolio.test.mjs`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `.editorial-hero`, `.hero-statement`, `.hero-statement h1` y `.hero-aside` existentes.
- Produces: un breakpoint CSS `@media (min-width: 1440px) and (min-height: 900px)` que sólo recompone el hero.

- [ ] **Step 1: Escribir el test fallido**

Agregar a `tests/portfolio.test.mjs`:

```js
test("wide and tall desktops use the balanced editorial hero", () => {
  const css = read("styles.css");

  assert.match(
    css,
    /@media\s*\(min-width:\s*1440px\)\s*and\s*\(min-height:\s*900px\)/,
  );
  assert.match(css, /min-height:\s*clamp\(820px,\s*88dvh,\s*1200px\)/);
  assert.match(css, /justify-content:\s*flex-start/);
  assert.match(css, /align-content:\s*center/);
});
```

- [ ] **Step 2: Ejecutar el test y comprobar el rojo**

Run: `node --test tests/portfolio.test.mjs`

Expected: `wide and tall desktops use the balanced editorial hero` falla porque el breakpoint todavía no existe; los 11 tests previos siguen pasando.

- [ ] **Step 3: Implementar el CSS mínimo**

Agregar después del breakpoint de `1180px` y antes del breakpoint de `760px`:

```css
@media (min-width: 1440px) and (min-height: 900px) {
  .editorial-hero {
    min-height: clamp(820px, 88dvh, 1200px);
    justify-content: flex-start;
    padding-top: clamp(42px, 4vh, 60px);
    padding-bottom: clamp(54px, 6vh, 76px);
  }

  .hero-statement {
    flex: 1;
    align-content: center;
    padding-top: clamp(72px, 9vh, 116px);
  }

  .hero-statement h1 {
    max-width: 12.5ch;
  }

  .hero-aside {
    width: min(100%, 320px);
    justify-self: end;
  }
}
```

- [ ] **Step 4: Ejecutar la suite y comprobar el verde**

Run: `node --test tests/portfolio.test.mjs`

Expected: 12 tests, 12 pasan, 0 fallan.

- [ ] **Step 5: Revisar el diff y la reversibilidad**

Run: `git diff --check && git diff -- tests/portfolio.test.mjs styles.css`

Expected: `git diff --check` no emite errores; el diff funcional sólo contiene el test y la media query aprobados.
