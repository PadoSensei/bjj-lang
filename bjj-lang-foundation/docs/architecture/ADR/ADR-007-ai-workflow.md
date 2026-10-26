# ADR-007: AI-Assisted Engineering Workflow

- **Status:** Proposed
- **Decision:** GitHub repository/docs are source of truth; Claude plans/reviews; Jules implements scoped issues; CI and human review gate merges.
- **Context:** Solo developer using multiple AI systems.
- **Rationale:** Shared durable context, controlled changes, traceable acceptance.
- **Consequences:** Every task needs scope, non-goals, acceptance criteria, tests, and documentation impact. Agents must not bypass checks or apply production migrations.
