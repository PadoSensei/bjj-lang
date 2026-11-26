# System Architecture

**Status:** Current (POC) and target, November 2026

## Shape
A feature-oriented Expo application. Keep a modular monolith; do not introduce a separately deployed API server without an ADR.

## Layers
1. Presentation: Expo Router screens and UI components.
2. Application: hooks and providers that orchestrate use cases.
3. Domain: learning rules, content types and validators, scenario engine, answer evaluators, scheduler.
4. Infrastructure: storage today; later Supabase, SQLite, audio, analytics, monitoring.

Dependencies point inward. Domain logic must not import React Native, Expo, Supabase or persistence libraries.

## Current (POC)

### Client
- Expo + React Native + TypeScript (strict), Expo Router stack navigation.
- One `CourseProvider` (`src/context/CourseContext.tsx`) holds learner state: selected direction, completed lessons, review records and history per direction. `useCourse()` is the access point.
- Zod validates everything read from storage.

### Persistence (local only)
- AsyncStorage keys, one per store, all `_v1`: `bjj_lang_completed_lessons_v1`, `bjj_lang_review_records_v1`, `bjj_lang_review_history_v1`, `bjj_lang_preferences_v1` (selected direction, #35), `bjj_lang_vocab_encounters_v1` (every word met and where, #39).
- **Encounters:** `useCourse().recordEncounter(itemId, source, contentId?)` records a word met in any mode and, the first time a reviewable word is met, adds a card to both decks (pure policy in `src/domain/review/enqueue.ts`). Lesson completion uses the same path.
- Stored progress is loaded once on launch. Until it has loaded, `isLoadingProgress` is true and screens show a loading state.
- **Single write path:** every learner-state write runs through `src/services/learner/writeQueue.ts`. Writes run one at a time, start from the latest state (not a render-time snapshot), and wait until stored progress has loaded.
- Storage shapes change additively only (ADR-008).

### Content
- Today: typed data in `src/data/mockLessons.ts` and `src/data/mockCourseData.ts`.
- Target for P1: one registry in `src/content/`, typed by `src/domain/content/types.ts`, with stable IDs, validated in CI (ADR-008). `MOCK_LESSONS` becomes a derived adapter during the transition.

### The four modes (P1–P2)
- **Reader, Games, Adventure** read content by ID and report vocabulary with `recordEncounter(itemId, source)`.
- Each mode keeps its own progress under its own storage key (for example `bjj_lang_reader_progress_v1`), written through the write queue.
- **Flashcards** reuse `useReviewSession` and `app/review.tsx`. Two isolated decks per word (ADR-009).
- Routes: `app/read/[storyId].tsx`, `app/play/[exerciseSetId].tsx`, `app/adventure/[scenarioId].tsx`, `app/review.tsx`.

### Domain code
- Today: scheduling and statistics in `src/features/review/` (pure functions).
- Target: `src/domain/`, enforced by a lint rule (ADR-003 amended).

## Target (after the POC)
- TanStack Query for remote/cache state; Zustand only where appropriate.
- SQLite for local content, learning state and a pending event queue (ADR-005).
- Supabase Auth, PostgreSQL as canonical store, RLS for user-owned data, Storage for audio, Edge Functions for privileged workflows (ADR-002).

## Data principles
- Content entities are distinct from learner state.
- Concept identity is language-independent and stable.
- Translation and review direction are explicit.
- Review events are append-only and idempotent (once events exist).
- Entitlements are distinct from purchase transactions (once purchases exist).
- Store only necessary personal data.

## Offline and sync (target)
Local review writes are durable first. Each event has a client-generated unique ID. Sync is retryable and idempotent. Server returns canonical state; do not use blind last-write-wins for scheduler state.

## Observability (target)
Use Sentry for errors and PostHog for product analytics only after event/privacy review. Never send lesson answer text, child personal data, credentials or sensitive identifiers to analytics.

## Environments
Separate local, preview/staging and production configuration. Never use production user data as seed/test data.

## Scaling
Start with one application. Revisit service boundaries only when demonstrated requirements justify them.
