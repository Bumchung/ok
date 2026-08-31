const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

export function bootTripApp({ data, core }) {
  const { CHECKED_AT, climate, familyGroups, heroImage, itinerary, lodgingOptions, mealSuggestions, observedTripComQuotes = [], places, rentalChecklist, sources, trip, tripComCostSummary } = data;
  const { distanceKm, filterPlaces, itineraryForPace = (_pace, days) => days, localAnswer, makeAssistantPayload, makeCsv, makeGoogleCalendarUrl, makeIcs, makeKml, tripStatus, weatherMode } = core;
  const cityKey = trip.destination === "두바이" ? "dubai" : "istanbul";
  const answerKey = `${cityKey}-family-trip-answers-v2`;
  const endpointKey = trip.destination === "두바이" ? "dubai-assistant-endpoint" : "istanbul-assistant-endpoint";
  const defaultOrigin = lodgingOptions[0];
  const state = {
    lodging: lodgingOptions[0].id,
    day: tripStatus().day?.date || itinerary[0].date,
    pace: trip.paceModes?.default || "gentle",
    mapPlace: places.find((item) => item.id === lodgingOptions[0].id)?.id || places[0].id,
    mapZoom: trip.destination === "두바이" ? 11 : 12,
    filters: { query: "", zone: "all", category: "all", rain: false, energy: null },
    nearbyOrigin: { lat: defaultOrigin.lat, lng: defaultOrigin.lng },
    nearbyLabel: `${defaultOrigin.name} 기준`,
    userLocation: null,
    answers: readStoredAnswers()
  };

  function activeItinerary() { return itineraryForPace(state.pace, itinerary); }

  function escapeHtml(value) {
    return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }

  function readStoredAnswers() {
    try {
      const value = JSON.parse(localStorage.getItem(answerKey) || "[]");
      return Array.isArray(value) ? value.slice(0, 6) : [];
    } catch { return []; }
  }

  function persistAnswers() {
    try { localStorage.setItem(answerKey, JSON.stringify(state.answers)); } catch { /* private mode */ }
  }

  function attachImageFallbacks(root = document) {
    $$("img[data-fallback]", root).forEach((image) => image.addEventListener("error", () => {
      if (image.dataset.retried === "true") {
        image.closest(".photo-frame, .place-image, .lodging-photo, .day-photo")?.classList.add("photo-unavailable");
        image.remove();
        return;
      }
      image.dataset.retried = "true";
      image.src = image.dataset.fallback;
    }));
  }

  function renderStatus() {
    const status = tripStatus();
    $("#status-pill").textContent = status.label;
    $("#mode-badge").textContent = status.mode === "planning" ? "여행 준비 중" : status.mode === "travel" ? "여행 중" : "여행 기록";
  }

  function renderToday() {
    const status = tripStatus();
    const days = activeItinerary();
    const day = days.find((item) => item.date === status.day?.date) || days[0];
    $("#today-heading").textContent = status.mode === "planning" ? "가장 먼저 결정할 것" : status.mode === "travel" ? "오늘은 이만큼만" : "다시 볼 여행 기록";
    $("#today-card").innerHTML = `<div class="today-copy"><span class="today-date">${escapeHtml(status.label)} / ${escapeHtml(day.date.slice(5).replace("-", "/"))}</span><h3>${escapeHtml(status.mode === "planning" ? lodgingOptions[0].name : day.title)}</h3><p>${escapeHtml(status.mode === "planning" ? lodgingOptions[0].verdict : day.main)}</p></div><div class="today-actions"><a href="${status.mode === "planning" ? "#stay" : "#plan"}">${status.mode === "planning" ? "숙소 비교 보기" : "오늘 일정 보기"}</a><a href="#nearby">지금 가까운 곳</a><a href="#ask">이 계획에 질문하기</a></div>`;
    $("#principles").innerHTML = trip.principles.map((item, index) => `<article class="principle-card"><span>원칙 ${index + 1}</span><p>${escapeHtml(item)}</p></article>`).join("");
  }

  function renderFamily() {
    $("#family-grid").innerHTML = familyGroups.map((group) => `<article class="family-card"><div class="origin-code">${escapeHtml(group.origin)}</div><div><span class="family-label">${escapeHtml(group.label)} / ${escapeHtml(group.members)}</span><h3>${escapeHtml(group.route)}</h3><p>${escapeHtml(group.target)}</p><small>${escapeHtml(group.carriers)}. ${escapeHtml(group.status)}</small></div></article>`).join("");
  }

  function renderLodgingTabs() {
    $("#lodging-tabs").innerHTML = lodgingOptions.map((item) => `<button type="button" role="tab" aria-selected="${item.id === state.lodging}" data-lodging="${escapeHtml(item.id)}"><span>${item.rank}</span>${escapeHtml(item.name.split(",")[0])}</button>`).join("");
    $$('[data-lodging]').forEach((button) => button.addEventListener("click", () => { state.lodging = button.dataset.lodging; renderLodgingTabs(); renderLodgingDetail(); }));
  }

  function lodgingPhoto(item) {
    return places.find((place) => place.id === item.id) || (item.image ? item : null) || { image: heroImage, imageFallback: heroImage, photoSource: item.official, photoLabel: `${item.name} 주변 이미지` };
  }

  function renderLodgingDetail() {
    const item = lodgingOptions.find((candidate) => candidate.id === state.lodging) || lodgingOptions[0];
    const photo = lodgingPhoto(item);
    const connection = { guaranteed: "연결 확약", request_only: "인접 또는 연결 요청", not_required: "연결 불필요" }[item.hotelPlan?.connection] || "직접 확인";
    $("#lodging-detail").innerHTML = `<figure class="lodging-photo photo-frame"><img src="${escapeHtml(photo.image)}" data-fallback="${escapeHtml(photo.imageFallback || heroImage)}" alt="${escapeHtml(photo.photoLabel)}"><figcaption><span>${escapeHtml(photo.photoLabel)}</span><a href="${escapeHtml(photo.photoSource || item.official)}" target="_blank" rel="noreferrer">사진 출처</a></figcaption></figure><div class="lodging-copy"><div class="lodging-rank">현재 ${item.rank}순위 / ${escapeHtml(item.bookingModel === "hotel_rooms" ? "호텔 4실" : "한 집형")}</div><h3>${escapeHtml(item.name)}</h3><p class="lodging-verdict">${escapeHtml(item.verdict)}</p><div class="spec-grid"><div class="spec"><small>정원</small><strong>${escapeHtml(item.capacity)}</strong></div><div class="spec"><small>위치</small><strong>${escapeHtml(item.location)}</strong></div><div class="spec wide"><small>객실 조합</small><strong>${escapeHtml(item.hotelPlan?.arrangement || item.layout)} / ${escapeHtml(connection)}</strong></div></div><div class="pros-cons"><div><h4>우리 가족에게 좋은 점</h4><ul>${item.good.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul></div><div><h4>예약 전에 물어볼 것</h4><ul>${item.cautions.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul></div></div><div class="lodging-action"><strong>지금 보낼 문의</strong><p>${escapeHtml(item.action)}</p></div><div class="button-row"><a class="text-button primary" href="${escapeHtml(item.official)}" target="_blank" rel="noreferrer">공식 페이지</a><a class="text-button" href="${escapeHtml(item.maps)}" target="_blank" rel="noreferrer">Google Maps</a></div></div>`;
    attachImageFallbacks($("#lodging-detail"));
  }

  function renderTripComCosts() {
    const root = $("#tripcom-cost-grid");
    if (!root || !tripComCostSummary) return;
    const lodgingName = (id) => lodgingOptions.find((item) => item.id === id)?.name || id;
    root.innerHTML = `<article class="tripcom-cost-card benchmark"><span class="quote-status">시장 평균 비교선</span><h3>${escapeHtml(tripComCostSummary.benchmarkLabel)}</h3><strong>${escapeHtml(tripComCostSummary.benchmarkTotal)}</strong><p>${escapeHtml(tripComCostSummary.benchmarkNightly)}<br>${escapeHtml(tripComCostSummary.benchmarkFormula)}</p><small>${escapeHtml(tripComCostSummary.exactQuoteStatus)}</small><a href="${escapeHtml(tripComCostSummary.sourceUrl)}" target="_blank" rel="noreferrer">Trip.com 평균 원문</a></article>${observedTripComQuotes.map((quote) => { const exact = quote.status === "observed_exact"; return `<article class="tripcom-cost-card ${exact ? "exact" : ""}"><span class="quote-status ${exact ? "exact" : "warning"}">${exact ? "2027 조건 일치 실견적" : "2027 재견적 필요"}</span><h3>${escapeHtml(lodgingName(quote.lodgingId))}</h3><strong>${escapeHtml(quote.projectedDisplay)}</strong><p>${escapeHtml(`${quote.roomPlan}, ${quote.nightlyDisplay}`)}<br>${escapeHtml(quote.referenceStay)} / ${escapeHtml(quote.occupancy)}</p><small>${escapeHtml(quote.inventoryNote)}${exact ? "" : ". 세금 포함 여부와 환불 조건은 공개 페이지에서 확인되지 않았습니다."}</small><a href="${escapeHtml(quote.sourceUrl)}" target="_blank" rel="noreferrer">Trip.com에서 조건 확인</a></article>`; }).join("")}`;
  }

  function renderRentalChecklist() { $("#rental-checklist").innerHTML = rentalChecklist.map((item) => `<li>${escapeHtml(item)}</li>`).join(""); }

  function renderPaceSwitch() {
    const root = $("#trip-mode-switch");
    if (!root || !trip.paceModes?.options?.length) { if (root) root.hidden = true; return; }
    root.hidden = false;
    root.innerHTML = `<div class="pace-copy"><strong>오늘 얼마나 볼까요?</strong><span>${escapeHtml(trip.paceModes.options.find((item) => item.id === state.pace)?.description)}</span></div><div class="pace-buttons">${trip.paceModes.options.map((option) => `<button type="button" data-pace="${escapeHtml(option.id)}" aria-pressed="${option.id === state.pace}">${escapeHtml(option.label)}</button>`).join("")}</div>`;
    $$('[data-pace]', root).forEach((button) => button.addEventListener("click", () => { state.pace = button.dataset.pace; renderPaceSwitch(); renderToday(); renderDateRail(); renderDayDetail(); renderItineraryList(); }));
  }

  function renderDateRail() {
    $("#date-rail").innerHTML = activeItinerary().map((day) => `<button class="date-tab" type="button" role="tab" aria-selected="${day.date === state.day}" data-day="${day.date}"><small>${escapeHtml(day.dow)}요일</small><strong>${Number(day.date.slice(-2))}</strong></button>`).join("");
    $$('[data-day]').forEach((button) => button.addEventListener("click", () => { state.day = button.dataset.day; renderDateRail(); renderDayDetail(); }));
    requestAnimationFrame(() => { const rail = $("#date-rail"); const selected = $("[data-day][aria-selected='true']"); if (rail && selected) rail.scrollLeft = Math.max(0, selected.offsetLeft - rail.clientWidth / 2 + selected.clientWidth / 2); });
  }

  function dayPhoto(day) {
    return places.find((item) => item.id === day.featuredPlace) || { image: day.photo || heroImage, imageFallback: heroImage, photoLabel: `${day.title} 대표 이미지`, photoSource: trip.sourceDeck, name: day.title };
  }

  function renderDayDetail() {
    const days = activeItinerary();
    const day = days.find((item) => item.date === state.day) || days[0];
    const photo = dayPhoto(day);
    $("#day-detail").innerHTML = `<figure class="day-photo photo-frame"><img src="${escapeHtml(photo.image)}" data-fallback="${escapeHtml(photo.imageFallback || heroImage)}" alt="${escapeHtml(photo.photoLabel || photo.name)}"><figcaption><span>${escapeHtml(photo.name)}</span><a href="${escapeHtml(photo.photoSource || photo.official || trip.sourceDeck)}" target="_blank" rel="noreferrer">사진 출처</a></figcaption></figure><div class="day-panel"><div class="day-heading"><div><span>${escapeHtml(day.date)} / ${escapeHtml(day.dow)}요일</span><h3>${escapeHtml(day.title)}</h3></div><b>체력 ${day.intensity}/3</b></div><p class="day-main-copy">${escapeHtml(day.main)}</p><div class="day-facts"><span>${escapeHtml(day.zone)}</span><span>${escapeHtml(day.transport)}</span></div><div class="day-why"><strong>왜 이날 하나요</strong><p>${escapeHtml(day.whyNow)}</p></div><div class="day-needs" aria-label="부모와 아이가 오늘 얻는 것"><article><strong>부모가 기대할 것</strong><p>${escapeHtml(day.needs.parents)}</p></article><article><strong>아이들이 기다릴 것</strong><p>${escapeHtml(day.needs.kids)}</p></article><article><strong>같이 남길 장면</strong><p>${escapeHtml(day.needs.together)}</p></article><article><strong>오후 회복</strong><p>${escapeHtml(day.needs.recovery)}</p></article></div><ol class="timeline">${day.timeline.map((item, index) => `<li data-index="${String(index + 1).padStart(2, "0")}">${escapeHtml(item)}</li>`).join("")}</ol><div class="plan-switcher"><div class="plan-option"><strong>비 오면</strong><span>${escapeHtml(day.rain)}</span></div><div class="plan-option"><strong>힘들면</strong><span>${escapeHtml(day.low)}</span></div><div class="plan-option"><strong>아홉 명 식사</strong><span>${escapeHtml(mealSuggestions[day.date])}</span></div></div><div class="button-row day-buttons"><a class="text-button primary" href="${escapeHtml(makeGoogleCalendarUrl(day))}" target="_blank" rel="noreferrer">Google Calendar에 추가</a><a class="text-button" href="${escapeHtml(photo.maps || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(day.zone)}`)}" target="_blank" rel="noreferrer">그날 지도 열기</a></div></div>`;
    attachImageFallbacks($("#day-detail"));
  }

  function renderItineraryList() {
    $("#itinerary-list").innerHTML = activeItinerary().map((day) => `<a class="itinerary-row" href="#plan" data-list-day="${day.date}" id="day-${day.date}"><time>${day.date.slice(5).replace("-", "/")}</time><div><strong>${escapeHtml(day.title)}</strong><small>${escapeHtml(day.whyNow)}</small></div><span class="row-zone">${escapeHtml(day.zone)}</span><span class="energy-label">체력 ${day.intensity}/3</span></a>`).join("");
    $$('[data-list-day]').forEach((link) => link.addEventListener("click", () => { state.day = link.dataset.listDay; renderDateRail(); renderDayDetail(); }));
  }

  async function renderWeather() {
    $("#climate-summary").textContent = climate.summary;
    $("#packing-list").innerHTML = climate.packing.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
    const mode = weatherMode();
    $("#weather-note").textContent = `${climate.note} ${mode.reason}`;
    if (!mode.live) return;
    const center = trip.destination === "두바이" ? { latitude: "25.2048", longitude: "55.2708", timezone: "Asia/Dubai" } : { latitude: "41.0082", longitude: "28.9784", timezone: "Europe/Istanbul" };
    try {
      const url = new URL("https://api.open-meteo.com/v1/forecast");
      url.search = new URLSearchParams({ ...center, start_date: trip.arrivalDate, end_date: trip.checkoutDate, daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max" });
      const response = await fetch(url);
      if (!response.ok) throw new Error(`forecast ${response.status}`);
      const forecast = await response.json();
      const highs = forecast.daily?.temperature_2m_max || [];
      const lows = forecast.daily?.temperature_2m_min || [];
      const rain = forecast.daily?.precipitation_probability_max || [];
      if (!highs.length) return;
      const average = (values) => Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
      $(".weather-metric strong").textContent = `${average(lows)}–${average(highs)}°`;
      $(".weather-metric span").textContent = "여행 기간 예보 범위";
      $("#weather-note").textContent = `Open-Meteo 예보를 불러왔습니다. 기간 중 최고 강수확률은 ${Math.max(...rain)}%입니다. 보트와 야외 시설은 하루 전 풍속을 다시 보세요.`;
    } catch { $("#weather-note").textContent = `${climate.note} 예보를 불러오지 못해 장기 통계를 보여드립니다.`; }
  }

  function uniqueValues(key) { return [...new Set(places.map((item) => item[key]))].sort((a, b) => a.localeCompare(b, "ko")); }

  function renderFilters() {
    $("#zone-filter").innerHTML = `<option value="all">모든 지역</option>${uniqueValues("zone").map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("")}`;
    $("#category-filter").innerHTML = `<option value="all">모든 분류</option>${uniqueValues("category").map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("")}`;
    $("#place-search").addEventListener("input", (event) => { state.filters.query = event.target.value; renderPlaces(); });
    $("#zone-filter").addEventListener("change", (event) => { state.filters.zone = event.target.value; renderPlaces(); });
    $("#category-filter").addEventListener("change", (event) => { state.filters.category = event.target.value; renderPlaces(); });
    $("#rain-filter").addEventListener("click", (event) => { state.filters.rain = !state.filters.rain; event.currentTarget.setAttribute("aria-pressed", String(state.filters.rain)); renderPlaces(); });
    $("#low-filter").addEventListener("click", (event) => { state.filters.energy = state.filters.energy ? null : 1; event.currentTarget.setAttribute("aria-pressed", String(Boolean(state.filters.energy))); renderPlaces(); });
  }

  function placeCard(item) {
    return `<article class="place-card" id="place-${escapeHtml(item.id)}"><div class="place-image photo-frame"><img src="${escapeHtml(item.image)}" data-fallback="${escapeHtml(item.imageFallback)}" alt="${escapeHtml(item.photoLabel)}" loading="eager" decoding="async"><span class="place-tag">${escapeHtml(item.category)}</span><a class="photo-credit" href="${escapeHtml(item.photoSource)}" target="_blank" rel="noreferrer">사진 출처</a></div><div class="place-copy"><div class="place-meta"><span>${escapeHtml(item.zone)}</span><span>${escapeHtml(item.duration)}</span><span>체력 ${item.energy}/3</span>${item.rain ? "<span>비에도 가능</span>" : ""}</div><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.why)}</p><div class="family-fit"><strong>우리 가족 판단</strong><p>${escapeHtml(item.bestFor)}</p><small>${escapeHtml(item.kids)}</small></div><details class="review-signal"><summary>실제 후기에서 반복된 말</summary><p>${escapeHtml(item.reviews.summary)}</p><div class="review-columns"><div><strong>좋았다는 점</strong><ul>${item.reviews.liked.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul></div><div><strong>아쉽다는 점</strong><ul>${item.reviews.disliked.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul></div></div><p class="family-tip"><strong>아이 셋이면</strong> ${escapeHtml(item.reviews.familyTip)}</p><div class="review-sources">${item.reviews.sources.map((source) => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.platform)} / ${escapeHtml(source.checkedAt)}</a>`).join("")}</div></details><div class="place-warning"><strong>이럴 땐 빼요</strong> ${escapeHtml(item.skipIf)}</div><div class="place-links"><a href="${escapeHtml(item.official)}" target="_blank" rel="noreferrer">공식 정보</a><a href="${escapeHtml(item.maps)}" target="_blank" rel="noreferrer">Google Maps</a></div></div></article>`;
  }

  function renderPlaces() {
    const visible = filterPlaces(state.filters);
    $("#place-count").textContent = visible.length;
    $("#place-grid").innerHTML = visible.length ? visible.map(placeCard).join("") : `<div class="empty-state">조건에 맞는 장소가 없습니다. 필터를 하나 지워 보세요.</div>`;
    attachImageFallbacks($("#place-grid"));
  }

  function renderNearby() {
    const candidates = places.filter((item) => item.category !== "제외").map((item) => ({ ...item, distance: distanceKm(state.nearbyOrigin, item) })).sort((a, b) => a.distance - b.distance).slice(0, 6);
    $("#nearby-status").textContent = `${state.nearbyLabel}입니다. 직선거리라 실제 차량 시간은 Google Maps에서 다시 확인하세요.`;
    $("#nearby-list").innerHTML = candidates.map((item, index) => `<a class="nearby-item" href="#place-${escapeHtml(item.id)}"><span>${index + 1}</span><div><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.category)} / ${escapeHtml(item.zone)}</small></div><b>${item.distance < 1 ? `${Math.round(item.distance * 1000)}m` : `${item.distance.toFixed(1)}km`}</b></a>`).join("");
  }

  function wireNearby() {
    $("#locate-me").addEventListener("click", () => {
      const button = $("#locate-me");
      if (!navigator.geolocation) { $("#nearby-status").textContent = "이 브라우저에서는 현재 위치를 사용할 수 없습니다. 숙소 기준으로 보여드립니다."; return; }
      button.disabled = true;
      button.textContent = "현재 위치 확인 중";
      navigator.geolocation.getCurrentPosition((position) => {
        state.userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
        state.nearbyOrigin = state.userLocation;
        state.nearbyLabel = "내 현재 위치 기준";
        button.disabled = false;
        button.textContent = "현재 위치 다시 확인";
        renderNearby();
        renderMap();
      }, () => {
        button.disabled = false;
        button.textContent = "현재 위치로 보기";
        $("#nearby-status").textContent = "위치 권한을 받지 못해 숙소 기준으로 보여드립니다. 권한 없이도 나머지 기능은 그대로 쓸 수 있습니다.";
      }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
    });
    $("#nearby-reset").addEventListener("click", () => { state.nearbyOrigin = { lat: defaultOrigin.lat, lng: defaultOrigin.lng }; state.nearbyLabel = `${defaultOrigin.name} 기준`; state.userLocation = null; renderNearby(); renderMap(); });
  }

  function worldPoint(lat, lng, zoom) {
    const size = 256 * 2 ** zoom;
    const sin = Math.sin((Number(lat) * Math.PI) / 180);
    return { x: ((Number(lng) + 180) / 360) * size, y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * size };
  }

  function tileMarkup(center, zoom) {
    const centerPoint = worldPoint(center.lat, center.lng, zoom);
    const centerTileX = Math.floor(centerPoint.x / 256);
    const centerTileY = Math.floor(centerPoint.y / 256);
    const tiles = [];
    for (let y = -2; y <= 2; y += 1) for (let x = -2; x <= 2; x += 1) {
      const tileX = centerTileX + x;
      const tileY = centerTileY + y;
      tiles.push(`<img class="map-tile" src="https://a.basemaps.cartocdn.com/light_all/${zoom}/${tileX}/${tileY}@2x.png" alt="" style="left:calc(50% + ${tileX * 256 - centerPoint.x}px);top:calc(50% + ${tileY * 256 - centerPoint.y}px)">`);
    }
    return tiles.join("");
  }

  function renderMap() {
    const selected = places.find((item) => item.id === state.mapPlace) || places[0];
    const center = { lat: selected.lat, lng: selected.lng };
    const centerPoint = worldPoint(center.lat, center.lng, state.mapZoom);
    const markers = places.filter((item) => item.category !== "제외").map((item) => { const point = worldPoint(item.lat, item.lng, state.mapZoom); return `<button class="map-marker ${item.id === selected.id ? "active" : ""}" type="button" data-map-id="${escapeHtml(item.id)}" style="left:calc(50% + ${point.x - centerPoint.x}px);top:calc(50% + ${point.y - centerPoint.y}px)" aria-label="${escapeHtml(item.name)}"><span></span></button>`; }).join("");
    const user = state.userLocation ? (() => { const point = worldPoint(state.userLocation.lat, state.userLocation.lng, state.mapZoom); return `<span class="user-marker" style="left:calc(50% + ${point.x - centerPoint.x}px);top:calc(50% + ${point.y - centerPoint.y}px)" aria-label="내 위치"></span>`; })() : "";
    $("#map-canvas").innerHTML = `<div class="tile-layer">${tileMarkup(center, state.mapZoom)}</div>${markers}${user}<div class="map-controls"><button type="button" data-zoom="in" aria-label="지도 확대">+</button><button type="button" data-zoom="out" aria-label="지도 축소">−</button></div><small class="map-attribution">© OpenStreetMap © CARTO</small>`;
    $("#map-inspector").innerHTML = `<div class="mini">${escapeHtml(selected.category)} / ${escapeHtml(selected.zone)}</div><h3>${escapeHtml(selected.name)}</h3><p>${escapeHtml(selected.bestFor)}</p><p>${escapeHtml(selected.reviews.summary)}</p><p class="map-warning">${escapeHtml(selected.skipIf)}</p><div class="button-row"><a href="${escapeHtml(selected.maps)}" target="_blank" rel="noreferrer">실제 지도 열기</a><a href="#place-${escapeHtml(selected.id)}">장소 카드 보기</a></div>`;
    $$('[data-map-id]').forEach((marker) => marker.addEventListener("click", () => { state.mapPlace = marker.dataset.mapId; renderMap(); }));
    $$('[data-zoom]').forEach((button) => button.addEventListener("click", () => { state.mapZoom = Math.max(9, Math.min(15, state.mapZoom + (button.dataset.zoom === "in" ? 1 : -1))); renderMap(); }));
  }

  function endpointFromSettings() {
    const params = new URLSearchParams(location.search);
    const provided = params.get("assistant");
    if (provided && /^https:\/\//.test(provided)) { try { localStorage.setItem(endpointKey, provided); } catch { /* ignore */ } return provided; }
    try { return localStorage.getItem(endpointKey) || ""; } catch { return ""; }
  }

  async function askRemote(question, endpoint) {
    const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(makeAssistantPayload(question, activeItinerary())) });
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
      for (const source of entry.sources || []) { const link = document.createElement("a"); link.href = source.url; link.target = "_blank"; link.rel = "noreferrer"; link.textContent = source.title || "근거"; sourceBox.append(link); }
      board.append(node);
    }
  }

  async function handleQuestion(question) {
    const clean = String(question || "").trim();
    if (!clean) return;
    const button = $("#ask-form button");
    button.disabled = true;
    $("#assistant-state").textContent = "이 여행 계획에서 답을 찾는 중입니다";
    const endpoint = endpointFromSettings();
    let result;
    try { result = endpoint ? await askRemote(clean, endpoint) : localAnswer(clean, activeItinerary()); $("#assistant-state").textContent = endpoint ? `${result.provider || "여행 검색"}에서 찾았어요` : "저장해 둔 여행 자료에서 찾았어요"; }
    catch { result = localAnswer(clean, activeItinerary()); $("#assistant-state").textContent = "연결이 안 되어 저장된 여행 자료에서 찾았어요"; }
    finally { button.disabled = false; }
    state.answers.unshift({ question: clean, answer: result.answer, provider: result.provider || "여행 계획", sources: (result.sources || []).slice(0, 5), time: new Intl.DateTimeFormat("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date()) });
    state.answers = state.answers.slice(0, 6);
    persistAnswers();
    renderAnswers();
  }

  function wireAssistant() {
    $("#ask-form").addEventListener("submit", async (event) => { event.preventDefault(); const input = $("#question"); await handleQuestion(input.value); input.value = ""; });
    $$("#prompt-chips button").forEach((button) => button.addEventListener("click", () => { $("#question").value = button.textContent; handleQuestion(button.textContent); }));
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
    $("#download-csv").addEventListener("click", () => downloadFile(`${cityKey}-family-trip-places.csv`, `\uFEFF${makeCsv()}`, "text/csv;charset=utf-8"));
    $("#download-kml").addEventListener("click", () => downloadFile(`${cityKey}-family-trip-places.kml`, makeKml(), "application/vnd.google-earth.kml+xml"));
    $("#download-ics").addEventListener("click", () => downloadFile(`${cityKey}-family-trip-2027.ics`, makeIcs(activeItinerary()), "text/calendar;charset=utf-8"));
    $("#source-list").innerHTML = sources.map((source) => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer"><span>${escapeHtml(source.title)}</span><time>${escapeHtml(source.checkedAt)}</time></a>`).join("");
  }

  function wireNavigation() {
    window.addEventListener("scroll", () => $(".topbar").classList.toggle("scrolled", scrollY > 40), { passive: true });
    const links = $$(".bottom-nav a");
    const targets = links.map((link) => $(link.getAttribute("href"))).filter(Boolean);
    const observer = new IntersectionObserver((entries) => { const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]; if (!current) return; links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${current.target.id}`)); }, { rootMargin: "-20% 0px -65%", threshold: [0, .2, .5] });
    targets.forEach((target) => observer.observe(target));
  }

  function restoreDeepLink() {
    if (!location.hash) return;
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) setTimeout(() => target.scrollIntoView({ block: "start" }), 120);
  }

  $("#hero-image").src = heroImage;
  renderStatus(); renderToday(); renderFamily(); renderLodgingTabs(); renderLodgingDetail(); renderTripComCosts(); renderRentalChecklist(); renderPaceSwitch(); renderDateRail(); renderDayDetail(); renderItineraryList(); renderWeather(); renderFilters(); renderPlaces(); renderNearby(); wireNearby(); renderMap(); wireAssistant(); wireUtilities(); wireNavigation(); restoreDeepLink();
  document.documentElement.dataset.checkedAt = CHECKED_AT;
}
