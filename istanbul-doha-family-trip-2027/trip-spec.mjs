const visitQatar = "https://visitqatar.com/intl-en/things-to-do";
const mapUrl = (name) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} Doha`)}`;
const P = (id, name, zone, category, lat, lng, why, bestFor, skipIf, imageQuery, official = visitQatar, extra = {}) => ({ id, name, zone, category, lat, lng, why, bestFor, skipIf, imageQuery, official, ...extra });
const H = (id, name, type, location, fit, lat, lng, official, verdict, imageQuery, extra = {}) => ({ id, name, type, location, fit, lat, lng, official, verdict, imageQuery, ...extra });
const D = (id, name, type, zone, cuisine, lat, lng, imageQuery, officialUrl = null, extra = {}) => ({ id, name, type, zone, cuisine, lat, lng, imageQuery, officialUrl: officialUrl || mapUrl(name), ...extra });
const stopover = "https://www.qatarairways.com/en-us/offers/qatar-stopover.html";

export const spec = {
  checkedAt: "2026-09-04",
  slug: "istanbul-doha",
  title: "ISTANBUL + DOHA TOGETHER",
  subtitle: "이스탄불 7박 뒤 도하 3박, LAX 직항 날짜가 맞을 때만 성립",
  cityKo: "도하",
  cityEn: "Doha",
  arrivalDate: "2027-03-28",
  checkoutDate: "2027-03-31",
  mapZoom: 12,
  weatherCoordinates: { latitude: "25.2854", longitude: "51.5310", timezone: "Asia/Qatar" },
  sourceDeck: "https://visitqatar.com/intl-en/",
  coreText: {
    weatherBefore: "실시간 예보는 도하 도착 16일 전부터 확인합니다.", weatherAfter: "도하 체류 기간이 지났습니다.",
    budget: "표시 금액은 이스탄불 7박 뒤 도하 3박을 붙일 때의 현지 계획값입니다. 3월 31일 DOH-LAX 직항이 없으면 이 안은 가격과 무관하게 탈락합니다.",
    rain: "비나 모래바람이면 National Museum of Qatar, Museum of Islamic Art 또는 OliOli Doha 가운데 한 곳만 봅니다.",
    museum: "National Museum of Qatar를 첫 선택으로 두고 Museum of Islamic Art는 다음 날 짧게 봅니다. 대형 박물관 두 곳을 같은 오전에 넣지 않습니다.",
    specialTerms: ["사막", "듄", "desert", "inland sea"], specialAnswer: "Inland Sea는 3박의 필수 일정이 아닙니다. 만 6세 아이용 카시트, 듄배싱 제외 옵션, 보험과 총 6시간 이상 차량 부담을 합의할 때만 선택합니다.",
    transport: "IST에서 DOH로 아홉 명이 같은 직항편을 타고, DOH에서 ICN과 LAX 직항으로 갈라지는 구조입니다. 단, 2027년 3월 31일 DOH-LAX 직항이 실제 판매되지 않으면 즉시 두바이로 돌아갑니다.",
    uid: "doha-stop", prodid: "Istanbul Doha Family Trip 2027"
  },
  principles: [
    "도하는 노선 존재만으로 통과시키지 않습니다. 2027년 3월 31일 수요일 DOH-LAX 직항이 판매될 때만 최종 후보입니다.",
    "이스탄불 7박 뒤 3월 28일 아홉 명이 같은 IST-DOH 직항으로 이동합니다.",
    "3박은 Museum, Souq Waqif, Katara와 아이 체험에 집중하고 Inland Sea는 선택으로 둡니다.",
    "Qatar Airways 스톱오버 특가는 12시간부터 96시간 환승과 적격 항공권, 재고 조건을 모두 만족해야 합니다."
  ],
  familyGroups: [
    { id: "shared-ist-doh", label: "공동 이동", origin: "IST", members: "성인 6, 어린이 3", route: "이스탄불 IST → 도하 DOH", target: "3월 28일 같은 직항, 도착일은 Souq Waqif 산책만", carriers: "Qatar Airways와 Turkish Airlines 현재 정기 직항", status: "대표 비행 약 4시간 5분부터 4시간 20분, 2027년 9석 운임은 미확정" },
    { id: "split-doh-home", label: "조건부 귀국 분리", origin: "DOH", members: "ICN팀 5명, LAX팀 4명", route: "DOH → ICN / DOH → LAX", target: "3월 31일 두 직항이 모두 있을 때만 실행", carriers: "Qatar Airways 두 노선은 현재 운항하지만 LAX는 비매일 패턴", status: "현재 LAX 직항은 화, 목, 토, 일 패턴으로 확인되어 수요일 3월 31일은 그대로라면 불가. 2027년 판매편이 최종 게이트" }
  ],
  decisionChecklist: [
    { id: "lax", label: "DOH-LAX 날짜 게이트", detail: "2027년 3월 31일 QR739 계열 또는 다른 DOH-LAX 직항이 판매될 때만 진행합니다.", href: "#family" },
    { id: "ticket", label: "스톱오버 적격", detail: "QR 또는 승인 공동운항, 12시간부터 96시간 환승, Discover Qatar 재고를 확인합니다.", href: "#stay" },
    { id: "rooms", label: "4실과 어린이 가격", detail: "공식 US$49부터 요금은 2인 1실 기준이므로 아이 3명과 객실 4실 총액을 다시 받습니다.", href: "#budget" },
    { id: "fallback", label: "두바이 즉시 복귀", detail: "LAX 직항이 목표일에 없으면 날짜를 억지로 바꾸지 않고 두바이를 선택합니다.", href: "#tools" }
  ],
  hotels: [
    H("best_western", "Best Western Plus Doha", "Standard 스톱오버형", "Old Doha", 82, 25.2870, 51.5440, "https://www.bestwestern.com/", "공식 스톱오버 Standard 예시 중 Corniche와 박물관 동선이 좋은 실용 후보입니다.", "Best Western Plus Doha"),
    H("centro_capital", "Centro Capital Doha", "Standard 스톱오버형", "Bin Mahmoud", 80, 25.2790, 51.5050, "https://www.rotana.com/centrohotels/qatar/doha/centrocapitaldoha", "단순한 객실 운영과 도심 이동을 우선하는 비용형 후보입니다.", "Centro Capital Doha"),
    H("holiday_inn", "Holiday Inn Doha - The Business Park", "Standard 스톱오버형", "Najma", 85, 25.2736, 51.5494, "https://www.ihg.com/holidayinn/hotels/us/en/doha/dohbp/hoteldetail", "공항과 Souq Waqif 사이의 짧은 차량 동선, 체인 운영이 강점입니다.", "Holiday Inn Doha Business Park"),
    H("royal_riviera", "The Royal Riviera Hotel Doha", "Standard 스톱오버형", "Corniche", 78, 25.2880, 51.5436, "https://royalrivierahotel.com/", "박물관과 Corniche 접근은 좋지만 객실 크기와 4실 인접성을 확인해야 합니다.", "Royal Riviera Hotel Doha"),
    H("abesq", "Abesq Doha Hotel & Residences", "Premium 스톱오버형", "Musheireb", 92, 25.2782, 51.5108, "https://www.ihg.com/vignettecollection/hotels/us/en/doha/dohab/hoteldetail", "레지던스형 객실과 도심 위치의 균형이 가장 좋은 도하 1순위입니다.", "Abesq Doha Hotel", { good: ["레지던스 선택 가능", "Souq와 Msheireb 접근", "공식 Premium 예시"], cautions: ["스톱오버 배정 객실 유형 미확정", "9명 4실의 연결 배정 미확정"] }),
    H("hyatt_oryx", "Hyatt Regency Oryx Doha", "Premium 스톱오버형", "Old Airport", 90, 25.2608, 51.5520, "https://www.hyatt.com/hyatt-regency/en-US/dohor-hyatt-regency-oryx-doha", "공항 접근과 대형 호텔 운영 안정성을 우선할 때 강합니다.", "Hyatt Regency Oryx Doha"),
    H("radisson_blu", "Radisson Blu Hotel Doha", "Premium 스톱오버형", "Rawdat Al Khail", 84, 25.2715, 51.5135, "https://www.radissonhotels.com/en-us/hotels/radisson-blu-doha", "객실 재고와 식당 선택 폭은 좋지만 해변 일정은 차량 이동입니다.", "Radisson Blu Doha"),
    H("steigenberger", "Steigenberger Hotel Doha", "Premium 스톱오버형", "Najma", 87, 25.2687, 51.5511, "https://hrewards.com/en/steigenberger-hotel-doha", "공항, National Museum과 Souq를 짧게 연결하는 신형 도심 후보입니다.", "Steigenberger Hotel Doha"),
    H("city_centre_rotana", "City Centre Rotana Doha", "Premium Beach 스톱오버형", "West Bay", 88, 25.3243, 51.5300, "https://www.rotana.com/rotanahotelandresorts/qatar/doha/citycentrerotanadoha", "West Bay와 Mall 접근, 넓은 객실 재고가 가족 운영에 유리합니다.", "City Centre Rotana Doha"),
    H("dusit", "Dusit Doha Hotel", "Premium Beach 스톱오버형", "West Bay", 86, 25.3270, 51.5252, "https://www.dusit.com/dusitdoha-hotel/", "West Bay 가족 숙박과 Katara 방향 이동의 균형 후보입니다.", "Dusit Doha Hotel"),
    H("intercon_city", "InterContinental Doha The City", "Premium Beach 스톱오버형", "West Bay", 91, 25.3262, 51.5261, "https://www.ihg.com/intercontinental/hotels/us/en/doha/dohwb/hoteldetail", "레지던스, 도심 접근과 체인 운영을 함께 얻는 강한 후보입니다.", "InterContinental Doha The City"),
    H("pullman", "Pullman Doha West Bay", "Premium Beach 스톱오버형", "West Bay", 89, 25.3247, 51.5290, "https://all.accor.com/hotel/B4J4/index.en.shtml", "가족 객실과 West Bay 중심성을 우선하는 현대적 운영형 후보입니다.", "Pullman Doha West Bay")
  ],
  hotelPrices: Object.fromEntries([
    ["best_western", 49, "Standard"], ["centro_capital", 49, "Standard"], ["holiday_inn", 49, "Standard"], ["royal_riviera", 49, "Standard"],
    ["abesq", 77, "Premium"], ["hyatt_oryx", 77, "Premium"], ["radisson_blu", 77, "Premium"], ["steigenberger", 77, "Premium"],
    ["city_centre_rotana", 98, "Premium Beach"], ["dusit", 98, "Premium Beach"], ["intercon_city", 98, "Premium Beach"], ["pullman", 98, "Premium Beach"]
  ].map(([id, price, category]) => [id, { provider: "Qatar Airways Stopover", referenceStay: "2026/27 공식 3박 패키지 시작가, 호텔 예시와 재고 조건", nightlyDisplay: `US$${price}/인, 3박`, projectedDisplay: `US$${price * 9}, 9인 단순 환산`, unitLabel: "성인 1인, 3박, 2인 1실", stayLabel: "9인 단순 환산, 어린이와 4실 조건 미반영", currency: "USD", totalIncludesTaxes: null, sourceUrl: stopover, category }])),
  tripComCostSummary: { provider: "Qatar Airways Stopover + Qatar Tourism", capturedAt: "2026-09-04", requestedStay: "2027-03-28부터 31, 3박", requestedOccupancy: "성인 6명, 어린이 3명, 객실 4실", exactQuoteStatus: "공식 패키지는 Standard US$49, Premium US$77, Premium Beach US$98부터이며 모두 1인 3박, 2인 1실 기준입니다.", directQuoteStatus: "아이 3명, 객실 4실, 목표 항공권과 호텔 재고를 반영한 실제 총액은 아직 없습니다.", benchmarkLabel: "Doha 2025년 3월 ADR", benchmarkNightly: "QAR369", benchmarkTotal: "QAR4,428, 객실 4실 × 3박", benchmarkFormula: "Qatar Tourism 2025년 3월 ADR QAR369 × 12실박", sourceUrl: "https://www.qatartourism.com/content/dam/qatar-tourism/qatar-tourism-reports/2025/2025-Annual-Performance-Report-EN.pdf", fx: { label: "2026-09-04 참고", currencyCode: "QAR", toKrw: 381.0, sourceUrl: "https://www.xe.com/currencyconverter/convert/?Amount=1&From=QAR&To=KRW", note: "2027년 카드 환율과 실제 패키지 총액이 아닙니다." } },
  residences: [
    { id: "residence_abesq", name: "Abesq Doha Residence", neighborhood: "Musheireb", capacity: 9, bedrooms: 4, beds: 6, baths: 4, fit: 93, reason: "호텔 서비스와 레지던스 생활공간을 함께 검토할 1순위입니다.", url: "https://www.ihg.com/vignettecollection/hotels/us/en/doha/dohab/hoteldetail", imageQuery: "Abesq Doha Hotel" },
    { id: "residence_intercon", name: "InterContinental Doha The City Residence", neighborhood: "West Bay", capacity: 9, bedrooms: 4, beds: 6, baths: 4, fit: 90, reason: "West Bay에서 여러 세대가 한 건물에 머무는 체인 레지던스 후보입니다.", url: "https://www.ihg.com/intercontinental/hotels/us/en/doha/dohwb/hoteldetail", imageQuery: "InterContinental Doha The City" },
    { id: "residence_kempinski", name: "Kempinski Residences & Suites Doha", neighborhood: "West Bay", capacity: 9, bedrooms: 4, beds: 6, baths: 4, fit: 86, reason: "다침실 레지던스와 실내 시설을 우선하는 장기 숙박형 후보입니다.", url: "https://www.kempinski.com/en/kempinski-residences-suites-doha", imageQuery: "Kempinski Residences Doha" },
    { id: "residence_fraser", name: "Fraser Suites Doha", neighborhood: "Corniche", capacity: 9, bedrooms: 4, beds: 6, baths: 4, fit: 84, reason: "National Museum, MIA와 공항 동선을 짧게 만드는 레지던스형 후보입니다.", url: "https://www.frasershospitality.com/en/qatar/doha/fraser-suites-doha/", imageQuery: "Fraser Suites Doha" },
    { id: "residence_centara", name: "Centara West Bay Residence", neighborhood: "West Bay", capacity: 9, bedrooms: 4, beds: 6, baths: 4, fit: 82, reason: "가족 아파트형 구조와 West Bay 접근을 함께 봅니다.", url: "https://www.centarahotelsresorts.com/centara/cqwb", imageQuery: "Centara West Bay Doha" },
    { id: "residence_marriott", name: "Marriott Executive Apartments City Center Doha", neighborhood: "West Bay", capacity: 9, bedrooms: 4, beds: 6, baths: 4, fit: 80, reason: "체인 운영과 대형몰 접근을 우선하는 탐색 후보입니다.", url: "https://www.marriott.com/", imageQuery: "Marriott Executive Apartments Doha" }
  ],
  places: [
    P("national_museum", "National Museum of Qatar", "Old Doha", "박물관", 25.2867, 51.5493, "카타르의 자연, 유목, 진주와 국가 형성을 한 흐름으로 봅니다.", "첫 온전한 날의 핵심", "대형 박물관을 이미 충분히 봤다면 90분으로", "National Museum of Qatar", "https://nmoq.org.qa/en/", { rain: true, energy: 2 }),
    P("mia", "Museum of Islamic Art", "Corniche", "박물관", 25.2954, 51.5393, "이스탄불에서 이어지는 이슬람 미술의 범위를 압축해 봅니다.", "부모 중심 문화 한 곳", "아이들이 박물관에 지쳤다면 MIA Park만", "Museum of Islamic Art Doha", "https://mia.org.qa/en/", { rain: true, energy: 2 }),
    P("mia_park", "MIA Park", "Corniche", "공원", 25.2967, 51.5430, "박물관 전후에 바다와 스카이라인을 쉬며 봅니다.", "저강도 가족 산책", "한낮 햇빛이나 강풍이면", "MIA Park Doha", "https://mia.org.qa/en/visit/mia-park/", { energy: 1 }),
    P("souq_waqif", "Souq Waqif", "Msheireb", "시장", 25.2866, 51.5332, "짧은 저녁 산책, 식사와 생활문화를 한 권역에서 봅니다.", "세대 공통 저녁", "주말 혼잡과 호객이 피곤하면", "Souq Waqif Doha", "https://visitqatar.com/intl-en/things-to-do/popular-attractions/souq-waqif", { energy: 1 }),
    P("falcon_souq", "Falcon Souq", "Msheireb", "시장", 25.2878, 51.5321, "매사냥 문화의 현재를 짧게 관찰합니다.", "아이들의 구체적 질문", "동물 전시에 불편함이 있으면", "Falcon Souq Doha", visitQatar, { energy: 1 }),
    P("msheireb_museums", "Msheireb Museums", "Msheireb", "박물관", 25.2864, 51.5287, "석유 이전과 현대 도시 변화의 집들을 봅니다.", "도시사와 그늘진 이동", "휴관일 또는 National Museum으로 충분하면", "Msheireb Museums Doha", "https://msheirebmuseums.com/", { rain: true, energy: 1 }),
    P("msheireb_downtown", "Msheireb Downtown", "Msheireb", "산책", 25.2850, 51.5266, "트램, 그늘과 식사를 묶어 이동 피로를 줄입니다.", "유모차와 저녁 산책", "쇼핑 지구에 관심이 없다면", "Msheireb Downtown Doha", "https://www.msheireb.com/", { energy: 1 }),
    P("corniche", "Doha Corniche", "Corniche", "산책", 25.3070, 51.5260, "도하의 만과 스카이라인을 가장 단순하게 읽습니다.", "해질녘 가족 산책", "강풍, 높은 UV 또는 공사 구간이면", "Doha Corniche skyline", visitQatar, { energy: 1 }),
    P("dhow_harbour", "Dhow Harbour", "Corniche", "항구", 25.2930, 51.5390, "전통 목선과 현대 스카이라인을 한 프레임에 봅니다.", "가족 사진 20분", "호객이나 바람이 강하면", "Dhow harbour Doha", visitQatar, { energy: 1 }),
    P("mina_district", "Mina District", "Old Doha Port", "산책", 25.2994, 51.5554, "항구, 색채와 카페를 낮은 에너지로 연결합니다.", "도착일 저녁", "크루즈 입항 혼잡이 심하면", "Mina District Doha", "https://visitqatar.com/intl-en/things-to-do/popular-attractions/mina-district", { energy: 1 }),
    P("sports_museum", "3-2-1 Qatar Olympic and Sports Museum", "Aspire", "박물관", 25.2647, 51.4480, "스포츠 역사와 인터랙티브 전시가 아이 반응을 끌어냅니다.", "비와 더위의 아이 선택", "경기일 교통이나 서부 이동이 길면", "Qatar Olympic Sports Museum", "https://321qosm.org.qa/en/", { rain: true, energy: 2 }),
    P("mathaf", "Mathaf: Arab Museum of Modern Art", "Education City", "예술", 25.3101, 51.4195, "아랍 현대미술을 집중해서 보는 조용한 선택입니다.", "부모와 큰아이", "작은 아이가 전시에 지쳤다면", "Mathaf Doha", "https://mathaf.org.qa/en/", { rain: true, energy: 1 }),
    P("qnl", "Qatar National Library", "Education City", "건축", 25.3168, 51.4395, "건축과 어린이 도서 공간을 무료에 가깝게 경험합니다.", "조용한 실내 회복", "프로그램과 방문자 입장이 제한되면", "Qatar National Library", "https://www.qnl.qa/en", { rain: true, energy: 1 }),
    P("education_mosque", "Education City Mosque", "Education City", "건축", 25.3145, 51.4384, "현대 이슬람 건축을 외부와 허용 구역에서 봅니다.", "이스탄불과 건축 비교", "예배시간, 복장 또는 방문 제한이 있으면", "Education City Mosque Doha", "https://www.minareteinstitute.com/", { energy: 1 }),
    P("oxygen_park", "Oxygen Park", "Education City", "공원", 25.3151, 51.4345, "아이들이 달리고 가족이 쉬는 넓은 녹지입니다.", "박물관 뒤 회복", "한낮 열기와 바람이면", "Oxygen Park Doha", visitQatar, { energy: 1 }),
    P("katara", "Katara Cultural Village", "Katara", "문화", 25.3590, 51.5260, "극장, 갤러리, 모스크와 해변을 한 권역에서 봅니다.", "온 가족 반나절", "행사 혼잡 또는 긴 보행이 힘들면", "Katara Cultural Village Doha", "https://visitqatar.com/intl-en/things-to-do/art-culture/katara-cultural-village", { energy: 2 }),
    P("katara_mosque", "Katara Mosque", "Katara", "건축", 25.3601, 51.5255, "타일과 미나레트를 짧게 보는 건축 장면입니다.", "가족 사진과 문화", "예배시간 또는 방문 제한이면", "Katara Mosque Doha", visitQatar, { energy: 1 }),
    P("katara_hills", "Katara Hills", "Katara", "공원", 25.3622, 51.5230, "해질녘 전망과 아이들의 잔디 시간을 줍니다.", "저녁 회복", "더위와 오르막이 부담이면", "Katara Hills Doha", visitQatar, { energy: 2 }),
    P("olioli", "OliOli Children's Museum Doha", "Katara", "어린이", 25.3580, 51.5290, "세 아이가 직접 만들고 움직이는 실내 핵심입니다.", "아이 중심 2시간", "사전 세션을 잡지 못하면", "OliOli Doha children museum", "https://visitqatar.com/intl-en/things-to-do/art-culture/museums/olioli-childrens-museum", { rain: true, energy: 2 }),
    P("the_pearl", "The Pearl-Qatar", "The Pearl", "산책", 25.3680, 51.5510, "마리나, 식사와 짧은 산책을 한 권역에서 해결합니다.", "편한 저녁", "교통 혼잡과 상업적 분위기가 싫다면", "The Pearl Qatar marina", visitQatar, { energy: 1 }),
    P("qanat", "Qanat Quartier", "The Pearl", "산책", 25.3727, 51.5477, "운하와 보행교가 아이들과 짧은 저녁 산책에 맞습니다.", "사진과 젤라토", "베네치아식 테마에 관심이 없다면", "Qanat Quartier Doha", visitQatar, { energy: 1 }),
    P("crystal_walk", "Crystal Walkway, Gewan Island", "Gewan", "산책", 25.3840, 51.5590, "신규 보행 공간과 식사를 낮은 에너지로 봅니다.", "해질녘 산책", "상점 입점과 공사가 충분히 끝나지 않았다면", "Gewan Island Doha", visitQatar, { energy: 1 }),
    P("vendome", "Place Vendôme", "Lusail", "실내", 25.4201, 51.5164, "한낮 냉방, 식사와 휴식을 한 건물에서 해결합니다.", "더위와 비 대안", "쇼핑 목적이 없고 Katara 일정이 충분하면", "Place Vendome Qatar", "https://placevendomeqatar.com/", { rain: true, energy: 1 }),
    P("lusail_marina", "Lusail Marina Promenade", "Lusail", "산책", 25.4190, 51.5310, "현대 신도시의 스카이라인을 해질녘에 봅니다.", "저녁 바깥 시간", "도심에서 왕복이 길거나 바람이 강하면", "Lusail marina Doha", visitQatar, { energy: 1 }),
    P("planetarium", "Al Thuraya Planetarium", "Katara", "과학", 25.3605, 51.5265, "상영 시간이 맞으면 짧고 명확한 과학 체험입니다.", "아이 실내 대안", "영어 상영 시간이나 좌석이 맞지 않으면", "Al Thuraya Planetarium Doha", "https://www.katara.net/", { rain: true, energy: 1 }),
    P("doha_quest", "Doha Quest", "Msheireb", "어린이", 25.2840, 51.5218, "놀이기구를 원할 때 실내에서 하루 에너지를 씁니다.", "아이 중심 선택", "신장 제한과 소음이 가족에게 안 맞으면", "Doha Quest theme park", "https://dohaquest.com/", { rain: true, energy: 3 }),
    P("angry_birds", "Angry Birds World", "Festival City", "어린이", 25.3900, 51.4400, "쇼핑몰 안에서 몸을 쓰는 아이 대안입니다.", "더운 날의 활동", "서부 이동과 대기시간이 길면", "Angry Birds World Doha", "https://angrybirdsworld.qa/", { rain: true, energy: 3 }),
    P("aspire_park", "Aspire Park", "Aspire", "공원", 25.2625, 51.4373, "넓은 잔디와 놀이터를 낮은 비용으로 씁니다.", "아이들의 자유 시간", "한낮 열기 또는 서부 이동이 길면", "Aspire Park Doha", visitQatar, { energy: 1 }),
    P("villaggio", "Villaggio Mall", "Aspire", "실내", 25.2589, 51.4432, "점심, 냉방과 아이 휴식을 한 장소에서 해결합니다.", "Aspire 일정의 완충", "쇼핑몰을 여행 장면으로 원하지 않으면", "Villaggio Mall Doha", "https://www.villaggioqatar.com/", { rain: true, energy: 1 }),
    P("inland_sea", "Khor Al Adaid Inland Sea", "South Qatar", "자연", 24.6300, 51.2700, "사막과 바다가 만나는 독특한 지형을 봅니다.", "완전히 다른 풍경", "카시트, 듄배싱 제외, 보험과 6시간 차량 부담을 합의하지 못하면", "Khor Al Adaid Qatar", "https://visitqatar.com/intl-en/things-to-do/adventure-sports/the-desert-and-the-inland-sea", { energy: 3 })
  ],
  dining: [
    D("dining_idam", "IDAM by Alain Ducasse", "restaurant", "Corniche", "지중해, 아랍 현대식", 25.2953, 51.5391, "Fine dining plate Doha", "https://mia.org.qa/en/visit/dining/", { kidFit: "중", priceBand: "고가, 2027 가격 미확인" }),
    D("dining_jiwan", "Jiwan", "restaurant", "Old Doha", "카타르 현대식", 25.2867, 51.5491, "Qatari food Doha", "https://nmoq.org.qa/en/visit/dining/"),
    D("dining_shay", "Shay Al Shamoos", "restaurant", "Souq Waqif", "카타르 아침", 25.2867, 51.5330, "Qatari breakfast"),
    D("dining_bandar_aden", "Bandar Aden", "restaurant", "Souq Waqif", "예멘식", 25.2862, 51.5338, "Yemeni mandi food"),
    D("dining_parisa", "Parisa Souq Waqif", "restaurant", "Souq Waqif", "페르시아식", 25.2864, 51.5335, "Persian food Doha", "https://www.tivolihotels.com/en/souq-waqif-doha/restaurants/parisa"),
    D("dining_damasca", "Damasca One", "restaurant", "Souq Waqif", "시리아식", 25.2868, 51.5337, "Syrian mezze Doha", "https://damascaone.com/"),
    D("dining_bayt", "Bayt El Talleh", "restaurant", "Katara", "레반트식", 25.3615, 51.5210, "Lebanese mezze Doha", "https://bayteltalleh.com/"),
    D("dining_yasmine", "Yasmine Palace", "restaurant", "The Pearl", "아랍식", 25.3684, 51.5490, "Arabic mixed grill Doha", "https://yasminepalace.com/"),
    D("dining_smat", "SMAT", "restaurant", "Katara", "카타르식", 25.3592, 51.5270, "Qatari cuisine"),
    D("dining_feeh", "Feeh Al Afia", "restaurant", "Katara", "카타르 가정식", 25.3594, 51.5264, "Qatari home food"),
    D("dining_mamig", "Mamig", "restaurant", "Katara", "아르메니아, 레바논", 25.3590, 51.5260, "Armenian Lebanese food"),
    D("dining_khan", "Khan Farouk Tarab Cafe", "restaurant", "Katara", "이집트식", 25.3598, 51.5268, "Egyptian food Doha"),
    D("dining_sukar", "Sukar Pasha", "restaurant", "Katara", "튀르키예식", 25.3588, 51.5263, "Turkish pide Doha"),
    D("dining_ard", "Ard Canaan", "restaurant", "Katara", "팔레스타인식", 25.3600, 51.5271, "Palestinian food"),
    D("dining_lawazar", "Lawazar", "restaurant", "Katara", "레바논식", 25.3584, 51.5259, "Lebanese restaurant Doha"),
    D("dining_isaan", "Isaan", "restaurant", "West Bay", "태국식", 25.3260, 51.5290, "Thai curry Doha", "https://www.hyatt.com/grand-hyatt/en-US/dohgh-grand-hyatt-doha-hotel-and-villas/dining"),
    D("dining_argan", "Argan", "restaurant", "Msheireb", "모로코식", 25.2856, 51.5289, "Moroccan tagine Doha", "https://www.tivolihotels.com/en/al-najada-doha/restaurants/argan"),
    D("dining_berenjak", "Berenjak Al Maha", "restaurant", "Lusail", "페르시아식", 25.4160, 51.5220, "Persian kebab Doha", "https://berenjaklondon.com/"),
    D("dining_hoppers", "Hoppers Doha", "restaurant", "Msheireb", "스리랑카, 남인도", 25.2848, 51.5258, "Sri Lankan hoppers food", "https://www.hopperslondon.com/doha"),
    D("dining_mila", "Mila", "restaurant", "Msheireb", "지중해식", 25.2851, 51.5261, "Mediterranean family meal Doha"),
    D("cafe_chapati", "Chapati & Karak", "cafe", "Katara", "카락, 차파티", 25.3591, 51.5261, "Karak chai chapati Qatar"),
    D("cafe_desert_rose", "Desert Rose Cafe", "cafe", "Old Doha", "커피, 가벼운 식사", 25.2868, 51.5492, "National Museum Qatar cafe", "https://nmoq.org.qa/en/visit/dining/"),
    D("cafe_flat_white", "Flat White Specialty Coffee", "cafe", "The Pearl", "스페셜티 커피", 25.3690, 51.5490, "Flat white coffee Doha"),
    D("cafe_999", "Café #999", "cafe", "Al Riwaq", "이탈리아식 카페", 25.2940, 51.5410, "Cafe food Doha", "https://qm.org.qa/en/visit/restaurants/cafe-999/"),
    D("cafe_halul", "Halul Cafe", "cafe", "Mina District", "커피, 디저트", 25.2990, 51.5550, "Coffee dessert Qatar"),
    D("cafe_volume", "Volume Cafe", "cafe", "Lusail", "스페셜티 커피", 25.4190, 51.5220, "Coffee latte Doha"),
    D("cafe_evergreen", "Evergreen Organics", "cafe", "The Pearl", "비건, 브런치", 25.3693, 51.5500, "Vegan brunch Doha", "https://evergreenorganics.qa/"),
    D("cafe_meesh", "Meesh Me-Time Cafe", "cafe", "Msheireb", "커피, 샌드위치", 25.2849, 51.5270, "Cafe sandwich Doha"),
    D("cafe_qinwan", "Qinwan Cafe", "cafe", "Msheireb", "대추, 디저트", 25.2855, 51.5275, "Dates dessert Qatar", "https://qinwan.com/"),
    D("cafe_chaclate", "Chac'Late", "cafe", "Katara", "초콜릿, 디저트", 25.3595, 51.5265, "Chocolate dessert cafe")
  ],
  itinerary: [
    { date: "2027-03-28", title: "조건을 다시 확인하고 도하 도착", zone: "IST → DOH / Souq Waqif", main: "체크인과 Souq Waqif 이른 저녁", whyNow: "도착 전 DOH-LAX 목표일 직항이 최종 확인된 경우에만 이 일정이 시작됩니다.", timeline: ["IST에서 9명 같은 편 체크인", "DOH 도착과 16석급 차량", "호텔 체크인과 90분 휴식", "Souq Waqif 60분과 이른 저녁"], rain: "호텔 휴식과 가까운 식당", low: "숙소 식사", notes: "직항 게이트 실패 시 두바이안으로 전환", featuredPlace: "souq_waqif", focused: { title: "Souq와 Msheireb", main: "Souq Waqif와 Msheireb Downtown", timeline: ["체크인", "Msheireb 트램", "Souq Waqif 산책", "이른 저녁"], featuredPlace: "msheireb_downtown" } },
    { date: "2027-03-29", title: "카타르의 형성과 바다", zone: "Old Doha / Corniche", main: "National Museum of Qatar와 MIA Park", whyNow: "첫 온전한 날에 가장 중요한 역사와 스카이라인을 연결합니다.", timeline: ["09:30 National Museum", "12:00 Jiwan 또는 가까운 점심", "14:00 숙소 휴식", "17:00 MIA Park와 Dhow Harbour"], rain: "National Museum만 길게", low: "National Museum 90분 뒤 숙소", notes: "MIA 본관까지 무리해서 추가하지 않음", featuredPlace: "national_museum", focused: { title: "두 박물관의 축", main: "National Museum과 MIA 핵심실", timeline: ["09:00 National Museum", "12:00 점심", "14:30 MIA 핵심실", "17:00 MIA Park"], featuredPlace: "mia" } },
    { date: "2027-03-30", title: "Katara에서 아이와 어른의 균형", zone: "Katara / The Pearl", main: "Katara와 OliOli Doha", whyNow: "출발 전 마지막 온전한 날을 낮은 이동과 아이 체험에 씁니다.", timeline: ["09:30 Katara Cultural Village", "11:30 같은 권역 점심", "13:00 OliOli 예약 세션", "17:00 The Pearl 짧은 산책"], rain: "OliOli와 Planetarium", low: "Katara 또는 OliOli 한 곳만", notes: "Inland Sea 추가 금지", featuredPlace: "katara", focused: { title: "Katara와 The Pearl", main: "Katara, OliOli, Qanat Quartier", timeline: ["09:00 Katara", "11:30 점심", "13:00 OliOli", "17:30 Qanat Quartier"], featuredPlace: "olioli" } },
    { date: "2027-03-31", title: "직항이 있을 때만 두 가족 분리", zone: "호텔 → DOH → ICN / LAX", main: "더 이른 편 기준 공동 공항 이동", whyNow: "이날 LAX 직항이 페이지 전체의 성립 조건입니다.", timeline: ["운항 상태와 터미널 재확인", "체크아웃", "출발 3시간 전 DOH 이동", "ICN팀과 LAX팀 각 직항 탑승"], rain: "일정 변화 없음", low: "호텔 밖 일정 없음", notes: "수요일 LAX 직항 미판매면 실행 금지", stay: "귀국", featuredPlace: "national_museum", focused: { title: "공항만", main: "관광 없이 DOH 공동 이동", timeline: ["체크아웃", "차량 적재", "DOH 이동", "각 직항 탑승"], featuredPlace: "national_museum" } }
  ],
  rentalChecklist: ["2027년 3월 31일 DOH-LAX 직항 판매편을 가장 먼저 확인합니다.", "DOH-LAX가 없으면 숙소 조사와 무관하게 두바이안으로 전환합니다.", "Qatar Airways 스톱오버의 12시간부터 96시간 환승 조건을 확인합니다.", "항공권 운임과 예약 클래스가 Discover Qatar 상품 대상인지 확인합니다.", "US$49, US$77, US$98은 1인 3박, 2인 1실 시작가이며 아이 가격이 아님을 확인합니다.", "호텔 4실의 실제 배정과 어린이 추가 침대 비용을 서면으로 받습니다.", "공항 차량은 9명, 대형 짐과 어린이 좌석 3개를 기준으로 받습니다.", "모스크 방문 복장, 예배시간과 비무슬림 방문 구역을 전날 확인합니다.", "Inland Sea는 듄배싱 제외, 카시트와 보험이 명시될 때만 예약합니다.", "지역 항공 운항과 외교부 안전 공지를 출발 30일, 14일, 3일 전에 재확인합니다."],
  budget: { people: 9, nights: 3, currency: "KRW", defaultStay: "market-hotel", defaultOrigin: "fare-unpriced", contingencyRate: 0.15, observationStatus: "DOH-LAX 목표일 직항이 먼저입니다. 항공은 추천 다구간 실가격이 없고 현지비는 계획 한도입니다.", stayOptions: [
    { id: "market-hotel", label: "Doha 3월 시장 ADR 기준", familyTotal: 1800000, note: "QAR4,428을 환율 완충과 함께 약 180만원으로 둔 시장 기준선이며 실제 견적이 아닙니다." },
    { id: "stopover-premium", label: "Premium 스톱오버 계획값", familyTotal: 1100000, note: "US$77 × 9인의 단순 환산에 4실과 어린이 불확실성 완충을 더한 내부값" },
    { id: "residence", label: "레지던스 계획 한도", familyTotal: 3000000, note: "다침실 레지던스 3박의 내부 한도이며 관측 가격이 아닙니다." }
  ], sharedLines: [
    { label: "공항과 3일 전용차 한도", familyTotal: 1300000, note: "16석급 차량, 기사와 어린이 좌석 3개 계획 한도" },
    { label: "입장권 한도", familyTotal: 900000, note: "박물관과 아이 체험을 위한 내부 한도" },
    { label: "식사 증분 한도", familyTotal: 1200000, note: "호텔 조식 여부에 따라 다시 계산" }
  ], origins: [
    { id: "fare-unpriced", label: "추천 다구간 항공 차액 미확정", people: 9, flightPerPerson: 0, note: "ICN팀과 LAX팀의 실제 다구간 견적과 LAX 목표일 직항이 필요합니다." },
    { id: "planning-cap", label: "항공 차액 내부 한도", people: 9, flightPerPerson: 650000, note: "1인 65만원을 의사결정 한도로 둔 값이며 관측 운임이 아닙니다." }
  ], excludedOptions: [{ label: "Inland Sea 전용차", familyTotal: 1200000, note: "안전 조건과 가족 동의가 없어서 기본 총액에서 제외" }] },
  fx: { currencyCode: "QAR", currencyName: "카타르 리얄", sourceDate: "2026-09-04", toKrw: 381.0, changePct: 0, stressPct: 10, headline: "QAR도 USD에 고정되어 원화 비용은 달러 환율을 따라갑니다.", diagnosis: "카타르 리얄은 미국 달러에 고정된 통화입니다. 공식 스톱오버 USD 가격과 현지 QAR 비용을 구분하고, 2027년 원달러 환율과 객실 4실 조건을 따로 스트레스 테스트합니다.", actions: [
    { rank: 1, title: "패키지와 현지비 분리", body: "스톱오버 USD 결제와 식사, 차량 QAR 결제를 별도 기록합니다.", tone: "primary" },
    { rank: 2, title: "DCC 거절", body: "카드 결제에서 KRW 환산 대신 QAR 또는 USD 계약통화를 선택합니다.", tone: "neutral" },
    { rank: 3, title: "직항을 가격보다 먼저", body: "DOH-LAX 목표일 직항이 없으면 낮은 호텔가로도 결론을 바꾸지 않습니다.", tone: "warning" }
  ], sources: [{ title: "Qatar Central Bank 환율", url: "https://www.qcb.gov.qa/en/pages/index.aspx" }, { title: "XE QAR-KRW 참고", url: "https://www.xe.com/currencyconverter/convert/?Amount=1&From=QAR&To=KRW" }] },
  climate: { source: "WMO Doha 장기 기후 통계", summary: "3월 평균 최저 16.7°C, 평균 최고 26.8°C, 월 강수량 16.1mm와 평균 강수일 1.8일입니다. 따뜻하지만 바람, 강한 햇빛과 큰 일교차를 준비합니다.", packing: ["강한 자외선용 모자", "SPF 50 자외선 차단제", "얇은 겉옷", "모스크용 어깨와 무릎을 가리는 옷", "실내 냉방용 긴팔", "휴대용 물병"], note: "1962년부터 1992년 평년값으로 2027년 예보가 아닙니다. 출발 7일 전 바람, UV, 강수와 공기질을 다시 봅니다.", official: "https://worldweather.wmo.int/en/city.html?cityId=221" },
  sources: [
    { title: "Qatar Airways Istanbul-Doha", url: "https://www.qatarairways.com/en/destinations/flights-to-doha/from-istanbul.html/", checkedAt: "2026-09-04" },
    { title: "Turkish Airlines Istanbul-Doha", url: "https://www.turkishairlines.com/en-tr/flights-from-istanbul-to-doha", checkedAt: "2026-09-04" },
    { title: "Qatar Airways Doha-Seoul", url: "https://www.qatarairways.com/en-ae/destinations/flights-to-seoul/from-doha.html", checkedAt: "2026-09-04" },
    { title: "Qatar Airways Doha-Los Angeles", url: "https://www.qatarairways.com/en/destinations/flights-to-los-angeles/from-doha.html", checkedAt: "2026-09-04" },
    { title: "Qatar Airways 2026 여름 LAX 증편 발표", url: "https://www.qatarairways.com/press-releases/en-WW/267138-from-doha-to-the-world-qatar-airways-takes-off-to-over-160-global-destinations-this-summer/", checkedAt: "2026-09-04" },
    { title: "Google Flights LAX-DOH 현재 직항 운항일", url: "https://www.google.com/travel/flights/flights-from-los-angeles-to-doha.html", checkedAt: "2026-09-04" },
    { title: "Qatar Airways 공식 Stopover 가격과 조건", url: "https://www.qatarairways.com/en-us/offers/qatar-stopover.html", checkedAt: "2026-09-04" },
    { title: "Qatar Tourism 2025 호텔 ADR", url: "https://www.qatartourism.com/content/dam/qatar-tourism/qatar-tourism-reports/2025/2025-Annual-Performance-Report-EN.pdf", checkedAt: "2026-09-04" },
    { title: "WMO Doha 3월 기후", url: "https://worldweather.wmo.int/en/city.html?cityId=221", checkedAt: "2026-09-04" },
    { title: "Visit Qatar 가족 여행", url: "https://visitqatar.com/intl-en/plan-your-trip/guides/family/top-ten-things-to-do-with-kids", checkedAt: "2026-09-04" },
    { title: "Visit Qatar 교통", url: "https://visitqatar.com/intl-en/plan-your-trip/getting-around", checkedAt: "2026-09-04" }
  ]
};

