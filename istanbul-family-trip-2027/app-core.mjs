import { CHECKED_AT, climate, familyGroups, itinerary, lodgingOptions, mealSuggestions, observedTripComQuotes, places, rentalChecklist, sources, trip, tripComCostSummary } from "./trip-data.mjs";

const DAY_MS = 86400000;

export function dateKey(date = new Date(), timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Seoul") {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function daysBetween(fromKey, toKey) {
  const from = Date.parse(`${fromKey}T12:00:00Z`);
  const to = Date.parse(`${toKey}T12:00:00Z`);
  return Math.round((to - from) / DAY_MS);
}

export function tripStatus(now = new Date()) {
  const today = dateKey(now);
  const untilStart = daysBetween(today, trip.startDate);
  const afterEnd = daysBetween(trip.checkoutDate, today);
  const currentDay = itinerary.find((day) => day.date === today);
  if (untilStart > 0) return { mode: "planning", label: `D-${untilStart}`, today, day: itinerary[0] };
  if (afterEnd > 0) return { mode: "complete", label: "여행 완료", today, day: itinerary.at(-1) };
  return { mode: "travel", label: currentDay ? `${currentDay.date.slice(5).replace("-", "/")} 오늘` : "이동 중", today, day: currentDay || itinerary[0] };
}

export function weatherMode(now = new Date()) {
  const today = dateKey(now);
  const untilArrival = daysBetween(today, trip.arrivalDate);
  if (untilArrival > 16) return { live: false, reason: "실시간 예보는 출발 16일 전부터 확인합니다.", untilArrival };
  if (untilArrival < -12) return { live: false, reason: "여행 기간이 지났습니다.", untilArrival };
  return { live: true, reason: "Open-Meteo 일별 예보를 불러올 수 있는 기간입니다.", untilArrival };
}

function normalize(value) {
  return String(value || "").toLocaleLowerCase("ko-KR").replace(/[\s\u00b7,./()\-]+/g, "");
}

export function filterPlaces(filters = {}) {
  const query = normalize(filters.query);
  return places.filter((item) => {
    if (filters.zone && filters.zone !== "all" && item.zone !== filters.zone) return false;
    if (filters.category && filters.category !== "all" && item.category !== filters.category) return false;
    if (filters.rain === true && !item.rain) return false;
    if (filters.energy && Number(item.energy) > Number(filters.energy)) return false;
    if (!query) return true;
    return normalize([
      item.name,
      item.zone,
      item.category,
      item.why,
      item.warning,
      item.bestFor,
      item.skipIf,
      item.kids,
      item.reviews?.summary,
      ...(item.reviews?.liked || []),
      ...(item.reviews?.disliked || [])
    ].join(" ")).includes(query);
  });
}

export function itineraryForPace(pace = trip.paceModes?.default || "gentle", days = itinerary) {
  const label = trip.paceModes?.options?.find((option) => option.id === pace)?.label || "기본";
  return days.map((day) => {
    const variant = day.variants?.[pace] || {};
    return {
      ...day,
      ...variant,
      needs: { ...day.needs, ...(variant.needs || {}) },
      paceId: pace,
      paceLabel: label
    };
  });
}

export function compareHotelPrices(quote) {
  const direct = quote?.officialDirect;
  if (!direct || direct.status !== "observed_exact" || !Number.isFinite(direct.nightlyValue) || !Number.isFinite(direct.projectedValue)) {
    return {
      status: "official_unavailable",
      label: "공식 가격 확인 필요",
      reason: direct?.inventoryNote || "호텔 공식 예약 사이트에서 같은 조건의 가격을 확인하지 못했습니다."
    };
  }

  const sameConditions = quote.comparisonKey === direct.comparisonKey
    && quote.currency === direct.currency
    && quote.totalIncludesTaxes !== null
    && quote.totalIncludesTaxes === direct.totalIncludesTaxes;
  if (!sameConditions) {
    return {
      status: "not_comparable",
      label: "조건이 달라 차액 계산 안 함",
      reason: "숙박 날짜, 객실 상품, 투숙 인원 또는 세금 포함 조건이 일치하지 않습니다."
    };
  }

  const nightlyDelta = quote.nightlyValue - direct.nightlyValue;
  const projectedDelta = quote.projectedValue - direct.projectedValue;
  const percent = direct.nightlyValue === 0 ? null : (nightlyDelta / direct.nightlyValue) * 100;
  return {
    status: "comparable",
    label: nightlyDelta === 0 ? "동일 조건, 같은 가격" : nightlyDelta < 0 ? "동일 조건, Trip.com이 낮음" : "동일 조건, 공식가가 낮음",
    reason: "날짜, 객실, 인원, 통화와 세금 포함 조건이 일치합니다.",
    nightlyDelta,
    projectedDelta,
    percent
  };
}

