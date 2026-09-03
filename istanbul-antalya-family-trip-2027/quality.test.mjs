import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const here = new URL(".", import.meta.url).pathname;
const root = new URL("..", import.meta.url).pathname;

test("page states the selected destination, family, dates, and split", async () => {
  const html = await readFile(join(here, "index.html"), "utf8");
  for (const phrase of ["안탈리아", "2027.03.20—03.31", "6 ADULTS + 3 CHILDREN", "5박", "3박", "2박", "이스탄불 숙소는 10박 그대로 유지합니다"]) {
    assert.ok(html.includes(phrase), phrase);
  }
});

test("candidate comparison includes the full ranked field and evidence boundary", async () => {
  const html = await readFile(join(here, "index.html"), "utf8");
  for (const phrase of ["안탈리아", "이즈미르 / 에페소스", "아테네", "카파도키아", "파묵칼레", "부르사"]) assert.match(html, new RegExp(phrase));
  for (const score of [91, 78, 72, 68, 67, 61]) assert.match(html, new RegExp(`<strong>${score}</strong>`));
  assert.match(html, /상대 평가입니다\. 가격 점수가 아닙니다/);
  assert.match(html, /2027년 정확한 항공 시각, 운임, 호텔 시설 운영과 객실 재고는 아직 확정 사실이 아닙니다/);
});

test("route protects the original direct long-haul pattern and limits sightseeing on transfer days", async () => {
  const html = await readFile(join(here, "index.html"), "utf8");
  assert.match(html, /IST 출도착편만 사용하고 SAW는 제외/);
  assert.match(html, /3박용 짐만/);
  assert.match(html, /귀국편의 직항 원칙/);
  assert.ok((html.match(/관광 없음/g) || []).length >= 2);
});

test("weather copy does not mis-sell Antalya as a March beach trip", async () => {
  const html = await readFile(join(here, "index.html"), "utf8");
  for (const phrase of ["18.4°C", "8.3°C", "9.57일", "16.0°C", "해변 휴가는 아닙니다", "해수욕 일정은 만들지 않습니다"]) assert.match(html, new RegExp(phrase));
});

test("primary evidence links use official or first-party sources", async () => {
  const html = await readFile(join(here, "index.html"), "utf8");
  for (const domain of ["turkishairlines.com", "dhmi.gov.tr", "mgm.gov.tr", "goturkiye.com", "antalyaaquarium.com", "shgm.gov.tr", "budo.burulas.com.tr"]) assert.match(html, new RegExp(domain.replaceAll(".", "\\.")));
  assert.match(html, /Checked 2026-09-03/);
});

test("page is lightweight, accessible, responsive, and font-independent", async () => {
  const [html, css] = await Promise.all([
    readFile(join(here, "index.html"), "utf8"),
    readFile(join(here, "styles.css"), "utf8")
  ]);
  for (const id of ["main", "verdict", "candidates", "route", "evidence"]) assert.match(html, new RegExp(`id=["']${id}["']`));
  assert.match(html, /skip-link/);
  assert.doesNotMatch(html, /<img\b/);
  assert.doesNotMatch(html, /<script\b/);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /min-height: 44px/);
  assert.match(css, /overflow-x: hidden/);
});

test("existing Istanbul page links to the full Antalya alternative", async () => {
  const html = await readFile(join(root, "istanbul-family-trip-2027", "index.html"), "utf8");
  assert.match(html, /href="\.\.\/antalya-family-trip-2027\/"/);
  assert.match(html, /안탈리아 3박 대안/);
});

test("assistant-authored page files contain no Unicode middle dot", async () => {
  for (const name of ["index.html", "styles.css", "README.md"]) {
    const content = await readFile(join(here, name), "utf8");
    assert.equal(content.includes("\u00b7"), false, name);
  }
});
