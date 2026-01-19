/**
 * TMDB TV Watch Providers API Route
 * GET /api/tmdb/tv/[id]/providers - Get TV show watch providers by TMDB ID
 *
 * Server-side proxy for TMDB to keep API key secure
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTVWatchProviders } from '@/lib/tmdb/providers';
import { TMDBError } from '@/lib/tmdb/client';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/tmdb/tv/[id]/providers
 *
 * Path parameters:
 * - id (required): TMDB TV show ID
 *
 * Query parameters:
 * - region (optional): ISO 3166-1 country code (default: 'US')
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const tmdbId = parseInt(id, 10);
  const region = request.nextUrl.searchParams.get('region') || 'US';

  if (isNaN(tmdbId) || tmdbId < 1) {
    return NextResponse.json(
      { error: 'Invalid TV show ID' },
      { status: 400 }
    );
  }

  try {
    const providers = await getTVWatchProviders(tmdbId, region);

    // Return empty object if no providers found (not an error)
    return NextResponse.json(providers || {});
  } catch (error) {
    if (error instanceof TMDBError) {
      console.error(`TMDB API error: ${error.message}`);
      return NextResponse.json(
        { error: 'Failed to fetch watch providers', details: error.message },
        { status: error.statusCode >= 500 ? 502 : error.statusCode }
      );
    }

    console.error('Unexpected error fetching watch providers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
