import { readFile, writeFile } from "node:fs/promises";

const source = new URL("./research/airbnb-9guests.jsonl", import.meta.url);
const imageManifestSource = new URL("./research/card-images.json", import.meta.url);
const [text, imageManifestText] = await Promise.all([
  readFile(source, "utf8"),
  readFile(imageManifestSource, "utf8")
]);
const imageManifest = JSON.parse(imageManifestText);
const imageRecords = imageManifest.records.filter((item) => item.kind === "airbnb");
const imageById = new Map(imageRecords.map((item) => [item.id, item]));
const rawRecords = text.split(/\r?\n/).filter(Boolean).map((line, index) => {
  try { return JSON.parse(line); }
  catch (error) { throw new Error(`${source.pathname}:${index + 1} ${error.message}`); }
});

const priority = [
  "31092297",
  "1585341457182878132",
  "733361398293897874",
  "1283892058506904338",
  "1248360830079976262",
  "1665364785885022959",
  "1751016276471845889",
  "37868735",
  "886052227843874450",
  "1329307242595134008",
  "1150573948484205391",
  "1155770524163347634",
  "905809",
  "2320332",
  "726854148956034383"
];
const order = new Map(priority.map((id, index) => [id, index]));

if (rawRecords.length !== 15) throw new Error(`expected 15 Airbnb records, received ${rawRecords.length}`);
if (new Set(rawRecords.map((item) => item.listing_id)).size !== rawRecords.length) throw new Error("duplicate Airbnb listing id");
if (priority.length !== rawRecords.length || new Set(priority).size !== priority.length || rawRecords.some((item) => !order.has(item.listing_id))) throw new Error("Airbnb priority list does not cover every listing exactly once");
if (rawRecords.filter((item) => item.availability.status === "available_exact").length !== 12) throw new Error("expected 12 available Airbnb records");
if (rawRecords.filter((item) => item.availability.status === "unavailable_exact").length !== 3) throw new Error("expected 3 unavailable Airbnb records");
if (imageRecords.length !== rawRecords.length || imageRecords.some((item) => item.status !== "verified")) throw new Error("Airbnb image manifest must contain 15 verified records");

const options = rawRecords
  .sort((a, b) => order.get(a.listing_id) - order.get(b.listing_id))
  .map((item, index) => {
    const photo = imageById.get(item.id);
    if (!photo) throw new Error(`missing Airbnb photo: ${item.id}`);
    const available = item.availability.status === "available_exact";
    const baths = Number(item.space.bathrooms);
    const fit = !available ? "제외" : item.space.bedrooms >= 4 && baths >= 2 ? "상" : baths >= 2 ? "중" : "조건부";
    const exactTotal = item.price.total;
    return {
      rank: index + 1,
      id: item.id,
      listingId: item.listing_id,
      name: item.name,
      neighborhood: item.space.neighborhood,
      capacity: item.space.max_guests,
      bedrooms: item.space.bedrooms,
      beds: item.space.beds,
      baths: item.space.bathrooms,
      rating: item.quality.rating,
      reviews: item.quality.review_count,
      fit,
      reason: item.family_fit.strengths,
      caution: item.family_fit.constraints,
      availability: item.availability.status,
      availabilityEvidence: item.availability.evidence,
      availabilityLimit: item.availability.limitations,
      exactTotal,
      nightlyAverage: available ? Math.round(exactTotal / item.stay.nights) : null,
      price: available ? `${exactTotal.toLocaleString("ko-KR")}원` : "요청 일정 예약 불가",
      priceEvidence: item.price.evidence,
      taxesAndFees: available ? "세금과 서비스 수수료 별도 내역 미표시" : "가격 미표시",
      cancellation: available ? (item.cancellation.policy_summary || "취소 조건 미표시") : "현재 예약 불가 상태라 이 일정의 취소 조건을 확정할 수 없습니다.",
      cancellationStatus: item.cancellation.status,
      cancellationLimit: item.cancellation.limitations,
      referenceCancellation: !available ? item.cancellation.policy_summary : null,
      freeCancellationUntil: item.cancellation.free_cancellation_until,
      observedAt: item.observed_at,
      url: item.date_query_url,
      image: photo.localPath,
      photoSource: photo.sourcePageUrl,
      photoLabel: photo.alt,
      photoCheckedAt: photo.checkedAt,
      photoMethod: photo.method
    };
  });

const totals = options.filter((item) => item.exactTotal).map((item) => item.exactTotal);
const airbnbSearch = {
  checkedAt: "2026-09-01",
  stay: "2027-03-21부터 03-31, 10박",
  guests: "성인 6명, 어린이 3명, 총 9명",
  searchUrl: rawRecords[0].search_url,
  caveat: "목표 날짜, 9인, 10박으로 예약 버튼과 원화 총액이 함께 보인 12곳만 가격 확인으로 분류했습니다. 3곳은 날짜 또는 최소 숙박일 때문에 제외했습니다. 실시간 재고와 총액은 결제 전에 다시 확인해야 합니다.",
  exactAvailableCount: 12,
  unavailableCount: 3,
  lowestExactTotal: Math.min(...totals),
  highestExactTotal: Math.max(...totals),
  options
};

const content = `// Generated from date-specific Airbnb research. Run npm run build:airbnb after source updates.\nexport const airbnbSearch = ${JSON.stringify(airbnbSearch, null, 2)};\n`;
await writeFile(new URL("./airbnb-catalog.mjs", import.meta.url), content, "utf8");
console.log(`wrote ${options.length} Airbnb records: ${airbnbSearch.exactAvailableCount} available, ${airbnbSearch.unavailableCount} unavailable`);
