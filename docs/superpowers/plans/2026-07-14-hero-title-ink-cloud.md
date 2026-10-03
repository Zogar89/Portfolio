# Hero Title Ink Cloud Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar una nube radial negra leve detrás del título principal para preservar su legibilidad sobre la curva animada.

**Architecture:** La protección se implementará únicamente con `::before` sobre `.hero-statement h1`. El pseudo-elemento seguirá la caja real del título y quedará entre la serie de datos y el texto, sin cambios de markup ni JavaScript.

**Tech Stack:** HTML estático, CSS nativo y pruebas con `node:test`.

## Global Constraints

- No modificar selectores, keyframes, markup ni sincronización `hero-cta-*` del destello existente.
- Mantener la intensidad baja y conservar parcialmente visible la curva.
- Desactivar la nube junto con el gráfico en el breakpoint móvil de `760px`.
- No agregar animaciones ni dependencias.

---

### Task 1: Nube radial responsiva del título

**Files:**
- Modify: `styles.css`
- Test: `tests/portfolio.test.mjs`

**Interfaces:**
- Consumes: `.hero-statement h1` y el breakpoint existente `@media (max-width: 760px)`.
- Produces: `.hero-statement h1::before` como capa visual no interactiva.

- [ ] **Step 1: Escribir la prueba fallida**

Agregar al contrato del hero aserciones para `position: relative`, `isolation: isolate`, el pseudo-elemento con `radial-gradient`, `filter: blur(...)`, `pointer-events: none` y su desactivación móvil.

- [ ] **Step 2: Confirmar el fallo**

Ejecutar:

```powershell
node --test --test-name-pattern="title ink cloud" tests/portfolio.test.mjs
```

Resultado esperado: `FAIL` porque `.hero-statement h1::before` todavía no existe.

- [ ] **Step 3: Implementar el CSS mínimo**

Configurar el `h1` como contexto aislado y agregar un pseudo-elemento con margen negativo fluido, degradado radial negro semitransparente y desenfoque moderado. Mantener el texto en `z-index: 1` mediante aislamiento, sin editar ningún selector `hero-cta-*`.

- [ ] **Step 4: Confirmar la prueba y el conjunto completo**

Ejecutar:

```powershell
node --test --test-name-pattern="title ink cloud" tests/portfolio.test.mjs
node --test tests/portfolio.test.mjs
node --check script.js
git diff --check
```

Resultado esperado: todas las pruebas pasan y no hay errores de sintaxis ni whitespace.

- [ ] **Step 5: Verificación visual**

Revisar en local 1440×900, 2048×1152, 3840×2160 y 760px. Confirmar que la nube sigue los saltos de línea, no parece una caja, la curva permanece visible y el destello conserva su comportamiento.
