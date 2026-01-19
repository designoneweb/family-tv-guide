# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-18)

**Core value:** Fast "What are we watching tonight?" — the Guide page must load quickly and show exactly what's scheduled with the next episode ready to watch.
**Current focus:** Phase 2 — Data Model

## Current Position

Phase: 2 of 10 (Data Model)
Plan: 4 of 5 in current phase
Status: In progress
Last activity: 2026-01-19 — Completed 02-04-PLAN.md

Progress: ██░░░░░░░░ 22%

## Performance Metrics

**Velocity:**
- Total plans completed: 7
- Average duration: 6.9 min
- Total execution time: 48 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1. Foundation | 3 | 10 min | 3.3 min |
| 2. Data Model | 4 | 38 min | 9.5 min |

**Recent Trend:**
- Last 5 plans: 02-01 (2 min), 02-02 (2 min), 02-03 (1 min), 02-04 (33 min)
- Trend: ↑ 02-04 longer (migration issue + verification)

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

### Deferred Issues

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-01-19
Stopped at: Completed 02-04-PLAN.md
Resume file: None
