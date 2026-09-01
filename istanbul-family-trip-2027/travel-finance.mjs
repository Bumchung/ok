import { airbnbSearch } from "./airbnb-catalog.mjs";

export const financeCheckedAt = "2026-09-01";

function observedAirbnbStay({ id, listingId, label }) {
  const listing = airbnbSearch.options.find((item) => item.listingId === listingId);
  if (!listing || listing.availability !== "available_exact" || !Number.isFinite(listing.exactTotal)) throw new Error(`Airbnb budget source is not an exact available listing: ${listingId}`);
  return {
    id,
    label,
    listingId,
    familyTotal: listing.exactTotal,
    status: listing.availability,
    sourceUrl: listing.url,
    observedAt: listing.observedAt,
    cancellation: listing.cancellation,
    note: `9인, 10박 총액 ${listing.price} 관측값입니다. ${listing.caution}`
  };
}

export const decisionChecklist = [
  { id: "stay", label: "숙소 형태", detail: "한 집 1채와 호텔 4실 중 하나를 먼저 고릅니다.", href: "#stay" },
  { id: "flights", label: "두 출발지 직항", detail: "ICN 5명과 LAX 4명은 도착 시각보다 변경 가능한 직항을 우선합니다.", href: "#family" },
  { id: "rooms", label: "9인 침대와 욕실", detail: "침대 7개 이상, 욕실 2개 이상, 엘리베이터와 난방을 서면으로 확인합니다.", href: "#airbnb" },
  { id: "meals", label: "9인 핵심 식사", detail: "저녁을 전부 예약하지 말고 인기 점심 3곳만 먼저 잡습니다.", href: "#dining" }
];

export const budgetModel = {
  people: 9,
  nights: 10,
  currency: "KRW",
  defaultStay: "airbnb_kabatas_exact",
  defaultOrigin: "icn",
  sharedLines: [
    { id: "dining", label: "식사와 카페", familyTotal: 9000000, note: "하루 1인 10만원. 아침 일부 취사, 점심과 저녁은 외식 기준입니다." },
    { id: "experiences", label: "입장권과 체험", familyTotal: 4500000, note: "궁전, 박물관, 유람선과 아이 체험을 포함한 예산선입니다." },
    { id: "transport", label: "공항과 시내 이동", familyTotal: 3500000, note: "공항 왕복 2팀, 9인 밴 또는 밴 2대, 택시와 대중교통을 섞습니다." },
    { id: "support", label: "보험, 통신, 세탁", familyTotal: 1200000, note: "여행자 보험과 eSIM, 세탁, 작은 의료비를 포함합니다." }
  ],
  contingencyRate: 0.1,
  stayOptions: [
    observedAirbnbStay({ id: "airbnb_kabatas_exact", listingId: "31092297", label: "Airbnb 카바타쉬 4BR" }),
    observedAirbnbStay({ id: "airbnb_sisli_exact", listingId: "1585341457182878132", label: "Airbnb 시슬리 4BR" }),
    observedAirbnbStay({ id: "airbnb_ortakoy_exact", listingId: "733361398293897874", label: "Airbnb 오르타쾨이 4BR" }),
    {
      id: "cvk_observed",
      label: "CVK 4베드룸 관측값",
      familyTotal: 9565811,
      status: "observed_once_not_reproduced",
      note: "10박 EUR 6,030을 2026-08-31 ECB 환율로 환산했습니다. 한 번 관측됐지만 재조회되지 않아 예약가는 아닙니다."
    },
    {
      id: "swiss_exact",
      label: "Swissôtel 호텔 4실",
      familyTotal: 12437141,
      status: "observed_exact_arithmetic",
      note: "공식 사이트 EUR 196, 1실 1박을 4실과 10박으로 계산했습니다. 세금 포함, 조식 제외, 환불 불가입니다."
    },
    {
      id: "luxury_allowance",
      label: "럭셔리 호텔 4실 여유안",
      familyTotal: 20000000,
      status: "planning_allowance",
      note: "같은 층 배정, 조식과 취소 가능 운임을 고를 때의 계획값입니다. 호텔별 확정 견적은 아닙니다."
    }
  ],
  origins: [
    { id: "icn", label: "ICN 출발 1인", people: 5, flightPerPerson: 1750000, range: "140만~220만원", note: "실시간 결제 견적이 아닌 계획 중간값입니다. 직항, 위탁수하물, 좌석 지정과 변경 조건을 같게 두고 다시 조회합니다." },
    { id: "lax", label: "LAX 출발 1인", people: 4, flightPerPerson: 2150000, range: "170만~270만원", note: "실시간 결제 견적이 아닌 계획 중간값입니다. 직항, 위탁수하물, 좌석 지정과 변경 조건을 같게 두고 다시 조회합니다." }
  ]
};

