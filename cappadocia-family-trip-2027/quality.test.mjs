import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { media } from "./image-catalog.mjs";

const here = new URL(".", import.meta.url).pathname;
const root = new URL("..", import.meta.url).pathname;

test("page exposes every operational trip-app surface", async () => {
  const html = await readFile(join(here, "index.html"), "utf8");
  for (const id of ["compare", "today", "family", "stay", "airbnb", "budget", "plan", "weather", "guide", "dining", "map", "nearby", "ask", "tools"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`), id);
  }
  for (const id of ["trip-mode-switch", "date-rail", "place-search", "dining-search", "map-layer-controls", "download-csv", "download-kml", "download-ics", "answer-template"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`), id);
  }
  assert.match(html, /<script type="module" src="\.\/app\.mjs"><\/script>/);
  assert.match(html, /href="\.\.\/istanbul-family-trip-2027\/styles\.css"/);
});

test("visible comparison states the physical stay and paid double-booking separately", async () => {
  const html = await readFile(join(here, "index.html"), "utf8");
  for (const phrase of [
    "IST 5박 → CAP 3박 → IST 2박",
    "달력상 여행은 10박",
    "이스탄불 10박 + 카파도키아 3박",
    "성인 6명, 아이 3명",
    "실제 결제",
    "국내선, 4일 차량, 새벽 선택",
    "중단 조건"
  ]) assert.ok(html.includes(phrase), phrase);
  assert.match(html, /2027년 3월 실제 운항 시각과 운임은 확정값이 아닙니다/);
  assert.match(html, /2027년 재고, 총액, 침실별 창과 계단은 아직 확정하지 않았습니다/);
});

test("catalog labels match the bounded three-night research depth", async () => {
  const html = await readFile(join(here, "index.html"), "utf8");
  for (const phrase of ["12 HOTELS", "후보 6곳", "30 PLACES", "음식점 20곳과 카페 10곳"]) {
    assert.ok(html.includes(phrase), phrase);
  }
  for (const kind of ["place", "restaurant", "cafe"]) {
    assert.match(html, new RegExp(`data-map-kind=["']${kind}["']`), kind);
  }
});

test("entry point reuses the shared renderer with Cappadocia data and core", async () => {
  const app = await readFile(join(here, "app.mjs"), "utf8");
  assert.match(app, /import \* as data from "\.\/trip-data\.mjs"/);
  assert.match(app, /import \* as core from "\.\/app-core\.mjs"/);
  assert.match(app, /\.\.\/istanbul-family-trip-2027\/trip-app\.mjs/);
  assert.match(app, /bootTripApp\(\{ data, core \}\)/);
});

test("all 78 cards have unique local image evidence", async () => {
  const manifest = JSON.parse(await readFile(join(here, "image-manifest.json"), "utf8"));
  assert.equal(manifest.count, 78);
  assert.equal(manifest.records.length, 78);
  assert.deepEqual(manifest.duplicateHashes, []);
  assert.equal(Object.keys(media).length, 78);
  assert.equal(new Set(manifest.records.map((item) => item.id)).size, 78);
  assert.equal(new Set(manifest.records.map((item) => item.sha256)).size, 78);
  const groups = Object.groupBy(manifest.records, (item) => item.kind);
  assert.equal(groups.place.length, 30);
  assert.equal(groups.hotel.length, 12);
  assert.equal(groups.residence.length, 6);
  assert.equal(groups.dining.length, 30);

  const actualHashes = new Set();
  for (const item of manifest.records) {
    assert.match(item.localPath, /^\.\/assets\/cards\/.+\.(?:jpg|png|webp)$/, item.id);
    assert.match(item.sourcePage, /^https:\/\//, item.id);
    assert.match(item.sha256, /^[a-f0-9]{64}$/, item.id);
    assert.ok(item.bytes > 4_000, item.id);
    const path = join(here, item.localPath);
    assert.equal((await stat(path)).size, item.bytes, item.id);
    const actualHash = createHash("sha256").update(await readFile(path)).digest("hex");
    assert.equal(actualHash, item.sha256, item.id);
    actualHashes.add(actualHash);
    assert.deepEqual(media[item.id].image, item.localPath, item.id);
    assert.deepEqual(media[item.id].photoSource, item.sourcePage, item.id);
  }
  assert.equal(actualHashes.size, 78);
});

test("shared and local styles preserve mobile and accessibility contracts", async () => {
  const [html, localCss, sharedCss] = await Promise.all([
    readFile(join(here, "index.html"), "utf8"),
    readFile(join(here, "styles.css"), "utf8"),
    readFile(join(root, "istanbul-family-trip-2027", "styles.css"), "utf8")
  ]);
  const css = `${sharedCss}\n${localCss}`;
  assert.match(html, /viewport-fit=cover/);
  assert.match(html, /class="skip-link"/);
  assert.match(html, /<nav class="bottom-nav"/);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /@media \(max-width: 460px\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
  assert.match(css, /bottom-nav\.visible/);
  assert.match(css, /map-popup-close[^}]+width:\s*44px/);
  assert.match(css, /map-layer-controls button[^}]+min-height:\s*44px/);
  assert.match(css, /overflow-x:\s*hidden/);
  assert.match(css, /\.card-photo[^}]+aspect-ratio:\s*16\s*\/\s*10/);
  assert.match(css, /content-visibility:\s*auto/);
  assert.match(css, /@media \(max-width: 460px\)[\s\S]+\.dining-grid[^}]+grid-template-columns:\s*1fr/);
});

test("map, nearby, assistant and export controls keep their accessible labels", async () => {
  const html = await readFile(join(here, "index.html"), "utf8");
  assert.match(html, /id="map-canvas"[^>]+aria-label="카파도키아 장소 지도"/);
  assert.match(html, /id="map-inspector"[^>]+aria-live="polite"/);
  assert.match(html, /id="nearby-status"/);
  assert.match(html, /id="locate-me"/);
  assert.match(html, /id="nearby-reset"/);
  assert.match(html, /id="ask-form"/);
  assert.match(html, /maxlength="500"/);
  assert.match(html, /id="answer-board"[^>]+aria-live="polite"/);
  assert.match(html, /Google My Maps/);
});

test("assistant-authored Cappadocia files contain no Unicode middle dot", async () => {
  const names = (await readdir(here)).filter((name) => /\.(?:html|css|mjs|json|md)$/.test(name));
  for (const name of names) {
    const content = await readFile(join(here, name), "utf8");
    assert.equal(content.includes("\u00b7"), false, name);
  }
});
