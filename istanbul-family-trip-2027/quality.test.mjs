import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const here = new URL(".", import.meta.url).pathname;

test("page exposes every major Sydney-parity feature surface", async () => {
  const html = await readFile(join(here, "index.html"), "utf8");
  for (const id of ["today", "nearby", "family", "stay", "plan", "weather", "guide", "map", "ask", "tools"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`), id);
  }
  assert.match(html, /download-csv/);
  assert.match(html, /download-kml/);
  assert.match(html, /download-ics/);
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
  const app = `${await readFile(join(here, "app.mjs"), "utf8")}\n${await readFile(join(here, "trip-app.mjs"), "utf8")}`;
  assert.match(app, /localAnswer\(clean\)/);
  assert.match(app, /연결이 안 되어 저장된 여행 자료에서 찾았어요/);
  assert.match(app, /istanbul-assistant-endpoint/);
});

test("Sydney-parity details include day photos, reviews, location sorting, and calendar links", async () => {
  const [entry, shared, css] = await Promise.all([
    readFile(join(here, "app.mjs"), "utf8"),
    readFile(join(here, "trip-app.mjs"), "utf8"),
    readFile(join(here, "styles.css"), "utf8")
  ]);
  const app = `${entry}\n${shared}`;
  assert.match(app, /navigator\.geolocation/);
  assert.match(app, /makeGoogleCalendarUrl/);
  assert.match(app, /reviews\.liked/);
  assert.match(app, /day-photo/);
  assert.match(css, /review-signal/);
  assert.match(css, /nearby-list/);
});

test("visible copy avoids the rejected planning-document voice", async () => {
  const files = [
    ["index.html", join(here, "index.html")],
    ["trip-data.mjs", join(here, "trip-data.mjs")],
    ["app-core.mjs", join(here, "app-core.mjs")],
    ["trip-app.mjs", join(here, "trip-app.mjs")]
  ];
  for (const [name, path] of files) {
    const content = await readFile(path, "utf8");
    for (const phrase of ["저강도", "기본 단위", "운영 안정성", "이동 대비 효용", "회복 거점", "합류 행사를 만들지 않는다", "과감히 삭제한다", "강합니다", "우선 후보"]) {
      assert.equal(content.includes(phrase), false, `${name}: ${phrase}`);
    }
  }
});

test("assistant-authored files contain no Unicode middle dot", async () => {
  const names = (await readdir(here)).filter((name) => /\.(?:html|css|mjs|json|md)$/.test(name));
  for (const name of names) {
    const content = await readFile(join(here, name), "utf8");
    assert.equal(content.includes("\u00b7"), false, name);
  }
});
