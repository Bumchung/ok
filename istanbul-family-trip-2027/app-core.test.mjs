import test from "node:test";
import assert from "node:assert/strict";
import {
  buildMapPoints,
  daysBetween,
  filterPlaces,
  localAnswer,
  makeAssistantPayload,
  makeCsv,
  makeKml,
  searchContext,
  tripStatus,
  weatherMode
} from "./app-core.mjs";
import { familyGroups, itinerary, lodgingOptions, mealSuggestions, places, trip } from "./trip-data.mjs";

test("travel dates are internally consistent and total ten nights", () => {
  assert.equal(daysBetween(trip.arrivalDate, trip.checkoutDate), 10);
  assert.equal(trip.nights, 10);
  assert.equal(itinerary[0].date, trip.startDate);
  assert.equal(itinerary.at(-1).date, trip.checkoutDate);
  assert.equal(itinerary.filter((day) => day.stay).length, 10);
});

test("family totals match six adults and three children", () => {
  assert.equal(trip.adults, 6);
  assert.deepEqual(trip.children, [9, 7, 6]);
  assert.equal(familyGroups.length, 2);
  assert.match(familyGroups[0].members, /성인 4, 어린이 1/);
  assert.match(familyGroups[1].members, /성인 2, 어린이 2/);
});

test("recommended residence satisfies the one-home capacity constraint", () => {
  const recommended = lodgingOptions[0];
  assert.equal(recommended.id, "cvk");
  assert.match(recommended.capacity, /9명/);
  assert.match(recommended.layout, /침실 4/);
  assert.match(recommended.layout, /욕실 4/);
  assert.ok(recommended.fit >= 90);
});

test("place data has unique ids, safe links, and plausible local coordinates", () => {
  assert.equal(new Set(places.map((item) => item.id)).size, places.length);
  for (const item of places) {
    assert.match(item.official, /^https:\/\//, item.name);
    assert.match(item.maps, /^https:\/\/www\.google\.com\/maps\//, item.name);
    assert.ok(item.lat > 40.9 && item.lat < 41.2, item.name);
    assert.ok(item.lng > 28.8 && item.lng < 29.2, item.name);
    assert.ok(item.warning.length >= 8, item.name);
  }
});

test("closure-sensitive itinerary avoids known weekly conflicts", () => {
  const tuesdayNames = itinerary.filter((day) => day.dow === "화").map((day) => day.title).join(" ");
  const mondayNames = itinerary.filter((day) => day.dow === "월").map((day) => day.title).join(" ");
  assert.doesNotMatch(tuesdayNames, /Topkapı/);
  assert.doesNotMatch(mondayNames, /Dolmabahçe/);
  assert.match(itinerary.find((day) => day.date === "2027-03-26").main, /금요 예배/);
});

test("every day has a nine-person meal operating rule", () => {
  assert.equal(Object.keys(mealSuggestions).length, itinerary.length);
  for (const day of itinerary) assert.ok(mealSuggestions[day.date]?.length > 20, day.date);
});

test("status correctly moves through planning, travel, and complete modes", () => {
  assert.equal(tripStatus(new Date("2026-08-31T12:00:00Z")).mode, "planning");
  assert.equal(tripStatus(new Date("2027-03-25T12:00:00Z")).mode, "travel");
  assert.equal(tripStatus(new Date("2027-04-02T12:00:00Z")).mode, "complete");
});

test("forecast gate opens only near the trip", () => {
  assert.equal(weatherMode(new Date("2026-08-31T12:00:00Z")).live, false);
  assert.equal(weatherMode(new Date("2027-03-10T12:00:00Z")).live, true);
});

test("filters combine search, rain, area, category, and energy", () => {
  assert.ok(filterPlaces({ query: "아이" }).some((item) => item.id === "rahmi"));
  assert.ok(filterPlaces({ zone: "Sultanahmet", rain: true }).every((item) => item.zone === "Sultanahmet" && item.rain));
  assert.ok(filterPlaces({ energy: 1 }).every((item) => item.energy <= 1));
  assert.ok(filterPlaces({ category: "제외" }).every((item) => item.category === "제외"));
});

test("local guide answers high-risk family questions without a server", () => {
  assert.match(localAnswer("9명이 한 집에서 자려면?").answer, /CVK Park Bosphorus/);
  assert.match(localAnswer("비 오면 아이들과 어디 가?").answer, /Basilica Cistern/);
  assert.match(localAnswer("카파도키아도 갈까?").answer, /추가하지 않는 편/);
  assert.ok(searchContext("Topkapı 화요일").length > 0);
  assert.equal(makeAssistantPayload("숙소 추천").question, "숙소 추천");
});

test("CSV, KML, and map points retain all curated places", () => {
  const csv = makeCsv();
  const kml = makeKml();
  assert.equal(csv.split("\n").length, places.length + 1);
  assert.match(csv, /Karaköy Lokantası/);
  assert.match(kml, /<kml xmlns=/);
  assert.equal((kml.match(/<Placemark>/g) || []).length, places.length);
  const points = buildMapPoints();
  assert.ok(points.length >= places.length - 1);
  assert.ok(points.every((item) => item.x >= 28 && item.x <= 972 && item.y >= 28 && item.y <= 532));
});
