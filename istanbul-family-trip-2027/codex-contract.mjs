export const SECTIONS = ["plan", "stay", "budget", "guide", "dining"];
export const EMPTY_UPDATES = { version: 1, revision: "initial", updates: [] };
const textSchema = { type: "string" };
const sourceSchema = {
  type: "object", additionalProperties: false, required: ["title", "url"],
  properties: { title: textSchema, url: textSchema }
};
export const OUTPUT_SCHEMA = {
  type: "object", additionalProperties: false, required: ["answer", "sources", "updates"],
  properties: {
    answer: textSchema,
    sources: { type: "array", items: sourceSchema },
    updates: {
      type: "array", items: {
        type: "object", additionalProperties: false,
        required: ["section", "kind", "title", "body", "sources"],
        properties: {
          section: { type: "string", enum: SECTIONS },
          kind: { type: "string", enum: ["preference", "suggestion"] },
          title: textSchema, body: textSchema,
          sources: { type: "array", items: sourceSchema }
        }
      }
    }
  }
};

function boundedText(value, max, label) {
  if (typeof value !== "string" || !value.trim() || value.length > max) throw new Error(`${label} 형식이 올바르지 않습니다.`);
  return value.trim().replaceAll("\u00b7", ",");
}

export function safeSources(value) {
  if (!Array.isArray(value) || value.length > 8) throw new Error("출처는 최대 8개입니다.");
  return value.map((source) => {
    const title = boundedText(source?.title, 180, "출처 제목");
    const raw = boundedText(source?.url, 2048, "출처 주소");
    const url = new URL(raw);
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) throw new Error("안전한 웹 출처만 사용할 수 있습니다.");
    return { title, url: url.href };
  });
}

export function validateRequest(value) {
  if (!value || !["ask", "improve"].includes(value.mode)) throw new Error("질문 또는 페이지 보완을 선택해 주세요.");
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value.requestId || "")) throw new Error("요청 ID가 올바르지 않습니다.");
  const history = value.history ?? [];
  if (!Array.isArray(history) || history.length > 8) throw new Error("대화 기록은 최대 8개입니다.");
  return {
    requestId: value.requestId.toLowerCase(), mode: value.mode,
    question: boundedText(value.question, 2000, "질문"),
    history: history.map((entry) => ({
      question: boundedText(entry?.question, 2000, "이전 질문"),
      answer: boundedText(entry?.answer, 6000, "이전 답변")
    }))
  };
}

export function validateResult(value) {
  const answer = boundedText(value?.answer, 6000, "Codex 답변");
  const sources = safeSources(value.sources);
  if (!Array.isArray(value.updates) || value.updates.length > 3) throw new Error("한 번에 최대 3개까지 보완할 수 있습니다.");
  const updates = value.updates.map((note) => {
    if (!SECTIONS.includes(note?.section) || !["preference", "suggestion"].includes(note?.kind)) throw new Error("보완 항목 분류가 올바르지 않습니다.");
    const result = {
      section: note.section, kind: note.kind,
      title: boundedText(note.title, 100, "보완 제목"),
      body: boundedText(note.body, 1800, "보완 내용"),
      sources: safeSources(note.sources)
    };
    if (result.kind === "suggestion" && !result.sources.length) throw new Error("추천에는 확인할 출처가 필요합니다.");
    return result;
  });
  return { answer, sources, updates };
}

export function validateDocument(value) {
  if (value?.version !== 1 || typeof value.revision !== "string" || !Array.isArray(value.updates) || value.updates.length > 120) throw new Error("저장된 보완 자료를 확인해 주세요. 원본은 유지했습니다.");
  for (const note of value.updates) {
    validateResult({ answer: "검증", sources: [], updates: [note] });
    if (typeof note.id !== "string" || typeof note.createdAt !== "string") throw new Error("저장된 보완 기록이 올바르지 않습니다.");
  }
  return value;
}
