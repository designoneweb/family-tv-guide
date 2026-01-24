import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { moveToDay, reorderSlot } from '@/lib/services/schedule';

export async function PUT(request: Request) {
  try {
    const { entryId, newWeekday, newSlotOrder } = await request.json();

    if (!entryId) {
      return NextResponse.json(
        { error: 'Entry ID is required' },
        { status: 400 }
      );
    }

    if (typeof newWeekday !== 'number' || newWeekday < 0 || newWeekday > 6) {
      return NextResponse.json(
        { error: 'Valid weekday (0-6) is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // First move to the new day
    const moveResult = await moveToDay(supabase, entryId, newWeekday);

    if (moveResult.error) {
      return NextResponse.json(
        { error: moveResult.error.message },
        { status: 400 }
      );
    }

    // Then reorder to the specific position if provided
    if (typeof newSlotOrder === 'number' && newSlotOrder >= 0) {
      const reorderResult = await reorderSlot(supabase, entryId, newSlotOrder);

      if (reorderResult.error) {
        return NextResponse.json(
          { error: reorderResult.error.message },
          { status: 400 }
        );
      }

      return NextResponse.json({ success: true, entry: reorderResult.data });
    }

    return NextResponse.json({ success: true, entry: moveResult.data });
  } catch (error) {
    console.error('Error in move endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to move schedule entry' },
      { status: 500 }
    );
  }
}
