import { access } from "node:fs/promises";
import { execFile } from "node:child_process";
import { dirname, join } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { lodgingOptions } from "../istanbul-family-trip-2027/hotel-catalog.mjs";
import { places } from "../istanbul-family-trip-2027/place-catalog.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const appDir = join(root, "istanbul-family-trip-2027");
const execFileAsync = promisify(execFile);
const rows = [
  ...places.map((item) => ({ kind: "place", id: item.id, url: item.image })),
  ...lodgingOptions.filter((item) => item.bookingModel !== "whole_home").map((item) => ({ kind: "hotel", id: item.id, url: item.image }))
];

async function remoteImageOk(url) {
  for (const method of ["HEAD", "GET"]) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(url, {
        method,
        redirect: "follow",
        headers: {
          "user-agent": "Mozilla/5.0 Istanbul-family-trip-image-audit/1.0",
          ...(method === "GET" ? { range: "bytes=0-1023" } : {})
        },
        signal: controller.signal
      });
      const contentType = response.headers.get("content-type") || "";
      if (response.ok && (/^image\//.test(contentType) || !contentType)) {
        if (response.body) await response.body.cancel();
        return { ok: true, status: response.status, contentType };
      }
    } catch {
      // Retry once with a ranged GET because several hotel CDNs reject HEAD.
    } finally {
      clearTimeout(timeout);
    }
  }
  try {
    const { stdout } = await execFileAsync("curl", ["-LIsS", "--max-time", "20", "-o", "/dev/null", "-w", "%{http_code}", url]);
    const status = Number(stdout.trim());
    if (status >= 200 && status < 400) return { ok: true, status, contentType: "curl-verified" };
  } catch {
    // The failure is reported with the image id below.
  }
  return { ok: false, status: 0, contentType: "" };
}

async function verify(row) {
  if (row.url.startsWith("./")) {
    try {
      await access(join(appDir, row.url.slice(2)));
      return { ...row, ok: true, status: "local" };
    } catch {
      return { ...row, ok: false, status: "missing" };
    }
  }
  return { ...row, ...await remoteImageOk(row.url) };
}

const results = [];
const queue = [...rows];
const workers = Array.from({ length: 6 }, async () => {
  while (queue.length) results.push(await verify(queue.shift()));
});
await Promise.all(workers);

const failed = results.filter((item) => !item.ok);
const local = results.filter((item) => item.status === "local").length;
console.log(`사진 ${results.length}개 검사, 로컬 ${local}개, 원격 ${results.length - local}개, 실패 ${failed.length}개`);
for (const item of failed) console.error(`${item.kind}\t${item.id}\t${item.status}\t${item.url}`);
if (failed.length) process.exitCode = 1;
