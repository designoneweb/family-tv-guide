import { SupabaseClient } from '@supabase/supabase-js';
import type { ScheduleEntry } from '@/lib/database.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = SupabaseClient<any, any, any>;

// ============================================================================
// Types
// ============================================================================

export interface AddToScheduleData {
  profileId: string;
  trackedTitleId: string;
  weekday: number;
  householdId: string;
}

export interface ScheduleServiceError {
  message: string;
  code?: string;
}

export type ScheduleResult<T> =
  | { data: T; error: null }
  | { data: null; error: ScheduleServiceError };

export type WeekSchedule = {
  [weekday: number]: ScheduleEntry[];
};

// ============================================================================
// Validation
// ============================================================================

function validateWeekday(weekday: number): ScheduleServiceError | null {
  if (typeof weekday !== 'number' || weekday < 0 || weekday > 6) {
    return {
      message: 'Weekday must be a number between 0 (Sunday) and 6 (Saturday)',
      code: 'VALIDATION_ERROR',
    };
  }
  return null;
}

function validateAddData(data: AddToScheduleData): ScheduleServiceError | null {
  if (!data.profileId) {
    return { message: 'Profile ID is required', code: 'VALIDATION_ERROR' };
  }

  if (!data.trackedTitleId) {
    return { message: 'Tracked title ID is required', code: 'VALIDATION_ERROR' };
  }

  if (!data.householdId) {
    return { message: 'Household ID is required', code: 'VALIDATION_ERROR' };
  }

  const weekdayError = validateWeekday(data.weekday);
  if (weekdayError) {
    return weekdayError;
  }

  return null;
}

// ============================================================================
// Service Functions
// ============================================================================

/**
 * Adds a title to a profile's schedule for a specific weekday
 * Auto-calculates slot_order as max(slot_order) + 1 for that profile+weekday
 * @param supabase - Authenticated Supabase client
 * @param data - Schedule entry data (profileId, trackedTitleId, weekday, householdId)
 * @returns The created schedule entry or error
 */
export async function addToSchedule(
  supabase: AnySupabaseClient,
  data: AddToScheduleData
): Promise<ScheduleResult<ScheduleEntry>> {
  // Validate input
  const validationError = validateAddData(data);
  if (validationError) {
    return { data: null, error: validationError };
  }

  // Get current max slot_order for this profile+weekday
  const { data: existingSlots, error: fetchError } = await supabase
    .from('schedule_entries')
    .select('slot_order')
    .eq('profile_id', data.profileId)
    .eq('weekday', data.weekday)
    .order('slot_order', { ascending: false })
    .limit(1);

  if (fetchError) {
    console.error('Error fetching existing slots:', fetchError.message);
    return {
      data: null,
      error: { message: 'Failed to calculate slot order', code: fetchError.code },
    };
  }

  const nextSlotOrder = existingSlots && existingSlots.length > 0
    ? existingSlots[0].slot_order + 1
    : 0;

  // Insert the new schedule entry
  const { data: entry, error: insertError } = await supabase
    .from('schedule_entries')
    .insert({
      profile_id: data.profileId,
      tracked_title_id: data.trackedTitleId,
      weekday: data.weekday,
      household_id: data.householdId,
      slot_order: nextSlotOrder,
      enabled: true,
    })
    .select()
    .single();

  if (insertError) {
    console.error('Error adding to schedule:', insertError.message);
    return {
      data: null,
      error: { message: 'Failed to add to schedule', code: insertError.code },
    };
  }

  return { data: entry, error: null };
}

/**
 * Removes an entry from the schedule by ID
 * Other slots' order remains (gaps are fine)
 * @param supabase - Authenticated Supabase client
 * @param entryId - Schedule entry ID to remove
 * @returns Success status or error
 */
export async function removeFromSchedule(
  supabase: AnySupabaseClient,
  entryId: string
): Promise<ScheduleResult<{ deleted: true }>> {
  if (!entryId) {
    return { data: null, error: { message: 'Entry ID is required', code: 'VALIDATION_ERROR' } };
  }

  const { error } = await supabase.from('schedule_entries').delete().eq('id', entryId);

  if (error) {
    console.error('Error removing from schedule:', error.message);
    return {
      data: null,
      error: { message: 'Failed to remove from schedule', code: error.code },
    };
  }

  return { data: { deleted: true }, error: null };
}

