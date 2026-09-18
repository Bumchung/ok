import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, readFile, rm, symlink, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { createAssistantServer } from "./local-assistant.mjs";
import { validateRequest, validateResult, EMPTY_UPDATES } from "./codex-contract.mjs";
import { codexArguments, modelPreferences, runCodex } from "./codex-runner.mjs";
import { spawn } from "node:child_process";
import http from "node:http";

const note = { section: "plan", kind: "preference", title: "점심 뒤에는 쉬기", body: "가족이 오후 휴식을 선호합니다.", sources: [] };
const result = { answer: "점심 뒤 휴식 조건을 일정 보완 카드로 정리했습니다.", sources: [], updates: [note] };
const request = (mode = "improve") => ({ requestId: randomUUID(), mode, question: "점심 뒤에는 쉬고 싶어", history: [] });

async function fixture(t, run = async () => result) {
  const directory = await mkdtemp(join(tmpdir(), "istanbul-test-"));
  await writeFile(join(directory, "planner-updates.json"), JSON.stringify(EMPTY_UPDATES));
  await writeFile(join(directory, "index.html"), "<h1>preview</h1>");
  await writeFile(join(directory, "app.mjs"), "// preserve original app\n");
  let app;
  let base;
  async function start() {
    app = await createAssistantServer({ appDir: directory, siteRoot: directory, run });
    await new Promise((done) => app.server.listen(0, "127.0.0.1", done));
    base = `http://127.0.0.1:${app.server.address().port}`;
  }
  await start();
  t.after(async () => { await app.close(); await rm(directory, { recursive: true, force: true }); });
  const api = (path, options = {}) => fetch(base + path, { ...options, headers: { Origin: base, Authorization: `Bearer ${app.token}`, ...(options.body ? { "Content-Type": "application/json" } : {}), ...options.headers } });
  return {
    directory, api, get base() { return base; }, get token() { return app.token; },
    post: (payload) => api("/api/jobs", { method: "POST", body: JSON.stringify(payload) }),
    document: async () => JSON.parse(await readFile(join(directory, "planner-updates.json"), "utf8")),
    async restart() { await app.close(); await start(); }
  };
}

async function finished(f, id) {
  for (let i = 0; i < 100; i++) {
    const job = await (await f.api(`/api/jobs/${id}`)).json();
    if (job.status !== "running") return job;
    await new Promise((done) => setTimeout(done, 10));
  }
  throw new Error("Job did not finish");
}

test("a real HTTP improve request persists cards once, retains source code, and survives restart", async (t) => {
  let calls = 0;
  const f = await fixture(t, async () => { calls++; return result; });
  const payload = request();
  assert.equal((await f.post(payload)).status, 202);
  const job = await finished(f, payload.requestId);
  assert.equal(job.status, "complete"); assert.equal(job.saved, true);
  assert.equal((await f.document()).updates.length, 1);
  assert.equal(await readFile(join(f.directory, "app.mjs"), "utf8"), "// preserve original app\n");
  assert.equal((await f.post(payload)).status, 200);
  await f.restart();
  assert.equal((await f.post(payload)).status, 200);
  assert.equal((await f.document()).updates.length, 1);
  assert.equal(calls, 1);
  assert.equal((await f.post({ ...payload, question: "다른 질문" })).status, 409);
});

test("ask mode never saves generated updates and supplies existing notes plus conversation to Codex", async (t) => {
  let received;
  const f = await fixture(t, async (payload, updates) => { received = { payload, updates }; return result; });
  const stored = { ...EMPTY_UPDATES, updates: [{ ...note, id: "existing", createdAt: new Date().toISOString() }] };
  await writeFile(join(f.directory, "planner-updates.json"), JSON.stringify(stored));
  const payload = { ...request("ask"), history: [{ question: "우리 아이는?", answer: "아이들은 9세, 7세, 6세입니다." }] };
  await f.post(payload);
  const job = await finished(f, payload.requestId);
  assert.equal(job.saved, false); assert.deepEqual(job.updates, []);
  assert.deepEqual(await f.document(), stored);
  assert.deepEqual(received.updates, stored.updates);
  assert.deepEqual(received.payload.history, payload.history);
});

