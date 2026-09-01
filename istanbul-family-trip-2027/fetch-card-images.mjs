import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const here = new URL(".", import.meta.url);
const outputRoot = new URL("./assets/card-images/", here);
const manifestUrl = new URL("./research/card-images.json", here);
const overridesUrl = new URL("./research/card-image-overrides.json", here);
const checkedAt = new Date().toISOString().slice(0, 10);
const userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/140 Safari/537.36";

function decodeHtml(value = "") {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function metaContent(html, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, "i")
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return decodeHtml(match[1]);
  }
  return "";
}

async function fetchWithTimeout(url, type = "text", extraHeaders = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 22_000);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "accept-language": "en-US,en;q=0.9",
        "user-agent": userAgent,
        ...extraHeaders
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return type === "buffer" ? { response, body: Buffer.from(await response.arrayBuffer()) } : { response, body: await response.text() };
  } finally {
    clearTimeout(timeout);
  }
}

async function readJsonl(url) {
  return (await readFile(url, "utf8"))
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

async function readOverrides() {
  try { return JSON.parse(await readFile(overridesUrl, "utf8")); }
  catch (error) {
    if (error.code === "ENOENT") return {};
    throw error;
  }
}

function candidateFromHtml(pageUrl, html, fallbackAlt) {
  const remoteUrl = metaContent(html, "og:image") || metaContent(html, "twitter:image");
  if (!remoteUrl) return null;
  const absoluteImage = new URL(remoteUrl, pageUrl).href;
  if (/maps\.google\.com\/maps\/api\/staticmap/i.test(absoluteImage)) return null;
  return {
    sourcePageUrl: pageUrl,
    remoteUrl: absoluteImage,
    pageTitle: metaContent(html, "og:title") || metaContent(html, "twitter:title") || fallbackAlt,
    method: "page_meta"
  };
}

async function resolveCandidate({ id, pageUrl, alt, override }) {
  if (override?.remoteUrl && override?.sourcePageUrl) {
    return { ...override, remoteUrl: override.remoteUrl.replace(/-{20,}$/, ""), pageTitle: override.pageTitle || alt, method: override.method || "reviewed_search_override" };
  }
  try {
    const { body } = await fetchWithTimeout(pageUrl);
    return candidateFromHtml(pageUrl, body, alt);
  } catch (error) {
    console.warn(`${id}: ${pageUrl} ${error.message}`);
    return null;
  }
}

async function toWebp(remoteUrl, destinationUrl, sourcePageUrl) {
  const tempDir = await mkdtemp(join(tmpdir(), "istanbul-card-image-"));
  const input = join(tempDir, "source-image");
  try {
    const { response, body } = await fetchWithTimeout(remoteUrl, "buffer", { referer: sourcePageUrl });
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) throw new Error(`not an image: ${contentType}`);
    if (body.byteLength < 4_000) throw new Error(`image too small: ${body.byteLength} bytes`);
    await writeFile(input, body);
    try {
      await execFileAsync("/opt/homebrew/bin/cwebp", ["-quiet", "-q", "72", "-resize", "640", "0", input, "-o", destinationUrl.pathname]);
    } catch {
      await execFileAsync("/opt/homebrew/bin/ffmpeg", ["-loglevel", "error", "-y", "-i", input, "-vf", "scale=640:-2:force_original_aspect_ratio=decrease", "-quality", "72", destinationUrl.pathname]);
    }
    const output = await readFile(destinationUrl);
    return {
      bytes: (await stat(destinationUrl)).size,
      sha256: createHash("sha256").update(output).digest("hex")
    };
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await mapper(items[index], index);
    }
  }));
  return results;
}

const [airbnb, restaurants, cafes, overrides] = await Promise.all([
  readJsonl(new URL("./research/airbnb-9guests.jsonl", here)),
  readJsonl(new URL("./research/dining-restaurants-60.jsonl", here)),
  readJsonl(new URL("./research/dining-cafes-40.jsonl", here)),
  readOverrides()
]);

const targets = [
  ...airbnb.map((item) => ({
    id: item.id,
    kind: "airbnb",
    name: item.name,
    pageUrl: item.listing_url,
    bookingUrl: item.date_query_url,
    alt: `${item.name} Airbnb 숙소 대표 사진`
  })),
  ...[...restaurants, ...cafes].map((item) => ({
    id: item.id,
    kind: item.type,
    name: item.name,
    pageUrl: item.officialUrl,
    bookingUrl: item.officialUrl,
    alt: `${item.name} ${item.type === "restaurant" ? "음식점" : "카페"} 대표 사진`
  }))
];

await mkdir(outputRoot, { recursive: true });
const records = await mapLimit(targets, 6, async (target) => {
  const override = overrides[target.id];
  const candidate = await resolveCandidate({ ...target, override });
  if (!candidate) return { ...target, status: "missing", checkedAt };
  const localPath = `./assets/card-images/${target.id}.webp`;
  const destination = new URL(localPath, here);
  try {
    const file = await toWebp(candidate.remoteUrl, destination, candidate.sourcePageUrl);
    return { ...target, ...candidate, ...file, localPath, status: "verified", checkedAt };
  } catch (error) {
    console.warn(`${target.id}: image ${error.message}`);
    return { ...target, ...candidate, status: "download_failed", error: error.message, checkedAt };
  }
});

const duplicateHashes = Object.entries(records.reduce((groups, item) => {
  if (!item.sha256) return groups;
  (groups[item.sha256] ||= []).push(item.id);
  return groups;
}, {})).filter(([, ids]) => ids.length > 1);

const manifest = {
  checkedAt,
  generatedFrom: "Airbnb listing metadata, dining official pages, and reviewed per-place overrides",
  count: records.length,
  verifiedCount: records.filter((item) => item.status === "verified").length,
  missingCount: records.filter((item) => item.status !== "verified").length,
  duplicateHashes: duplicateHashes.map(([sha256, ids]) => ({ sha256, ids })),
  records
};
await writeFile(manifestUrl, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  count: manifest.count,
  verified: manifest.verifiedCount,
  missing: records.filter((item) => item.status !== "verified").map((item) => ({ id: item.id, status: item.status, pageUrl: item.pageUrl, error: item.error })),
  duplicates: manifest.duplicateHashes
}, null, 2));
