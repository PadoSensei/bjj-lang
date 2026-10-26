# Database Design

**Status:** Initial logical model; schema migrations are authoritative once created.

## Main entities
- `profiles`: minimal user profile linked to `auth.users`.
- `courses`: source/target language direction and publication/access metadata.
- `user_courses`: enrollment and course-specific progress.
- `units`, `lessons`, `lesson_items`: ordered curriculum.
- `learning_concepts`: language-independent concept identity/category/difficulty.
- `translations`: language-specific text, pronunciation, audio, context.
- `concept_media`: optional image/audio references and attribution.
- `learning_states`: scheduler state per user + concept + course + direction.
- `review_events`: append-only review records, idempotent by client event ID.
- `user_lesson_progress`: lesson completion state.
- `user_daily_activity`: aggregate XP/streak data.
- `user_achievements`: earned achievements.
- `purchases`: verified store transaction record.
- `purchase_events`: idempotent webhook/event processing.
- `entitlements`: access granted to a user.
- `donations`: separate donation records, never conflated with purchases.
- `sync_events`: optional sync audit/processing records.

## Key constraints
- Use UUID primary keys where suitable.
- Use `TIMESTAMPTZ` and UTC for persisted timestamps.
- Use BCP 47 language tags such as `pt-BR` and `en`.
- Unique learning state key: `(user_id, concept_id, course_id, exercise_direction)`.
- Review event client IDs must be unique.
- Validate review rating range.
- Index due review lookup by user and due time.
- RLS for user-owned tables.
- Published content is read-only to normal clients.

## Scheduler representation
Persist a versioned scheduler state (e.g. JSONB) matching the selected FSRS library's supported representation. Do not invent an incompatible state format. Record scheduler version on review events for reproducibility.

## Migration policy
Use ordered SQL migrations. Never rewrite a migration that has already been applied to a shared environment; add a new migration. Review destructive changes explicitly.
