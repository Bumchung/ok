import {
  DEFAULT_ASSISTANT_URL, UPDATE_SECTIONS, AssistantError, cleanHistory, cleanSources, cleanUpdates,
  createAssistantClient, isLoopbackOrigin, localPreviewUrl, normalizeBaseUrl, pollJob
} from "./assistant-client.mjs";

const STORAGE_KEY = "istanbul-codex-assistant-v1";
const $ = (selector, root = document) => root.querySelector(selector);
const node = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};
const read = (storage, key, fallback) => {
  try { return JSON.parse(storage.getItem(`${STORAGE_KEY}:${key}`)) ?? fallback; } catch { return fallback; }
};
const write = (storage, key, value) => {
  try {
    if (value === null) storage.removeItem(`${STORAGE_KEY}:${key}`);
    else storage.setItem(`${STORAGE_KEY}:${key}`, JSON.stringify(value));
    return true;
  } catch { return false; }
};
const formatTime = (value) => {
  const date = new Date(value);
  return Number.isFinite(date.valueOf()) ? new Intl.DateTimeFormat("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(date) : "";
};

function appendSources(container, sources) {
  for (const source of cleanSources(sources)) {
    const link = node("a", "", source.title);
    link.href = source.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    container.append(link);
  }
}

export function initAssistant({ core, getItinerary }) {
  const root = $("#ask");
  if (!root) return;
  // Storage can be unavailable in private or restricted browser contexts.
  let sessionStore, localStore;
  try { sessionStore = sessionStorage; } catch { /* Keep this session in memory. */ }
  try { localStore = localStorage; } catch { /* Keep this conversation in memory. */ }
  const localPage = isLoopbackOrigin(location.origin);
  const defaultBase = localPage ? location.origin : DEFAULT_ASSISTANT_URL;
  let baseUrl;
  try { baseUrl = normalizeBaseUrl(read(sessionStore, "base", defaultBase)); } catch { baseUrl = defaultBase; }
  let token = read(sessionStore, "token", "");
  if (typeof token !== "string") token = "";
  let conversation = read(localStore, "conversation", []);
  conversation = (Array.isArray(conversation) ? conversation : []).filter((entry) => typeof entry?.question === "string" && typeof entry?.answer === "string").slice(-20);
  let pending = read(sessionStore, "pending", null);
  if (!pending || typeof pending.requestId !== "string" || typeof pending.question !== "string"
    || !["ask", "improve"].includes(pending.mode) || pending.baseUrl !== baseUrl) pending = null;
  let client = null;
  let mode = pending?.mode || "ask";
  let busy = false;
  let connecting = false;
  let controller = null;
  let lastFailure = null;
  let published = cleanUpdates({ updates: [] });
  let currentUpdates = published;
  const input = $("#question");
  const submit = $("#assistant-submit");
  const status = $("#assistant-state");
  const connectState = $("#assistant-connection-state");
  const settings = $("#assistant-connection-settings");
  const errorBox = $("#assistant-error");
  const retry = $("#assistant-retry");
  const baseInput = $("#assistant-address");
  const tokenInput = $("#assistant-token");
  const preview = $("#assistant-preview");
  baseInput.value = baseUrl;
  preview.href = localPreviewUrl(baseUrl);
  const draft = pending?.question || read(sessionStore, "draft", "");
  input.value = typeof draft === "string" ? draft.slice(0, 2000) : "";

  function setStatus(text) { status.textContent = text; }

  function renderControls() {
    root.dataset.connected = client ? "true" : "false";
    root.dataset.busy = busy ? "true" : "false";
    connectState.textContent = connecting ? "컴퓨터에 연결하는 중" : client ? "Codex 연결됨" : "컴퓨터 연결 대기";
    $("#assistant-connection-detail").textContent = client
      ? "이 컴퓨터의 Codex가 여행 계획을 읽고 답변합니다."
      : "Codex가 실행 중인 컴퓨터에서 연결하세요.";
    $("#assistant-disconnect").hidden = !client;
    $("#assistant-connect").disabled = connecting || busy;
    baseInput.disabled = Boolean(pending) || connecting || busy;
    tokenInput.disabled = connecting || busy;
    submit.disabled = !client || busy || Boolean(pending);
    submit.textContent = busy ? "답변을 준비하고 있어요" : mode === "improve" ? "답변 받고 페이지 보완" : "질문 보내기";
    input.disabled = busy;
    input.readOnly = Boolean(pending);
    $("#assistant-count").textContent = `${input.value.length.toLocaleString("ko-KR")} / 2,000`;
    $("#assistant-mode-note").textContent = mode === "improve"
      ? "답변과 함께 일정, 숙소, 예산, 장소, 식당에 보완 카드를 저장합니다."
      : "여행 계획을 바탕으로 답변합니다. 페이지는 바뀌지 않아요.";
    $("#assistant-clear").disabled = busy || !conversation.length;
    for (const button of root.querySelectorAll("[data-assistant-mode]")) {
      button.setAttribute("aria-pressed", String(button.dataset.assistantMode === mode));
      button.disabled = busy || Boolean(pending);
    }
    for (const button of root.querySelectorAll("#prompt-chips button")) button.disabled = busy || Boolean(pending);
    retry.hidden = !(pending || lastFailure) || busy;
    retry.disabled = !client || connecting;
    retry.textContent = pending ? "진행 상황 다시 확인" : "같은 질문 다시 보내기";
  }

  function showError(error) {
    errorBox.hidden = false;
    errorBox.textContent = error.message || "응답을 확인하지 못했어요. 잠시 뒤 다시 시도해주세요.";
  }

  function clearError() { errorBox.hidden = true; errorBox.textContent = ""; }

  function renderConversation() {
    const board = $("#answer-board");
    board.replaceChildren();
    $("#assistant-conversation-empty").hidden = Boolean(conversation.length);
    $("#assistant-conversation-count").textContent = `${conversation.length}개`;
    for (const entry of conversation) {
      const article = node("article", "assistant-turn");
      const question = node("div", "assistant-question");
      question.append(node("span", "assistant-turn-label", "나의 질문"), node("h4", "", entry.question));
      const answer = node("div", "assistant-answer");
      const meta = node("div", "assistant-turn-meta");
      meta.append(node("span", "assistant-turn-label", "Codex"), node("time", "", formatTime(entry.createdAt)));
      answer.append(meta, node("p", "assistant-answer-text", entry.answer));
      const links = node("div", "answer-sources");
      appendSources(links, entry.sources);
      if (links.childElementCount) answer.append(links);
      if (entry.saved) answer.append(node("p", "assistant-saved", "✓ 컴퓨터 파일에 보완 저장"));
      else if (entry.mode === "improve") answer.append(node("p", "assistant-saved", "이번 답변에는 새로 저장할 보완이 없습니다."));
      article.append(question, answer);
      board.append(article);
    }
  }

  function updateCard(update, scope, compact = false) {
    const card = node("article", `planner-note${compact ? " compact" : ""}`);
    const meta = node("div", "planner-note-meta");
    const section = node("a", "", UPDATE_SECTIONS[update.section]);
    section.href = `#${update.section}`;
    meta.append(section, node("span", "", update.kind === "preference" ? "우리 가족의 취향" : "여행 보완"));
    card.append(meta, node("h4", "", update.title), node("p", "", update.body));
    const links = node("div", "answer-sources");
    appendSources(links, update.sources);
    if (links.childElementCount) card.append(links);
    card.append(node("small", "planner-note-scope", scope === "local" ? "컴퓨터에 저장됨" : "공개 페이지에 반영됨"));
    return card;
  }

  function renderUpdates(value, scope) {
    currentUpdates = cleanUpdates(value);
    const all = currentUpdates.updates;
    $("#planner-updates-empty").hidden = Boolean(all.length);
    $("#planner-update-count").textContent = `${all.length}개`;
    $("#planner-update-scope").textContent = scope === "local"
      ? "이 컴퓨터에 저장된 보완입니다. 공개 사이트 배포는 별도입니다."
      : "공개 페이지에 반영된 보완입니다.";
    const board = $("#planner-updates");
    board.replaceChildren(...all.slice(-6).reverse().map((update) => updateCard(update, scope, true)));
    for (const [section, title] of Object.entries(UPDATE_SECTIONS)) {
      const container = $(`#${section} .wrap`);
      if (!container) continue;
      let panel = $(".planner-section-updates", container);
      const entries = all.filter((entry) => entry.section === section);
      if (!entries.length) { panel?.remove(); continue; }
      if (!panel) { panel = node("div", "planner-section-updates"); container.append(panel); }
      const heading = node("div", "planner-section-heading");
      heading.append(node("p", "kicker", "FROM OUR CONVERSATION"), node("h3", "", `대화로 보완한 ${title}`));
      const grid = node("div", "planner-section-grid");
      grid.append(...entries.map((entry) => updateCard(entry, scope)));
      panel.replaceChildren(heading, grid);
    }
  }

  async function loadPublished() {
    try {
      const response = await fetch("./planner-updates.json", { cache: "no-cache" });
      if (!response.ok) return;
      published = cleanUpdates(await response.json());
      if (!client) renderUpdates(published, localPage ? "local" : "published");
    } catch { /* The existing travel guide remains available offline. */ }
  }

  function persistPending() { write(sessionStore, "pending", pending); }

  async function finish(job, request) {
    if (job.status === "failed") {
      pending = null;
      persistPending();
      lastFailure = request;
      throw new AssistantError(job.error || "답변을 만들지 못했어요. 질문을 확인하고 다시 보내주세요.", "job");
    }
    if (typeof job.answer !== "string" || !job.answer.trim()) throw new AssistantError("답변 내용이 비어 있어요. 같은 작업을 다시 확인해주세요.", "response");
    if (!conversation.some((entry) => entry.id === job.id)) {
      conversation.push({ id: job.id, question: request.question, answer: job.answer, sources: cleanSources(job.sources),
        mode: request.mode, saved: job.saved === true, createdAt: job.createdAt || new Date().toISOString() });
      conversation = conversation.slice(-20);
      const stored = write(localStore, "conversation", conversation);
      $("#assistant-history-note").textContent = stored ? "대화는 이 브라우저에 저장됩니다." : "브라우저 저장이 차단되어 새로고침하면 대화가 사라질 수 있어요.";
    }
    if (job.saved === true) {
      try { renderUpdates(await client.updates(), "local"); }
      catch {
        renderUpdates({ revision: job.revision, updates: [...currentUpdates.updates, ...(job.updates || [])] }, "local");
      }
    }
    preview.href = localPreviewUrl(baseUrl, job.previewUrl);
    pending = null;
    lastFailure = null;
    persistPending();
    input.value = "";
    write(sessionStore, "draft", null);
    setStatus(job.saved === true ? "답변을 받았고, 보완 내용을 컴퓨터에 저장했습니다." : "답변이 도착했어요. 이어서 질문해보세요.");
    renderConversation();
  }

  async function runPending() {
    if (busy || !client || !pending) return;
    busy = true;
    controller = new AbortController();
    const signal = controller.signal;
    const request = pending;
    clearError();
    setStatus(request.id ? "진행 중인 답변을 이어서 확인하고 있어요." : "Codex가 여행 계획을 읽고 답변을 준비하고 있어요.");
    renderControls();
    try {
      if (!request.id) {
        const job = await client.start(request, { signal });
        if (typeof job.id !== "string" || !job.id) throw new AssistantError("작업 번호를 받지 못했어요. 같은 요청을 다시 확인해주세요.", "response");
        request.id = job.id;
        persistPending();
      }
      const result = await pollJob(client, request.id, { signal });
      if (!signal.aborted) await finish(result, request);
    } catch (error) {
      if (error.kind !== "cancelled") {
        if (error.status === 404 && request.id) {
          pending = null;
          persistPending();
          lastFailure = request;
          error = new AssistantError("이 작업의 진행 기록을 찾지 못했어요. 질문은 남겨두었습니다. 저장된 보완 내용을 먼저 확인하고, 필요하면 다시 보내주세요.", "missing", 404);
        }
        if (error.kind === "auth") {
          client = null;
          token = "";
          write(sessionStore, "token", null);
          settings.open = true;
        }
        showError(error);
        setStatus(pending ? "질문을 보관했습니다. 다시 확인해도 같은 작업을 이어갑니다." : "질문을 보관했습니다. 내용을 수정하거나 다시 보내주세요.");
      }
    } finally {
      busy = false;
      controller = null;
      renderControls();
    }
  }

  async function connect({ automatic = false } = {}) {
    if (connecting || busy) return;
    connecting = true;
    clearError();
    renderControls();
    try {
      const chosenBase = normalizeBaseUrl(baseInput.value.trim());
      if (pending && pending.baseUrl !== chosenBase) throw new AssistantError("진행 중인 질문이 있는 컴퓨터에 먼저 연결해주세요.", "address");
      let chosenToken = tokenInput.value.trim() || (chosenBase === baseUrl ? token : "");
      const probe = createAssistantClient({ baseUrl: chosenBase, pageOrigin: location.origin });
      const health = await probe.health();
      if (health.ok !== true || health.provider !== "Codex CLI") throw new AssistantError("여행 도우미가 실행된 연결 주소인지 확인해주세요.", "response");
      if (localPage && chosenBase === location.origin) {
        const session = await probe.session();
        chosenToken = session.token;
        preview.href = localPreviewUrl(chosenBase, session.previewUrl);
      }
      if (typeof chosenToken !== "string" || !chosenToken) throw new AssistantError("컴퓨터에 표시된 연결 코드를 입력해주세요.", "auth");
      const candidate = createAssistantClient({ baseUrl: chosenBase, token: chosenToken, pageOrigin: location.origin });
      const updates = await candidate.updates();
      client = candidate;
      baseUrl = chosenBase;
      token = chosenToken;
      tokenInput.value = "";
      write(sessionStore, "base", baseUrl);
      write(sessionStore, "token", token);
      preview.href = localPreviewUrl(baseUrl);
      settings.open = false;
      renderUpdates(updates, "local");
      setStatus(pending ? "연결됐어요. 이전 질문을 이어서 확인합니다." : "연결됐어요. 질문하거나 페이지를 보완해보세요.");
    } catch (error) {
      client = null;
      if (error.kind === "auth") { token = ""; write(sessionStore, "token", null); }
      if (!automatic) { showError(error); settings.open = true; }
      setStatus(pending ? "컴퓨터를 연결하면 이전 질문의 진행 상황을 이어서 확인할 수 있어요." : "컴퓨터를 연결하면 Codex와 대화할 수 있어요. 여행 자료 검색은 바로 사용할 수 있습니다.");
    } finally {
      connecting = false;
      renderControls();
    }
    if (client && pending) await runPending();
  }

  function startQuestion(question, chosenMode) {
    if (busy || pending || !client) return;
    const clean = String(question || "").trim();
    if (!clean) { input.focus(); return; }
    if (clean.length > 2000) { showError(new AssistantError("질문을 2,000자 이내로 적어주세요.")); return; }
    pending = { requestId: crypto.randomUUID(), question: clean, mode: chosenMode, history: cleanHistory(conversation),
      baseUrl, createdAt: new Date().toISOString(), id: null };
    lastFailure = null;
    persistPending();
    runPending();
  }

  $("#ask-form").addEventListener("submit", (event) => { event.preventDefault(); startQuestion(input.value, mode); });
  input.addEventListener("input", () => { write(sessionStore, "draft", input.value); renderControls(); });
  root.querySelectorAll("[data-assistant-mode]").forEach((button) => button.addEventListener("click", () => {
    mode = button.dataset.assistantMode;
    renderControls();
  }));
  root.querySelectorAll("#prompt-chips button").forEach((button) => button.addEventListener("click", () => {
    input.value = button.dataset.prompt;
    mode = button.dataset.mode || "ask";
    write(sessionStore, "draft", input.value);
    renderControls();
    input.focus();
  }));
  $("#assistant-connection-form").addEventListener("submit", (event) => { event.preventDefault(); connect(); });
  $("#assistant-disconnect").addEventListener("click", () => {
    controller?.abort();
    client = null;
    token = "";
    tokenInput.value = "";
    write(sessionStore, "token", null);
    clearError();
    renderUpdates(published, localPage ? "local" : "published");
    setStatus(pending ? "연결을 끊었습니다. 진행 중인 작업은 컴퓨터에서 계속되며, 다시 연결하면 확인할 수 있어요." : "연결을 끊고 이 탭의 연결 코드를 지웠습니다.");
    renderControls();
  });
  retry.addEventListener("click", () => {
    if (pending) runPending();
    else if (lastFailure) startQuestion(input.value || lastFailure.question, mode);
  });
  $("#assistant-clear").addEventListener("click", () => {
    conversation = [];
    write(localStore, "conversation", null);
    renderConversation();
    renderControls();
    setStatus("이 브라우저의 대화를 지웠습니다. 저장한 페이지 보완은 그대로 남아 있어요.");
  });
  $("#travel-search-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const query = $("#travel-search-question").value.trim();
    if (!query) return;
    const result = core.localAnswer(query, getItinerary());
    const target = $("#travel-search-result");
    target.replaceChildren(node("p", "assistant-answer-text", result.answer));
    const links = node("div", "answer-sources");
    appendSources(links, result.sources);
    target.append(links);
    target.hidden = false;
  });

  renderConversation();
  renderUpdates(published, localPage ? "local" : "published");
  renderControls();
  loadPublished();
  if (localPage || token) connect({ automatic: true });
  else if (pending) setStatus("컴퓨터를 연결하면 이전 질문의 진행 상황을 이어서 확인할 수 있어요.");
}
