import { media } from "./image-catalog.mjs";

export const CHECKED_AT = "2026-09-03";
export const financeCheckedAt = CHECKED_AT;

const googleMaps = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

function imageFields(mediaId, fallbackId = "kaleici") {
  const item = media[mediaId];
  if (!item) throw new Error(`Unknown Antalya media id: ${mediaId}`);
  return {
    mediaId,
    ...item,
    imageFallback: media[fallbackId].image
  };
}

function officialEvidence(url, familyTip) {
  return {
    summary: "독립 후기 표본을 별도로 분석하지 않았습니다. 아래 판단은 공식 운영 정보와 동선 조건만 반영합니다.",
    likedLabel: "확인된 점",
    liked: ["공식 페이지 또는 공공기관 자료에서 장소의 성격과 현재 운영 상태를 확인했습니다."],
    dislikedLabel: "아직 확인할 점",
    disliked: ["2027년 운영시간, 공사, 단체 입장 조건은 아직 확정 정보가 아닙니다."],
    familyTip,
    sources: [{ platform: "공식 정보", url, checkedAt: CHECKED_AT }]
  };
}

function place(spec) {
  return {
    ...spec,
    detailLabel: "공식 운영 정보와 가족 판단",
    checkedAt: CHECKED_AT,
    maps: googleMaps(spec.mapQuery),
    ...imageFields(spec.mediaId),
    reviews: officialEvidence(spec.official, spec.familyTip)
  };
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
    ...imageFields(spec.mediaId)
  };
}

const hotelCoordinates = {
  hotel_akra: { lat: 36.8644, lng: 30.7290 },
  hotel_megasaray: { lat: 36.8584, lng: 30.6258 },
  hotel_doubletree: { lat: 36.8950, lng: 30.7080 },
  hotel_ramada_plaza: { lat: 36.8792, lng: 30.7107 },
  hotel_lara_barut: { lat: 36.8577, lng: 30.8790 },
  hotel_porto_bello: { lat: 36.8528, lng: 30.6203 },
  hotel_rixos_downtown: { lat: 36.8843, lng: 30.6810 },
  hotel_hotel_su: { lat: 36.8790, lng: 30.6590 },
  hotel_ic_green: { lat: 36.8580, lng: 30.8840 },
  hotel_concorde: { lat: 36.8550, lng: 30.8860 },
  hotel_mardan: { lat: 36.8570, lng: 30.9240 },
  hotel_marmara: { lat: 36.8510, lng: 30.7410 }
};

function hotel(spec) {
  const coordinates = hotelCoordinates[spec.id];
  return {
    ...spec,
    ...coordinates,
    coordinateStatus: "지도 표시용 근사 중심점, 예약 전 Google Maps에서 출입구 재확인",
    featured: spec.rank <= 6,
    bookingModel: "hotel_rooms",
    hotelPlan: {
      rooms: 4,
      arrangement: spec.arrangement,
      connection: "request_only",
      occupancyApproved: false
    },
    maps: googleMaps(spec.mapQuery),
    action: "성인 6명과 만 9세, 7세, 6세 어린이의 4실 배치, 연결 또는 바로 옆 객실, 3월 어린이 실내 수영장 이용을 한 이메일에서 서면 확인",
    photoCreditLabel: "숙소 또는 권역 이미지 출처",
    ...imageFields(spec.mediaId)
  };
}

export const trip = {
  slug: "antalya",
  title: "ANTALYA TOGETHER",
  subtitle: "이스탄불 사이 3박, 지중해의 온전한 이틀",
  destination: "안탈리아",
  startDate: "2027-03-26",
  arrivalDate: "2027-03-26",
  checkoutDate: "2027-03-29",
  nights: 3,
  adults: 6,
  children: [9, 7, 6],
  hotelRoomCount: 4,
  mapZoom: 11,
  weatherCoordinates: { latitude: "36.8969", longitude: "30.7133", timezone: "Europe/Istanbul" },
  budgetStayLabel: "안탈리아 증분 3박",
  budgetGroupLabel: "아홉 명 전체 증분 비용",
  paceModes: {
    default: "gentle",
    options: [
      { id: "gentle", label: "천천히", description: "도착과 출발을 비우고 온전한 이틀도 오전 핵심 한 곳 뒤 쉽니다." },
      { id: "focused", label: "집중 여행", description: "같은 방향의 두세 장면을 묶되 16시 전후 호텔로 돌아옵니다." }
    ]
  },
  principles: [
    "3월 안탈리아는 해수욕 여행이 아니라 유적, 구시가지와 실내 수영장을 섞는 여행입니다.",
    "왕복 모두 IST를 쓰고 9명과 3박 수하물에는 16석급 차량을 배정합니다.",
    "온전한 관광일은 이틀뿐입니다. 천천히 모드는 하루 한 곳, 집중 모드는 같은 방향만 묶습니다.",
    "2027년 가격, 객실 연결, 어린이 실내 수영장과 휴관은 서면 확인 전 확정으로 말하지 않습니다."
  ],
  sourceDeck: "https://goturkiye.com/antalya/see"
};

export const familyGroups = [
  {
    id: "ist-family-nine-outbound",
    label: "안탈리아행",
    origin: "IST",
    members: "성인 6, 어린이 3",
    route: "이스탄불 IST → 안탈리아 AYT",
    target: "3월 26일 오전 출발을 우선하고 이동일 관광은 넣지 않음",
    carriers: "Turkish Airlines의 IST-AYT 직항을 기준으로 2027년 운항표가 열린 뒤 비교",
    status: "현재 직항 노선은 확인되지만 2027년 편명, 시간, 운임과 수하물 조건은 미확정"
  },
  {
    id: "ist-family-nine-return",
    label: "이스탄불 복귀",
    origin: "AYT",
    members: "성인 6, 어린이 3",
    route: "안탈리아 AYT → 이스탄불 IST",
    target: "3월 29일 오후 복귀를 우선해 공항 이동 여유를 지킴",
    carriers: "Turkish Airlines의 AYT-IST 직항을 기준으로 2027년 운항표가 열린 뒤 비교",
    status: "이스탄불 장거리 귀국편과 같은 날 연결하지 않고 기존 숙소로 돌아가는 완충일"
  }
];

export const decisionChecklist = [
  { id: "pool", label: "어린이 실내 수영장", detail: "3월 26일부터 29일까지 이용 시간과 수온을 호텔 이메일로 받습니다.", href: "#stay" },
  { id: "rooms", label: "4실 배치", detail: "연결 객실 또는 바로 옆 객실과 실제 침대 9개를 서면 확정합니다.", href: "#stay" },
  { id: "flight", label: "IST 왕복", detail: "SAW를 섞지 않고 9명 좌석, 위탁수하물과 변경 조건을 함께 비교합니다.", href: "#family" },
  { id: "vehicle", label: "16석급 차량", detail: "승객 9명, 여행가방과 어린이 좌석 3개의 실제 적재 사진을 확인합니다.", href: "#tools" }
];

