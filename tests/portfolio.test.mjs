import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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
