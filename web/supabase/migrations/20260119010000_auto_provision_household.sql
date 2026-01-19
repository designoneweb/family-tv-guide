-- Auto-provision household and profile for new users
-- Migration: 20260119010000_auto_provision_household

-- ============================================================================
-- AUTO-PROVISIONING FUNCTION
-- ============================================================================
-- Creates a household and default profile when a new user signs up
-- Uses SECURITY DEFINER to bypass RLS for initial provisioning

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
  new_household_id uuid;
BEGIN
  -- Create household for new user
  INSERT INTO public.households (name, owner_id)
  VALUES ('My Household', NEW.id)
  RETURNING id INTO new_household_id;

  -- Create default profile
  INSERT INTO public.profiles (household_id, name, maturity_level)
  VALUES (new_household_id, 'Me', 'adult');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- AUTH USER TRIGGER
-- ============================================================================
-- Fires after new user is created in auth.users

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