export const lodgingOptions = [
  hotel({
    id: "hotel_akra", rank: 1, mediaId: "hotel_akra", name: "Akra Antalya", type: "시내 리조트형",
    verdict: "도시 접근과 가족 객실 구조의 균형은 가장 좋지만 어린이 실내 수영장 접근이 확인되어야 1순위가 됩니다.",
    capacity: "Connection Sea View 공식 최대 4+2, Grand Family 최대 5+2, 9명 전체 조합은 미확정",
    layout: "연결형 객실 1개와 인접 객실 또는 Grand Family와 추가 객실",
    arrangement: "Connection Sea View와 인접 객실을 포함한 총 4실 우선",
    location: "Muratpaşa, Falez 해안", fit: 92,
    good: ["공식 객실 페이지에 연결형과 가족형 객실이 명시됨", "공식 수영장 페이지에 겨울 실내 수영장 28°C 안내", "칼레이치와 Lara 사이의 균형 잡힌 위치"],
    cautions: ["AkraFit 별도 페이지는 실내 수영장을 18세 이상으로 표시해 어린이 접근 정보가 충돌함", "야외 수영장과 해변은 통상 4월부터 11월이며 날씨에 따라 달라짐", "2027년 4실 가격과 재고 미확인"],
    official: "https://www.akrahotels.com/en/hotels/akra-antalya/rooms-and-suites/", mapQuery: "Akra Antalya"
  }),
  hotel({
    id: "hotel_megasaray", rank: 2, mediaId: "hotel_megasaray", name: "Megasaray WestBeach Antalya", type: "서부 가족 리조트형",
    verdict: "겨울 어린이 실내 수영장을 공식적으로 가장 명확하게 적은 후보입니다.",
    capacity: "44㎡ Family Room 구조는 공개되지만 9명용 최종 객실 수와 정원은 미확정",
    layout: "Family Room과 추가 객실을 조합한 총 4실",
    arrangement: "패밀리룸 2실과 일반 객실 2실 또는 호텔이 승인한 동등 조합",
    location: "Konyaaltı 서부", fit: 90,
    good: ["공식 페이지에 겨울 가열 실내 성인 수영장과 어린이 수영장 명시", "가족형 객실에 더블, 싱글 침대와 소파 구조 공개", "아쿠아리움과 Konyaaltı 일정에 편리"],
    cautions: ["공항, Perge와 Lara 이동시간 증가", "가열 온도와 어린이 이용시간 미확인", "연결 객실 보장과 2027년 가격 미확인"],
    official: "https://www.megasarayhotels.com/megasaray-westbeach-antalya/pools-beach", mapQuery: "Megasaray WestBeach Antalya"
  }),
  hotel({
    id: "hotel_doubletree", rank: 3, mediaId: "hotel_doubletree", name: "DoubleTree by Hilton Antalya City Centre", type: "도심 연결 객실형",
    verdict: "공식 편의시설 목록에서 실내 수영장과 연결 객실을 함께 확인할 수 있는 도심 후보입니다.",
    capacity: "성인 6명과 어린이 3명의 총 4실 배치는 호텔 승인 전 미확정",
    layout: "연결 객실 2실과 바로 옆 객실 2실 요청",
    arrangement: "Confirmed Connecting Rooms 적용 가능 객실과 인접 2실",
    location: "도심, 칼레이치 북쪽", fit: 87,
    good: ["공식 페이지에 connecting rooms, indoor pool, cribs 표시", "칼레이치에서 약 2km인 도심 위치", "호텔 체인의 객실 배치 문의 창구가 명확함"],
    cautions: ["연결 객실 2실만으로 9명 수용 여부 미확인", "어린이 실내 수영장 시간과 수온 미표시", "공항 셔틀 없음, 2027년 가격 미확인"],
    official: "https://www.hilton.com/en/hotels/aytccdi-doubletree-antalya-city-centre/", mapQuery: "DoubleTree by Hilton Antalya City Centre"
  }),
  hotel({
    id: "hotel_ramada_plaza", rank: 4, mediaId: "hotel_ramada_plaza", name: "Ramada Plaza by Wyndham Antalya", type: "칼레이치 인접형",
    verdict: "구시가지 도보성은 강하지만 공식 패밀리룸 설명의 면적과 욕실 수가 서로 달라 도면 확인이 필요합니다.",
    capacity: "Family Room 공식 최대 4명 표기, 9명은 최소 3실 이상 필요",
    layout: "Family Room과 일반 객실을 합친 4실",
    arrangement: "패밀리룸 2실과 인접 일반 객실 2실",
    location: "Muratpaşa, Karaalioğlu Park 동쪽", fit: 84,
    good: ["칼레이치와 공원을 도보로 연결하기 쉬움", "공식 시설 페이지에 실내 수영장 안내", "이동일 짧은 산책에 유리"],
    cautions: ["패밀리룸 설명에 60㎡, 2침실, 2욕실과 26㎡, 1욕실이 함께 표기됨", "어린이 수영장 이용 조건 미확인", "연결 객실과 2027년 가격 미확인"],
    official: "https://ramadaplazaantalya.com/En/Room?nameofRoom=Family+Room", mapQuery: "Ramada Plaza by Wyndham Antalya"
  }),
  hotel({
    id: "hotel_lara_barut", rank: 5, mediaId: "hotel_lara_barut", name: "Lara Barut Collection", type: "동부 올인클루시브형",
    verdict: "3월 가열 수영장 정책과 가족 객실은 강하지만 칼레이치까지의 이동비용이 큽니다.",
    capacity: "Deluxe Family 2침실, 2욕실 공개, 9명 전체 객실 조합 정원은 미확정",
    layout: "가족 객실 2실과 추가 객실 2실",
    arrangement: "Deluxe Family 2실과 바로 옆 일반 객실 2실",
    location: "Lara, Kundu", fit: 82,
    good: ["공식 정책에 11월 1일부터 3월 31일까지 실내와 일부 야외 가열 수영장 안내", "2침실, 2욕실 가족 객실 안내", "공항과 Perge 방향 접근이 편함"],
    cautions: ["시내와 Konyaaltı 이동이 김", "2027년 3월 키즈클럽과 각 수영장 어린이 이용 조건 미확인", "4실 가격과 연결 배치 미확인"],
    official: "https://baruthotels.com/en/experiences/heated-swimming-pools", mapQuery: "Lara Barut Collection Antalya"
  }),
  hotel({
    id: "hotel_porto_bello", rank: 6, mediaId: "hotel_porto_bello", name: "Porto Bello Hotel Resort & Spa", type: "서부 가족 리조트형",
    verdict: "가열 실내 수영장과 최대 5명 패밀리룸은 유용하지만 연결 객실 정보가 없습니다.",
    capacity: "48㎡ Family Room 공식 최대 5명, 9명은 2실 이상이지만 여유를 위해 4실 기준",
    layout: "패밀리룸 2실과 일반 객실 2실",
    arrangement: "Family Room 2실과 같은 층 일반 객실 2실",
    location: "Konyaaltı 서부", fit: 80,
    good: ["공식 사이트에 heated indoor pool 안내", "가족 객실 최대 5명 안내", "Konyaaltı 해변 산책과 가까움"],
    cautions: ["연결 객실 미표시", "어린이 수영장 시간과 실제 3월 수온 미확인", "Perge와 공항 방향 이동 증가, 2027년 가격 미확인"],
    official: "https://www.portobello.com.tr/en", mapQuery: "Porto Bello Hotel Resort Antalya"
  }),
  hotel({
    id: "hotel_rixos_downtown", rank: 7, mediaId: "hotel_rixos_downtown", name: "Rixos Downtown Antalya", type: "도심 공원형 리조트",
    verdict: "Family Terrace 연결 구조는 좋지만 공식 FAQ에서 실내 수영장을 확인하지 못해 3월 우선순위가 내려갑니다.",
    capacity: "Family Terrace 공식 최대 6명, 9명은 추가 객실 필요",
    layout: "Family Terrace와 인접 객실을 포함한 4실",
    arrangement: "Family Terrace 1개와 같은 층 객실 2실 이상",
    location: "Atatürk Culture Park, Konyaaltı 동쪽", fit: 76,
    good: ["가족 연결형 객실 최대 6명 안내", "박물관, 공원과 Konyaaltı 접근이 좋음", "넓은 공원권의 저강도 산책"],
    cautions: ["공식 FAQ에서 야외 수영장만 확인되어 실내 수영장은 미확인", "계절 시설 운영 변동 가능", "9명 배치와 2027년 가격 미확인"],
    official: "https://www.rixos.com/accommodation-list/rixos-downtown-antalya-land-legends-access/rixos-downtown-antalya-accomodations", mapQuery: "Rixos Downtown Antalya"
  }),
  hotel({
    id: "hotel_hotel_su", rank: 8, mediaId: "hotel_hotel_su", name: "Hotel SU & Aqualand", type: "아쿠아리움 인접형",
    verdict: "서부 가족 동선은 편하지만 3월 실내 수영장과 객실 연결 조건을 공식 공개 정보에서 확정하지 못했습니다.",
    capacity: "9명 4실 배치와 어린이 추가 침대 허용은 미확정",
    layout: "일반 객실 4실 같은 층 요청",
    arrangement: "더블 2실과 트윈 2실, 같은 층 우선",
    location: "Antalya Aquarium 인근", fit: 72,
    good: ["Aquarium, Culture Park와 가까운 위치", "서부 일정의 차량 이동을 줄일 수 있음"],
    cautions: ["Aqualand는 3월 운영을 전제하면 안 됨", "실내 수영장과 어린이 입장, 연결 객실 미확인", "2027년 객실 가격과 정원 미확인"],
    official: "https://www.hotelsu.com.tr/", mapQuery: "Hotel SU Antalya"
  }),
  hotel({
    id: "hotel_ic_green", rank: 9, mediaId: "hotel_ic_green", name: "IC Hotels Green Palace", type: "동부 가족 리조트형",
    verdict: "공항과 동부 유적 방향에는 편하지만 시내 이틀을 보내기에는 멉니다.",
    capacity: "9명 가족의 4실 조합과 어린이 침대는 미확정",
    layout: "가족형 또는 일반 객실 4실",
    arrangement: "호텔이 승인한 4실 가족 배치",
    location: "Kundu, Lara 동부", fit: 69,
    good: ["공항과 Perge 방향 접근", "리조트 내부에서 쉬는 날에 유리한 후보"],
    cautions: ["칼레이치와 Konyaaltı 이동이 김", "3월 실내 수영장과 어린이 이용 조건 미확인", "연결 객실과 2027년 가격 미확인"],
    official: "https://greenpalace.ichotels.com.tr/en", mapQuery: "IC Hotels Green Palace Antalya"
  }),
  hotel({
    id: "hotel_concorde", rank: 10, mediaId: "hotel_concorde", name: "Concorde De Luxe Resort", type: "동부 올인클루시브형",
    verdict: "리조트 체류 후보지만 2027년 3월 핵심 시설 운영과 9명 객실 배치는 별도 확인이 필요합니다.",
    capacity: "공식 De Luxe Family Suite 최대 4명 기준, 9명은 최소 3실이 필요하며 여유 있게 4실 제안",
    layout: "일반 또는 가족형 객실 4실",
    arrangement: "같은 층 4실과 연결 가능 객실 우선",
    location: "Lara, Kundu", fit: 67,
    good: ["공식 객실 안내에 최대 4명 Family Suite가 있음", "공식 시설 안내에 실내외 수영장이 있음"],
    cautions: ["칼레이치 이동시간", "실내 수영장, 키즈 시설의 2027년 3월 운영 미확인", "가격, 연결 객실과 침대 배치 미확인"],
    official: "https://www.concordehotels.com/en/otels/concorde-de-luxe-resort", mapQuery: "Concorde De Luxe Resort Antalya"
  }),
  hotel({
    id: "hotel_mardan", rank: 11, mediaId: "hotel_mardan", name: "Mardan Palace", type: "동부 럭셔리 리조트형",
    verdict: "리조트 자체가 목적일 때만 검토할 후보로, 이번 짧은 도시 일정에는 동선 과잉입니다.",
    capacity: "9명 4실 배치와 가족 객실 정원은 미확정",
    layout: "일반 또는 가족형 객실 4실",
    arrangement: "같은 층 4실과 어린이 침대 3개",
    location: "Kundu 동부", fit: 61,
    good: ["호텔 체류 자체를 중시할 때 선택 가능한 고급 리조트", "공항과 동부 방향 접근"],
    cautions: ["칼레이치와 Konyaaltı에서 멂", "3월 시설 운영과 어린이 실내 수영장 미확인", "2027년 가격과 4실 재고 미확인"],
    official: "https://www.mardanpalace.com/", mapQuery: "Mardan Palace Antalya"
  }),
  hotel({
    id: "hotel_marmara", rank: 12, mediaId: "hotel_marmara", name: "The Marmara Antalya", type: "시내 디자인 호텔형",
    verdict: "시내 위치는 좋지만 가족 객실과 3월 어린이 실내 수영장 근거가 약해 예비 후보입니다.",
    capacity: "9명 4실 배치와 추가 침대 허용은 미확정",
    layout: "일반 객실 4실 같은 층 요청",
    arrangement: "더블 2실과 트윈 2실, 같은 층",
    location: "Şirinyalı, Lara 서쪽", fit: 59,
    good: ["Akra와 비슷한 시내 남동부 위치", "칼레이치와 Lower Düden 사이 동선"],
    cautions: ["가족형 객실과 연결 객실 미확인", "어린이 실내 수영장 운영 미확인", "2027년 가격과 객실 상태 미확인"],
    official: "https://www.themarmarahotels.com/en/hotels/the-marmara-antalya", mapQuery: "The Marmara Antalya"
  })
];

export const observedTripComQuotes = lodgingOptions.map((item) => ({
  id: `unobserved-${item.id}`,
  lodgingId: item.id,
  provider: "Trip.com",
  capturedAt: CHECKED_AT,
  referenceStay: "2027-03-26부터 03-29, 3박",
  occupancy: "성인 6명, 어린이 3명, 객실 4실",
  roomPlan: item.hotelPlan.arrangement,
  nightlyDisplay: "2027 가격 미확인",
  projectedDisplay: "3박 총액 미확인",
  currency: "KRW",
  nightlyValue: null,
  projectedValue: null,
  unitLabel: "객실 1실, 1박",
  stayLabel: "가족 4실, 3박",
  totalIncludesTaxes: null,
  refundable: null,
  breakfast: null,
  status: "unavailable",
  inventoryNote: "목표 날짜의 동일 객실, 인원, 세금 조건을 관측하지 않았습니다. 숫자를 추정하지 않습니다.",
  sourceUrl: `https://kr.trip.com/hotels/list?city=1217&searchWord=${encodeURIComponent(item.name)}`,
  comparisonKey: `2027-03-26/2027-03-29/${item.id}/4-rooms/6-adults-3-children/unobserved`,
  officialDirect: {
    provider: `${item.name} 공식 홈페이지`,
    capturedAt: CHECKED_AT,
    referenceStay: "2027-03-26부터 03-29, 3박",
    occupancy: "성인 6명, 어린이 3명, 객실 4실",
    roomPlan: item.hotelPlan.arrangement,
    unitLabel: "객실 1실, 1박",
    stayLabel: "가족 4실, 3박",
    nightlyDisplay: "2027 가격 미확인",
    projectedDisplay: "3박 총액 미확인",
    currency: "KRW",
    nightlyValue: null,
    projectedValue: null,
    totalIncludesTaxes: null,
    refundable: null,
    breakfast: null,
    status: "unavailable",
    inventoryNote: "동일 날짜와 9인 객실 배치의 공식 결제 견적을 확인하지 않았습니다.",
    sourceUrl: item.official,
    comparisonKey: `2027-03-26/2027-03-29/${item.id}/4-rooms/6-adults-3-children/unobserved`
  }
}));

export const tripComCostSummary = {
  provider: "Trip.com",
  capturedAt: CHECKED_AT,
  requestedStay: "2027-03-26부터 03-29, 3박",
  requestedOccupancy: "성인 6명, 어린이 3명, 호텔 객실 4실",
  exactQuoteStatus: "2027년 동일 조건의 공개 결제 견적을 관측하지 않았습니다. 모든 가격 칸은 미확인으로 유지합니다.",
  directQuoteStatus: "호텔 공식 사이트에서도 동일 날짜, 9명, 4실 조건의 재현 가능한 총액을 기록하지 않았습니다.",
  benchmarkLabel: "안탈리아 2027 호텔 시장 평균",
  benchmarkNightly: "미산정",
  benchmarkTotal: "산정하지 않음",
  benchmarkFormula: "실제 동일 조건 견적이 없으므로 평균과 4실 3박 환산을 만들지 않음",
  sourceUrl: "https://kr.trip.com/hotels/list?city=1217",
  fx: {
    label: "ECB 2026-09-02 참고",
    eurToKrw: 1577.57,
    sourceUrl: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html",
    note: "현재 비교용 환율일 뿐 2027년 호텔 가격이나 실제 카드 환율이 아닙니다."
  }
};

const residenceSearchUrl = "https://www.airbnb.com/s/Antalya--T%C3%BCrkiye/homes?tab_id=home_tab&refinement_paths%5B%5D=%2Fhomes&date_picker_type=calendar&checkin=2027-03-26&checkout=2027-03-29&adults=6&children=3&room_types%5B%5D=Entire%20home%2Fapt";

const residenceSpecs = [
  { id: "residence_kaleici", mediaId: "residence_kaleici", name: "Kaleiçi 허가 레지던스 후보", neighborhood: "Kaleiçi", bedrooms: 4, beds: 6, baths: 2, fit: 78, reason: "구시가지 산책을 차 없이 시작할 수 있는 권역 후보입니다.", caution: "실매물을 특정하지 않았습니다. 돌길, 계단, 차량 문앞 접근, 야간 소음과 관광임대 등록을 확인해야 합니다." },
  { id: "residence_konyaalti", mediaId: "residence_konyaalti", name: "Konyaaltı 서비스드 아파트 후보", neighborhood: "Konyaaltı", bedrooms: 4, beds: 6, baths: 2, fit: 76, reason: "아쿠아리움과 해변 산책, 신축 아파트 선택 폭을 기대할 수 있는 권역 후보입니다.", caution: "시내와 Perge 이동이 길어집니다. 난방, 실내 수영장 유무와 같은 건물 2채 배치를 확인해야 합니다." },
  { id: "residence_lara", mediaId: "residence_lara", name: "Lara 레지던스 2채 후보", neighborhood: "Lara", bedrooms: 4, beds: 6, baths: 2, fit: 74, reason: "공항, Lower Düden과 Perge 방향을 묶기 쉬운 권역 후보입니다.", caution: "한 집이 아니라 같은 건물 2채일 가능성이 높습니다. 엘리베이터와 같은 층 배치를 확인해야 합니다." },
  { id: "villa_falez", mediaId: "villa_falez", name: "Falez 4베드룸 빌라 후보", neighborhood: "Muratpaşa 해안", bedrooms: 4, beds: 6, baths: 3, fit: 72, reason: "공용 거실과 야외 공간을 중시할 때 볼 구조 후보입니다.", caution: "특정 등록 숙소가 아닙니다. 3월 난방, 계단 안전, 수영장 비가동과 차량 진입을 확인해야 합니다." },
  { id: "residence_harbor", mediaId: "residence_harbor", name: "구항구 인접 레지던스 후보", neighborhood: "Kaleiçi 하부", bedrooms: 4, beds: 6, baths: 2, fit: 66, reason: "항구 풍경과 구시가지 체류감을 가장 가까이 얻는 권역 후보입니다.", caution: "항구에서 위쪽 도로까지 경사가 큽니다. 수하물 운반, 계단, 소음과 차량 승하차 위치를 영상으로 확인해야 합니다." },
  { id: "apartment_center", mediaId: "apartment_center", name: "도심 아파트 2채 후보", neighborhood: "Muratpaşa 중심", bedrooms: 4, beds: 6, baths: 2, fit: 64, reason: "호텔보다 생활 공간을 늘리면서 칼레이치와 차량 동선을 절충하는 후보입니다.", caution: "구체 매물이 아니며 같은 건물과 같은 층 보장은 없습니다. 난방, 온수, 침대 9개와 취소 조건을 확인해야 합니다." }
];

