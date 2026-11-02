# BJJ_Lang

**Learn the language. Understand the game. Connect through Jiu-Jitsu.**

BJJ_Lang is a mobile-first language-learning platform for Brazilian Jiu-Jitsu vocabulary, coaching instructions, and culture. It supports Brazilian Portuguese (`pt-BR`) and English (`en`), with learning in both directions.

## Product principles

- Teach language that learners can use on the mat.
- Support Portuguese → English as a free, donation-supported path.
- Offer English → Brazilian Portuguese as a one-time purchase.
- Use spaced repetition and belt-inspired learning progression.
- Be approachable for young learners while remaining useful to adult practitioners.
- Protect learner privacy, particularly for users under 18.
- Keep the learning domain independent of UI and infrastructure.

## Project status & capabilities

**Current Phase:** Foundation & Initial Learning Experience (Milestone 1 Completed).

### Implemented & verified capabilities
- **App shell & navigation:** Expo Router stack navigation across Home overview, Lesson runner, Review sessions, History timeline, and Course Direction selection.
- **Directional learning & state isolation:** Learners can switch between `pt-BR->en` and `en->pt-BR` with local progress and review queues strictly partitioned.
- **Interactive lesson mechanics:** Vocabulary cards with contextual explanations and academy examples, followed by multiple-choice and translation-recall exercises with answer feedback.
- **Local vocabulary review queue:** Spaced-review flashcard workflow with answer reveal, self-assessment, bounded in-session retry, and review history tracking.
- **Local persistence:** Offline persistence via React Native `AsyncStorage` for completed lessons, review cards, and historical outcomes.
- **Web deployment readiness:** Static web export (`dist/`) configured for Vercel SPA hosting.

### Mocked, partial, or planned capabilities
- **Curriculum:** Unit 1 (3 lessons) and Unit 2 Lesson 1 are implemented with mock data; Units 2 and 3 remain to be completed (Planned for M2).
- **Spaced repetition algorithm:** Review intervals currently use a lightweight heuristic (+24h / +4h); true FSRS mathematical scheduling is not yet integrated (Planned for M4).
- **Audio & pronunciation:** No audio playback engine or sound assets are integrated (Planned for M5).
- **Progression & XP:** Belt color badges and lesson completion percentages are displayed; dynamic XP accumulation and belt rank promotion rules are not yet implemented (Planned for M5).
- **Authentication & cloud sync:** No backend or Supabase integration; all user state is local to the device with no cloud synchronization (Planned for M3 & M4).
- **Purchases & monetization:** In-app purchases, paywalls, and entitlement checks are not implemented; both course tracks are currently unrestricted (Planned for M6).
- **Production monitoring & release:** Error telemetry (Sentry) and mobile app store distribution pipelines (EAS) are not yet configured (Planned for M7).

For the full requirement-by-requirement status and roadmap, see:
- [P0 Roadmap & Implementation Audit](docs/roadmap/P0_ROADMAP_AUDIT.md)
- [Proposed Milestones Roadmap](docs/roadmap/PROPOSED_MILESTONES.md)

## Documentation

- [MVP scope](docs/product/MVP_SCOPE.md)
- [P0 Roadmap & Implementation Audit](docs/roadmap/P0_ROADMAP_AUDIT.md)
- [Proposed Milestones Roadmap](docs/roadmap/PROPOSED_MILESTONES.md)
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
- [ADRs](docs/architecture/ADR/)

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