function searchableRecords(days = itinerary) {
  const dayRecords = days.map((day) => ({
    kind: "일정",
    title: `${day.date.slice(5).replace("-", "/")} ${day.title}`,
    subtitle: `${day.zone}, 강도 ${day.intensity}`,
    body: `${day.main} ${day.timeline.join(" ")} 부모: ${day.needs.parents} 아이: ${day.needs.kids} 함께: ${day.needs.together} 회복: ${day.needs.recovery} 비 오면: ${day.rain} 힘들면: ${day.low} 식사: ${mealSuggestions[day.date] || "미정"} ${day.notes}`,
    url: `#day-${day.date}`
  }));
  const placeRecords = places.map((item) => ({
    kind: item.category,
    title: item.name,
    subtitle: `${item.zone}, ${item.duration}, 에너지 ${item.energy}`,
    body: `${item.why} 우리 가족에게: ${item.bestFor}. 아이 셋이면: ${item.kids}. 이럴 땐 빼요: ${item.skipIf}. 후기: ${item.reviews?.summary || ""} 좋았다는 점: ${(item.reviews?.liked || []).join(" ")} 아쉽다는 점: ${(item.reviews?.disliked || []).join(" ")} 예약 전 확인: ${item.warning}`,
    url: item.official
  }));
  const lodgingRecords = lodgingOptions.map((item) => ({
    kind: "숙소",
    title: item.name,
    subtitle: `${item.type}, 가족 조건 ${item.fit}`,
    body: `${item.verdict}. ${item.capacity}. ${item.layout}. 장점: ${item.good.join(" ")} 주의: ${item.cautions.join(" ")}`,
    url: item.official
  }));
  const flightRecords = familyGroups.map((item) => ({
    kind: "항공",
    title: `${item.label} ${item.route}`,
    subtitle: item.members,
    body: `${item.target}. ${item.carriers}. ${item.status}`,
    url: sources.find((source) => source.title.includes(item.origin === "ICN" ? "Seoul" : "LAX"))?.url || ""
  }));
  const quoteRecords = observedTripComQuotes.flatMap((quote) => {
    const name = lodgingOptions.find((item) => item.id === quote.lodgingId)?.name || quote.lodgingId;
    const comparison = compareHotelPrices(quote);
    const direct = quote.officialDirect;
    return [
      {
        kind: "비용",
        title: `${name} Trip.com 참고가`,
        subtitle: `${quote.unitLabel} ${quote.nightlyDisplay}, ${quote.stayLabel} ${quote.projectedDisplay}`,
        body: `${quote.referenceStay}, ${quote.occupancy}. ${quote.inventoryNote}. 관측일 ${quote.capturedAt}. ${comparison.label}.`,
        url: quote.sourceUrl
      },
      {
        kind: "비용",
        title: `${name} 호텔 공식 직접 예약`,
        subtitle: `${direct.unitLabel} ${direct.nightlyDisplay}, ${direct.stayLabel} ${direct.projectedDisplay}`,
        body: `${direct.referenceStay}, ${direct.occupancy}. ${direct.inventoryNote}. 관측일 ${direct.capturedAt}. ${comparison.label}.`,
        url: direct.sourceUrl
      }
    ];
  });
  const benchmarkRecord = {
    kind: "비용",
    title: tripComCostSummary.benchmarkLabel,
    subtitle: `${tripComCostSummary.benchmarkNightly}, 4실 10박 ${tripComCostSummary.benchmarkTotal}`,
    body: `${tripComCostSummary.benchmarkFormula}. ${tripComCostSummary.exactQuoteStatus}`,
    url: tripComCostSummary.sourceUrl
  };
  return [...dayRecords, ...placeRecords, ...lodgingRecords, ...quoteRecords, benchmarkRecord, ...flightRecords];
}

export function searchContext(question, limit = 6, days = itinerary) {
  const input = normalize(question);
  const tokens = String(question || "").toLocaleLowerCase("ko-KR").split(/[\s,?!.]+/).map(normalize).filter((token) => token.length >= 2);
  return searchableRecords(days)
    .map((record) => {
      const haystack = normalize([record.kind, record.title, record.subtitle, record.body].join(" "));
      let score = input && haystack.includes(input) ? 8 : 0;
      for (const token of tokens) {
        if (normalize(record.title).includes(token)) score += 5;
        else if (normalize(record.subtitle).includes(token)) score += 3;
        else if (haystack.includes(token)) score += 1;
      }
      return { ...record, score };
    })
    .filter((record) => record.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score, ...record }) => record);
}

