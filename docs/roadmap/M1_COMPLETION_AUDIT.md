# M1 Milestone Completion Audit & M2 Readiness Assessment

**Repository:** [PadoSensei/bjj-lang](https://github.com/PadoSensei/bjj-lang/)
**Audit Target:** GitHub milestone #2: M1 — Learning Experience Foundation
**Readiness Target:** Proposed project milestone M2: Curriculum Completion
**Date:** November 2026
**Auditor:** Jules (Google Labs)

---

## 1. Executive Summary

This document provides a comprehensive audit of GitHub milestone #2 (`M1 — Learning Experience Foundation`), reconciling the GitHub milestone tracking state with the actual implementation in the repository codebase, merged pull requests, and automated tests. It also assesses the repository's readiness to begin proposed project milestone M2 (`Curriculum Completion`).

### Consistent Milestone Naming Convention

To avoid confusion between GitHub milestone numbering and project milestone stages:
- **GitHub milestone #1:** `M0 — Project Bootstrap`
- **GitHub milestone #2:** `M1 — Learning Experience Foundation`
- **Proposed project milestone M2:** `M2 — Curriculum Completion`

### Core Findings

1. **Implementation Status:** **Complete (100% satisfied for M1 scope).** All 6 acceptance criteria defined in GitHub milestone #2's description are verified as implemented, passing, and covered by 106 automated tests on the default branch (`master`).
2. **GitHub Tracking Status:** **0% displayed completion (Administrative discrepancy).** GitHub reports 0 open and 0 closed issues for GitHub milestone #2. This is an administrative tracking artifact: all canonical implementation issues (#3, #6, #8, #10, #12, #14, #16, #18) and pull requests (#4 through #21) were merged and closed without their `milestone` field being assigned to GitHub milestone #2.
3. **M0 Completion Status:** GitHub milestone #1 (`M0 — Project Bootstrap`) has 1 closed issue out of 1 assigned issue (100% issue completion), but the GitHub milestone object remains open pending administrative closure.
4. **M1.8 Verification:** Merged PR #19 successfully closed Issue #18 by delivering `lesson-1-3` (Numbers & Basic Responses) with 9 contextual vocabulary items, 4 exercises, bidirectional support, and review queue integration.
5. **M1 Scope Boundary:** M1 was defined to build the learning experience foundation (reusable UI, navigation, direction switcher, sample course overview, interactive lesson loop, and tests). Incomplete curriculum depth (Units 2 and 3) is not a blocker for M1; rather, complete curriculum authoring belongs squarely in **Proposed project milestone M2 — Curriculum Completion**.
6. **Recommendation:** **M1 is eligible for administrative closure after tracking reconciliation.** A concrete, 8-step ordered checklist of administrative actions is provided for the repository owner.

---

## 2. GitHub Milestone Tracking vs. Reality

### GitHub Milestone Objects Overview

| Milestone Label | GitHub ID | GitHub State | Open Issues | Closed Issues | Displayed Completion | Reality / Codebase Status |
|---|---|---|:---:|:---:|:---:|---|
| **GitHub milestone #1: M0 — Project Bootstrap** | 1 (`#1`) | Open | 0 | 1 | 100% (1/1 issue) | Fully complete in code. Issue #1 closed via PR #2. GitHub milestone object remains open pending owner administrative closure. |
| **GitHub milestone #2: M1 — Learning Experience Foundation** | 2 (`#2`) | Open | 0 | 0 | 0% (0/0 issues) | Fully complete on `master`. 8 canonical issues and 10 PRs implemented and merged, but none were linked to the milestone object. |
| **Proposed project milestone M2: Curriculum Completion** | — | Uncreated | — | — | — | Ready to begin detailed issue planning and implementation. Decoupled from backend infrastructure. |

### Why GitHub Milestone #2 Displays 0% Completion

When GitHub calculates milestone progress, it computes:
$$\text{Progress} = \frac{\text{Closed Issues Assigned to Milestone}}{\text{Total Issues Assigned to Milestone}}$$

Because issues #3, #6, #8, #10, #12, #14, #16, and #18 were closed without being assigned to GitHub milestone #2, GitHub records 0 total issues, displaying 0%.

This is strictly an administrative tracking discrepancy, not evidence that M1 implementation is incomplete.

---

## 3. M1 Acceptance Criteria Verification

The GitHub description for GitHub milestone #2 defines 6 concrete acceptance requirements in scope, with clear out-of-scope boundaries:

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
- **Tracking:** Canonical Issue #3 (M1.1); Implementation PRs #4, #5.
- **Remaining Work:** None for M1 foundation.
- **Meets Acceptance Criteria:** **Yes.**

### Requirement 2: Navigation for the main learning screens
- **Status:** **Implemented & Accepted**
- **Code Evidence:**
  - Root Layout: `app/_layout.tsx` (injects `CourseProvider`, configures Stack navigator and header styling).
  - Home Screen: `app/index.tsx` (displays active course header, review banner with due count, unit list, and lesson rows).
  - Lesson Runner: `app/lesson/[id].tsx` (dynamic route rendering vocabulary, interactive exercises, feedback modals, and lesson completion).
  - Review Screen: `app/review.tsx` and `app/review/history.tsx` (local heuristic review session and history timeline).
  - Direction Selector Modal: `app/select-direction.tsx` (accessible from Home navigation bar).
- **Tests:**
  - `__tests__/screens/Screens.test.tsx` (verifies Home overview, Lesson route resolution, Review navigation).
  - `__tests__/index.test.tsx` (verifies Home screen interactions, unit expansions, navigation dispatches).
- **Tracking:** Canonical Issue #3 (M1.1); Implementation PRs #4, #5.
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
- **Tracking:** Canonical Issue #3 (M1.1); Implementation PRs #4, #5.
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
- **Tracking:** Canonical Issue #3 (M1.1), Canonical Issue #8 (M1.3); Implementation PRs #4, #9.
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
- **Tracking:** Canonical Issue #6 (M1.2), Canonical Issue #14 (M1.6); Implementation PRs #7, #15.
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
- **Tracking:** Included across all implementation PRs (#2, #4, #5, #7, #9, #11, #13, #15, #17, #19).
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
| Unit 2 Lesson 2-1 (Guardas e Passagens / Core Position Names) | **Verified Implemented** | `src/data/mockLessons.ts` | **M1** |
| Local persistence (`AsyncStorage`) | **Implemented (Local-only)** | `src/services/storage/` | **M1** |
| Review queue & history tracking | **Implemented (Heuristic)** | `src/features/review/` (+24h / +4h heuristic) | **M1** (Heuristic) / **M4** (FSRS) |
| Unit 2 Lesson 2-2 (Posições e Defesa / Escapes) | **Not Yet Implemented** | Missing from `mockLessons.ts` | **M2** |
| Unit 3 Lessons 3-1 & 3-2 (Finalizações / Submissions & Sparring) | **Not Yet Implemented** | Defined in course metadata, missing in `mockLessons.ts` | **M2** |
| Audio pronunciation playback & assets | **Not Yet Implemented** | Out of scope for M1; no audio engine | **M5** |
| Dynamic XP accumulation & Belt promotions | **Not Yet Implemented** | Out of scope for M1; static belt badges only | **M5** |
| Production FSRS spaced repetition algorithm | **Not Yet Implemented** | Out of scope for M1; planned for M4 | **M4** |
| Offline mutation queue & cloud sync | **Not Yet Implemented** | Out of scope for M1; planned for M4 | **M4** |
| Supabase Auth, profiles & account lifecycle | **Out of Scope for M1** | Out of scope for M1; planned for M3 | **M3** |
| In-app purchases & entitlement paywalls | **Out of Scope for M1** | Out of scope for M1; planned for M6 | **M6** |
| Sentry crash monitoring & EAS release pipeline | **Out of Scope for M1** | Out of scope for M1; planned for M7 | **M7** |

---

## 6. Detailed Scope and Audit of Canonical M1 Issues

Assigning issues to GitHub milestones is the relevant tracking action; pull requests serve as supporting implementation evidence. Below is the verification of the eight canonical M1 feature issues, auditing each issue's original scope against the six M1 acceptance criteria:

### Issue #3: M1.1 — Establish design system and learning navigation
- **Original Scope:** Establish reusable design tokens for colors, typography, and spacing; build foundational UI components (`Button`, `Card`, `Badge`, `BeltBadge`, `ProgressBar`); configure Expo Router root layout and screens (`Home`, `Lesson`, `Review`, `DirectionSelector`); support `pt-BR->en` and `en->pt-BR` direction switching; provide sample course overview.
- **Linkage to M1 Acceptance Criteria:** Directly satisfies **Criterion 1 (Design tokens & UI)**, **Criterion 2 (Navigation)**, **Criterion 3 (Direction selection)**, and **Criterion 4 (Course/unit overview)**.
- **Implementation PRs:** PR #4, PR #5.
- **Milestone Attribution:** **Canonical M1 Feature Issue.**

### Issue #6: M1.2 — Implement Interactive Lesson Mechanics
- **Original Scope:** Build client-side interactive lesson runner; allow learners to study vocabulary cards, answer multiple-choice questions, perform translation recall, receive instant feedback with explanations, and view lesson score summaries.
- **Linkage to M1 Acceptance Criteria:** Directly satisfies **Criterion 5 (Basic lesson flow)** and **Criterion 6 (Lesson interaction tests)**.
- **Implementation PR:** PR #7.
- **Milestone Attribution:** **Canonical M1 Feature Issue.**

### Issue #8: M1.3 — Track Lesson Completion and Course Progress
- **Original Scope:** Connect the interactive lesson runner to the course overview; persist completed lesson IDs per learning direction in local `AsyncStorage`; display unit completion percentages and lesson completion badges.
- **Linkage to M1 Acceptance Criteria:** Directly satisfies **Criterion 4 (Course/unit overview)**, **Criterion 5 (Completion behavior)**, and **Criterion 3 (Direction-isolated state)**.
- **Implementation PR:** PR #9.
- **Milestone Attribution:** **Canonical M1 Feature Issue.**

### Issue #10: M1.4 — Implement a Basic Vocabulary Review Queue
- **Original Scope:** Introduce a local-first vocabulary flashcard review system; enqueue vocabulary items upon lesson completion; provide flashcard reveal and self-rating (`remembered` vs `needs-practice`); implement a lightweight heuristic scheduler (+24h for remembered, +4h for needs practice); display due review count on Home screen.
- **Linkage to M1 Acceptance Criteria:** Directly enhances **Criterion 2 (Review navigation)** and **Criterion 5 (Post-lesson review loop)**.
- **Implementation PR:** PR #11.
- **Milestone Attribution:** **Canonical M1 Feature Issue.**

### Issue #12: M1.5 — Add Vocabulary Review History & Progress Insights
- **Original Scope:** Record completed review attempts in local storage (`historyStorage`); display review history timeline route (`/review/history`); display total items reviewed and recall breakdown per direction.
- **Linkage to M1 Acceptance Criteria:** Directly enhances **Criterion 2 (Screen navigation)** and **Criterion 3 (Direction-isolated state)**.
- **Implementation PR:** PR #13.
- **Milestone Attribution:** **Canonical M1 Feature Issue.**

### Issue #14: M1.6 — Add Contextual Vocabulary Learning & Examples
- **Original Scope:** Extend vocabulary cards to display contextual explanations and practical mat usage examples in both Portuguese and English; ensure answers remain hidden during self-assessment until revealed.
- **Linkage to M1 Acceptance Criteria:** Directly enhances **Criterion 1 (UI components)** and **Criterion 5 (Lesson vocabulary view)**.
- **Implementation PR:** PR #15.
- **Milestone Attribution:** **Canonical M1 Feature Issue.**

### Issue #16: M1.7 — Expand Contextual Vocabulary Content Across the Course
- **Original Scope:** Populate contextual explanations and academy training examples across all existing Unit 1 and Unit 2 lessons in `src/data/mockLessons.ts`; maintain bidirectional consistency between `pt-BR->en` and `en->pt-BR`.
- **Linkage to M1 Acceptance Criteria:** Directly supports **Criterion 4 (Sample content depth)** and **Criterion 6 (Content tests)**.
- **Implementation PR:** PR #17.
- **Milestone Attribution:** **Canonical M1 Feature Issue.**

### Issue #18: M1.8 — Numbers & Basic Responses
- **Original Scope:** Add beginner lesson `lesson-1-3` to Unit 1 covering numbers (1–5) and responses (sim, não, pronto, entendi); author contextual notes and mat examples; provide 4 exercises (2 multiple choice, 2 recall); ensure review queue integration and bidirectional support.
- **Linkage to M1 Acceptance Criteria:** Directly satisfies **Criterion 4 (Complete Unit 1 sample course overview)** and **Criterion 5 (Lesson flow)**.
- **Implementation PR:** PR #19.
- **Milestone Attribution:** **Canonical M1 Feature Issue.**

---

## 7. M2 Readiness Assessment & Curriculum Integrity

### Is the project ready to begin Proposed Project Milestone M2?
**Yes.** The repository is fully prepared to begin Proposed project milestone M2 (`Curriculum Completion`).

### Rationale
1. **Foundation Stability:** The lesson runner (`useLesson`), interactive views (`VocabularyView`, `MultipleChoiceView`, `TranslationRecallView`), review queue integration (`CourseContext`), and local persistence layer are thoroughly verified and stable.
2. **Clear Content Authoring Pattern:** Adding new lessons follows a clean declarative format in `src/data/mockLessons.ts` and `src/data/mockCourseData.ts` without needing alterations to core framework code.
3. **Decoupled Architecture:** Curriculum authoring is completely decoupled from cloud backend and auth readiness. Content can be authored, validated, and tested without waiting for Supabase integration.
4. **Validation Pipeline Operational:** All quality checks (lint, typecheck, tests, expo-doctor, web build) are passing.

### Canonical Alignment with Course Metadata
In `src/data/mockCourseData.ts`, the course metadata defines the following structure:
- **Unit 1: Primeiros Passos no Tatame / Fundamentals & Mat Culture** (Belt: White)
  - `lesson-1-1`: Saudações e Regras do Tatame / Mat Greetings & Etiquette (*Implemented*)
  - `lesson-1-2`: Comandos de Treino / Coaching Commands (*Implemented*)
  - `lesson-1-3`: Números e Respostas Básicas / Numbers & Basic Responses (*Implemented*)
- **Unit 2: Posições e Defesa / BJJ Positions & Actions** (Belt: Blue)
  - `lesson-2-1`: Guardas e Passagens / Core Position Names (*Implemented*)
  - `lesson-2-2`: Posições e Defesa: Saídas e Posturas / Escapes & Defensive Postures (*Missing in `mockLessons.ts` — M2 Deliverable*)
- **Unit 3: Finalizações e Transições / Submissions & Sparring** (Belt: Purple)
  - `lesson-3-1`: Ataques Básicos da Guarda / Submissions from Guard (*Defined in metadata, missing in `mockLessons.ts` — M2 Deliverable*)
  - `lesson-3-2`: Transições e Diálogo de Treino / Sparring & Mat Dialogue (*Defined in metadata, missing in `mockLessons.ts` — M2 Deliverable*)

### Curriculum-Wide Integrity Requirements for M2
M2 is not merely adding placeholder objects. To achieve pedagogical coherence and technical integrity, M2 must satisfy:
1. **Metadata Resolution:** Every lesson ID listed in `mockCourseData.ts` for both directions (`pt-BR->en` and `en->pt-BR`) must resolve to a fully populated lesson in `mockLessons.ts`.
2. **Contextual Quality:** Every vocabulary item must include natural translations, authentic academy context, and mat usage examples in both languages.
3. **Identifier Uniqueness:** All vocabulary IDs (`vocab-*`) and exercise IDs (`ex-*`) must be strictly unique across the curriculum.
4. **Exercise Validity:** Exercises must have non-empty prompt strings, valid option arrays, valid `correctIndex` bounds, and non-empty explanations.
5. **Interactive Playability:** Every lesson must be fully playable through `useLesson` without exceptions, properly calculating completion scores.
6. **Bidirectional Review Flow:** Completing any lesson must automatically enqueue its vocabulary into the direction-specific review queue.
7. **Automated Content Testing:** Content integrity test suites must systematically validate schema bounds, ID uniqueness, and bidirectional parity.

### Recommended M2 Issue Breakdown
- **M2.1:** Implement Unit 2 Lesson 2 (`lesson-2-2` / `lesson-2-2-pt` — Escapes & Defensive Postures) with complete vocabulary, contextual notes, and exercises.
- **M2.2:** Implement Unit 3 Lesson 1 (`lesson-3-1` / `lesson-3-1-pt` — Submissions from Guard) with complete vocabulary, contextual notes, and exercises.
- **M2.3:** Implement Unit 3 Lesson 2 (`lesson-3-2` / `lesson-3-2-pt` — Sparring & Mat Dialogue) with complete vocabulary, contextual notes, and exercises.
- **M2.4:** Build curriculum-wide integrity test suite verifying ID uniqueness, metadata alignment, non-empty examples, and valid exercise index bounds.
- **M2.5:** Capture mobile and desktop visual verification evidence for all newly added lessons under `docs/engineering/evidence/m2/`.

---

## 8. GitHub Administrative Actions Checklist (Owner Action Plan)

The repository owner should execute the following 8-step ordered administrative workflow:

- [ ] **Step 1: Verify Canonical Issue Assignments and M1 Audit Evidence**
  Review the evidence in `docs/roadmap/M1_COMPLETION_AUDIT.md` confirming the scope and delivery of issues #3, #6, #8, #10, #12, #14, #16, and #18.

- [ ] **Step 2: Assign Confirmed M1 Issues to GitHub Milestone #2**
  In the GitHub web UI (or via GitHub CLI), edit the following closed issues and assign their milestone field to **GitHub milestone #2 (`M1 — Learning Experience Foundation`)**:
  - Issue `#3` (M1.1 — Establish design system and learning navigation)
  - Issue `#6` (M1.2 — Implement Interactive Lesson Mechanics)
  - Issue `#8` (M1.3 — Track Lesson Completion and Course Progress)
  - Issue `#10` (M1.4 — Implement a Basic Vocabulary Review Queue)
  - Issue `#12` (M1.5 — Add Vocabulary Review History & Progress Insights)
  - Issue `#14` (M1.6 — Add Contextual Vocabulary Learning & Examples)
  - Issue `#16` (M1.7 — Expand Contextual Vocabulary Content Across the Course)
  - Issue `#18` (M1.8 — Numbers & Basic Responses)

- [ ] **Step 3: Confirm GitHub Reports 100% Completion for M1**
  Verify that GitHub milestone #2 displays 8 closed issues, 0 open issues, and 100% completion.

- [ ] **Step 4: Close GitHub Milestone #1 (`M0 — Project Bootstrap`)**
  Confirm 1/1 issue closed (100% completion) and change milestone state to **Closed**.

- [ ] **Step 5: Close GitHub Milestone #2 (`M1 — Learning Experience Foundation`)**
  With all 8 canonical issues assigned and closed, change milestone state to **Closed**.

- [ ] **Step 6: Create Proposed M2 GitHub Milestone**
  Create a new milestone on GitHub:
  - **Title:** `M2 — Curriculum Completion`
  - **Description:** Complete the published BJJ curriculum for Units 1, 2, and 3 across both course directions (`pt-BR->en` and `en->pt-BR`), authoring contextual academy vocabulary, usage explanations, and exercise pairings.

- [ ] **Step 7: Approve and Create M2 Implementation Issues**
  Create implementation issues for M2 (`M2.1` through `M2.5` as specified in Section 7) and assign them to the newly created `M2 — Curriculum Completion` milestone.

- [ ] **Step 8: Begin M2 Implementation**
  Authorize feature branch implementation for Milestone M2.

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