/**
 * Gets schedule entries for a specific day
 * @param supabase - Authenticated Supabase client
 * @param profileId - Profile ID to fetch schedule for
 * @param weekday - Day of week (0-6, Sunday-Saturday)
 * @returns Array of schedule entries ordered by slot_order or error
 */
export async function getScheduleForDay(
  supabase: AnySupabaseClient,
  profileId: string,
  weekday: number
): Promise<ScheduleResult<ScheduleEntry[]>> {
  if (!profileId) {
    return { data: null, error: { message: 'Profile ID is required', code: 'VALIDATION_ERROR' } };
  }

  const weekdayError = validateWeekday(weekday);
  if (weekdayError) {
    return { data: null, error: weekdayError };
  }

  const { data: entries, error } = await supabase
    .from('schedule_entries')
    .select('*')
    .eq('profile_id', profileId)
    .eq('weekday', weekday)
    .order('slot_order', { ascending: true });

  if (error) {
    console.error('Error fetching schedule for day:', error.message);
    return {
      data: null,
      error: { message: 'Failed to fetch schedule for day', code: error.code },
    };
  }

  return { data: entries, error: null };
}

/**
 * Gets all 7 days of schedule for a profile
 * @param supabase - Authenticated Supabase client
 * @param profileId - Profile ID to fetch schedule for
 * @returns Object keyed by weekday (0-6) with arrays of schedule entries or error
 */
export async function getWeekSchedule(
  supabase: AnySupabaseClient,
  profileId: string
): Promise<ScheduleResult<WeekSchedule>> {
  if (!profileId) {
    return { data: null, error: { message: 'Profile ID is required', code: 'VALIDATION_ERROR' } };
  }

  const { data: entries, error } = await supabase
    .from('schedule_entries')
    .select('*')
    .eq('profile_id', profileId)
    .order('slot_order', { ascending: true });

  if (error) {
    console.error('Error fetching week schedule:', error.message);
    return {
      data: null,
      error: { message: 'Failed to fetch week schedule', code: error.code },
    };
  }

  // Initialize all 7 days with empty arrays
  const schedule: WeekSchedule = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  };

  // Group entries by weekday
  for (const entry of entries) {
    if (schedule[entry.weekday]) {
      schedule[entry.weekday].push(entry);
    }
  }

  return { data: schedule, error: null };
}

/**
 * Reorders a slot to a new position within the same day
 * Shifts other entries to make room (increment slots >= newSlotOrder)
 * @param supabase - Authenticated Supabase client
 * @param entryId - Schedule entry ID to reorder
 * @param newSlotOrder - New position for the entry
 * @returns The updated schedule entry or error
 */
