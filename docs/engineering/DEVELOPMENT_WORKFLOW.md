# Development Workflow

## Source of truth
GitHub issues, repository docs, code, and ADRs. Chat history is not authoritative.

## Branches
- `main` is releasable.
- `feat/<slug>`, `fix/<slug>`, `docs/<slug>`, `chore/<slug>`.
- PR required; no direct pushes to main.
- Keep PRs scoped and small.

## AI workflow
1. Claude drafts/refines feature plan and GitHub issue.
2. Issue defines scope, non-goals, acceptance criteria, tests, security and docs impact.
3. Jules reads `AGENTS.md` and referenced docs, implements only issue scope, adds tests, opens PR.
4. CI runs.
5. Claude reviews against requirements/architecture.
6. Developer reviews and merges.

## PR requirements
- Summary and issue link.
- Architecture/schema impact.
- Tests and evidence.
- Security/privacy considerations.
- Docs updated.
- No secrets.
- CI passes.

## Commit convention
`feat:`, `fix:`, `docs:`, `test:`, `chore:`, `refactor:`.

## Dependency policy
Prefer Expo-compatible and maintained dependencies. Check licenses, platform support, bundle impact, and maintenance before adding. Pin and lock dependencies.
