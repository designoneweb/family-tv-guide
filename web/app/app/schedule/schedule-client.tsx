'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Loader2, Film, X, Calendar, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useProfile } from '@/lib/contexts/profile-context';
import { getPosterUrl } from '@/lib/tmdb/images';
import { AddToScheduleDialog } from '@/components/add-to-schedule-dialog';
import type { ScheduleEntry, MediaType } from '@/lib/database.types';

// Day names for display
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_SHORT_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Type for enriched schedule entry with title info
interface EnrichedScheduleEntry extends ScheduleEntry {
  title: string;
  posterPath: string | null;
  mediaType: MediaType;
  tmdbId: number;
}

// Week schedule with enriched entries
type EnrichedWeekSchedule = {
  [weekday: number]: EnrichedScheduleEntry[];
};

export function ScheduleClient() {
  const { activeProfileId, activeProfile } = useProfile();
  const [schedule, setSchedule] = useState<EnrichedWeekSchedule>({
    0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<EnrichedScheduleEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add to schedule dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addDialogWeekday, setAddDialogWeekday] = useState<number>(0);

  // Track reordering state (to prevent double clicks)
  const [isReordering, setIsReordering] = useState(false);

  // Fetch schedule and enrich with TMDB data
  const fetchSchedule = useCallback(async () => {
    if (!activeProfileId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch schedule
      const response = await fetch(`/api/schedule?profileId=${activeProfileId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch schedule');
      }
      const data = await response.json();
      const rawSchedule = data.schedule as { [weekday: number]: ScheduleEntry[] };

      // Fetch library to get title info (has TMDB details)
      const libraryResponse = await fetch('/api/library');
      if (!libraryResponse.ok) {
        throw new Error('Failed to fetch library');
      }
      const libraryData = await libraryResponse.json();

      // Create a map of tracked_title_id -> library info
      const libraryMap = new Map<string, {
        title: string;
        posterPath: string | null;
        mediaType: MediaType;
        tmdbId: number;
      }>();

      for (const title of libraryData.titles) {
        libraryMap.set(title.id, {
          title: title.title,
          posterPath: title.posterPath,
          mediaType: title.mediaType,
          tmdbId: title.tmdbId,
        });
      }

      // Enrich schedule entries with title info
      const enrichedSchedule: EnrichedWeekSchedule = {
        0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
      };

      for (const weekday of Object.keys(rawSchedule)) {
        const day = parseInt(weekday);
        for (const entry of rawSchedule[day]) {
          const libraryInfo = libraryMap.get(entry.tracked_title_id);
          if (libraryInfo) {
            enrichedSchedule[day].push({
              ...entry,
              title: libraryInfo.title,
              posterPath: libraryInfo.posterPath,
              mediaType: libraryInfo.mediaType,
              tmdbId: libraryInfo.tmdbId,
            });
          } else {
            // If not in library map, try to fetch directly (fallback)
            // This handles edge cases where title might not be in library anymore
            enrichedSchedule[day].push({
              ...entry,
              title: 'Unknown Title',
              posterPath: null,
              mediaType: 'tv',
              tmdbId: 0,
            });
          }
        }
      }

      setSchedule(enrichedSchedule);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load schedule');
    } finally {
      setIsLoading(false);
    }
  }, [activeProfileId]);

  // Fetch schedule on mount
  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  // Handle remove action - open confirmation dialog
  const handleRemoveClick = useCallback((entry: EnrichedScheduleEntry) => {
    setDeleteTarget(entry);
  }, []);

  // Confirm deletion
  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/schedule/${deleteTarget.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove from schedule');
      }

      // Remove from local state
      setSchedule((prev) => {
        const updated = { ...prev };
        updated[deleteTarget.weekday] = updated[deleteTarget.weekday].filter(
          (e) => e.id !== deleteTarget.id
        );
        return updated;
      });
    } catch (err) {
      console.error('Error removing from schedule:', err);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget]);

  // Cancel deletion
  const handleCancelDelete = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  // Handle add button click
  const handleAddClick = useCallback((weekday: number) => {
    setAddDialogWeekday(weekday);
    setAddDialogOpen(true);
  }, []);

  // Handle add dialog success
  const handleAddSuccess = useCallback(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  // Get existing title IDs for a specific day
  const getExistingTitleIds = useCallback((weekday: number) => {
    return schedule[weekday].map((entry) => entry.tracked_title_id);
  }, [schedule]);

  // Handle move up within day
  const handleMoveUp = useCallback(async (entry: EnrichedScheduleEntry, index: number) => {
    if (index === 0 || isReordering) return;

    setIsReordering(true);
    const dayEntries = schedule[entry.weekday];
    const prevEntry = dayEntries[index - 1];

    // Optimistic update - swap entries in UI
    setSchedule((prev) => {
      const updated = { ...prev };
      const dayEntriesCopy = [...updated[entry.weekday]];
      [dayEntriesCopy[index - 1], dayEntriesCopy[index]] = [dayEntriesCopy[index], dayEntriesCopy[index - 1]];
      updated[entry.weekday] = dayEntriesCopy;
      return updated;
    });

    try {
      // Update the entry being moved to the previous position's slot_order
      const response = await fetch(`/api/schedule/${entry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotOrder: prevEntry.slot_order }),
      });

      if (!response.ok) {
        throw new Error('Failed to reorder');
      }
    } catch (err) {
      console.error('Error reordering:', err);
      // Rollback on error - refetch schedule
      fetchSchedule();
    } finally {
      setIsReordering(false);
    }
  }, [schedule, isReordering, fetchSchedule]);

  // Handle move down within day
  const handleMoveDown = useCallback(async (entry: EnrichedScheduleEntry, index: number) => {
    const dayEntries = schedule[entry.weekday];
    if (index === dayEntries.length - 1 || isReordering) return;

    setIsReordering(true);
    const nextEntry = dayEntries[index + 1];

    // Optimistic update - swap entries in UI
    setSchedule((prev) => {
      const updated = { ...prev };
      const dayEntriesCopy = [...updated[entry.weekday]];
      [dayEntriesCopy[index], dayEntriesCopy[index + 1]] = [dayEntriesCopy[index + 1], dayEntriesCopy[index]];
      updated[entry.weekday] = dayEntriesCopy;
      return updated;
    });

    try {
      // Update the entry being moved to the next position's slot_order
      const response = await fetch(`/api/schedule/${entry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotOrder: nextEntry.slot_order }),
      });

      if (!response.ok) {
        throw new Error('Failed to reorder');
      }
    } catch (err) {
      console.error('Error reordering:', err);
      // Rollback on error - refetch schedule
      fetchSchedule();
    } finally {
      setIsReordering(false);
    }
  }, [schedule, isReordering, fetchSchedule]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Weekly Schedule</h1>
        <p className="text-muted-foreground mt-1">
          {activeProfile?.name ? `${activeProfile.name}'s` : 'Your'} viewing schedule
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12 text-destructive">
          <p>{error}</p>
        </div>
      )}

      {/* Week Grid */}
      {!isLoading && !error && (
        <>
          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-7 gap-4">
            {DAY_NAMES.map((dayName, index) => (
              <DayColumn
                key={index}
                dayName={dayName}
                dayIndex={index}
                entries={schedule[index]}
                onRemove={handleRemoveClick}
                onAdd={() => handleAddClick(index)}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                isReordering={isReordering}
              />
            ))}
          </div>

          {/* Mobile Horizontal Scroll */}
          <div className="md:hidden overflow-x-auto pb-4">
            <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
              {DAY_SHORT_NAMES.map((dayName, index) => (
                <div key={index} className="min-w-[200px]">
                  <DayColumn
                    dayName={dayName}
                    dayIndex={index}
                    entries={schedule[index]}
                    onRemove={handleRemoveClick}
                    onAdd={() => handleAddClick(index)}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    isReordering={isReordering}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && handleCancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Schedule?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove &quot;{deleteTarget?.title}&quot; from{' '}
              {deleteTarget ? DAY_NAMES[deleteTarget.weekday] : ''}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                'Remove'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add to Schedule Dialog */}
      {activeProfileId && (
        <AddToScheduleDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          weekday={addDialogWeekday}
          profileId={activeProfileId}
          existingTitleIds={getExistingTitleIds(addDialogWeekday)}
          onAdded={handleAddSuccess}
        />
      )}
    </div>
  );
}

// Day Column Component
interface DayColumnProps {
  dayName: string;
  dayIndex: number;
  entries: EnrichedScheduleEntry[];
  onRemove: (entry: EnrichedScheduleEntry) => void;
  onAdd: () => void;
  onMoveUp: (entry: EnrichedScheduleEntry, index: number) => void;
  onMoveDown: (entry: EnrichedScheduleEntry, index: number) => void;
  isReordering: boolean;
}

function DayColumn({ dayName, dayIndex, entries, onRemove, onAdd, onMoveUp, onMoveDown, isReordering }: DayColumnProps) {
  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      {/* Day Header */}
      <div className="bg-muted px-4 py-3 font-semibold text-center border-b">
        {dayName}
      </div>

      {/* Entries List */}
      <div className="p-2 space-y-2 min-h-[200px]">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground text-sm">
            <Calendar className="h-8 w-8 mb-2 opacity-50" />
            <p>No shows scheduled</p>
          </div>
        ) : (
          entries.map((entry, index) => (
            <ScheduleEntryCard
              key={entry.id}
              entry={entry}
              index={index}
              totalEntries={entries.length}
              onRemove={() => onRemove(entry)}
              onMoveUp={() => onMoveUp(entry, index)}
              onMoveDown={() => onMoveDown(entry, index)}
              isReordering={isReordering}
            />
          ))
        )}

        {/* Add Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2"
          onClick={onAdd}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
}

// Schedule Entry Card Component
interface ScheduleEntryCardProps {
  entry: EnrichedScheduleEntry;
  index: number;
  totalEntries: number;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isReordering: boolean;
}

function ScheduleEntryCard({ entry, index, totalEntries, onRemove, onMoveUp, onMoveDown, isReordering }: ScheduleEntryCardProps) {
  const posterUrl = getPosterUrl(entry.posterPath, 'small');
  const isFirst = index === 0;
  const isLast = index === totalEntries - 1;

  return (
    <div className="flex items-center gap-2 p-2 bg-background rounded border hover:border-primary/50 transition-colors group">
      {/* Reorder Buttons */}
      <div className="flex flex-col gap-0.5 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={onMoveUp}
          disabled={isFirst || isReordering}
          title="Move up"
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={onMoveDown}
          disabled={isLast || isReordering}
          title="Move down"
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>

      {/* Poster Thumbnail */}
      <div className="w-10 h-14 relative flex-shrink-0 bg-muted rounded overflow-hidden">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={entry.title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Film className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium line-clamp-2" title={entry.title}>
          {entry.title}
        </p>
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
