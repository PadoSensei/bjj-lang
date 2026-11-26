# ADR-009: Review Direction Semantics in an English-Learning Product

- **Status:** Accepted (November 2026)
- **Related:** ADR-004 (spaced repetition), ADR-006 (monetization, on hold), ADR-008 (content and encounters).

## Context

The app was built as two courses: `pt-BR->en` (Brazilians learning English) and `en->pt-BR` (English speakers learning Portuguese).
The two directions keep fully isolated progress, review records and history, enforced by tests
(`__tests__/context/CourseContext.isolation.test.tsx`, `CurriculumIntegrity.test.tsx` §7).

The pivot teaches **English to Brazilian Portuguese speakers**. Isolated directions must be preserved, but "which language am I learning" no longer distinguishes them.

## Decision

1. **The two directions become two flashcard decks for the same learner.**
   - `pt-BR->en`, shown as **"Português → English"**: see the Portuguese, recall the English (production).
   - `en->pt-BR`, shown as **"English → Português"**: see the English, recall the Portuguese meaning (recognition).
   This matches what `formatVocabForReview` in `src/features/review/reviewScheduler.ts` already prompts in each direction.
2. **Every reviewable encounter enqueues into both decks.** Each deck gets its own `ReviewRecord` with its own schedule.
3. **Isolation means independent schedules, not separate membership.** Reviewing a card in one deck never changes the other deck's record or history.
   The integrity test's assertion changes from "the other deck is empty" to "the other deck is untouched by reviews" when P1-3 lands.
4. **What a tap adds (open to change).** Only items with `reviewable: true` become flashcards. Taps on function words (*the*, *is*) are logged as lookups only, so the decks are not flooded.
5. **Interface language.** The White Belt interface is Portuguese. English UI strings may be introduced from Blue Belt.
6. **The selected deck is remembered** across reloads (`bjj_lang_preferences_v1`, issue #35).

## Alternatives considered

- **Enqueue only into the deck in use.** Keeps today's behaviour exactly, but a learner would have to meet each word twice to review it both ways.
- **Merge into one deck with mixed prompts.** Loses the isolation the product constraints require.

## Consequences

- Lesson completion will add each word to both decks (behaviour change in P1-3; tests updated in the same PR).
- The current `en->pt-BR` course (Portuguese for English speakers) is no longer the meaning of that direction. That course is parked with the paid tier (ADR-006); it can return later as a separate course, with its own IDs and storage keys, without touching these decks.
- The Home "direction selector" becomes a deck toggle in Flashcards (P1-4, P2-5).
