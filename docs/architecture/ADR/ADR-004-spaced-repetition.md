# ADR-004: Spaced Repetition

- **Status:** Proposed, deferred until after the POC
- **Decision:** Integrate a maintained FSRS implementation behind a scheduler interface; separately track direction-specific recall.
- **Context:** Need effective review intervals and reproducible state.
- **Alternatives:** SM-2, custom scheduler.
- **Rationale:** Avoid inventing scheduling science; allow implementation swap.
- **Consequences:** Verify package compatibility, state serialization, licensing, and test vectors before choosing a package. Persist scheduler version.

## Current state (November 2026)
The app uses a lightweight heuristic behind pure functions in `src/features/review/reviewScheduler.ts` (+24h when remembered, +4h when it needs practice). FSRS stays the target and will replace `calculateNextDueAt` behind the same functions after the POC. Direction-specific recall is already tracked: each deck has its own record per item (ADR-009).
