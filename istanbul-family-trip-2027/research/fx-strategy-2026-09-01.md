# 이스탄불 가족여행 환율과 결제 전략

- 관측일: 2026-09-01, Asia/Seoul
- 여행일: 2027-03-21 체크인, 2027-03-31 체크아웃
- 적용 범위: 이스탄불 숙박 4객실, 10박과 현지 지출
- 기준 환율일: 2026-08-31. 관측 시점에 확인 가능한 ECB의 최신 완결 영업일 고시다.
- 결론: 원화는 2025년 말보다 달러와 리라에 강해졌다. 그러나 터키 물가와 호텔의 실제 계약 통화를 함께 보면 여행비가 같은 폭으로 싸졌다는 결론은 성립하지 않는다.

## 1. 먼저 고정할 판단

추천한다.

1. 객실은 무료 취소 조건으로 먼저 확보한다. 4객실과 같은 층 요청은 환율보다 재고 제약이 크다.
2. 결제 단말기와 ATM에서 원화 전환인 DCC는 거절한다.
3. 호텔은 화면의 표시 통화가 아니라 예약 확인서의 계약 통화로 비교한다.
4. 리라 예약은 `TRY 총액 x 결제일 KRW/TRY x 카드비용`으로 비교한다.
5. 유로 예약은 `EUR 총액 x 결제일 KRW/EUR x 카드비용`으로 비교한다. 리라 약세는 이 예약을 싸게 만들지 않는다.
6. 현금은 하루치 소액 지출용으로만 보유한다. 호텔비와 큰 결제는 카드 기록을 남긴다.

추천하지 않는다.

1. `원화 강세`라는 말만 보고 환불 불가 객실을 선결제하지 않는다.
2. 호텔 검색 화면의 원화 환산액을 확정가로 보지 않는다.
3. ATM이 제시하는 원화 금액을 선택하지 않는다.
4. 2027년 리라나 원화 방향을 예측해 전체 여행비를 한 번에 환전하지 않는다.
5. 호텔, 식당, 교통비에서 관광객 VAT 환급을 기대하지 않는다.

## 2. 환율 기준선과 산식

ECB는 1유로당 통화 단위로 기준환율을 고시한다. 이 환율은 정보 제공용 기준값이며 실제 거래가로 쓰도록 권장되는 값은 아니다.

| 기준일 | EUR/USD | EUR/TRY | EUR/KRW | 계산 KRW/USD | 계산 TRY/USD | 계산 KRW/TRY |
|---|---:|---:|---:|---:|---:|---:|
| 2025-12-31 | 1.1750 | 50.4838 | 1,696.94 | 1,444.20 | 42.9649 | 33.6136 |
| 2026-08-31 | 1.1596 | 55.9648 | 1,586.37 | 1,368.03 | 48.2622 | 28.3459 |

교차환율 산식은 다음과 같다.

```text
KRW/USD = (KRW per EUR) / (USD per EUR)
TRY/USD = (TRY per EUR) / (USD per EUR)
KRW/TRY = (KRW per EUR) / (TRY per EUR)
```

2025-12-31과 2026-08-31을 비교하면 다음과 같다.

- 1달러 비용은 1,444.20원에서 1,368.03원으로 5.27% 내려갔다.
- 1리라 비용은 33.6136원에서 28.3459원으로 15.67% 내려갔다.
- 같은 원화로 살 수 있는 달러는 5.57% 늘었다.
- 같은 원화로 살 수 있는 리라는 18.58% 늘었다.
- 1유로 비용은 1,696.94원에서 1,586.37원으로 6.52% 내려갔다.

따라서 `원화가 강하다`는 표현은 이 기준일 사이의 명목 환율에는 맞는다. 이 표현만으로 2027년 3월 여행비가 싸다고 판단하면 틀린다.

출처:

- ECB 2026-08-31 고시: https://www.ecb.europa.eu/stats/exchange/eurofxref/shared/pdf/2026/08/20260831.pdf
- ECB 2025-12-31 고시: https://www.ecb.europa.eu/stats/exchange/eurofxref/shared/pdf/2025/12/20251231.pdf
- ECB 기준환율 설명: https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html
- CBRT 일별 환율 자료실, 독립 확인 경로: https://www.tcmb.gov.tr/kurlar/kurlar_en.html

