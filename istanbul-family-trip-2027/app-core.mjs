import { climate, familyGroups, itinerary, lodgingOptions, mealSuggestions, places, rentalChecklist, sources, trip } from "./trip-data.mjs";

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
    return normalize([item.name, item.zone, item.category, item.why, item.warning].join(" ")).includes(query);
  });
}

function searchableRecords() {
  const dayRecords = itinerary.map((day) => ({
    kind: "일정",
    title: `${day.date.slice(5).replace("-", "/")} ${day.title}`,
    subtitle: `${day.zone}, 강도 ${day.intensity}`,
    body: `${day.main} ${day.timeline.join(" ")} 비: ${day.rain} 저강도: ${day.low} 식사: ${mealSuggestions[day.date] || "미정"} ${day.notes}`,
    url: `#day-${day.date}`
  }));
  const placeRecords = places.map((item) => ({
    kind: item.category,
    title: item.name,
    subtitle: `${item.zone}, ${item.duration}, 에너지 ${item.energy}`,
    body: `${item.why} 주의: ${item.warning}`,
    url: item.official
  }));
  const lodgingRecords = lodgingOptions.map((item) => ({
    kind: "숙소",
    title: item.name,
    subtitle: `${item.type}, 적합도 ${item.fit}`,
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
  return [...dayRecords, ...placeRecords, ...lodgingRecords, ...flightRecords];
}

export function searchContext(question, limit = 6) {
  const input = normalize(question);
  const tokens = String(question || "").toLocaleLowerCase("ko-KR").split(/[\s,?!.]+/).map(normalize).filter((token) => token.length >= 2);
  return searchableRecords()
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
    terms: ["비", "우천", "날씨"],
    answer: "비가 오면 장거리 이동을 추가하지 말고 Basilica Cistern, Istanbul Modern, Rahmi M. Koç Museum 중 숙소와 가까운 한 곳만 고르세요. 강풍이면 Bosphorus 보트는 취소하는 편이 맞습니다."
  },
  {
    terms: ["숙소", "호텔", "에어비앤비", "airbnb", "한집"],
    answer: "1순위는 CVK Park Bosphorus의 4 Bedroom Residence입니다. 공식 정원 9명, 침실과 욕실 각 4개, 거실과 주방이 있어 한 집 선호를 가장 정확히 충족합니다. 재고, 침대 구성, 어린이 추가 침대는 직접 서면 확약해야 합니다."
  },
  {
    terms: ["피곤", "힘들", "쉬", "낮잠"],
    answer: "일정을 줄이세요. 이 여행의 기본 단위는 오전 1곳, 점심, 숙소 복귀입니다. 당일 컨디션이 낮으면 각 날짜 카드의 저강도안을 선택하고, 이미 예약한 곳도 취소할 수 있어야 합니다."
  },
  {
    terms: ["아이", "어린이", "6살", "7살", "9살"],
    answer: "아이 기준으로는 지하 궁전인 Basilica Cistern과 탈것 전시가 많은 Rahmi M. Koç Museum이 강합니다. 궁전은 2시간 30분을 넘기지 말고, 식당은 연령 제한과 어린이 의자를 예약 전에 확인하세요."
  },
  {
    terms: ["식당", "밥", "점심", "저녁", "맛집"],
    answer: "9명이 함께 먹는 식사는 전망보다 이동과 어린이 정책을 먼저 보세요. Pandeli, Hamdi Eminönü, Namlı Gurme를 우선 후보로 두고 9인 한 테이블과 어린이 의자를 직접 확인하세요. Karaköy Lokantası 저녁과 Lokanta 1741은 연령 및 인원 정책 때문에 이번 그룹에서는 제외입니다."
  },
  {
    terms: ["비행", "항공", "직항", "공항"],
    answer: "두 팀의 도착 시간을 억지로 맞추지 말고 각각 직항과 개별 공항 픽업을 잡는 편이 낫습니다. ICN팀은 21일 아침 도착, LAX팀은 21일 낮 도착을 목표로 하되 2027년 운항표가 열린 뒤 최종 확정하세요."
  },
  {
    terms: ["카파도키아", "근교", "다른도시"],
    answer: "이번 조건에서는 추가하지 않는 편이 맞습니다. 공항 이동, 국내선, 숙소 변경, 이른 벌룬 시간, 3월 기상 변수가 저강도 원칙과 충돌합니다. 이스탄불 10박도 휴식일과 날씨 버퍼를 넣으면 길지 않습니다."
  }
];

export function localAnswer(question) {
  const normalized = normalize(question);
  const rule = questionRules.find((candidate) => candidate.terms.some((term) => normalized.includes(normalize(term))));
  const context = searchContext(question);
  const defaultAnswer = context.length
    ? `가장 가까운 앱 자료는 “${context[0].title}”입니다. ${context[0].body}`
    : "앱 자료에서 직접 일치하는 항목을 찾지 못했습니다. 날짜, 장소, 숙소, 식당, 비 오는 날처럼 질문을 조금 더 구체적으로 적어 주세요.";
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

export function buildMapPoints(items = places, width = 1000, height = 560) {
  const usable = items.filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng) && item.lat < 41.09);
  const bounds = { west: 28.93, east: 29.07, south: 40.98, north: 41.06 };
  return usable.map((item) => ({
    ...item,
    x: Math.max(28, Math.min(width - 28, ((item.lng - bounds.west) / (bounds.east - bounds.west)) * width)),
    y: Math.max(28, Math.min(height - 28, height - ((item.lat - bounds.south) / (bounds.north - bounds.south)) * height))
  }));
}

export function makeAssistantPayload(question) {
  return { question: String(question || "").trim(), context: searchContext(question) };
}

export const coreData = { climate, itinerary, lodgingOptions, mealSuggestions, places, rentalChecklist, sources, trip };
