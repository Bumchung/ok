import { createHash } from "node:crypto";
import { mkdir, readdir, unlink, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { curatedImages } from "./curated-images.mjs";

const here = new URL(".", import.meta.url).pathname;
const checkedAt = "2026-09-03";

const placeQueries = {
  kaleici: "Antalya Kaleici",
  hadrians: "Hadrian's Gate Antalya",
  old_harbor: "Yat Limanı Kaleiçi Antalya",
  hidirlik: "Hidirlik Tower Antalya",
  karaalioglu: "Karaalioglu Park Antalya",
  yivli: "Yivli Minare Antalya",
  toy_museum: "Antalya Toy Museum",
  suna_inan: "Suna Inan Kirac Museum Antalya",
  ataturk_house: "Ataturk House Museum Antalya",
  culture_center: "Antalya Clock Tower",
  aquarium: "Antalya Aquarium",
  konyaalti: "Konyaalti beach Antalya",
  ataturk_park: "Atatürk Kültür Parkı Antalya",
  glass_pyramid: "Glass Pyramid Antalya",
  aktur: "Aktur Park Antalya",
  lower_duden: "Lower Duden waterfall Antalya",
  lara_beach: "Lara Beach Antalya",
  sandland: "Sandland Internationales Sandskulpturenfestival Lara Antalya",
  terracity: "Lara Antalya city buildings",
  perge: "Perge ancient city",
  aspendos: "Aspendos theatre",
  termessos: "Amphitheatre Termessos",
  kursunlu: "Kursunlu waterfall Antalya",
  upper_duden: "Upper Duden waterfall Antalya",
  phaselis: "Phaselis ancient city",
  side: "Temple Apollo Side Wide",
  antalya_museum: "Antalya Museum",
  nekropol: "Antalya Nekropol Müzesi",
  dokumapark: "Antalya Dokumapark",
  science_center: "Antalya Bilim Merkezi Dokumapark"
};

const placeFallbackQueries = {
  culture_center: "Atatürk Culture Park Antalya",
  aktur: "Antalya amusement park",
  sandland: "Lara Beach Antalya",
  terracity: "Antalya Lara",
  nekropol: "Antalya city museum",
  dokumapark: "Antalya city park",
  science_center: "Antalya science museum"
};

const hotelQueries = {
  akra: "Akra Hotel Antalya",
  megasaray: "Konyaalti Antalya hotel",
  rixos_downtown: "Rixos Downtown Antalya",
  hotel_su: "Hotel Su Antalya",
  doubletree: "Antalya city hotel",
  ramada_plaza: "Ramada Plaza Antalya",
  porto_bello: "Porto Bello Hotel Antalya",
  lara_barut: "Lara Barut Antalya",
  concorde: "Concorde De Luxe Antalya",
  ic_green: "Antalya Lara resort",
  mardan: "Mardan Palace Antalya",
  marmara: "The Marmara Antalya"
};

const diningQueries = {
  seven_mehmet: "Turkish grilled lamb food",
  asmani: "Mediterranean seafood Turkey",
  piyazci_ahmet: "Antalya piyaz dish",
  topcu: "Turkish kebab plate",
  parlak: "Turkish roast chicken food",
  tiritcizade: "Tirit Turkish food",
  seraser: "Turkish restaurant food",
  ayar: "Turkish meze table",
  yemenli: "Turkish seafood meze",
  arma: "Mediterranean fish dish Turkey",
  lara_balik: "Turkish grilled sea bass",
  balikci_kaleici: "Turkish fish meze",
  sultanyar: "Turkish kebab platter",
  vahap_usta: "Turkish mixed grill",
  pasa_bey: "Adana kebab plate",
  kosk_kebap: "Turkish doner kebab",
  can_can: "Turkish pide",
  sisci_ramazan: "Turkish shish kebab",
  pablito: "Mediterranean brunch food",
  grill_house: "Turkish steak dish",
  sudd_lara: "Turkish coffee cafe",
  sudd_konyaalti: "coffee shop latte",
  schiller: "coffee and cake cafe",
  varuna: "Turkish breakfast food",
  rokka: "Turkish gozleme breakfast",
  arabica_lara: "espresso cafe",
  beaver: "specialty coffee cup",
  soulmate: "cafe dessert Turkey",
  yemen_kahvesi: "Turkish coffee cezve",
  demlik: "Turkish tea cafe"
};

const residenceQueries = {
  residence_kaleici: "Kaleici Antalya house",
  residence_konyaalti: "Konyaalti Antalya apartment buildings",
  residence_lara: "Lara Antalya residential buildings",
  villa_falez: "Antalya Mediterranean house",
  residence_harbor: "Kaleici Antalya harbor houses",
  apartment_center: "Antalya city buildings"
};

const requests = [
  ...Object.entries(placeQueries).map(([id, query]) => ({
    id,
    query,
    fallback: placeFallbackQueries[id],
    fallbackLabel: "권역 참고 이미지",
    kind: "place",
    label: "실제 장소 사진"
  })),
  ...Object.entries(hotelQueries).map(([id, query]) => ({ id: `hotel_${id}`, query, fallback: "Antalya hotel", kind: "hotel", label: "숙소 또는 권역 참고 이미지" })),
  ...Object.entries(diningQueries).map(([id, query]) => ({ id: `dining_${id}`, query, fallback: "Turkish cuisine", kind: "dining", label: "대표 메뉴 참고 이미지" })),
  ...Object.entries(residenceQueries).map(([id, query]) => ({ id, query, fallback: "Antalya architecture", kind: "residence", label: "숙소 권역 참고 이미지" }))
];

async function searchCommons(query) {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.search = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: query,
    gsrnamespace: "6",
    gsrlimit: "40",
    prop: "imageinfo",
    iiprop: "url|extmetadata",
    iiurlwidth: "960",
    format: "json",
    origin: "*"
  });
  const response = await fetchWithRetry(url, `Commons search for ${query}`);
  const payload = await response.json();
  return Object.values(payload.query?.pages || {}).flatMap((page) => {
    const info = page.imageinfo?.[0];
    if (!info?.thumburl || !/\.(?:jpe?g|png|webp)(?:$|\?)/i.test(info.thumburl)) return [];
    if (!/\.(?:jpe?g|png|webp|tiff?)$/i.test(page.title)) return [];
    return [{ title: page.title, ...info }];
  });
}

