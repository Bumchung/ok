import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  buildMapPoints,
  calculateBudget,
  compareHotelPrices,
  distanceKm,
  daysBetween,
  filterDining,
  filterPlaces,
  itineraryForPace,
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
import { airbnbSearch, budgetModel, diningSpots, familyGroups, fxStrategy, itinerary, lodgingOptions, mealSuggestions, observedTripComQuotes, places, sources, trip, tripComCostSummary } from "./trip-data.mjs";

async function readJsonl(relativePath) {
  const content = await readFile(new URL(relativePath, import.meta.url), "utf8");
  return content.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}

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

test("per-person budget separates shared land cost from origin flights", () => {
  const icn = calculateBudget({ stayId: "airbnb_kabatas_exact", originId: "icn" });
  const lax = calculateBudget({ stayId: "airbnb_kabatas_exact", originId: "lax" });
  assert.equal(icn.sharedBeforeBuffer, 18200000);
  assert.equal(icn.stay.familyTotal, 6026212);
  assert.equal(icn.contingency, 2422621);
  assert.equal(icn.landFamilyTotal, 26648833);
  assert.equal(Math.round(icn.landPerPerson), 2960981);
  assert.equal(Math.round(icn.perPersonTotal), 4710981);
  assert.equal(Math.round(lax.perPersonTotal), 5110981);
  assert.equal(icn.mixedOriginFamilyTotal, 43998833);
  assert.equal(budgetModel.origins.reduce((sum, item) => sum + item.people, 0), 9);
});

test("Airbnb research distinguishes twelve exact totals from three unavailable listings", () => {
  assert.equal(airbnbSearch.options.length, 15);
  assert.equal(airbnbSearch.exactAvailableCount, 12);
  assert.equal(airbnbSearch.unavailableCount, 3);
  assert.equal(airbnbSearch.lowestExactTotal, 2469835);
  assert.equal(airbnbSearch.highestExactTotal, 15897219);
  assert.equal(airbnbSearch.options[0].listingId, "31092297");
  const available = airbnbSearch.options.filter((item) => item.availability === "available_exact");
  const unavailable = airbnbSearch.options.filter((item) => item.availability === "unavailable_exact");
  assert.equal(available.length, 12);
  assert.equal(unavailable.length, 3);
  for (const item of available) {
    assert.ok(item.capacity >= 9, item.name);
    assert.ok(item.exactTotal > 0, item.name);
    assert.equal(item.nightlyAverage, Math.round(item.exactTotal / 10), item.name);
    assert.match(item.priceEvidence, /총액|가격 내역/, item.name);
  }
  for (const item of unavailable) {
    assert.equal(item.exactTotal, null, item.name);
    assert.match(item.price, /예약 불가/, item.name);
    assert.match(item.cancellation, /취소 조건을 확정할 수 없/, item.name);
    assert.match(item.cancellationLimit, /표시되지 않았|실제 결제 가능한 요금의 조건으로 볼 수 없/, item.name);
  }
  for (const item of airbnbSearch.options) {
    assert.match(item.url, new RegExp(`/rooms/${item.listingId}`), item.name);
    assert.match(item.url, /check_in=2027-03-21/);
    assert.match(item.image, /^\.\/assets\/card-images\/airbnb-.+\.webp$/, item.name);
    assert.match(item.photoSource, new RegExp(`/rooms/${item.listingId}`), item.name);
    assert.match(item.photoLabel, /Airbnb 숙소 대표 사진/, item.name);
    assert.equal(item.photoCheckedAt, "2026-09-01", item.name);
  }
});

