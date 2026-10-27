# ADR-005: Offline Synchronization

- **Status:** Proposed
- **Decision:** SQLite local store, immutable client-ID review events, idempotent server sync, canonical server reconciliation.
- **Context:** Training venues may have unreliable connectivity.
- **Alternatives:** Online-only, blind last-write-wins.
- **Rationale:** Durable offline learning and safe retries.
- **Consequences:** Sync ordering, duplicate handling, and conflict cases need tests. Keep initial multi-device support simple.
