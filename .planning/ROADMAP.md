# Roadmap: Family TV Guide

## Overview

Build a dark-mode, art-forward TV guide web app from foundation through AI-enhanced features. Start with auth and data model, integrate TMDB for metadata, build library and schedule management, add episode-level tracking and browsing, then layer in person pages and optional AI synopsis generation.

## Domain Expertise

None

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Foundation** - Next.js setup, Supabase config, auth, dark theme scaffold
- [x] **Phase 2: Data Model** - Database schema, RLS policies, household/profile CRUD
- [x] **Phase 3: TMDB Integration** - Server-side proxy, search, metadata caching
- [x] **Phase 4: Library Management** - Add/remove titles, display library, streaming providers
- [x] **Phase 5: Schedule System** - Day-of-week assignment, slot ordering, tonight view
- [ ] **Phase 6: Progress Tracking** - Episode progress per profile, mark watched, jump to episode
- [ ] **Phase 7: Episode Grid** - Season view, episode tiles, art-dominant layout
- [ ] **Phase 8: Episode Detail** - Full episode page, cast/guest stars, mark watched
- [ ] **Phase 9: Person Pages** - IMDb-like actor/crew pages, filmography, combined credits
- [ ] **Phase 10: AI Synopsis** - Optional server-side synopsis, Gemini integration, caching

## Phase Details

### Phase 1: Foundation
**Goal**: Working Next.js App Router app with Supabase Auth, protected routes, and dark theme baseline
**Depends on**: Nothing (first phase)
**Research**: Unlikely (established Next.js + Supabase SSR patterns)
**Plans**: TBD

### Phase 2: Data Model
**Goal**: Complete database schema with RLS policies, household and profile management UI
**Depends on**: Phase 1
**Research**: Unlikely (internal schema design)
**Plans**: TBD

### Phase 3: TMDB Integration
**Goal**: Server-side TMDB proxy with search, metadata fetching, and image URL handling
**Depends on**: Phase 2
**Research**: Likely (external API)
**Research topics**: TMDB API v3/v4, rate limits, image URL construction, watch providers endpoint
**Plans**: TBD

### Phase 4: Library Management
**Goal**: Add/remove TV shows and movies to household library, display with posters, show streaming providers
**Depends on**: Phase 3
**Research**: Unlikely (internal UI patterns)
**Plans**: TBD

### Phase 5: Schedule System
**Goal**: Assign titles to days of week, reorder slots, "Tonight" view showing current day's schedule
**Depends on**: Phase 4
**Research**: Unlikely (internal feature)
**Plans**: TBD

### Phase 6: Progress Tracking
**Goal**: Track current episode per profile per series, mark watched, jump to episode
**Depends on**: Phase 5
**Research**: Unlikely (database patterns established)
**Plans**: TBD

### Phase 7: Episode Grid
**Goal**: Art-dominant season view with episode tile grid, stills, titles, descriptions
**Depends on**: Phase 6
**Research**: Unlikely (UI using existing TMDB integration)
**Plans**: TBD

### Phase 8: Episode Detail
**Goal**: Full episode page with overview, large still, main cast, guest stars, mark watched action
**Depends on**: Phase 7
**Research**: Unlikely (builds on episode grid)
**Plans**: TBD

### Phase 9: Person Pages
**Goal**: IMDb-like person pages with photo, bio, TV credits, combined filmography
**Depends on**: Phase 8
**Research**: Likely (TMDB Person API)
**Research topics**: TMDB Person API endpoints, combined credits, image sizing, acting/crew filter
**Plans**: TBD

### Phase 10: AI Synopsis
**Goal**: Server-side spoiler-safe synopsis generation with Gemini 1.5 Flash, caching, graceful fallback
**Depends on**: Phase 9
**Research**: Likely (Gemini API)
**Research topics**: Gemini 1.5 Flash API, Next.js server actions for AI, Supabase caching, rate limiting
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | Complete | 2026-01-19 |
| 2. Data Model | 5/5 | Complete | 2026-01-19 |
| 3. TMDB Integration | 2/2 | Complete | 2026-01-19 |
| 4. Library Management | 3/3 | Complete | 2026-01-19 |
| 5. Schedule System | 3/3 | Complete | 2026-01-19 |
| 6. Progress Tracking | 2/3 | In progress | - |
| 7. Episode Grid | 0/TBD | Not started | - |
| 8. Episode Detail | 0/TBD | Not started | - |
| 9. Person Pages | 0/TBD | Not started | - |
| 10. AI Synopsis | 0/TBD | Not started | - |
