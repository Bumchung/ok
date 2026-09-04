import test from "node:test";
import assert from "node:assert/strict";
import { airbnbSearch, budgetModel, diningSpots, itinerary, lodgingOptions, observedTripComQuotes, places, trip } from "./trip-data.mjs";
import {
  buildMapPoints, calculateBudget, compareHotelPrices, daysBetween, distanceKm, filterDining, filterPlaces,
  itineraryForPace, localAnswer, makeAssistantPayload, makeCsv, makeGoogleCalendarUrl, makeIcs, makeKml,
  searchContext, tripStatus, weatherMode
} from "./app-core.mjs";

test("Cappadocia segment is exactly three nights across four calendar days", () => {
  assert.equal(trip.destination, "카파도키아");
  assert.equal(daysBetween(trip.arrivalDate, trip.checkoutDate), 3);
  assert.equal(trip.nights, 3);
  assert.equal(itinerary.length, 4);
  assert.equal(itinerary[0].date, trip.startDate);
  assert.equal(itinerary.at(-1).date, trip.checkoutDate);
  assert.equal(itinerary.filter((day) => day.stay?.startsWith("카파도키아")).length, 3);
});

test("family contract stays six adults and three children", () => {
  assert.equal(trip.adults, 6);
  assert.deepEqual(trip.children, [9, 7, 6]);
  assert.equal(trip.adults + trip.children.length, 9);
});

test("status and weather gates use the Cappadocia dates", () => {
  assert.equal(tripStatus(new Date("2027-03-01T03:00:00Z")).mode, "planning");
  assert.equal(tripStatus(new Date("2027-03-27T03:00:00Z")).mode, "travel");
  assert.equal(tripStatus(new Date("2027-04-10T03:00:00Z")).mode, "complete");
  assert.equal(weatherMode(new Date("2027-03-01T03:00:00Z")).live, false);
  assert.equal(weatherMode(new Date("2027-03-20T03:00:00Z")).live, true);
});

