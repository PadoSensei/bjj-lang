# System Architecture

**Status:** Proposed baseline

## Shape
A feature-oriented Expo application backed by Supabase. Keep a modular monolith; do not introduce a separately deployed API server for the MVP without an ADR.

## Layers
1. Presentation: Expo Router screens and UI components.
2. Application: use cases and orchestration.
3. Domain: learning rules, exercise definitions, progression policy, scheduler interface.
4. Infrastructure: Supabase, SQLite, audio, purchase SDK, analytics, monitoring.

Dependencies point inward. Domain logic must not import React Native, Expo, Supabase, or persistence libraries.

## Client
- Expo + React Native + TypeScript.
- Expo Router.
- TanStack Query for remote/cache state.
- Zustand only for appropriate client/UI state.
- SQLite for local content, learning state, and pending event queue.
- Zod for runtime validation at boundaries.

## Backend
- Supabase Auth.
- PostgreSQL as canonical shared store.
- RLS for user-owned data.
- Storage for media/audio.
- Edge Functions for privileged workflows, purchase events, account deletion, and sync validation.

## Data principles
- Content entities are distinct from learner state.
- Concept identity is language-independent.
- Translation and exercise direction are explicit.
- Review events are append-only and idempotent.
- Entitlements are distinct from purchase transactions.
- Store only necessary personal data.

## Offline sync
Local review writes are durable first. Each event has a client-generated unique ID. Sync is retryable and idempotent. Server returns canonical state; do not use blind last-write-wins for scheduler state.

## Observability
Use Sentry for errors and PostHog for product analytics only after event/privacy review. Never send lesson answer text, child personal data, credentials, or sensitive identifiers to analytics.

## Environments
Separate local, preview/staging, and production Supabase projects and app configuration. Never use production user data as seed/test data.

## Scaling
Start with one application and managed backend. Revisit service boundaries only when demonstrated requirements justify them.
