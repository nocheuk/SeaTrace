# SeaTrace Roadmap

## Milestone 1 — MVP Foundation ✅ (this release)

Functional citizen reporting platform with map, auth, report flow, confirmations, explore, profile, offline drafts, and production-minded backend schema.

## Milestone 2 — Enhanced community & reliability

- Push notifications (confirmations, nearby alerts)
- Activity feed with real data
- Saved reports UI
- Notification settings
- Improved marker icons per category
- Multi-photo reports (UI + upload)
- Supabase Realtime for live map updates
- EAS production builds + TestFlight/Play internal testing
- RLS integration tests against local Supabase
- Region-specific emergency reporting guidance config

## Milestone 3 — Event intelligence

- Automatic event clustering (geography + time window)
- Event detail pages (“12 observations — Bournemouth fish mortality”)
- Trend indicators on Explore (“jellyfish reports above normal”)
- Heatmap layer for map
- CSV / GeoJSON export (admin foundation)

## Milestone 4 — SeaTrace Intelligence (enterprise)

- Organisation accounts and member roles
- Professional dashboard: live map, filters, exports, API access
- Expert verification workflow
- Moderation queue
- Research dataset access with provenance metadata
- Anomaly detection alerts for subscribed organisations

## Milestone 5 — AI-assisted reporting (optional)

- Species / pollution type suggestions (clearly labelled)
- Duplicate report detection
- Image quality / spam screening
- Provider-agnostic AI service abstraction

## Technical debt / improvements

- Dark mode UI polish
- Web/PWA optimisation
- Full offline report creation with background sync
- Apple / Google sign-in
- Performance profiling for large marker counts
- Comprehensive E2E tests (Detox / Maestro)