test("twelve hotels and six residences retain honest booking boundaries", () => {
  assert.equal(lodgingOptions.length, 12);
  assert.equal(new Set(lodgingOptions.map((item) => item.id)).size, 12);
  assert.equal(airbnbSearch.options.length, 6);
  for (const hotel of lodgingOptions) {
    assert.equal(hotel.bookingModel, "hotel_rooms", hotel.name);
    assert.match(hotel.image, /^\.\/assets\/cards\//, hotel.name);
    assert.match(hotel.photoSource, /^https:\/\//, hotel.name);
    assert.ok(hotel.hotelPlan?.rooms >= 4, hotel.name);
    assert.ok(hotel.good?.length && hotel.cautions?.length, hotel.name);
  }
  for (const residence of airbnbSearch.options) {
    assert.ok(["candidate", "unverified"].includes(residence.availability), residence.name);
    assert.equal(Number.isFinite(residence.exactTotal), false, residence.name);
    assert.match(`${residence.price} ${residence.priceEvidence}`, /확인|없|미정/, residence.name);
    assert.match(residence.image, /^\.\/assets\/cards\//, residence.name);
  }
});

test("all hotels expose a public comparison price without pretending it is a 2027 exact quote", () => {
  assert.equal(observedTripComQuotes.length, 12);
  for (const quote of observedTripComQuotes) {
    assert.equal(quote.status, "reference_start_price", quote.lodgingId);
    assert.notEqual(quote.status, "observed_exact", quote.lodgingId);
    assert.notEqual(quote.officialDirect?.status, "observed_exact", quote.lodgingId);
    assert.equal(Number.isFinite(quote.nightlyValue), false, quote.lodgingId);
    assert.match(quote.nightlyDisplay, /[$£€₽₺]|HK|US|CA/, quote.lodgingId);
    assert.match(quote.projectedDisplay, /단순 환산/, quote.lodgingId);
    assert.match(quote.inventoryNote, /실제 가족 견적이 아닙니다/, quote.lodgingId);
  }
});

test("place catalog has 30 geocoded Cappadocia records with official evidence", () => {
  assert.equal(places.length, 30);
  assert.equal(new Set(places.map((item) => item.id)).size, 30);
  for (const item of places) {
    assert.ok(item.lat > 38.1 && item.lat < 38.9, item.name);
    assert.ok(item.lng > 34.1 && item.lng < 35.2, item.name);
    assert.match(item.image, /^\.\/assets\/cards\//, item.name);
    assert.match(item.photoSource, /^https:\/\//, item.name);
    assert.match(item.official, /^https:\/\//, item.name);
    assert.ok(item.skipIf && item.reviews?.summary, item.name);
  }
});

test("the itinerary uses one underground city and never puts a balloon on departure day", () => {
  const plan = itinerary.map((day) => `${day.main} ${day.timeline.join(" ")}`).join(" ");
  assert.match(plan, /Kaymaklı/);
  assert.doesNotMatch(plan, /Kaymaklı.*Derinkuyu.*방문|Derinkuyu.*Kaymaklı.*방문/);
  assert.doesNotMatch(`${itinerary.at(-1).main} ${itinerary.at(-1).timeline.join(" ")}`, /열기구.*시도|벌룬.*시도/);
  assert.match(itinerary.at(-1).notes, /금지/);
});

test("dining catalog has twenty restaurants and ten cafes", () => {
  assert.equal(diningSpots.length, 30);
  assert.equal(diningSpots.filter((item) => item.type === "restaurant").length, 20);
  assert.equal(diningSpots.filter((item) => item.type === "cafe").length, 10);
  assert.equal(new Set(diningSpots.map((item) => item.id)).size, 30);
  for (const item of diningSpots) {
    assert.match(item.image, /^\.\/assets\/cards\//, item.name);
    assert.match(item.officialUrl, /^https?:\/\//, item.name);
    assert.match(item.mapsUrl, /^https:\/\/www\.google\.com\/maps\//, item.name);
    assert.ok(item.reservation && item.reviewCaution, item.name);
  }
});

test("every day supports gentle and focused operational detail", () => {
  for (const day of itinerary) {
    assert.ok(day.title && day.zone && day.main && day.whyNow, day.date);
    assert.ok(day.timeline.length >= 3 && day.transport && day.rain && day.low && day.notes, day.date);
    assert.deepEqual(Object.keys(day.needs).sort(), ["kids", "parents", "recovery", "together"]);
    assert.ok(places.some((item) => item.id === day.featuredPlace), day.featuredPlace);
    assert.ok(day.variants?.focused, `${day.date} focused variant`);
  }
  const gentle = itineraryForPace("gentle");
  const focused = itineraryForPace("focused");
  assert.equal(gentle.length, 4);
  assert.equal(focused.length, 4);
  assert.ok(focused.some((day, index) => day.title !== gentle[index].title));
});

test("filters combine query, rain, energy and family constraints", () => {
  assert.ok(filterPlaces({ rain: true }).every((item) => item.rain));
  assert.ok(filterPlaces({ energy: 1 }).every((item) => Number(item.energy) <= 1));
  assert.ok(filterPlaces({ query: "Kaymaklı" }).some((item) => item.id === "kaymakli"));
  assert.equal(filterDining(diningSpots, { type: "restaurant" }).length, 20);
  assert.ok(filterDining(diningSpots, { kidOnly: true }).length > 0);
});

test("budget separates stay, shared costs, flights, contingency and optional balloon", () => {
  const result = calculateBudget({ stayId: budgetModel.defaultStay, originId: budgetModel.defaultOrigin });
  const expectedShared = budgetModel.sharedLines.reduce((sum, item) => sum + item.familyTotal, 0);
  assert.equal(result.sharedBeforeBuffer, expectedShared);
  assert.equal(result.contingency, Math.round(result.beforeBuffer * budgetModel.contingencyRate));
  assert.equal(budgetModel.people, 9);
  assert.equal(budgetModel.origins.length, 2);
  assert.equal(budgetModel.origins[1].flightPerPerson, 189500);
  assert.equal(budgetModel.excludedOptions[0].familyTotal, 3600000);
  assert.ok(!budgetModel.sharedLines.some((item) => /열기구/.test(item.label)));
});

test("hotel comparison computes deltas only for identical exact conditions", () => {
  const quote = { comparisonKey: "same", currency: "EUR", totalIncludesTaxes: true, nightlyValue: 180, projectedValue: 2160,
    officialDirect: { status: "observed_exact", comparisonKey: "same", currency: "EUR", totalIncludesTaxes: true, nightlyValue: 200, projectedValue: 2400 } };
  assert.equal(compareHotelPrices(quote).status, "comparable");
  assert.equal(compareHotelPrices({ ...quote, comparisonKey: "different" }).status, "not_comparable");
});

test("local guide answers Cappadocia failure modes offline", () => {
  assert.match(localAnswer("벌룬이 취소되면?").answer, /첫 온전한 아침|출발일/);
  assert.match(localAnswer("지하도시 두 곳을 같이 볼까?").answer, /같은 날 묶지/);
  assert.match(localAnswer("비나 눈이 오면?").answer, /Nevşehir Museum|도예/);
  assert.match(localAnswer("공항은 NAV와 ASR 중 어디야?").answer, /IST-NAV/);
  assert.ok(searchContext("Kaymaklı", 3).length >= 1);
});

test("CSV, KML and ICS exports retain records and Cappadocia dates", () => {
  assert.equal(makeCsv().split("\n").length, 31);
  assert.equal((makeKml().match(/<Placemark>/g) || []).length, 30);
  const ics = makeIcs();
  assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, 4);
  assert.match(ics, /Cappadocia Family Trip 2027/);
  assert.match(ics, /DTSTART;VALUE=DATE:20270329/);
});

test("calendar, map, distance and assistant payload need no private credentials", () => {
  assert.match(makeGoogleCalendarUrl(itinerary[1]), /^https:\/\/calendar\.google\.com\/calendar\/render\?/);
  const distance = distanceKm({ lat: 38.6431, lng: 34.8289 }, { lat: 38.6402, lng: 34.8458 });
  assert.ok(distance > 0 && distance < 3);
  const points = buildMapPoints(places);
  assert.equal(points.length, 30);
  assert.ok(points.every((item) => item.x >= 28 && item.x <= 972 && item.y >= 28 && item.y <= 532));
  const payload = makeAssistantPayload("  벌룬이 취소되면?  ");
  assert.equal(payload.question, "벌룬이 취소되면?");
  assert.ok(payload.context.length <= 6);
});
