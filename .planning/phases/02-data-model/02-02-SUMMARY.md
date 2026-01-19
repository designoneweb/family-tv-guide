---
phase: 02-data-model
plan: 02
subsystem: database
tags: [supabase, postgresql, rls, row-level-security, auth]

# Dependency graph
requires:
  - phase: 02-data-model
    provides: 6 MVP tables (households, profiles, tracked_titles, schedule_entries, tv_progress, episode_blurbs)
provides:
  - Row Level Security enabled on all 6 tables
  - owner_id column linking households to auth.users
  - get_user_household_id() helper function
  - CRUD policies for household-scoped data isolation
  - Public read access for episode_blurbs (shared content)
affects: [02-03 CRUD, 03 TMDB, 04 Library, 05 Schedule, 06 Progress, auth flows]

# Tech tracking
tech-stack:
  added: []
  patterns: [RLS policies, SECURITY DEFINER functions, auth.uid() integration]

key-files:
  created:
    - web/supabase/migrations/20260119000000_add_rls_policies.sql
  modified:
    - web/lib/database.types.ts

key-decisions:
  - "Single owner_id per household (one user owns each household)"
  - "get_user_household_id() helper with SECURITY DEFINER for efficient policy checks"
  - "episode_blurbs public read (shared cached content)"

patterns-established:
  - "RLS pattern: household-scoped tables use get_user_household_id()"
  - "RLS pattern: tv_progress uses subquery through profiles for household ownership"
  - "Shared content tables allow public SELECT, restrict writes"

issues-created: []

# Metrics
duration: 3min
completed: 2026-01-19
---

# Phase 2 Plan 2: RLS Policies Summary

**Row Level Security policies for all 6 tables with owner_id linking households to Supabase auth and get_user_household_id() helper for efficient policy checks**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-19T02:15:00Z
- **Completed:** 2026-01-19T02:18:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Added owner_id column to households table linking to auth.users
- Created get_user_household_id() SECURITY DEFINER helper function
- Enabled RLS on all 6 tables
- Created SELECT/INSERT/UPDATE/DELETE policies for households, profiles, tracked_titles, schedule_entries
- Created tv_progress policies with profile subquery for household ownership verification
- Enabled public read access for episode_blurbs (shared cached content)
- Updated TypeScript types with owner_id field

## Task Commits

Each task was committed atomically:

1. **Task 1: Add owner_id to households and create RLS migration** - `aa0fb81` (feat)
2. **Task 2: Update TypeScript types with owner_id** - `f46a741` (feat)

**Plan metadata:** (pending this commit)

## Files Created/Modified

- `web/supabase/migrations/20260119000000_add_rls_policies.sql` - RLS migration with owner_id, helper function, and all policies
- `web/lib/database.types.ts` - Added owner_id to Household Row/Insert/Update types

## Decisions Made

- Single owner_id per household (one user owns each household) - simplest model for family use
- SECURITY DEFINER on helper function allows efficient policy checks without exposing households table
- episode_blurbs remain publicly readable since they're cached TMDB/AI content shared across all users

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## Next Phase Readiness

- RLS policies ready to apply alongside schema migration
- All user data now scoped to household ownership
- Households require owner_id on INSERT (auth.uid() must be set)
- Next: 02-03 (CRUD utilities) or remaining plans in Phase 2

---
*Phase: 02-data-model*
*Completed: 2026-01-19*
