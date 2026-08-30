export const CHECKED_AT = "2026-08-31";

export const trip = {
  title: "ISTANBUL TOGETHER",
  subtitle: "세 가족, 한 거실, 하루 한 가지",
  destination: "이스탄불",
  startDate: "2027-03-20",
  arrivalDate: "2027-03-21",
  checkoutDate: "2027-03-31",
  nights: 10,
  adults: 6,
  children: [9, 7, 6],
  principles: [
    "하루 핵심 일정은 하나만 잡는다.",
    "점심 뒤에는 숙소로 돌아와 세 시간쯤 쉬고 낮잠을 잔다.",
    "도보 15분을 넘기면 9인 전용차나 배를 먼저 검토한다.",
    "비, 피로, 임신 가능성에 대비해 매일 대안을 준비한다."
  ],
  sourceDeck: "https://docs.google.com/presentation/d/1DqhJV7cJ0mCBQksIhufKVJgnU6vMFRkCA5b5NxnU95Q/edit?slide=id.p15#slide=id.p15"
};

export const familyGroups = [
  {
    id: "icn",
    label: "서울 출발팀",
    origin: "ICN",
    members: "성인 4, 어린이 1",
    route: "인천 → 이스탄불 직항",
    target: "3월 20일 밤 출발, 3월 21일 아침 도착편 우선",
    carriers: "Turkish Airlines 직항을 기준으로 두고, 한국계 직항은 2027년 운항표에서 비교",
    status: "2027년 정확한 편명과 운항일은 발권 시 재확인"
  },
  {
    id: "lax",
    label: "로스앤젤레스 출발팀",
    origin: "LAX",
    members: "성인 2, 어린이 2",
    route: "로스앤젤레스 → 이스탄불 직항",
    target: "3월 20일 출발, 3월 21일 낮 도착편 우선",
    carriers: "Turkish Airlines 직항 노선 확인",
    status: "서울팀보다 먼저 도착해도 공항 대기 대신 숙소로 이동"
  }
];

export const lodgingOptions = [
  {
    id: "cvk",
    rank: 1,
    name: "CVK Park Bosphorus, 4 Bedroom Residence",
    type: "호텔 서비스형 한 집",
    verdict: "세 가족이 정말 한집처럼 지내려면 지금은 이곳이 1순위",
    capacity: "공식 최대 9명",
    layout: "310㎡, 침실 4, 욕실 4, 주방, 거실",
    location: "Gümüşsuyu, Taksim",
    fit: 96,
    good: ["9명이 한 거실을 공유", "매일 청소와 호텔 서비스", "전용차 진입이 쉬운 중심지", "비 오는 날 실내 시설 활용"],
    cautions: ["정확한 침대 구성과 어린이 추가 침대 확인", "2027년 10박 연속 재고는 아직 미확인", "구시가지 관광은 차량 이동 필요"],
    action: "4 Bedroom Bosphorus View Residence 1개를 3월 21일부터 31일까지 직접 문의",
    official: "https://www.cvkhotelsandresorts.com/park-prestige-suites/residences/four-bedroom-residence-with-bosphorus-view",
    maps: "https://www.google.com/maps/search/?api=1&query=CVK%20Park%20Bosphorus%20Hotel%20Istanbul",
    lat: 41.0367,
    lng: 28.9864
  },
  {
    id: "peninsula",
    rank: 2,
    name: "The Peninsula Istanbul",
    type: "연결 객실형 호텔",
    verdict: "서비스와 위치는 편하지만 모두 한집에 지내는 건 포기해야 함",
    capacity: "객실 3개 이상 또는 스위트 조합",
    layout: "인접 객실, 실내 수영장, 전용 보트와 밴",
    location: "Karaköy, Galataport",
    fit: 80,
    good: ["가족 패키지에 12세 미만 인접 객실 명시", "구시가지와 아시아 쪽을 배로 연결 가능", "도착일과 휴식일 운영이 편함"],
    cautions: ["모두 한 집에 머무는 형태는 아님", "공식 가족 패키지는 그룹 예약에 적용되지 않음", "객실 조합과 연결문을 서면 확약해야 함"],
    action: "패키지 자동 적용을 기대하지 말고, 9명 전체의 맞춤 객실 배치도와 PEN1 보트 조건을 컨시어지에 요청",
    official: "https://www.peninsula.com/en/istanbul/special-offers/rooms/family-package",
    maps: "https://www.google.com/maps/search/?api=1&query=The%20Peninsula%20Istanbul",
    lat: 41.0255,
    lng: 28.9801
  },
  {
    id: "licensed-home",
    rank: 3,
    name: "허가된 4베드룸 전체 숙소",
    type: "Airbnb 또는 전문 빌라 운영사",
    verdict: "좋은 매물을 찾으면 생활감은 가장 좋음",
    capacity: "성인 6, 어린이 3 전체 숙소",
    layout: "침실 4 이상, 욕실 3 이상, 거실, 주방",
    location: "Gümüşsuyu, Cihangir, Karaköy 평지 우선",
    fit: 82,
    good: ["한 집 선호를 가장 자연스럽게 충족", "세탁과 간단한 아침 준비", "아이 취침 뒤 어른 공용 공간 확보"],
    cautions: ["100일 이하 관광 임대 허가번호 확인 필수", "엘리베이터와 차량 문 앞 접근을 영상으로 확인", "사진보다 경사와 소음이 더 중요"],
    action: "허가번호, 9인 정원, 엘리베이터, 난방, 취소 조건을 메시지로 서면 확인",
    official: "https://www.airbnb.com/s/Istanbul--T%C3%BCrkiye/homes?tab_id=home_tab&refinement_paths%5B%5D=%2Fhomes&date_picker_type=calendar&checkin=2027-03-21&checkout=2027-03-31&adults=6&children=3&room_types%5B%5D=Entire%20home%2Fapt",
    maps: "https://www.google.com/maps/search/?api=1&query=Gumussuyu%20Istanbul",
    lat: 41.0335,
    lng: 28.9868
  },
  {
    id: "somerset",
    rank: 4,
    name: "Somerset Maslak Istanbul, 4 Bedroom",
    type: "서비스드 레지던스",
    verdict: "집 구조는 맞지만 이번 여행에는 너무 멂",
    capacity: "공식 최대 9명",
    layout: "4베드룸 서비스드 아파트",
    location: "Maslak",
    fit: 58,
    good: ["9인 정원과 주방", "장기 투숙 운영 경험"],
    cautions: ["주요 관광지까지 매일 긴 차량 이동", "러시아워에 걸리면 아이들 쉬는 시간이 줄어듦"],
    action: "가격 차이가 매우 커도 우선순위에서 제외",
    official: "https://www.discoverasr.com/en/somerset-serviced-residence/turkiye/somerset-maslak-istanbul",
    maps: "https://www.google.com/maps/search/?api=1&query=Somerset%20Maslak%20Istanbul",
    lat: 41.1271,
    lng: 29.0241
  }
];

