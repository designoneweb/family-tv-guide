'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Loader2, Film, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getPosterUrl } from '@/lib/tmdb/images';
import type { MediaType } from '@/lib/database.types';

// Day names for display
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Library title type (from API)
interface LibraryTitle {
  id: string;
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  year: string;
}

interface AddToScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weekday: number;
  profileId: string;
  existingTitleIds: string[];
  onAdded: () => void;
}

export function AddToScheduleDialog({
  open,
  onOpenChange,
  weekday,
  profileId,
  existingTitleIds,
  onAdded,
}: AddToScheduleDialogProps) {
  const [libraryTitles, setLibraryTitles] = useState<LibraryTitle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);

  // Fetch library titles when dialog opens
  useEffect(() => {
    if (!open) return;

    const fetchLibrary = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/library');
        if (!response.ok) {
          throw new Error('Failed to fetch library');
        }
        const data = await response.json();
        setLibraryTitles(data.titles || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load library');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLibrary();
  }, [open]);

  // Filter out titles already scheduled for this day
  const availableTitles = libraryTitles.filter(
    (title) => !existingTitleIds.includes(title.id)
  );

  // Handle adding a title to the schedule
  const handleAddTitle = async (title: LibraryTitle) => {
    setAddingId(title.id);

    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId,
          trackedTitleId: title.id,
          weekday,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to schedule');
      }

      // Close dialog and notify parent to refresh
      onOpenChange(false);
      onAdded();
    } catch (err) {
      console.error('Error adding to schedule:', err);
      // Could show error toast here
    } finally {
      setAddingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add to {DAY_NAMES[weekday]}</DialogTitle>
          <DialogDescription>
            Select a title from your library to add to this day&apos;s schedule.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0 mt-4">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8 text-destructive">
              <p>{error}</p>
            </div>
          )}

          {/* Empty Library */}
          {!isLoading && !error && libraryTitles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Film className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>Your library is empty.</p>
              <p className="text-sm mt-1">Add some titles first!</p>
            </div>
          )}

          {/* All Titles Already Scheduled */}
          {!isLoading && !error && libraryTitles.length > 0 && availableTitles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Check className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>All titles are already scheduled for {DAY_NAMES[weekday]}.</p>
            </div>
          )}

          {/* Available Titles List */}
          {!isLoading && !error && availableTitles.length > 0 && (
            <div className="space-y-2">
              {availableTitles.map((title) => (
                <TitleOption
                  key={title.id}
                  title={title}
                  onAdd={() => handleAddTitle(title)}
                  isAdding={addingId === title.id}
                  disabled={addingId !== null}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Title Option Component
interface TitleOptionProps {
  title: LibraryTitle;
  onAdd: () => void;
  isAdding: boolean;
  disabled: boolean;
}

function TitleOption({ title, onAdd, isAdding, disabled }: TitleOptionProps) {
  const posterUrl = getPosterUrl(title.posterPath, 'small');

  return (
    <button
      onClick={onAdd}
      disabled={disabled}
      className="w-full flex items-center gap-3 p-3 bg-background rounded-lg border hover:border-primary/50 hover:bg-muted/50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {/* Poster Thumbnail */}
      <div className="w-12 h-16 relative flex-shrink-0 bg-muted rounded overflow-hidden">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title.title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Film className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Title Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium line-clamp-1">{title.title}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          {title.year && <span>{title.year}</span>}
          <span className="px-1.5 py-0.5 bg-muted rounded uppercase">
            {title.mediaType === 'tv' ? 'TV' : 'Movie'}
          </span>
        </div>
      </div>

      {/* Adding Indicator */}
      {isAdding && (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground flex-shrink-0" />
      )}
    </button>
  );
}
