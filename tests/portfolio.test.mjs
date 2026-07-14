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

  assert.match(html, /Problemas reales\.\s*Productos que operan\./);
  assert.match(html, /class="work-index"/);
  assert.equal((html.match(/class="work-row(?:\s|\")/g) ?? []).length, 4);
  assert.doesNotMatch(html, /stats-panel|case-card/);
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
