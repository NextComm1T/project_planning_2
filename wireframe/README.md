# Wireframe — 탄천 로컬 개인 랭킹전 (MVP)

`docs/01~05`를 화면 구조로 옮긴 Mobile Mid-Fidelity Wireframe. 기획 내용은 여기에 다시 옮겨 적지 않고, **어떤 화면이 어떤 기획 항목에서 나왔는지**만 기록한다.

- 진입점: `index.html` (Screen Gallery, 사용자 흐름 순 정렬)
- 기준 viewport: 390px
- Screen 7개 · State Variant 22개
- 디자인 토큰 출처: `design_System/Design System.dc.html` (montage-web WDS atomic/semantic)

## 사용법

`index.html`을 브라우저로 연다. 각 Screen 화면 상단의 어두운 바는 **검토용 Chrome**(앱 UI 아님)이며 여기서 State를 전환한다.

- State 전환: 상단 바의 State 버튼 또는 URL `?state=<id>`
- 검토용 Annotation: 상단 바 `주석` 토글 (화면 오른쪽 레일, 선택 상태는 localStorage에 저장)
- 갤러리 미리보기용 파라미터: `?embed=1` (Chrome·주석 숨김)

로컬 파일로 바로 열어도 동작한다. iframe 미리보기가 비어 보이면 간이 서버(`python -m http.server`)로 열면 된다.

## 파일 구조

```
wireframe/
  index.html              Screen Gallery
  screens/
    01-login.html         SC-01 로그인 · 회원가입
    02-nickname.html      SC-02 닉네임 설정
    03-run-start.html     SC-03 러닝 시작
    04-run-active.html    SC-04 러닝 진행
    05-result.html        SC-05 러닝 결과
    06-ranking.html       SC-06 랭킹
    07-record.html        SC-07 기록 탭
  styles/
    tokens.css            색·타이포·스페이싱·라운딩 토큰
    common.css            공용 컴포넌트 스타일
  scripts/
    common.js             공통 컴포넌트 주입 · State 전환 · 검토용 Chrome/Annotation
  check.js                정합성 검사 (`node check.js`)
  README.md
```

화면을 고친 뒤 `node check.js`를 돌리면 meta JSON 파싱, `data-when`/`data-not` 값과 state id 일치, 스크립트 로드 순서, 링크 대상 존재 여부를 확인한다.

각 화면 파일 하단의 `<script type="application/json" id="screen-meta">`에 Screen 목적·Traceability·State 정의가 들어 있고, `common.js`가 이를 읽어 Header·Bottom Navigation·Annotation을 만든다.

---

## Design Decisions

Design Interview에서 확정한 규칙. 전체 Screen에 동일하게 적용한다.

| 항목 | 결정 |
| --- | --- |
| **Design Token** | 기존 `design_System`(montage-web WDS) 토큰 그대로 사용. Pretendard, primary `#0066FF`, label `#171719`, bg `#F7F7F8`, radius 10(버튼)/16(카드) |
| **Navigation** | Bottom Navigation 3탭 — 러닝 · 랭킹 · 기록. 문서에 정의가 없는 홈·프로필 탭은 만들지 않음. 러닝 진행·결과·카운트다운은 몰입 화면이라 탭 숨김 |
| **Header** | 탭 화면(러닝 시작·랭킹·기록)에만 타이틀 Header. 온보딩(로그인·닉네임)과 몰입 화면은 Header 없음 |
| **Layout** | 혼합 — 결과·요약·내 순위는 Card, 랭킹·기록 목록은 Flat List(Divider) |
| **Primary CTA** | 러닝 시작만 중앙 대형 원형 버튼, 그 외 모든 화면은 하단 Full-width 고정 버튼(`.cta-bar`) |
| **Button** | Rounded Rectangle radius 10, 높이 52px, Filled Primary / Subtle Secondary / Outline. Disabled는 `#E1E2E4` 배경 + `#AEB0B6` 텍스트 |
| **정보 밀도 · 수치** | 러닝 진행·결과는 여백 넓게 + 대표 수치 대형(68px). 랭킹·기록은 Compact. 모든 수치 `tabular-nums` |
| **상태 메시지** | 종류별 위치 분리 — 입력 오류는 Input 하단 Inline, GPS 경고는 상단 Alert Banner, GPS·세션 차단은 CTA 근처 Inline. Modal·Bottom Sheet는 사용하지 않고, 3초 카운트다운만 Full-screen Overlay |
| **Empty State** | 아이콘 + 문구(+설명). 문서에 CTA가 정의되지 않은 Empty State에는 CTA를 넣지 않음 |
| **Fidelity** | Mid-Fidelity — 구조는 Wireframe, Typography·Spacing은 실제 서비스 수준. Annotation은 화면 밖 레일 + 토글 |

### Screen-specific

