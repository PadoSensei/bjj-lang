# Agent Instructions — BJJ_Lang

## Start here
1. Read this file.
2. Read the relevant product, architecture, security, and testing docs before changing code.
3. Read applicable ADRs.
4. Inspect existing patterns and tests before proposing new abstractions.

## Product context
BJJ_Lang is a scaffolded **English-learning world for Brazilian Portuguese speakers**, built around Brazilian Jiu-Jitsu. The product targets both young learners (8–18) and adult practitioners. Treat minors' privacy and safety as core requirements.

Four connected learning modes share the same content:
1. **Reader** (Understand): level-appropriate BJJ stories, contextual vocabulary, tap-to-understand explanations.
2. **Games** (Practise): vocabulary, sentence construction, dialogue completion, comprehension.
3. **Adventure** (Apply): choose-your-own-adventure BJJ situations decided by language choices.
4. **Flashcards** (Remember): review of vocabulary met in any other mode.

Current scope (POC, free intro tier):
- **White Belt** = Pre-A1 to A1 English: the vertical slice being built now.
- **Blue Belt** = about A2 English: a small demonstration after White Belt.
- Purple, Brown and Black Belt are out of scope. Belts are language milestones, never martial-arts rank.
- The interface is Portuguese for White Belt.
- The two review directions are two isolated flashcard decks for the same learner: `pt-BR->en` "Português → English" (produce) and `en->pt-BR` "English → Português" (recognise). See ADR-009.
- Paid tiers and the Portuguese course for English speakers are parked (ADR-006). Do not build or imply them.

## Architecture rules
- Use TypeScript with strict settings.
- Keep domain/learning logic independent of React Native, Expo, Supabase, and UI libraries.
- Follow the feature-oriented structure documented in `docs/architecture/SYSTEM_ARCHITECTURE.md`.
- Screens compose UI and call application/use-case functions; do not put scheduler, entitlement, sync, or curriculum rules in screens.
- Content is structured data, not hardcoded into screens. All modes reference the same canonical items by stable ID; never change or reuse an existing ID (ADR-008).
- Modes never write learner state or storage directly. Report vocabulary with `recordEncounter` and write through the serialized write queue (`src/services/learner/writeQueue.ts`).
- Persisted storage shapes change additively only (new optional fields). Anything else needs a new key and a migration.
- Domain code in `src/domain/` must not import React, React Native, Expo or `src/components`.
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
