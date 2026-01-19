---
phase: 05-schedule-system
plan: 01
subsystem: schedule-service
tags: [schedule, service, api, crud]
status: complete
started: 2026-01-19T13:44:04Z
completed: 2026-01-19T13:46:45Z
---

# Plan 05-01 Summary: Schedule Service and API Routes

## Objective

Create schedule service layer and API routes for managing per-profile weekly TV schedules, providing foundation for schedule management with CRUD operations for assigning titles to weekdays with slot ordering.

## Accomplishments

### Task 1: Schedule Service with CRUD Operations

Created `/web/lib/services/schedule.ts` with 6 functions following the established Result type pattern from `library.ts`:

1. **addToSchedule** - Adds title to a weekday with auto-calculated slot_order (max + 1)
2. **removeFromSchedule** - Removes entry by ID (gaps in slot_order are allowed)
3. **getScheduleForDay** - Get entries for a specific day, ordered by slot_order
4. **getWeekSchedule** - Get all 7 days as object keyed by weekday (0-6)
5. **reorderSlot** - Move entry to new position, shifting other entries to make room
6. **moveToDay** - Move entry to different day at end position

**Validation:**
- weekday validated as 0-6 (Sunday-Saturday)
- profileId, trackedTitleId, householdId required where applicable

### Task 2: Schedule API Routes

Created API routes following patterns from `/web/app/api/library/*`:

| Route | Method | Description |
|-------|--------|-------------|
| `/api/schedule` | GET | Get week schedule for a profile (requires profileId query param) |
| `/api/schedule` | POST | Add title to schedule (profileId, trackedTitleId, weekday) |
| `/api/schedule/[id]` | DELETE | Remove entry from schedule |
| `/api/schedule/[id]` | PATCH | Reorder (slotOrder) or move day (weekday) |

All routes include:
- Authentication check via Supabase
- Input validation with 400 responses
- Proper error handling with 500 responses
- RLS relies on household_id for authorization

## Files Created

- `/web/lib/services/schedule.ts` (421 lines)
- `/web/app/api/schedule/route.ts` (153 lines)
- `/web/app/api/schedule/[id]/route.ts` (172 lines)

## Decisions Made

1. **Gaps in slot_order allowed** - When removing entries, other slots are not compacted. This simplifies deletion and avoids race conditions.

2. **Shift-then-update for reorder** - Since Supabase doesn't support `slot_order = slot_order + 1` directly, we fetch entries to shift and update them individually from highest to lowest to avoid unique constraint conflicts.

3. **PATCH handles both operations** - Single endpoint for reorder and move-day, with weekday taking precedence if both provided (move first, then reorder within new day).

4. **WeekSchedule type** - Returns object with all 7 days pre-initialized as empty arrays, making client-side rendering simpler.

## Verification

- TypeScript compilation: PASSED (`cd web && npx tsc --noEmit`)
- All 6 service functions exported with proper typing
- API routes handle all CRUD operations with validation

## Commits

| Hash | Description |
|------|-------------|
| `1469c1e` | feat(05-01): create schedule service with CRUD operations |
| `0354b02` | feat(05-01): create schedule API routes |

## Next Steps

- Plan 05-02: Schedule UI components (day view, drag-drop reorder)
- Plan 05-03: "Tonight" view showing scheduled titles for current day