## 3. 터키 물가가 환율 이익을 지우는지 확인

터키 통계청의 2026년 7월 CPI는 전년 대비 31.75%, 전월 대비 1.78% 상승했다. 2025년 12월 대비 상승률은 19.86%다. 12개월 평균은 31.90%다. 식품은 전년 대비 37.53%, 교통은 30.83% 상승했다.

`리라가 싸졌다`와 `이스탄불 여행이 싸졌다`를 분리해야 한다. 리라 표시가격이 물가만큼 오르면 환율 이익이 사라진다.

```text
원화비용지수 = (현재 TRY 표시가격 / 기준 TRY 표시가격)
             x (현재 KRW/TRY / 기준 KRW/TRY)
```

단순 검산 예시는 다음과 같다.

```text
터키 가격지수 대용치 = 1 + 19.86% = 1.1986
환율비용지수 = 28.3459 / 33.6136 = 0.8433
결합지수 = 1.1986 x 0.8433 = 1.0108
```

이 단순 결합에서는 원화 비용이 오히려 약 1.08% 높다. 이는 호텔 가격을 추정한 값이 아니다. CPI 바스켓과 가족여행 바스켓이 다르고 기준 기간도 한 달 어긋난다. 이 계산의 목적은 원화 강세만으로 가격 하락을 단정하는 논리를 반증하는 데 있다.

TCMB는 2026년 말 물가 전망을 28%, 2027년 말 전망을 15%로 제시했다. 이 수치는 조건부 중앙은행 전망이다. 객실료, 식비, 교통비의 가격 보장이 아니다. 2027년 3월 예산에는 예측값을 넣지 않고 실제 예약 총액만 넣는다.

출처:

- 터키 통계청 2026년 7월 CPI, 2026-08-03 발표: https://veriportali.tuik.gov.tr/en/press/58297
- TCMB Inflation Report 2026-III 안내: https://www.tcmb.gov.tr/wps/wcm/connect/EN/TCMB%2BEN/Main%2BMenu/Publications/Reports/Inflation%2BReport/2026/Inflation%2BReport%2B2026%2B-%2BIII/
- TCMB Inflation Report 2026-III PDF: https://www.tcmb.gov.tr/wps/wcm/connect/f3468319-92cc-4e0c-adff-203cb2a71da2/1c26_iii.pdf?CACHEID=ROOTWORKSPACE-f3468319-92cc-4e0c-adff-203cb2a71da2-p.X46qI&MOD=AJPERES

## 4. Visa와 Mastercard 사용 규칙

### 결제 통화

현지 가맹점의 원래 청구 통화로 결제한다. 일반 현지 결제는 TRY가 원칙이다. 호텔 예약 확인서가 실제로 EUR 계약이면 EUR로 결제한다. 어느 경우에도 카드 청구 통화인 KRW로 즉시 바꿔 주겠다는 DCC는 거절한다.

Visa는 DCC 화면과 영수증에 현지 통화와 카드 통화 금액, 환율, 추가 수수료나 마크업을 표시하도록 요구한다. 선택은 카드 소유자가 해야 한다. 필수 정보가 없거나 선택을 압박하면 Visa도 전환을 거절하라고 안내한다.

Mastercard는 DCC 환율과 마크업을 가맹점 또는 ATM 운영자와 매입사가 정한다고 설명한다. DCC가 적용되면 Mastercard 환율은 적용되지 않는다. Mastercard 계산기의 결과는 참고값이며, 발급사가 다른 환율이나 추가 수수료를 적용할 수 있다.

### 실제 원화 비용 산식

```text
카드 원화 총액 = 외화 청구액 x 네트워크 적용 KRW 환율
               x (1 + 카드사 해외서비스 수수료율)
               + 건별 수수료
```

카드사 수수료율은 보유한 한국 발급 카드의 약관을 입력해야 한다. 이 조사에서는 카드가 특정되지 않았으므로 0%로 가정하지 않았다.

Visa와 Mastercard의 오늘 환율을 고정 숫자로 저장하지 않는다. 실제 적용일이 승인일인지 매입 처리일인지는 네트워크와 발급사 조건에 따라 달라질 수 있다. 결제 직전에는 공식 계산기에서 `TRY 또는 EUR -> KRW`, 해당 날짜, 카드사 수수료율을 넣고 비교한다.

