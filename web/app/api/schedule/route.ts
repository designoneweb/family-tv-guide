/**
 * Schedule API Route
 * GET /api/schedule - Get week schedule for a profile
 * POST /api/schedule - Add title to schedule
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getWeekSchedule, addToSchedule } from '@/lib/services/schedule';
import { getCurrentHousehold } from '@/lib/services/household';

/**
 * GET /api/schedule
 *
 * Query parameters:
 * - profileId (required): Profile ID to fetch schedule for
 *
 * Returns:
 * - 200: { schedule: { [weekday: number]: ScheduleEntry[] } }
 * - 400: Missing profileId
 * - 401: Not authenticated
 * - 500: Server error
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get('profileId');

  if (!profileId) {
    return NextResponse.json(
      { error: 'profileId query parameter is required' },
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

    // Fetch week schedule
    const result = await getWeekSchedule(supabase, profileId);

    if (result.error) {
      console.error('Schedule fetch error:', result.error.message);
      return NextResponse.json(
        { error: 'Failed to fetch schedule' },
        { status: 500 }
      );
    }

    return NextResponse.json({ schedule: result.data });
  } catch (error) {
    console.error('Unexpected error in schedule fetch:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

interface AddToScheduleBody {
  profileId: string;
  trackedTitleId: string;
  weekday: number;
}

/**
 * POST /api/schedule
 *
 * Request body:
 * - profileId (required): Profile ID
 * - trackedTitleId (required): Tracked title ID to add
 * - weekday (required): Day of week (0-6)
 *
 * Returns:
 * - 200: { entry: ScheduleEntry }
 * - 400: Invalid request body
 * - 401: Not authenticated
 * - 404: No household found
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  let body: AddToScheduleBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Validate body
  if (!body.profileId) {
    return NextResponse.json(
      { error: 'profileId is required' },
      { status: 400 }
    );
  }

  if (!body.trackedTitleId) {
    return NextResponse.json(
      { error: 'trackedTitleId is required' },
      { status: 400 }
    );
  }

  if (typeof body.weekday !== 'number' || body.weekday < 0 || body.weekday > 6) {
    return NextResponse.json(
      { error: 'weekday must be a number between 0 and 6' },
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

    // Add to schedule
    const result = await addToSchedule(supabase, {
      profileId: body.profileId,
      trackedTitleId: body.trackedTitleId,
      weekday: body.weekday,
      householdId: household.id,
    });

    if (result.error) {
      console.error('Add to schedule error:', result.error.message);
      return NextResponse.json(
        { error: 'Failed to add to schedule' },
        { status: 500 }
      );
    }

    return NextResponse.json({ entry: result.data });
  } catch (error) {
    console.error('Unexpected error in schedule add:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
