import Image from "next/image";

import heroOtter from "@assets/otter-hero-wide-v2.png";

/** 이미지 아래쪽 54px 을 배경으로 자연스럽게 녹인다(디자인 L36). */
const HERO_FADE =
  "linear-gradient(to bottom, #000 calc(100% - 54px), rgba(0, 0, 0, 0))";

/** 일러스트의 잔디 · 산책로를 화면 아래로 이어 붙이는 장식 레이어(디자인 L38). */
const GROUND_FADE =
  "linear-gradient(to bottom, #000 0%, #000 34%, rgba(0, 0, 0, 0.52) 66%, rgba(0, 0, 0, 0.18) 88%, rgba(0, 0, 0, 0) 100%)";

export function LoginHero() {
  return (
    <>
      <div className="relative h-[438px] shrink-0 bg-background">
        {/* 이미지 위쪽 하늘과 이어지는 띠 */}
        <div className="absolute inset-x-0 top-0 h-9 bg-sky" />

        <Image
          src={heroOtter}
          alt="탄천을 달리는 탄천런 수달"
          priority
          className="absolute inset-x-0 top-[34px] h-[404px] w-full bg-sky object-cover"
          style={{
            objectPosition: "center 46%",
            maskImage: HERO_FADE,
            WebkitMaskImage: HERO_FADE,
          }}
        />
      </div>

      {/*
        높이 0 짜리 레이어라 아래 콘텐츠를 밀지 않는다.
        일러스트가 끝나는 지점부터 잔디와 산책로만 흐릿하게 이어진다.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative z-0 h-0"
      >
        <div
          className="absolute inset-x-0 top-0 h-[406px] overflow-hidden blur-[1.6px]"
          style={{ maskImage: GROUND_FADE, WebkitMaskImage: GROUND_FADE }}
        >
          <svg
            viewBox="0 0 390 406"
            preserveAspectRatio="none"
            className="block h-[406px] w-full"
          >
            <defs>
              <linearGradient id="loginGrass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#679E74" stopOpacity="0.08" />
                <stop offset="0.24" stopColor="#679E74" stopOpacity="0.12" />
                <stop offset="0.46" stopColor="#679E74" stopOpacity="0.48" />
                <stop offset="1" stopColor="#679E74" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="loginPath" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#FBEEDA" stopOpacity="0.35" />
                <stop offset="0.24" stopColor="#FBEEDA" stopOpacity="0.45" />
                <stop offset="0.46" stopColor="#FBEEDA" stopOpacity="0.95" />
                <stop offset="1" stopColor="#FBEEDA" stopOpacity="0.88" />
              </linearGradient>
            </defs>

            <path
              d="M0 0 L0 406 L100 406 C116 336 184 296 190 208 C196 126 150 70 127 0 Z"
              fill="url(#loginGrass)"
            />
            <path
              d="M127 0 C150 70 196 126 190 208 C184 296 116 336 100 406 L390 406 L390 0 Z"
              fill="url(#loginPath)"
            />

            <g fill="#5F9771">
              <ellipse cx="24" cy="272" rx="26" ry="18" opacity="0.2" />
              <ellipse cx="8" cy="348" rx="24" ry="17" opacity="0.14" />
            </g>
            <g fill="#F4D97A">
              <circle cx="38" cy="312" r="3.2" opacity="0.26" />
            </g>
          </svg>
        </div>
      </div>
    </>
  );
}
