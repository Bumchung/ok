import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const here = new URL(".", import.meta.url).pathname;

test("page exposes every major Sydney-parity feature surface", async () => {
  const html = await readFile(join(here, "index.html"), "utf8");
  for (const id of ["today", "nearby", "family", "stay", "airbnb", "budget", "plan", "weather", "guide", "dining", "map", "ask", "tools"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`), id);
  }
  assert.match(html, /download-csv/);
  assert.match(html, /download-kml/);
  assert.match(html, /download-ics/);
  assert.match(html, /answer-template/);
  assert.match(html, /tripcom-cost-grid/);
  assert.match(html, /trip-mode-switch/);
});

test("decision list is compact and nearby appears below dining and the map", async () => {
  const [html, app, css] = await Promise.all([
    readFile(join(here, "index.html"), "utf8"),
    readFile(join(here, "trip-app.mjs"), "utf8"),
    readFile(join(here, "styles.css"), "utf8")
  ]);
  assert.ok(html.indexOf('id="dining"') < html.indexOf('id="map"'));
  assert.ok(html.indexOf('id="map"') < html.indexOf('id="nearby"'));
  assert.doesNotMatch(html, /decision-strip-list/);
  assert.match(app, /decision-list/);
  assert.match(css, /today-card\.compact/);
  assert.match(css, /principle-grid\.compact/);
});

test("map layers expose an immediate accessible popup", async () => {
  const [html, app, css] = await Promise.all([
    readFile(join(here, "index.html"), "utf8"),
    readFile(join(here, "trip-app.mjs"), "utf8"),
    readFile(join(here, "styles.css"), "utf8")
  ]);
  for (const kind of ["place", "restaurant", "cafe"]) assert.match(html, new RegExp(`data-map-kind=["']${kind}["']`));
  assert.match(app, /role=\"dialog\"/);
  assert.match(app, /aria-haspopup=\"dialog\"/);
  assert.match(app, /mapPopupOpen/);
  assert.match(app, /event\.key === \"Escape\"/);
  assert.match(app, /map-canvas\"\)\.onkeydown/);
  assert.doesNotMatch(app, /map-canvas\"\)\.addEventListener\(\"keydown\"/);
  assert.match(app, /popupRect\.bottom > canvasRect\.bottom/);
  assert.match(app, /center-x/);
  assert.match(app, /center-y/);
  assert.match(css, /map-popup/);
  assert.match(css, /map-popup\.center-x/);
  assert.match(css, /map-popup\.center-x\.center-y/);
  assert.match(css, /map-marker:focus-visible/);
  assert.match(css, /map-marker[^}]+width:\s*44px/);
});

test("visible finance and Airbnb claims match the current evidence state", async () => {
  const [html, finance, airbnb, tripData] = await Promise.all([
    readFile(join(here, "index.html"), "utf8"),
    readFile(join(here, "travel-finance.mjs"), "utf8"),
    readFile(join(here, "airbnb-catalog.mjs"), "utf8"),
    readFile(join(here, "trip-data.mjs"), "utf8")
  ]);
  assert.doesNotMatch(`${html}\n${finance}`, /운임 미오픈|아직 열리지 않았|총액과 재고는 노출되지/);
  assert.match(html, /예약 가능 12곳과 현재 제외 3곳/);
  assert.match(finance, /실시간 결제 견적이 아닌 계획 중간값/);
  assert.match(airbnb, /"exactAvailableCount": 12/);
  assert.match(airbnb, /"unavailableCount": 3/);
  assert.doesNotMatch(tripData, /60,300|60300|95,658,000|95658000/);
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
  assert.match(css, /bottom-nav\.visible/);
  assert.match(css, /map-popup-close[^}]+width:\s*44px/);
  assert.match(css, /map-layer-controls button[^}]+min-height:\s*44px/);
  assert.match(css, /\.card-photo[^}]+aspect-ratio:\s*16\s*\/\s*10/);
  assert.match(css, /content-visibility:\s*auto/);
  assert.match(css, /@media \(max-width: 460px\)[\s\S]+\.dining-grid[^}]+grid-template-columns:\s*1fr/);
});

test("all Airbnb and dining cards use unique local WebP photos with source evidence", async () => {
  const [manifestText, airbnbCatalog, diningCatalog, app] = await Promise.all([
    readFile(join(here, "research/card-images.json"), "utf8"),
    readFile(join(here, "airbnb-catalog.mjs"), "utf8"),
    readFile(join(here, "dining-catalog.mjs"), "utf8"),
    readFile(join(here, "trip-app.mjs"), "utf8")
  ]);
  const manifest = JSON.parse(manifestText);
  assert.equal(manifest.count, 115);
  assert.equal(manifest.verifiedCount, 115);
  assert.equal(manifest.missingCount, 0);
  assert.deepEqual(manifest.duplicateHashes, []);
  assert.equal(new Set(manifest.records.map((item) => item.sha256)).size, 115);
  for (const item of manifest.records) {
    assert.equal(item.status, "verified", item.id);
    assert.match(item.localPath, /^\.\/assets\/card-images\/.+\.webp$/, item.id);
    assert.match(item.sourcePageUrl, /^https?:\/\//, item.id);
    assert.ok(item.bytes > 4_000, item.id);
    assert.ok((await stat(join(here, item.localPath))).size > 4_000, item.id);
  }
  for (const catalog of [airbnbCatalog, diningCatalog]) {
    assert.match(catalog, /"image": "\.\/assets\/card-images\//);
    assert.match(catalog, /"photoSource": "https?:\/\//);
  }
  assert.match(app, /width="640" height="400" loading="lazy" decoding="async"/);
  assert.match(app, /Airbnb 실제 숙소 사진/);
  assert.match(app, /실제 장소 사진/);
});

test("assistant remains useful without a deployed remote endpoint", async () => {
  const app = `${await readFile(join(here, "app.mjs"), "utf8")}\n${await readFile(join(here, "trip-app.mjs"), "utf8")}`;
  assert.match(app, /localAnswer\(clean,\s*activeItinerary\(\)\)/);
  assert.match(app, /연결이 안 되어 저장된 여행 자료에서 찾았어요/);
  assert.match(app, /endpointKey = `\$\{cityKey\}-assistant-endpoint`/);
});

test("Sydney-parity details include day photos, reviews, location sorting, and calendar links", async () => {
  const [entry, shared, css, html] = await Promise.all([
    readFile(join(here, "app.mjs"), "utf8"),
    readFile(join(here, "trip-app.mjs"), "utf8"),
    readFile(join(here, "styles.css"), "utf8"),
    readFile(join(here, "index.html"), "utf8")
  ]);
  const app = `${entry}\n${shared}`;
  assert.match(app, /navigator\.geolocation/);
  assert.match(app, /makeGoogleCalendarUrl/);
  assert.match(app, /reviews\.liked/);
  assert.match(app, /day-photo/);
  assert.match(app, /renderTripComCosts/);
  assert.match(app, /quote-price-grid/);
  assert.match(`${app}\n${html}`, /호텔 30곳/);
  assert.match(app, /호텔 공식 사이트에서 확인/);
  assert.match(app, /관측일/);
  assert.match(app, /aria-pressed/);
  for (const label of ["부모가 기대할 것", "아이들이 기다릴 것", "같이 남길 장면", "오후 회복"]) assert.match(app, new RegExp(label));
  assert.match(css, /review-signal/);
  assert.match(css, /hotel-catalog-grid/);
  assert.match(css, /grid-template-columns:\s*repeat\(3/);
  assert.match(css, /nearby-list/);
  assert.match(css, /day-needs/);
  assert.match(css, /quote-comparison/);
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
