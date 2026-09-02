# SeaTrace Database

## Extensions

- **PostGIS** — geospatial indexing and queries
- **uuid-ossp** — UUID generation

## Core tables

| Table | Purpose |
|-------|---------|
| `profiles` | User public profile linked to `auth.users` |
| `reports` | Coastal observations with lat/lng + geography points |
| `report_media` | Image references in Supabase Storage |
| `report_confirmations` | Community verification (unique per user per report) |
| `report_status_history` | Audit trail for status changes |
| `events` | Event clustering foundation |
| `event_reports` | Many-to-many reports ↔ events |
| `saved_reports` | User bookmarks |
| `notifications` | In-app notification foundation |
| `user_reputation_events` | Reputation scoring audit log |
| `moderation_actions` | Moderation audit |
| `organisation_accounts` | Future org/intelligence accounts |
| `organisation_members` | Org membership |
| `expert_verifications` | Expert verification records |
| `species` | Species reference data |
| `report_flags` | User flags |
| `analytics_events` | Optional server-side analytics |

## Reports schema highlights

- `latitude` / `longitude` — precise coords (RLS: owner only for private queries)
- `display_latitude` / `display_longitude` — public-facing, auto-obscured when `sensitive_location = true`
- `location` / `display_location` — PostGIS geography points (auto-synced via trigger)
- `status` — `unverified` → `community_confirmed` → `verified` → `resolved` / `rejected`
- `moderation_status` — `pending`, `approved`, `flagged`, `removed`

## Geospatial functions

### `reports_in_viewport(min_lat, min_lng, max_lat, max_lng, filter_group?, verified_only?, since?)`

Returns rows from `reports_public` view within bounding box. Limited to 500 results.

### `nearby_reports(lat, lng, radius_km?, limit_count?)`

PostGIS `ST_DWithin` query on display locations.

### `get_report_public(report_id)`

Single report from public view.

## Triggers

| Trigger | Action |
|---------|--------|
| `on_auth_user_created` | Creates profile row |
| `reports_sync_geography` | Syncs geography + obscures sensitive coords |
| `reports_status_history` | Logs status changes |
| `report_confirmations_after_insert` | Updates count, blocks self-confirm, promotes to community_confirmed at 3+ |
| `reports_after_insert` | Increments contribution count + reputation event |

## Row Level Security summary

| Table | SELECT | INSERT | UPDATE |
|-------|--------|--------|--------|
| profiles | Public | — | Own only |
| reports | Approved public OR own | Auth, own user_id | Own only |
| report_media | Approved reports | Own reports | — |
| report_confirmations | Authenticated | Auth, not own report | — |
| saved_reports | Own | Own | Own |
| notifications | Own | — | Own |

Storage buckets `report-images` and `avatars` scoped to `{userId}/` path prefix.

## Migrations

Apply in filename order under `supabase/migrations/`.

## Seed data

`supabase/seed.sql` inserts 8 sample reports around Bournemouth/Poole. Requires a valid auth user UUID — replace the placeholder before running.

## Indexes

- GIST on `reports.location` and `reports.display_location`
- B-tree on `observed_at`, `category`, `status`, `user_id`
- Composite on `report_media(report_id, sort_order)`
