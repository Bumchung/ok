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
  assert.equal(recommended.id, "zabeel");
  assert.match(recommended.capacity, /10명/);
  assert.match(recommended.layout, /침실 4/);
  assert.ok(recommended.fit >= 90);
});

test("place data has unique ids, safe links, and plausible local coordinates", () => {
  assert.equal(new Set(places.map((item) => item.id)).size, places.length);
  for (const item of places) {
    assert.match(item.official, /^https:\/\//, item.name);
    assert.match(item.maps, /^https:\/\/www\.google\.com\/maps\//, item.name);
    assert.ok(item.lat > 24.9 && item.lat < 25.4, item.name);
    assert.ok(item.lng > 55.0 && item.lng < 55.5, item.name);
    assert.ok(item.warning.length >= 8, item.name);
  }
});

test("low-fatigue itinerary alternates major outings with recovery", () => {
  assert.match(itinerary.find((day) => day.date === "2027-03-22").title, /회복/);
  assert.match(itinerary.find((day) => day.date === "2027-03-24").title, /리조트/);
  assert.match(itinerary.find((day) => day.date === "2027-03-28").title, /휴식/);
  assert.match(itinerary.find((day) => day.date === "2027-03-30").notes, /사막/);
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
  assert.ok(filterPlaces({ query: "아이" }).some((item) => item.id === "future"));
  assert.ok(filterPlaces({ zone: "Downtown", rain: true }).every((item) => item.zone === "Downtown" && item.rain));
  assert.ok(filterPlaces({ energy: 1 }).every((item) => item.energy <= 1));
  assert.ok(filterPlaces({ category: "제외" }).every((item) => item.category === "제외"));
});

test("local guide answers high-risk family questions without a server", () => {
  assert.match(localAnswer("9명이 한 집에서 자려면?").answer, /Zabeel Saray/);
  assert.match(localAnswer("비 오면 아이들과 어디 가?").answer, /Museum of the Future/);
  assert.match(localAnswer("사막 사파리도 갈까?").answer, /핵심 일정에 넣지 않는 편/);
  assert.ok(searchContext("Aquaventure 아이").length > 0);
  assert.equal(makeAssistantPayload("숙소 추천").question, "숙소 추천");
});

test("CSV, KML, and map points retain all curated places", () => {
  const csv = makeCsv();
  const kml = makeKml();
  assert.equal(csv.split("\n").length, places.length + 1);
  assert.match(csv, /Museum of the Future/);
  assert.match(kml, /<kml xmlns=/);
  assert.equal((kml.match(/<Placemark>/g) || []).length, places.length);
  const points = buildMapPoints();
  assert.ok(points.length >= places.length - 1);
  assert.ok(points.every((item) => item.x >= 28 && item.x <= 972 && item.y >= 28 && item.y <= 532));
});
