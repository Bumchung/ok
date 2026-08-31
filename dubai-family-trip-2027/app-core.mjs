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
    return { ...day, ...variant, needs: { ...day.needs, ...(variant.needs || {}) }, paceId: pace, paceLabel: label };
  });
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
  const quoteRecords = observedTripComQuotes.map((quote) => ({
    kind: "비용",
    title: `${lodgingOptions.find((item) => item.id === quote.lodgingId)?.name || quote.lodgingId} Trip.com ${quote.status === "observed_exact" ? "실견적" : "참고가"}`,
    subtitle: `${quote.nightlyDisplay}, 10박 총액 ${quote.projectedDisplay}`,
    body: `${quote.referenceStay}, ${quote.occupancy}. ${quote.roomPlan}. ${quote.inventoryNote}.`,
    url: quote.sourceUrl
  }));
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

const questionRules = [
  {
    terms: ["비오", "비가", "우천", "날씨"],
    answer: "두바이는 비보다 센 바람과 한낮 더위를 먼저 봐야 해요. 바람이 세면 Aquaventure와 abra는 미루고, Museum of the Future, Dubai Aquarium, Green Planet 중 숙소에서 가까운 한 곳만 갑니다."
  },
  {
    terms: ["트립닷컴", "trip.com", "가격", "비용", "경비", "예산"],
    answer: "2027년 3월 21일부터 31일까지 성인 6명과 아이 3명을 넣은 Trip.com 세금 포함 총액은 한집형 Zabeel Saray 5베드룸 빌라 US$42,151, 호텔 4실형 Mandarin Oriental US$44,344, Jumeirah Beach Hotel US$47,177 순입니다. Marsa Al Arab은 US$89,066로 가장 비쌉니다. 무료 취소 마감일과 결제 시점, 연결 객실은 결제 전에 다시 확인해야 해요."
  },
  {
    terms: ["숙소", "호텔", "에어비앤비", "airbnb", "한집"],
    answer: "아홉 명이 한집에 묵으려면 Jumeirah Zabeel Saray Five Bedroom Pool Royal Villa가 현재 1순위예요. Trip.com 10박 세금 포함 총액은 US$42,151입니다. 호텔 4실을 원하면 Mandarin Oriental US$44,344 또는 Jumeirah Beach Hotel US$47,177부터 보고, 같은 층과 연결 객실은 호텔에 서면 요청하세요."
  },
  {
    terms: ["피곤", "힘들", "쉬", "낮잠"],
    answer: "그날은 한 군데만 가요. 오전에 보고 점심을 먹은 뒤 숙소로 돌아오면 됩니다. 아이들이 지치면 날짜 카드의 ‘힘들면’ 일정으로 바꾸고, 예약했더라도 무리해서 가지 않아요."
  },
  {
    terms: ["아이", "어린이", "6살", "7살", "9살"],
    answer: "아이 셋이 가장 좋아할 곳은 Aquaventure예요. 바람이 세거나 키 제한 때문에 못 타는 시설이 많으면 Lost World Aquarium이나 Museum of the Future로 바꿉니다. 워터파크는 하루 종일 버티지 말고 15시 전에 나와요."
  },
  {
    terms: ["식당", "밥", "점심", "저녁", "맛집"],
    answer: "쉬는 날 저녁은 리조트 안에서 먹는 게 편해요. 밖에 나가는 날은 Museum of the Future, Dubai Mall, Madinat 근처 식당 한 곳만 9인으로 예약하고, 숙소에 돌아온 뒤 다시 저녁을 먹으러 나오지는 않아요."
  },
  {
    terms: ["비행", "항공", "직항", "공항"],
    answer: "두 팀 모두 지금은 Emirates 직항이 있지만 2027년 시간표는 아직 확정할 수 없어요. 도착 시각을 맞추느라 불편한 편을 고르지 말고, DXB에서 팀별 차를 따로 타고 숙소로 들어가면 됩니다."
  },
  {
    terms: ["사막", "사파리", "아부다비", "근교", "다른도시"],
    answer: "사막 사파리와 Abu Dhabi는 이번에는 빼는 게 맞습니다. 차를 오래 타고 모래길을 달린 뒤 늦게 돌아오면 아이 셋이 너무 힘들어요. 꼭 가고 싶다면 다른 날을 비우고, 거친 dune bashing 없는 전용차부터 찾아야 합니다."
  }
];

export function localAnswer(question, days = itinerary) {
  const normalized = normalize(question);
  const rule = questionRules.find((candidate) => candidate.terms.some((term) => normalized.includes(normalize(term))));
  const context = searchContext(question, 6, days);
  const defaultAnswer = context.length
    ? `이 내용부터 보세요: “${context[0].title}”. ${context[0].body}`
    : "바로 맞는 내용을 못 찾았어요. 날짜나 장소 이름을 넣어 다시 물어봐 주세요. 예: ‘3월 29일 바람이 세면 어디 가?’";
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
  const pace = day.paceLabel && day.paceLabel !== "기본" ? `여행 모드: ${day.paceLabel}\n\n` : "";
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
  const usable = items.filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng) && item.lng < 55.36);
  const bounds = { west: 55.08, east: 55.32, south: 25.06, north: 25.30 };
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
