import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const appDir = join(root, "istanbul-family-trip-2027");
const researchDir = join(appDir, "research");
const CHECKED_AT = "2026-09-01";
const reusableManifest = JSON.parse(await readFile(join(appDir, "assets", "reusable-image-manifest.json"), "utf8").catch(() => '{"places":{}}'));

const verifiedImageOverrides = new Map([
  ["cengelkoy-waterfront-neighbourhood", {
    url: "https://i.ulusal.com.tr/storage/files/images/2023/10/28/cengelkoy-2-w3et.jpg",
    sourcePage: "https://www.ulusal.com.tr/gezi/cengelkoy-iskele-manzarasina-karsi-ziyafet-keyfi-cengelkoyde-gidilebilecek-en-iyi-mekanlar-15044202",
    license: "출처 소유, Google 이미지 검색으로 장소 일치 확인, 링크 전용"
  }],
  ["buyukada", {
    url: "https://photos.wikimapia.org/p/00/03/30/57/27_big.jpg",
    sourcePage: "https://wikimapia.org/30924/tr/B%C3%BCy%C3%BCkada-Meydan%C4%B1",
    license: "출처 소유, Google 이미지 검색으로 장소 일치 확인, 링크 전용"
  }],
  ["heybeliada", {
    url: "https://storage.googleapis.com/goturkiye-tga-local/istanbul-1-1920x1080-30-1400x788.jpg",
    sourcePage: "https://goturkiye.com/de/istanbul/heybeliada",
    license: "GoTürkiye 공식 관광 이미지, 링크 전용"
  }],
  ["fenerbahce-park", {
    url: "https://istanbul.tips/wp-content/uploads/2023/03/Istanbul-Turkey-9-July-2008-Fenerbahce-Park.webp",
    sourcePage: "https://istanbul.tips/the-best-5-parks-in-istanbul/",
    license: "출처 소유, Google 이미지 검색으로 장소 일치 확인, 링크 전용"
  }],
  ["validebag-grove", {
    url: "https://media.cumhuriyet.com.tr/Archive/2022/6/2/1942757/kapak_141423.jpg",
    sourcePage: "https://www.cumhuriyet.com.tr/haberleri/validebag-korusu",
    license: "출처 소유, Google 이미지 검색으로 장소 일치 확인, 링크 전용"
  }],
  ["nezahat-gokyigit-botanical-garden", {
    url: "https://cdnuploads.aa.com.tr/uploads/Contents/2019/04/29/thumbs_b_c_36e53469924a89e18e058ad8f8c4e953.jpg?v=175245",
    sourcePage: "https://www.aa.com.tr/tr/kultur-sanat/istanbulun-gobeginde-bir-botanik-bahcesi/1465645",
    license: "Anadolu Ajansı 소유, Google 이미지 검색으로 장소 일치 확인, 링크 전용"
  }],
  ["ataturk-arboretum", {
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Atat%C3%BCrkArboretum_%2829%29.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Atat%C3%BCrkArboretum_(29).jpg",
    license: "Wikimedia Commons, 원문 라이선스에 따라 출처 표시"
  }],
  ["belgrad-forest", {
    url: "https://s1.wklcdn.com/image_259/7793827/171109261/106872307.700x525.jpg",
    sourcePage: "https://tr.wikiloc.com/gezi-yuruyus-rotalari/belgrad-6-km-klasik-yuruyus-parkuru-171109260",
    license: "출처 소유, Google 이미지 검색으로 장소 일치 확인, 링크 전용"
  }],
  ["macka-democracy-park", {
    url: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Ma%C3%A7ka_Demokrasi_Park%C4%B1%2C_October_2021_%281%29.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Ma%C3%A7ka_Demokrasi_Park%C4%B1,_October_2021_(1).jpg",
    license: "Wikimedia Commons, 원문 라이선스에 따라 출처 표시"
  }],
  ["baltaliman-japanese-garden", {
    url: "https://sariyerpostacom.teimg.com/crop/1280x720/sariyerposta-com/uploads/2024/01/8.jpg",
    sourcePage: "https://www.sariyerposta.com/baltalimani-japon-bahcesini-gezdiniz-mi",
    license: "출처 소유, 주이스탄불 일본총영사관 사진과 장소 일치 확인, 링크 전용"
  }],
  ["istanbul-aquarium", {
    url: "https://commons.wikimedia.org/wiki/Special:FilePath/%C4%B0stanbul_Akvaryumun_giri%C5%9Fi.jpg?width=1280",
    sourcePage: "https://commons.wikimedia.org/wiki/File:%C4%B0stanbul_Akvaryumun_giri%C5%9Fi.jpg",
    license: "Wikimedia Commons, 원문 라이선스에 따라 출처 표시"
  }],
  ["istanbul-aviation-museum", {
    url: "https://www.turkiyeroutes.com/images/urunler/isletme-1097-istanbul-air-force-museum-7843.jpg",
    sourcePage: "https://www.turkiyeroutes.com/historical/istanbul-air-force-museum",
    license: "출처 소유, Google 이미지 검색으로 장소 일치 확인, 링크 전용"
  }],
  ["maltepe-orhangazi-city-park", {
    url: "https://pbs.twimg.com/media/DgYBk3AX4AAkR9W.jpg",
    sourcePage: "https://x.com/agacvepeyzajas/status/1010496909839134721",
    license: "출처 소유, Google 이미지 검색으로 장소 일치 확인, 링크 전용"
  }],
  ["fethi-pasa-grove", {
    url: "https://www.turkiyeroutes.com/images/urunler/isletme-1076-fethi-pasha-grove-7700.jpg",
    sourcePage: "https://www.turkiyeroutes.com/citypark/fethi-pasha-grove",
    license: "출처 소유, Google 이미지 검색으로 장소 일치 확인, 링크 전용"
  }],
  ["mihrabat-grove", {
    url: "https://okuldisiogrenme-cdn-small.eba.gov.tr/uploads/places/69ea26aab573c.jpg",
    sourcePage: "https://okuldisiogrenme.eba.gov.tr/place-detail/mihrabat-korusu-10290",
    license: "터키 교육부 교육장소 자료, Google 이미지 검색으로 장소 일치 확인, 링크 전용"
  }]
]);

