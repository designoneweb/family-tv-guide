---
phase: 08-episode-detail
plan: 01
subsystem: api
tags: [tmdb, credits, cast, api-route, typescript]

# Dependency graph
requires:
  - phase: 03-tmdb-integration
    provides: TMDB client, fetch patterns, types foundation
  - phase: 06-progress-tracking
    provides: Episode API route pattern
provides:
  - Episode credits fetch function (getEpisodeCredits)
  - TMDBCastMember, TMDBCrewMember, TMDBGuestStar, TMDBEpisodeCredits types
  - Profile image URL helper (getProfileUrl)
  - Episode credits API route (/api/tmdb/tv/.../credits)
affects: [08-episode-detail, 09-person-pages]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Credits types extend TMDB type system"
    - "Profile images use same size pattern as posters/stills"

key-files:
  created:
    - web/app/api/tmdb/tv/[id]/season/[seasonNumber]/episode/[episodeNumber]/credits/route.ts
  modified:
    - web/lib/tmdb/types.ts
    - web/lib/tmdb/details.ts
    - web/lib/tmdb/images.ts

key-decisions:
  - "Profile image sizes: small (w45), medium (w185), large (h632)"
  - "getEpisodeCredits returns null for 404 (consistent with other TMDB functions)"

patterns-established:
  - "Credits API follows same nested route pattern as episode API"
  - "Cast/crew types include both series cast and guest stars"

issues-created: []

# Metrics
duration: 3min
completed: 2026-01-19
---

# Phase 8 Plan 1: Episode Credits Summary

**TMDB episode credits integration with types, fetch function, profile image helpers, and client API route**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-19T19:58:48Z
- **Completed:** 2026-01-19T20:02:28Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Added comprehensive TypeScript types for cast, crew, and guest stars
- Created getEpisodeCredits fetch function following established TMDB patterns
- Added profile image size constants and getProfileUrl helper
- Built credits API route at /api/tmdb/tv/[id]/season/[seasonNumber]/episode/[episodeNumber]/credits

## Task Commits

Each task was committed atomically:

1. **Task 1: Add episode credits types and fetch function** - `c376be6` (feat)
2. **Task 2: Add episode credits API route** - `eb53a17` (feat)

**Plan metadata:** (next commit)

## Files Created/Modified

- `web/lib/tmdb/types.ts` - Added TMDBCastMember, TMDBCrewMember, TMDBGuestStar, TMDBEpisodeCredits interfaces
- `web/lib/tmdb/details.ts` - Added getEpisodeCredits function
- `web/lib/tmdb/images.ts` - Added profile image sizes and getProfileUrl helper
- `web/app/api/tmdb/tv/[id]/season/[seasonNumber]/episode/[episodeNumber]/credits/route.ts` - New API route for credits

## Decisions Made

- Profile image sizes: small (w45), medium (w185), large (h632) - matches TMDB standard sizes
- getEpisodeCredits returns null for 404 - consistent with getTVEpisode and other TMDB functions

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Next Phase Readiness

- Episode credits API ready for consumption by episode detail page
- Types available for displaying cast, crew, and guest stars
- Profile image helper ready for actor/crew headshots
- Ready for remaining Phase 8 plans (episode detail UI)

---
*Phase: 08-episode-detail*
*Completed: 2026-01-19*
