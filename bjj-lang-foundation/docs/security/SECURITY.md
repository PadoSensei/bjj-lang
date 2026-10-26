# Security and Privacy

## Threat assumptions
Mobile clients can be modified; all client input is untrusted. Users may be minors. Purchase callbacks and client-side progress are not authoritative.

## Required controls
- Supabase RLS for all user-owned records.
- Never ship service-role keys or private credentials.
- Validate Edge Function payloads and authenticated identity.
- Server-side verification for purchase/entitlement changes.
- Idempotent webhook and sync processing.
- Account deletion and retention behavior documented.
- Collect minimum personal data; avoid exact birth date unless justified.
- No public profiles, chat, or leaderboards for minors in MVP.
- Analytics events must not include answer text, sensitive identifiers, or child personal data.
- Review third-party SDK data collection and store disclosures.
- Use separate staging and production projects.
- Restrict administrative access and rotate credentials if exposed.

## Launch gates
Before public release, confirm applicable child privacy, parental consent, regional privacy, consumer/payment, and app-store requirements with qualified guidance. This document is engineering guidance, not legal advice.
