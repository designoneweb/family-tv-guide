-- Create MVP tables for Family TV Guide
-- Migration: 20260118000000_create_mvp_tables

-- ============================================================================
-- HOUSEHOLDS TABLE
-- ============================================================================
-- Root entity for multi-tenant data isolation
CREATE TABLE households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
-- Family member profiles within a household
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar TEXT,
  maturity_level TEXT NOT NULL DEFAULT 'adult' CHECK (maturity_level IN ('kids', 'teen', 'adult')),
  pin_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- TRACKED_TITLES TABLE
-- ============================================================================
-- Movies and TV shows added to household library
CREATE TABLE tracked_titles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  tmdb_id INTEGER NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('tv', 'movie')),
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (household_id, tmdb_id)
);

-- ============================================================================
-- SCHEDULE_ENTRIES TABLE
-- ============================================================================
-- Weekly viewing schedule slots per profile
CREATE TABLE schedule_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tracked_title_id UUID NOT NULL REFERENCES tracked_titles(id) ON DELETE CASCADE,
  weekday INTEGER NOT NULL CHECK (weekday >= 0 AND weekday <= 6),
  slot_order INTEGER NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  UNIQUE (profile_id, weekday, slot_order)
);

-- ============================================================================
-- TV_PROGRESS TABLE
-- ============================================================================
-- Episode progress tracking per profile per show
CREATE TABLE tv_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tracked_title_id UUID NOT NULL REFERENCES tracked_titles(id) ON DELETE CASCADE,
  season_number INTEGER NOT NULL DEFAULT 1,
  episode_number INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (profile_id, tracked_title_id)
);

-- ============================================================================
-- EPISODE_BLURBS TABLE
-- ============================================================================
-- Cached episode descriptions (truncated TMDB or AI-generated)
CREATE TABLE episode_blurbs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_tmdb_id INTEGER NOT NULL,
  season_number INTEGER NOT NULL,
  episode_number INTEGER NOT NULL,
  blurb_text TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('tmdb_truncate', 'ai')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (series_tmdb_id, season_number, episode_number)
);

-- ============================================================================
-- INDEXES
-- ============================================================================
-- Optimized queries for schedule lookups
CREATE INDEX idx_schedule_entries_profile_weekday_slot
  ON schedule_entries(profile_id, weekday, slot_order);

-- Optimized queries for progress lookups
CREATE INDEX idx_tv_progress_profile_title
  ON tv_progress(profile_id, tracked_title_id);

-- Optimized queries for household library filtering
CREATE INDEX idx_tracked_titles_household_type
  ON tracked_titles(household_id, media_type);

-- Optimized queries for episode blurb lookups
CREATE INDEX idx_episode_blurbs_series_season_episode
  ON episode_blurbs(series_tmdb_id, season_number, episode_number);
