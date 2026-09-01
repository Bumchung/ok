import { execFile } from "node:child_process";
import { access, mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const appDir = join(root, "istanbul-family-trip-2027");
const researchDir = join(appDir, "research");
const placeDir = join(appDir, "assets", "places-100");
const hotelDir = join(appDir, "assets", "hotels-30");
const manifestPath = join(appDir, "assets", "reusable-image-manifest.json");

async function readJsonl(name) {
  const content = await readFile(join(researchDir, name), "utf8");
  return content.trim().split("\n").filter(Boolean).map((line) => JSON.parse(line));
}

function slug(value) {
  return String(value).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("en-US").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const placeA = await readJsonl("places-candidates-a.jsonl");
const placeB = await readJsonl("places-candidates-b.jsonl");
const hotelA = await readJsonl("hotels-candidates-a.jsonl");
const hotelB = await readJsonl("hotels-candidates-b.jsonl");

const reusablePlace = (license) => /Wikimedia|\bCC(?:0| BY)|Public domain|No restrictions|Copyrighted free use/i.test(String(license || ""));
const reusableHotel = (image) => image?.reuse_status === "reusable_with_attribution" || /^yes/i.test(String(image?.public_app_use || ""));
const reusablePlaceUrlOverrides = new Map([
  ["ataturk-arboretum", "https://upload.wikimedia.org/wikipedia/commons/f/f1/Atat%C3%BCrkArboretum_%2829%29.jpg"],
  ["macka-democracy-park", "https://upload.wikimedia.org/wikipedia/commons/5/5b/Ma%C3%A7ka_Demokrasi_Park%C4%B1%2C_October_2021_%281%29.jpg"],
  ["istanbul-aquarium", "https://commons.wikimedia.org/wiki/Special:FilePath/%C4%B0stanbul_Akvaryumun_giri%C5%9Fi.jpg"]
]);
const linkOnlyPlaceIds = new Set([
  "cengelkoy-waterfront-neighbourhood", "buyukada", "heybeliada", "fenerbahce-park", "validebag-grove",
  "nezahat-gokyigit-botanical-garden", "belgrad-forest", "baltaliman-japanese-garden",
  "istanbul-aviation-museum", "maltepe-orhangazi-city-park", "fethi-pasa-grove", "mihrabat-grove"
]);
const linkOnlyHotelIds = new Set(["park-hyatt-macka-palas", "fairmont-quasar-istanbul"]);

const jobs = [
  ...placeA.filter((item) => reusablePlace(item.photo_license) && !linkOnlyPlaceIds.has(item.existing_id || item.id)).map((item) => ({
    group: "places",
    id: item.existing_id || item.id,
    url: reusablePlaceUrlOverrides.get(item.existing_id || item.id) || item.photo_url,
    destination: join(placeDir, `${item.existing_id || item.id}.jpg`),
    publicPath: `./assets/places-100/${item.existing_id || item.id}.jpg`
  })),
  ...placeB.filter((item) => reusablePlace(item.photo_license) && !linkOnlyPlaceIds.has(slug(item.en_name))).map((item) => ({
    group: "places",
    id: slug(item.en_name),
    url: reusablePlaceUrlOverrides.get(slug(item.en_name)) || item.photo_url,
    destination: join(placeDir, `${slug(item.en_name)}.jpg`),
    publicPath: `./assets/places-100/${slug(item.en_name)}.jpg`
  })),
  ...[...hotelA, ...hotelB].filter((item) => reusableHotel(item.image) && !linkOnlyHotelIds.has(item.id)).map((item) => ({
    group: "hotels",
    id: item.id,
    url: item.image.url || item.image.asset_url,
    destination: join(hotelDir, `${item.id}.jpg`),
    publicPath: `./assets/hotels-30/${item.id}.jpg`
  }))
];

await mkdir(placeDir, { recursive: true });
await mkdir(hotelDir, { recursive: true });
const tempDir = await mkdtemp(join(tmpdir(), "istanbul-images-"));
const manifest = { generatedAt: "2026-09-01", places: {}, hotels: {} };
const failures = [];

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function exists(path) {
  try { await access(path); return true; }
  catch { return false; }
}

async function fetchImage(job) {
  if (await exists(job.destination)) return;
  let lastError;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const isWikimedia = /(?:commons|upload)\.wikimedia\.org/.test(job.url);
      const directUrl = /commons\.wikimedia\.org\/wiki\/Special:(?:FilePath|Redirect\/file)/.test(job.url) && !job.url.includes("?")
        ? `${job.url}?width=1400`
        : job.url;
      const url = isWikimedia && attempt > 1
        ? `https://images.weserv.nl/?url=${encodeURIComponent(job.url)}&w=1200&output=jpg`
        : directUrl;
      const response = await fetch(url, { headers: { "User-Agent": "IstanbulFamilyPlanner/1.0 (image delivery verification)" }, redirect: "follow" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const sourcePath = join(tempDir, `${job.group}-${job.id}.source`);
      await writeFile(sourcePath, Buffer.from(await response.arrayBuffer()));
      await execFileAsync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "76", "--resampleWidth", "1200", sourcePath, "--out", job.destination]);
      return;
    } catch (error) {
      lastError = error;
      await delay(attempt * 1400);
    }
  }
  throw lastError;
}

let cursor = 0;
async function worker() {
  while (cursor < jobs.length) {
    const job = jobs[cursor];
    cursor += 1;
    try {
      await fetchImage(job);
      manifest[job.group][job.id] = job.publicPath;
      process.stdout.write(`ok ${job.group}/${job.id}\n`);
    } catch (error) {
      failures.push({ group: job.group, id: job.id, url: job.url, error: error.message });
      process.stderr.write(`fail ${job.group}/${job.id}: ${error.message}\n`);
    }
  }
}

await Promise.all([worker(), worker(), worker()]);
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`로컬 사진 ${Object.keys(manifest.places).length + Object.keys(manifest.hotels).length}장을 준비했습니다.`);
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exitCode = 1;
}
