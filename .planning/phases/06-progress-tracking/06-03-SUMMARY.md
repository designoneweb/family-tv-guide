---
phase: 06-progress-tracking
plan: 03
subsystem: ui
tags: [jump-to-episode, dialog, progress, episode-selection, select-dropdown]

requires:
  - phase: 06-02
    provides: Tonight view with episode display and Mark Watched
  - phase: 06-01
    provides: Progress API and TMDB episode functions
provides:
  - Jump to Episode dialog component
  - Manual episode selection capability
  - Clickable episode text pattern
affects: [library-view, schedule-view]

tech-stack:
  added: []
  patterns:
    - Episode selection dialog with cascading dropdowns
    - TMDB season/episode data fetching in dialog
    - Clickable inline text triggering dialog

key-files:
  created:
    - web/components/jump-to-episode-dialog.tsx
  modified:
    - web/components/title-card.tsx
    - web/app/app/tonight/tonight-client.tsx

key-decisions:
  - "Made episode text clickable rather than adding menu button"
  - "Cascading dropdowns: season change resets episode to 1"

patterns-established:
  - "Jump to Episode dialog pattern with cascading selects"
  - "Clickable inline text with hover styling for action triggers"

issues-created: []
duration: 56min
completed: 2026-01-19
---

# Phase 6 Plan 3: Jump to Episode Summary

**Jump to Episode dialog with cascading season/episode dropdowns, accessible by clicking episode text on TitleCard**

## Performance

- **Duration:** 56 min (including checkpoint verification)
- **Started:** 2026-01-19T15:55:09Z
- **Completed:** 2026-01-19T16:50:48Z
- **Tasks:** 3 (2 auto + 1 checkpoint)
- **Files modified:** 3 (1 created, 2 modified)

## Accomplishments

- Created JumpToEpisodeDialog component with season/episode Select dropdowns
- Made episode text clickable on TitleCard with hover styling and tooltip
- Dialog fetches TMDB data for season count and episode lists
- Save persists new progress via POST /api/progress
- Tonight view updates local state immediately after save

## Task Commits

Each task was committed atomically:

1. **Task 1: Create JumpToEpisodeDialog component** - `6feed94` (feat)
2. **Task 2: Integrate Jump to Episode into TitleCard** - `97ed18d` (feat)

**Plan metadata:** (this commit) (docs: complete plan)

## Files Created/Modified

- `web/components/jump-to-episode-dialog.tsx` - New dialog with season/episode cascading selects
- `web/components/title-card.tsx` - Added clickable episode text, dialog state, new props
- `web/app/app/tonight/tonight-client.tsx` - Added handleJumpToEpisode with TMDB episode fetch

## Decisions Made

- Made episode text clickable rather than adding a separate menu button (cleaner UX)
- Cascading dropdown pattern: changing season resets episode to 1 and fetches new episode list
- Added tooltip "Click to change episode" for discoverability

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - execution proceeded smoothly.

## Next Phase Readiness

- Phase 6 Progress Tracking is now complete:
  - Episode progress tracking per profile per series
  - Mark Watched advances to next episode
  - Jump to Episode allows manual corrections
- Ready for Phase 7: Episode Grid

---
*Phase: 06-progress-tracking*
*Completed: 2026-01-19*
