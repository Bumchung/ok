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

test("page keeps Istanbul fixed and adds one warm country", async () => {
  const html = await readFile(join(here, "index.html"), "utf8");
  for (const phrase of [
    "이스탄불은 고정",
    "이스탄불 7박",
    "두바이 3박",
    "ICN팀 5명과 LAX팀 4명",
    "2027.03.20—03.31",
    "6 ADULTS + 3 CHILDREN"
  ]) assert.ok(html.includes(phrase), phrase);
  assert.doesNotMatch(html, /튀르키예 대신|목적지 교체 1위|호놀룰루/);
});

test("route shows both origins, merge, shared leg and split home", async () => {
  const html = await readFile(join(here, "index.html"), "utf8");
  for (const phrase of [
    "한국팀 5명",
    "LA팀 4명",
    "IST 직항 약 11:30—12:00",
    "IST 직항 약 13:05—13:10",
    "같은 편",
    "약 4:25",
    "현재 주 9회 직항",
    "현재 매일 직항"
  ]) assert.ok(html.includes(phrase), phrase);
  assert.match(html, /aria-label="ICN과 LAX에서 이스탄불로 합류한 뒤 두바이를 거쳐 각자 귀국하는 경로"/);
});

test("order comparison exposes the rendezvous tradeoff", async () => {
  const html = await readFile(join(here, "index.html"), "utf8");
  for (const phrase of [
    "이스탄불 → 두바이",
    "두바이 → 이스탄불",
    "도착 격차 0",
    "약 9시간 35분",
    "LAX팀이 17시간 귀국편"
  ]) assert.ok(html.includes(phrase), phrase);
  assert.match(html, /함께 쓰는 시간을 가장 적게 잃습니다/);
});

test("Dubai and Doha are compared with route, climate, hotel and falsifiers", async () => {
  const html = await readFile(join(here, "index.html"), "utf8");
  for (const phrase of [
    "두바이와 도하만 남습니다",
    "4:25—4:55",
    "17.0—27.9°C",
    "AED 6,948",
    "US$49/인부터",
    "QAR 4,428",
    "이 결론을 뒤집는 조건",
    "2027년 3월 31일 DOH→LAX"
  ]) assert.ok(html.includes(phrase), phrase);
});

test("Middle East audit proves only Dubai and conditional Doha survive all three nonstop gates", async () => {
  const html = await readFile(join(here, "index.html"), "utf8");
  for (const phrase of [
    "MIDDLE EAST NONSTOP AUDIT",
    "두바이 DXB",
    "도하 DOH",
    "제다 JED",
    "아부다비 AUH",
    "리야드 RUH",
    "카이로 CAI",
    "암만 AMM",
    "무스카트 MCT",
    "쿠웨이트 KWI",
    "바레인 BAH",
    "베이루트 BEY",
    "텔아비브 TLV",
    "정확한 2027년 3월 31일 여정 기준으로 지금 확실히 추천할 수 있는 곳은 두바이 하나"
  ]) assert.ok(html.includes(phrase), phrase);
  assert.match(html, /href="\.\.\/istanbul-dubai-family-trip-2027\/"/);
  assert.match(html, /href="\.\.\/istanbul-doha-family-trip-2027\/"/);
});

test("price references are nonblank and state evidence boundaries", async () => {
  const html = await readFile(join(here, "index.html"), "utf8");
  for (const price of ["₩933,200~", "US$1,011~", "₩2,308,400~", "AED 6,948", "US$49/인부터"]) {
    assert.ok(html.includes(price), price);
  }
  for (const label of ["목표일 참고", "목표 기간", "인접 기간", "시장 평균"]) assert.ok(html.includes(label), label);
  assert.match(html, /추천 다구간 가격으로 대입하지 않고/);
  assert.match(html, /서로 다른 공개 운임을 더해 만든 총액은 정확하지 않습니다/);
  assert.match(html, /원래 IST 왕복 총액과 차감 비교/);
});

test("hotel reference formulas are arithmetically correct", () => {
  assert.equal(579 * 4 * 3, 6948);
  assert.equal(369 * 4 * 3, 4428);
});

test("sources separate official route evidence from filed schedules", async () => {
  const html = await readFile(join(here, "index.html"), "utf8");
  for (const domain of [
    "emirates.com",
    "turkishairlines.com",
    "koreanair.com",
    "dubaidet.gov.ae",
    "worldweather.wmo.int",
    "qatarairways.com",
    "qatartourism.com",
    "zbordirect.com",
    "flight.info"
  ]) assert.match(html, new RegExp(domain.replaceAll(".", "\\.")), domain);
  assert.match(html, /제출된 2027 시간표/);
  assert.match(html, /실제 판매편은 발권 전에 다시 확인/);
  assert.match(html, /Checked 2026-09-04/);
});

test("page is accessible, responsive and image-independent", async () => {
  const [html, css] = await pageFiles();
  for (const id of ["main", "verdict", "route", "order", "options", "prices", "booking", "sources"]) assert.match(html, new RegExp(`id="${id}"`));
  assert.match(html, /skip-link/);
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

test("existing destination pages link to the Istanbul plus warm-stop option", async () => {
  for (const dir of ["istanbul-family-trip-2027", "antalya-family-trip-2027", "cappadocia-family-trip-2027", "dubai-family-trip-2027", "istanbul-antalya-family-trip-2027", "family-trip-2027", "istanbul-dubai-family-trip-2027", "istanbul-doha-family-trip-2027"]) {
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
