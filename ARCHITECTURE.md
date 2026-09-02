# SeaTrace Architecture

## Overview

SeaTrace is a mobile-first Expo application backed by Supabase. The client uses TanStack Query for server state and minimal Zustand for ephemeral report-flow state. All persistent data flows through Supabase with Row Level Security enforced on every user-facing table.

```
┌─────────────────────────────────────────────────────────┐
│                    Expo Client (RN/Web)                  │
│  ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐ │
│  │ Screens │  │ Components│  │  Hooks  │  │  Stores  │ │
│  └────┬────┘  └────┬─────┘  └────┬────┘  └────┬─────┘ │
│       └────────────┴─────────────┴────────────┘        │
│                         │                               │
│              ┌──────────▼──────────┐                    │
│              │   API Layer (src/api)│                    │
│              └──────────┬──────────┘                    │
└─────────────────────────┼───────────────────────────────┘
                          │ HTTPS (anon key + JWT)
              ┌───────────▼───────────┐
              │       Supabase        │
              │  Auth │ PostGIS │ RLS │
              │  Storage │ Realtime  │
              └───────────────────────┘
```

## Client layers

| Layer | Responsibility |
|-------|----------------|
| `app/` | Routes and screen composition (Expo Router) |
| `src/components/` | Reusable UI, map, report, auth components |
| `src/domain/` | Pure business logic (payload building, confirmation rules) |
| `src/api/` | Supabase queries and mutations |
| `src/hooks/` | React Query wrappers, auth, location |
| `src/services/` | Draft queue, image compression, draft sync |
| `src/constants/` | Brand, categories, copy — **rename product here** |
| `src/theme/` | Design tokens, light/dark themes |
| `src/features/analytics/` | Vendor-agnostic analytics abstraction |

## Navigation

- Root stack: onboarding → auth → tabs
- Report flow: modal stack (photo → location → category → details → review → success)
- Bottom tabs: Map, Explore, **Report** (prominent FAB), Activity, Profile

## Data flow: creating a report

1. User captures photo → compressed via `expo-image-manipulator`
2. GPS location captured/adjusted on mini-map
3. Category selected from centralised taxonomy
4. Optional details with progressive disclosure
5. Review → `createReport()` inserts row (trigger syncs PostGIS geography + display coords)
6. Photo uploaded to `report-images/{userId}/{reportId}/...`
7. `report_media` row inserted
8. On failure → draft saved to AsyncStorage, retried by `useDraftSync`

## Geospatial loading

Reports are **never** downloaded in full and filtered client-side. The map calls `reports_in_viewport()` RPC with bounding box + optional category filter. Marker clustering uses Supercluster on the client for render performance only.

## Authentication

Supabase Auth with AsyncStorage session persistence. Profile auto-created via `handle_new_user` trigger. Structured for future Apple/Google OAuth via Supabase provider config.

## Offline resilience

Draft queue in AsyncStorage (`@seatrace/report_drafts`). Statuses: `pending_upload`, `failed`. Background sync every 30s when online and authenticated.

## Future: SeaTrace Intelligence

Database schema supports events clustering, expert verification, organisation accounts, moderation, and analytics events without redesign. Enterprise dashboard is not built in M1.

## Future: AI

No V1 dependency. Metadata JSONB fields and service abstractions allow future species/pollution suggestions, duplicate detection, and anomaly scoring behind replaceable providers.

## Brand centralisation

To rename the product, edit `src/constants/brand.ts`, `src/constants/copy.ts`, and `app.json` display name only.
