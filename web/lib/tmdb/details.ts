/**
 * TMDB Detail Fetching Service
 * Server-side functions for fetching TV show and movie details
 */

import { tmdbFetch, TMDBError } from './client';
import type { TMDBTVDetails, TMDBMovieDetails } from './types';

/**
 * Fetch full TV show details by TMDB ID
 *
 * @param tmdbId - The TMDB series ID
 * @returns TV show details or null if not found
 * @throws TMDBError for API errors other than 404
 */
export async function getTVDetails(
  tmdbId: number
): Promise<TMDBTVDetails | null> {
  try {
    return await tmdbFetch<TMDBTVDetails>(`/tv/${tmdbId}`, {
      language: 'en-US',
    });
  } catch (error) {
    if (error instanceof TMDBError && error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Fetch full movie details by TMDB ID
 *
 * @param tmdbId - The TMDB movie ID
 * @returns Movie details or null if not found
 * @throws TMDBError for API errors other than 404
 */
export async function getMovieDetails(
  tmdbId: number
): Promise<TMDBMovieDetails | null> {
  try {
    return await tmdbFetch<TMDBMovieDetails>(`/movie/${tmdbId}`, {
      language: 'en-US',
    });
  } catch (error) {
    if (error instanceof TMDBError && error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}