test("origin, pairing, DNS rebinding, and private-file guards protect local Codex", async (t) => {
  const f = await fixture(t);
  assert.equal((await f.api("/api/session", { headers: { Origin: "https://bumchung.github.io" } })).status, 403);
  assert.equal((await fetch(f.base + "/api/session")).status, 403);
  assert.equal((await f.api("/api/session")).status, 200);
  assert.equal((await f.api("/api/updates", { headers: { Authorization: "" } })).status, 401);
  assert.equal((await f.api("/planner-updates.json", { headers: { Origin: "https://bumchung.github.io", Authorization: "" } })).status, 401);
  assert.equal((await f.api("/planner-updates.json", { headers: { Origin: "https://bumchung.github.io" } })).status, 200);
  assert.equal((await f.api("/api/updates", { headers: { Origin: "https://evil.example" } })).status, 403);
  const reboundStatus = await new Promise((done, reject) => {
    const req = http.get(f.base + "/api/health", { headers: { Host: "evil.example" } }, (res) => { res.resume(); done(res.statusCode); });
    req.on("error", reject);
  });
  assert.equal(reboundStatus, 403);
  assert.equal((await f.api("/.local-assistant/server.lock")).status, 404);
  assert.equal((await f.api("/%2elocal-assistant/server.lock")).status, 404);
  const outside = join(tmpdir(), `istanbul-outside-${randomUUID()}.json`);
  await writeFile(outside, '{"secret":true}');
  t.after(() => rm(outside, { force: true }));
  await symlink(outside, join(f.directory, "leak.json"));
  assert.equal((await f.api("/leak.json")).status, 404);
  const preflight = await f.api("/api/jobs", { method: "OPTIONS", headers: { Origin: "https://bumchung.github.io", "Access-Control-Request-Private-Network": "true" } });
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get("Access-Control-Allow-Origin"), "https://bumchung.github.io");
  assert.equal(preflight.headers.get("Access-Control-Allow-Private-Network"), "true");
});

test("a failed or invalid model response cannot change published data", async (t) => {
  for (const bad of [new Error("timeout"), { ...result, updates: [{ ...note, kind: "suggestion" }] }, { ...result, sources: [{ title: "unsafe", url: "javascript:alert(1)" }] }]) {
    const f = await fixture(t, async () => { if (bad instanceof Error) throw bad; return bad; });
    const payload = request(); await f.post(payload);
    const job = await finished(f, payload.requestId);
    assert.equal(job.status, "failed"); assert.equal(job.saved, false);
    assert.deepEqual(await f.document(), EMPTY_UPDATES);
  }
});

test("concurrent requests, an oversized body, and conflicting external edits are rejected", async (t) => {
  let release;
  const f = await fixture(t, async () => new Promise((done) => { release = done; }));
  const payload = request(); await f.post(payload);
  while (!release) await new Promise((done) => setTimeout(done, 1));
  assert.equal((await f.post(request())).status, 409);
  assert.equal((await f.post({ ...request(), question: "가".repeat(100000) })).status, 413);
  const external = { ...EMPTY_UPDATES, revision: "manually-changed" };
  await writeFile(join(f.directory, "planner-updates.json"), JSON.stringify(external));
  release(result);
  assert.equal((await finished(f, payload.requestId)).status, "failed");
  assert.deepEqual(await f.document(), external);
});

test("restarting marks unfinished requests failed without retrying the model", async (t) => {
  const f = await fixture(t);
  const payload = request();
  const path = join(f.directory, ".local-assistant", "jobs", `${payload.requestId}.json`);
  await writeFile(path, JSON.stringify({ id: payload.requestId, status: "running", request: payload, saved: false }));
  await f.restart();
  const job = await (await f.api(`/api/jobs/${payload.requestId}`)).json();
  assert.equal(job.status, "failed"); assert.match(job.error, /중단/);
});

test("eight valid Korean history turns fit the HTTP byte limit", async (t) => {
  const f = await fixture(t);
  const payload = { ...request("ask"), history: Array.from({ length: 8 }, () => ({ question: "질".repeat(2000), answer: "답".repeat(6000) })) };
  assert.ok(Buffer.byteLength(JSON.stringify(payload)) > 65536);
  assert.equal((await f.post(payload)).status, 202);
  assert.equal((await finished(f, payload.requestId)).status, "complete");
});

