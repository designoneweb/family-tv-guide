/**
 * Library Status Check API Route
 * GET /api/library/check?tmdbId=123
 *
 * Returns whether a title is in the current user's household library
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentHousehold } from '@/lib/services/household';
import { isInLibrary } from '@/lib/services/library';

/**
 * GET /api/library/check
 *
 * Query parameters:
 * - tmdbId (required): TMDB ID to check
 *
 * Returns:
 * - 200: { inLibrary: boolean, titleId?: string }
 * - 400: Missing or invalid tmdbId
 * - 401: Not authenticated
 * - 500: Server error
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tmdbIdParam = searchParams.get('tmdbId');

  // Validate tmdbId parameter
  if (!tmdbIdParam) {
    return NextResponse.json(
      { error: 'Missing tmdbId parameter' },
      { status: 400 }
    );
  }

  const tmdbId = parseInt(tmdbIdParam, 10);
  if (isNaN(tmdbId) || tmdbId <= 0) {
    return NextResponse.json(
      { error: 'Invalid tmdbId parameter. Must be a positive integer.' },
      { status: 400 }
    );
  }

  try {
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's household
    const household = await getCurrentHousehold(supabase);
    if (!household) {
      return NextResponse.json(
        { error: 'No household found for user' },
        { status: 404 }
      );
    }

    // Check if title is in library
    const result = await isInLibrary(supabase, household.id, tmdbId);

    if (result.error) {
      console.error('Library check error:', result.error.message);
      return NextResponse.json(
        { error: 'Failed to check library status' },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Unexpected error in library check:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
