# Test Strategy

## Unit tests
- FSRS adapter/state serialization.
- Review rating transitions.
- Exercise generation and answer evaluation.
- Course progression/unlock rules.
- XP and achievements.
- Sync event idempotency logic.

## Integration tests
- Supabase RLS: user A cannot read/write user B data.
- Sync function duplicate/retry and ordering behavior.
- Purchase webhook duplicate, invalid, refund/revoke scenarios.
- Account deletion cleanup.

## UI/component tests
- Onboarding direction selection.
- Flashcard reveal and rating.
- Loading/error/empty states.
- Accessibility labels and controls.

## E2E
Use Maestro for critical mobile journeys:
1. Onboard/select direction.
2. Complete a lesson.
3. Review due card.
4. Offline review and reconnect sync.
5. Purchase/restore in sandbox.

## Quality gates
Lint, typecheck, unit tests, migration validation, Expo configuration/doctor checks. Document exact command and result; do not claim tests passed unless run.