function hotelPriceAnswer() {
  const quoteById = (id) => observedTripComQuotes.find((quote) => quote.lodgingId === id);
  const swissotel = quoteById("swissotel");
  const cvk = quoteById("cvk");
  const ritz = quoteById("ritz");
  return `1박 기준으로 Trip.com 참고가는 Swissotel ${swissotel.nightlyDisplay}, CVK ${cvk.nightlyDisplay}, Ritz-Carlton ${ritz.nightlyDisplay}입니다. 다만 2026년의 다른 날짜에서 본 일반 객실 시작가입니다. 호텔 공식 사이트의 2027년 3월 21일부터 31일 재현 가능한 가격은 Swissotel Classic Garden 1실 일반가 ${swissotel.officialDirect.nightlyDisplay}, ALL 회원가 ${swissotel.officialDirect.memberRate.nightlyDisplay}입니다. CVK 4베드룸은 ${cvk.officialDirect.nightlyDisplay}이 한 번 보였지만 재조회에서 가격이 반환되지 않아 확정가로 쓰지 않았습니다. 날짜, 객실 상품과 세금 조건이 달라 Trip.com과의 차액도 계산하지 않았습니다.`;
}

const questionRules = [
  {
    terms: ["비오", "비가", "우천", "날씨"],
    answer: "비가 오면 멀리 가지 말고 Basilica Cistern, Istanbul Modern, Rahmi M. Koç Museum 중 숙소에서 가까운 한 곳만 가요. 바람까지 세면 Bosphorus 보트는 미루는 게 낫습니다."
  },
  {
    terms: ["트립닷컴", "trip.com", "가격", "비용", "경비", "예산"],
    answer: hotelPriceAnswer()
  },
  {
    terms: ["숙소", "호텔", "에어비앤비", "airbnb", "한집"],
    answer: "한 집으로 묵으려면 CVK Park Bosphorus 4 Bedroom Residence가 1순위예요. 호텔식이면 The Peninsula, Swissotel, Ritz-Carlton의 객실 4실을 같은 층 또는 연결 조합으로 요청하세요. Trip.com에는 아직 2027년 동일 조건의 확정 총액이 없으니, 공개 시작가는 비교선으로만 보고 호텔의 서면 배정 답변까지 받아야 합니다."
  },
  {
    terms: ["피곤", "힘들", "쉬", "낮잠"],
    answer: "그날은 한 군데만 가요. 오전에 보고 점심을 먹은 뒤 숙소로 돌아오면 됩니다. 아이들이 지치면 날짜 카드의 ‘힘들면’ 일정으로 바꾸고, 예약했더라도 무리해서 가지 않아요."
  },
  {
    terms: ["아이", "어린이", "6살", "7살", "9살"],
    answer: "아이 셋 반응을 생각하면 Basilica Cistern과 탈것이 많은 Rahmi M. Koç Museum부터 보세요. 궁전은 2시간 30분 안에 끝내고, 식당은 아이 입장 나이와 어린이 의자를 예약할 때 같이 물어보면 됩니다."
  },
  {
    terms: ["식당", "밥", "점심", "저녁", "맛집"],
    answer: "아홉 명 식사는 전망보다 한 테이블에 앉을 수 있는지부터 봐야 해요. Pandeli, Hamdi Eminönü, Namlı Gurme에 9인 자리와 어린이 의자를 먼저 물어보세요. Karaköy Lokantası 저녁과 Lokanta 1741은 아이 나이와 인원 제한 때문에 이번에는 빼는 게 맞습니다."
  },
  {
    terms: ["비행", "항공", "직항", "공항"],
    answer: "두 팀 도착 시간을 억지로 맞추지 마세요. 각각 직항을 고르고 공항 차도 따로 잡는 편이 편합니다. ICN팀은 21일 아침, LAX팀은 21일 낮 도착을 찾아보되 정확한 시간은 2027년 항공편이 열린 뒤 정하면 됩니다."
  },
  {
    terms: ["카파도키아", "근교", "다른도시"],
    answer: "카파도키아는 이번에는 빼는 게 맞습니다. 공항을 다시 가고 숙소를 옮긴 뒤 새벽 벌룬까지 타면 아이 셋에게 너무 빡빡해요. 이스탄불 10박도 쉬는 날과 비 오는 날을 남겨 두면 길지 않습니다."
  }
];

