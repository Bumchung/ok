import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const here = new URL(".", import.meta.url).pathname;
const root = new URL("..", import.meta.url).pathname;

async function pageFiles() {
  return Promise.all([
    readFile(join(here, "index.html"), "utf8"),
    readFile(join(here, "styles.css"), "utf8")
  ]);
}

test("page answers both destination replacement and neutral third-country questions", async () => {
  const html = await readFile(join(here, "index.html"), "utf8");
  for (const phrase of [
    "목적지 교체 1위",
    "호놀룰루",
    "제3국 1위",
    "두바이",
    "ICN팀 5명과 LAX팀 4명",
    "2027.03.20—03.31",
    "6 ADULTS + 3 CHILDREN"
  ]) assert.ok(html.includes(phrase), phrase);
  assert.match(html, /호놀룰루는 미국입니다/);
  assert.match(html, /완벽한 중간점은 없습니다/);
});

test("all four serious options include routes, climate, hotel and falsifiers", async () => {
  const html = await readFile(join(here, "index.html"), "utf8");
  for (const id of ["honolulu", "dubai", "singapore", "phuket"]) assert.match(html, new RegExp(`id="${id}"`));
  assert.equal((html.match(/이 결론을 뒤집는 조건/g) || []).length, 4);
  for (const price of ["US$10,960", "AED 23,160", "S$10,942.40", "THB 248,800"]) assert.ok(html.includes(price), price);
  for (const climate of ["27.3 / 20.1°C", "27.9 / 17.0°C", "32.2 / 24.9°C", "33.8 / 24.9°C"]) assert.ok(html.includes(climate), climate);
});

test("airfare references contain no blank prices and state their evidence boundaries", async () => {
  const html = await readFile(join(here, "index.html"), "utf8");
  for (const price of ["₩1,498,600~", "US$179~", "₩2,308,400~", "US$905~", "₩511,500~", "US$875~", "₩611,500~", "₩476,200", "US$860~"]) {
    assert.ok(html.includes(price), price);
  }
  for (const label of ["목표일 공개가", "목표 기간 참고가", "다른 날짜 참고가", "시장 평균"]) assert.ok(html.includes(label), label);
  assert.match(html, /날짜, 항공사, 직항 여부와 세금 조건이 달라 통화 환산 총액이나 도시별 차액은 만들지 않았습니다/);
  assert.match(html, /LAX 운임은 Emirates 직항 가격이 아닙니다/);
  assert.match(html, /9석은 낮은 운임 버킷이 한꺼번에 나오지 않을 수 있고/);
});

test("hotel reference formulas are arithmetically correct", () => {
  assert.equal(274 * 4 * 10, 10960);
  assert.equal(579 * 4 * 10, 23160);
  assert.equal(273.56 * 4 * 10, 10942.4);
  assert.equal(6220 * 4 * 10, 248800);
});

test("flight fairness shows worst-side burden and gap instead of a synthetic score", async () => {
  const html = await readFile(join(here, "index.html"), "utf8");
  for (const phrase of ["최장 8:50", "격차 약 3:00", "최장 16:50", "격차 약 7:20", "최장 17:20", "격차 최대 10:50", "최장 19:05+", "격차 약 12:25+"]) {
    assert.ok(html.includes(phrase), phrase);
  }
  assert.doesNotMatch(html, /계획 점수|종합 점수|총점/);
  assert.match(html, /푸켓<small>ICN 직항, LAX 1회 경유/);
});

test("sources cover airfare, routes, climate, hotel and entry for every candidate", async () => {
  const html = await readFile(join(here, "index.html"), "utf8");
  for (const domain of [
    "koreanair.com",
    "alaskaair.com",
    "southwest.com",
    "weather.gov",
    "hawaiitourismauthority.org",
    "help.cbp.gov",
    "emirates.com",
    "lufthansa.com",
    "worldweather.wmo.int",
    "mediaoffice.ae",
    "u.ae",
    "singaporeair.com",
    "cathaypacific.com",
    "weather.gov.sg",
    "stb.gov.sg",
    "ica.gov.sg",
    "phuketrealtor.com",
    "tdac.immigration.go.th"
  ]) assert.match(html, new RegExp(domain.replaceAll(".", "\\.")), domain);
  assert.match(html, /Checked 2026-09-04/);
});

test("page is accessible, responsive and image-independent", async () => {
  const [html, css] = await pageFiles();
  for (const id of ["main", "verdict", "options", "flights", "prices", "sources"]) assert.match(html, new RegExp(`id="${id}"`));
  assert.match(html, /skip-link/);
  assert.match(html, /aria-label="후보별 두 출발지 편도 이동시간 비교"/);
  assert.doesNotMatch(html, /<img\b/);
  assert.doesNotMatch(html, /<script\b/);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /@media \(max-width: 390px\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /min-height: 44px/);
  assert.match(css, /overflow-x: hidden/);
});

test("button palette clears WCAG AA contrast", () => {
  const luminance = (hex) => {
    const rgb = hex.match(/[a-f\d]{2}/gi).map((value) => parseInt(value, 16) / 255);
    const linear = rgb.map((value) => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };
  const contrast = (a, b) => {
    const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (light + 0.05) / (dark + 0.05);
  };
  assert.ok(contrast("#ffffff", "#ad4935") >= 4.5);
  assert.ok(contrast("#ffffff", "#176268") >= 4.5);
  assert.ok(contrast("#ffffff", "#7b3023") >= 4.5);
});

test("existing destination pages link to the country-switch option", async () => {
  for (const dir of ["istanbul-family-trip-2027", "antalya-family-trip-2027", "cappadocia-family-trip-2027", "dubai-family-trip-2027", "istanbul-antalya-family-trip-2027", "family-trip-2027"]) {
    const html = await readFile(join(root, dir, "index.html"), "utf8");
    assert.match(html, /href="\.\.\/warm-family-trip-2027\/"/, dir);
  }
});

test("assistant-authored page files contain no Unicode middle dot", async () => {
  for (const name of ["index.html", "styles.css", "README.md"]) {
    const content = await readFile(join(here, name), "utf8");
    assert.equal(content.includes("\u00b7"), false, name);
  }
});
