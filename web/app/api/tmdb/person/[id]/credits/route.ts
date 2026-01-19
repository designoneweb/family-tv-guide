/**
 * TMDB Person Combined Credits API Route
 * GET /api/tmdb/person/[id]/credits - Get person's combined TV and movie credits
 *
 * Server-side proxy for TMDB to keep API key secure
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPersonCombinedCredits } from '@/lib/tmdb/details';
import { TMDBError } from '@/lib/tmdb/client';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/tmdb/person/[id]/credits
 *
 * Path parameters:
 * - id (required): TMDB person ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const personId = parseInt(id, 10);

  if (isNaN(personId) || personId < 1) {
    return NextResponse.json(
      { error: 'Invalid person ID' },
      { status: 400 }
    );
  }

  try {
    const credits = await getPersonCombinedCredits(personId);

    if (!credits) {
      return NextResponse.json(
        { error: 'Person not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(credits);
  } catch (error) {
    if (error instanceof TMDBError) {
      console.error(`TMDB API error: ${error.message}`);
      return NextResponse.json(
        { error: 'Failed to fetch person credits', details: error.message },
        { status: error.statusCode >= 500 ? 502 : error.statusCode }
      );
    }

    console.error('Unexpected error fetching person credits:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
