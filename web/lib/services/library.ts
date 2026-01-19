import { SupabaseClient } from '@supabase/supabase-js';
import type { TrackedTitle, MediaType } from '@/lib/database.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = SupabaseClient<any, any, any>;

// ============================================================================
// Types
// ============================================================================

export interface AddTitleData {
  householdId: string;
  tmdbId: number;
  mediaType: MediaType;
}

export interface LibraryServiceError {
  message: string;
  code?: string;
}

export type LibraryResult<T> =
  | { data: T; error: null }
  | { data: null; error: LibraryServiceError };

// ============================================================================
// Validation
// ============================================================================

const VALID_MEDIA_TYPES: MediaType[] = ['tv', 'movie'];

function validateAddData(data: AddTitleData): LibraryServiceError | null {
  if (!data.householdId) {
    return { message: 'Household ID is required', code: 'VALIDATION_ERROR' };
  }

  if (!data.tmdbId || data.tmdbId <= 0) {
    return { message: 'TMDB ID must be a positive number', code: 'VALIDATION_ERROR' };
  }

  if (!VALID_MEDIA_TYPES.includes(data.mediaType)) {
    return {
      message: 'Media type must be tv or movie',
      code: 'VALIDATION_ERROR',
    };
  }

  return null;
}

// ============================================================================
// Service Functions
// ============================================================================

/**
 * Adds a title to the household library
 * Uses upsert to handle duplicates gracefully - returns existing if already added
 * @param supabase - Authenticated Supabase client
 * @param data - Title data (householdId, tmdbId, mediaType)
 * @returns The created or existing tracked title or error
 */
export async function addTitle(
  supabase: AnySupabaseClient,
  data: AddTitleData
): Promise<LibraryResult<TrackedTitle>> {
  // Validate input
  const validationError = validateAddData(data);
  if (validationError) {
    return { data: null, error: validationError };
  }

  const { data: title, error } = await supabase
    .from('tracked_titles')
    .upsert(
      {
        household_id: data.householdId,
        tmdb_id: data.tmdbId,
        media_type: data.mediaType,
      },
      {
        onConflict: 'household_id,tmdb_id',
        ignoreDuplicates: false,
      }
    )
    .select()
    .single();

  if (error) {
    console.error('Error adding title to library:', error.message);
    return {
      data: null,
      error: { message: 'Failed to add title to library', code: error.code },
    };
  }

  return { data: title, error: null };
}

/**
 * Removes a title from the household library
 * @param supabase - Authenticated Supabase client
 * @param id - Tracked title ID to remove
 * @returns Success status or error
 */
export async function removeTitle(
  supabase: AnySupabaseClient,
  id: string
): Promise<LibraryResult<{ deleted: true }>> {
  if (!id) {
    return { data: null, error: { message: 'Title ID is required', code: 'VALIDATION_ERROR' } };
  }

  const { error } = await supabase.from('tracked_titles').delete().eq('id', id);

  if (error) {
    console.error('Error removing title from library:', error.message);
    return {
      data: null,
      error: { message: 'Failed to remove title from library', code: error.code },
    };
  }

  return { data: { deleted: true }, error: null };
}

/**
 * Gets all titles in a household's library
 * @param supabase - Authenticated Supabase client
 * @param householdId - Household ID to fetch library for
 * @param mediaType - Optional filter by media type (tv or movie)
 * @returns Array of tracked titles or error
 */
export async function getLibrary(
  supabase: AnySupabaseClient,
  householdId: string,
  mediaType?: MediaType
): Promise<LibraryResult<TrackedTitle[]>> {
  if (!householdId) {
    return { data: null, error: { message: 'Household ID is required', code: 'VALIDATION_ERROR' } };
  }

  let query = supabase
    .from('tracked_titles')
    .select('*')
    .eq('household_id', householdId)
    .order('added_at', { ascending: false });

  if (mediaType) {
    query = query.eq('media_type', mediaType);
  }

  const { data: titles, error } = await query;

  if (error) {
    console.error('Error fetching library:', error.message);
    return {
      data: null,
      error: { message: 'Failed to fetch library', code: error.code },
    };
  }

  return { data: titles, error: null };
}

/**
 * Checks if a TMDB title is in the household library
 * @param supabase - Authenticated Supabase client
 * @param householdId - Household ID to check
 * @param tmdbId - TMDB ID to look for
 * @returns Whether the title is in the library and its ID if so
 */
export async function isInLibrary(
  supabase: AnySupabaseClient,
  householdId: string,
  tmdbId: number
): Promise<LibraryResult<{ inLibrary: boolean; titleId?: string }>> {
  if (!householdId) {
    return { data: null, error: { message: 'Household ID is required', code: 'VALIDATION_ERROR' } };
  }

  if (!tmdbId || tmdbId <= 0) {
    return { data: null, error: { message: 'TMDB ID must be a positive number', code: 'VALIDATION_ERROR' } };
  }

  const { data: title, error } = await supabase
    .from('tracked_titles')
    .select('id')
    .eq('household_id', householdId)
    .eq('tmdb_id', tmdbId)
    .maybeSingle();

  if (error) {
    console.error('Error checking library status:', error.message);
    return {
      data: null,
      error: { message: 'Failed to check library status', code: error.code },
    };
  }

  if (title) {
    return { data: { inLibrary: true, titleId: title.id }, error: null };
  }

  return { data: { inLibrary: false }, error: null };
}