export function localAnswer(question, days = itinerary) {
  const normalized = normalize(question);
  const rule = questionRules.find((candidate) => candidate.terms.some((term) => normalized.includes(normalize(term))));
  const context = searchContext(question, 6, days);
  const defaultAnswer = context.length
    ? `이 내용부터 보세요: “${context[0].title}”. ${context[0].body}`
    : "바로 맞는 내용을 못 찾았어요. 날짜나 장소 이름을 넣어 다시 물어봐 주세요. 예: ‘3월 24일 비 오면 어디 가?’";
  return {
    answer: rule?.answer || defaultAnswer,
    provider: "앱 내장 가이드",
    sources: context.filter((item) => /^https?:\/\//.test(item.url)).slice(0, 3).map((item) => ({ title: item.title, url: item.url })),
    context
  };
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function makeCsv(items = places) {
  const columns = ["name", "zone", "category", "latitude", "longitude", "duration", "energy", "rain_ready", "why", "warning", "official", "maps", "checked_at"];
  const rows = items.map((item) => [item.name, item.zone, item.category, item.lat, item.lng, item.duration, item.energy, item.rain ? "yes" : "no", item.why, item.warning, item.official, item.maps, item.checkedAt]);
  return [columns, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}

function xmlEscape(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

export function makeKml(items = places) {
  const marks = items.map((item) => `    <Placemark>
      <name>${xmlEscape(item.name)}</name>
      <description>${xmlEscape(`${item.zone} | ${item.category} | ${item.why} | 주의: ${item.warning}`)}</description>
      <Point><coordinates>${item.lng},${item.lat},0</coordinates></Point>
    </Placemark>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${xmlEscape(trip.title)}</name>
${marks}
  </Document>
</kml>`;
}

export function distanceKm(from, to) {
  const radians = (degrees) => (Number(degrees) * Math.PI) / 180;
  const lat1 = radians(from?.lat);
  const lat2 = radians(to?.lat);
  const deltaLat = radians(Number(to?.lat) - Number(from?.lat));
  const deltaLng = radians(Number(to?.lng) - Number(from?.lng));
  const value = Math.sin(deltaLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function compactDate(dateKey) {
  return String(dateKey || "").replaceAll("-", "");
}

function nextDate(dateKey) {
  const date = new Date(`${dateKey}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

function dayPlanText(day) {
  const pace = day.paceLabel ? `여행 모드: ${day.paceLabel}\n\n` : "";
  return `${pace}${day.main}\n\n왜 이날 하나요: ${day.whyNow || "가족의 이동과 휴식 리듬에 맞춘 일정입니다."}\n\n부모가 기대할 것: ${day.needs.parents}\n아이들이 기다릴 것: ${day.needs.kids}\n같이 남길 장면: ${day.needs.together}\n오후 회복: ${day.needs.recovery}\n\n시간표:\n${day.timeline.map((item) => `- ${item}`).join("\n")}\n\n비 오면: ${day.rain}\n힘들면: ${day.low}\n식사: ${mealSuggestions[day.date] || "당일 확인"}`;
}

export function makeGoogleCalendarUrl(day) {
  const query = new URLSearchParams({
    action: "TEMPLATE",
    text: `${trip.destination} 가족여행, ${day.title}`,
    dates: `${compactDate(day.date)}/${compactDate(nextDate(day.date))}`,
    details: dayPlanText(day),
    location: day.zone
  });
  return `https://calendar.google.com/calendar/render?${query.toString()}`;
}

function icsText(value) {
  return String(value || "")
    .replaceAll("\\", "\\\\")
    .replaceAll("\n", "\\n")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;");
}

export function makeIcs(days = itinerary) {
  const events = days.map((day) => [
    "BEGIN:VEVENT",
    `UID:${day.date}-${trip.destination.toLocaleLowerCase("en-US")}@family-trip.local`,
    `DTSTAMP:${compactDate(CHECKED_AT)}T000000Z`,
    `DTSTART;VALUE=DATE:${compactDate(day.date)}`,
    `DTEND;VALUE=DATE:${compactDate(nextDate(day.date))}`,
    `SUMMARY:${icsText(`${trip.destination} 가족여행, ${day.title}`)}`,
    `LOCATION:${icsText(day.zone)}`,
    `DESCRIPTION:${icsText(dayPlanText(day))}`,
    "END:VEVENT"
  ].join("\r\n")).join("\r\n");
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Family Trip 2027//KO", "CALSCALE:GREGORIAN", events, "END:VCALENDAR", ""].join("\r\n");
}

export function buildMapPoints(items = places, width = 1000, height = 560) {
  const usable = items.filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng) && item.lat < 41.09);
  const bounds = { west: 28.93, east: 29.07, south: 40.98, north: 41.06 };
  return usable.map((item) => ({
    ...item,
    x: Math.max(28, Math.min(width - 28, ((item.lng - bounds.west) / (bounds.east - bounds.west)) * width)),
    y: Math.max(28, Math.min(height - 28, height - ((item.lat - bounds.south) / (bounds.north - bounds.south)) * height))
  }));
}

export function makeAssistantPayload(question, days = itinerary) {
  return { question: String(question || "").trim(), context: searchContext(question, 6, days) };
}

export const coreData = { climate, itinerary, lodgingOptions, mealSuggestions, observedTripComQuotes, places, rentalChecklist, sources, trip, tripComCostSummary };