export const airbnbSearch = {
  checkedAt: CHECKED_AT,
  stay: "2027-03-26부터 03-29, 3박",
  guests: "성인 6명, 어린이 3명, 전체 숙소",
  searchUrl: residenceSearchUrl,
  caveat: "아래 6개는 실제 예약 가능한 매물이 아니라 권역과 구조 후보입니다. 2027년 재고, 총액, 평점과 허가를 관측하지 않았습니다.",
  evidenceLabel: "실가격 확인 0곳, 구조 후보 6곳",
  priceRangeLabel: "2027년 총액 범위 미산정",
  exactAvailableCount: 0,
  unavailableCount: 0,
  lowestExactTotal: null,
  highestExactTotal: null,
  options: residenceSpecs.map((item, index) => ({
    rank: index + 1,
    id: item.id,
    name: item.name,
    availability: "candidate",
    fit: item.fit,
    capacity: 9,
    bedrooms: item.bedrooms,
    beds: item.beds,
    baths: item.baths,
    neighborhood: item.neighborhood,
    reason: item.reason,
    caution: item.caution,
    cancellation: "취소 정책 미확인, 무료 취소 가능 기한을 결제 화면에서 확인",
    cancellationLimit: "구체 매물과 요금제를 고르기 전에는 취소 가능 여부도 확정할 수 없습니다.",
    price: "2027 가격 미확인",
    priceLabel: "3박 총액 미확인",
    nightlyLabel: "1박 평균 계산 안 함",
    observedAt: CHECKED_AT,
    photoCheckedAt: CHECKED_AT,
    availabilityEvidence: "실매물을 특정하거나 목표 날짜의 예약 버튼을 확인하지 않았습니다.",
    priceEvidence: "관측 가격 없음, 추정값 없음",
    taxesAndFees: "세금과 수수료 미확인",
    url: residenceSearchUrl,
    photoCaption: "숙소 권역 참고 이미지",
    ...imageFields(item.mediaId)
  }))
};

export const rentalChecklist = [
  "호텔은 성인 6명과 만 9세, 7세, 6세의 객실별 배치를 한 견적에 적게 합니다.",
  "연결 객실 또는 바로 옆 객실은 요청이 아니라 보장 문구인지 확인합니다.",
  "실내 수영장은 2027년 3월 26일부터 29일까지 어린이 3명 입장이 가능한지 확인합니다.",
  "실내 수영장의 수온, 어린이 이용시간, 수모와 보호자 동반 규칙을 확인합니다.",
  "패밀리룸의 면적, 침실, 욕실, 실제 침대와 소파베드 수를 최신 도면으로 확인합니다.",
  "4실 전체의 세금, 조식, 추가 침대와 취소 조건을 포함한 총액을 받습니다.",
  "레지던스는 관광임대 등록, 9인 정원, 난방, 온수와 엘리베이터를 확인합니다.",
  "차량 문앞 접근과 16석급 차량의 수하물 적재 공간을 사진으로 확인합니다.",
  "어린이 좌석 3개는 각 아이의 키와 몸무게에 맞는 제품인지 확인합니다.",
  "숙소와 항공 중 하나라도 핵심 조건을 확약하지 못하면 안탈리아 3박을 취소하고 이스탄불 원안을 유지합니다."
];

const baseNeeds = {
  parents: "서두르지 않고 안탈리아가 이스탄불과 어떻게 다른지 한 장면으로 이해하기",
  kids: "짧고 분명한 볼거리 뒤 수영장 또는 휴식 시간",
  together: "아홉 명이 같은 프레임에 들어오는 한 장면",
  recovery: "16시 전후 호텔 복귀와 저녁 전 최소 90분 휴식"
};

export const itinerary = [
  {
    date: "2027-03-26", dow: "금", title: "IST에서 함께 내려와 바로 쉼", zone: "IST → AYT → 호텔", intensity: 1,
    stay: "안탈리아 1/3박", featuredPlace: "karaalioglu",
    main: "국내선과 호텔 체크인만 확정 일정으로 두고, 해 질 무렵 Karaalioğlu Park를 30분 걷습니다.",
    timeline: ["오전 IST에서 9명 함께 출발, 수하물과 좌석 조건 재확인", "AYT 도착 뒤 예약한 16석급 차량으로 호텔 이동", "체크인, 객실 연결과 어린이 실내 수영장 조건 현장 재확인", "해 질 무렵 Karaalioğlu Park 30분, 피곤하면 생략", "18시 전후 호텔 또는 가까운 식당에서 조기 저녁"],
    rain: "호텔 체크인과 실내 수영장만 남기고 외출하지 않습니다.",
    low: "공원도 빼고 호텔 안에서 저녁을 먹습니다.",
    transport: "IST-AYT 직항, AYT-호텔 16석급 전용차",
    notes: "공항 간 이동을 피하려고 왕복 모두 IST를 사용합니다. 정확한 2027년 비행시간과 운임은 미확정입니다.",
    whyNow: "이동일에 칼레이치까지 욕심내면 온전한 이틀의 체력이 줄어듭니다.", needs: baseNeeds,
    variants: {
      focused: {
        dow: "금", title: "체크인 뒤 칼레이치 첫 장면", zone: "IST → AYT → Kaleiçi", intensity: 2,
        stay: "안탈리아 1/3박", featuredPlace: "hadrians",
        main: "도착과 체크인이 순조로울 때만 Hadrian’s Gate에서 Hıdırlık Tower까지 짧게 걷습니다.",
        timeline: ["오전 IST에서 9명 함께 출발", "AYT에서 16석급 차량 탑승", "호텔 체크인과 90분 휴식", "16시 이후 Hadrian’s Gate, Kaleiçi, Hıdırlık Tower 75분", "18시 Parlak 또는 Pablito 조기 저녁"],
        rain: "칼레이치 산책을 빼고 호텔 실내 수영장과 이른 저녁으로 바꿉니다.",
        low: "Hadrian’s Gate 외관만 보고 차량으로 호텔에 돌아갑니다.",
        transport: "IST-AYT 직항, AYT-호텔 전용차, 도심 짧은 차량 이동",
        notes: "도착 지연이 60분을 넘으면 자동으로 천천히 일정으로 전환합니다.",
        whyNow: "첫날에는 안탈리아의 질감을 짧게 확인하되 이동 지연을 흡수합니다.",
        needs: { parents: "칼레이치의 지중해 도시 풍경", kids: "성문과 골목의 짧은 탐험", together: "Hadrian’s Gate 가족사진", recovery: "호텔 체크인 뒤 90분 휴식" }
      }
    }
  },
  {
    date: "2027-03-27", dow: "토", title: "Perge 하나를 제대로 봄", zone: "Aksu, Perge", intensity: 2,
    stay: "안탈리아 2/3박", featuredPlace: "perge",
    main: "아침 Perge를 90분 보고 점심 뒤 호텔로 돌아옵니다. 극장은 현재 복원 폐쇄라 포함하지 않습니다.",
    timeline: ["08:30 호텔 출발", "09:15 Perge 도착, 열주도로와 아고라 중심 90분", "11:00 차량 탑승", "12:00 동선 안의 간단한 점심", "14:00 호텔 복귀와 실내 수영장 또는 낮잠", "18:00 가까운 식당 조기 저녁"],
    rain: "비가 약하면 미끄럼 방지 신발로 60분만 보고, 강하면 Antalya Aquarium으로 교체합니다.",
    low: "Perge의 열주도로와 아고라만 60분 보고 바로 호텔로 돌아옵니다.",
    transport: "16석급 기사 포함 차량 반일 대절",
    notes: "유적 바닥은 고르지 않아 유모차보다 걷는 아이 기준입니다. 그늘과 앉을 곳이 제한될 수 있습니다.",
    whyNow: "도착 다음 날 오전이 아이들의 체력이 가장 좋고 Perge는 공항 동쪽 방향이라 독립된 반일로 쓰기 좋습니다.",
    needs: { parents: "안탈리아를 선택한 이유가 되는 로마 도시 유적", kids: "긴 돌길과 옛 도시의 크기", together: "열주도로 중앙의 가족사진", recovery: "14시 호텔 복귀" },
    variants: {
      focused: {
        dow: "토", title: "Perge와 Lower Düden을 한 방향으로", zone: "Aksu → Lara", intensity: 3,
        stay: "안탈리아 2/3박", featuredPlace: "lower_duden",
        main: "Perge 90분 뒤 점심과 Lower Düden 전망을 같은 동쪽 동선으로 묶습니다.",
        timeline: ["08:15 호텔 출발", "09:00 Perge 90분, 극장 제외", "11:00 Lara 방향 이동", "12:00 점심", "13:30 Lower Düden 45분", "15:30 호텔 복귀와 휴식", "18:30 7 Mehmet 예약 저녁"],
        rain: "Perge를 취소하고 Aquarium과 호텔 실내 수영장으로 바꿉니다.",
        low: "Lower Düden을 빼고 Perge 뒤 바로 호텔로 돌아옵니다.",
        transport: "16석급 기사 포함 차량 8시간",
        notes: "Lower Düden은 바람과 절벽 난간을 확인하고 오래 머물지 않습니다.",
        whyNow: "Perge와 Lara를 같은 차량 동선에 놓아 왕복을 줄입니다.",
        needs: { parents: "로마 유적과 지중해 절벽을 하루에 대비", kids: "옛 도시와 바다로 떨어지는 폭포", together: "Lower Düden 전망대 사진", recovery: "16시 전 호텔 복귀" }
      }
    }
  },
  {
    date: "2027-03-28", dow: "일", title: "Aquarium 뒤 오후를 비움", zone: "Konyaaltı", intensity: 1,
    stay: "안탈리아 3/3박", featuredPlace: "aquarium",
    main: "Antalya Aquarium의 40개 테마 수조와 131m 터널을 보고 Konyaaltı에서 점심만 먹습니다.",
    timeline: ["09:30 호텔 출발", "10:00 Antalya Aquarium 2시간", "12:15 Konyaaltı 점심", "13:45 호텔 복귀", "오후 실내 수영장 또는 낮잠", "18:00 마지막 저녁"],
    rain: "그대로 진행하되 Aquarium과 차량 사이 이동을 최소화합니다.",
    low: "터널과 아이들이 고른 수조만 90분 보고 호텔로 돌아갑니다.",
    transport: "호텔-아쿠아리움 왕복 전용차 또는 대형 택시 2대",
    notes: "현재 공식 사이트는 유모차 접근과 3세부터 12세 어린이 요금을 안내하지만 2027년 요금과 시간은 재확인합니다.",
    whyNow: "둘째 온전한 날을 실내 중심으로 두면 전날 유적과 3월 비 변수에서 회복할 수 있습니다.",
    needs: { parents: "날씨에 흔들리지 않는 편안한 오전", kids: "긴 수중 터널과 직접 고른 수조", together: "터널 아래 가족사진", recovery: "14시 호텔 복귀와 자유시간" },
    variants: {
      focused: {
        dow: "일", title: "Aquarium, Konyaaltı와 Necropolis", zone: "Konyaaltı → Doğu Garajı", intensity: 2,
        stay: "안탈리아 3/3박", featuredPlace: "nekropol",
        main: "Aquarium 뒤 점심과 산책을 짧게 하고, 호텔 휴식 후 Necropolis Museum 한 곳만 더 봅니다.",
        timeline: ["09:15 호텔 출발", "09:45 Aquarium 2시간", "12:00 Konyaaltı 점심과 해변 산책 30분", "14:00 호텔 휴식 90분", "16:00 Necropolis Museum 60분", "18:00 시내 마지막 저녁"],
        rain: "Konyaaltı 산책을 빼고 Aquarium, 호텔 휴식과 Necropolis만 진행합니다.",
        low: "오후 Necropolis를 빼고 Aquarium 뒤 호텔로 돌아갑니다.",
        transport: "구간별 16석급 차량 또는 사전 예약 밴",
        notes: "Necropolis 단체 방문은 운영기관에 미리 연락하고 2027년 일요일 운영을 재확인합니다.",
        whyNow: "서부 실내 체험과 도심 고고학을 휴식으로 분리해 과밀을 피합니다.",
        needs: { parents: "해안 도시와 고대 도시의 층위를 함께 보기", kids: "Aquarium을 확실한 보상으로 확보", together: "Konyaaltı 또는 Necropolis 한 장면", recovery: "14시부터 90분 호텔 휴식" }
      }
    }
  },
  {
    date: "2027-03-29", dow: "월", title: "관광 없이 IST로 돌아감", zone: "호텔 → AYT → IST", intensity: 1,
    stay: "이스탄불 복귀", featuredPlace: "ataturk_park",
    main: "늦은 아침까지 쉬고 국내선 출발 2시간 30분에서 3시간 전에 호텔을 나섭니다.",
    timeline: ["느린 아침과 마지막 짐 정리", "객실 4실과 차량의 분실물 확인", "항공 출발 2시간 30분에서 3시간 전 호텔 출발", "AYT 국내선 수속", "IST 도착 뒤 기존 이스탄불 숙소로 복귀"],
    rain: "일정 변화 없이 차량 승하차만 호텔 출입구에서 처리합니다.",
    low: "체크아웃과 공항 이동만 합니다.",
    transport: "호텔-AYT 16석급 전용차, AYT-IST 직항",
    notes: "월요일은 Toy Museum과 Science Center의 현재 휴관일이라 출발 전 일정으로 넣지 않습니다.",
    whyNow: "이스탄불 숙소를 유지하므로 같은 날 장거리 항공을 붙이지 않고 복귀 완충일을 남깁니다.",
    needs: { parents: "짐과 항공을 안정적으로 마무리", kids: "서두르지 않는 아침", together: "호텔 로비 출발 사진", recovery: "IST 도착 뒤 기존 숙소에서 휴식" },
    variants: {
      focused: {
        dow: "월", title: "늦은 비행일 때 공원 30분", zone: "호텔 → Atatürk Culture Park → AYT", intensity: 1,
        stay: "이스탄불 복귀", featuredPlace: "ataturk_park",
        main: "15시 이후 비행이고 수속 여유가 충분할 때만 Atatürk Culture Park를 30분 걷습니다.",
        timeline: ["느린 아침과 체크아웃", "비행이 15시 이후일 때만 Atatürk Culture Park 30분", "공원에서 바로 AYT 이동", "국내선 수속", "IST 도착 뒤 기존 숙소 복귀"],
        rain: "공원을 생략하고 호텔에서 바로 공항으로 갑니다.",
        low: "체크아웃과 공항 이동만 합니다.",
        transport: "체크아웃부터 AYT까지 같은 16석급 차량",
        notes: "공원 방문 때문에 공항 도착 여유를 줄이지 않습니다.",
        whyNow: "늦은 출발편의 빈 시간을 쓰되 이동일 무관광 원칙을 깨지 않는 선택 옵션입니다.",
        needs: { parents: "비행 전 짧은 바깥 공기", kids: "30분 산책 뒤 바로 차량", together: "공원에서 마지막 단체사진", recovery: "IST 도착 뒤 휴식" }
      }
    }
  }
];

