/**
 * Schedule Entry API Route
 * DELETE /api/schedule/[id] - Remove entry from schedule
 * PATCH /api/schedule/[id] - Reorder or move entry to different day
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { removeFromSchedule, reorderSlot, moveToDay } from '@/lib/services/schedule';

/**
 * DELETE /api/schedule/[id]
 *
 * Path parameters:
 * - id: Schedule entry ID to delete
 *
 * Returns:
 * - 200: { deleted: true }
 * - 400: Invalid ID
 * - 401: Not authenticated
 * - 500: Server error
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 });
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

    // Remove from schedule (RLS policies will ensure user can only delete their own)
    const result = await removeFromSchedule(supabase, id);

    if (result.error) {
      console.error('Remove from schedule error:', result.error.message);
      return NextResponse.json(
        { error: 'Failed to remove from schedule' },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Unexpected error in schedule delete:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

interface PatchScheduleBody {
  slotOrder?: number;
  weekday?: number;
}

/**
 * PATCH /api/schedule/[id]
 *
 * Path parameters:
 * - id: Schedule entry ID to update
 *
 * Request body:
 * - slotOrder (optional): New slot position (reorder within day)
 * - weekday (optional): New weekday (move to different day)
 *
 * Returns:
 * - 200: { entry: ScheduleEntry }
 * - 400: Invalid request
 * - 401: Not authenticated
 * - 500: Server error
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 });
  }

  let body: PatchScheduleBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Validate that at least one field is provided
  const hasSlotOrder = typeof body.slotOrder === 'number';
  const hasWeekday = typeof body.weekday === 'number';

  if (!hasSlotOrder && !hasWeekday) {
    return NextResponse.json(
      { error: 'At least one of slotOrder or weekday must be provided' },
      { status: 400 }
    );
  }

  // Validate weekday if provided
  if (hasWeekday && (body.weekday! < 0 || body.weekday! > 6)) {
    return NextResponse.json(
      { error: 'weekday must be a number between 0 and 6' },
      { status: 400 }
    );
  }

  // Validate slotOrder if provided
  if (hasSlotOrder && body.slotOrder! < 0) {
    return NextResponse.json(
      { error: 'slotOrder must be a non-negative number' },
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

    // If weekday is provided, move to different day first
    // (moveToDay handles slot_order automatically)
    if (hasWeekday) {
      const moveResult = await moveToDay(supabase, id, body.weekday!);

      if (moveResult.error) {
        console.error('Move to day error:', moveResult.error.message);
        return NextResponse.json(
          { error: 'Failed to move to different day' },
          { status: 500 }
        );
      }

      // If only weekday was provided (no slotOrder), return the result
      if (!hasSlotOrder) {
        return NextResponse.json({ entry: moveResult.data });
      }
    }

    // If slotOrder is provided, reorder within the day
    if (hasSlotOrder) {
      const reorderResult = await reorderSlot(supabase, id, body.slotOrder!);

      if (reorderResult.error) {
        console.error('Reorder slot error:', reorderResult.error.message);
        return NextResponse.json(
          { error: 'Failed to reorder slot' },
          { status: 500 }
        );
      }

      return NextResponse.json({ entry: reorderResult.data });
    }

    // This shouldn't be reached due to validation above, but TypeScript needs it
    return NextResponse.json(
      { error: 'No operation performed' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Unexpected error in schedule patch:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
