# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-18)

**Core value:** Fast "What are we watching tonight?" — the Guide page must load quickly and show exactly what's scheduled with the next episode ready to watch.
**Current focus:** Phase 3 — TMDB Integration

## Current Position

Phase: 3 of 10 (TMDB Integration)
Plan: 1 of TBD in current phase
Status: In progress
Last activity: 2026-01-19 — Completed 03-01-PLAN.md (TMDB client and search)

Progress: ██░░░░░░░░ 25%

## Performance Metrics

**Velocity:**
- Total plans completed: 9
- Average duration: 6.7 min
- Total execution time: 60 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1. Foundation | 3 | 10 min | 3.3 min |
| 2. Data Model | 5 | 48 min | 9.6 min |
| 3. TMDB Integration | 1 | 2 min | 2.0 min |

**Recent Trend:**
- Last 5 plans: 02-03 (1 min), 02-04 (33 min), 02-05 (10 min), 03-01 (2 min)
- Trend: Fast execution continues

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

### Deferred Issues

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-01-19
Stopped at: Completed 03-01-PLAN.md (TMDB client and search)
Resume file: None
Next: 03-02 (metadata fetching, watch providers, image helpers)
