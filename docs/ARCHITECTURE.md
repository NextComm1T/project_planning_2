# Architecture

화면을 만들기 전에 이 문서를 읽는다. **git 흐름(브랜치·커밋·PR·리뷰·머지)은 여기 없다 — `CONTRIBUTING.md` 를 본다.**

- 누가 어느 화면을 맡는지: [SCREEN_ASSIGNMENTS.md](./SCREEN_ASSIGNMENTS.md)
- 실행·검증 명령: [PROJECT_COMMANDS.md](./PROJECT_COMMANDS.md)

## 기술 스택

Next.js 16 (App Router · Turbopack) · React 19 · TypeScript · Tailwind CSS v4.

라이브러리는 아직 이 넷뿐이다. **추가하려면 먼저 팀에 말한다** — `package.json` 은 전원이 공유하는 파일이다.

## 폴더 구조

```
src/
├─ app/                    화면 = route
│  ├─ layout.tsx           모든 화면 공통. 화면별 UI 를 넣지 않는다
│  ├─ globals.css          디자인 토큰. 건드리기 전에 팀에 말한다
│  ├─ page.tsx             /  → 첫 화면 분기 자리
│  └─ login/               /login
│     ├─ page.tsx
│     ├─ LoginHero.tsx         ← 이 화면에서만 쓰는 조각은 같은 폴더에
│     └─ SocialLoginButtons.tsx
└─ components/shared/      여러 화면이 쓰는 것만
   ├─ AppShell.tsx
   ├─ Header.tsx
   └─ BackButton.tsx
```

**규칙 하나로 줄이면**: 그 화면에서만 쓰면 화면 폴더 안에, 두 화면 이상이 쓰면 `components/shared/`.

한 화면에서만 쓰는 조각을 `shared/` 에 올리지 않는다. 지금은 정리돼 보여도 나중에 아무도 못 지운다.

## 공용 컴포넌트

### `AppShell`

모든 화면의 가장 바깥 틀. 모바일 컬럼 폭 · safe-area · 세로 스크롤을 담당한다.

```tsx
<AppShell
  header={<Header title="설정" showBack />}  // 슬롯. 없으면 헤더 없는 화면
  bottom={<BottomNav />}                      // 슬롯. 없으면 탭바 없는 화면
  padded={false}                              // 기본 true. 히어로·지도처럼 폭을 꽉 채울 때만 false
>
  {children}
</AppShell>
```

`<main>` 이 flex 컨테이너라서 `mt-auto` 로 블록을 화면 바닥에 붙일 수 있다.

### `Header`

```tsx
<Header
  title="기록 상세"        // 없으면 타이틀 없는 헤더
  showBack                 // 없으면 뒤로가기 없는 헤더
  backHref="/records"      // 지정하면 history 대신 이 경로로
  right={<GearButton />}   // 우측 액션 슬롯
/>
```

타이틀은 **왼쪽 정렬**이다(디자인 확인 완료, 가운데 아님). 화면 이름이나 조건을 `Header` 안에 하드코딩하지 않는다 — 전부 props 로 넘긴다.

### `BackButton`

`Header` 가 알아서 쓴다. 직접 쓸 일은 거의 없다. `router.back()` 을 쓰고, `href` 를 주면 그쪽으로 이동한다. 시각 크기는 40×40 이지만 터치 영역은 48×48 이다(`07-screens.md:15`).

## 디자인 토큰

**임의 hex 를 쓰지 않는다.** 값은 전부 `탄천런.dc.html` 에서 뽑아 `globals.css` 에 토큰으로 들어가 있다. 없는 값이 필요하면 먼저 팀에 말한다.

Tailwind 유틸로 바로 쓴다 — `bg-surface` · `text-muted` · `rounded-xl` · `shadow-card`.

### 색

| 쓸 곳 | 유틸 | 값 |
| --- | --- | --- |
| 페이지 배경 | `bg-background` | `#FBF7EF` |
| 앱 컬럼 바깥 | `bg-canvas` | `#E9F1FA` |
| 카드 · 탭바 | `bg-surface` | `#FFFFFF` |
| divider · 아이콘 버튼 면 | `bg-surface-muted` | `#F1EDE2` |
| 카드 테두리 | `border-border` | `#EFE7D8` |
| 기본 글자 | `text-foreground` | `#1E2E4F` |
| 긴 본문 | `text-subtle` | `#6A7488` |
| 라벨 · 캡션 | `text-muted` | `#8B93A5` |
| 비활성 | `text-disabled` | `#B6BDC9` |
| CTA · 강조 | `bg-primary` `text-primary` | `#2F6FE8` |
| 탄천 인정 · 성공 | `text-success` `bg-success-soft` | `#3F7F31` `#E8F5DE` |
| 러닝 중단 · 탈퇴 | `bg-danger` | `#EF6A5E` |
| 오류 | `text-error` `bg-error-soft` `border-error-border` | `#C4483C` … |
| GPS 약함 · 경고 | `text-warning` `bg-warning-soft` | `#9B7419` … |
| 랭킹 1·2·3위 | `text-rank-gold` `-silver` `-bronze` | — |
| 지도 | `bg-map-base` `bg-map-water` `bg-map-park` … | — |

