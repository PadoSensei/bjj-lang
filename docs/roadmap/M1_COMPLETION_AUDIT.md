# M1 Milestone Completion Audit & M2 Readiness Assessment

**Repository:** [PadoSensei/bjj-lang](https://github.com/PadoSensei/bjj-lang/)
**Audit Target:** Milestone M1 — Learning Experience Foundation
**Readiness Target:** Milestone M2 — Curriculum Completion
**Date:** November 2026
**Auditor:** Jules (Google Labs)

---

## 1. Executive Summary

This document provides a comprehensive audit of GitHub Milestone 2 (`M1 — Learning Experience Foundation`), reconciling the GitHub milestone tracking state with the actual implementation in the repository codebase, merged pull requests, and automated tests. It also assesses the repository's readiness to begin Milestone M2 (`Curriculum Completion`).

### Core Findings

1. **Implementation Status:** **Complete (100% satisfied for M1 scope).** All 6 acceptance criteria defined in the GitHub M1 milestone description are verified as implemented, passing, and covered by 106 automated tests on the default branch (`master`).
2. **GitHub Tracking Status:** **0% displayed completion (Administrative discrepancy).** GitHub reports 0 open and 0 closed issues for Milestone 2. This is an administrative tracking artifact: all canonical implementation issues (#3 through #18) and pull requests (#4 through #21) were merged and closed without their `milestone` field being assigned to M1.
3. **M1.8 Verification:** Merged PR #19 successfully closed Issue #18 by delivering `lesson-1-3` (Numbers & Basic Responses) with 9 contextual vocabulary items, 4 exercises, bidirectional support, and review queue integration.
4. **M1 Scope Boundary:** M1 was defined to build the learning experience foundation (reusable UI, navigation, direction switcher, sample course overview, interactive lesson loop, and tests). Incomplete curriculum depth (Units 2 and 3) is not a blocker for M1; rather, complete curriculum authoring belongs squarely in **M2 — Curriculum Completion**.
5. **Recommendation:** **M1 is eligible for administrative closure after tracking reconciliation.** A concrete, ordered checklist of administrative actions is provided for the repository owner.

---

## 2. GitHub Milestone Tracking vs. Reality

### GitHub Milestone Objects Overview

| Milestone | ID | GitHub Status | Open Issues | Closed Issues | Displayed Completion | Reality / Codebase Status |
|---|---|---|:---:|:---:|:---:|---|
| **M0 — Project Bootstrap** | 1 (`#1`) | Open | 0 | 1 | 100% (1/1 issue) | Fully complete. Issue #1 closed via PR #2. Ready for administrative closure. |
| **M1 — Learning Experience Foundation** | 2 (`#2`) | Open | 0 | 0 | 0% (0/0 issues) | Fully complete on `master`. 8 canonical issues and 10 PRs implemented and merged, but none were linked to the milestone object. |

### Why M1 Displays 0% Completion

When GitHub calculates milestone progress, it computes:
$$\text{Progress} = \frac{\text{Closed Issues Assigned to Milestone}}{\text{Total Issues Assigned to Milestone}}$$

Because issues #3, #6, #8, #10, #12, #14, #16, and #18 were closed without being assigned to Milestone 2 (`M1 — Learning Experience Foundation`), GitHub records 0 total issues, displaying 0%.

This is strictly an administrative tracking discrepancy, not evidence that M1 implementation is incomplete.

---

## 3. M1 Acceptance Criteria Verification

The GitHub description for Milestone 2 defines 6 concrete acceptance requirements in scope, with clear out-of-scope boundaries:

> **Goal:** Build the first usable app journey for both English and Brazilian Portuguese learners.
> **In scope:**
> 1. Establish reusable design tokens and UI components.
> 2. Add navigation for the main learning screens.
> 3. Let learners choose their learning direction: English → Brazilian Portuguese or Brazilian Portuguese → English.
> 4. Create a course/unit overview using sample content.
> 5. Build a basic lesson flow with question, answer, feedback, and completion screens.
> 6. Add tests for navigation and lesson interactions.
>
> **Out of scope:** Supabase, authentication, and cloud sync; Real purchases or donations; Production spaced-repetition algorithms; Public profiles, leaderboards, or social features.

The audit verified each requirement against the default branch:

### Requirement 1: Reusable design tokens and UI components
- **Status:** **Implemented & Accepted**
- **Code Evidence:**
  - Design tokens: `src/theme/tokens.ts` (colors for dark theme, typography, spacing, border radiuses, shadows, belt rank colors: white, blue, purple, brown, black).
  - Reusable UI components: `src/components/ui/` (`Button.tsx`, `Card.tsx`, `Badge.tsx`, `BeltBadge.tsx`, `ProgressBar.tsx`, `CourseDirectionSelector.tsx`).
- **Tests:**
  - `__tests__/components/UIComponents.test.tsx` (tests Button variants/sizes, Card variants, Badge variants, BeltBadge styling, and ProgressBar clamp logic).
- **Tracking:** Issue #3 (M1.1), PR #4, PR #5.
- **Remaining Work:** None for M1 foundation.
- **Meets Acceptance Criteria:** **Yes.**

### Requirement 2: Navigation for the main learning screens
- **Status:** **Implemented & Accepted**
- **Code Evidence:**
  - Root Layout: `app/_layout.tsx` (injects `CourseProvider`, configures Stack navigator and header styling).
  - Home Screen: `app/index.tsx` (displays active course header, review banner with due count, unit list, and lesson rows).
  - Lesson Runner: `app/lesson/[id].tsx` (dynamic route rendering vocabulary, interactive exercises, feedback modals, and lesson completion).
  - Review Screen: `app/review.tsx` and `app/review/history.tsx` (spaced repetition review session and history timeline).
  - Direction Selector Modal: `app/select-direction.tsx` (accessible from Home navigation bar).
- **Tests:**
  - `__tests__/screens/Screens.test.tsx` (verifies Home overview, Lesson route resolution, Review navigation).
  - `__tests__/index.test.tsx` (verifies Home screen interactions, unit expansions, navigation dispatches).
- **Tracking:** Issue #3 (M1.1), PR #4, PR #5.
- **Remaining Work:** None for core navigation.
- **Meets Acceptance Criteria:** **Yes.**

### Requirement 3: Learning-direction selection
- **Status:** **Implemented & Accepted**
- **Scope Verified:**
  - English → Brazilian Portuguese (`en->pt-BR`)
  - Brazilian Portuguese → English (`pt-BR->en`)
- **Code Evidence:**
  - Component: `src/components/ui/CourseDirectionSelector.tsx` (segmented direction pill selector with active indicators).
  - Context & Isolation: `src/context/CourseContext.tsx` (stores active `direction`, provides `setDirection`, strictly isolates completion progress `completedMap`, review cards `reviewMap`, and history records `historyMap` per direction).
  - Modal Screen: `app/select-direction.tsx` (lets user toggle direction with instant preview).
- **Tests:**
  - `__tests__/components/UIComponents.test.tsx` (verifies direction switch callbacks).
  - `__tests__/context/CourseContext.test.tsx` (verifies separate progress mapping across directions).
  - `__tests__/features/vocabulary/NumbersBasicResponsesContent.test.ts` (verifies bidirectional lesson resolution).
- **Tracking:** Issue #3 (M1.1), PR #4, PR #5.
- **Remaining Work:** None for M1 local state switching. (Cloud persistence and account-linked profiles are planned for M3/M4).
- **Meets Acceptance Criteria:** **Yes.**

### Requirement 4: Course/unit overview using sample content
- **Status:** **Implemented & Accepted**
- **Code Evidence:**
  - Sample Course Data: `src/data/mockCourseData.ts` (contains syllabus structures for both `pt-BR->en` and `en->pt-BR`, spanning Unit 1, Unit 2, and Unit 3 with belt badges, lesson metadata, concept counts, and estimated durations).
  - Overview Presentation: `app/index.tsx` (renders Unit accordions, unit completion progress bars, belt ranks, lesson status indicators: completed vs available).
- **Tests:**
  - `__tests__/index.test.tsx` (renders units, lessons, progress indicators).
  - `__tests__/screens/HomeScreen.review.test.tsx` (verifies dynamic review callout integration on Home screen).
- **Tracking:** Issue #3 (M1.1), Issue #8 (M1.3), PR #4, PR #9.
- **Remaining Work:** None for sample course/unit overview. In M2, the full curriculum content for Units 2 and 3 will populate this structure.
- **Meets Acceptance Criteria:** **Yes.**

### Requirement 5: Basic lesson flow (Question, Answer, Feedback, Completion)
- **Status:** **Implemented & Accepted**
- **Code Evidence:**
  - State Machine Hook: `src/features/lesson/useLesson.ts` (manages transition from vocabulary study phase → interactive exercise phase → completion scoring phase).
  - Vocabulary Study: `src/features/lesson/components/VocabularyView.tsx` (renders term, phonetics/pronunciation, translation, contextual explanation, and practical mat usage example).
  - Multiple Choice Exercise: `src/features/lesson/components/MultipleChoiceView.tsx` (prompt, answer options, immediate correct/incorrect color styling, explanation disclosure).
  - Translation Recall Exercise: `src/features/lesson/components/TranslationRecallView.tsx` (term prompt, reveal answer action, self-evaluation option).
  - Completion Screen: `src/features/lesson/components/LessonCompletionView.tsx` (calculates score percentage, first-try accuracy, review queue enqueue notice, and return to home navigation).
- **Tests:**
  - `__tests__/screens/LessonScreen.test.tsx` (complete end-to-end traversal of vocabulary, question answering, feedback rendering, and completion).
  - `__tests__/features/lesson/useLesson.test.ts` (unit tests for step progression, answer scoring, and completion state).
  - `__tests__/features/vocabulary/ContextualVocabularyView.test.tsx` (tests contextual notes and academy example rendering).
- **Tracking:** Issue #6 (M1.2), Issue #14 (M1.6), PR #7, PR #15.
- **Remaining Work:** None for M1 baseline mechanics.
- **Meets Acceptance Criteria:** **Yes.**

### Requirement 6: Tests for navigation and lesson interactions
- **Status:** **Implemented & Accepted**
- **Code Evidence & Test Metrics:**
  - Full automated suite: 22 test suites, 106 automated tests passing with 0 failures (`pnpm test`).
  - Unit, screen, and integration test coverage across:
    - Screens: `Screens.test.tsx`, `index.test.tsx`, `LessonScreen.test.tsx`, `ReviewScreen.test.tsx`, `HomeScreen.review.test.tsx`.
    - Features: `useLesson.test.ts`, `useReviewSession.test.tsx`, `reviewScheduler.test.ts`, `reviewStatistics.test.ts`, `ReviewHistoryView.test.tsx`.
    - Storage & Context: `CourseContext.test.tsx`, `CourseContext.history.test.tsx`, `CourseContext.review.test.tsx`, `progressStorage.test.ts`, `reviewStorage.test.ts`, `historyStorage.test.ts`.
    - Content: `ContextualVocabularyContent.test.ts`, `NumbersBasicResponsesContent.test.ts`.
- **Tracking:** Included across all PRs (#2, #4, #5, #7, #9, #11, #13, #15, #17, #19).
- **Remaining Work:** None for M1. Expanded test suites will accompany new curriculum additions in M2.
- **Meets Acceptance Criteria:** **Yes.**

---

## 4. Verification of M1.8 (Issue #18 & PR #19)

### Context & Implementation
Issue #18 requested adding a beginner lesson covering numbers, counting during training, and common short responses in Brazilian Jiu-Jitsu academies. PR #19 implemented this feature and merged into `master` at commit `be90845c3f01e7cb6424c4472a046f525d2d19a7`.

### Verification Checklist
1. **Lesson Content:** Added `lesson-1-3` (and alias `lesson-1-3-pt`) under Unit 1 in `src/data/mockLessons.ts` (lines 191–350).
2. **Contextual Vocabulary:** Defined 9 terms (`vocab-1-3-1` to `vocab-1-3-9`): Um, Dois, Três, Quatro, Cinco, Sim, Não, Pronto, Entendi. Each item includes contextual usage and academy training examples in both Portuguese and English.
3. **Exercises:** Implemented 4 exercises: 2 multiple-choice (`ex-1-3-mc1`, `ex-1-3-mc2`) and 2 translation-recall (`ex-1-3-recall1`, `ex-1-3-recall2`).
4. **Bidirectional Support:** Verified in `mockCourseData.ts` and `mockLessons.ts` (mapped to both `pt-BR->en` and `en->pt-BR`).
5. **Review Queue Integration:** Automatically enqueues vocabulary into the direction-specific review queue upon lesson completion in `CourseContext.tsx`.
6. **Tests & Visual Evidence:** Automated tests pass in `__tests__/features/vocabulary/NumbersBasicResponsesContent.test.ts` (7 tests). Visual verification screenshots are preserved in `docs/engineering/evidence/m1.8/` (6 screenshots covering mobile and desktop viewports).

### Conclusion for M1.8
All requirements of Issue #18 and PR #19 are verified on `master`. Issue #18 is verified and closed.

---

## 5. Scope Boundary Analysis: M1 Foundation vs. Future Capabilities

To prevent milestone confusion, the table below categorizes all capabilities in the repository:

| Capability | Category | Implementation Evidence | Milestone / Target |
|---|:---:|---|:---:|
| Design system tokens & base UI components | **Verified Implemented** | `src/theme/tokens.ts`, `src/components/ui/` | **M1** |
| Navigation (Home, Lesson, Review, Direction) | **Verified Implemented** | `app/` file-based routes | **M1** |
| Direction switcher (`pt-BR->en`, `en->pt-BR`) | **Verified Implemented** | `CourseDirectionSelector.tsx`, `CourseContext.tsx` | **M1** |
| Interactive lesson runner (Vocab, MC, Recall) | **Verified Implemented** | `src/features/lesson/` | **M1** |
| Unit 1 Curriculum (Lessons 1-1, 1-2, 1-3) | **Verified Implemented** | `src/data/mockLessons.ts` | **M1** |
| Unit 2 Lesson 2-1 (Guardas e Passagens) | **Verified Implemented** | `src/data/mockLessons.ts` | **M1** |
| Local persistence (`AsyncStorage`) | **Implemented (Local-only)** | `src/services/storage/` | **M1** |
| Review queue & history tracking | **Implemented (Heuristic)** | `src/features/review/` (+24h / +4h heuristic) | **M1** (Heuristic) / **M4** (FSRS) |
| Unit 2 Lesson 2-2 (Posições e Defesa) | **Not Yet Implemented** | Missing from `mockLessons.ts` | **M2** |
| Unit 3 Lessons 3-1 & 3-2 (Finalizações) | **Not Yet Implemented** | Defined in course metadata, missing in `mockLessons.ts` | **M2** |
| Audio pronunciation playback & assets | **Not Yet Implemented** | Out of scope for M1; no audio engine | **M5** |
| Dynamic XP accumulation & Belt promotions | **Not Yet Implemented** | Out of scope for M1; static belt badges only | **M5** |
| Production FSRS spaced repetition algorithm | **Not Yet Implemented** | Out of scope for M1; planned for M4 | **M4** |
| Offline mutation queue & cloud sync | **Not Yet Implemented** | Out of scope for M1; planned for M4 | **M4** |
| Supabase Auth, profiles & account lifecycle | **Out of Scope for M1** | Out of scope for M1; planned for M3 | **M3** |
| In-app purchases & entitlement paywalls | **Out of Scope for M1** | Out of scope for M1; planned for M6 | **M6** |
| Sentry crash monitoring & EAS release pipeline | **Out of Scope for M1** | Out of scope for M1; planned for M7 | **M7** |

---

## 6. M2 Readiness Assessment

### Is the project ready to begin M2?
**Yes.** The repository is fully prepared to begin Milestone M2 (`Curriculum Completion`).

### Rationale
1. **Foundation Stability:** The lesson runner (`useLesson`), interactive views (`VocabularyView`, `MultipleChoiceView`, `TranslationRecallView`), review queue integration (`CourseContext`), and local persistence layer are battle-tested and stable.
2. **Clear Content Authoring Pattern:** Adding new lessons does not require modifying core infrastructure. It follows a clean declarative format in `src/data/mockLessons.ts` and `src/data/mockCourseData.ts`.
3. **Decoupled Architecture:** Curriculum authoring is completely decoupled from cloud backend and auth readiness. Content can be completed, validated, and tested without waiting for Supabase integration.
4. **Validation Pipeline Operational:** Automated testing, linting, typechecking, and static export build pipelines are fully operational and passing.

### Canonical M2 Scope & Deliverables
Milestone M2 focuses on completing the full 3-unit curriculum across both language directions:
1. **Unit 2 Completion:** Implement `lesson-2-2` ("Escapes and Defensive Postures") with contextual vocabulary, academy usage, and exercises.
2. **Unit 3 Implementation:** Implement `lesson-3-1` ("Submissions from Guard") and `lesson-3-2` ("Sparring & Mat Dialogue") in `mockLessons.ts`.
3. **Bidirectional Mapping:** Ensure all newly authored lessons have verified bidirectional equivalents (`-pt` aliases and direction-adapted prompt/option text).
4. **Content Schema & Integrity Tests:** Add automated test assertions verifying that every vocabulary item across Units 1–3 has valid IDs, non-empty example sentences, and valid exercise index bounds.
5. **Visual Verification:** Capture desktop and mobile visual verification screenshots for each newly implemented lesson.

---

## 7. Canonical M1 Issue Breakdown & Attribution

To resolve the 0% tracking discrepancy, the canonical feature issues that belong to Milestone M1 are cataloged below with the technical rationale for why each is an M1 deliverable:

| Issue # | Title | Merged PR | Rationale for M1 Attribution |
|:---:|---|:---:|---|
| **#3** | M1.1 — Establish design system and learning navigation | #4, #5 | Delivers M1 Acceptance Criteria 1, 2, 3, and 4 (tokens, components, screens, direction switcher). |
| **#6** | M1.2 — Implement Interactive Lesson Mechanics | #7 | Delivers M1 Acceptance Criterion 5 (lesson runner, vocabulary cards, exercises, feedback modal, completion scoring). |
| **#8** | M1.3 — Track Lesson Completion and Course Progress | #9 | Connects lesson completions to unit progress bars and local `progressStorage` (M1 Criterion 4 & 5). |
| **#10** | M1.4 — Implement a Basic Vocabulary Review Queue | #11 | Introduces the foundational vocabulary flashcard review session and spaced schedule logic. |
| **#12** | M1.5 — Add Vocabulary Review History & Progress Insights | #13 | Adds review session history tracking, streak recording, and review insights screen. |
| **#14** | M1.6 — Add Contextual Vocabulary Learning & Examples | #15 | Enhances the M1 lesson vocabulary card UI to render contextual notes and practical mat examples. |
| **#16** | M1.7 — Expand Contextual Vocabulary Content Across the Course | #17 | Expands contextual vocabulary notes and examples across all Unit 1 and Unit 2 foundation lessons. |
| **#18** | M1.8 — Numbers & Basic Responses | #19 | Completes Unit 1 beginner curriculum with numbers and responses, fulfilling initial sample course depth. |

*Note on PRs #20 and #21:* PR #20 (Vercel deployment) and PR #21 (Repository audit & MVP roadmap) were operational/governance improvements and do not require issue milestone assignment, although they support the overall release readiness.

---

## 8. GitHub Administrative Actions Checklist (Owner Action Plan)

Because automated agents cannot modify GitHub milestones or issue metadata without specific elevated administrative permissions, the repository owner should execute the following ordered administrative steps:

- [ ] **Step 1: Reconcile M1 Issue Assignments**
  In the GitHub web UI (or via GitHub CLI), edit the following closed issues and assign them to **Milestone 2 (`M1 — Learning Experience Foundation`)**:
  - Issue `#3` (M1.1 — Establish design system and learning navigation)
  - Issue `#6` (M1.2 — Implement Interactive Lesson Mechanics)
  - Issue `#8` (M1.3 — Track Lesson Completion and Course Progress)
  - Issue `#10` (M1.4 — Implement a Basic Vocabulary Review Queue)
  - Issue `#12` (M1.5 — Add Vocabulary Review History & Progress Insights)
  - Issue `#14` (M1.6 — Add Contextual Vocabulary Learning & Examples)
  - Issue `#16` (M1.7 — Expand Contextual Vocabulary Content Across the Course)
  - Issue `#18` (M1.8 — Numbers & Basic Responses)
  *(Assigning these 8 closed issues will update M1's GitHub completion from 0% to 100%).*

- [ ] **Step 2: Confirm M1 Completion Audit**
  Review `docs/roadmap/M1_COMPLETION_AUDIT.md` (this document) and verify that all evidence and test results meet project standards.

- [ ] **Step 3: Administratively Close Milestone 1 (`M0 — Project Bootstrap`)**
  Milestone 1 has 1 closed issue (#1) and 0 open issues (100% complete). Change its state to **Closed**.

- [ ] **Step 4: Administratively Close Milestone 2 (`M1 — Learning Experience Foundation`)**
  With all 8 canonical issues assigned and closed, change Milestone 2's state to **Closed**.

- [ ] **Step 5: Create GitHub Milestone for M2**
  Create a new milestone on GitHub:
  - **Title:** `M2 — Curriculum Completion`
  - **Description:** Complete the published BJJ curriculum for Units 1, 2, and 3 across both course directions (`pt-BR->en` and `en->pt-BR`), authoring contextual academy vocabulary, usage explanations, and exercise pairings.
  - **Due date:** (Optional / as planned).

- [ ] **Step 6: Create and Assign Approved M2 Issues**
  Create the implementation issues for M2 (see recommended breakdown in Section 6 and `PROPOSED_MILESTONES.md`) and assign them to the `M2 — Curriculum Completion` milestone.

- [ ] **Step 7: Authorize M2 Implementation**
  Begin M2 implementation on dedicated feature branches.

---

## 9. Verification & Quality Diagnostics Summary

All standard repository health checks have been executed against `master` and verified:

| Check | Command | Result | Notes |
|---|---|:---:|---|
| **Linting** | `pnpm lint` | **PASS** | 0 errors, 0 warnings across all source and test files. |
| **Type Checking** | `pnpm typecheck` | **PASS** | `tsc --noEmit` passed with 0 TypeScript errors. |
| **Test Suite** | `pnpm test` | **PASS** | 22 test suites passed, 106 tests passed, 0 failures. |
| **Expo Doctor** | `pnpm run doctor` | **PASS (20/20)** | All 20 diagnostics passed with zero warnings (`expo.install.exclude` configured for pinned dependencies). |
| **Web Production Build** | `pnpm run build:web` | **PASS** | `expo export -p web` successfully exported SPA artifacts to `dist/`. |
