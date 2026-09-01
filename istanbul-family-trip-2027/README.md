# Istanbul Together 2027

성인 6명과 만 9세, 7세, 6세 어린이 3명을 위한 이스탄불 가족여행 앱입니다. 2027년 3월 20일에 출발하고 3월 21일부터 31일까지 정확히 10박합니다.

공개 주소: <https://bumchung.github.io/ok/istanbul-family-trip-2027/>

## 들어 있는 정보

- 같은 권역을 묶은 집중 일정과 회복을 우선한 천천히 일정
- 실제 후보 장소 100곳, 공식 링크, Google Maps, 반복 후기의 장점과 불편
- 럭셔리 또는 리조트형 호텔 30곳과 허가번호를 확인할 한 집형 숙소 1곳
- Trip.com 1실 1박 시작가, 공식 예약가, 객실 4실과 10박 환산값, 세금, 조식, 환불, 관측일
- 현재 위치 주변 추천, 실제 지도, 날짜별 Google Calendar, 전체 ICS, CSV와 KML
- 사진 130개 전수 검사, 재사용 가능한 사진 84개는 로컬 보관, 권리자 소유 사진 46개는 출처 링크로만 표시

## 가격을 읽는 법

Trip.com에서 확인한 30개 숫자는 목표일과 조건이 다른 공개 시작가입니다. 예약 가능한 2027년 실견적으로 표시하지 않습니다. 같은 날짜, 객실, 인원, 세금, 환불 조건이 모두 같을 때만 가격 차이를 계산합니다.

목표일 공식가를 정확히 확인한 호텔은 Swissôtel The Bosphorus입니다. 일반 환불 불가 상품은 객실 1실 1박 EUR 196이며 객실 4실과 10박 단순 환산은 EUR 7,840입니다. 세금은 포함되고 조식은 제외됩니다. CVK 공식 예약 화면에서 보인 EUR 6,030은 4베드룸 레지던스 1채의 10박 값이지만 재현되지 않아 예약 가능한 확정가로 쓰지 않습니다.

## 로컬 실행과 검증

```bash
cd /Users/heebumchung/BumbrainWork/_workspace/bumchung-ok-gh-pages
python3 -m http.server 4173
```

```bash
cd /Users/heebumchung/BumbrainWork/_workspace/bumchung-ok-gh-pages/istanbul-family-trip-2027
npm test
npm run build:data
npm run verify:images
node ../scripts/audit-family-trip.mjs --slug istanbul-family-trip-2027
```

공개 배포 뒤에는 다음 명령으로 정적 파일과 로컬 사진의 HTTP 응답까지 확인합니다.

```bash
node scripts/audit-family-trip.mjs \
  --slug istanbul-family-trip-2027 \
  --base-origin https://bumchung.github.io/ok
```

## 원격 AI 연결

앱의 내장 가이드는 서버 없이 작동합니다. GPT와 Claude 웹 검색을 연결하려면 이 폴더를 별도 Vercel 프로젝트로 배포하고 앱 주소에 `?assistant=https%3A%2F%2FYOUR-PROJECT.vercel.app%2Fapi%2Fask`를 한 번 붙입니다. 공개 전에는 `assistant-api-core.mjs`의 허용 origin을 실제 정적 앱 도메인과 맞춰야 합니다.
