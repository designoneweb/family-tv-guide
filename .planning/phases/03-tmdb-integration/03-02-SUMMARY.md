---
phase: 03-tmdb-integration
plan: 02
subsystem: api
tags: [tmdb, typescript, fetch, metadata, streaming-providers, images]

# Dependency graph
requires:
  - phase: 03-tmdb-integration/01
    provides: TMDB client with typed fetch wrapper
provides:
  - TV and movie detail fetching functions
  - Watch provider availability for streaming services
  - Image URL construction helpers
affects: [04-library, 05-schedule, 07-episode-grid, 08-episode-detail]

# Tech tracking
tech-stack:
  added: []
  patterns: [null-safe returns for missing data, region-based provider lookup]

key-files:
  created:
    - web/lib/tmdb/details.ts
    - web/lib/tmdb/providers.ts
    - web/lib/tmdb/images.ts
  modified:
    - web/lib/tmdb/types.ts

key-decisions:
  - "Return null for 404s instead of throwing"
  - "Default to US region for watch providers"
  - "Hardcode image sizes instead of fetching TMDB configuration"

patterns-established:
  - "Null-safe returns: API functions return null for missing resources"
  - "Image URL helpers use size constants for consistency"

issues-created: []

# Metrics
duration: 3min
completed: 2026-01-19
---

# Phase 3 Plan 2: TMDB Metadata and Images Summary

**TV/movie detail fetching, watch provider lookup, and image URL helpers for complete TMDB integration**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-19T02:59:40Z
- **Completed:** 2026-01-19T03:02:20Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- Added typed detail fetching for TV shows and movies (name, overview, genres, seasons, runtime)
- Implemented watch provider lookup with US region default for streaming availability
- Created image URL helpers with size constants for poster, backdrop, still, and logo images
- All functions handle null/missing data gracefully

## Task Commits

Each task was committed atomically:

1. **Task 1: Add detail types and fetch functions** - `b2eeeb4` (feat)
2. **Task 2: Implement watch providers** - `f85b01e` (feat)
3. **Task 3: Create image URL helpers** - `1c89ab3` (feat)

**Plan metadata:** (pending this commit)

## Files Created/Modified

- `web/lib/tmdb/types.ts` - Added TMDBGenre, TMDBTVDetails, TMDBMovieDetails, TMDBWatchProvider types
- `web/lib/tmdb/details.ts` - getTVDetails and getMovieDetails functions
- `web/lib/tmdb/providers.ts` - getTVWatchProviders and getMovieWatchProviders functions
- `web/lib/tmdb/images.ts` - TMDB_IMAGE_SIZES, getTMDBImageUrl, convenience wrappers

## Decisions Made

- Return null for 404 errors instead of throwing - cleaner handling of missing resources
- Default to US region for watch providers - most common use case
- Hardcode image sizes - TMDB sizes rarely change, avoids extra configuration API call

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## Next Phase Readiness

- Phase 3 (TMDB Integration) complete
- All TMDB modules ready: search, details, providers, images
- Ready for Phase 4 (Library Management) to use TMDB data for add/display features

---
*Phase: 03-tmdb-integration*
*Completed: 2026-01-19*
