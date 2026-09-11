# Repository Setup Checklist

이 starter를 repo root에 복사한 뒤 아래를 한 번 설정한다.

## 1. 프로젝트 정보 채우기

- [ ] `docs/PROJECT_COMMANDS.md`
- [ ] `docs/ARCHITECTURE.md`
- [ ] `.github/CODEOWNERS`

## 2. GitHub Labels

권장 label:

- `feature`
- `bug`
- `chore`
- `refactor`
- `test`
- `docs`
- `priority:high`
- `blocked`
- `ready-for-review`

Issue template의 label 이름과 실제 repository label 이름을 맞춘다.

## 3. GitHub main Ruleset / Branch Protection

`main`에 다음을 권장:

- [ ] Require a pull request before merging
- [ ] Required approvals: 1
- [ ] Dismiss stale approvals when new changes are pushed (선택)
- [ ] Require conversation resolution
- [ ] Require status checks before merging (CI가 준비된 뒤)
- [ ] Block force pushes
- [ ] Block deletion
- [ ] 가능하면 direct push 제한
- [ ] Admin bypass는 최소화

작은 부트캠프 팀에서는 approvals 1명이 현실적이다.

## 4. Merge Settings

권장:

- [ ] Allow squash merging: ON
- [ ] Merge commits: OFF 또는 팀 정책에 맞게 제한
- [ ] Rebase merging: 팀이 익숙하지 않으면 OFF
- [ ] Automatically delete head branches: ON

## 5. Claude Code 확인

각 팀원이 repo root에서 Claude Code를 실행한 뒤 확인:

```text
/memory
/skills
/agents
/permissions
/doctor
```

다음이 보여야 한다.

- root `CLAUDE.md`
- `.claude/rules/*`
- project skills
- project agents
- project permissions

## 6. 팀 합의가 필요한 5개

배포 시작 전에 이것만은 확정한다.

1. `main` 직접 push 금지 여부
2. 최소 reviewer 수
3. PR merge 담당자
4. 배포 담당자
5. 장애 발생 시 rollback/긴급 수정 담당자
