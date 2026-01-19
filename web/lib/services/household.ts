import { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Household, Profile } from '@/lib/database.types';

type TypedSupabaseClient = SupabaseClient<Database>;

/**
 * Fetches the current user's household
 * @param supabase - Authenticated Supabase client
 * @returns The user's household or null if not found
 */
export async function getCurrentHousehold(
  supabase: TypedSupabaseClient
): Promise<Household | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('households')
    .select('*')
    .eq('owner_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching household:', error.message);
    return null;
  }

  return data;
}

/**
 * Fetches all profiles for a household
 * @param supabase - Authenticated Supabase client
 * @param householdId - The household ID to fetch profiles for
 * @returns Array of profiles or empty array on error
 */
export async function getHouseholdProfiles(
  supabase: TypedSupabaseClient,
  householdId: string
): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('household_id', householdId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching profiles:', error.message);
    return [];
  }

  return data;
}

/**
 * Fetches a single profile by ID (for session/active profile)
 * @param supabase - Authenticated Supabase client
 * @param profileId - The profile ID to fetch
 * @returns The profile or null if not found
 */
export async function getActiveProfile(
  supabase: TypedSupabaseClient,
  profileId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error.message);
    return null;
  }

  return data;
}
