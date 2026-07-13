# Portfolio Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir la home y los cuatro case studies en el sistema editorial de expedientes aprobado, conservando rutas, contenido verificado y compatibilidad con GitHub Pages.

**Architecture:** El sitio sigue siendo HTML, CSS y JavaScript estáticos sin build. `styles.css` contiene tokens y patrones compartidos; cada HTML conserva contenido semántico específico; `script.js` agrega mejoras progresivas sin ocultar contenido cuando JavaScript no está disponible.

**Tech Stack:** HTML5, CSS moderno, JavaScript ES2022, Node.js 24 `node:test`, GitHub Pages.

## Global Constraints

- No agregar frameworks, librerías, pipeline de build ni fuentes remotas.
- Mantener las rutas `projects/*/`, los enlaces externos existentes y las dimensiones explícitas de imágenes.
- Mantener intactos `landing-mock.html`, `landing-mock.css` y `.codex-remote-attachments/`.
- Usar `#0c0c0f`, `#f3f0e8`, `#ff7142` y `#73737c` como roles de color compartidos.
- El contenido y la navegación deben funcionar sin JavaScript.
- Respetar teclado, `:focus-visible`, contraste y `prefers-reduced-motion`.

---

## File Map

- `index.html`: home editorial e índice de proyectos.
- `projects/meli-core-dumper/index.html`: expediente de BI y señales.
- `projects/stock-central/index.html`: expediente de runtime estático y jobs.
- `projects/silver-usage-report/index.html`: expediente de privacidad y collector.
- `projects/monitor-reviews/index.html`: expediente de reviews y sincronización.
- `styles.css`: tokens, layouts editoriales, evidencia, responsive y estados.
- `script.js`: enlaces externos, revelado progresivo y selector de evidencia.
- `tests/portfolio.test.mjs`: contratos estructurales, enlaces, assets y progressive enhancement.

### Task 1: Contrato de la home editorial

**Files:**
- Create: `tests/portfolio.test.mjs`
- Modify: `index.html`

**Interfaces:**
- Consumes: rutas y assets actuales.
- Produces: selectores `.work-index`, `.work-row[data-project]`, `.work-preview[data-preview]` y `#proyectos` usados por CSS y JavaScript.

- [ ] **Step 1: Escribir los tests fallidos de la home**

Crear helpers basados en `node:fs`, `node:path` y `node:test`. El contrato de la home debe verificar:

```js
test("home exposes the editorial project index", () => {
  const html = read("index.html");
  assert.match(html, /Problemas reales\.\s*Productos que operan\./);
  assert.match(html, /class="work-index"/);
  assert.equal((html.match(/class="work-row/g) ?? []).length, 4);
  assert.doesNotMatch(html, /stats-panel|case-card/);
});

test("home keeps every public project route", () => {
  const html = read("index.html");
  for (const route of projectRoutes) assert.match(html, new RegExp(escape(route)));
});
```

- [ ] **Step 2: Ejecutar el test y comprobar el fallo**

Run: `node --test tests/portfolio.test.mjs`

Expected: FAIL porque `index.html` todavía contiene `stats-panel` y `case-card` y no contiene `.work-index`.

- [ ] **Step 3: Reescribir la home**

Implementar esta estructura semántica:

