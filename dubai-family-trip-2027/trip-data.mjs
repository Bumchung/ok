export const CHECKED_AT = "2026-09-01";

export const trip = {
  title: "DUBAI FAMILY TRIP",
  subtitle: "세 가족이 한 빌라에 머물며, 관광과 수영을 번갈아 하는 여행",
  destination: "두바이",
  startDate: "2027-03-20",
  arrivalDate: "2027-03-21",
  checkoutDate: "2027-03-31",
  nights: 10,
  adults: 6,
  children: [9, 7, 6],
  principles: [
    "관광한 다음 날에는 멀리 나가지 않는다.",
    "차량 편도 30분이 넘는 일정은 하루에 하나만 잡는다.",
    "아이 셋의 수영과 휴식을 관광보다 먼저 고정한다.",
    "사막 사파리와 Old Dubai는 숙소 위치가 맞을 때만 선택한다."
  ],
  sourceDeck: "https://docs.google.com/presentation/d/1DqhJV7cJ0mCBQksIhufKVJgnU6vMFRkCA5b5NxnU95Q/edit?slide=id.p15#slide=id.p15"
};

export const familyGroups = [
  {
    id: "icn",
    label: "서울 출발팀",
    origin: "ICN",
    members: "성인 4, 어린이 1",
    route: "인천 → 두바이 직항",
    target: "3월 20일 출발, 3월 21일 도착 직항 우선",
    carriers: "Emirates ICN-DXB 직항을 기준으로 비교",
    status: "2027년 편명과 운항일은 발권 시 공식 시간표 재확인"
  },
  {
    id: "lax",
    label: "로스앤젤레스 출발팀",
    origin: "LAX",
    members: "성인 2, 어린이 2",
    route: "로스앤젤레스 → 두바이 직항",
    target: "3월 20일 출발, 도착 즉시 개별 차량 이동",
    carriers: "Emirates LAX-DXB 직항을 기준으로 비교",
    status: "두 팀의 도착 시간을 억지로 맞추지 않고 숙소에서 합류"
  }
];

export const lodgingOptions = [
  {
    id: "zabeel", rank: 1,
    name: "Jumeirah Zabeel Saray, Five Bedroom Pool Royal Villa",
    type: "실제 2027 견적이 잡힌 5베드룸 빌라",
    verdict: "한 집 생활과 Trip.com 실경비를 같이 만족하는 현재 1순위",
    capacity: "공식 최대 12명, 이번 6성인과 3아동 수용 가능",
    layout: "침실 5, 전용 수영장, 완전한 주방과 거실",
    location: "Palm Jumeirah West Crescent", fit: 94,
    good: ["이번 6+3 구성을 한 채에 공식 수용", "Trip.com에서 2027년 10박 실견적 확인", "키즈클럽, 해변, 조식 포함 표기", "쉬는 날은 호텔 밖으로 나가지 않아도 됨"],
    cautions: ["Downtown과 Old Dubai까지 이동이 길다", "무료 취소와 결제 시점은 미노출", "4베드룸보다 큰 5베드룸이라 공간은 남음"],
    action: "실견적을 기준으로 취소 규정과 결제 시점, 침대 배치도를 서면 요청",
    bookingModel: "hotel_residence",
    hotelPlan: { rooms: 1, arrangement: "Five Bedroom Pool Royal Villa 1채", connection: "not_required", occupancyApproved: true },
    official: "https://www.jumeirah.com/en/stay/dubai/jumeirah-zabeel-saray/accommodation/five-bedroom-royal-residences-with-private-pool-exclusive",
    maps: "https://www.google.com/maps/search/?api=1&query=Jumeirah%20Zabeel%20Saray%20Dubai",
    lat: 25.0986, lng: 55.1233
  },
  {
    id: "marsa", rank: 2,
    name: "Jumeirah Marsa Al Arab, Marina Deluxe 4실",
    type: "실제 2027 견적이 잡힌 호텔 객실형",
    verdict: "한 집은 아니지만 이동이 가장 편하고 Trip.com에서 요청한 6+3, 4실 조합이 실제로 검색됨",
    capacity: "성인 6명과 아이 3명, Marina Deluxe 객실 4실",
    layout: "호텔 객실 4실, 같은 층과 인접 배정은 별도 요청",
    location: "Jumeirah, Madinat 권역", fit: 93,
    good: ["Madinat와 해변이 가까움", "Downtown과 Palm 사이 이동 균형", "Trip.com에서 2027년 10박 4실 실견적 확인", "키즈클럽과 워터파크 이용"],
    cautions: ["네 객실이 연결되거나 같은 층이라는 보장은 없음", "세 가족이 한 거실을 공유할 수 없음", "객실별 침대 배치와 어린이 기존 침대 사용 조건 확인"],
    action: "Trip.com 환불 가능 조건을 보존하고 호텔에 같은 층 인접 4실과 어린이 침대 배치를 서면 요청",
    bookingModel: "hotel_rooms",
    hotelPlan: { rooms: 4, arrangement: "Marina Deluxe 객실 4실", connection: "request_only", occupancyApproved: true },
    official: "https://www.jumeirah.com/en/stay/dubai/jumeirah-marsa-al-arab",
    maps: "https://www.google.com/maps/search/?api=1&query=Jumeirah%20Marsa%20Al%20Arab%20Dubai",
    lat: 25.1419, lng: 55.1848
  },
  {
    id: "raffles", rank: 3,
    name: "Raffles The Palm Dubai, Royal Villa Four Bedroom",
    type: "프라이버시가 강한 대형 독립 빌라",
    verdict: "한 채로 쓰는 만족도는 높지만 Palm 서쪽이라 차에 오래 있어야 함",
    capacity: "공식 최대 10명",
    layout: "950㎡, 침실 4, 주방, 전용 수영장과 출입구",
    location: "Palm Jumeirah West Crescent", fit: 88,
    good: ["3 king과 1 twin 표기", "전용 수영장과 주방", "기사와 도우미 공간", "24시간 인룸 다이닝"],
    cautions: ["twin 표기의 실제 침대 수가 모호함", "Downtown 왕복이 길다", "아동별 침대와 rollaway 확인 필요"],
    action: "floor plan과 9인 침대표를 받은 뒤 Zabeel Saray와 비교",
    bookingModel: "hotel_residence",
    hotelPlan: { rooms: 1, arrangement: "Royal Villa Four Bedroom 1채", connection: "not_required", occupancyApproved: false },
    official: "https://www.raffles.com/thepalm-dubai/rooms-and-suites/v4a/",
    maps: "https://www.google.com/maps/search/?api=1&query=Raffles%20The%20Palm%20Dubai",
    lat: 25.1057, lng: 55.1218
  },
  {
    id: "kempinski", rank: 4,
    name: "Kempinski Palm Jumeirah, Superior Four-Bedroom Penthouse",
    type: "침대 구성이 비교적 명확한 펜트하우스",
    verdict: "성인 배치는 명확하지만 세 번째 아동 침대 확인 필요",
    capacity: "공식 최대 10명",
    layout: "420㎡, 3 king과 2 twin, 주방, 욕실 4",
    location: "Palm Jumeirah West Crescent", fit: 84,
    good: ["성인 6명용 king 3개", "주방과 넓은 공용 공간", "공식 최대 10명", "리조트 서비스 이용"],
    cautions: ["어린이 3명 대비 twin 2개", "세 번째 아동 extra bed 확약 필요", "도시 관광에는 이동이 길다"],
    action: "extra bed를 포함한 총 침대 수와 10박 조건을 서면 확인",
    bookingModel: "hotel_residence",
    hotelPlan: { rooms: 1, arrangement: "Superior Four-Bedroom Penthouse 1채", connection: "not_required", occupancyApproved: false },
    official: "https://www.kempinski.com/en/palm-jumeirah/rooms-suites/penthouses/superior-four-bedroom-penthouse",
    maps: "https://www.google.com/maps/search/?api=1&query=Kempinski%20Hotel%20Palm%20Jumeirah",
    lat: 25.1112, lng: 55.1137
  },
  {
    id: "mandarin-jumeira", rank: 5,
    name: "Mandarin Oriental Jumeira, 호텔 객실 4실",
    type: "Jumeirah 해변의 호텔 객실형",
    verdict: "서비스와 도심 접근이 좋지만 한집 생활은 포기하고 보증금과 조식을 따로 계산해야 함",
    capacity: "성인 6명과 아이 3명, 객실 4실 조합",
    layout: "킹 또는 트윈 객실 4실, 인접 객실 요청",
    location: "Jumeira 1", fit: 82,
    good: ["Downtown과 Old Dubai 접근이 Palm보다 짧음", "해변과 키즈클럽", "Trip.com에서 2027년 10박 4실 실견적 확인"],
    cautions: ["인접 또는 연결 객실 확약 필요", "무료 취소와 결제 시점은 미노출", "조식 포함 표기가 없어 별도 확인 필요"],
    action: "같은 층 객실 4실, 어린이 침대, 보증금, 조식, 세금 포함 총액을 한 문서로 요청",
    bookingModel: "hotel_rooms",
    hotelPlan: { rooms: 4, arrangement: "더블 2실과 트윈 2실 우선", connection: "request_only", occupancyApproved: false },
    official: "https://www.mandarinoriental.com/en/dubai/jumeira-beach",
    maps: "https://www.google.com/maps/search/?api=1&query=Mandarin%20Oriental%20Jumeira%20Dubai",
    lat: 25.2290, lng: 55.2603
  },
  {
    id: "four-seasons", rank: 6,
    name: "Four Seasons Resort Dubai at Jumeirah Beach, 호텔 객실 4실",
    type: "도심과 해변 사이 호텔 객실형",
    verdict: "Jumeirah 입지와 가족 서비스는 좋지만 같은 가격으로 4실을 동시에 잡을 수 있는지가 약점",
    capacity: "성인 6명과 아이 3명, 객실 4실 조합",
    layout: "킹 또는 트윈 객실 4실, 인접 객실 요청",
    location: "Jumeirah Beach", fit: 80,
    good: ["Downtown과 해변 사이 이동 균형", "키즈클럽과 수영장", "호텔형 서비스를 선호할 때 강한 선택"],
    cautions: ["한 거실을 공유할 수 없음", "검색 카드에 이 가격 객실이 1실만 남았다고 표시됨", "무료 취소 마감일과 결제 시점은 미노출"],
    action: "동일 요금으로 4실이 실제 결제 단계까지 유지되는지 먼저 확인하고 같은 층 배정을 요청",
    bookingModel: "hotel_rooms",
    hotelPlan: { rooms: 4, arrangement: "더블 2실과 트윈 2실 우선", connection: "request_only", occupancyApproved: false },
    official: "https://www.fourseasons.com/dubaijb/",
    maps: "https://www.google.com/maps/search/?api=1&query=Four%20Seasons%20Resort%20Dubai%20at%20Jumeirah%20Beach",
    lat: 25.2025, lng: 55.2402
  },
  {
    id: "jumeirah-beach", rank: 7,
    name: "Jumeirah Beach Hotel, Ocean Deluxe 4실",
    type: "이동과 가격 균형이 좋은 호텔 객실형",
    verdict: "호텔 4실 중 가격이 낮고 Madinat 권역이 가깝지만 Wild Wadi 재개 여부는 다시 봐야 함",
    capacity: "성인 6명과 아이 3명, Ocean Deluxe 객실 4실",
    layout: "호텔 객실 4실, 같은 층과 인접 배정 요청",
    location: "Jumeirah, Burj Al Arab 옆", fit: 86,
    good: ["Trip.com 2027년 4실 실견적 확인", "Madinat와 해변이 가까움", "Marsa보다 총액이 크게 낮음"],
    cautions: ["Wild Wadi가 현재 별도 공지까지 폐장 상태", "무료 취소 마감일은 미노출", "연결 객실과 조식 포함 여부 확인 필요"],
    action: "Wild Wadi 재개와 공사 종료, 같은 층 4실, 조식과 취소 마감일을 한 번에 확인",
    bookingModel: "hotel_rooms",
    hotelPlan: { rooms: 4, arrangement: "Ocean Deluxe 객실 4실", connection: "request_only", occupancyApproved: true },
    official: "https://www.jumeirah.com/en/Stay/Dubai/Jumeirah-Beach-Hotel",
    maps: "https://www.google.com/maps/search/?api=1&query=Jumeirah%20Beach%20Hotel%20Dubai",
    lat: 25.1412, lng: 55.1911
  },
  {
    id: "al-naseem", rank: 8,
    name: "Jumeirah Al Naseem, Resort Room 4실",
    type: "Madinat 안쪽의 호텔 객실형",
    verdict: "입지는 매우 편하지만 Trip.com 침대 표기가 이상해 결제 전 객실 구성을 다시 확인해야 함",
    capacity: "성인 6명과 아이 3명, Resort Room 4실",
    layout: "호텔 객실 4실, 같은 층과 인접 배정 요청",
    location: "Madinat Jumeirah", fit: 84,
    good: ["Madinat Abra와 해변이 바로 옆", "Trip.com 2027년 4실 실견적 확인", "무료 취소 표기"],
    cautions: ["Trip.com 카드에 침대가 싱글 1개로 표시돼 오류 가능성", "무료 취소 마감일과 결제 시점 미노출", "한 거실을 공유할 수 없음"],
    action: "실제 king 또는 twin 구성, 소파베드, 연결 가능 객실과 취소 마감일을 호텔에 확인",
    bookingModel: "hotel_rooms",
    hotelPlan: { rooms: 4, arrangement: "Resort Room 객실 4실", connection: "request_only", occupancyApproved: false },
    official: "https://www.jumeirah.com/Stay/Dubai/Jumeirah-Al-Naseem",
    maps: "https://www.google.com/maps/search/?api=1&query=Jumeirah%20Al%20Naseem%20Dubai",
    lat: 25.1329, lng: 55.1865
  }
];

