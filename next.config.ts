import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // next dev 가 실행될 때마다 루트 CLAUDE.md 끝에 Next.js 에이전트 규칙 블록을
  // 덧붙이는 동작을 끈다. CLAUDE.md 는 팀이 관리하는 파일이다.
  agentRules: false,
};

export default nextConfig;
