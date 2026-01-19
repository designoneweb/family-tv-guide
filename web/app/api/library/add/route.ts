/**
 * Library Add API Route
 * POST /api/library/add
 *
 * Adds a title to the current user's household library
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentHousehold } from '@/lib/services/household';
import { addTitle } from '@/lib/services/library';
import type { MediaType } from '@/lib/database.types';

interface AddTitleBody {
  tmdbId: number;
  mediaType: MediaType;
}

/**
 * POST /api/library/add
 *
 * Request body:
 * - tmdbId (required): TMDB ID of the title
 * - mediaType (required): 'tv' or 'movie'
 *
 * Returns:
 * - 200: The created TrackedTitle
 * - 400: Invalid request body
 * - 401: Not authenticated
 * - 404: No household found
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  let body: AddTitleBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Validate body
  if (!body.tmdbId || typeof body.tmdbId !== 'number' || body.tmdbId <= 0) {
    return NextResponse.json(
      { error: 'Invalid or missing tmdbId' },
      { status: 400 }
    );
  }

  if (!body.mediaType || !['tv', 'movie'].includes(body.mediaType)) {
    return NextResponse.json(
      { error: 'Invalid or missing mediaType. Must be tv or movie.' },
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

    // Add title to library
    const result = await addTitle(supabase, {
      householdId: household.id,
      tmdbId: body.tmdbId,
      mediaType: body.mediaType,
    });

    if (result.error) {
      console.error('Add title error:', result.error.message);
      return NextResponse.json(
        { error: 'Failed to add title to library' },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Unexpected error in library add:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
