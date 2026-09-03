import { media } from "./image-catalog.mjs";

export const CHECKED_AT = "2026-09-03";
export const financeCheckedAt = CHECKED_AT;

const goCappadocia = "https://goturkiye.com/cappadocia/see-cappadocia";
const unescoCappadocia = "https://whc.unesco.org/en/list/357";
const goremeOfficial = "https://muze.gov.tr/muze-detay?DistId=grm&SectionId=grm01";
const zelveOfficial = "https://muze.gov.tr/muze-detay?DistId=ZPO&SectionId=ZPO01";
const kaymakliOfficial = "https://muze.gov.tr/muze-detay?DistId=KYY&SectionId=KYY01";
const derinkuyuOfficial = "https://muze.gov.tr/muze-detay?DistId=DKY&SectionId=DKY01";
const balloonStatus = "https://shmkapadokya.kapadokya.edu.tr/en/default";
const googleMaps = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

function imageFields(mediaId, fallbackId = "love_valley") {
  const item = media[mediaId];
  if (!item) throw new Error(`Unknown Cappadocia media id: ${mediaId}`);
  return { mediaId, ...item, imageFallback: media[fallbackId].image };
}

function officialEvidence(url, familyTip) {
  return {
    summary: "독립 후기 표본을 별도로 분석하지 않았습니다. 공식 운영 정보와 지형, 9인 가족 동선만 반영했습니다.",
    likedLabel: "확인된 점",
    liked: ["공식 관광, 박물관, 지자체 또는 운영기관 자료에서 장소의 성격과 현재 상태를 확인했습니다."],
    dislikedLabel: "아직 확인할 점",
    disliked: ["2027년 운영시간, 입장료, 공사와 단체 입장 조건은 아직 확정 정보가 아닙니다."],
    familyTip,
    sources: [{ platform: "공식 정보", url, checkedAt: CHECKED_AT }]
  };
}

function place(spec) {
  return { ...spec, detailLabel: "공식 운영 정보와 가족 판단", checkedAt: CHECKED_AT, maps: googleMaps(spec.mapQuery), ...imageFields(spec.mediaId), reviews: officialEvidence(spec.official, spec.familyTip) };
}

function dining(spec) {
  const mapsUrl = googleMaps(spec.mapQuery);
  return {
    ...spec,
    priceBand: "2027 가격 미확인",
    mapsUrl,
    officialUrl: spec.officialUrl || mapsUrl,
    reviewSourceUrl: spec.reviewSourceUrl || spec.officialUrl || mapsUrl,
    checkedAt: CHECKED_AT,
    status: spec.status || "candidate",
    informationLabel: spec.officialUrl ? "공식 정보" : "현재 정보 확인",
    detailLabel: "확인된 정보와 9인 예약 조건",
    reviewCaution: `${spec.reviewCaution} 독립 후기 종합은 하지 않았고 2027년 영업과 가격은 미확인입니다.`,
    photoCaption: spec.photoCaption || "대표 메뉴 참고 이미지",
    ...imageFields(spec.mediaId)
  };
}

const hotelCoordinates = {
  hotel_doubletree: { lat: 38.7218, lng: 34.8358 },
  hotel_kayakapi: { lat: 38.6321, lng: 34.8958 },
  hotel_marriott: { lat: 38.6246, lng: 34.7335 },
  hotel_ajwa: { lat: 38.5765, lng: 34.8982 },
  hotel_kelebek: { lat: 38.6434, lng: 34.8257 },
  hotel_suhan: { lat: 38.7245, lng: 34.8378 },
  hotel_carus: { lat: 38.6436, lng: 34.8291 },
  hotel_argos: { lat: 38.6300, lng: 34.8064 },
  hotel_kappadoks: { lat: 38.6212, lng: 34.8612 },
  hotel_sultan: { lat: 38.6438, lng: 34.8252 },
  hotel_dinler: { lat: 38.6342, lng: 34.9001 },
  hotel_avanos_evi: { lat: 38.7182, lng: 34.8463 }
};

function hotel(spec) {
  return {
    ...spec,
    ...hotelCoordinates[spec.id],
    coordinateStatus: "지도 표시용 근사 중심점, 예약 전 Google Maps에서 실제 출입구 재확인",
    featured: spec.rank <= 6,
    bookingModel: "hotel_rooms",
    hotelPlan: { rooms: 4, arrangement: spec.arrangement, connection: "request_only", occupancyApproved: false },
    maps: googleMaps(spec.mapQuery),
    action: "성인 6명과 만 9세, 7세, 6세 어린이의 4실 배치, 연결 또는 바로 옆 객실, 창과 환기, 난방, 어린이 실내 수영장 이용을 한 이메일에서 서면 확인",
    photoCreditLabel: "숙소 또는 권역 이미지 출처",
    ...imageFields(spec.mediaId)
  };
}

export const trip = {
  slug: "cappadocia",
  title: "CAPPADOCIA TOGETHER",
  subtitle: "이스탄불 사이 3박, 바람이 허락하는 풍경",
  destination: "카파도키아",
  startDate: "2027-03-26",
  arrivalDate: "2027-03-26",
  checkoutDate: "2027-03-29",
  nights: 3,
  adults: 6,
  children: [9, 7, 6],
  hotelRoomCount: 4,
  mapZoom: 10,
  weatherCoordinates: { latitude: "38.6431", longitude: "34.8289", timezone: "Europe/Istanbul" },
  budgetStayLabel: "카파도키아 증분 3박",
  budgetGroupLabel: "아홉 명 전체 증분 비용",
  paceModes: {
    default: "gentle",
    options: [
      { id: "gentle", label: "천천히", description: "새벽 일정 뒤 오전 핵심 한 곳만 보고 매일 15시 전후 숙소로 돌아옵니다." },
      { id: "focused", label: "집중 여행", description: "같은 방향의 장소를 하나 더 묶되 지하도시와 긴 계곡을 같은 날 넣지 않습니다." }
    ]
  },
  principles: [
    "카파도키아는 한 도시가 아니라 여러 거점과 계곡으로 이어진 권역입니다. 괴레메, 우치히사르, 위르귀프, 아바노스를 중심으로만 움직입니다.",
    "3월은 봄 풍경보다 겨울과 초봄의 경계에 가깝습니다. 방한, 방풍과 미끄럼 방지를 먼저 준비합니다.",
    "열기구는 첫 온전한 아침에 시도하고 다음 날을 재시도 후보로만 남깁니다. 운항과 세 아이 탑승은 확정하지 않습니다.",
    "동굴 숙소의 분위기보다 창, 환기, 계단, 난방, 실제 침대 9개와 연결 객실을 우선합니다."
  ],
  sourceDeck: goCappadocia
};

export const familyGroups = [
  { id: "ist-family-nine-outbound", label: "카파도키아행", origin: "IST", members: "성인 6, 어린이 3", route: "이스탄불 IST → 네브셰히르 NAV", target: "3월 26일 오전 출발을 우선하고 도착일 관광은 전망 한 곳까지만", carriers: "Turkish Airlines의 현재 IST-NAV 직항을 기준으로 2027년 운항표가 열린 뒤 ASR과 비교", status: "현재 직항 비행시간은 약 1시간 20분이지만 2027년 편명, 시간, 운임과 수하물 조건은 미확정" },
  { id: "ist-family-nine-return", label: "이스탄불 복귀", origin: "NAV", members: "성인 6, 어린이 3", route: "네브셰히르 NAV → 이스탄불 IST", target: "3월 29일 오후 복귀를 우선하고 출발일 열기구는 넣지 않음", carriers: "좋은 NAV 시간대가 없을 때만 IST-ASR 직항과 더 긴 전용차 이동을 함께 비교", status: "NAV와 ASR 모두 2027년 운항표와 숙소까지 실제 차량 시간이 나온 뒤 결정" }
];

export const decisionChecklist = [
  { id: "balloon", label: "열기구 실패 허용", detail: "취소돼도 여행이 성립하는지 먼저 합의하고 첫 아침 한 번만 기본값으로 둡니다.", href: "#plan" },
  { id: "rooms", label: "4실과 동굴 조건", detail: "연결 또는 인접 객실, 창과 환기, 난방, 계단, 실제 침대 9개를 서면 확정합니다.", href: "#stay" },
  { id: "flight", label: "NAV 우선, ASR 비교", detail: "IST 출도착을 고정하고 비행시간과 9인 차량 이동을 합쳐 비교합니다.", href: "#family" },
  { id: "vehicle", label: "기사 포함 16석급 차량", detail: "9명, 짐, 어린이 좌석 3개가 들어가고 계곡의 눈과 진흙에 대응 가능한지 확인합니다.", href: "#tools" }
];

