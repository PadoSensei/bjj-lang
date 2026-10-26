# API Strategy

Use Supabase's typed client for ordinary authenticated, user-scoped reads/writes under RLS. Use Edge Functions for privileged or multi-step workflows.

## Direct queries
- Read published courses/units/lessons/translations.
- Read own learning state, lesson progress, entitlements.
- Update permitted profile/preferences.

## Edge Functions (planned contracts)
- `sync-progress`: accepts idempotent review and lesson events; validates identity, ownership, payload, and ordering; returns accepted/rejected event IDs and canonical state.
- `complete-lesson`: validates completion and awards progression server-side where abuse prevention requires it.
- `purchase-webhook`: verifies provider/store event, deduplicates, updates purchase and entitlement records.
- `delete-account`: authenticated deletion workflow and cleanup.
- Donation function/provider integration only after legal/payment requirements are confirmed.

## Contract rules
- Validate input with Zod.
- Derive user identity from verified auth context, never request body.
- Use stable error codes and safe messages.
- Idempotency for retries.
- Avoid returning unnecessary personal data.
- Do not expose Supabase service-role credentials to the app.
- Document request/response schemas and behavior in code/docs before implementation.
