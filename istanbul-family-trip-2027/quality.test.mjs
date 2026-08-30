import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const here = new URL(".", import.meta.url).pathname;

test("page exposes every major Sydney-parity feature surface", async () => {
  const html = await readFile(join(here, "index.html"), "utf8");
  for (const id of ["today", "family", "stay", "plan", "weather", "guide", "map", "ask", "tools"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`), id);
  }
  assert.match(html, /download-csv/);
  assert.match(html, /download-kml/);
  assert.match(html, /answer-template/);
});

test("mobile layout, reduced motion, and safe viewport rules exist", async () => {
  const [html, css] = await Promise.all([
    readFile(join(here, "index.html"), "utf8"),
    readFile(join(here, "styles.css"), "utf8")
  ]);
  assert.match(html, /viewport-fit=cover/);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
  assert.match(css, /bottom-nav/);
});

test("assistant remains useful without a deployed remote endpoint", async () => {
  const app = await readFile(join(here, "app.mjs"), "utf8");
  assert.match(app, /localAnswer\(clean\)/);
  assert.match(app, /AI 서버에 연결하지 못해 앱 자료로 답했습니다/);
  assert.match(app, /istanbul-assistant-endpoint/);
});

test("assistant-authored files contain no Unicode middle dot", async () => {
  const names = (await readdir(here)).filter((name) => /\.(?:html|css|mjs|json|md)$/.test(name));
  for (const name of names) {
    const content = await readFile(join(here, name), "utf8");
    assert.equal(content.includes("\u00b7"), false, name);
  }
});
