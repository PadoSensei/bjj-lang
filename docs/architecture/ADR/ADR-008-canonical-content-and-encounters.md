# ADR-008: Canonical Learning Content and Cross-Mode Encounters

- **Status:** Accepted (November 2026)
- **Supersedes:** nothing. Refines ADR-003 (where the code lives) and the content rules in `docs/content/CURRICULUM.md`.

## Context

BJJ_Lang is pivoting to an English-learning world for Brazilian Portuguese speakers, built around four connected modes:

1. **Reader** (Understand): level-appropriate BJJ stories with tap-to-understand words.
2. **Games** (Practise): vocabulary, sentence building, dialogue completion, comprehension.
3. **Adventure** (Apply): choose-your-own-adventure BJJ situations decided by language choices.
4. **Flashcards** (Remember): spaced review of vocabulary met in any other mode.

Today vocabulary lives inside lessons (`MOCK_LESSONS[id].vocabulary` in `src/data/mockLessons.ts`), and only `markLessonComplete` in `src/context/CourseContext.tsx` feeds the review queue. Other modes cannot reference a word, and there is no single place to validate content.

## Decision

1. **One content registry.** All learning content is typed data in a registry (`src/content/`), keyed by stable IDs:
   lexical items, sentences, stories, exercises, scenarios and lessons. Modes read content by ID and never embed word text.
2. **Stable IDs are permanent.** Existing `vocab-*`, `ex-*` and `lesson-*` IDs are frozen, because stored review records reference them.
   New kinds use `story-<belt>-<slug>` and `scn-<belt>-<slug>`. An ID is never reused for different content.
3. **Encounters feed flashcards.** Any mode reports what the learner met with `recordEncounter(itemId, source)`,
   where `source` is `reader | game | adventure | lesson`. Only items marked `reviewable` are enqueued (see ADR-009 for decks).
4. **Single write path.** Learner state is written only through the serialized write queue
   (`src/services/learner/writeQueue.ts`), which also waits for stored progress to load. Modes never write storage directly.
5. **Pure domain code.** Content types, integrity validators, the scenario engine, answer evaluators and the enqueue policy
   live in `src/domain/` and import nothing from React, React Native, Expo or `src/components`.
6. **Additive storage changes only.** Persisted shapes (`bjj_lang_*_v1` keys) may gain optional fields; removing or tightening
   a field requires a new key and a migration. Each loader currently resets the whole store when any record fails validation,
   so a careless schema change would silently wipe progress.
7. **Content is validated in CI.** Integrity tests check that every referenced ID exists, IDs are unique across kinds,
   scenarios have reachable endings, and sentences respect the belt's level rules (`CURRICULUM.md`).

## Alternatives considered

- **Keep vocabulary inside lessons and copy it into each mode.** Rejected: duplicated text drifts, and the same word would get several unrelated review cards.
- **A separate workspace package for the domain (original ADR-003).** Deferred: one consumer does not justify the tooling. Revisit when a second app or a backend needs it.
- **Remote content (Supabase) now.** Deferred to after the POC (ADR-002). Static typed data is enough for the White Belt slice.

## Consequences

- `MOCK_LESSONS` becomes a derived adapter over the registry, so existing lesson screens keep working during the transition.
- Every new mode is a thin consumer: render content by ID, call `recordEncounter`, persist its own progress under its own key.
- Content authors work in typed data files and get immediate CI feedback.
- Implementation issues: P1-1 (registry), P1-2 (validators), P1-3 (`recordEncounter`).
