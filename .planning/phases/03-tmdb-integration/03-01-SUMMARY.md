---
phase: 03-tmdb-integration
plan: 01
subsystem: api
tags: [tmdb, typescript, next.js, api-route, fetch]

# Dependency graph
requires:
  - phase: 02-data-model
    provides: TypeScript type patterns, service layer architecture
provides:
  - TMDB API client with typed fetch wrapper
  - TV and movie search functions
  - API route for client-side search access
affects: [03-02 metadata, 04-library, search UI]

# Tech tracking
tech-stack:
  added: []
  patterns: [server-side API proxy, typed fetch wrapper, Bearer token auth]

key-files:
  created:
    - web/lib/tmdb/types.ts
    - web/lib/tmdb/client.ts
    - web/lib/tmdb/search.ts
    - web/app/api/tmdb/search/route.ts
  modified:
    - web/.env.local.example

key-decisions:
  - "Server-side only TMDB calls via API route"
  - "Simple fetch wrapper without retry logic (TMDB limits are generous)"
  - "Combined multi-search sorts by popularity"

patterns-established:
  - "TMDB service functions in lib/tmdb/*.ts"
  - "API routes proxy external APIs to protect secrets"
  - "TMDBError custom error class for TMDB-specific failures"

issues-created: []

# Metrics
duration: 2min
completed: 2026-01-19
---

# Phase 3 Plan 1: TMDB Client and Search Summary

**TMDB API client with typed fetch wrapper and search endpoints for TV shows and movies**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-19T02:55:33Z
- **Completed:** 2026-01-19T02:57:59Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Created typed TMDB client with Bearer token authentication
- Implemented search functions for TV shows, movies, and combined multi-search
- Built API route at /api/tmdb/search with validation and error handling
- API key remains server-side only (verified in build output)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create TMDB client with types** - `37aff9c` (feat)
2. **Task 2: Implement search endpoints** - `39a3070` (feat)

**Plan metadata:** (pending this commit)

## Files Created/Modified

- `web/lib/tmdb/types.ts` - TypeScript types for TMDB search responses
- `web/lib/tmdb/client.ts` - Base fetch wrapper with Bearer token auth
- `web/lib/tmdb/search.ts` - searchTV, searchMovies, searchMulti functions
- `web/app/api/tmdb/search/route.ts` - API route for client-side search
- `web/.env.local.example` - Added TMDB_API_KEY placeholder

## Decisions Made

- Used simple fetch wrapper without retry/caching (TMDB rate limits very generous)
- Combined multi-search fetches TV and movie in parallel, sorts by popularity
- API route validates query, type, and page parameters with proper error responses

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## Next Phase Readiness

- TMDB search ready for use in library management UI
- Next: 03-02 (metadata fetching, watch providers, image helpers)
- API key must be added to .env.local for live testing

---
*Phase: 03-tmdb-integration*
*Completed: 2026-01-19*