export const tripComCostSummary = {
  provider: "Trip.com",
  capturedAt: CHECKED_AT,
  requestedStay: "2027-03-21부터 03-31, 10박",
  requestedOccupancy: "성인 6명, 아이 3명, 호텔 객실 4실",
  exactQuoteStatus: "동일 조건의 세금 포함 실견적을 호텔 5곳과 5베드룸 빌라 1곳에서 확인했습니다.",
  benchmarkLabel: "Trip.com 최근 12개월 두바이 5성급 평균",
  benchmarkNightly: "평일 1,065,110원, 주말 1,054,208원",
  benchmarkTotal: "약 42,517,184원",
  benchmarkFormula: "평일 8박과 주말 2박, 객실 4실 단순 환산",
  sourceUrl: "https://kr.trip.com/hotels/dubai-hotels-list-220/"
};

export const observedTripComQuotes = [
  {
    id: "tripcom-zabeel-exact", lodgingId: "zabeel", provider: "Trip.com", capturedAt: CHECKED_AT,
    referenceStay: "2027-03-21부터 03-31, 10박", occupancy: "5베드룸 빌라 1채, 성인 6명, 아이 3명", roomPlan: "Five Bedroom Pool Royal Villa 1채",
    nightlyDisplay: "US$3,419/채, 세금 전", projectedDisplay: "US$42,151", currency: "USD", nightlyValue: 3419, projectedValue: 42151,
    totalIncludesTaxes: true, refundable: null, breakfast: true, status: "observed_exact",
    inventoryNote: "세전 약 US$34,190, 세금과 수수료 포함 US$42,151. 조식 포함 표기, 무료 취소와 결제 시점은 미노출",
    sourceUrl: "https://www.trip.com/hotels/list?city=220&searchWord=Jumeirah%20Zabeel%20Saray%20Dubai&checkin=2027/03/21&checkout=2027/03/31&optionId=1562873&optionType=Hotel&display=Jumeirah%20Zabeel%20Saray%20Dubai&adult=6&children=3&crn=1&ages=9%2C7%2C6"
  },
  {
    id: "tripcom-mandarin-exact", lodgingId: "mandarin-jumeira", provider: "Trip.com", capturedAt: CHECKED_AT,
    referenceStay: "2027-03-21부터 03-31, 10박", occupancy: "객실 4실, 성인 6명, 아이 3명", roomPlan: "Superior King 객실 4실",
    nightlyDisplay: "US$901/실, 세금 전", projectedDisplay: "US$44,344", currency: "USD", nightlyValue: 901, projectedValue: 44344,
    totalIncludesTaxes: true, refundable: null, breakfast: false, status: "observed_exact",
    inventoryNote: "세전 약 US$36,040, 세금과 수수료 포함 US$44,344. 무료 취소, 조식, 결제 시점은 미노출",
    sourceUrl: "https://www.trip.com/hotels/list?city=220&searchWord=Mandarin%20Oriental%20Jumeira%20Dubai&checkin=2027/03/21&checkout=2027/03/31&optionId=23884107&optionType=Hotel&display=Mandarin%20Oriental%20Jumeira%20Dubai&adult=6&children=3&crn=4&ages=9%2C7%2C6"
  },
  {
    id: "tripcom-jumeirah-beach-exact", lodgingId: "jumeirah-beach", provider: "Trip.com", capturedAt: CHECKED_AT,
    referenceStay: "2027-03-21부터 03-31, 10박", occupancy: "객실 4실, 성인 6명, 아이 3명", roomPlan: "Ocean Deluxe 객실 4실",
    nightlyDisplay: "US$958/실, 세금 전", projectedDisplay: "US$47,177", currency: "USD", nightlyValue: 958, projectedValue: 47177,
    totalIncludesTaxes: true, refundable: true, breakfast: false, status: "observed_exact",
    inventoryNote: "세전 약 US$38,320, 세금과 수수료 포함 US$47,177. 무료 취소 표기, 마감일과 조식, 결제 시점은 미노출",
    sourceUrl: "https://www.trip.com/hotels/list?city=220&searchWord=Jumeirah%20Beach%20Hotel%20Dubai&checkin=2027/03/21&checkout=2027/03/31&optionId=1562773&optionType=Hotel&display=Jumeirah%20Beach%20Hotel%20Dubai&adult=6&children=3&crn=4&ages=9%2C7%2C6"
  },
  {
    id: "tripcom-marsa-exact", lodgingId: "marsa", provider: "Trip.com", capturedAt: CHECKED_AT,
    referenceStay: "2027-03-21부터 03-31, 10박", occupancy: "객실 4실, 성인 6명, 아이 3명", roomPlan: "Marina Deluxe 객실 4실",
    nightlyDisplay: "US$1,813/실, 세금 전", projectedDisplay: "US$89,066", currency: "USD", nightlyValue: 1813, projectedValue: 89066,
    totalIncludesTaxes: true, refundable: true, status: "observed_exact",
    inventoryNote: "세금 전 US$72,520, 세금과 수수료 US$16,546, 최종 US$89,066. 무료 취소 표시는 있으나 마감일과 결제 시점은 미노출. 조식은 포함 표시가 없고 AED 2,000/박 보증금의 부과 단위는 불명확",
    sourceUrl: "https://www.trip.com/hotels/list?city=220&searchWord=Jumeirah%20Marsa%20Al%20Arab%20Dubai&checkin=2027/03/21&checkout=2027/03/31&optionId=123008303&optionType=Hotel&display=Jumeirah%20Marsa%20Al%20Arab%20Dubai&adult=6&children=3&crn=4&ages=9%2C7%2C6"
  },
  {
    id: "tripcom-four-seasons-exact", lodgingId: "four-seasons", provider: "Trip.com", capturedAt: CHECKED_AT,
    referenceStay: "2027-03-21부터 03-31, 10박", occupancy: "객실 4실, 성인 6명, 아이 3명", roomPlan: "Deluxe King City View 객실 4실",
    nightlyDisplay: "US$1,245/실, 세금 전", projectedDisplay: "US$61,244", currency: "USD", nightlyValue: 1245, projectedValue: 61244,
    totalIncludesTaxes: true, refundable: true, breakfast: false, status: "observed_exact",
    inventoryNote: "세전 약 US$49,800, 세금과 수수료 포함 US$61,244. 무료 취소 표기지만 같은 가격 객실이 1실만 남았다고 표시돼 4실 동시 확정 위험",
    sourceUrl: "https://www.trip.com/hotels/list?city=220&searchWord=Four%20Seasons%20Resort%20Dubai%20at%20Jumeirah%20Beach&checkin=2027/03/21&checkout=2027/03/31&optionId=1778281&optionType=Hotel&display=Four%20Seasons%20Resort%20Dubai%20at%20Jumeirah%20Beach&adult=6&children=3&crn=4&ages=9%2C7%2C6"
  },
  {
    id: "tripcom-al-naseem-exact", lodgingId: "al-naseem", provider: "Trip.com", capturedAt: CHECKED_AT,
    referenceStay: "2027-03-21부터 03-31, 10박", occupancy: "객실 4실, 성인 6명, 아이 3명", roomPlan: "Resort Room 객실 4실",
    nightlyDisplay: "US$1,723/실, 세금 전", projectedDisplay: "US$84,664", currency: "USD", nightlyValue: 1723, projectedValue: 84664,
    totalIncludesTaxes: true, refundable: true, breakfast: false, status: "observed_exact",
    inventoryNote: "세전 약 US$68,920, 세금과 수수료 포함 US$84,664. 무료 취소 표기, 침대가 싱글 1개로 표시돼 실제 구성 재확인 필요",
    sourceUrl: "https://www.trip.com/hotels/list?city=220&searchWord=Jumeirah%20Al%20Naseem%20Dubai&checkin=2027/03/21&checkout=2027/03/31&optionId=6445488&optionType=Hotel&display=Jumeirah%20Al%20Naseem%20Dubai&adult=6&children=3&crn=4&ages=9%2C7%2C6"
  }
];