| Screen | 결정 |
| --- | --- |
| SC-04 러닝 진행 | 총 러닝 거리 대형 → 탄천 인정 거리 보조 강조 블록 → 시간·페이스 2열 |
| SC-05 러닝 결과 | 총 러닝 거리 대형 → 「랭킹 반영」 카드(탄천 인정 거리 + 순위) → 시간·페이스 보조, 일자는 상단 caption |
| SC-06 랭킹 | 상단 「내 순위」 카드 + 아래 전체 순위 Flat List (리스트 내 별도 행 강조 없음) |
| SC-07 기록 탭 | 상단 개인 최고 기록 3칸 카드 + 아래 날짜별 Flat List |

### 공통 Component

App Header · Bottom Navigation · Primary/Secondary/Outline/Social Button · CTA Bar · Metric Hero · Metric Grid · Zone Block(탄천 인정 거리) · Card · KV Row · Status Chip · Alert Banner · Inline Message · PR Badge · Input + Inline Error · Rank Row · Record Row · Empty State · Countdown Overlay · Annotation Rail(검토용)

---

## Traceability

`Screen → Workflow 단계 → Feature → Requirement → Policy → 구현된 State`

### SC-01 로그인 · 회원가입 — `screens/01-login.html`
- Workflow: S0 회원가입 · 초기 프로필 설정
- Feature: F8 소셜 로그인
- Requirement: R13 카카오·구글 소셜 로그인
- Policy: 해당 없음
- State: `default` / `error`(F8 예외 — 인증 실패·취소 시 안내, 가입 미진행)

### SC-02 닉네임 설정 — `screens/02-nickname.html`
- Workflow: S0
- Feature: F10 닉네임 입력
- Requirement: R15 닉네임 직접 설정(필수·중복 불가)
- Policy: P5(랭킹 노출 식별자가 이 닉네임)
- State: `empty`(미입력 → 진행 불가, 버튼 Disabled) / `filled` / `duplicate`(중복 시 저장 거부·재입력 안내)

### SC-03 러닝 시작 — `screens/03-run-start.html`
- Workflow: S1 러닝 시작
- Feature: F1 GPS 확인 후 3초 카운트다운·러닝 시작
- Requirement: R1 GPS 확인 완료 시에만 버튼 활성화 · R16 3초 카운트다운
- Policy: P1 GPS 확인 전 시작 불가 · P7 동시 세션 1개 제한
- State: `checking`(Disabled + 안내) / `ready`(활성) / `gps-error`(Disabled + 오류) / `session`(P7 차단) / `countdown`(3→2→1 후 SC-04 자동 전환)

### SC-04 러닝 진행 — `screens/04-run-active.html`
- Workflow: S2 러닝 진행 · S3 러닝 종료
- Feature: F2 실시간 표시 + 종료 버튼 상시 노출 · F3 GPS 끊김 경고 · F4 끊김→복구 재측정
- Requirement: R2 총 거리 · R3 시간 · R4 탄천 인정 거리 · R17 페이스 · R18 종료 버튼 · R5 2초 이상 끊김 경고 · R6 실시간 갱신 / 순위 비표시
- Policy: P2 끊긴 구간 거리 제외 · P3 2초 이상 끊김 경고 · P9 시속 25km 초과 구간 조용히 제외
- State: `default`(1초마다 Mock 갱신) / `weak`(경고 배너 + 값 고정) / `outside`(총 거리만 증가, 인정 거리 유지)
- 확인 포인트: 이 화면에는 순위를 표시하지 않는다(R6)

### SC-05 러닝 결과 — `screens/05-result.html`
- Workflow: S4 결과 확인 · Ranking Zone 판정
- Feature: F9 결과 6항목 (연결: F6 자동 저장 · F5 랭킹 반영)
- Requirement: R14 결과 6항목 · R8 개인 기록 저장 · R11 Zone 내부만 랭킹 반영 · R12 Zone 외부도 개인 기록 포함
- Policy: P4 종료 상태에서만 결과 조회 · P8 종료 시각 순서로 순위 갱신(내부 규칙, 화면 노출 없음)
- State: `default`(순위 표시) / `pr`(개인 최고 기록 갱신 안내) / `zero`(인정 거리 0 → "랭킹 미반영") / `norank`(랭킹 데이터 없음 → "아직 랭킹 데이터가 없습니다")
- 다음 이동: 인정 거리 있음 → 랭킹 보기(S5), 없음 → 기록 보기(S6). 02-workflow 흐름도 기준

### SC-06 랭킹 — `screens/06-ranking.html`
- Workflow: S5 랭킹 확인
- Feature: F5 랭킹 화면(전체 순위 리스트)
- Requirement: R7 누적 거리 기준 순위 · R11 Zone 내부 거리만 반영
- Policy: P5 누적 거리 기준 산정·닉네임과 누적 거리만 노출 · SP1 타 사용자 프로필 비공개 · SP2 크루 없음
- State: `default` / `empty`("아직 랭킹 데이터가 없습니다")
- 확인 포인트: Row를 눌러도 프로필로 이동하지 않는다(SP1). TOP100 캡 없이 전체 리스트