export const mealSuggestions = {
  "2027-03-26": "Parlak 또는 Pablito를 18시 전후로 예약합니다. 도착 지연 시 호텔 식사로 바꿉니다.",
  "2027-03-27": "Perge 동선의 점심 한 곳과 7 Mehmet 조기 저녁만 예약합니다. 피야즈는 참깨 알레르기를 확인합니다.",
  "2027-03-28": "Konyaaltı 점심 뒤 호텔에서 쉬고, 마지막 저녁은 해산물 식당 또는 가족이 먹기 쉬운 그릴을 고릅니다.",
  "2027-03-29": "호텔 조식 뒤 공항에서 간단히 먹습니다. 출발일 식당 예약은 하지 않습니다."
};

export const places = [
  place({ id: "kaleici", mediaId: "kaleici", name: "Kaleiçi", zone: "구시가지", category: "구시가지", lat: 36.8849, lng: 30.7040, duration: "90-120분", energy: 2, rain: false, why: "붉은 지붕, 오스만 주택과 좁은 골목으로 안탈리아의 도시 인상을 가장 압축해서 봅니다.", warning: "돌길, 경사와 차량 진입 제한", official: "https://www.antalya.bel.tr/en/kaleici", mapQuery: "Kaleici Antalya", operatingStatus: "open_public_space", bestFor: "도착일의 짧은 첫 장면", skipIf: "비가 강하거나 이동 지연으로 호텔 도착이 늦을 때", kids: "75분 단일 루프로 끝내고 항구까지 내려갔다 다시 오르지 않습니다.", groupFit: "9명이 붙어 걷기보다 성인 앞뒤 인솔", reservation: "불필요", familyTip: "골목 75분 한 바퀴 뒤 바로 식사합니다." }),
  place({ id: "hadrians", mediaId: "hadrians", name: "Hadrian’s Gate", zone: "구시가지", category: "유적", lat: 36.8857, lng: 30.7086, duration: "15-20분", energy: 1, rain: false, why: "130년에 세워진 성문으로 칼레이치 산책의 명확한 시작점입니다.", warning: "문 앞 차도와 닳은 돌 바닥", official: "https://goturkiye.com/antalya/see", mapQuery: "Hadrians Gate Antalya", operatingStatus: "open_public_space", bestFor: "짧은 사진과 구시가지 진입", skipIf: "젖은 돌에 미끄럼 위험이 클 때", kids: "성문 아래서 오래 머물지 않고 안쪽 골목으로 이동합니다.", groupFit: "사진은 두 가족씩 나눠 찍은 뒤 합침", reservation: "불필요", familyTip: "도착 지연일에는 이 성문 외관만 보고 돌아가도 충분합니다." }),
  place({ id: "old_harbor", mediaId: "old_harbor", name: "Old Harbour", zone: "구시가지", category: "해안", lat: 36.8842, lng: 30.7018, duration: "30-45분", energy: 2, rain: false, why: "성벽 아래 지중해 항구가 안탈리아의 지형을 보여 줍니다.", warning: "항구까지 내려간 뒤 가파른 복귀", official: "https://goturkiye.com/tr/antalya/48-saatte-antalya", mapQuery: "Antalya Old Harbour", operatingStatus: "open_public_space", bestFor: "맑고 체력이 남는 칼레이치 날", skipIf: "유모차, 무릎 통증 또는 강풍", kids: "배를 보는 시간은 짧게 하고 계단에서 손을 잡습니다.", groupFit: "승강기 운영을 전제로 하지 않음", reservation: "산책은 불필요, 보트는 별도", familyTip: "내려가기 전에 모두 다시 올라올 체력이 있는지 확인합니다." }),
  place({ id: "hidirlik", mediaId: "hidirlik", name: "Hıdırlık Tower", zone: "구시가지", category: "전망", lat: 36.8806, lng: 30.7031, duration: "15-20분", energy: 1, rain: false, why: "칼레이치 남쪽 끝에서 탑 외관과 해안 전망을 함께 봅니다.", warning: "내부 개방보다 외관과 주변 산책 중심", official: "https://goturkiye.com/antalya/see", mapQuery: "Hidirlik Tower Antalya", operatingStatus: "conditional_interior", bestFor: "구시가지 산책의 반환점", skipIf: "바람이 강할 때", kids: "탑 내부 입장을 기대하지 않고 바깥에서 짧게 봅니다.", groupFit: "9명 사진 가능", reservation: "불필요", familyTip: "이곳에서 더 내려가지 않고 Karaalioğlu Park로 빠집니다." }),
  place({ id: "karaalioglu", mediaId: "karaalioglu", name: "Karaalioğlu Park", zone: "Muratpaşa", category: "공원", lat: 36.8794, lng: 30.7052, duration: "30-60분", energy: 1, rain: false, why: "호텔 체크인 뒤 무리 없이 바다와 절벽을 보는 저강도 산책입니다.", warning: "절벽 난간과 강풍", official: "https://www.antalya.bel.tr/", mapQuery: "Karaalioglu Park Antalya", operatingStatus: "open_public_space", bestFor: "도착일과 출발 전 짧은 산책", skipIf: "비와 강풍이 함께 올 때", kids: "놀이터보다 바다 전망 산책으로 30분만 잡습니다.", groupFit: "넓은 야외 공간", reservation: "불필요", familyTip: "아이들이 피곤하면 전망 한 곳만 보고 차량으로 돌아옵니다." }),
  place({ id: "yivli", mediaId: "yivli", name: "Yivli Minare Complex", zone: "구시가지", category: "역사", lat: 36.8867, lng: 30.7048, duration: "30분", energy: 1, rain: true, why: "셀주크 시대 미나레와 구시가지 북쪽의 역사 층위를 짧게 봅니다.", warning: "종교시설 예절과 예배시간", official: "https://goturkiye.com/antalya/see", mapQuery: "Yivli Minare Antalya", operatingStatus: "open_conditions_vary", bestFor: "칼레이치 북쪽 짧은 역사 동선", skipIf: "예배 또는 단체 입장이 제한될 때", kids: "조용히 보는 20분 코스로 줄입니다.", groupFit: "9명은 내부에서 분산 관람", reservation: "통상 불필요, 단체 조건 재확인", familyTip: "아이에게 미나레 모양 하나만 찾게 하면 충분합니다." }),
  place({ id: "toy_museum", mediaId: "toy_museum", name: "Antalya Toy Museum", zone: "구항구", category: "박물관", lat: 36.8846, lng: 30.7021, duration: "45-60분", energy: 1, rain: true, why: "약 3,000점의 장난감으로 아이들에게 분명한 실내 보상을 줍니다.", warning: "현재 월요일 휴관, 2027년 운영 재확인", official: "https://oyuncakmuzesi.antalya.bel.tr/", mapQuery: "Antalya Toy Museum", operatingStatus: "open_except_monday_current", bestFor: "칼레이치 우천 대안", skipIf: "월요일 또는 구항구 경사 이동이 부담될 때", kids: "세 아이가 각자 가장 오래된 장난감 하나를 고릅니다.", groupFit: "9명은 작은 전시실에서 두 조로 이동", reservation: "단체 사전 연락 권장", familyTip: "월요일 출발일에는 넣지 않습니다." }),
  place({ id: "suna_inan", mediaId: "suna_inan", name: "Suna & İnan Kıraç Kaleiçi Museum", zone: "구시가지", category: "박물관", lat: 36.8828, lng: 30.7055, duration: "45분", energy: 1, rain: true, why: "복원 주택과 옛 정교회 건물에서 전통 생활상을 봅니다.", warning: "현재 수요일 휴관과 점심시간 중단", official: "https://www.antalya.gov.tr/suna---inan-kirac-muzesi", mapQuery: "Suna Inan Kirac Kaleici Museum", operatingStatus: "open_schedule_current", bestFor: "성인 취향의 짧은 칼레이치 실내 관람", skipIf: "아이들이 이미 박물관에 지쳤을 때", kids: "45분 상한을 지킵니다.", groupFit: "역사 건물 계단과 좁은 공간 확인", reservation: "9명 단체 여부 사전 문의", familyTip: "Toy Museum과 같은 날 둘 다 넣지 않습니다." }),
  place({ id: "ataturk_house", mediaId: "ataturk_house", name: "Atatürk House Museum", zone: "Muratpaşa", category: "박물관", lat: 36.8795, lng: 30.7081, duration: "30-45분", energy: 1, rain: true, why: "공원과 칼레이치 남쪽에서 짧게 붙일 수 있는 근현대사 실내 장소입니다.", warning: "작은 기념관이라 아이 흥미 편차", official: "https://muze.gov.tr/muze-detay?DistId=MRK&SectionId=AAE01", mapQuery: "Ataturk House Museum Antalya", operatingStatus: "open_current", bestFor: "비 오는 짧은 틈", skipIf: "시간이 30분 미만이거나 아이들이 지쳤을 때", kids: "한 층만 보고 나와도 됩니다.", groupFit: "두 조 관람", reservation: "통상 불필요", familyTip: "출발일에는 비행이 늦어도 우선하지 않습니다." }),
  place({ id: "clock_tower", mediaId: "culture_center", name: "Antalya Clock Tower", zone: "Kaleiçi", category: "랜드마크", lat: 36.887083, lng: 30.706156, duration: "10-20분", energy: 1, rain: false, why: "칼레이치 북쪽 진입부에서 구시가지의 방향을 잡는 짧고 분명한 랜드마크입니다.", warning: "광장 차량과 군중, 내부 관람을 전제하지 않음", official: "https://goturkiye.com/antalya/see", mapQuery: "Antalya Clock Tower", operatingStatus: "open_public_space", bestFor: "Hadrian’s Gate와 Yivli Minare 사이 짧은 외관 관람", skipIf: "칼레이치 동선을 이미 충분히 걸었을 때", kids: "시계탑 외관을 찾고 단체사진만 찍습니다.", groupFit: "광장 가장자리에서 9명 단체사진 가능", reservation: "불필요", familyTip: "이 장소만을 위해 이동하지 않고 칼레이치 루프에 붙입니다." }),
  place({ id: "aquarium", mediaId: "aquarium", name: "Antalya Aquarium", zone: "Konyaaltı", category: "실내 체험", lat: 36.8790, lng: 30.6567, duration: "2-2.5시간", energy: 1, rain: true, why: "40개 테마 수조와 131m 터널이 세 아이 모두에게 확실한 실내 핵심입니다.", warning: "현재 마지막 입장은 폐장 45분 전, 2027년 요금과 시간 재확인", official: "https://www.antalyaaquarium.com/En/Anasayfa", mapQuery: "Antalya Aquarium", operatingStatus: "open_current", bestFor: "3월 우천과 피로를 흡수하는 기본 일정", skipIf: "아이들이 수족관을 싫어하거나 혼잡이 과도할 때", kids: "현재 3세부터 12세 어린이 요금 범주에 모두 해당", groupFit: "유모차와 휠체어 접근 공식 안내", reservation: "9명 온라인 구매 조건 확인", familyTip: "전시를 전부 보려 하지 말고 터널과 아이가 고른 수조에 집중합니다." }),
  place({ id: "konyaalti", mediaId: "konyaalti", name: "Konyaaltı Promenade", zone: "Konyaaltı", category: "해안", lat: 36.8747, lng: 30.6494, duration: "30-60분", energy: 1, rain: false, why: "Aquarium 뒤 지중해와 산을 짧게 보는 평지 산책입니다.", warning: "3월 해수욕 비추천, 자갈과 바람", official: "https://goturkiye.com/antalya/see", mapQuery: "Konyaalti Beach Antalya", operatingStatus: "open_public_space", bestFor: "Aquarium 날 30분 산책", skipIf: "비 또는 강풍", kids: "물에 들어가지 않고 산책로만 이용합니다.", groupFit: "넓은 산책로", reservation: "불필요", familyTip: "식사 뒤 30분만 걷고 호텔로 갑니다." }),
  place({ id: "ataturk_park", mediaId: "ataturk_park", name: "Atatürk Culture Park", zone: "Culture Park", category: "공원", lat: 36.8870, lng: 30.6800, duration: "30-60분", energy: 1, rain: false, why: "7 Mehmet, 박물관과 Konyaaltı 사이에서 쉬어 가기 좋은 넓은 공원입니다.", warning: "공원 안 이동거리가 길어질 수 있음", official: "https://www.antalya.bel.tr/", mapQuery: "Ataturk Kultur Parki Antalya", operatingStatus: "open_public_space", bestFor: "식사 전후 저강도 산책", skipIf: "비행 출발 여유를 줄여야 할 때", kids: "목적지를 하나 정하고 공원 전체를 횡단하지 않습니다.", groupFit: "9명 이동 용이", reservation: "불필요", familyTip: "출발일에는 선택 옵션일 뿐 필수 일정이 아닙니다." }),
  place({ id: "glass_pyramid", mediaId: "glass_pyramid", name: "Glass Pyramid Convention Center", zone: "Culture Park", category: "건축", lat: 36.8880, lng: 30.6670, duration: "15-30분", energy: 1, rain: false, why: "Culture Park의 눈에 띄는 현대 건축을 외관 중심으로 봅니다.", warning: "행사 없는 날 내부 관람을 전제하지 않음", official: "https://www.antalya.bel.tr/", mapQuery: "Cam Piramit Antalya", operatingStatus: "event_dependent", bestFor: "공원 산책 중 외관", skipIf: "별도 이동이 필요할 때", kids: "건물 모양만 보고 지나가는 정도가 적당합니다.", groupFit: "외부 공간 넓음", reservation: "행사별", familyTip: "이 장소만을 위해 가지 않습니다." }),
  place({ id: "aktur", mediaId: "aktur", name: "Aktur Park", zone: "Konyaaltı", category: "놀이", lat: 36.8873, lng: 30.6614, duration: "1-2시간", energy: 2, rain: false, why: "운영이 확인될 때 아이들에게 놀이기구 선택권을 주는 보조 옵션입니다.", warning: "3월 운영일, 기상 중단과 놀이기구별 키 제한 미확인", official: "https://www.akturpark.com.tr/", mapQuery: "Aktur Park Antalya", operatingStatus: "conditional_seasonal", bestFor: "Aquarium 뒤 체력이 남고 운영이 확인된 날", skipIf: "비, 강풍 또는 공식 운영 달력을 확인하지 못했을 때", kids: "세 아이의 키 제한이 달라 함께 못 탈 수 있습니다.", groupFit: "성인과 아이를 놀이기구별로 나눔", reservation: "운영일과 결제 방식 확인", familyTip: "Aquarium과 둘 다 오래 하지 않습니다." }),
  place({ id: "lower_duden", mediaId: "lower_duden", name: "Lower Düden Waterfall", zone: "Lara", category: "폭포", lat: 36.8516, lng: 30.7840, duration: "45-60분", energy: 1, rain: false, why: "물이 약 40m 절벽에서 지중해로 떨어지는 안탈리아의 대표 해안 장면입니다.", warning: "절벽 난간, 물보라와 강풍", official: "https://antalya.goturkiye.com/listen", mapQuery: "Lower Duden Waterfall Antalya", operatingStatus: "open_public_space", bestFor: "Perge 뒤 Lara 방향 집중 일정", skipIf: "바람이 강하거나 아이들이 유적 뒤 지쳤을 때", kids: "난간에서 떨어져 손을 잡고 전망대 2곳만 봅니다.", groupFit: "9명 차량 승하차 지점 사전 지정", reservation: "공원은 불필요", familyTip: "45분 상한으로 보고 카페 체류를 늘리지 않습니다." }),
  place({ id: "lara_beach", mediaId: "lara_beach", name: "Lara Beach", zone: "Lara", category: "해안", lat: 36.8490, lng: 30.8140, duration: "30-60분", energy: 1, rain: false, why: "운영시설이 아니라 넓은 해변 풍경을 짧게 보는 계절 외 산책 옵션입니다.", warning: "3월 수영과 비치클럽 운영을 전제하지 않음", official: "https://goturkiye.com/antalya/see", mapQuery: "Lara Beach Antalya", operatingStatus: "open_public_space_seasonal_services", bestFor: "맑고 따뜻한 날의 짧은 모래 산책", skipIf: "비, 강풍 또는 파도가 클 때", kids: "물놀이 없이 신발을 신은 채 걷습니다.", groupFit: "넓지만 차량 집결 위치 필요", reservation: "불필요", familyTip: "3월에는 호텔 수영장을 해변 대신 씁니다." }),
  place({ id: "sandland", mediaId: "sandland", name: "Sandland Antalya", zone: "Lara", category: "전시", lat: 36.8482, lng: 30.8141, duration: "45-60분", energy: 1, rain: false, why: "모래 조각 전시가 실제 운영할 때만 Lara 일정에 붙이는 조건부 장소입니다.", warning: "2027년 3월 전시, 개장일과 실제 작품 상태 미확인", official: "https://sandlandantalya.com/", mapQuery: "Sandland Antalya", operatingStatus: "conditional_seasonal", bestFor: "공식 2027 달력 확인 뒤", skipIf: "운영 달력이나 티켓 판매를 확인하지 못했을 때", kids: "야외 전시이므로 비와 바람에 취약합니다.", groupFit: "9인 온라인 구매 조건 확인", reservation: "운영 확인 후", familyTip: "핵심 일정이 아니라 Lara Beach의 보조 옵션입니다." }),
  place({ id: "terracity", mediaId: "terracity", name: "TerraCity", zone: "Lara", category: "실내 휴식", lat: 36.8555, lng: 30.7565, duration: "60-90분", energy: 1, rain: true, why: "비가 강할 때 식사와 필수품 구매를 한 건물에서 해결하는 실용적 대안입니다.", warning: "관광 핵심이 아니라 우천과 생활 보조", official: "https://www.terracity.com.tr/", mapQuery: "TerraCity Antalya", operatingStatus: "open_current_hours_vary", bestFor: "Lara 지역 폭우와 저녁 식사", skipIf: "날씨가 좋고 관광 시간이 짧을 때", kids: "놀이 목적보다 식사와 화장실 휴식으로 씁니다.", groupFit: "9명 집결 지점을 정함", reservation: "식당별", familyTip: "비상 일정으로만 남깁니다." }),
  place({ id: "perge", mediaId: "perge", name: "Perge Ancient City", zone: "Aksu", category: "유적", lat: 36.9606, lng: 30.8539, duration: "90-120분", energy: 2, rain: false, why: "열주도로, 아고라와 목욕탕이 고대 도시의 규모를 한눈에 보여 줍니다.", warning: "극장 현재 복원 폐쇄, 울퉁불퉁한 바닥과 그늘 부족", official: "https://muze.gov.tr/muze-detay?distId=PRG&sectionId=PRG01", mapQuery: "Perge Ancient City", operatingStatus: "open_theatre_closed_current", bestFor: "안탈리아 선택 이유가 되는 첫 번째 유적", skipIf: "강한 비, 번개 또는 모두의 다리 피로", kids: "유모차보다 걷는 아이 기준, 90분 상한", groupFit: "16석급 차량 대기", reservation: "현재 일반 입장, 2027 단체 조건 확인", familyTip: "극장을 찾으러 돌아가지 말고 열주도로와 아고라에 집중합니다." }),
  place({ id: "aspendos", mediaId: "aspendos", name: "Aspendos Ancient Theatre", zone: "Serik", category: "유적", lat: 36.9390, lng: 31.1720, duration: "60-90분", energy: 2, rain: false, why: "보존도가 높은 로마 극장을 한 장면으로 이해하기 좋은 장거리 선택지입니다.", warning: "시내에서 편도 약 45-60분, 계단과 행사 통제 가능", official: "https://www.muze.gov.tr/muze-detay?DistId=ASP&SectionId=ASP01", mapQuery: "Aspendos Ancient Theatre", operatingStatus: "open_current", bestFor: "맑고 모두 체력이 좋은 날의 Perge 대체 또는 집중 옵션", skipIf: "Aquarium 가족 기본안을 유지하거나 비가 강할 때", kids: "객석 위쪽까지 오르지 않아도 됩니다.", groupFit: "전용차 하루 대절", reservation: "공연일 별도, 일반 입장 재확인", familyTip: "3박 일정에서는 Perge와 둘 다 필수로 넣지 않습니다." }),
  place({ id: "termessos", mediaId: "termessos", name: "Termessos Ancient City", zone: "북서 산지", category: "고난도", lat: 36.9828, lng: 30.4643, duration: "3-4시간", energy: 3, rain: false, why: "산악 고대도시라는 독특한 가치가 있지만 이번 전 가족 기본안에는 맞지 않습니다.", warning: "가파른 바위길, 긴 도보와 날씨 변화", official: "https://muze.gov.tr/muze-detay?distId=TRM&sectionId=TRM01", mapQuery: "Termessos Ancient City", operatingStatus: "open_current", bestFor: "체력 좋은 성인과 큰아이의 별도 선택", skipIf: "6세 아이를 포함한 전 가족이 함께 움직일 때", kids: "어린아이 전원 동반 기본안에서 제외합니다.", groupFit: "전용차와 등산 준비 필요", reservation: "운영시간 재확인", familyTip: "이번 3박에서는 과감히 빼는 것이 맞습니다." }),
  place({ id: "kursunlu", mediaId: "kursunlu", name: "Kurşunlu Waterfall Nature Park", zone: "Aksu", category: "폭포", lat: 37.0037, lng: 30.8217, duration: "60-90분", energy: 2, rain: false, why: "숲길과 폭포를 Perge 또는 Aspendos 방향에 붙일 수 있습니다.", warning: "비 온 뒤 계단과 흙길이 미끄러움", official: "https://ekotaban.tarimorman.gov.tr/alan/5472", mapQuery: "Kursunlu Waterfall Antalya", operatingStatus: "open_current", bestFor: "맑은 날의 동부 자연 옵션", skipIf: "전날 비가 많거나 아이 신발이 미끄러울 때", kids: "모든 순환로를 돌지 않고 주 폭포까지만 갑니다.", groupFit: "전용차와 집결시간 필요", reservation: "현재 공원 입장, 2027 요금 확인", familyTip: "Perge 날 추가하려면 Lower Düden과 둘 중 하나만 고릅니다." }),
  place({ id: "upper_duden", mediaId: "upper_duden", name: "Upper Düden Waterfall", zone: "Kepez", category: "폭포", lat: 36.9642, lng: 30.7260, duration: "45-60분", energy: 2, rain: false, why: "도심 북쪽에서 물길과 동굴형 전망을 보는 짧은 자연 옵션입니다.", warning: "젖은 계단과 난간", official: "https://antalya.goturkiye.com/listen", mapQuery: "Upper Duden Waterfall Antalya", operatingStatus: "open_current", bestFor: "Kepez 일정과 결합", skipIf: "비가 강하거나 미끄럼 위험이 클 때", kids: "동굴형 길은 젖어 있으면 생략합니다.", groupFit: "9명 차량 주차와 집결 확인", reservation: "불필요", familyTip: "Lower Düden과 이름은 비슷하지만 위치가 달라 같은 날 둘 다 쫓지 않습니다." }),
  place({ id: "phaselis", mediaId: "phaselis", name: "Phaselis Ancient City", zone: "Kemer 방면", category: "장거리", lat: 36.5238, lng: 30.5514, duration: "2-3시간", energy: 2, rain: false, why: "고대 항구와 숲을 함께 보는 서부 장거리 대안입니다.", warning: "시내에서 편도 약 60-75분, 3월 해수욕 전제 금지", official: "https://muze.gov.tr/muze-detay?distId=PHS&sectionId=PHS01", mapQuery: "Phaselis Ancient City", operatingStatus: "open_current", bestFor: "맑은 날 유적과 숲을 우선하는 가족", skipIf: "3박 기본 일정, 비 또는 차량 멀미", kids: "해변보다 항구와 짧은 숲길 중심", groupFit: "전용차 하루 대절", reservation: "2027 운영시간 확인", familyTip: "Perge를 포기할 때만 대체합니다." }),
  place({ id: "side", mediaId: "side", name: "Side Ancient City and Museum", zone: "Manavgat", category: "장거리", lat: 36.7688, lng: 31.3908, duration: "4-6시간", energy: 3, rain: false, why: "유적과 박물관을 함께 볼 수 있지만 짧은 일정에는 이동비용이 큽니다.", warning: "Side Theatre 현재 복원 폐쇄, 장거리 차량 이동", official: "https://muze.gov.tr/muze-detay?distId=SDO&sectionId=SDM01", mapQuery: "Side Ancient City Antalya", operatingStatus: "museum_open_theatre_closed_current", bestFor: "안탈리아 시내 일정을 포기한 하루 여행", skipIf: "Aquarium과 Perge 기본안을 유지할 때", kids: "점심과 휴식을 포함한 하루가 필요합니다.", groupFit: "전용차 8-10시간", reservation: "박물관과 유적 운영 재확인", familyTip: "이번 3박에서는 카탈로그 비교용이며 기본 일정에서 제외합니다." }),
  place({ id: "antalya_museum", mediaId: "antalya_museum", name: "Antalya Archaeology Museum", zone: "Konyaaltı 동쪽", category: "제외", lat: 36.8853, lng: 30.6796, duration: "현재 관람 불가", energy: 1, rain: false, why: "소장품 가치는 크지만 공식 박물관 페이지가 현재 폐관으로 표시되어 일정에서 제외합니다.", warning: "현재 공식 폐관, 재개관 발표만으로 방문 확정 금지", official: "https://muze.gov.tr/muze-detay?DistId=ANT&SectionId=ANT01", mapQuery: "Antalya Museum", operatingStatus: "closed_current", bestFor: "재개관과 실제 티켓 판매가 모두 확인된 뒤만 재검토", skipIf: "현재는 항상 제외", kids: "대체로 Aquarium 또는 Necropolis를 사용합니다.", groupFit: "방문 불가", reservation: "불가", familyTip: "2027년 재개관 여부가 확정되기 전 일정에 넣지 않습니다." }),
  place({ id: "nekropol", mediaId: "nekropol", name: "Antalya Necropolis Museum", zone: "Doğu Garajı", category: "박물관", lat: 36.8925, lng: 30.7120, duration: "60-75분", energy: 1, rain: true, why: "2,300년 전 동부 네크로폴리스를 현장 보존형 실내 공간에서 봅니다.", warning: "9명 단체 방문은 사전 연락 권장", official: "https://antalya.ktb.gov.tr/TR-383937/antalya-nekropol-muzesi.html", mapQuery: "Antalya Nekropol Muzesi", operatingStatus: "open_current", bestFor: "Antalya Museum 폐관기의 도심 고고학 대안", skipIf: "아이들이 Aquarium 뒤 이미 지쳤을 때", kids: "한 시간 상한과 조용한 관람 규칙", groupFit: "공식 교육 포털이 단체 예약 연락을 권장", reservation: "단체 사전 연락", familyTip: "집중 모드의 오후 한 곳으로만 사용합니다." }),
  place({ id: "dokumapark", mediaId: "dokumapark", name: "DokumaPark", zone: "Kepez", category: "복합 문화", lat: 36.9204, lng: 30.7016, duration: "2-4시간", energy: 1, rain: true, why: "Science Center와 여러 박물관, 공원을 한 캠퍼스에서 고를 수 있는 우천 대안입니다.", warning: "각 시설의 휴관일과 입장시간이 서로 다를 수 있음", official: "https://www.kepez-bld.gov.tr/building_11_dokumapark", mapQuery: "DokumaPark Antalya", operatingStatus: "open_campus_current", bestFor: "폭우 날 한 장소 안에서 선택", skipIf: "월요일 출발일 또는 시내에서 오가는 시간이 부족할 때", kids: "도착 뒤 Science Center와 Toy Museum 중 하나만 먼저 고릅니다.", groupFit: "캠퍼스 집결 지점 지정", reservation: "시설별 확인", familyTip: "여러 박물관을 모두 채우지 않고 두 곳까지만 봅니다." }),
  place({ id: "science_center", mediaId: "science_center", name: "Antalya Science Center", zone: "DokumaPark", category: "실내 체험", lat: 36.9209, lng: 30.7023, duration: "90-120분", energy: 1, rain: true, why: "9개 전시 주제와 어린이 연령대별 워크숍이 있는 실내 학습 옵션입니다.", warning: "현재 월요일 휴관, 워크숍 예약과 언어 확인", official: "https://www.kepez-bld.gov.tr/building_33_antalya-bilim-merkezi", mapQuery: "Antalya Bilim Merkezi", operatingStatus: "open_except_monday_current", bestFor: "7세와 9세 중심의 폭우 대안", skipIf: "월요일 또는 영어 지원 없는 워크숍만 남았을 때", kids: "7-14세 워크숍과 4-6세 활동이 별도이므로 세 아이를 나눌 수 있습니다.", groupFit: "단체 투어와 워크숍 사전 예약", reservation: "권장", familyTip: "부모를 두 조로 나눌 계획이 있을 때 선택합니다." })
];

