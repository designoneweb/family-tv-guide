-- Provision households for existing users who don't have one
-- Migration: 20260119020000_provision_existing_users
-- This is a one-time fix for users who signed up before auto-provisioning was enabled

-- Create households and profiles for existing users who don't have one
DO $$
DECLARE
  user_record RECORD;
  new_household_id uuid;
BEGIN
  FOR user_record IN
    SELECT au.id, au.email
    FROM auth.users au
    LEFT JOIN public.households h ON h.owner_id = au.id
    WHERE h.id IS NULL
  LOOP
    -- Create household for existing user
    INSERT INTO public.households (name, owner_id)
    VALUES ('My Household', user_record.id)
    RETURNING id INTO new_household_id;

    -- Create default profile
    INSERT INTO public.profiles (household_id, name, maturity_level)
    VALUES (new_household_id, 'Me', 'adult');

    RAISE NOTICE 'Provisioned household for user: %', user_record.email;
  END LOOP;
END;
$$;
