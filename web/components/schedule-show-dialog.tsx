'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Film, Clock, Tv, Clapperboard, Trash2, CalendarDays, CalendarIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getPosterUrl, getProviderLogoUrl, getStillUrl } from '@/lib/tmdb/images';
import type { MediaType } from '@/lib/database.types';

// Constants
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const START_HOUR = 18; // 6:00 PM

// Type for current episode info
interface CurrentEpisode {
  season: number;
  episode: number;
  title: string;
  stillPath: string | null;
  runtime: number | null;
  airDate: string | null;
  overview: string | null;
}

// Type for enriched schedule entry
interface EnrichedScheduleEntry {
  id: string;
  weekday: number;
  slotOrder: number;
  enabled: boolean;
  trackedTitleId: string;
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  year: string;
  providers: { name: string; logoPath: string }[];
  runtime: number;
  currentEpisode: CurrentEpisode | null;
}

interface ScheduleShowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: EnrichedScheduleEntry;
  startTime: number; // Minutes from START_HOUR
  onRemoved: () => void;
  onRescheduled: () => void;
}

// Helper to format time from minutes offset
function formatTime(minutesFromStart: number): string {
  const totalMinutes = START_HOUR * 60 + minutesFromStart;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  return minutes === 0 ? `${displayHour}:00 ${ampm}` : `${displayHour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

// Helper to format runtime for display
function formatRuntime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

// Helper to format date
function formatAirDate(dateString: string | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function ScheduleShowDialog({
  open,
  onOpenChange,
  entry,
  startTime,
  onRemoved,
  onRescheduled,
}: ScheduleShowDialogProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>(entry.weekday.toString());

  const posterUrl = getPosterUrl(entry.posterPath, 'large');
  const startTimeStr = formatTime(startTime);
  const endTimeStr = formatTime(startTime + entry.runtime);

  // For TV shows, get episode still (fallback to show poster)
  const episodeStillUrl = entry.currentEpisode?.stillPath
    ? getStillUrl(entry.currentEpisode.stillPath, 'large')
    : posterUrl;

  // Handle remove action
  const handleRemove = async () => {
    setIsRemoving(true);

    try {
      const response = await fetch(`/api/schedule/${entry.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove from schedule');
      }

      onRemoved();
    } catch (err) {
      console.error('Error removing from schedule:', err);
    } finally {
      setIsRemoving(false);
    }
  };

  // Handle reschedule action
  const handleReschedule = async () => {
    const newWeekday = parseInt(selectedDay, 10);
    if (newWeekday === entry.weekday) {
      // No change
      return;
    }

    setIsRescheduling(true);

    try {
      const response = await fetch(`/api/schedule/${entry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekday: newWeekday }),
      });

      if (!response.ok) {
        throw new Error('Failed to reschedule');
      }

      onRescheduled();
    } catch (err) {
      console.error('Error rescheduling:', err);
    } finally {
      setIsRescheduling(false);
    }
  };

  const isActionInProgress = isRemoving || isRescheduling;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">{entry.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Details and actions for {entry.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* TV Show Layout - Episode focused */}
          {entry.mediaType === 'tv' && entry.currentEpisode ? (
            <>
              {/* Episode Still Image - links to episode detail */}
              <Link
                href={`/app/show/${entry.tmdbId}/season/${entry.currentEpisode.season}/episode/${entry.currentEpisode.episode}`}
                className="block w-full aspect-video relative bg-muted rounded-lg overflow-hidden group"
              >
                {episodeStillUrl ? (
                  <Image
                    src={episodeStillUrl}
                    alt={entry.currentEpisode.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Tv className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </Link>

              {/* Show Title */}
              <div>
                <h2 className="text-lg font-semibold leading-tight">{entry.title}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <span>Season {entry.currentEpisode.season}, Episode {entry.currentEpisode.episode}</span>
                </div>
              </div>

              {/* Episode Title */}
              <div className="text-base font-medium">
                {entry.currentEpisode.title}
              </div>

              {/* Episode Metadata */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {entry.currentEpisode.airDate && (
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {formatAirDate(entry.currentEpisode.airDate)}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {formatRuntime(entry.runtime)}
                </span>
              </div>

              {/* Episode Overview */}
              {entry.currentEpisode.overview && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {entry.currentEpisode.overview}
                </p>
              )}

              {/* Scheduled Time */}
              <div className="flex items-center gap-1.5 text-sm pt-2 border-t">
                <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-medium">{DAY_NAMES[entry.weekday]}</span>
                <span className="text-muted-foreground">
                  {startTimeStr} - {endTimeStr}
                </span>
              </div>
            </>
          ) : (
            /* Movie Layout - Poster focused */
            <div className="flex gap-4">
              {/* Poster */}
              <div className="w-24 h-36 relative flex-shrink-0 bg-muted rounded-lg overflow-hidden">
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
                    <Film className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-2">
                <h2 className="text-lg font-semibold leading-tight">{entry.title}</h2>

                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  {entry.year && <span>{entry.year}</span>}
                  <span className="flex items-center gap-1">
                    <Clapperboard className="h-3.5 w-3.5" />
                    <span>Movie</span>
                  </span>
                </div>

                {/* Runtime */}
                <div className="flex items-center gap-1.5 text-sm">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{formatRuntime(entry.runtime)}</span>
                </div>

                {/* Scheduled Time */}
                <div className="flex items-center gap-1.5 text-sm">
                  <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{DAY_NAMES[entry.weekday]}</span>
                  <span className="text-muted-foreground">
                    {startTimeStr} - {endTimeStr}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Streaming Providers */}
          {entry.providers.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Available on</p>
              <div className="flex flex-wrap gap-2">
                {entry.providers.map((provider) => {
                  const logoUrl = getProviderLogoUrl(provider.logoPath);
                  return (
                    <div
                      key={provider.name}
                      className="flex items-center gap-1.5 bg-muted rounded-full px-2 py-1"
                      title={provider.name}
                    >
                      {logoUrl && (
                        <div className="w-5 h-5 relative rounded overflow-hidden">
                          <Image
                            src={logoUrl}
                            alt={provider.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <span className="text-xs">{provider.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions Section */}
          <div className="space-y-3 pt-2 border-t">
            {/* Reschedule */}
            <div className="flex items-center gap-2">
              <Select
                value={selectedDay}
                onValueChange={setSelectedDay}
                disabled={isActionInProgress}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {DAY_NAMES.map((day, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {day}
                      {index === entry.weekday && ' (current)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleReschedule}
                disabled={isActionInProgress || parseInt(selectedDay, 10) === entry.weekday}
              >
                {isRescheduling ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Moving...
                  </>
                ) : (
                  'Move'
                )}
              </Button>
            </div>

            {/* Remove */}
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleRemove}
              disabled={isActionInProgress}
            >
              {isRemoving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove from Schedule
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
