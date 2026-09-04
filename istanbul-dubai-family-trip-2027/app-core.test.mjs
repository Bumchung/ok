import test from "node:test";
import assert from "node:assert/strict";
import { airbnbSearch, budgetModel, diningSpots, familyGroups, itinerary, lodgingOptions, observedTripComQuotes, places, trip } from "./trip-data.mjs";
import { buildMapPoints, calculateBudget, daysBetween, filterDining, filterPlaces, itineraryForPace, localAnswer, makeCsv, makeGoogleCalendarUrl, makeIcs, makeKml, searchContext, tripStatus, weatherMode } from "./app-core.mjs";

test("Dubai stop is exactly three nights after Istanbul", () => {
  assert.equal(trip.destination, "두바이");
  assert.equal(daysBetween(trip.arrivalDate, trip.checkoutDate), 3);
  assert.equal(trip.nights, 3);
  assert.equal(itinerary.length, 4);
  assert.equal(itinerary[0].date, "2027-03-28");
  assert.equal(itinerary.at(-1).date, "2027-03-31");
});

test("route keeps nine travelers together before the ICN and LAX split", () => {
  assert.equal(trip.adults, 6);
  assert.deepEqual(trip.children, [9, 7, 6]);
  assert.match(familyGroups[0].route, /IST → 두바이 DXB/);
  assert.match(familyGroups[1].route, /DXB → ICN \/ DXB → LAX/);
  assert.match(familyGroups[1].carriers, /ICN 주 9회, LAX 매일/);
});

test("status and weather gates use Dubai dates", () => {
  assert.equal(tripStatus(new Date("2027-03-01T03:00:00Z")).mode, "planning");
  assert.equal(tripStatus(new Date("2027-03-29T03:00:00Z")).mode, "travel");
  assert.equal(tripStatus(new Date("2027-04-10T03:00:00Z")).mode, "complete");
  assert.equal(weatherMode(new Date("2027-03-01T03:00:00Z")).live, false);
  assert.equal(weatherMode(new Date("2027-03-20T03:00:00Z")).live, true);
});

test("catalog parity is 12 hotels, 6 residences, 30 places and 30 dining cards", () => {
  assert.equal(lodgingOptions.length, 12);
  assert.equal(airbnbSearch.options.length, 6);
  assert.equal(places.length, 30);
  assert.equal(diningSpots.length, 30);
  assert.equal(diningSpots.filter((item) => item.type === "restaurant").length, 20);
  assert.equal(diningSpots.filter((item) => item.type === "cafe").length, 10);
  for (const item of [...lodgingOptions, ...airbnbSearch.options, ...places, ...diningSpots]) {
    assert.match(item.image, /^\.\/assets\/cards\//, item.name);
    assert.match(item.photoSource, /^https:\/\//, item.name);
  }
});

test("every hotel has a visible public price state without inventing a three-night quote", () => {
  assert.equal(observedTripComQuotes.length, 12);
  assert.equal(new Set(observedTripComQuotes.map((item) => item.lodgingId)).size, 12);
  for (const quote of observedTripComQuotes) {
    assert.equal(quote.status, "reference_start_price");
    assert.equal(quote.officialDirect.status, "unavailable");
    assert.equal(Number.isFinite(quote.nightlyValue), false);
    assert.ok(quote.nightlyDisplay && quote.projectedDisplay);
    assert.match(quote.inventoryNote, /실제 가족 견적이 아닙니다/);
  }
  assert.equal(observedTripComQuotes.filter((item) => /10박 정확 날짜/.test(item.referenceStay)).length, 6);
});

test("every day has gentle and focused operational detail", () => {
  for (const day of itinerary) {
    assert.ok(day.title && day.zone && day.main && day.whyNow && day.featuredPlace);
    assert.ok(day.timeline.length >= 4 && day.rain && day.low && day.notes);
    assert.deepEqual(Object.keys(day.needs).sort(), ["kids", "parents", "recovery", "together"]);
    assert.ok(day.variants.focused);
  }
  assert.equal(itineraryForPace("gentle").length, 4);
  assert.ok(itineraryForPace("focused").some((day, index) => day.title !== itinerary[index].title));
});

test("filters, budget and offline answers work", () => {
  assert.ok(filterPlaces({ rain: true }).every((item) => item.rain));
  assert.ok(filterPlaces({ query: "OliOli" }).some((item) => item.id === "olioli"));
  assert.equal(filterDining(diningSpots, { type: "restaurant" }).length, 20);
  const result = calculateBudget({ stayId: budgetModel.defaultStay, originId: budgetModel.defaultOrigin });
  assert.equal(result.flightPerPerson, 0);
  assert.ok(result.landFamilyTotal > 0);
  assert.match(localAnswer("사막을 꼭 가야 해?").answer, /필수 일정이 아닙니다/);
  assert.match(localAnswer("LAX 직항은?").answer, /DXB.*ICN.*LAX/);
  assert.ok(searchContext("Aquaventure", 3).length >= 1);
});

test("exports retain all records and stopover dates", () => {
  assert.equal(makeCsv().split("\n").length, 31);
  assert.equal((makeKml().match(/<Placemark>/g) || []).length, 30);
  const ics = makeIcs();
  assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, 4);
  assert.match(ics, /Istanbul Dubai Family Trip 2027/);
  assert.match(ics, /DTSTART;VALUE=DATE:20270331/);
  assert.match(makeGoogleCalendarUrl(itinerary[1]), /^https:\/\/calendar\.google\.com\/calendar\/render\?/);
  assert.equal(buildMapPoints(places).length, 30);
});
