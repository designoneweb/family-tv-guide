# Family TV Guide Spec

## **Global technical decisions**

### **Routing structure (App Router)**

- (marketing) routes are static/ISR-friendly

- (app) routes are authenticated + dynamic when cookies/session are read (Supabase SSR)

- TMDB calls go through **Route Handlers** so you can keep tokens server-side and cache aggressively; Next Route Handlers are not cached by default, but you can opt-in for GET caching when appropriate. 

### **TMDB baseline endpoints you’ll reuse everywhere**

- TV series details: GET /tv/{series_id} 

- Season details (episode list): GET /tv/{series_id}/season/{season_number} 

- Configuration (image base URLs/sizes): GET /configuration 

- Person TV credits (filmography slice): GET /person/{person_id}/tv_credits 

(You’ll also call person details + person images via the TMDB “People” reference pages; keep those behind your TMDB proxy so they’re cacheable and don’t expose tokens.) 

### **Supabase data isolation (per profile + future SaaS)**

Even if this starts as “just your family,” implement **RLS now** so the app can safely go public later. Supabase RLS is the intended mechanism for row-level authorization. 

---

## **Data model (MVP tables)**

**households**

- id, name, created_at

**profiles**

- id, household_id, name, avatar, maturity_level, pin_hash?

**tracked_titles**

- id, household_id, tmdb_id, media_type (tv|movie), added_at

**schedule_entries**

- id, household_id, profile_id, weekday (0–6), slot_order, tracked_title_id, enabled

**tv_progress**

- id, profile_id, tracked_title_id, season_number, episode_number, updated_at

**episode_blurbs** (optional, for “brief synopsis”)

- id, series_tmdb_id, season_number, episode_number, blurb_text, source (tmdb_truncate|ai), updated_at

### **Indexing (important for snappy UX at 20–40 titles)**

- schedule_entries (profile_id, weekday, slot_order)

- tv_progress (profile_id, tracked_title_id)

- tracked_titles (household_id, media_type)

- episode_blurbs (series_tmdb_id, season_number, episode_number)

---

## **Caching strategy (optimized for 20–40 shows)**

### **In the Next.js TMDB proxy (Route Handlers)**

- Cache /configuration for ~30 days (very stable) 

- Cache /tv/{id} for 24 hours (show metadata changes slowly) 

- Cache /season details for 24 hours (episode list changes rarely after release) 

- Cache /person/{id} + credits for 7 days (filmographies change slowly) 

(You can implement this using Next’s caching/revalidation patterns for server fetches and/or opt-in caching for GET Route Handlers.  )

### **In the client**

Use React Query/SWR so:

- Guide page loads your Supabase schedule instantly

- Metadata trickles in (poster/backdrop first, then episode titles, then blurbs)

---

# **Screen-by-screen spec**

## **1) Landing (Marketing)**

**Route:** / (public)

**Primary goal:** “What this is” + CTA to login

**Rendering:** static/ISR-style; follow Next caching/revalidation guidance for marketing pages. 

**UI blocks**

- Hero screenshot/video mock

- Feature bullets (Guide by night, Profiles, Episode grids, Cast exploration)

- CTA: Log in

---

## **2) Login**

**Route:** /login (public)

**Goal:** authenticate to reach /app

**Notes:** Keep it simple for MVP: email magic link or password.

---

## **3) Profile Picker**

**Route:** /app/profiles/select

**Goal:** choose profile to load per-profile schedule + progress.

**UI**

- Grid of avatars

- Optional: PIN prompt if required

**Data**

- Supabase: profiles where household_id = current_household

**Acceptance**

- Selecting a profile sets activeProfileId in client state and routes to /app/guide

---

## **4) Guide (Tonight / By Day)**

**Route:** /app/guide

**Goal:** “What are we watching tonight?” with per-profile progress.

**UI**

- Day-of-week strip (Sun–Sat)

- Schedule list (ordered by slot_order)

- Each item (show card):
  
  - backdrop/poster art (dominant)
  
  - title
  
  - “Next up: SxEy • Episode title”
  
  - quick actions: **Open episode**, **Mark watched**
  
  - “Binge mode” toggle (optional MVP)

**Data**

1. Supabase:
   
   - schedule: schedule_entries filtered by profile_id + selected weekday
   
   - progress: tv_progress for those titles

2. TMDB:
   
   - show details: GET /tv/{series_id} 
   
   - season details (only for the current season you’re in): GET /tv/{series_id}/season/{season_number} 

**Behavior**

- “Mark watched”:
  
  - increments episode; if episode exceeds season length, increment season and set episode 1
  
  - write to tv_progress
  
  - optimistic UI update

**Performance note (20–40 shows)**

- On Guide, only resolve metadata for **scheduled titles for that day** (usually ~3–8) and lazy-fetch the rest.

---

## **5) Shows Library**

**Route:** /app/shows

**Goal:** browse all tracked TV series for the profile, art-first.

**UI**

- Poster grid

- Each card:
  
  - poster
  
  - title
  
  - progress chip “SxEy”
  
  - scheduled days chips (small)

**Data**

- Supabase:
  
  - tracked_titles (tv)
  
  - tv_progress for active profile
  
  - schedule_entries to compute chips

- TMDB:
  
  - show details /tv/{id} for visible grid range 

**Behavior**