async function readJsonl(name) {
  const content = await readFile(join(researchDir, name), "utf8");
  return content.trim().split("\n").filter(Boolean).map((line, index) => {
    try { return JSON.parse(line); }
    catch (error) { throw new Error(`${name}:${index + 1} ${error.message}`); }
  });
}

function slug(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en-US")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function energy(value) {
  if (Number.isFinite(value)) return Math.max(1, Math.min(3, value));
  if (/높/.test(String(value))) return 3;
  if (/보통/.test(String(value))) return 2;
  return 1;
}

function rainReady(value) {
  return !/낮|나쁨|약함/.test(String(value || ""));
}

function sentences(values) {
  return (Array.isArray(values) ? values : [values]).filter(Boolean).map((value) => {
    const clean = String(value).trim();
    return /[.!?。]$/.test(clean) ? clean : `${clean}.`;
  });
}

function fromA(item) {
  const id = item.existing_id || item.id;
  const verifiedImage = verifiedImageOverrides.get(id);
  const liked = sentences(item.repeated_review_pros);
  const disliked = sentences(item.repeated_review_cons);
  const advantages = sentences(item.family_advantages);
  const cautions = sentences(item.cautions);
  const english = item.official_name || "";
  const name = english && !english.toLocaleLowerCase("en-US").includes(item.korean_name.toLocaleLowerCase("ko-KR"))
    ? `${item.korean_name} (${english})`
    : item.korean_name;
  return {
    id,
    name,
    zone: item.zone,
    category: item.category,
    lat: item.lat,
    lng: item.lng,
    duration: item.duration,
    energy: energy(item.mobility_fatigue),
    rain: rainReady(item.rain_fit),
    why: advantages.join(" "),
    warning: cautions.join(" "),
    official: item.official_url,
    maps: item.google_maps_url,
    checkedAt: item.review_checked_at || CHECKED_AT,
    operatingStatus: item.operating_status,
    image: reusableManifest.places?.[id] || verifiedImage?.url || item.photo_url,
    imageFallback: verifiedImage?.url || item.photo_url,
    photoSource: verifiedImage?.sourcePage || item.photo_source_url,
    photoLicense: verifiedImage?.license || item.photo_license,
    photoLabel: `${item.korean_name} 실제 장소 사진`,
    bestFor: advantages[0] || `${item.korean_name}을 짧게 경험하고 싶은 가족`,
    skipIf: cautions[0] || "당일 운영 조건을 확인하지 못했다면 빼는 편이 안전합니다.",
    kids: `6세, 7세, 9세 아이에게는 ${advantages[0] || "볼거리를 하나 정해 보여줍니다."} ${cautions[0] || "관람 시간을 짧게 정합니다."}`,
    groupFit: "아홉 명이 함께 움직이므로 관람 상한과 중간 이탈 지점을 먼저 정합니다.",
    reservation: cautions.join(" ") || "방문 직전 운영 시간을 확인합니다.",
    reviews: {
      summary: `실제 후기에서 ${liked[0] || "가족 관람 만족도가 높다는 말"} 반면 ${disliked[0] || "혼잡 시간을 피해야 한다는 말"}`,
      liked: liked.length >= 2 ? liked.slice(0, 3) : [...liked, advantages[0]].filter(Boolean).slice(0, 2),
      disliked: disliked.length ? disliked.slice(0, 2) : cautions.slice(0, 1),
      familyTip: `우리 가족은 ${advantages[0] || "핵심 장면 하나만 봅니다."} ${cautions[0] || "피로하면 바로 나옵니다."}`,
      sources: [{ platform: "실제 방문자 후기 반복 신호", url: item.review_source_url, checkedAt: item.review_checked_at || CHECKED_AT }]
    }
  };
}