const lodgingMedia = {
  zabeel: ["./assets/places/zabeel.avif", "Jumeirah Zabeel Saray 실제 숙소 사진", "https://www.jumeirah.com/en/stay/dubai/jumeirah-zabeel-saray"],
  marsa: ["./assets/places/marsa.avif", "Jumeirah Marsa Al Arab 실제 숙소 사진", "https://www.jumeirah.com/en/stay/dubai/jumeirah-marsa-al-arab"],
  raffles: ["./assets/places/zabeel.avif", "Palm West 권역 참고 사진", "https://commons.wikimedia.org/"],
  kempinski: ["./assets/places/zabeel.avif", "Palm West 권역 참고 사진", "https://commons.wikimedia.org/"],
  "mandarin-jumeira": ["./assets/places/kite.avif", "Jumeirah 해변 권역 참고 사진", "https://commons.wikimedia.org/"],
  "four-seasons": ["./assets/places/kite.avif", "Jumeirah 해변 권역 참고 사진", "https://commons.wikimedia.org/"],
  "jumeirah-beach": ["./assets/places/burjalarab.avif", "Jumeirah Beach Hotel 권역 참고 사진", "https://commons.wikimedia.org/"],
  "al-naseem": ["./assets/places/madinat.webp", "Madinat Jumeirah 권역 참고 사진", "https://commons.wikimedia.org/"]
};

for (const item of lodgingOptions) {
  const [image, photoLabel, photoSource] = lodgingMedia[item.id];
  Object.assign(item, { image, imageFallback: image, photoLabel, photoSource });
}

export const rentalChecklist = [
  "예약서에 성인 6명과 아동 3명의 투숙 승인이 명시되는가",
  "침실 4개와 아동 셋의 실제 침대가 도면에 표시되는가",
  "거실과 식탁에 9명이 함께 앉을 수 있는가",
  "완전한 주방과 세탁 시설을 10박 동안 사용할 수 있는가",
  "키즈클럽의 연령, 시간, 보호자 동반 규정이 맞는가",
  "수영장 안전요원과 어린이 구명조끼가 제공되는가",
  "DXB와 숙소, 주요 명소의 실제 차량 시간을 확인했는가",
  "9인 차량과 카시트 3개를 매일 확보할 수 있는가",
  "조식, 세금, 서비스료, 관광세를 포함한 총액인가",
  "취소 가능 시점과 연결 항공편 지연 시 대응이 서면으로 남는가"
];