export const rentalChecklist = [
  "관광 임대 허가번호가 광고와 건물에 표시되는가",
  "침실 4개와 실제 성인용 침대 수를 영상으로 확인했는가",
  "욕실이 3개 이상이며 온수 용량이 9명에게 충분한가",
  "엘리베이터가 있고 출입구까지 계단이 없는가",
  "9인 밴이 문 앞 또는 50m 안에 정차할 수 있는가",
  "거실에 9명이 함께 앉을 수 있는가",
  "3월 난방과 환기, 세탁기, 건조 방식이 확인됐는가",
  "야간 소음, 언덕 경사, 공사 여부를 최근 리뷰에서 확인했는가",
  "중간 청소와 수건 교체를 최소 2회 예약할 수 있는가",
  "취소 조건과 호스트 대체 숙소 책임이 서면으로 남는가"
];

export const itinerary = [
  {
    date: "2027-03-20", dow: "토", title: "각 도시에서 출발", zone: "ICN / LAX", intensity: 1, stay: false,
    main: "두 팀 모두 환승 없는 직항을 우선한다. 도착 시각을 억지로 맞추지 않는다.",
    timeline: ["ICN팀: 밤 출발편 목표", "LAX팀: 같은 날짜 직항 출발", "가족 단체 채팅에 항공편과 기사 연락처 고정"],
    rain: "해당 없음", low: "공항 라운지와 기내 수면을 일정의 전부로 본다.",
    transport: "출발 공항 개별 이동", notes: "최종 편명은 2027년 운항표가 열린 뒤 확정"
  },
  {
    date: "2027-03-21", dow: "일", title: "도착, 체크인만", zone: "숙소 주변", intensity: 1, stay: true,
    main: "공항에서 서로 기다리지 않고 각 팀이 전용차로 바로 숙소에 들어갑니다.",
    timeline: ["공항별 Sprinter 1대 또는 밴 2대", "얼리 체크인 또는 데이룸", "숙소 300m 안에서 이른 저녁"],
    rain: "호텔 수영장, 룸서비스", low: "저녁도 숙소에서 해결하고 바로 취침",
    transport: "IST 공항에서 숙소까지 예약 차량", notes: "정상 체크인 전 도착팀을 위한 객실 확보가 핵심"
  },
  {
    date: "2027-03-22", dow: "월", title: "아무 데도 안 가는 날", zone: "Taksim / Galataport", intensity: 1, stay: true,
    main: "늦은 아침, 수영, 짧은 산책만 한다. 시차 적응을 관광보다 우선한다.",
    timeline: ["10:00 늦은 아침", "12:00 수영 또는 낮잠", "16:00 45분 산책", "18:00 이른 저녁"],
    rain: "숙소 안에서 하루", low: "산책도 취소",
    transport: "도보 또는 5분 차량", notes: "Dolmabahçe는 월요일 휴관이라 넣지 않음"
  },
  {
    date: "2027-03-23", dow: "화", title: "구시가지 첫 장면", zone: "Sultanahmet", intensity: 2, stay: true,
    main: "Hagia Sophia 외관과 Basilica Cistern을 3시간 안에 본다. Blue Mosque는 컨디션에 따라 선택한다.",
    timeline: ["09:30 전용차 출발", "10:00 Basilica Cistern", "11:15 Hagia Sophia와 광장", "12:30 점심 후 숙소 복귀"],
    rain: "Basilica Cistern과 식사만", low: "Hagia Sophia 광장 30분과 점심만",
    transport: "왕복 전용차, 현지 이동 도보 약 1km", notes: "Topkapı는 화요일 휴관"
  },
  {
    date: "2027-03-24", dow: "수", title: "Topkapı Palace", zone: "Sultanahmet", intensity: 2, stay: true,
    main: "개장 직후 Topkapı 핵심 구역만 2시간 30분 보고 나온다.",
    timeline: ["09:00 숙소 출발", "09:30 Topkapı 입장", "12:00 Gülhane 쪽 점심", "13:30 숙소 복귀와 낮잠"],
    rain: "궁전 실내 중심, 정원 생략", low: "보물관과 전망만 선택",
    transport: "왕복 전용차", notes: "오후 일정 없음"
  },
  {
    date: "2027-03-25", dow: "목", title: "Dolmabahçe Palace", zone: "Beşiktaş", intensity: 2, stay: true,
    main: "가이드와 궁전 한 곳만 본 뒤 Bosphorus가 보이는 점심으로 끝낸다.",
    timeline: ["09:30 출발", "10:00 궁전 관람", "12:30 점심", "14:00 숙소 복귀"],
    rain: "동일 진행 가능", low: "궁전 대신 Çırağan 또는 호텔 라운지 점심",
    transport: "차량 10분 안팎", notes: "사진 촬영과 유모차 제한은 직전 재확인"
  },
  {
    date: "2027-03-26", dow: "금", title: "가족 전용 Bosphorus", zone: "Bosphorus", intensity: 2, stay: true,
    main: "금요 예배 시간의 모스크 혼잡을 피하고, 난방 가능한 전용 보트로 바다에서 도시를 본다.",
    timeline: ["10:30 호텔 또는 Karaköy 선착장", "11:00 전용 크루즈 2시간", "13:30 점심", "15:00 숙소"],
    rain: "파도가 약하면 밀폐형 보트, 강풍이면 Istanbul Modern", low: "1시간 Golden Horn 보트 또는 호텔 휴식",
    transport: "전용 보트와 짧은 차량", notes: "구명조끼 3개 어린이 사이즈, 화장실, 실내 난방 확인"
  },
  {
    date: "2027-03-27", dow: "토", title: "두 번째 완전 휴식일", zone: "숙소 / Karaköy", intensity: 1, stay: true,
    main: "아무것도 예약하지 않는다. 원하는 사람만 Istanbul Modern 또는 Galataport로 나간다.",
    timeline: ["늦은 아침", "수영과 세탁", "선택 일정 90분", "숙소에서 가족 저녁"],
    rain: "Istanbul Modern", low: "하루 종일 숙소",
    transport: "차량 5분 또는 도보", notes: "여행 중간에 실제로 비워 둔 날"
  },
  {
    date: "2027-03-28", dow: "일", title: "아시아 쪽 동네 산책", zone: "Üsküdar / Kuzguncuk", intensity: 2, stay: true,
    main: "전용 보트나 차량으로 건너가 Kuzguncuk의 짧은 평지 구간과 Beylerbeyi를 선택한다.",
    timeline: ["10:00 출발", "10:30 Kuzguncuk", "12:00 점심", "13:30 Beylerbeyi 선택", "15:00 숙소"],
    rain: "Beylerbeyi Palace와 차량 전망", low: "Üsküdar 해안 점심만",
    transport: "전용 보트 우선, 귀환 차량 대기", notes: "언덕 골목은 경로에서 제외"
  },
  {
    date: "2027-03-29", dow: "월", title: "시장 2시간", zone: "Grand Bazaar / Eminönü", intensity: 2, stay: true,
    main: "Grand Bazaar는 가이드와 정한 가게 두 곳만 보고, 더 짧고 보기 쉬운 Spice Bazaar에서 점심을 먹습니다.",
    timeline: ["09:30 Grand Bazaar", "11:30 차량으로 Eminönü", "12:00 Pandeli 점심", "14:00 숙소"],
    rain: "동일 진행 가능", low: "Spice Bazaar와 점심만",
    transport: "구간별 차량, 시장 안 걷기 약 1.2km", notes: "Dolmabahçe는 월요일 휴관"
  },
  {
    date: "2027-03-30", dow: "화", title: "비가 오거나 지쳤을 때 쓰는 빈 날", zone: "선택", intensity: 1, stay: true,
    main: "앞서 놓친 한 곳만 보거나, 아이들과 Rahmi M. Koç Museum을 선택한다.",
    timeline: ["전날 밤 가족 투표", "10:30 선택 일정", "13:00 점심", "14:30 짐 정리"],
    rain: "Rahmi M. Koç Museum", low: "좋았던 동네의 점심만 반복",
    transport: "전용차", notes: "Topkapı는 화요일 휴관, 새 관광지를 추가하지 않음"
  },
  {
    date: "2027-03-31", dow: "수", title: "귀국", zone: "숙소 → IST", intensity: 1, stay: false,
    main: "팀별 비행 시각에 맞춰 따로 출발한다. 마지막 공동 일정을 만들지 않는다.",
    timeline: ["개별 조식", "항공편 3시간 전 공항 도착 목표", "팀별 전용차"],
    rain: "해당 없음", low: "해당 없음",
    transport: "수하물 포함 전용 밴", notes: "LAX 장거리팀은 레이트 체크아웃 우선"
  }
];

