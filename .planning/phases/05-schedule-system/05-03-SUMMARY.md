---
phase: 05-schedule-system
plan: 03
subsystem: ui
tags: [tonight, schedule, navigation, tmdb-enrichment]

# Dependency graph
requires:
  - phase: 05-01
    provides: Schedule service and API routes
  - phase: 05-02
    provides: Schedule management UI
provides:
  - Tonight view showing current day's schedule
  - App navigation component
  - Enriched schedule API with TMDB metadata
affects: [progress-tracking, episode-grid]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - App navigation with active state highlighting
    - Schedule API enrichment with TMDB data

key-files:
  created:
    - web/app/app/tonight/page.tsx
    - web/app/app/tonight/tonight-client.tsx
    - web/components/app-nav.tsx
  modified:
    - web/app/api/schedule/route.ts
    - web/app/app/layout.tsx
    - web/app/app/schedule/schedule-client.tsx

key-decisions:
  - "Enriched schedule API returns camelCase fields for consistency"
  - "AppNav component with responsive design (icons on mobile, labels on desktop)"

patterns-established:
  - "Schedule API enrichment pattern: join tracked_titles, batch fetch TMDB"

issues-created: []

# Metrics
duration: 41min
completed: 2026-01-19
---

# Phase 5 Plan 3: Tonight View Summary

**Tonight page at /app/tonight showing current day's scheduled titles with art-forward TitleCard display and app-wide navigation**

## Performance

- **Duration:** 41 min
- **Started:** 2026-01-19T14:04:30Z
- **Completed:** 2026-01-19T14:45:38Z
- **Tasks:** 4 (3 auto + 1 checkpoint)
- **Files modified:** 6

## Accomplishments

- Tonight page showing current day's schedule with poster art
- Schedule API enriched with TMDB metadata (title, poster, year, providers)
- App navigation component with links to Tonight, Library, Schedule, Profiles
- Responsive nav design (icons on mobile, full labels on desktop)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Tonight page** - `9aa9c1a` (feat)
2. **Task 2: Enrich schedule API** - `61d9ade` (feat)
3. **Task 3: Add navigation** - `f35a86d` (feat)
4. **Bug fix: Schedule client camelCase** - `91f2f30` (fix)

## Files Created/Modified

- `web/app/app/tonight/page.tsx` - Server component with ProfileGuard
- `web/app/app/tonight/tonight-client.tsx` - Tonight view with schedule display
- `web/components/app-nav.tsx` - App navigation component
- `web/app/api/schedule/route.ts` - Enriched with TMDB metadata
- `web/app/app/layout.tsx` - Added AppNav component
- `web/app/app/schedule/schedule-client.tsx` - Fixed for camelCase API response

## Decisions Made

- Schedule API returns enriched entries with camelCase fields for frontend consistency
- Created dedicated AppNav component for reusable navigation
- Responsive design: icons only on mobile, icons + labels on larger screens

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed schedule-client.tsx for camelCase API response**
- **Found during:** Checkpoint verification
- **Issue:** Schedule page broke after API was updated to return camelCase fields (slotOrder, trackedTitleId) but client expected snake_case
- **Fix:** Updated EnrichedScheduleEntry interface and all field references to camelCase
- **Files modified:** web/app/app/schedule/schedule-client.tsx
- **Verification:** Schedule page displays correctly
- **Committed in:** 91f2f30

---

**Total deviations:** 1 auto-fixed (bug from API change)
**Impact on plan:** Necessary fix for backward compatibility with schedule page

## Issues Encountered

None beyond the API format mismatch (resolved as deviation above)

## Next Phase Readiness

- Phase 5 complete - full schedule system working
- Tonight view delivers core value: "What are we watching tonight?"
- Ready for Phase 6: Progress Tracking (episode tracking per profile per series)

---
*Phase: 05-schedule-system*
*Completed: 2026-01-19*
