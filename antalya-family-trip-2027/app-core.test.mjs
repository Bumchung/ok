import test from "node:test";
import assert from "node:assert/strict";
import {
  airbnbSearch,
  budgetModel,
  diningSpots,
  itinerary,
  lodgingOptions,
  observedTripComQuotes,
  places,
  trip
} from "./trip-data.mjs";
import {
  buildMapPoints,
  calculateBudget,
  compareHotelPrices,
  daysBetween,
  distanceKm,
  filterDining,
  filterPlaces,
  itineraryForPace,
  localAnswer,
  makeAssistantPayload,
  makeCsv,
  makeGoogleCalendarUrl,
  makeIcs,
  makeKml,
  searchContext,
  tripStatus,
  weatherMode
} from "./app-core.mjs";

test("Antalya segment is exactly three nights across four calendar days", () => {
  assert.equal(trip.destination, "안탈리아");
  assert.equal(trip.startDate, "2027-03-26");
  assert.equal(trip.arrivalDate, "2027-03-26");
  assert.equal(trip.checkoutDate, "2027-03-29");
  assert.equal(daysBetween(trip.arrivalDate, trip.checkoutDate), 3);
  assert.equal(trip.nights, 3);
  assert.equal(itinerary.length, 4);
  assert.equal(itinerary[0].date, trip.startDate);
  assert.equal(itinerary.at(-1).date, trip.checkoutDate);
  assert.equal(itinerary.filter((day) => day.stay?.startsWith("안탈리아")).length, 3);
});

test("family contract stays six adults and three children", () => {
  assert.equal(trip.adults, 6);
  assert.deepEqual(trip.children, [9, 7, 6]);
  assert.equal(trip.adults + trip.children.length, 9);
});

test("status and weather gates use the Antalya segment dates", () => {
  assert.equal(tripStatus(new Date("2027-03-01T03:00:00Z")).mode, "planning");
  assert.equal(tripStatus(new Date("2027-03-27T03:00:00Z")).mode, "travel");
  assert.equal(tripStatus(new Date("2027-04-10T03:00:00Z")).mode, "complete");
  assert.equal(weatherMode(new Date("2027-03-01T03:00:00Z")).live, false);
  assert.equal(weatherMode(new Date("2027-03-20T03:00:00Z")).live, true);
});

