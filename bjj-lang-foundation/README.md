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

Early project foundation. Product requirements and technical decisions are being refined.

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
- [ADRs](docs/architecture/ADR/)

## Planned stack

- Expo + React Native + TypeScript
- Expo Router
- Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- SQLite for local/offline state
- FSRS spaced repetition
- TanStack Query and Zustand
- Zod
- Vitest, React Native Testing Library, Maestro
- EAS Build and GitHub Actions

These are proposed baseline choices. Record material changes as Architecture Decision Records (ADRs).

## Development

Setup instructions will be added after the application bootstrap task is completed. Do not invent environment values; use `.env.example` and the relevant setup docs.

## Contribution

See [CONTRIBUTING.md](CONTRIBUTING.md). All changes should be made through pull requests and meet the definition of done.

## License

License to be decided before public distribution. Do not assume this repository or its content is open source.