const culinaryGuide = "https://baka.gov.tr/assets/upload/dosyalar/culinary-culture-in-antalya-and-the-western-mediterranean.pdf";
const gaultMillau = "https://www.gault-millau.com.tr/wp-content/uploads/2025/11/GaultMillau-2025.pdf";

export const diningSpots = [
  dining({ rank: 1, id: "dining_seven_mehmet", mediaId: "dining_seven_mehmet", name: "7 Mehmet", type: "restaurant", zone: "Culture Park", neighborhood: "Meltem", lat: 36.8857, lng: 30.6804, cuisine: "현대 안탈리아 요리", kidFit: "상", meal: "점심, 조기 저녁", why: "현지 요리를 한 끼에 가장 집중해서 볼 공식 운영 식당입니다.", reviewPros: ["공식 페이지에 지역 식재료와 안탈리아 요리 정체성이 제시됨", "Gault&Millau 가이드 수록"], reviewCaution: "9명 좌석, 어린이 의자와 조기 저녁 시간을 예약할 때 확인해야 합니다.", reservation: "토요일 18시 전후를 우선해 1-2주 전 9명 예약", officialUrl: "https://7mehmet.com/en/7-mehmet-antalya", reviewSourceUrl: gaultMillau, mapQuery: "7 Mehmet Antalya" }),
  dining({ rank: 2, id: "dining_asmani", mediaId: "dining_asmani", name: "Asmani", type: "restaurant", zone: "Muratpaşa", neighborhood: "Akra V", lat: 36.8646, lng: 30.7298, cuisine: "현대 지중해식", kidFit: "확인 필요", meal: "저녁", why: "전망과 정찬을 중시할 때 고르는 성인 취향의 선택지입니다.", reviewPros: ["Akra 공식 식음 목록에 수록", "Gault&Millau 가이드 수록"], reviewCaution: "긴 정찬이 아이들에게 맞는지, 9명 테이블과 어린이 메뉴를 확인해야 합니다.", reservation: "9명과 어린이 3명을 알리고 사전 예약", officialUrl: "https://www.akrahotels.com/en/hotels/akra-v/gastronomy/", reviewSourceUrl: gaultMillau, mapQuery: "Asmani Restaurant Antalya" }),
  dining({ rank: 3, id: "dining_piyazci_ahmet", mediaId: "dining_piyazci_ahmet", name: "Piyazcı Ahmet", type: "restaurant", zone: "도심", neighborhood: "Altındağ", lat: 36.8938, lng: 30.6910, cuisine: "피야즈, 쾨프테", kidFit: "상", meal: "점심", why: "안탈리아 지리적 표시 음식인 타히니 피야즈를 캐주얼하게 먹는 후보입니다.", reviewPros: ["공식 식당 사이트 운영", "안탈리아 피야즈는 터키 특허청 지리적 표시 등록 음식"], reviewCaution: "타히니와 참깨 알레르기를 확인하고 현재 영업시간은 다시 봐야 합니다.", reservation: "9명 좌석과 어린이 의자 사전 전화", officialUrl: "https://piyazciahmet.com.tr/", mapQuery: "Piyazci Ahmet Antalya" }),
  dining({ rank: 4, id: "dining_topcu", mediaId: "dining_topcu", name: "Topçu Kebap", type: "restaurant", zone: "도심", neighborhood: "Muratpaşa", lat: 36.8888, lng: 30.7026, cuisine: "케밥, 피야즈", kidFit: "상", meal: "점심", why: "지역 음식 자료에 등장하는 전통 고기와 피야즈 후보입니다.", reviewPros: ["서부 지중해 지역 음식 공식 자료에 수록", "메뉴 범주상 여러 명이 나눠 먹기 쉬움"], reviewCaution: "현재 지점과 영업 여부를 공식 채널에서 재확인해야 합니다.", reservation: "9명 좌석 사전 확인", reviewSourceUrl: culinaryGuide, mapQuery: "Topcu Kebap Antalya" }),
  dining({ rank: 5, id: "dining_parlak", mediaId: "dining_parlak", name: "Parlak Restaurant", type: "restaurant", zone: "구시가지", neighborhood: "Zincirli Han", lat: 36.8882, lng: 30.7043, cuisine: "숯불 닭, 전통 그릴", kidFit: "상", meal: "점심, 조기 저녁", why: "도착일 칼레이치 동선에 붙이기 쉬운 전통 그릴 후보입니다.", reviewPros: ["공식 사이트에서 메뉴와 지점을 확인 가능", "Gault&Millau 가이드 수록"], reviewCaution: "9명 실내 또는 야외 좌석과 아이들이 먹을 순한 메뉴를 확인해야 합니다.", reservation: "도착일 지연 가능성을 알리고 유연한 9명 예약", officialUrl: "https://www.parlakrestaurant.com/", reviewSourceUrl: gaultMillau, mapQuery: "Parlak Restaurant Antalya" }),
  dining({ rank: 6, id: "dining_tiritcizade", mediaId: "dining_tiritcizade", name: "Tiritcizade", type: "restaurant", zone: "도심", neighborhood: "Muratpaşa", lat: 36.8890, lng: 30.7000, cuisine: "튀르키예 전통식", kidFit: "확인 필요", meal: "점심", why: "전통식 후보군을 넓히기 위한 조건부 식당입니다.", reviewPros: ["식당명과 업종 후보만 지도에서 재확인", "실제 메뉴와 운영 상태는 아직 근거가 부족함"], reviewCaution: "공식 사이트, 2027년 영업, 메뉴와 어린이 적합성을 확인하기 전 핵심 추천으로 쓰면 안 됩니다.", reservation: "현재 영업을 확인한 뒤 9명 문의", mapQuery: "Tiritcizade Antalya" }),
  dining({ rank: 7, id: "dining_seraser", mediaId: "dining_seraser", name: "Seraser Fine Dining", type: "restaurant", zone: "구시가지", neighborhood: "Kaleiçi", lat: 36.8845, lng: 30.7060, cuisine: "파인다이닝", kidFit: "확인 필요", meal: "저녁", why: "칼레이치에서 조용한 정찬을 원할 때의 성인 중심 선택입니다.", reviewPros: ["공식 식당 사이트 운영", "Gault&Millau 가이드 수록"], reviewCaution: "어린이 동반, 하이체어, 9명 한 테이블과 식사 시간을 확인해야 합니다.", reservation: "9명과 어린이 나이를 알리고 예약", officialUrl: "http://www.seraserrestaurant.com", reviewSourceUrl: gaultMillau, mapQuery: "Seraser Fine Dining Antalya" }),
  dining({ rank: 8, id: "dining_ayar", mediaId: "dining_ayar", name: "Ayar Meyhanesi", type: "restaurant", zone: "구시가지", neighborhood: "Kaleiçi", lat: 36.8829, lng: 30.7038, cuisine: "메제, 해산물", kidFit: "확인 필요", meal: "저녁", why: "메제와 해산물 중심 메이하네 경험의 조건부 후보입니다.", reviewPros: ["지도상 현재 영업과 메뉴를 재확인할 후보", "여러 접시를 나누는 식사 형식"], reviewCaution: "늦은 시간과 성인 중심 분위기일 수 있어 아이 동반 정책을 확인해야 합니다.", reservation: "18시 조기 저녁, 9명과 어린이 3명 명시", mapQuery: "Ayar Meyhanesi Antalya" }),
  dining({ rank: 9, id: "dining_yemenli", mediaId: "dining_yemenli", name: "Yemenli Meyhanesi", type: "restaurant", zone: "구시가지", neighborhood: "Kaleiçi", lat: 36.8825, lng: 30.7047, cuisine: "메제, 생선", kidFit: "확인 필요", meal: "저녁", why: "칼레이치의 메제 식사를 비교하기 위한 조건부 후보입니다.", reviewPros: ["지도에서 현재 위치와 운영을 재확인할 후보", "메제는 가족이 여러 접시를 공유할 수 있음"], reviewCaution: "어린이 동반 가능 시간, 음악 소음, 흡연 구역과 가격을 확인해야 합니다.", reservation: "9명 조기 저녁 문의", mapQuery: "Yemenli Meyhanesi Antalya" }),
  dining({ rank: 10, id: "dining_arma", mediaId: "dining_arma", name: "Club Arma", type: "restaurant", zone: "구항구", neighborhood: "Marina", lat: 36.8850, lng: 30.7000, cuisine: "지중해식, 해산물", kidFit: "중", meal: "저녁", why: "구항구 전망을 식사와 결합할 때의 조건부 후보입니다.", reviewPros: ["Antalya Convention Bureau 과거 자료에 수록", "항구 전망형 식당 후보"], reviewCaution: "현재 영업, 가격, 9명 좌석과 구항구 경사 접근을 확인해야 합니다.", reservation: "영업 확인 뒤 9명 전망석 문의", reviewSourceUrl: "https://allinantalya.org/uploads/08-2022/Antalya-Kongre-Burosu-2020.pdf", mapQuery: "Club Arma Antalya" }),
  dining({ rank: 11, id: "dining_lara_balik", mediaId: "dining_lara_balik", name: "Lara Balık", type: "restaurant", zone: "Lara", neighborhood: "Işıklar 또는 Konyaaltı", lat: 36.8554, lng: 30.7550, cuisine: "해산물", kidFit: "상", meal: "점심, 저녁", why: "일정 권역에 맞춰 Işıklar와 Konyaaltı 지점을 고를 수 있는 해산물 후보입니다.", reviewPros: ["공식 지점 페이지 운영", "Gault&Millau 가이드 수록"], reviewCaution: "방문 지점, 당일 생선 가격과 아이용 가시 제거 조리를 확인해야 합니다.", reservation: "9명 예약 시 정확한 지점 지정", officialUrl: "https://larabalik.com/subelerimiz/", reviewSourceUrl: gaultMillau, mapQuery: "Lara Balik Antalya" }),
  dining({ rank: 12, id: "dining_balikci_kaleici", mediaId: "dining_balikci_kaleici", name: "Balıkçı Meyhanesi Kaleiçi", type: "restaurant", zone: "구시가지", neighborhood: "Kaleiçi", lat: 36.8840, lng: 30.7050, cuisine: "생선, 메제", kidFit: "확인 필요", meal: "저녁", why: "구시가지 안에서 해산물 식사를 비교하는 조건부 후보입니다.", reviewPros: ["지도에서 현재 위치와 영업을 확인할 후보", "숙소가 구시가지일 때 차량 이동을 줄일 수 있음"], reviewCaution: "공식 운영 근거가 충분하지 않아 현재 영업, 어린이 동반과 가격을 먼저 확인해야 합니다.", reservation: "확인 후 9명 조기 저녁", mapQuery: "Balikci Meyhanesi Kaleici Antalya" }),
  dining({ rank: 13, id: "dining_sultanyar", mediaId: "dining_sultanyar", name: "Sultanyar Kebap", type: "restaurant", zone: "Lara", neighborhood: "Muratpaşa", lat: 36.8570, lng: 30.7520, cuisine: "케밥, 그릴", kidFit: "상", meal: "점심, 저녁", why: "Lara 지역에서 고기와 빵을 나누기 쉬운 조건부 가족 식당입니다.", reviewPros: ["지도에서 현행 지점과 메뉴를 확인할 후보", "케밥과 그릴은 아이별 선택을 나누기 쉬움"], reviewCaution: "공식 근거와 독립 후기 분석이 부족하므로 영업, 매운맛과 어린이 의자를 확인해야 합니다.", reservation: "9명 좌석과 순한 메뉴 문의", mapQuery: "Sultanyar Kebap Antalya" }),
  dining({ rank: 14, id: "dining_vahap_usta", mediaId: "dining_vahap_usta", name: "Vahap Usta Et Restaurant", type: "restaurant", zone: "Konyaaltı", neighborhood: "서부", lat: 36.8800, lng: 30.6500, cuisine: "고기, 그릴", kidFit: "상", meal: "점심, 저녁", why: "Aquarium 날 가족이 나눠 먹기 쉬운 그릴 후보입니다.", reviewPros: ["지도에서 현재 영업과 지점을 재확인할 후보", "고기와 빵 중심 메뉴 범주"], reviewCaution: "가격, 어린이 의자, 9명 좌석과 정확한 지점을 확인해야 합니다.", reservation: "Aquarium 방문 전후 시간으로 9명 문의", mapQuery: "Vahap Usta Et Restaurant Antalya" }),
  dining({ rank: 15, id: "dining_pasa_bey", mediaId: "dining_pasa_bey", name: "Paşa Bey Kebap", type: "restaurant", zone: "도심", neighborhood: "Muratpaşa", lat: 36.8850, lng: 30.6750, cuisine: "케밥", kidFit: "상", meal: "점심", why: "도심에서 순한 고기와 빵을 고를 수 있는 조건부 식사 후보입니다.", reviewPros: ["지도에서 현재 영업과 메뉴를 확인할 후보", "메뉴 범주상 단체가 여러 종류를 주문 가능"], reviewCaution: "공식 운영 근거가 충분하지 않아 지점, 가격과 매운맛을 재확인해야 합니다.", reservation: "9명 좌석 문의", mapQuery: "Pasa Bey Kebap Antalya" }),
  dining({ rank: 16, id: "dining_kosk_kebap", mediaId: "dining_kosk_kebap", name: "Köşk Kebap", type: "restaurant", zone: "도심", neighborhood: "Muratpaşa", lat: 36.8900, lng: 30.7050, cuisine: "케밥, 되네르", kidFit: "상", meal: "점심", why: "빠른 점심을 위한 전통 고기 후보입니다.", reviewPros: ["지도에서 현행 운영을 확인할 후보", "짧은 점심에 맞는 메뉴 범주"], reviewCaution: "동명 식당이 있을 수 있어 정확한 지점과 위생, 가격, 좌석을 확인해야 합니다.", reservation: "9명 한 번에 입장 가능한지 문의", mapQuery: "Kosk Kebap Antalya" }),
  dining({ rank: 17, id: "dining_can_can", mediaId: "dining_can_can", name: "Can Can Pide Yemek Salonu", type: "restaurant", zone: "Kepez", neighborhood: "도심 북쪽", lat: 36.9090, lng: 30.6990, cuisine: "피데, 가정식", kidFit: "상", meal: "점심", why: "피데와 가정식으로 세 아이의 선택을 단순화하는 조건부 후보입니다.", reviewPros: ["지도에서 현행 운영과 메뉴를 확인할 후보", "피데는 아이들과 나누기 쉬운 메뉴 범주"], reviewCaution: "공식 운영 근거, 현재 영업과 9명 좌석을 확인해야 합니다.", reservation: "DokumaPark 일정일에만 9명 문의", mapQuery: "Can Can Pide Yemek Salonu Antalya" }),
  dining({ rank: 18, id: "dining_sisci_ramazan", mediaId: "dining_sisci_ramazan", name: "Şişçi Ramazan", type: "restaurant", zone: "도심", neighborhood: "Muratpaşa", lat: 36.8940, lng: 30.7100, cuisine: "시시 케밥", kidFit: "상", meal: "점심", why: "짧은 현지식 점심을 비교하는 조건부 후보입니다.", reviewPros: ["지도에서 현재 지점과 영업을 확인할 후보", "시시 케밥과 빵 중심 메뉴 범주"], reviewCaution: "동명 식당과 지점 혼동을 피하고 매운맛, 가격과 좌석을 확인해야 합니다.", reservation: "9명 방문 전 전화 확인", mapQuery: "Sisci Ramazan Antalya" }),
  dining({ rank: 19, id: "dining_pablito", mediaId: "dining_pablito", name: "Pablito Bistro", type: "restaurant", zone: "Muratpaşa", neighborhood: "Akra", lat: 36.8644, lng: 30.7287, cuisine: "피자, 그릴, 퓨전", kidFit: "상", meal: "점심, 저녁", why: "피자와 그릴이 있어 여러 세대가 메뉴를 합의하기 쉬운 호텔 식당입니다.", reviewPros: ["Akra 공식 페이지에 메뉴 범주 안내", "숙소가 Akra일 때 추가 이동이 없음"], reviewCaution: "비투숙객 예약, 어린이 의자와 9명 테이블을 확인해야 합니다.", reservation: "도착일 지연을 고려해 유연한 예약 요청", officialUrl: "https://www.akrahotels.com/en/hotels/akra-antalya/gastronomy/restaurants/pablito-bistro/", mapQuery: "Pablito Bistro Akra Antalya" }),
  dining({ rank: 20, id: "dining_grill_house", mediaId: "dining_grill_house", name: "Grill House Antalya", type: "restaurant", zone: "Lara", neighborhood: "Muratpaşa", lat: 36.8520, lng: 30.7590, cuisine: "그릴, 스테이크", kidFit: "확인 필요", meal: "저녁", why: "Lara 권역의 고기 식당을 비교하기 위한 조건부 후보입니다.", reviewPros: ["지도에서 현행 운영과 정확한 상호를 확인할 후보", "그릴 메뉴 범주"], reviewCaution: "동명 식당 가능성이 있어 정확한 지점, 공식 채널, 가격과 어린이 메뉴 확인이 필요합니다.", reservation: "확인 후 9명 좌석 문의", mapQuery: "Grill House Antalya Lara" }),
  dining({ rank: 21, id: "dining_sudd_lara", mediaId: "dining_sudd_lara", name: "The Sudd Lara", type: "cafe", zone: "Lara", neighborhood: "Fener", lat: 36.8550, lng: 30.7600, cuisine: "스페셜티 커피", kidFit: "중", meal: "휴식", why: "Lower Düden 또는 Lara 동선 중 짧게 쉬는 공식 지점 후보입니다.", reviewPros: ["공식 지점 목록 운영", "커피 중심의 짧은 체류"], reviewCaution: "정확한 지점, 좌석과 어린이 음료를 확인해야 합니다.", reservation: "9명은 혼잡시간을 피해 좌석 문의", officialUrl: "https://thesudd.com/Magazalarimiz", mapQuery: "The Sudd Lara Antalya" }),
  dining({ rank: 22, id: "dining_sudd_konyaalti", mediaId: "dining_sudd_konyaalti", name: "The Sudd Konyaaltı", type: "cafe", zone: "Konyaaltı", neighborhood: "해변권", lat: 36.8730, lng: 30.6470, cuisine: "스페셜티 커피", kidFit: "중", meal: "휴식", why: "Aquarium과 Konyaaltı 사이의 짧은 카페 정지점입니다.", reviewPros: ["공식 지점 목록 운영", "서부 일정에 맞는 카페 후보"], reviewCaution: "2027년 지점 유지, 좌석과 영업시간을 확인해야 합니다.", reservation: "9명은 방문 전 좌석 문의", officialUrl: "https://thesudd.com/Magazalarimiz", mapQuery: "The Sudd Konyaalti Antalya" }),
  dining({ rank: 23, id: "dining_schiller", mediaId: "dining_schiller", name: "Schiller Kaffee", type: "cafe", zone: "도심", neighborhood: "Muratpaşa", lat: 36.8850, lng: 30.7100, cuisine: "커피, 디저트", kidFit: "중", meal: "휴식", why: "도심 산책 중 커피와 디저트를 위한 조건부 후보입니다.", reviewPros: ["지도에서 현행 지점과 운영을 확인할 후보", "짧은 휴식에 맞는 업종"], reviewCaution: "공식 채널, 정확한 지점, 9명 좌석과 흡연 구역을 확인해야 합니다.", reservation: "9명 좌석 문의", mapQuery: "Schiller Kaffee Antalya" }),
  dining({ rank: 24, id: "dining_varuna", mediaId: "dining_varuna", name: "Varuna Gezgin Cafe", type: "cafe", zone: "구시가지", neighborhood: "Kaleiçi", lat: 36.8830, lng: 30.7040, cuisine: "카페, 가벼운 식사", kidFit: "중", meal: "휴식", why: "칼레이치에서 음료와 간단한 식사를 함께 해결하는 조건부 후보입니다.", reviewPros: ["지도에서 현재 영업과 위치를 확인할 후보", "음료와 식사를 함께 고를 수 있는 업종"], reviewCaution: "계단, 소음, 흡연 구역과 9명 좌석을 확인해야 합니다.", reservation: "혼잡시간 전 9명 문의", mapQuery: "Varuna Gezgin Cafe Antalya" }),
  dining({ rank: 25, id: "dining_rokka", mediaId: "dining_rokka", name: "Rokka", type: "cafe", zone: "Muratpaşa", neighborhood: "Işıklar", lat: 36.8790, lng: 30.7100, cuisine: "조식, 카페", kidFit: "상", meal: "아침, 브런치", why: "가벼운 아침이나 늦은 점심을 비교하는 조건부 후보입니다.", reviewPros: ["지도에서 현행 운영과 메뉴를 확인할 후보", "조식과 가벼운 메뉴 범주"], reviewCaution: "공식 채널과 어린이 메뉴, 9명 좌석을 확인해야 합니다.", reservation: "주말 9명 좌석 문의", mapQuery: "Rokka Antalya Cafe" }),
  dining({ rank: 26, id: "dining_arabica_lara", mediaId: "dining_arabica_lara", name: "Arabica Coffee House Lara", type: "cafe", zone: "Lara", neighborhood: "Fener", lat: 36.8560, lng: 30.7550, cuisine: "커피, 베이커리", kidFit: "중", meal: "휴식", why: "Lara에서 빠르게 쉬는 체인형 카페 후보입니다.", reviewPros: ["지도에서 현행 지점과 운영을 확인할 후보", "표준화된 음료 선택을 기대할 수 있는 체인형 업종"], reviewCaution: "2027년 지점 유지, 좌석과 어린이 음료를 확인해야 합니다.", reservation: "9명은 좌석 문의", mapQuery: "Arabica Coffee House Lara Antalya" }),
  dining({ rank: 27, id: "dining_beaver", mediaId: "dining_beaver", name: "Beaver Coffee", type: "cafe", zone: "Konyaaltı", neighborhood: "서부", lat: 36.8700, lng: 30.6350, cuisine: "스페셜티 커피", kidFit: "중", meal: "휴식", why: "Konyaaltı 서부 일정에서 커피를 위한 조건부 후보입니다.", reviewPros: ["지도에서 현행 운영을 확인할 후보", "커피 중심의 짧은 체류"], reviewCaution: "정확한 지점, 공식 채널, 좌석과 영업시간을 확인해야 합니다.", reservation: "9명은 비혼잡시간 방문", mapQuery: "Beaver Coffee Antalya" }),
  dining({ rank: 28, id: "dining_soulmate", mediaId: "dining_soulmate", name: "Soulmate Coffee", type: "cafe", zone: "도심", neighborhood: "Muratpaşa", lat: 36.8860, lng: 30.7090, cuisine: "커피, 디저트", kidFit: "중", meal: "휴식", why: "도심에서 짧게 커피와 디저트를 먹는 조건부 후보입니다.", reviewPros: ["지도에서 현행 운영과 위치를 확인할 후보", "짧은 휴식에 맞는 업종"], reviewCaution: "동명 업장 가능성, 공식 채널과 9명 좌석을 확인해야 합니다.", reservation: "방문 전 9명 좌석 문의", mapQuery: "Soulmate Coffee Antalya" }),
  dining({ rank: 29, id: "dining_yemen_kahvesi", mediaId: "dining_yemen_kahvesi", name: "Yemen Kahvesi Kaleiçi", type: "cafe", zone: "구시가지", neighborhood: "Kaleiçi", lat: 36.8840, lng: 30.7030, cuisine: "튀르키예 커피, 차", kidFit: "중", meal: "휴식", why: "칼레이치에서 튀르키예식 커피와 차를 짧게 경험하는 조건부 후보입니다.", reviewPros: ["지도에서 현행 지점과 운영을 확인할 후보", "전통 커피와 차 메뉴 범주"], reviewCaution: "카페인 없는 어린이 음료, 흡연 구역과 9명 좌석을 확인해야 합니다.", reservation: "9명은 혼잡시간 회피", mapQuery: "Yemen Kahvesi Kaleici Antalya" }),
  dining({ rank: 30, id: "dining_demlik", mediaId: "dining_demlik", name: "Demlik Cafe", type: "cafe", zone: "구시가지", neighborhood: "Kaleiçi", lat: 36.8830, lng: 30.7060, cuisine: "차, 간단한 디저트", kidFit: "중", meal: "휴식", why: "칼레이치 산책을 끊어 주는 차 중심의 조건부 후보입니다.", reviewPros: ["지도에서 현행 운영과 정확한 상호를 확인할 후보", "차와 간단한 디저트 업종"], reviewCaution: "동명 업장 가능성이 있어 위치, 공식 채널, 가격과 좌석을 확인해야 합니다.", reservation: "9명 방문 전 좌석 문의", mapQuery: "Demlik Cafe Antalya Kaleici" })
];