test("twelve hotels and six residence candidates retain honest booking boundaries", () => {
  assert.equal(lodgingOptions.length, 12);
  assert.equal(new Set(lodgingOptions.map((item) => item.id)).size, 12);
  assert.equal(airbnbSearch.options.length, 6);
  assert.equal(new Set(airbnbSearch.options.map((item) => item.id)).size, 6);
  for (const hotel of lodgingOptions) {
    assert.equal(hotel.bookingModel, "hotel_rooms", hotel.name);
    assert.match(hotel.image, /^\.\/assets\/cards\//, hotel.name);
    assert.match(hotel.photoSource, /^https:\/\//, hotel.name);
    assert.ok(hotel.hotelPlan?.rooms >= 4, hotel.name);
    assert.ok(hotel.good?.length >= 1, hotel.name);
    assert.ok(hotel.cautions?.length >= 1, hotel.name);
  }
  for (const residence of airbnbSearch.options) {
    assert.ok(["candidate", "unavailable_exact", "unverified"].includes(residence.availability), residence.name);
    assert.equal(Number.isFinite(residence.exactTotal), false, residence.name);
    assert.match(`${residence.price} ${residence.priceEvidence}`, /확인|미정|없|후/, residence.name);
    assert.match(residence.image, /^\.\/assets\/cards\//, residence.name);
    assert.match(residence.photoSource, /^https:\/\//, residence.name);
  }
});

test("hotel evidence never presents an unverified 2027 rate as exact", () => {
  assert.equal(observedTripComQuotes.length, 12);
  for (const quote of observedTripComQuotes) {
    assert.notEqual(quote.status, "observed_exact", quote.lodgingId);
    assert.notEqual(quote.officialDirect?.status, "observed_exact", quote.lodgingId);
    assert.equal(Number.isFinite(quote.nightlyValue), false, quote.lodgingId);
    assert.equal(Number.isFinite(quote.officialDirect?.nightlyValue), false, quote.lodgingId);
    assert.match(`${quote.nightlyDisplay} ${quote.inventoryNote}`, /확인|미정|없|전|열리/, quote.lodgingId);
    assert.match(`${quote.officialDirect?.nightlyDisplay} ${quote.officialDirect?.inventoryNote}`, /확인|미정|없|전|열리/, quote.lodgingId);
  }
});

test("place catalog has 30 Antalya records and keeps the closed museum excluded", () => {
  assert.equal(places.length, 30);
  assert.equal(new Set(places.map((item) => item.id)).size, 30);
  for (const item of places) {
    assert.ok(item.lat > 36.4 && item.lat < 37.3, item.name);
    assert.ok(item.lng > 30.3 && item.lng < 31.6, item.name);
    assert.match(item.image, /^\.\/assets\/cards\//, item.name);
    assert.match(item.photoSource, /^https:\/\//, item.name);
    assert.match(item.official, /^https:\/\//, item.name);
    assert.match(item.maps, /^https:\/\/www\.google\.com\/maps\//, item.name);
    assert.ok(item.reviews?.summary, item.name);
    assert.ok(item.skipIf, item.name);
  }
  const museum = places.find((item) => /Antalya(?: Archaeology)? Museum|안탈리아 박물관/i.test(item.name));
  assert.ok(museum, "closed museum record");
  assert.equal(museum.category, "제외");
  assert.equal(museum.rain, false);
  assert.match(`${museum.warning} ${museum.skipIf}`, /폐관|공사|재개관/);
  for (const day of itinerary) {
    assert.notEqual(day.featuredPlace, museum.id, day.date);
    assert.doesNotMatch(`${day.main} ${day.timeline.join(" ")}`, /Antalya Museum|안탈리아 박물관/i, day.date);
  }
});

test("dining catalog has twenty restaurants and ten cafes with nine-person guidance", () => {
  assert.equal(diningSpots.length, 30);
  assert.equal(diningSpots.filter((item) => item.type === "restaurant").length, 20);
  assert.equal(diningSpots.filter((item) => item.type === "cafe").length, 10);
  assert.equal(new Set(diningSpots.map((item) => item.id)).size, 30);
  for (const item of diningSpots) {
    assert.match(item.image, /^\.\/assets\/cards\//, item.name);
    assert.match(item.photoSource, /^https:\/\//, item.name);
    assert.match(item.officialUrl, /^https?:\/\//, item.name);
    assert.match(item.mapsUrl, /^https:\/\/www\.google\.com\/maps\//, item.name);
    assert.ok(item.reservation, item.name);
    assert.ok(item.reviewCaution, item.name);
  }
});

test("every day carries the same operational detail contract as Istanbul", () => {
  for (const day of itinerary) {
    assert.match(day.date, /^2027-03-(?:26|27|28|29)$/);
    assert.ok(day.title && day.zone && day.main && day.whyNow, day.date);
    assert.ok(day.timeline.length >= 3, day.date);
    assert.ok(day.transport && day.rain && day.low && day.notes, day.date);
    assert.deepEqual(Object.keys(day.needs).sort(), ["kids", "parents", "recovery", "together"]);
    assert.ok(day.featuredPlace, day.date);
    assert.ok(places.some((item) => item.id === day.featuredPlace && item.category !== "제외"), day.featuredPlace);
    assert.ok(day.variants?.focused, `${day.date} focused variant`);
  }
  const gentle = itineraryForPace("gentle");
  const focused = itineraryForPace("focused");
  assert.equal(gentle.length, 4);
  assert.equal(focused.length, 4);
  assert.ok(focused.some((day, index) => day.title !== gentle[index].title || day.timeline.length !== gentle[index].timeline.length));
  assert.ok(focused.every((day) => day.paceLabel && day.needs.recovery));
});

test("place and dining filters combine query and family constraints", () => {
  const rainy = filterPlaces({ rain: true });
  assert.ok(rainy.length > 0 && rainy.every((item) => item.rain));
  const easy = filterPlaces({ energy: 1 });
  assert.ok(easy.length > 0 && easy.every((item) => Number(item.energy) <= 1));
  const firstPlace = places.find((item) => item.category !== "제외");
  assert.ok(filterPlaces({ query: firstPlace.name }).some((item) => item.id === firstPlace.id));
  const restaurants = filterDining(diningSpots, { type: "restaurant" });
  assert.equal(restaurants.length, 20);
  const kidFriendly = filterDining(diningSpots, { kidOnly: true });
  assert.ok(kidFriendly.length > 0);
});

test("incremental budget keeps stay, shared costs, contingency and flights separate", () => {
  const result = calculateBudget({ stayId: budgetModel.defaultStay, originId: budgetModel.defaultOrigin });
  const expectedShared = budgetModel.sharedLines.reduce((sum, item) => sum + item.familyTotal, 0);
  const expectedBeforeBuffer = result.stay.familyTotal + expectedShared;
  assert.equal(result.sharedBeforeBuffer, expectedShared);
  assert.equal(result.beforeBuffer, expectedBeforeBuffer);
  assert.equal(result.contingency, Math.round(expectedBeforeBuffer * budgetModel.contingencyRate));
  assert.equal(result.landFamilyTotal, result.beforeBuffer + result.contingency);
  assert.equal(result.perPersonTotal, result.landPerPerson + result.flightPerPerson);
  assert.equal(budgetModel.people, 9);
  assert.equal(budgetModel.origins.reduce((sum, item) => sum + item.people, 0), 9);
});

test("hotel comparison calculates deltas only for identical exact conditions", () => {
  const quote = {
    comparisonKey: "2027-03-26|2027-03-29|four-rooms",
    currency: "EUR",
    totalIncludesTaxes: true,
    nightlyValue: 180,
    projectedValue: 2_160,
    officialDirect: {
      status: "observed_exact",
      comparisonKey: "2027-03-26|2027-03-29|four-rooms",
      currency: "EUR",
      totalIncludesTaxes: true,
      nightlyValue: 200,
      projectedValue: 2_400
    }
  };
  assert.deepEqual(compareHotelPrices(quote), {
    status: "comparable",
    label: "동일 조건, Trip.com이 낮음",
    reason: "날짜, 객실, 인원, 통화와 세금 포함 조건이 일치합니다.",
    nightlyDelta: -20,
    projectedDelta: -240,
    percent: -10
  });
  assert.equal(compareHotelPrices({ ...quote, comparisonKey: "different" }).status, "not_comparable");
  assert.equal(compareHotelPrices({ officialDirect: { status: "verification_blocked" } }).status, "official_unavailable");
});

test("local guide answers Antalya failure modes without a server", () => {
  const rain = localAnswer("비 오면 뭘 하지?");
  assert.equal(rain.provider, "앱 내장 가이드");
  assert.match(rain.answer, /Aquarium|Toy Museum/);
  assert.doesNotMatch(rain.answer, /Antalya Museum.*가(면|요|자)/);
  assert.match(localAnswer("Perge와 Aspendos를 같이 볼까?").answer, /같은 날 묶지/);
  assert.match(localAnswer("박물관은 어디로 갈까?").answer, /폐관/);
  assert.match(localAnswer("공항은 SAW도 괜찮아?").answer, /IST/);
  assert.ok(searchContext("Perge", 3).length >= 1);
});

test("CSV, KML and ICS exports retain all curated records and dates", () => {
  const csv = makeCsv();
  assert.equal(csv.split("\n").length, 31);
  assert.match(csv, /^name,zone,category,latitude,longitude/);
  const kml = makeKml();
  assert.equal((kml.match(/<Placemark>/g) || []).length, 30);
  assert.match(kml, /Antalya|안탈리아/);
  const ics = makeIcs();
  assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, 4);
  assert.match(ics, /DTSTART;VALUE=DATE:20270326/);
  assert.match(ics, /DTSTART;VALUE=DATE:20270329/);
});

test("calendar, map and nearby utilities work without private credentials", () => {
  const url = makeGoogleCalendarUrl(itinerary[1]);
  assert.match(url, /^https:\/\/calendar\.google\.com\/calendar\/render\?/);
  assert.match(decodeURIComponent(url), /안탈리아/);
  const distance = distanceKm({ lat: 36.8841, lng: 30.7056 }, { lat: 36.886, lng: 30.71 });
  assert.ok(distance > 0 && distance < 2);
  const points = buildMapPoints(places);
  assert.equal(points.length, 30);
  assert.ok(points.every((item) => item.x >= 28 && item.x <= 972 && item.y >= 28 && item.y <= 532));
  assert.deepEqual(buildMapPoints([]), []);
});

test("assistant payload is trimmed and contains only bounded local context", () => {
  const payload = makeAssistantPayload("  아이들이 피곤하면?  ");
  assert.equal(payload.question, "아이들이 피곤하면?");
  assert.ok(payload.context.length <= 6);
  assert.ok(payload.context.every((item) => item.title && item.body));
});
