/**
 * TMDB API type definitions
 * Types for search responses and common structures
 */

// ============================================================================
// MEDIA TYPE
// ============================================================================

/**
 * Media type matching database.types.ts MediaType
 */
export type MediaType = 'tv' | 'movie';

// ============================================================================
// SEARCH RESULT TYPES
// ============================================================================

/**
 * Common fields across TV and movie search results
 */
interface TMDBSearchResultBase {
  id: number;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  popularity: number;
}

/**
 * TV show search result from /search/tv
 */
export interface TMDBTVSearchResult extends TMDBSearchResultBase {
  name: string;
  first_air_date: string;
  origin_country: string[];
}

/**
 * Movie search result from /search/movie
 */
export interface TMDBMovieSearchResult extends TMDBSearchResultBase {
  title: string;
  release_date: string;
  original_language: string;
}

/**
 * Multi-search can return TV, movie, or person results
 * We only care about TV and movie for our use case
 */
export type TMDBMultiSearchResult =
  | (TMDBTVSearchResult & { media_type: 'tv' })
  | (TMDBMovieSearchResult & { media_type: 'movie' });

// ============================================================================
// PAGINATED RESPONSE TYPES
// ============================================================================

/**
 * Common pagination wrapper for all search responses
 */
interface TMDBPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

/**
 * TV search response from /search/tv
 */
export type TMDBTVSearchResponse = TMDBPaginatedResponse<TMDBTVSearchResult>;

/**
 * Movie search response from /search/movie
 */
export type TMDBMovieSearchResponse = TMDBPaginatedResponse<TMDBMovieSearchResult>;

/**
 * Multi-search response from /search/multi
 */
export type TMDBMultiSearchResponse = TMDBPaginatedResponse<TMDBMultiSearchResult>;

// ============================================================================
// DETAIL TYPES
// ============================================================================

/**
 * Genre object used in detail responses
 */
export interface TMDBGenre {
  id: number;
  name: string;
}

/**
 * Full TV show details from /tv/{series_id}
 */
export interface TMDBTVDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
  genres: TMDBGenre[];
  vote_average: number;
}

/**
 * Full movie details from /movie/{movie_id}
 */
export interface TMDBMovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number | null;
  status: string;
  genres: TMDBGenre[];
  vote_average: number;
}

// ============================================================================
// WATCH PROVIDER TYPES
// ============================================================================

/**
 * Individual streaming provider
 */
export interface TMDBWatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

/**
 * Watch provider availability for a region
 */
export interface TMDBWatchProviderResult {
  flatrate?: TMDBWatchProvider[];
  rent?: TMDBWatchProvider[];
  buy?: TMDBWatchProvider[];
  link?: string;
}

/**
 * Full watch providers response from TMDB
 */
export interface TMDBWatchProvidersResponse {
  id: number;
  results: Record<string, TMDBWatchProviderResult>;
}
