import {
  CHECKED_AT,
  climate,
  familyGroups,
  heroImage,
  itinerary,
  lodgingOptions,
  mealSuggestions,
  places,
  rentalChecklist,
  sources,
  trip
} from "./trip-data.mjs";
import {
  buildMapPoints,
  filterPlaces,
  localAnswer,
  makeAssistantPayload,
  makeCsv,
  makeKml,
  tripStatus,
  weatherMode
} from "./app-core.mjs";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const answerKey = "istanbul-family-trip-answers-v1";
const state = {
  lodging: lodgingOptions[0].id,
  day: tripStatus().day?.date || itinerary[0].date,
  mapPlace: "cvk",
  filters: { query: "", zone: "all", category: "all", rain: false, energy: null },
  answers: readStoredAnswers()
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function readStoredAnswers() {
  try {
    const value = JSON.parse(localStorage.getItem(answerKey) || "[]");
    return Array.isArray(value) ? value.slice(0, 6) : [];
  } catch {
    return [];
  }
}

function persistAnswers() {
  try { localStorage.setItem(answerKey, JSON.stringify(state.answers.slice(0, 6))); } catch { /* storage can be disabled */ }
}

function renderStatus() {
  const status = tripStatus();
  $("#status-pill").textContent = status.label;
  $("#mode-badge").textContent = status.mode === "planning" ? "계획 모드" : status.mode === "travel" ? "여행 중" : "기록 모드";
  if (status.mode === "travel" && status.day) state.day = status.day.date;
}

function renderToday() {
  const status = tripStatus();
  const card = $("#today-card");
  if (status.mode === "planning") {
    $("#today-heading").textContent = "지금 해야 할 일";
    card.innerHTML = `
      <p class="today-date">${escapeHtml(status.label)} / DECISION 01</p>
      <h3>먼저, 9명이 한 집에 머물 수 있는지 잠급니다.</h3>
      <p>CVK 4 Bedroom Residence의 10박 연속 재고와 실제 침대 구성을 확인하세요. 이 조건이 맞지 않을 때만 Peninsula 인접 객실과 허가된 전체 숙소로 넘어갑니다.</p>
      <div class="today-actions"><a href="#stay">숙소 비교 보기</a><a href="#family">항공 원칙 보기</a></div>`;
  } else {
    const day = status.day || itinerary.at(-1);
    $("#today-heading").textContent = status.mode === "travel" ? "오늘은 이것만" : "여행 기록";
    card.innerHTML = `
      <p class="today-date">${escapeHtml(day.date)} / ${escapeHtml(day.dow)}요일</p>
      <h3>${escapeHtml(day.title)}</h3>
      <p>${escapeHtml(day.main)}</p>
      <div class="today-actions"><a href="#plan" data-select-day="${escapeHtml(day.date)}">세부 일정</a><a href="#weather">날씨 판단</a></div>`;
  }
  $("#principles").innerHTML = trip.principles.map((text) => `<article class="principle-card"><p>${escapeHtml(text)}</p></article>`).join("");
}

function renderFamily() {
  $("#family-grid").innerHTML = familyGroups.map((group) => `
    <article class="family-card">
      <div class="origin-code">${escapeHtml(group.origin)}</div>
      <div class="route-line" aria-hidden="true"></div>
      <h3>${escapeHtml(group.label)}</h3>
      <p><strong>${escapeHtml(group.route)}</strong></p>
      <p>${escapeHtml(group.target)}</p>
      <p>${escapeHtml(group.carriers)}</p>
      <p>${escapeHtml(group.status)}</p>
      <span class="members">${escapeHtml(group.members)}</span>
    </article>`).join("");
}

function renderLodgingTabs() {
  $("#lodging-tabs").innerHTML = lodgingOptions.map((item) => `
    <button class="lodging-tab" type="button" role="tab" aria-selected="${item.id === state.lodging}" data-lodging="${escapeHtml(item.id)}">${item.rank}. ${escapeHtml(item.name.split(",")[0])}</button>`).join("");
  $$("[data-lodging]").forEach((button) => button.addEventListener("click", () => {
    state.lodging = button.dataset.lodging;
    renderLodgingTabs();
    renderLodgingDetail();
  }));
}

function renderLodgingDetail() {
  const item = lodgingOptions.find((candidate) => candidate.id === state.lodging) || lodgingOptions[0];
  $("#lodging-detail").innerHTML = `
    <div class="lodging-score">
      <div><div class="lodging-rank">RECOMMENDATION ${String(item.rank).padStart(2, "0")}</div><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.type)}</p></div>
      <div class="fit-score"><strong>${item.fit}</strong><span>/ 100 조건 적합도</span></div>
    </div>
    <div class="lodging-copy">
      <p class="lodging-verdict">${escapeHtml(item.verdict)}</p>
      <div class="spec-grid">
        <div class="spec"><small>정원</small><strong>${escapeHtml(item.capacity)}</strong></div>
        <div class="spec"><small>위치</small><strong>${escapeHtml(item.location)}</strong></div>
        <div class="spec" style="grid-column:1/-1"><small>구조</small><strong>${escapeHtml(item.layout)}</strong></div>
      </div>
      <div class="pros-cons">
        <div><h4>맞는 이유</h4><ul>${item.good.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul></div>
        <div><h4>확인할 것</h4><ul>${item.cautions.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul></div>
      </div>
      <div class="lodging-action"><strong>다음 행동</strong><br>${escapeHtml(item.action)}</div>
      <div class="button-row"><a class="text-button primary" href="${escapeHtml(item.official)}" target="_blank" rel="noreferrer">공식 페이지</a><a class="text-button" href="${escapeHtml(item.maps)}" target="_blank" rel="noreferrer">지도에서 보기</a></div>
    </div>`;
}

function renderRentalChecklist() {
  $("#rental-checklist").innerHTML = rentalChecklist.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function intensityDots(level, dark = true) {
  return `<span class="intensity">${dark ? "에너지" : ""}${[1, 2, 3].map((value) => `<i class="${value <= level ? "on" : ""}"></i>`).join("")}</span>`;
}

function renderDateRail() {
  $("#date-rail").innerHTML = itinerary.map((day) => `
    <button class="date-tab" type="button" role="tab" aria-selected="${day.date === state.day}" data-day="${day.date}">
      <small>${escapeHtml(day.dow)} / ${day.stay ? "STAY" : "MOVE"}</small><strong>${Number(day.date.slice(-2))}</strong>
    </button>`).join("");
  $$("[data-day]").forEach((button) => button.addEventListener("click", () => {
    state.day = button.dataset.day;
    renderDateRail();
    renderDayDetail();
  }));
  requestAnimationFrame(() => {
    const rail = $("#date-rail");
    const selected = $("[data-day][aria-selected='true']");
    if (rail && selected) rail.scrollLeft = Math.max(0, selected.offsetLeft - rail.clientWidth / 2 + selected.clientWidth / 2);
  });
}

function renderDayDetail() {
  const day = itinerary.find((item) => item.date === state.day) || itinerary[0];
  $("#day-detail").innerHTML = `
    <div class="day-intro">
      <div><div class="day-date">${escapeHtml(day.date)} / ${escapeHtml(day.dow)}요일</div><h3>${escapeHtml(day.title)}</h3><div class="day-zone">${escapeHtml(day.zone)}</div></div>
      <div>${intensityDots(day.intensity)}<p class="day-zone">${escapeHtml(day.transport)}</p></div>
    </div>
    <div class="day-main">
      <p>${escapeHtml(day.main)}</p>
      <ol class="timeline">${day.timeline.map((item, index) => `<li data-index="${String(index + 1).padStart(2, "0")}">${escapeHtml(item)}</li>`).join("")}</ol>
      <div class="plan-switcher">
        <div class="plan-option"><strong>PLAN B / 비</strong><span>${escapeHtml(day.rain)}</span></div>
        <div class="plan-option"><strong>PLAN C / 저강도</strong><span>${escapeHtml(day.low)}</span></div>
        <div class="plan-option"><strong>MEAL / 9인</strong><span>${escapeHtml(mealSuggestions[day.date])}</span></div>
      </div>
    </div>`;
}

function renderItineraryList() {
  $("#itinerary-list").innerHTML = itinerary.map((day) => `
    <a class="itinerary-row" href="#plan" data-list-day="${day.date}" id="day-${day.date}">
      <time>${day.date.slice(5).replace("-", "/")}</time>
      <div><strong>${escapeHtml(day.title)}</strong><small>${escapeHtml(day.main)}</small></div>
      <span class="row-zone">${escapeHtml(day.zone)}</span>
      <span class="energy-label">ENERGY ${day.intensity}</span>
    </a>`).join("");
  $$("[data-list-day]").forEach((link) => link.addEventListener("click", () => {
    state.day = link.dataset.listDay;
    renderDateRail();
    renderDayDetail();
  }));
}

async function renderWeather() {
  $("#climate-summary").textContent = climate.summary;
  $("#packing-list").innerHTML = climate.packing.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
  const mode = weatherMode();
  $("#weather-note").textContent = `${climate.note} ${mode.reason}`;
  if (!mode.live) return;
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.search = new URLSearchParams({
      latitude: "41.0082", longitude: "28.9784", timezone: "Europe/Istanbul",
      start_date: trip.arrivalDate, end_date: trip.checkoutDate,
      daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max"
    });
    const response = await fetch(url);
    if (!response.ok) throw new Error(`forecast ${response.status}`);
    const data = await response.json();
    const highs = data.daily?.temperature_2m_max || [];
    const lows = data.daily?.temperature_2m_min || [];
    const rain = data.daily?.precipitation_probability_max || [];
    if (!highs.length) return;
    const average = (values) => Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
    $(".weather-metric strong").textContent = `${average(lows)}–${average(highs)}°`;
    $(".weather-metric span").textContent = "여행 기간 예보 범위";
    $("#weather-note").textContent = `Open-Meteo 예보 갱신 완료. 기간 중 최고 강수확률 ${Math.max(...rain)}%. 보트 운항 여부는 하루 전 풍속과 운영사 판단을 따르세요.`;
  } catch {
    $("#weather-note").textContent = `${climate.note} 예보를 불러오지 못해 공식 장기 통계를 유지합니다.`;
  }
}

function uniqueValues(key) {
  return [...new Set(places.map((item) => item[key]))].sort((a, b) => a.localeCompare(b, "ko"));
}

function renderFilters() {
  $("#zone-filter").innerHTML = `<option value="all">모든 지역</option>${uniqueValues("zone").map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("")}`;
  $("#category-filter").innerHTML = `<option value="all">모든 분류</option>${uniqueValues("category").map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("")}`;
  $("#place-search").addEventListener("input", (event) => { state.filters.query = event.target.value; renderPlaces(); });
  $("#zone-filter").addEventListener("change", (event) => { state.filters.zone = event.target.value; renderPlaces(); });
  $("#category-filter").addEventListener("change", (event) => { state.filters.category = event.target.value; renderPlaces(); });
  $("#rain-filter").addEventListener("click", (event) => {
    state.filters.rain = !state.filters.rain;
    event.currentTarget.setAttribute("aria-pressed", String(state.filters.rain));
    renderPlaces();
  });
  $("#low-filter").addEventListener("click", (event) => {
    state.filters.energy = state.filters.energy ? null : 1;
    event.currentTarget.setAttribute("aria-pressed", String(Boolean(state.filters.energy)));
    renderPlaces();
  });
}

function renderPlaces() {
  const visible = filterPlaces(state.filters);
  $("#place-count").textContent = visible.length;
  $("#place-grid").innerHTML = visible.length ? visible.map((item) => `
    <article class="place-card">
      <div class="place-image ${item.image ? "" : "no-image"}">
        ${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy">` : `<span>${escapeHtml(item.name.slice(0, 2))}</span>`}
        <span class="place-tag">${escapeHtml(item.category)}</span>
      </div>
      <div class="place-copy">
        <div class="place-meta"><span>${escapeHtml(item.zone)}</span><span>${escapeHtml(item.duration)}</span><span>ENERGY ${item.energy}</span>${item.rain ? "<span>RAIN OK</span>" : ""}</div>
        <h3>${escapeHtml(item.name)}</h3>
        <p>${escapeHtml(item.why)}</p>
        <div class="place-warning">${escapeHtml(item.warning)}</div>
        <div class="place-links"><a href="${escapeHtml(item.official)}" target="_blank" rel="noreferrer">공식 정보</a><a href="${escapeHtml(item.maps)}" target="_blank" rel="noreferrer">지도</a></div>
      </div>
    </article>`).join("") : `<div class="empty-state">조건에 맞는 장소가 없습니다. 필터를 하나 지워 보세요.</div>`;
  $$(".place-image img").forEach((image) => image.addEventListener("error", () => {
    const frame = image.closest(".place-image");
    if (!frame) return;
    image.remove();
    frame.classList.add("no-image");
    const fallback = document.createElement("span");
    fallback.textContent = image.alt.slice(0, 2);
    frame.prepend(fallback);
  }, { once: true }));
}

function mapSvg() {
  const mapPlaces = places.filter((item) => !["식당", "카페", "제외", "조건부"].includes(item.category));
  const points = [
    ...buildMapPoints(mapPlaces),
    ...lodgingOptions.slice(0, 2).map((item) => ({ ...item, category: "숙소", duration: "기준점", energy: 1, rain: true, why: item.verdict, warning: item.cautions[0], x: ((item.lng - 28.93) / .14) * 1000, y: 560 - ((item.lat - 40.98) / .08) * 560 }))
  ];
  const unique = [...new Map(points.map((item) => [item.id, item])).values()];
  return `<svg viewBox="0 0 1000 560" aria-labelledby="map-title">
    <title id="map-title">이스탄불 주요 장소의 상대 위치</title>
    <rect class="map-water" width="1000" height="560" />
    <path class="map-land" d="M0 0H1000V166C900 188 830 216 767 233C675 258 596 254 523 230C445 205 376 210 312 243C221 289 117 304 0 281Z" />
    <path class="map-land" d="M0 560V346C125 351 222 324 305 283C382 245 447 249 522 274C608 303 695 303 786 278C858 258 927 232 1000 224V560Z" />
    <path class="map-road" d="M150 310C270 300 355 264 452 266S650 318 810 275" />
    <text class="map-label" x="32" y="55">GOLDEN HORN</text>
    <text class="map-label" x="790" y="92">ASIAN SIDE</text>
    <text class="map-label" x="418" y="520">HISTORIC PENINSULA</text>
    ${unique.map((item, index) => `<g class="map-pin ${item.id === state.mapPlace ? "active" : ""}" tabindex="0" role="button" aria-label="${escapeHtml(item.name)}" data-map-id="${escapeHtml(item.id)}" transform="translate(${Math.round(item.x)} ${Math.round(item.y)})"><circle r="8"></circle><text x="13" y="4">${index + 1}</text></g>`).join("")}
  </svg>`;
}

function renderMap() {
  $("#map-canvas").innerHTML = mapSvg();
  const all = [...places, ...lodgingOptions.slice(0, 2).map((item) => ({ ...item, category: "숙소", duration: "기준점", energy: 1, rain: true, why: item.verdict, warning: item.cautions[0] }))];
  const selected = all.find((item) => item.id === state.mapPlace) || lodgingOptions[0];
  $("#map-inspector").innerHTML = `
    <div class="mini">${escapeHtml(selected.category || selected.type)} / ${escapeHtml(selected.zone || selected.location)}</div>
    <h3>${escapeHtml(selected.name)}</h3>
    <p>${escapeHtml(selected.why || selected.verdict)}</p>
    <p>${escapeHtml(selected.duration || selected.layout)}</p>
    <p class="map-warning">${escapeHtml(selected.warning || selected.cautions?.[0] || "예약 전 공식 정보 확인")}</p>
    <a href="${escapeHtml(selected.maps)}" target="_blank" rel="noreferrer">실제 지도 열기</a>`;
  $$("[data-map-id]").forEach((pin) => {
    const select = () => { state.mapPlace = pin.dataset.mapId; renderMap(); };
    pin.addEventListener("click", select);
    pin.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(); } });
  });
}

function endpointFromSettings() {
  const params = new URLSearchParams(location.search);
  const provided = params.get("assistant");
  if (provided && /^https:\/\//.test(provided)) {
    try { localStorage.setItem("istanbul-assistant-endpoint", provided); } catch { /* ignore */ }
    return provided;
  }
  try { return localStorage.getItem("istanbul-assistant-endpoint") || ""; } catch { return ""; }
}

async function askRemote(question, endpoint) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(makeAssistantPayload(question))
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.answer) throw new Error(result.error || `AI ${response.status}`);
  return result;
}

function renderAnswers() {
  const board = $("#answer-board");
  board.innerHTML = "";
  for (const entry of state.answers) {
    const node = $("#answer-template").content.cloneNode(true);
    $(".answer-meta", node).textContent = `${entry.provider} / ${entry.time}`;
    $("h3", node).textContent = entry.question;
    $(".answer-text", node).textContent = entry.answer;
    const sourceBox = $(".answer-sources", node);
    for (const source of entry.sources || []) {
      const link = document.createElement("a");
      link.href = source.url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = source.title || "근거";
      sourceBox.append(link);
    }
    board.append(node);
  }
}

async function handleQuestion(question) {
  const clean = String(question || "").trim();
  if (!clean) return;
  const button = $("#ask-form button");
  button.disabled = true;
  $("#assistant-state").textContent = "답을 구성하는 중";
  const endpoint = endpointFromSettings();
  let result;
  try {
    result = endpoint ? await askRemote(clean, endpoint) : localAnswer(clean);
    $("#assistant-state").textContent = endpoint ? `${result.provider || "AI"} 검색 완료` : "앱 내장 가이드 사용 중";
  } catch {
    result = localAnswer(clean);
    $("#assistant-state").textContent = "AI 서버에 연결하지 못해 앱 자료로 답했습니다";
  } finally {
    button.disabled = false;
  }
  state.answers.unshift({
    question: clean,
    answer: result.answer,
    provider: result.provider || "가족 데스크",
    sources: (result.sources || []).slice(0, 5),
    time: new Intl.DateTimeFormat("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date())
  });
  state.answers = state.answers.slice(0, 6);
  persistAnswers();
  renderAnswers();
}

function wireAssistant() {
  $("#ask-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = $("#question");
    await handleQuestion(input.value);
    input.value = "";
  });
  $$("#prompt-chips button").forEach((button) => button.addEventListener("click", () => {
    $("#question").value = button.textContent;
    handleQuestion(button.textContent);
  }));
  renderAnswers();
}

function downloadFile(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function wireUtilities() {
  $("#download-csv").addEventListener("click", () => downloadFile("istanbul-family-trip-places.csv", `\uFEFF${makeCsv()}`, "text/csv;charset=utf-8"));
  $("#download-kml").addEventListener("click", () => downloadFile("istanbul-family-trip-places.kml", makeKml(), "application/vnd.google-earth.kml+xml"));
  $("#source-list").innerHTML = sources.map((source) => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer"><span>${escapeHtml(source.title)}</span><time>${escapeHtml(source.checkedAt)}</time></a>`).join("");
}

function wireNavigation() {
  window.addEventListener("scroll", () => $(".topbar").classList.toggle("scrolled", scrollY > 40), { passive: true });
  const links = $$(".bottom-nav a");
  const targets = links.map((link) => $(link.getAttribute("href"))).filter(Boolean);
  const observer = new IntersectionObserver((entries) => {
    const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!current) return;
    links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${current.target.id}`));
  }, { rootMargin: "-20% 0px -65%", threshold: [0, .2, .5] });
  targets.forEach((target) => observer.observe(target));
}

function restoreDeepLink() {
  if (!location.hash) return;
  const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (!target) return;
  setTimeout(() => target.scrollIntoView({ block: "start" }), 120);
}

function boot() {
  $("#hero-image").src = heroImage;
  renderStatus();
  renderToday();
  renderFamily();
  renderLodgingTabs();
  renderLodgingDetail();
  renderRentalChecklist();
  renderDateRail();
  renderDayDetail();
  renderItineraryList();
  renderWeather();
  renderFilters();
  renderPlaces();
  renderMap();
  wireAssistant();
  wireUtilities();
  wireNavigation();
  restoreDeepLink();
  document.documentElement.dataset.checkedAt = CHECKED_AT;
}

boot();