const dayDetails = {
  "2027-03-20": { featuredPlace: "galataport", whyNow: "장거리 비행이 시작되는 날이라 다른 약속을 잡지 않고, 두 팀 모두 기내에서 잘 수 있는 리듬만 맞춥니다." },
  "2027-03-21": { featuredPlace: "galataport", whyNow: "도착 시간이 달라도 공항에서 기다리지 않도록 첫날은 체크인, 가까운 저녁, 잠만 남겨 둡니다." },
  "2027-03-22": { featuredPlace: "galataport", whyNow: "시차가 가장 크게 느껴지는 첫 아침입니다. 산책은 45분까지만 하고 힘들면 숙소 밖으로 나가지 않습니다." },
  "2027-03-23": { featuredPlace: "cistern", whyNow: "첫 외출은 날씨 영향을 덜 받고 한 시간 안에 끝낼 수 있는 Basilica Cistern부터 시작합니다." },
  "2027-03-24": { featuredPlace: "topkapi", whyNow: "화요일 휴관을 피한 첫 개장일입니다. Harem과 보물실을 먼저 보고 2시간 30분 안에 나옵니다." },
  "2027-03-25": { featuredPlace: "dolmabahce", whyNow: "구시가지를 연달아 걷지 않도록 숙소 가까운 궁전으로 옮깁니다. 정원과 핵심 실내만 봅니다." },
  "2027-03-26": { featuredPlace: "ortakoy", whyNow: "금요 예배 시간의 모스크 혼잡을 피하고, 난방과 화장실이 있는 전용 보트에서 도시를 봅니다." },
  "2027-03-27": { featuredPlace: "modern", whyNow: "여행 중간에 예약을 비운 날입니다. 원하는 가족만 Istanbul Modern을 90분 보고 돌아옵니다." },
  "2027-03-28": { featuredPlace: "kuzguncuk", whyNow: "궁전과 구시가지 뒤에는 생활 동네를 봅니다. 해안과 낮은 골목만 골라 다리 피로를 줄입니다." },
  "2027-03-29": { featuredPlace: "spice", whyNow: "큰 시장은 월요일 오전에 가이드와 짧게 보고, 아이에게 더 쉬운 Spice Bazaar에서 점심으로 끝냅니다." },
  "2027-03-30": { featuredPlace: "rahmi", whyNow: "비가 오거나 역사 명소에 지친 아이들에게 가장 확실한 교체 카드입니다. 자동차와 기차 전시만 골라도 충분합니다." },
  "2027-03-31": { featuredPlace: "galataport", whyNow: "출국일에는 관광을 넣지 않습니다. 두 팀이 서로 기다리지 않고 항공편 순서대로 공항으로 갑니다." }
};

for (const day of itinerary) Object.assign(day, dayDetails[day.date]);

export const mealSuggestions = {
  "2027-03-20": "공항 라운지와 기내식만. 도착 전 과식하지 않는다.",
  "2027-03-21": "룸서비스 또는 숙소 300m 안. 첫날에는 유명 식당 예약을 넣지 않는다.",
  "2027-03-22": "Namlı Gurme 이른 아침 또는 숙소 조식, 저녁은 주방과 배달을 활용한다.",
  "2027-03-23": "Sultanahmet 안에서 9인 점심을 가이드가 사전 확정하고 13시 전에 끝낸다.",
  "2027-03-24": "Gülhane 출구 쪽에서 예약 점심 후 바로 귀환한다. 시장 쪽으로 더 걷지 않는다.",
  "2027-03-25": "Feriye는 점심만 후보로 두고 9인 좌석을 확인한다. 17시 이후 어린이 정책 때문에 저녁은 제외한다.",
  "2027-03-26": "보트 케이터링을 가볍게 하거나 하선 뒤 숙소 가까운 예약 식당 한 곳만 이용한다.",
  "2027-03-27": "숙소 주방에서 먹고, 외식하고 싶으면 Namlı 또는 Gallada의 어린이 정책을 먼저 확인한다.",
  "2027-03-28": "Kuzguncuk의 작은 식당을 현장 탐색하지 말고 컨시어지가 9인 점심을 전날 확정한다.",
  "2027-03-29": "Pandeli 12시 점심을 우선 문의한다. 불가하면 인근 Hamdi의 9인 테이블을 확인한다.",
  "2027-03-30": "아이들이 다시 먹고 싶어 한 곳을 반복한다. 새 파인다이닝을 추가하지 않는다.",
  "2027-03-31": "팀별 출발 시각에 맞춘 조식 또는 포장식. 공항에서 합류 식사를 만들지 않는다."
};

