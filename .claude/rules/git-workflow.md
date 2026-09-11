# Git Workflow

## Branch

`main`은 항상 배포 가능한 branch다.

작업 branch:

```text
feat/<issue>-<slug>
fix/<issue>-<slug>
hotfix/<issue>-<slug>
refactor/<issue>-<slug>
test/<issue>-<slug>
docs/<issue>-<slug>
chore/<issue>-<slug>
```

- slug는 짧은 kebab-case 영문을 사용한다.
- 하나의 branch는 하나의 Issue를 기본으로 한다.
- 새 branch는 최신 `main`에서 만든다.
- 팀원의 branch를 임의로 force-push하지 않는다.
- 이슈 번호를 붙이는 규칙은 2026-09-11부터 적용한다. 그 전에 만든 branch(`docs/06-data-wbc`, `design-ysb` 등)는 예외로 두고 이름을 바꾸지 않는다.

## Commit

Conventional Commits:

```text
feat:
fix:
refactor:
perf:
test:
docs:
style:
build:
ci:
chore:
```

제목은 "무엇을 했는가"가 드러나도록 작성한다.

## PR

- base branch: `main`
- PR 제목: Conventional Commits
- body: `.github/PULL_REQUEST_TEMPLATE.md` 준수
- Issue 연결: `Closes #<number>`
- 변경이 크면 PR을 나눈다.
- merge는 기본적으로 Squash merge

## 절대 하지 않을 것

- `main` 직접 개발/직접 push
- force push to `main`
- unrelated changes 포함
- merge conflict를 추측으로 해결
- 사용자의 명시적 요청 없는 merge/deploy
