export const CHECKED_AT = "2026-08-31";

export const trip = {
  title: "DUBAI FAMILY TRIP",
  subtitle: "세 가족, 한 빌라, 리조트 중심 저강도 여행",
  destination: "두바이",
  startDate: "2027-03-20",
  arrivalDate: "2027-03-21",
  checkoutDate: "2027-03-31",
  nights: 10,
  adults: 6,
  children: [9, 7, 6],
  principles: [
    "관광일 다음에는 반드시 리조트 회복일을 둔다.",
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
    name: "Jumeirah Zabeel Saray, Four Bedroom Lagoon Royal Villa",
    type: "서비스와 수영장이 결합된 4베드룸 빌라",
    verdict: "6성인과 3아동 수용이 공식 문구로 가장 명확함",
    capacity: "최대 10명, 6성인과 4아동 명시",
    layout: "461㎡, 침실 4, 완전한 주방, 별도 출입구, 라군 풀",
    location: "Palm Jumeirah West Crescent", fit: 94,
    good: ["이번 6+3 구성을 공식 수용", "한 빌라와 전용 생활 공간", "키즈클럽, 해변, 24시간 버틀러", "회복일을 숙소에서 완결 가능"],
    cautions: ["Downtown과 Old Dubai까지 이동이 길다", "각 방의 정확한 침대 배치 확인", "10박 연속 재고와 취소 조건 미확인"],
    action: "6성인과 만 9세, 7세, 6세의 침대 배치도와 10박 총액을 서면 요청",
    official: "https://www.jumeirah.com/en/stay/dubai/jumeirah-zabeel-saray/accommodation/four-bedroom-lagoon-royal-residences-exclusive",
    maps: "https://www.google.com/maps/search/?api=1&query=Jumeirah%20Zabeel%20Saray%20Dubai",
    lat: 25.0986, lng: 55.1233
  },
  {
    id: "marsa", rank: 2,
    name: "Jumeirah Residences Marsa Al Arab, Four Bedroom Panoramic Residence",
    type: "저피로 입지가 좋은 4베드룸 레지던스",
    verdict: "도심과 해변의 균형은 최고지만 6+3 승인이 필요함",
    capacity: "공식 9명 또는 8성인과 2아동 조합",
    layout: "418㎡, 침실 4, 오픈 키친, 연결 레지던스 구조",
    location: "Jumeirah, Madinat 권역", fit: 91,
    good: ["Madinat와 해변을 짧게 이용", "Downtown과 Palm 사이 이동 균형", "주방과 넓은 거실", "24시간 프라이빗 다이닝"],
    cautions: ["6성인과 3아동 조합은 공식 표기에 없음", "두 레지던스를 연결한 구조 확인", "침대 배치와 아동 정책 서면 승인 필수"],
    action: "총 9명이라는 이유만으로 예약하지 말고 6+3 수용과 요금을 호텔이 서면 확약할 때만 선택",
    official: "https://www.jumeirah.com/en/stay/dubai/jumeirah-residences-marsa-al-arab/accommodation/four-bedroom-panoramic-residence-marina-view",
    maps: "https://www.google.com/maps/search/?api=1&query=Jumeirah%20Marsa%20Al%20Arab%20Dubai",
    lat: 25.1419, lng: 55.1848
  },
  {
    id: "raffles", rank: 3,
    name: "Raffles The Palm Dubai, Royal Villa Four Bedroom",
    type: "프라이버시가 강한 대형 독립 빌라",
    verdict: "한 채의 완결성은 가장 높지만 Palm 서쪽 이동이 약점",
    capacity: "공식 최대 10명",
    layout: "950㎡, 침실 4, 주방, 전용 수영장과 출입구",
    location: "Palm Jumeirah West Crescent", fit: 88,
    good: ["3 king과 1 twin 표기", "전용 수영장과 주방", "기사와 도우미 공간", "24시간 인룸 다이닝"],
    cautions: ["twin 표기의 실제 침대 수가 모호함", "Downtown 왕복이 길다", "아동별 침대와 rollaway 확인 필요"],
    action: "floor plan과 9인 침대표를 받은 뒤 Zabeel Saray와 비교",
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
    official: "https://www.kempinski.com/en/palm-jumeirah/rooms-suites/penthouses/superior-four-bedroom-penthouse",
    maps: "https://www.google.com/maps/search/?api=1&query=Kempinski%20Hotel%20Palm%20Jumeirah",
    lat: 25.1112, lng: 55.1137
  }
];

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
  { date: "2027-03-20", dow: "토", title: "각 도시에서 출발", zone: "ICN / LAX", intensity: 1, stay: false, main: "두 팀 모두 Emirates 직항을 우선하고 도착 시각을 억지로 맞추지 않는다.", timeline: ["ICN팀 직항 출발", "LAX팀 직항 출발", "단체 채팅에 항공편과 차량 담당자 고정"], rain: "해당 없음", low: "라운지와 기내 수면만 일정으로 본다.", transport: "출발 공항 개별 이동", notes: "2027년 시간표가 열리면 확정" },
  { date: "2027-03-21", dow: "일", title: "도착과 체크인만", zone: "DXB / 숙소", intensity: 1, stay: true, main: "Meet & Greet와 개별 차량으로 숙소에 들어가며 합류 행사를 만들지 않는다.", timeline: ["DXB 입국 패스트트랙", "숙소별 얼리 체크인 또는 데이룸", "인룸 다이닝과 수면"], rain: "숙소 안에서 동일", low: "외출 없음", transport: "DXB 전용차 30-45분", notes: "Palm 서쪽은 교통에 따라 더 길 수 있음" },
  { date: "2027-03-22", dow: "월", title: "완전 회복일", zone: "리조트", intensity: 1, stay: true, main: "수영장이나 해변을 60-90분만 사용하고 낮잠을 일정의 중심에 둔다.", timeline: ["늦은 조식", "아이 수영 60-90분", "오후 낮잠과 빌라 저녁"], rain: "키즈클럽과 실내 수영장", low: "하루 종일 빌라", transport: "도보", notes: "예약 일정 없음" },
  { date: "2027-03-23", dow: "화", title: "Museum of the Future", zone: "Trade Centre", intensity: 2, stay: true, main: "10시 30분 시간 지정 입장 한 곳만 보고 이른 점심 뒤 15시 전에 복귀한다.", timeline: ["09:45 숙소 출발", "10:30-13:00 관람", "인근 점심 후 즉시 귀환"], rain: "그대로 진행", low: "관람 90분 후 귀환", transport: "전용차 편도 20-35분", notes: "시간 지정 표는 사전 예약" },
  { date: "2027-03-24", dow: "수", title: "리조트 데이", zone: "리조트", intensity: 1, stay: true, main: "키즈클럽과 성인 스파를 교대하고 이동하지 않는다.", timeline: ["아이 키즈클럽", "성인 교대 스파", "해 질 무렵 짧은 산책"], rain: "실내 시설", low: "빌라와 룸서비스", transport: "도보", notes: "관광 예약 없음" },
  { date: "2027-03-25", dow: "목", title: "Burj Khalifa 한 블록", zone: "Downtown", intensity: 2, stay: true, main: "10시 전망대와 이른 점심만 고정하고 Aquarium은 체력이 남을 때만 선택한다.", timeline: ["09:15 숙소 출발", "10:00 At The Top", "Dubai Mall 이른 점심, 14:30 귀환"], rain: "그대로 진행", low: "전망대만 보고 귀환", transport: "전용차 편도 20-40분", notes: "유모차와 큰 가방 보관 규정 확인" },
  { date: "2027-03-26", dow: "금", title: "Madinat abra와 이른 저녁", zone: "Jumeirah", intensity: 1, stay: true, main: "Jumeirah 숙소라면 짧은 배와 저녁만, Palm 숙소라면 리조트 일정으로 교체한다.", timeline: ["오후까지 휴식", "16:30 abra", "18:00 이른 저녁 후 귀환"], rain: "Madinat 실내 식사만", low: "숙소 해변 산책", transport: "전용차 편도 5-30분", notes: "숙소 위치에 따라 가치가 달라짐" },
  { date: "2027-03-27", dow: "토", title: "Al Shindagha Children’s House", zone: "Old Dubai", intensity: 2, stay: true, main: "어린이 전시 중심으로 2시간만 보고, Palm 서쪽 숙소라면 과감히 삭제한다.", timeline: ["09:30 전용차 출발", "10:15-12:30 관람", "점심 후 바로 귀환"], rain: "그대로 진행", low: "Etihad Museum으로 축소", transport: "전용차 편도 30-50분", notes: "Palm 숙소에서는 선택 일정" },
  { date: "2027-03-28", dow: "일", title: "두 번째 완전 휴식일", zone: "리조트", intensity: 1, stay: true, main: "관광 예약을 넣지 않고 아이들이 원하는 수영과 식사만 반복한다.", timeline: ["늦은 조식", "수영 또는 키즈클럽", "가족 사진과 인룸 저녁"], rain: "실내 시설", low: "빌라", transport: "도보", notes: "아무것도 추가하지 않음" },
  { date: "2027-03-29", dow: "월", title: "Aquaventure 짧고 확실하게", zone: "Palm", intensity: 3, stay: true, main: "10시부터 15시까지만 머물고 cabana와 AquaXpress로 대기와 체력 소모를 줄인다.", timeline: ["개장 시각 입장", "cabana를 회복 거점으로 사용", "15:00 이전 숙소 귀환"], rain: "강풍이나 운영 제한 시 Green Planet", low: "Lost Chambers만 90분", transport: "전용차 편도 5-30분", notes: "신장 제한과 구명조끼 규정 확인" },
  { date: "2027-03-30", dow: "화", title: "날씨와 피로 버퍼", zone: "숙소 주변", intensity: 1, stay: true, main: "취소된 일정 하나만 복구하고 기본값은 숙소다. 사막 사파리는 핵심 일정에 넣지 않는다.", timeline: ["아침 컨디션 확인", "필요하면 이전 일정 하나 복구", "짐 정리와 이른 취침"], rain: "Museum of the Future 또는 Aquarium", low: "숙소", transport: "선택 일정만 차량", notes: "사막은 장거리와 늦은 귀환 때문에 제외" },
  { date: "2027-03-31", dow: "수", title: "체크아웃과 출국", zone: "숙소 / DXB", intensity: 1, stay: false, main: "팀별 항공편 3시간 전 DXB 도착을 기준으로 개별 출발한다.", timeline: ["객실별 짐과 여권 점검", "팀별 전용차 출발", "DXB 항공사 카운터 확인"], rain: "동일", low: "동일", transport: "전용차 30-50분", notes: "공항에서 합류 행사를 만들지 않음" }
];

