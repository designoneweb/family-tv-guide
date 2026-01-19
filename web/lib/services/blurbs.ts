/**
 * Blurb Service
 * Handles caching and retrieval of episode blurbs (AI or truncated TMDB)
 */

import { SupabaseClient } from '@supabase/supabase-js';
import type { EpisodeBlurb, BlurbSource } from '@/lib/database.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = SupabaseClient<any, any, any>;

// ============================================================================
// Types
// ============================================================================

export interface BlurbServiceError {
  message: string;
  code?: string;
}

export type BlurbResult<T> =
  | { data: T; error: null }
  | { data: null; error: BlurbServiceError };

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Truncate an overview at sentence boundary if possible
 * Used as fallback when AI synopsis is unavailable
 *
 * @param overview - Full TMDB overview text
 * @param maxLength - Maximum length (default 200 characters)
 * @returns Truncated overview with ellipsis if truncated
 */
export function truncateOverview(overview: string, maxLength: number = 200): string {
  if (!overview) {
    return '';
  }

  // If already short enough, return as-is
  if (overview.length <= maxLength) {
    return overview;
  }

  // Try to find a sentence boundary within the limit
  const truncated = overview.substring(0, maxLength);

  // Look for last sentence-ending punctuation
  const lastPeriod = truncated.lastIndexOf('.');
  const lastExclamation = truncated.lastIndexOf('!');
  const lastQuestion = truncated.lastIndexOf('?');

  const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);

  // If we found a sentence boundary, use it (minimum 50 chars to avoid too-short results)
  if (lastSentenceEnd > 50) {
    return overview.substring(0, lastSentenceEnd + 1);
  }

  // Otherwise truncate at word boundary and add ellipsis
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 50) {
    return truncated.substring(0, lastSpace) + '...';
  }

  // Fallback: hard truncate with ellipsis
  return truncated + '...';
}

// ============================================================================
// Service Functions
// ============================================================================

/**
 * Get a cached blurb for an episode
 *
 * @param supabase - Authenticated Supabase client
 * @param seriesTmdbId - TMDB series ID
 * @param seasonNumber - Season number
 * @param episodeNumber - Episode number
 * @returns Cached blurb or null if not found
 */
export async function getBlurb(
  supabase: AnySupabaseClient,
  seriesTmdbId: number,
  seasonNumber: number,
  episodeNumber: number
): Promise<BlurbResult<EpisodeBlurb | null>> {
  if (typeof seriesTmdbId !== 'number' || seriesTmdbId < 1) {
    return {
      data: null,
      error: { message: 'Series TMDB ID must be a positive number', code: 'VALIDATION_ERROR' },
    };
  }

  if (typeof seasonNumber !== 'number' || seasonNumber < 0) {
    return {
      data: null,
      error: { message: 'Season number must be a non-negative number', code: 'VALIDATION_ERROR' },
    };
  }

  if (typeof episodeNumber !== 'number' || episodeNumber < 1) {
    return {
      data: null,
      error: { message: 'Episode number must be a positive number', code: 'VALIDATION_ERROR' },
    };
  }

  const { data, error } = await supabase
    .from('episode_blurbs')
    .select('*')
    .eq('series_tmdb_id', seriesTmdbId)
    .eq('season_number', seasonNumber)
    .eq('episode_number', episodeNumber)
    .maybeSingle();

  if (error) {
    console.error('Error fetching blurb:', error.message);
    return {
      data: null,
      error: { message: 'Failed to fetch blurb', code: error.code },
    };
  }

  return { data, error: null };
}

/**
 * Save (upsert) a blurb for an episode
 *
 * @param supabase - Authenticated Supabase client
 * @param seriesTmdbId - TMDB series ID
 * @param seasonNumber - Season number
 * @param episodeNumber - Episode number
 * @param blurbText - The blurb text to save
 * @param source - Source of the blurb ('ai' or 'tmdb_truncate')
 * @returns The saved blurb
 */
export async function saveBlurb(
  supabase: AnySupabaseClient,
  seriesTmdbId: number,
  seasonNumber: number,
  episodeNumber: number,
  blurbText: string,
  source: BlurbSource
): Promise<BlurbResult<EpisodeBlurb>> {
  if (typeof seriesTmdbId !== 'number' || seriesTmdbId < 1) {
    return {
      data: null,
      error: { message: 'Series TMDB ID must be a positive number', code: 'VALIDATION_ERROR' },
    };
  }

  if (typeof seasonNumber !== 'number' || seasonNumber < 0) {
    return {
      data: null,
      error: { message: 'Season number must be a non-negative number', code: 'VALIDATION_ERROR' },
    };
  }

  if (typeof episodeNumber !== 'number' || episodeNumber < 1) {
    return {
      data: null,
      error: { message: 'Episode number must be a positive number', code: 'VALIDATION_ERROR' },
    };
  }

  if (!blurbText || typeof blurbText !== 'string') {
    return {
      data: null,
      error: { message: 'Blurb text is required', code: 'VALIDATION_ERROR' },
    };
  }

  if (source !== 'ai' && source !== 'tmdb_truncate') {
    return {
      data: null,
      error: { message: 'Source must be "ai" or "tmdb_truncate"', code: 'VALIDATION_ERROR' },
    };
  }

  const { data, error } = await supabase
    .from('episode_blurbs')
    .upsert(
      {
        series_tmdb_id: seriesTmdbId,
        season_number: seasonNumber,
        episode_number: episodeNumber,
        blurb_text: blurbText,
        source,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'series_tmdb_id,season_number,episode_number',
      }
    )
    .select()
    .single();

  if (error) {
    console.error('Error saving blurb:', error.message);
    return {
      data: null,
      error: { message: 'Failed to save blurb', code: error.code },
    };
  }

  return { data, error: null };
}
