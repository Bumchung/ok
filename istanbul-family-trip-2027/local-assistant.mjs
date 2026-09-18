import http from "node:http";
import { randomBytes, randomUUID, timingSafeEqual, createHash } from "node:crypto";
import { readFile, writeFile, rename, mkdir, readdir, realpath, stat, unlink } from "node:fs/promises";
import { dirname, extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { validateRequest, validateResult, validateDocument, EMPTY_UPDATES } from "./codex-contract.mjs";
import { runCodex } from "./codex-runner.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const SLUG = "istanbul-family-trip-2027";
const PUBLIC_ORIGIN = "https://bumchung.github.io";
// Eight valid Korean turns can exceed 64 KiB after UTF-8 encoding.
const MAX_BODY = 262144;
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif", ".svg": "image/svg+xml", ".csv": "text/csv; charset=utf-8", ".kml": "application/vnd.google-earth.kml+xml", ".woff2": "font/woff2" };
const hash = (value) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

async function atomicJson(file, value) {
  const temporary = `${file}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
    await rename(temporary, file);
  } finally { await unlink(temporary).catch(() => {}); }
}

async function readDocument(file) {
  try { return validateDocument(JSON.parse(await readFile(file, "utf8"))); }
  catch (error) { if (error.code === "ENOENT") return structuredClone(EMPTY_UPDATES); throw error; }
}

async function bodyJson(req) {
  if (!String(req.headers["content-type"] || "").startsWith("application/json")) throw Object.assign(new Error("JSON 요청이 필요합니다."), { status: 415 });
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY) throw Object.assign(new Error("요청이 너무 큽니다."), { status: 413 });
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw Object.assign(new Error("요청 형식이 올바르지 않습니다."), { status: 400 }); }
}

export async function createAssistantServer({ appDir = HERE, siteRoot = dirname(appDir), run = runCodex } = {}) {
  const privateDir = join(appDir, ".local-assistant");
  const jobsDir = join(privateDir, "jobs");
  const documentFile = join(appDir, "planner-updates.json");
  await mkdir(jobsDir, { recursive: true, mode: 0o700 });
  const lockFile = join(privateDir, "server.lock");
  try { await writeFile(lockFile, String(process.pid), { flag: "wx", mode: 0o600 }); }
  catch (error) {
    if (error.code !== "EEXIST") throw error;
    const owner = Number(await readFile(lockFile, "utf8"));
    let alive = true;
    if (Number.isSafeInteger(owner) && owner > 0) {
      try { process.kill(owner, 0); } catch (check) { if (check.code === "ESRCH") alive = false; }
    }
    if (alive) throw new Error("이 페이지의 로컬 도우미가 이미 실행 중입니다.");
    await unlink(lockFile);
    await writeFile(lockFile, String(process.pid), { flag: "wx", mode: 0o600 });
  }
  let initial;
  try { initial = await readDocument(documentFile); }
  catch (error) { await unlink(lockFile); throw error; }
  const token = randomBytes(32).toString("hex");
  const jobs = new Map();
  let active = null;
  let stopping = false;
  let rate = { start: Date.now(), count: 0 };
  const persist = (job) => atomicJson(join(jobsDir, `${job.id}.json`), job);
  try {
    for (const file of await readdir(jobsDir)) {
      if (!/^[a-f0-9-]{36}\.json$/.test(file)) continue;
      const job = JSON.parse(await readFile(join(jobsDir, file), "utf8"));
      if (["running", "applying"].includes(job.status)) {
        const applied = job.status === "applying" && job.updates?.length && job.updates.every((note) => initial.updates.some((saved) => saved.id === note.id));
        job.status = applied ? "complete" : "failed";
        job.saved = Boolean(applied);
        if (!applied) job.error = "로컬 도우미가 종료되어 요청이 중단되었습니다. 다시 질문해 주세요.";
        await persist(job);
      }
      jobs.set(job.id, job);
    }
  } catch (error) { await unlink(lockFile); throw error; }

  function ownOrigin(req) { return `http://${req.headers.host}`; }
  function allowedOrigin(req) { return req.headers.origin === PUBLIC_ORIGIN || req.headers.origin === ownOrigin(req); }
  function headers(req) {
    const values = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer", "Vary": "Origin", "Content-Security-Policy": "frame-ancestors 'none'" };
    if (allowedOrigin(req)) Object.assign(values, {
      "Access-Control-Allow-Origin": req.headers.origin,
      "Access-Control-Allow-Headers": "authorization, content-type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Private-Network": "true", "Access-Control-Max-Age": "600"
    });
    return values;
  }
  function json(req, res, status, payload) {
    res.writeHead(status, { ...headers(req), "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(payload));
  }
  function publicJob(job, req) {
    const { request, fingerprint, ...safe } = job;
    return { ...safe, status: job.status === "applying" ? "running" : job.status, previewUrl: `${ownOrigin(req)}/${SLUG}/#ask` };
  }
  function authorized(req) {
    if (req.headers.origin && !allowedOrigin(req)) return false;
    const supplied = Buffer.from(String(req.headers.authorization || "").replace(/^Bearer /, ""));
    const expected = Buffer.from(token);
    return supplied.length === expected.length && timingSafeEqual(supplied, expected);
  }

  async function execute(job, controller) {
    try {
      const before = await readDocument(documentFile);
      const result = validateResult(await run(job.request, before.updates, { signal: controller.signal }));
      if (controller.signal.aborted) throw new Error("요청이 중단되었습니다.");
      const notes = job.mode === "improve" ? result.updates.map((note, index) => ({ ...note, id: `${job.id}-${index}`, createdAt: new Date().toISOString() })) : [];
      Object.assign(job, { answer: result.answer, sources: result.sources, updates: notes, saved: false, revision: before.revision });
      if (notes.length) {
        const current = await readDocument(documentFile);
        if (hash(current) !== hash(before)) throw new Error("질문 처리 중 보완 자료가 변경되었습니다. 최신 자료로 다시 요청해 주세요.");
        if (current.updates.length + notes.length > 120) throw new Error("보완 카드가 120개에 도달했습니다. 기존 내용을 정리한 뒤 다시 요청해 주세요.");
        job.revision = randomUUID();
        job.status = "applying";
        await persist(job);
        await atomicJson(documentFile, { version: 1, revision: job.revision, updates: [...current.updates, ...notes] });
        job.saved = true;
      }
      job.status = "complete";
      await persist(job);
    } catch (error) {
      // A completed data write is never reported as unsaved merely because the
      // private job journal failed. Restart recovery checks note IDs as well.
      if (job.saved) {
        job.status = "complete";
        job.warning = "보완 내용은 저장됐지만 처리 기록을 저장하지 못했습니다.";
      } else {
        job.status = "failed";
        job.error = error instanceof SyntaxError ? "Codex 답변 형식을 확인하지 못했습니다. 변경 내용은 저장하지 않았습니다." : String(error.message || "요청을 처리하지 못했습니다.");
      }
      await persist(job).catch(() => {});
    } finally { active = null; }
  }

  const server = http.createServer(async (req, res) => {
    try {
      const port = server.address()?.port;
      if (![ `127.0.0.1:${port}`, `localhost:${port}` ].includes(req.headers.host)) return json(req, res, 403, { error: "로컬 주소로 접속해 주세요." });
      if (req.headers.origin && !allowedOrigin(req)) return json(req, res, 403, { error: "허용되지 않은 페이지입니다." });
      const url = new URL(req.url, ownOrigin(req));
      if (url.pathname.startsWith("/api/")) {
        if (req.method === "OPTIONS") {
          if (!allowedOrigin(req)) return json(req, res, 403, { error: "허용되지 않은 페이지입니다." });
          res.writeHead(204, headers(req)); res.end(); return;
        }
        if (url.pathname === "/api/health" && req.method === "GET") return json(req, res, 200, { ok: true, provider: "Codex CLI", localOnly: true });
        if (url.pathname === "/api/session" && req.method === "GET") {
          if (req.headers.origin !== ownOrigin(req) && !(req.headers["sec-fetch-site"] === "same-origin" && !req.headers.origin)) return json(req, res, 403, { error: "로컬 미리보기에서 연결해 주세요." });
          return json(req, res, 200, { token, previewUrl: `${ownOrigin(req)}/${SLUG}/#ask` });
        }
        if (!authorized(req)) return json(req, res, 401, { error: "로컬 연결 코드를 확인해 주세요." });
        if (url.pathname === "/api/updates" && req.method === "GET") return json(req, res, 200, await readDocument(documentFile));
        const jobId = url.pathname.match(/^\/api\/jobs\/([a-f0-9-]{36})$/)?.[1];
        if (jobId && req.method === "GET") return json(req, res, jobs.has(jobId) ? 200 : 404, jobs.has(jobId) ? publicJob(jobs.get(jobId), req) : { error: "처리 기록을 찾지 못했습니다." });
        if (url.pathname === "/api/jobs" && req.method === "POST") {
          let request;
          try { request = validateRequest(await bodyJson(req)); }
          catch (error) { return json(req, res, error.status || 400, { error: error.message }); }
          const fingerprint = hash(request);
          const existing = jobs.get(request.requestId);
          if (existing) return json(req, res, existing.fingerprint === fingerprint ? 200 : 409, existing.fingerprint === fingerprint ? publicJob(existing, req) : { error: "동일 요청 ID의 내용이 달라졌습니다." });
          if (active || stopping) return json(req, res, 409, { error: "이전 질문을 처리 중입니다. 답변이 도착한 뒤 보내 주세요." });
          if (Date.now() - rate.start > 600000) rate = { start: Date.now(), count: 0 };
          if (rate.count >= 30) return json(req, res, 429, { error: "잠시 쉬었다가 다시 질문해 주세요." });
          const job = { id: request.requestId, status: "running", mode: request.mode, createdAt: new Date().toISOString(), request, fingerprint, saved: false };
          const controller = new AbortController();
          active = { controller, promise: null };
          try { await persist(job); }
          catch (error) { active = null; throw error; }
          jobs.set(job.id, job); rate.count += 1;
          active.promise = execute(job, controller);
          return json(req, res, 202, publicJob(job, req));
        }
        return json(req, res, 404, { error: "요청 주소를 찾지 못했습니다." });
      }
      // Pairing protects unpublished local files from the allowed public origin,
      // too. Same-origin preview loads still work without a bearer header.
      if (req.headers.origin && req.headers.origin !== ownOrigin(req) && !authorized(req)) return json(req, res, 401, { error: "로컬 파일을 보려면 먼저 연결해 주세요." });
      if (!["GET", "HEAD"].includes(req.method)) return json(req, res, 405, { error: "GET만 사용할 수 있습니다." });
      if (url.pathname === "/") {
        res.writeHead(302, { ...headers(req), Location: `/${SLUG}/#ask` }); res.end(); return;
      }
      let decoded;
      try { decoded = decodeURIComponent(url.pathname); } catch { return json(req, res, 400, { error: "주소가 올바르지 않습니다." }); }
      if (decoded.includes("\\") || decoded.includes("\0") || decoded.split("/").some((part) => part.startsWith("."))) return json(req, res, 404, { error: "파일을 찾지 못했습니다." });
      let file = resolve(siteRoot, `.${decoded}`);
      if ((await stat(file)).isDirectory()) file = join(file, "index.html");
      const [canonical, root] = await Promise.all([realpath(file), realpath(siteRoot)]);
      if (!canonical.startsWith(root + sep) || canonical.slice(root.length).split(sep).some((part) => part.startsWith(".")) || !TYPES[extname(file)]) return json(req, res, 404, { error: "파일을 찾지 못했습니다." });
      const body = await readFile(canonical);
      res.writeHead(200, { ...headers(req), "Content-Type": TYPES[extname(file)], "Content-Length": body.length });
      res.end(req.method === "HEAD" ? undefined : body);
    } catch (error) {
      json(req, res, error.code === "ENOENT" ? 404 : 500, { error: error.code === "ENOENT" ? "파일을 찾지 못했습니다." : "로컬 자료를 읽거나 저장하지 못했습니다. 원본 파일을 확인해 주세요." });
    }
  });
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  return {
    server, token,
    async close() {
      stopping = true;
      const current = active;
      current?.controller.abort();
      await current?.promise;
      if (server.listening) await new Promise((done) => server.close(done));
      await unlink(lockFile).catch(() => {});
    }
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let app;
  try {
    app = await createAssistantServer();
    const port = Number(process.env.ISTANBUL_ASSISTANT_PORT || 4317);
    if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error("포트는 1024~65535여야 합니다.");
    await new Promise((done, reject) => { app.server.once("error", reject); app.server.listen(port, "127.0.0.1", done); });
    console.log(`로컬 Codex 여행 도우미: http://127.0.0.1:${port}/${SLUG}/#ask`);
    if (!process.env.ISTANBUL_HIDE_PAIRING_CODE) console.log(`공개 페이지 연결 코드: ${app.token}`);
    console.log("보완 카드는 로컬 파일에 저장됩니다. 공개 사이트 배포는 별도입니다. 종료: Ctrl+C");
    for (const signal of ["SIGINT", "SIGTERM"]) process.once(signal, async () => { await app.close(); process.exit(0); });
  } catch (error) {
    console.error(error.code === "EADDRINUSE" ? "4317 포트가 사용 중입니다. 기존 도우미를 확인하거나 ISTANBUL_ASSISTANT_PORT를 바꿔 주세요." : error.message);
    await app?.close(); process.exitCode = 1;
  }
}
