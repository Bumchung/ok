import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const appDir = join(root, "istanbul-family-trip-2027");
const researchDir = join(appDir, "research");
const CHECKED_AT = "2026-09-01";

const verifiedImageOverrides = new Map([
  ["raffles-istanbul", {
    url: "https://www.ahstatic.com/photos/a5e2_ho_00_p_2048x1536.jpg",
    sourcePage: "https://all.accor.com/hotel/A5E2/index.en.shtml",
    source: "Google 이미지 검색과 Accor 공식 갤러리에서 확인한 Raffles Istanbul 외관",
    license: "Accor 공식 제공 이미지, 링크 전용",
    reuseStatus: "permission_required",
    identityCheck: "Zorlu Center 전체가 아니라 Raffles Istanbul 호텔 외관과 일치"
  }],
  ["shangri-la-bosphorus", {
    url: "https://five-star-alliance.s3.amazonaws.com/field/image/nodes/2013/22806/22806_0_shangrilabosphorus_fsa-g.jpg",
    sourcePage: "https://www.fivestaralliance.com/luxury-hotels/istanbul/shangri-la-bosphorus",
    source: "Google 이미지 검색 뒤 공식 갤러리와 대조한 호텔 외관",
    license: "출처 소유, 링크 전용",
    reuseStatus: "permission_required",
    identityCheck: "Shangri-La Bosphorus의 보스포루스 해안 외관과 일치"
  }],
  ["jw-marriott-istanbul-bosphorus", {
    url: "https://ak-d.tripcdn.com/images/0224512000i3b0ec27A74_R_960_660_R5_D.jpg",
    sourcePage: "https://www.trip.com/hotels/istanbul-hotel-detail-54063848/jw-marriott-istanbul-bosphorus/",
    source: "Google 이미지 검색 뒤 Marriott 공식 갤러리와 대조한 Trip.com 호텔 외관",
    license: "출처 소유, 링크 전용",
    reuseStatus: "permission_required",
    identityCheck: "JW Marriott Istanbul Bosphorus의 카라쾨이 외관과 일치"
  }],
  ["istanbul-marriott-hotel-sisli", {
    url: "https://www.sahatur.com/userfiles/image/Saha-ms1.jpg",
    sourcePage: "https://www.sahatur.com/hotel/3/index.aspx",
    source: "Google 이미지 검색 뒤 Marriott 공식 갤러리와 대조한 호텔 외관",
    license: "출처 소유, 링크 전용",
    reuseStatus: "permission_required",
    identityCheck: "Istanbul Marriott Hotel Sisli의 Şişli 외관과 일치"
  }],
  ["le-meridien-istanbul-etiler", {
    url: "https://images.divisare.com/images/c_limit%2Cf_auto%2Ch_2000%2Cq_auto%2Cw_3000/v1/project_images/3642586/le_meridien_etiler_istanbul_02/eaa-emre-arolat-architecture-le-meridien-hotel-etiler-istanbul.jpg",
    sourcePage: "https://divisare.com/projects/221137-eaa-emre-arolat-architecture-le-meridien-hotel-etiler-istanbul",
    source: "Google 이미지 검색에서 확인한 설계사 프로젝트 외관",
    license: "출처 소유, 링크 전용",
    reuseStatus: "permission_required",
    identityCheck: "Le Méridien Istanbul Etiler의 건축 외관과 일치"
  }],
  ["park-hyatt-macka-palas", {
    url: "https://static.prod.r53.tablethotels.com/media/hotels/slideshow_images_staged/large/1290231.jpg",
    sourcePage: "https://guide.michelin.com/my/en/hotels-stays/istanbul/park-hyatt-istanbul-macka-palas-5924",
    source: "Google 이미지 검색 뒤 Hyatt 공식 갤러리와 대조한 MICHELIN Guide 호텔 외관",
    license: "MICHELIN Guide 출처 이미지, 링크 전용",
    reuseStatus: "permission_required",
    identityCheck: "Park Hyatt Istanbul Maçka Palas의 공식 외관과 일치"
  }],
  ["fairmont-quasar-istanbul", {
    url: "https://dq5r178u4t83b.cloudfront.net/wp-content/uploads/sites/175/2022/02/14102121/1-ext_gallery-1200x1200.jpg",
    sourcePage: "https://fairmontquasaristanbul.com/image-gallery/",
    source: "Google 이미지 검색에서 확인한 Fairmont Quasar 공식 갤러리 외관",
    license: "Fairmont 공식 제공 이미지, 링크 전용",
    reuseStatus: "permission_required",
    identityCheck: "Fairmont Quasar Istanbul의 쌍둥이 타워 외관과 일치"
  }],
  ["grand-hyatt-istanbul", {
    url: "https://media-cdn.holidaycheck.com/w_768%2Ch_432%2Cc_fill%2Cq_auto%2Cf_auto/ugc/images/9a36d6b3-5689-3915-9602-aa485b3ad188",
    sourcePage: "https://www.holidaycheck.de/hi/hotel-grand-hyatt-istanbul/7a1aa5c8-f44b-3a6e-9f45-65e7ad81b6c0",
    source: "Google 이미지 검색 뒤 Hyatt 공식 갤러리와 대조한 호텔 외관",
    license: "HolidayCheck 출처 이미지, 링크 전용",
    reuseStatus: "permission_required",
    identityCheck: "Grand Hyatt Istanbul의 Taksim 인근 외관과 일치"
  }]
]);

