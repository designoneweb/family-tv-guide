---
phase: 10-ai-synopsis
plan: 01
subsystem: backend
tags: [ai, gemini, synopsis, caching, supabase, api]

# Dependency graph
requires:
  - phase: 08-episode-detail
    provides: Episode detail page and TMDB overview data
  - phase: 02-data-model
    provides: episode_blurbs table schema and types
provides:
  - Gemini client wrapper with graceful fallback
  - Blurb service with Supabase caching
  - POST /api/synopsis endpoint for synopsis generation
affects: [episode detail page will call synopsis API in future phase]

# Tech tracking
tech-stack:
  added: [@google/genai]
  patterns: [ai client wrapper with graceful fallback, caching service]

key-files:
  created:
    - web/lib/gemini/client.ts
    - web/lib/services/blurbs.ts
    - web/app/api/synopsis/route.ts
  modified:
    - web/package.json
    - web/package-lock.json

key-decisions:
  - "Return null (not throw) when GEMINI_API_KEY missing for graceful fallback"
  - "Cache blurbs by (series_tmdb_id, season_number, episode_number) composite key"
  - "Truncate TMDB overview at sentence boundary when possible for fallback"

patterns-established:
  - "AI clients return null on missing API key, allowing fallback logic"
  - "Blurb caching follows same service pattern as progress service"
  - "Synopsis API always returns a blurb (AI or truncated) - never fails"

issues-created: []

# Metrics
duration: 3min
completed: 2026-01-19
---

# Phase 10 Plan 01: AI Synopsis Infrastructure Summary

**Server-side AI synopsis generation infrastructure with Gemini integration and Supabase caching**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-19
- **Completed:** 2026-01-19
- **Tasks:** 3
- **Files created:** 3
- **Files modified:** 2 (package.json, package-lock.json)

## Accomplishments

- Installed @google/genai SDK for Gemini AI integration
- Created Gemini client wrapper with graceful fallback when API key missing
- Built blurb service with getBlurb, saveBlurb, and truncateOverview functions
- Implemented POST /api/synopsis endpoint with cache-first, AI, then truncate fallback

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Gemini SDK and create client wrapper** - `624036c` (feat)
2. **Task 2: Create blurb service with Supabase caching** - `70e434b` (feat)
3. **Task 3: Create API route for synopsis generation** - `abe9522` (feat)

**Plan metadata:** (this commit) (docs: complete plan)

## Files Created/Modified

- `web/lib/gemini/client.ts` - Gemini client wrapper with generateEpisodeSynopsis function
- `web/lib/services/blurbs.ts` - Blurb service for caching episode synopses
- `web/app/api/synopsis/route.ts` - POST endpoint for synopsis generation
- `web/package.json` - Added @google/genai dependency
- `web/package-lock.json` - Lock file updated

## Decisions Made

- Gemini client returns null (not throws) when API key missing, enabling graceful fallback
- Blurbs cached by composite key (series_tmdb_id, season_number, episode_number)
- truncateOverview prefers sentence boundaries for natural-sounding fallback text
- API always returns a valid blurb - never fails completely

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## Next Phase Readiness

- Phase 10-01 complete - synopsis infrastructure ready
- Episode detail page can call POST /api/synopsis to get spoiler-free synopses
- Ready for Phase 10-02 (UI integration) when planned

---
*Phase: 10-ai-synopsis*
*Completed: 2026-01-19*
