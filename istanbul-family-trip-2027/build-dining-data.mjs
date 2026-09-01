import { readFile, writeFile } from "node:fs/promises";

const sources = [
  new URL("./research/dining-restaurants-60.jsonl", import.meta.url),
  new URL("./research/dining-cafes-40.jsonl", import.meta.url)
];
const imageManifest = JSON.parse(await readFile(new URL("./research/card-images.json", import.meta.url), "utf8"));
const diningImages = imageManifest.records.filter((item) => item.kind === "restaurant" || item.kind === "cafe");
const imageById = new Map(diningImages.map((item) => [item.id, item]));

const records = [];
const zoneLabels = {
  "Airport West": "공항 서부",
  "Asian Side": "아시아 남부",
  "Bosphorus Asia": "아시아 보스포루스",
  "Bosphorus Europe": "보스포루스 중부",
  "New City": "신시가지",
  "Old City": "구시가지"
};
const kidLabels = { excellent: "매우 높음", good: "높음", conditional: "조건부" };
for (const source of sources) {
  const text = await readFile(source, "utf8");
  for (const [index, line] of text.split(/\r?\n/).entries()) {
    if (!line.trim()) continue;
    try {
      const item = JSON.parse(line);
      const informationLabel = /(?:tripadvisor\.com|google\.com\/maps)/i.test(item.officialUrl) ? "정보 페이지" : "공식 정보";
      const photo = imageById.get(item.id);
      if (!photo || photo.status !== "verified") throw new Error(`missing verified dining photo: ${item.id}`);
      records.push({
        ...item,
        zone: zoneLabels[item.zone] || item.zone,
        kidFit: kidLabels[item.kidFit] || item.kidFit,
        informationLabel,
        image: photo.localPath,
        photoSource: photo.sourcePageUrl,
        photoLabel: photo.alt,
        photoCheckedAt: photo.checkedAt,
        photoMethod: photo.method
      });
    }
    catch (error) { throw new Error(`${source.pathname}:${index + 1} ${error.message}`); }
  }
}

records.sort((a, b) => a.rank - b.rank);
if (records.length !== 100) throw new Error(`expected 100 dining records, received ${records.length}`);
if (records.filter((item) => item.type === "restaurant").length !== 60) throw new Error("expected 60 restaurants");
if (records.filter((item) => item.type === "cafe").length !== 40) throw new Error("expected 40 cafes");
if (new Set(records.map((item) => item.id)).size !== records.length) throw new Error("duplicate dining id");
if (new Set(records.map((item) => item.name)).size !== records.length) throw new Error("duplicate dining name");
if (diningImages.length !== records.length || imageManifest.duplicateHashes.length) throw new Error("dining image manifest must contain 100 unique verified records");
for (const [index, item] of records.entries()) {
  if (item.rank !== index + 1) throw new Error(`dining ranks must be 1..100; received ${item.rank} at index ${index}`);
  if (item.type === "restaurant" && item.rank > 60) throw new Error(`restaurant rank out of range: ${item.rank}`);
  if (item.type === "cafe" && item.rank < 61) throw new Error(`cafe rank out of range: ${item.rank}`);
  if (!(item.lat >= 40.8 && item.lat <= 41.3 && item.lng >= 28.7 && item.lng <= 29.3)) throw new Error(`coordinate outside Istanbul bounds: ${item.id}`);
  for (const key of ["id", "name", "zone", "neighborhood", "cuisine", "priceBand", "kidFit", "meal", "why", "reviewCaution", "reservation", "status"]) {
    if (typeof item[key] !== "string" || !item[key].trim()) throw new Error(`missing ${key}: ${item.id}`);
  }
  if (item.checkedAt !== "2026-09-01") throw new Error(`unexpected checkedAt: ${item.id}`);
  if (!/^https?:\/\//.test(item.officialUrl)) throw new Error(`invalid information URL: ${item.id}`);
  if (!/^https:\/\/www\.google\.com\/maps\//.test(item.mapsUrl)) throw new Error(`invalid maps URL: ${item.id}`);
  if (!/^https?:\/\//.test(item.reviewSourceUrl)) throw new Error(`invalid review source URL: ${item.id}`);
  if (!/^\.\/assets\/card-images\/.+\.webp$/.test(item.image)) throw new Error(`invalid local image: ${item.id}`);
  if (!/^https?:\/\//.test(item.photoSource)) throw new Error(`invalid photo source: ${item.id}`);
  if (!Array.isArray(item.reviewPros) || item.reviewPros.length < 2) throw new Error(`insufficient review signals: ${item.id}`);
  if (!/(?:9인|9명)/.test(item.reservation)) throw new Error(`reservation must state a nine-person action: ${item.id}`);
}

const content = `// Generated from reviewed JSONL research. Run npm run build:dining after source updates.\nexport const diningSpots = ${JSON.stringify(records, null, 2)};\n`;
await writeFile(new URL("./dining-catalog.mjs", import.meta.url), content, "utf8");
console.log(`wrote ${records.length} dining records`);
