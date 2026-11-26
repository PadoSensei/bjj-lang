# ADR-005: Offline Synchronization

- **Status:** Deferred (November 2026)
- **Decision:** SQLite local store, immutable client-ID review events, idempotent server sync, canonical server reconciliation.
- **Context:** Training venues may have unreliable connectivity.
- **Alternatives:** Online-only, blind last-write-wins.
- **Rationale:** Durable offline learning and safe retries.
- **Consequences:** Sync ordering, duplicate handling, and conflict cases need tests. Keep initial multi-device support simple.

## Pivot note (November 2026)
The POC is offline-only: all learner state is local (AsyncStorage), written through one serialized queue (`src/services/learner/writeQueue.ts`). SQLite and server sync remain the target when accounts are introduced.
