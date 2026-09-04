import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

const api = "https://commons.wikimedia.org/w/api.php";
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchRetry(url, label, attempts = 5) {
  let error;
  for (let count = 0; count < attempts; count += 1) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "FamilyTripResearch/1.0 (GitHub Pages research artifact)" },
        signal: AbortSignal.timeout(15_000)
      });
      if (response.ok) return response;
      error = new Error(`${label}: HTTP ${response.status}`);
      if (response.status === 429) await wait(4_000 * (count + 1));
    } catch (caught) { error = caught; }
    await wait(1_000 * (count + 1));
  }
  throw error;
}

async function searchCommons(query) {
  const params = new URLSearchParams({ action: "query", generator: "search", gsrsearch: `filetype:bitmap ${query}`, gsrnamespace: "6", gsrlimit: "24", prop: "imageinfo", iiprop: "url|extmetadata", iiurlwidth: "960", format: "json", origin: "*" });
  const response = await fetchRetry(`${api}?${params}`, `Commons search ${query}`);
  const json = await response.json();
  return Object.values(json.query?.pages || {}).map((page) => ({ title: page.title, ...(page.imageinfo?.[0] || {}) })).filter((item) => item.thumburl && /\.(?:jpe?g|png|webp)(?:\?|$)/i.test(item.thumburl));
}

export async function buildImages({ here, checkedAt, requests }) {
  const cards = join(here, "assets", "cards");
  await mkdir(cards, { recursive: true });
  const progressPath = join(here, ".image-progress.json");
  let records = [];
  try { records = JSON.parse(await readFile(progressPath, "utf8")).records || []; } catch { records = []; }
  const usedUrls = new Set(records.map((item) => item.originalUrl || item.downloadUrl));
  for (let index = records.length; index < requests.length; index += 1) {
    const request = requests[index];
    const queries = [request.query, request.fallback, request.cityFallback, ...(request.extraFallbacks || [])].filter(Boolean);
    let chosen;
    let usedQuery = request.query;
    for (const query of queries) {
      const candidates = await searchCommons(query);
      chosen = candidates.find((item) => !usedUrls.has(item.url));
      if (chosen) { usedQuery = query; break; }
    }
    if (!chosen) throw new Error(`No unique image for ${request.id}: ${queries.join(" | ")}`);
    usedUrls.add(chosen.url);
    const downloadUrl = `https://commons.wikimedia.org/w/thumb.php?${new URLSearchParams({ f: chosen.title.replace(/^File:/, ""), w: "960" })}`;
    const response = await fetchRetry(downloadUrl, `Image ${request.id}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    const contentExtension = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" }[response.headers.get("content-type")?.split(";")[0]];
    const extension = (contentExtension || extname(new URL(chosen.url).pathname)).toLowerCase().replace(".jpeg", ".jpg");
    const safeExtension = [".jpg", ".png", ".webp"].includes(extension) ? extension : ".jpg";
    const filename = `${request.id}${safeExtension}`;
    await writeFile(join(cards, filename), bytes);
    records.push({
      id: request.id, kind: request.kind, query: usedQuery, localPath: `./assets/cards/${filename}`,
      sourcePage: chosen.descriptionurl, downloadUrl, originalUrl: chosen.url,
      license: chosen.extmetadata?.LicenseShortName?.value || "Wikimedia Commons file page",
      artist: String(chosen.extmetadata?.Artist?.value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
      label: request.label, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex"), checkedAt
    });
    await writeFile(progressPath, `${JSON.stringify({ records }, null, 2)}\n`);
    process.stdout.write(`${index + 1}/${requests.length} ${request.id}\n`);
    await wait(850);
  }
  const duplicateHashes = [...new Set(records.map((item) => item.sha256).filter((hash, index, all) => all.indexOf(hash) !== index))];
  if (duplicateHashes.length) throw new Error(`Duplicate image hashes: ${duplicateHashes.join(", ")}`);
  const expected = new Set(records.map((record) => record.localPath.split("/").at(-1)));
  for (const filename of await readdir(cards)) if (!expected.has(filename)) await unlink(join(cards, filename));
  const catalog = Object.fromEntries(records.map((record) => [record.id, { image: record.localPath, photoSource: record.sourcePage, photoLicense: record.license, photoLabel: record.label }]));
  await writeFile(join(here, "image-catalog.mjs"), `export const media = ${JSON.stringify(catalog, null, 2)};\n`);
  await writeFile(join(here, "image-manifest.json"), `${JSON.stringify({ checkedAt, count: records.length, duplicateHashes, records }, null, 2)}\n`);
  try { await unlink(progressPath); } catch { /* already absent */ }
  console.log(`Wrote ${records.length} unique images.`);
}