export const itinerary = [
  { date: "2027-03-20", dow: "토", title: "두 공항에서 같은 여행 시작", zone: "ICN / LAX", intensity: 1, stay: false, main: "출발 시각은 맞추지 않고 두 공항에서 같은 구도의 사진만 남긴 뒤 기내 수면을 지킵니다.", timeline: ["각 가족 공항 도착과 라운지", "아이 여행 파우치와 수면 키트 전달", "같은 포즈의 출발 사진 후 직항 탑승"], rain: "해당 없음", low: "영상통화를 기다리지 않고 사진 한 장만 단체방에 남긴다.", transport: "출발 공항 개별 이동", notes: "2027년 시간표가 열리면 확정" },
  { date: "2027-03-21", dow: "일", title: "도착보다 합류가 늦는 날", zone: "DXB / 숙소", intensity: 1, stay: true, main: "공항에서 서로 기다리지 않고 팀별 차량으로 바로 입실합니다. 첫 공동 장면은 모두 깨어 있을 때의 짧은 식사뿐입니다.", timeline: ["ICN팀 입국과 즉시 입실, 수면", "깨어난 가족만 45분 수영과 식사", "LAX팀 도착, 따뜻한 음식과 바로 취침"], rain: "숙소 안에서 동일", low: "도착 환영식도 생략하고 가족별로 바로 잔다.", transport: "DXB 전용차 편도 30-50분", notes: "ICN팀 객실은 전날부터 확보" },
  { date: "2027-03-22", dow: "월", title: "집을 우리 집으로 만드는 날", zone: "리조트", intensity: 1, stay: true, main: "회복일도 빈 날로 두지 않습니다. 방 이름표, 짧은 수영, 해변 보물찾기로 공동생활의 리듬을 만듭니다.", timeline: ["08:30 첫 전체 아침식사와 방 이름 정하기", "10:30 수영 60분, 13:30 조용한 방 시간", "16:30 해변 보물찾기와 빌라 저녁"], rain: "키즈클럽에서 여행 깃발 만들기", low: "이름표와 저녁만 하고 하루 종일 빌라에 머문다.", transport: "도보", notes: "장보기, 세탁, 아이 담당 순서도 이날 확정" },
  { date: "2027-03-23", dow: "화", title: "두 시간의 미래 탐험", zone: "Trade Centre", intensity: 2, stay: true, main: "건축과 Future Heroes를 중심으로 두 시간만 봅니다. Dubai Mall을 덧붙이지 않고 점심 뒤 숙소로 돌아옵니다.", timeline: ["09:10 출발, 10:00 시간 지정 입장", "주요 전시와 11:30 Future Heroes", "12:30 예약 점심, 14:15 전후 숙소 복귀"], rain: "그대로 진행", low: "90분 뒤 Future Heroes도 생략하고 바로 점심을 먹는다.", transport: "전용차 편도 20-40분", notes: "날짜와 시간 지정표 9장 사전 예약" },
  { date: "2027-03-24", dow: "수", title: "어른도 아이도 따로 쉬는 날", zone: "리조트", intensity: 1, stay: true, main: "성인은 교대로 90분씩 완전히 쉬고, 아이들은 키즈클럽과 가족 수영대회로 자기 하루를 가집니다.", timeline: ["10:00 키즈클럽과 성인 교대 휴식", "13:30 방 휴식", "16:30 가족 미니 수영대회와 거실 영화"], rain: "실내 키즈 프로그램과 영화", low: "키즈클럽 대신 가족별로 방과 수영장에 나뉜다.", transport: "도보", notes: "관광 예약 없음, 성인 개인 시간은 일정으로 보호" },
  { date: "2027-03-25", dow: "목", title: "828m 높이를 보는 아침", zone: "Downtown", intensity: 2, stay: true, main: "오전 At The Top과 같은 권역의 점심만 고정합니다. 대기가 30분을 넘으면 전망대를 포기합니다.", timeline: ["09:00 출발, 10:00 At The Top", "11:30 강제 종료와 11:45 예약 점심", "폭포 앞 10분 사진 후 14시대 숙소 복귀"], rain: "그대로 진행", low: "외부 타워 사진과 점심만 하고 돌아온다.", transport: "전용차 편도 20-45분", notes: "Aquarium은 아이 셋이 모두 원할 때만 60분 선택" },
  { date: "2027-03-26", dow: "금", title: "늦게 나가 Abra 한 번", zone: "Jumeirah", intensity: 1, stay: true, main: "낮에는 쉬고 20분짜리 Abra, 가족사진, 이른 저녁을 한 권역에서 끝냅니다.", timeline: ["오전 수영 또는 성인 교대 자유시간", "13:30 방 휴식, 16:30 Madinat Abra", "17:00 가족사진과 17:30 저녁, 19:00 귀환"], rain: "Abra를 빼고 Madinat 실내 식사만", low: "배 대기가 길면 예약 저녁만 먹는다.", transport: "전용차 편도 5-35분", notes: "Palm 서쪽 숙소면 실제 이동시간 확인" },
  { date: "2027-03-27", dow: "토", title: "두바이가 생긴 이야기", zone: "Old Dubai", intensity: 2, stay: true, main: "Children’s House와 Birth of a City 두 곳만 골라 초고층 이전의 두바이를 아이 눈높이로 봅니다.", timeline: ["09:00 출발", "10:00 Children’s House, 11:00 Birth of a City", "12:40 예약 점심, 14:30 전후 숙소 복귀"], rain: "그대로 진행", low: "Children’s House 50분 뒤 바로 점심과 귀환", transport: "전용차 편도 30-55분", notes: "Palm 서쪽에서 편도 45분을 넘으면 리조트 데이로 교체" },
  { date: "2027-03-28", dow: "일", title: "가장 좋았던 것을 다시 하는 날", zone: "리조트", intensity: 1, stay: true, main: "차를 타지 않고 아이가 고른 숙소 활동을 반복합니다. 어른은 사진, 세탁, 개인 시간을 실제 일정으로 확보합니다.", timeline: ["늦은 조식과 아이 선택 수영 또는 키즈클럽", "14:00 방 휴식, 사진 12장 고르기", "17:30 해변 노을과 인룸 디저트"], rain: "실내 시설과 엽서 쓰기", low: "룸서비스와 침실만 열어 둔다.", transport: "도보", notes: "다음 날 Aquaventure를 위한 완전 회복" },
  { date: "2027-03-29", dow: "월", title: "아이들이 주인공인 물의 날", zone: "Palm", intensity: 3, stay: true, main: "개장할 때 들어가 카바나를 기준점으로 씁니다. 키 1.2m를 기준으로 팀을 나누고 15시에 나옵니다.", timeline: ["09:30 도착, 카바나와 락커 준비", "10:00 신장별 팀 놀이, 11:30 카바나 휴식", "13:15 점심, 14:00 마지막 한 종목, 15:00 출발"], rain: "강풍이나 운영 제한 시 Lost World Aquarium 90분만", low: "Aquaventure를 취소하고 숙소 수영과 점심으로 바꾼다.", transport: "전용차 편도 5-35분", notes: "카바나, 빠른 입장, 실제 신장과 구명조끼 확인" },
  { date: "2027-03-30", dow: "화", title: "마지막 수영과 가족 시상식", zone: "리조트", intensity: 1, stay: true, main: "버퍼를 빈 날로 남기지 않습니다. 마지막 수영, 교대 포장, 사진 상영과 가족 시상식으로 여행을 닫습니다.", timeline: ["09:00 늦은 아침과 10:30 마지막 수영", "13:00 성인 교대 포장, 아이 보물지도와 감사 카드", "16:30 마지막 해변 사진, 19:30 사진 상영과 시상식"], rain: "실내 수영 또는 거실 보물지도와 사진 상영", low: "수영도 생략하고 포장과 시상식만 한다.", transport: "도보", notes: "놓친 시내 일정은 전원 컨디션 4/5 이상일 때 오전 하나만 복구" },
  { date: "2027-03-31", dow: "수", title: "팀별 출국", zone: "숙소 / DXB", intensity: 1, stay: false, main: "짐과 작별 인사는 전날 끝냅니다. 두 팀은 각자 항공편 시간에 맞춰 별도 차량으로 공항에 갑니다.", timeline: ["전날 닫아 둔 객실별 짐과 여권 확인", "비행 시간에 맞춘 팀별 전용차 출발", "아이 여행 파우치와 포장식 전달"], rain: "동일", low: "공동 차량과 단체 조식을 만들지 않는다.", transport: "전용차 편도 30-55분", notes: "2027년 출국편 확정 후 팀별 출발 시각 입력" }
];

const dayDetails = {
  "2027-03-20": { featuredPlace: "zabeel", whyNow: "첫 공동 경험을 공항 집결이 아니라 두 도시에서 동시에 시작한 사진으로 만듭니다.", needs: { parents: "각 가족이 자기 공항에서 서두르지 않고 직항과 수면에만 집중", kids: "스티커 여권, 간식, 헤드폰이 든 자기 여행 파우치", together: "ICN과 LAX에서 같은 포즈로 찍은 두 장의 출발 사진", recovery: "영상통화를 기다리지 않고 탑승 뒤 현지 밤에 맞춰 잡니다." } },
  "2027-03-21": { featuredPlace: "zabeel", whyNow: "시차가 다른 두 팀을 억지로 한 일정에 묶지 않아야 다음 날부터 함께 움직일 수 있습니다.", needs: { parents: "로비 대기 없이 도착 순서대로 침대, 샤워, 식사를 보장", kids: "서울팀의 짧은 첫 수영과 LA팀의 바로 잘 수 있는 방", together: "먼저 도착한 아이들이 현관에 남기는 환영 카드와 방 이름표", recovery: "LAX팀 도착 때 단체 환영식을 하지 않고 모두 수면을 지킵니다." } },
  "2027-03-22": { featuredPlace: "marsa", whyNow: "회복일을 비워 두는 대신 숙소 자체를 공동 여행의 첫 무대로 만듭니다.", needs: { parents: "식료품, 세탁, 방 배정, 아이 담당 순서를 정리할 시간", kids: "방 이름표, 수영, 해변 보물찾기", together: "세 아이가 함께 만드는 여행 깃발이나 현관 표지", recovery: "모든 활동에 예약이 없어 피곤한 가족은 바로 방으로 돌아갑니다." } },
  "2027-03-23": { featuredPlace: "future", whyNow: "첫 외출은 날씨 영향을 받지 않고 아이 셋이 Future Heroes에서 직접 움직이는 한 곳으로 시작합니다.", needs: { parents: "Museum of the Future의 건축과 두바이 미래 서사", kids: "만 10세 이하 Future Heroes에서 움직이고 선택하는 탐험", together: "각 아이가 가장 갖고 싶은 미래 발명품 하나 고르기", recovery: "두 시간 뒤 점심만 먹고 쇼핑몰을 붙이지 않은 채 복귀합니다." } },
  "2027-03-24": { featuredPlace: "marsa", whyNow: "명소 사이에 이동 없는 날을 넣되, 어른과 아이 모두 기다릴 프로그램을 분명하게 만듭니다.", needs: { parents: "아이를 보지 않는 90분의 스파, 카페 또는 완전한 개인 시간", kids: "키즈클럽과 가족 미니 수영대회", together: "아이들이 만든 종이 메달과 가족별 별명으로 시상식", recovery: "13시 30분부터 두 시간은 모두 방에서 쉽니다." } },
  "2027-03-25": { featuredPlace: "burj", whyNow: "대표 전망은 오전 한 번만 시도하고, 줄이 가족 경험을 망치기 시작하면 즉시 포기합니다.", needs: { parents: "두바이의 도시 규모를 한눈에 보는 대표 전망", kids: "빠른 엘리베이터와 828m 높이를 몸으로 느끼는 경험", together: "세 아이의 키 합계와 828m를 비교한 사진이나 그림", recovery: "대기 30분이면 외부 사진과 점심만 하고 14시대에 돌아옵니다." } },
  "2027-03-26": { featuredPlace: "madinat", whyNow: "20분짜리 Abra는 이동 부담에 비해 배, 건축, 식사, 사진을 한 번에 남기는 밀도가 높습니다.", needs: { parents: "Madinat의 건축과 수변 풍경, 예약한 좋은 저녁", kids: "길지 않은 나무배와 Burj Al Arab 찾기", together: "운하와 Burj Al Arab이 같이 보이는 아홉 명 가족사진", recovery: "오전과 이른 오후를 비우고 배 대기가 길면 저녁만 먹습니다." } },
  "2027-03-27": { featuredPlace: "shindagha", whyNow: "넓은 박물관 전체가 아니라 어린이 집과 도시 탄생 이야기만 골라 부모와 아이의 관심을 겹칩니다.", needs: { parents: "초고층 이전의 두바이, 향과 무역의 도시 맥락", kids: "Children’s House의 상호작용형 전시", together: "각 가족이 옛 두바이를 설명할 물건 하나로 30초 이야기", recovery: "아이 한 명이라도 처지면 첫 전시 뒤 점심으로 바로 전환합니다." } },
  "2027-03-28": { featuredPlace: "zabeel", whyNow: "다음 날 워터파크의 만족도는 오늘 다리를 얼마나 아꼈는지에 달려 있습니다.", needs: { parents: "사진 백업, 세탁, 성인 교대 휴식을 실제 일정으로 확보", kids: "지금까지 가장 좋았던 숙소 활동을 한 번 더 선택", together: "아이마다 여행 전반부의 1등 사진 한 장 고르기", recovery: "차를 타지 않고 룸서비스와 침실을 하루 종일 열어 둡니다." } },
  "2027-03-29": { featuredPlace: "aquaventure", whyNow: "이번 여행의 아이 주인공 날입니다. 큰 공원을 다 보려 하지 않고 카바나를 중심으로 핵심만 탑니다.", needs: { parents: "카바나와 교대 담당으로 체력을 통제하며 아이에게 하루를 온전히 주기", kids: "신장에 맞는 놀이기구와 가족 래프트를 마음껏 고르기", together: "가족이 함께 탄 한 번의 래프트를 오늘의 대표 장면으로 남기기", recovery: "14시에 마지막 한 종목만 고르고 15시에 반드시 나옵니다." } },
  "2027-03-30": { featuredPlace: "marsa", whyNow: "버퍼를 비워 두지 않고 포장과 여행 회고를 가족 활동으로 바꿔 마지막 날의 질을 지킵니다.", needs: { parents: "낮에 짐과 출국 서류를 끝내 새벽 출발 스트레스를 없애기", kids: "마지막 수영, 보물지도, 가족상", together: "가장 웃긴 순간과 최고의 도전을 뽑는 10분 사진 상영", recovery: "기본값은 숙소이며 놓친 관광은 전원 컨디션이 좋을 때만 복구합니다." } },
  "2027-03-31": { featuredPlace: "zabeel", whyNow: "귀국편 시간 차이가 커서 마지막 순간까지 함께 움직이면 두 팀 모두 피곤해집니다.", needs: { parents: "전날 닫아 둔 짐을 싣고 별도 차량으로 서두르지 않는 출국", kids: "익숙한 여행 파우치와 아침 상자", together: "작별 인사는 전날 저녁에 끝내고 각 가족의 베스트 사진 공유", recovery: "공동 공항 차량과 단체 아침식사를 계획하지 않습니다." } }
};