### 실행 규칙

1. 단말기에 TRY와 KRW가 나오면 TRY를 고른다.
2. 예약 확인서의 계약 통화가 EUR인데 단말기가 EUR와 KRW를 제시하면 EUR를 고른다.
3. TRY 계약을 호텔이 임의의 EUR 또는 KRW로 바꾸면 결제를 멈추고 TRY 청구를 요구한다.
4. 영수증의 통화와 예약 확인서의 통화가 다르면 현장에서 취소 후 다시 결제한다.
5. Visa와 Mastercard 중 어느 쪽이 항상 싸다고 가정하지 않는다. 같은 날 공식 계산기 결과와 카드사 수수료를 합쳐 더 낮은 쪽을 쓴다.

출처:

- Visa DCC 안내: https://www.visa.com/en-us/personal/travel/dynamic-currency-conversion
- Visa 공식 환율 계산기: https://africa.visa.com/support/consumer/travel-support/exchange-rate-calculator.html
- Visa FX API 설명: https://developer.visa.com/capabilities/foreign_exchange/
- Mastercard 공식 환율 계산기: https://www.mastercard.com/sea/en/personal/get-support/currency-exchange-rate-converter.html
- Mastercard DCC Performance Guide 2025: https://www.mastercard.com/content/dam/public/mastercardcom/na/global-site/documents/DCC-Guide-2025-Merchant-Version.pdf

## 5. ATM과 현금

추천 전략은 `소액 TRY 현금 + 나머지 카드`다.

1. ATM 화면에서 `without conversion`, `decline conversion`, `charge in TRY`에 해당하는 선택지를 고른다.
2. ATM 운영자 수수료가 표시되면 인출 전에 기록한다. 수수료가 높으면 거래를 취소하고 다른 은행 ATM을 찾는다.
3. 현금서비스로 잡힐 수 있는 신용카드 인출은 피한다. 해외 ATM 인출 조건이 확인된 체크카드나 직불카드를 우선한다.
4. 너무 잦은 소액 인출은 고정 ATM 수수료를 반복시킨다. 반대로 여행비 전액 인출은 분실 위험과 남은 리라 위험을 키운다.
5. 첫 인출액은 가족의 하루치 소액 지출을 넘기지 않는다. 실제 현금 사용 속도를 본 뒤 보충한다.
6. 출국 때 남은 리라를 줄인다. 리라는 귀국 후 재환전 비용과 가치 변동 위험이 있다.

한계가 있다. ATM 운영자 수수료, 한국 발급사의 해외 ATM 수수료, 현금서비스 분류는 카드마다 다르다. `수수료 없는 ATM`이라는 일반 목록은 고정 사실로 쓰지 않는다. 화면에 표시된 당일 조건과 카드 약관을 확인한다.

Visa의 DCC 안내는 ATM에서도 원화 환산과 추가 수수료가 발생할 수 있다고 명시한다. Mastercard도 ATM 운영자가 DCC를 하면 Mastercard 환율이 적용되지 않는다고 설명한다.

터키 정부는 출국 시 10,000유로 또는 그 상당액을 넘는 외화 현금에 신고 의무가 있다고 안내한다. 이 가족여행 전략은 그만큼의 현금을 보유하지 않는 것을 전제로 한다.

출처:

- 터키 상무부 여행자 현금과 Tax-free FAQ: https://ticaret.gov.tr/gumruk-muhafaza/sikca-sorulan-sorular
- Visa DCC 안내: https://www.visa.com/en-us/personal/travel/dynamic-currency-conversion
- Mastercard 공식 환율 계산기와 DCC 설명: https://www.mastercard.com/sea/en/personal/get-support/currency-exchange-rate-converter.html

## 6. 호텔의 EUR 표시를 해석하는 법

호텔 화면에 EUR가 보인다는 사실만으로 EUR 계약은 아니다.

Accor는 해외 호텔 예약이 호텔 소재국의 현지 통화로 지급되며, 현지 통화로 확인된 금액만 보장된다고 명시한다. 고객 통화로 표시된 환산액은 참고값이며 계약 금액이 아니다. 이 조건이 적용되는 이스탄불 호텔이라면 원화나 유로 표시를 버리고 TRY 확정 총액을 기록해야 한다.

