import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { curatedImages } from "./curated-images.mjs";

const here = new URL(".", import.meta.url).pathname;
const manifestPath = join(here, "image-manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const requestedIds = new Set(process.argv.slice(2));
const repairEntries = Object.entries(curatedImages).filter(([id]) => !requestedIds.size || requestedIds.has(id));
if (requestedIds.size && repairEntries.length !== requestedIds.size) {
  const missing = [...requestedIds].filter((id) => !curatedImages[id]);
  throw new Error(`Unknown curated image ids: ${missing.join(", ")}`);
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fetchWithRetry(url, label, attempt = 0) {
  const response = await fetch(url, {
    headers: { "User-Agent": "BumchungFamilyTrip/1.0 (family itinerary; contact via github.com/bumchung)" }
  });
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
  return { page, info };
}

for (const [id, curated] of repairEntries) {
  const record = manifest.records.find((item) => item.id === id);
  if (!record) throw new Error(`Manifest record unavailable: ${id}`);
  const { page, info } = await fetchCommonsFile(curated.title);
  const response = await fetchWithRetry(info.thumburl, `Image download for ${id}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(join(here, record.localPath), bytes);
  Object.assign(record, {
    query: `File:${curated.title}`,
    sourcePage: info.descriptionurl,
    originalUrl: info.url,
    license: info.extmetadata?.LicenseShortName?.value || "Wikimedia Commons file page",
    artist: String(info.extmetadata?.Artist?.value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    label: curated.label,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex")
  });
  process.stdout.write(`${id}: ${page.title}\n`);
  await wait(450);
}

const duplicateHashes = [...new Set(manifest.records.map((item) => item.sha256).filter((hash, index, all) => all.indexOf(hash) !== index))];
if (duplicateHashes.length) throw new Error(`Duplicate image hashes: ${duplicateHashes.join(", ")}`);
manifest.duplicateHashes = duplicateHashes;

const catalog = Object.fromEntries(manifest.records.map((record) => [record.id, {
  image: record.localPath,
  photoSource: record.sourcePage,
  photoLicense: record.license,
  photoLabel: record.label
}]));
await writeFile(join(here, "image-catalog.mjs"), `export const media = ${JSON.stringify(catalog, null, 2)};\n`);
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Repaired ${repairEntries.length} curated images.`);