for (const day of itinerary) Object.assign(day, dayDetails[day.date]);

export const mealSuggestions = {
  "2027-03-20": "라운지와 기내식만 이용하고 도착 직전 과식하지 않는다.",
  "2027-03-21": "인룸 다이닝 또는 빌라 주방. 도착일 유명 식당 예약은 넣지 않는다.",
  "2027-03-22": "리조트 조식과 수영장 옆 이른 점심, 저녁은 아이들과 빌라에서 함께 만든다.",
  "2027-03-23": "Museum of the Future 인근에서 12시 30분 9인 점심 후 바로 귀환한다.",
  "2027-03-24": "풀사이드 점심과 함께 만드는 저녁, 거실 영화 간식으로 마친다.",
  "2027-03-25": "Dubai Mall에서 11시 45분 9인 테이블을 예약해 혼잡 전에 끝낸다.",
  "2027-03-26": "Madinat에서 17시 30분 9인 테이블과 어린이 메뉴를 사전 확인한다.",
  "2027-03-27": "Old Dubai 점심은 차량 동선 안의 한 곳만 예약하고 시장 탐색은 하지 않는다.",
  "2027-03-28": "아이들이 좋아한 리조트 식사를 반복하고 해변 노을 뒤 인룸 디저트를 먹는다.",
  "2027-03-29": "Aquaventure 카바나에서 13시 15분 점심을 먹고 물을 자주 마신다.",
  "2027-03-30": "빌라에서 마지막 저녁을 먹고 사진 상영용 간단한 디저트만 준비한다.",
  "2027-03-31": "항공편별 조식 또는 포장식, 공항에서 단체 식사를 만들지 않는다."
};

const images = {
  skyline: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=88",
  burj: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1400&q=82",
  coast: "https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=1400&q=82",
  city: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=1400&q=82",
  desert: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1400&q=82"
};

function place(id, name, zone, category, lat, lng, duration, energy, rain, why, warning, official, image = "") {
  return { id, name, zone, category, lat, lng, duration, energy, rain, why, warning, official, image, maps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} Dubai`)}`, checkedAt: CHECKED_AT };
}

export const places = [
  place("future", "Museum of the Future", "Trade Centre", "박물관", 25.2192, 55.2822, "2-3시간", 2, true, "아이와 어른이 함께 몰입할 수 있는 대표 실내 일정이다.", "모든 표가 날짜와 시간 지정, 사전 예약 필요", "https://museumofthefuture.ae/en/plan-your-visit", images.city),
  place("burj", "Burj Khalifa At The Top", "Downtown", "전망", 25.1972, 55.2744, "90분", 2, true, "10시 입장으로 혼잡과 피로를 낮추기 좋다.", "표는 지정 날짜와 시간에만 유효", "https://ticket.atthetop.ae/tickets/book-tickets/", images.burj),
  place("mall", "Dubai Mall", "Downtown", "쇼핑", 25.1985, 55.2796, "점심 포함 2시간", 2, true, "전망대와 점심을 한 건물권에서 끝낼 수 있다.", "규모가 커서 목적 식당과 출입구를 미리 고정", "https://thedubaimall.com/", images.city),
  place("aquarium", "Dubai Aquarium", "Downtown", "수족관", 25.1975, 55.2793, "60-90분", 2, true, "Burj Khalifa 뒤에도 아이들이 더 보고 싶어 할 때만 들어갑니다.", "같은 날 의무로 묶으면 아이 피로가 커짐", "https://www.thedubaiaquarium.com/", images.city),
  place("madinat", "Madinat Jumeirah Abra", "Jumeirah", "보트", 25.1339, 55.1858, "30-60분", 1, false, "Jumeirah 숙소에서 짧고 상징적인 저녁 전 일정이 된다.", "더운 시간과 주말 혼잡을 피함", "https://www.jumeirah.com/en/stay/dubai/madinat-jumeirah", images.coast),
  place("burjalarab", "Burj Al Arab waterfront", "Jumeirah", "산책", 25.1412, 55.1853, "30분", 1, false, "Madinat와 같은 권역에서 사진과 짧은 산책을 끝낼 수 있다.", "공공 해변과 호텔 출입 규정은 다름", "https://www.jumeirah.com/en/stay/dubai/burj-al-arab-jumeirah", images.coast),
  place("shindagha", "Al Shindagha Museum", "Old Dubai", "박물관", 25.2689, 55.2893, "2-3시간", 2, true, "Children’s House 중심으로 문화 일정을 아이 눈높이에 맞춥니다.", "Palm 서쪽 숙소라면 왕복 차 시간이 길어 빼도 아쉽지 않음", "https://alshindagha.dubaiculture.gov.ae/", images.city),
  place("etihad", "Etihad Museum", "Jumeirah 1", "박물관", 25.2413, 55.2696, "90분", 1, true, "Old Dubai보다 짧은 실내 대안으로 쓰기 좋다.", "전시 관심도가 낮으면 생략", "https://etihadmuseum.dubaiculture.gov.ae/", images.city),
  place("aquaventure", "Aquaventure World", "Palm", "워터파크", 25.1305, 55.1171, "최대 5시간", 3, false, "아이 셋에게 두바이 선택의 가장 분명한 이유다.", "1.2m 신장 제한, 구명조끼, 13세 미만 보호자 규정 확인", "https://www.atlantis.com/dubai/atlantis-aquaventure/aquaventure-waterpark", images.coast),
  place("lost", "Lost World Aquarium (구 Lost Chambers)", "Palm", "수족관", 25.1300, 55.1175, "60-90분", 1, true, "Aquaventure가 어렵거나 바람이 강한 날 한 시간만 보는 실내 선택입니다.", "운영시간과 묶음표 조건 확인", "https://www.atlantis.com/atlantis-the-palm/the-lost-chambers-aquarium", images.coast),
  place("green", "The Green Planet", "City Walk", "실내자연", 25.2075, 55.2627, "90분", 1, true, "강풍이나 피로가 큰 날의 실내 생태 대안이다.", "주말 혼잡과 시간 지정표 확인", "https://www.thegreenplanetdubai.com/", images.city),
  place("kite", "Kite Beach", "Jumeirah", "해변", 25.1612, 55.2073, "60-90분", 1, false, "Jumeirah 숙소에서 짧은 야외 회복 일정으로 쓸 수 있다.", "한낮 햇빛과 바람을 피하고 수영은 안전요원 구역만", "https://www.visitdubai.com/en/places-to-visit/kite-beach", images.coast),
  place("zabeel", "Jumeirah Zabeel Saray", "Palm West", "숙소", 25.0986, 55.1233, "기준점", 1, true, "공식 최대 12명인 5베드룸 풀 빌라 한 채에 아홉 명이 함께 머물 수 있다.", "도심 이동이 길어 리조트 중심 일정으로 운영", lodgingOptions[0].official, images.coast),
  place("marsa", "Jumeirah Marsa Al Arab", "Jumeirah", "숙소", 25.1419, 55.1848, "기준점", 1, true, "호텔 객실 4실로 잡으면 도심과 해변 이동 균형이 가장 좋다.", "같은 층 또는 연결 배정은 호텔의 서면 확약 필요", lodgingOptions[1].official, images.coast),
  place("desert", "Desert safari", "Desert", "제외", 25.1100, 55.4200, "반일 이상", 3, false, "대표 경험이지만 이번 저피로 원칙과 충돌한다.", "장거리 차량, 모래길, 늦은 귀환 때문에 핵심 일정에서 제외", "https://www.visitdubai.com/en/things-to-do/itineraries/desert-safari", images.desert)
];