const images = {
  skyline: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Historical_peninsula_and_modern_skyline_of_Istanbul.jpg/1280px-Historical_peninsula_and_modern_skyline_of_Istanbul.jpg",
  hagia: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Hagia_Sophia_%28228968325%29.jpeg/1280px-Hagia_Sophia_%28228968325%29.jpeg",
  blue: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Istanbul_%2834223582516%29_%28cropped%29.jpg/1280px-Istanbul_%2834223582516%29_%28cropped%29.jpg",
  cistern: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Cisterna_Bas%C3%ADlica%2C_Estambul%2C_Turqu%C3%ADa%2C_2024-09-28%2C_DD_58-60_HDR.jpg/1280px-Cisterna_Bas%C3%ADlica%2C_Estambul%2C_Turqu%C3%ADa%2C_2024-09-28%2C_DD_58-60_HDR.jpg",
  topkapi: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Topkap%C4%B1_-_01.jpg/1280px-Topkap%C4%B1_-_01.jpg",
  gulhane: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/G%C3%BClhane_Park%2C_Istanbul.jpg/1280px-G%C3%BClhane_Park%2C_Istanbul.jpg",
  dolmabahce: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Dolmabahce_Istanbul_Turkey.jpg/1280px-Dolmabahce_Istanbul_Turkey.jpg",
  modern: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Istanbul%2C_Turkey_%28November_2023%29_-_611.jpg/1280px-Istanbul%2C_Turkey_%28November_2023%29_-_611.jpg",
  galata: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Galata_tower_01_23.jpg/1280px-Galata_tower_01_23.jpg",
  rahmi: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Istanbul_asv2021-11_img14_Rahmi_Ko%C3%A7_Museum.jpg/1280px-Istanbul_asv2021-11_img14_Rahmi_Ko%C3%A7_Museum.jpg",
  bazaar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Istanbul_asv2021-11_img41_Grand_Bazaar.jpg/1280px-Istanbul_asv2021-11_img41_Grand_Bazaar.jpg",
  spice: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Spice_Bazaar_Istanbul_Feb_2020%2C_img_2.jpg/1280px-Spice_Bazaar_Istanbul_Feb_2020%2C_img_2.jpg",
  kuzguncuk: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Selfie_time_in_Istanbul_streets_%2816428058798%29.jpg/1280px-Selfie_time_in_Istanbul_streets_%2816428058798%29.jpg",
  beylerbeyi: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Beylerbeyi_Palace_%28cropped%29.jpg/1280px-Beylerbeyi_Palace_%28cropped%29.jpg",
  ortakoy: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Istanbul_asv2020-02_img60_Ortak%C3%B6y_Mosque.jpg/1280px-Istanbul_asv2020-02_img60_Ortak%C3%B6y_Mosque.jpg"
};

function place(id, name, zone, category, lat, lng, duration, energy, rain, why, warning, official, image = "") {
  return {
    id, name, zone, category, lat, lng, duration, energy, rain, why, warning, official, image,
    maps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} Istanbul`)}`,
    checkedAt: CHECKED_AT
  };
}

export const places = [
  place("hagia", "Hagia Sophia", "Sultanahmet", "명소", 41.0086, 28.9802, "45-60분", 2, true, "도시의 역사 층위를 한 장면에서 보여준다.", "예배와 방문 동선이 바뀔 수 있어 직전 확인", "https://muze.gen.tr/muze-detay/ayasofya", images.hagia),
  place("blue", "Blue Mosque", "Sultanahmet", "명소", 41.0054, 28.9768, "30-45분", 2, true, "광장 동선 안에서 선택 가능한 모스크다.", "금요 예배와 기도 시간에는 관광 입장 제한", "https://www.ktb.gov.tr/EN-113799/blue-mosque.html", images.blue),
  place("cistern", "Basilica Cistern", "Sultanahmet", "명소", 41.0084, 28.9779, "45-60분", 1, true, "비와 추위를 피하면서 아이도 몰입하기 좋다.", "바닥이 어둡고 미끄러울 수 있음", "https://yerebatan.com/en/", images.cistern),
  place("topkapi", "Topkapı Palace", "Sultanahmet", "궁전", 41.0115, 28.9834, "2-2.5시간", 3, false, "이스탄불의 대표 궁전이지만 핵심 구역만 봐야 피로가 낮다.", "화요일 휴관, 넓은 야외 동선", "https://millisaraylar.gov.tr/Lokasyon/2/Topkapi-Palace", images.topkapi),
  place("gulhane", "Gülhane Park", "Sultanahmet", "공원", 41.0137, 28.9810, "30-60분", 1, false, "Topkapı 뒤 아이들이 뛰고 어른이 쉬기 좋다.", "비가 오면 생략", "https://visit.istanbul/gulhane-park", images.gulhane),
  place("dolmabahce", "Dolmabahçe Palace", "Beşiktaş", "궁전", 41.0392, 29.0005, "1.5-2시간", 2, true, "숙소 후보지에서 가깝고 한 곳만 보기 좋다.", "월요일 휴관, 입장 정책 직전 확인", "https://millisaraylar.gov.tr/Lokasyon/3/Dolmabahce-Palace", images.dolmabahce),
  place("modern", "Istanbul Modern", "Karaköy", "박물관", 41.0259, 28.9833, "1.5-2시간", 1, true, "비 오는 휴식일에 숙소와 가깝게 쓸 수 있다.", "전시 교체와 휴관일 확인", "https://www.istanbulmodern.org/en", images.modern),
  place("galata", "Galata Tower", "Karaköy", "전망", 41.0256, 28.9741, "외관 20분", 2, false, "Karaköy 산책의 시각적 기준점이다.", "언덕과 대기 때문에 탑 입장은 기본 일정에서 제외", "https://muze.gov.tr/muze-detay?SectionId=GLT01&DistId=GLT", images.galata),
  place("rahmi", "Rahmi M. Koç Museum", "Golden Horn", "박물관", 41.0427, 28.9486, "2-3시간", 2, true, "교통수단 전시가 많아 세 아이의 우천 대안으로 강하다.", "화요일 일정 후보이므로 운영시간 직전 확인", "https://rmk-museum.org.tr/istanbul/en", images.rahmi),
  place("grand", "Grand Bazaar", "Beyazıt", "시장", 41.0107, 28.9680, "1.5-2시간", 3, true, "가이드와 목적 상점만 보면 좋은 가족 쇼핑이 된다.", "혼잡, 흥정, 출구가 많아 자유 산책 금지", "https://grandbazaaristanbul.org/", images.bazaar),
  place("spice", "Spice Bazaar", "Eminönü", "시장", 41.0165, 28.9705, "45-60분", 2, true, "Pandeli 점심과 결합해 짧게 끝낼 수 있다.", "입구 혼잡과 유모차 주의", "https://visit.istanbul/spice-bazaar", images.spice),
  place("kuzguncuk", "Kuzguncuk", "Asian Side", "동네", 41.0370, 29.0290, "60-90분", 2, false, "작은 동네 단위로 이스탄불의 생활감을 본다.", "언덕을 피하고 해안 가까운 짧은 구간만", "https://visit.istanbul/kuzguncuk", images.kuzguncuk),
  place("beylerbeyi", "Beylerbeyi Palace", "Asian Side", "궁전", 41.0427, 29.0400, "60-90분", 2, true, "Kuzguncuk과 가까운 우천 대안이다.", "월요일 휴관, 관람 동선 직전 재확인", "https://millisaraylar.gov.tr/Lokasyon/4/Beylerbeyi-Palace", images.beylerbeyi),
  place("ortakoy", "Ortaköy waterfront", "Bosphorus", "산책", 41.0472, 29.0270, "45분", 2, false, "보트에서 본 뒤 짧은 간식 정차로 쓰기 좋다.", "주말 혼잡 시 하선하지 않음", "https://visit.istanbul/ortakoy", images.ortakoy),
  place("galataport", "Galataport promenade", "Karaköy", "산책", 41.0251, 28.9832, "45-90분", 1, false, "도착일과 휴식일에 화장실과 식사가 안정적이다.", "크루즈 입항일에는 혼잡", "https://galataport.com/en/", images.skyline),
  place("pandeli", "Pandeli", "Eminönü", "식당", 41.0164, 28.9706, "점심 90분", 1, true, "Spice Bazaar 위에서 이동을 늘리지 않고 전통적인 점심을 먹는다.", "9인과 어린이 좌석을 직접 예약 확인", "https://www.pandeli.com.tr/index.html"),
  place("hamdi", "Hamdi Restaurant Eminönü", "Eminönü", "식당", 41.0174, 28.9700, "점심 90분", 1, true, "큰 규모라 9인 가족 점심 후보로 운영 여유가 있다.", "전망석과 어린이 의자, 맵기 조절을 예약 시 확인", "https://hamdi.com.tr/"),
  place("namli", "Namlı Gurme Karaköy", "Karaköy", "식당", 41.0238, 28.9748, "아침 60분", 1, true, "예약 부담이 적은 캐주얼한 터키식 아침 후보다.", "주말 대기 가능, 9명이 한 테이블인지 전화 확인", "https://namligurme.com.tr/subelerimiz/"),
  place("hafiz", "Hafız Mustafa 1864 Karaköy", "Karaköy", "카페", 41.0218, 28.9750, "30-45분", 1, true, "아이들과 디저트를 짧게 먹고 쉬기 쉽다.", "당류와 견과 알레르기 확인", "https://www.hafizmustafa.com/"),
  place("ciya", "Çiya Sofrası", "Kadıköy", "식당", 40.9909, 29.0267, "점심 90분", 2, true, "아시아 쪽을 Kadıköy로 바꿀 때 쓸 수 있는 음식 중심 목적지다.", "Kuzguncuk 일정과 같은 날 억지로 결합하지 않음", "https://ciya.com.tr/"),
  place("gallada", "Gallada", "Karaköy", "식당", 41.0255, 28.9801, "저녁 2시간", 1, true, "Peninsula 투숙 시 이동 없는 특별 저녁이 된다.", "어린이 정책과 9인 좌석을 컨시어지에 확인", "https://www.peninsula.com/en/istanbul/hotel-fine-dining/gallada-turk-fatih-tutak"),
  place("karakoy-lokantasi", "Karaköy Lokantası", "Karaköy", "제외", 41.0227, 28.9780, "해당 없음", 1, true, "성인끼리라면 좋지만 이번 가족 구성에는 맞지 않는다.", "공식 정책상 저녁은 14세 초과, 예약 최대 6명이라 제외", "https://www.karakoylokantasi.com/en/reservation"),
  place("lokanta1741", "Lokanta 1741", "Old City", "제외", 41.0138, 28.9744, "해당 없음", 1, true, "건축과 음식은 매력적이지만 아이 동반 조건이 맞지 않는다.", "공식 사이트에 15세 미만 입장 불가 안내, 제외", "https://lokanta1741.com/tr/anasayfa/"),
  place("feriye", "Feriye", "Bosphorus", "조건부", 41.0463, 29.0278, "아침 90분", 1, true, "Bosphorus 전망의 주말 아침 후보가 될 수 있다.", "17시 이후 10세 이상 정책이라 저녁은 제외", "https://feriye.com/eat-drink/")
];