- Infinite scroll or pagination (20–40 can be a single page, but still lazy-load images)

---

## **6) Show Detail + Season Episode Grid**

**Route:** /app/show/[seriesId]

**Goal:** IMDb-like show hub; season switcher; episode tiles.

**UI**

- Hero backdrop + poster + overview

- Progress module (Open next / Mark watched / Jump to episode)

- Season tabs

- Episode grid (dominant stills)

**Episode grid tile includes**

- still image

- episode title

- brief description (truncated or AI-generated)

- “Special guests” line (top 1–3 guest stars)

**Data**

- TMDB:
  
  - show details: /tv/{series_id} 
  
  - season details: /tv/{series_id}/season/{season_number} (this gives you the episode list + basic overviews + still paths) 
  
  - config for image URLs: /configuration 

**Brief description logic**

- Default: truncate TMDB overview to ~160 chars (no AI needed)

- Optional: if “AI blurbs” enabled, read from episode_blurbs; missing blurbs trigger server generation and are cached (your call).

**Special guests**

- MVP approach (fast): on grid, show a placeholder “Special Guests…”; fetch guest star names only when the tile is focused/hovered or when episode detail opens (keeps calls down).

- “Full” approach: batch fetch credits for visible episodes (more calls; acceptable if you limit to ~10 visible at a time).

---

## **7) Episode Detail (Modal/Drawer)**

**Route:** overlay on show page (or /app/show/[id]/season/[s]/episode/[e])

**Goal:** the rich episode view.

**UI**

- Large still/header

- Full overview

- Main cast list

- Guest stars list (explicitly labeled)

- “Mark watched” + “Set current episode” actions

**Data**

- TMDB:
  
  - episode details (for canonical info): the “TV Episodes → Details” endpoint exists in TMDB reference; use it for complete episode fields. 
  
  - episode credits (cast + guest stars): use the “TV Episodes → Credits” endpoint (exists in the TMDB reference set; fetch via your proxy). 
  
  - optional: episode images (stills): /images (if you want a gallery) 

**Acceptance**

- Clicking a cast member opens Person page

- Mark watched updates progress and updates Guide + Show grid instantly

---

## **8) Person (Actor) Page — IMDb-like (with clickable Known For)**

**Route:** /app/person/[personId]

### **MVP requirements**

- **Photo**

- **Bio**

- **Known for (clickable to the show/movie)** ✅

**UI**

1. Header: headshot + name + short facts + bio

2. **Known For strip**
   
   - poster cards
   
   - clicking routes to:
     
     - TV: /app/show/[seriesId]
     
     - Movie: /app/movie/[movieId] (or a movie detail screen)

3. Filmography (MVP-lite):
   
   - start with TV credits list + quick filter (Acting / Crew)
   
   - later add combined credits view for both TV and movies

**Data**

- TMDB:
  
  - person details from People endpoints (use your proxy) 
  
  - person TV credits: GET /person/{person_id}/tv_credits 
  
  - (Optional later) combined credits for the most IMDb-like “all credits” experience—available under People endpoints; keep behind proxy and cache weekly. 

**Known For click behavior**

- If TMDB returns a “known_for” list (when discovered via multi-search) you can use it directly.

- If you navigated here from an episode cast list, you’ll compute Known For from the person’s credits (top by popularity/vote_count). Either way, the output cards are clickable.

---

## **9) Movies Library**

**Route:** /app/movies

**Goal:** parallel section for movies (optional MVP, but you wanted it eventually).

**UI**

- Poster grid

- Watched toggle per profile (or household, your choice later)

**Data**

- Supabase tracked_titles (movie)

- TMDB movie details (via TMDB reference set) 

---

## **10) Search / Add Titles**

**Route:** /app/search

**Goal:** add shows/movies to the family library and schedule them.

**UI**

- search bar + filters (TV / Movies / People / All)

- results list with posters

- on select:
  
  - “Add to library”
  
  - “Add to schedule” (choose day(s), slot order)
  
  - “Track for which profiles?” (default: active profile only)

**Data**

- TMDB search endpoints (TV and/or multi-search) exist in the TMDB reference catalog. 

---

## **11) Settings**

**Route:** /app/settings

**UI sections**

- Profiles & parental controls shortcut

- Data export/import

- “AI blurbs” toggle (if implemented)

- Credits/legal including TMDB attribution

**Security**

- RLS enabled and tested (even if it’s just you), per Supabase guidance. 

---

# **MVP call budget (so it stays fast)**

With 20–40 shows, a good “felt fast” approach is:

- **Guide page:** 3–8 shows scheduled for the day
  
  - 3–8 /tv/{id} calls (cached) 
  
  - 3–8 /season calls (cached) only for shows whose “next episode title” isn’t already cached 

- **Show detail:** 1 show + 1 season list
  
  - /tv/{id} + /season/{n} 

- **Episode modal:** only then fetch credits/images

- **Person page:** 1 person details + tv credits (cached weekly) 

Next’s caching guidance (and route-handler caching options) support this kind of “cache stable stuff, revalidate occasionally” pattern cleanly. 

---

## **Quick confirmation: “Per profile” implications (already handled)**

Because progress is per profile:

- Guide, Show grid badges, and “Next up” always reference tv_progress for the active profile.

- Schedule can either be per profile (recommended for now) or later you can introduce a “household shared schedule” toggle.


