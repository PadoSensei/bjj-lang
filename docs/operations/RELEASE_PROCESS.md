# Release Process

## Environments
- Local development.
- Preview/staging with non-production data.
- Production with restricted access.

## Before release
- Confirm release scope and known issues.
- Run CI and critical E2E flows.
- Verify RLS and account deletion.
- Test purchase/restore in store sandbox.
- Check app permissions, privacy labels, and SDK disclosures.
- Confirm migration order and rollback/recovery plan.
- Verify Sentry and analytics configuration.
- Build with EAS production profile.
- Submit to stores; account for review delays.

## After release
- Monitor crash/error rates and sync failures.
- Monitor purchase and restore outcomes.
- Review support/content reports.
- Keep a release note and tag.
- Roll back or pause rollout if critical issues arise.

## Secrets
Use GitHub/EAS/Supabase secret management. Never commit production keys. Separate values by environment.
