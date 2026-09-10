repo: SeungBinYang/montage-web
branch: main
path: packages/wds-theme, packages/wds

## Last sync
date: 2026-09-09T01:17:30Z

### Updated in this project
- 색상, 타이포그래피, 스페이싱 토큰을 packages/wds-theme의 atomic/semantic 값 그대로 반영
- Button, Card, Bottom Navigation 등 packages/wds 컴포넌트 스타일 규칙(라운딩, 패딩, 상태 색상)을 참고해 러닝 데이터 컴포넌트로 재구성
- Pretendard Variable 폰트 스택 적용

## Screen map
| 프로젝트 화면 | 참고한 저장소 파일 |
|---|---|
| Design System.dc.html - 색상/타이포/스페이싱 | packages/wds-theme/src/theme/{atomic,semantic,spacing,breakpoint,opacity}/*.ts |
| Design System.dc.html - Button | packages/wds/src/components/button/style.ts |
| Design System.dc.html - Card / Stat Card | packages/wds/src/components/card/style.ts, constants.ts |
| Design System.dc.html - Bottom Navigation | packages/wds/src/components/bottom-navigation/{style,index}.tsx |
| Design System.dc.html - 폰트 | packages/wds/scripts/reset.mjs |
