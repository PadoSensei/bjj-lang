# Curriculum

**Status:** Current (November 2026, English-learning pivot)

BJJ_Lang teaches English to Brazilian Portuguese speakers through Brazilian Jiu-Jitsu. Belts are language-learning milestones, never actual martial-arts rank.

## Content principles
- Clear, natural English as heard in real academies; authentic Brazilian Portuguese (`pt-BR`) for support text.
- Distinguish literal translation from natural usage.
- Include context and register where necessary.
- Have bilingual, BJJ-aware human review before publication.
- Never publish AI-drafted language without editorial verification.
- Provide audio where possible; document speaker/source rights.
- Track source, reviewer and review status for every item.
- Keep scenarios age-appropriate: learners may be minors.

## Belts and levels

| Belt | English level | POC status | Learner can… |
| --- | --- | --- | --- |
| **White** | Pre-A1 to A1 | **Building now** (free intro tier) | Greet, introduce themselves, count, answer yes/no, follow and use basic safety commands (*stop*, *tap*), name people and things in the academy |
| **Blue** | About A2 | Demonstration after White | Follow common instructions, ask for clarification, negotiate a roll, describe what happened in a past training |
| Purple, Brown, Black | B1 and above | Out of scope | — |

### Level rules (enforced by integrity tests once P1-2 lands)

| Rule | White | Blue |
| --- | --- | --- |
| Maximum words per English sentence | 6 | 12 |
| Grammar ceiling | Present simple, imperatives, *I am / my name is*, *can* for requests | Adds past simple, *going to*, *can / can't*, simple questions |
| Support language for explanations | **Portuguese** (`support.pt` required) | Portuguese, with optional simple English |
| Interface language | Portuguese | Portuguese (English UI strings may be introduced) |

An item, sentence or story may not use a belt above the content that contains it.

## Theme sequence
- **White:** greetings and respect (*OSS*, *excuse me*); numbers one to five; yes / no; safety commands (*stop*, *tap*); people at the academy (*teacher*, *partner*); first class.
- **Blue:** escapes and defensive positions; asking for clarification; sparring and mat dialogue (*want to roll?*, *slow down*, *one more round?*); describing a past training.

Existing content maps onto this: Unit 1 (`lesson-1-1` to `lesson-1-3`) seeds White Belt. `lesson-2-*` and the sparring phrases in `lesson-3-2` seed Blue Belt. `lesson-3-1` (submissions, currently Purple) is parked.

## How content is shared across modes
- All content lives in one registry with stable IDs (ADR-008). Reader stories, games, adventures and lessons reference items by ID; screens never embed word text.
- Every reviewable item met in any mode is added to both flashcard decks (ADR-009).
- Each reviewable White item should appear in at least two modes, so it is met in context before it is reviewed.

## IDs
- Existing IDs are frozen: `vocab-*`, `ex-*`, `lesson-*`. Stored review records reference them.
- New kinds: `story-<belt>-<slug>`, `scn-<belt>-<slug>` (for example `story-white-first-class`).
- Never reuse or repurpose an ID.

## Item metadata
Each lexical item records: English headword (a clean form such as `OSS`, with the gloss in `support.pt`), Portuguese meaning, belt, CEFR level, `reviewable` (whether it becomes a flashcard), optional phonetic and examples, and review status (`draft` or `reviewed`, plus reviewer).

## Content data
Content is typed data, not hardcoded into screens. Lessons, stories, games and scenarios reference concept IDs.
