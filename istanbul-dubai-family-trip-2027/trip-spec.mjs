const visitDubai = "https://www.visitdubai.com/en/places-to-visit";
const maps = "https://www.google.com/maps/search/?api=1&query=";
const mapUrl = (name) => `${maps}${encodeURIComponent(`${name} Dubai`)}`;
const P = (id, name, zone, category, lat, lng, why, bestFor, skipIf, imageQuery, official = visitDubai, extra = {}) => ({ id, name, zone, category, lat, lng, why, bestFor, skipIf, imageQuery, official, ...extra });
const H = (id, name, type, location, fit, lat, lng, official, verdict, imageQuery, extra = {}) => ({ id, name, type, location, fit, lat, lng, official, verdict, imageQuery, ...extra });
const D = (id, name, type, zone, cuisine, lat, lng, imageQuery, officialUrl = null, extra = {}) => ({ id, name, type, zone, cuisine, lat, lng, imageQuery, officialUrl: officialUrl || mapUrl(name), ...extra });

export const spec = {
  checkedAt: "2026-09-04",
  slug: "istanbul-dubai",
  title: "ISTANBUL + DUBAI TOGETHER",
  subtitle: "이스탄불 7박 뒤 두바이 3박, 두 가족이 마지막 날 직항으로 분리",
  cityKo: "두바이",
  cityEn: "Dubai",
  arrivalDate: "2027-03-28",
  checkoutDate: "2027-03-31",
  mapZoom: 11,
  weatherCoordinates: { latitude: "25.2048", longitude: "55.2708", timezone: "Asia/Dubai" },
  sourceDeck: "https://www.visitdubai.com/en/",
  coreText: {
    weatherBefore: "실시간 예보는 두바이 도착 16일 전부터 확인합니다.", weatherAfter: "두바이 체류 기간이 지났습니다.",
    budget: "표시 금액은 이스탄불 7박 뒤 두바이 3박을 붙일 때의 현지 계획값입니다. 항공 다구간 차액은 실제 판매편이 열리기 전 확정하지 않습니다.",
    rain: "비나 모래바람이면 야외 전망을 줄이고 Museum of the Future, Dubai Aquarium 또는 OliOli 가운데 한 곳만 봅니다.",
    museum: "박물관은 Al Shindagha Museum과 Museum of the Future 중 한 곳을 먼저 고릅니다. 아이 체력상 같은 날 두 대형 실내 시설을 넣지 않습니다.",
    specialTerms: ["사막", "데저트", "desert"], specialAnswer: "사막 사파리는 3박의 필수 일정이 아닙니다. 만 6세 아이의 카시트, 듄배싱 제외 차량, 보험과 호텔 복귀 시각을 서면 확인할 때만 선택합니다.",
    transport: "IST에서 DXB로 아홉 명이 같은 직항편을 타고, 3월 31일에는 DXB에서 ICN과 LAX 직항으로 나뉩니다. 공항은 출발 3시간 전 공동 이동을 기본으로 합니다.",
    uid: "dubai-stop", prodid: "Istanbul Dubai Family Trip 2027"
  },
  principles: [
    "이스탄불 7박은 고정하고 3월 28일 아홉 명이 같은 IST-DXB 직항으로 이동합니다.",
    "3월 31일 DXB-ICN과 DXB-LAX가 모두 현재 정기 직항이라 귀국일에만 두 가족이 갈라집니다.",
    "온전한 관광일은 이틀입니다. 해변, 문화, 대형 실내 시설을 하루씩 섞고 사막은 선택으로 둡니다.",
    "항공 다구간 총액과 9인 4실 목표일 가격은 판매 재고가 열릴 때 같은 조건으로 다시 확인합니다."
  ],
  familyGroups: [
    { id: "shared-ist-dxb", label: "공동 이동", origin: "IST", members: "성인 6, 어린이 3", route: "이스탄불 IST → 두바이 DXB", target: "3월 28일 오전 또는 이른 오후 같은 편, 도착일 관광은 크릭 산책 한 곳", carriers: "Emirates 현재 하루 3편, Turkish Airlines도 직항 운항", status: "대표 비행 4시간 25분부터 4시간 55분, 2027년 정확한 9석 운임은 미확정" },
    { id: "split-dxb-home", label: "귀국 분리", origin: "DXB", members: "ICN팀 5명, LAX팀 4명", route: "DXB → ICN / DXB → LAX", target: "3월 31일 같은 차로 공항 이동 후 각 직항 탑승", carriers: "Emirates 현재 ICN 주 9회, LAX 매일 직항", status: "ICN 약 8시간 20분, LAX 약 17시간 5분. 실제 2027년 편명과 출발 시각은 발권 전 재확인" }
  ],
  decisionChecklist: [
    { id: "route", label: "세 구간 직항", detail: "IST-DXB, DXB-ICN, DXB-LAX를 3월 28일과 31일 실제 판매편으로 다시 잠급니다.", href: "#family" },
    { id: "rooms", label: "4실 배치", detail: "연결 또는 바로 옆 객실과 실제 침대 9개를 서면 확정합니다.", href: "#stay" },
    { id: "airport", label: "귀국일 공동 차량", detail: "두 편 중 더 이른 출발을 기준으로 9명과 짐이 함께 DXB로 이동합니다.", href: "#plan" },
    { id: "heat", label: "한낮 열기", detail: "야외는 오전과 해질녘에, 13시부터 16시는 실내 또는 숙소로 둡니다.", href: "#weather" }
  ],
  hotels: [
    H("zabeel", "Jumeirah Zabeel Saray Royal Residences", "5침실 빌라형", "Palm Jumeirah", 96, 25.0970, 55.1230, "https://www.jumeirah.com/en/stay/dubai/jumeirah-zabeel-saray", "9명이 한 집처럼 머무는 구조와 리조트 시설은 가장 강하지만 총액이 매우 높습니다.", "Jumeirah Zabeel Saray Dubai", { capacity: "5침실 Royal Residence, 9인 정원은 서면 승인 필요", arrangement: "5침실 레지던스 한 채", good: ["공용 거실과 침실 5개", "해변과 실내외 수영장", "2027년 같은 기간 10박 공개 총액 관측"], cautions: ["3박으로 바꾸면 단가와 재고가 달라짐", "Palm 끝이라 구시가지 이동이 김"] }),
    H("mandarin-jumeira", "Mandarin Oriental Jumeira, Dubai", "해변 럭셔리형", "Jumeirah 1", 93, 25.2290, 55.2635, "https://www.mandarinoriental.com/en/dubai/jumeira-beach", "도시와 해변을 함께 쓰기 좋은 위치지만 연결 객실과 어린이 정원을 확약해야 합니다.", "Mandarin Oriental Jumeira Dubai"),
    H("jumeirah-beach", "Jumeirah Beach Hotel", "가족 리조트형", "Umm Suqeim", 92, 25.1412, 55.1915, "https://www.jumeirah.com/en/stay/dubai/jumeirah-beach-hotel", "가족 시설과 Wild Wadi 접근이 강한 운영형 1순위입니다.", "Jumeirah Beach Hotel Dubai", { good: ["공식 가족 리조트 시설", "해변과 워터파크 접근", "공항과 올드 두바이 사이에서 Palm보다 짧은 이동"], cautions: ["4실 인접 배정 미확정", "목표 3박 총액은 10박 견적에서 환산한 참고값"] }),
    H("marsa", "Jumeirah Marsa Al Arab", "신규 초럭셔리형", "Umm Suqeim", 78, 25.1428, 55.1855, "https://www.jumeirah.com/en/stay/dubai/jumeirah-marsa-al-arab", "새 시설과 해변은 뛰어나지만 3박 가족여행에는 비용 효율이 가장 낮습니다.", "Jumeirah Marsa Al Arab Dubai"),
    H("four-seasons", "Four Seasons Resort Dubai at Jumeirah Beach", "해변 럭셔리형", "Jumeirah 2", 84, 25.2027, 55.2400, "https://www.fourseasons.com/dubaijb/", "서비스와 도심 접근은 안정적이지만 네 객실 총액이 큽니다.", "Four Seasons Resort Dubai Jumeirah Beach"),
    H("al-naseem", "Jumeirah Al Naseem", "저층 해변 리조트형", "Madinat Jumeirah", 88, 25.1326, 55.1853, "https://www.jumeirah.com/en/stay/dubai/jumeirah-al-naseem", "운하, 해변과 가족 산책을 한 권역에서 해결하기 좋습니다.", "Jumeirah Al Naseem Dubai"),
    H("atlantis-palm", "Atlantis, The Palm", "대형 가족 리조트형", "Palm Jumeirah", 90, 25.1304, 55.1171, "https://www.atlantis.com/atlantis-the-palm", "워터파크와 수족관을 숙소 안에서 해결해 아이 중심 이틀에 강합니다.", "Atlantis The Palm Dubai", { good: ["Aquaventure와 Lost World 접근", "가족 식당 선택 폭", "공개 비교 시작가 존재"], cautions: ["대형 리조트 내부 이동과 혼잡", "도심 문화 일정의 차량 시간이 김"] }),
    H("atlantis-royal", "Atlantis The Royal", "초럭셔리 리조트형", "Palm Jumeirah", 74, 25.1378, 55.1256, "https://www.atlantis.com/atlantis-the-royal", "시설은 최상급이지만 3박에 공간을 충분히 쓰기 어렵고 가족 총액이 큽니다.", "Atlantis The Royal Dubai"),
    H("oneonly-mirage", "One&Only Royal Mirage", "저층 해변 리조트형", "Al Sufouh", 87, 25.0985, 55.1566, "https://www.oneandonlyresorts.com/royal-mirage", "조용한 정원과 해변, Palm 및 Marina 접근의 균형이 좋습니다.", "One Only Royal Mirage Dubai"),
    H("grand-hyatt", "Grand Hyatt Dubai", "도심 대형 호텔형", "Dubai Healthcare City", 86, 25.2287, 55.3273, "https://www.hyatt.com/grand-hyatt/en-US/dxbgh-grand-hyatt-dubai", "공항과 올드 두바이 접근, 실내 수영장과 대형 객실 재고가 운영상 편합니다.", "Grand Hyatt Dubai"),
    H("address-creek", "Address Grand Creek Harbour", "전망 도심형", "Dubai Creek Harbour", 82, 25.2056, 55.3460, "https://www.addresshotels.com/en/hotels/address-grand-creek-harbour/", "공항과 크릭 권역에 가깝고 신축 객실 운영이 단순합니다.", "Address Grand Creek Harbour Dubai"),
    H("rove-downtown", "Rove Downtown Dubai", "실용 도심형", "Downtown", 80, 25.2025, 55.2777, "https://www.rovehotels.com/en/hotels/rove-downtown/", "럭셔리 시설보다 가격과 Dubai Mall 도보성을 택하는 실용 후보입니다.", "Rove Downtown Dubai")
  ],
  hotelPrices: {
    zabeel: { provider: "Trip.com", referenceStay: "2027-03-21부터 31, 10박 정확 날짜", nightlyDisplay: "US$3,419/채, 세금 전", projectedDisplay: "US$12,645, 10박 총액의 30% 단순 환산", currency: "USD", totalIncludesTaxes: false, sourceUrl: "https://www.trip.com/hotels/list?city=220&searchWord=Jumeirah%20Zabeel%20Saray%20Dubai&checkin=2027/03/21&checkout=2027/03/31&optionId=1562873&optionType=Hotel&adult=6&children=3&crn=1&ages=9%2C7%2C6" },
    "mandarin-jumeira": { provider: "Trip.com", referenceStay: "2027-03-21부터 31, 10박 정확 날짜", nightlyDisplay: "US$901/실, 세금 전", projectedDisplay: "US$13,303, 10박 총액의 30% 단순 환산", currency: "USD", totalIncludesTaxes: false, sourceUrl: "https://www.trip.com/hotels/list?city=220&searchWord=Mandarin%20Oriental%20Jumeira%20Dubai&checkin=2027/03/21&checkout=2027/03/31&adult=6&children=3&crn=4&ages=9%2C7%2C6" },
    "jumeirah-beach": { provider: "Trip.com", referenceStay: "2027-03-21부터 31, 10박 정확 날짜", nightlyDisplay: "US$958/실, 세금 전", projectedDisplay: "US$14,153, 10박 총액의 30% 단순 환산", currency: "USD", totalIncludesTaxes: false, sourceUrl: "https://www.trip.com/hotels/list?city=220&searchWord=Jumeirah%20Beach%20Hotel%20Dubai&checkin=2027/03/21&checkout=2027/03/31&adult=6&children=3&crn=4&ages=9%2C7%2C6" },
    marsa: { provider: "Trip.com", referenceStay: "2027-03-21부터 31, 10박 정확 날짜", nightlyDisplay: "US$1,813/실, 세금 전", projectedDisplay: "US$26,720, 10박 총액의 30% 단순 환산", currency: "USD", totalIncludesTaxes: false, sourceUrl: "https://www.trip.com/hotels/list?city=220&searchWord=Jumeirah%20Marsa%20Al%20Arab%20Dubai&checkin=2027/03/21&checkout=2027/03/31&adult=6&children=3&crn=4&ages=9%2C7%2C6" },
    "four-seasons": { provider: "Trip.com", referenceStay: "2027-03-21부터 31, 10박 정확 날짜", nightlyDisplay: "US$1,245/실, 세금 전", projectedDisplay: "US$18,373, 10박 총액의 30% 단순 환산", currency: "USD", totalIncludesTaxes: false, sourceUrl: "https://www.trip.com/hotels/list?city=220&searchWord=Four%20Seasons%20Resort%20Dubai%20at%20Jumeirah%20Beach&checkin=2027/03/21&checkout=2027/03/31&adult=6&children=3&crn=4&ages=9%2C7%2C6" },
    "al-naseem": { provider: "Trip.com", referenceStay: "2027-03-21부터 31, 10박 정확 날짜", nightlyDisplay: "US$1,723/실, 세금 전", projectedDisplay: "US$25,399, 10박 총액의 30% 단순 환산", currency: "USD", totalIncludesTaxes: false, sourceUrl: "https://www.trip.com/hotels/list?city=220&searchWord=Jumeirah%20Al%20Naseem%20Dubai&checkin=2027/03/21&checkout=2027/03/31&adult=6&children=3&crn=4&ages=9%2C7%2C6" },
    "atlantis-palm": { provider: "Google Hotels", referenceStay: "2026년 9월 공개 비교가, 목표일 아님", nightlyDisplay: "US$350/실부터, 세금 포함", projectedDisplay: "US$4,200, 12실박 단순 환산", currency: "USD", totalIncludesTaxes: true, sourceUrl: "https://www.google.com/travel/hotels/entity/CgoIxZWB1JjIlsoFEAE" },
    "atlantis-royal": { provider: "Expedia", referenceStay: "2026-09-02 공개 시작가, 목표일 아님", nightlyDisplay: "US$738/실부터, 세금 포함", projectedDisplay: "US$8,856, 12실박 단순 환산", currency: "USD", totalIncludesTaxes: true, sourceUrl: "https://www.expedia.com/Dubai-Hotels-Atlantis-The-Royal.h39014655.Hotel-Information" },
    "oneonly-mirage": { provider: "Expedia", referenceStay: "2026-09-01 공개 시작가, 목표일 아님", nightlyDisplay: "US$367/실부터, 세금 포함", projectedDisplay: "US$4,404, 12실박 단순 환산", currency: "USD", totalIncludesTaxes: true, sourceUrl: "https://www.expedia.com/Dubai-Hotels-OneOnly-Royal-Mirage.h527458.Hotel-Information" },
    "grand-hyatt": { provider: "Dubai DET", referenceStay: "2025년 전체 도시 시장 평균", nightlyDisplay: "AED579/실 ADR", projectedDisplay: "AED6,948, 12실박 시장 기준", currency: "AED", sourceUrl: "https://www.dubaidet.gov.ae/en/newsroom/press-releases/dubais-tourism-industry-achieves-third-successive-record-breaking-year" },
    "address-creek": { provider: "Dubai DET", referenceStay: "2025년 전체 도시 시장 평균", nightlyDisplay: "AED579/실 ADR", projectedDisplay: "AED6,948, 12실박 시장 기준", currency: "AED", sourceUrl: "https://www.dubaidet.gov.ae/en/newsroom/press-releases/dubais-tourism-industry-achieves-third-successive-record-breaking-year" },
    "rove-downtown": { provider: "Dubai DET", referenceStay: "2025년 전체 도시 시장 평균", nightlyDisplay: "AED579/실 ADR", projectedDisplay: "AED6,948, 12실박 시장 기준", currency: "AED", sourceUrl: "https://www.dubaidet.gov.ae/en/newsroom/press-releases/dubais-tourism-industry-achieves-third-successive-record-breaking-year" }
  },
  tripComCostSummary: { provider: "Trip.com + 공개 시장 자료", capturedAt: "2026-09-04", requestedStay: "2027-03-28부터 31, 3박", requestedOccupancy: "성인 6명, 어린이 3명, 객실 4실", exactQuoteStatus: "기존 2027년 3월 21일부터 31일까지 10박 공개 견적 6곳은 관측했지만 추천안의 3박과는 다른 상품입니다.", directQuoteStatus: "12곳 모두 동일 날짜, 9명, 4실의 재현 가능한 공식 총액은 아직 확인하지 못했습니다.", benchmarkLabel: "Dubai 2025 도시 전체 ADR", benchmarkNightly: "AED579", benchmarkTotal: "AED6,948, 객실 4실 × 3박", benchmarkFormula: "Dubai DET 2025 ADR AED579 × 12실박", sourceUrl: "https://www.dubaidet.gov.ae/en/newsroom/press-releases/dubais-tourism-industry-achieves-third-successive-record-breaking-year", fx: { label: "2026-09-04 참고", currencyCode: "AED", toKrw: 378.0, sourceUrl: "https://www.xe.com/currencyconverter/convert/?Amount=1&From=AED&To=KRW", note: "2027년 카드 환율과 실제 숙박 가격이 아닙니다." } },
  residences: [
    { id: "residence_zabeel", name: "Jumeirah Zabeel Saray Royal Residence", neighborhood: "Palm Jumeirah", capacity: 10, bedrooms: 5, beds: 7, baths: 5, fit: 96, reason: "공식 5침실 레지던스로 아홉 명이 한 생활공간을 공유할 수 있습니다.", caution: "3박 판매 여부와 전용 풀 어린이 안전장치를 확인합니다.", url: "https://www.jumeirah.com/en/stay/dubai/jumeirah-zabeel-saray", imageQuery: "Jumeirah Zabeel Saray Dubai" },
    { id: "residence_marriott", name: "Marriott Resort Palm Jumeirah Apartments", neighborhood: "Palm West Beach", capacity: 9, bedrooms: 4, beds: 6, baths: 4, fit: 86, reason: "리조트 운영과 아파트형 생활공간을 함께 검토할 후보입니다.", url: "https://www.marriott.com/en-us/hotels/dxbpm-marriott-resort-palm-jumeirah-dubai/overview/", imageQuery: "Palm Jumeirah apartment Dubai" },
    { id: "residence_bluewaters", name: "Bluewaters Residences 4BR", neighborhood: "Bluewaters Island", capacity: 9, bedrooms: 4, beds: 6, baths: 4, fit: 84, reason: "JBR 산책과 넓은 거실을 함께 얻는 권역 후보입니다.", url: mapUrl("Bluewaters Residences"), imageQuery: "Bluewaters Island Dubai residences" },
    { id: "residence_citywalk", name: "City Walk 4BR Residence", neighborhood: "City Walk", capacity: 9, bedrooms: 4, beds: 6, baths: 4, fit: 82, reason: "해변과 Downtown 사이에서 식사와 차량 동선을 균형 있게 잡습니다.", url: mapUrl("City Walk Residences"), imageQuery: "City Walk Dubai residences" },
    { id: "residence_creek", name: "Dubai Creek Harbour 4BR", neighborhood: "Creek Harbour", capacity: 9, bedrooms: 4, beds: 6, baths: 4, fit: 79, reason: "공항과 크릭 문화 일정에 가깝고 신축 엘리베이터형 후보가 많습니다.", url: mapUrl("Dubai Creek Harbour residences"), imageQuery: "Dubai Creek Harbour apartments" },
    { id: "residence_downtown", name: "Downtown Dubai 4BR", neighborhood: "Downtown", capacity: 9, bedrooms: 4, beds: 6, baths: 4, fit: 77, reason: "Dubai Mall 도보권을 우선하는 탐색 후보입니다.", url: mapUrl("Downtown Dubai holiday apartment"), imageQuery: "Downtown Dubai apartments" }
  ],
  places: [
    P("museum_future", "Museum of the Future", "Downtown North", "박물관", 25.2192, 55.2820, "기술 전시와 건축을 한 번에 보는 대표 실내 선택입니다.", "부모와 아이가 같이 몰입할 한 곳", "시간 지정 입장권을 확보하지 못하면", "Museum of the Future Dubai", "https://museumofthefuture.ae/en", { rain: true, energy: 2 }),
    P("burj_khalifa", "Burj Khalifa At the Top", "Downtown", "전망", 25.1972, 55.2744, "도시의 규모를 가장 짧게 이해합니다.", "해질녘 가족 전망", "대기와 혼잡이 90분을 넘으면", "Burj Khalifa Dubai", "https://www.burjkhalifa.ae/", { energy: 2 }),
    P("dubai_mall", "Dubai Mall", "Downtown", "실내", 25.1985, 55.2796, "식사와 휴식, 실내 이동을 한 건물에서 해결합니다.", "한낮 회복", "쇼핑 자체가 목적이 아니면 오래 머물지 않기", "Dubai Mall interior", "https://thedubaimall.com/", { rain: true, energy: 1 }),
    P("aquarium", "Dubai Aquarium & Underwater Zoo", "Downtown", "수족관", 25.1975, 55.2798, "만 6세부터 9세까지 반응이 안정적인 실내 핵심입니다.", "더운 시간의 아이 일정", "Atlantis 수족관을 이미 본다면", "Dubai Aquarium", "https://www.thedubaiaquarium.com/", { rain: true, energy: 1 }),
    P("fountain", "Dubai Fountain promenade", "Downtown", "산책", 25.1951, 55.2751, "저녁 식사 전 짧은 무료 산책으로 충분합니다.", "온 가족 야경", "공연 일정이 없거나 혼잡하면", "Dubai Fountain", visitDubai, { energy: 1 }),
    P("al_fahidi", "Al Fahidi Historical Neighbourhood", "Old Dubai", "역사", 25.2635, 55.3002, "초고층 도시 이전의 바람탑과 골목을 봅니다.", "이스탄불 뒤 이어지는 도시사", "한낮 기온이 높거나 보행이 힘들면", "Al Fahidi Dubai", "https://www.dubaiculture.gov.ae/en/attractions/al-fahidi-historical-neighbourhood"),
    P("shindagha", "Al Shindagha Museum", "Old Dubai", "박물관", 25.2697, 55.2898, "크릭과 두바이의 형성사를 체계적으로 봅니다.", "부모 중심 문화 한 곳", "아이들이 실내 전시에 이미 지쳤다면", "Al Shindagha Museum Dubai", "https://alshindagha.dubaiculture.gov.ae/", { rain: true, energy: 2 }),
    P("creek_abra", "Dubai Creek Abra", "Old Dubai", "교통 체험", 25.2686, 55.2964, "짧고 저렴한 배 이동 자체가 아이들의 체험이 됩니다.", "아홉 명이 함께 타는 짧은 장면", "강풍이나 선착장 혼잡이 심하면", "Dubai Creek abra", "https://www.rta.ae/", { energy: 1 }),
    P("gold_souk", "Gold Souk", "Deira", "시장", 25.2705, 55.2987, "크릭 건너 시장의 밀도를 짧게 봅니다.", "전통 상업 풍경", "구매 협상에 관심이 없으면 30분만", "Dubai Gold Souk"),
    P("spice_souk", "Spice Souk", "Deira", "시장", 25.2677, 55.2970, "향신료와 건과일을 감각적으로 경험합니다.", "아이들과 냄새 탐색", "호객이 피곤하거나 알레르기가 있으면", "Dubai Spice Souk"),
    P("etihad_museum", "Etihad Museum", "Jumeirah", "박물관", 25.2354, 55.2719, "UAE 건국사의 핵심을 조용한 실내에서 봅니다.", "비나 더위의 문화 대안", "Al Shindagha를 길게 봤다면", "Etihad Museum Dubai", "https://etihadmuseum.dubaiculture.gov.ae/", { rain: true, energy: 1 }),
    P("kite_beach", "Kite Beach", "Jumeirah", "해변", 25.1617, 55.2082, "수영보다 모래와 해질녘 산책에 맞는 무료 선택입니다.", "아이들의 바깥놀이", "바람, 높은 UV 또는 수질 경보가 있으면", "Kite Beach Dubai"),
    P("madinat", "Madinat Jumeirah Abra", "Umm Suqeim", "산책", 25.1336, 55.1841, "그늘진 수로와 짧은 보트로 가족 이동 부담을 낮춥니다.", "세대 공통 산책", "리조트형 풍경에 관심이 없다면", "Madinat Jumeirah abra", "https://www.jumeirah.com/en/collection/madinat-jumeirah", { energy: 1 }),
    P("burj_arab_view", "Burj Al Arab public viewpoint", "Umm Suqeim", "전망", 25.1460, 55.1909, "숙박하지 않아도 대표 건축을 짧게 봅니다.", "가족 사진 20분", "한낮 역광과 더위가 강하면", "Burj Al Arab beach view"),
    P("aquaventure", "Aquaventure World", "Palm Jumeirah", "워터파크", 25.1310, 55.1185, "하루를 통째로 아이 중심으로 쓰는 강한 선택입니다.", "세 아이의 최고 기대 일정", "키 제한, 체력 또는 9인 가격이 맞지 않으면", "Aquaventure Waterpark Dubai", "https://www.aquaventureworld.com/", { energy: 3 }),
    P("lost_world", "The Lost World Aquarium", "Palm Jumeirah", "수족관", 25.1308, 55.1178, "워터파크보다 낮은 에너지로 Palm을 경험합니다.", "도착일 또는 더위 대안", "Dubai Aquarium을 이미 충분히 봤다면", "Atlantis aquarium Dubai", "https://www.aquaventureworld.com/", { rain: true, energy: 1 }),
    P("green_planet", "The Green Planet", "City Walk", "생태", 25.2074, 55.2632, "실내 열대 생태계가 아이들에게 분명한 체험을 줍니다.", "짧은 실내 생태 수업", "동물 실내 전시를 선호하지 않으면", "Green Planet Dubai", "https://www.thegreenplanetdubai.com/", { rain: true, energy: 1 }),
    P("olioli", "OliOli Dubai", "Al Quoz", "어린이", 25.1712, 55.2472, "아이 셋이 직접 움직이고 만들 수 있는 가장 확실한 실내 회복 카드입니다.", "비, 더위와 부모 교대 휴식", "사전 세션을 못 잡거나 아이가 체험관을 싫어하면", "OliOli Dubai", "https://olioli.ae/", { rain: true, energy: 2 }),
    P("alserkal", "Alserkal Avenue", "Al Quoz", "예술", 25.1404, 55.2249, "창고형 갤러리와 카페를 짧게 조합합니다.", "부모와 큰아이의 현대문화", "전시 일정이 약하거나 어린아이가 지치면", "Alserkal Avenue Dubai", "https://alserkal.online/", { rain: true, energy: 1 }),
    P("jameel", "Jameel Arts Centre", "Jaddaf", "예술", 25.2290, 55.3407, "크릭사이드의 조용한 현대미술관과 정원을 봅니다.", "무료에 가까운 저강도 문화", "전시 휴관 또는 공항 이동일이 촉박하면", "Jameel Arts Centre Dubai", "https://jameelartscentre.org/", { rain: true, energy: 1 }),
    P("children_city", "Children's City", "Creek Park", "어린이", 25.2348, 55.3295, "과학과 신체 활동을 섞은 공공 어린이 시설입니다.", "세 아이 연령대의 실내 체험", "운영시간이 일정과 맞지 않으면", "Childrens City Dubai", "https://www.dm.gov.ae/parks/childrens-city/", { rain: true, energy: 2 }),
    P("dubai_frame", "Dubai Frame", "Zabeel", "전망", 25.2355, 55.3004, "올드와 뉴 두바이를 한 축에서 비교합니다.", "도시 구조 이해", "전망대 대기나 고소공포가 크면", "Dubai Frame", "https://www.dubaiframe.ae/", { energy: 2 }),
    P("zabeel_park", "Zabeel Park", "Zabeel", "공원", 25.2352, 55.2970, "Dubai Frame 앞뒤의 완충 산책입니다.", "아이들의 잔디 휴식", "한낮 기온과 UV가 높으면", "Zabeel Park Dubai", "https://www.dm.gov.ae/parks/zabeel-park/", { energy: 1 }),
    P("miracle_garden", "Dubai Miracle Garden", "Dubailand", "정원", 25.0598, 55.2445, "3월 계절 운영이 맞으면 아이들과 색이 분명한 야외 장면을 얻습니다.", "가족 사진과 산책", "2027 폐장일, 한낮 더위 또는 긴 차량 이동이면", "Dubai Miracle Garden", "https://www.dubaimiraclegarden.com/", { energy: 2 }),
    P("global_village", "Global Village", "Dubailand", "야간", 25.0694, 55.3066, "계절 운영 중이면 저녁 하나를 가족형 축제로 씁니다.", "아이 중심 야간 선택", "늦은 귀가가 다음 날 비행을 해치면", "Global Village Dubai", "https://www.globalvillage.ae/", { energy: 3 }),
    P("expo_city", "Expo City Dubai", "Dubai South", "도시", 24.9603, 55.1501, "미래 도시와 대형 파빌리온을 넓은 보행 공간에서 봅니다.", "건축과 아이 체험", "공항 또는 중심지에서 왕복 시간이 길면", "Expo City Dubai", "https://www.expocitydubai.com/", { energy: 3 }),
    P("ras_al_khor", "Ras Al Khor Wildlife Sanctuary", "Creek", "자연", 25.1957, 55.3623, "도시 가까이에서 새와 습지를 짧게 봅니다.", "관광 밀도에서 벗어나기", "관찰대 운영, 계절 새 또는 차량 접근이 나쁘면", "Ras Al Khor flamingos Dubai", "https://www.dm.gov.ae/dubai-protected-areas/ras-al-khor-wildlife-sanctuary/", { energy: 1 }),
    P("jbr_beach", "The Beach, JBR", "Marina", "해변", 25.0763, 55.1310, "식사와 해변 산책을 한 권역에서 해결합니다.", "저녁 가족 산책", "주말 교통과 혼잡이 심하면", "JBR Beach Dubai", visitDubai, { energy: 1 }),
    P("bluewaters", "Bluewaters Island", "Marina", "산책", 25.0798, 55.1226, "JBR에서 다리로 이어지는 해질녘 산책입니다.", "유모차 가능한 야경", "Ain Dubai 운항만을 목적으로 간다면", "Bluewaters Island Dubai", visitDubai, { energy: 1 }),
    P("desert", "Dubai Desert Conservation Reserve", "Desert", "자연", 24.9500, 55.7000, "도시 밖 사막 생태를 보는 선택 일정입니다.", "완전히 다른 풍경", "듄배싱 제외, 카시트, 보험과 귀환시각을 확약하지 못하면", "Dubai desert conservation reserve", "https://www.ddcr.org/", { energy: 3 })
  ],
  dining: [
    D("dining_arabian_tea", "Arabian Tea House", "restaurant", "Old Dubai", "에미라티, 중동식", 25.2637, 55.3004, "Arabian breakfast Dubai", "https://arabianteahouse.com/"),
    D("dining_al_khayma", "Al Khayma Heritage Restaurant", "restaurant", "Old Dubai", "에미라티", 25.2641, 55.2997, "Emirati food Dubai"),
    D("dining_siraj", "Siraj", "restaurant", "Downtown", "에미라티, 레반트", 25.1928, 55.2770, "Middle Eastern mezze Dubai", "https://sirajrestaurant.com/"),
    D("dining_logma", "Logma", "restaurant", "Dubai Mall", "걸프식 캐주얼", 25.1985, 55.2795, "Luqaimat Emirati food", "https://www.logma.ae/"),
    D("dining_sheikh_mohammed", "SMCCU Cultural Meal", "restaurant", "Old Dubai", "문화 식사", 25.2633, 55.3000, "Emirati cultural meal Dubai", "https://cultures.ae/"),
    D("dining_al_ustad", "Al Ustad Special Kabab", "restaurant", "Bur Dubai", "이란식 케밥", 25.2581, 55.2974, "Iranian kebab Dubai"),
    D("dining_ravi", "Ravi Restaurant", "restaurant", "Satwa", "파키스탄식", 25.2320, 55.2768, "Pakistani curry Dubai"),
    D("dining_reif", "Reif Japanese Kushiyaki", "restaurant", "Dar Wasl", "일본식 꼬치", 25.2111, 55.2558, "Japanese kushiyaki", "https://reifkushiyaki.com/"),
    D("dining_3fils", "3Fils", "restaurant", "Jumeirah Fishing Harbour", "아시아 해산물", 25.1904, 55.2305, "Asian seafood Dubai", "https://3fils.com/"),
    D("dining_fish_beach", "Fish Beach Taverna", "restaurant", "Mina Seyahi", "에게해 해산물", 25.0928, 55.1508, "Aegean seafood table", "https://www.marriott.com/en-us/dining/restaurant-bar/dxbgl-le-meridien-mina-seyahi-beach-resort-and-waterpark/6486617-fish-beach-taverna.mi"),
    D("dining_shimmers", "Shimmers", "restaurant", "Madinat Jumeirah", "그리스식", 25.1320, 55.1820, "Greek food beach Dubai", "https://www.jumeirah.com/en/dine/dubai/mina-a-salam-shimmers"),
    D("dining_pierchic", "Pierchic", "restaurant", "Madinat Jumeirah", "해산물", 25.1347, 55.1796, "Seafood restaurant pier Dubai", "https://www.jumeirah.com/en/dine/dubai/al-qasr-pierchic", { kidFit: "중", priceBand: "고가, 2027 가격 미확인" }),
    D("dining_seafire", "Seafire Steakhouse", "restaurant", "Palm Jumeirah", "스테이크", 25.1302, 55.1170, "Steak plate", "https://www.atlantis.com/atlantis-the-palm/dining/seafire-steakhouse"),
    D("dining_saffron", "Saffron", "restaurant", "Palm Jumeirah", "아시아 뷔페", 25.1305, 55.1168, "Asian buffet Dubai", "https://www.atlantis.com/atlantis-the-palm/dining/saffron"),
    D("dining_timeout", "Time Out Market Dubai", "restaurant", "Downtown", "푸드홀", 25.1915, 55.2762, "Time Out Market Dubai", "https://www.timeoutmarket.com/dubai/"),
    D("dining_dintaifung", "Din Tai Fung, Dubai Mall", "restaurant", "Downtown", "대만식 딤섬", 25.1976, 55.2794, "Xiaolongbao dumplings", "https://www.dintaifung.ae/"),
    D("dining_operation_falafel", "Operation Falafel", "restaurant", "JBR", "팔라펠, 샤와르마", 25.0773, 55.1321, "Falafel plate", "https://www.operationfalafel.com/"),
    D("dining_aroos", "Aroos Damascus", "restaurant", "Deira", "시리아식", 25.2729, 55.3268, "Syrian mezze"),
    D("dining_jones", "Jones the Grocer", "restaurant", "Emirates Golf Club", "올데이 다이닝", 25.1007, 55.1688, "Family brunch Dubai", "https://www.jonesthegrocer.com/"),
    D("dining_beach_house", "The Beach House", "restaurant", "Palm Jumeirah", "지중해식", 25.1307, 55.1513, "Mediterranean lunch Dubai", "https://www.anantara.com/en/palm-dubai/restaurants/the-beach-house"),
    D("cafe_comptoir", "Comptoir 102", "cafe", "Jumeirah", "건강식, 커피", 25.2183, 55.2534, "Cafe breakfast Dubai", "https://comptoir102.com/"),
    D("cafe_nightjar", "Nightjar Coffee Roasters", "cafe", "Al Quoz", "스페셜티 커피", 25.1410, 55.2244, "Coffee roastery Dubai", "https://nightjar.coffee/"),
    D("cafe_raw", "RAW Coffee Company", "cafe", "Al Quoz", "로스터리", 25.1328, 55.2292, "Coffee beans roastery", "https://rawcoffeecompany.com/"),
    D("cafe_sum", "The Sum of Us", "cafe", "Trade Centre", "베이커리, 브런치", 25.2260, 55.2866, "Bakery brunch Dubai", "https://tomo.ae/"),
    D("cafe_arabica", "% Arabica Dubai Mall", "cafe", "Downtown", "커피", 25.1978, 55.2792, "Arabica coffee shop Dubai", "https://arabica.coffee/"),
    D("cafe_lime_tree", "The Lime Tree Cafe", "cafe", "Jumeirah", "케이크, 브런치", 25.2060, 55.2499, "Lime cake cafe", "https://www.thelimetreecafe.com/"),
    D("cafe_boston_lane", "Boston Lane", "cafe", "Al Quoz", "브런치", 25.1448, 55.2240, "Courtyard cafe Dubai", "https://bostonlane.com/"),
    D("cafe_tom_serg", "Tom & Serg", "cafe", "Al Quoz", "브런치, 커피", 25.1374, 55.2243, "Tom and Serg Dubai", "https://tomandserg.com/"),
    D("cafe_forever_rose", "Forever Rose Cafe", "cafe", "Boxpark", "디저트", 25.2085, 55.2510, "Dessert cafe Dubai", "https://foreverrosecafe.com/"),
    D("cafe_espresso_lab", "The Espresso Lab", "cafe", "Dubai Design District", "스페셜티 커피", 25.1852, 55.2991, "Espresso coffee Dubai", "https://theespressolab.com/")
  ],
  itinerary: [
    { date: "2027-03-28", title: "같은 편으로 두바이 도착", zone: "IST → DXB / Creek", main: "호텔 체크인과 Dubai Creek Abra 한 번", whyNow: "아홉 명의 도착 차가 없지만 비행 뒤 체력은 다릅니다.", timeline: ["IST에서 9명 체크인과 좌석 재확인", "DXB 도착, 16석급 차량으로 호텔 이동", "해질녘 Creek abra 또는 호텔 휴식", "가까운 식당에서 이른 저녁"], rain: "Al Shindagha Museum 한 곳만", low: "체크인 뒤 숙소 식사", notes: "도착일 전망대와 사막 금지", featuredPlace: "creek_abra", focused: { title: "Old Dubai 첫 장면", main: "Al Fahidi, Creek Abra와 이른 저녁", timeline: ["호텔 체크인", "Al Fahidi 45분", "Abra로 Deira 이동", "18시 전 저녁 후 복귀"], featuredPlace: "al_fahidi" } },
    { date: "2027-03-29", title: "두바이의 형성과 아이 체험", zone: "Old Dubai / Al Quoz", main: "Al Shindagha Museum과 OliOli", whyNow: "첫 온전한 날에 도시의 역사와 아이들의 직접 체험을 균형 있게 둡니다.", timeline: ["09:30 Al Shindagha Museum", "12:00 Old Dubai 점심", "14:00 OliOli 예약 세션", "16:30 숙소 복귀와 수영"], rain: "같은 실내 일정 유지", low: "Al Shindagha 또는 OliOli 한 곳만", notes: "사막 사파리 추가 금지", featuredPlace: "shindagha", focused: { title: "Old Dubai에서 Al Quoz까지", main: "Al Shindagha, Abra, OliOli", timeline: ["09:00 Al Shindagha", "11:30 Abra 왕복", "13:00 점심", "15:00 OliOli"], featuredPlace: "olioli" } },
    { date: "2027-03-30", title: "아이들이 고르는 물 또는 미래", zone: "Palm Jumeirah 또는 Downtown", main: "Aquaventure 하루 또는 Museum of the Future 반나절", whyNow: "출발 전 마지막 온전한 날을 가족 우선순위 한 가지에 씁니다.", timeline: ["09:30 선택 시설 입장", "12:30 시설 안 점심", "14:00 한낮 휴식", "17:30 해변 또는 Fountain 산책"], rain: "Museum of the Future와 Dubai Mall", low: "Lost World Aquarium 또는 Dubai Aquarium 90분", notes: "Aquaventure와 Downtown을 같은 날 완주하지 않음", featuredPlace: "aquaventure", focused: { title: "미래와 야경", main: "Museum of the Future, Dubai Mall과 Burj Khalifa", timeline: ["10:00 Museum of the Future", "13:00 숙소 휴식", "17:00 Dubai Mall", "해질녘 Burj Khalifa"], featuredPlace: "museum_future" } },
    { date: "2027-03-31", title: "두 가족이 직항으로 분리", zone: "호텔 → DXB → ICN / LAX", main: "더 이른 항공편 기준 공동 공항 이동", whyNow: "마지막 도시에서 양쪽이 직항이라 이 구조가 성립합니다.", timeline: ["조식과 체크아웃", "항공편 상태와 터미널 재확인", "출발 3시간 전 16석급 차량", "ICN팀과 LAX팀 각 직항 탑승"], rain: "일정 변화 없음", low: "호텔 밖 일정 없음", notes: "출발일 관광, 몰, 사막 금지", stay: "귀국", featuredPlace: "dubai_mall", focused: { title: "공항만", main: "관광 없이 DXB 공동 이동", timeline: ["체크아웃", "차량 적재", "DXB 이동", "각 직항 탑승"], featuredPlace: "dubai_mall" } }
  ],
  rentalChecklist: ["3월 28일 IST-DXB 9석을 같은 편으로 잠급니다.", "3월 31일 DXB-ICN과 DXB-LAX가 모두 실제 판매 중인지 확인합니다.", "4실은 연결 또는 같은 층 보장 문구와 객실별 정원을 받습니다.", "실제 침대 9개와 어린이 추가 침대 비용을 객실별로 적습니다.", "16석급 차량에 9명, 대형 짐과 어린이 좌석 3개가 들어가는지 확인합니다.", "해변과 수영장은 구조요원, 수온, 어린이 이용시간을 확인합니다.", "사막은 듄배싱 제외 차량, 카시트, 보험과 귀환시각을 확인할 때만 예약합니다.", "Ramadan 또는 현지 휴일 운영 변화가 있으면 식당과 시설 시간을 다시 봅니다.", "다구간 항공권과 분리 발권의 수하물, 변경, 노쇼 조건을 비교합니다.", "세 항공 구간 중 하나라도 직항이 사라지거나 9석을 못 잡으면 이 분기를 중단합니다."],
  budget: { people: 9, nights: 3, currency: "KRW", defaultStay: "market-hotel", defaultOrigin: "fare-unpriced", contingencyRate: 0.15, observationStatus: "항공은 공개 참고가만 있고 추천 다구간의 실제 차액은 없습니다. 현지 비용은 계획 한도입니다.", stayOptions: [
    { id: "market-hotel", label: "Dubai 시장 ADR 기준", familyTotal: 2800000, note: "AED6,948을 환율 변동을 감안해 약 280만원으로 둔 시장 기준선이며 실제 견적이 아닙니다." },
    { id: "family-resort", label: "가족 리조트 4실 계획 한도", familyTotal: 6500000, note: "객실당 1박 약 54만원의 내부 한도이며 실제 견적이 아닙니다." },
    { id: "residence", label: "9인 레지던스 계획 한도", familyTotal: 5000000, note: "한 유닛 또는 빌라 3박의 내부 한도이며 실제 재고가 아닙니다." }
  ], sharedLines: [
    { label: "공항과 3일 전용차 한도", familyTotal: 1800000, note: "16석급 차량, 기사와 어린이 좌석 3개를 포함한 계획 한도" },
    { label: "입장권 한도", familyTotal: 1800000, note: "유료 시설을 하루 한 곳씩 선택하는 내부 한도" },
    { label: "식사 증분 한도", familyTotal: 1600000, note: "호텔 조식 여부에 따라 다시 계산할 계획값" }
  ], origins: [
    { id: "fare-unpriced", label: "추천 다구간 항공 차액 미확정", people: 9, flightPerPerson: 0, note: "ICN팀과 LAX팀의 서로 다른 다구간 항공권을 실제 판매편에서 받아야 합니다." },
    { id: "planning-cap", label: "항공 차액 내부 한도", people: 9, flightPerPerson: 700000, note: "1인 70만원을 의사결정 한도로 둔 값이며 관측 운임이나 예측이 아닙니다." }
  ], excludedOptions: [{ label: "Aquaventure 9인", familyTotal: 1500000, note: "날짜와 신장별 가격 미확정이라 기본 총액에서 제외한 선택 한도" }] },
  fx: { currencyCode: "AED", currencyName: "UAE 디르함", sourceDate: "2026-09-04", toKrw: 378.0, changePct: 0, stressPct: 10, headline: "AED는 USD에 고정되어 원화 비용은 달러 환율을 따라갑니다.", diagnosis: "UAE 디르함은 미국 달러에 고정된 통화입니다. 지금 환산값을 2027년 확정 비용처럼 쓰지 않고, 원달러 환율과 호텔 세금, 서비스료를 각각 스트레스 테스트합니다.", actions: [
    { rank: 1, title: "USD와 AED 견적 분리", body: "항공 USD와 현지 AED를 계약 통화 그대로 기록합니다.", tone: "primary" },
    { rank: 2, title: "DCC 거절", body: "카드 결제에서 KRW 환산 대신 AED를 선택합니다.", tone: "neutral" },
    { rank: 3, title: "20% 상방 테스트", body: "호텔과 유료 시설 총액이 20% 올라가도 선택이 유지되는지 봅니다.", tone: "warning" }
  ], sources: [{ title: "UAE Central Bank 환율 체계", url: "https://www.centralbank.ae/en/forex-eibor/exchange-rates/" }, { title: "XE AED-KRW 참고", url: "https://www.xe.com/currencyconverter/convert/?Amount=1&From=AED&To=KRW" }] },
  climate: { source: "WMO Dubai 장기 기후 통계", summary: "3월 평균 최저 17.0°C, 평균 최고 27.9°C, 월 강수량 22.4mm입니다. 수영이 가능한 날도 있지만 강한 햇빛, 바람과 드문 비에 대비합니다.", packing: ["강한 자외선용 모자", "SPF 50 자외선 차단제", "얇은 겉옷", "아이 수영복과 래시가드", "실내 냉방용 긴팔", "휴대용 물병"], note: "평년값은 2027년 예보가 아닙니다. 출발 7일 전 기온, UV, 바람, 강수와 공기질을 다시 판단합니다.", official: "https://worldweather.wmo.int/en/city.html?cityId=1190" },
  sources: [
    { title: "Emirates Istanbul-Dubai 현재 직항", url: "https://www.emirates.com/english/destinations/ist/dxb/flights-from-istanbul-airport-to-dubai/", checkedAt: "2026-09-04" },
    { title: "Emirates Dubai-Seoul 현재 직항", url: "https://www.emirates.com/english/destinations/dxb/icn/flights-from-dubai-to-seoul/", checkedAt: "2026-09-04" },
    { title: "Emirates Dubai-Los Angeles 현재 직항", url: "https://www.emirates.com/us/english/destinations/dxb/lax/flights-from-dubai-to-los-angeles/", checkedAt: "2026-09-04" },
    { title: "Emirates 미국 노선과 LAX 매일 운항", url: "https://www.emirates.com/us/english/about-us/our-communities/our-global-presence/emirates-and-the-united-states/", checkedAt: "2026-09-04" },
    { title: "Turkish Airlines Istanbul-Dubai", url: "https://www.turkishairlines.com/en/flights-from-istanbul-to-dubai", checkedAt: "2026-09-04" },
    { title: "Emirates ICN-Istanbul 목표 기간 공개 운임", url: "https://www.emirates.com/kr/english/book/featured-fares/?id=5243172", checkedAt: "2026-09-04" },
    { title: "Korean Air ICN-Dubai 목표일 공개 운임", url: "https://www.koreanair.com/flights/en-kr/flights-from-seoul-to-dubai", checkedAt: "2026-09-04" },
    { title: "Dubai DET 2025 호텔 ADR", url: "https://www.dubaidet.gov.ae/en/newsroom/press-releases/dubais-tourism-industry-achieves-third-successive-record-breaking-year", checkedAt: "2026-09-04" },
    { title: "WMO Dubai 3월 기후", url: "https://worldweather.wmo.int/en/city.html?cityId=1190", checkedAt: "2026-09-04" },
    { title: "Emirates Dubai Stopover", url: "https://www.emirates.com/us/english/discover-dubai/dubai-stopover/", checkedAt: "2026-09-04" },
    { title: "Visit Dubai 공식 관광 정보", url: "https://www.visitdubai.com/en/places-to-visit", checkedAt: "2026-09-04" }
  ]
};

export const imageRequests = [
  ...spec.places.map((item) => ({ id: item.id, kind: "place", query: item.imageQuery, fallback: `${item.category} Dubai`, cityFallback: "Dubai city", label: `${item.name} 참고 이미지` })),
  ...spec.hotels.map((item) => ({ id: item.id, kind: "hotel", query: item.imageQuery, fallback: `${item.location} Dubai hotel`, cityFallback: "Dubai hotel architecture", label: `${item.name} 또는 권역 참고 이미지` })),
  ...spec.residences.map((item) => ({ id: item.id, kind: "residence", query: item.imageQuery, fallback: `${item.neighborhood} Dubai`, cityFallback: "Dubai apartment architecture", label: `${item.name} 구조 또는 권역 참고 이미지` })),
  ...spec.dining.map((item) => ({ id: item.id, kind: "dining", query: item.imageQuery, fallback: item.type === "cafe" ? "coffee cafe" : `${item.cuisine} food`, cityFallback: "Middle Eastern food", label: item.type === "cafe" ? `${item.name} 음료 참고 이미지` : `${item.name} 대표 메뉴 참고 이미지` }))
];