export const lodgingOptions = [
  hotel({ id: "hotel_doubletree", rank: 1, mediaId: "hotel_doubletree", name: "DoubleTree by Hilton Avanos Cappadocia", type: "강변 체인 호텔", location: "Avanos", fit: 94, mapQuery: "DoubleTree by Hilton Avanos Cappadocia", official: "https://www.hilton.com/en-gb/hotels/navdtdi-doubletree-avanos-cappadocia/", verdict: "실내 수영장과 연결 객실을 공식적으로 함께 표시하며 차량 접근도 쉬운 가장 안정적인 가족 운영형 후보입니다.", capacity: "연결 객실 제공 표기, 9명의 4실 배치는 호텔 승인 전 미확정", layout: "연결 2실과 같은 층 2실", arrangement: "Confirmed Connecting Rooms 가능 조합과 인접 트윈 2실", good: ["공식 편의시설에 indoor pool과 connecting rooms 표시", "Paşabağ, Zelve, Avanos 도예 일정에 편리", "대형 호텔 구조로 9인 아침과 차량 승하차가 단순함"], cautions: ["우치히사르와 카이마클리 방향 이동 증가", "어린이 수영장 접근과 수온 미확인", "연결 객실 정원과 2027년 가격 미확인"] }),
  hotel({ id: "hotel_kayakapi", rank: 2, mediaId: "hotel_kayakapi", name: "Kayakapi Premium Caves", type: "역사 마을형 동굴 호텔", location: "Ürgüp", fit: 93, mapQuery: "Kayakapi Premium Caves Cappadocia", official: "https://www.kayakapi.com/120-kuscular-konagi", verdict: "공식 최대 11명의 253㎡ 맨션이 있어 9인이 한 유닛에 머무는 가장 강한 구조 후보입니다.", capacity: "120 Kuşçular Konağı 공식 최대 11명, 일반 연결 객실은 특정 Majestic Cave Suites만 가능", layout: "11인 맨션 단독 또는 연결 스위트와 추가 객실", arrangement: "120 Kuşçular Konağı 단독 사용을 우선, 불가하면 연결 131/132와 추가 2실", good: ["공식 최대 11명 맨션", "넓은 안뜰과 공용 생활공간", "공식 FAQ가 연결 가능한 객실 번호를 명시"], cautions: ["맨션에 전용 수영장은 명시되지 않음", "언덕과 내부 이동 지원 확인", "동굴 침실별 창과 난방, 2027년 가격 미확인"] }),
  hotel({ id: "hotel_marriott", rank: 3, mediaId: "hotel_marriott", name: "Cappadocia Marriott Hotel", type: "현대식 대형 호텔", location: "Nevşehir", fit: 92, mapQuery: "Cappadocia Marriott Hotel", official: "https://www.marriott.com/en-gb/hotels/navmc-cappadocia-marriott-hotel/overview/", verdict: "동굴 감성은 약하지만 298실, 엘리베이터, 연결 객실과 실내 수영장 근거가 명확한 안전한 기본값입니다.", capacity: "공식 페이지에 연결 객실 안내, 객실별 정확한 최대 정원은 미확정", layout: "연결 객실 2실과 인접 트윈 2실", arrangement: "연결 객실 2실과 같은 층 트윈 2실", good: ["298개 현대식 객실과 연결 객실 공식 안내", "공식 시설 목록에 실내 수영장과 엘리베이터", "NAV 약 32km로 안내되고 대형차 접근이 단순함"], cautions: ["괴레메 중심까지 매번 차량 이동", "실내 수영장 어린이 시간과 수온 미표시", "2027년 4실 가격과 실제 연결 재고 미확인"] }),
  hotel({ id: "hotel_ajwa", rank: 4, mediaId: "hotel_ajwa", name: "AJWA Cappadocia", type: "가족 시설형 리조트", location: "Mustafapaşa", fit: 90, mapQuery: "AJWA Cappadocia", official: "https://www.ajwa.com.tr/cappadocia/rooms-suites.aspx", verdict: "연결 객실, 다침실 스위트, 키즈클럽과 농장 근거가 있어 숙소 안에서 회복하는 가족에게 강합니다.", capacity: "공식 팩트시트에 연결 객실과 1-3침실 Cave Suites, 객실별 9인 정원은 미확정", layout: "다침실 스위트와 연결 가능한 일반 객실", arrangement: "2-3침실 Cave Suite 1개와 연결 또는 같은 건물 객실 2실", good: ["키즈클럽, 농장과 베이비시팅 안내", "연결 객실 옵션과 다침실 스위트", "넓은 도로와 주차"], cautions: ["괴레메와 Avanos까지 이동 증가", "실내 수영장은 남녀 시간이 분리되어 가족 동시 이용 확인 필요", "객실 건물과 2027년 총액 미확인"] }),
  hotel({ id: "hotel_kelebek", rank: 5, mediaId: "hotel_kelebek", name: "Kelebek Special Cave Hotel", type: "괴레메 가족 동굴형", location: "Göreme", fit: 87, mapQuery: "Kelebek Special Cave Hotel", official: "https://www.kelebekhotel.com/en/room/family-suite", verdict: "공식 최대 4명의 Family Suite 세 개가 있어 동굴 경험과 9인 구조를 함께 만들기 좋습니다.", capacity: "Family Suite 8, 23, 112가 각각 공식 최대 4명", layout: "패밀리 스위트 3실", arrangement: "Family Suite 3실, 가능한 한 같은 동선", good: ["가족 스위트 구조와 정원이 구체적", "Göreme 중심 접근", "Room 112는 킹침대 2개와 욕실 2개"], cautions: ["스위트끼리 연결 또는 인접 근거 없음", "공용 수영장은 야외라 3월 대안이 아님", "언덕, 계단과 차량 하차 위치 확인"] }),
  hotel({ id: "hotel_suhan", rank: 6, mediaId: "hotel_suhan", name: "Suhan Cappadocia", type: "대형 가족 운영형", location: "Avanos", fit: 84, mapQuery: "Suhan Cappadocia Hotel Avanos", official: "https://suhankapadokya.com/en", verdict: "432실과 실내 수영장, 2+2 Junior Suite 구조로 9인 재고와 단체 이동에 강합니다.", capacity: "Junior Suite 2+2, Superior 2+1 공식 안내", layout: "Junior Suite 3실 또는 승인된 4실 조합", arrangement: "Junior Suite 3실과 필요 시 인접 일반 객실", good: ["432실 대형 호텔", "실내외 수영장과 스파 안내", "Avanos 중심과 단체 차량 접근"], cautions: ["연결 객실 근거 없음", "어린이 수영장 시간과 수온 미확인", "우치히사르와 지하도시 이동 증가"] }),
  hotel({ id: "hotel_carus", rank: 7, mediaId: "hotel_carus", name: "CARUS Cappadocia", type: "괴레메 중심 동굴 호텔", location: "Göreme", fit: 79, mapQuery: "CARUS Cappadocia", official: "https://www.caruscappadocia.com/", verdict: "괴레메 도보성과 동굴 수영장은 매력적이지만 50개 객실이 모두 달라 가족 배치 확인이 필요합니다.", capacity: "39개 석조와 11개 동굴 객실, 공식 페이지에 객실별 정원 차이", layout: "창 있는 석조 스위트 중심 4실", arrangement: "Stone Room 또는 Carus Suite 4실을 같은 동선으로 요청", good: ["괴레메 식당과 전망대 도보 접근", "석조와 동굴 객실 구분", "동굴 수영장과 호텔 식당"], cautions: ["동굴 수영장 어린이 규칙 미확인", "객실 크기와 형태가 모두 다름", "차량 문앞 접근과 4실 근접 배정 미확인"] }),
  hotel({ id: "hotel_argos", rank: 8, mediaId: "hotel_argos", name: "Argos in Cappadocia", type: "우치히사르 석조 호텔", location: "Uçhisar", fit: 78, mapQuery: "Argos in Cappadocia", official: "https://www.argosincappadocia.com/en/rooms", verdict: "100㎡ 2침실 스위트와 전망은 강하지만 객실마다 창, 동굴 여부와 위치가 달라 9인 분산 위험이 있습니다.", capacity: "2침실 스위트는 더블 1개와 싱글 2개", layout: "2침실 스위트 1개와 가까운 객실 2-3실", arrangement: "Two Bedroom Suite와 같은 동선의 STONE + WINDOW 객실 3실", good: ["공식 100㎡ 2침실 스위트", "Pigeon Valley와 Uçhisar 전망 접근", "객실별 동굴과 창 여부 공개"], cautions: ["일부 객실은 창이 없음", "개인 풀 스위트가 가족 공용 풀을 뜻하지 않음", "9명이 같은 구역에 배정되는지 미확인"] }),
  hotel({ id: "hotel_kappadoks", rank: 9, mediaId: "hotel_kappadoks", name: "Kappadoks Cave Hotel", type: "소규모 패밀리 스위트형", location: "Uçhisar", fit: 75, mapQuery: "Kappadoks Cave Hotel Cappadocia", official: "https://www.kappadoks.com/en/rooms-suites/cave-family-suit-1002", verdict: "60㎡ Family Suite가 침실 공간 2개와 욕실 2개를 공개하지만 객실 1002 하나뿐이라 추가 객실 근접성이 핵심입니다.", capacity: "Family Suite 1002는 킹, 트윈과 확장 싱글 구조", layout: "패밀리 스위트 1개와 일반 객실 2-3실", arrangement: "Cave Family Suite 1002와 같은 동선의 객실 3실", good: ["가족 스위트 실제 구조가 구체적", "욕실 2개", "Uçhisar 권역"], cautions: ["가족 스위트가 하나뿐", "공용 실내 수영장 없음", "4실 재고와 차량 승하차 미확인"] }),
  hotel({ id: "hotel_sultan", rank: 10, mediaId: "hotel_sultan", name: "Sultan Cave Suites", type: "전망 동굴 스위트형", location: "Göreme", fit: 72, mapQuery: "Sultan Cave Suites", official: "https://www.sultancavesuites.com/en/quartos", verdict: "2침실 Family Suite가 있지만 최대 정원과 특정 객실 번호 보장이 없어 사진보다 배치 확인이 먼저입니다.", capacity: "Family Suite 301과 313, 공식 최대 정원은 미표시", layout: "패밀리 스위트 2실과 추가 객실", arrangement: "Family Suite 301/313과 가까운 객실 1-2실", good: ["301은 침실 2개와 별도 거실", "Göreme 전망과 중심 접근", "공용 주차 안내"], cautions: ["자체 실내 수영장 없음", "특정 객실 번호 보장 없음", "언덕과 짐 운반 동선 확인"] }),
  hotel({ id: "hotel_dinler", rank: 11, mediaId: "hotel_dinler", name: "Dinler Hotels Ürgüp", type: "대형 실용 호텔", location: "Ürgüp", fit: 70, mapQuery: "Dinler Hotels Urgup", official: "https://urgup.dinler.com/en/", verdict: "188실, 무료 대형 주차와 3-4인 Comfort Plus는 실용적이지만 연결 객실과 실내 수영장 근거가 없습니다.", capacity: "Comfort Plus 공식 3-4인", layout: "Comfort Plus 3실 또는 총 4실", arrangement: "Comfort Plus 3실과 필요 시 인접 일반 객실", good: ["무료 대형 주차", "188실과 Ürgüp 중심 접근", "3-4인 객실 구조"], cautions: ["연결 객실 근거 없음", "수영장은 날씨에 따른 운영으로 실내로 표시하면 안 됨", "2027년 3실 또는 4실 총액 미확인"] }),
  hotel({ id: "hotel_avanos_evi", rank: 12, mediaId: "hotel_avanos_evi", name: "Avanos Evi", type: "주거형 스위트", location: "Avanos", fit: 68, mapQuery: "Avanos Evi", official: "https://www.avanosevi.com/en/rooms", verdict: "100㎡ Family Suite의 주방, 침실 2개와 욕실 2개는 좋지만 여러 유닛의 거리와 전체 단독 사용을 확인해야 합니다.", capacity: "Family Suite 공식 최대 5명, 다른 Luxury Suite 조합으로 최대 11명 구조", layout: "Family Suite 1개와 3인 스위트 2개", arrangement: "5인 Family Suite와 3인 Luxury Suite 2개", good: ["가족 스위트에 침실 2개, 욕실 2개와 주방", "Avanos 도예와 강변 접근", "호텔보다 독립 주거형에 가까움"], cautions: ["실내 수영장 없음", "유닛 간 거리와 계단 미확인", "전체 부지 단독 사용과 2027년 재고 미확인"] })
];

