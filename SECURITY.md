# SeaTrace Security

## Credentials

- **Client**: `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` only
- **Never** expose service-role key in client, commits, or logs
- Use `.env` locally; configure EAS secrets for builds

## Row Level Security

Every user-facing table has RLS enabled with explicit policies — no broad `authenticated` read/write grants.

Key protections:
- Users cannot confirm their own reports (DB trigger + RLS insert check)
- Precise coordinates only exposed to report owners via direct `reports` table access
- Public map uses `display_*` coordinates with reduced precision for sensitive wildlife
- Storage uploads restricted to `{userId}/` path prefix

## Storage

- MIME type allowlist: JPEG, PNG, WebP
- Size limits: 8 MB reports, 2 MB avatars
- Private buckets with signed URL access
- No blob URLs stored in database

## Input validation

- Zod schemas on auth and report creation client-side
- Server-side constraints via PostgreSQL CHECK constraints and enums
- Description length capped at 2000 characters

## Privacy

- Sensitive wildlife subcategories auto-flag `sensitive_location`
- Display coordinates rounded to ~1.1 km (2 decimal places) for sensitive reports
- EXIF stripped indirectly via image recompression pipeline
- User home location never stored or inferred

## Safety messaging

Safety and emergency notices shown during reporting — SeaTrace is not an emergency service.

## Abuse prevention (foundation)

- Unique constraint on confirmations per user per report
- Report flags table for user reporting
- Moderation status on reports
- Rate limiting on confirmations architected (24h window in config)

## Audit trail

- `report_status_history` preserves verification state changes
- `user_reputation_events` logs scoring inputs
- Historical observations never silently overwritten

## Recommended pre-launch review

1. Run Supabase Security Advisor after applying migrations
2. Verify storage policies in dashboard
3. Test RLS with two test accounts (self-confirm blocked, cross-user confirm works)
4. Confirm anon key cannot access service-role endpoints
