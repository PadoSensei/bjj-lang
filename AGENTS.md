# Agent Instructions — BJJ_Lang

## Start here
1. Read this file.
2. Read the relevant product, architecture, security, and testing docs before changing code.
3. Read applicable ADRs.
4. Inspect existing patterns and tests before proposing new abstractions.

## Product context
BJJ_Lang teaches Brazilian Portuguese and English through BJJ vocabulary, phrases, coaching commands, and culture. Initial directions are `pt-BR → en` and `en → pt-BR`. The product targets both young learners (8–18) and adult practitioners. Treat minors' privacy and safety as core requirements.

## Architecture rules
- Use TypeScript with strict settings.
- Keep domain/learning logic independent of React Native, Expo, Supabase, and UI libraries.
- Follow the feature-oriented structure documented in `docs/architecture/SYSTEM_ARCHITECTURE.md`.
- Screens compose UI and call application/use-case functions; do not put scheduler, entitlement, sync, or curriculum rules in screens.
- Content is structured data, not hardcoded into screens.
- Prefer existing dependencies and established patterns. Do not add a dependency without explaining why.
- Do not introduce a separate backend service unless an ADR approves it.
- Do not change architecture or schema design materially without an ADR or an explicit approved issue.

## Security and privacy
- Never put secrets, service-role keys, store credentials, or private keys in client code or commits.
- Never trust client-supplied purchase status, entitlement, XP, or user identity.
- Apply and test Supabase RLS for user-owned data.
- Validate external and function inputs.
- Avoid collecting sensitive or unnecessary data, especially from minors.
- Do not add social/public features for minors without an approved safety design.

## Data and migrations
- Database changes require reviewed, ordered migrations.
- Never edit an already-applied migration to change deployed behavior; add a new migration.
- Keep seed data deterministic and safe for local development.
- Preserve idempotency for review and sync events.
- Do not use destructive production operations without explicit human approval.

## Implementation workflow
- Work only on the issue's scope.
- Check acceptance criteria before coding.
- Keep PRs small and focused.
- Add or update tests for behavior changes.
- Update docs when behavior, setup, API, schema, or architecture changes.
- Do not claim checks passed unless you ran them and saw the result.
- If blocked or requirements conflict, explain the blocker rather than guessing.

## Definition of done
- Acceptance criteria satisfied.
- Relevant tests added/updated.
- Lint, typecheck, and tests pass (or exact blockers documented).
- No secrets or unrelated changes.
- Accessibility and loading/error/empty states considered.
- Documentation updated where needed.
