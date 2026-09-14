import Image from "next/image";

import { AppShell } from "@/components/shared/AppShell";
import { Header } from "@/components/shared/Header";
import nicknameOtter from "@assets/otter-nickname-v2.png";

import { NicknameForm } from "./NicknameForm";

/**
 * 프로필 설정 — 최초 닉네임(디자인 L168-198 · F10 ①).
 *
 * 정적인 부분만 서버에서 그리고, 입력 · 검증 · 버튼은 NicknameForm 이 맡는다.
 * 좌우 여백이 28px 이라 AppShell 기본 여백(20px)을 끄고 직접 준다.
 *
 * 디자인과 문서가 갈리는 지점은 modify/2026-09-14-signup-nickname.md 에 있다.
 */
export default function SignupNicknamePage() {
  return (
    <AppShell
      padded={false}
      header={<Header showBack backHref="/signup/consent" title="프로필 설정" />}
    >
      <div className="flex flex-1 flex-col px-7">
        {/* mt-auto 가 이미지 위 여백을, 버튼 블록의 mt-auto 가 아래 여백을 나눠 갖는다(디자인 L176-178). */}
        <div className="mt-auto flex h-[216px] shrink-0 items-center justify-center overflow-hidden">
          <Image
            src={nicknameOtter}
            alt="닉네임을 든 수달"
            priority
            className="block h-[216px] w-full object-contain"
          />
        </div>

        <h2 className="mb-2.5 text-display font-extrabold tracking-[-0.5px]">
          닉네임 설정
        </h2>
        <p className="mb-6 text-content leading-[1.6] font-medium text-muted">
          탄천런에서 사용할 닉네임을 정해주세요.
          <br />
          다른 사용자와 중복될 수 없습니다.
        </p>

        <NicknameForm />
      </div>
    </AppShell>
  );
}