export const fxStrategy = {
  checkedAt: financeCheckedAt,
  sourceDate: "2026-08-31",
  rates: {
    eurKrw: 1586.37,
    eurTry: 55.9648,
    tryKrw: 28.3458531077,
    yearEnd2025TryKrw: 33.6136,
    nominalChangeSinceYearEndPct: -15.67,
    turkeyPriceChangeSinceYearEndPct: 19.86,
    combinedCostChangePct: 1.08,
    julyFirstTryKrw: 33.3838416161,
    changeSinceJulyFirstPct: -15.0910987607
  },
  headline: "명목 환율은 좋아졌지만, 현지 물가까지 넣으면 할인은 아직 없습니다.",
  diagnosis: "2025년 말보다 8월 31일의 1리라 원화값은 15.67% 낮습니다. 여기에 2025년 12월부터 2026년 7월까지의 터키 CPI 19.86%를 단순 결합하면 원화 비용지수는 오히려 약 1.08% 높습니다. 환율 기준일보다 물가 기준월이 한 달 이르고 여행 바스켓과 CPI 바스켓도 다르므로 가격 추정값이 아니라 환율 할인 착시를 반박하는 점검값으로만 씁니다.",
  actions: [
    { rank: 1, title: "현장 결제는 TRY", body: "단말기나 ATM이 원화를 제시하면 DCC를 거절하고 현지 통화 TRY를 선택합니다.", tone: "do" },
    { rank: 2, title: "EUR 호텔은 환율 이익에서 제외", body: "공식가가 EUR인 호텔은 리라 약세와 무관합니다. 취소 가능 여부와 총 EUR만 비교합니다.", tone: "watch" },
    { rank: 3, title: "무료취소 숙소를 먼저 잠금", body: "지금은 취소 가능한 객실이나 숙소를 확보하고, 2026년 11월과 2027년 1월에 같은 조건으로 다시 견적합니다.", tone: "do" },
    { rank: 4, title: "현금은 2일치만", body: "공항 환전 대신 시중 은행 ATM에서 소액을 뽑고, ATM 자체 환전은 거절합니다. 카드 해외 이용 수수료는 발급사에서 확인합니다.", tone: "do" },
    { rank: 5, title: "동일 조건 5% 차이에서만 교체", body: "무료취소 예약은 계약 통화, 세금, 조식과 객실이 같을 때 원화 총액이 5% 이상 낮으면 바꿉니다. 환불 불가는 10% 이상 낮아야 봅니다.", tone: "rule" }
  ],
  sources: [
    { title: "ECB 2026-08-31 기준 환율", url: "https://www.ecb.europa.eu/stats/exchange/eurofxref/shared/pdf/2026/08/20260831.pdf" },
    { title: "ECB 2025-12-31 기준 환율", url: "https://www.ecb.europa.eu/stats/exchange/eurofxref/shared/pdf/2025/12/20251231.pdf" },
    { title: "ECB 원화 기준 환율 기록", url: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/eurofxref-graph-krw.en.html" },
    { title: "ECB 터키 리라 기준 환율 기록", url: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/eurofxref-graph-try.en.html" },
    { title: "터키 통계청 2026년 7월 CPI", url: "https://veriportali.tuik.gov.tr/en/press/58297" },
    { title: "Visa DCC 안내", url: "https://www.visa.com/en-us/personal/travel/dynamic-currency-conversion" },
    { title: "터키 중앙은행 2026년 3분기 물가 설명", url: "https://tcmb.gov.tr/wps/wcm/connect/EN/TCMB%2BEN/Main%2BMenu/Announcements/Remarks%2Bby%2BGovernor/2026/SpeechG13_08_2026" }
  ]
};
