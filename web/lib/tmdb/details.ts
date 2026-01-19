/**
 * TMDB Detail Fetching Service
 * Server-side functions for fetching TV show and movie details
 */

import { tmdbFetch, TMDBError } from './client';
import type {
  TMDBTVDetails,
  TMDBMovieDetails,
  TMDBSeason,
  TMDBEpisode,
  TMDBEpisodeCredits,
  TMDBPersonDetails,
  TMDBPersonCombinedCredits,
} from './types';

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

/**
 * Fetch TV season details by series ID and season number
 *
 * @param seriesId - The TMDB series ID
 * @param seasonNumber - The season number (1-indexed)
 * @returns Season details with episodes or null if not found
 * @throws TMDBError for API errors other than 404
 */
export async function getTVSeason(
  seriesId: number,
  seasonNumber: number
): Promise<TMDBSeason | null> {
  try {
    return await tmdbFetch<TMDBSeason>(`/tv/${seriesId}/season/${seasonNumber}`, {
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
 * Fetch TV episode details by series ID, season number, and episode number
 *
 * @param seriesId - The TMDB series ID
 * @param seasonNumber - The season number (1-indexed)
 * @param episodeNumber - The episode number (1-indexed)
 * @returns Episode details or null if not found
 * @throws TMDBError for API errors other than 404
 */
export async function getTVEpisode(
  seriesId: number,
  seasonNumber: number,
  episodeNumber: number
): Promise<TMDBEpisode | null> {
  try {
    return await tmdbFetch<TMDBEpisode>(
      `/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}`,
      {
        language: 'en-US',
      }
    );
  } catch (error) {
    if (error instanceof TMDBError && error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Fetch TV episode credits by series ID, season number, and episode number
 *
 * @param seriesId - The TMDB series ID
 * @param seasonNumber - The season number (1-indexed)
 * @param episodeNumber - The episode number (1-indexed)
 * @returns Episode credits or null if not found
 * @throws TMDBError for API errors other than 404
 */
export async function getEpisodeCredits(
  seriesId: number,
  seasonNumber: number,
  episodeNumber: number
): Promise<TMDBEpisodeCredits | null> {
  try {
    return await tmdbFetch<TMDBEpisodeCredits>(
      `/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}/credits`,
      {
        language: 'en-US',
      }
    );
  } catch (error) {
    if (error instanceof TMDBError && error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Fetch person details by TMDB person ID
 *
 * @param personId - The TMDB person ID
 * @returns Person details or null if not found
 * @throws TMDBError for API errors other than 404
 */
export async function getPersonDetails(
  personId: number
): Promise<TMDBPersonDetails | null> {
  try {
    return await tmdbFetch<TMDBPersonDetails>(`/person/${personId}`, {
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
 * Fetch person's combined credits (TV and movie cast/crew roles)
 *
 * @param personId - The TMDB person ID
 * @returns Combined credits or null if not found
 * @throws TMDBError for API errors other than 404
 */
export async function getPersonCombinedCredits(
  personId: number
): Promise<TMDBPersonCombinedCredits | null> {
  try {
    return await tmdbFetch<TMDBPersonCombinedCredits>(
      `/person/${personId}/combined_credits`,
      {
        language: 'en-US',
      }
    );
  } catch (error) {
    if (error instanceof TMDBError && error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}