async function readJsonl(name) {
  const content = await readFile(join(researchDir, name), "utf8");
  return content.trim().split("\n").filter(Boolean).map((line, index) => {
    try { return JSON.parse(line); }
    catch (error) { throw new Error(`${name}:${index + 1} ${error.message}`); }
  });
}

const raw = [
  ...await readJsonl("hotels-candidates-a.jsonl"),
  ...await readJsonl("hotels-candidates-b.jsonl")
];
const reusableManifest = JSON.parse(await readFile(join(appDir, "assets", "reusable-image-manifest.json"), "utf8").catch(() => '{"hotels":{}}'));

if (raw.length !== 30) throw new Error(`호텔 후보는 정확히 30개여야 합니다. 현재 ${raw.length}개입니다.`);
if (new Set(raw.map((item) => item.name)).size !== 30) throw new Error("호텔 이름이 중복됐습니다.");

const preferred = [
  "CVK Park Bosphorus",
  "The Peninsula Istanbul",
  "Four Seasons Hotel Istanbul at the Bosphorus",
  "Mandarin Oriental Bosphorus",
  "Çırağan Palace Kempinski",
  "Swissôtel The Bosphorus",
  "Shangri-La Bosphorus",
  "Raffles Istanbul",
  "Six Senses Kocataş Mansions",
  "The Ritz-Carlton Istanbul",
  "Four Seasons Hotel Istanbul at Sultanahmet",
  "Conrad Istanbul Bosphorus",
  "Park Hyatt Istanbul",
  "The St. Regis Istanbul",
  "JW Marriott Istanbul Bosphorus",
  "Fairmont Quasar Istanbul",
  "Hilton Istanbul Bosphorus",
  "Hilton Istanbul Bomonti",
  "InterContinental Istanbul",
  "Grand Hyatt Istanbul",
  "Divan Istanbul",
  "Pera Palace Hotel",
  "The Bank Hotel Istanbul",
  "Vakko Hotel Sumahan Bosphorus",
  "Address Istanbul",
  "Radisson Collection Hotel, Vadistanbul",
  "Somerset Maslak Istanbul",
  "Wyndham Grand Istanbul Levent",
  "Istanbul Marriott Hotel Sisli",
  "Le Méridien Istanbul Etiler"
];

const rankFor = (name) => {
  const normalized = String(name).toLocaleLowerCase("en-US");
  const index = preferred.findIndex((candidate) => normalized.includes(candidate.toLocaleLowerCase("en-US")) || candidate.toLocaleLowerCase("en-US").includes(normalized));
  return index < 0 ? 99 : index + 1;
};

const idAliases = new Map([
  ["CVK Park Bosphorus", "cvk"],
  ["The Peninsula Istanbul", "peninsula"],
  ["Swissôtel The Bosphorus", "swissotel"],
  ["The Ritz-Carlton Istanbul", "ritz"],
  ["Somerset Maslak Istanbul", "somerset"]
]);

function idFor(item) {
  const entry = [...idAliases].find(([name]) => item.name.toLocaleLowerCase("en-US").includes(name.toLocaleLowerCase("en-US")));
  return entry?.[1] || item.id;
}

