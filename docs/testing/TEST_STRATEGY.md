# Test Strategy

**Status:** Current (November 2026). Write the failing test first, then the change.

## Applies now (POC)

### Content integrity
- Every referenced ID exists; IDs are unique across kinds; existing IDs never change (`__tests__/curriculum/CurriculumIntegrity.test.tsx`).
- From P1-2: scenarios have reachable endings and no dangling links; sentences respect the belt's level rules (`docs/content/CURRICULUM.md`); every item has Portuguese support text.

### Learner state and persistence
- Each store: empty, round trip, malformed data, storage read and write errors (`__tests__/services/*Storage.test.ts`).
- Hydration: screens and hooks behave correctly when stored progress is still loading and after it loads, using a real launch (no injected props).
- Write queue: order, failure isolation, waiting for hydration (`__tests__/services/writeQueue.test.ts`); concurrent and early writes in the provider never lose data.
- Persistence across a remount for each store.

### Direction isolation
- Isolation in **both** directions: reviewing in one deck never changes the other deck's record or history (`__tests__/context/CourseContext.isolation.test.tsx`).
- After P1-3: encounters enqueue into both decks; the other deck is untouched by reviews (ADR-009).

### Pure engines (P1–P3)
- Encounter enqueue policy, sentence-builder and dialogue-completion evaluators, scenario reducer: plain unit tests, no React.

### Cross-mode integration (P2-6, P3-3)
- One test per belt slice: read, tap, play, finish the adventure, then both decks contain exactly the expected items, and everything survives a remount (`expo-router/testing-library`).

### UI and accessibility
- Loading, empty and error states for every screen.
- Tappable words and choices have roles, labels and minimum touch targets.

### Confirm tests can fail
For behaviour fixes, briefly break the fix locally and check the new tests fail, then restore it.

## Quality gates
`pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm run doctor`, `pnpm run build:web`. Document the exact command and result; do not claim tests passed unless run. Jest runs with `maxWorkers: '50%'`. To wait for stored progress or a background save, use `flushAsync()` from `test-utils/flushAsync.ts`, not `waitFor`: the storage mock is promise-only, so flushing is exact and does not depend on machine speed. `waitFor` polls the clock and can fail on an overloaded machine.

## Deferred (after the POC)
- FSRS adapter and state serialization (ADR-004).
- Supabase RLS: user A cannot read/write user B data.
- Sync duplicate/retry and ordering behaviour.
- Purchase webhook duplicate, invalid, refund/revoke scenarios.
- Account deletion cleanup.
- Maestro E2E for critical mobile journeys.
