import { SupabaseClient } from '@supabase/supabase-js';
import type { TvProgress, MediaType } from '@/lib/database.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = SupabaseClient<any, any, any>;

// ============================================================================
// Types
// ============================================================================

export interface ProgressServiceError {
  message: string;
  code?: string;
}

export type ProgressResult<T> =
  | { data: T; error: null }
  | { data: null; error: ProgressServiceError };

/**
 * Progress entry with joined tracked_titles info for TMDB lookups
 */
export interface ProgressWithTitle extends TvProgress {
  tmdb_id: number;
  media_type: MediaType;
}

// ============================================================================
// Service Functions
// ============================================================================

/**
 * Get current progress for a specific show
 * @param supabase - Authenticated Supabase client
 * @param profileId - Profile ID
 * @param trackedTitleId - Tracked title ID
 * @returns Progress entry or null if not found
 */
export async function getProgress(
  supabase: AnySupabaseClient,
  profileId: string,
  trackedTitleId: string
): Promise<ProgressResult<TvProgress | null>> {
  if (!profileId) {
    return { data: null, error: { message: 'Profile ID is required', code: 'VALIDATION_ERROR' } };
  }

  if (!trackedTitleId) {
    return { data: null, error: { message: 'Tracked title ID is required', code: 'VALIDATION_ERROR' } };
  }

  const { data, error } = await supabase
    .from('tv_progress')
    .select('*')
    .eq('profile_id', profileId)
    .eq('tracked_title_id', trackedTitleId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching progress:', error.message);
    return {
      data: null,
      error: { message: 'Failed to fetch progress', code: error.code },
    };
  }

  return { data, error: null };
}

/**
 * Get all progress entries for a profile
 * Includes tmdb_id and media_type from joined tracked_titles
 * @param supabase - Authenticated Supabase client
 * @param profileId - Profile ID
 * @returns Array of progress entries with title info
 */
export async function getProgressForProfile(
  supabase: AnySupabaseClient,
  profileId: string
): Promise<ProgressResult<ProgressWithTitle[]>> {
  if (!profileId) {
    return { data: null, error: { message: 'Profile ID is required', code: 'VALIDATION_ERROR' } };
  }

  const { data, error } = await supabase
    .from('tv_progress')
    .select(`
      *,
      tracked_titles!inner (
        tmdb_id,
        media_type
      )
    `)
    .eq('profile_id', profileId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching progress for profile:', error.message);
    return {
      data: null,
      error: { message: 'Failed to fetch progress', code: error.code },
    };
  }

  // Flatten the nested tracked_titles into the progress object
  const progressWithTitles: ProgressWithTitle[] = (data || []).map((entry) => {
    const { tracked_titles, ...progress } = entry;
    return {
      ...progress,
      tmdb_id: tracked_titles.tmdb_id,
      media_type: tracked_titles.media_type,
    };
  });

  return { data: progressWithTitles, error: null };
}

/**
 * Set/upsert progress for a show
 * @param supabase - Authenticated Supabase client
 * @param profileId - Profile ID
 * @param trackedTitleId - Tracked title ID
 * @param seasonNumber - Current season number
 * @param episodeNumber - Current episode number
 * @returns The upserted progress entry
 */
export async function setProgress(
  supabase: AnySupabaseClient,
  profileId: string,
  trackedTitleId: string,
  seasonNumber: number,
  episodeNumber: number
): Promise<ProgressResult<TvProgress>> {
  if (!profileId) {
    return { data: null, error: { message: 'Profile ID is required', code: 'VALIDATION_ERROR' } };
  }

  if (!trackedTitleId) {
    return { data: null, error: { message: 'Tracked title ID is required', code: 'VALIDATION_ERROR' } };
  }

  if (typeof seasonNumber !== 'number' || seasonNumber < 1) {
    return { data: null, error: { message: 'Season number must be a positive number', code: 'VALIDATION_ERROR' } };
  }

  if (typeof episodeNumber !== 'number' || episodeNumber < 1) {
    return { data: null, error: { message: 'Episode number must be a positive number', code: 'VALIDATION_ERROR' } };
  }

  const { data, error } = await supabase
    .from('tv_progress')
    .upsert(
      {
        profile_id: profileId,
        tracked_title_id: trackedTitleId,
        season_number: seasonNumber,
        episode_number: episodeNumber,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'profile_id,tracked_title_id',
      }
    )
    .select()
    .single();

  if (error) {
    console.error('Error setting progress:', error.message);
    return {
      data: null,
      error: { message: 'Failed to set progress', code: error.code },
    };
  }

  return { data, error: null };
}

/**
 * Advance to the next episode
 * - If episode < totalEpisodesInSeason: increment episode
 * - Else if season < totalSeasons: increment season, reset episode to 1
 * - Else: return current (show complete)
 *
 * @param supabase - Authenticated Supabase client
 * @param profileId - Profile ID
 * @param trackedTitleId - Tracked title ID
 * @param totalEpisodesInSeason - Total episodes in the current season
 * @param totalSeasons - Total seasons in the show
 * @returns The updated progress entry
 */
export async function advanceEpisode(
  supabase: AnySupabaseClient,
  profileId: string,
  trackedTitleId: string,
  totalEpisodesInSeason: number,
  totalSeasons: number
): Promise<ProgressResult<TvProgress>> {
  if (!profileId) {
    return { data: null, error: { message: 'Profile ID is required', code: 'VALIDATION_ERROR' } };
  }

  if (!trackedTitleId) {
    return { data: null, error: { message: 'Tracked title ID is required', code: 'VALIDATION_ERROR' } };
  }

  if (typeof totalEpisodesInSeason !== 'number' || totalEpisodesInSeason < 1) {
    return { data: null, error: { message: 'Total episodes in season must be a positive number', code: 'VALIDATION_ERROR' } };
  }

  if (typeof totalSeasons !== 'number' || totalSeasons < 1) {
    return { data: null, error: { message: 'Total seasons must be a positive number', code: 'VALIDATION_ERROR' } };
  }

  // Get current progress
  const currentResult = await getProgress(supabase, profileId, trackedTitleId);

  if (currentResult.error) {
    return { data: null, error: currentResult.error };
  }

  // Default to S1E1 if no progress exists
  const current = currentResult.data || {
    season_number: 1,
    episode_number: 1,
  };

  let newSeason = current.season_number;
  let newEpisode = current.episode_number;

  if (current.episode_number < totalEpisodesInSeason) {
    // Advance to next episode in current season
    newEpisode = current.episode_number + 1;
  } else if (current.season_number < totalSeasons) {
    // Advance to next season, reset to episode 1
    newSeason = current.season_number + 1;
    newEpisode = 1;
  }
  // Else: show is complete, keep current position

  // Upsert the new progress
  return setProgress(supabase, profileId, trackedTitleId, newSeason, newEpisode);
}