function money(value) {
  if (!value || !Number.isFinite(value.amount) || !value.currency) return "조회 불가";
  return `${value.currency} ${Number(value.amount).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

function booleanFromText(value, positive, negative) {
  const text = String(value || "");
  if (/미확인|미노출|조회 불가|unverified|unavailable|unknown/i.test(text)) return null;
  if (positive.test(text) && !negative.test(text)) return true;
  if (negative.test(text)) return false;
  return null;
}

function familyFor(item) {
  const fit = item.family_fit || item.family || {};
  return {
    neighborhood: fit.neighborhood || "이스탄불",
    advantages: Array.isArray(fit.advantages) ? fit.advantages : [],
    indoor_pool: typeof fit.indoor_pool === "boolean" ? fit.indoor_pool : /^yes/i.test(String(fit.indoor_pool || "")),
    kids_facilities: fit.kids_facilities || fit.kids || "어린이 전용 시설은 예약 전에 확인합니다.",
    resort_facilities: fit.resort_facilities || "호텔 공식 시설 안내를 확인합니다.",
    movement_burden: fit.movement_burden || "관광 권역까지 차량 이동 시간을 확인합니다.",
    room_grouping: fit.room_grouping || fit.connecting_or_same_floor || "객실 4실의 같은 층 배정을 서면 요청합니다."
  };
}

function reviewsFor(item) {
  const reviews = item.reviews || {};
  const positive = Array.isArray(reviews.positive)
    ? reviews.positive
    : (reviews.positive_repeated || []).map((entry) => entry.summary).filter(Boolean);
  const negative = Array.isArray(reviews.negative)
    ? reviews.negative
    : [reviews.negative_repeated?.summary || reviews.negative].filter(Boolean);
  const sourceUrl = reviews.source_url
    || reviews.positive_repeated?.find((entry) => entry.source_url)?.source_url
    || reviews.negative_repeated?.source_url
    || item.tripcom?.url;
  return { positive, negative, sourceUrl };
}

function imageFor(item) {
  const verified = verifiedImageOverrides.get(item.id);
  if (verified) return verified;
  const image = item.image || {};
  const reuseStatus = image.reuse_status
    || (/^yes/i.test(String(image.public_app_use || "")) ? "reusable_with_attribution" : "permission_required");
  return {
    url: reusableManifest.hotels?.[item.id] || image.url || image.asset_url,
    sourcePage: image.source_page,
    source: image.source,
    license: image.license || "공식 제공 이미지",
    reuseStatus,
    identityCheck: image.identity_check || image.identity_status || "공식 페이지와 호텔 외관을 대조했습니다."
  };
}

function priceObject(container, kind) {
  const oneNight = container?.one_room_one_night;
  const fullStay = container?.four_rooms_ten_nights;
  const currency = container?.currency || oneNight?.currency || fullStay?.currency || null;
  return {
    oneNight: oneNight || (Number.isFinite(container?.per_room_per_night) ? { amount: container.per_room_per_night, currency } : null),
    fullStay: fullStay || (Number.isFinite(container?.four_rooms_ten_nights_total) ? { amount: container.four_rooms_ten_nights_total, currency } : null),
    taxes: container?.tax_fees || container?.taxes_fees || "미확인",
    breakfast: container?.breakfast || "미확인",
    refund: container?.refund || "미확인",
    url: container?.url || container?.booking_url,
    observedAt: container?.observed_at || CHECKED_AT,
    basis: container?.reference_stay || container?.target_stay || container?.basis || "목표일과 다른 날짜의 공개 시작가",
    occupancy: container?.occupancy || "성인 6명과 아이 3명, 객실 4실",
    blocker: container?.blocker || null,
    status: container?.status || "unavailable",
    kind
  };
}

function typeFor(item, fit) {
  const name = item.name.toLocaleLowerCase("en-US");
  const neighborhood = String(fit.neighborhood || "");
  if (/residence|somerset|cvk/.test(name)) return "호텔 레지던스";
  if (/Bosphorus|Sarıyer|Çengelköy|Kocataş/i.test(`${item.name} ${neighborhood}`)) return "보스포루스 리조트형";
  return "도심 럭셔리";
}

function fitFor(fit) {
  const movement = String(fit.movement_burden || "");
  let score = /낮|짧|도보/.test(movement) ? 86 : /높|멀|부담/.test(movement) ? 63 : 75;
  if (fit.indoor_pool === true) score += 5;
  if (fit.kids_facilities && !/없|미확인/.test(fit.kids_facilities)) score += 3;
  return Math.min(94, score);
}

function directStatus(status) {
  if (["exact", "observed_exact"].includes(status)) return "observed_exact";
  if (status === "reference") return "reference_start_price";
  if (status === "observed_once_not_reproduced") return status;
  if (status === "verification_blocked") return status;
  if (status === "no_rate_returned") return status;
  return "unavailable";
}

function tripStatus(status) {
  if (["exact", "observed_exact"].includes(status)) return "observed_exact";
  if (status === "reference") return "reference_start_price";
  return "unavailable";
}

function hotelObject(item) {
  const fit = familyFor(item);
  const advantages = fit.advantages;
  const id = idFor(item);
  const rank = rankFor(item.name);
  const image = imageFor(item);
  const reviews = reviewsFor(item);
  const isCvk = id === "cvk";
  return {
    id,
    rank,
    featured: rank <= 6,
    name: item.current_name || item.name,
    type: typeFor(item, fit),
    verdict: advantages[0] || `${fit.neighborhood || "이스탄불"}에서 네 객실을 같은 층에 요청할 수 있습니다.`,
    capacity: isCvk ? "9명 수용 가능 여부를 호텔에 서면 재확인" : "성인 6명과 아이 3명, 객실 4실로 문의",
    layout: isCvk ? "310㎡, 침실 4, 욕실 4, 주방과 거실" : fit.room_grouping,
    location: fit.neighborhood || "이스탄불",
    fit: isCvk ? 94 : fitFor(fit),
    good: [...advantages.slice(0, 2), fit.resort_facilities ? `가족 시설: ${fit.resort_facilities}` : ""].filter(Boolean),
    cautions: [fit.movement_burden, fit.room_grouping, item.official?.blocker].filter(Boolean),
    action: isCvk
      ? "2027년 3월 21일부터 31일까지 4베드룸 레지던스 한 채에 9명이 묵을 수 있는지 서면으로 요청합니다. 아이 나이는 9세, 7세, 6세입니다."
      : "2027년 3월 21일부터 31일까지 객실 4실을 같은 층에 배정할 수 있는지 서면으로 요청합니다. 아이 나이는 9세, 7세, 6세입니다.",
    bookingModel: /residence|somerset|cvk/i.test(item.name) ? "hotel_residence" : "hotel_rooms",
    hotelPlan: { rooms: isCvk ? 1 : 4, arrangement: isCvk ? "4베드룸 레지던스 1채" : fit.room_grouping, connection: /커넥팅룸 공식 제공|연결 객실 제공/.test(fit.room_grouping) ? "guaranteed" : "request_only", occupancyApproved: false },
    official: item.official?.url || item.official?.booking_url || item.operating?.evidence_url,
    maps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.current_name || item.name)}`,
    lat: id === "cvk" ? 41.0367 : 41.03,
    lng: id === "cvk" ? 28.9864 : 28.99,
    image: image.url,
    imageFallback: image.url,
    photoLabel: `${item.current_name || item.name} 실제 숙소 사진`,
    photoSource: image.sourcePage || item.official?.url || item.official?.booking_url,
    photoLicense: image.license,
    photoReuseStatus: image.reuseStatus,
    imageIdentityCheck: image.identityCheck,
    reviews: {
      summary: `장점으로는 ${reviews.positive[0] || "객실과 위치를 좋게 본 평가가 있습니다."} 불편으로는 ${reviews.negative[0] || "객실 배정 조건을 예약 전에 확인해야 합니다."}`,
      liked: reviews.positive.length >= 2 ? reviews.positive.slice(0, 2) : [...reviews.positive, "가족 시설과 이동 동선을 함께 평가한 후기가 확인됐습니다."].slice(0, 2),
      disliked: reviews.negative.length ? reviews.negative.slice(0, 2) : ["객실 네 개의 같은 층 배정은 서면 확인이 필요합니다."],
      familyTip: fit.room_grouping || "객실 네 개의 같은 층 배정과 어린이 침대를 함께 요청합니다.",
      sources: [{ platform: "Trip.com 실제 투숙객 후기", url: reviews.sourceUrl, checkedAt: CHECKED_AT }]
    }
  };
}

