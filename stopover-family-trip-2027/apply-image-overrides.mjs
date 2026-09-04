import { createHash } from "node:crypto";
import { readFile, unlink, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { pathToFileURL } from "node:url";

const here = process.cwd();
const { overrides } = await import(pathToFileURL(join(here, "image-overrides.mjs")));
const manifestPath = join(here, "image-manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const records = new Map(manifest.records.map((record) => [record.id, record]));

const extensionFor = (contentType, url) => {
  const byType = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" }[contentType?.split(";")[0]];
  const byUrl = extname(new URL(url).pathname).toLowerCase().replace(".jpeg", ".jpg");
  return byType || ([".jpg", ".png", ".webp"].includes(byUrl) ? byUrl : ".jpg");
};

async function download(urls, id) {
  let lastError;
  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 FamilyTripVisualAudit/1.0",
          Accept: "image/jpeg,image/png,image/webp,*/*;q=0.8"
        },
        redirect: "follow",
        signal: AbortSignal.timeout(30_000)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.startsWith("image/")) throw new Error(`not an image: ${contentType}`);
      return { bytes: Buffer.from(await response.arrayBuffer()), contentType, url };
    } catch (error) {
      lastError = new Error(`${id} ${url}: ${error.message}`);
    }
  }
  throw lastError;
}

const failures = [];
for (const override of overrides) {
  try {
    const current = records.get(override.id);
    if (!current) throw new Error(`Unknown image id: ${override.id}`);
    let bytes;
    let extension;
    let downloadUrl;
    if (override.localSource) {
      bytes = await readFile(join(here, override.localSource));
      extension = extname(override.localSource).toLowerCase().replace(".jpeg", ".jpg");
      downloadUrl = override.sourcePage;
    } else {
      const downloaded = await download(override.urls, override.id);
      bytes = downloaded.bytes;
      extension = extensionFor(downloaded.contentType, downloaded.url);
      downloadUrl = downloaded.url;
    }
    if (bytes.length <= 4_000) throw new Error(`${override.id} image is too small: ${bytes.length}`);
    const sha256 = createHash("sha256").update(bytes).digest("hex");
    const duplicate = [...records.values()].find((record) => record.id !== override.id && record.sha256 === sha256);
    if (duplicate) throw new Error(`duplicates ${duplicate.id}`);
    const localPath = `./assets/cards/${override.id}${extension}`;
    await writeFile(join(here, localPath), bytes);
    if (current.localPath !== localPath) {
      try { await unlink(join(here, current.localPath)); } catch { /* no stale file */ }
    }
    records.set(override.id, {
      ...current,
      query: override.query,
      localPath,
      sourcePage: override.sourcePage,
      downloadUrl,
      originalUrl: downloadUrl,
      license: override.license || "Representative image, source page linked",
      artist: override.artist || "",
      bytes: bytes.length,
      sha256
    });
    console.log(`Replaced ${override.id}`);
  } catch (error) {
    failures.push(`${override.id}: ${error.message}`);
    console.error(`Skipped ${override.id}: ${error.message}`);
  }
}

const ordered = manifest.records.map((record) => records.get(record.id));
const duplicateHashes = [...new Set(ordered.map((record) => record.sha256).filter((hash, index, all) => all.indexOf(hash) !== index))];
if (duplicateHashes.length) throw new Error(`Duplicate image hashes after overrides: ${duplicateHashes.join(", ")}`);
const catalog = Object.fromEntries(ordered.map((record) => [record.id, {
  image: record.localPath,
  photoSource: record.sourcePage,
  photoLicense: record.license,
  photoLabel: record.label
}]));
await writeFile(join(here, "image-catalog.mjs"), `export const media = ${JSON.stringify(catalog, null, 2)};\n`);
await writeFile(manifestPath, `${JSON.stringify({ ...manifest, duplicateHashes, records: ordered }, null, 2)}\n`);
console.log(`Applied ${overrides.length} exact-image overrides.`);
if (failures.length) throw new Error(`Image override failures:\n${failures.join("\n")}`);
