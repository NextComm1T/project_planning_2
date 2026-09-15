# Contributing Guide

이 저장소는 **Issue → Branch → Commit → PR(→ `develop`) → Review → Squash Merge → 통합 검증 → `develop` → `main` 승격** 흐름을 기본으로 한다.

## 0. 브랜치 구조와 적용 시점

| branch | 역할 |
|---|---|
| `main` | 항상 배포 가능한 안정 branch. 이슈 PR을 직접 받지 않고 `develop` → `main` 승격 PR과 hotfix만 받는다 |
| `develop` | 여러 이슈를 합쳐 route · state · UI 통합을 검증하는 integration branch. 이슈 branch의 기준점이자 기본 PR target. 직접 개발하지 않는다 |
| `feat/<issue>-<slug>` 등 | 이슈 하나의 구현. `develop`에서 만들고 `develop`으로 PR한다 |

**적용 시점** — 이 workflow 변경(#65)이 `main`에 반영된 이후 새로 시작하는 Issue 작업부터 develop 기반 workflow를 적용한다. 변경 이전에 생성되어 이미 진행 중인 branch/PR에는 새 규칙을 소급 적용하지 않는다. 그런 PR을 `develop`으로 옮길지는 PR마다 diff 변화를 확인해 판단하고, 일괄 retarget하지 않는다.

## 1. 작업 시작

```bash
git fetch origin
git switch develop
git pull --ff-only origin develop
git switch -c feat/123-short-description
```

Issue 번호 `123`은 실제 GitHub Issue 번호로 바꾼다. `hotfix/*`만 `main`에서 만든다(§10).

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

`main` · `develop` 직접 push는 하지 않는다.

## 4. Pull Request

- PR 하나는 한 가지 목적만 가진다. 하나의 Issue를 기본으로 한다.
- base는 `develop`이다(hotfix · 승격 PR만 `main`). GitHub의 새 PR 기본 base는 default branch인 `main`이므로, PR을 만들 때 base가 `main`으로 잡히지 않았는지 확인한다.
- 관련 Issue는 `Refs #123`으로 적는다. `develop` 대상 PR에서는 `Closes` 같은 closing keyword가 이슈를 자동으로 닫지 않는다(GitHub은 default branch 대상 PR에서만 처리한다). `Refs #123`은 일반 reference라 이슈에 cross-reference가 남는다.
- 이슈는 `develop` → `main` 승격 PR에서 포함 이슈를 `Closes #123`으로 나열해 닫는다(§9).
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

| PR | merge 방식 |
|---|---|
| 이슈 PR → `develop` | **Squash merge** |
| hotfix → `main` | **Squash merge** |
| `develop` → `main` 승격 | **Create a merge commit** |
| `main` → `develop` 동기화 | **Create a merge commit** |

승격 · 동기화를 squash하면 한쪽에만 있는 새 commit이 생겨 두 branch 이력이 갈라진다. 다음 승격에서 같은 변경이 다시 diff에 뜨거나 충돌하므로 squash하지 않는다.

Squash commit 제목은 PR 제목과 동일한 Conventional Commit 형식을 사용한다.

Merge 후:

```bash
git switch develop
git pull --ff-only origin develop
git branch -d feat/123-run-session
```

`develop`은 승격 PR의 head로 반복해서 쓰이는 장기 branch라, GitHub의 `Automatically delete head branches` 옵션은 켜지 않는다.

## 7. Conflict

충돌은 해당 branch 작성자가 최신 `develop`을 반영해 해결하는 것을 기본으로 한다(hotfix branch는 `main`).

```bash
git fetch origin
git switch feat/123-run-session
git merge origin/develop
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
- `develop`에서 직접 기능 개발 · `develop` 직접 push
- 이슈 PR을 `main`에 직접 올리기(hotfix 제외)
- `develop` → `main` 승격 · `main` → `develop` 동기화를 squash로 merge
- `git push --force` · `git push --force-with-lease`

## 9. `develop` → `main` 승격

`develop` → `main`은 별도 PR로 하고 **Create a merge commit**으로 merge한다. GitHub의 `MERGEABLE` · `CLEAN` 표시만으로 승격하지 않는다.

승격 전 최소 확인:

- [ ] 포함된 PR · Issue 목록 — PR body에 포함 이슈를 `Closes #N`으로 나열한다
- [ ] route dependency — 링크 대상 화면이 모두 있는지, 남은 임시 404와 실제 regression 구분
- [ ] shared state · 공용 컴포넌트 — 여러 화면이 같은 것을 서로 다르게 쓰지 않는지
- [ ] 같은 정책이 화면마다 다르게 구현되지 않았는지
- [ ] 최종 end-to-end flow
- [ ] `npm run lint` · `npm run build`
- [ ] 필요한 browser interaction · 모바일 가로 스크롤 · 주요 접근성
- [ ] 확인하지 못한 항목은 `미검증`으로 명시

## 10. hotfix와 `main` → `develop` 동기화

`main`에 급히 고칠 것이 생기면 `main`에서 `hotfix/<issue>-<slug>`를 만들어 `main`으로 PR한다.

hotfix가 `main`에 들어가면 `develop`에서 빠지지 않도록 **`main` → `develop` PR을 열어 Create a merge commit으로 merge**한다. `develop`에 직접 push하지 않는다. 직접 PR이 부적절한 특별한 사유가 있을 때만 `develop`에서 `chore/<issue>-sync-main`을 만들어 `git merge origin/main` 후 `develop`으로 PR한다.

공유 branch는 rebase 대신 merge한다. 충돌이 나면 임의로 해결하지 않는다. 충돌 파일 · 양쪽 변경의 의미 · 추천 해결 방향 · 관련 PR/Issue 영향을 먼저 공유한 뒤 해결한다.