const placeDetails = {
  hagia: {
    reviewSignal: "역사성과 모자이크는 여전히 압도적이지만, 최근 리뷰는 상층 갤러리만 허용되는 동선, 공사 구조물, 긴 대기와 낮은 가격 만족도를 반복해서 지적합니다.",
    pros: ["비잔틴과 오스만 역사가 한 건물에 겹치는 상징성", "상층 모자이크와 건축 디테일"],
    cons: ["관광객은 지상 예배 공간에 들어갈 수 없고 공사 때문에 시야가 제한될 수 있음"],
    familyCaveat: "2027년 공사와 관광객 동선을 다시 확인합니다. 현 상태라면 유료 내부보다 외관, 광장, Blue Mosque를 먼저 봅니다.",
    verdict: "유료 내부는 조건부",
    reviewUrl: "https://www.tripadvisor.com/Attraction_Review-g293974-d294497-Reviews-Hagia_Sophia_Grand_Mosque-Istanbul.html",
    image: images.hagia
  },
  blue: {
    reviewSignal: "무료 입장, 푸른 타일과 넓은 예배 공간은 강점이지만 보안 대기, 기도시간 중단, 복장과 신발 절차가 반복적인 불편으로 언급됩니다.",
    pros: ["무료이며 공간의 크기와 타일을 아이도 바로 느낄 수 있음", "Hagia Sophia와 같은 광장에서 결합 가능"],
    cons: ["기도시간에는 입장이 멈추고 오전 중반부터 보안 줄이 생길 수 있음"],
    familyCaveat: "기도시간 사이 첫 오전 구간을 쓰고, 신발 가방과 머리 스카프를 준비합니다.",
    verdict: "짧게 추천",
    reviewUrl: "https://www.tripadvisor.com/Attraction_Review-g293974-d294495-Reviews-Blue_Mosque-Istanbul.html",
    image: images.blue
  },
  cistern: {
    reviewSignal: "신비로운 조명과 Medusa 기둥은 모든 연령대에서 반응이 좋지만 긴 줄, 높은 가격, 어두움과 미끄러운 통로 불만도 뚜렷합니다.",
    pros: ["비와 추위를 피하는 30분에서 60분 코스", "아이들이 지하 공간과 Medusa 머리에 쉽게 몰입"],
    cons: ["온라인 예매가 없으면 줄이 길고 통로가 어둡고 미끄러울 수 있음"],
    familyCaveat: "첫 시간대 표를 사고 미끄럽지 않은 신발을 신습니다. 유모차 반입과 어린이 요금은 직전에 확인합니다.",
    verdict: "가족 강력 추천",
    reviewUrl: "https://www.tripadvisor.com/Attraction_Review-g293974-d294555-Reviews-Basilica_Cistern-Istanbul.html",
    image: images.cistern
  },
  topkapi: {
    reviewSignal: "궁전과 Harem의 공간은 높은 평가를 받지만 넓은 부지, 줄, 자갈길 때문에 가족 관람 피로가 크다는 반응이 반복됩니다.",
    pros: ["오스만 궁정 생활을 공간으로 이해할 수 있음", "Harem, 정원, Bosphorus 전망"],
    cons: ["전체를 보면 반나절이 걸리고 입장 대기, 자갈과 계단이 많음"],
    familyCaveat: "Harem을 먼저 보고 보물실과 전망만 남기는 2시간 30분 상한을 지킵니다.",
    verdict: "핵심 구역만 추천",
    reviewUrl: "https://www.tripadvisor.com/Attraction_Review-g293974-d294547-Reviews-TopkapI_Palace-Istanbul.html",
    image: images.topkapi
  },
  gulhane: {
    reviewSignal: "무료, 그늘, 벤치, 놀이터와 화장실이 있어 구시가지에서 쉬기 좋다는 가족 리뷰가 반복됩니다.",
    pros: ["Topkapı 바로 옆이라 이동 추가가 없음", "벤치와 넓은 길, 놀이터가 있고 중간에 나오기 쉬움"],
    cons: ["주말에는 붐비고 비가 오면 길과 잔디 상태가 나빠질 수 있음"],
    familyCaveat: "3월에는 튤립 명소가 아니라 궁전 뒤 30분 쉬는 곳으로 씁니다.",
    verdict: "쉬는 곳으로 추천",
    reviewUrl: "https://www.tripadvisor.com/Attraction_Review-g293974-d548972-Reviews-Gulhane_Park-Istanbul.html",
    image: images.gulhane
  },
  dolmabahce: {
    reviewSignal: "내부 장식과 Bosphorus 정원은 호평받지만 긴 관람, 높은 입장료, 사진 금지와 운영 절차에 대한 불만이 있습니다.",
    pros: ["유럽식 오스만 궁전의 화려한 실내", "Bosphorus 옆 정원과 숙소 후보지에서 가까운 위치"],
    cons: ["전체 관람은 오래 걸리고 내부 사진 금지, 보안과 단체 대기가 있음"],
    familyCaveat: "Selamlık 핵심 구간 하나만 보고 2시간 안에 나옵니다.",
    verdict: "가까운 궁전으로 추천",
    reviewUrl: "https://www.tripadvisor.com/Attraction_Review-g293974-d294667-Reviews-Dolmabahce_Palace-Istanbul.html",
    image: images.dolmabahce
  },
  modern: {
    reviewSignal: "밝고 넓은 건물, 터키 현대미술과 옥상 전망은 호평받지만 입장료, 보안과 가방 보관은 번거롭다는 반응이 있습니다.",
    pros: ["비 오는 날 쓰기 좋은 넓은 실내", "Galataport와 바로 연결되고 옥상 전망이 좋음"],
    cons: ["현대미술에 관심이 없으면 가격 만족도가 낮고 가방 보관이 번거로움"],
    familyCaveat: "아이마다 작품 하나만 고르게 하고 60분에서 90분에 끝냅니다.",
    verdict: "휴식일 선택",
    reviewUrl: "https://www.tripadvisor.com/Attraction_Review-g293974-d555738-Reviews-Istanbul_Museum_of_Modern_Art-Istanbul.html",
    image: images.modern
  },
  galata: {
    reviewSignal: "360도 전망은 좋지만 높은 외국인 입장료, 표가 있어도 남는 줄, 가파른 언덕과 계단 불만이 자주 보입니다.",
    pros: ["도시를 대표하는 외관", "Karaköy 산책에서 방향을 잡기 좋은 기준점"],
    cons: ["언덕, 긴 대기, 높은 가격과 상부 혼잡"],
    familyCaveat: "아이 셋과 줄을 서서 올라가지 않고 외관만 20분 봅니다.",
    verdict: "외관만 추천",
    reviewUrl: "https://www.tripadvisor.com/Attraction_Review-g293974-d295194-Reviews-Galata_Tower-Istanbul.html",
    image: images.galata
  },
  rahmi: {
    reviewSignal: "자동차, 비행기, 기차와 선박 체험은 7세와 9세 가족 리뷰에서 큰 호응을 얻었고 비 오는 날에도 혼잡이 분산된다는 평가입니다.",
    pros: ["이번 아이 연령에 가장 잘 맞는 박물관", "교통수단과 과학 체험이 많고 가격 만족도가 높음"],
    cons: ["아이 취향을 따라가면 4시간이 넘고 현장 식사 선택이 제한적"],
    familyCaveat: "2시간에서 3시간 상한과 간식을 두고, 역사 명소에 지친 날 먼저 교체합니다.",
    verdict: "이스탄불 가족 명소 1순위",
    reviewUrl: "https://www.tripadvisor.com/Attraction_Review-g293974-d549828-Reviews-Rahmi_M_Koc_Museum-Istanbul.html",
    image: images.rahmi
  },
  grand: {
    reviewSignal: "역사적 규모와 색감은 인상적이지만 반복되는 관광상품, 판매 압박, 가격과 길 찾기 스트레스 불만이 많습니다.",
    pros: ["세계적인 역사 시장의 공간감", "공예와 상점의 높은 시각적 밀도"],
    cons: ["길을 잃기 쉽고 판매 압박, 흥정 피로와 화장실 부족"],
    familyCaveat: "9명이 흩어지지 않고 가이드와 정한 두 상점만 45분에서 60분 봅니다.",
    verdict: "짧게 조건부",
    reviewUrl: "https://www.tripadvisor.com/Attraction_Review-g293974-d294496-Reviews-Grand_Bazaar-Istanbul.html",
    image: images.bazaar
  },
  spice: {
    reviewSignal: "Grand Bazaar보다 작고 파악하기 쉬우며 색, 향과 시식이 가족에게 재미있다는 평가가 많지만 가격과 판매 방식 불만도 반복됩니다.",
    pros: ["짧은 시간에 색과 향을 경험", "Pandeli와 같은 건물이고 Grand Bazaar보다 동선 통제가 쉬움"],
    cons: ["주말 혼잡과 일부 매장의 과한 가격, 견과 알레르기 노출"],
    familyCaveat: "구경이 기본이며 시식 성분과 결제 전 단가, 총액을 보호자가 확인합니다.",
    verdict: "시장 일정 1순위",
    reviewUrl: "https://www.tripadvisor.com/Attraction_Review-g293974-d294546-Reviews-Misir_Carsisi-Istanbul.html",
    image: images.spice
  },
  kuzguncuk: {
    reviewSignal: "조용한 분위기, 목조주택과 작은 카페는 호평받지만 골목은 계속 오르내린다는 지적이 있습니다.",
    pros: ["관광지가 아닌 생활 동네 경험", "해안과 카페를 짧게 연결할 수 있음"],
    cons: ["언덕과 계단, 주말 카페 대기"],
    familyCaveat: "해안에서 İcadiye 거리 초입까지만 보고 높은 골목은 생략합니다.",
    verdict: "짧은 동네 산책 추천",
    reviewUrl: "https://www.tripadvisor.com/Attraction_Review-g293974-d15109936-Reviews-Kuzguncuk_Sahili-Istanbul.html",
    image: images.kuzguncuk
  },
  beylerbeyi: {
    reviewSignal: "Dolmabahçe보다 작고 한적한 대안으로 평가되지만 대중교통 접근과 부분 폐쇄가 변수입니다.",
    pros: ["짧은 궁전 관람과 Bosphorus 물가 정원", "Kuzguncuk과 가까운 실내 대안"],
    cons: ["Üsküdar에서 추가 이동, 내부 사진 제한과 정원 일부 폐쇄 가능성"],
    familyCaveat: "Kuzguncuk 날 비가 올 때만 붙이고 Dolmabahçe를 봤다면 중복 관람하지 않습니다.",
    verdict: "비 오는 날 조건부",
    reviewUrl: "https://www.tripadvisor.com/Attraction_Review-g293974-d295479-Reviews-Beylerbeyi_Palace-Istanbul.html",
    image: images.beylerbeyi
  },
  ortakoy: {
    reviewSignal: "모스크와 다리가 겹치는 전망, 간식과 해안 분위기는 좋지만 주말 혼잡, 관광지 가격과 3월 바람이 단점입니다.",
    pros: ["짧은 정차로 강한 사진 장면", "아이 간식이 많고 보트 일정과 연결 가능"],
    cons: ["주말 혼잡, 관광지 가격과 해안 바람"],
    familyCaveat: "광장이 붐비지 않을 때만 30분에서 45분 머물고 보트에서 충분히 봤다면 내리지 않습니다.",
    verdict: "날씨가 좋을 때만",
    reviewUrl: "https://www.tripadvisor.com/Attraction_Review-g293974-d295191-Reviews-Ortakoy-Istanbul.html",
    image: images.ortakoy
  },
  galataport: {
    reviewSignal: "깨끗한 해안 산책로, 식당, 카페와 편의시설은 가족에게 편하지만 이스탄불 고유의 경험보다는 고급 쇼핑몰에 가깝습니다.",
    pros: ["화장실과 식사 선택이 안정적", "평탄하고 유모차 이동이 쉬우며 Istanbul Modern과 연결"],
    cons: ["크루즈 입항일 혼잡과 역사적 장소로서 낮은 밀도"],
    familyCaveat: "관광지가 아니라 도착일과 쉬는 날의 편한 생활권으로 씁니다.",
    verdict: "도착일 생활권",
    reviewUrl: "https://www.tripadvisor.com/Attraction_Review-g293974-d23954384-Reviews-Galataport-Istanbul.html",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Galataport_from_Istanbul_Museum_of_Modern_Art_in_2024_5623.jpg/1280px-Galataport_from_Istanbul_Museum_of_Modern_Art_in_2024_5623.jpg",
    imageSource: "https://commons.wikimedia.org/wiki/File:Galataport_from_Istanbul_Museum_of_Modern_Art_in_2024_5623.jpg"
  },
  pandeli: {
    reviewSignal: "푸른 타일의 역사적 실내와 Hünkar Beğendi는 호평받지만 작은 양, 가격과 서비스 편차에 대한 불만도 있습니다.",
    pros: ["Spice Bazaar 안이라 이동 추가가 없음", "역사적인 실내와 전통 오스만 음식"],
    cons: ["입구 계단, 양과 가격 평가가 엇갈리고 혼잡하면 합석 가능"],
    familyCaveat: "9인 한 테이블, 유모차, 어린이용 단순 메뉴를 전화로 확인합니다.",
    verdict: "예약 회신이 오면 추천",
    reviewUrl: "https://www.tripadvisor.com/Restaurant_Review-g293974-d940372-Reviews-Pandeli-Istanbul.html",
    image: "https://www.pandeli.com.tr/assets/images/about-thumb-01.jpg",
    imageSource: "https://www.pandeli.com.tr/index.html"
  },
  hamdi: {
    reviewSignal: "Eminönü와 Bosphorus 전망, kebab은 장점이지만 가격, 급한 서비스와 청구 관련 불만도 반복됩니다.",
    pros: ["큰 매장이라 9인 그룹을 받기 쉬움", "전망, kebab과 highchair 정보"],
    cons: ["창가석 보장이 어렵고 가격, 서비스와 계산서 불만"],
    familyCaveat: "창가 9인석, highchair, 맵기 조절을 예약서에 쓰고 계산서를 한 명이 확인합니다.",
    verdict: "Pandeli가 안 될 때",
    reviewUrl: "https://www.tripadvisor.com/Restaurant_Review-g293974-d808629-Reviews-Hamdi_Restaurant-Istanbul.html",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Galata_K%C3%B6pr%C3%BCs%C3%BC_-%C4%B0stanbul_%28Hamdi_restaurant_balkonundan_%29_-_panoramio.jpg/1280px-Galata_K%C3%B6pr%C3%BCs%C3%BC_-%C4%B0stanbul_%28Hamdi_restaurant_balkonundan_%29_-_panoramio.jpg",
    imageSource: "https://commons.wikimedia.org/wiki/File:Galata_K%C3%B6pr%C3%BCs%C3%BC_-%C4%B0stanbul_(Hamdi_restaurant_balkonundan_)_-_panoramio.jpg"
  },
  namli: {
    reviewSignal: "진열 식재료를 고르는 터키식 아침과 이른 영업은 호평받지만 처음에는 주문 방식이 혼란스럽고 가격이 올랐다는 평가가 있습니다.",
    pros: ["오전 7시 영업과 다양한 식단 선택", "가족마다 원하는 음식을 고르기 쉬움"],
    cons: ["카운터 주문이 낯설고 주말 대기, 아침치고 높은 가격"],
    familyCaveat: "성인 한 명이 전체 주문을 맡고 9인 테이블부터 확보합니다.",
    verdict: "가벼운 아침 추천",
    reviewUrl: "https://www.tripadvisor.com/Restaurant_Review-g293974-d1028246-Reviews-NamlI_Gurme-Istanbul.html",
    image: "https://www.meyhankoli.com/img/places/source_seo/namli-gurme-5.jpg",
    imageSource: "https://www.meyhankoli.com/restoran/istanbul-beyoglu-namli-gurme-1026"
  },
  hafiz: {
    reviewSignal: "Baklava, künefe와 sütlaç 선택 폭, 아이 가족에게 친절한 응대가 강점이지만 매장별 혼잡과 계단은 변수입니다.",
    pros: ["아이들이 바로 이해하는 디저트 목적지", "여러 종류를 나눠 맛보기 좋음"],
    cons: ["혼잡, 일부 지점의 계단, 매우 단 디저트와 견과류"],
    familyCaveat: "Galataport 지점으로 확정하고 견과 알레르기와 9인 좌석을 확인합니다.",
    verdict: "지점 확정 뒤 추천",
    reviewUrl: "https://www.tripadvisor.com/Restaurant_Review-g293974-d23731562-Reviews-HafIz_Mustafa_1864_Galataport-Istanbul.html",
    image: "https://static.wixstatic.com/media/99649a_1f4476132c964d728160b399ed40134a~mv2.jpg/v1/fill/w_1920%2Ch_1200%2Cal_c%2Cq_90%2Cenc_avif%2Cquality_auto/99649a_1f4476132c964d728160b399ed40134a~mv2.jpg",
    imageSource: "https://www.hafizmustafa.com/"
  },
  ciya: {
    reviewSignal: "지역별 Anatolian 음식과 반 접시로 다양하게 먹는 방식은 강점이지만 가격 설명, 계산서, 서비스와 청결 불만도 적지 않습니다.",
    pros: ["일반적인 kebab 외의 지역 요리", "반 접시로 여러 음식과 채식 선택을 맛볼 수 있음"],
    cons: ["중량과 가격이 직관적이지 않고 Kuzguncuk과 같은 날 붙이기에는 멂"],
    familyCaveat: "Kadıköy로 일정을 바꿀 때만 메뉴와 단가를 먼저 받고 반 접시 네 개에서 다섯 개만 주문합니다.",
    verdict: "Kadıköy로 바꿀 때만",
    reviewUrl: "https://www.tripadvisor.com/Restaurant_Review-g293974-d776065-Reviews-Ciya_Sofrasi-Istanbul.html",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/02/5f/9c/41/lunch-at-ciya-sofrasi.jpg?h=500&s=1&w=900",
    imageSource: "https://www.ciya.com.tr/"
  },
  gallada: {
    reviewSignal: "Bosphorus 전망, Turk-Asian 음식과 분위기는 호평받지만 높은 가격, 음악, 공유 접시와 서비스 편차가 단점입니다.",
    pros: ["Peninsula 투숙 시 이동이 없음", "특별한 저녁의 공간과 전망"],
    cons: ["매우 높은 가격과 늦은 음악, 공유 접시와 서비스 편차"],
    familyCaveat: "어린이 정책, 9인석, 음악 시작 시간과 맵지 않은 메뉴를 서면 확인합니다.",
    verdict: "Peninsula 투숙 때 조건부",
    reviewUrl: "https://www.tripadvisor.com/Restaurant_Review-g293974-d26432353-Reviews-GALLADA_by_Fatih_Tutak-Istanbul.html",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/b7/26/dc/gallada-and-topside-bar.jpg?h=500&s=1&w=900",
    imageSource: "https://www.peninsula.com/en/istanbul/hotel-fine-dining/gallada"
  },
  "karakoy-lokantasi": {
    reviewSignal: "Mezze와 실내 디자인은 좋은 평가를 받지만 저녁의 소음, 가격과 혼잡 불만이 있고 공식 가족 정책이 이번 구성과 맞지 않습니다.",
    pros: ["잘 만든 mezze와 해산물", "Karaköy의 세련된 실내"],
    cons: ["저녁 그룹 예약 최대 6명이며 14세 초과 어린이만 가능"],
    familyCaveat: "이번 가족에는 정책상 맞지 않으므로 리뷰가 좋아도 되살리지 않습니다.",
    verdict: "제외",
    reviewUrl: "https://www.tripadvisor.com/Restaurant_Review-g293974-d1198609-Reviews-Karakoy_Lokantasi-Istanbul.html",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/b9/91/30/musterisiz.jpg?h=-1&s=1&w=900",
    imageSource: "https://www.karakoylokantasi.com/en/reservation"
  },
  lokanta1741: {
    reviewSignal: "역사적 hamam 공간, 현대식 터키 음식과 서비스는 높은 평가를 받지만 작은 양과 높은 가격이 단점입니다.",
    pros: ["독특한 역사 건축", "정교한 현대 터키 음식과 서비스"],
    cons: ["공식 정책상 15세 미만 입장 불가이며 긴 코스와 높은 가격"],
    familyCaveat: "만 9세, 7세, 6세가 있어 명백히 제외합니다.",
    verdict: "제외",
    reviewUrl: "https://www.tripadvisor.com/Restaurant_Review-g293974-d17664604-Reviews-Lokanta_1741-Istanbul.html",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/1c/55/81/lokanta-1741-turkish.jpg?h=500&s=1&w=900",
    imageSource: "https://lokanta1741.com/tr/anasayfa/"
  },
  feriye: {
    reviewSignal: "Bosphorus 전망과 음식, 아이 식이 요구 대응은 긍정적이지만 예약 연락, 느린 서비스와 가격 불만도 있습니다.",
    pros: ["Ortaköy의 강한 전망", "Highchair 정보와 주말 아침 운영"],
    cons: ["17시 이후 만 10세 이상만 가능하고 예약 연락, 서비스 속도 편차"],
    familyCaveat: "세 아이 모두 저녁 정책에 맞지 않으므로 주말 10시 또는 12시 아침만 전화 예약 뒤 씁니다.",
    verdict: "주말 아침만 조건부",
    reviewUrl: "https://www.tripadvisor.com/Restaurant_Review-g293974-d806286-Reviews-Feriye-Istanbul.html",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/9e/37/c2/ristorante.jpg?h=-1&s=1&w=900",
    imageSource: "https://feriye.com/eat-drink/"
  }
};

