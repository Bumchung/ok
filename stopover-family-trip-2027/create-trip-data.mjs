const googleMaps = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export function createTripData(spec, media) {
  const CHECKED_AT = spec.checkedAt;
  const fallbackId = spec.places[0].id;
  const imageFields = (id) => {
    const item = media[id];
    if (!item) throw new Error(`Unknown ${spec.cityEn} media id: ${id}`);
    return { mediaId: id, ...item, imageFallback: media[fallbackId].image };
  };
  const officialEvidence = (url, familyTip) => ({
    summary: "독립 후기 표본을 별도로 분석하지 않았습니다. 공식 운영 정보와 아홉 명 가족 동선으로 판단했습니다.",
    likedLabel: "확인된 점",
    liked: ["공식 관광기관, 운영사 또는 시설 페이지에서 장소의 성격과 현재 상태를 확인했습니다."],
    dislikedLabel: "아직 확인할 점",
    disliked: ["2027년 운영시간, 가격, 공사와 단체 입장 조건은 아직 확정 정보가 아닙니다."],
    familyTip,
    sources: [{ platform: "공식 정보", url, checkedAt: CHECKED_AT }]
  });

  const places = spec.places.map((item, index) => ({
    rank: index + 1,
    status: item.status || "candidate",
    duration: item.duration || "60-90분",
    energy: item.energy || 2,
    rain: item.rain ?? false,
    warning: item.warning || "2027년 운영시간과 9인 단체 입장 조건을 전날 다시 확인합니다.",
    familyTip: item.familyTip || "아이 셋이 지치기 전에 핵심 한 장면만 보고 쉬는 시간을 둡니다.",
    checkedAt: CHECKED_AT,
    maps: googleMaps(item.mapQuery || `${item.name} ${spec.cityEn}`),
    ...item,
    ...imageFields(item.id),
    reviews: officialEvidence(item.official, item.familyTip || "한 장소를 오래 보기보다 아이 반응에 따라 바로 축소합니다.")
  }));

  const diningSpots = spec.dining.map((item, index) => {
    const mapsUrl = googleMaps(item.mapQuery || `${item.name} ${spec.cityEn}`);
    return {
      rank: index + 1,
      status: "candidate",
      neighborhood: item.neighborhood || item.zone,
      meal: item.meal || (item.type === "cafe" ? "간식" : "점심, 저녁"),
      priceBand: item.priceBand || "2027 가격 미확인",
      kidFit: item.kidFit || "상",
      why: item.why || "같은 권역 일정과 묶고 세대별 주문을 나누기 쉬운 후보입니다.",
      reservation: item.reservation || "9명과 어린이 3명을 명시해 전날 예약",
      reviewPros: item.reviewPros || ["공식 페이지 또는 관광기관 목록에서 업장과 음식 성격을 확인", "9명은 두 테이블 배치도 허용하면 운영이 쉬움"],
      reviewCaution: `${item.reviewCaution || "9인 좌석, 어린이 의자, 순한 메뉴와 알레르기를 직접 확인해야 합니다."} 독립 후기 종합은 하지 않았고 2027년 영업과 가격은 미확인입니다.`,
      mapsUrl,
      officialUrl: item.officialUrl || mapsUrl,
      reviewSourceUrl: item.reviewSourceUrl || item.officialUrl || mapsUrl,
      checkedAt: CHECKED_AT,
      informationLabel: item.officialUrl ? "공식 정보" : "현재 정보 확인",
      detailLabel: "확인된 정보와 9인 예약 조건",
      photoCaption: item.type === "cafe" ? "카페 또는 음료 참고 이미지" : "대표 메뉴 참고 이미지",
      ...item,
      ...imageFields(item.id)
    };
  });

  const lodgingOptions = spec.hotels.map((item, index) => ({
    rank: index + 1,
    featured: index < 6,
    bookingModel: "hotel_rooms",
    coordinateStatus: "지도 표시용 근사 중심점, 예약 전 Google Maps에서 실제 출입구 재확인",
    hotelPlan: { rooms: 4, arrangement: item.arrangement || "연결 또는 같은 층 객실 4실", connection: "request_only", occupancyApproved: false },
    maps: googleMaps(item.mapQuery || `${item.name} ${spec.cityEn}`),
    action: "성인 6명과 만 9세, 7세, 6세 어린이의 4실 배치, 연결 또는 바로 옆 객실, 실제 침대 9개와 어린이 시설을 한 이메일에서 서면 확인",
    photoCreditLabel: "숙소 또는 권역 이미지 출처",
    capacity: item.capacity || "9명 4실 배치는 호텔 승인 전 미확정",
    layout: item.layout || "연결 또는 인접 객실 4실",
    good: item.good || ["공식 페이지에서 가족 관련 시설을 확인", "3박 동선의 중심 권역"],
    cautions: item.cautions || ["연결 객실은 요청일 뿐 보장 전 미확정", "2027년 4실 총액과 어린이 정책 미확정"],
    ...item,
    ...imageFields(item.id)
  }));

  const observedTripComQuotes = lodgingOptions.map((hotel) => {
    const price = spec.hotelPrices[hotel.id];
    if (!price) throw new Error(`Missing price evidence: ${hotel.id}`);
    return {
      id: `reference-${hotel.id}`,
      lodgingId: hotel.id,
      provider: price.provider,
      capturedAt: CHECKED_AT,
      referenceStay: price.referenceStay,
      occupancy: price.occupancy || "성인 2명, 객실 1실 공개가",
      roomPlan: hotel.hotelPlan.arrangement,
      nightlyDisplay: price.nightlyDisplay,
      projectedDisplay: price.projectedDisplay,
      currency: price.currency,
      nightlyValue: null,
      projectedValue: null,
      unitLabel: price.unitLabel || "객실 1실, 1박",
      stayLabel: price.stayLabel || "공개 가격을 객실 4실, 3박으로 단순 환산한 비교값",
      totalIncludesTaxes: price.totalIncludesTaxes ?? null,
      refundable: null,
      breakfast: null,
      status: "reference_start_price",
      inventoryNote: `${spec.arrivalDate}부터 ${spec.checkoutDate.slice(5)}까지 9명, 4실의 동일 상품 실가격이 아닙니다. 표시 총액은 공개 기준가를 단순 환산했으며 실제 가족 견적이 아닙니다.`,
      sourceUrl: price.sourceUrl,
      comparisonKey: `non-target-reference/${hotel.id}/${price.currency}/not-comparable`,
      officialDirect: {
        provider: `${hotel.name} 공식 홈페이지`, capturedAt: CHECKED_AT,
        referenceStay: `${spec.arrivalDate}부터 ${spec.checkoutDate.slice(5)}, 3박`,
        occupancy: "성인 6명, 어린이 3명, 객실 4실", roomPlan: hotel.hotelPlan.arrangement,
        unitLabel: "객실 1실, 1박", stayLabel: "가족 4실, 3박",
        nightlyDisplay: "목표일 공식가 미공개", projectedDisplay: "가족 총액 미공개", currency: price.currency,
        nightlyValue: null, projectedValue: null, totalIncludesTaxes: null, refundable: null, breakfast: null,
        status: "unavailable", inventoryNote: "동일 날짜와 9인 객실 배치의 재현 가능한 공식 결제 총액을 확인하지 못했습니다.",
        sourceUrl: hotel.official,
        comparisonKey: `${spec.arrivalDate}/${spec.checkoutDate}/${hotel.id}/4-rooms/6-adults-3-children/unavailable`
      }
    };
  });

  const airbnbSearch = {
    checkedAt: CHECKED_AT,
    stay: `${spec.arrivalDate}부터 ${spec.checkoutDate.slice(5)}, 3박`,
    guests: "성인 6명, 어린이 3명, 한 유닛 또는 가까운 유닛",
    searchUrl: googleMaps(`${spec.cityEn} family residence`),
    caveat: "공식 구조 또는 운영 주체는 확인했지만 목표 날짜 재고와 9명 총액은 확인하지 않았습니다. 결제 전 관광 임대 허가와 실제 침대 수를 다시 확인합니다.",
    evidenceLabel: `구조 후보 ${spec.residences.length}곳, 목표일 실가격 0곳`,
    priceRangeLabel: "2027년 총액 범위 미산정",
    exactAvailableCount: 0, unavailableCount: 0, lowestExactTotal: null, highestExactTotal: null,
    options: spec.residences.map((item, index) => ({
      rank: index + 1, availability: "candidate", fit: item.fit || 80, capacity: item.capacity || 9,
      bedrooms: item.bedrooms || 4, beds: item.beds || 6, baths: item.baths || 3,
      reason: item.reason || "9명이 함께 머무를 수 있는 다침실 구조 후보입니다.",
      caution: item.caution || "목표일 재고, 실제 침대, 엘리베이터와 어린이 안전장치를 확인해야 합니다.",
      cancellation: "취소 정책 미확인, 무료 취소 가능 기한을 결제 화면에서 확인",
      cancellationLimit: "동일 날짜와 정확한 유닛이 열리기 전에는 취소 조건도 확정할 수 없습니다.",
      price: "2027 가격 미확인", priceLabel: "3박 총액 미확인", nightlyLabel: "1박 평균 계산 안 함", exactTotal: null,
      observedAt: CHECKED_AT, photoCheckedAt: CHECKED_AT,
      availabilityEvidence: "공식 구조 또는 운영 정보만 확인했고 목표 날짜의 예약 가능 상태는 확인하지 않았습니다.",
      priceEvidence: "관측 가격 없음, 추정값 없음", taxesAndFees: "세금과 수수료 미확인",
      photoCaption: "레지던스 구조 또는 권역 참고 이미지",
      ...item,
      ...imageFields(item.id)
    }))
  };

  const trip = {
    slug: spec.slug, title: spec.title, subtitle: spec.subtitle, destination: spec.cityKo,
    startDate: spec.arrivalDate, arrivalDate: spec.arrivalDate, checkoutDate: spec.checkoutDate,
    nights: 3, adults: 6, children: [9, 7, 6], hotelRoomCount: 4,
    mapZoom: spec.mapZoom || 11, weatherCoordinates: spec.weatherCoordinates,
    budgetStayLabel: `${spec.cityKo} 3박 현지비`, budgetGroupLabel: "두 가족 아홉 명 전체 참고액",
    paceModes: { default: "gentle", options: [
      { id: "gentle", label: "천천히", description: "도착과 출발은 비우고, 온전한 이틀은 오전 핵심 한 곳 뒤 길게 쉽니다." },
      { id: "focused", label: "집중 여행", description: "같은 권역의 장면을 하나 더 묶되 16시 전후 숙소로 돌아옵니다." }
    ] },
    principles: spec.principles,
    sourceDeck: spec.sourceDeck,
    coreText: spec.coreText,
    fxCurrencyCode: spec.fx.currencyCode,
    fxCurrencyName: spec.fx.currencyName
  };

  const baseNeeds = {
    parents: "도시의 역사와 현재를 대표하는 두 장면 이해하기",
    kids: "짧은 체험과 그늘 또는 실내 휴식",
    together: "아홉 명이 무리 없이 함께 남기는 한 장면",
    recovery: "15시 전후 숙소 복귀와 저녁 전 최소 90분 휴식"
  };
  const koreanDays = ["일", "월", "화", "수", "목", "금", "토"];
  const itinerary = spec.itinerary.map((day) => ({
    ...day,
    dow: day.dow || koreanDays[new Date(`${day.date}T12:00:00Z`).getUTCDay()],
    stay: day.stay || `${spec.cityKo} 숙박`,
    needs: { ...baseNeeds, ...(day.needs || {}) },
    variants: { focused: day.focused }
  }));
  const mealSuggestions = Object.fromEntries(itinerary.map((day) => [day.date, day.meal || "같은 권역의 예약 식당 한 곳, 피곤하면 숙소 식사"]));

  const budgetModel = spec.budget;
  const fxStrategy = {
    checkedAt: CHECKED_AT,
    sourceDate: spec.fx.sourceDate,
    currencyCode: spec.fx.currencyCode,
    currencyName: spec.fx.currencyName,
    rates: { tryKrw: spec.fx.toKrw, nominalChangeSinceYearEndPct: spec.fx.changePct, combinedCostChangePct: spec.fx.stressPct },
    headline: spec.fx.headline,
    diagnosis: spec.fx.diagnosis,
    actions: spec.fx.actions,
    sources: spec.fx.sources
  };

  const exports = {
    CHECKED_AT, financeCheckedAt: CHECKED_AT, trip,
    familyGroups: spec.familyGroups, decisionChecklist: spec.decisionChecklist,
    lodgingOptions, observedTripComQuotes, tripComCostSummary: spec.tripComCostSummary,
    airbnbSearch, rentalChecklist: spec.rentalChecklist,
    itinerary, mealSuggestions, places, diningSpots,
    budgetModel, fxStrategy, climate: spec.climate, sources: spec.sources,
    heroImage: media[fallbackId].image
  };
  return exports;
}
