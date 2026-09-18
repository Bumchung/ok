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
cd /path/to/ok
python3 -m http.server 4173
```

```bash
cd /path/to/ok/istanbul-family-trip-2027
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

## Codex에 질문하고 페이지 보완하기

Node.js 22 이상과 로그인된 Codex CLI를 사용합니다. 별도 패키지나 API 키는 필요하지 않습니다.

```bash
cd /path/to/ok/istanbul-family-trip-2027
codex login status
npm run assistant
```

<http://127.0.0.1:4317/istanbul-family-trip-2027/#ask>를 같은 컴퓨터에서 엽니다. 로컬 미리보기에서는 자동 연결됩니다.

- **질문하기**: 현재 여행 자료, 이전 대화 8개와 최근 보완 카드 30개를 읽고 답합니다. 파일은 변경하지 않습니다.
- **페이지 보완**: 답변과 함께 일정, 숙소, 예산, 장소, 식당에 보완 카드를 최대 3개 추가합니다. 사용자 선호는 직접 말한 내용만 기록하고, 추천 카드는 출처가 필요합니다. 원래 일정이나 앱 코드를 임의로 교체하지 않습니다.
- **여행 자료 검색**: Codex가 꺼져 있어도 기존 자료를 검색할 수 있습니다. Codex 연결 실패를 이 검색의 성공으로 표시하지 않습니다.

공개 GitHub Pages에서도 같은 컴퓨터의 실행기를 연결할 수 있습니다. 질문 창의 연결 설정에 터미널에 표시된 연결 코드를 붙여 넣습니다. 주소의 기본값은 `http://127.0.0.1:4317`입니다. 브라우저가 로컬 네트워크 연결을 요청하면 허용해야 합니다. 브라우저가 연결을 차단하면 **내 컴퓨터에서 열기** 링크로 로컬 미리보기를 사용합니다. 휴대전화의 `127.0.0.1`은 휴대전화 자신이므로 Mac의 Codex로 연결되지 않습니다.

연결 코드는 실행할 때마다 바뀌며 브라우저 탭의 `sessionStorage`에만 저장됩니다. 외부 서버로 실행기나 포트를 공개하지 않습니다. 종료는 터미널에서 `Ctrl+C`입니다.

### 무엇이 어디에 저장되는가

| 내용 | 저장 위치 | 공개 반영 |
| --- | --- | --- |
| 대화 화면 | 해당 브라우저의 `localStorage` | 공유하지 않음 |
| 질문 처리 기록 | `.local-assistant/jobs/` | Git 제외, HTTP로 접근 불가 |
| 보완 카드 | `planner-updates.json` | 파일 검토 후 사이트 배포 시 반영 |

보완 카드는 검증을 통과하면 로컬 파일에 자동 저장됩니다. 공개 사이트에는 자동으로 push하지 않습니다. 공개하려면 `planner-updates.json` 변경을 검토하고 기존 `gh-pages` 배포 절차를 사용합니다. 개인적인 선호가 포함될 수 있으므로 카드 내용을 확인한 뒤 공개하세요. 잘못된 카드는 이 JSON 파일에서 해당 항목을 삭제하고 페이지를 새로고침하면 됩니다. 앱이 저장 중일 때 직접 편집하면 덮어쓰지 않고 요청을 실패로 처리합니다.

GitHub Pages는 정적 파일만 제공하므로 Codex 응답에는 실행 중인 로컬 도우미가 필요합니다. 컴퓨터가 꺼지면 새 AI 응답은 받을 수 없고 기존 여행 자료 검색은 계속 작동합니다.

### 실행 설정과 검증

모델과 추론 설정은 현재 `CODEX_HOME/config.toml`의 최상위 설정을 이어받습니다. 프로젝트별 프로필이나 별도 제공자는 로드하지 않습니다. 필요하면 실행할 때 `ISTANBUL_CODEX_MODEL`, `ISTANBUL_CODEX_EFFORT`, `ISTANBUL_CODEX_BIN`, `ISTANBUL_ASSISTANT_PORT`로 명시적으로 지정할 수 있습니다. Codex의 기존 로그인은 CLI가 직접 사용합니다.

실행기는 `codex exec --output-schema`로 구조화된 답변을 받고 자체 검사한 뒤 JSON 파일 하나만 씁니다. Codex는 읽기 전용이며 셸, 다른 앱, MCP 설정, 플러그인과 사용자 훅을 로드하지 않습니다. 최신 정보가 필요한 질문에는 웹 검색을 사용할 수 있습니다. 링크가 붙었다는 이유만으로 모든 문장이 검증됐다고 보장하지 않으며, 가격과 예약 가능 여부는 출처에서 다시 확인합니다.

중복 요청은 같은 ID로 복원하며, 동시에 한 질문만 처리합니다. 실행 시간이 3분을 넘으면 Codex 프로세스를 종료합니다. 연결이 끊겼을 때는 **진행 상황 다시 확인**으로 기존 작업을 조회합니다. 실행기가 재시작되면 중단된 질문은 자동으로 재실행하지 않습니다.

```bash
npm test
```

검증은 임시 폴더와 모의 응답을 사용하므로 실제 보완 파일에 테스트 카드를 남기지 않습니다. 실제 Codex 연결 검사는 기존 로그인으로 별도 수행합니다.

구현 근거: [Codex 비대화형 실행과 구조화된 출력](https://learn.chatgpt.com/docs/non-interactive-mode), [Codex 설정](https://developers.openai.com/codex/config-reference).

기존 `api/ask.mjs`와 `assistant-api-core.mjs`는 다른 여행 앱의 원격 GPT/Claude 연결 호환성을 위해 유지합니다. 이스탄불의 새 질문 창은 로컬 Codex 연결을 사용합니다.