export const imageRequests = [
  ...spec.places.map((item) => ({ id: item.id, kind: "place", query: item.imageQuery, fallback: `${item.category} Doha Qatar`, cityFallback: "Doha Qatar skyline", extraFallbacks: ["Qatar landmarks", "Doha architecture"], label: `${item.name} 참고 이미지` })),
  ...spec.hotels.map((item) => ({ id: item.id, kind: "hotel", query: item.imageQuery, fallback: `${item.location} Doha hotel`, cityFallback: "Doha hotel architecture", extraFallbacks: ["Doha hotel exterior", "Qatar luxury hotel", "Doha resort", "Doha city architecture night"], label: `${item.name} 또는 권역 참고 이미지` })),
  ...spec.residences.map((item) => ({ id: item.id, kind: "residence", query: item.imageQuery, fallback: `${item.neighborhood} Doha`, cityFallback: "Doha apartment architecture", extraFallbacks: ["Doha apartment towers", "West Bay Doha skyline", "The Pearl Qatar buildings"], label: `${item.name} 구조 또는 권역 참고 이미지` })),
  ...spec.dining.map((item) => ({ id: item.id, kind: "dining", query: item.imageQuery, fallback: item.type === "cafe" ? "coffee cafe" : `${item.cuisine} food`, cityFallback: "Middle Eastern food", extraFallbacks: item.type === "cafe" ? ["coffee drink", "cafe dessert", "Arabic coffee"] : ["Qatari food", "Middle Eastern cuisine", "Arabic food dish"], label: item.type === "cafe" ? `${item.name} 음료 참고 이미지` : `${item.name} 대표 메뉴 참고 이미지` }))
];
