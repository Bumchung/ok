import {
  CHECKED_AT,
  airbnbSearch,
  budgetModel,
  climate,
  diningSpots,
  familyGroups,
  fxStrategy,
  itinerary,
  lodgingOptions,
  mealSuggestions,
  observedTripComQuotes,
  places,
  rentalChecklist,
  sources,
  trip,
  tripComCostSummary
} from "./trip-data.mjs";

const DAY_MS = 86_400_000;

function list(value) {
  return Array.isArray(value) ? value : [];
}

function text(value) {
  return String(value ?? "");
}

function finiteMoney(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export function dateKey(
  date = new Date(),
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Seoul"
) {
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
  return {
    mode: "travel",
    label: currentDay ? `${currentDay.date.slice(5).replace("-", "/")} 오늘` : "이동 중",
    today,
    day: currentDay || itinerary[0]
  };
}

export function weatherMode(now = new Date()) {
  const today = dateKey(now);
  const untilArrival = daysBetween(today, trip.arrivalDate);
  if (untilArrival > 16) {
    return { live: false, reason: "실시간 예보는 카파도키아 출발 16일 전부터 확인합니다.", untilArrival };
  }
  if (untilArrival < -7) {
    return { live: false, reason: "카파도키아 체류 기간이 지났습니다.", untilArrival };
  }
  return { live: true, reason: "Open-Meteo 일별 예보를 불러올 수 있는 기간입니다.", untilArrival };
}

function normalize(value) {
  return text(value).toLocaleLowerCase("ko-KR").replace(/[\s\u00b7,./()\-]+/g, "");
}

export function filterPlaces(filters = {}, items = places) {
  const query = normalize(filters.query);
  return list(items).filter((item) => {
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
      item.status,
      item.reviews?.summary,
      ...list(item.reviews?.liked),
      ...list(item.reviews?.disliked)
    ].join(" ")).includes(query);
  });
}

export function filterDining(items = diningSpots, filters = {}) {
  const query = normalize(filters.query);
  return list(items).filter((item) => {
    if (filters.zone && filters.zone !== "all" && item.zone !== filters.zone) return false;
    if (filters.type && filters.type !== "all" && item.type !== filters.type) return false;
    if (filters.kidOnly === true && !/^(?:상|높음|매우 높음|매우 좋음)/.test(text(item.kidFit))) return false;
    if (!query) return true;
    return normalize([
      item.name,
      item.zone,
      item.neighborhood,
      item.cuisine,
      item.reservation,
      item.priceBand,
      item.kidFit,
      item.meal,
      item.why,
      item.reviewCaution,
      ...list(item.reviewPros)
    ].join(" ")).includes(query);
  });
}

export function calculateBudget(selection = {}, model = budgetModel) {
  const stays = list(model?.stayOptions);
  const origins = list(model?.origins);
  const stay = stays.find((item) => item.id === selection.stayId)
    || stays.find((item) => item.id === model?.defaultStay)
    || stays[0];
  const origin = origins.find((item) => item.id === selection.originId)
    || origins.find((item) => item.id === model?.defaultOrigin)
    || origins[0];
  if (!stay || !origin) throw new Error("Budget model requires at least one stay and flight scenario.");

  const people = Number(model.people) || trip.adults + list(trip.children).length;
  const sharedBeforeBuffer = list(model.sharedLines).reduce((sum, item) => sum + finiteMoney(item.familyTotal), 0);
  const beforeBuffer = finiteMoney(stay.familyTotal) + sharedBeforeBuffer;
  const contingency = Math.round(beforeBuffer * (Number(model.contingencyRate) || 0));
  const landFamilyTotal = beforeBuffer + contingency;
  const landPerPerson = landFamilyTotal / people;
  const flightPerPerson = finiteMoney(origin.flightPerPerson);
  const allFlights = origins.reduce((sum, item) => sum + finiteMoney(item.people) * finiteMoney(item.flightPerPerson), 0);
  const mixedOriginFamilyTotal = landFamilyTotal + allFlights;

  return {
    stay,
    origin,
    sharedBeforeBuffer,
    beforeBuffer,
    contingency,
    landFamilyTotal,
    landPerPerson,
    flightPerPerson,
    perPersonTotal: landPerPerson + flightPerPerson,
    mixedOriginFamilyTotal,
    mixedOriginAveragePerPerson: mixedOriginFamilyTotal / people
  };
}

