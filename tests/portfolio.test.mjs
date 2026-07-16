import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");

const read = (relativePath) =>
  readFileSync(path.join(root, relativePath), "utf8");

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const projectRoutes = [
  "projects/meli-core-dumper/",
  "projects/stock-central/",
  "projects/silver-usage-report/",
  "projects/monitor-reviews/",
];

const projectPages = projectRoutes.map((route) => `${route}index.html`);
const allPages = ["index.html", ...projectPages];

const localReferences = (html) =>
  [...html.matchAll(/(?:href|src)="([^"]+)"/g)]
    .map((match) => match[1].split("#")[0].split("?")[0])
    .filter(
      (reference) =>
        reference &&
        !reference.startsWith("http://") &&
        !reference.startsWith("https://") &&
        !reference.startsWith("data:") &&
        !reference.startsWith("mailto:"),
    );

test("home exposes the editorial project index", () => {
  const html = read("index.html");

  assert.match(html, /Problemas reales\.\s*Productos que ayudan a decidir\./);
  assert.match(html, /class="work-index"/);
  assert.equal((html.match(/class="work-row(?:\s|\")/g) ?? []).length, 4);
  assert.doesNotMatch(html, /stats-panel|case-card/);
});

test("home uses the approved direct and natural copy", () => {
  const html = read("index.html");
  const normalizedHtml = html.replace(/\s+/g, " ");

  const expectedCopy = [
    "Datos x Producto",
    "Diseño y construyo herramientas combinando datos, APIs y criterio de producto.",
    "Cómo trabajo",
    "Entender qué falla, decidir qué importa y construir una solución que se sostenga.",
    "Una selección de mi trabajo.",
    "Proyectos en los que combiné definición de producto y ejecución técnica.",
    "Analítica para sellers",
    "Sincroniza datos de Mercado Libre y los convierte en métricas, tendencias y anomalías.",
    "Stock de filamentos 3D",
    "Centraliza el stock de distintos proveedores para buscar, comparar y armar pedidos.",
    "Reporte privado de uso de IA",
    "Genera métricas de uso de IA sin enviar prompts, respuestas, código ni secretos.",
    "Seguimiento de reviews",
    "Centraliza las reviews de Mercado Libre y muestra cómo evoluciona la valoración de cada producto.",
    "Datos para entender.",
    "Producto para decidir.",
    "Busco soluciones que respondan a una necesidad concreta y conviertan información dispersa en conocimiento útil.",
  ];

  for (const copy of expectedCopy) {
    assert.match(normalizedHtml, new RegExp(escapeRegExp(copy)));
  }

  assert.equal((html.match(/Datos x Producto/g) ?? []).length, 2);

  const methodSteps = [
    ["Entender", "el problema"],
    ["Definir", "qué importa"],
    ["Construir", "la solución"],
    ["Mejorar", "con el uso"],
  ];

  for (const [action, detail] of methodSteps) {
    assert.match(
      html,
      new RegExp(`<strong>${escapeRegExp(action)}</strong><small>${escapeRegExp(detail)}</small>`),
    );
  }

  assert.doesNotMatch(
    html,
    /Productos que operan|tienen que convivir|Del ruido inicial|la apuesta|Cuatro fricciones|Static data product|Privacy flow|Operational intelligence|operables después del deploy/,
  );
});

test("home keeps every public project route", () => {
  const html = read("index.html");

  for (const route of projectRoutes) {
    assert.match(html, new RegExp(escapeRegExp(route)));
  }
});

test("public copy consistently calls case studies projects", () => {
  for (const file of allPages) {
    assert.doesNotMatch(read(file), /\bexpedientes?\b/i, file);
  }

  assert.match(read("index.html"), /Explorar los proyectos/);
});

test("home navigation excludes the temporarily hidden method section", () => {
  const html = read("index.html");
  const css = read("styles.css");
  const sectionIds = ["inicio", "proyectos", "cierre"];

  assert.match(html, /data-section-nav/);
  assert.match(html, /aria-label="Secciones de la página"/);

  for (const id of sectionIds) {
    assert.match(html, new RegExp(`id="${id}"[^>]*data-section`));
    assert.match(html, new RegExp(`href="#${id}"[^>]*data-section-link`));
  }

  assert.match(html, /class="method"[^>]*id="metodo"[^>]*hidden/);
  assert.doesNotMatch(html, /href="#metodo"/);
  assert.match(html, /href="#inicio"[\s\S]*?<span aria-hidden="true">01<\/span>/);
  assert.match(html, /href="#proyectos"[\s\S]*?<span aria-hidden="true">02<\/span>/);
  assert.match(html, /href="#cierre"[\s\S]*?<span aria-hidden="true">03<\/span>/);

  assert.match(css, /@media\s*\(min-width:\s*1180px\)/);
  assert.match(css, /\.section-nav/);
  assert.match(css, /scroll-margin-top/);
});

test("home exposes branded GitHub and LinkedIn links", () => {
  const html = read("index.html");
  const css = read("styles.css");

  assert.match(html, /id="icon-github"/);
  assert.match(html, /id="icon-linkedin"/);
  assert.equal(
    html.match(/https:\/\/www\.linkedin\.com\/in\/gabrielalejandrogarcia\//g)?.length,
    2,
  );
  assert.match(html, /class="nav-links"[\s\S]*class="social-link"/);
  assert.match(html, /class="closing-links"/);
  assert.match(css, /\.social-icon\s*\{/);
  assert.match(
    css,
    /@media\s*\(max-width:\s*760px\)[\s\S]*\.nav-links \.social-link span\s*\{[\s\S]*display:\s*none/,
  );
});

test("shared stylesheet defines the approved visual system", () => {
  const css = read("styles.css");
  const tokens = [
    "--ink: #0c0c0f",
    "--paper: #f3f0e8",
    "--signal: #ff7142",
    "--steel: #73737c",
  ];

  for (const token of tokens) {
    assert.match(css, new RegExp(escapeRegExp(token)));
  }

  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)/);
});

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

test("header brand uses the GG monogram without a portrait", () => {
  const html = read("index.html");
  const css = read("styles.css");

  assert.match(html, /<span class="brand-mark" aria-hidden="true">GG<\/span>/);
  assert.doesNotMatch(html, /gabriel-garcia-portrait\.png|brand-avatar|hero-portrait/);
  assert.doesNotMatch(css, /brand-avatar|hero-portrait/);
});

test("hero exposes a visibility-aware ambient data series", () => {
  const html = read("index.html");
  const css = read("styles.css");
  const javascript = read("script.js");

  assert.match(
    html,
    /class="hero-data-series"[^>]*data-hero-series[^>]*aria-hidden="true"/,
  );
  assert.match(html, /id="hero-data-path"/);
  assert.doesNotMatch(html, /hero-series-point/);
  assert.match(
    css,
    /\.hero-data-series\s*\{[\s\S]*?left:\s*50%[\s\S]*?width:\s*100vw[\s\S]*?transform:\s*translateX\(-50%\)/,
  );
  assert.match(
    css,
    /\.editorial-hero\s*\{[\s\S]*?overflow:\s*visible/,
  );
  assert.match(css, /body\s*\{[\s\S]*?overflow-x:\s*clip/);
  assert.match(css, /@keyframes\s+hero-data-travel\s*\{/);
  assert.match(css, /animation:\s*hero-data-travel 12s/);
  assert.match(css, /stroke-dasharray:\s*34 1200/);
  assert.doesNotMatch(css, /stroke-dasharray:\s*34 980/);
  assert.match(
    css,
    /\.hero-data-series\.is-ambient-active[\s\S]*animation-play-state:\s*running/,
  );
  assert.match(
    css,
    /@media\s*\(max-width:\s*760px\)[\s\S]*\.hero-data-series\s*\{[\s\S]*display:\s*none/,
  );
  assert.match(
    css,
    /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.hero-series-signal[\s\S]*display:\s*none/,
  );
  assert.match(javascript, /querySelector\("\[data-hero-series\]"\)/);
  assert.match(javascript, /classList\.toggle\(\s*"is-ambient-active"/);
  assert.match(javascript, /visibilitychange/);
  assert.match(javascript, /pauseAnimations/);
  assert.match(javascript, /prefers-reduced-motion/);
});

test("hero title uses a subtle responsive ink cloud", () => {
  const css = read("styles.css");
  const titleRule = css.match(/\.hero-statement h1\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
  const cloudRule = css.match(/\.hero-statement h1::before\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";

  assert.match(titleRule, /position:\s*relative/);
  assert.match(titleRule, /isolation:\s*isolate/);
  assert.match(cloudRule, /content:\s*""/);
  assert.match(cloudRule, /radial-gradient/);
  assert.match(cloudRule, /filter:\s*blur\(/);
  assert.match(cloudRule, /pointer-events:\s*none/);
  assert.doesNotMatch(cloudRule, /animation/);
  assert.match(
    css,
    /@media\s*\(max-width:\s*760px\)[\s\S]*?\.hero-statement h1::before\s*\{[\s\S]*?content:\s*none/,
  );
});

test("hero CTA adopts its hover color in sync with the ambient data series", () => {
  const html = read("index.html");
  const css = read("styles.css");
  const attentionKeyframes = css.slice(
    css.indexOf("@keyframes hero-cta-attention"),
    css.indexOf(".closing-links"),
  );

  assert.match(html, /class="arrow-link hero-cta"/);
  assert.match(html, /class="hero-cta-label"/);
  assert.match(html, /class="hero-cta-arrow"/);
  assert.doesNotMatch(html, /hero-cta-attention/);
  assert.match(css, /\.hero-cta\s*\{[\s\S]*animation:\s*hero-cta-attention 12s/);
  assert.match(css, /animation:\s*hero-cta-attention 12s linear/);
  assert.match(css, /@keyframes\s+hero-cta-attention\s*\{/);
  assert.match(attentionKeyframes, /color:\s*var\(--signal\)/);
  assert.match(attentionKeyframes, /color:\s*var\(--text\)/);
  assert.match(attentionKeyframes, /62%/);
  assert.match(attentionKeyframes, /70\.333%/);
  assert.match(attentionKeyframes, /57\.833%/);
  assert.match(attentionKeyframes, /74\.5%/);
  assert.doesNotMatch(css, /hero-cta-shimmer/);
  assert.doesNotMatch(css, /hero-cta-arrow-pulse/);
  assert.match(
    css,
    /\.hero-data-series\.is-ambient-active\s*~\s*\.hero-statement\s+\.hero-cta\s*\{[\s\S]*animation-play-state:\s*running/,
  );
  assert.match(
    css,
    /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.hero-cta[\s\S]*animation:\s*none/,
  );
});

test("project rows expose the animated accent selection", () => {
  const css = read("styles.css");

  assert.match(css, /\.work-row::before\s*\{/);
  assert.match(css, /transform-origin:\s*left center/);
  assert.match(css, /transform:\s*scaleX\(0\)/);
  assert.match(
    css,
    /\.work-row:hover::before,\s*\.work-row:focus-visible::before\s*\{[\s\S]*?transform:\s*scaleX\(1\)/,
  );
  assert.doesNotMatch(css, /\.work-row\.is-active/);
  assert.match(
    css,
    /@media\s*\(max-width:\s*760px\)[\s\S]*\.work-row::before\s*\{[\s\S]*content:\s*none/,
  );
});

test("project row selection stays geometrically stable and uses the revised CTA", () => {
  const html = read("index.html");
  const css = read("styles.css");
  const activeRowRule = css.match(
    /\.work-row:hover,\s*\.work-row:focus-visible\s*\{([\s\S]*?)\}/,
  )?.[1] ?? "";

  assert.equal((html.match(/class="work-action">Ver Proyecto/g) ?? []).length, 4);
  assert.doesNotMatch(html, /Abrir proyecto/);
  assert.match(css, /padding:\s*22px 24px 22px 0/);
  assert.match(
    css,
    /transition:\s*transform 750ms cubic-bezier\(0\.4,\s*0,\s*0\.2,\s*1\)/,
  );
  assert.match(
    css,
    /\.work-number\s*\{[\s\S]*?padding-left:\s*16px/,
  );
  assert.doesNotMatch(activeRowRule, /padding/);
});

for (const page of projectPages) {
  test(`${page} follows the dossier contract`, () => {
    const html = read(page);
    const requiredClasses = [
      "dossier-hero",
      "dossier-friction",
      "decision-grid",
      "architecture-flow",
      "tech-ledger",
    ];

    for (const className of requiredClasses) {
      assert.match(html, new RegExp(`class="[^"]*${className}`));
    }

    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.doesNotMatch(html, /class="case-grid"|class="tech-matrix"/);
  });
}

test("javascript is progressive and exposes the approved interactions", () => {
  const javascript = read("script.js");

  assert.match(javascript, /IntersectionObserver/);
  assert.match(javascript, /data-project/);
  assert.match(javascript, /data-preview/);
  assert.match(javascript, /documentElement\.classList\.add\("js"\)/);
  assert.match(javascript, /is-visible/);
  assert.match(javascript, /data-section-link/);
  assert.match(javascript, /data-section/);
  assert.match(javascript, /aria-current/);
  assert.match(javascript, /setActiveSection/);
  assert.doesNotMatch(javascript, /addEventListener\(["']scroll["']/);
});

test("all local links and image sources resolve", () => {
  for (const page of allPages) {
    const html = read(page);
    const pageDirectory = path.dirname(path.join(root, page));

    for (const reference of localReferences(html)) {
      const resolved = path.resolve(pageDirectory, reference);
      const exists =
        existsSync(resolved) || existsSync(path.join(resolved, "index.html"));

      assert.ok(exists, `${page} references missing local path: ${reference}`);
    }
  }
});

test("every page keeps a single heading and stable image geometry", () => {
  for (const page of allPages) {
    const html = read(page);

    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${page}: h1 count`);

    for (const image of html.matchAll(/<img\b[^>]*>/g)) {
      assert.match(image[0], /\balt="[^"]*"/, `${page}: image alt`);
      assert.match(image[0], /\bwidth="\d+"/, `${page}: image width`);
      assert.match(image[0], /\bheight="\d+"/, `${page}: image height`);
    }
  }
});
