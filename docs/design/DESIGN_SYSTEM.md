# Design System

**Status:** Direction draft

## Product feel
Friendly, energetic, contemporary BJJ academy; playful enough for younger learners and credible for adult practitioners. Do not clone another language-learning brand's distinctive artwork or UI.

## Principles
- Mobile-first, one-handed primary interactions.
- Clear hierarchy and readable type.
- Accessible contrast and touch targets.
- Encouraging feedback without shame/punitive streaks.
- Belt colors indicate app learning milestones, not real BJJ rank.
- Support reduced motion and screen readers.
- Avoid public social ranking of minors.

## Initial belt tokens (provisional)
- White: `#F8FAFC`
- Blue: `#2563EB`
- Purple: `#7C3AED`
- Brown: `#92400E`
- Black: `#18181B`

Validate contrast, especially for white belt surfaces. Define semantic colors separately from belt identity.

## Core components
Button, Card, ProgressBar, BeltBadge, LessonNode, Flashcard, AudioControl, AnswerRating, EmptyState, ErrorState, LoadingState, Modal/Sheet.

### Pivot components (P1–P3)
- **ModeTile:** one of the four modes on the belt hub (Ler, Praticar, Aventura, Revisar), with completion and due count.
- **StoryPage** and **TappableToken:** story text where each reviewable word is a button (`accessibilityRole="button"`, label such as "{word}, toque para ver o significado", minimum 44pt / 48dp touch target).
- **GlossSheet:** the tap-to-understand sheet; Portuguese explanation for White Belt.
- **SentenceTiles:** tap tiles to build a sentence; tiles can be removed before checking.
- **ChoiceCard:** an adventure choice with feedback shown before continuing.
- **DeckToggle:** switch between the "Português → English" and "English → Português" flashcard decks.

## Language
The White Belt interface is Portuguese (ADR-009). Explanations for beginners are never in English above the learner's level.

## Core screens
POC: belt hub (home), story reader, game set, adventure, flashcards with deck toggle, review history, lesson session and completion.
Later: onboarding, progress, profile/settings, purchase/restore, privacy/account deletion.

## Interaction
Review ratings: Again, Hard, Good, Easy. Provide immediate clear feedback and audio controls. Motion is purposeful and nonessential.
