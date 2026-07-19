import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(directory, "index.html"), "utf8");
const guideSource = fs.readFileSync(path.join(directory, "venue-guide-data.js"), "utf8");

function extractPoiArray(name) {
  const match = html.match(new RegExp(`const ${name} = (\\[[\\s\\S]*?\\n    \\]);`));
  if (!match) throw new Error(`Unable to find ${name} in index.html`);
  return vm.runInNewContext(match[1]);
}

const sandbox = { window: {} };
vm.runInNewContext(guideSource, sandbox);

const guides = sandbox.window.SYDNEY_VENUE_GUIDE;
const pois = extractPoiArray("poiTop50").concat(extractPoiArray("poiExtra50"));
const poiByRank = new Map(pois.map((poi) => [Number(poi.rank), poi]));

if (!Array.isArray(guides) || guides.length !== 100 || pois.length !== 100) {
  throw new Error("Map exports require exactly 100 guide and POI records");
}

const records = guides.map((guide) => {
  const poi = poiByRank.get(Number(guide.rank));
  const facts = [
    guide.description_ko,
    guide.hours_summary_ko,
    guide.reservation_summary_ko
  ].filter(Boolean).join(" ");
  let status = "방문 후보";
  if (/폐점|영업을 종료|영구 폐쇄|예약 불가/.test(facts)) status = "방문 불가";
  if (/성인 전용|전원 만 18세 이상|미성년자.{0,12}(입장 불가|출입 불가|동반 불가)/.test(facts)) status = "가족 제외";

  const latitude = Number(guide.lat);
  const longitude = Number(guide.lng);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error(`#${guide.rank} ${guide.name} is missing coordinates`);
  }

  return {
    rank: Number(guide.rank),
    name: guide.name,
    kind: poi?.kind || "기타",
    area: poi?.area || "",
    status,
    address: guide.address || "",
    latitude,
    longitude,
    description: guide.description_ko || "",
    hours: guide.hours_summary_ko || "",
    reservation: guide.reservation_summary_ko || "",
    bookingUrl: guide.booking_url || "",
    officialUrl: guide.official_url || "",
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(guide.address || guide.query || guide.name)}`
  };
});

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

const csvHeaders = [
  "순위",
  "장소명",
  "종류",
  "권역",
  "상태",
  "주소",
  "위도",
  "경도",
  "어떤 곳인지",
  "여행 중 영업시간",
  "9인 예약 원칙",
  "Google Maps",
  "예약",
  "공식 사이트"
];
const csvRows = records.map((record) => [
  record.rank,
  record.name,
  record.kind,
  record.area,
  record.status,
  record.address,
  record.latitude,
  record.longitude,
  record.description,
  record.hours,
  record.reservation,
  record.googleMapsUrl,
  record.bookingUrl,
  record.officialUrl
]);
const csv = [csvHeaders, ...csvRows].map((row) => row.map(csvCell).join(",")).join("\n");

function xml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function styleId(record) {
  if (record.status !== "방문 후보") return "pin-muted";
  if (record.kind === "카페") return "pin-cafe";
  if (record.kind === "명소") return "pin-attraction";
  return "pin-restaurant";
}

const kmlStyles = [
  ["pin-restaurant", "red-dot"],
  ["pin-cafe", "blue-dot"],
  ["pin-attraction", "green-dot"],
  ["pin-muted", "grey-dot"]
].map(([id, icon]) => `
    <Style id="${id}">
      <IconStyle>
        <scale>1.05</scale>
        <Icon><href>https://maps.google.com/mapfiles/ms/icons/${icon}.png</href></Icon>
      </IconStyle>
    </Style>`).join("");

const placemarks = records.map((record) => `
    <Placemark>
      <name>${xml(`#${record.rank} ${record.name}`)}</name>
      <styleUrl>#${styleId(record)}</styleUrl>
      <description>${xml([
        `${record.kind} · ${record.area} · ${record.status}`,
        record.description,
        `주소: ${record.address}`,
        `영업시간: ${record.hours}`,
        `9인 예약: ${record.reservation}`,
        `Google Maps: ${record.googleMapsUrl}`,
        record.bookingUrl ? `예약: ${record.bookingUrl}` : "",
        record.officialUrl ? `공식: ${record.officialUrl}` : ""
      ].filter(Boolean).join("\n\n"))}</description>
      <ExtendedData>
        <Data name="순위"><value>${record.rank}</value></Data>
        <Data name="종류"><value>${xml(record.kind)}</value></Data>
        <Data name="권역"><value>${xml(record.area)}</value></Data>
        <Data name="상태"><value>${xml(record.status)}</value></Data>
        <Data name="주소"><value>${xml(record.address)}</value></Data>
      </ExtendedData>
      <Point><coordinates>${record.longitude},${record.latitude},0</coordinates></Point>
    </Placemark>`).join("");

const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>시드니 가족여행 100곳</name>
    <description>2026년 7월 가족여행용 식당·카페·명소 100곳. 2026-07-19 기준 현재 운영 중이며 아이와 함께 방문 가능한 후보만 담았습니다.</description>${kmlStyles}${placemarks}
  </Document>
</kml>
`;

fs.writeFileSync(path.join(directory, "sydney-family-trip-100-places.csv"), `\uFEFF${csv}\n`);
fs.writeFileSync(path.join(directory, "sydney-family-trip-100-places.kml"), kml);

if (process.argv.includes("--sheet-json")) {
  console.log(JSON.stringify([csvHeaders, ...csvRows]));
} else {
  console.log(JSON.stringify({
    records: records.length,
    coordinates: records.filter((record) => Number.isFinite(record.latitude) && Number.isFinite(record.longitude)).length,
    csv: "sydney-family-trip-100-places.csv",
    kml: "sydney-family-trip-100-places.kml"
  }));
}
