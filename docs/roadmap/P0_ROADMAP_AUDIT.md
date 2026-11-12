# P0 Roadmap & Implementation Audit

**Repository:** [PadoSensei/bjj-lang](https://github.com/PadoSensei/bjj-lang/)
**Baseline Document:** `docs/product/MVP_SCOPE.md`
**Audit Date:** November 2026
**Auditor:** Jules (Google Labs)

---

## 1. Executive Summary

This document provides a comprehensive, repository-wide audit of all **14 P0 (Launch Candidate)** requirements specified in `MVP_SCOPE.md`.

Every requirement has been audited by directly verifying the implementation state within the repository codebase, tests, and documentation, as well as cross-referencing GitHub tracking (issues and merged pull requests #1 through #20).

### Status Taxonomy

In accordance with audit directives, this evaluation strictly distinguishes three independent dimensions:
- **Implemented:** Verified in working, executable application code.
- **Tracked:** Associated with an existing GitHub issue or pull request.
- **Accepted:** Meets the documented acceptance criteria defined in its milestone or specification.

Mocked behavior, static fixtures, and local `AsyncStorage` implementations are explicitly distinguished from real backend/cloud/production implementations.

### Summary Metrics

| Status Category | Count | Requirements |
|---|:---:|---|
| **Fully Implemented & Accepted (Local Foundation)** | 4 | • Expo app shell and navigation<br>• Onboarding and course direction<br>• Published course, units, lessons, and structured content<br>• Lesson interaction and answer feedback |
| **Partially Implemented (Mock / Local-Only)** | 3 | • Separate learning state by concept, course, and direction<br>• Review queue and session completion<br>• Progress, belt-inspired milestones, and XP |
| **Not Implemented / Placeholder** | 7 | • Authentication/account flow appropriate to age/privacy requirements<br>• FSRS scheduling integration with tests<br>• Audio playback for selected content<br>• Offline lesson/review capability and safe event sync<br>• Purchase and entitlement flow for paid course, including restore<br>• Account deletion and privacy disclosures<br>• Error monitoring, analytics with privacy review, release process |
| **Total P0 Requirements** | **14** | |

---

## 2. Issue #18 Verification & Closure Report

### Context
- **Issue:** [#18 — M1.8: Numbers & Basic Responses](https://github.com/PadoSensei/bjj-lang/issues/18)
- **Merged PR:** [#19 — feat: implement M1.8 numbers & basic responses lesson](https://github.com/PadoSensei/bjj-lang/pull/19)
- **Merge Commit:** `be90845c3f01e7cb6424c4472a046f525d2d19a7`

### Scope & Acceptance Criteria Verification

| Criterion # | Acceptance Criterion | Verification Evidence in Codebase (`master`) | Status |
|:---:|---|---|:---:|
| 1 | Add a new Unit 1 lesson | `src/data/mockLessons.ts` (lines 191–350) defines `lesson-1-3`. Unit 1 in `src/data/mockCourseData.ts` lists `lesson-1-3` (pt-BR->en) and `lesson-1-3-pt` (en->pt-BR). | **Satisfied** |
| 2 | Include contextual PT-BR vocabulary and natural English translations | `src/data/mockLessons.ts` defines 9 vocabulary items (`vocab-1-3-1` through `vocab-1-3-9`) covering numbers (Um, Dois, Três, Quatro, Cinco) and responses (Sim, Não, Pronto, Entendi) with contextual explanations and realistic BJJ mat examples. | **Satisfied** |
| 3 | Add multiple-choice and translation-recall exercises | `src/data/mockLessons.ts` defines 4 exercises: 2 multiple choice (`ex-1-3-mc1`, `ex-1-3-mc2`) and 2 translation recall (`ex-1-3-recall1`, `ex-1-3-recall2`). | **Satisfied** |
| 4 | Support both learning directions | Verified bidirectional support: `lesson-1-3-pt` alias defined in `src/data/mockLessons.ts` line 438; verified in `__tests__/features/vocabulary/NumbersBasicResponsesContent.test.ts`. | **Satisfied** |
| 5 | Integrate with existing vocabulary review system | `CourseContext.tsx` (lines 189–224) automatically enqueues all 9 vocabulary items into the direction-specific review queue upon lesson completion. Tested in `NumbersBasicResponsesContent.test.ts`. | **Satisfied** |
| 6 | Add automated tests and desktop/mobile visual verification | Automated tests present in `__tests__/features/vocabulary/NumbersBasicResponsesContent.test.ts` (7 passing tests). Desktop and mobile screenshot evidence committed under `docs/engineering/evidence/m1.8/` (`01` through `06`). | **Satisfied** |

### Closure Recommendation
**Status:** **Qualifies for Closure**. All 6 acceptance criteria are fully satisfied and verified on the default branch.

> **Note on Issue Closure:** Due to sandbox environment boundaries (lack of GitHub personal access token with issue write permissions), Jules cannot execute API calls to close Issue #18 remotely. Issue #18 remains open on GitHub pending manual closure by the repository administrator.

#### Exact Closing Comment for Issue #18:
```markdown
Verified and satisfied by merged PR #19 (commit be90845c3f01e7cb6424c4472a046f525d2d19a7).

Verification Audit Summary:
1. Lesson Content: Added `lesson-1-3` (and alias `lesson-1-3-pt`) to Unit 1 with 9 core numbers and mat responses (`vocab-1-3-1` to `vocab-1-3-9`).
2. Contextual Explanations: All vocabulary items include contextual notes and mat-specific example sentences in both Portuguese and English.
3. Exercises: Implemented 4 balanced exercises (2 multiple-choice `ex-1-3-mc1`, `ex-1-3-mc2` and 2 translation-recall `ex-1-3-recall1`, `ex-1-3-recall2`).
4. Directional Support: Verified full bidirectional support (`pt-BR->en` and `en->pt-BR`).
5. Review Queue Integration: Lesson completion automatically enqueues vocabulary into persistent direction-isolated review queue.
6. Automated Tests & Visual Evidence: 7 automated unit tests passing (`__tests__/features/vocabulary/NumbersBasicResponsesContent.test.ts`) and 6 visual verification screenshots captured in `docs/engineering/evidence/m1.8/`.

All acceptance criteria have been verified against the default branch. Closing issue.
```

---

## 3. Comprehensive P0 Requirement Audit

The following section audits all 14 P0 requirements from `MVP_SCOPE.md` across the six planning tracks:
1. Curriculum
2. Learning Experience
3. Platform Foundation
4. Learning Infrastructure
5. Business
6. Release Readiness

---

### Requirement 1: Expo app shell and navigation
- **Track:** Learning Experience / Platform Foundation
- **Description:** Provide an Expo mobile-first application shell with responsive navigation across home, lesson, review, and direction-switching views.
- **Implemented:** Yes.
- **Tracked:** Yes (Issue [#1](https://github.com/PadoSensei/bjj-lang/issues/1), [#3](https://github.com/PadoSensei/bjj-lang/issues/3); PRs [#2](https://github.com/PadoSensei/bjj-lang/pull/2), [#4](https://github.com/PadoSensei/bjj-lang/pull/4), [#5](https://github.com/PadoSensei/bjj-lang/pull/5), [#20](https://github.com/PadoSensei/bjj-lang/pull/20)).
- **Accepted:** Yes (Verified in `M1.1_ACCEPTANCE_AUDIT.md` and test suite).
- **Code Evidence:**
  - `app/_layout.tsx` (Root Stack layout, CourseProvider injection)
  - `app/index.tsx` (Home overview screen, course/unit listing)
  - `app/lesson/[id].tsx` (Dynamic lesson runner route)
  - `app/review.tsx` and `app/review/history.tsx` (Review queue & history routes)
  - `app/select-direction.tsx` (Direction selector modal)
  - `__tests__/screens/Screens.test.tsx`, `__tests__/index.test.tsx`
- **Gaps:** None for baseline client shell navigation.
- **Acceptance Criteria:**
  - Responsive app shell running on iOS, Android, and Web.
  - Deep-linkable routes for home, lessons, reviews, and direction switching.
  - Zero layout breaks on mobile and tablet viewport dimensions.
- **Dependencies:** None (Completed baseline).
- **Proposed Milestone:** M1 (Completed).

---

### Requirement 2: Onboarding and course direction
- **Track:** Learning Experience
- **Description:** Enable learners to switch or onboard into either `pt-BR->en` (free) or `en->pt-BR` (commercial/paid track) with immediate UI adaptation and state isolation.
- **Implemented:** Yes.
- **Tracked:** Yes (Issue [#3](https://github.com/PadoSensei/bjj-lang/issues/3); PR [#4](https://github.com/PadoSensei/bjj-lang/pull/4), [#5](https://github.com/PadoSensei/bjj-lang/pull/5)).
- **Accepted:** Yes.
- **Code Evidence:**
  - `src/components/ui/CourseDirectionSelector.tsx` (Direction selector component)
  - `src/context/CourseContext.tsx` (Lines 60–120: `direction`, `setDirection`, isolation of `completedMap`, `reviewMap`, `historyMap`)
  - `app/select-direction.tsx` (Direction modal route)
  - `__tests__/components/UIComponents.test.tsx`
- **Gaps:** Dedicated first-time user onboarding flow (welcome sequence, age gate, goal setting) is currently represented only by direct course direction selection.
- **Acceptance Criteria:**
  - Learners can choose their native and target language direction.
  - Learning state and reviews are strictly partitioned by direction.
  - First-time onboarding includes required disclosures and age validation.
- **Dependencies:** M1 foundation.
- **Proposed Milestone:** M1 (Foundation complete; full onboarding flow in M3/Platform).

---

### Requirement 3: Authentication/account flow appropriate to age/privacy requirements
- **Track:** Platform Foundation
- **Description:** Implement authentication and account management supporting age-appropriate access, parental consent considerations for minors, and guest/anonymous progression.
- **Implemented:** No (0% implemented; purely static mock environment).
- **Tracked:** No (No existing GitHub issue or PR).
- **Accepted:** No.
- **Code Evidence:** None in `src/`. `docs/architecture/SYSTEM_ARCHITECTURE.md`, `docs/architecture/ADR/ADR-002-backend.md`, and `docs/security/SECURITY.md` define architectural targets (Supabase Auth, guest mode, strict privacy).
- **Gaps:**
  - No auth SDK (`@supabase/supabase-js`) installed.
  - No login, sign-up, session restoration, or password reset screens.
  - No guest-to-authenticated account linking or anonymous migration.
  - No age verification/gate mechanism.
- **Acceptance Criteria:**
  - Guest mode allows immediate learning without sign-in.
  - Sign-up flow prompts for age band / parental consent where required.
  - Authenticated session securely stores JWT in secure storage.
  - Account state links seamlessly with local progress upon sign-in.
- **Dependencies:** Platform foundation (M3). Must precede Cloud Progress Synchronization.
- **Proposed Milestone:** M3 — Authentication and Backend Foundation.

---

### Requirement 4: Published course, units, lessons, and structured content
- **Track:** Curriculum
- **Description:** Provide complete, published curriculum across Units 1, 2, and 3 for both learning directions, covering greetings, mat commands, numbers, positions, and submissions.
- **Implemented:** Yes. All 7 planned lessons across Units 1, 2, and 3 are implemented in `src/data/mockLessons.ts` and cataloged in `src/data/mockCourseData.ts` for both `pt-BR->en` and `en->pt-BR` directions (14 lesson representations total).
- **Tracked:** Yes (Issues [#6](https://github.com/PadoSensei/bjj-lang/issues/6), [#14](https://github.com/PadoSensei/bjj-lang/issues/14), [#16](https://github.com/PadoSensei/bjj-lang/issues/16), [#18](https://github.com/PadoSensei/bjj-lang/issues/18), [#23](https://github.com/PadoSensei/bjj-lang/issues/23), [#25](https://github.com/PadoSensei/bjj-lang/issues/25), [#27](https://github.com/PadoSensei/bjj-lang/issues/27), [#29](https://github.com/PadoSensei/bjj-lang/issues/29); PRs [#7](https://github.com/PadoSensei/bjj-lang/pull/7), [#15](https://github.com/PadoSensei/bjj-lang/pull/15), [#17](https://github.com/PadoSensei/bjj-lang/pull/17), [#19](https://github.com/PadoSensei/bjj-lang/pull/19), [#24](https://github.com/PadoSensei/bjj-lang/pull/24), [#26](https://github.com/PadoSensei/bjj-lang/pull/26), [#28](https://github.com/PadoSensei/bjj-lang/pull/28), [#30](https://github.com/PadoSensei/bjj-lang/pull/30)).
- **Accepted:** Yes. Verified by 11 curriculum integrity tests in `__tests__/curriculum/CurriculumIntegrity.test.tsx` verifying parity, ID uniqueness, schema bounds, and playability.
- **Code Evidence:**
  - `src/data/mockCourseData.ts` (Metadata for Units 1–3 in both directions with exact `conceptCount` parity)
  - `src/data/mockLessons.ts` (`lesson-1-1`, `lesson-1-2`, `lesson-1-3`, `lesson-2-1`, `lesson-2-2`, `lesson-3-1`, `lesson-3-2` and their `-pt` aliases)
  - `__tests__/curriculum/CurriculumIntegrity.test.tsx` (Automated curriculum-wide integrity test suite)
  - `docs/content/CURRICULUM.md` (Curriculum specification)
  - `docs/roadmap/M2_COMPLETION_AUDIT.md` (Full curriculum completion audit)
- **Gaps:** None for local MVP curriculum structured data. Remote CMS/OTA curriculum updates deferred to post-MVP.
- **Acceptance Criteria:**
  - Units 1, 2, and 3 have 100% of planned lessons implemented with vocabulary, context, examples, and exercises.
  - All lessons functional in both learning directions.
  - Automated content integrity tests validate vocabulary IDs, option bounds, and exercise completeness.
- **Dependencies:** Milestone 1 foundation.
- **Proposed Milestone:** M2 — Curriculum Completion (Completed).

---

### Requirement 5: Lesson interaction and answer feedback
- **Track:** Learning Experience
- **Description:** Interactive lesson player supporting vocabulary study, multiple-choice exercises, translation-recall exercises, instant validation, explanation feedback, and lesson completion scoring.
- **Implemented:** Yes.
- **Tracked:** Yes (Issue [#6](https://github.com/PadoSensei/bjj-lang/issues/6); PR [#7](https://github.com/PadoSensei/bjj-lang/pull/7)).
- **Accepted:** Yes.
- **Code Evidence:**
  - `src/features/lesson/useLesson.ts` (Lesson state machine: vocabulary -> exercise -> completion)
  - `src/features/lesson/components/VocabularyView.tsx`
  - `src/features/lesson/components/MultipleChoiceView.tsx`
  - `src/features/lesson/components/TranslationRecallView.tsx`
  - `src/features/lesson/components/LessonCompletionView.tsx`
  - `__tests__/screens/LessonScreen.test.tsx`, `__tests__/features/lesson/useLesson.test.ts`
- **Gaps:** None for MVP exercise types (Multiple Choice and Translation Recall).
- **Acceptance Criteria:**
  - Learners can advance through vocabulary cards with pronunciation/context.
  - Exercises provide immediate visual feedback (correct/incorrect) and explanation text.
  - Scoring summary accurately tallies first-attempt accuracy.
- **Dependencies:** M1 foundation.
- **Proposed Milestone:** M1 (Completed).

---

### Requirement 6: Separate learning state by concept, course, and direction
- **Track:** Learning Infrastructure
- **Description:** Partition and persist learning progress, completion status, review records, and performance metrics independently by concept ID, course, and language direction.
- **Implemented:** Partially implemented (Local AsyncStorage partitioning implemented; cloud/multi-device schema not implemented).
- **Tracked:** Yes (Issue [#8](https://github.com/PadoSensei/bjj-lang/issues/8), [#10](https://github.com/PadoSensei/bjj-lang/issues/10), [#12](https://github.com/PadoSensei/bjj-lang/issues/12); PRs [#9](https://github.com/PadoSensei/bjj-lang/pull/9), [#11](https://github.com/PadoSensei/bjj-lang/pull/11), [#13](https://github.com/PadoSensei/bjj-lang/pull/13)).
- **Accepted:** Yes for local device scope; No for multi-device/cloud scope.
- **Code Evidence:**
  - `src/services/storage/progressStorage.ts` (Key `@bjj_lang_completed_lessons_v1`)
  - `src/services/storage/reviewStorage.ts` (Key `@bjj_lang_review_records_v1`)
  - `src/services/storage/historyStorage.ts` (Key `@bjj_lang_review_history_v1`)
  - `src/context/CourseContext.tsx` (Strict direction keying: `'pt-BR->en'` vs `'en->pt-BR'`)
  - `__tests__/services/progressStorage.test.ts`, `__tests__/services/reviewStorage.test.ts`
- **Gaps:**
  - Storage is isolated per device only via React Native AsyncStorage.
  - No remote schema, user ID association, or cross-device state synchronization.
- **Acceptance Criteria:**
  - Progress in `pt-BR->en` does not mutate or affect `en->pt-BR` state.
  - Data structure supports remote sync with conflict resolution.
- **Dependencies:** Local state complete (M1); Cloud sync requires M3 (Auth & Backend).
- **Proposed Milestone:** M4 — Learning Engine: FSRS and Offline Synchronization.

---

### Requirement 7: FSRS scheduling integration with tests
- **Track:** Learning Infrastructure
- **Description:** Implement the Free Spaced Repetition Scheduler (FSRS) algorithm with verified interval calculations, stability, difficulty tracking, and comprehensive unit tests.
- **Implemented:** No (Currently uses a primitive mock heuristic: +24h for remembered, +4h for needs-practice).
- **Tracked:** No (No GitHub issue or PR exists for FSRS implementation; earlier issues #10/#11 implemented only a basic FIFO queue).
- **Accepted:** No.
- **Code Evidence:**
  - `src/features/review/reviewScheduler.ts` (lines 5–6, 33–42: `ONE_DAY_MS = 24 * 60 * 60 * 1000`, `NEEDS_PRACTICE_DELAY_MS = 4 * 60 * 60 * 1000`).
  - `docs/architecture/ADR/ADR-004-spaced-repetition.md` (documents decision to use FSRS).
- **Gaps:**
  - Real FSRS algorithm (`fsrs.js` or `ts-fsrs`) is completely absent.
  - No calculation of card stability, difficulty, retrievability, or elapsed review days.
  - Only two review outcomes exist (`remembered` / `needs-practice`), whereas FSRS standardly uses 4 rating levels (Again, Hard, Good, Easy).
- **Acceptance Criteria:**
  - Validated FSRS library integrated behind a decoupled scheduler interface.
  - Card state includes `stability`, `difficulty`, `reps`, `lapses`, and `state`.
  - Comprehensive unit test suite verifies schedule intervals, edge cases, and deterministic mathematical outputs against standard test vectors.
- **Dependencies:** M1 review foundation.
- **Proposed Milestone:** M4 — Learning Engine: FSRS and Offline Synchronization.

---

### Requirement 8: Review queue and session completion
- **Track:** Learning Experience / Learning Infrastructure
- **Description:** Dynamic spaced repetition review queue identifying due items, providing interactive flashcard review with answer reveal, in-session retry, history tracking, and session completion summaries.
- **Implemented:** Yes (Local-only, heuristic-based).
- **Tracked:** Yes (Issues [#10](https://github.com/PadoSensei/bjj-lang/issues/10), [#12](https://github.com/PadoSensei/bjj-lang/issues/12); PRs [#11](https://github.com/PadoSensei/bjj-lang/pull/11), [#13](https://github.com/PadoSensei/bjj-lang/pull/13)).
- **Accepted:** Yes for heuristic review queue; pending FSRS replacement.
- **Code Evidence:**
  - `src/features/review/useReviewSession.ts` (Queue management, bounded in-session retry)
  - `src/features/review/components/ReviewCard.tsx` (Flashcard reveal, self-assessment)
  - `src/features/review/components/ReviewCompletionView.tsx` (Session summary)
  - `src/features/review/components/ReviewHistoryView.tsx` (Detailed history timeline)
  - `__tests__/screens/ReviewScreen.test.tsx`, `__tests__/features/review/useReviewSession.test.tsx`
- **Gaps:** Session queue currently drives from heuristic timestamps rather than FSRS intervals.
- **Acceptance Criteria:**
  - Due items are automatically loaded into session queue.
  - Learners can view prompt, flip to reveal translation/notes, and record outcome.
  - In-session retry re-queues failed items before completion.
- **Dependencies:** M1 foundation; connects with M4 for FSRS scheduling.
- **Proposed Milestone:** M1 (Foundation accepted; M4 integrates FSRS).

---

### Requirement 9: Progress, belt-inspired milestones, and XP
- **Track:** Learning Experience
- **Description:** Visual progression model mapping academy belt ranks (White, Blue, Purple, Brown, Black) to course milestones, XP rewards for completions, and streak counters.
- **Implemented:** Partially implemented (Static belt badge UI and unit progress bars exist; XP and dynamic belt promotion logic are absent).
- **Tracked:** Yes for unit belt badges (Issue [#3](https://github.com/PadoSensei/bjj-lang/issues/3), [#8](https://github.com/PadoSensei/bjj-lang/issues/8); PR [#4](https://github.com/PadoSensei/bjj-lang/pull/4), [#9](https://github.com/PadoSensei/bjj-lang/pull/9)). Untracked for XP calculation and belt promotion rules.
- **Accepted:** No.
- **Code Evidence:**
  - `src/theme/tokens.ts` (lines 23–56: `colors.belts` tokens: white, blue, purple, brown, black)
  - `src/components/ui/BeltBadge.tsx` (Renders visual belt badge for units)
  - `src/components/ui/ProgressBar.tsx` (Renders percentage progress)
  - `src/context/CourseContext.tsx` (Calculates lesson completion percentage per unit)
- **Gaps:**
  - No XP (Experience Points) accumulation or display logic.
  - No user profile belt level (belts are currently only static attributes on units).
  - No milestone celebration animations or unlock events.
- **Acceptance Criteria:**
  - Completing lessons and review sessions awards deterministic XP.
  - Learner profile displays current belt status and progress toward stripes/next belt.
  - Persistent state tracks lifetime XP and current level per direction.
- **Dependencies:** M1 Foundation, M2 Curriculum.
- **Proposed Milestone:** M5 — Audio, Pronunciation and Progression.

---

### Requirement 10: Audio playback for selected content
- **Track:** Learning Experience
- **Description:** Native audio pronunciation playback for vocabulary terms, instructor commands, and dialogue examples.
- **Implemented:** No (0% implemented; no audio playback code or assets present).
- **Tracked:** No (No existing GitHub issue or PR).
- **Accepted:** No.
- **Code Evidence:** None in `src/`. `docs/architecture/SYSTEM_ARCHITECTURE.md` outlines audio hosting (CDN/Supabase Storage) and playback caching.
- **Gaps:**
  - No audio library installed (`expo-av` or `expo-audio`).
  - No audio playback component, mute control, or replay button.
  - Vocabulary data models lack `audioUrl` fields.
  - No audio files or CDN integration.
- **Acceptance Criteria:**
  - Audio playback button appears on vocabulary cards and review flashcards.
  - Clean pronunciation audio plays promptly on tap with caching for offline use.
  - Graceful fallback when audio file is missing or device is muted.
- **Dependencies:** M1 UI components, M2 Curriculum data models.
- **Proposed Milestone:** M5 — Audio, Pronunciation and Progression.

---

### Requirement 11: Offline lesson/review capability and safe event sync
- **Track:** Learning Infrastructure
- **Description:** Complete offline capability allowing learners to study lessons and perform review sessions without connectivity, queuing progress events safely for cloud sync.
- **Implemented:** No (Current app runs offline only because it is 100% local mock data; no sync queue, event logs, or network awareness exist).
- **Tracked:** No (No existing GitHub issue or PR).
- **Accepted:** No.
- **Code Evidence:**
  - `docs/architecture/ADR/ADR-005-offline-sync.md` (Design specifications for append-only mutation event log).
- **Gaps:**
  - No network connectivity detection (`@react-native-community/netinfo`).
  - No mutation queue / event log to record completed reviews while offline.
  - No sync reconciliation engine or conflict resolution strategy.
- **Acceptance Criteria:**
  - All downloaded lessons and pending reviews function with zero connectivity.
  - Review outcomes and completions are appended to local outbox.
  - When connection is restored, outbox drains idempotently to backend with safe timestamp reconciliation.
- **Dependencies:** M3 (Backend & Auth Foundation).
- **Proposed Milestone:** M4 — Learning Engine: FSRS and Offline Synchronization.

---

### Requirement 12: Purchase and entitlement flow for paid course, including restore
- **Track:** Business
- **Description:** In-app purchase integration supporting one-time purchase of the English → Brazilian Portuguese course, entitlement verification, purchase restoration, and free access preservation for Portuguese → English.
- **Implemented:** No (0% implemented; both courses are currently freely accessible).
- **Tracked:** No (No existing GitHub issue or PR).
- **Accepted:** No.
- **Code Evidence:**
  - `docs/architecture/ADR/ADR-006-monetization.md` (Monetization architecture: RevenueCat / StoreKit / Google Play Billing).
  - `docs/product/PRD.md` (Specifies pt-BR->en is free; en->pt-BR is paid).
- **Gaps:**
  - No IAP SDK (`react-native-purchases` or `expo-in-app-purchases`).
  - No paywall screen, purchase modal, or restore purchases button.
  - No entitlement gating guard in navigation or lesson runner.
  - No receipt validation backend integration.
- **Acceptance Criteria:**
  - `pt-BR->en` course is 100% free with no paywall prompts.
  - `en->pt-BR` course gates lessons after preview threshold behind paywall.
  - Learner can purchase lifetime access via Apple App Store and Google Play Store.
  - "Restore Purchases" button accurately restores entitlements across devices.
- **Dependencies:** M3 (Backend/Auth) for persistent user entitlement mapping.
- **Proposed Milestone:** M6 — Purchases, Entitlements and Account Lifecycle.

---

### Requirement 13: Account deletion and privacy disclosures
- **Track:** Platform Foundation / Release Readiness
- **Description:** Complete self-service account deletion, automated removal of remote user data, and privacy policy disclosures adhering to Apple/Google store guidelines and child safety standards.
- **Implemented:** No (0% implemented; privacy docs exist, but no app mechanism).
- **Tracked:** No (No existing GitHub issue or PR).
- **Accepted:** No.
- **Code Evidence:**
  - `docs/security/SECURITY.md` (Specifies strict privacy, no analytics on minors, account deletion requirements).
- **Gaps:**
  - No "Delete Account" button or confirmation dialog in UI.
  - No backend RPC/cascade deletion for user progress and auth records.
  - In-app privacy disclosure and terms modals are not implemented.
- **Acceptance Criteria:**
  - In-app setting allows users to permanently delete their account and associated data.
  - Deletion purges auth records, progress sync, and analytics identifiers.
  - Clear, accessible privacy policy and age-appropriate disclosures.
- **Dependencies:** M3 (Backend/Auth Foundation).
- **Proposed Milestone:** M6 — Purchases, Entitlements and Account Lifecycle (Must precede public release).

---

### Requirement 14: Error monitoring, analytics with privacy review, release process
- **Track:** Release Readiness
- **Description:** Integration of crash/error reporting (e.g., Sentry), privacy-reviewed telemetry, and automated production build/release pipelines.
- **Implemented:** Partially implemented (CI test workflow and Vercel web export are implemented; production crash reporting and analytics are absent).
- **Tracked:** Yes for bootstrap CI and Vercel web build (Issue [#1](https://github.com/PadoSensei/bjj-lang/issues/1), PRs [#2](https://github.com/PadoSensei/bjj-lang/pull/2), [#20](https://github.com/PadoSensei/bjj-lang/pull/20)). Untracked for Sentry, analytics, and mobile store release workflows.
- **Accepted:** Partially accepted (CI & web deployment ready; mobile monitoring & store distribution not ready).
- **Code Evidence:**
  - `.github/workflows/ci.yml` (Runs lint, typecheck, tests)
  - `vercel.json` and `docs/deployment/vercel.md` (Web SPA export configuration)
  - `docs/operations/RELEASE_PROCESS.md` (Release governance documentation)
- **Gaps:**
  - No crash reporting SDK installed (Sentry).
  - No privacy-preserving analytics SDK installed.
  - No EAS (Expo Application Services) build configuration (`eas.json`) for iOS TestFlight / Android Internal Testing.
- **Acceptance Criteria:**
  - Crash reporting captures uncaught exceptions without leaking PII or student inputs.
  - Analytics pipeline complies with COPPA/GDPR minor protection guidelines.
  - Automated release builds generated via EAS and deployed to beta tracks.
- **Dependencies:** Preceded by M1–M6.
- **Proposed Milestone:** M7 — Production Readiness and Release.

---

## 4. Traceability Matrix

| # | P0 Requirement Name | Track | Implemented | Tracked | Accepted | Code Evidence (Master) | Existing Tracking | Gaps / Missing Capabilities | Proposed Milestone |
|:---:|---|---|:---:|:---:|:---:|---|---|---|:---:|
| 1 | **Expo app shell and navigation** | Learning Experience | **Yes** | **Yes** | **Yes** | `app/_layout.tsx`, `app/index.tsx`, `app/lesson/[id].tsx`, `app/review.tsx` | Issues #1, #3; PRs #2, #4, #5, #20 | None for baseline client shell navigation. | **M1** |
| 2 | **Onboarding and course direction** | Learning Experience | **Yes** | **Yes** | **Yes** | `src/components/ui/CourseDirectionSelector.tsx`, `app/select-direction.tsx` | Issue #3; PRs #4, #5 | First-time onboarding modal & age gate. | **M1 / M3** |
| 3 | **Authentication/account flow** | Platform Foundation | **No** | **No** | **No** | None in `src/` (`docs/architecture/ADR/ADR-002-backend.md`) | *None* | Supabase client, auth UI, guest migration, token management. | **M3** |
| 4 | **Published course, units, lessons** | Curriculum | **Partial** | **Yes** | **Partial** | `src/data/mockLessons.ts`, `src/data/mockCourseData.ts` | Issues #6, #14, #16, #18; PRs #7, #15, #17, #19 | Unit 2 incomplete, Unit 3 missing in `mockLessons.ts`. | **M2** |
| 5 | **Lesson interaction & feedback** | Learning Experience | **Yes** | **Yes** | **Yes** | `src/features/lesson/useLesson.ts`, `MultipleChoiceView.tsx`, `TranslationRecallView.tsx` | Issue #6; PR #7 | None for MVP multiple-choice and recall types. | **M1** |
| 6 | **Separate learning state** | Learning Infrastructure | **Partial** | **Yes** | **Partial** | `src/services/storage/`, `src/context/CourseContext.tsx` | Issues #8, #10, #12; PRs #9, #11, #13 | Local AsyncStorage only; no cloud sync or remote user schema. | **M4** |
| 7 | **FSRS scheduling integration** | Learning Infrastructure | **No** | **No** | **No** | `src/features/review/reviewScheduler.ts` (Lines 5–6, 33–42) | *None* | Uses crude +24h/+4h mock; real FSRS algorithm absent. | **M4** |
| 8 | **Review queue & session** | Learning Experience | **Yes** | **Yes** | **Yes** | `src/features/review/useReviewSession.ts`, `ReviewCard.tsx`, `ReviewHistoryView.tsx` | Issues #10, #12; PRs #11, #13 | Runs on heuristic intervals rather than FSRS schedule. | **M1 / M4** |
| 9 | **Progress, belt milestones, XP** | Learning Experience | **Partial** | **Partial** | **No** | `src/components/ui/BeltBadge.tsx`, `src/theme/tokens.ts` | Issues #3, #8; PRs #4, #9 | XP accumulation absent; belts are static on units only. | **M5** |
| 10 | **Audio playback** | Learning Experience | **No** | **No** | **No** | None in `src/` (`docs/architecture/SYSTEM_ARCHITECTURE.md`) | *None* | Audio engine (`expo-av`), player UI, audio CDN assets. | **M5** |
| 11 | **Offline & safe event sync** | Learning Infrastructure | **No** | **No** | **No** | `docs/architecture/ADR/ADR-005-offline-sync.md` | *None* | NetInfo detection, offline mutation queue, sync reconciliation. | **M4** |
| 12 | **Purchase & entitlement flow** | Business | **No** | **No** | **No** | `docs/architecture/ADR/ADR-006-monetization.md` | *None* | IAP SDK, paywall UI, restore purchases, receipt validation. | **M6** |
| 13 | **Account deletion & privacy** | Platform Foundation | **No** | **No** | **No** | `docs/security/SECURITY.md` | *None* | In-app deletion action, backend purge cascade, privacy UI. | **M6** |
| 14 | **Error monitoring & release** | Release Readiness | **Partial** | **Partial** | **Partial** | `.github/workflows/ci.yml`, `vercel.json` | Issue #1; PRs #2, #20 | Sentry monitoring, privacy analytics, EAS mobile release CI. | **M7** |

---

## 5. Untracked Requirements & Coverage Analysis

The audit reveals that **6 out of 14 P0 requirements have zero GitHub tracking** (no open or closed issues or PRs):
1. **Authentication / Account Flow** (P0 #3)
2. **FSRS Scheduling Integration** (P0 #7)
3. **Audio Playback for Selected Content** (P0 #10)
4. **Offline Lesson/Review Capability and Safe Event Sync** (P0 #11)
5. **Purchase and Entitlement Flow** (P0 #12)
6. **Account Deletion and Privacy Disclosures** (P0 #13)

Additionally, 2 requirements have only partial tracking covering local mock prototypes:
- **Progress, Belt Milestones, and XP** (P0 #9 — Belt UI tracked, XP untracked)
- **Error Monitoring, Analytics, and Release Process** (P0 #14 — Web CI tracked, Sentry/Analytics/EAS untracked)

These gaps form the foundation of the proposed milestone roadmap outlined in `docs/roadmap/PROPOSED_MILESTONES.md`.