const placeDetails = {
  future: {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Museum%20of%20The%20Future.jpg?width=1600",
    imageFallback: images.city,
    photoSource: "https://commons.wikimedia.org/wiki/File:Museum_of_The_Future.jpg",
    bestFor: "첫 외출을 실내에서 시작하고, 세 아이가 Future Heroes에서 직접 움직이게 하고 싶을 때",
    skipIf: "건축보다 전시의 깊이를 기대하거나 입장 전 대기가 길 때",
    kids: "만 10세 이하 전용 공간을 먼저 보고 전체 관람은 2시간에서 끝냅니다.",
    groupFit: "시간 지정표 9장을 같은 회차로 예약해야 합니다.",
    reservation: "10시 첫 회차 권장",
    reviews: {
      summary: "건물과 이동 연출은 압도적이라는 반응이 많지만, 유료 전시의 깊이와 가격 만족도는 꽤 엇갈립니다.",
      liked: ["아랍 서예 외관과 우주선 같은 연출", "만 10세 이하 Future Heroes"],
      disliked: ["외관에 비해 전시가 얕고 입장 전 대기가 생길 수 있음"],
      familyTip: "Future Heroes를 중심으로 2시간만 보고 이른 점심 뒤 숙소로 돌아갑니다.",
      sources: [{ platform: "Tripadvisor 최근 여행자 리뷰", url: "https://www.tripadvisor.com/Attraction_Review-g295424-d23751344-Reviews-Museum_Of_The_Future-Dubai_Emirate_of_Dubai.html", checkedAt: CHECKED_AT }]
    }
  },
  burj: {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Burj%20Khalifa%20-%20Dubai.jpg?width=1600",
    imageFallback: images.burj,
    photoSource: "https://commons.wikimedia.org/wiki/File:Burj_Khalifa_-_Dubai.jpg",
    bestFor: "두바이의 규모를 한 번에 보고 싶은 어른과 높은 곳을 좋아하는 아이",
    skipIf: "입장 대기가 30분을 넘거나 유모차 보관이 번거로운 날",
    kids: "전망보다 줄이 더 오래 기억날 수 있어 오전 첫 회차만 시도합니다.",
    groupFit: "9장 같은 회차, 유모차 보관, 차량 출구를 함께 확인합니다.",
    reservation: "선택 일정, 오전 첫 회차만",
    reviews: {
      summary: "전망과 상징성은 분명하지만 시간 지정표가 있어도 긴 줄, 좌석 부족, 유모차 보관 불편이 반복됩니다.",
      liked: ["124층과 125층의 넓은 전망", "두바이의 규모를 한눈에 보는 상징성"],
      disliked: ["긴 대기와 혼잡, 유모차를 맡겨야 하는 절차"],
      familyTip: "30분 이상 기다릴 것 같으면 취소하고 Dubai Mall 점심만 먹습니다.",
      sources: [{ platform: "Tripadvisor 가족 리뷰", url: "https://www.tripadvisor.com/Attraction_Review-g295424-d12580575-Reviews-At_The_Top_Burj_Khalifa-Dubai_Emirate_of_Dubai.html", checkedAt: CHECKED_AT }]
    }
  },
  mall: {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Dubai%20MALL%20Waterfalls.jpg?width=1600",
    imageFallback: images.city,
    photoSource: "https://commons.wikimedia.org/wiki/File:Dubai_MALL_Waterfalls.jpg",
    bestFor: "Burj Khalifa 뒤에 차를 다시 타지 않고 점심과 화장실을 해결할 때",
    skipIf: "쇼핑을 일정으로 만들거나 출구를 정하지 않고 돌아다닐 때",
    kids: "식당, 화장실, 차량 출구를 미리 하나씩 정해 걷는 거리를 줄입니다.",
    groupFit: "9인 식당 예약과 차량 승하차 지점을 예약서에 같이 남깁니다.",
    reservation: "목적 식당만 예약",
    reviews: {
      summary: "깨끗하고 가족 편의시설이 많다는 평이 우세하지만, 너무 큰 규모와 피크 시간 혼잡이 여행 피로를 키웁니다.",
      liked: ["식당과 실내 활동을 한곳에서 해결", "깨끗한 시설과 많은 가족 편의"],
      disliked: ["길을 잃기 쉽고 출구와 차량 지점을 찾는 데 오래 걸림"],
      familyTip: "관광지가 아니라 Burj Khalifa 점심과 차량 연결을 위한 통로로 씁니다.",
      sources: [{ platform: "Tripadvisor 여행자 리뷰", url: "https://www.tripadvisor.com/Attraction_Review-g295424-d1210327-Reviews-The_Dubai_Mall-Dubai_Emirate_of_Dubai.html", checkedAt: CHECKED_AT }]
    }
  },
  aquarium: {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Dubai%20Aquarium2.jpg?width=1600",
    imageFallback: images.city,
    photoSource: "https://commons.wikimedia.org/wiki/File:Dubai_Aquarium2.jpg",
    bestFor: "Burj Khalifa 뒤에도 아이들이 더 보고 싶어 하고 실내에서 한 시간만 쓸 때",
    skipIf: "전망대에서 이미 지쳤거나 입장권 가격이 부담스러울 때",
    kids: "상어 터널만 보고 나와도 충분합니다. 같은 날 의무 일정으로 묶지 않습니다.",
    groupFit: "9인 표를 미리 살 필요 없이 당일 아이 컨디션을 보고 결정합니다.",
    reservation: "당일 선택",
    reviews: {
      summary: "상어 터널과 실내 접근성은 아이 가족에게 호평받지만, 입장료에 비해 관람이 짧고 피크 시간은 붐빕니다.",
      liked: ["아이들이 바로 반응하는 상어 터널", "Dubai Mall 안에서 바로 연결되는 실내 동선"],
      disliked: ["가격 대비 짧은 관람과 피크 시간 혼잡"],
      familyTip: "아이들이 더 보고 싶어 할 때만 60분 선택 일정으로 씁니다.",
      sources: [{ platform: "Tripadvisor 가족 리뷰", url: "https://www.tripadvisor.com/Attraction_Review-g295424-d1792285-Reviews-Dubai_Aquarium_Underwater_Zoo-Dubai_Emirate_of_Dubai.html", checkedAt: CHECKED_AT }]
    }
  },
  madinat: {
    image: "https://cdn.jumeirah.com/api/public/content/ab9d70e684384a6bb2b429463cb6b010?v=4b1de950",
    imageFallback: images.coast,
    photoSource: "https://www.jumeirah.com/en/stay/dubai/jumeirah-mina-al-salam/experiences/abra-tours",
    bestFor: "관광 사이에 배 20분과 이른 저녁만 넣고 싶은 날",
    skipIf: "Palm 서쪽 숙소에서 차로 오래 와야 하거나 주말 저녁에 붐빌 때",
    kids: "배가 지루해지기 전에 끝나고 Burj Al Arab을 물에서 볼 수 있습니다.",
    groupFit: "일반 Abra를 나눠 타도 되며 전용 보트는 필요 없습니다.",
    reservation: "16시 30분 전후 현장 또는 사전 확인",
    reviews: {
      summary: "짧은 배 경험과 수로 풍경은 호평받지만 운항 시간에 비해 비싸고 주말 선착장이 붐빈다는 반응도 있습니다.",
      liked: ["20분에서 40분의 짧고 편한 배 경험", "Burj Al Arab과 수로가 함께 보이는 풍경"],
      disliked: ["짧은 운항에 비해 비싸고 저녁에는 선착장이 혼잡"],
      familyTip: "Jumeirah 숙소일 때만 짧게 다녀오고, Palm 숙소면 리조트 산책으로 바꿉니다.",
      sources: [{ platform: "Tripadvisor 여행자 리뷰", url: "https://www.tripadvisor.co.uk/Attraction_Review-g295424-d17635912-Reviews-Souk_Madinat_Jumeirah_Abra_Tours-Dubai_Emirate_of_Dubai.html", checkedAt: CHECKED_AT }]
    }
  },
  burjalarab: {
    image: "https://cdn.jumeirah.com/api/public/content/873b4b015d044362adf1ca2a9c225c71?v=138d4724",
    imageFallback: images.coast,
    photoSource: "https://www.jumeirah.com/en/stay/dubai/jumeirah-burj-al-arab-a-jumeirah-icon",
    bestFor: "Madinat 일정 중 이동을 늘리지 않고 가족사진만 남길 때",
    skipIf: "호텔 내부 입장을 기대하거나 사진을 위해 별도 식사를 추가할 때",
    kids: "독립 관광지가 아니라 배에서 보고 20분 사진 정차만 합니다.",
    groupFit: "9명이 서기 좋은 촬영 지점을 기사와 미리 정합니다.",
    reservation: "별도 예약 없음",
    reviews: {
      summary: "대표 실루엣과 해변 사진은 만족도가 높지만, 예약 없이는 내부에 들어갈 수 없고 촬영 지점도 제한적입니다.",
      liked: ["두바이를 대표하는 실루엣", "Madinat와 같은 권역이라 이동이 거의 없음"],
      disliked: ["예약 없이는 호텔 내부 입장이 어렵고 사진만을 위한 별도 일정 가치는 낮음"],
      familyTip: "Madinat Abra에 붙인 20분 사진 정차로만 처리합니다.",
      sources: [{ platform: "Tripadvisor 여행자 리뷰", url: "https://www.tripadvisor.com/Attraction_Review-g295424-d324445-Reviews-Burj_Al_Arab-Dubai_Emirate_of_Dubai.html", checkedAt: CHECKED_AT }]
    }
  },
  shindagha: {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Shindagha%20Museum-%20Dubai.jpg?width=1600",
    imageFallback: images.city,
    photoSource: "https://commons.wikimedia.org/wiki/Category:Museum_Al_Shindagha",
    bestFor: "화려한 세트보다 아이 전시와 두바이의 생활사를 천천히 보고 싶을 때",
    skipIf: "Palm 서쪽에서 왕복 이동이 90분에 가까워질 때",
    kids: "Children’s House와 Birth of a City 두 곳만 보고 2시간에 끝냅니다.",
    groupFit: "여러 건물에 흩어져 있으므로 9명이 함께 움직일 두 전시관을 먼저 정합니다.",
    reservation: "공식 운영시간만 재확인",
    reviews: {
      summary: "인터랙티브 어린이 전시, 친절한 직원, 낮은 혼잡도와 냉방은 가족 리뷰에서 꾸준히 좋은 평가를 받습니다.",
      liked: ["아이에게 맞는 인터랙티브 전시와 직원 설명", "한산하고 냉방된 여러 전시관"],
      disliked: ["전시관이 넓게 흩어져 있어 전부 보면 반나절 이상 걸림"],
      familyTip: "모든 전시관을 돌지 말고 Children’s House와 Birth of a City만 봅니다.",
      sources: [{ platform: "Tripadvisor 가족 리뷰", url: "https://www.tripadvisor.com/Attraction_Review-g295424-d15839938-Reviews-Al_Shindagha_Museum-Dubai_Emirate_of_Dubai.html", checkedAt: CHECKED_AT }]
    }
  },
  etihad: {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/UAE%20flat%20with%20Etihad%20Museum%20in%20background%2C%20Dubai%2C%20UAE.jpg?width=1600",
    imageFallback: images.city,
    photoSource: "https://commons.wikimedia.org/wiki/File:UAE_flat_with_Etihad_Museum_in_background,_Dubai,_UAE.jpg",
    bestFor: "비나 강풍에 한 시간만 실내에서 UAE 건국사를 볼 때",
    skipIf: "만 6세에서 9세 아이의 몰입도를 최우선으로 할 때",
    kids: "문서 중심이라 Al Shindagha보다 후순위입니다.",
    groupFit: "한산한 편이라 9명이 움직이기 쉽지만 핵심 일정은 아닙니다.",
    reservation: "날씨 대안",
    reviews: {
      summary: "건축과 UAE 건국사를 정리한 구성은 호평받지만, 문서 중심이라 어린아이에게는 다소 어렵다는 반응이 있습니다.",
      liked: ["현대적인 건축과 차분한 실내", "UAE 건국 과정을 체계적으로 정리한 전시"],
      disliked: ["정치사와 문서 중심이라 어린아이의 몰입도가 낮을 수 있음"],
      familyTip: "강풍이나 비가 올 때만 60분 대안으로 씁니다.",
      sources: [{ platform: "Tripadvisor 여행자 리뷰", url: "https://www.tripadvisor.com/Attraction_Review-g295424-d11964109-Reviews-Etihad_Museum-Dubai_Emirate_of_Dubai.html", checkedAt: CHECKED_AT }]
    }
  },
  aquaventure: {
    image: "https://dam.kerzner.com/i/kerzner/AquaventureWaterpark-Lifestyle-RagingRapids-Friends-jpg",
    imageFallback: images.coast,
    photoSource: "https://www.aquaventureworld.com/aquaventure-waterpark",
    bestFor: "이번 아이 셋에게 두바이를 고를 가장 큰 이유가 필요할 때",
    skipIf: "강풍, 운영 제한, 아이 키가 주요 시설 기준에 맞지 않을 때",
    kids: "1.2m 미만과 이상을 성인 두 팀으로 나누고 15시 전에 나옵니다.",
    groupFit: "Cabana, AquaXpress, 성인 역할 분담을 먼저 예약합니다.",
    reservation: "평일 개장 입장과 Cabana 권장",
    reviews: {
      summary: "가족 만족도는 매우 높지만 정오 뒤 대기, 넓은 공원, 높은 식음료 가격과 계단이 체력 소모를 키웁니다.",
      liked: ["연령별 선택지가 많은 대형 워터파크", "Cabana가 가족 휴식 거점으로 유용"],
      disliked: ["정오 이후 긴 줄과 넓은 동선, 높은 식음료 가격"],
      familyTip: "개장 입장, Cabana와 AquaXpress를 쓰고 15시 전에 철수합니다.",
      sources: [{ platform: "Tripadvisor 가족 리뷰", url: "https://www.tripadvisor.com/Attraction_Review-g295424-d1200463-Reviews-Aquaventure_Waterpark-Dubai_Emirate_of_Dubai.html", checkedAt: CHECKED_AT }]
    }
  },
  lost: {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/TheLostChambers.jpg?width=1600",
    imageFallback: images.coast,
    photoSource: "https://commons.wikimedia.org/wiki/File:TheLostChambers.jpg",
    bestFor: "Aquaventure를 하기 어렵지만 Atlantis 안에서 한 시간은 보내고 싶을 때",
    skipIf: "워터파크를 정상적으로 즐긴 날이거나 별도 입장료 가치가 낮게 느껴질 때",
    kids: "유모차 접근이 가능하고 60분이면 충분합니다.",
    groupFit: "당일 날씨와 아이 컨디션을 보고 9인 표를 결정합니다.",
    reservation: "Aquaventure 대안",
    reviews: {
      summary: "대형 수조와 Atlantis 분위기는 좋지만 관람이 짧아 별도 입장료의 가치는 약하다는 평가가 반복됩니다.",
      liked: ["오래 걷지 않고 볼 수 있는 대형 수조", "2026년 개편 뒤 늘어난 인터랙티브 공간"],
      disliked: ["관람 시간이 짧고 만 8세부터 성인 요금이라 비용 부담"],
      familyTip: "워터파크가 어려운 날의 60분 대안으로만 씁니다.",
      sources: [{ platform: "Tripadvisor 여행자 리뷰", url: "https://www.tripadvisor.com/Attraction_Review-g295424-d2148295-Reviews-Lost_World_Aquarium_at_Aquaventure_World-Dubai_Emirate_of_Dubai.html", checkedAt: CHECKED_AT }]
    }
  },
  green: {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Green%20Planet%20Tree%20%26%20Waterfall.jpg?width=1600",
    imageFallback: images.city,
    photoSource: "https://commons.wikimedia.org/wiki/File:Green_Planet_Tree_%26_Waterfall.jpg",
    bestFor: "강풍이나 비 때문에 물놀이가 취소된 날 90분 실내 대안",
    skipIf: "놀이 구역이 닫혀 있거나 피크 시간 대기가 길 때",
    kids: "새와 동물을 가까이 보는 데 집중하고 2시간을 넘기지 않습니다.",
    groupFit: "출발 전에 어린이 구역 운영 여부를 확인합니다.",
    reservation: "날씨 대안",
    reviews: {
      summary: "냉방된 실내에서 새와 동물을 가까이 보는 경험은 호평받지만, 대기와 어린이 구역 폐쇄 사례가 단점입니다.",
      liked: ["새와 동물을 가까이 보는 실내 경험", "90분에서 2시간 안에 끝나는 동선"],
      disliked: ["혼잡 구간의 대기와 어린이 놀이 구역 운영 변동"],
      familyTip: "출발 전에 놀이 구역 운영을 확인하고 Aquaventure 취소 때만 씁니다.",
      sources: [{ platform: "Tripadvisor 가족 리뷰", url: "https://www.tripadvisor.co.uk/Attraction_Review-g295424-d10807046-Reviews-The_Green_Planet-Dubai_Emirate_of_Dubai.html", checkedAt: CHECKED_AT }]
    }
  },
  kite: {
    image: "https://www.visitdubai.com/-/media/gathercontent/poi/k/kite-beach/2026-update/kite-beach-det-jan-2026.jpg",
    imageFallback: images.coast,
    photoSource: "https://www.visitdubai.com/en/places-to-visit/kite-beach",
    bestFor: "Jumeirah 숙소에서 해 질 무렵 한 시간만 바다를 걷고 싶을 때",
    skipIf: "주말 혼잡, 강풍, 해변 안전 깃발이 좋지 않을 때",
    kids: "수영 여부는 당일 안전 깃발과 시설 운영을 보고 결정합니다.",
    groupFit: "9인 차량의 픽업 지점을 미리 고정합니다.",
    reservation: "16시 이후 날씨 확인",
    reviews: {
      summary: "넓고 깨끗한 모래와 먹거리, 아이 활동은 호평받지만 주말 혼잡, 강풍, 시설 폐쇄 사례가 변수입니다.",
      liked: ["넓은 모래와 산책로, 어린이 활동", "Burj Al Arab 전망과 늦은 오후 분위기"],
      disliked: ["주말 혼잡과 강풍, 샤워와 기저귀 교환 시설 운영 변동"],
      familyTip: "16시 이후 60분만 머물고 수영은 안전 깃발을 확인한 뒤 결정합니다.",
      sources: [{ platform: "Tripadvisor 여행자 리뷰", url: "https://www.tripadvisor.com/Attraction_Review-g295424-d8707026-Reviews-Kite_Beach-Dubai_Emirate_of_Dubai.html", checkedAt: CHECKED_AT }]
    }
  },
  zabeel: {
    image: "https://cdn.jumeirah.com/api/public/content/f4a463d2ea49431285b9bb197ab1c687?v=9591cee1",
    imageFallback: images.coast,
    photoSource: lodgingOptions[0].official,
    bestFor: "관광보다 한 빌라, 해변, 키즈클럽에서 함께 쉬는 시간을 더 중요하게 볼 때",
    skipIf: "Downtown과 Old Dubai를 여러 번 오가고 싶은 여행",
    kids: "키즈클럽 연령과 라군 안전 규정을 예약 전에 확인합니다.",
    groupFit: "공식 정원에 6성인과 4아동이 들어가 이번 구성과 가장 명확하게 맞습니다.",
    reservation: "현재 숙소 1순위",
    reviews: {
      summary: "빌라 공간, 라군, 해변, 버틀러와 가족 시설은 호평받지만 Palm 서쪽의 긴 이동과 무거운 장식 취향은 갈립니다.",
      liked: ["넓은 빌라와 전용 라군", "키즈클럽, 해변, 버틀러를 한곳에서 이용"],
      disliked: ["Downtown과 Old Dubai 왕복이 길고 5베드룸 빌라 전용 후기 표본은 적음"],
      familyTip: "관광 횟수를 줄이는 조건으로 고르고 침대 배치, 취소 마감일, 결제 시점을 서면으로 받습니다.",
      sources: [{ platform: "Tripadvisor 호텔 리뷰", url: "https://www.tripadvisor.com/Hotel_Review-g295424-d1949597-Reviews-Jumeirah_Zabeel_Saray-Dubai_Emirate_of_Dubai.html", checkedAt: CHECKED_AT }]
    }
  },
  marsa: {
    image: "https://cdn.jumeirah.com/api/public/content/9b7d4967d86548b2bea484990aa19510?v=b8f3733c",
    imageFallback: images.coast,
    photoSource: lodgingOptions[1].official,
    bestFor: "한집 생활보다 호텔 서비스와 해변, Downtown 사이의 짧은 이동을 중요하게 볼 때",
    skipIf: "네 객실이 서로 떨어져 배정되거나 공용 거실이 꼭 필요할 때",
    kids: "해변과 버기 이동이 편하지만 Family Club 추가 비용을 확인합니다.",
    groupFit: "Trip.com에서 6+3, 객실 4실의 실견적은 잡혔지만 같은 층과 연결 배정은 별도입니다.",
    reservation: "이동 최우선 호텔형",
    reviews: {
      summary: "현대적인 디자인, 해변과 서비스는 호평받지만 신생 호텔이라 운영 이력과 리뷰 표본이 짧고 가격이 높습니다.",
      liked: ["Downtown, Madinat, Palm 사이 좋은 위치", "새 호텔의 해변과 가족 시설"],
      disliked: ["신생 호텔의 서비스 편차와 네 객실이 떨어질 위험"],
      familyTip: "Marina Deluxe 4실을 같은 층에 배정한다는 답을 받은 뒤에만 결제합니다.",
      sources: [{ platform: "Tripadvisor 호텔 리뷰", url: "https://www.tripadvisor.com/Hotel_Review-g295424-d28148432-Reviews-Jumeirah_Marsa_Al_Arab-Dubai_Emirate_of_Dubai.html", checkedAt: CHECKED_AT }]
    }
  },
  desert: {
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Desert%20Safari%20-%20Dubai.JPG?width=1600",
    imageFallback: images.desert,
    photoSource: "https://commons.wikimedia.org/wiki/File:Desert_Safari_-_Dubai.JPG",
    bestFor: "가족 전원이 원하고 부드러운 자연 관찰형 전용차를 따로 구할 때",
    skipIf: "멀미, 모래길, 늦은 귀환을 피하고 싶은 이번 여행",
    kids: "Dune bashing을 빼지 못하면 가지 않습니다.",
    groupFit: "운영사 편차가 커서 전용차, 카시트, 캠프와 귀환 시각을 모두 확인해야 합니다.",
    reservation: "이번 핵심 일정에서는 제외",
    reviews: {
      summary: "사막 풍경과 낙타 체험은 기억에 남지만 운영사별 차량, 안전, 캠프, 음식과 판매 유도 편차가 매우 큽니다.",
      liked: ["두바이다운 사막 풍경", "좋은 소규모 운영사의 낙타와 자연 체험"],
      disliked: ["멀미, 거친 모래길, 늦은 귀환과 운영사 품질 편차"],
      familyTip: "가족 전원이 원할 때만 dune bashing 없는 전용 자연 관찰형 코스를 고릅니다.",
      sources: [{ platform: "Tripadvisor 여행자 리뷰", url: "https://www.tripadvisor.com/Attraction_Review-g295424-d11960498-Reviews-Desert_Safari_Dubai-Dubai_Emirate_of_Dubai.html", checkedAt: CHECKED_AT }]
    }
  }
};

