# 2026-09-15 — 공용 하단 탭바(BottomNav) · 구현 ↔ 기획 문서 차이

> 이 파일은 기록일 뿐, 문서를 고치지 않았다. 폴더 규칙은 `modify/2026-09-14.md` 머리말을 따른다.

이번 작업: 이슈 #34 공용 하단 탭바.

---

## 1. 달리기 탭 route — `/` → `/home`

- **문서**: `docs/SCREEN_ASSIGNMENTS.md:37` 이 홈 달리기 탭의 route 를 `/` 로 적는다.
  `docs/CLAUDE_PROMPTS.md:54-61` 묶음표도 같은 snapshot 이다.
- **디자인 · 구현**: `/home`. 탭바는 `/home` 으로 링크한다(`src/components/shared/BottomNav.tsx`).
  `src/app/page.tsx:16` 이 `/` 를 `/login` 으로 redirect 하므로 `/` 는 탭 대상이 될 수 없다.
  디자인이 정한 사실이 아니라 **인증 placeholder 와 root integration 충돌을 피하기 위한 구조 결정**이고,
  이슈 #34 결정 이력(2026-09-14)에 팀 승인으로 남아 있다. 실제 인증이 붙으면 `/` 가 인증 상태에 따른
  redirect 분기점이 된다.
- **고쳐야 할 곳**:
  - `docs/SCREEN_ASSIGNMENTS.md:37` — route 칸 `/` → `/home`
  - `docs/CLAUDE_PROMPTS.md:54-61` — 묶음별 이슈 번호표(D 묶음 번호도 실제 #55~#62 와 어긋난 stale 이다)

## 2. 탭 이동 트리거를 `<button>` 이 아니라 링크로 구현

- **문서 · 디자인**: `탄천런.dc.html` L922·L926·L930 은 `<button onClick="{{ onTabRun }}">` 이다.
- **구현**: `next/link` 의 `<a href>`. 디자인 원본의 `onClick` 은 단일 HTML 안에서 도는 데모
  상태머신용이고, 실제 앱에서는 route 이동이라 링크가 맞다. 시각 결과는 동일하다(색 · 굵기 · 레이아웃 전부 유지).
- **고쳐야 할 곳**: 없음. 디자인 마크업의 구현 수단 차이일 뿐 화면 사양이 달라지지 않는다.

## 3. 탭 3개 ↔ 문서 4개

`modify/2026-09-14.md` 1번에 이미 기록돼 있다. 중복해서 적지 않는다.
