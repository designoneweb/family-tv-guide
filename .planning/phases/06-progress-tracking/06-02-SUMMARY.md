---
phase: 06-progress-tracking
plan: 02
subsystem: ui
tags: [tonight, progress, mark-watched, episode-display, tmdb]

requires:
  - phase: 06-01
    provides: Progress service and API routes
  - phase: 05-03
    provides: Tonight view foundation
provides:
  - Episode info display on Tonight view
  - Mark Watched functionality with optimistic UI
  - TMDB client-side API routes for episode data
affects: [episode-grid, schedule-view, library-view]

tech-stack:
  added: []
  patterns:
    - Optimistic UI updates with loading states
    - TMDB data fetching for episode metadata
    - Client-side API routes for TMDB episode/season details

key-files:
  created:
    - web/app/api/tmdb/tv/[id]/route.ts
    - web/app/api/tmdb/tv/[id]/season/[seasonNumber]/route.ts
    - web/app/api/tmdb/tv/[id]/season/[seasonNumber]/episode/[episodeNumber]/route.ts
  modified:
    - web/app/api/schedule/route.ts
    - web/app/app/tonight/tonight-client.tsx
    - web/components/title-card.tsx

key-decisions:
  - "Created client-facing TMDB API routes for TV/season/episode details"
  - "Optimistic UI updates episode display immediately on Mark Watched"

patterns-established:
  - "Mark Watched pattern with progress advance and optimistic UI"
  - "TMDB client API routes under /api/tmdb/*"

issues-created: []
duration: 12min
completed: 2026-01-19
---

# Phase 6 Plan 2: Progress UI Summary

**Tonight view enhanced with episode info display (S1E5: "Title") and Mark Watched button that advances progress with optimistic UI updates**

## Performance

- **Duration:** 12 min
- **Started:** 2026-01-19T15:36:58Z
- **Completed:** 2026-01-19T15:49:04Z
- **Tasks:** 4 (3 auto + 1 checkpoint)
- **Files modified:** 6 (3 created, 3 modified)

## Accomplishments

- Schedule API enriched with currentEpisode data for TV shows
- TitleCard displays current episode below title in muted text
- Mark Watched button advances episode with loading state
- Created TMDB client API routes for fetching TV/season/episode details
- Optimistic UI updates episode display immediately on success

## Task Commits

Each task was committed atomically:

1. **Task 1: Enrich schedule API with progress data** - `ee7b669` (feat)
2. **Task 2: Display episode info on Tonight view** - `09216de` (feat)
3. **Task 3: Add Mark Watched button functionality** - `f3150fd` (feat)

**Plan metadata:** (this commit) (docs: complete plan)

## Files Created/Modified

- `web/app/api/schedule/route.ts` - Added currentEpisode enrichment for TV entries
- `web/app/app/tonight/tonight-client.tsx` - Added CurrentEpisode interface, advancingIds state, handleMarkWatched
- `web/components/title-card.tsx` - Episode display and Mark Watched button with loading state
- `web/app/api/tmdb/tv/[id]/route.ts` - TMDB TV details API route
- `web/app/api/tmdb/tv/[id]/season/[seasonNumber]/route.ts` - TMDB season details API route
- `web/app/api/tmdb/tv/[id]/season/[seasonNumber]/episode/[episodeNumber]/route.ts` - TMDB episode details API route

## Decisions Made

- Created client-facing TMDB API routes under /api/tmdb/* for Mark Watched to fetch episode data
- Episode display format: "S{season}E{episode}: {title}" in text-sm text-muted-foreground
- CheckCircle icon for Mark Watched button with loading spinner during advance
- Optimistic UI updates local state immediately, then persists to database

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Created TMDB client API routes**
- **Found during:** Task 3 (Mark Watched button functionality)
- **Issue:** handleMarkWatched needed to fetch TV details, season details, and episode details from client side to get totalSeasons, totalEpisodesInSeason, and new episode title. No API routes existed for this.
- **Fix:** Created three new TMDB API routes:
  - GET /api/tmdb/tv/[id] - TV show details
  - GET /api/tmdb/tv/[id]/season/[seasonNumber] - Season details with episodes
  - GET /api/tmdb/tv/[id]/season/[seasonNumber]/episode/[episodeNumber] - Episode details
- **Files created:** 3 new API route files
- **Verification:** Mark Watched successfully fetches data and advances progress
- **Committed in:** f3150fd (part of Task 3 commit)

---

**Total deviations:** 1 auto-fixed (blocking - needed API routes for client-side TMDB fetching)
**Impact on plan:** Required addition enables Mark Watched functionality as specified. No scope creep.

## Issues Encountered

None - execution proceeded smoothly after creating the required TMDB API routes.

## Next Phase Readiness

- Episode display and Mark Watched working
- Ready for 06-03: Jump to Episode functionality
- TMDB API routes in place will be reused by Jump to Episode dialog

---
*Phase: 06-progress-tracking*
*Completed: 2026-01-19*
