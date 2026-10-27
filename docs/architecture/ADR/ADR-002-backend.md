# ADR-002: Backend Platform

- **Status:** Proposed
- **Decision:** Supabase (PostgreSQL, Auth, Storage, Edge Functions).
- **Context:** Need managed auth/data/storage and a fast launch without operating a custom server.
- **Alternatives:** Custom NestJS/Fastify API, Firebase.
- **Rationale:** Relational curriculum/progress model, SQL/RLS, lower initial operational burden.
- **Consequences:** RLS and migration discipline are critical; privileged logic belongs in Edge Functions. Reassess if domain needs outgrow this setup.
