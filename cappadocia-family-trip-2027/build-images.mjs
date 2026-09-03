import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { curatedImages } from "./curated-images.mjs";

const here = new URL(".", import.meta.url).pathname;
const checkedAt = "2026-09-03";

const placeQueries = {
  goreme_open_air: "Goreme Open Air Museum Cappadocia", dark_church: "Dark Church Goreme Cappadocia", tokali_church: "Tokali Church Goreme",
  zelve: "Zelve Open Air Museum Cappadocia", pasabag: "Pasabag Cappadocia fairy chimneys", devrent: "Devrent Valley Cappadocia", cavusin: "Cavusin village Cappadocia",
  uchisar_castle: "Uchisar Castle Cappadocia", pigeon_valley: "Pigeon Valley Cappadocia", love_valley: "Love Valley Cappadocia", red_valley: "Red Valley Cappadocia",
  rose_valley: "Rose Valley Cappadocia", goreme_panorama: "Goreme Cappadocia panorama balloons", ortahisar_castle: "Ortahisar Castle Cappadocia",
  three_beauties: "Three Beauties Urgup Cappadocia", avanos_pottery: "Avanos pottery Cappadocia", kizilirmak: "Kizilirmak river Avanos",
  nevsehir_museum: "Nevsehir Museum Cappadocia", kaymakli: "Kaymakli Underground City Cappadocia", derinkuyu: "Derinkuyu Underground City Cappadocia",
  ozkonak: "Ozkonak Underground City Cappadocia", ihlara: "Ihlara Valley Cappadocia", agacalti: "Agacalti Church Ihlara", belisirma: "Belisirma Ihlara Valley",
  selime: "Selime Cathedral Cappadocia", asikli_hoyuk: "Asikli Hoyuk Turkey", mustafapasa: "Mustafapasa Cappadocia", gomeda: "Gomeda Valley Cappadocia",
  soganli: "Soganli Valley Cappadocia", sobesos: "Sobesos ancient city Cappadocia"
};

const placeFallbackQueries = {
  dark_church: "Goreme cave church", tokali_church: "Goreme church fresco", nevsehir_museum: "Nevsehir Cappadocia museum",
  agacalti: "Ihlara cave church", asikli_hoyuk: "Aksaray archaeological site", gomeda: "Cappadocia valley",
  soganli: "Cappadocia rock church valley", sobesos: "Cappadocia mosaic archaeology"
};

const hotelQueries = {
  doubletree: "DoubleTree Avanos Cappadocia", kayakapi: "Kayakapi Premium Caves Cappadocia", marriott: "Cappadocia Marriott Hotel Nevsehir",
  ajwa: "AJWA Cappadocia Mustafapasa", kelebek: "Kelebek Cave Hotel Goreme", suhan: "Suhan Cappadocia Avanos", carus: "Carus Cappadocia Goreme",
  argos: "Argos in Cappadocia Uchisar", kappadoks: "Kappadoks Cave Hotel Uchisar", sultan: "Sultan Cave Suites Goreme",
  dinler: "Dinler Hotel Urgup Cappadocia", avanos_evi: "Avanos Evi Cappadocia"
};

const hotelFallbackQueries = {
  doubletree: "Avanos Cappadocia hotel", kayakapi: "Urgup Cappadocia stone hotel", marriott: "Nevsehir Cappadocia hotel",
  ajwa: "Mustafapasa Cappadocia hotel", kelebek: "Goreme Cappadocia hotel", suhan: "hotel indoor pool Turkey",
  carus: "Goreme cave hotel", argos: "Uchisar Cappadocia hotel", kappadoks: "Uchisar cave hotel",
  sultan: "Cappadocia cave terrace", dinler: "hotel room Turkey", avanos_evi: "Turkey hotel architecture"
};

const hotelFallbackLabels = {
  suhan: "숙소 시설 참고 이미지",
  dinler: "숙소 시설 참고 이미지",
  avanos_evi: "숙소 시설 참고 이미지"
};