const placeAssetExtensions = {
  madinat: "webp",
  burjalarab: "avif",
  kite: "avif",
  zabeel: "avif",
  marsa: "avif"
};

for (const item of places) {
  Object.assign(item, placeDetails[item.id]);
  item.remoteImage = item.image;
  item.imageFallback = item.image;
  item.image = `./assets/places/${item.id}.${placeAssetExtensions[item.id] || "jpg"}`;
  item.photoLabel = `${item.name} 실제 장소 사진`;
}

export const climate = {
  source: "Dubai Statistics Center and Dubai official portal",
  summary: "공식 과거 자료의 3월 평균 일최고는 29-30°C, 일최저는 19-20°C 수준이다.",
  packing: ["어린이 자외선 차단제", "래시가드와 수영모", "실내 냉방용 얇은 겉옷", "모자와 보냉 물병", "샌들과 편한 운동화"],
  note: "2011-2013 공식 관측표를 기반으로 한 장기 판단이며 2027년 일별 예보가 아니다. 실제 예보는 출발 10일 전부터 갱신한다.",
  official: "https://www.dsc.gov.ae/Report/15.pdf"
};

export const sources = [
  ["Original family trip planning deck", trip.sourceDeck],
  ["Trip.com Dubai 5-star market benchmark", tripComCostSummary.sourceUrl],
  ["Trip.com Zabeel Saray exact quote", observedTripComQuotes[0].sourceUrl],
  ["Trip.com Mandarin Oriental exact quote", observedTripComQuotes[1].sourceUrl],
  ["Trip.com Jumeirah Beach Hotel exact quote", observedTripComQuotes[2].sourceUrl],
  ["Trip.com Marsa Al Arab exact quote", observedTripComQuotes[3].sourceUrl],
  ["Trip.com Four Seasons exact quote", observedTripComQuotes[4].sourceUrl],
  ["Trip.com Al Naseem exact quote", observedTripComQuotes[5].sourceUrl],
  ["Jumeirah Zabeel Saray Five Bedroom Pool Royal Villa", lodgingOptions[0].official],
  ["Jumeirah Marsa Al Arab hotel", lodgingOptions[1].official],
  ["Raffles The Palm Royal Villa", lodgingOptions[2].official],
  ["Kempinski Four Bedroom Penthouse", lodgingOptions[3].official],
  ["Emirates Seoul to Dubai", "https://www.emirates.com/kr/korean/destinations/icn/dxb/flights-from-seoul-to-dubai/"],
  ["Emirates Los Angeles to Dubai", "https://www.emirates.com/us/english/destinations/lax/dxb/flights-from-los-angeles-to-dubai/"],
  ["Dubai Airports taxi", "https://dubaiairports.ae/transport/taxi"],
  ["Marhaba Family Meet and Greet", "https://dubaiairports.ae/experiences/shops/details/marhaba-meet-greet"],
  ["Dubai Airports FAQ", "https://dubaiairports.ae/faqs"],
  ["Dubai official climate fact sheet", "https://www.dubai.ae/web/dubai.ae/dubai-fact-sheet"],
  ["Dubai Statistics Center climate table", climate.official],
  ["Museum of the Future visit rules", "https://museumofthefuture.ae/en/plan-your-visit"],
  ["Burj Khalifa At The Top tickets", "https://ticket.atthetop.ae/tickets/book-tickets/"],
  ["Aquaventure official FAQ", "https://www.atlantis.com/dubai/atlantis-the-palm/faq"],
  ["Al Shindagha Museum", "https://alshindagha.dubaiculture.gov.ae/"]
].map(([title, url]) => ({ title, url, checkedAt: CHECKED_AT }));

export const heroImage = images.skyline;
