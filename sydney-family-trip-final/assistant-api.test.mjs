import test from "node:test";
import assert from "node:assert/strict";
import {
  answerQuestion,
  checkRateLimit,
  corsHeaders,
  isAllowedOrigin,
  normalizePayload,
  parseClaudeResponse,
  parseOpenAIResponse
} from "./assistant-api-core.mjs";

test("origin policy allows only the production page and local development", () => {
  assert.equal(isAllowedOrigin("https://bumchung.github.io"), true);
  assert.equal(isAllowedOrigin("http://127.0.0.1:8080"), true);
  assert.equal(isAllowedOrigin("https://attacker.example"), false);
  assert.equal(corsHeaders("https://attacker.example")["Access-Control-Allow-Origin"], "null");
});

test("payload validation trims context and rejects oversized questions", () => {
  const payload = normalizePayload({
    question: "  비 오는 날 어디가 좋아?  ",
    context: Array.from({ length: 10 }, (_, index) => ({
      title: `장소 ${index}`,
      body: "x".repeat(800),
      url: index ? "javascript:alert(1)" : "https://example.com"
    }))
  });
  assert.equal(payload.question, "비 오는 날 어디가 좋아?");
  assert.equal(payload.context.length, 6);
  assert.equal(payload.context[0].body.length, 500);
  assert.equal(payload.context[1].url, "");
  assert.throws(() => normalizePayload({ question: "x".repeat(501) }), /500 characters/);
});

test("rate limiter closes after the configured window quota", () => {
  const now = Date.now();
  let result;
  for (let index = 0; index < 21; index += 1) result = checkRateLimit("203.0.113.10", now);
  assert.equal(result.allowed, false);
  assert.equal(result.remaining, 0);
});

test("OpenAI and Claude parsers retain answers and cited URLs", () => {
  const gpt = parseOpenAIResponse({
    output_text: "GPT 답변",
    output: [{
      content: [{
        type: "output_text",
        text: "GPT 답변",
        annotations: [{
          type: "url_citation",
          url: "https://transportnsw.info/",
          title: "Transport for NSW"
        }]
      }]
    }]
  });
  const claude = parseClaudeResponse({
    content: [{
      type: "text",
      text: "Claude 답변",
      citations: [{
        type: "web_search_result_location",
        url: "https://www.bom.gov.au/",
        title: "Bureau of Meteorology",
        cited_text: "Forecast"
      }]
    }]
  });
  assert.equal(gpt.answer, "GPT 답변");
  assert.equal(gpt.sources[0].url, "https://transportnsw.info/");
  assert.equal(claude.answer, "Claude 답변");
  assert.equal(claude.sources[0].url, "https://www.bom.gov.au/");
});

test("dual-provider orchestration degrades to one model without losing the answer", async () => {
  const seenAuth = [];
  const fetchImpl = async (url, options) => {
    seenAuth.push(options.headers.Authorization);
    if (url.endsWith("/v1/responses")) {
      return new Response(JSON.stringify({
        output_text: "GPT만 정상 응답",
        output: []
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ error: { message: "Claude unavailable" } }), {
      status: 503,
      headers: { "Content-Type": "application/json" }
    });
  };
  const result = await answerQuestion(
    { question: "오늘 일정 추천" },
    { fetchImpl, authToken: "request-oidc-token" }
  );
  assert.match(result.answer, /GPT만 정상 응답/);
  assert.equal(result.provider, "GPT");
  assert.equal(result.errors.length, 1);
  assert.deepEqual(seenAuth, ["Bearer request-oidc-token", "Bearer request-oidc-token"]);
});
