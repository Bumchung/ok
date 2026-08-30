import { access, copyFile, mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const apps = [
  { slug: "istanbul-family-trip-2027", module: "../istanbul-family-trip-2027/trip-data.mjs" },
  { slug: "dubai-family-trip-2027", module: "../dubai-family-trip-2027/trip-data.mjs" }
];

async function download(url) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent": "Mozilla/5.0 FamilyTripPhotoCache/1.0",
      accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
    }
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const type = response.headers.get("content-type") || "";
  if (!type.startsWith("image/")) throw new Error(`Unexpected ${type || "content type"}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 5000) throw new Error(`Image too small: ${bytes.length}`);
  return { bytes, type };
}

function extensionFor(type) {
  if (type.includes("avif")) return "avif";
  if (type.includes("webp")) return "webp";
  if (type.includes("png")) return "png";
  return "jpg";
}

for (const app of apps) {
  const data = await import(new URL(app.module, import.meta.url));
  const output = join(root, app.slug, "assets", "places");
  await mkdir(output, { recursive: true });
  let previous = [];
  try { previous = JSON.parse(await readFile(join(output, "manifest.json"), "utf8")); } catch { /* first run */ }
  const previousById = new Map(previous.map((item) => [item.id, item]));
  const results = [];
  for (const place of data.places) {
    const legacyFilename = `${place.id}.img`;
    const prior = previousById.get(place.id);
    if (prior?.ok && !prior.fallback) {
      try {
        const priorAsset = prior.asset || legacyFilename;
        await access(join(output, priorAsset));
        const asset = `${place.id}.${extensionFor(prior.type || "")}`;
        if (priorAsset !== asset) await copyFile(join(output, priorAsset), join(output, asset));
        results.push({ ...prior, asset });
        continue;
      } catch { /* redownload missing file */ }
    }
    const primarySource = place.remoteImage || place.image;
    if (String(primarySource).includes("wikimedia.org")) await new Promise((resolve) => setTimeout(resolve, 1600));
    try {
      const result = await download(primarySource);
      const asset = `${place.id}.${extensionFor(result.type)}`;
      await writeFile(join(output, asset), result.bytes);
      results.push({ id: place.id, ok: true, asset, bytes: result.bytes.length, type: result.type, source: primarySource });
    } catch (error) {
      try {
        const fallback = await download(place.imageFallback);
        const asset = `${place.id}.${extensionFor(fallback.type)}`;
        await writeFile(join(output, asset), fallback.bytes);
        results.push({ id: place.id, ok: true, fallback: true, asset, bytes: fallback.bytes.length, type: fallback.type, source: place.imageFallback });
      } catch (fallbackError) {
        if (prior?.ok) results.push(prior);
        else results.push({ id: place.id, ok: false, error: String(error.message), fallbackError: String(fallbackError.message) });
      }
    }
  }
  await writeFile(join(output, "manifest.json"), `${JSON.stringify(results, null, 2)}\n`);
  const keep = new Set(["manifest.json", ...results.flatMap((item) => item.asset ? [item.asset] : [])]);
  for (const filename of await readdir(output)) {
    if (/\.(?:img|jpe?g|avif|webp|png)$/i.test(filename) && !keep.has(filename)) await unlink(join(output, filename));
  }
  const failed = results.filter((item) => !item.ok);
  console.log(`${app.slug}: ${results.length - failed.length}/${results.length} cached`);
  for (const item of failed) console.log(`  failed ${item.id}: ${item.error}; fallback ${item.fallbackError}`);
}
