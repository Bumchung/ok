#!/usr/bin/env node
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";

const HOST = process.env.SYDNEY_ASSISTANT_HOST || "127.0.0.1";
const PORT = Number(process.env.SYDNEY_ASSISTANT_PORT || 8788);
const TOKEN = process.env.SYDNEY_ASSISTANT_TOKEN || "";
const TIMEOUT_MS = Number(process.env.SYDNEY_ASSISTANT_TIMEOUT_MS || 150000);
const HOME_DIR = process.env.HOME || homedir() || "/Users/heebumchung";
const DEFAULT_PATH = [
  join(HOME_DIR, ".nvm/versions/node/v22.22.0/bin"),
  "/Applications/cmux.app/Contents/Resources/bin",
  "/opt/homebrew/bin",
  "/usr/local/bin",
  "/usr/bin",
  "/bin"
].join(":");
const PAGE_URL = "https://bumchung.github.io/ok/sydney-family-trip-final/";
const DEFAULT_ORIGINS = "https://bumchung.github.io,http://127.0.0.1:8788,http://localhost:8788";
const ALLOWED_ORIGINS = new Set(
  String(process.env.SYDNEY_ASSISTANT_ORIGINS || DEFAULT_ORIGINS)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

const responseSchema = JSON.stringify({
  type: "object",
  additionalProperties: false,
  required: ["answer", "sources"],
  properties: {
    answer: { type: "string" },
    sources: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "url", "snippet"],
        properties: {
          title: { type: "string" },
          url: { type: "string" },
          snippet: { type: "string" }
        }
      }
    }
  }
});

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
}

