# BJJ_Lang

**Learn the language. Understand the game. Connect through Jiu-Jitsu.**

BJJ_Lang is a mobile-first, scaffolded English-learning world for Brazilian Portuguese speakers, built around Brazilian Jiu-Jitsu. Four connected modes share the same content:

| Mode | Purpose |
| --- | --- |
| **Reader** | Understand: level-appropriate BJJ stories with tap-to-understand words |
| **Games** | Practise: vocabulary, sentence building, dialogue completion, comprehension |
| **Adventure** | Apply: BJJ situations where language choices change what happens |
| **Flashcards** | Remember: review of every word met in the other modes |

The current goal is the **White Belt** (Pre-A1 to A1) vertical slice as a free intro tier, followed by a small **Blue Belt** (A2) demonstration. Belts are language milestones, not martial-arts rank.

## Product principles

- Teach English that learners can use on the mat.
- Portuguese interface and explanations for beginners.
- One shared set of content across all modes, with stable IDs.
- Two isolated flashcard decks per word: Português → English and English → Português.
- Be approachable for young learners while remaining useful to adult practitioners.
- Protect learner privacy, particularly for users under 18.
- Keep the learning domain independent of UI and infrastructure.

## Project status & capabilities

**Current phase:** English-learning pivot, milestone **P0 — Pivot Foundations**. See [POC scope](docs/product/MVP_SCOPE.md) and the [milestones](docs/roadmap/PROPOSED_MILESTONES.md).

### Implemented today
- **App shell & navigation:** Expo Router stack across Home, Lesson runner, Review, Review history and direction selection.
- **Lessons (pre-pivot content):** 7 lessons in Units 1–3, available in both directions, with 46 vocabulary items and 22 exercises (multiple choice and translation recall). Counts are checked by `__tests__/curriculum/CurriculumIntegrity.test.tsx`.
- **Flashcard review:** reveal, self-rating, bounded in-session retry and history, in two isolated decks (Português → English and English → Português) with a deck toggle on the review and history screens. Every word met (today: through lessons) gets a card in both decks, each with its own schedule. Help text is in Portuguese, and each card shows where the word was met. The session waits for stored progress to load.
- **Local persistence:** completed lessons, review cards and history persist across reloads (AsyncStorage). All writes go through one serialized queue.
- **Web deployment:** static web export (`dist/`) for Vercel.
- **Curriculum content files:** all lessons and course structure are JSON files in `content/curriculum/`, validated on load. See [Curriculum](docs/content/CURRICULUM.md#content-data) for how to edit them.
- **Curriculum review page:** open `/curriculum` on the web preview (or in a dev build) to see every word, lesson, exercise, story and adventure by belt, with English and Portuguese side by side, review status and validation issues. It's an editor tool: no learner screen links to it.

### Next (in order)
- **P1 — Canonical Content & Vocabulary Core:** content registry, integrity validators, `recordEncounter`, deck toggle.
- **P2 — White Belt Vertical Slice:** Reader, Games, Adventure and Flashcards connected around "My first class".
- **P3 — Blue Belt Demonstration.**

Deferred until after the POC: accounts and backend, FSRS, sync, audio, XP, paid tiers. See [POC scope](docs/product/MVP_SCOPE.md).

## Documentation

- [POC scope](docs/product/MVP_SCOPE.md)
- [Milestones](docs/roadmap/PROPOSED_MILESTONES.md)
- [Product requirements](docs/product/PRD.md)
- [Curriculum specification](docs/content/CURRICULUM.md)
- [System architecture](docs/architecture/SYSTEM_ARCHITECTURE.md)
- [Database architecture](docs/architecture/DATABASE.md)
- [API strategy](docs/architecture/API.md)
- [Design system](docs/design/DESIGN_SYSTEM.md)
- [Engineering workflow](docs/engineering/DEVELOPMENT_WORKFLOW.md)
- [Security and privacy](docs/security/SECURITY.md)
- [Testing strategy](docs/testing/TEST_STRATEGY.md)
- [Release process](docs/operations/RELEASE_PROCESS.md)
- [Vercel deployment](docs/deployment/vercel.md)
- [ADRs](docs/architecture/ADR/) — start with ADR-008 (content and encounters) and ADR-009 (review directions)
- Historical, pre-pivot: [M2 audit](docs/roadmap/M2_COMPLETION_AUDIT.md), [M1 audit](docs/roadmap/M1_COMPLETION_AUDIT.md), [P0 roadmap audit](docs/roadmap/P0_ROADMAP_AUDIT.md)

## Stack

- Expo (SDK 58) + React Native (0.88) + TypeScript (strict mode)
- Expo Router
- pnpm (lockfile pinned)
- ESLint (flat config) + Prettier
- Jest + `jest-expo` + React Native Testing Library
- Zod (environment validation)
- GitHub Actions CI

## Development Setup

### Prerequisites

- Node.js 22+
- `pnpm` (version 10.30.3 specified via `packageManager` field)

### Installation

```bash
pnpm install
```

### Running the App

```bash
# Start Metro bundler / Expo dev server
pnpm start

# Run on iOS simulator (macOS required)
pnpm ios

# Run on Android emulator
pnpm android

# Run on Web (development)
pnpm web

# Build for Web (production static export)
pnpm run build:web
```

### Quality Checks & Verification

```bash
# Run ESLint
pnpm lint

# Run TypeScript typecheck
pnpm typecheck

# Run Jest unit & component tests
pnpm test

# Run Expo doctor diagnostics
pnpm run doctor
```

## Environment Configuration

Copy `.env.example` to `.env` if custom public configuration is needed:

```bash
cp .env.example .env
```

Environment variables prefixed with `EXPO_PUBLIC_` are validated safely using Zod at runtime (`src/config/env.ts`).

## Contribution

See [CONTRIBUTING.md](CONTRIBUTING.md). All changes should be made through pull requests and meet the definition of done.

## License

License to be decided before public distribution. Do not assume this repository or its content is open source.