export const budgetModel = {
  people: 9,
  nights: 3,
  currency: "KRW",
  defaultStay: "city-hotel-envelope",
  defaultOrigin: "ist-ayt-envelope",
  contingencyRate: 0.15,
  observationStatus: "아래 금액은 실시간 가격이나 2027년 예측이 아니라 의사결정용 증분 지출 한도입니다.",
  stayOptions: [
    { id: "city-hotel-envelope", label: "시내 호텔 4실 계획 한도", familyTotal: 2400000, note: "객실당 1박 20만원을 둔 내부 계획 한도입니다. 관측 요금이 아니며 기존 이스탄불 숙소 비용 위에 추가됩니다." },
    { id: "pool-resort-envelope", label: "실내 수영장 리조트 계획 한도", familyTotal: 3600000, note: "객실당 1박 30만원을 둔 내부 계획 한도입니다. 실제 견적이 이 값을 넘으면 원안을 재검토합니다." },
    { id: "residence-envelope", label: "레지던스 2채 계획 한도", familyTotal: 2100000, note: "한 채당 1박 35만원을 둔 내부 계획 한도입니다. 실제 매물이나 관측 가격이 아닙니다." }
  ],
  sharedLines: [
    { label: "AYT 왕복과 도심 이동 차량 한도", familyTotal: 500000, note: "16석급 차량, 어린이 좌석 3개와 수하물 적재를 포함해 받을 견적의 계획 한도입니다." },
    { label: "Perge 또는 집중일 전용차 한도", familyTotal: 700000, note: "기사 포함 8시간 차량 견적의 계획 한도이며 현지 관측가가 아닙니다." },
    { label: "입장권과 현지 추가비 한도", familyTotal: 700000, note: "9명의 유적과 Aquarium 입장료, 현지 교통 차이를 위한 계획 한도입니다. 2027 요금은 미확정입니다." }
  ],
  origins: [
    { id: "ist-ayt-envelope", label: "IST-AYT 왕복 계획 한도", people: 9, flightPerPerson: 300000, note: "1인 왕복 30만원을 의사결정 한도로 둡니다. 실제 운임이나 예측치가 아닙니다." }
  ]
};

