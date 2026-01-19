---
phase: 07-episode-grid
plan: 01
subsystem: ui
tags: [tmdb, episode-grid, season-selector, tabs, shadcn]

# Dependency graph
requires:
  - phase: 06-progress-tracking
    provides: TMDB client API routes pattern
  - phase: 03-tmdb-integration
    provides: Image URL helpers, TMDB types
provides:
  - EpisodeTile component for episode display
  - Show page at /app/show/[id] with episode grid
  - Season navigation (tabs/dropdown based on count)
affects: [episode-detail, person-pages]

# Tech tracking
tech-stack:
  added: [shadcn/tabs]
  patterns: [art-dominant-layout, responsive-grid]

key-files:
  created:
    - web/components/episode-tile.tsx
    - web/app/app/show/[id]/page.tsx
    - web/app/app/show/[id]/show-client.tsx
    - web/components/ui/tabs.tsx
  modified: []

key-decisions:
  - "Tabs for ≤6 seasons, dropdown for more"
  - "16:9 aspect ratio for episode stills"
  - "Episode badge overlay top-left (E5 format)"

patterns-established:
  - "Art-dominant layout: large image with minimal text overlay"
  - "Adaptive selector: tabs for few options, dropdown for many"

issues-created: []

# Metrics
duration: 8min
completed: 2026-01-19
---

# Phase 7 Plan 1: Episode Grid Summary

**Art-dominant episode grid with 16:9 stills, season tabs/dropdown selector, and responsive layout**

## Performance

- **Duration:** 8 min
- **Started:** 2026-01-19T15:30:00Z
- **Completed:** 2026-01-19T15:38:00Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- Created EpisodeTile component with 16:9 still images and fallback
- Built show page at /app/show/[id] with episode grid
- Implemented season selector: tabs for ≤6 seasons, dropdown for more
- Responsive grid layout: 1 col mobile → 4 cols desktop

## Task Commits

Each task was committed atomically:

1. **Task 1: Create EpisodeTile component** - `5598926` (feat)
2. **Task 2: Create show page with episode grid** - `17a6f0e` (feat)
3. **Task 3: Verify episode grid** - checkpoint (human-verify, approved)

## Files Created/Modified

- `web/components/episode-tile.tsx` - Reusable episode tile with still, badge, title, description
- `web/app/app/show/[id]/page.tsx` - Server component extracting TMDB ID
- `web/app/app/show/[id]/show-client.tsx` - Client component with season selector and grid
- `web/components/ui/tabs.tsx` - shadcn Tabs component (installed)

## Decisions Made

- Used tabs for ≤6 seasons, dropdown for more - cleaner UX for most shows while handling long-running series
- 16:9 aspect ratio for stills - matches TMDB still format, visually dominant
- Episode badge overlay format "E5" - concise, scannable

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed missing shadcn/tabs component**
- **Found during:** Task 2 (Show page implementation)
- **Issue:** Tabs component not installed, TypeScript import error
- **Fix:** Ran `npx shadcn@latest add tabs -y`
- **Files modified:** web/components/ui/tabs.tsx (created)
- **Verification:** TypeScript compilation passes
- **Committed in:** 17a6f0e (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking), 0 deferred
**Impact on plan:** Minor dependency installation, no scope change

## Issues Encountered

None

## Next Phase Readiness

- Episode grid complete and functional
- Ready for Phase 7 Plan 2 (if exists) or Phase 8: Episode Detail
- EpisodeTile onClick handler prepared for future episode detail navigation

---
*Phase: 07-episode-grid*
*Completed: 2026-01-19*