const diningQueries = {
  seten: "Turkish meze Cappadocia", kilim: "testi kebab Cappadocia", shecooks: "Turkish home cooking table", ravioli: "Turkish manti ravioli",
  rocks: "Turkish mixed grill", lalinda: "Turkish pide and kebab", aysel: "Anatolian home cooking", afara: "Anatolian vegetarian food",
  seki: "modern Anatolian cuisine", nahita: "Cappadocia regional cuisine", lila: "fine dining Anatolian cuisine", millocal: "modern Turkish cuisine",
  revithia: "Turkish tasting menu", prokopi: "Turkish grill platter", ziggy: "Turkish meze plates", deringoller: "Turkish grilled meat",
  han: "Turkish buffet food", evranos: "Turkish dinner table", avanova: "Turkish restaurant food", bizim_ev: "Turkish home food",
  cafe_safak: "Turkish breakfast tea", omurca: "Turkish cave cafe", kings: "coffee cake cafe Turkey", coffeedocia: "coffee brunch Turkey",
  wish: "Cappadocia terrace tea", sakli_kahve: "Turkish coffee cezve", milestone: "specialty coffee cup", ceviz: "Turkish walnut dessert",
  kokhane: "Turkish bakery coffee", mado_avanos: "Turkish ice cream dessert"
};

const residenceQueries = {
  residence_kayakapi_120: "Kayakapi Cappadocia stone house", residence_kayakapi_308: "Kayakapi Cappadocia mansion",
  residence_ajwa: "Mustafapasa Cappadocia stone hotel", residence_avanos_evi: "Avanos Cappadocia stone house",
  residence_estates: "Goreme cave suites Cappadocia", residence_tafana: "Mustafapasa Cappadocia house"
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
  ...Object.entries(hotelQueries).map(([id, query]) => ({ id: `hotel_${id}`, query, fallback: hotelFallbackQueries[id], kind: "hotel", label: "숙소 또는 권역 참고 이미지", fallbackLabel: hotelFallbackLabels[id] || "숙소 권역 참고 이미지" })),
  ...Object.entries(diningQueries).map(([id, query]) => ({ id: `dining_${id}`, query, fallback: "Turkish cuisine", kind: "dining", label: "대표 메뉴 참고 이미지" })),
  ...Object.entries(residenceQueries).map(([id, query]) => ({ id, query, fallback: "Cappadocia stone house", kind: "residence", label: "숙소 구조 또는 권역 참고 이미지" }))
];

async function searchCommons(query) {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.search = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: query,
    gsrnamespace: "6",
    gsrlimit: "50",
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

const progressPath = join(here, ".image-progress.json");
let savedRecords = [];
try {
  savedRecords = JSON.parse(await readFile(progressPath, "utf8")).records || [];
} catch {
  savedRecords = [];
}
const usedUrls = new Set(savedRecords.map((record) => record.downloadUrl).filter(Boolean));
const records = [];
await mkdir(join(here, "assets", "cards"), { recursive: true });

for (const [index, request] of requests.entries()) {
  const saved = savedRecords.find((record) => record.id === request.id);
  if (saved) {
    try {
      const bytes = await readFile(join(here, saved.localPath));
      const hash = createHash("sha256").update(bytes).digest("hex");
      if (hash === saved.sha256 && bytes.length > 4_000) {
        records.push(saved);
        process.stdout.write(`${index + 1}/${requests.length} ${request.id} cached\n`);
        continue;
      }
    } catch {
      // Regenerate missing or changed cached files.
    }
  }
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
    downloadUrl: chosen.thumburl,
    originalUrl: chosen.url,
    license: chosen.extmetadata?.LicenseShortName?.value || "Wikimedia Commons file page",
    artist: String(chosen.extmetadata?.Artist?.value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    label: curated?.label || (usedFallback ? request.fallbackLabel || request.label : request.label),
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    checkedAt
  });
  await writeFile(progressPath, `${JSON.stringify({ records }, null, 2)}\n`);
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
await unlink(progressPath);
console.log(`Wrote ${records.length} unique images.`);