test("Airbnb catalog and budget choices stay traceable to the observed JSONL", async () => {
  const raw = await readJsonl("./research/airbnb-9guests.jsonl");
  assert.equal(raw.length, airbnbSearch.options.length);
  for (const source of raw) {
    const generated = airbnbSearch.options.find((item) => item.listingId === source.listing_id);
    assert.ok(generated, source.listing_id);
    assert.equal(generated.availability, source.availability.status, source.listing_id);
    assert.equal(generated.exactTotal, source.price.total, source.listing_id);
    assert.equal(generated.url, source.date_query_url, source.listing_id);
    assert.equal(generated.observedAt, source.observed_at, source.listing_id);
  }
  const observedBudgetStays = budgetModel.stayOptions.filter((item) => item.listingId);
  assert.equal(observedBudgetStays.length, 3);
  for (const stay of observedBudgetStays) {
    const listing = airbnbSearch.options.find((item) => item.listingId === stay.listingId);
    assert.equal(stay.familyTotal, listing.exactTotal, stay.id);
    assert.equal(stay.sourceUrl, listing.url, stay.id);
    assert.equal(stay.observedAt, listing.observedAt, stay.id);
    assert.equal(stay.cancellation, listing.cancellation, stay.id);
  }
});

test("currency strategy shows both nominal gain and inflation counterevidence", () => {
  assert.equal(fxStrategy.rates.eurKrw, 1586.37);
  assert.equal(fxStrategy.rates.eurTry, 55.9648);
  assert.equal(Number(fxStrategy.rates.tryKrw.toFixed(4)), 28.3459);
  assert.equal(fxStrategy.rates.nominalChangeSinceYearEndPct, -15.67);
  assert.equal(fxStrategy.rates.combinedCostChangePct, 1.08);
  assert.match(fxStrategy.diagnosis, /환율 기준일보다 물가 기준월이 한 달 이르/);
  assert.match(fxStrategy.diagnosis, /가격 추정값이 아니라/);
});

test("recommended residence satisfies the one-home capacity constraint", () => {
  const recommended = lodgingOptions[0];
  assert.equal(recommended.id, "cvk");
  assert.match(recommended.capacity, /9명/);
  assert.match(recommended.layout, /침실 4/);
  assert.match(recommended.layout, /욕실 4/);
  assert.ok(recommended.fit >= 90);
});

