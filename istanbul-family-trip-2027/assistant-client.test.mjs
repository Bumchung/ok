import test from "node:test";
import assert from "node:assert/strict";
import {
  AssistantError, cleanHistory, cleanSources, cleanUpdates, createAssistantClient,
  isLoopbackOrigin, localPreviewUrl, normalizeBaseUrl, pollJob, safeWebUrl
} from "./assistant-client.mjs";

const baseUrl = "http://127.0.0.1:4317";
const json = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: { "Content-Type": "application/json" } });

test("assistant can only connect to a loopback origin without credentials or URL parameters", () => {
  assert.equal(normalizeBaseUrl(`${baseUrl}/`), baseUrl);
  assert.equal(normalizeBaseUrl("https://localhost:4443"), "https://localhost:4443");
  assert.equal(normalizeBaseUrl("http://[::1]:4317"), "http://[::1]:4317");
  for (const value of ["https://example.com", "http://127.0.0.1.evil.test", "http://user:secret@localhost", `${baseUrl}/api`, `${baseUrl}?token=secret`, `${baseUrl}#token`, "file:///tmp/site", "javascript:alert(1)", "not a URL"]) {
    assert.throws(() => normalizeBaseUrl(value), AssistantError, value);
  }
  assert.equal(isLoopbackOrigin(baseUrl), true);
  assert.equal(isLoopbackOrigin("https://bumchung.github.io"), false);
});

test("model sources and local preview links cannot navigate to executable or foreign URLs", () => {
  assert.equal(safeWebUrl("javascript:alert(1)"), "");
  assert.equal(safeWebUrl("data:text/html,hello"), "");
  assert.equal(safeWebUrl("https://user:password@example.com"), "");
  assert.deepEqual(cleanSources([{ title: "museum", url: "https://example.com/museum" }, { title: "bad", url: "javascript:alert(1)" }]), [{ title: "museum", url: "https://example.com/museum" }]);
  const expected = `${baseUrl}/istanbul-family-trip-2027/#ask`;
  assert.equal(localPreviewUrl(baseUrl), expected);
  assert.equal(localPreviewUrl(baseUrl, "https://example.com"), expected);
  assert.equal(localPreviewUrl(baseUrl, `${baseUrl}/?token=secret`), expected);
  assert.equal(localPreviewUrl(baseUrl, `${baseUrl}/istanbul-family-trip-2027/#ask`), expected);
});

test("history carries only the last eight conversations within server limits", () => {
  const history = Array.from({ length: 12 }, (_, i) => ({ question: `${i}`, answer: "answer", token: "must not be sent" }));
  assert.deepEqual(cleanHistory(history).map((entry) => entry.question), ["4", "5", "6", "7", "8", "9", "10", "11"]);
  assert.equal(Object.hasOwn(cleanHistory(history)[0], "token"), false);
  const [long] = cleanHistory([{ question: "q".repeat(2100), answer: "a".repeat(7000) }]);
  assert.equal(long.question.length, 2000);
  assert.equal(long.answer.length, 6000);
  assert.deepEqual(cleanHistory([null, { question: 5, answer: "bad" }]), []);
});

test("supplemental cards retain string revisions and reject unknown categories and unsafe sources", () => {
  const valid = { id: "one", section: "dining", kind: "preference", title: "맵지 않은 식사", body: "아이들 식사는 덜 맵게", sources: [{ title: "unsafe", url: "javascript:alert(1)" }] };
  const result = cleanUpdates({ version: 1, revision: "revision-uuid", updates: [valid, valid, { ...valid, id: "two", section: "scripts" }, { ...valid, id: "three", kind: "execute" }] });
  assert.equal(result.revision, "revision-uuid");
  assert.equal(result.updates.length, 1);
  assert.deepEqual(result.updates[0].sources, []);
  assert.equal(result.updates[0].body, valid.body);
});

