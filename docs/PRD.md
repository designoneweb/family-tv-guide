# **Product Requirements Document: “Family TV Guide”**

### **1) Product summary**

A cross-platform, dark-mode, art-dominant web app that lets a household:

- curate a library of TV shows and movies they watch,

- assign shows to specific nights (“our TV guide”),

- track progress per profile (manual marking; binge-friendly),

- browse rich episode pages (art + full synopsis + cast + guest stars),

- explore cast filmographies (“what else are they in?”),

- optionally generate short, spoiler-safe “brief synopses” via a server-side summarization endpoint (can be powered by an AI API).

The app is **web-first** for rapid UX iteration, with a planned later port to Android TV (including Watch Next / row integrations).

---

## **2) Goals and non-goals**

### **Goals**

1. **Fast “What are we watching tonight?”**

2. **Accurate progress tracking** per profile without relying on streaming services.

3. **IMDb-like browsing**, including cast→filmography exploration via TMDB person “combined credits.” 

4. **Image-forward UI** with episode stills and show backdrops (TMDB image config + image basics). 

5. Safe foundation for future public launch: **landing page + marketing + login** and secure multi-household data access via Supabase **Row Level Security (RLS)**. 

### **Non-goals (for v1)**

- Automatic progress sync from Netflix/Prime/etc (manual is the intended method).

- Full playback control of external streaming apps.

- A universal “live TV guide” for broadcast/cable.

---

## **3) Target users and personas**

### **Persona A: Parent/Admin**

- Sets up profiles and parental controls

- Curates library, assigns schedule nights, manages “binge mode”

- Wants quick access and a clean living-room-friendly experience

### **Persona B: Family Member**

- Picks what’s on tonight

- Marks watched / advances episode

- Explores cast and other shows/movies they’re in

---

## **4) User journeys**

### **Journey 1: Initial setup (5 minutes)**

1. Create household (or single-family default)

2. Create profiles (Adults, Kids, etc.)

3. Add a few shows/movies from TMDB search

4. Assign shows to nights/time slots (Mon/Tue/etc.)

5. Start tracking progress

### **Journey 2: Tonight’s viewing**

1. Open “Tonight”

2. Pick profile

3. See scheduled tiles (art-dominant)

4. Click show → season/episode grid

5. Click episode → details modal/page

6. Mark watched → progress advances

### **Journey 3: Cast deep dive**

1. Episode details shows cast + guest stars

2. Click actor

3. Actor page shows “Known for” + combined movie/TV credits 

4. Click another title to explore (optional “add to library” CTA)

---

## **5) Feature requirements (MVP → v1)**

### **5.1 Marketing + Auth (Public-ready foundation)**

**MVP**

- Public landing page (dark theme preview, screenshots, CTA)

- Login page (Supabase Auth)

- Protected /app routes

**Implementation notes**

- Use Next.js on Netlify via OpenNext adapter (supports major Next features). 

- Supabase SSR client for cookie-based sessions in App Router contexts. 

**Acceptance criteria**

- Unauthenticated users can view marketing pages

