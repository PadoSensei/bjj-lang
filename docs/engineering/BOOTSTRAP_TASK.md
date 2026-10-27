# Bootstrap Task — M0

## Objective
Create the minimum professional engineering foundation for BJJ_Lang.

## Scope
- Initialize Expo + React Native + TypeScript app using an Expo-compatible supported SDK.
- Configure Expo Router.
- Establish pnpm workspace only if the package structure is actually needed; do not over-scaffold unused packages.
- Add strict TypeScript, ESLint, Prettier.
- Add baseline app shell and route.
- Add `.env.example` and safe environment validation.
- Add GitHub Actions for install, lint, typecheck, tests, Expo doctor.
- Add Supabase local config/migration folder if Supabase CLI is part of developer setup.
- Add initial test runner.
- Ensure README setup instructions are executable and accurate.

## Non-goals
- Implement authentication, learning screens, payments, or full schema.
- Add a custom backend server.
- Add unused dependencies or placeholder feature modules.
- Commit secrets or real user data.

## Acceptance criteria
- [ ] App starts locally using documented commands.
- [ ] Expo Router renders a minimal BJJ_Lang shell.
- [ ] TypeScript strict mode is enabled.
- [ ] Lint, typecheck, and test commands exist.
- [ ] CI workflow runs on pull requests.
- [ ] `.env.example` contains only public client configuration placeholders.
- [ ] No secret key is present in repository.
- [ ] Docs accurately describe setup and checks.
- [ ] PR is focused and references this task.

## Agent instructions
Read `AGENTS.md`, `docs/architecture/SYSTEM_ARCHITECTURE.md`, and `docs/engineering/DEVELOPMENT_WORKFLOW.md` first. Inspect current Expo/Supabase compatibility before selecting versions. Report changed files, commands run, results, and any unresolved setup choices.
