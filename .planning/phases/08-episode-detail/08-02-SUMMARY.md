---
phase: 08-episode-detail
plan: 02
subsystem: ui
tags: [episode-detail, cast, credits, navigation, mark-watched, next.js]

# Dependency graph
requires:
  - phase: 08-episode-detail/01
    provides: Episode credits API, types, profile image helper
  - phase: 07-episode-grid
    provides: Episode grid UI, EpisodeTile component
  - phase: 06-progress-tracking
    provides: Mark Watched pattern, progress API
provides:
  - Episode detail page with cast/guest stars display
  - Full navigation flow from library/schedule to episode detail
  - Mark Watched from episode detail view
affects: [09-person-pages]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Episode detail uses same parallel fetch pattern as show page"
    - "Mark Watched follows Tonight view advance pattern"
    - "TitleCard links to show detail for TV shows"

key-files:
  created:
    - web/app/app/show/[id]/season/[seasonNumber]/episode/[episodeNumber]/page.tsx
    - web/app/app/show/[id]/season/[seasonNumber]/episode/[episodeNumber]/episode-client.tsx
  modified:
    - web/app/app/show/[id]/show-client.tsx
    - web/components/title-card.tsx

key-decisions:
  - "Episode still fallback to show backdrop if no episode still available"
  - "Mark Watched navigates to next episode after 1.5s confirmation"
  - "TitleCard poster/title clickable for TV shows only (no movie detail page yet)"

patterns-established:
  - "Episode detail uses card overlay on gradient for info section"
  - "Cast/guest stars use horizontal scroll with profile cards"

issues-created: []

# Metrics
duration: 20min
completed: 2026-01-19
---

# Phase 8 Plan 2: Episode Detail Summary

**Full episode detail page with art-dominant layout, cast/guest stars, Mark Watched, and complete navigation flow from library to episode**

## Performance

- **Duration:** 20 min
- **Started:** 2026-01-19T20:05:26Z
- **Completed:** 2026-01-19T20:25:35Z
- **Tasks:** 3 (2 auto + 1 checkpoint)
- **Files modified:** 4

## Accomplishments

- Created episode detail page with large still image, full overview, metadata
- Added Main Cast and Guest Stars sections with profile photos and horizontal scroll
- Implemented Mark Watched button that advances progress and navigates to next episode
- Wired episode grid tiles to navigate to episode detail on click
- Added show detail navigation to TitleCard (poster/title clickable for TV shows)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create episode detail page** - `bb51c46` (feat)
2. **Task 2: Add Mark Watched and wire up navigation** - `6202a43` (feat)
3. **Deviation: Add show detail navigation to TitleCard** - `751c3f9` (feat)

**Plan metadata:** (next commit)

## Files Created/Modified

- `web/app/app/show/[id]/season/[seasonNumber]/episode/[episodeNumber]/page.tsx` - Server component extracting route params
- `web/app/app/show/[id]/season/[seasonNumber]/episode/[episodeNumber]/episode-client.tsx` - Client component with episode detail, cast, Mark Watched
- `web/app/app/show/[id]/show-client.tsx` - Added onClick navigation to EpisodeTile
- `web/components/title-card.tsx` - Made poster/title clickable for TV shows

## Decisions Made

- Episode still falls back to show backdrop when no still available
- Mark Watched shows "Marked! Next: SxEy" for 1.5s then navigates to next episode
- TitleCard only links to show detail for TV shows (movies have no detail page yet)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added show detail navigation to TitleCard**
- **Found during:** Task 3 (human verification)
- **Issue:** Users in Library/Schedule/Tonight views had no way to navigate to show detail page to browse episodes
- **Fix:** Made TitleCard poster and title clickable, linking to `/app/show/{tmdbId}` for TV shows
- **Files modified:** web/components/title-card.tsx
- **Verification:** User confirmed navigation works from Library to show page to episode detail
- **Commit:** 751c3f9

---

**Total deviations:** 1 auto-fixed (missing critical navigation)
**Impact on plan:** Essential for complete navigation flow. No scope creep.

## Issues Encountered

None.

## Next Phase Readiness

- Episode detail page complete with full cast/guest stars display
- Complete navigation flow: Library/Schedule/Tonight → Show Page → Episode Detail
- Mark Watched works from episode detail view
- Phase 8: Episode Detail complete
- Ready for Phase 9: Person Pages (actor profiles, filmography)

---
*Phase: 08-episode-detail*
*Completed: 2026-01-19*
