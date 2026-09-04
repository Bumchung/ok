const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

export function bootTripApp({ data, core }) {
  const { CHECKED_AT, airbnbSearch, budgetModel, climate, decisionChecklist = [], diningSpots = [], familyGroups, fxStrategy, heroImage, itinerary, lodgingOptions, mealSuggestions, observedTripComQuotes = [], places, rentalChecklist, sources, trip, tripComCostSummary } = data;
  const { calculateBudget, compareHotelPrices, distanceKm, filterDining, filterPlaces, itineraryForPace = (_pace, days) => days, localAnswer, makeAssistantPayload, makeCsv, makeGoogleCalendarUrl, makeIcs, makeKml, tripStatus, weatherMode } = core;
  const cityKey = trip.slug || (trip.destination === "두바이" ? "dubai" : "istanbul");
  const answerKey = `${cityKey}-family-trip-answers-v2`;
  const endpointKey = `${cityKey}-assistant-endpoint`;
  const defaultOrigin = lodgingOptions[0];
  const state = {
    lodging: lodgingOptions[0].id,
    day: tripStatus().day?.date || itinerary[0].date,
    pace: trip.paceModes?.default || "gentle",
    mapPlace: places.find((item) => item.id === lodgingOptions[0].id)?.id || places[0].id,
    mapZoom: trip.mapZoom || (trip.destination === "두바이" ? 11 : 12),
    mapCenter: { lat: defaultOrigin.lat, lng: defaultOrigin.lng },
    filters: { query: "", zone: "all", category: "all", rain: false, energy: null },
    diningFilters: { query: "", zone: "all", type: "all", kidOnly: false },
    hotelFilters: { query: "", type: "all" },
    budget: { stayId: budgetModel?.defaultStay, originId: budgetModel?.defaultOrigin },
    mapKind: "place",
    mapPopupOpen: false,
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
      const fallback = image.dataset.fallback;
      if (!fallback || image.dataset.retried === "true") {
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
    const planningRows = decisionChecklist;
    const travelRows = [
      { label: "오전 핵심", detail: day.timeline[0] || day.main, href: "#plan" },
      { label: "점심 뒤 한 장면", detail: day.timeline[2] || day.main, href: "#plan" },
      { label: "힘들면 바로 축소", detail: day.low, href: "#nearby" }
    ];
    const completeRows = [
      { label: "사진", detail: "가족이 같이 나온 장면부터 고릅니다.", href: "#guide" },
      { label: "비용", detail: "숙소와 항공의 실제 결제 총액을 남깁니다.", href: "#budget" },
      { label: "다시 갈 곳", detail: "다음 여행에서도 남길 장소를 표시합니다.", href: "#map" }
    ];
    const rows = status.mode === "planning" ? planningRows : status.mode === "travel" ? travelRows : completeRows;
    $("#today-heading").textContent = status.mode === "planning" ? "가장 먼저 결정할 목록" : status.mode === "travel" ? "오늘은 이만큼만" : "다시 볼 여행 기록";
    $("#today-card").className = "today-card compact";
    $("#today-card").innerHTML = `<ol class="decision-list" aria-label="${escapeHtml($("#today-heading").textContent)}">${rows.map((item, index) => `<li class="decision-item"><span class="decision-index" aria-hidden="true">${index + 1}</span><div class="decision-copy"><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.detail)}</small></div><a class="decision-cta" href="${escapeHtml(item.href)}">보기</a></li>`).join("")}</ol>`;
    $("#principles").className = "principle-grid compact";
    $("#principles").innerHTML = trip.principles.map((item, index) => `<article class="principle-card"><span>${index + 1}</span><p>${escapeHtml(item)}</p></article>`).join("");
  }

  function renderAirbnb() {
    if (!airbnbSearch) return;
    const evidenceLabel = airbnbSearch.evidenceLabel || `${airbnbSearch.exactAvailableCount}곳 총액 확인 / ${airbnbSearch.unavailableCount}곳 제외`;
    const priceRange = airbnbSearch.priceRangeLabel || `${trip.nights}박 ${formatKrw(airbnbSearch.lowestExactTotal)}부터 ${formatKrw(airbnbSearch.highestExactTotal)}`;
    $("#airbnb-summary").innerHTML = `<div><span>검색 조건</span><strong>${escapeHtml(airbnbSearch.stay)}</strong><small>${escapeHtml(airbnbSearch.guests)}</small></div><div class="airbnb-evidence"><strong>${escapeHtml(evidenceLabel)}</strong><small>${escapeHtml(priceRange)}</small><p>${escapeHtml(airbnbSearch.caveat)}</p></div><a href="${escapeHtml(airbnbSearch.searchUrl)}" target="_blank" rel="noreferrer">같은 조건으로 다시 검색</a>`;
    $("#airbnb-grid").innerHTML = airbnbSearch.options.map((item) => {
      const available = item.availability === "available_exact" || item.availability === "candidate";
      const review = item.rating ? `평점 ${item.rating}${item.reviews ? `, 후기 ${item.reviews}개` : ""}` : "신규 또는 평점 미표시";
      const priceLabel = item.priceLabel || (item.availability === "available_exact" ? `${trip.nights}박 총액 ${item.price}` : item.price);
      const nightly = item.nightlyLabel || (item.availability === "available_exact" ? `1박 평균 ${formatKrw(item.nightlyAverage)}` : "2027년 가격 확인 전");
      const photoCaption = item.photoCaption || "Airbnb 실제 숙소 사진";
      return `<article class="airbnb-card ${available ? "available" : "unavailable"}"><figure class="card-photo airbnb-photo photo-frame"><a class="card-image-link" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer" aria-label="${escapeHtml(item.name)} 숙소 페이지 열기"><img src="${escapeHtml(item.image)}" data-fallback="" alt="${escapeHtml(item.photoLabel)}" width="640" height="400" loading="lazy" decoding="async"></a><figcaption><span>${escapeHtml(photoCaption)}</span><a href="${escapeHtml(item.photoSource)}" target="_blank" rel="noreferrer">사진 출처</a></figcaption></figure><div class="airbnb-card-body"><div class="airbnb-rank"><span>${item.rank}</span><b>${available ? `가족 적합 ${escapeHtml(item.fit)}` : "현재 제외"}</b></div><h4>${escapeHtml(item.name)}</h4><div class="airbnb-specs"><span>${escapeHtml(item.neighborhood)}</span><span>최대 ${item.capacity}명</span><span>침실 ${item.bedrooms}</span><span>침대 ${item.beds}</span><span>욕실 ${item.baths}</span></div><p>${escapeHtml(item.reason)}</p><div class="airbnb-price"><small>${escapeHtml(nightly)}</small><strong>${escapeHtml(priceLabel)}</strong></div><details><summary>약점, 취소 조건과 관측 근거</summary><p>${escapeHtml(item.caution)}</p><p>${escapeHtml(item.cancellation)}</p><small>${escapeHtml(review)} / 가격 관측일 ${escapeHtml(item.observedAt)} / 사진 확인일 ${escapeHtml(item.photoCheckedAt)}<br>${escapeHtml(item.availabilityEvidence)}<br>${escapeHtml(item.priceEvidence)} / ${escapeHtml(item.taxesAndFees)}<br>${escapeHtml(item.cancellationLimit)}</small></details><a class="airbnb-booking-link" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">날짜와 9인 조건으로 다시 보기</a></div></article>`;
    }).join("");
    attachImageFallbacks($("#airbnb-grid"));
  }

  function formatKrw(value) { return `${Math.round(Number(value) / 10000).toLocaleString("ko-KR")}만원`; }

  function renderBudget() {
    if (!budgetModel) return;
    $("#budget-stay-options").innerHTML = budgetModel.stayOptions.map((item) => `<button type="button" data-budget-stay="${escapeHtml(item.id)}" aria-pressed="${item.id === state.budget.stayId}">${escapeHtml(item.label)}</button>`).join("");
    $("#budget-origin-options").innerHTML = budgetModel.origins.map((item) => `<button type="button" data-budget-origin="${escapeHtml(item.id)}" aria-pressed="${item.id === state.budget.originId}">${escapeHtml(item.label)}</button>`).join("");
    const result = calculateBudget(state.budget, budgetModel);
    $("#budget-result").innerHTML = `<span>${escapeHtml(result.origin.label)} 예상</span><strong>${formatKrw(result.perPersonTotal)}</strong><p>항공 ${formatKrw(result.flightPerPerson)} + ${escapeHtml(trip.budgetStayLabel || `현지 ${trip.nights}박`)} ${formatKrw(result.landPerPerson)}</p><small>${escapeHtml(trip.budgetGroupLabel || "두 출발팀 9명 전체")}는 ${formatKrw(result.mixedOriginFamilyTotal)}, 회계상 1인 평균 ${formatKrw(result.mixedOriginAveragePerPerson)}입니다.</small>`;
    const excluded = (budgetModel.excludedOptions || []).map((line) => ({ ...line, label: `기본 총액 제외, ${line.label}` }));
    const lines = [result.stay, ...budgetModel.sharedLines, { label: `예비비 ${Math.round(budgetModel.contingencyRate * 100)}%`, familyTotal: result.contingency, note: "숙박과 현지 운영비가 오를 때 쓰는 완충액입니다." }, ...excluded];
    $("#budget-breakdown").innerHTML = lines.map((line) => `<article><span>${escapeHtml(line.label)}</span><strong>가족 ${formatKrw(line.familyTotal)}</strong><small>${escapeHtml(line.note)}</small>${line.observedAt ? `<small>관측일 ${escapeHtml(line.observedAt)} / ${escapeHtml(line.cancellation)}</small>` : ""}${line.sourceUrl ? `<a href="${escapeHtml(line.sourceUrl)}" target="_blank" rel="noreferrer">이 가격 출처</a>` : ""}</article>`).join("");
    $$('[data-budget-stay]').forEach((button) => button.addEventListener("click", () => { state.budget.stayId = button.dataset.budgetStay; renderBudget(); }));
    $$('[data-budget-origin]').forEach((button) => button.addEventListener("click", () => { state.budget.originId = button.dataset.budgetOrigin; renderBudget(); }));
  }

  function renderFx() {
    if (!fxStrategy) return;
    $("#fx-diagnosis").textContent = fxStrategy.diagnosis;
    $("#fx-rate-board").innerHTML = `<article><span>현재 교차환율</span><strong>1 TRY = ${fxStrategy.rates.tryKrw.toFixed(2)}원</strong><small>ECB ${escapeHtml(fxStrategy.sourceDate)}</small></article><article><span>2025년 말 대비 명목</span><strong>${Math.abs(fxStrategy.rates.nominalChangeSinceYearEndPct).toFixed(2)}% 낮음</strong><small>원화 기준 리라 가격</small></article><article class="reality"><span>물가 단순 결합</span><strong>${fxStrategy.rates.combinedCostChangePct.toFixed(2)}% 높음</strong><small>환율 할인 착시를 보는 반증 계산</small></article>`;
    $("#fx-action-list").innerHTML = fxStrategy.actions.map((item) => `<li data-tone="${escapeHtml(item.tone)}"><span>${item.rank}</span><div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.body)}</p></div></li>`).join("");
    $("#fx-sources").innerHTML = `<strong>${escapeHtml(fxStrategy.headline)}</strong><div>${fxStrategy.sources.map((source) => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.title)}</a>`).join("")}</div>`;
  }

  function renderFamily() {
    $("#family-grid").innerHTML = familyGroups.map((group) => `<article class="family-card"><div class="origin-code">${escapeHtml(group.origin)}</div><div><span class="family-label">${escapeHtml(group.label)} / ${escapeHtml(group.members)}</span><h3>${escapeHtml(group.route)}</h3><p>${escapeHtml(group.target)}</p><small>${escapeHtml(group.carriers)}. ${escapeHtml(group.status)}</small></div></article>`).join("");
  }

  function renderLodgingTabs() {
    const featured = lodgingOptions.filter((item) => item.featured || item.rank <= 6).slice(0, 7);
    $("#lodging-tabs").innerHTML = featured.map((item) => `<button class="lodging-tab" type="button" role="tab" aria-selected="${item.id === state.lodging}" data-lodging="${escapeHtml(item.id)}"><span>${item.rank}</span>${escapeHtml(item.name.split(",")[0])}</button>`).join("");
    $$('[data-lodging]').forEach((button) => button.addEventListener("click", () => { state.lodging = button.dataset.lodging; renderLodgingTabs(); renderLodgingDetail(); }));
  }

  function lodgingPhoto(item) {
    return places.find((place) => place.id === item.id) || (item.image ? item : null) || { image: heroImage, imageFallback: heroImage, photoSource: item.official, photoLabel: `${item.name} 주변 이미지` };
  }

  function renderLodgingDetail() {
    const item = lodgingOptions.find((candidate) => candidate.id === state.lodging) || lodgingOptions[0];
    const photo = lodgingPhoto(item);
    const connection = { guaranteed: "연결 확약", request_only: "인접 또는 연결 요청", not_required: "연결 불필요" }[item.hotelPlan?.connection] || "직접 확인";
    const reviewEvidence = item.reviews ? `<details class="hotel-review-evidence"><summary>${escapeHtml(item.reviews.detailLabel || "실제 후기에서 반복된 말")}</summary><div><strong>${escapeHtml(item.reviews.likedLabel || "반복된 장점")}</strong><ul>${item.reviews.liked.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul><strong>${escapeHtml(item.reviews.dislikedLabel || "반복된 불편")}</strong><ul>${item.reviews.disliked.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul><p>${escapeHtml(item.reviews.summary)}</p><div class="review-sources">${item.reviews.sources.map((source) => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.platform)}</a>`).join("")}</div></div></details>` : "";
    const lodgingPlanLabel = item.bookingModel === "hotel_rooms" ? `호텔 ${item.hotelPlan?.rooms || trip.hotelRoomCount || 4}실` : "한 집형";
    $("#lodging-detail").innerHTML = `<figure class="lodging-photo photo-frame"><img src="${escapeHtml(photo.image)}" data-fallback="${escapeHtml(photo.imageFallback || heroImage)}" alt="${escapeHtml(photo.photoLabel)}"><figcaption><span>${escapeHtml(photo.photoLabel)}</span><a href="${escapeHtml(photo.photoSource || item.official)}" target="_blank" rel="noreferrer">사진 출처</a></figcaption></figure><div class="lodging-copy"><div class="lodging-rank">현재 ${item.rank}순위 / ${escapeHtml(lodgingPlanLabel)}</div><h3>${escapeHtml(item.name)}</h3><p class="lodging-verdict">${escapeHtml(item.verdict)}</p><div class="spec-grid"><div class="spec"><small>정원</small><strong>${escapeHtml(item.capacity)}</strong></div><div class="spec"><small>위치</small><strong>${escapeHtml(item.location)}</strong></div><div class="spec wide"><small>객실 조합</small><strong>${escapeHtml(item.hotelPlan?.arrangement || item.layout)} / ${escapeHtml(connection)}</strong></div></div><div class="pros-cons"><div><h4>우리 가족에게 좋은 점</h4><ul>${item.good.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul></div><div><h4>예약 전에 물어볼 것</h4><ul>${item.cautions.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul></div></div>${reviewEvidence}<div class="lodging-action"><strong>지금 보낼 문의</strong><p>${escapeHtml(item.action)}</p></div><div class="button-row"><a class="text-button primary" href="${escapeHtml(item.official)}" target="_blank" rel="noreferrer">공식 페이지</a><a class="text-button" href="${escapeHtml(item.maps)}" target="_blank" rel="noreferrer">Google Maps</a></div></div>`;
    attachImageFallbacks($("#lodging-detail"));
  }

  function wireHotelCatalog() {
    const hotelTypes = [...new Set(lodgingOptions.filter((item) => item.bookingModel !== "whole_home").map((item) => item.type))].sort((a, b) => a.localeCompare(b, "ko"));
    $("#hotel-type-filter").innerHTML = `<option value="all">모든 호텔 유형</option>${hotelTypes.map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join("")}`;
    $("#hotel-search").addEventListener("input", (event) => { state.hotelFilters.query = event.target.value; renderHotelCatalog(); });
    $("#hotel-type-filter").addEventListener("change", (event) => { state.hotelFilters.type = event.target.value; renderHotelCatalog(); });
  }

  function renderHotelCatalog() {
    const query = String(state.hotelFilters.query || "").toLocaleLowerCase("ko-KR").trim();
    const quotes = new Map(observedTripComQuotes.map((quote) => [quote.lodgingId, quote]));
    const hotels = lodgingOptions.filter((item) => item.bookingModel !== "whole_home").filter((item) => {
      if (state.hotelFilters.type !== "all" && item.type !== state.hotelFilters.type) return false;
      if (!query) return true;
      return [item.name, item.location, item.type, item.verdict, ...(item.good || [])].join(" ").toLocaleLowerCase("ko-KR").includes(query);
    });
    $("#hotel-count").textContent = hotels.length;
    $("#hotel-catalog-grid").innerHTML = hotels.map((item) => {
      const quote = quotes.get(item.id);
      const tripPrice = quote?.nightlyDisplay || "조회 불가";
      const referenceProvider = quote?.provider || "예약 사이트";
      const referenceLabel = quote?.status === "reference_start_price" ? `${referenceProvider} 비목표일, 1실 1박` : `${referenceProvider} 참고, 1실 1박`;
      const direct = quote?.officialDirect;
      const directPrice = direct?.nightlyDisplay || "조회 불가";
      const directLabel = direct?.status === "observed_exact" ? "공식 목표일, 1실 1박" : direct?.status === "observed_once_not_reproduced" ? "공식 1회 관측, 1박" : direct?.status === "reference_start_price" ? "공식 참고가, 1실 1박" : "공식 목표일, 1실 1박";
      return `<article class="hotel-catalog-card ${item.id === state.lodging ? "selected" : ""}"><figure class="photo-frame"><img src="${escapeHtml(item.image)}" data-fallback="${escapeHtml(item.imageFallback || heroImage)}" alt="${escapeHtml(item.photoLabel)}" loading="lazy" decoding="async"><figcaption><a href="${escapeHtml(item.photoSource)}" target="_blank" rel="noreferrer">${escapeHtml(item.photoCreditLabel || "정확한 숙소 사진 출처")}</a></figcaption></figure><div class="hotel-catalog-copy"><div class="hotel-card-meta"><span>${item.rank}순위</span><span>${escapeHtml(item.location)}</span></div><h4>${escapeHtml(item.name)}</h4><p>${escapeHtml(item.verdict)}</p><div class="hotel-card-prices"><div><small>${escapeHtml(referenceLabel)}</small><strong>${escapeHtml(tripPrice)}</strong></div><div><small>${escapeHtml(directLabel)}</small><strong>${escapeHtml(directPrice)}</strong></div></div><small class="hotel-observed">관측일 ${escapeHtml(quote?.capturedAt || CHECKED_AT)} / 조건이 같을 때만 차액 계산</small><div class="hotel-card-actions"><button type="button" data-hotel-select="${escapeHtml(item.id)}">가족 판단 보기</button>${quote ? `<a href="${escapeHtml(quote.sourceUrl)}" target="_blank" rel="noreferrer">${escapeHtml(referenceProvider)}</a><a href="${escapeHtml(quote.officialDirect.sourceUrl)}" target="_blank" rel="noreferrer">공식 예약</a>` : `<a href="${escapeHtml(item.official)}" target="_blank" rel="noreferrer">공식 예약</a>`}</div></div></article>`;
    }).join("");
    $$('[data-hotel-select]').forEach((button) => button.addEventListener("click", () => {
      state.lodging = button.dataset.hotelSelect;
      renderLodgingTabs();
      renderLodgingDetail();
      renderHotelCatalog();
      $("#lodging-detail").scrollIntoView({ behavior: "smooth", block: "start" });
    }));
    attachImageFallbacks($("#hotel-catalog-grid"));
  }

  function renderTripComCosts() {
    const root = $("#tripcom-cost-grid");
    if (!root || !tripComCostSummary) return;
    const lodgingName = (id) => lodgingOptions.find((item) => item.id === id)?.name || id;
    const statusLabel = (status) => status === "observed_exact" ? "2027 조건으로 관측" : status === "observed_once_not_reproduced" ? "1회 관측, 재현 실패" : status === "reference_start_price" ? "다른 날짜 참고 시작가" : status === "verification_blocked" ? "보안 확인으로 미관측" : status === "unavailable" ? "목표일 가격 미확인" : "공식가 미노출";
    const directSummaryLabel = (direct) => direct.status === "observed_exact" ? "공식 목표일, 1실 1박" : direct.status === "observed_once_not_reproduced" ? "공식 1회 관측, 1박" : direct.status === "reference_start_price" ? "공식 참고가, 1실 1박" : "공식 목표일, 1실 1박";
    const conditionLabel = (value, yes, no, unknown) => value === true ? yes : value === false ? no : unknown;
    const rows = observedTripComQuotes.map((quote) => {
      const direct = quote.officialDirect;
      const comparison = compareHotelPrices(quote);
      const referenceSummaryLabel = quote.status === "reference_start_price" ? `${quote.provider} 비목표일, 1실 1박` : `${quote.provider} 목표일, 1실 1박`;
      const referenceDetailLabel = quote.status === "reference_start_price" ? `${quote.provider} 비목표일 참고` : `${quote.provider} 목표일 견적`;
      const member = direct.memberRate ? `<p class="member-rate"><b>ALL 회원가</b> ${escapeHtml(direct.memberRate.nightlyDisplay)} / 1실 1박<br>${escapeHtml(direct.memberRate.projectedDisplay)} / ${escapeHtml(direct.memberRate.note)}</p>` : "";
      const alternatives = direct.rateAlternatives?.length ? `<div class="rate-alternatives">${direct.rateAlternatives.map((rate) => `<p><b>${escapeHtml(rate.label)}</b><strong>${escapeHtml(rate.nightlyDisplay)} / 1실 1박</strong><span>${escapeHtml(rate.projectedDisplay)} / ${escapeHtml(rate.note)}</span></p>`).join("")}</div>` : "";
      return `<details class="hotel-price-row"><summary><span class="price-hotel-name">${escapeHtml(lodgingName(quote.lodgingId))}</span><span><small>${escapeHtml(referenceSummaryLabel)}</small><strong>${escapeHtml(quote.nightlyDisplay)}</strong></span><span><small>${escapeHtml(directSummaryLabel(direct))}</small><strong>${escapeHtml(direct.nightlyDisplay)}</strong></span><span><small>공식 관측 상태</small><strong>${escapeHtml(statusLabel(direct.status))}</strong></span></summary><div class="hotel-price-row-body"><div class="quote-price-grid"><section class="quote-price"><small>${escapeHtml(referenceDetailLabel)} / ${escapeHtml(quote.unitLabel)}</small><strong>${escapeHtml(quote.nightlyDisplay)}</strong><p><b>${escapeHtml(quote.projectedDisplay)}</b><br>${escapeHtml(quote.stayLabel)}</p><span>${escapeHtml(quote.referenceStay)}<br>${escapeHtml(quote.occupancy)}</span><div class="price-conditions"><i>${escapeHtml(conditionLabel(quote.totalIncludesTaxes, "세금 포함", "세금 별도", "세금 미확인"))}</i><i>${escapeHtml(conditionLabel(quote.breakfast, "조식 포함", "조식 불포함", "조식 미확인"))}</i><i>${escapeHtml(conditionLabel(quote.refundable, "환불 가능", "환불 불가", "환불 조건 미확인"))}</i></div></section><section class="quote-price direct"><small>호텔 공식 / ${escapeHtml(direct.unitLabel)}</small><strong>${escapeHtml(direct.nightlyDisplay)}</strong>${direct.nightlyKrwDisplay ? `<em>${escapeHtml(direct.nightlyKrwDisplay)}</em>` : ""}<p><b>${escapeHtml(direct.projectedDisplay)}</b>${direct.projectedKrwDisplay ? ` / ${escapeHtml(direct.projectedKrwDisplay)}` : ""}<br>${escapeHtml(direct.stayLabel)}</p><span>${escapeHtml(direct.referenceStay)}<br>${escapeHtml(direct.occupancy)}</span><div class="price-conditions"><i>${escapeHtml(conditionLabel(direct.totalIncludesTaxes, "세금 포함", "세금 별도", "세금 미확인"))}</i><i>${escapeHtml(conditionLabel(direct.breakfast, "조식 포함", "조식 불포함", "조식 미확인"))}</i><i>${escapeHtml(conditionLabel(direct.refundable, "환불 가능", "환불 불가", "환불 조건 미확인"))}</i></div>${member}${alternatives}</section></div><div class="quote-comparison ${escapeHtml(comparison.status)}"><b>${escapeHtml(comparison.label)}</b><span>${escapeHtml(comparison.reason)}</span></div><div class="quote-evidence"><span>${escapeHtml(statusLabel(direct.status))}</span><span>${escapeHtml(quote.provider)} 관측일 ${escapeHtml(quote.capturedAt)}</span><span>공식가 관측일 ${escapeHtml(direct.capturedAt)}</span></div><p class="quote-note"><b>${escapeHtml(quote.provider)}:</b> ${escapeHtml(quote.inventoryNote)}<br><b>공식:</b> ${escapeHtml(direct.inventoryNote)}</p><div class="quote-links"><a href="${escapeHtml(quote.sourceUrl)}" target="_blank" rel="noreferrer">${escapeHtml(quote.provider)}에서 다시 확인</a><a href="${escapeHtml(direct.sourceUrl)}" target="_blank" rel="noreferrer">호텔 공식 사이트에서 확인</a></div></div></details>`;
    }).join("");
    const roomCount = trip.hotelRoomCount || 4;
    root.innerHTML = `<article class="tripcom-cost-card benchmark"><span class="quote-status">시장 평균 비교선</span><h3>${escapeHtml(tripComCostSummary.benchmarkLabel)}</h3><div class="benchmark-price"><small>객실 1실, 1박</small><strong>${escapeHtml(tripComCostSummary.benchmarkNightly)}</strong></div><p><b>가족 ${roomCount}실, ${trip.nights}박</b> ${escapeHtml(tripComCostSummary.benchmarkTotal)}<br>${escapeHtml(tripComCostSummary.benchmarkFormula)}</p><small>${escapeHtml(tripComCostSummary.exactQuoteStatus)}</small><a href="${escapeHtml(tripComCostSummary.sourceUrl)}" target="_blank" rel="noreferrer">${escapeHtml(tripComCostSummary.provider)}에서 확인</a></article><article class="tripcom-cost-card fx-card"><span class="quote-status">환율 기준</span><h3>${escapeHtml(tripComCostSummary.fx.label)}</h3><div class="benchmark-price"><small>EUR 1</small><strong>${escapeHtml(tripComCostSummary.fx.eurToKrw)}원</strong></div><p>${escapeHtml(tripComCostSummary.fx.note)}</p><a href="${escapeHtml(tripComCostSummary.fx.sourceUrl)}" target="_blank" rel="noreferrer">ECB 환율 원문</a></article><section class="hotel-price-list"><div class="hotel-price-list-head"><h4>호텔 ${observedTripComQuotes.length}곳 가격표</h4><p>행을 열면 ${roomCount}실 ${trip.nights}박 단순 환산, 세금 여부, 관측일과 실제 예약 링크를 확인할 수 있습니다.</p></div>${rows}</section>`;
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
    $("#day-detail").innerHTML = `<figure class="day-photo photo-frame"><img src="${escapeHtml(photo.image)}" data-fallback="${escapeHtml(photo.imageFallback || heroImage)}" alt="${escapeHtml(photo.photoLabel || photo.name)}"><figcaption><span>${escapeHtml(photo.name)}</span><a href="${escapeHtml(photo.photoSource || photo.official || trip.sourceDeck)}" target="_blank" rel="noreferrer">사진 출처</a></figcaption></figure><div class="day-panel"><div class="day-heading"><div><span>${escapeHtml(day.date)} / ${escapeHtml(day.dow)}요일 / ${escapeHtml(day.paceLabel)} 모드</span><h3>${escapeHtml(day.title)}</h3></div><b>체력 ${day.intensity}/3</b></div><p class="day-main-copy">${escapeHtml(day.main)}</p><div class="day-facts"><span>${escapeHtml(day.zone)}</span><span>${escapeHtml(day.transport)}</span></div><div class="day-why"><strong>왜 이날 하나요</strong><p>${escapeHtml(day.whyNow)}</p></div><div class="day-needs" aria-label="부모와 아이가 오늘 얻는 것"><article><strong>부모가 기대할 것</strong><p>${escapeHtml(day.needs.parents)}</p></article><article><strong>아이들이 기다릴 것</strong><p>${escapeHtml(day.needs.kids)}</p></article><article><strong>같이 남길 장면</strong><p>${escapeHtml(day.needs.together)}</p></article><article><strong>오후 회복</strong><p>${escapeHtml(day.needs.recovery)}</p></article></div><ol class="timeline">${day.timeline.map((item, index) => `<li data-index="${String(index + 1).padStart(2, "0")}">${escapeHtml(item)}</li>`).join("")}</ol><div class="plan-switcher"><div class="plan-option"><strong>비 오면</strong><span>${escapeHtml(day.rain)}</span></div><div class="plan-option"><strong>힘들면</strong><span>${escapeHtml(day.low)}</span></div><div class="plan-option"><strong>아홉 명 식사</strong><span>${escapeHtml(mealSuggestions[day.date])}</span></div></div><div class="button-row day-buttons"><a class="text-button primary" href="${escapeHtml(makeGoogleCalendarUrl(day))}" target="_blank" rel="noreferrer">Google Calendar에 추가</a><a class="text-button" href="${escapeHtml(photo.maps || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(day.zone)}`)}" target="_blank" rel="noreferrer">그날 지도 열기</a></div></div>`;
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
    const center = trip.weatherCoordinates || (trip.destination === "두바이" ? { latitude: "25.2048", longitude: "55.2708", timezone: "Asia/Dubai" } : { latitude: "41.0082", longitude: "28.9784", timezone: "Europe/Istanbul" });
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
      const liveCaveat = trip.destination === "카파도키아"
        ? "열기구 공식 신호, 풍속과 도로 결빙은 전날과 당일 새벽에 다시 보세요."
        : "보트와 야외 시설은 하루 전 풍속을 다시 보세요.";
      $("#weather-note").textContent = `Open-Meteo 예보를 불러왔습니다. 기간 중 최고 강수확률은 ${Math.max(...rain)}%입니다. ${liveCaveat}`;
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
    return `<article class="place-card" id="place-${escapeHtml(item.id)}"><div class="place-image photo-frame"><img src="${escapeHtml(item.image)}" data-fallback="${escapeHtml(item.imageFallback)}" alt="${escapeHtml(item.photoLabel)}" loading="lazy" decoding="async"><span class="place-tag">${escapeHtml(item.category)}</span><a class="photo-credit" href="${escapeHtml(item.photoSource)}" target="_blank" rel="noreferrer">사진 출처</a></div><div class="place-copy"><div class="place-meta"><span>${escapeHtml(item.zone)}</span><span>${escapeHtml(item.duration)}</span><span>체력 ${item.energy}/3</span>${item.rain ? "<span>비에도 가능</span>" : ""}</div><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.why)}</p><details class="review-signal"><summary>${escapeHtml(item.detailLabel || "실제 후기에서 반복된 말")}</summary><div class="family-fit"><strong>우리 가족 판단</strong><p>${escapeHtml(item.bestFor)}</p><small>${escapeHtml(item.kids)}</small></div><p>${escapeHtml(item.reviews.summary)}</p><div class="review-columns"><div><strong>${escapeHtml(item.reviews.likedLabel || "좋았다는 점")}</strong><ul>${item.reviews.liked.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul></div><div><strong>${escapeHtml(item.reviews.dislikedLabel || "아쉽다는 점")}</strong><ul>${item.reviews.disliked.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul></div></div><p class="family-tip"><strong>아이 셋이면</strong> ${escapeHtml(item.reviews.familyTip)}</p><p class="place-warning"><strong>이럴 땐 빼요</strong> ${escapeHtml(item.skipIf)}</p><div class="review-sources">${item.reviews.sources.map((source) => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.platform)} / ${escapeHtml(source.checkedAt)}</a>`).join("")}</div></details><div class="place-links"><a href="${escapeHtml(item.official)}" target="_blank" rel="noreferrer">공식 정보</a><a href="${escapeHtml(item.maps)}" target="_blank" rel="noreferrer">Google Maps</a></div></div></article>`;
  }

  function renderPlaces() {
    const visible = filterPlaces(state.filters);
    $("#place-count").textContent = visible.length;
    $("#place-grid").innerHTML = visible.length ? visible.map(placeCard).join("") : `<div class="empty-state">조건에 맞는 장소가 없습니다. 필터를 하나 지워 보세요.</div>`;
    attachImageFallbacks($("#place-grid"));
  }

  function diningCard(item) {
    const label = item.type === "restaurant" ? "음식점" : "카페";
    const photoCaption = item.photoCaption || `${label} 실제 장소 사진`;
    const detailLabel = item.detailLabel || "실제 후기와 9인 예약 조건";
    return `<article class="dining-card" id="dining-${escapeHtml(item.id)}"><figure class="card-photo dining-photo photo-frame"><a class="card-image-link" href="${escapeHtml(item.photoSource)}" target="_blank" rel="noreferrer" aria-label="${escapeHtml(item.name)} 사진 출처 열기"><img src="${escapeHtml(item.image)}" data-fallback="" alt="${escapeHtml(item.photoLabel)}" width="640" height="400" loading="lazy" decoding="async"></a><figcaption><span>${escapeHtml(photoCaption)}</span><a href="${escapeHtml(item.photoSource)}" target="_blank" rel="noreferrer">사진 출처</a></figcaption></figure><div class="dining-card-body"><div class="dining-card-head"><span class="dining-card-rank">${item.rank}</span><span class="dining-card-type">${label} / ${escapeHtml(item.priceBand)}</span></div><h3>${escapeHtml(item.name)}</h3><div class="dining-meta"><span>${escapeHtml(item.zone)}</span><span>${escapeHtml(item.neighborhood)}</span><span>${escapeHtml(item.cuisine)}</span><span>아이 ${escapeHtml(item.kidFit)}</span></div><p>${escapeHtml(item.why)}</p><details><summary>${escapeHtml(detailLabel)}</summary><ul>${item.reviewPros.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul><p>${escapeHtml(item.reviewCaution)}</p><div class="dining-reservation">${escapeHtml(item.reservation)}</div><a class="dining-review-source" href="${escapeHtml(item.reviewSourceUrl)}" target="_blank" rel="noreferrer">후기 근거 열기</a></details><div class="dining-actions"><a href="${escapeHtml(item.officialUrl)}" target="_blank" rel="noreferrer">${escapeHtml(item.informationLabel)}</a><a href="${escapeHtml(item.mapsUrl)}" target="_blank" rel="noreferrer">Google Maps</a><button type="button" data-open-map="${escapeHtml(item.id)}" data-open-kind="${escapeHtml(item.type)}">지도에서 바로 보기</button></div></div></article>`;
  }

  function renderDining() {
    const visible = filterDining(diningSpots, state.diningFilters);
    $("#dining-count").textContent = visible.length;
    $("#dining-grid").innerHTML = visible.length ? visible.map(diningCard).join("") : `<div class="empty-state">조건에 맞는 음식점이나 카페가 없습니다. 필터를 하나 지워 보세요.</div>`;
    attachImageFallbacks($("#dining-grid"));
    $$('[data-open-map]', $("#dining-grid")).forEach((button) => button.addEventListener("click", () => openMapItem(button.dataset.openMap, button.dataset.openKind)));
  }

  function wireDining() {
    const zones = [...new Set(diningSpots.map((item) => item.zone))].sort((a, b) => a.localeCompare(b, "ko"));
    $("#dining-zone-filter").innerHTML = `<option value="all">모든 지역</option>${zones.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("")}`;
    $("#dining-search").addEventListener("input", (event) => { state.diningFilters.query = event.target.value; renderDining(); });
    $("#dining-type-filter").addEventListener("change", (event) => { state.diningFilters.type = event.target.value; renderDining(); });
    $("#dining-zone-filter").addEventListener("change", (event) => { state.diningFilters.zone = event.target.value; renderDining(); });
    $("#dining-kid-filter").addEventListener("click", (event) => { state.diningFilters.kidOnly = !state.diningFilters.kidOnly; event.currentTarget.setAttribute("aria-pressed", String(state.diningFilters.kidOnly)); renderDining(); });
  }

  function mapRecords() {
    const placeRecords = places.filter((item) => item.category !== "제외").map((item) => ({
      id: item.id, kind: "place", category: item.category, zone: item.zone, name: item.name, lat: item.lat, lng: item.lng,
      bestFor: item.bestFor, reviewSummary: item.reviews.summary, skipIf: item.skipIf, maps: item.maps, official: item.official, cardHref: `#place-${item.id}`
    }));
    const diningRecords = diningSpots.map((item) => ({
      id: item.id, kind: item.type, category: item.type === "restaurant" ? "음식점" : "카페", zone: item.zone, name: item.name, lat: item.lat, lng: item.lng,
      bestFor: item.why, reviewSummary: item.reviewPros.join(" "), skipIf: item.reviewCaution, maps: item.mapsUrl, official: item.officialUrl, reviewSource: item.reviewSourceUrl, cardHref: `#dining-${item.id}`
    }));
    return [...placeRecords, ...diningRecords];
  }

  function activeMapRecords() { return mapRecords().filter((item) => item.kind === state.mapKind); }

  function openMapItem(id, kind) {
    const item = mapRecords().find((record) => record.id === id && record.kind === kind);
    if (!item) return;
    state.mapKind = kind;
    state.mapPlace = id;
    state.mapCenter = { lat: item.lat, lng: item.lng };
    state.mapPopupOpen = true;
    renderMap(true);
    $("#map").scrollIntoView({ block: "start" });
  }

  function renderNearby() {
    const candidates = mapRecords().map((item) => ({ ...item, distance: distanceKm(state.nearbyOrigin, item) })).sort((a, b) => a.distance - b.distance).slice(0, 6);
    $("#nearby-status").textContent = `${state.nearbyLabel}입니다. 갈 곳, 음식점과 카페를 함께 정렬했습니다. 직선거리라 실제 이동 시간은 지도에서 다시 확인하세요.`;
    $("#nearby-list").innerHTML = candidates.map((item, index) => `<a class="nearby-item" href="${escapeHtml(item.cardHref)}"><span>${index + 1}</span><div><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.category)} / ${escapeHtml(item.zone)}</small></div><b>${item.distance < 1 ? `${Math.round(item.distance * 1000)}m` : `${item.distance.toFixed(1)}km`}</b></a>`).join("");
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
        state.mapCenter = state.userLocation;
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
    $("#nearby-reset").addEventListener("click", () => { state.nearbyOrigin = { lat: defaultOrigin.lat, lng: defaultOrigin.lng }; state.nearbyLabel = `${defaultOrigin.name} 기준`; state.mapCenter = { lat: defaultOrigin.lat, lng: defaultOrigin.lng }; state.userLocation = null; renderNearby(); renderMap(); });
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

  function renderMap(focusPopup = false) {
    const records = activeMapRecords();
    const selected = records.find((item) => item.id === state.mapPlace) || records[0];
    if (!selected) return;
    state.mapPlace = selected.id;
    const center = state.mapCenter;
    const centerPoint = worldPoint(center.lat, center.lng, state.mapZoom);
    const selectedPoint = worldPoint(selected.lat, selected.lng, state.mapZoom);
    const selectedDx = selectedPoint.x - centerPoint.x;
    const selectedDy = selectedPoint.y - centerPoint.y;
    const markers = records.map((item) => { const point = worldPoint(item.lat, item.lng, state.mapZoom); const active = item.id === selected.id; return `<button class="map-marker ${active ? "active" : ""}" id="map-marker-${escapeHtml(item.id)}" type="button" data-map-id="${escapeHtml(item.id)}" data-map-kind="${escapeHtml(item.kind)}" style="left:calc(50% + ${point.x - centerPoint.x}px);top:calc(50% + ${point.y - centerPoint.y}px)" aria-label="${escapeHtml(item.name)}, ${escapeHtml(item.category)}, 정보 열기" aria-haspopup="dialog" aria-controls="map-popup" aria-expanded="${active && state.mapPopupOpen}" tabindex="${active ? 0 : -1}"><span></span></button>`; }).join("");
    const user = state.userLocation ? (() => { const point = worldPoint(state.userLocation.lat, state.userLocation.lng, state.mapZoom); return `<span class="user-marker" style="left:calc(50% + ${point.x - centerPoint.x}px);top:calc(50% + ${point.y - centerPoint.y}px)" aria-label="내 위치"></span>`; })() : "";
    const canvasWidth = $("#map-canvas").clientWidth || 948;
    const canvasHeight = $("#map-canvas").clientHeight || 620;
    const popupWidth = canvasWidth <= 520 ? 260 : 290;
    const popupHeight = canvasWidth <= 520 ? (selected.reviewSource ? 260 : 230) : (selected.reviewSource ? 240 : 210);
    const anchorX = canvasWidth / 2 + selectedDx;
    const anchorY = canvasHeight / 2 + selectedDy;
    const canOpenRight = anchorX + 14 + popupWidth <= canvasWidth - 12;
    const canOpenLeft = anchorX - 14 - popupWidth >= 12;
    const horizontalPopupClass = canOpenRight ? "" : canOpenLeft ? "flip-x" : "center-x";
    const canOpenAbove = anchorY - popupHeight - 16 >= 12;
    const canOpenBelow = anchorY + popupHeight + 16 <= canvasHeight - 12;
    const verticalPopupClass = canOpenAbove ? "" : canOpenBelow ? "flip-y" : "center-y";
    const popupClasses = [horizontalPopupClass, verticalPopupClass].filter(Boolean).join(" ");
    const reviewSourceAction = selected.reviewSource ? `<a href="${escapeHtml(selected.reviewSource)}" target="_blank" rel="noreferrer">후기 근거</a>` : "";
    const popup = state.mapPopupOpen ? `<section class="map-popup ${popupClasses}" id="map-popup" role="dialog" aria-modal="false" aria-labelledby="map-popup-title" tabindex="-1" style="left:calc(50% + ${selectedDx}px);top:calc(50% + ${selectedDy}px)"><button class="map-popup-close" id="map-popup-close" type="button" aria-label="장소 정보 닫기">×</button><div class="map-popup-meta">${escapeHtml(selected.category)} / ${escapeHtml(selected.zone)}</div><h3 id="map-popup-title">${escapeHtml(selected.name)}</h3><p>${escapeHtml(selected.bestFor)}</p><p>${escapeHtml(selected.reviewSummary)}</p><p class="map-popup-warning">${escapeHtml(selected.skipIf)}</p><div class="map-popup-actions"><a href="${escapeHtml(selected.maps)}" target="_blank" rel="noreferrer">실제 지도</a>${reviewSourceAction}<a href="${escapeHtml(selected.cardHref)}">전체 카드</a></div></section>` : "";
    $("#map-canvas").innerHTML = `<div class="tile-layer">${tileMarkup(center, state.mapZoom)}</div>${markers}${user}${popup}<div class="map-controls"><button type="button" data-zoom="in" aria-label="지도 확대">+</button><button type="button" data-zoom="out" aria-label="지도 축소">−</button></div><small class="map-attribution">© OpenStreetMap © CARTO</small>`;
    const popupElement = $("#map-popup");
    if (popupElement) {
      const canvas = $("#map-canvas");
      popupElement.style.maxHeight = `${Math.max(180, canvas.clientHeight - 24)}px`;
      popupElement.style.overflowY = "auto";
      const canvasRect = canvas.getBoundingClientRect();
      const popupRect = popupElement.getBoundingClientRect();
      let shiftX = 0;
      let shiftY = 0;
      if (popupRect.left < canvasRect.left + 12) shiftX = canvasRect.left + 12 - popupRect.left;
      else if (popupRect.right > canvasRect.right - 12) shiftX = canvasRect.right - 12 - popupRect.right;
      if (popupRect.top < canvasRect.top + 12) shiftY = canvasRect.top + 12 - popupRect.top;
      else if (popupRect.bottom > canvasRect.bottom - 12) shiftY = canvasRect.bottom - 12 - popupRect.bottom;
      popupElement.style.marginLeft = `${shiftX}px`;
      popupElement.style.marginTop = `${shiftY}px`;
    }
    $("#map-inspector").innerHTML = `<div class="mini">${escapeHtml(selected.category)} / ${escapeHtml(selected.zone)}</div><h3>${escapeHtml(selected.name)}</h3><p>${escapeHtml(selected.bestFor)}</p><p>${escapeHtml(selected.reviewSummary)}</p><p class="map-warning">${escapeHtml(selected.skipIf)}</p><div class="button-row"><a href="${escapeHtml(selected.maps)}" target="_blank" rel="noreferrer">실제 지도 열기</a><a href="${escapeHtml(selected.cardHref)}">전체 카드 보기</a></div>`;
    $$('[data-map-kind]', $("#map-layer-controls")).forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.mapKind === state.mapKind)));
    $$('[data-map-id]').forEach((marker) => {
      marker.addEventListener("click", () => { state.mapPlace = marker.dataset.mapId; state.mapPopupOpen = true; renderMap(true); });
      marker.addEventListener("keydown", (event) => {
        if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) return;
        event.preventDefault();
        const index = records.findIndex((item) => item.id === marker.dataset.mapId);
        const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1;
        const next = records[(index + direction + records.length) % records.length];
        state.mapPlace = next.id;
        state.mapPopupOpen = true;
        renderMap();
        requestAnimationFrame(() => $(`#map-marker-${CSS.escape(next.id)}`)?.focus());
      });
    });
    $("#map-popup-close")?.addEventListener("click", () => { const id = selected.id; state.mapPopupOpen = false; renderMap(); requestAnimationFrame(() => $(`#map-marker-${CSS.escape(id)}`)?.focus()); });
    $("#map-canvas").onkeydown = (event) => { if (event.key === "Escape" && state.mapPopupOpen) { event.preventDefault(); const id = selected.id; state.mapPopupOpen = false; renderMap(); requestAnimationFrame(() => $(`#map-marker-${CSS.escape(id)}`)?.focus()); } };
    $$('[data-zoom]').forEach((button) => button.addEventListener("click", () => { state.mapZoom = Math.max(9, Math.min(15, state.mapZoom + (button.dataset.zoom === "in" ? 1 : -1))); renderMap(); }));
    if (focusPopup) requestAnimationFrame(() => $("#map-popup")?.focus());
  }

  function wireMap() {
    $$('[data-map-kind]', $("#map-layer-controls")).forEach((button) => button.addEventListener("click", () => {
      state.mapKind = button.dataset.mapKind;
      const first = activeMapRecords()[0];
      if (!activeMapRecords().some((item) => item.id === state.mapPlace) && first) state.mapPlace = first.id;
      state.mapPopupOpen = false;
      renderMap();
    }));
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
    $("#download-ics").addEventListener("click", () => downloadFile(`${cityKey}-family-trip-2027-${state.pace}.ics`, makeIcs(activeItinerary()), "text/calendar;charset=utf-8"));
    $("#source-list").innerHTML = sources.map((source) => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer"><span>${escapeHtml(source.title)}</span><time>${escapeHtml(source.checkedAt)}</time></a>`).join("");
  }

  function wireNavigation() {
    const bottomNav = $(".bottom-nav");
    const updateNavigationChrome = () => {
      $(".topbar").classList.toggle("scrolled", scrollY > 40);
      bottomNav.classList.toggle("visible", scrollY > 120);
    };
    window.addEventListener("scroll", updateNavigationChrome, { passive: true });
    updateNavigationChrome();
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
  renderStatus(); renderToday(); renderFamily(); renderLodgingTabs(); renderLodgingDetail(); renderAirbnb(); wireHotelCatalog(); renderHotelCatalog(); renderTripComCosts(); renderRentalChecklist(); renderBudget(); renderFx(); renderPaceSwitch(); renderDateRail(); renderDayDetail(); renderItineraryList(); renderWeather(); renderFilters(); renderPlaces(); wireDining(); renderDining(); renderNearby(); wireNearby(); wireMap(); renderMap(); wireAssistant(); wireUtilities(); wireNavigation(); restoreDeepLink();
  document.documentElement.dataset.checkedAt = CHECKED_AT;
}