반대로 Pera Palace는 공식 약관에서 추가 침대를 1박당 EUR 60과 VAT로 명시한다. 이런 부대비용은 리라가 약해져도 EUR 금액이 그대로라면 원화 비용이 `EUR x KRW/EUR`로 결정된다.

### 예약 기록에 반드시 남길 항목

```text
표시 통화
예약 확인서의 계약 통화
호텔이 보장하는 총액
세금 포함 여부
선결제 통화
현장 결제 통화
호텔 자체 환산율 적용 여부
무료 취소 마감 시각과 시간대
```

### 통화별 원화 비교식

```text
TRY 계약: TRY 총액 x KRW/TRY x (1 + 카드비용률)
EUR 계약: EUR 총액 x KRW/EUR x (1 + 카드비용률)
USD 계약: USD 총액 x KRW/USD x (1 + 카드비용률)
```

같은 호텔의 EUR 표시가 단순 참고값이고 TRY가 계약 통화라면 TRY 식만 쓴다. EUR로 고정된 추가 침대나 조식이 있으면 해당 항목만 EUR 식으로 분리한다.

출처:

- Accor 터키 호텔 예약 통화 고지: https://all.accor.com/a/en/destination/country/hotels-turkey-ptr.html
- Pera Palace 공식 이용 조건: https://perapalace.com/en/terms-and-conditions-of-use/

## 7. 관광객 VAT 환급 범위

터키의 관광객 Tax-free는 승인된 판매점에서 산 물품을 여행자가 국외로 반출하는 제도다. 터키 상무부 FAQ는 구매 물품, 전자 송장, 실물 제시, 3개월 안의 국외 반출을 요건으로 설명한다.

따라서 호텔 숙박, 식당, 현지 교통처럼 터키에서 소비한 서비스는 이 여행자 물품 환급 절차의 대상이 아니다. 호텔 예약의 VAT를 공항에서 돌려받는다고 예산을 줄이면 안 된다.

쇼핑 물품은 다음을 모두 만족할 때만 별도로 검토한다.

1. Tax-free 승인 판매점에서 샀다.
2. VAT 제외 가격이 현재 공식 기준을 넘는다.
3. 전자 송장 출력물을 받았다.
4. 구매 후 3개월 안에 물품을 국외로 반출한다.
5. 출국 세관에서 송장과 물품을 함께 제시한다.

공식 FAQ의 금액 기준은 향후 바뀔 수 있다. 2027년 3월 쇼핑 직전 같은 페이지에서 다시 확인한다.

출처:

- 터키 상무부 Tax-free 절차: https://ticaret.gov.tr/gumruk-muhafaza/sikca-sorulan-sorular
- 터키 국세청 VAT 일반 적용 안내: https://gib.gov.tr/mevzuat/kanun/436/teblig/9047

## 8. 2027년 3월 예약 타이밍을 예측 없이 운영하는 규칙

### A. 지금부터 2026-10-31까지

무료 취소 가능한 4객실 재고를 확보한다. 같은 객실형, 같은 식사 조건, 같은 세금 조건으로 기준 예약을 하나 만든다. 객실 연결이나 같은 층은 확정이 아니라 요청일 수 있으므로 호텔의 서면 답변을 저장한다.

기준 예약의 원화 환산은 다음과 같이 저장한다.

```text
기준 총액 KRW = 계약통화 총액 x 2026-08-31 기준 교차환율
              x (1 + 보유 카드의 해외결제 비용률)
```

기준 교차환율은 다음과 같다.

- KRW/EUR: 1,586.37
- KRW/USD: 1,368.03
- KRW/TRY: 28.3459

### B. 2026-11-01부터 체크인 120일 전까지

2주마다 같은 조건의 공식 호텔가와 OTA가를 확인한다. 객실형, 수용 인원, 조식, 세금, 환불 마감이 하나라도 다르면 가격 비교에서 제외한다.

### C. 체크인 120일 전부터 60일 전까지

매주 확인한다. 새 예약의 모든 비용을 원화로 환산한 값이 기존 예약보다 5% 이상 낮을 때만 갈아탄다. 5%는 시장 전망이 아니라 잘못된 통화 표시, 카드 수수료, 조건 차이와 실행 마찰을 흡수하기 위해 이 여행에 정한 운영 밴드다.

