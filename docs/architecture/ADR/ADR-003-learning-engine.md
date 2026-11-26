# ADR-003: Learning Engine Boundary

- **Status:** Accepted, amended (November 2026)
- **Decision:** A standalone TypeScript domain package for exercises, scheduling interface, and progression rules.
- **Context:** Learning behavior must be testable and independent of app/backend.
- **Alternatives:** Embed business logic in screens or Supabase functions.
- **Rationale:** Pure unit tests, reuse, clear AI implementation boundary.
- **Consequences:** Keep package dependency-light; UI and infrastructure adapt to its interfaces.

## Amendment (November 2026)
The boundary is kept, but as a folder rather than a package: domain code lives in `src/domain/` inside the app, enforced by an ESLint `no-restricted-imports` rule (no React, React Native, Expo or `src/components`). Today's scheduler and statistics in `src/features/review/` move there as they are touched. Revisit a standalone package when a second consumer (backend or another app) exists. See ADR-008.
