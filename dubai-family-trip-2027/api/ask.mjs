import {
  answerQuestion,
  assistantMeta,
  checkRateLimit,
  clientIp,
  corsHeaders,
  isAllowedOrigin
} from "../assistant-api-core.mjs";

export const config = { maxDuration: 60 };

function sendJson(req, res, status, payload, extraHeaders = {}) {
  const origin = String(req.headers?.origin || "");
  res.writeHead(status, {
    ...corsHeaders(origin),
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    ...extraHeaders
  });
  res.end(JSON.stringify(payload));
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") {
    if (JSON.stringify(req.body).length > 24576) throw new Error("Request body too large.");
    return req.body;
  }
  if (typeof req.body === "string") return JSON.parse(req.body);
  let body = "";
  for await (const chunk of req) {
    body += chunk.toString();
    if (body.length > 24576) throw new Error("Request body too large.");
  }
  return body ? JSON.parse(body) : {};
}

export default async function handler(req, res) {
  const origin = String(req.headers?.origin || "");
  if (req.method === "OPTIONS") {
    if (!isAllowedOrigin(origin)) {
      sendJson(req, res, 403, { error: "Origin is not allowed." });
      return;
    }
    res.writeHead(204, corsHeaders(origin));
    res.end();
    return;
  }
  if (req.method === "GET") {
    sendJson(req, res, 200, { ok: true, ...assistantMeta });
    return;
  }
  if (req.method !== "POST") {
    sendJson(req, res, 405, { error: "Use POST /api/ask." }, { "Allow": "GET, POST, OPTIONS" });
    return;
  }
  if (!isAllowedOrigin(origin)) {
    sendJson(req, res, 403, { error: "Origin is not allowed." });
    return;
  }
  const rate = checkRateLimit(clientIp(req.headers));
  if (!rate.allowed) {
    sendJson(req, res, 429, { error: "Too many requests. Try again shortly." }, { "Retry-After": String(rate.retryAfter), "X-RateLimit-Remaining": "0" });
    return;
  }
  try {
    const payload = await readBody(req);
    const oidcToken = String(req.headers?.["x-vercel-oidc-token"] || "");
    const result = await answerQuestion(payload, { authToken: oidcToken });
    sendJson(req, res, 200, result, { "X-RateLimit-Remaining": String(rate.remaining) });
  } catch (error) {
    const message = String(error?.message || "Assistant request failed.");
    const clientError = /Question is required|Request body too large|Unexpected token/.test(message);
    if (!clientError) console.error("[dubai-assistant]", message);
    sendJson(req, res, clientError ? 400 : 502, { error: clientError ? message : "AI search is temporarily unavailable." });
  }
}
