# Contributing Guide

이 저장소는 **Issue → Branch → Commit → PR → Review/CI → Squash Merge** 흐름을 기본으로 한다.

## 1. 작업 시작

```bash
git switch main
git pull --ff-only origin main
git switch -c feat/123-short-description
```

Issue 번호 `123`은 실제 GitHub Issue 번호로 바꾼다.

### Branch prefix

| 유형 | 형식 | 예시 |
|---|---|---|
| 기능 | `feat/<issue>-<slug>` | `feat/123-run-session` |
| 버그 | `fix/<issue>-<slug>` | `fix/141-gps-error` |
| 긴급 수정 | `hotfix/<issue>-<slug>` | `hotfix/155-login-crash` |
| 리팩터링 | `refactor/<issue>-<slug>` | `refactor/166-ranking-service` |
| 테스트 | `test/<issue>-<slug>` | `test/170-session-api` |
| 문서 | `docs/<issue>-<slug>` | `docs/180-api-guide` |
| 설정/잡무 | `chore/<issue>-<slug>` | `chore/190-eslint` |

## 2. Commit

Conventional Commits를 사용한다.

```text
feat: 러닝 세션 시작 API 연동
fix: GPS 권한 거부 시 오류 상태 처리
refactor: 랭킹 계산 로직 분리
test: 세션 종료 API 테스트 추가
docs: 개발 환경 실행 방법 추가
chore: eslint 설정 정리
```

한 commit에는 가능한 한 하나의 논리적 변경만 담는다.

## 3. Push

```bash
git push -u origin feat/123-run-session
```

`main` 직접 push는 하지 않는다.

## 4. Pull Request

- PR 하나는 한 가지 목적만 가진다.
- 반드시 관련 Issue를 연결한다: `Closes #123`
- UI 변경은 가능하면 before/after 또는 screenshot을 첨부한다.
- 검증하지 못한 항목은 숨기지 말고 명시한다.
- PR 작성자가 스스로 checklist를 먼저 확인한 뒤 review를 요청한다.

### PR 크기

권장:
- 작은 기능/버그 단위
- 가능하면 리뷰 가능한 하루 이내 작업량
- 생성 파일/lockfile을 제외하고 지나치게 큰 diff는 분리

## 5. Review

Reviewer는 최소한 다음을 확인한다.

1. 요구사항 충족 여부
2. scope 밖 변경 여부
3. 에러/엣지 케이스
4. 타입 및 데이터 흐름
5. 테스트/검증 가능 여부
6. 보안 또는 secret 노출
7. 기존 기능 regression 가능성

작성자는 review comment에 반영 여부 또는 이유를 남긴다.

## 6. Merge

기본 전략은 **Squash merge**다.

Squash commit 제목은 PR 제목과 동일한 Conventional Commit 형식을 사용한다.

Merge 후:

```bash
git switch main
git pull --ff-only origin main
git branch -d feat/123-run-session
```

GitHub의 `Automatically delete head branches` 옵션 사용을 권장한다.

## 7. Conflict

충돌은 해당 branch 작성자가 최신 `main`을 반영해 해결하는 것을 기본으로 한다.

```bash
git fetch origin
git switch feat/123-run-session
git merge origin/main
# conflict 해결
git add .
git commit
git push
```

팀이 rebase에 익숙하지 않다면 공유 branch에서 무리하게 rebase/force-push하지 않는다.

## 8. 금지

- `main`에서 직접 기능 개발
- 리뷰 없이 자기 PR을 즉시 merge
- 이유 없는 대규모 formatting
- unrelated refactor를 기능 PR에 끼워 넣기
- `.env`, token, password, secret commit
- 팀원 branch force push
- 검증하지 않았는데 PR에 "테스트 완료"라고 작성