- Unauthenticated users cannot access /app/* routes (redirect to /login)

---

### **5.2 Profiles + parental controls**

**MVP**

- Create/edit/delete profiles

- Profile avatar icon selection

- Maturity level (e.g., Kids/Teen/Adult)

- Optional PIN lock for Admin profile

**v1**

- Per-profile hidden titles

- “Locked” titles (visible but requires PIN)

**Acceptance criteria**

- Switching profiles changes: watch progress, schedule view, permitted titles

---

### **5.3 Library: add TV shows and movies**

**MVP**

- Search TMDB (multi-search optional) 

- Add title to library (media type: TV/Movie)

- Store minimal metadata locally in DB (tmdb_id, name, poster/backdrop paths)

- Show providers (where available) for labels like Netflix/Prime/etc. 

**v1**

- Tags/Collections (e.g., “Family Night”, “Dad’s Shows”)

- Import/export library (JSON)

---

### **5.4 Schedule: “Our TV Guide”**

**MVP**

- Assign TV titles to:
  
  - day(s) of week
  
  - slot (e.g., early/late, or a simple numeric order)

- “Binge mode” toggle (temporarily ignores schedule and just shows Continue Watching)

**v1**

- Theme nights (labels like “Comedy Monday”)

- “Auto-advance night” (after marking watched, next episode becomes the tile)

**Acceptance criteria**

- “Tonight” always shows a deterministic list for a profile

- User can reorder schedule items

---

### **5.5 Progress tracking (manual, binge-friendly)**

**MVP**

- Track current episode per profile per TV series: season + episode

- “Mark watched” increments progress

- “Jump to episode” selector (for binges or corrections)

**v1**

- Full watched/unwatched per episode (history)

- “Resume from last watched” rail

**Acceptance criteria**

- Mark watched updates progress immediately

- Progress is profile-specific

---

### **5.6 Episode grid view (art-dominant)**

**MVP**

- Season view shows **episode tile grid** with:
  
  - episode still (dominant)
  
  - episode name
  
  - brief description (short blurb)
  
  - “Special guests” preview line (top N guest stars)

**Data source**

- TMDB season details endpoint provides episodes for a season. 

- Images must be constructed from configuration + image basics. 

**Acceptance criteria**

- Grid loads quickly and uses placeholders/skeletons

- Missing stills gracefully fall back (show backdrop or neutral card)

---

### **5.7 Episode detail page/modal**

**MVP**

- Click episode tile → opens detail view with:
  
  - large still/backdrop
  
  - full overview text
  
  - main cast + guest stars
  
  - “Mark watched” action
  
  - “Open actor” to explore filmography

**Data source**

- Use append_to_response where possible to reduce request count. 

- External IDs available for TV shows (and can be extended to episode external IDs) to support future IMDb linking. 

**Acceptance criteria**

- Cast list renders with headshots when available

- Clicking actor opens actor page

---

### **5.8 Actor (person) page: “as close to IMDb as possible”**

**MVP**

- Person profile: photo, bio, known for

- Combined credits list (TV + movies) 

- Quick filters: Movies / TV / Acting / Crew

**v1**

- “Also in your library” highlights

- “Add this title” from credits list

**Acceptance criteria**

- “What else are they in?” is discoverable in 1 click from episode details

---

### **5.9 Brief synopsis (optional “AI blurb”)**

**MVP**

- Default: generate brief synopsis by truncating the TMDB overview

- Optional: “Enhanced brief synopsis” via server-side endpoint

**Implementation**

- A Next.js Route Handler (or Netlify function) that:
  
  - receives episode overview/title
  
  - returns 1–2 sentence spoiler-safe teaser

- Cache results in Supabase to avoid repeated calls

**Acceptance criteria**

- If the enhanced synopsis fails, app falls back to basic truncated text

---

## **6) Data & integrations**

### **6.1 TMDB integration (metadata)**

Core endpoints and concepts:

- TMDB API getting started / endpoints catalog 

- append_to_response for efficient bundled requests 

- Watch providers for services metadata (movie shown; TV equivalent is similar in TMDB) 

- Image configuration + image URL construction 

- Person combined credits for filmography-style browsing 

**Key product rule**

- Treat TMDB as the source of truth for metadata; store only what you need for speed and resilience (paths, IDs, cached snapshots).

### **6.2 Supabase integration (family data)**

- Use Postgres + RLS for secure multi-household isolation 

- Use @supabase/ssr to manage cookie-based sessions in SSR contexts 

- Note: Supabase free tier projects are paused after 1 week of inactivity; plan for a keep-alive or accept wake-up delays. 

### **6.3 Hosting (Netlify)**

- Netlify supports Next.js features via OpenNext adapter, including SSR/ISR behaviors and middleware via edge functions. 

---

## **7) Compliance and legal requirements**

### **7.1 TMDB attribution**

App must display:

- TMDB logo usage

- The required notice: “This product uses the TMDB API but is not endorsed or certified by TMDB.” 

### **7.2 Public/SaaS commercialization**

TMDB positions the API for developer use and references commercial licensing for revenue-generating applications in their ecosystem guidance; treat “go SaaS” as a milestone that may require formal licensing conversations. 

---

## **8) UX/UI requirements (IMDb-like dark mode)**

### **Visual direction**

- Always-on dark theme

- Art-forward cards: stills/posters dominate

- Minimal chrome; large typography for 10-foot readability

- Fast hover/active states, crisp focus outlines for keyboard/remote use

### **Core screens**

1. **Landing page** (marketing)

2. **Login**

3. **Profile picker**

4. **Tonight (Guide)**

5. **Library**

6. **Show detail** (hero backdrop + seasons)

7. **Season episode grid**

8. **Episode detail modal/page**

9. **Person/actor page**

10. **Settings** (profiles, parental controls, data export/import, credits/legal)

---

## **9) Technical requirements**

### **9.1 Next.js App Router constraints and caching**

- Avoid accidental “static → dynamic” runtime errors when using cookies/headers in routes; segment config must be consistent with authenticated rendering needs. 

- Marketing routes: static/ISR friendly

- App routes: dynamic where cookies/session are accessed

### **9.2 API key handling**

- Prefer server-side proxy for TMDB calls so credentials aren’t exposed in the client.

- Add caching at the proxy layer for common requests (show/season/person).

### **9.3 Performance targets**

- “Tonight” loads in < 1.5s on typical broadband

- Episode grid: skeleton placeholders; progressive image loading

- Limit TMDB requests by:
  
  - caching configuration response (image base URL)
  
  - using append_to_response where beneficial 
  
  - caching frequently accessed metadata in Supabase

### **9.4 Accessibility**

- Keyboard navigable grid

- Visible focus states

- High contrast text

- Screen reader labels for buttons (“Mark watched”, “Open actor details”)

---

## **10) Suggested database schema (Supabase)**

### **Core tables (v1)**

- households (id, name, created_at)

- household_members (id, household_id, user_id, role)

- profiles (id, household_id, name, maturity_level, pin_hash?, avatar)

- titles (id, household_id, tmdb_id, media_type, added_by, provider_tags, created_at)

- schedule_rules (id, household_id, profile_id, title_id, day_of_week, slot_order, enabled)

- tv_progress (id, household_id, profile_id, series_tmdb_id, season_number, episode_number, updated_at)

- watched_history (id, household_id, profile_id, tmdb_id, media_type, season_number?, episode_number?, watched_at)

- episode_blurbs (id, series_tmdb_id, season_number, episode_number, blurb_text, source, created_at)

### **Security (RLS)**

Enable RLS and restrict rows by household_id membership. Supabase explicitly recommends enabling RLS on exposed tables for secure browser access. 

---

## **11) Milestones**

### **Milestone 1 — Foundations (Week 1)**

- Next.js App Router project

- Netlify deploy pipeline

- Supabase project + schema

- Auth + protected app routes (SSR cookie pattern)

### **Milestone 2 — Core UX (Week 2–3)**

- Profiles, library, schedule (“Tonight”)

- Show detail → seasons → episode grid

- Manual progress

### **Milestone 3 — IMDb-like depth (Week 4)**

- Episode detail with cast/guest stars

- Person page with combined credits 

- External IDs groundwork for future IMDb linking 

### **Milestone 4 — Polish + readiness (Week 5)**

- AI synopsis option + caching

- Export/import household data

- Attribution/legal screens 

### **Milestone 5 — Android TV roadmap (Later)**

- Port UI to TV-optimized navigation

- Watch Next integration (certification required for Google TV “Continue watching”). 

---

## **12) Risks and mitigations**

1. **Supabase free-tier pausing**
   
   - Risk: project pauses after inactivity 
   
   - Mitigation: accept wake-up delay for family use, or set a periodic keep-alive once public.

2. **TMDB rate limits / reliability**
   
   - Mitigation: proxy + cache, avoid overfetching, use append_to_response. 

3. **Auth + App Router “static/dynamic” pitfalls**
   
   - Mitigation: ensure protected routes are treated as dynamic when reading cookies; follow Next guidance on static-to-dynamic errors. 

4. **Commercialization/licensing**
   
   - Mitigation: keep TMDB attribution correct now, and plan a licensing review before monetization. 

---

## **13) Definition of done (v1)**

- Household can log in, create profiles, add shows/movies, schedule nights, track progress per profile.

- Episode grid is art-dominant and clickable into rich episode details.

- Actor pages show combined filmography browsing via TMDB combined credits. 

- Required TMDB attribution is present. 

- Deployed on Netlify and stable under normal family usage. 