function fromB(item) {
  const id = slug(item.en_name);
  const verifiedImage = verifiedImageOverrides.get(id);
  const liked = sentences(item.review_pros);
  const disliked = sentences(item.review_con);
  const advantage = sentences(item.family_advantage)[0];
  const caution = sentences(item.caution)[0];
  return {
    id,
    name: `${item.ko_name} (${item.en_name})`,
    zone: item.area,
    category: item.category,
    lat: item.lat,
    lng: item.lng,
    duration: item.duration,
    energy: energy(item.fatigue),
    rain: rainReady(item.rain),
    why: advantage,
    warning: caution,
    official: item.official_url,
    maps: item.maps_url,
    checkedAt: item.observed_at || CHECKED_AT,
    operatingStatus: "visit_rules_verify",
    image: reusableManifest.places?.[id] || verifiedImage?.url || item.photo_url,
    imageFallback: verifiedImage?.url || item.photo_url,
    photoSource: verifiedImage?.sourcePage || item.photo_source,
    photoLicense: verifiedImage?.license || item.photo_license,
    photoLabel: `${item.ko_name} 실제 장소 사진`,
    bestFor: advantage,
    skipIf: caution,
    kids: `6세, 7세, 9세 아이에게는 ${advantage} ${caution}`,
    groupFit: /식당|디저트|찻집/.test(item.category)
      ? "아홉 명이 한 테이블에 앉을 수 있는지와 어린이 좌석을 먼저 확인합니다."
      : "아홉 명이 함께 움직이므로 머무는 시간과 다시 만날 지점을 정합니다.",
    reservation: caution,
    reviews: {
      summary: `실제 후기에서 ${liked[0]} 반면 ${disliked[0]}`,
      liked,
      disliked,
      familyTip: `우리 가족은 ${advantage} ${caution}`,
      sources: [{ platform: "Google Maps 등 실제 방문자 후기 반복 신호", url: item.review_source, checkedAt: item.observed_at || CHECKED_AT }]
    }
  };
}

const a = await readJsonl("places-candidates-a.jsonl");
const b = await readJsonl("places-candidates-b.jsonl");
if (a.length !== 50 || b.length !== 50) throw new Error(`장소는 각 50개여야 합니다. A ${a.length}, B ${b.length}`);

const places = [...a.map(fromA), ...b.map(fromB)];
if (places.length !== 100) throw new Error(`장소는 정확히 100개여야 합니다. 현재 ${places.length}개입니다.`);
const duplicateIds = [...new Set(places.map((item) => item.id).filter((id, index, ids) => ids.indexOf(id) !== index))];
if (duplicateIds.length) throw new Error(`장소 ID가 중복됐습니다: ${duplicateIds.join(", ")}`);

const requiredIds = ["galataport", "cistern", "hagia", "topkapi", "dolmabahce", "ortakoy", "modern", "kuzguncuk", "beylerbeyi", "grand", "spice", "rahmi", "galata"];
const missingIds = requiredIds.filter((id) => !places.some((item) => item.id === id));
if (missingIds.length) throw new Error(`일정이 쓰는 장소가 없습니다: ${missingIds.join(", ")}`);

for (const item of places) {
  if (!/^https:\/\//.test(item.official)) throw new Error(`${item.name}: 공식 URL 오류`);
  if (!/^https:\/\/www\.google\.com\/maps\//.test(item.maps)) throw new Error(`${item.name}: Google Maps URL 오류`);
  if (!/^(https:\/\/|\.\/assets\/)/.test(item.image) || !/^https:\/\//.test(item.photoSource)) throw new Error(`${item.name}: 사진 URL 오류`);
  if (!item.reviews.liked[1] || !item.reviews.disliked[0]) throw new Error(`${item.name}: 반복 후기 신호 부족`);
}

const moduleText = `// Generated from research/places-candidates-a.jsonl and places-candidates-b.jsonl.\n// Run: node scripts/build-istanbul-place-catalog.mjs\n\nexport const places = ${JSON.stringify(places, null, 2)};\n`;
await writeFile(join(appDir, "place-catalog.mjs"), moduleText);
console.log(`장소 ${places.length}곳을 생성했습니다.`);