export async function reorderSlot(
  supabase: AnySupabaseClient,
  entryId: string,
  newSlotOrder: number
): Promise<ScheduleResult<ScheduleEntry>> {
  if (!entryId) {
    return { data: null, error: { message: 'Entry ID is required', code: 'VALIDATION_ERROR' } };
  }

  if (typeof newSlotOrder !== 'number' || newSlotOrder < 0) {
    return { data: null, error: { message: 'Slot order must be a non-negative number', code: 'VALIDATION_ERROR' } };
  }

  // Get the current entry to know which profile/weekday we're working with
  const { data: currentEntry, error: fetchError } = await supabase
    .from('schedule_entries')
    .select('*')
    .eq('id', entryId)
    .single();

  if (fetchError || !currentEntry) {
    console.error('Error fetching entry for reorder:', fetchError?.message);
    return {
      data: null,
      error: { message: 'Schedule entry not found', code: fetchError?.code || 'NOT_FOUND' },
    };
  }

  // Supabase doesn't support slot_order + 1 directly, so we need to fetch and update
  // Shift other entries to make room (increment slots >= newSlotOrder, excluding current entry)
  const { data: entriesToShift, error: fetchShiftError } = await supabase
    .from('schedule_entries')
    .select('id, slot_order')
    .gte('slot_order', newSlotOrder)
    .eq('profile_id', currentEntry.profile_id)
    .eq('weekday', currentEntry.weekday)
    .neq('id', entryId)
    .order('slot_order', { ascending: false }); // Process from highest to lowest to avoid conflicts

  if (fetchShiftError) {
    console.error('Error fetching entries to shift:', fetchShiftError.message);
    return {
      data: null,
      error: { message: 'Failed to reorder slot', code: fetchShiftError.code },
    };
  }

  // Shift each entry's slot_order by 1
  if (entriesToShift && entriesToShift.length > 0) {
    for (const entry of entriesToShift) {
      const { error: updateShiftError } = await supabase
        .from('schedule_entries')
        .update({ slot_order: entry.slot_order + 1 })
        .eq('id', entry.id);

      if (updateShiftError) {
        console.error('Error shifting entry:', updateShiftError.message);
        // Continue with other shifts, don't fail entire operation
      }
    }
  }

  // Update target entry to new slot order
  const { data: updatedEntry, error: updateError } = await supabase
    .from('schedule_entries')
    .update({ slot_order: newSlotOrder })
    .eq('id', entryId)
    .select()
    .single();

  if (updateError) {
    console.error('Error updating slot order:', updateError.message);
    return {
      data: null,
      error: { message: 'Failed to update slot order', code: updateError.code },
    };
  }

  return { data: updatedEntry, error: null };
}

/**
 * Moves an entry to a different day
 * Removes from current day and adds to new day at end (max slot_order + 1)
 * @param supabase - Authenticated Supabase client
 * @param entryId - Schedule entry ID to move
 * @param newWeekday - Target day of week (0-6)
 * @returns The updated schedule entry or error
 */
export async function moveToDay(
  supabase: AnySupabaseClient,
  entryId: string,
  newWeekday: number
): Promise<ScheduleResult<ScheduleEntry>> {
  if (!entryId) {
    return { data: null, error: { message: 'Entry ID is required', code: 'VALIDATION_ERROR' } };
  }

  const weekdayError = validateWeekday(newWeekday);
  if (weekdayError) {
    return { data: null, error: weekdayError };
  }

  // Get the current entry
  const { data: currentEntry, error: fetchError } = await supabase
    .from('schedule_entries')
    .select('*')
    .eq('id', entryId)
    .single();

  if (fetchError || !currentEntry) {
    console.error('Error fetching entry for move:', fetchError?.message);
    return {
      data: null,
      error: { message: 'Schedule entry not found', code: fetchError?.code || 'NOT_FOUND' },
    };
  }

  // If already on the target day, no change needed
  if (currentEntry.weekday === newWeekday) {
    return { data: currentEntry, error: null };
  }

  // Get current max slot_order for target day
  const { data: targetDaySlots, error: targetFetchError } = await supabase
    .from('schedule_entries')
    .select('slot_order')
    .eq('profile_id', currentEntry.profile_id)
    .eq('weekday', newWeekday)
    .order('slot_order', { ascending: false })
    .limit(1);

  if (targetFetchError) {
    console.error('Error fetching target day slots:', targetFetchError.message);
    return {
      data: null,
      error: { message: 'Failed to calculate slot order for target day', code: targetFetchError.code },
    };
  }

  const newSlotOrder = targetDaySlots && targetDaySlots.length > 0
    ? targetDaySlots[0].slot_order + 1
    : 0;

  // Update entry with new weekday and slot_order
  const { data: updatedEntry, error: updateError } = await supabase
    .from('schedule_entries')
    .update({
      weekday: newWeekday,
      slot_order: newSlotOrder,
    })
    .eq('id', entryId)
    .select()
    .single();

  if (updateError) {
    console.error('Error moving to new day:', updateError.message);
    return {
      data: null,
      error: { message: 'Failed to move to new day', code: updateError.code },
    };
  }

  return { data: updatedEntry, error: null };
}
