/**
 * TMDB API client
 * Server-side only - API key is never exposed to client
 */

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Get the TMDB API key from environment variables
 * Throws a clear error if not configured
 */
function getApiKey(): string {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    throw new Error(
      'TMDB_API_KEY environment variable is not set. ' +
        'Please add it to your .env.local file.'
    );
  }

  return apiKey;
}

/**
 * Custom error for TMDB API failures
 */
export class TMDBError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public endpoint: string
  ) {
    super(message);
    this.name = 'TMDBError';
  }
}

/**
 * Fetch wrapper for TMDB API calls
 * Handles authentication, error handling, and response parsing
 *
 * @param endpoint - API endpoint path (e.g., '/search/tv')
 * @param params - Query parameters to include in the request
 * @returns Parsed JSON response
 * @throws TMDBError if the request fails
 */
export async function tmdbFetch<T>(
  endpoint: string,
  params?: Record<string, string>
): Promise<T> {
  const apiKey = getApiKey();

  // Build URL with query parameters
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  // Make request with Bearer token auth
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  // Handle error responses
  if (!response.ok) {
    const errorBody = await response.text();
    throw new TMDBError(
      `TMDB API error: ${response.status} - ${errorBody}`,
      response.status,
      endpoint
    );
  }

  // Parse and return JSON response
  return response.json() as Promise<T>;
}
