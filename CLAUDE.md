# Project Instructions

> 이 저장소의 모든 Claude Code 세션이 공통으로 따라야 하는 최상위 규칙이다.
> 세부 규칙은 `.claude/rules/`, 반복 절차는 `.claude/skills/`, 독립 검토 역할은 `.claude/agents/`에 둔다.

## 1. Source of Truth

작업 전 반드시 다음 순서로 확인한다.

1. 현재 Git branch와 working tree 상태
2. 작업 대상 GitHub Issue / 요구사항
3. 관련 기존 코드와 테스트
4. `docs/PROJECT_COMMANDS.md`
5. `docs/ARCHITECTURE.md`
6. `.claude/rules/`의 관련 규칙

요구사항과 코드가 충돌하면 임의로 추측하지 말고 차이를 명시한다.

## 2. Work Scope

- 하나의 Issue는 원칙적으로 하나의 branch와 하나의 PR로 처리한다.
- 요청받지 않은 리팩터링, 파일 이동, 네이밍 변경, formatting sweep을 하지 않는다.
- 기능 구현에 필요한 최소 변경을 우선한다.
- 기존 동작을 변경하면 테스트 또는 검증 근거를 함께 남긴다.
- 공용 API, DB schema, 인증, 배포 설정, dependency를 변경할 때는 영향 범위를 먼저 설명한다.

## 3. Git

- `main`에서 직접 개발하지 않는다.
- 작업 시작 전 `main`을 최신화한 뒤 새 branch를 만든다.
- branch naming은 `.claude/rules/git-workflow.md`를 따른다.
- commit은 Conventional Commits 형식을 따른다.
- `git push`, PR merge, production deploy는 사용자의 명시적 요청 없이 실행하지 않는다.
- force push, `reset --hard`, destructive clean은 기본적으로 금지한다.
- 다른 팀원의 branch를 임의로 rebase/force-push하지 않는다.

## 4. Implementation

코드를 수정하기 전:
1. 관련 파일을 탐색한다.
2. 기존 패턴을 파악한다.
3. 변경 계획을 짧게 세운다.
4. 최소 범위로 구현한다.
5. lint/test/build 중 프로젝트에서 가능한 검증을 수행한다.

새 추상화는 실제 중복 또는 명확한 책임 분리가 있을 때만 만든다.

## 5. Quality

- TypeScript에서 불필요한 `any`를 추가하지 않는다.
- error를 조용히 삼키지 않는다.
- 사용자 입력과 외부 응답은 신뢰하지 않는다.
- loading / empty / error / success 상태를 필요한 곳에서 구분한다.
- UI 변경 시 기존 responsive behavior와 accessibility를 훼손하지 않는다.
- dead code, debug log, 임시 mock, 주석 처리된 코드를 PR에 남기지 않는다.

## 6. Security

- `.env`, credential, token, private key, secret 값을 읽거나 출력하거나 commit하지 않는다.
- 실제 secret을 예제 파일에 넣지 않는다.
- 클라이언트에 노출되면 안 되는 값을 frontend bundle에 넣지 않는다.
- 인증/인가 체크를 UI 노출 여부만으로 대체하지 않는다.

## 7. Definition of Done

완료라고 판단하기 전에:
- Issue acceptance criteria 충족
- 관련 lint/test/build 확인
- 불필요한 변경 제거
- secret/debug artifact 없음
- 변경 사항과 검증 방법 요약
- 알려진 위험 또는 미검증 사항 명시

## 8. PR

PR을 준비할 때 `.claude/skills/prepare-pr/SKILL.md` 절차를 따른다.
PR 제목도 Conventional Commits 형식을 사용한다.

예:
- `feat: 위치 기반 러닝 세션 시작 기능`
- `fix: GPS 권한 거부 시 무한 로딩 수정`
- `refactor: 랭킹 조회 로직 서비스 계층 분리`

@docs/PROJECT_COMMANDS.md
@docs/ARCHITECTURE.md