export const observedTripComQuotes = lodgingOptions.map((item) => ({
  id: `unobserved-${item.id}`, lodgingId: item.id, provider: "Trip.com", capturedAt: CHECKED_AT,
  referenceStay: "2027-03-26부터 03-29, 3박", occupancy: "성인 6명, 어린이 3명, 객실 4실", roomPlan: item.hotelPlan.arrangement,
  nightlyDisplay: "2027 가격 미확인", projectedDisplay: "3박 총액 미확인", currency: "KRW", nightlyValue: null, projectedValue: null,
  unitLabel: "객실 1실, 1박", stayLabel: "가족 4실, 3박", totalIncludesTaxes: null, refundable: null, breakfast: null, status: "unavailable",
  inventoryNote: "목표 날짜의 동일 객실, 인원, 세금 조건을 관측하지 않았습니다. 숫자를 추정하지 않습니다.",
  sourceUrl: `https://kr.trip.com/hotels/list?city=1760&searchWord=${encodeURIComponent(item.name)}`,
  comparisonKey: `2027-03-26/2027-03-29/${item.id}/4-rooms/6-adults-3-children/unobserved`,
  officialDirect: { provider: `${item.name} 공식 홈페이지`, capturedAt: CHECKED_AT, referenceStay: "2027-03-26부터 03-29, 3박", occupancy: "성인 6명, 어린이 3명, 객실 4실", roomPlan: item.hotelPlan.arrangement, unitLabel: "객실 1실, 1박", stayLabel: "가족 4실, 3박", nightlyDisplay: "2027 가격 미확인", projectedDisplay: "3박 총액 미확인", currency: "KRW", nightlyValue: null, projectedValue: null, totalIncludesTaxes: null, refundable: null, breakfast: null, status: "unavailable", inventoryNote: "동일 날짜와 9인 객실 배치의 공식 결제 견적을 확인하지 않았습니다.", sourceUrl: item.official, comparisonKey: `2027-03-26/2027-03-29/${item.id}/4-rooms/6-adults-3-children/unobserved` }
}));