test("corrupt data is preserved instead of overwritten during startup", async () => {
  const directory = await mkdtemp(join(tmpdir(), "istanbul-corrupt-"));
  try {
    await writeFile(join(directory, "planner-updates.json"), "not json");
    await assert.rejects(createAssistantServer({ appDir: directory }));
    assert.equal(await readFile(join(directory, "planner-updates.json"), "utf8"), "not json");
    assert.equal((await readdir(join(directory, ".local-assistant"))).includes("server.lock"), false);
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test("validation rejects long questions and unsafe links, and requires sourced suggestions", () => {
  assert.throws(() => validateRequest({ ...request(), question: "x".repeat(2001) }));
  assert.throws(() => validateResult({ ...result, updates: [{ ...note, section: "../app.mjs" }] }));
  assert.throws(() => validateResult({ ...result, sources: [{ title: "x", url: "https://user:pass@example.com" }] }));
  assert.equal(validateResult({ ...result, updates: [{ ...note, kind: "suggestion", sources: [{ title: "공식", url: "https://example.com/" }] }] }).updates.length, 1);
});

test("CLI runner has read-only permissions, disables unrelated tools, and inherits only model settings", async () => {
  const args = codexArguments("/tmp/work", "/tmp/schema", "/tmp/output", { model: "selected-model", effort: "max" });
  assert.equal(args[args.indexOf("--sandbox") + 1], "read-only");
  assert.ok(args.includes("--ignore-user-config"));
  for (const feature of ["shell_tool", "apps", "plugins", "hooks", "multi_agent"]) assert.ok(args.includes(feature));
  assert.equal(args.includes("--dangerously-bypass-approvals-and-sandbox"), false);
  assert.ok(args.includes("selected-model"));
  const directory = await mkdtemp(join(tmpdir(), "istanbul-config-"));
  try {
    await writeFile(join(directory, "config.toml"), 'model = "my-model"\nmodel_reasoning_effort = "high"\n[mcp_servers.private]\ncommand = "private"\n');
    assert.deepEqual(await modelPreferences({ CODEX_HOME: directory }), { model: "my-model", effort: "high" });
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test("CLI runner passes prompt on stdin, reads structured output, and terminates timed-out processes", async () => {
  const directory = await mkdtemp(join(tmpdir(), "istanbul-runner-test-"));
  const fixturePath = join(directory, "fake.cjs");
  let childDirectory;
  try {
    await writeFile(fixturePath, `const fs=require('fs');const args=JSON.parse(process.argv[2]);let input='';process.stdin.on('data',x=>input+=x);process.stdin.on('end',()=>{if(!input.includes('요청 데이터'))process.exit(1);fs.writeFileSync(args[args.indexOf('--output-last-message')+1],JSON.stringify(${JSON.stringify(result)}));});`);
    const output = await runCodex(request(), [], { env: { ...process.env, CODEX_HOME: directory }, spawnImpl: (_bin, args, options) => {
      childDirectory = options.cwd;
      assert.equal(options.shell, false);
      assert.equal(args.includes("점심 뒤에는 쉬고 싶어"), false);
      return spawn(process.execPath, [fixturePath, JSON.stringify(args)], options);
    } });
    assert.deepEqual(output, result);
    await assert.rejects(readFile(join(childDirectory, "answer.json")), /ENOENT/);
    await assert.rejects(runCodex(request(), [], { timeoutMs: 30, env: { ...process.env, CODEX_HOME: directory }, spawnImpl: (_bin, _args, options) => spawn(process.execPath, ["-e", "setInterval(()=>{},1000)"], options) }), /시간이 초과/);
    if (process.platform !== "win32") {
      const descendantFile = join(directory, "descendant.pid");
      const parentCode = `const {spawn}=require('child_process');const fs=require('fs');const c=spawn(process.execPath,['-e',"process.on('SIGTERM',()=>{});setInterval(()=>{},1000)"],{stdio:'ignore'});fs.writeFileSync(${JSON.stringify(descendantFile)},String(c.pid));process.on('SIGTERM',()=>process.exit(0));setInterval(()=>{},1000);`;
      let descendant;
      try {
        await assert.rejects(runCodex(request(), [], { timeoutMs: 300, env: { ...process.env, CODEX_HOME: directory }, spawnImpl: (_bin, _args, options) => spawn(process.execPath, ["-e", parentCode], options) }), /시간이 초과/);
        descendant = Number(await readFile(descendantFile, "utf8"));
        assert.throws(() => process.kill(descendant, 0), { code: "ESRCH" });
      } finally {
        if (!descendant) descendant = Number(await readFile(descendantFile, "utf8").catch(() => 0));
        if (descendant) { try { process.kill(descendant, "SIGKILL"); } catch { /* Already reaped. */ } }
      }
    }
  } finally { await rm(directory, { recursive: true, force: true }); }
});