function corsHeaders(origin) {
  const allowedOrigin = isAllowedOrigin(origin) ? origin || "https://bumchung.github.io" : "null";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "content-type, authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
    "Access-Control-Allow-Private-Network": "true",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function sendJson(req, res, status, payload) {
  const headers = {
    ...corsHeaders(req.headers.origin || ""),
    "Content-Type": "application/json; charset=utf-8"
  };
  res.writeHead(status, headers);
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 65536) {
        req.destroy();
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function contextText(context) {
  if (!Array.isArray(context) || !context.length) return "No page-local matches were supplied.";
  return context
    .slice(0, 6)
    .map((item, index) => {
      return [
        `${index + 1}. ${item.title || "Untitled"}`,
        `kind: ${item.kind || ""}`,
        `subtitle: ${item.subtitle || ""}`,
        `url: ${item.url || ""}`,
        `body: ${String(item.body || "").slice(0, 500)}`
      ].join("\n");
    })
    .join("\n\n");
}

function buildPrompt(provider, payload) {
  return `You are ${provider}, answering a Korean family-trip question about Sydney.

Question:
${String(payload.question || "").trim()}

Page:
${PAGE_URL}

Page-local matches:
${contextText(payload.context)}

Requirements:
- Use current public web sources when you rely on facts outside the page-local matches.
- Prefer official venue, tourism, transport, booking, or map/listing pages.
- Do not invent citations. Include only sources with real http or https URLs.
- Answer in Korean, with a direct recommendation first, then practical reasons, tradeoffs, and what to check before moving.
- Optimize for a multigenerational family trip with kids and parents: walking distance, rain backup, booking friction, meal timing, and taxi/public transport practicality matter.
- Return JSON only, with this exact shape:
{
  "answer": "short Korean answer",
  "sources": [
    { "title": "source title", "url": "https://example.com", "snippet": "why this source supports the answer" }
  ]
}`;
}

function runProcess(command, args, input, timeoutMs = TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      env: {
        ...process.env,
        HOME: HOME_DIR,
        USER: process.env.USER || "heebumchung",
        LOGNAME: process.env.LOGNAME || "heebumchung",
        SHELL: process.env.SHELL || "/bin/zsh",
        CODEX_HOME: process.env.CODEX_HOME || join(HOME_DIR, ".codex"),
        PATH: process.env.PATH || DEFAULT_PATH,
        NO_COLOR: "1"
      },
      stdio: ["pipe", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      reject(new Error(`${command} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`${command} exited ${code}: ${stderr || stdout}`));
      }
    });
    child.stdin.end(input);
  });
}

function parseJsonFromText(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch (error) {
    // Keep scanning below.
  }
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    try {
      return JSON.parse(fenced[1].trim());
    } catch (error) {
      // Fall through to brace scan.
    }
  }
  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first >= 0 && last > first) {
    try {
      return JSON.parse(trimmed.slice(first, last + 1));
    } catch (error) {
      return null;
    }
  }
  return null;
}

function domainTitle(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch (error) {
    return url;
  }
}

function extractUrls(text) {
  const seen = new Set();
  const urls = [];
  String(text || "").replace(/https?:\/\/[^\s)"'<>]+/g, (url) => {
    const clean = url.replace(/[.,;:]+$/, "");
    if (!seen.has(clean)) {
      seen.add(clean);
      urls.push(clean);
    }
    return url;
  });
  return urls;
}

function normalizeSources(value, provider, fallbackText = "") {
  const fromJson = Array.isArray(value) ? value : [];
  const sources = fromJson
    .map((source, index) => {
      if (typeof source === "string") {
        return { title: domainTitle(source), url: source, snippet: "", provider };
      }
      const url = String(source.url || source.href || source.link || "").trim();
      return {
        title: String(source.title || source.name || domainTitle(url) || `Source ${index + 1}`).trim(),
        url,
        snippet: String(source.snippet || source.summary || source.text || source.description || "").trim(),
        provider
      };
    })
    .filter((source) => /^https?:\/\//i.test(source.url));
  if (sources.length) return sources;
  return extractUrls(fallbackText).map((url) => ({
    title: domainTitle(url),
    url,
    snippet: "Provider output referenced this URL.",
    provider
  }));
}

function parseProviderOutput(provider, rawText) {
  const outer = parseJsonFromText(rawText);
  const structured = outer && typeof outer.structured_output === "object" && outer.structured_output
    ? outer.structured_output
    : null;
  const resultText = outer && typeof outer.result === "string" ? outer.result : rawText;
  const parsed = structured || parseJsonFromText(resultText) || outer || {};
  const answerJson = typeof parsed.answer === "string" ? parseJsonFromText(parsed.answer) : null;
  const answerValue = answerJson && answerJson.answer
    ? answerJson.answer
    : parsed.answer || parsed.text || parsed.message || resultText || "";
  const answer = typeof answerValue === "string"
    ? answerValue.trim()
    : JSON.stringify(answerValue);
  return {
    provider,
    answer,
    sources: normalizeSources(
      parsed.sources || parsed.citations || parsed.references || (answerJson && answerJson.sources),
      provider,
      resultText
    )
  };
}

async function runCodex(payload) {
  const dir = await mkdtemp(join(tmpdir(), "sydney-assistant-"));
  const outputFile = join(dir, "codex-answer.txt");
  const prompt = buildPrompt("Codex", payload);
  try {
    const codexArgs = [
      "--search",
      "--ask-for-approval",
      "never",
      "exec",
      "--sandbox",
      "read-only",
      "--ephemeral",
      "--skip-git-repo-check",
      "--color",
      "never",
      "--output-last-message",
      outputFile,
      prompt
    ];
    await runProcess(
      "codex",
      codexArgs,
      ""
    );
    const answer = await readFile(outputFile, "utf8");
    return parseProviderOutput("Codex", answer);
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

async function runClaude(payload) {
  const { stdout } = await runProcess(
    "claude",
    [
      "-p",
      "--output-format",
      "json",
      "--permission-mode",
      "dontAsk",
      "--tools",
      "WebSearch,WebFetch",
      "--json-schema",
      responseSchema,
      buildPrompt("Claude", payload)
    ],
    ""
  );
  return parseProviderOutput("Claude", stdout);
}

function dedupeSources(results) {
  const byUrl = new Map();
  results.flatMap((result) => result.sources || []).forEach((source) => {
    const key = source.url.trim();
    if (!key) return;
    const existing = byUrl.get(key);
    if (!existing) {
      byUrl.set(key, source);
      return;
    }
    const providers = new Set([existing.provider, source.provider].filter(Boolean));
    existing.provider = [...providers].join("+");
    if (!existing.snippet && source.snippet) existing.snippet = source.snippet;
  });
  return [...byUrl.values()].slice(0, 8);
}

async function answerQuestion(payload) {
  const startedAt = Date.now();
  const requested = Array.isArray(payload.providers) && payload.providers.length
    ? payload.providers.map((provider) => String(provider).toLowerCase())
    : ["codex", "claude"];
  const tasks = [];
  if (requested.includes("codex")) tasks.push(runCodex(payload));
  if (requested.includes("claude")) tasks.push(runClaude(payload));
  if (!tasks.length) tasks.push(runCodex(payload), runClaude(payload));

  const settled = await Promise.allSettled(tasks);
  const results = settled
    .filter((item) => item.status === "fulfilled")
    .map((item) => item.value)
    .filter((item) => item.answer || item.sources.length);
  const errors = settled
    .filter((item) => item.status === "rejected")
    .map((item) => item.reason.message);

  if (!results.length) {
    const detail = errors.length ? errors.join(" | ") : "No provider returned an answer.";
    throw new Error(detail);
  }

  return {
    answer: results.map((result) => `${result.provider}: ${result.answer}`).join("\n\n"),
    provider: results.map((result) => result.provider).join("+"),
    sources: dedupeSources(results),
    errors: errors.map((error) => String(error || "").replace(/\s+/g, " ").slice(0, 260)),
    elapsedMs: Date.now() - startedAt
  };
}

const server = createServer(async (req, res) => {
  if (!isAllowedOrigin(req.headers.origin || "")) {
    sendJson(req, res, 403, { error: "Origin is not allowed." });
    return;
  }

  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders(req.headers.origin || ""));
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/health") {
    sendJson(req, res, 200, { ok: true, providers: ["codex", "claude"] });
    return;
  }

  if (req.method !== "POST" || req.url !== "/ask") {
    sendJson(req, res, 404, { error: "Use POST /ask." });
    return;
  }

  if (TOKEN && req.headers.authorization !== `Bearer ${TOKEN}`) {
    sendJson(req, res, 401, { error: "Missing or invalid bearer token." });
    return;
  }

  try {
    const payload = await readJsonBody(req);
    const question = String(payload.question || "").trim();
    if (!question || question.length > 500) {
      sendJson(req, res, 400, { error: "Question is required and must be 500 characters or fewer." });
      return;
    }
    const answer = await answerQuestion({ ...payload, question });
    sendJson(req, res, 200, answer);
  } catch (error) {
    sendJson(req, res, 502, { error: error.message });
  }
});

server.on("error", (error) => {
  console.error(`Sydney assistant bridge failed: ${error.message}`);
  process.exitCode = 1;
});

server.listen(PORT, HOST, () => {
  console.log(`Sydney assistant bridge listening on http://${HOST}:${PORT}/ask`);
  console.log(`Open ${PAGE_URL}?assistant=local to use the local Codex/Claude bridge.`);
});