const placeAssetExtensions = {
  hafiz: "avif"
};

for (const item of places) {
  const details = placeDetails[item.id];
  const originalImage = item.image || images.skyline;
  Object.assign(item, {
    remoteImage: details.image,
    imageFallback: details.image || originalImage,
    image: `./assets/places/${item.id}.${placeAssetExtensions[item.id] || "jpg"}`,
    photoSource: details.imageSource || (String(details.image).includes("wikimedia") ? "https://commons.wikimedia.org/" : item.official),
    photoLabel: `${item.name} 실제 장소 사진`,
    bestFor: details.verdict,
    skipIf: details.cons[0],
    kids: details.familyCaveat,
    groupFit: item.category === "식당" || item.category === "카페" || item.category === "조건부" ? "9인 한 테이블과 어린이 의자, 연령 정책을 예약 전에 확인합니다." : "아이 셋이 함께 움직이므로 관람 상한과 중간 이탈 지점을 먼저 정합니다.",
    reservation: item.warning,
    reviews: {
      summary: details.reviewSignal,
      liked: details.pros,
      disliked: details.cons,
      familyTip: details.familyCaveat,
      sources: [{ platform: "Tripadvisor 최근 여행자 리뷰", url: details.reviewUrl, checkedAt: CHECKED_AT }]
    }
  });
}

