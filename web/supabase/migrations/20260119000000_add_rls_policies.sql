-- Add Row Level Security (RLS) policies for all tables
-- Migration: 20260119000000_add_rls_policies

-- ============================================================================
-- ADD OWNER_ID TO HOUSEHOLDS
-- ============================================================================
-- Links household to the authenticated Supabase user who owns it
ALTER TABLE households
  ADD COLUMN owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE;

-- Index for faster owner lookups
CREATE INDEX idx_households_owner ON households(owner_id);

-- ============================================================================
-- HELPER FUNCTION
-- ============================================================================
-- Returns the household_id for the current authenticated user
-- SECURITY DEFINER runs with elevated privileges to access households table
CREATE OR REPLACE FUNCTION get_user_household_id()
RETURNS UUID AS $$
  SELECT id FROM households WHERE owner_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================================================
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracked_titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE tv_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE episode_blurbs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HOUSEHOLDS POLICIES
-- ============================================================================
-- Users can only access their own household

CREATE POLICY "Users can view own household"
  ON households FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Users can insert own household"
  ON households FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update own household"
  ON households FOR UPDATE
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can delete own household"
  ON households FOR DELETE
  USING (owner_id = auth.uid());

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================
-- Users can only access profiles in their household

CREATE POLICY "Users can view profiles in own household"
  ON profiles FOR SELECT
  USING (household_id = get_user_household_id());

CREATE POLICY "Users can insert profiles in own household"
  ON profiles FOR INSERT
  WITH CHECK (household_id = get_user_household_id());

CREATE POLICY "Users can update profiles in own household"
  ON profiles FOR UPDATE
  USING (household_id = get_user_household_id())
  WITH CHECK (household_id = get_user_household_id());

CREATE POLICY "Users can delete profiles in own household"
  ON profiles FOR DELETE
  USING (household_id = get_user_household_id());

-- ============================================================================
-- TRACKED_TITLES POLICIES
-- ============================================================================
-- Users can only access titles in their household library

CREATE POLICY "Users can view titles in own household"
  ON tracked_titles FOR SELECT
  USING (household_id = get_user_household_id());

CREATE POLICY "Users can insert titles in own household"
  ON tracked_titles FOR INSERT
  WITH CHECK (household_id = get_user_household_id());

CREATE POLICY "Users can update titles in own household"
  ON tracked_titles FOR UPDATE
  USING (household_id = get_user_household_id())
  WITH CHECK (household_id = get_user_household_id());

CREATE POLICY "Users can delete titles in own household"
  ON tracked_titles FOR DELETE
  USING (household_id = get_user_household_id());

-- ============================================================================
-- SCHEDULE_ENTRIES POLICIES
-- ============================================================================
-- Users can only access schedule entries in their household

CREATE POLICY "Users can view schedule in own household"
  ON schedule_entries FOR SELECT
  USING (household_id = get_user_household_id());

CREATE POLICY "Users can insert schedule in own household"
  ON schedule_entries FOR INSERT
  WITH CHECK (household_id = get_user_household_id());

CREATE POLICY "Users can update schedule in own household"
  ON schedule_entries FOR UPDATE
  USING (household_id = get_user_household_id())
  WITH CHECK (household_id = get_user_household_id());

CREATE POLICY "Users can delete schedule in own household"
  ON schedule_entries FOR DELETE
  USING (household_id = get_user_household_id());

-- ============================================================================
-- TV_PROGRESS POLICIES
-- ============================================================================
-- Users can only access progress for profiles in their household
-- Requires join through profiles table to verify household ownership

CREATE POLICY "Users can view progress in own household"
  ON tv_progress FOR SELECT
  USING (profile_id IN (SELECT id FROM profiles WHERE household_id = get_user_household_id()));

CREATE POLICY "Users can insert progress in own household"
  ON tv_progress FOR INSERT
  WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE household_id = get_user_household_id()));

CREATE POLICY "Users can update progress in own household"
  ON tv_progress FOR UPDATE
  USING (profile_id IN (SELECT id FROM profiles WHERE household_id = get_user_household_id()))
  WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE household_id = get_user_household_id()));

CREATE POLICY "Users can delete progress in own household"
  ON tv_progress FOR DELETE
  USING (profile_id IN (SELECT id FROM profiles WHERE household_id = get_user_household_id()));

-- ============================================================================
-- EPISODE_BLURBS POLICIES
-- ============================================================================
-- Episode blurbs are shared content (cached TMDB data or AI-generated)
-- Public read access, no user writes (admin/system only for now)

CREATE POLICY "Anyone can view episode blurbs"
  ON episode_blurbs FOR SELECT
  USING (true);
