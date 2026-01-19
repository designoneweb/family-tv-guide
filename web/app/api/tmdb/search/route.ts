/**
 * TMDB Search API Route
 * GET /api/tmdb/search?query=...&type=tv|movie|multi
 *
 * Server-side proxy for TMDB search to keep API key secure
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchTV, searchMovies, searchMulti } from '@/lib/tmdb/search';
import { TMDBError } from '@/lib/tmdb/client';

/**
 * Valid search type values
 */
type SearchType = 'tv' | 'movie' | 'multi';

const VALID_TYPES: SearchType[] = ['tv', 'movie', 'multi'];

/**
 * GET /api/tmdb/search
 *
 * Query parameters:
 * - query (required): Search query string
 * - type (optional): 'tv', 'movie', or 'multi' (default: 'multi')
 * - page (optional): Page number (default: 1)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  const type = (searchParams.get('type') || 'multi') as SearchType;
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Validate query parameter
  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { error: 'Missing or empty query parameter' },
      { status: 400 }
    );
  }

  // Validate type parameter
  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json(
      { error: `Invalid type parameter. Must be one of: ${VALID_TYPES.join(', ')}` },
      { status: 400 }
    );
  }

  // Validate page parameter
  if (isNaN(page) || page < 1) {
    return NextResponse.json(
      { error: 'Invalid page parameter. Must be a positive integer.' },
      { status: 400 }
    );
  }

  try {
    let results;

    switch (type) {
      case 'tv':
        results = await searchTV(query.trim(), page);
        break;
      case 'movie':
        results = await searchMovies(query.trim(), page);
        break;
      case 'multi':
      default:
        results = await searchMulti(query.trim(), page);
        break;
    }

    return NextResponse.json(results);
  } catch (error) {
    // Handle TMDB-specific errors
    if (error instanceof TMDBError) {
      console.error(`TMDB API error: ${error.message}`);
      return NextResponse.json(
        { error: 'Failed to search TMDB', details: error.message },
        { status: error.statusCode >= 500 ? 502 : error.statusCode }
      );
    }

    // Handle unexpected errors
    console.error('Unexpected error in TMDB search:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
