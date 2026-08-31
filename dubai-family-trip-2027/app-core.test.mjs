import test from "node:test";
import assert from "node:assert/strict";
import {
  buildMapPoints,
  distanceKm,
  daysBetween,
  filterPlaces,
  localAnswer,
  makeGoogleCalendarUrl,
  makeAssistantPayload,
  makeCsv,
  makeIcs,
  makeKml,
  searchContext,
  tripStatus,
  weatherMode
} from "./app-core.mjs";
import { familyGroups, itinerary, lodgingOptions, mealSuggestions, observedTripComQuotes, places, trip, tripComCostSummary } from "./trip-data.mjs";

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
  assert.match(recommended.capacity, /12명/);
  assert.match(recommended.layout, /침실 5/);
  assert.ok(recommended.fit >= 90);
});

test("lodging comparison includes one-villa and four-hotel-room choices", () => {
  assert.equal(new Set(lodgingOptions.map((item) => item.id)).size, lodgingOptions.length);
  assert.ok(lodgingOptions.filter((item) => item.bookingModel === "hotel_rooms").length >= 5);
  assert.ok(lodgingOptions.some((item) => item.hotelPlan?.rooms === 1));
  assert.ok(lodgingOptions.some((item) => item.hotelPlan?.rooms === 4));
  for (const item of lodgingOptions) {
    assert.match(item.image, /^\.\/assets\//, item.name);
    assert.ok(item.photoLabel.length >= 8, item.name);
  }
});

test("Trip.com Dubai quotes match the requested 2027 stay and separate one villa from four rooms", () => {
  assert.match(tripComCostSummary.exactQuoteStatus, /호텔 5곳과 5베드룸 빌라 1곳/);
  assert.equal(observedTripComQuotes.length, 6);
  assert.ok(observedTripComQuotes.every((quote) => quote.status === "observed_exact" && quote.totalIncludesTaxes === true));
  assert.ok(observedTripComQuotes.every((quote) => quote.referenceStay.includes("2027-03-21")));
  const zabeel = observedTripComQuotes.find((quote) => quote.lodgingId === "zabeel");
  const hotels = observedTripComQuotes.filter((quote) => quote.lodgingId !== "zabeel");
  assert.match(zabeel.roomPlan, /1채/);
  assert.equal(zabeel.projectedValue, 42151);
  assert.ok(hotels.every((quote) => quote.occupancy.includes("객실 4실")));
  assert.equal(Math.min(...hotels.map((quote) => quote.projectedValue)), 44344);
});

test("place data has unique ids, safe links, and plausible local coordinates", () => {
  assert.equal(new Set(places.map((item) => item.id)).size, places.length);
  for (const item of places) {
    assert.match(item.official, /^https:\/\//, item.name);
    assert.match(item.maps, /^https:\/\/www\.google\.com\/maps\//, item.name);
    assert.ok(item.lat > 24.9 && item.lat < 25.4, item.name);
    assert.ok(item.lng > 55.0 && item.lng < 55.5, item.name);
    assert.ok(item.warning.length >= 8, item.name);
    assert.match(item.image, /^(?:https:\/\/|\.\/assets\/)/, `${item.name} primary image`);
    assert.match(item.imageFallback, /^https:\/\//, `${item.name} fallback image`);
    assert.ok(item.reviews?.summary.length >= 20, `${item.name} review summary`);
    assert.ok(item.reviews?.liked.length >= 2, `${item.name} repeated positives`);
    assert.ok(item.reviews?.disliked.length >= 1, `${item.name} repeated negatives`);
    assert.ok(item.reviews?.sources.length >= 1, `${item.name} review sources`);
  }
});

test("every travel day has a visual anchor and a human reason for its position", () => {
  for (const day of itinerary) {
    assert.ok(day.featuredPlace || day.photo, `${day.date} visual anchor`);
    assert.ok(day.whyNow?.length >= 20, `${day.date} why now`);
    for (const key of ["parents", "kids", "together", "recovery"]) {
      assert.ok(day.needs?.[key]?.length >= 12, `${day.date} ${key}`);
    }
  }
  assert.ok(searchContext("가족 시상식").some((item) => item.kind === "일정"));
});

test("low-fatigue itinerary alternates major outings with recovery", () => {
  assert.match(itinerary.find((day) => day.date === "2027-03-22").title, /우리 집/);
  assert.match(itinerary.find((day) => day.date === "2027-03-24").title, /따로 쉬는 날/);
  assert.match(itinerary.find((day) => day.date === "2027-03-28").title, /다시 하는 날/);
  assert.match(itinerary.find((day) => day.date === "2027-03-30").title, /가족 시상식/);
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
  assert.ok(filterPlaces({ query: "유모차 보관" }).some((item) => item.id === "burj"));
  assert.ok(filterPlaces({ zone: "Downtown", rain: true }).every((item) => item.zone === "Downtown" && item.rain));
  assert.ok(filterPlaces({ energy: 1 }).every((item) => item.energy <= 1));
  assert.ok(filterPlaces({ category: "제외" }).every((item) => item.category === "제외"));
});

test("local guide answers high-risk family questions without a server", () => {
  assert.match(localAnswer("9명이 한 집에서 자려면?").answer, /Zabeel Saray/);
  assert.match(localAnswer("비 오면 아이들과 어디 가?").answer, /Museum of the Future/);
  assert.match(localAnswer("사막 사파리도 갈까?").answer, /이번에는 빼는 게 맞/);
  assert.match(localAnswer("Trip.com 실경비는?").answer, /US\$42,151/);
  assert.ok(searchContext("호텔 4실 Trip.com").some((item) => item.kind === "비용"));
  assert.ok(searchContext("Aquaventure 아이").length > 0);
  assert.ok(searchContext("Burj Khalifa 유모차 보관").some((item) => item.title.includes("Burj Khalifa")));
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

test("calendar and nearby utilities work without private credentials", () => {
  const url = makeGoogleCalendarUrl(itinerary[3]);
  assert.match(url, /^https:\/\/calendar\.google\.com\/calendar\/render\?/);
  const calendarUrl = new URL(url);
  assert.match(calendarUrl.searchParams.get("dates"), /20270323/);
  assert.match(calendarUrl.searchParams.get("details"), /부모가 기대할 것/);
  assert.match(calendarUrl.searchParams.get("details"), /아이들이 기다릴 것/);
  assert.match(calendarUrl.searchParams.get("details"), /시간표/);
  const ics = makeIcs();
  assert.match(ics, /BEGIN:VCALENDAR/);
  assert.match(ics, /같이 남길 장면/);
  assert.match(ics, /오후 회복/);
  assert.match(ics, /시간표/);
  assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, itinerary.length);
  assert.ok(distanceKm({ lat: 25.1972, lng: 55.2744 }, { lat: 25.0986, lng: 55.1233 }) > 10);
});