export function itineraryForPace(pace = trip.paceModes?.default || "gentle", days = itinerary) {
  const label = trip.paceModes?.options?.find((option) => option.id === pace)?.label || "기본";
  return list(days).map((day) => {
    const variant = day.variants?.[pace] || {};
    return {
      ...day,
      ...variant,
      needs: { ...(day.needs || {}), ...(variant.needs || {}) },
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
      label: "2027년 공식 가격 확인 필요",
      reason: direct?.inventoryNote || "호텔 공식 예약 사이트에서 목표 날짜와 같은 조건의 가격을 확인하지 못했습니다."
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
      reason: "숙박 날짜, 객실 상품, 투숙 인원, 통화 또는 세금 포함 조건이 일치하지 않습니다."
    };
  }

  const nightlyDelta = quote.nightlyValue - direct.nightlyValue;
  const projectedDelta = quote.projectedValue - direct.projectedValue;
  return {
    status: "comparable",
    label: nightlyDelta === 0 ? "동일 조건, 같은 가격" : nightlyDelta < 0 ? "동일 조건, Trip.com이 낮음" : "동일 조건, 공식가가 낮음",
    reason: "날짜, 객실, 인원, 통화와 세금 포함 조건이 일치합니다.",
    nightlyDelta,
    projectedDelta,
    percent: direct.nightlyValue === 0 ? null : (nightlyDelta / direct.nightlyValue) * 100
  };
}

function searchableRecords(days = itinerary) {
  const dayRecords = list(days).map((day) => ({
    kind: "일정",
    title: `${day.date.slice(5).replace("-", "/")} ${day.title}`,
    subtitle: `${day.zone}, 체력 ${day.intensity}`,
    body: [
      day.main,
      ...list(day.timeline),
      `부모: ${day.needs?.parents || ""}`,
      `아이: ${day.needs?.kids || ""}`,
      `함께: ${day.needs?.together || ""}`,
      `회복: ${day.needs?.recovery || ""}`,
      `비 오면: ${day.rain || ""}`,
      `힘들면: ${day.low || ""}`,
      `식사: ${mealSuggestions[day.date] || "미정"}`,
      day.notes
    ].join(" "),
    url: `#day-${day.date}`
  }));

  const placeRecords = places.map((item) => ({
    kind: item.category,
    title: item.name,
    subtitle: `${item.zone}, ${item.duration}, 에너지 ${item.energy}`,
    body: `${item.why} 우리 가족에게: ${item.bestFor}. 아이 셋이면: ${item.kids}. 이럴 땐 빼요: ${item.skipIf}. 후기 근거: ${item.reviews?.summary || "없음"}. 예약 전 확인: ${item.warning}`,
    url: item.official
  }));

  const lodgingRecords = lodgingOptions.map((item) => ({
    kind: "호텔",
    title: item.name,
    subtitle: `${item.type}, 가족 적합 ${item.fit}`,
    body: `${item.verdict}. ${item.capacity}. ${item.layout}. 장점: ${list(item.good).join(" ")} 주의: ${list(item.cautions).join(" ")}`,
    url: item.official
  }));

  const residenceRecords = list(airbnbSearch?.options).map((item) => ({
    kind: "레지던스",
    title: item.name,
    subtitle: `${item.neighborhood}, ${item.availability === "available_exact" ? item.price : "2027년 가격 확인 전"}`,
    body: `침실 ${item.bedrooms}, 욕실 ${item.baths}, 침대 ${item.beds}. 장점: ${item.reason}. 약점: ${item.caution}. 가격 근거: ${item.priceEvidence}. 취소: ${item.cancellation}`,
    url: item.url
  }));

  const diningRecords = diningSpots.map((item) => ({
    kind: item.type === "restaurant" ? "음식점" : "카페",
    title: item.name,
    subtitle: `${item.zone}, ${item.neighborhood}, ${item.cuisine}, 아이 ${item.kidFit}`,
    body: `${item.why} 근거: ${list(item.reviewPros).join(" ")} 주의: ${item.reviewCaution} 9인 예약: ${item.reservation}`,
    url: item.officialUrl
  }));

  const budgetRecords = list(budgetModel?.stayOptions).map((item) => {
    const result = calculateBudget({ stayId: item.id, originId: budgetModel.defaultOrigin });
    return {
      kind: "예산",
      title: item.label,
      subtitle: `가족 숙박 계획값 ${finiteMoney(item.familyTotal).toLocaleString("ko-KR")}원`,
      body: `${item.note} 카파도키아 추가 가족 총액 ${Math.round(result.landFamilyTotal).toLocaleString("ko-KR")}원, 국내선 포함 전체 추가액 ${Math.round(result.mixedOriginFamilyTotal).toLocaleString("ko-KR")}원. 선택 열기구는 제외된 계획값이며 실시간 결제 견적이 아닙니다.`,
      url: "#budget"
    };
  });

  const fxRecord = fxStrategy ? [{
    kind: "환율",
    title: fxStrategy.headline,
    subtitle: Number.isFinite(fxStrategy.rates?.tryKrw) ? `1 TRY ${fxStrategy.rates.tryKrw.toFixed(2)}원` : "환율 재확인 필요",
    body: `${fxStrategy.diagnosis} ${list(fxStrategy.actions).map((item) => `${item.title}: ${item.body}`).join(" ")}`,
    url: fxStrategy.sources?.[0]?.url || "#budget"
  }] : [];

  const flightRecords = familyGroups.map((item) => ({
    kind: "항공",
    title: `${item.label} ${item.route}`,
    subtitle: item.members,
    body: `${item.target}. ${item.carriers}. ${item.status}`,
    url: sources.find((source) => /Turkish Airlines|항공|flight/i.test(source.title))?.url || ""
  }));

  const quoteRecords = observedTripComQuotes.flatMap((quote) => {
    const name = lodgingOptions.find((item) => item.id === quote.lodgingId)?.name || quote.lodgingId;
    const direct = quote.officialDirect || {};
    const comparison = compareHotelPrices(quote);
    return [{
      kind: "숙소 가격",
      title: `${name} 2027년 가격 상태`,
      subtitle: `${quote.nightlyDisplay || "확인 전"}, ${direct.nightlyDisplay || "공식가 확인 전"}`,
      body: `${quote.inventoryNote || "목표일 재고 확인 전"} ${direct.inventoryNote || "공식 목표일 가격 확인 전"} ${comparison.label}. 관측일 ${quote.capturedAt || CHECKED_AT}.`,
      url: direct.sourceUrl || quote.sourceUrl
    }];
  });

  return [
    ...dayRecords,
    ...placeRecords,
    ...diningRecords,
    ...lodgingRecords,
    ...residenceRecords,
    ...budgetRecords,
    ...fxRecord,
    ...quoteRecords,
    ...flightRecords
  ];
}

export function searchContext(question, limit = 6, days = itinerary) {
  const input = normalize(question);
  const tokens = text(question)
    .toLocaleLowerCase("ko-KR")
    .split(/[\s,?!.]+/)
    .map(normalize)
    .filter((token) => token.length >= 2);
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

function hotelAnswer() {
  const recommended = lodgingOptions.slice().sort((a, b) => (a.rank || 99) - (b.rank || 99)).slice(0, 3);
  const names = recommended.map((item) => item.name).join(", ");
  return `우선 확인할 호텔은 ${names}입니다. 객실 4실의 연결 또는 인접 배정, 각 침실의 창과 환기, 난방, 계단과 어린이 수영장 규칙을 서면으로 받은 뒤 결정하세요. 2027년 3월 26일부터 29일까지의 같은 조건 실가격은 아직 확정값으로 쓰지 않습니다.`;
}

function residenceAnswer() {
  const candidates = list(airbnbSearch?.options).filter((item) => item.availability !== "unavailable_exact");
  const names = candidates.slice(0, 3).map((item) => item.name).join(", ");
  return `레지던스 후보 ${candidates.length}곳 중 먼저 볼 곳은 ${names || "아직 없습니다"}입니다. 현재 카드는 구조와 권역을 비교하는 후보 목록이며 2027년 가격, 관광 임대 허가, 실제 침대 9개, 욕실 수와 난방은 예약 전에 다시 확인해야 합니다.`;
}

function budgetAnswer() {
  const result = calculateBudget({ stayId: budgetModel.defaultStay, originId: budgetModel.defaultOrigin });
  return `표시된 금액은 이스탄불 원안에 더해지는 카파도키아 계획값입니다. 기본 시나리오의 가족 추가액은 예비비 포함 약 ${Math.round(result.mixedOriginFamilyTotal / 10_000).toLocaleString("ko-KR")}만원입니다. 열기구 계획 한도 360만원은 기본 총액에서 제외했습니다. 실제 2027년 항공, 객실과 운항 조건이 열리면 같은 조건으로 다시 계산하세요.`;
}

const questionRules = [
  {
    terms: ["비오", "비가", "우천", "날씨"],
    answer: "비나 눈이 오면 계곡과 전망대를 늘리지 말고 Nevşehir Museum 또는 예약한 Avanos 도예 체험 가운데 한 곳만 봅니다. 도로 결빙이 있으면 외출보다 숙소 휴식을 우선합니다."
  },
  {
    terms: ["박물관", "museum"],
    answer: "핵심은 Göreme Open Air Museum입니다. 비나 눈이 강하면 야외 암굴 구역 대신 Nevşehir Museum 한 곳만 보고, 2027년 운영시간은 전날 공식 채널에서 다시 확인하세요."
  },
  {
    terms: ["지하도시", "카이마클리", "kaymakli", "데린쿠유", "derinkuyu"],
    answer: "Kaymaklı와 Derinkuyu를 같은 날 묶지 마세요. 이번 기본 일정은 공식 안내상 조명된 4개 층을 보는 Kaymaklı 한 곳입니다. 폐소공포, 호흡기 문제나 무릎 통증이 있으면 지상 대기조를 둡니다."
  },
  {
    terms: ["실내수영", "실내 수영", "호텔", "연결 객실", "커넥팅"],
    answer: hotelAnswer()
  },
  {
    terms: ["레지던스", "빌라", "한집", "아파트"],
    answer: residenceAnswer()
  },
  {
    terms: ["예산", "경비", "비용", "얼마"],
    answer: budgetAnswer()
  },
  {
    terms: ["피곤", "힘들", "쉬", "낮잠"],
    answer: "이동일에는 관광을 넣지 않고, 온전한 이틀도 오전 한 곳과 점심 뒤 한 장면까지만 둡니다. 아이들이 지치면 날짜 카드의 ‘힘들면’ 일정으로 바꾸고 15시 전에 숙소로 돌아오세요."
  },
  {
    terms: ["벌룬", "열기구", "풍선", "balloon"],
    answer: "열기구는 첫 온전한 아침에만 기본 예약하고, 전날 취소됐을 때 다음 아침을 재검토합니다. 공식 신호가 녹색이어도 최종 이륙은 운영사와 조종사 판단이며, 아이 나이와 키 조건도 서면 확인해야 합니다. 출발일에는 넣지 않습니다."
  },
  {
    terms: ["항공", "비행", "공항", "nav", "asr", "ist"],
    answer: "IST-NAV 직항을 먼저 보고 좋은 시간대가 없을 때만 IST-ASR과 더 긴 차량 이동을 함께 비교합니다. 2027년 실제 시간표, 9명 수하물과 숙소까지 문앞 시간을 합쳐 판단하세요."
  },
  {
    terms: ["식당", "밥", "점심", "저녁", "맛집", "카페"],
    answer: `음식점 ${diningSpots.filter((item) => item.type === "restaurant").length}곳과 카페 ${diningSpots.filter((item) => item.type === "cafe").length}곳을 권역별로 정리했습니다. 9인 테이블과 아이 메뉴를 먼저 확인하고 그날 장소와 같은 권역 한 곳만 예약하세요.`
  }
];

export function localAnswer(question, days = itinerary) {
  const clean = text(question).trim();
  const normalized = normalize(clean);
  const rule = questionRules.find((candidate) => candidate.terms.some((term) => normalized.includes(normalize(term))));
  const context = searchContext(clean, 6, days);
  const defaultAnswer = context.length
    ? `이 내용부터 보세요: “${context[0].title}”. ${context[0].body}`
    : "바로 맞는 내용을 못 찾았습니다. 날짜, 장소, 숙소 이름을 넣어 다시 물어보세요. 예: ‘3월 28일 비가 오면 어디로 바꾸지?’";
  return {
    answer: rule?.answer || defaultAnswer,
    provider: "앱 내장 가이드",
    sources: context.filter((item) => /^https?:\/\//.test(item.url)).slice(0, 3).map((item) => ({ title: item.title, url: item.url })),
    context
  };
}

function csvCell(value) {
  const valueText = text(value);
  return /[",\n]/.test(valueText) ? `"${valueText.replaceAll('"', '""')}"` : valueText;
}

export function makeCsv(items = places) {
  const columns = ["name", "zone", "category", "latitude", "longitude", "duration", "energy", "rain_ready", "why", "warning", "official", "maps", "checked_at"];
  const rows = list(items).map((item) => [
    item.name,
    item.zone,
    item.category,
    item.lat,
    item.lng,
    item.duration,
    item.energy,
    item.rain ? "yes" : "no",
    item.why,
    item.warning,
    item.official,
    item.maps,
    item.checkedAt || CHECKED_AT
  ]);
  return [columns, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}

function xmlEscape(value) {
  return text(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

export function makeKml(items = places) {
  const marks = list(items).map((item) => `    <Placemark>
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
  return 6_371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function compactDate(date) {
  return text(date).replaceAll("-", "");
}

function nextDate(dateKeyValue) {
  const date = new Date(`${dateKeyValue}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

function dayPlanText(day) {
  const pace = day.paceLabel ? `여행 모드: ${day.paceLabel}\n\n` : "";
  return `${pace}${day.main}\n\n왜 이날 하나요: ${day.whyNow || "가족의 이동과 휴식 리듬에 맞춘 일정입니다."}\n\n부모가 기대할 것: ${day.needs?.parents || ""}\n아이들이 기다릴 것: ${day.needs?.kids || ""}\n같이 남길 장면: ${day.needs?.together || ""}\n오후 회복: ${day.needs?.recovery || ""}\n\n시간표:\n${list(day.timeline).map((item) => `- ${item}`).join("\n")}\n\n비 오면: ${day.rain}\n힘들면: ${day.low}\n식사: ${mealSuggestions[day.date] || "당일 확인"}`;
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
  return text(value)
    .replaceAll("\\", "\\\\")
    .replaceAll("\n", "\\n")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;");
}

export function makeIcs(days = itinerary) {
  const events = list(days).map((day) => [
    "BEGIN:VEVENT",
    `UID:${day.date}-cappadocia@family-trip.local`,
    `DTSTAMP:${compactDate(CHECKED_AT)}T000000Z`,
    `DTSTART;VALUE=DATE:${compactDate(day.date)}`,
    `DTEND;VALUE=DATE:${compactDate(nextDate(day.date))}`,
    `SUMMARY:${icsText(`${trip.destination} 가족여행, ${day.title}`)}`,
    `LOCATION:${icsText(day.zone)}`,
    `DESCRIPTION:${icsText(dayPlanText(day))}`,
    "END:VEVENT"
  ].join("\r\n")).join("\r\n");
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Cappadocia Family Trip 2027//KO", "CALSCALE:GREGORIAN", events, "END:VCALENDAR", ""].join("\r\n");
}

export function buildMapPoints(items = places, width = 1_000, height = 560) {
  const usable = list(items).filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng));
  if (!usable.length) return [];
  const longitudes = usable.map((item) => item.lng);
  const latitudes = usable.map((item) => item.lat);
  const longitudePadding = Math.max(0.01, (Math.max(...longitudes) - Math.min(...longitudes)) * 0.04);
  const latitudePadding = Math.max(0.01, (Math.max(...latitudes) - Math.min(...latitudes)) * 0.04);
  const bounds = {
    west: Math.min(...longitudes) - longitudePadding,
    east: Math.max(...longitudes) + longitudePadding,
    south: Math.min(...latitudes) - latitudePadding,
    north: Math.max(...latitudes) + latitudePadding
  };
  return usable.map((item) => ({
    ...item,
    x: Math.max(28, Math.min(width - 28, ((item.lng - bounds.west) / (bounds.east - bounds.west)) * width)),
    y: Math.max(28, Math.min(height - 28, height - ((item.lat - bounds.south) / (bounds.north - bounds.south)) * height))
  }));
}

export function makeAssistantPayload(question, days = itinerary) {
  return { question: text(question).trim(), context: searchContext(question, 6, days) };
}

export const coreData = {
  climate,
  itinerary,
  lodgingOptions,
  mealSuggestions,
  observedTripComQuotes,
  places,
  rentalChecklist,
  sources,
  trip,
  tripComCostSummary
};