```text
갈아타기 조건 = 새 동일조건 총액 KRW <= 기존 총액 KRW x 0.95
```

### D. 체크인 60일 전부터 무료 취소 마감까지

매주 확인하되 객실 재고를 우선한다. 4객실을 동시에 확보하지 못하는 할인은 무시한다. 무료 취소 마감 72시간 전에는 마지막 비교를 끝낸다. 예약별 현지 시간대를 확인한다.

### E. 환불 불가 선결제

같은 조건의 무료 취소가보다 원화 총액이 10% 이상 낮고 여행 취소 위험을 감수할 수 있을 때만 선택한다.

```text
선결제 조건 = 환불불가 총액 KRW <= 무료취소 총액 KRW x 0.90
```

10%도 예측값이 아니다. 취소권을 포기할 최소 보상으로 정한 정책값이다. 항공 일정, 가족 건강, 입국 규정 가운데 하나라도 불확실하면 선결제하지 않는다.

## 9. 반증 조건과 행동

### `원화 강세가 계속된다`는 가정을 폐기하는 조건

5% 운영 밴드를 쓴다. 다음 가운데 예약 계약 통화에 해당하는 하나가 기준보다 나빠지면 강세 가정을 폐기한다.

| 계약 통화 | 기준 | 가정 폐기선 | 의미 |
|---|---:|---:|---|
| EUR | 1,586.37 KRW/EUR | 1,665.69 이상 | 유로 숙박의 원화 비용이 기준보다 5% 이상 악화 |
| USD | 1,368.03 KRW/USD | 1,436.43 이상 | 달러 비용이 기준보다 5% 이상 악화 |
| TRY | 28.3459 KRW/TRY | 29.7631 이상 | 리라 비용이 기준보다 5% 이상 악화 |

환율이 폐기선을 넘으면 `더 기다리면 싸질 것`이라는 판단을 중단한다. 무료 취소 예약을 유지하고, 같은 조건에서 원화 총액이 더 낮은 상품만 교체한다.

### `리라 약세면 현지비가 싸다`는 가정을 폐기하는 조건

```text
(새 TRY 가격 / 기준 TRY 가격) x (새 KRW/TRY / 28.3459) >= 1
```

결과가 1 이상이면 리라 약세가 가격 상승을 상쇄하지 못했다. 현재 예약이 더 싸거나 같다.

### `EUR 표시가 확정가다`는 가정을 폐기하는 조건

예약 확인서에 현지 TRY만 보장되고 EUR가 참고 환산이라고 적혀 있으면 EUR 표시를 버린다. 반대로 취소료, 추가 침대, 조식이 EUR로 명시되면 해당 항목은 EUR 노출로 분리한다.

### 무료 취소 예약을 즉시 확정 상태로 유지할 조건

다음 가운데 하나가 발생하면 환율 최적화보다 재고를 우선한다.

1. 4객실 동시 재고가 한 객실형에서 사라진다.
2. 커넥팅룸이나 같은 층 요청을 받을 수 있는 객실형이 제한된다.
3. 기존 예약의 무료 취소 마감이 다가온다.
4. 대체 상품의 세금, 조식, 아동 정책이 확인되지 않는다.

## 10. 결제 직전 체크리스트

1. 예약 확인서의 계약 통화를 읽었다.
2. 4객실 10박의 세금 포함 총액을 확인했다.
3. 아동 9세, 7세, 6세의 추가 요금을 반영했다.
4. 조식과 추가 침대가 별도 통화인지 확인했다.
5. 공식 Visa 또는 Mastercard 계산기에 결제 통화, KRW, 날짜, 카드 수수료를 넣었다.
6. DCC를 거절하고 계약 통화를 선택했다.
7. ATM은 TRY 인출과 전환 거절을 선택했다.
8. 영수증 통화가 예약 확인서와 같은지 확인했다.
9. 무료 취소 마감 시각을 캘린더에 기록했다.
10. 호텔 서비스에 VAT 환급을 잡지 않았다.

## 11. 한계

