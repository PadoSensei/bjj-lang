# ADR-002: Backend Platform

- **Status:** Deferred (November 2026)
- **Decision:** Supabase (PostgreSQL, Auth, Storage, Edge Functions).
- **Context:** Need managed auth/data/storage and a fast launch without operating a custom server.
- **Alternatives:** Custom NestJS/Fastify API, Firebase.
- **Rationale:** Relational curriculum/progress model, SQL/RLS, lower initial operational burden.
- **Consequences:** RLS and migration discipline are critical; privileged logic belongs in Edge Functions. Reassess if domain needs outgrow this setup.

## Pivot note (November 2026)
The English-learning POC (White Belt slice, Blue Belt demo) runs local-only on AsyncStorage. Supabase remains the intended backend once accounts, sync or paid tiers are scheduled. No backend work is planned in P0–P3.
