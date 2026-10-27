# BJJ_Lang

**Learn the language. Understand the game. Connect through Jiu-Jitsu.**

BJJ_Lang is a mobile-first language-learning platform for Brazilian Jiu-Jitsu vocabulary, coaching instructions, and culture. It initially supports Brazilian Portuguese (`pt-BR`) and English (`en`), with learning in both directions.

## Product principles

- Teach language that learners can use on the mat.
- Support Portuguese → English as a free, donation-supported path.
- Offer English → Brazilian Portuguese as a one-time purchase.
- Use spaced repetition and belt-inspired learning progression.
- Be approachable for young learners while remaining useful to adult practitioners.
- Protect learner privacy, particularly for users under 18.
- Keep the learning domain independent of UI and infrastructure.

## Status

Bootstrap shell phase (M0). Minimum mobile app foundation and CI pipeline established.

## Documentation

- [Product requirements](docs/product/PRD.md)
- [MVP scope](docs/product/MVP_SCOPE.md)
- [System architecture](docs/architecture/SYSTEM_ARCHITECTURE.md)
- [Database](docs/architecture/DATABASE.md)
- [API strategy](docs/architecture/API.md)
- [Design system](docs/design/DESIGN_SYSTEM.md)
- [Engineering workflow](docs/engineering/DEVELOPMENT_WORKFLOW.md)
- [Security and privacy](docs/security/SECURITY.md)
- [Testing strategy](docs/testing/TEST_STRATEGY.md)
- [Curriculum](docs/content/CURRICULUM.md)
- [Release process](docs/operations/RELEASE_PROCESS.md)
- [Bootstrap task](docs/engineering/BOOTSTRAP_TASK.md)
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

# Run on Web
pnpm web
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
