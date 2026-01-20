# Family TV Guide

## What This Is

A dark-mode, art-forward web app that lets a household curate their TV shows and movies, schedule what's on each night, track progress per profile, and explore IMDb-like episode details and cast filmographies. Features AI-powered spoiler-safe synopses via Gemini integration. Web-first for rapid iteration, with Android TV as a future milestone.

## Core Value

**Fast "What are we watching tonight?"** — the Guide page must load quickly and show exactly what's scheduled with the next episode ready to watch.

## Requirements

### Validated

**Auth & Foundation — v1.0**
- ✓ Supabase Auth with protected /app routes
- ✓ RLS-enabled database schema (households, profiles, titles, progress)
- ✓ Automatic household/profile provisioning on signup

**Profiles — v1.0**
- ✓ Create/edit/delete profiles per household
- ✓ Avatar color selection with 8 presets
- ✓ Profile switcher with persistent selection

**Library — v1.0**
- ✓ Search TMDB and add TV shows/movies to household library
- ✓ Store minimal metadata locally (tmdb_id, name, poster/backdrop paths)
- ✓ Show streaming providers with clickable JustWatch links

**Schedule ("Our TV Guide") — v1.0**
- ✓ Assign TV titles to days of week with slot ordering
- ✓ "Tonight" view shows scheduled titles with episode info and stills
- ✓ Episode details on click with full navigation

**Progress Tracking — v1.0**
- ✓ Track current episode per profile per series
- ✓ "Mark watched" advances progress with auto-navigation
- ✓ "Jump to episode" dialog for corrections

**Episode Grid (Art-Dominant) — v1.0**
- ✓ Season view with episode tile grid (tabs for ≤6 seasons)
- ✓ Each tile: still image, title, brief description
- ✓ Graceful fallback to show poster for missing stills

**Episode Detail — v1.0**
- ✓ Full overview, large still/backdrop
- ✓ Main cast + guest stars lists with clickable cards
- ✓ Mark watched action with navigation to next episode

**Person Page (IMDb-like) — v1.0**
- ✓ Photo, bio, known for (clickable)
- ✓ TV credits with Acting/Crew filter
- ✓ Combined credits (TV + movies) for full filmography

**AI Synopsis (Optional) — v1.0**
- ✓ Server-side endpoint for spoiler-safe brief synopses
- ✓ Gemini 1.5 Flash integration
- ✓ Cache results in Supabase
- ✓ Fallback to truncated TMDB overview
- ✓ Conditional UI display based on API key availability

### Active

- [ ] Public landing page (dark theme, feature preview, CTA)
- [ ] Maturity levels (Kids/Teen/Adult) for profiles
- [ ] Optional PIN lock for admin profile
- [ ] Binge mode toggle (ignore schedule, show Continue Watching)

### Out of Scope

- Automatic progress sync from Netflix/Prime/etc — manual tracking is intentional
- Playback control of external streaming apps — we're a guide, not a player
- Live TV guide for broadcast/cable — not the use case
- Android TV app — future milestone, web-first for now
- Multi-household admin dashboard — single household focus for v1

## Context

**Current State (v1.0 shipped):**
- 11,096 lines of TypeScript/TSX across 180 files
- Tech stack: Next.js 16 App Router, Supabase (auth + database), TanStack Query, shadcn/ui
- Deployed on Netlify with OpenNext adapter
- TMDB integration for all metadata, Gemini AI for synopsis generation

**Source Documents:**
- `docs/PRD.md` — full product requirements with user journeys and milestones
- `docs/SPEC.md` — screen-by-screen technical spec with data model and caching strategy

**Target Scale:**
- 20-40 tracked shows per household
- 3-8 shows scheduled per night
- Caching strategy optimized for this scale

**Design Approach:**
- No existing mockups — design as we build
- Dark mode always-on, art-forward (stills/posters dominant)
- Large typography for 10-foot readability
- Keep TV/remote navigation possible for future

## Constraints

- **Stack**: Next.js App Router + Supabase + Netlify (via OpenNext adapter)
- **API**: TMDB for metadata (server-side proxy, no client exposure)
- **Auth**: Supabase SSR with cookie-based sessions
- **Legal**: TMDB attribution required in app
- **Hosting**: Netlify free tier acceptable for family use; Supabase free tier pauses after 1 week inactivity

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| TanStack Query for client data | Powerful caching, devtools, handles TMDB waterfall well | ✓ Good |
| shadcn/ui for components | Tailwind-based, customizable, dark mode native | ✓ Good |
| RLS from day one | Family first, then public — secure foundation matters | ✓ Good |
| Gemini 1.5 Flash as free AI option | User requested, avoids API key requirement for basic use | ✓ Good |
| Per-profile schedules (not household) | Simpler model, can add shared schedules later | ✓ Good |
| @supabase/ssr for auth | Current standard, cookie-based SSR sessions | ✓ Good |
| Server-side TMDB proxy | Protects API key, handles rate limits | ✓ Good |
| Tabs ≤6 seasons, dropdown for more | Cleaner UX for most shows | ✓ Good |
| Episode still fallback to show backdrop | Better UX when episode stills missing | ✓ Good |
| Provider logos link to JustWatch | JustWatch provides deep links to streaming services | ✓ Good |
| Conditional AI synopsis display | Hide button when API key not configured | ✓ Good |

---
*Last updated: 2026-01-19 after v1.0 Family Launch milestone*
