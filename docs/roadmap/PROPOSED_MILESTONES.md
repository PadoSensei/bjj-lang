# Milestones Roadmap

**Repository:** [PadoSensei/bjj-lang](https://github.com/PadoSensei/bjj-lang/)
**Scope:** `docs/product/MVP_SCOPE.md` (POC scope, English-learning pivot)
**Status:** Current (November 2026). Supersedes the pre-pivot M3–M7 plan, kept below under *Parked*.

Milestones run in order. Content authoring for P2 can start as soon as the P1-1 content types merge.

## P0 — Pivot Foundations
Safe learner state and agreed direction semantics.

| Issue | Title | Status |
| --- | --- | --- |
| [#32](https://github.com/PadoSensei/bjj-lang/issues/32) | P0-1 Build the flashcard session after storage hydration | Done (PR #52) |
| [#33](https://github.com/PadoSensei/bjj-lang/issues/33) | P0-2 Serialize learner-state writes | Done (PR #53) |
| [#34](https://github.com/PadoSensei/bjj-lang/issues/34) | P0-3 Direction-isolation coverage in both directions | Done (PR #51) |
| [#35](https://github.com/PadoSensei/bjj-lang/issues/35) | P0-4 Persist the last-used direction | In review |
| [#36](https://github.com/PadoSensei/bjj-lang/issues/36) | P0-5 Pivot documentation, ADR-008, ADR-009 | In review |

**Exit:** all five merged; ADR-008 and ADR-009 accepted.

## P1 — Canonical Content & Vocabulary Core
Every mode can read content by ID and feed flashcards.

| Issue | Title |
| --- | --- |
| [#37](https://github.com/PadoSensei/bjj-lang/issues/37) | P1-1 Content types and registry, seeded from existing data |
| [#38](https://github.com/PadoSensei/bjj-lang/issues/38) | P1-2 Content integrity validators |
| [#39](https://github.com/PadoSensei/bjj-lang/issues/39) | P1-3 `recordEncounter` and the encounter store |
| [#40](https://github.com/PadoSensei/bjj-lang/issues/40) | P1-4 Deck switch and registry-backed cards |

**Exit:** registry and validators in CI; `recordEncounter` enqueues both decks; existing lessons unchanged for the learner.

## P2 — White Belt Vertical Slice
Reader, Games, Adventure and Flashcards connected around "My first class" (Pre-A1 to A1).

| Issue | Title |
| --- | --- |
| [#41](https://github.com/PadoSensei/bjj-lang/issues/41) | P2-1 White Belt "My first class" content pack |
| [#42](https://github.com/PadoSensei/bjj-lang/issues/42) | P2-2 Story reader with tap-to-understand |
| [#43](https://github.com/PadoSensei/bjj-lang/issues/43) | P2-3 Exercise-set runner, sentence builder, comprehension |
| [#44](https://github.com/PadoSensei/bjj-lang/issues/44) | P2-4 Choose Your Own Adventure engine and screen |
| [#45](https://github.com/PadoSensei/bjj-lang/issues/45) | P2-5 White Belt hub with four mode tiles |
| [#46](https://github.com/PadoSensei/bjj-lang/issues/46) | P2-6 White Belt slice end-to-end integration test |

**Exit:** the White Belt integration test passes; manual web and mobile evidence in `docs/engineering/evidence/p2/`.

## P3 — Blue Belt Demonstration
The same engines with A2 content, plus dialogue completion.

| Issue | Title |
| --- | --- |
| [#47](https://github.com/PadoSensei/bjj-lang/issues/47) | P3-1 Blue Belt "Open mat" content pack |
| [#48](https://github.com/PadoSensei/bjj-lang/issues/48) | P3-2 Dialogue-completion exercise type |
| [#49](https://github.com/PadoSensei/bjj-lang/issues/49) | P3-3 Blue Belt demo access and integration test |

**Exit:** the Blue Belt integration test passes.

## Working an issue
1. Branch from an up-to-date `master` (`fix/`, `feat/`, `test/`, `docs/`).
2. Write the failing tests from the issue first; then implement.
3. Run all gates: `pnpm lint && pnpm typecheck && pnpm test && pnpm run doctor && pnpm run build:web`.
4. Check `git status` and `git log --oneline -2` before pushing: the commit must contain the intended files.
5. Open a PR with `Closes #<issue>`; merge only when CI is green.

## Parked (pre-pivot plan)
Re-plan after the POC. GitHub milestone #4 holds no issues.

| Old milestone | Content | Now |
| --- | --- | --- |
| M3 — Authentication & Backend Foundation | Supabase, guest mode, age verification | Deferred (ADR-002) |
| M4 — Learning Engine: FSRS & Offline Sync | FSRS, offline mutation queue, sync | Deferred (ADR-004, ADR-005) |
| M5 — Audio, Pronunciation & Progression | Audio, XP, belt promotion | Deferred |
| M6 — Purchases, Entitlements & Account Lifecycle | Paid course, account deletion | On hold (ADR-006) |
| M7 — Production Readiness & Release | Monitoring, EAS, store review | Deferred |

Closed pre-pivot milestones: M0 — Project Bootstrap (#1), M1 — Learning Experience Foundation (#2), M2 — Curriculum Completion (#3). See the historical audits in this folder.
