/**
 * TMDB Watch Providers Service
 * Server-side functions for fetching streaming provider availability
 */

import { tmdbFetch, TMDBError } from './client';
import type {
  TMDBWatchProvidersResponse,
  TMDBWatchProviderResult,
} from './types';

/**
 * Default region for watch provider lookups
 */
const DEFAULT_REGION = 'US';

/**
 * Get watch providers for a TV show
 *
 * @param tmdbId - The TMDB series ID
 * @param region - ISO 3166-1 country code (default: 'US')
 * @returns Watch provider result for the region, or null if not available
 * @throws TMDBError for API errors other than 404
 */
export async function getTVWatchProviders(
  tmdbId: number,
  region: string = DEFAULT_REGION
): Promise<TMDBWatchProviderResult | null> {
  try {
    const response = await tmdbFetch<TMDBWatchProvidersResponse>(
      `/tv/${tmdbId}/watch/providers`
    );

    // Extract region-specific result
    const regionResult = response.results[region];
    return regionResult ?? null;
  } catch (error) {
    if (error instanceof TMDBError && error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Get watch providers for a movie
 *
 * @param tmdbId - The TMDB movie ID
 * @param region - ISO 3166-1 country code (default: 'US')
 * @returns Watch provider result for the region, or null if not available
 * @throws TMDBError for API errors other than 404
 */
export async function getMovieWatchProviders(
  tmdbId: number,
  region: string = DEFAULT_REGION
): Promise<TMDBWatchProviderResult | null> {
  try {
    const response = await tmdbFetch<TMDBWatchProvidersResponse>(
      `/movie/${tmdbId}/watch/providers`
    );

    // Extract region-specific result
    const regionResult = response.results[region];
    return regionResult ?? null;
  } catch (error) {
    if (error instanceof TMDBError && error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}
