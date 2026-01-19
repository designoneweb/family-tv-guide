/**
 * Library Title Delete API Route
 * DELETE /api/library/[id]
 *
 * Removes a title from the household library
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { removeTitle } from '@/lib/services/library';

/**
 * DELETE /api/library/[id]
 *
 * Path parameters:
 * - id: Tracked title ID to delete
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
    return NextResponse.json({ error: 'Title ID is required' }, { status: 400 });
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

    // Remove title (RLS policies will ensure user can only delete their own)
    const result = await removeTitle(supabase, id);

    if (result.error) {
      console.error('Remove title error:', result.error.message);
      return NextResponse.json(
        { error: 'Failed to remove title from library' },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Unexpected error in library delete:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