test("lodging comparison includes both one-home and hotel-room plans", () => {
  assert.equal(new Set(lodgingOptions.map((item) => item.id)).size, lodgingOptions.length);
  assert.equal(lodgingOptions.filter((item) => item.bookingModel !== "whole_home").length, 30);
  assert.equal(lodgingOptions.filter((item) => item.bookingModel === "whole_home").length, 1);
  assert.ok(lodgingOptions.some((item) => item.bookingModel === "whole_home"));
  assert.ok(lodgingOptions.filter((item) => item.bookingModel === "hotel_rooms").length >= 3);
  for (const item of lodgingOptions) {
    assert.ok(item.hotelPlan?.rooms >= 1, item.name);
    assert.match(item.image, /^(?:https:\/\/|\.\/assets\/)/, item.name);
    assert.ok(item.photoLabel.length >= 8, item.name);
    if (item.bookingModel !== "whole_home") assert.match(item.photoLabel, /실제 숙소 사진/, item.name);
    assert.match(item.photoSource, /^https:\/\//, item.name);
  }
  assert.equal(sources.find((item) => item.title === "The Peninsula family package").url, lodgingOptions.find((item) => item.id === "peninsula").official);
  assert.equal(sources.find((item) => item.title === "Somerset Maslak").url, lodgingOptions.find((item) => item.id === "somerset").official);
});

test("Trip.com reference prices and official direct prices keep their evidence conditions", () => {
  assert.match(tripComCostSummary.exactQuoteStatus, /확인되지 않았/);
  assert.equal(tripComCostSummary.fx.eurToKrw, 1586.37);
  assert.equal(observedTripComQuotes.length, 30);
  for (const quote of observedTripComQuotes) {
    assert.ok(["observed_exact", "reference_start_price", "unavailable"].includes(quote.status), quote.id);
    if (Number.isFinite(quote.nightlyValue)) assert.equal(quote.projectedValue, quote.nightlyValue * 4 * 10);
    assert.match(quote.unitLabel, /1실 1박/);
    assert.equal(quote.officialDirect.capturedAt, quote.capturedAt);
    assert.match(quote.officialDirect.sourceUrl, /^https:\/\//);
    assert.match(quote.sourceUrl, /^https:\/\/(?:www\.|kr\.)?trip\.com\//);
    assert.ok(["comparable", "not_comparable", "official_unavailable"].includes(compareHotelPrices(quote).status));
  }
  const cvk = observedTripComQuotes.find((quote) => quote.lodgingId === "cvk").officialDirect;
  assert.equal(cvk.nightlyValue, 603);
  assert.equal(cvk.projectedValue, 6030);
  assert.equal(cvk.status, "observed_once_not_reproduced");
  assert.match(cvk.occupancy, /4베드룸 레지던스 1채/);
  assert.doesNotMatch(cvk.occupancy, /객실 4실/);
  assert.equal(compareHotelPrices(observedTripComQuotes.find((quote) => quote.lodgingId === "cvk")).status, "official_unavailable");
  const swissotel = observedTripComQuotes.find((quote) => quote.lodgingId === "swissotel").officialDirect;
  assert.equal(swissotel.nightlyValue, 196);
  assert.equal(swissotel.projectedValue, 7840);
  assert.equal(swissotel.totalIncludesTaxes, true);
  assert.equal(swissotel.refundable, false);
  assert.equal(swissotel.memberRate.nightlyDisplay, "EUR 176.40");
  assert.equal(swissotel.rateAlternatives.find((rate) => rate.label === "무료취소 일반가").nightlyDisplay, "EUR 280");
  assert.equal(observedTripComQuotes.find((quote) => quote.lodgingId === "ritz").officialDirect.nightlyValue, null);
  assert.equal(observedTripComQuotes.find((quote) => quote.lodgingId === "peninsula").officialDirect.status, "verification_blocked");
});

test("price differences are calculated only when every comparison condition matches", () => {
  const quote = {
    comparisonKey: "same-room-and-stay",
    currency: "EUR",
    totalIncludesTaxes: true,
    nightlyValue: 180,
    projectedValue: 7200,
    officialDirect: {
      status: "observed_exact",
      comparisonKey: "same-room-and-stay",
      currency: "EUR",
      totalIncludesTaxes: true,
      nightlyValue: 200,
      projectedValue: 8000
    }
  };
  assert.deepEqual(compareHotelPrices(quote), {
    status: "comparable",
    label: "동일 조건, Trip.com이 낮음",
    reason: "날짜, 객실, 인원, 통화와 세금 포함 조건이 일치합니다.",
    nightlyDelta: -20,
    projectedDelta: -800,
    percent: -10
  });
  assert.equal(compareHotelPrices({ ...quote, totalIncludesTaxes: null }).status, "not_comparable");
});

test("place data has unique ids, safe links, and plausible local coordinates", () => {
  assert.equal(places.length, 100);
  assert.equal(new Set(places.map((item) => item.id)).size, places.length);
  for (const item of places) {
    assert.match(item.official, /^https:\/\//, item.name);
    assert.match(item.maps, /^https:\/\/www\.google\.com\/maps\//, item.name);
    assert.ok(item.lat > 40.8 && item.lat < 41.3, item.name);
    assert.ok(item.lng > 28.7 && item.lng < 29.3, item.name);
    assert.ok(item.warning.length >= 8, item.name);
    assert.match(item.image, /^(?:https:\/\/|\.\/assets\/)/, `${item.name} primary image`);
    assert.match(item.imageFallback, /^https:\/\//, `${item.name} fallback image`);
    assert.ok(item.reviews?.summary.length >= 20, `${item.name} review summary`);
    assert.ok(item.reviews?.liked.length >= 2, `${item.name} repeated positives`);
    assert.ok(item.reviews?.disliked.length >= 1, `${item.name} repeated negatives`);
    assert.ok(item.reviews?.sources.length >= 1, `${item.name} review sources`);
  }
});

test("dining catalog contains 60 restaurants and 40 cafes with review and map evidence", () => {
  assert.equal(diningSpots.length, 100);
  assert.equal(diningSpots.filter((item) => item.type === "restaurant").length, 60);
  assert.equal(diningSpots.filter((item) => item.type === "cafe").length, 40);
  assert.equal(new Set(diningSpots.map((item) => item.id)).size, 100);
  assert.equal(new Set(diningSpots.map((item) => item.name)).size, 100);
  assert.deepEqual(diningSpots.map((item) => item.rank), Array.from({ length: 100 }, (_, index) => index + 1));
  for (const item of diningSpots) {
    assert.ok(item.lat > 40.8 && item.lat < 41.3, item.name);
    assert.ok(item.lng > 28.7 && item.lng < 29.3, item.name);
    assert.match(item.mapsUrl, /^https:\/\/www\.google\.com\/maps\//, item.name);
    assert.match(item.officialUrl, /^https?:\/\//, item.name);
    assert.match(item.reviewSourceUrl, /^https?:\/\//, item.name);
    assert.ok(item.reviewPros.length >= 2, item.name);
    assert.match(item.reservation, /9인|9명/, item.name);
    const thirdPartyInformation = /tripadvisor\.com|google\.com\/maps/i.test(item.officialUrl);
    assert.equal(item.informationLabel, thirdPartyInformation ? "정보 페이지" : "공식 정보", item.name);
    assert.equal(item.checkedAt, "2026-09-01", item.name);
    assert.match(item.image, /^\.\/assets\/card-images\/.+\.webp$/, item.name);
    assert.match(item.photoSource, /^https?:\/\//, item.name);
    assert.match(item.photoLabel, /대표 사진/, item.name);
    assert.equal(item.photoCheckedAt, "2026-09-01", item.name);
  }
  assert.ok(filterDining(diningSpots, { type: "cafe" }).every((item) => item.type === "cafe"));
  assert.ok(filterDining(diningSpots, { kidOnly: true }).every((item) => /높음/.test(item.kidFit)));
  const ninePersonSearchIds = new Set([
    ...filterDining(diningSpots, { query: "9인" }),
    ...filterDining(diningSpots, { query: "9명" })
  ].map((item) => item.id));
  assert.equal(ninePersonSearchIds.size, 100);
});

test("dining catalog keeps every source link and reservation instruction from JSONL", async () => {
  const raw = [
    ...await readJsonl("./research/dining-restaurants-60.jsonl"),
    ...await readJsonl("./research/dining-cafes-40.jsonl")
  ];
  assert.equal(raw.length, diningSpots.length);
  for (const source of raw) {
    const generated = diningSpots.find((item) => item.id === source.id);
    assert.ok(generated, source.id);
    for (const key of ["rank", "name", "type", "lat", "lng", "officialUrl", "mapsUrl", "reviewSourceUrl", "reservation", "checkedAt"]) {
      assert.deepEqual(generated[key], source[key], `${source.id}: ${key}`);
    }
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

test("closure-sensitive itinerary avoids known weekly conflicts", () => {
  const tuesdayNames = itinerary.filter((day) => day.dow === "화").map((day) => day.title).join(" ");
  const mondayNames = itinerary.filter((day) => day.dow === "월").map((day) => day.title).join(" ");
  assert.doesNotMatch(tuesdayNames, /Topkapı/);
  assert.doesNotMatch(mondayNames, /Dolmabahçe/);
  assert.match(itinerary.find((day) => day.date === "2027-03-26").main, /금요 예배/);
});

test("focused mode adds more Istanbul without changing dates or crossing the city needlessly", () => {
  assert.equal(trip.paceModes.default, "focused");
  const gentle = itineraryForPace("gentle");
  const focused = itineraryForPace("focused");
  assert.deepEqual(focused.map((day) => day.date), gentle.map((day) => day.date));
  assert.equal(focused.length, 12);
  assert.ok(focused.reduce((sum, day) => sum + day.timeline.length, 0) > gentle.reduce((sum, day) => sum + day.timeline.length, 0));
  assert.ok(focused.filter((day) => day.paceLabel === "집중 여행" && day.intensity === 3).length >= 6);
  assert.doesNotMatch(focused.find((day) => day.dow === "화").title, /Topkapı/);
  assert.match(focused.find((day) => day.date === "2027-03-29").title, /Grand Bazaar/);
  for (const day of focused) {
    for (const key of ["parents", "kids", "together", "recovery"]) assert.ok(day.needs[key].length >= 12, `${day.date} ${key}`);
  }
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
  assert.ok(filterPlaces({ query: "사진 금지" }).some((item) => item.id === "dolmabahce"));
  assert.ok(filterPlaces({ zone: "Sultanahmet", rain: true }).every((item) => item.zone === "Sultanahmet" && item.rain));
  assert.ok(filterPlaces({ energy: 1 }).every((item) => item.energy <= 1));
  assert.ok(filterPlaces({ category: "제외" }).every((item) => item.category === "제외"));
});

test("local guide answers high-risk family questions without a server", () => {
  assert.match(localAnswer("9명이 한 집에서 자려면?").answer, /12곳/);
  assert.match(localAnswer("9명이 한 집에서 자려면?").answer, /6,026,212원/);
  assert.match(localAnswer("1인당 예산은?").answer, /ICN 출발은 1인 약 471만원/);
  assert.match(localAnswer("원화 강세면 리라를 미리 살까?").answer, /현지 물가/);
  assert.match(localAnswer("아이랑 갈 카페는?").answer, /카페 40곳/);
  assert.match(localAnswer("비 오면 아이들과 어디 가?").answer, /Basilica Cistern/);
  assert.match(localAnswer("카파도키아도 갈까?").answer, /이번에는 빼는 게 맞/);
  assert.match(localAnswer("Trip.com 실경비는?").answer, /1실 1박 기준/);
  assert.match(localAnswer("Trip.com 실경비는?").answer, /공식 사이트/);
  assert.match(localAnswer("Trip.com 실경비는?").answer, /10박 전체 EUR 6,030/);
  assert.match(localAnswer("Trip.com 실경비는?").answer, /재조회에서는 가격이 반환되지 않았/);
  assert.match(localAnswer("Trip.com 실경비는?").answer, /차액(?:도|은) 계산하지 않았/);
  assert.ok(searchContext("호텔 4실 Trip.com").some((item) => item.kind === "비용"));
  assert.ok(searchContext("호텔 공식 1박").some((item) => item.title.includes("공식 직접 예약")));
  assert.ok(searchContext("Airbnb 9인 10박").some((item) => item.kind === "Airbnb"));
  assert.ok(searchContext("아이 카페").some((item) => item.kind === "카페"));
  assert.ok(searchContext("1인 예산").some((item) => item.kind === "예산"));
  assert.ok(searchContext("Topkapı 화요일").length > 0);
  assert.ok(searchContext("Dolmabahçe 사진 금지").some((item) => item.title.includes("Dolmabahçe")));
  assert.equal(makeAssistantPayload("숙소 추천").question, "숙소 추천");
});

test("CSV, KML, and map points retain all curated places", () => {
  const csv = makeCsv();
  const kml = makeKml();
  assert.equal(csv.split("\n").length, places.length + 1);
  assert.match(csv, /아야 소피아/);
  assert.match(csv, /치야 소프라스/);
  assert.match(kml, /<kml xmlns=/);
  assert.equal((kml.match(/<Placemark>/g) || []).length, places.length);
  const points = buildMapPoints();
  assert.equal(points.length, places.length);
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
  const focused = itineraryForPace("focused");
  const focusedIcs = makeIcs(focused);
  assert.match(focusedIcs, /여행 모드: 집중 여행/);
  assert.match(focusedIcs, /구시가지 대표 장면 네 개/);
  assert.equal((focusedIcs.match(/BEGIN:VEVENT/g) || []).length, focused.length);
  assert.ok(distanceKm({ lat: 41.0086, lng: 28.9802 }, { lat: 41.0367, lng: 28.9864 }) > 2);
});
