# Istanbul Together 2027

성인 6명과 만 9세, 7세, 6세 어린이 3명을 위한 2027년 3월 20일부터 31일까지의 이스탄불 가족여행 앱이다.

## 로컬에서 열기

```bash
cd /Users/heebumchung/BumbrainWork/_workspace/bumchung-ok-gh-pages
python3 -m http.server 4173
```

브라우저에서 다음 주소를 연다.

```text
http://127.0.0.1:4173/istanbul-family-trip-2027/
```

## 검증

```bash
cd /Users/heebumchung/BumbrainWork/_workspace/bumchung-ok-gh-pages/istanbul-family-trip-2027
npm test
npm run build:data
```

## 원격 AI 연결

앱의 내장 가이드는 서버 없이 작동한다. GPT와 Claude 웹 검색을 사용하려면 이 폴더를 별도 Vercel 프로젝트로 배포한 뒤 앱 URL에 다음 쿼리를 한 번 붙인다.

```text
?assistant=https%3A%2F%2FYOUR-PROJECT.vercel.app%2Fapi%2Fask
```

브라우저가 해당 엔드포인트를 저장하므로 다음 방문부터는 쿼리가 없어도 사용한다. 공개 배포 전에는 `assistant-api-core.mjs`의 허용 origin을 실제 정적 앱 도메인과 맞춰야 한다.
