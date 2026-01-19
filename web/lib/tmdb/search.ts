/**
 * TMDB Search Service
 * Server-side functions for searching TV shows and movies
 */

import { tmdbFetch } from './client';
import type {
  TMDBTVSearchResponse,
  TMDBMovieSearchResponse,
  TMDBMultiSearchResult,
} from './types';

/**
 * Default search parameters
 */
const DEFAULT_PARAMS = {
  include_adult: 'false',
  language: 'en-US',
};

/**
 * Search for TV shows by query string
 *
 * @param query - Search query
 * @param page - Page number (default: 1)
 * @returns Paginated TV show search results
 */
export async function searchTV(
  query: string,
  page: number = 1
): Promise<TMDBTVSearchResponse> {
  return tmdbFetch<TMDBTVSearchResponse>('/search/tv', {
    query,
    page: page.toString(),
    ...DEFAULT_PARAMS,
  });
}

/**
 * Search for movies by query string
 *
 * @param query - Search query
 * @param page - Page number (default: 1)
 * @returns Paginated movie search results
 */
export async function searchMovies(
  query: string,
  page: number = 1
): Promise<TMDBMovieSearchResponse> {
  return tmdbFetch<TMDBMovieSearchResponse>('/search/movie', {
    query,
    page: page.toString(),
    ...DEFAULT_PARAMS,
  });
}

/**
 * Combined search response that unifies TV and movie results
 */
export interface CombinedSearchResponse {
  page: number;
  results: TMDBMultiSearchResult[];
  total_pages: number;
  total_results: number;
}

/**
 * Search for both TV shows and movies, combining results
 * Results are sorted by popularity (highest first)
 *
 * @param query - Search query
 * @param page - Page number (default: 1)
 * @returns Combined and sorted results from both searches
 */
export async function searchMulti(
  query: string,
  page: number = 1
): Promise<CombinedSearchResponse> {
  // Fetch both TV and movie results in parallel
  const [tvResponse, movieResponse] = await Promise.all([
    searchTV(query, page),
    searchMovies(query, page),
  ]);

  // Tag results with media_type and combine
  const tvResults: TMDBMultiSearchResult[] = tvResponse.results.map((item) => ({
    ...item,
    media_type: 'tv' as const,
  }));

  const movieResults: TMDBMultiSearchResult[] = movieResponse.results.map(
    (item) => ({
      ...item,
      media_type: 'movie' as const,
    })
  );

  // Combine and sort by popularity (descending)
  const combinedResults = [...tvResults, ...movieResults].sort(
    (a, b) => b.popularity - a.popularity
  );

  return {
    page,
    results: combinedResults,
    // Use the larger total to indicate more pages may exist
    total_pages: Math.max(tvResponse.total_pages, movieResponse.total_pages),
    total_results: tvResponse.total_results + movieResponse.total_results,
  };
}
