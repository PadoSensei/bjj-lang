# ADR-003: Learning Engine Boundary

- **Status:** Proposed
- **Decision:** A standalone TypeScript domain package for exercises, scheduling interface, and progression rules.
- **Context:** Learning behavior must be testable and independent of app/backend.
- **Alternatives:** Embed business logic in screens or Supabase functions.
- **Rationale:** Pure unit tests, reuse, clear AI implementation boundary.
- **Consequences:** Keep package dependency-light; UI and infrastructure adapt to its interfaces.
