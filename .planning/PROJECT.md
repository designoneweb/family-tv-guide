# Family TV Guide

## What This Is

A dark-mode, art-forward web app that lets a household curate their TV shows and movies, schedule what's on each night, track progress per profile, and explore IMDb-like episode details and cast filmographies. Web-first for rapid iteration, with Android TV as a future milestone.

## Core Value

**Fast "What are we watching tonight?"** — the Guide page must load quickly and show exactly what's scheduled with the next episode ready to watch.

## Requirements

### Validated

(None yet — ship to validate)

### Active

**Auth & Foundation**
- [ ] Public landing page (dark theme, feature preview, CTA)
- [ ] Supabase Auth with protected /app routes
- [ ] RLS-enabled database schema (households, profiles, titles, progress)

**Profiles**
- [ ] Create/edit/delete profiles per household
- [ ] Avatar selection and maturity levels (Kids/Teen/Adult)
- [ ] Optional PIN lock for admin profile

**Library**
- [ ] Search TMDB and add TV shows/movies to household library
- [ ] Store minimal metadata locally (tmdb_id, name, poster/backdrop paths)
- [ ] Show streaming providers where available

**Schedule ("Our TV Guide")**
- [ ] Assign TV titles to days of week with slot ordering
- [ ] "Tonight" view shows scheduled titles for current day
- [ ] Binge mode toggle (ignore schedule, show Continue Watching)

**Progress Tracking**
- [ ] Track current episode per profile per series
- [ ] "Mark watched" advances progress
- [ ] "Jump to episode" for corrections or binge catch-up

**Episode Grid (Art-Dominant)**
- [ ] Season view with episode tile grid
- [ ] Each tile: still image, title, brief description, guest stars preview
- [ ] Graceful fallback for missing stills

**Episode Detail**
- [ ] Full overview, large still/backdrop
- [ ] Main cast + guest stars lists
- [ ] Click actor opens Person page
- [ ] Mark watched action

**Person Page (IMDb-like)**
- [ ] Photo, bio, known for (clickable)
- [ ] TV credits with Acting/Crew filter
- [ ] Combined credits (TV + movies) for full filmography

**AI Synopsis (Optional)**
- [ ] Server-side endpoint for spoiler-safe brief synopses
- [ ] User-supplied API key or Gemini 1.5 Flash as free option
- [ ] Cache results in Supabase
- [ ] Fallback to truncated TMDB overview

### Out of Scope

- Automatic progress sync from Netflix/Prime/etc — manual tracking is intentional
- Playback control of external streaming apps — we're a guide, not a player
- Live TV guide for broadcast/cable — not the use case
- Android TV app — future milestone, web-first for now
- Multi-household admin dashboard — single household focus for v1

## Context

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
| TanStack Query for client data | Powerful caching, devtools, handles TMDB waterfall well | — Pending |
| shadcn/ui for components | Tailwind-based, customizable, dark mode native | — Pending |
| RLS from day one | Family first, then public — secure foundation matters | — Pending |
| Gemini 1.5 Flash as free AI option | User requested, avoids API key requirement for basic use | — Pending |
| Per-profile schedules (not household) | Simpler model, can add shared schedules later | — Pending |

---
*Last updated: 2025-01-18 after initialization*
