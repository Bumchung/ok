# Antalya Family Trip 2027

이스탄불 10박 원안과 같은 기능으로 비교할 수 있도록 만든 안탈리아 3박 대안 앱입니다.

## 범위

- 일정: 2027-03-26부터 03-29, 3박 4일
- 가족: 성인 6명, 만 9세, 7세, 6세 어린이 3명
- 숙소: 호텔 12곳, 레지던스와 빌라 구조 후보 6곳
- 탐색: 장소 30곳, 음식점 20곳, 카페 10곳
- 기능: 숙소와 예산 비교, 두 속도의 일정, 검색과 필터, 지도, 주변 정렬, 로컬 질문 답변, CSV/KML/ICS 내보내기

2027년 실시간 항공편, 객실 총액, 연결 객실과 어린이 실내 수영장 이용은 확인 전까지 미확정으로 표시합니다. 레지던스 6곳은 특정 매물이 아니라 권역과 구조 후보입니다.

## 구조

- `index.html`, 안탈리아 전용 화면과 비교 문구
- `styles.css`, 안탈리아 색상과 반응형 보정
- `trip-data.mjs`, 조사 결과와 3박 운영 데이터
- `app-core.mjs`, 필터, 예산, 내보내기와 로컬 답변 로직
- `app.mjs`, 공용 렌더러 연결
- `image-manifest.json`, 78개 카드 이미지의 출처, 라이선스와 해시
- `curated-images.mjs`, 자동 검색에서 오인될 수 있는 이미지의 명시적 원본

공용 화면 엔진은 `../istanbul-family-trip-2027/trip-app.mjs`를 재사용합니다.

## 실행과 검증

```sh
python3 -m http.server 4173
open http://127.0.0.1:4173/antalya-family-trip-2027/
cd antalya-family-trip-2027
npm test
```

카드 이미지를 전부 다시 만들 때는 `npm run images:build`, 명시적으로 지정한 이미지만 다시 동기화할 때는 `npm run images:repair`를 사용합니다.