전체 목록은 [globals.css](../src/app/globals.css) 에 있고, 값마다 디자인 원본 줄 번호가 주석으로 달려 있다.

### 글자 크기

`text-caption`(11) · `text-label`(12) · `text-note`(13) · `text-content`(15) · `text-button`(17) · `text-title`(20) · `text-metric`(26) · `text-display`(32) · `text-hero`(34)

14·16·18px 은 Tailwind 기본 `text-sm`·`text-base`·`text-lg` 와 같은 값이라 토큰을 만들지 않았다.

### 모서리 · 그림자

`rounded-xs`(12) · `rounded-sm`(14) · `rounded-md`(16) · `rounded-lg`(18) · `rounded-xl`(20) · `rounded-2xl`(22) · `rounded-3xl`(24) · `rounded-full`(pill)

`shadow-card` · `shadow-modal` · `shadow-primary` · `shadow-button` · `shadow-raised` · `shadow-toast` · `shadow-danger`

### 간격

Tailwind 기본 스케일이 디자인 수치와 그대로 맞는다. `p-1`=4px … `p-6`=24px. 별도 토큰 없다.

### 한 번만 쓰는 값

`text-[19px]` 처럼 임의값으로 쓴다. 스케일을 늘리지 않는다.

## Server / Client Component

**기본은 Server Component 다.** `"use client"` 는 필요한 조각에만 붙인다 — `onClick` · `useState` · `useRouter` · `usePathname` 이 있을 때.

로그인 화면이 예시다. `page.tsx` 와 `LoginHero.tsx` 는 서버, 버튼만 있는 `SocialLoginButtons.tsx` 만 클라이언트다. 화면 전체를 통째로 `"use client"` 로 만들지 않는다.

## 이미지

`assets/` 의 이미지는 **옮기거나 복사하지 않는다.** static import 로 쓰면 `next/image` 가 번들하고 최적화까지 해 준다.

```tsx
import Image from "next/image";
import heroOtter from "@assets/otter-hero-wide-v2.png";

<Image src={heroOtter} alt="탄천을 달리는 탄천런 수달" priority />
```

`@assets/*` 별칭은 `tsconfig.json` 에 있다. `public/` 으로 옮기지 않는다.

## 새 화면 만들기 — 5단계

[src/app/login/](../src/app/login/) 을 열어 놓고 그대로 따라 하면 된다.

1. **디자인을 연다** — [SCREEN_ASSIGNMENTS.md](./SCREEN_ASSIGNMENTS.md) 에서 내 화면의 `탄천런.dc.html` 줄 범위를 찾는다. 브라우저로 `탄천런.dc.html` 을 직접 열면 실제 화면도 볼 수 있다.
2. **폴더를 만든다** — `src/app/<route>/page.tsx`. 조각이 필요하면 같은 폴더에.
3. **AppShell 로 감싼다** — 헤더가 필요하면 `header={<Header ... />}`, 탭바가 필요하면 `bottom={<BottomNav />}`.
4. **토큰으로 그린다** — 임의 hex 금지. 디자인의 인라인 style 을 Tailwind 유틸로 옮긴다.
5. **4상태를 채운다** — 불러오는 중 · 빈 상태 · 오류 · 정상. `07-screens.md:12` 의 공통 완료 기준이고, 오류일 때는 "다시 시도" 같은 다음 행동이 보여야 한다.

그리고 `npm run lint` · `npm run build`.

## 기획 문서와 다르게 구현했다면

**기획 문서(`docs/01~07`)를 고치지 않는다.** 구현 기준은 캡처된 디자인이고, 문서는 나중에 한 번에 맞춘다.

대신 `modify/YYYY-MM-DD-<화면>.md` 를 만들어 세 줄로 적는다.

```markdown
## <무엇이 다른가>
- **문서**: (문서가 말하는 것 + 파일:줄)
- **디자인 · 구현**: (실제로 한 것 + 디자인 줄 번호)
- **고쳐야 할 곳**: (나중에 손댈 문서 위치)
```

파일명에 화면 이름을 넣는 이유는 같은 날 여러 명이 작업해도 충돌하지 않게 하기 위해서다.

예시: [modify/2026-09-14.md](../modify/2026-09-14.md)

## 아직 없는 것

- **인증** — 카카오·구글 OAuth 미연동. 로그인 버튼은 눌러도 아무 일도 일어나지 않는다. `layout.tsx` · `page.tsx` · middleware 를 건드리는 **공유 인프라**라 화면 브랜치에 섞으면 전원과 충돌한다. 별도 트랙으로 한 사람이 맡는다.
- **API · 데이터** — 서버가 없다. 화면은 mock 데이터로 만든다.
- **테스트 러너** — `npm test` 없음.
