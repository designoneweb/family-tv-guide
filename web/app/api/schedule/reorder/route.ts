import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { reorderSlot } from '@/lib/services/schedule';

export async function PUT(request: Request) {
  try {
    const { entryId, newSlotOrder } = await request.json();

    if (!entryId) {
      return NextResponse.json(
        { error: 'Entry ID is required' },
        { status: 400 }
      );
    }

    if (typeof newSlotOrder !== 'number' || newSlotOrder < 0) {
      return NextResponse.json(
        { error: 'Valid slot order is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const result = await reorderSlot(supabase, entryId, newSlotOrder);

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, entry: result.data });
  } catch (error) {
    console.error('Error in reorder endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to reorder schedule entry' },
      { status: 500 }
    );
  }
}