test("session bootstrap is restricted to the same loopback origin", async () => {
  const calls = [];
  const fetchImpl = async (...args) => { calls.push(args); return json({ token: "session-token" }); };
  const remotePage = createAssistantClient({ baseUrl, pageOrigin: "https://bumchung.github.io", fetchImpl });
  assert.throws(() => remotePage.session(), /자동 연결/);
  assert.equal(calls.length, 0);
  const localPage = createAssistantClient({ baseUrl, pageOrigin: baseUrl, fetchImpl });
  assert.equal((await localPage.session()).token, "session-token");
  assert.equal(calls[0][0], `${baseUrl}/api/session`);
  assert.equal(calls[0][1].headers.Authorization, undefined);
});

test("authenticated requests use bearer headers and refuse redirects while health stays public", async () => {
  const calls = [];
  const client = createAssistantClient({ baseUrl, token: "pairing-token", fetchImpl: async (...args) => { calls.push(args); return json({ ok: true }); } });
  await client.health();
  await client.updates();
  assert.equal(calls[0][1].headers.Authorization, undefined);
  assert.equal(calls[1][1].headers.Authorization, "Bearer pairing-token");
  assert.equal(calls[1][1].redirect, "error");
  assert.equal(calls[1][1].credentials, "omit");
  assert.equal(calls[1][0].includes("pairing-token"), false);
  const unauthenticated = createAssistantClient({ baseUrl, fetchImpl: async () => { throw new Error("Must not fetch"); } });
  await assert.rejects(unauthenticated.updates(), (error) => error.kind === "auth");
});

test("an uncertain POST does not retry itself and reuses the exact request identity when explicitly retried", async () => {
  const bodies = [];
  const client = createAssistantClient({ baseUrl, token: "token", fetchImpl: async (_url, init) => {
    bodies.push(init.body);
    if (bodies.length === 1) throw new TypeError("Connection lost after accepting POST");
    return json({ id: "existing-job", status: "running" }, 202);
  } });
  const request = { requestId: "stable-id", question: "일정을 보완해줘", mode: "improve", history: [{ question: "earlier", answer: "earlier answer" }] };
  await assert.rejects(client.start(request), (error) => error.kind === "network");
  assert.equal(bodies.length, 1);
  assert.equal((await client.start(request)).id, "existing-job");
  assert.equal(bodies[0], bodies[1]);
});

test("polling resumes an existing job without creating one", async () => {
  const calls = [];
  let clock = 0;
  const client = { job: async (id) => { calls.push(id); return calls.length === 2 ? { id, status: "complete", answer: "완료" } : { id, status: "running" }; } };
  const result = await pollJob(client, "known-job", { now: () => clock, wait: async (ms) => { clock += ms; }, intervalMs: 10 });
  assert.equal(result.answer, "완료");
  assert.deepEqual(calls, ["known-job", "known-job"]);
});

test("poll timeout preserves a running job instead of starting another request", async () => {
  let clock = 0;
  let calls = 0;
  await assert.rejects(pollJob({ job: async () => { calls++; return { status: "running" }; } }, "slow-job", {
    timeoutMs: 30, intervalMs: 10, now: () => clock, wait: async (ms) => { clock += ms; }
  }), (error) => error.kind === "timeout");
  assert.equal(calls, 3);
});

test("the polling deadline also interrupts a stalled network request", async () => {
  let calls = 0;
  const client = createAssistantClient({ baseUrl, token: "token", fetchImpl: async (_url, { signal }) => {
    calls++;
    return new Promise((_resolve, reject) => signal.addEventListener("abort", () => reject(new Error("aborted")), { once: true }));
  } });
  await assert.rejects(pollJob(client, "stalled-job", { timeoutMs: 15 }), (error) => error.kind === "timeout");
  assert.equal(calls, 1);
});

test("expired pairing tokens and cancelled requests remain distinguishable", async () => {
  const client = createAssistantClient({ baseUrl, token: "old-token", fetchImpl: async () => json({ error: "Unauthorized" }, 401) });
  await assert.rejects(client.updates(), (error) => error.kind === "auth" && error.status === 401);
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(pollJob({ job: async () => { throw new Error("Must not fetch"); } }, "existing", { signal: controller.signal }), (error) => error.kind === "cancelled");
});