- ECB 기준환율은 거래가가 아니다. 카드 네트워크, 발급사, 매입 처리 시점의 환율과 수수료가 붙는다.
- 2026-09-01 관측에서는 ECB 2026-08-31 고시를 최신 완결 영업일 값으로 사용했다.
- 터키 CPI는 전국 소비자 바스켓이다. 이스탄불 럭셔리 호텔 4객실 가격을 직접 나타내지 않는다.
- TCMB의 2027년 물가 수치는 전망이다. 예약 결정을 정당화하는 확정 수치로 쓰지 않았다.
- Visa와 Mastercard의 실제 적용환율은 결제일에 다시 조회해야 한다.
- 한국 카드가 특정되지 않아 카드사 해외결제 수수료와 ATM 수수료는 계산하지 않았다.
- 호텔의 표시 통화와 보장 통화는 브랜드, 요금제, 예약 채널에 따라 다르다. 각 예약 확인서가 최종 근거다.
- VAT 환급 기준과 최소 금액은 2027년 3월 전에 바뀔 수 있다.

## 12. 관측 출처 목록

모든 URL은 2026-09-01에 접근 여부를 확인했다. 일반 HTTP 요청에서 13개는 상태 200을 반환했다. Visa 환율 계산기 1개와 Mastercard 링크 2개는 자동 요청에 상태 403을 반환했지만 검색 브라우저에서는 본문이나 PDF가 확인됐다. 이는 자료 부재가 아니라 카드사 측 자동 접근 제한으로 기록한다.

| 기관 | 자료 | 관측한 핵심 사실 | URL |
|---|---|---|---|
| ECB | 2026-08-31 기준환율 | USD 1.1596, TRY 55.9648, KRW 1,586.37 per EUR | https://www.ecb.europa.eu/stats/exchange/eurofxref/shared/pdf/2026/08/20260831.pdf |
| ECB | 2025-12-31 기준환율 | USD 1.1750, TRY 50.4838, KRW 1,696.94 per EUR | https://www.ecb.europa.eu/stats/exchange/eurofxref/shared/pdf/2025/12/20251231.pdf |
| ECB | 기준환율 방법 | 정보 제공용 기준환율, 통상 영업일 16:00 CET경 갱신 | https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html |
| CBRT | 일별 환율 자료실 | 터키 중앙은행의 날짜별 공식 환율 확인 경로 | https://www.tcmb.gov.tr/kurlar/kurlar_en.html |
| TurkStat | 2026년 7월 CPI | 연 31.75%, 월 1.78%, 2025년 12월 대비 19.86% | https://veriportali.tuik.gov.tr/en/press/58297 |
| TCMB | Inflation Report 2026-III | 2026년 말 28%, 2027년 말 15% 조건부 전망 | https://www.tcmb.gov.tr/wps/wcm/connect/EN/TCMB%2BEN/Main%2BMenu/Publications/Reports/Inflation%2BReport/2026/Inflation%2BReport%2B2026%2B-%2BIII/ |
| Visa | DCC 안내 | 현지 통화와 카드 통화, 환율, 마크업 공개와 선택권 요구 | https://www.visa.com/en-us/personal/travel/dynamic-currency-conversion |
| Visa | 환율 계산기 | 해외 카드 결제 환율의 공식 참고 도구 | https://africa.visa.com/support/consumer/travel-support/exchange-rate-calculator.html |
| Mastercard | 환율 계산기 | 발급사 수수료 가능성과 DCC 때 Mastercard 환율 미적용 | https://www.mastercard.com/sea/en/personal/get-support/currency-exchange-rate-converter.html |
| Mastercard | DCC Guide 2025 | DCC 환율과 마크업은 가맹점 또는 ATM 운영자와 매입사가 설정 | https://www.mastercard.com/content/dam/public/mastercardcom/na/global-site/documents/DCC-Guide-2025-Merchant-Version.pdf |
| 터키 상무부 | 여행자 FAQ | Tax-free는 국외로 반출하는 구매 물품에 적용 | https://ticaret.gov.tr/gumruk-muhafaza/sikca-sorulan-sorular |
| Accor | 터키 호텔 예약 고지 | 현지 통화 보장, 고객 통화 환산은 참고값 | https://all.accor.com/a/en/destination/country/hotels-turkey-ptr.html |
| Pera Palace | 공식 이용 조건 | 추가 침대와 아동 추가 침대가 EUR로 명시된 사례 | https://perapalace.com/en/terms-and-conditions-of-use/ |