export const tripComCostSummary = {
  provider: "Trip.com", capturedAt: CHECKED_AT, requestedStay: "2027-03-26부터 03-29, 3박", requestedOccupancy: "성인 6명, 어린이 3명, 호텔 객실 4실",
  exactQuoteStatus: "2027년 동일 조건의 공개 결제 견적을 관측하지 않았습니다. 모든 가격 칸은 미확인으로 유지합니다.",
  directQuoteStatus: "호텔 공식 사이트에서도 동일 날짜, 9명, 4실 조건의 재현 가능한 총액을 기록하지 않았습니다.",
  benchmarkLabel: "카파도키아 2027 호텔 시장 평균", benchmarkNightly: "미산정", benchmarkTotal: "산정하지 않음",
  benchmarkFormula: "실제 동일 조건 견적이 없으므로 평균과 4실 3박 환산을 만들지 않음", sourceUrl: "https://kr.trip.com/hotels/list?city=1760",
  fx: { label: "ECB 2026-09-02 참고", eurToKrw: 1577.57, sourceUrl: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html", note: "현재 비교용 환율일 뿐 2027년 호텔 가격이나 실제 카드 환율이 아닙니다." }
};

const residenceSearchUrl = "https://www.google.com/maps/search/?api=1&query=Cappadocia+family+residence";
const residenceSpecs = [
  { id: "residence_kayakapi_120", name: "Kayakapi 120 Kuşçular Konağı", neighborhood: "Ürgüp", capacity: 11, bedrooms: 5, beds: 7, baths: 5, fit: 96, url: "https://www.kayakapi.com/120-kuscular-konagi", reason: "공식 최대 11명과 253㎡를 명시해 9명이 한 유닛에서 지낼 수 있는 가장 강한 실제 구조입니다.", caution: "침실별 창, 난방과 계단, 조식 포함 여부를 확인해야 합니다. 전용 수영장은 공식 설명에 없습니다." },
  { id: "residence_kayakapi_308", name: "Kayakapi 308 Pool Mansion 조합", neighborhood: "Ürgüp", capacity: 8, bedrooms: 3, beds: 5, baths: 3, fit: 84, url: "https://www.kayakapi.com/308-pool-mansion", reason: "공식 최대 8명 맨션에 바로 옆 객실을 붙이는 구조 후보입니다.", caution: "9명 단독 수용이 아니며 인접 객실 보장이 필요합니다. 전용 실내 풀은 어린이 잠금과 이용 규칙을 서면 확인합니다." },
  { id: "residence_ajwa", name: "AJWA 다침실 Cave Suite 조합", neighborhood: "Mustafapaşa", capacity: 9, bedrooms: 4, beds: 6, baths: 3, fit: 82, url: "https://www.ajwa.com.tr/cappadocia/rooms-suites.aspx", reason: "공식 다침실 스위트와 연결 객실을 조합하고 키즈클럽과 농장에서 쉬기 좋습니다.", caution: "특정 조합의 9인 정원과 같은 건물 배치는 확정되지 않았습니다. 수영장 시간은 가족 동시 이용 여부를 확인합니다." },
  { id: "residence_avanos_evi", name: "Avanos Evi 스위트 3채 조합", neighborhood: "Avanos", capacity: 11, bedrooms: 4, beds: 7, baths: 4, fit: 78, url: "https://www.avanosevi.com/en/rooms", reason: "5인 Family Suite와 3인 스위트 2채를 조합하면 공개 정원상 11명 구조가 됩니다.", caution: "세 유닛의 실제 거리, 계단과 부지 단독 사용은 확인하지 못했습니다. 공용 거실도 하나로 연결되지 않을 수 있습니다." },
  { id: "residence_estates", name: "Göreme Family Suite 3실 조합", neighborhood: "Göreme", capacity: 12, bedrooms: 6, beds: 6, baths: 3, fit: 72, url: "https://www.kelebekhotel.com/en/room/family-suite", reason: "Kelebek의 공식 최대 4명 Family Suite 세 개를 같은 동선으로 요청하는 구조입니다.", caution: "스위트 간 연결이나 인접 근거가 없고 야외 수영장은 3월 대안이 아닙니다." },
  { id: "residence_tafana", name: "Mustafapaşa 게스트하우스 전체 대관 후보", neighborhood: "Mustafapaşa", capacity: 9, bedrooms: 4, beds: 6, baths: 3, fit: 64, url: residenceSearchUrl, reason: "조용한 마을에서 독립 거실과 주방을 확보하는 비교 구조입니다.", caution: "특정 허가 숙소나 2027년 재고를 관측하지 않았습니다. 정원, 관광임대 등록, 난방과 차량 접근을 처음부터 검증해야 합니다." }
];

export const airbnbSearch = {
  checkedAt: CHECKED_AT,
  stay: "2027-03-26부터 03-29, 3박",
  guests: "성인 6명, 어린이 3명, 한 유닛 또는 가까운 유닛",
  searchUrl: residenceSearchUrl,
  caveat: "앞의 다섯 곳은 공식 구조를 확인했지만 목표 날짜 재고와 가격은 확인하지 않았습니다. 마지막 한 곳은 구조 탐색 후보이며 실제 매물이 아닙니다.",
  evidenceLabel: "공식 구조 5곳, 탐색 후보 1곳, 실가격 0곳",
  priceRangeLabel: "2027년 총액 범위 미산정",
  exactAvailableCount: 0,
  unavailableCount: 0,
  lowestExactTotal: null,
  highestExactTotal: null,
  options: residenceSpecs.map((item, index) => ({
    rank: index + 1, id: item.id, mediaId: item.id, name: item.name, availability: item.id === "residence_tafana" ? "unverified" : "candidate",
    fit: item.fit, capacity: item.capacity, bedrooms: item.bedrooms, beds: item.beds, baths: item.baths, neighborhood: item.neighborhood,
    reason: item.reason, caution: item.caution, cancellation: "취소 정책 미확인, 무료 취소 가능 기한을 결제 화면에서 확인",
    cancellationLimit: "동일 날짜와 정확한 객실 조합이 열리기 전에는 취소 조건도 확정할 수 없습니다.", price: "2027 가격 미확인",
    priceLabel: "3박 총액 미확인", nightlyLabel: "1박 평균 계산 안 함", exactTotal: null, observedAt: CHECKED_AT, photoCheckedAt: CHECKED_AT,
    availabilityEvidence: item.id === "residence_tafana" ? "실매물을 특정하지 않은 구조 탐색 후보입니다." : "공식 객실 구조만 확인했고 목표 날짜의 예약 가능 상태는 확인하지 않았습니다.",
    priceEvidence: "관측 가격 없음, 추정값 없음", taxesAndFees: "세금과 수수료 미확인", url: item.url,
    photoCaption: "숙소 구조 또는 권역 참고 이미지", ...imageFields(item.id)
  }))
};

export const rentalChecklist = [
  "열기구는 숙박과 분리해 취소와 환불 규정을 확인하고 첫 온전한 아침에만 기본 예약합니다.",
  "숙소는 성인 6명과 만 9세, 7세, 6세의 객실별 배치를 한 견적에 적게 합니다.",
  "동굴 객실은 각 침실의 외부 창, 강제 환기, 난방과 습기 상태를 최근 영상으로 확인합니다.",
  "연결 또는 인접 객실은 요청이 아니라 보장 문구인지 확인합니다.",
  "경사, 외부 계단, 야간 조명과 16석급 차량의 문앞 승하차 위치를 확인합니다.",
  "실제 침대 9개와 욕실 수를 확인하고 소파베드는 아이별 동의 없이 계산하지 않습니다.",
  "실내 수영장은 어린이 입장 시간, 수온, 보호자 동반과 잠금장치를 확인합니다.",
  "지하도시 좁은 통로를 힘들어하는 가족은 지상에서 기다릴 수 있도록 차량과 만남 지점을 정합니다.",
  "NAV와 ASR 모두 항공 시각, 수하물, 숙소까지 차량 시간을 더해 비교합니다.",
  "핵심 조건을 서면 확약하지 못하거나 전원이 추위와 새벽 이동을 원하지 않으면 카파도키아 분기를 중단합니다."
];

const baseNeeds = {
  parents: "풍경을 수집하기보다 카파도키아의 지질과 생활사를 두 장면으로 이해하기",
  kids: "짧은 동굴 탐험이나 도예 뒤 따뜻한 숙소 휴식",
  together: "아홉 명이 무리 없이 같은 프레임에 들어오는 전망 한 곳",
  recovery: "15시 전후 숙소 복귀와 저녁 전 최소 90분 휴식"
};

export const itinerary = [
  {
    date: "2027-03-26", dow: "금", title: "NAV에서 내려 전망 하나만", zone: "IST → NAV → Göreme", intensity: 1, stay: "카파도키아 1/3박", featuredPlace: "goreme_panorama",
    main: "항공과 체크인만 확정하고 날씨가 좋을 때 Göreme Panorama를 20분 봅니다.",
    timeline: ["오전 IST에서 9명 함께 출발", "NAV에서 어린이 좌석 3개를 갖춘 16석급 차량 탑승", "숙소 체크인과 객실 환기, 난방, 계단 확인", "일몰 전 Göreme Panorama 20분, 피곤하거나 길이 얼면 생략", "18시 숙소 또는 가까운 식당에서 조기 저녁"],
    rain: "전망을 빼고 숙소에서 쉽니다.", low: "체크인과 저녁만 남깁니다.", transport: "IST-NAV 직항과 NAV-숙소 전용차",
    notes: "NAV 시간대가 불리할 때만 ASR을 비교합니다. 도착일에는 계곡과 지하도시를 넣지 않습니다.", whyNow: "첫날을 비워야 다음 날 새벽 선택과 박물관 동선이 무너지지 않습니다.", needs: baseNeeds,
    variants: { focused: { dow: "금", title: "체크인 뒤 Pigeon Valley 입구", zone: "IST → NAV → Uçhisar", intensity: 1, stay: "카파도키아 1/3박", featuredPlace: "pigeon_valley", main: "정시 도착과 마른 길을 모두 만족할 때만 Pigeon Valley 전망 입구를 30분 봅니다.", timeline: ["IST-NAV 이동", "전용차로 숙소 체크인", "90분 휴식", "Pigeon Valley 전망 입구 30분", "18시 조기 저녁"], rain: "외출하지 않습니다.", low: "Göreme Panorama 차량 정차 15분으로 줄입니다.", transport: "IST-NAV와 같은 전용차", notes: "계곡 트레킹은 하지 않습니다.", whyNow: "도착 지연을 흡수하면서 지형의 첫 인상만 얻습니다.", needs: baseNeeds } }
  },
  {
    date: "2027-03-27", dow: "토", title: "벌룬은 선택, 괴레메는 확정", zone: "Göreme", intensity: 2, stay: "카파도키아 2/3박", featuredPlace: "goreme_open_air",
    main: "원하는 사람만 허가된 열기구를 시도하고, 전원 일정의 핵심은 늦은 아침 Göreme Open Air Museum 한 곳으로 둡니다.",
    timeline: ["전날 18시와 당일 새벽 공식 비행 신호 확인", "희망자만 열기구 또는 전원 지상 관람, 취소돼도 추격하지 않음", "숙소 조식과 90분 휴식", "10:30 Göreme Open Air Museum 90분", "13시 점심 뒤 15시 전 숙소 복귀"],
    rain: "열기구와 야외 박물관을 취소하고 Nevşehir Museum 또는 숙소 휴식 가운데 하나만 고릅니다.", low: "열기구를 건너뛰고 Göreme Open Air Museum의 핵심 구역만 60분 봅니다.", transport: "허가 업체 픽업과 반일 전용차",
    notes: "녹색 신호도 최종 이륙 보장이 아닙니다. 아이의 탑승 가능 나이, 키와 운영사 규칙을 서면 확인합니다.", whyNow: "첫 온전한 아침에 시도해야 다음 날을 취소 시 재검토 후보로 남길 수 있습니다.", needs: baseNeeds,
    variants: { focused: { dow: "토", title: "괴레메와 Paşabağ", zone: "Göreme → Paşabağ", intensity: 3, stay: "카파도키아 2/3박", featuredPlace: "pasabag", main: "괴레메 야외박물관 뒤 충분히 쉬고 Paşabağ의 요정 굴뚝 구역을 60분만 봅니다.", timeline: ["열기구 또는 지상 관람", "조식과 90분 휴식", "10:30 Göreme Open Air Museum 90분", "12:30 점심", "14:00 Paşabağ 60분", "16시 숙소 복귀"], rain: "두 야외 장소를 모두 취소하고 실내 한 곳만 봅니다.", low: "Paşabağ를 빼고 괴레메 뒤 바로 돌아갑니다.", transport: "기사 포함 16석급 차량", notes: "Dark Church는 현장 대기와 아이 체력을 보고 선택합니다.", whyNow: "서로 가까운 북부 두 장소만 묶어 차량 시간을 줄입니다.", needs: baseNeeds } }
  },
  {
    date: "2027-03-28", dow: "일", title: "지하도시는 하나만", zone: "Kaymaklı", intensity: 2, stay: "카파도키아 3/3박", featuredPlace: "kaymakli",
    main: "Kaymaklı 한 곳만 보고 좁은 통로가 힘든 가족은 지상에서 기다립니다. 공식 안내상 8개 층 중 현재 조명된 4개 층을 봅니다.",
    timeline: ["전날 열기구가 취소됐고 전원이 원할 때만 새벽 재시도", "조식 뒤 09:30 출발", "10:15 Kaymaklı 75분, 지상 대기조 운영", "12:00 점심", "14:00 숙소 복귀와 자유시간", "18시 마지막 저녁"],
    rain: "도로가 안전하면 Kaymaklı만 진행하고 계곡은 넣지 않습니다.", low: "지하도시를 건너뛰고 Nevşehir Museum과 카페로 바꿉니다.", transport: "기사 포함 16석급 차량 반일",
    notes: "Derinkuyu를 같은 날 추가하지 않습니다. 호흡기 문제, 폐소공포나 무릎 통증이 있으면 지상 대안을 선택합니다.", whyNow: "풍경 다음 날 생활사의 다른 층을 보되 이동과 에너지를 한 곳에만 씁니다.", needs: baseNeeds,
    variants: { focused: { dow: "일", title: "Kaymaklı와 Avanos 도예", zone: "Kaymaklı → Avanos", intensity: 3, stay: "카파도키아 3/3박", featuredPlace: "avanos_pottery", main: "Kaymaklı 뒤 긴 계곡 대신 Avanos에서 예약한 도예 시연과 어린이 체험을 60분 합니다.", timeline: ["취소 시에만 열기구 재시도", "09:30 Kaymaklı 출발", "10:15 지하도시 75분", "12:00 점심", "14:00 Avanos 도예 60분", "16시 숙소 복귀"], rain: "도로 상태가 나쁘면 Nevşehir Museum 한 곳으로 축소합니다.", low: "도예를 빼고 지하도시 뒤 숙소로 갑니다.", transport: "기사 포함 16석급 차량 8시간", notes: "Ihlara, Derinkuyu와 긴 계곡은 추가하지 않습니다.", whyNow: "지하 공간과 손으로 만드는 체험을 대비시키되 걷는 양을 늘리지 않습니다.", needs: baseNeeds } }
  },
  {
    date: "2027-03-29", dow: "월", title: "벌룬 없이 IST로 돌아감", zone: "숙소 → NAV → IST", intensity: 1, stay: "이스탄불 복귀", featuredPlace: "uchisar_castle",
    main: "열기구를 넣지 않고 항공 출발 2시간 30분에서 3시간 전에 숙소를 떠납니다.",
    timeline: ["느린 아침과 짐 정리", "객실과 차량 분실물 확인", "항공 출발 2시간 30분에서 3시간 전 숙소 출발", "NAV 국내선 수속", "IST 도착 뒤 기존 숙소 복귀"],
    rain: "일정 변화 없이 차량 승하차를 출입구에서 처리합니다.", low: "체크아웃과 공항 이동만 합니다.", transport: "숙소-NAV 전용차와 NAV-IST 직항",
    notes: "출발일 열기구는 취소, 지연과 수속 위험 때문에 금지합니다.", whyNow: "이스탄불의 기존 숙소로 돌아가는 날을 완충일로 지킵니다.", needs: baseNeeds,
    variants: { focused: { dow: "월", title: "늦은 비행이면 Uçhisar 전망 15분", zone: "숙소 → Uçhisar → NAV", intensity: 1, stay: "이스탄불 복귀", featuredPlace: "uchisar_castle", main: "15시 이후 비행이고 길이 마를 때만 성 아래 전망 지점에서 15분 멈춥니다.", timeline: ["느린 아침과 체크아웃", "성 아래 전망 15분", "바로 NAV 이동", "국내선 수속", "IST 복귀"], rain: "전망을 생략합니다.", low: "체크아웃과 공항 이동만 합니다.", transport: "체크아웃부터 NAV까지 같은 전용차", notes: "성 정상 등반은 하지 않습니다.", whyNow: "공항 여유를 침해하지 않는 마지막 장면만 남깁니다.", needs: baseNeeds } }
  }
];

export const mealSuggestions = {
  "2027-03-26": "숙소와 가까운 Han, Seten 또는 호텔 식당을 18시로 잡고 지연 시 호텔 식사로 바꿉니다.",
  "2027-03-27": "Göreme 일정 뒤 Seten, Turkish Ravioli 또는 Kilim 가운데 한 곳만 예약합니다.",
  "2027-03-28": "Kaymaklı 동선 점심과 마지막 저녁만 예약하고 Avanos를 가면 Avanova를 우선 확인합니다.",
  "2027-03-29": "숙소 조식 뒤 공항에서 간단히 먹고 출발일 식당 예약은 하지 않습니다."
};

const placeBase = {
  operatingStatus: "open_conditions_vary", groupFit: "9명은 두 조로 나눠 움직일 수 있음", reservation: "2027년 운영과 9인 단체 조건 재확인"
};
const p = (spec) => place({ ...placeBase, bestFor: "동선에 맞는 한 장면", kids: "관람 상한을 정하고 아이가 지치면 즉시 줄입니다.", skipIf: "눈, 비, 강풍 또는 피로가 안전을 해칠 때", warning: "3월 눈, 얼음, 진흙과 2027년 운영을 방문 전에 재확인", familyTip: "한 날의 비슷한 장소를 하나만 선택합니다.", ...spec });

export const places = [
  p({ id: "goreme_open_air", mediaId: "goreme_open_air", name: "Göreme Open Air Museum", zone: "Göreme", category: "세계유산", lat: 38.6402, lng: 34.8458, duration: "90분", energy: 2, rain: false, why: "암굴 교회와 벽화를 한 구역에서 보는 카파도키아의 핵심입니다.", official: goremeOfficial, mapQuery: "Goreme Open Air Museum", bestFor: "첫 온전한 날의 확정 핵심", warning: "야외 경사, 계단과 교회별 혼잡", familyTip: "모든 교회보다 핵심 동선을 90분 안에 끝냅니다." }),
  p({ id: "dark_church", mediaId: "dark_church", name: "Dark Church", zone: "Göreme", category: "교회", lat: 38.6405, lng: 34.8455, duration: "20분", energy: 2, rain: true, why: "보존 상태가 뛰어난 벽화를 보는 야외박물관 내부 선택 장소입니다.", official: "https://muze.gov.tr/muze-detay?DistId=GRM&SectionId=GRM02", mapQuery: "Dark Church Goreme", skipIf: "추가 입장 대기나 계단이 가족 흐름을 깨는 경우", familyTip: "현장 대기가 짧을 때만 추가합니다." }),
  p({ id: "tokali_church", mediaId: "tokali_church", name: "Tokalı Church", zone: "Göreme", category: "교회", lat: 38.6389, lng: 34.8464, duration: "20분", energy: 1, rain: true, why: "야외박물관 입구 맞은편에서 카파도키아 벽화의 규모를 봅니다.", official: goremeOfficial, mapQuery: "Tokali Church Goreme" }),
  p({ id: "zelve", mediaId: "zelve", name: "Zelve Open Air Museum", zone: "Avanos 북부", category: "세계유산", lat: 38.6737, lng: 34.8626, duration: "90분", energy: 3, rain: false, why: "세 계곡의 암굴 주거 흔적을 넓게 걷는 장소입니다.", official: zelveOfficial, mapQuery: "Zelve Open Air Museum", skipIf: "Göreme Open Air Museum을 이미 충분히 보았거나 길이 젖은 경우", warning: "고르지 않은 길과 낙석 통제 구역", familyTip: "3박 일정에서는 Göreme와 둘 다 필수로 잡지 않습니다." }),
  p({ id: "pasabag", mediaId: "pasabag", name: "Paşabağ", zone: "Avanos 북부", category: "지질", lat: 38.6795, lng: 34.8561, duration: "45-60분", energy: 2, rain: false, why: "버섯 모양 요정 굴뚝을 짧은 동선에서 가까이 봅니다.", official: zelveOfficial, mapQuery: "Pasabag Cappadocia", bestFor: "집중 일정의 두 번째 장면" }),
  p({ id: "devrent", mediaId: "devrent", name: "Devrent Valley", zone: "Avanos 동부", category: "지질", lat: 38.6565, lng: 34.9063, duration: "30분", energy: 1, rain: false, why: "동물 모양 바위를 찾는 짧은 상상 놀이가 가능합니다.", official: goCappadocia, mapQuery: "Devrent Valley", warning: "공식 탐방로보다 도로변 흙길 성격이 강함" }),
  p({ id: "cavusin", mediaId: "cavusin", name: "Çavuşin Village", zone: "Çavuşin", category: "마을", lat: 38.6733, lng: 34.8394, duration: "45분", energy: 2, rain: false, why: "암벽 마을과 교회를 아래에서 보는 짧은 정차입니다.", official: goCappadocia, mapQuery: "Cavusin Village", warning: "상부 폐허의 난간과 바닥 상태가 불안정할 수 있음", familyTip: "아이와 상부 폐허까지 오르지 않습니다." }),
  p({ id: "uchisar_castle", mediaId: "uchisar_castle", name: "Uçhisar Castle", zone: "Uçhisar", category: "전망", lat: 38.6305, lng: 34.8051, duration: "45분", energy: 3, rain: false, why: "카파도키아 권역을 한눈에 읽는 높은 전망점입니다.", official: "https://www.uchisar.bel.tr/uchisar-kalesi/", mapQuery: "Uchisar Castle", warning: "가파른 계단, 노출된 가장자리와 강풍", familyTip: "출발일에는 정상 대신 성 아래 전망만 봅니다." }),
  p({ id: "pigeon_valley", mediaId: "pigeon_valley", name: "Pigeon Valley Viewpoint", zone: "Uçhisar", category: "전망", lat: 38.6254, lng: 34.8065, duration: "30분", energy: 1, rain: false, why: "비둘기집이 새겨진 계곡을 트레킹 없이 봅니다.", official: goCappadocia, mapQuery: "Pigeon Valley Viewpoint", bestFor: "도착일의 저강도 전망" }),
  p({ id: "love_valley", mediaId: "love_valley", name: "Love Valley Viewpoint", zone: "Göreme 북부", category: "전망", lat: 38.6653, lng: 34.8208, duration: "30분", energy: 1, rain: false, why: "독특한 침식 기둥을 차량 접근 전망에서 봅니다.", official: goCappadocia, mapQuery: "Love Valley Viewpoint", warning: "흙길과 절벽 가장자리" }),
  p({ id: "red_valley", mediaId: "red_valley", name: "Red Valley Viewpoint", zone: "Ortahisar", category: "계곡", lat: 38.6482, lng: 34.8840, duration: "45분", energy: 2, rain: false, why: "붉은 응회암 능선과 일몰 색을 봅니다.", official: goCappadocia, mapQuery: "Red Valley Viewpoint", warning: "일몰 뒤 급격한 추위와 어두운 흙길", familyTip: "긴 하이킹 대신 전망점 왕복만 합니다." }),
  p({ id: "rose_valley", mediaId: "rose_valley", name: "Rose Valley", zone: "Göreme 동부", category: "계곡", lat: 38.6534, lng: 34.8644, duration: "60-120분", energy: 3, rain: false, why: "색이 다른 암석과 동굴 교회를 잇는 대표 계곡입니다.", official: goCappadocia, mapQuery: "Rose Valley Cappadocia", skipIf: "같은 날 지하도시 또는 다른 긴 계곡을 본 경우", familyTip: "전 구간 대신 마른 입구 45분 왕복만 검토합니다." }),
  p({ id: "goreme_panorama", mediaId: "goreme_panorama", name: "Göreme Panorama", zone: "Göreme", category: "전망", lat: 38.6370, lng: 34.8177, duration: "15-25분", energy: 1, rain: false, why: "차에서 내려 권역 전체의 지형을 가장 짧게 이해합니다.", official: goCappadocia, mapQuery: "Goreme Panorama", bestFor: "도착일과 저체력일" }),
  p({ id: "ortahisar_castle", mediaId: "ortahisar_castle", name: "Ortahisar Castle", zone: "Ortahisar", category: "전망", lat: 38.6200, lng: 34.8647, duration: "45분", energy: 3, rain: false, why: "마을 중심의 거대한 암봉과 주변 석조 마을을 봅니다.", official: goCappadocia, mapQuery: "Ortahisar Castle", warning: "상부 계단과 난간 상태", familyTip: "정상보다 광장과 외관을 우선합니다." }),
  p({ id: "three_beauties", mediaId: "three_beauties", name: "Three Beauties", zone: "Ürgüp", category: "전망", lat: 38.6410, lng: 34.9095, duration: "20분", energy: 1, rain: false, why: "세 개의 대표 요정 굴뚝을 도로변 전망에서 짧게 봅니다.", official: goCappadocia, mapQuery: "Three Beauties Cappadocia" }),
  p({ id: "avanos_pottery", mediaId: "avanos_pottery", name: "Avanos Pottery Workshop", zone: "Avanos", category: "체험", lat: 38.7182, lng: 34.8471, duration: "60분", energy: 1, rain: true, why: "붉은 점토를 쓰는 지역 전통을 아이가 직접 손으로 경험합니다.", official: "https://goturkiye.com/culturaljourneys/pottery-making", mapQuery: "Avanos pottery workshop", bestFor: "비와 추위의 실내 체험", reservation: "어린이 3명 체험과 9인 좌석을 사전 예약", familyTip: "판매 설명보다 60분 체험 시간을 먼저 합의합니다." }),
  p({ id: "kizilirmak", mediaId: "kizilirmak", name: "Kızılırmak Riverside", zone: "Avanos", category: "산책", lat: 38.7170, lng: 34.8467, duration: "30분", energy: 1, rain: false, why: "도예 뒤 강변을 평지로 짧게 걷습니다.", official: goCappadocia, mapQuery: "Kizilirmak Avanos", warning: "강변 바람과 젖은 데크" }),
  p({ id: "nevsehir_museum", mediaId: "nevsehir_museum", name: "Nevşehir Museum", zone: "Nevşehir", category: "박물관", lat: 38.6246, lng: 34.7140, duration: "60분", energy: 1, rain: true, why: "야외가 불가능한 날 지역 고고학을 실내에서 봅니다.", official: "https://muze.gov.tr/", mapQuery: "Nevsehir Museum", bestFor: "우천과 저체력 대안" }),
  p({ id: "kaymakli", mediaId: "kaymakli", name: "Kaymaklı Underground City", zone: "Kaymaklı", category: "지하도시", lat: 38.4598, lng: 34.7510, duration: "60-75분", energy: 3, rain: true, why: "생활 공간, 저장고와 환기 구조를 통해 지하 공동체를 이해합니다.", official: kaymakliOfficial, mapQuery: "Kaymakli Underground City", warning: "좁고 낮은 통로, 공식 안내상 8개 층 중 현재 조명된 4개 층", skipIf: "폐소공포, 호흡기 문제, 무릎 통증 또는 아이가 거부할 때", familyTip: "지상 대기조와 만남 시간을 정하고 Derinkuyu를 추가하지 않습니다." }),
  p({ id: "derinkuyu", mediaId: "derinkuyu", name: "Derinkuyu Underground City", zone: "Derinkuyu", category: "지하도시", lat: 38.3735, lng: 34.7340, duration: "75-90분", energy: 3, rain: true, why: "공식 안내상 약 85m 깊이의 대규모 지하도시입니다.", official: derinkuyuOfficial, mapQuery: "Derinkuyu Underground City", warning: "깊고 좁은 통로와 긴 차량 이동", skipIf: "Kaymaklı를 일정에 넣은 경우", familyTip: "둘 중 하나만 선택하며 이번 기본 일정은 Kaymaklı입니다." }),
  p({ id: "ozkonak", mediaId: "ozkonak", name: "Özkonak Underground City", zone: "Avanos 북부", category: "지하도시", lat: 38.8122, lng: 34.8403, duration: "60분", energy: 3, rain: true, why: "Avanos와 묶기 쉬운 북부 지하도시 대안입니다.", official: "https://muze.gov.tr/", mapQuery: "Ozkonak Underground City", skipIf: "다른 지하도시를 이미 선택한 경우" }),
  p({ id: "ihlara", mediaId: "ihlara", name: "Ihlara Valley", zone: "Aksaray", category: "장거리 계곡", lat: 38.2508, lng: 34.3016, duration: "반일 이상", energy: 3, rain: false, why: "멜렌디즈 강과 암굴 교회를 잇는 14km 계곡입니다.", official: "https://muze.gov.tr/muze-detay?DistId=IH1&SectionId=IH101", mapQuery: "Ihlara Valley", warning: "공식 안내의 주 진입 계단 382개와 긴 왕복 이동", skipIf: "3박 가족 기본 일정", familyTip: "이번 일정에서는 제외하고 별도 5박 이상 여행에 둡니다." }),
  p({ id: "agacalti", mediaId: "agacalti", name: "Ağaçaltı Church", zone: "Ihlara", category: "교회", lat: 38.2489, lng: 34.3023, duration: "20분", energy: 3, rain: true, why: "Ihlara 계단 아래의 대표 암굴 교회입니다.", official: "https://muze.gov.tr/muze-detay?DistId=IH1&SectionId=IH101", mapQuery: "Agacalti Church Ihlara", skipIf: "Ihlara를 별도 하루로 잡지 않은 경우" }),
  p({ id: "belisirma", mediaId: "belisirma", name: "Belisırma", zone: "Ihlara", category: "마을", lat: 38.2904, lng: 34.2868, duration: "60분", energy: 2, rain: false, why: "Ihlara 중간 지점의 강변 마을입니다.", official: "https://muze.gov.tr/muze-detay?DistId=IH1&SectionId=IH101", mapQuery: "Belisirma", skipIf: "Ihlara 전용 하루가 없는 경우" }),
  p({ id: "selime", mediaId: "selime", name: "Selime Cathedral", zone: "Aksaray", category: "수도원", lat: 38.3007, lng: 34.2582, duration: "60분", energy: 3, rain: false, why: "거대한 바위 수도원 복합체를 봅니다.", official: "https://muze.gov.tr/", mapQuery: "Selime Cathedral", warning: "가파른 암반과 불충분한 난간", skipIf: "Ihlara 장거리일을 따로 잡지 않은 경우" }),
  p({ id: "asikli_hoyuk", mediaId: "asikli_hoyuk", name: "Aşıklı Höyük", zone: "Aksaray", category: "선사 유적", lat: 38.3504, lng: 34.2305, duration: "60분", energy: 2, rain: false, why: "중앙아나톨리아 초기 정착의 긴 시간축을 보여 줍니다.", official: "https://whc.unesco.org/en/tentativelists/5722/", mapQuery: "Asikli Hoyuk", skipIf: "장거리 역사일에 가족 전체가 동의하지 않은 경우" }),
  p({ id: "mustafapasa", mediaId: "mustafapasa", name: "Mustafapaşa", zone: "Mustafapaşa", category: "마을", lat: 38.5852, lng: 34.8989, duration: "60분", energy: 2, rain: false, why: "석조 주택과 옛 그리스계 마을의 결을 봅니다.", official: goCappadocia, mapQuery: "Mustafapasa Cappadocia" }),
  p({ id: "gomeda", mediaId: "gomeda", name: "Gomeda Valley", zone: "Mustafapaşa", category: "계곡", lat: 38.5678, lng: 34.8743, duration: "90-150분", energy: 3, rain: false, why: "사람이 비교적 적은 계곡과 암굴 흔적을 걷습니다.", official: goCappadocia, mapQuery: "Gomeda Valley", warning: "진흙, 물길과 불명확한 일부 탐방로", skipIf: "길이 젖었거나 같은 날 지하도시를 보는 경우" }),
  p({ id: "soganli", mediaId: "soganli", name: "Soğanlı Valley", zone: "Kayseri 남부", category: "장거리 계곡", lat: 38.3393, lng: 35.0377, duration: "반일", energy: 3, rain: false, why: "암굴 교회와 조용한 마을 풍경을 봅니다.", official: goCappadocia, mapQuery: "Soganli Valley", skipIf: "3박 가족 기본 일정", familyTip: "별도 하루를 쓸 수 있는 긴 여행에만 넣습니다." }),
  p({ id: "sobesos", mediaId: "sobesos", name: "Sobesos Ancient City", zone: "Şahinefendi", category: "유적", lat: 38.4888, lng: 34.9539, duration: "45분", energy: 2, rain: false, why: "모자이크가 남은 로마 시대 정착지를 봅니다.", official: "https://muze.gov.tr/", mapQuery: "Sobesos Ancient City", skipIf: "남부 장거리 동선을 따로 잡지 않은 경우" })
];

const d = (spec) => dining({ meal: "점심, 저녁", reviewPros: ["현재 공개 채널이나 지도에서 장소와 메뉴 성격을 확인할 후보", "9명은 한 테이블보다 두 테이블 배치도 허용하면 운영이 쉬움"], reviewCaution: "9인 좌석, 어린이 의자, 순한 메뉴와 계단을 직접 확인해야 합니다.", reservation: "9명과 어린이 3명을 명시해 전날 예약", ...spec });

export const diningSpots = [
  d({ rank: 1, id: "dining_seten", mediaId: "dining_seten", name: "Seten Restaurant", type: "restaurant", zone: "Göreme", neighborhood: "Aydınlı", lat: 38.6438, lng: 34.8249, cuisine: "아나톨리아, 메제", kidFit: "상", why: "괴레메 핵심 동선에서 전통 음식과 넓은 메뉴를 한 번에 고르기 좋습니다.", officialUrl: "https://www.setenrestaurant.com/", mapQuery: "Seten Restaurant Goreme" }),
  d({ rank: 2, id: "dining_kilim", mediaId: "dining_kilim", name: "Kilim Cave Restaurant", type: "restaurant", zone: "Göreme", neighborhood: "중심", lat: 38.6432, lng: 34.8303, cuisine: "튀르키예 가정식, 항아리 케밥", kidFit: "상", why: "괴레메에서 가족이 나누기 쉬운 전통 메뉴 후보입니다.", officialUrl: "https://kilimcaverestaurant.com/", mapQuery: "Kilim Cave Restaurant Goreme" }),
  d({ rank: 3, id: "dining_shecooks", mediaId: "dining_shecooks", name: "SheCooks Cappadocia", type: "restaurant", zone: "Uçhisar", neighborhood: "마을", lat: 38.6292, lng: 34.8068, cuisine: "예약제 홈쿠킹", kidFit: "상", why: "한정된 손님에게 정해진 코스를 내는 구조라 9인 가족 식사를 통제하기 좋습니다.", officialUrl: "https://shecookscappadocia.com/en", mapQuery: "SheCooks Cappadocia" }),
  d({ rank: 4, id: "dining_ravioli", mediaId: "dining_ravioli", name: "Turkish Ravioli Restaurant", type: "restaurant", zone: "Göreme", neighborhood: "중심", lat: 38.6430, lng: 34.8293, cuisine: "만트, 가정식", kidFit: "상", why: "아이들이 익숙하게 먹기 쉬운 만트와 단순한 현지식을 고를 수 있습니다.", officialUrl: "https://turkishravioli.com/", mapQuery: "Turkish Ravioli Restaurant Goreme" }),
  d({ rank: 5, id: "dining_rocks", mediaId: "dining_rocks", name: "Rocks Terrace Restaurant", type: "restaurant", zone: "Göreme", neighborhood: "중심", lat: 38.6425, lng: 34.8308, cuisine: "그릴, 튀르키예식", kidFit: "상", why: "그릴과 피데 계열로 세대별 주문을 나누기 쉽습니다.", officialUrl: "https://rocksrestaurantgoreme.com/", mapQuery: "Rocks Terrace Restaurant Goreme" }),
  d({ rank: 6, id: "dining_lalinda", mediaId: "dining_lalinda", name: "La Linda Terrace", type: "restaurant", zone: "Göreme", neighborhood: "중심", lat: 38.6418, lng: 34.8297, cuisine: "튀르키예식, 그릴", kidFit: "상", why: "괴레메 일정 뒤 이동을 늘리지 않는 가족 저녁 후보입니다.", officialUrl: "https://lalindagoreme.com/", mapQuery: "La Linda Terrace Goreme" }),
  d({ rank: 7, id: "dining_aysel", mediaId: "dining_aysel", name: "Aysel Inn Restaurant", type: "restaurant", zone: "Göreme", neighborhood: "중심", lat: 38.6439, lng: 34.8312, cuisine: "튀르키예 가정식", kidFit: "상", why: "숙소형 식당의 편안한 운영을 기대할 수 있는 후보입니다.", officialUrl: "https://www.ayselinnhouse.com/en/restaurant", mapQuery: "Aysel Inn Restaurant Goreme" }),
  d({ rank: 8, id: "dining_afara", mediaId: "dining_afara", name: "Afara Restaurant", type: "restaurant", zone: "Göreme", neighborhood: "중심", lat: 38.6441, lng: 34.8299, cuisine: "아나톨리아, 채식 선택", kidFit: "상", why: "현지식과 채식 선택을 함께 조율하기 좋습니다.", officialUrl: "https://www.afararestaurant.com/", mapQuery: "Afara Restaurant Cappadocia" }),
  d({ rank: 9, id: "dining_seki", mediaId: "dining_seki", name: "Seki Restaurant", type: "restaurant", zone: "Uçhisar", neighborhood: "Argos", lat: 38.6300, lng: 34.8065, cuisine: "현대 아나톨리아", kidFit: "중", why: "성인 중심의 한 번의 특별 저녁 후보이며 호텔 동선일 때만 효율적입니다.", officialUrl: "https://www.argosincappadocia.com/en/dine-wine/seki", mapQuery: "Seki Restaurant Cappadocia", reservation: "아이 메뉴와 9인 실내 테이블을 최소 일주일 전 문의" }),
  d({ rank: 10, id: "dining_nahita", mediaId: "dining_nahita", name: "Nahita", type: "restaurant", zone: "Uçhisar", neighborhood: "Argos", lat: 38.6302, lng: 34.8062, cuisine: "지역 제철 코스", kidFit: "중", why: "지역 재료 중심 코스를 원하는 성인에게 적합한 선택 식사입니다.", officialUrl: "https://www.argosincappadocia.com/en/dine-wine/nahita", mapQuery: "Nahita Cappadocia" }),
  d({ rank: 11, id: "dining_lila", mediaId: "dining_lila", name: "Lil’a Restaurant", type: "restaurant", zone: "Uçhisar", neighborhood: "Museum Hotel", lat: 38.6273, lng: 34.8018, cuisine: "고급 아나톨리아", kidFit: "확인 필요", why: "숙소 제한과 별개로 레스토랑의 어린이 입장 규칙을 확인할 성인 취향 후보입니다.", officialUrl: "https://www.museumhotel.com.tr/en/dining", mapQuery: "Lila Restaurant Museum Hotel" }),
  d({ rank: 12, id: "dining_millocal", mediaId: "dining_millocal", name: "Millocal Restaurant", type: "restaurant", zone: "Uçhisar", neighborhood: "Millstone", lat: 38.6290, lng: 34.8050, cuisine: "현대 튀르키예식", kidFit: "중", why: "우치히사르 숙박 때 차량 이동 없는 특별 저녁 대안입니다.", officialUrl: "https://millocalrestaurant.com/", mapQuery: "Millocal Restaurant Cappadocia" }),
  d({ rank: 13, id: "dining_revithia", mediaId: "dining_revithia", name: "Revithia", type: "restaurant", zone: "Ürgüp", neighborhood: "Kayakapi", lat: 38.6320, lng: 34.8957, cuisine: "테이스팅 메뉴", kidFit: "확인 필요", why: "Kayakapi 숙박 시 성인 중심의 예약제 저녁으로만 검토합니다.", officialUrl: "https://www.kayakapi.com/revithia", mapQuery: "Revithia Cappadocia" }),
  d({ rank: 14, id: "dining_prokopi", mediaId: "dining_prokopi", name: "Prokopi Restaurant", type: "restaurant", zone: "Ürgüp", neighborhood: "중심", lat: 38.6315, lng: 34.9110, cuisine: "튀르키예식, 그릴", kidFit: "상", why: "위르귀프에서 9인 가족이 전통 메뉴를 나누기 좋은 운영형 후보입니다.", officialUrl: "https://www.prokopirestaurant.com/", mapQuery: "Prokopi Restaurant Urgup" }),
  d({ rank: 15, id: "dining_ziggy", mediaId: "dining_ziggy", name: "Ziggy Cafe & Shoppe", type: "restaurant", zone: "Ürgüp", neighborhood: "중심", lat: 38.6311, lng: 34.9125, cuisine: "메제, 가벼운 식사", kidFit: "중", why: "여러 작은 접시를 나누는 저녁 후보입니다.", mapQuery: "Ziggy Cafe Urgup" }),
  d({ rank: 16, id: "dining_deringoller", mediaId: "dining_deringoller", name: "Deringöller Restaurant", type: "restaurant", zone: "Ürgüp", neighborhood: "중심", lat: 38.6318, lng: 34.9118, cuisine: "그릴, 현지식", kidFit: "상", why: "넓은 전통식 메뉴로 세대별 선택을 맞추기 좋습니다.", officialUrl: "https://deringoller.com.tr/", mapQuery: "Deringoller Restaurant Urgup" }),
  d({ rank: 17, id: "dining_han", mediaId: "dining_han", name: "Han Restaurant", type: "restaurant", zone: "Avanos", neighborhood: "강변권", lat: 38.7200, lng: 34.8380, cuisine: "뷔페, 튀르키예식", kidFit: "상", why: "대형 공간 운영 경험이 있어 9인과 아이 셋의 좌석 배치가 상대적으로 쉽습니다.", officialUrl: "https://www.han-restoran.com/", mapQuery: "Han Restaurant Avanos" }),
  d({ rank: 18, id: "dining_evranos", mediaId: "dining_evranos", name: "Evranos Restaurant", type: "restaurant", zone: "Avanos", neighborhood: "중심", lat: 38.7178, lng: 34.8463, cuisine: "튀르키예식, 문화 공연", kidFit: "중", why: "공연 식사를 원할 때만 소음과 종료 시간을 확인해 선택합니다.", officialUrl: "https://www.evranos.net/", mapQuery: "Evranos Restaurant Avanos" }),
  d({ rank: 19, id: "dining_avanova", mediaId: "dining_avanova", name: "Avanova", type: "restaurant", zone: "Avanos", neighborhood: "중심", lat: 38.7175, lng: 34.8470, cuisine: "현대 튀르키예식", kidFit: "상", why: "도예 체험 뒤 같은 권역에서 가족 점심을 해결하기 좋습니다.", officialUrl: "https://avanova.com.tr/", mapQuery: "Avanova Avanos" }),
  d({ rank: 20, id: "dining_bizim_ev", mediaId: "dining_bizim_ev", name: "Bizim Ev", type: "restaurant", zone: "Avanos", neighborhood: "중심", lat: 38.7168, lng: 34.8462, cuisine: "가정식", kidFit: "상", why: "단순한 현지 가정식으로 긴 메뉴 결정을 줄이는 후보입니다.", mapQuery: "Bizim Ev Avanos" }),
  d({ rank: 21, id: "dining_cafe_safak", mediaId: "dining_cafe_safak", name: "Cafe Şafak", type: "cafe", zone: "Göreme", neighborhood: "중심", lat: 38.6432, lng: 34.8308, cuisine: "커피, 조식", kidFit: "상", meal: "아침, 휴식", why: "괴레메에서 빠른 아침과 따뜻한 음료를 해결하는 후보입니다.", mapQuery: "Cafe Safak Goreme" }),
  d({ rank: 22, id: "dining_omurca", mediaId: "dining_omurca", name: "Omurca Art Cave Cafe", type: "cafe", zone: "Göreme", neighborhood: "중심", lat: 38.6435, lng: 34.8281, cuisine: "차, 가벼운 식사", kidFit: "중", meal: "휴식", why: "동굴 공간에서 짧게 쉬는 체험형 카페 후보입니다.", mapQuery: "Omurca Art Cave Cafe" }),
  d({ rank: 23, id: "dining_kings", mediaId: "dining_kings", name: "King’s Coffee Shop", type: "cafe", zone: "Göreme", neighborhood: "중심", lat: 38.6430, lng: 34.8300, cuisine: "커피, 디저트", kidFit: "중", meal: "휴식", why: "박물관 전후 따뜻한 음료를 위한 짧은 정지점입니다.", mapQuery: "Kings Coffee Shop Goreme" }),
  d({ rank: 24, id: "dining_coffeedocia", mediaId: "dining_coffeedocia", name: "Coffeedocia", type: "cafe", zone: "Göreme", neighborhood: "중심", lat: 38.6429, lng: 34.8306, cuisine: "커피, 브런치", kidFit: "상", meal: "아침, 휴식", why: "조식과 커피를 함께 고를 수 있는 중심가 후보입니다.", mapQuery: "Coffeedocia Goreme" }),
  d({ rank: 25, id: "dining_wish", mediaId: "dining_wish", name: "Wish Terrace", type: "cafe", zone: "Uçhisar", neighborhood: "전망권", lat: 38.6305, lng: 34.8060, cuisine: "음료, 디저트", kidFit: "중", meal: "휴식", why: "우치히사르 전망 동선에서 실내 좌석을 확인해 쉬는 후보입니다.", mapQuery: "Wish Terrace Uchisar" }),
  d({ rank: 26, id: "dining_sakli_kahve", mediaId: "dining_sakli_kahve", name: "Saklı Kahve", type: "cafe", zone: "Uçhisar", neighborhood: "마을", lat: 38.6298, lng: 34.8070, cuisine: "튀르키예 커피, 디저트", kidFit: "중", meal: "휴식", why: "성 아래 짧은 휴식과 따뜻한 음료 후보입니다.", officialUrl: "https://saklikahve.com/", mapQuery: "Sakli Kahve Uchisar" }),
  d({ rank: 27, id: "dining_milestone", mediaId: "dining_milestone", name: "Milestone Coffee", type: "cafe", zone: "Ürgüp", neighborhood: "중심", lat: 38.6317, lng: 34.9120, cuisine: "커피, 디저트", kidFit: "중", meal: "휴식", why: "위르귀프 산책에서 짧게 쉬는 후보입니다.", mapQuery: "Milestone Coffee Urgup" }),
  d({ rank: 28, id: "dining_ceviz", mediaId: "dining_ceviz", name: "Ceviz Cafe", type: "cafe", zone: "Ürgüp", neighborhood: "중심", lat: 38.6322, lng: 34.9113, cuisine: "차, 디저트", kidFit: "상", meal: "휴식", why: "아이와 간단한 디저트를 나누는 저강도 후보입니다.", mapQuery: "Ceviz Cafe Urgup" }),
  d({ rank: 29, id: "dining_kokhane", mediaId: "dining_kokhane", name: "Kökhane", type: "cafe", zone: "Avanos", neighborhood: "강변권", lat: 38.7180, lng: 34.8460, cuisine: "커피, 베이커리", kidFit: "상", meal: "휴식", why: "도예와 강변 사이에서 간단히 쉬는 후보입니다.", mapQuery: "Kokhane Avanos" }),
  d({ rank: 30, id: "dining_mado_avanos", mediaId: "dining_mado_avanos", name: "Mado Avanos", type: "cafe", zone: "Avanos", neighborhood: "중심", lat: 38.7174, lng: 34.8468, cuisine: "아이스크림, 디저트", kidFit: "상", meal: "휴식", why: "아이 셋이 예측 가능한 디저트를 고르기 쉬운 체인형 후보입니다.", mapQuery: "Mado Avanos" })
];

export const budgetModel = {
  people: 9, nights: 3, currency: "KRW", defaultStay: "modern-hotel-envelope", defaultOrigin: "ist-nav-envelope", contingencyRate: 0.15,
  observationStatus: "아래 금액은 실시간 가격이나 2027년 예측이 아니라 의사결정용 증분 지출 한도입니다. 열기구는 기본 총액에서 제외합니다.",
  stayOptions: [
    { id: "modern-hotel-envelope", label: "현대식 호텔 4실 계획 한도", familyTotal: 3000000, note: "객실당 1박 25만원을 둔 내부 계획 한도이며 관측 요금이 아닙니다." },
    { id: "cave-hotel-envelope", label: "동굴 호텔 4실 계획 한도", familyTotal: 4800000, note: "객실당 1박 40만원을 둔 상한선이며 실제 견적이 아닙니다." },
    { id: "residence-envelope", label: "9인 레지던스 계획 한도", familyTotal: 2700000, note: "전체 유닛 1박 90만원을 둔 내부 한도이며 실제 재고나 관측가가 아닙니다." }
  ],
  sharedLines: [
    { label: "NAV 왕복과 4일 전용차 한도", familyTotal: 1600000, note: "16석급 차량, 기사, 어린이 좌석 3개를 포함해 받을 견적의 계획 한도입니다." },
    { label: "입장권과 도예 체험 한도", familyTotal: 750000, note: "9명의 박물관, 지하도시와 체험을 위한 내부 한도이며 2027년 요금이 아닙니다." },
    { label: "이스탄불 대비 식사 증분 한도", familyTotal: 950000, note: "호텔 조식과 현지 식사 차이를 보수적으로 둔 계획값입니다." }
  ],
  origins: [{ id: "ist-nav-envelope", label: "IST-NAV 왕복 계획 한도", people: 9, flightPerPerson: 350000, note: "1인 왕복 35만원을 의사결정 한도로 둡니다. 실제 운임이나 예측치가 아닙니다." }],
  excludedOptions: [{ label: "선택 열기구 한도", familyTotal: 3600000, note: "운항, 어린이 탑승 가능 여부와 실제 견적을 모르는 선택 비용이라 기본 총액에서 제외합니다." }]
};

const currentTryKrw = 1577.57 / 55.9145;
const yearEnd2025TryKrw = 1696.94 / 50.4838;
const nominalChangeSinceYearEndPct = ((currentTryKrw / yearEnd2025TryKrw) - 1) * 100;
const julyTurkeyCpiYoY = 31.75;

export const fxStrategy = {
  checkedAt: CHECKED_AT, sourceDate: "2026-09-02",
  rates: { tryKrw: currentTryKrw, nominalChangeSinceYearEndPct, combinedCostChangePct: ((1 + nominalChangeSinceYearEndPct / 100) * (1 + julyTurkeyCpiYoY / 100) - 1) * 100 },
  headline: "리라 약세만으로 2027년 여행비가 싸진다고 볼 수 없습니다.",
  diagnosis: "ECB 2026년 9월 2일 교차환율은 1 TRY 약 28.22원입니다. 2025년 말보다 원화 기준 리라는 약 16% 낮지만, 터키의 2026년 7월 소비자물가는 전년 대비 31.75% 높았습니다. 서로 기간이 다른 단순 결합은 약 10.6% 상승이므로 가격 예측이 아니라 환율 할인 착시를 반박하는 스트레스 테스트로만 씁니다.",
  actions: [
    { rank: 1, title: "TRY와 EUR 견적 분리", body: "호텔과 열기구가 EUR로, 식당이 TRY로 제시하면 같은 환율 가정으로 섞지 않습니다.", tone: "primary" },
    { rank: 2, title: "DCC 거절", body: "현지 카드 단말기에서는 KRW 환산 대신 계약 통화를 선택하고 카드사 수수료를 따로 봅니다.", tone: "neutral" },
    { rank: 3, title: "선택 비용 분리", body: "열기구를 기본 여행비에서 빼고 취소돼도 이미 지출한 여행이 성립하는지 판단합니다.", tone: "warning" }
  ],
  sources: [
    { title: "ECB 2026-09-02 EUR 기준 KRW와 TRY", url: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html" },
    { title: "ECB 2025-12-31 기준 KRW와 TRY", url: "https://www.ecb.europa.eu/stats/exchange/eurofxref/shared/pdf/2025/12/20251231.pdf" },
    { title: "TÜİK 2026년 7월 소비자물가", url: "https://veriportali.tuik.gov.tr/Bulten/Index?dil=1&p=Tuketici-Fiyat-Endeksi-Temmuz-2026-58297" }
  ]
};

export const climate = {
  source: "튀르키예 기상청 Nevşehir 1991-2020 평년값",
  summary: "3월 평균 5.5°C, 평균 최고 10.9°C, 평균 최저 1.0°C입니다. 따뜻한 봄이 아니라 눈, 얼음, 비와 큰 일교차가 모두 가능한 겨울과 초봄의 경계입니다.",
  packing: ["방풍 방수 외투", "보온 내의와 겹쳐 입을 옷", "미끄럼 방지 방수 신발", "장갑과 모자", "아이 여벌 양말", "휴대용 보온 물병"],
  note: "장기 평년값은 2027년 예보가 아닙니다. 출발 7일 전 강수, 적설, 풍속과 도로 상태로 열기구와 계곡을 다시 판단합니다.",
  official: "https://www.mgm.gov.tr/veridegerlendirme/il-ve-ilceler-istatistik.aspx?k=H&m=NEVSEHIR"
};

export const sources = [
  { title: "GoTürkiye Cappadocia 볼거리", url: goCappadocia, checkedAt: CHECKED_AT },
  { title: "UNESCO Göreme National Park and the Rock Sites of Cappadocia", url: unescoCappadocia, checkedAt: CHECKED_AT },
  { title: "MGM Nevşehir 공식 기후 통계", url: climate.official, checkedAt: CHECKED_AT },
  { title: "Turkish Airlines Istanbul-Nevşehir 노선", url: "https://www.turkishairlines.com/en-tr/flights-from-istanbul-to-nevsehir", checkedAt: CHECKED_AT },
  { title: "Turkish Airlines Istanbul-Kayseri 노선", url: "https://www.turkishairlines.com/en-tr/flights-from-istanbul-to-kayseri", checkedAt: CHECKED_AT },
  { title: "카파도키아 공식 열기구 비행 신호", url: balloonStatus, checkedAt: CHECKED_AT },
  { title: "카파도키아 열기구 Slot Service Center", url: "https://hotairballoon.kapadokya.edu.tr/slot-hizmet-merkezi/", checkedAt: CHECKED_AT },
  { title: "SHGM 허가 열기구 운영사", url: "https://web.shgm.gov.tr/tr/s/80-balon-isletmeleri", checkedAt: CHECKED_AT },
  { title: "Göreme Open Air Museum", url: goremeOfficial, checkedAt: CHECKED_AT },
  { title: "Dark Church", url: "https://muze.gov.tr/muze-detay?DistId=GRM&SectionId=GRM02", checkedAt: CHECKED_AT },
  { title: "Zelve와 Paşabağ", url: zelveOfficial, checkedAt: CHECKED_AT },
  { title: "Kaymaklı Underground City", url: kaymakliOfficial, checkedAt: CHECKED_AT },
  { title: "Derinkuyu Underground City", url: derinkuyuOfficial, checkedAt: CHECKED_AT },
  { title: "Ihlara Valley", url: "https://muze.gov.tr/muze-detay?DistId=IH1&SectionId=IH101", checkedAt: CHECKED_AT },
  { title: "Uçhisar Castle Municipality", url: "https://www.uchisar.bel.tr/uchisar-kalesi/", checkedAt: CHECKED_AT },
  { title: "GoTürkiye Avanos pottery", url: "https://goturkiye.com/culturaljourneys/pottery-making", checkedAt: CHECKED_AT },
  { title: "DoubleTree Avanos 공식 정보", url: lodgingOptions[0].official, checkedAt: CHECKED_AT },
  { title: "Kayakapi 120 Kuşçular Konağı", url: lodgingOptions[1].official, checkedAt: CHECKED_AT },
  { title: "Cappadocia Marriott 공식 정보", url: lodgingOptions[2].official, checkedAt: CHECKED_AT },
  { title: "AJWA Cappadocia 객실", url: lodgingOptions[3].official, checkedAt: CHECKED_AT },
  { title: "Kelebek Family Suite", url: lodgingOptions[4].official, checkedAt: CHECKED_AT },
  { title: "Suhan Cappadocia", url: lodgingOptions[5].official, checkedAt: CHECKED_AT },
  { title: "Museum Hotel 아동 정책 확인", url: "https://www.relaischateaux.com/us/hotel/museum-hotel/", checkedAt: CHECKED_AT },
  { title: "ECB 공식 환율", url: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html", checkedAt: CHECKED_AT },
  { title: "TÜİK 2026년 7월 소비자물가", url: "https://veriportali.tuik.gov.tr/Bulten/Index?dil=1&p=Tuketici-Fiyat-Endeksi-Temmuz-2026-58297", checkedAt: CHECKED_AT }
];

export const heroImage = media.love_valley.image;
