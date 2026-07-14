# Project Row Selection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir una franja naranja animada que identifique la fila bajo hover o foco sin interferir con la captura lateral seleccionada.

**Architecture:** La interacción visual usa hover y `focus-visible`; `.is-active` queda reservado para la sincronización de previews. Un pseudo-elemento CSS genera el lavado sin agregar markup ni JavaScript, mientras un test estructural fija el contrato responsive y de movimiento.

**Tech Stack:** CSS nativo, JavaScript existente, Node.js `node:test`.

## Global Constraints

- Reutilizar `--signal: #ff7142` como único color de acento.
- No modificar `index.html` ni `script.js`.
- Mantener el estado activo persistente existente.
- Desactivar el pseudo-elemento dentro de `@media (max-width: 760px)`.
- Respetar la regla global `prefers-reduced-motion`.

---

### Task 1: Añadir la selección animada de filas

**Files:**
- Modify: `tests/portfolio.test.mjs`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `.work-row`, `.work-action`, `--signal` y `setActiveProject()` existentes.
- Produces: `.work-row::before` como franja visual transitoria para hover y foco.

- [ ] **Step 1: Escribir el test fallido**

Agregar a `tests/portfolio.test.mjs`:

```js
test("project rows expose the animated accent selection", () => {
  const css = read("styles.css");

  assert.match(css, /\.work-row::before\s*\{/);
  assert.match(css, /transform-origin:\s*left center/);
  assert.match(css, /transform:\s*scaleX\(0\)/);
  assert.match(css, /\.work-row:hover::before,[\s\S]*transform:\s*scaleX\(1\)/);
  assert.doesNotMatch(css, /\.work-row\.is-active/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)[\s\S]*\.work-row::before\s*\{[\s\S]*content:\s*none/);
});
```

- [ ] **Step 2: Confirmar el rojo**

Run: `node --test tests/portfolio.test.mjs`

Expected: 12 pruebas previas pasan y `project rows expose the animated accent selection` falla porque `.work-row::before` todavía no existe.

- [ ] **Step 3: Implementar el CSS mínimo**

Agregar a las reglas existentes de `styles.css`:

```css
.work-row {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}

.work-row::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-left: 4px solid var(--signal);
  background: linear-gradient(
    90deg,
    rgba(255, 113, 66, 0.15),
    rgba(255, 113, 66, 0.055) 58%,
    transparent 100%
  );
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 750ms cubic-bezier(0.4, 0, 0.2, 1);
}

.work-row:hover::before,
.work-row:focus-visible::before {
  transform: scaleX(1);
}

.work-row:hover .work-action,
.work-row:focus-visible .work-action {
  color: var(--signal);
}

@media (max-width: 760px) {
  .work-row::before {
    content: none;
  }
}
```

- [ ] **Step 4: Confirmar el verde**

Run: `node --test tests/portfolio.test.mjs`

Expected: 13 pruebas, 13 pasan, 0 fallan.

- [ ] **Step 5: Verificar el diff y la interacción local**

Run: `git diff --check`

Expected: sin errores. Después recargar `http://127.0.0.1:4173/`, desplazar hasta Trabajo seleccionado y comprobar la transición sobre las cuatro filas.
