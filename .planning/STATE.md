# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-18)

**Core value:** Fast "What are we watching tonight?" — the Guide page must load quickly and show exactly what's scheduled with the next episode ready to watch.
**Current focus:** Phase 8 in progress — Episode Detail

## Current Position

Phase: 8 of 10 (Episode Detail)
Plan: 1 of TBD in current phase
Status: In progress
Last activity: 2026-01-19 — Completed 08-01-PLAN.md (Episode Credits Integration)

Progress: ██████████ 70% (21 of 30 estimated plans)

## Performance Metrics

**Velocity:**
- Total plans completed: 21
- Average duration: 10.7 min
- Total execution time: 225 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1. Foundation | 3 | 10 min | 3.3 min |
| 2. Data Model | 5 | 48 min | 9.6 min |
| 3. TMDB Integration | 2 | 5 min | 2.5 min |
| 4. Library Management | 3 | 23 min | 7.7 min |
| 5. Schedule System | 3 | 57 min | 19.0 min |
| 6. Progress Tracking | 3 | 71 min | 23.7 min |
| 7. Episode Grid | 1 | 8 min | 8.0 min |
| 8. Episode Detail | 1 | 3 min | 3.0 min |

**Recent Trend:**
- Last 5 plans: 06-02 (12 min), 06-03 (56 min), 07-01 (8 min), 08-01 (3 min)

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

| Phase | Decision | Rationale |
|-------|----------|-----------|
| 01-01 | Used Next.js 16.1.3 (latest stable) | create-next-app installs latest |
| 01-01 | Dark mode via className="dark" | Tailwind v4 compatibility |
| 01-02 | @supabase/ssr for auth | Current standard, not deprecated auth-helpers |
| 01-02 | Cookie-based sessions | SSR-compatible, middleware refresh |
| 01-03 | Route groups: (marketing) public, /app protected | Clear URL structure |
| 01-03 | Auth check in layout with redirect | Protects all /app/* routes |
| 02-01 | UUID primary keys with gen_random_uuid() | Supabase convention |
| 02-01 | ON DELETE CASCADE on all foreign keys | Clean household deletion |
| 02-02 | Single owner_id per household | One user owns each household |
| 02-02 | get_user_household_id() helper with SECURITY DEFINER | Efficient RLS policy checks |
| 02-02 | episode_blurbs public read | Shared cached content |
| 02-03 | SECURITY DEFINER on trigger function | Bypasses RLS during provisioning |
| 02-03 | Service layer in lib/services/ | Typed data access pattern |
| 02-04 | localStorage for profile persistence | Simple, no extra DB calls |
| 02-04 | ProfileGuard for redirect logic | Client-side redirect when no profile |
| 02-05 | Avatar as color picker (8 presets) | Simpler than image upload |
| 02-05 | AlertDialog for delete confirmation | Accessible, consistent UX |
| 03-01 | Server-side only TMDB calls via API route | Protects API key |
| 03-01 | Simple fetch wrapper without retry | TMDB limits are generous |
| 03-01 | Combined multi-search sorts by popularity | Better UX for search results |
| 03-02 | Return null for 404s instead of throwing | Cleaner handling of missing resources |
| 03-02 | Default to US region for watch providers | Most common use case |
| 03-02 | Hardcode image sizes | TMDB sizes rarely change |
| 04-01 | Upsert for addTitle with onConflict | Graceful duplicate handling |
| 04-01 | API route returns 404 for no household | Clearer error than 500 |
| 04-02 | Debounce 300ms for search input | Balances responsiveness vs API calls |
| 04-02 | Parallel library status checks | Fetch status for all results simultaneously |
| 04-02 | TitleCard as reusable component | Will be used in library display page |
| 05-01 | Gaps in slot_order allowed | Simplifies deletion, avoids race conditions |
| 05-01 | Shift-then-update for reorder | Avoids unique constraint conflicts |
| 05-01 | PATCH handles both reorder and move-day | Single endpoint, weekday takes precedence |
| 05-02 | Up/down buttons for reorder | Simpler than drag-drop for MVP |
| 05-02 | 3-step swap via temp slot | Avoids unique constraint conflicts during swap |
| 05-02 | Dialog for add, AlertDialog for confirm | Consistent component usage patterns |
| 05-03 | Schedule API returns camelCase fields | Frontend consistency, matches JS conventions |
| 05-03 | AppNav component with responsive design | Icons on mobile, labels on desktop |
| 06-01 | Default to S1E1 if no progress exists | Simpler than requiring initialization |
| 06-01 | Return current position when show complete | UI can detect "caught up" state |
| 06-02 | Client-facing TMDB API routes under /api/tmdb/* | Enables client-side episode fetching for Mark Watched |
| 06-02 | Optimistic UI for Mark Watched | Updates display immediately, then persists |
| 06-03 | Clickable episode text opens Jump dialog | Cleaner UX than separate menu button |
| 06-03 | Cascading dropdowns with season reset | Changing season resets episode to 1 |
| 07-01 | Tabs for ≤6 seasons, dropdown for more | Cleaner UX for most shows |
| 07-01 | 16:9 aspect ratio for episode stills | Matches TMDB still format |
| 07-01 | Episode badge overlay E5 format | Concise and scannable |
| 08-01 | Profile image sizes: small (w45), medium (w185), large (h632) | TMDB standard sizes |
| 08-01 | getEpisodeCredits returns null for 404 | Consistent with other TMDB functions |

### Deferred Issues

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-01-19
Stopped at: Completed 08-01-PLAN.md (Episode Credits Integration)
Resume file: None
Next: Continue Phase 8 Episode Detail
