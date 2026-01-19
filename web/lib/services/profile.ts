import { SupabaseClient } from '@supabase/supabase-js';
import type { Profile, MaturityLevel } from '@/lib/database.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = SupabaseClient<any, any, any>;

// ============================================================================
// Types
// ============================================================================

export interface CreateProfileData {
  name: string;
  avatar?: string | null;
  maturity_level: MaturityLevel;
  household_id: string;
}

export interface UpdateProfileData {
  name?: string;
  avatar?: string | null;
  maturity_level?: MaturityLevel;
}

export interface ProfileServiceError {
  message: string;
  code?: string;
}

export type ProfileResult<T> =
  | { data: T; error: null }
  | { data: null; error: ProfileServiceError };

// ============================================================================
// Validation
// ============================================================================

const VALID_MATURITY_LEVELS: MaturityLevel[] = ['kids', 'teen', 'adult'];

function validateCreateData(data: CreateProfileData): ProfileServiceError | null {
  if (!data.name || data.name.trim().length === 0) {
    return { message: 'Profile name is required', code: 'VALIDATION_ERROR' };
  }

  if (data.name.trim().length > 50) {
    return { message: 'Profile name must be 50 characters or less', code: 'VALIDATION_ERROR' };
  }

  if (!VALID_MATURITY_LEVELS.includes(data.maturity_level)) {
    return {
      message: 'Maturity level must be kids, teen, or adult',
      code: 'VALIDATION_ERROR',
    };
  }

  if (!data.household_id) {
    return { message: 'Household ID is required', code: 'VALIDATION_ERROR' };
  }

  return null;
}

function validateUpdateData(data: UpdateProfileData): ProfileServiceError | null {
  if (data.name !== undefined) {
    if (data.name.trim().length === 0) {
      return { message: 'Profile name cannot be empty', code: 'VALIDATION_ERROR' };
    }
    if (data.name.trim().length > 50) {
      return { message: 'Profile name must be 50 characters or less', code: 'VALIDATION_ERROR' };
    }
  }

  if (data.maturity_level !== undefined) {
    if (!VALID_MATURITY_LEVELS.includes(data.maturity_level)) {
      return {
        message: 'Maturity level must be kids, teen, or adult',
        code: 'VALIDATION_ERROR',
      };
    }
  }

  return null;
}

// ============================================================================
// Service Functions
// ============================================================================

/**
 * Creates a new profile in the household
 * @param supabase - Authenticated Supabase client
 * @param data - Profile data (name, avatar, maturity_level, household_id)
 * @returns The created profile or error
 */
export async function createProfile(
  supabase: AnySupabaseClient,
  data: CreateProfileData
): Promise<ProfileResult<Profile>> {
  // Validate input
  const validationError = validateCreateData(data);
  if (validationError) {
    return { data: null, error: validationError };
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .insert({
      name: data.name.trim(),
      avatar: data.avatar || null,
      maturity_level: data.maturity_level,
      household_id: data.household_id,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating profile:', error.message);
    return {
      data: null,
      error: { message: 'Failed to create profile', code: error.code },
    };
  }

  return { data: profile, error: null };
}

/**
 * Updates an existing profile
 * @param supabase - Authenticated Supabase client
 * @param id - Profile ID to update
 * @param data - Fields to update (name, avatar, maturity_level)
 * @returns The updated profile or error
 */
export async function updateProfile(
  supabase: AnySupabaseClient,
  id: string,
  data: UpdateProfileData
): Promise<ProfileResult<Profile>> {
  // Validate input
  const validationError = validateUpdateData(data);
  if (validationError) {
    return { data: null, error: validationError };
  }

  if (!id) {
    return { data: null, error: { message: 'Profile ID is required', code: 'VALIDATION_ERROR' } };
  }

  // Build update object with only provided fields
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) {
    updateData.name = data.name.trim();
  }
  if (data.avatar !== undefined) {
    updateData.avatar = data.avatar;
  }
  if (data.maturity_level !== undefined) {
    updateData.maturity_level = data.maturity_level;
  }

  // Check if there's anything to update
  if (Object.keys(updateData).length === 0) {
    return { data: null, error: { message: 'No fields to update', code: 'VALIDATION_ERROR' } };
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error.message);
    return {
      data: null,
      error: { message: 'Failed to update profile', code: error.code },
    };
  }

  return { data: profile, error: null };
}

/**
 * Deletes a profile
 * @param supabase - Authenticated Supabase client
 * @param id - Profile ID to delete
 * @returns Success status or error
 */
export async function deleteProfile(
  supabase: AnySupabaseClient,
  id: string
): Promise<ProfileResult<{ deleted: true }>> {
  if (!id) {
    return { data: null, error: { message: 'Profile ID is required', code: 'VALIDATION_ERROR' } };
  }

  const { error } = await supabase.from('profiles').delete().eq('id', id);

  if (error) {
    console.error('Error deleting profile:', error.message);
    return {
      data: null,
      error: { message: 'Failed to delete profile', code: error.code },
    };
  }

  return { data: { deleted: true }, error: null };
}

/**
 * Fetches a single profile by ID
 * @param supabase - Authenticated Supabase client
 * @param id - Profile ID to fetch
 * @returns The profile or error
 */
export async function getProfileById(
  supabase: AnySupabaseClient,
  id: string
): Promise<ProfileResult<Profile>> {
  if (!id) {
    return { data: null, error: { message: 'Profile ID is required', code: 'VALIDATION_ERROR' } };
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error.message);
    return {
      data: null,
      error: { message: 'Profile not found', code: error.code },
    };
  }

  return { data: profile, error: null };
}