```html
<main id="inicio">
  <section class="editorial-hero">
    <p class="kicker">Producto × Ingeniería</p>
    <h1>Problemas reales. Productos que operan.</h1>
    <p class="hero-lead">Diseño y construyo herramientas donde datos, APIs y decisiones de producto tienen que convivir.</p>
  </section>
  <section class="method" aria-label="Forma de trabajo">
    <ol class="method-list">
      <li><span>01</span>Detectar la fricción</li>
      <li><span>02</span>Diseñar la apuesta</li>
      <li><span>03</span>Construir el sistema</li>
      <li><span>04</span>Dejarlo operando</li>
    </ol>
  </section>
  <section class="selected-work section" id="proyectos">
    <header class="section-intro"><p class="kicker">Trabajo seleccionado</p><h2>Cuatro fricciones convertidas en producto.</h2></header>
    <div class="work-index">
      <div class="work-list">
        <a class="work-row is-active" data-project="meli" href="projects/meli-core-dumper/"><span>01</span><h3>Meli Core Dumper</h3><p>Inteligencia para sellers dentro del producto.</p></a>
        <a class="work-row" data-project="stock" href="projects/stock-central/"><span>02</span><h3>Stock Central</h3><p>Jobs como backend. Pages como runtime.</p></a>
        <a class="work-row" data-project="silver" href="projects/silver-usage-report/"><span>03</span><h3>Silver Usage Report</h3><p>Privacidad convertida en arquitectura.</p></a>
        <a class="work-row" data-project="reviews" href="projects/monitor-reviews/"><span>04</span><h3>Monitor de Reviews</h3><p>Una grieta concreta en la operación seller.</p></a>
      </div>
      <div class="work-previews" aria-hidden="true">
        <figure class="work-preview is-active" data-preview="meli"><img src="assets/projects/meli-core-dumper.png" alt="" width="1600" height="900"></figure>
        <figure class="work-preview" data-preview="stock"><img src="assets/projects/stock-central.png" alt="" width="1600" height="900" loading="lazy"></figure>
        <figure class="work-preview" data-preview="silver"><img src="assets/projects/silver-usage-report.png" alt="" width="1600" height="900" loading="lazy"></figure>
        <figure class="work-preview" data-preview="reviews"><img src="assets/projects/monitor-reviews.png" alt="" width="1600" height="900" loading="lazy"></figure>
      </div>
    </div>
  </section>
  <section class="closing-statement"><h2>Producto para decidir. Ingeniería para sostenerlo.</h2><a href="https://github.com/Zogar89">Ver trabajo en GitHub</a></section>
</main>
```

Cada fila incluye número, categoría, título, tesis y una imagen `.work-row-image` disponible en móvil. Mantener meta description, GitHub, textos alternativos y dimensiones de los assets actuales.

- [ ] **Step 4: Ejecutar el test de la home**

Run: `node --test tests/portfolio.test.mjs`

Expected: PASS para los tests de home.

- [ ] **Step 5: Commit**

```bash
git add index.html tests/portfolio.test.mjs
git commit -m "feat: reshape portfolio home as editorial index"
```

### Task 2: Sistema visual compartido

**Files:**
- Modify: `styles.css`
- Modify: `tests/portfolio.test.mjs`

**Interfaces:**
- Consumes: clases semánticas producidas por Task 1 y las clases de expedientes de Task 3.
- Produces: tokens `--ink`, `--paper`, `--signal`, `--steel`, `--page`; layouts `.editorial-hero`, `.method`, `.work-index`, `.dossier-*`; fallbacks responsive.

- [ ] **Step 1: Agregar tests fallidos del sistema CSS**

```js
test("shared stylesheet defines the approved visual system", () => {
  const css = read("styles.css");
  for (const token of ["--ink: #0c0c0f", "--paper: #f3f0e8", "--signal: #ff7142", "--steel: #73737c"])
    assert.match(css, new RegExp(escape(token)));
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)/);
});
```

- [ ] **Step 2: Ejecutar el test y comprobar el fallo**

Run: `node --test tests/portfolio.test.mjs`

Expected: FAIL porque los nuevos tokens y layouts todavía no existen.

- [ ] **Step 3: Reemplazar el CSS por el sistema editorial**

Definir al inicio:

```css
:root {
  color-scheme: dark;
  --ink: #0c0c0f;
  --paper: #f3f0e8;
  --signal: #ff7142;
  --steel: #73737c;
  --text: #f3f0e8;
  --muted: #a6a5ad;
  --line: rgba(243, 240, 232, 0.16);
  --page: min(1240px, calc(100% - 40px));
  --serif: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif;
  --sans: Aptos, "Segoe UI", system-ui, sans-serif;
  --mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
}
```