const currentTryKrw = 1577.57 / 55.9145;
const yearEnd2025TryKrw = 1696.94 / 50.4838;
const nominalChangeSinceYearEndPct = ((currentTryKrw / yearEnd2025TryKrw) - 1) * 100;
const julyTurkeyCpiYoY = 31.75;

export const fxStrategy = {
  checkedAt: CHECKED_AT,
  sourceDate: "2026-09-02",
  rates: {
    tryKrw: currentTryKrw,
    nominalChangeSinceYearEndPct,
    combinedCostChangePct: ((1 + nominalChangeSinceYearEndPct / 100) * (1 + julyTurkeyCpiYoY / 100) - 1) * 100
  },
  headline: "리라 약세만으로 2027년 여행비가 싸진다고 볼 수 없습니다.",
  diagnosis: "ECB 2026년 9월 2일 교차환율은 1 TRY 약 28.22원입니다. 2025년 말보다 원화 기준 리라는 약 16% 낮지만, 터키의 2026년 7월 소비자물가는 전년 대비 31.75% 높았습니다. 서로 기간이 다른 단순 결합은 약 10.6% 상승이므로 가격 예측이 아니라 환율 할인 착시를 반박하는 스트레스 테스트로만 씁니다.",
  actions: [
    { rank: 1, title: "TRY와 EUR 견적 분리", body: "호텔이 EUR로, 식당이 TRY로 제시하면 같은 환율 가정으로 섞지 않습니다.", tone: "primary" },
    { rank: 2, title: "DCC 거절", body: "현지 카드 단말기에서는 KRW 환산 대신 계약 통화를 선택하고 카드사 수수료를 따로 봅니다.", tone: "neutral" },
    { rank: 3, title: "증분 한도부터 잠금", body: "실제 견적이 계획 한도를 넘으면 리라 약세를 이유로 합리화하지 않고 이스탄불 원안과 다시 비교합니다.", tone: "warning" }
  ],
  sources: [
    { title: "ECB 2026-09-02 EUR 기준 KRW와 TRY", url: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html" },
    { title: "ECB 2025-12-31 기준 KRW와 TRY", url: "https://www.ecb.europa.eu/stats/exchange/eurofxref/shared/pdf/2025/12/20251231.pdf" },
    { title: "TÜİK 2026년 7월 소비자물가", url: "https://veriportali.tuik.gov.tr/Bulten/Index?dil=1&p=Tuketici-Fiyat-Endeksi-Temmuz-2026-58297" }
  ]
};

export const climate = {
  source: "튀르키예 기상청 Antalya 1991-2020 평년값",
  summary: "3월 평균 13.1°C, 평균 최고 18.4°C, 평균 최저 8.3°C입니다. 평균 강수일은 월 9.57일, 월 강수량은 94.5mm여서 맑은 해안 산책과 차가운 비가 모두 가능합니다.",
  packing: ["가벼운 방수 재킷", "겹쳐 입을 옷", "미끄럼 방지 운동화", "접이식 우산", "아이 여벌 양말", "실내 수영복"],
  note: "장기 평년값은 2027년 예보가 아닙니다. 출발 7일 전 실제 강수와 풍속으로 3월 27일과 28일을 바꿉니다.",
  official: "https://mgm.gov.tr/veridegerlendirme/il-ve-ilceler-istatistik.aspx?k=H&m=ANTALYA"
};

export const sources = [
  { title: "MGM Antalya 공식 기후 통계", url: climate.official, checkedAt: CHECKED_AT },
  { title: "Turkish Airlines Istanbul-Antalya 노선", url: "https://www.turkishairlines.com/en/flights-from-istanbul-to-antalya", checkedAt: CHECKED_AT },
  { title: "Antalya Airport 공식 교통", url: "https://www.antalya-airport.aero/passengers-visitors/transportation", checkedAt: CHECKED_AT },
  { title: "Antalya Airport 버스와 AntRay", url: "https://www.antalya-airport.aero/passengers-visitors/transportation-parking/buses-and-mass-transport", checkedAt: CHECKED_AT },
  { title: "GoTürkiye Antalya 볼거리", url: "https://goturkiye.com/antalya/see", checkedAt: CHECKED_AT },
  { title: "Antalya Municipality Kaleiçi", url: "https://www.antalya.bel.tr/en/kaleici", checkedAt: CHECKED_AT },
  { title: "Antalya Aquarium 공식 운영 정보", url: "https://www.antalyaaquarium.com/En/Anasayfa", checkedAt: CHECKED_AT },
  { title: "Perge 공식 박물관 페이지", url: "https://muze.gov.tr/muze-detay?distId=PRG&sectionId=PRG01", checkedAt: CHECKED_AT },
  { title: "Aspendos 공식 박물관 페이지", url: "https://www.muze.gov.tr/muze-detay?DistId=ASP&SectionId=ASP01", checkedAt: CHECKED_AT },
  { title: "Antalya Museum 공식 폐관 상태", url: "https://muze.gov.tr/muze-detay?DistId=ANT&SectionId=ANT01", checkedAt: CHECKED_AT },
  { title: "Antalya Necropolis Museum", url: "https://antalya.ktb.gov.tr/TR-383937/antalya-nekropol-muzesi.html", checkedAt: CHECKED_AT },
  { title: "DokumaPark 공식 안내", url: "https://www.kepez-bld.gov.tr/building_11_dokumapark", checkedAt: CHECKED_AT },
  { title: "Antalya Science Center 공식 안내", url: "https://www.kepez-bld.gov.tr/building_33_antalya-bilim-merkezi", checkedAt: CHECKED_AT },
  { title: "Kurşunlu Waterfall 공식 자연공원", url: "https://ekotaban.tarimorman.gov.tr/alan/5472", checkedAt: CHECKED_AT },
  { title: "Akra 객실과 가족 객실", url: "https://www.akrahotels.com/en/hotels/akra-antalya/rooms-and-suites/", checkedAt: CHECKED_AT },
  { title: "Akra 수영장 계절 운영", url: "https://www.akrahotels.com/en/hotels/akra-antalya/beach-and-pools/", checkedAt: CHECKED_AT },
  { title: "AkraFit 실내 수영장 연령 표기", url: "https://www.akrafit.com/en/pool/", checkedAt: CHECKED_AT },
  { title: "Megasaray WestBeach 수영장", url: "https://www.megasarayhotels.com/megasaray-westbeach-antalya/pools-beach", checkedAt: CHECKED_AT },
  { title: "DoubleTree Antalya 공식 편의시설", url: "https://www.hilton.com/en/hotels/aytccdi-doubletree-antalya-city-centre/", checkedAt: CHECKED_AT },
  { title: "Lara Barut 가열 수영장 정책", url: "https://baruthotels.com/en/experiences/heated-swimming-pools", checkedAt: CHECKED_AT },
  { title: "Gault&Millau Türkiye 공개 가이드", url: gaultMillau, checkedAt: CHECKED_AT },
  { title: "안탈리아 피야즈 지리적 표시", url: "https://ci.turkpatent.gov.tr/cografi-isaretler/detay/38277", checkedAt: CHECKED_AT },
  { title: "ECB 공식 환율", url: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html", checkedAt: CHECKED_AT },
  { title: "TÜİK 2026년 7월 소비자물가", url: "https://veriportali.tuik.gov.tr/Bulten/Index?dil=1&p=Tuketici-Fiyat-Endeksi-Temmuz-2026-58297", checkedAt: CHECKED_AT }
];

export const heroImage = media.kaleici.image;