export const mealSuggestions = {
  "2027-03-20": "라운지와 기내식만 이용하고 도착 직전 과식하지 않는다.",
  "2027-03-21": "인룸 다이닝 또는 빌라 주방. 도착일 유명 식당 예약은 넣지 않는다.",
  "2027-03-22": "리조트 조식과 수영장 옆 이른 점심, 저녁은 빌라에서 먹는다.",
  "2027-03-23": "Museum of the Future 인근에서 9인 예약 점심 후 바로 귀환한다.",
  "2027-03-24": "호텔 안에서 해결하고 외부 파인다이닝을 추가하지 않는다.",
  "2027-03-25": "Dubai Mall에서 11시 45분 점심을 예약해 혼잡 전에 끝낸다.",
  "2027-03-26": "Madinat에서 17시 30분 9인 테이블과 어린이 메뉴를 사전 확인한다.",
  "2027-03-27": "Old Dubai 점심은 차량 동선 안의 한 곳만 예약하고 시장 탐색은 하지 않는다.",
  "2027-03-28": "아이들이 좋아한 리조트 식사를 반복한다.",
  "2027-03-29": "Aquaventure cabana 식사와 충분한 수분을 기본값으로 둔다.",
  "2027-03-30": "새 식당을 추가하지 않고 숙소 또는 이미 검증한 곳을 반복한다.",
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
  place("aquarium", "Dubai Aquarium", "Downtown", "수족관", 25.1975, 55.2793, "60-90분", 2, true, "Burj 일정의 선택형 실내 대안이다.", "같은 날 의무로 묶으면 아이 피로가 커짐", "https://www.thedubaiaquarium.com/", images.city),
  place("madinat", "Madinat Jumeirah Abra", "Jumeirah", "보트", 25.1339, 55.1858, "30-60분", 1, false, "Jumeirah 숙소에서 짧고 상징적인 저녁 전 일정이 된다.", "더운 시간과 주말 혼잡을 피함", "https://www.jumeirah.com/en/stay/dubai/madinat-jumeirah", images.coast),
  place("burjalarab", "Burj Al Arab waterfront", "Jumeirah", "산책", 25.1412, 55.1853, "30분", 1, false, "Madinat와 같은 권역에서 사진과 짧은 산책을 끝낼 수 있다.", "공공 해변과 호텔 출입 규정은 다름", "https://www.jumeirah.com/en/stay/dubai/burj-al-arab-jumeirah", images.coast),
  place("shindagha", "Al Shindagha Museum", "Old Dubai", "박물관", 25.2689, 55.2893, "2-3시간", 2, true, "Children’s House 중심으로 문화 일정을 아이 눈높이에 맞춘다.", "Palm 서쪽 숙소에서는 이동 대비 효용이 낮아 선택 일정", "https://alshindagha.dubaiculture.gov.ae/", images.city),
  place("etihad", "Etihad Museum", "Jumeirah 1", "박물관", 25.2413, 55.2696, "90분", 1, true, "Old Dubai보다 짧은 실내 대안으로 쓰기 좋다.", "전시 관심도가 낮으면 생략", "https://etihadmuseum.dubaiculture.gov.ae/", images.city),
  place("aquaventure", "Aquaventure World", "Palm", "워터파크", 25.1305, 55.1171, "최대 5시간", 3, false, "아이 셋에게 두바이 선택의 가장 분명한 이유다.", "1.2m 신장 제한, 구명조끼, 13세 미만 보호자 규정 확인", "https://www.atlantis.com/dubai/atlantis-aquaventure/aquaventure-waterpark", images.coast),
  place("lost", "The Lost Chambers Aquarium", "Palm", "수족관", 25.1300, 55.1175, "60-90분", 1, true, "Aquaventure를 감당하기 어려운 날의 저강도 대안이다.", "운영시간과 묶음표 조건 확인", "https://www.atlantis.com/atlantis-the-palm/the-lost-chambers-aquarium", images.coast),
  place("green", "The Green Planet", "City Walk", "실내자연", 25.2075, 55.2627, "90분", 1, true, "강풍이나 피로가 큰 날의 실내 생태 대안이다.", "주말 혼잡과 시간 지정표 확인", "https://www.thegreenplanetdubai.com/", images.city),
  place("kite", "Kite Beach", "Jumeirah", "해변", 25.1612, 55.2073, "60-90분", 1, false, "Jumeirah 숙소에서 짧은 야외 회복 일정으로 쓸 수 있다.", "한낮 햇빛과 바람을 피하고 수영은 안전요원 구역만", "https://www.visitdubai.com/en/places-to-visit/kite-beach", images.coast),
  place("zabeel", "Jumeirah Zabeel Saray", "Palm West", "숙소", 25.0986, 55.1233, "기준점", 1, true, "공식적으로 6성인과 4아동까지 받는 정확한 4베드룸 후보다.", "도심 이동이 길어 리조트 중심 일정으로 운영", lodgingOptions[0].official, images.coast),
  place("marsa", "Jumeirah Marsa Al Arab", "Jumeirah", "숙소", 25.1419, 55.1848, "기준점", 1, true, "도심과 해변 이동 균형이 가장 좋은 입지 후보다.", "6성인과 3아동 수용 서면 승인 필요", lodgingOptions[1].official, images.coast),
  place("desert", "Desert safari", "Desert", "제외", 25.1100, 55.4200, "반일 이상", 3, false, "대표 경험이지만 이번 저피로 원칙과 충돌한다.", "장거리 차량, 모래길, 늦은 귀환 때문에 핵심 일정에서 제외", "https://www.visitdubai.com/en/things-to-do/itineraries/desert-safari", images.desert)
];

export const climate = {
  source: "Dubai Statistics Center and Dubai official portal",
  summary: "공식 과거 자료의 3월 평균 일최고는 29-30°C, 일최저는 19-20°C 수준이다.",
  packing: ["어린이 자외선 차단제", "래시가드와 수영모", "실내 냉방용 얇은 겉옷", "모자와 보냉 물병", "샌들과 편한 운동화"],
  note: "2011-2013 공식 관측표를 기반으로 한 장기 판단이며 2027년 일별 예보가 아니다. 실제 예보는 출발 10일 전부터 갱신한다.",
  official: "https://www.dsc.gov.ae/Report/15.pdf"
};

export const sources = [
  ["Original family trip planning deck", trip.sourceDeck],
  ["Jumeirah Zabeel Saray Four Bedroom Villa", lodgingOptions[0].official],
  ["Jumeirah Marsa Al Arab Four Bedroom Residence", lodgingOptions[1].official],
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