async function fetchCommonsFile(title) {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.search = new URLSearchParams({
    action: "query",
    titles: `File:${title}`,
    prop: "imageinfo",
    iiprop: "url|extmetadata",
    iiurlwidth: "960",
    format: "json",
    origin: "*"
  });
  const response = await fetchWithRetry(url, `Commons file ${title}`);
  const payload = await response.json();
  const page = Object.values(payload.query?.pages || {})[0];
  const info = page?.imageinfo?.[0];
  if (!info?.thumburl || !info?.descriptionurl) throw new Error(`Commons file unavailable: ${title}`);
  return { title: page.title, ...info };
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fetchWithRetry(url, label, attempt = 0) {
  const response = await fetch(url, { headers: { "User-Agent": "BumchungFamilyTrip/1.0 (family itinerary; contact via github.com/bumchung)" } });
  if (response.ok) return response;
  if ((response.status === 429 || response.status >= 500) && attempt < 6) {
    const retryAfter = Number(response.headers.get("retry-after"));
    const delay = Number.isFinite(retryAfter) && retryAfter > 0
      ? retryAfter * 1000
      : Math.min(45_000, 2_000 * (2 ** attempt));
    process.stdout.write(`retry ${attempt + 1}/6 after ${delay}ms: ${label}\n`);
    await wait(delay);
    return fetchWithRetry(url, label, attempt + 1);
  }
  throw new Error(`${label}: HTTP ${response.status}`);
}

const usedUrls = new Set();
const records = [];
await mkdir(join(here, "assets", "cards"), { recursive: true });

for (const [index, request] of requests.entries()) {
  const curated = curatedImages[request.id];
  let candidates = curated ? [await fetchCommonsFile(curated.title)] : await searchCommons(request.query);
  let usedFallback = false;
  if (!curated && !candidates.some((item) => !usedUrls.has(item.thumburl)) && request.fallback) {
    candidates = [...candidates, ...(await searchCommons(request.fallback))];
    usedFallback = true;
  }
  const chosen = candidates.find((item) => !usedUrls.has(item.thumburl));
  if (!chosen) throw new Error(`No unique image for ${request.id}: ${request.query}`);
  usedUrls.add(chosen.thumburl);
  const response = await fetchWithRetry(chosen.thumburl, `Image download for ${request.id}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const extension = extname(new URL(chosen.thumburl).pathname).toLowerCase().replace(".jpeg", ".jpg") || ".jpg";
  const filename = `${request.id}${[".jpg", ".png", ".webp"].includes(extension) ? extension : ".jpg"}`;
  await writeFile(join(here, "assets", "cards", filename), bytes);
  records.push({
    id: request.id,
    kind: request.kind,
    query: request.query,
    localPath: `./assets/cards/${filename}`,
    sourcePage: chosen.descriptionurl,
    originalUrl: chosen.url,
    license: chosen.extmetadata?.LicenseShortName?.value || "Wikimedia Commons file page",
    artist: String(chosen.extmetadata?.Artist?.value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    label: curated?.label || (usedFallback ? request.fallbackLabel || request.label : request.label),
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    checkedAt
  });
  process.stdout.write(`${index + 1}/${requests.length} ${request.id}\n`);
  await wait(450);
}

const duplicateHashes = [...new Set(records.map((item) => item.sha256).filter((hash, index, all) => all.indexOf(hash) !== index))];
if (duplicateHashes.length) throw new Error(`Duplicate image hashes: ${duplicateHashes.join(", ")}`);

const expectedFiles = new Set(records.map((record) => record.localPath.split("/").at(-1)));
for (const filename of await readdir(join(here, "assets", "cards"))) {
  if (!expectedFiles.has(filename)) await unlink(join(here, "assets", "cards", filename));
}

const catalog = Object.fromEntries(records.map((record) => [record.id, {
  image: record.localPath,
  photoSource: record.sourcePage,
  photoLicense: record.license,
  photoLabel: record.label
}]));
await writeFile(join(here, "image-catalog.mjs"), `export const media = ${JSON.stringify(catalog, null, 2)};\n`);
await writeFile(join(here, "image-manifest.json"), `${JSON.stringify({ checkedAt, count: records.length, duplicateHashes, records }, null, 2)}\n`);
console.log(`Wrote ${records.length} unique images.`);