El archivo debe cubrir navegación, hero, método, índice con preview fijo en escritorio, imagen inline en móvil, portada de expediente, secciones de historia, decisiones, flujo de arquitectura, stack compacto, próximos proyectos y footer. Toda transición debe tener contraparte en `prefers-reduced-motion: reduce`.

- [ ] **Step 4: Ejecutar los tests CSS**

Run: `node --test tests/portfolio.test.mjs`

Expected: PASS para home y CSS.

- [ ] **Step 5: Commit**

```bash
git add styles.css tests/portfolio.test.mjs
git commit -m "feat: add shared editorial visual system"
```

### Task 3: Convertir los cuatro proyectos en expedientes

**Files:**
- Modify: `projects/meli-core-dumper/index.html`
- Modify: `projects/stock-central/index.html`
- Modify: `projects/silver-usage-report/index.html`
- Modify: `projects/monitor-reviews/index.html`
- Modify: `tests/portfolio.test.mjs`

**Interfaces:**
- Consumes: `.dossier-*`, `.decision-grid`, `.architecture-flow`, `.tech-ledger` y `.next-projects` de Task 2.
- Produces: cuatro páginas con el mismo contrato semántico y copy específico.

- [ ] **Step 1: Agregar tests fallidos de expedientes**

```js
for (const route of projectRoutes) {
  test(`${route} follows the dossier contract`, () => {
    const html = read(route);
    for (const className of ["dossier-hero", "dossier-friction", "decision-grid", "architecture-flow", "tech-ledger"])
      assert.match(html, new RegExp(`class="[^"]*${className}`));
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.doesNotMatch(html, /class="case-grid"|class="tech-matrix"/);
  });
}
```

- [ ] **Step 2: Ejecutar los tests y comprobar el fallo**

Run: `node --test tests/portfolio.test.mjs`

Expected: FAIL porque las páginas todavía usan `.case-grid` y `.tech-matrix`.

- [ ] **Step 3: Reescribir cada expediente**

Usar en las cuatro páginas:

```html
<main class="dossier-main">
  <section class="dossier-hero"><div class="dossier-copy"><p class="kicker">Expediente 01</p><h1>Meli Core Dumper</h1><p class="dossier-thesis">De exportar datos a producir decisiones dentro del producto.</p></div><figure class="dossier-visual"><img src="../../assets/projects/meli-core-dumper.png" alt="Panel operativo de Meli Core Dumper" width="1600" height="900"></figure></section>
  <section class="dossier-friction dossier-section"><p class="section-index">01 · La fricción</p><div><h2>El análisis empezaba cuando el producto terminaba.</h2><p>Los datos se exportaban para analizarlos afuera.</p></div></section>
  <section class="dossier-section"><p class="section-index">02 · Decisiones</p><div class="decision-grid"><article><span>01</span><h3>Analizar dentro del producto</h3></article><article><span>02</span><h3>Separar hechos de señales</h3></article></div></section>
  <section class="dossier-section architecture-section"><p class="section-index">03 · Sistema</p><div class="architecture-flow"><span>API</span><span>Facts</span><span>Daily metrics</span><span>Signals</span><span>Decision</span></div></section>
  <section class="dossier-section"><p class="section-index">04 · Tecnología</p><div class="tech-ledger"><article><h3>Backend</h3><p>FastAPI · SQLAlchemy · Alembic</p></article><article><h3>Datos</h3><p>PostgreSQL · Redis · ARQ</p></article></div></section>
  <section class="dossier-section"><p class="section-index">05 · Continuar</p><div class="next-projects"><a href="../stock-central/">Stock Central</a><a href="../silver-usage-report/">Silver Usage Report</a><a href="../monitor-reviews/">Monitor de Reviews</a></div></section>
</main>
```

Conservar los hechos de cada página y reordenarlos según las tesis del spec. No agregar métricas. Mantener los enlaces a repositorio y demo existentes; Monitor de Reviews conserva sólo los enlaces actuales.

