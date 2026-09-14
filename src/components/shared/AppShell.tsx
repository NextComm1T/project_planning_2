import type { ReactNode } from "react";

type AppShellProps = {
  /**
   * 화면 상단 슬롯. 보통 <Header /> 를 넣지만, 홈처럼 로고 · GPS 상태 · 설정
   * 아이콘을 쓰는 변종 헤더도 같은 껍데기를 그대로 쓸 수 있게 슬롯으로 둔다.
   */
  header?: ReactNode;
  /** 화면 하단 고정 슬롯. 탭바 자리 — 탭 구성이 확정되면 채운다. */
  bottom?: ReactNode;
  /**
   * 콘텐츠 좌우 여백. 기본은 켜진 상태다.
   * 히어로 이미지나 지도처럼 화면 폭을 꽉 채워야 하는 화면은 false 로 끄고
   * 필요한 블록에만 직접 여백을 준다.
   */
  padded?: boolean;
  children: ReactNode;
};

/**
 * 모든 모바일 화면의 가장 바깥 공통 틀.
 *
 * 화면 콘텐츠는 이 안에 직접 넣지 않는다. 각 화면이 이 컴포넌트를 감싸 쓴다.
 * 세로 스크롤은 페이지 기본 스크롤을 쓴다 — 내부 스크롤 컨테이너를 만들면
 * 모바일 브라우저의 주소창 숨김 동작이 어긋난다.
 */
export function AppShell({
  header,
  bottom,
  padded = true,
  children,
}: AppShellProps) {
  return (
    <div className="flex justify-center bg-canvas">
      <div className="flex min-h-dvh w-full max-w-(--app-max-width) flex-col bg-background">
        {header}

        {/* flex 컨테이너라야 화면이 mt-auto 로 블록을 바닥에 붙일 수 있다. */}
        <main
          className={
            padded ? "flex flex-1 flex-col px-(--page-padding-x)" : "flex flex-1 flex-col"
          }
        >
          {children}
        </main>

        {/*
          bottom 이 없어도 이 래퍼는 남는다 — 홈 인디케이터 영역을
          비워 두는 여백 역할을 겸한다.
        */}
        <div className="sticky bottom-0 pb-[env(safe-area-inset-bottom)]">
          {bottom}
        </div>
      </div>
    </div>
  );
}