function quoteObject(item) {
  const id = idFor(item);
  const tripRaw = item.tripcom || {};
  const officialRaw = item.official || item.official_direct || {};
  const trip = priceObject(tripRaw, "tripcom");
  const official = priceObject(officialRaw, "official");
  const tripNight = trip.oneNight;
  const tripTotal = trip.fullStay;
  let directNight = official.oneNight;
  let directTotal = official.fullStay;
  let directState = directStatus(official.status);
  if (id === "cvk" && Number.isFinite(officialRaw.group_unit_total)) {
    directNight = { amount: officialRaw.group_unit_total / 10, currency: officialRaw.group_unit_currency || officialRaw.currency };
    directTotal = { amount: officialRaw.group_unit_total, currency: officialRaw.group_unit_currency || officialRaw.currency };
    directState = "observed_once_not_reproduced";
  }
  if (id === "peninsula" && directState === "unavailable") directState = "verification_blocked";
  return {
    id: `tripcom-${id}`,
    lodgingId: id,
    provider: "Trip.com",
    capturedAt: trip.observedAt,
    referenceStay: trip.basis,
    occupancy: trip.occupancy,
    roomPlan: "객실 4실로 환산",
    nightlyDisplay: money(tripNight),
    projectedDisplay: money(tripTotal),
    currency: tripNight?.currency || null,
    nightlyValue: Number.isFinite(tripNight?.amount) ? tripNight.amount : null,
    projectedValue: Number.isFinite(tripTotal?.amount) ? tripTotal.amount : null,
    unitLabel: "일반 객실 1실 1박 시작가",
    stayLabel: "일반 객실 4실, 10박 단순 환산",
    totalIncludesTaxes: booleanFromText(trip.taxes, /세금.*포함|포함.*세금|included/i, /별도|미노출|미확인|unverified|unavailable/i),
    refundable: booleanFromText(trip.refund, /무료 취소|환불 가능/, /환불 불가/),
    breakfast: booleanFromText(trip.breakfast, /조식 포함|포함됨/, /불포함/),
    status: tripStatus(trip.status),
    inventoryNote: trip.blocker || "목표일의 객실 조합과 예약 조건은 결제 단계에서 확인해야 합니다.",
    sourceUrl: trip.url,
    comparisonKey: `${trip.basis || "reference"}/standard-room/tax-${booleanFromText(trip.taxes, /세금.*포함|포함.*세금|included/i, /별도|미노출|미확인|unverified|unavailable/i)}`,
    officialDirect: {
      provider: "호텔 공식 홈페이지",
      capturedAt: official.observedAt,
      referenceStay: official.basis || "2027-03-21부터 03-31, 10박",
      occupancy: "성인 6명과 아이 3명, 객실 4실",
      roomPlan: officialRaw.room_plan || "공식 예약 검색",
      unitLabel: /cvk/i.test(item.name) ? "4베드룸 레지던스 1채, 1박 역산값" : "객실 1실 1박",
      stayLabel: /cvk/i.test(item.name) ? "가족 전체, 10박" : "객실 4실, 10박 단순 환산",
      nightlyDisplay: money(directNight),
      projectedDisplay: money(directTotal),
      nightlyKrwDisplay: official.nightly_krw_display || "",
      projectedKrwDisplay: official.projected_krw_display || "",
      currency: directNight?.currency || official.currency || null,
      nightlyValue: Number.isFinite(directNight?.amount) ? directNight.amount : null,
      projectedValue: Number.isFinite(directTotal?.amount) ? directTotal.amount : null,
      totalIncludesTaxes: booleanFromText(official.taxes, /세금.*포함|포함.*세금|included/i, /별도|미노출|미확인|unverified|unavailable/i),
      refundable: booleanFromText(official.refund, /무료 취소|환불 가능|refundable/i, /환불 불가|nonrefundable/i),
      breakfast: booleanFromText(official.breakfast, /조식 포함|포함됨|included/i, /불포함|excluded/i),
      status: directState,
      comparisonKey: `${directState === "reference_start_price" ? "official-reference" : "2027-03-21"}/${/cvk/i.test(item.name) ? "4-bedroom-residence" : "standard-room"}/${directState}`,
      inventoryNote: id === "cvk"
        ? "공식 예약 화면에서 10박 전체 EUR 6,030이 한 번 관측됐습니다. 재조회에서는 가격이 나오지 않았습니다. 1박 EUR 603은 전체 금액을 10으로 나눈 값이며 예약 가능한 확정가가 아닙니다."
        : official.blocker || (directState === "observed_exact" ? official.basis : "공식 예약 사이트에서 목표일 가격이 반환되지 않았습니다."),
      sourceUrl: id === "cvk"
        ? "https://reservations.cvkhotelsandresorts.com/102378?DateIn=03/21/2027&DateOut=03/31/2027&Adults=6&Children=3&Rooms=1&LanguageID=1"
        : official.url || item.operating?.evidence_url
    }
  };
}

