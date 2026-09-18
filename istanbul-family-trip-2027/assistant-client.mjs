export const DEFAULT_ASSISTANT_URL = "http://127.0.0.1:4317";
export const UPDATE_SECTIONS = { plan: "일정", stay: "숙소", budget: "예산", guide: "장소", dining: "식당" };

export class AssistantError extends Error {
  constructor(message, kind = "request", status = 0) {
    super(message);
    this.name = "AssistantError";
    this.kind = kind;
    this.status = status;
  }
}

export function normalizeBaseUrl(value) {
  let url;
  try { url = new URL(value); } catch { throw new AssistantError("컴퓨터의 연결 주소를 확인해주세요.", "address"); }
  if (!["http:", "https:"].includes(url.protocol)
    || !["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)
    || url.username || url.password || url.search || url.hash || url.pathname !== "/") {
    throw new AssistantError("이 컴퓨터의 localhost 또는 127.0.0.1 주소만 연결할 수 있어요.", "address");
  }
  return url.origin;
}

export function isLoopbackOrigin(value) {
  try { return normalizeBaseUrl(value) === new URL(value).origin; } catch { return false; }
}

export function safeWebUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password ? url.href : "";
  } catch { return ""; }
}

export function cleanSources(sources) {
  if (!Array.isArray(sources)) return [];
  return sources.slice(0, 8).flatMap((source) => {
    const url = safeWebUrl(source?.url);
    return url ? [{ title: String(source.title || "출처 보기").slice(0, 160), url }] : [];
  });
}

export function cleanHistory(history) {
  return (Array.isArray(history) ? history : []).filter((entry) => typeof entry?.question === "string" && typeof entry?.answer === "string")
    .slice(-8).map((entry) => ({ question: entry.question.slice(0, 2000), answer: entry.answer.slice(0, 6000) }));
}

export function cleanUpdates(value) {
  const ids = new Set();
  const updates = (Array.isArray(value?.updates) ? value.updates : []).slice(0, 200).flatMap((entry) => {
    if (!entry || typeof entry.id !== "string" || !entry.id || ids.has(entry.id)
      || !Object.hasOwn(UPDATE_SECTIONS, entry.section) || !["preference", "suggestion"].includes(entry.kind)
      || typeof entry.title !== "string" || typeof entry.body !== "string") return [];
    ids.add(entry.id);
    return [{ id: entry.id.slice(0, 100), section: entry.section, kind: entry.kind,
      title: entry.title.slice(0, 200), body: entry.body.slice(0, 6000),
      sources: cleanSources(entry.sources), createdAt: typeof entry.createdAt === "string" ? entry.createdAt : "" }];
  });
  return { version: 1, revision: typeof value?.revision === "string" ? value.revision.slice(0, 100) : "initial", updates };
}

export function localPreviewUrl(baseUrl, provided) {
  const base = normalizeBaseUrl(baseUrl);
  try {
    if (typeof provided !== "string" || !provided) throw new Error("No preview URL");
    const url = new URL(provided, base);
    if (url.origin === base && !url.username && !url.password && !url.search) return url.href;
  } catch { /* Use the known preview path. */ }
  return `${base}/istanbul-family-trip-2027/#ask`;
}

export function createAssistantClient({ baseUrl, token = "", pageOrigin = "", fetchImpl = globalThis.fetch, timeoutMs = 12000 }) {
  const base = normalizeBaseUrl(baseUrl);
  async function request(path, { auth = true, method = "GET", body, signal } = {}) {
    if (auth && !token) throw new AssistantError("먼저 컴퓨터의 Codex를 연결해주세요.", "auth", 401);
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (signal?.aborted) abort();
    signal?.addEventListener("abort", abort, { once: true });
    const timeout = setTimeout(abort, timeoutMs);
    try {
      const response = await fetchImpl(`${base}${path}`, {
        method, headers: { ...(auth ? { Authorization: `Bearer ${token}` } : {}), ...(body ? { "Content-Type": "application/json" } : {}) },
        ...(body ? { body: JSON.stringify(body) } : {}), signal: controller.signal, cache: "no-store", credentials: "omit", redirect: "error"
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        if ([401, 403].includes(response.status)) throw new AssistantError("연결 코드가 맞지 않거나 만료됐어요. 컴퓨터에 표시된 코드를 다시 입력해주세요.", "auth", response.status);
        throw new AssistantError(String(result?.error || `연결 요청을 처리하지 못했어요 (${response.status}).`).slice(0, 500), "request", response.status);
      }
      if (!result || typeof result !== "object") throw new AssistantError("컴퓨터에서 올바른 응답을 받지 못했어요.", "response");
      return result;
    } catch (error) {
      if (error instanceof AssistantError) throw error;
      if (signal?.aborted) throw new AssistantError("연결 확인을 멈췄습니다.", "cancelled");
      throw new AssistantError("컴퓨터에 연결하지 못했어요. 실행 상태와 브라우저의 로컬 네트워크 연결 허용을 확인해주세요.", "network");
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener("abort", abort);
    }
  }
  return {
    baseUrl: base,
    health: (options) => request("/api/health", { ...options, auth: false }),
    session: (options) => {
      if (pageOrigin !== base || !isLoopbackOrigin(pageOrigin)) {
        throw new AssistantError("자동 연결은 컴퓨터에서 연 미리보기에서만 가능해요.", "auth");
      }
      return request("/api/session", { ...options, auth: false });
    },
    updates: (options) => request("/api/updates", options),
    start: (job, options) => request("/api/jobs", { ...options, method: "POST", body: {
      requestId: job.requestId, question: job.question, mode: job.mode, history: cleanHistory(job.history)
    } }),
    job: (id, options) => request(`/api/jobs/${encodeURIComponent(id)}`, options)
  };
}

function pause(ms, signal) {
  return new Promise((resolve, reject) => {
    const abort = () => { clearTimeout(timer); reject(new AssistantError("연결 확인을 멈췄습니다.", "cancelled")); };
    const timer = setTimeout(() => { signal?.removeEventListener("abort", abort); resolve(); }, ms);
    if (signal?.aborted) abort();
    else signal?.addEventListener("abort", abort, { once: true });
  });
}

export async function pollJob(client, id, { signal, timeoutMs = 240000, intervalMs = 1500, now = Date.now, wait = pause } = {}) {
  const deadline = now() + timeoutMs;
  const controller = new AbortController();
  let timedOut = false;
  const abort = () => controller.abort();
  signal?.addEventListener("abort", abort, { once: true });
  const timer = setTimeout(() => { timedOut = true; abort(); }, timeoutMs);
  const timeoutError = () => new AssistantError("답변이 오래 걸리고 있어요. ‘진행 상황 다시 확인’을 누르면 같은 작업을 이어서 확인합니다.", "timeout");
  try {
    while (now() < deadline) {
      if (signal?.aborted) throw new AssistantError("연결 확인을 멈췄습니다.", "cancelled");
      const job = await client.job(id, { signal: controller.signal });
      if (timedOut) throw timeoutError();
      if (["complete", "failed"].includes(job.status)) return job;
      if (job.status !== "running") throw new AssistantError("작업 상태를 확인하지 못했어요. 같은 작업을 다시 확인해주세요.", "response");
      await wait(Math.min(intervalMs, Math.max(0, deadline - now())), controller.signal);
    }
    throw timeoutError();
  } catch (error) {
    if (timedOut) throw timeoutError();
    throw error;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abort);
  }
}