### SC-07 기록 탭 — `screens/07-record.html`
- Workflow: S6 개인 누적 기록 확인
- Feature: F7 기록 탭(목록 + 개인 최고 기록) · F6 러닝 종료 시 자동 저장
- Requirement: R8 일자별 저장·확인(총 거리·탄천 인정 거리·시간·평균 페이스) · R9 목록 조회 · R10 개인 최고 기록 · R12 Zone 외부도 포함
- Policy: P6 본인 기록만 조회, 누적 한도 없음
- State: `default` / `first`(첫 러닝이 곧 최고 기록) / `empty`("아직 기록이 없습니다")
- 확인 포인트: 09.08 행이 Zone 밖에서만 달린 세션(탄천 인정 0.00 km)

### Requirement 커버리지

| R | 반영 위치 |
| --- | --- |
| R1, R16 | SC-03 `checking`/`ready`/`gps-error`/`countdown` |
| R2, R3, R4, R17, R18 | SC-04 지표 4종 + 하단 종료 버튼 |
| R5 | SC-04 `weak` 경고 배너 |
| R6 | SC-04 Mock 실시간 갱신 · 순위 비표시 · `weak`에서 갱신 정지 후 복구 |
| R7 | SC-06 내 순위 카드 + 전체 리스트 |
| R8, R9, R10 | SC-07 최고 기록 카드 + 날짜별 목록 |
| R11 | SC-05 랭킹 반영 카드 / SC-06 집계 기준 표기 |
| R12 | SC-05 `zero`(인정 0이어도 저장) · SC-07 09.08 행 |
| R13 | SC-01 |
| R14 | SC-05 6항목 전부 |
| R15 | SC-02 |

---

## MVP 범위 확인 (06-backlog 제외 항목)

아래 항목은 후순위·제외로 확인되어 **Wireframe에 구현하지 않았다.**

목표 거리·시간 설정 및 달성 표시 · 주간/월간 랭킹 구분 · TOP100 캡 · 티어/레벨 · 다음 순위까지 남은 거리 · 러닝 경로 지도 · 지난주·지난달 비교 · 정렬·필터 · 자동 종료 · 일시정지/재개 · 음성 페이스 안내 · 닉네임 자동 랜덤 생성 · 종료 확인 메시지 · 친구/크루/피드/댓글/타 사용자 프로필 · 스마트워치·위젯 · 저장 실패 시 별도 안내

> 기존 `design_System/Run Start.dc.html`에 있던 **지도 미리보기 · 코스 선택 Segmented Control · 목표 달성률 Progress**도 위 사유(지도=후순위, 코스·목표=문서 미정의)로 Wireframe에서 제외했다.

---

## 확인 필요

### 1. 진행 중 세션 차단 이후의 복구 경로
- 관련 Screen: SC-03 (`?state=session`)
- 관련 문서: 05-policy.md P7
- 문제: "이미 진행 중인 러닝이 있습니다" 안내 이후 사용자가 무엇을 할 수 있는지(이어하기 / 강제 종료 / 대기)가 정의되어 있지 않다. 일시정지·자동 종료는 후순위라 대체 경로도 없다.
- 임시 처리: 안내 문구만 표시하고 시작 버튼을 Disabled로 유지했다.
- 결정이 필요한 이유: 복구 수단이 없으면 사용자가 러닝을 영영 시작하지 못하는 막다른 상태가 될 수 있다. 새 상태 전이가 필요한 정책 결정이라 임의로 만들지 않았다.

### 2. 결과 화면 이탈 경로
- 관련 Screen: SC-05
- 관련 문서: 02-workflow.md 흐름도(S4 → S5 / S6), 04-features.md F9
- 문제: F9는 "화면을 벗어나면 자동 저장"이라고만 하고 이동 목적지를 명시하지 않는다.
- 임시 처리: 흐름도에 따라 인정 거리가 있으면 「랭킹 보기」를, 없으면 「기록 보기」를 Primary로 두고 나머지를 Secondary로 배치했다. 별도의 닫기·확인 Step은 만들지 않았다.
- 결정이 필요한 이유: 결과 화면을 재진입할 수 없다면(P4) 어떤 화면으로 보내는지가 이후 이용 흐름을 좌우한다.

### 3. 로그인 이후 기본 진입 화면
- 관련 Screen: SC-03
- 관련 문서: 02-workflow.md S0→S1
- 문제: 재실행·재로그인 시 어떤 탭으로 진입하는지 문서에 없다.
- 임시 처리: 러닝 탭(SC-03)을 기본 진입으로 두었다.
- 결정이 필요한 이유: 기본 탭은 첫 화면 경험과 각 기능의 노출 빈도를 바꾼다.

> 위 3건 외에 spacing·정렬 등 동일 Design Rule 안의 미세 조정은 별도로 남기지 않았다.
