/**
 * TMDB TV Season API Route
 * GET /api/tmdb/tv/[id]/season/[seasonNumber] - Get season details by TMDB ID and season number
 *
 * Server-side proxy for TMDB to keep API key secure
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTVSeason } from '@/lib/tmdb/details';
import { TMDBError } from '@/lib/tmdb/client';

interface RouteParams {
  params: Promise<{ id: string; seasonNumber: string }>;
}

/**
 * GET /api/tmdb/tv/[id]/season/[seasonNumber]
 *
 * Path parameters:
 * - id (required): TMDB TV show ID
 * - seasonNumber (required): Season number (1-indexed)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id, seasonNumber } = await params;
  const tmdbId = parseInt(id, 10);
  const seasonNum = parseInt(seasonNumber, 10);

  if (isNaN(tmdbId) || tmdbId < 1) {
    return NextResponse.json(
      { error: 'Invalid TV show ID' },
      { status: 400 }
    );
  }

  if (isNaN(seasonNum) || seasonNum < 0) {
    return NextResponse.json(
      { error: 'Invalid season number' },
      { status: 400 }
    );
  }

  try {
    const season = await getTVSeason(tmdbId, seasonNum);

    if (!season) {
      return NextResponse.json(
        { error: 'Season not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(season);
  } catch (error) {
    if (error instanceof TMDBError) {
      console.error(`TMDB API error: ${error.message}`);
      return NextResponse.json(
        { error: 'Failed to fetch season details', details: error.message },
        { status: error.statusCode >= 500 ? 502 : error.statusCode }
      );
    }

    console.error('Unexpected error fetching season details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