export const climate = {
  source: "Turkish State Meteorological Service",
  summary: "3월의 장기 평균은 평균 8.5°C, 평균 최고 12.4°C 수준이다.",
  packing: ["방수 후드 재킷", "겹쳐 입는 얇은 보온층", "미끄럽지 않은 방수 신발", "보트용 장갑과 목도리", "어린이 여벌 양말"],
  note: "2027년 일별 예보가 아니라 공식 장기 통계다. 실제 예보는 출발 10일 전부터 앱에서 갱신한다.",
  official: "https://www.mgm.gov.tr/veridegerlendirme/il-ve-ilceler-istatistik.aspx?m=ISTANBUL"
};

export const sources = [
  ["Original family trip planning deck", trip.sourceDeck],
  ["CVK 4 Bedroom Residence", lodgingOptions[0].official],
  ["The Peninsula family package", lodgingOptions[1].official],
  ["The Peninsula transportation", "https://www.peninsula.com/en/istanbul/transportation-service-reservation"],
  ["Somerset Maslak", lodgingOptions[3].official],
  ["Türkiye tourism rental permit guidance", "https://vatandas.ktb.gov.tr/turizm"],
  ["Airbnb Türkiye hosting rules", "https://www.airbnb.com/help/article/2455"],
  ["Turkish Airlines LAX to Istanbul", "https://www.turkishairlines.com/en-us/flights-from-los-angeles-to-istanbul"],
  ["Turkish Airlines Seoul to Istanbul", "https://www.turkishairlines.com/en/flights-from-seoul-to-istanbul"],
  ["Official Istanbul climate statistics", climate.official],
  ["2027 Türkiye religious calendar", "https://vakithesaplama.diyanet.gov.tr/icerik.php?icerik=154"],
  ["Topkapı Palace", "https://millisaraylar.gov.tr/Lokasyon/2/Topkapi-Palace"],
  ["Dolmabahçe Palace", "https://millisaraylar.gov.tr/Lokasyon/3/Dolmabahce-Palace"],
  ["Basilica Cistern", "https://yerebatan.com/en/"],
  ["Karaköy Lokantası reservation policy", "https://www.karakoylokantasi.com/en/reservation"],
  ["Feriye dining policy", "https://feriye.com/eat-drink/"],
  ["Lokanta 1741 age policy", "https://lokanta1741.com/tr/anasayfa/"],
  ["Pandeli", "https://www.pandeli.com.tr/index.html"],
  ["Wikimedia Commons images", "https://commons.wikimedia.org/"]
].map(([title, url]) => ({ title, url, checkedAt: CHECKED_AT }));

export const heroImage = images.skyline;
