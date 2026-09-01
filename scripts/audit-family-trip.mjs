import { access, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const prompt = await readFile(join(root, "family-trip-2027", "REBUILD-PROMPT.md"), "utf8");
const questions = [...prompt.matchAll(/^(\d+)\.\s+(.+\?)$/gm)].map((match) => ({ number: Number(match[1]), text: match[2] }));
if (questions.length !== 50 || questions.some((item, index) => item.number !== index + 1)) {
  throw new Error(`재작성 프롬프트 질문은 연속된 50개여야 합니다. 현재 ${questions.length}개입니다.`);
}

const baseArgIndex = process.argv.indexOf("--base-origin");
const baseOrigin = baseArgIndex >= 0 ? String(process.argv[baseArgIndex + 1] || "").replace(/\/$/, "") : "";
const slugArgIndex = process.argv.indexOf("--slug");
const requestedSlug = slugArgIndex >= 0 ? String(process.argv[slugArgIndex + 1] || "") : "";

function nightsBetween(arrival, checkout) {
  return Math.round((Date.parse(`${checkout}T12:00:00Z`) - Date.parse(`${arrival}T12:00:00Z`)) / 86400000);
}

function hasAll(value, terms) {
  return terms.every((term) => value.includes(term));
}

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

async function publicFilesOk(ctx) {
  if (!baseOrigin) {
    return ["index.html", "styles.css", "app.mjs", "trip-data.mjs", "app-core.mjs", "trip-app.mjs"]
      .every((name) => ctx.files[name]);
  }
  const names = [
    "index.html", "styles.css", "app.mjs", "trip-data.mjs", "app-core.mjs", "trip-app.mjs",
    "place-catalog.mjs", "hotel-catalog.mjs",
    ...ctx.allImageManifest.filter((item) => item.isLocal).map((item) => item.asset)
  ];
  for (const name of names) {
    const response = await fetch(`${baseOrigin}/${ctx.slug}/${name}`, { redirect: "follow" });
    if (!response.ok) return false;
  }
  return true;
}

const checks = [
  (ctx) => exists(join(ctx.dir, "index.html")),
  (ctx) => ctx.visual.score >= 90 && ctx.visual.verdict === "pass",
  (ctx) => /@media \(max-width: 720px\)/.test(ctx.css) && ctx.visual.reasoning.includes("horizontal overflow is zero"),
  (ctx) => ctx.manifest.length === ctx.data.places.length && ctx.manifest.every((item) => item.ok && item.asset),
  (ctx) => new Set(ctx.manifest.map((item) => item.source)).size === ctx.manifest.length,
  (ctx) => !["저강도", "기본 단위", "운영 안정성", "이동 대비 효용", "회복 거점", "강합니다", "우선 후보"].some((phrase) => ctx.visible.includes(phrase)),
  (ctx) => ctx.data.places.every((item) => item.reviews?.liked?.length >= 2 && item.reviews?.disliked?.length >= 1),
  (ctx) => ctx.data.places.every((item) => /^https:\/\//.test(item.official) && item.reviews?.sources?.every((source) => /^https:\/\//.test(source.url))),
  (ctx) => hasAll(ctx.html + ctx.runtime, ['id="nearby"', 'id="map"', 'id="ask"', "day-photo"]),
  (ctx) => hasAll(ctx.html + ctx.runtime + ctx.coreText, ["Google Calendar에 추가", "download-ics", "makeGoogleCalendarUrl", "makeIcs"]),
  (ctx) => ctx.data.trip.nights === 10 && nightsBetween(ctx.data.trip.arrivalDate, ctx.data.trip.checkoutDate) === 10 && ctx.data.itinerary.length === 12,
  (ctx) => ctx.data.trip.destination !== ctx.otherDestination && ctx.data.places.filter((item) => ctx.otherPlaceIds.has(item.id)).length <= 2 && ctx.data.lodgingOptions[0].id !== ctx.otherTopLodging,
  (ctx) => ctx.data.places.length === 100 && ctx.data.lodgingOptions.filter((item) => item.bookingModel !== "whole_home").length === 30 && ctx.data.places.every((item) => item.bestFor && item.skipIf && item.kids && item.reviews?.summary),
  (ctx) => /2027년/.test(ctx.dataText) && /(미확인|재확인|아직 확정|확정할 수 없)/.test(ctx.dataText),
  (ctx) => questions.length === 50 && ctx.visual.threshold_pass === true,
  (ctx) => ctx.data.trip.adults === 6 && ctx.data.trip.children.length === 3,
  (ctx) => JSON.stringify(ctx.data.trip.children) === JSON.stringify([9, 7, 6]) && hasAll(ctx.html, ["만 9세", "7세", "6세"]),
  (ctx) => new Set(ctx.data.familyGroups.map((item) => item.origin)).has("ICN") && new Set(ctx.data.familyGroups.map((item) => item.origin)).has("LAX"),
  (ctx) => ctx.data.lodgingOptions.some((item) => item.hotelPlan?.rooms === 1) && ctx.data.lodgingOptions.some((item) => item.bookingModel === "hotel_rooms" && item.hotelPlan?.rooms === 4),
  (ctx) => ctx.html.includes("상한 없음") && ctx.html.includes("tripcom-cost-grid") && ctx.data.observedTripComQuotes.length === 30 && ctx.data.observedTripComQuotes.every((item) => item.capturedAt === ctx.data.CHECKED_AT) && (ctx.data.trip.destination !== "이스탄불" || ctx.data.observedTripComQuotes.every((item) => item.unitLabel && item.stayLabel && item.officialDirect?.capturedAt === ctx.data.CHECKED_AT)),
  (ctx) => ctx.data.itinerary.every((day) => day.transport && [day.needs?.parents, day.needs?.kids, day.needs?.together, day.needs?.recovery].every((item) => item?.length >= 12)),
  (ctx) => ctx.data.trip.destination !== "이스탄불" || (ctx.data.trip.paceModes?.options?.length === 2 && ctx.runtime.includes("activeItinerary") && ctx.runtime.includes("renderPaceSwitch")),
  (ctx) => ctx.data.itinerary.every((day, index, days) => day.intensity < 3 || !days[index + 1] || days[index + 1].intensity <= 1),
  (ctx) => ctx.data.itinerary[1].intensity === 1 && /(체크인|도착)/.test(ctx.data.itinerary[1].title),
  (ctx) => /(카파도키아|Cappadocia|Abu Dhabi|사막)/.test(ctx.visible) && /(빼|제외)/.test(ctx.visible),
  (ctx) => /(장기 평균|일별 예보가 아니다)/.test(ctx.data.climate.summary + ctx.data.climate.note),
  (ctx) => ctx.data.itinerary.every((day) => day.notes) && /(휴관|기도|강풍|신장 제한|운영 제한)/.test(ctx.dataText),
  (ctx) => ctx.data.itinerary.every((day) => day.rain && day.low),
  (ctx) => ctx.data.itinerary.every((day) => ctx.data.mealSuggestions[day.date]),
  (ctx) => /(어린이 의자|어린이 메뉴|연령|나이)/.test(ctx.dataText) && /(9인|아홉 명)/.test(ctx.dataText),
  (ctx) => ctx.data.places.every((item) => item.skipIf) && ctx.data.places.some((item) => /(멀|혼잡|비|강풍|휴관|줄|계단|피곤|제외)/.test(`${item.skipIf} ${item.warning || ""}`)),
  (ctx) => ctx.data.places.every((item) => item.reviews?.liked?.length >= 2 && item.reviews?.disliked?.length >= 1),
  (ctx) => ctx.data.places.every((item) => item.reviews.sources.every((source) => source.checkedAt === ctx.data.CHECKED_AT)),
  (ctx) => ctx.data.places.every((item) => item.photoSource && item.photoLabel.includes("실제 장소 사진")),
  (ctx) => ctx.manifest.every((item) => !item.fallback) && ctx.data.places.every((item) => item.imageFallback && item.photoLabel) && ctx.data.lodgingOptions.filter((item) => item.bookingModel !== "whole_home").every((item) => item.image && item.photoSource && item.imageIdentityCheck),
  (ctx) => /navigator\.geolocation/.test(ctx.runtime) && /위치 권한을 받지 못해 숙소 기준/.test(ctx.runtime),
  (ctx) => hasAll(ctx.runtime, ["basemaps.cartocdn.com", "map-marker", "data-zoom", "실제 지도 열기"]),
  (ctx) => /item\.reviews\?\.summary/.test(ctx.coreText) && /item\.skipIf/.test(ctx.coreText) && /item\.kids/.test(ctx.coreText),
  (ctx) => /localAnswer\(clean,\s*activeItinerary\(\)\)/.test(ctx.runtime) && /저장해 둔 여행 자료에서 찾았어요/.test(ctx.runtime),
  (ctx) => /calendar\.google\.com\/calendar\/render/.test(ctx.coreText) && !/(client_secret|private_key)/.test(ctx.coreText),
  (ctx) => (ctx.core.makeIcs().match(/BEGIN:VEVENT/g) || []).length === 12,
  (ctx) => ctx.core.makeCsv().includes("checked_at") && ctx.core.makeKml().includes("<Placemark>"),
  (ctx) => /bottom-nav/.test(ctx.css) && /env\(safe-area-inset-bottom\)/.test(ctx.css) && /min-height:\s*44px/.test(ctx.css),
  (ctx) => /skip-link/.test(ctx.html) && /prefers-reduced-motion/.test(ctx.css) && ctx.data.places.every((item) => item.photoLabel),
  (ctx) => /attachImageFallbacks/.test(ctx.runtime) && /catch \{/.test(ctx.runtime),
  (ctx) => /from "\.\/trip-app\.mjs"/.test(ctx.app) && !ctx.app.includes("../family-trip-2027") && /from "\.\/trip-data\.mjs"/.test(ctx.app),
  (ctx) => ctx.data.observedTripComQuotes.every((item) => ["observed_exact", "reference_start_price"].includes(item.status)) && (ctx.data.trip.destination === "두바이" ? ctx.data.observedTripComQuotes.every((item) => item.totalIncludesTaxes === true) : ctx.data.observedTripComQuotes.every((item) => item.status === "reference_start_price" && item.totalIncludesTaxes === null && ["observed_exact", "observed_once_not_reproduced", "reference_start_price", "no_rate_returned", "verification_blocked", "unavailable"].includes(item.officialDirect?.status) && (item.officialDirect.status !== "observed_exact" || (Number.isFinite(item.officialDirect.nightlyValue) && Number.isFinite(item.officialDirect.projectedValue))))),
  (ctx) => ctx.allImageManifest.length === 130 && ctx.allImageManifest.every((item) => item.ok && !item.fallback),
  (ctx) => ctx.visual.score >= 90 && ctx.visual.threshold_pass,
  (ctx) => publicFilesOk(ctx)
];

if (checks.length !== questions.length) throw new Error(`감사 코드 ${checks.length}개와 질문 ${questions.length}개가 다릅니다.`);

const allConfigs = [
  { slug: "istanbul-family-trip-2027", other: "dubai-family-trip-2027" },
  { slug: "dubai-family-trip-2027", other: "istanbul-family-trip-2027" }
];
const configs = requestedSlug ? allConfigs.filter((item) => item.slug === requestedSlug) : allConfigs;
if (!configs.length) throw new Error(`알 수 없는 앱 슬러그입니다: ${requestedSlug}`);

let failed = 0;
for (const config of configs) {
  const dir = join(root, config.slug);
  const files = {};
  for (const name of ["index.html", "styles.css", "app.mjs", "trip-data.mjs", "app-core.mjs", "trip-app.mjs"]) files[name] = await readFile(join(dir, name), "utf8");
  const data = await import(pathToFileURL(join(dir, "trip-data.mjs")));
  const core = await import(pathToFileURL(join(dir, "app-core.mjs")));
  const placeManifest = await Promise.all(data.places.map(async (item) => {
    const isLocal = String(item.image).startsWith("./");
    const asset = isLocal ? String(item.image).slice(2) : String(item.image);
    return { source: item.photoSource, asset, isLocal, ok: isLocal ? await exists(join(dir, asset)) : /^https:\/\//.test(asset), fallback: false };
  }));
  const hotelManifest = await Promise.all(data.lodgingOptions.filter((item) => item.bookingModel !== "whole_home").map(async (item) => {
    const isLocal = String(item.image).startsWith("./");
    const asset = isLocal ? String(item.image).slice(2) : String(item.image);
    return { source: item.photoSource, asset, isLocal, ok: isLocal ? await exists(join(dir, asset)) : /^https:\/\//.test(asset), fallback: false };
  }));
  const visualPath = join(dir, "VISUAL-VERDICT.json");
  const visual = JSON.parse(await readFile(await exists(visualPath) ? visualPath : join(root, "family-trip-2027", "VISUAL-VERDICT.json"), "utf8"));
  const otherData = await import(pathToFileURL(join(root, config.other, "trip-data.mjs")));
  const ctx = {
    slug: config.slug,
    dir,
    files,
    data,
    core,
    manifest: placeManifest,
    allImageManifest: [...placeManifest, ...hotelManifest],
    visual,
    html: files["index.html"],
    css: files["styles.css"],
    app: files["app.mjs"],
    runtime: files["trip-app.mjs"],
    coreText: files["app-core.mjs"],
    dataText: files["trip-data.mjs"],
    visible: `${files["index.html"]}\n${files["trip-data.mjs"]}\n${files["app-core.mjs"]}\n${files["trip-app.mjs"]}`,
    otherCss: await readFile(join(root, config.other, "styles.css"), "utf8"),
    otherDestination: otherData.trip.destination,
    otherPlaceIds: new Set(otherData.places.map((item) => item.id)),
    otherTopLodging: otherData.lodgingOptions[0].id
  };
  console.log(`\n${data.trip.destination}: 50문항 자기감사`);
  for (let index = 0; index < checks.length; index += 1) {
    let passed = false;
    try { passed = Boolean(await checks[index](ctx)); } catch { passed = false; }
    if (!passed) failed += 1;
    console.log(`${String(index + 1).padStart(2, "0")} ${passed ? "PASS" : "FAIL"} ${questions[index].text}`);
  }
}

if (failed) {
  console.error(`\n실패 ${failed}개`);
  process.exitCode = 1;
} else {
  console.log(`\n${configs.map((item) => item.slug).join(", ")} 50/50 통과${baseOrigin ? `, 공개 기준 ${baseOrigin}` : ", 로컬 배포 전 기준"}`);
}
