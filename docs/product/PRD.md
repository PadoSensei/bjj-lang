# Product Requirements — BJJ_Lang

**Status:** Draft
**Version:** 0.2 (English-learning pivot, November 2026)

## Vision
A scaffolded English-learning world for Brazilian Portuguese speakers, built around Brazilian Jiu-Jitsu: learners understand, practise, apply and remember the English they need on the mat.

## Audience
- **Now:** Brazilian Portuguese speakers learning English through BJJ, from Pre-A1 to A2. Youth (8–18) and adult practitioners.
- **Later:** academies and social-project partners; English speakers learning Portuguese (parked, see ADR-006).

## Tiers
- **White Belt (free intro tier):** Pre-A1 to A1 English. This is the POC being built.
- **Blue Belt (demonstration):** about A2 English, a small slice showing the system scales by content.
- **Purple, Brown, Black Belt:** out of scope for the POC. Any paid tier comes later and is not designed yet.

Belts are language-learning milestones, never actual martial-arts rank.

## The four connected modes

| Mode | Purpose | What the learner does |
| --- | --- | --- |
| **Reader** | Understand | Reads short, level-appropriate BJJ stories; taps a word to see a Portuguese explanation |
| **Games** | Practise | Vocabulary, sentence building, dialogue completion, comprehension questions |
| **Adventure** | Apply | Plays a BJJ situation (first class, open mat) where language choices change what happens |
| **Flashcards** | Remember | Reviews every word met in the other modes, in two isolated decks |

All modes use the same canonical content items with stable IDs (ADR-008). A word met anywhere becomes eligible for flashcard review.

**Flashcard decks (ADR-009):**
- "Português → English": see the Portuguese, recall the English (production).
- "English → Português": see the English, recall the Portuguese meaning (recognition).

Each word is added to both decks with independent schedules. Reviewing in one deck never affects the other.

## Product principles
- Mobile-first and intuitive.
- Portuguese interface and Portuguese support text for White Belt: never explain an A1 word in B1 English.
- Fun but credible as a learning tool.
- Authentic, human-reviewed language and contextual examples.
- Accessible, privacy-conscious, and especially careful with under-18 users.
- Offline-friendly: all POC progress is stored on the device and persists across reloads.

## Primary journey (White Belt)
1. Open the app (Portuguese interface).
2. Read the White Belt story; tap unfamiliar words.
3. Play the matching games.
4. Play the adventure for the same theme.
5. Review the words met, in both flashcard decks.
6. Return later: progress, decks and the last deck used are restored.

## Success indicators (initial hypotheses)
- Story, game set and adventure completion rates.
- Words tapped per story; share later reviewed.
- First flashcard session completion; reviews per active learner.
- D1 and D7 learner return.
- Content quality reports and crash-free sessions.

Targets should be set after baseline data, not invented now.

## Open product questions
- Parental consent and age-appropriate account flow (needed before accounts exist).
- Shape and pricing of any paid tier.
- Audio: speaker sourcing and rights.
- App-store release timing and regional availability.
