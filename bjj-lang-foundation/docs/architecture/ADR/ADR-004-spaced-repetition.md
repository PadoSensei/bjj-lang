# ADR-004: Spaced Repetition

- **Status:** Proposed
- **Decision:** Integrate a maintained FSRS implementation behind a scheduler interface; separately track direction-specific recall.
- **Context:** Need effective review intervals and reproducible state.
- **Alternatives:** SM-2, custom scheduler.
- **Rationale:** Avoid inventing scheduling science; allow implementation swap.
- **Consequences:** Verify package compatibility, state serialization, licensing, and test vectors before choosing a package. Persist scheduler version.
