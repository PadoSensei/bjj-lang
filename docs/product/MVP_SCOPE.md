# POC Scope

**Status:** Current (November 2026, English-learning pivot)
**Milestones:** GitHub P0 → P3, worked in order. See `docs/roadmap/PROPOSED_MILESTONES.md`.

## Required — White Belt vertical slice (milestones P0–P2; Pre-A1 to A1, free intro tier)
- Safe learner state: hydration-aware review, serialized writes, persisted selected deck.
- Canonical content registry with stable IDs, belt and CEFR level, validated in CI.
- `recordEncounter` feeding both flashcard decks from any mode.
- One White Belt theme ("My first class") in all four modes:
  - Reader: one 5-page story, tap-to-understand with Portuguese explanations.
  - Games: vocabulary multiple choice, sentence builder, comprehension.
  - Adventure: one scenario, 3 decisions, 2 endings.
  - Flashcards: both decks, deck toggle, Portuguese help text.
- Home hub for White Belt with the four modes and progress.
- Portuguese interface.
- All progress persists across reloads.
- Existing lessons stay available.

## Next — Blue Belt demonstration (milestone P3; about A2)
- One story, one dialogue-completion set, one scenario with choice-dependent endings.
- Blue items join the same flashcard decks without disturbing White Belt progress.

## Deferred (after the POC)
- Accounts, authentication, age-appropriate consent flow (ADR-002).
- FSRS scheduling (ADR-004); the heuristic scheduler stays for now.
- SQLite, offline sync, multi-device (ADR-005).
- Audio and pronunciation.
- XP, streaks, achievements, belt promotion rules.
- Paid tiers, purchases, entitlements, donations (ADR-006, on hold).
- The Portuguese course for English speakers.
- Error monitoring, analytics with privacy review, store release.

## Out of scope
- Purple, Brown and Black Belt content.
- Public social feed, chat or leaderboards, especially for minors.
- AI-generated curriculum without editorial review.
- AI conversation tutor.
- Academy management and teacher dashboards.
- Multiple martial arts.

## Release constraint
The POC is shipped as a web preview (Vercel) and development builds. Do not represent a preview as a store release.