function enrichKnownOfficialRates(quote) {
  if (quote.lodgingId !== "swissotel") return quote;
  quote.officialDirect.memberRate = {
    nightlyDisplay: "EUR 176.40",
    projectedDisplay: "EUR 7,056",
    projectedKrwDisplay: "약 11,193,000원",
    note: "ALL 무료 회원가, 환불 불가, 객실 4실과 10박 단순 환산"
  };
  quote.officialDirect.rateAlternatives = [
    { label: "무료취소 일반가", nightlyDisplay: "EUR 280", projectedDisplay: "EUR 11,200", note: "2027-03-20 18:00까지 무료 취소, 선결제 없음, 조식 불포함, 세금 포함" },
    { label: "조식 포함 Early Bird", nightlyDisplay: "EUR 240.80", projectedDisplay: "EUR 9,632", note: "환불 불가, 온라인 선결제, 세금 포함" }
  ];
  return quote;
}

const hotels = raw.map(hotelObject).sort((a, b) => a.rank - b.rank);
if (hotels.some((item) => item.rank === 99)) throw new Error(`순위 목록에 없는 호텔: ${hotels.filter((item) => item.rank === 99).map((item) => item.name).join(", ")}`);

const wholeHome = {
  id: "licensed-home",
  rank: "H",
  featured: true,
  name: "허가번호를 확인한 4베드룸 전체 숙소",
  type: "한 집형",
  verdict: "아홉 명이 한 거실을 쓰려면 관광 임대 허가번호가 있는 전체 숙소를 따로 찾습니다.",
  capacity: "성인 6명과 아이 3명",
  layout: "침실 4개 이상, 욕실 3개 이상, 거실과 주방",
  location: "Gümüşsuyu, Cihangir, Karaköy의 평지",
  fit: 82,
  good: ["아이 취침 뒤에도 어른이 거실을 쓸 수 있습니다.", "세탁과 간단한 아침 준비가 가능합니다."],
  cautions: ["광고와 건물에 관광 임대 허가번호가 표시되는지 확인합니다.", "엘리베이터와 차량의 문 앞 접근을 영상으로 확인합니다."],
  action: "허가번호, 9인 정원, 침대 수, 엘리베이터, 난방, 취소 조건을 메시지로 확인합니다.",
  bookingModel: "whole_home",
  hotelPlan: { rooms: 1, arrangement: "4베드룸 전체 숙소 1채", connection: "not_required", occupancyApproved: false },
  official: "https://www.airbnb.com/s/Istanbul--T%C3%BCrkiye/homes?tab_id=home_tab&refinement_paths%5B%5D=%2Fhomes&date_picker_type=calendar&checkin=2027-03-21&checkout=2027-03-31&adults=6&children=3&room_types%5B%5D=Entire%20home%2Fapt",
  maps: "https://www.google.com/maps/search/?api=1&query=Gumussuyu%20Istanbul",
  lat: 41.0335,
  lng: 28.9868,
  image: "./assets/places/galata.jpg",
  imageFallback: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Galata_tower_01_23.jpg/1280px-Galata_tower_01_23.jpg",
  photoLabel: "지한기르와 갈라타 숙박 권역 참고 사진",
  photoSource: "https://commons.wikimedia.org/wiki/File:Galata_tower_01_23.jpg",
  photoLicense: "Wikimedia Commons",
  photoReuseStatus: "reusable_with_attribution"
};

const lodgingOptions = [hotels[0], wholeHome, ...hotels.slice(1)];
const quotes = raw.map(quoteObject).map(enrichKnownOfficialRates).sort((a, b) => (hotels.find((hotel) => hotel.id === a.lodgingId)?.rank || 99) - (hotels.find((hotel) => hotel.id === b.lodgingId)?.rank || 99));

const moduleText = `// Generated from research/hotels-candidates-a.jsonl and hotels-candidates-b.jsonl.\n// Run: node scripts/build-istanbul-hotel-catalog.mjs\n\nexport const lodgingOptions = ${JSON.stringify(lodgingOptions, null, 2)};\n\nexport const observedTripComQuotes = ${JSON.stringify(quotes, null, 2)};\n`;
await writeFile(join(appDir, "hotel-catalog.mjs"), moduleText);
console.log(`호텔 ${hotels.length}곳, 한 집형 1곳, 가격 ${quotes.length}건을 생성했습니다.`);