- [ ] **Step 4: Ejecutar los tests de expedientes**

Run: `node --test tests/portfolio.test.mjs`

Expected: PASS para los cinco HTML.

- [ ] **Step 5: Commit**

```bash
git add projects tests/portfolio.test.mjs
git commit -m "feat: turn project pages into product dossiers"
```

### Task 4: Mejora progresiva y estados interactivos

**Files:**
- Modify: `script.js`
- Modify: `tests/portfolio.test.mjs`

**Interfaces:**
- Consumes: `[data-project]`, `[data-preview]` y `[data-reveal]` presentes en HTML.
- Produces: activación visual por foco/hover, revelado observado y fallback visible.

- [ ] **Step 1: Agregar tests fallidos de JavaScript progresivo**

```js
test("javascript is progressive and motion-aware", () => {
  const js = read("script.js");
  assert.match(js, /IntersectionObserver/);
  assert.match(js, /data-project/);
  assert.match(js, /data-preview/);
  assert.match(js, /documentElement\.classList\.add\("js"\)/);
});
```

- [ ] **Step 2: Ejecutar el test y comprobar el fallo**

Run: `node --test tests/portfolio.test.mjs`

Expected: FAIL porque `script.js` sólo configura enlaces externos.

- [ ] **Step 3: Implementar la mejora progresiva**

```js
document.documentElement.classList.add("js");

const setActiveProject = (key) => {
  document.querySelectorAll("[data-project]").forEach((row) => {
    row.classList.toggle("is-active", row.dataset.project === key);
  });
  document.querySelectorAll("[data-preview]").forEach((preview) => {
    preview.classList.toggle("is-active", preview.dataset.preview === key);
  });
};
```

Registrar `pointerenter` y `focus` en las filas. Para `[data-reveal]`, usar `IntersectionObserver`; si no existe, agregar `.is-visible` inmediatamente. El contenido nunca debe depender de `.js` para ocupar layout o ser accesible.

- [ ] **Step 4: Ejecutar todos los tests**

Run: `node --test tests/portfolio.test.mjs`

Expected: todos PASS.

- [ ] **Step 5: Commit**

```bash
git add script.js tests/portfolio.test.mjs
git commit -m "feat: add progressive portfolio interactions"
```

### Task 5: Integridad, responsive y cierre

**Files:**
- Modify: `tests/portfolio.test.mjs`
- Modify only if validation finds a defect: `index.html`, `projects/*/index.html`, `styles.css`, `script.js`

**Interfaces:**
- Consumes: sitio completo.
- Produces: verificación reproducible de rutas, assets y estructura.

- [ ] **Step 1: Agregar el test de integridad final**

```js
test("all local links and image sources resolve", () => {
  for (const page of allPages) {
    const html = read(page);
    for (const ref of localRefs(html)) {
      const resolved = path.resolve(path.dirname(path.join(root, page)), ref);
      assert.ok(existsSync(resolved) || existsSync(path.join(resolved, "index.html")), `${page}: ${ref}`);
    }
  }
});
```

- [ ] **Step 2: Ejecutar la suite completa**

Run: `node --test tests/portfolio.test.mjs`

Expected: todos PASS, sin rutas ni assets faltantes.

- [ ] **Step 3: Ejecutar comprobaciones estáticas**

Run: `git diff --check`

Expected: sin errores de whitespace.

- [ ] **Step 4: Revisar el sitio renderizado**

Abrir la home y al menos un expediente en 1440 px, 900 px y 390 px. Confirmar: sin overflow horizontal; navegación visible; imágenes legibles; foco perceptible; imágenes inline en móvil; contenido visible con JavaScript desactivado.

- [ ] **Step 5: Commit de correcciones finales si existen**

```bash
git add index.html projects styles.css script.js tests/portfolio.test.mjs
git commit -m "fix: polish editorial portfolio across breakpoints"
```
