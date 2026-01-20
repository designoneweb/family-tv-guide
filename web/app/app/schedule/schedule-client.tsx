'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Loader2, Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/lib/contexts/profile-context';
import { AddToScheduleDialog } from '@/components/add-to-schedule-dialog';
import { ScheduleShowDialog } from '@/components/schedule-show-dialog';
import type { MediaType } from '@/lib/database.types';

// Constants
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_SHORT_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const PIXELS_PER_MINUTE = 2.5; // 2.5px per minute = 150px per hour (wider blocks for readability)
const START_HOUR = 18; // 6:00 PM
const DAY_LABEL_WIDTH = 150; // Width of day label column in pixels

// Type for current episode info from API
interface CurrentEpisode {
  season: number;
  episode: number;
  title: string;
  stillPath: string | null;
  runtime: number | null;
  airDate: string | null;
  overview: string | null;
}

// Type for enriched schedule entry from API (camelCase)
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

// Week schedule with enriched entries
type EnrichedWeekSchedule = {
  [weekday: number]: EnrichedScheduleEntry[];
};

// Helper to format time from minutes offset
function formatTime(minutesFromStart: number): string {
  const totalMinutes = START_HOUR * 60 + minutesFromStart;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  return minutes === 0 ? `${displayHour} ${ampm}` : `${displayHour}:${minutes.toString().padStart(2, '0')}`;
}

// Helper to format runtime for display
function formatRuntime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function ScheduleClient() {
  const { activeProfileId, activeProfile } = useProfile();
  const [schedule, setSchedule] = useState<EnrichedWeekSchedule>({
    0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add to schedule dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addDialogWeekday, setAddDialogWeekday] = useState<number>(0);

  // Show details dialog state
  const [selectedShow, setSelectedShow] = useState<EnrichedScheduleEntry | null>(null);
  const [selectedShowStartTime, setSelectedShowStartTime] = useState<number>(0);

  // Fetch schedule (API returns enriched data with TMDB details)
  const fetchSchedule = useCallback(async () => {
    if (!activeProfileId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/schedule?profileId=${activeProfileId}`, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Failed to fetch schedule');
      }
      const data = await response.json();
      const enrichedSchedule = data.schedule as EnrichedWeekSchedule;
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

  // Calculate the maximum grid width based on total runtime per day
  const maxGridWidth = useMemo(() => {
    let maxMinutes = 0;
    for (let weekday = 0; weekday < 7; weekday++) {
      const dayEntries = schedule[weekday] || [];
      const totalMinutes = dayEntries.reduce((sum, entry) => sum + entry.runtime, 0);
      maxMinutes = Math.max(maxMinutes, totalMinutes);
    }
    // At minimum, show 4 hours (240 minutes)
    return Math.max(maxMinutes, 240) * PIXELS_PER_MINUTE;
  }, [schedule]);

  // Generate time markers
  const timeMarkers = useMemo(() => {
    const markers: { offset: number; label: string }[] = [];
    const totalMinutes = Math.ceil(maxGridWidth / PIXELS_PER_MINUTE);
    // Generate markers every 30 minutes
    for (let minutes = 0; minutes <= totalMinutes; minutes += 30) {
      markers.push({
        offset: minutes * PIXELS_PER_MINUTE,
        label: formatTime(minutes),
      });
    }
    return markers;
  }, [maxGridWidth]);

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
    return schedule[weekday].map((entry) => entry.trackedTitleId);
  }, [schedule]);

  // Handle show click - open details dialog
  const handleShowClick = useCallback((entry: EnrichedScheduleEntry, startTime: number) => {
    setSelectedShow(entry);
    setSelectedShowStartTime(startTime);
  }, []);

  // Handle show dialog close
  const handleShowDialogClose = useCallback(() => {
    setSelectedShow(null);
  }, []);

  // Handle show removed from dialog
  const handleShowRemoved = useCallback(() => {
    fetchSchedule();
    setSelectedShow(null);
  }, [fetchSchedule]);

  // Handle show rescheduled from dialog
  const handleShowRescheduled = useCallback(() => {
    fetchSchedule();
    setSelectedShow(null);
  }, [fetchSchedule]);

  return (
    <div className="space-y-6">
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

      {/* TV Guide Grid */}
      {!isLoading && !error && (
        <div className="bg-card rounded-lg border overflow-hidden">
          {/* Scrollable container */}
          <div className="overflow-x-auto">
            <div style={{ minWidth: DAY_LABEL_WIDTH + maxGridWidth + 40 }}>
              {/* Time Header Row */}
              <div className="flex border-b bg-muted/50">
                {/* Empty cell for day labels column */}
                <div
                  className="flex-shrink-0 border-r bg-muted"
                  style={{ width: DAY_LABEL_WIDTH }}
                />
                {/* Time markers */}
                <div className="relative h-10 flex-1" style={{ width: maxGridWidth }}>
                  {timeMarkers.map((marker, index) => (
                    <div
                      key={index}
                      className="absolute top-0 h-full flex items-center text-sm text-muted-foreground"
                      style={{ left: marker.offset }}
                    >
                      <span className="px-1 bg-muted/50">{marker.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Day Rows */}
              {DAY_NAMES.map((dayName, weekday) => (
                <DayRow
                  key={weekday}
                  dayName={dayName}
                  shortName={DAY_SHORT_NAMES[weekday]}
                  entries={schedule[weekday]}
                  gridWidth={maxGridWidth}
                  onAddClick={() => handleAddClick(weekday)}
                  onShowClick={handleShowClick}
                />
              ))}
            </div>
          </div>
        </div>
      )}

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

      {/* Show Details Dialog */}
      {selectedShow && (
        <ScheduleShowDialog
          open={!!selectedShow}
          onOpenChange={(open) => !open && handleShowDialogClose()}
          entry={selectedShow}
          startTime={selectedShowStartTime}
          onRemoved={handleShowRemoved}
          onRescheduled={handleShowRescheduled}
        />
      )}
    </div>
  );
}

// Day Row Component
interface DayRowProps {
  dayName: string;
  shortName: string;
  entries: EnrichedScheduleEntry[];
  gridWidth: number;
  onAddClick: () => void;
  onShowClick: (entry: EnrichedScheduleEntry, startTime: number) => void;
}

function DayRow({ dayName, shortName, entries, gridWidth, onAddClick, onShowClick }: DayRowProps) {
  // Sort entries by slotOrder and calculate positions
  const showPositions = useMemo(() => {
    const sorted = [...entries].sort((a, b) => a.slotOrder - b.slotOrder);

    // Use reduce to calculate positions without mutation
    const result: { entry: EnrichedScheduleEntry; left: number; width: number; startMinutes: number }[] = [];
    let currentOffset = 0;

    for (const entry of sorted) {
      result.push({
        entry,
        left: currentOffset * PIXELS_PER_MINUTE,
        width: entry.runtime * PIXELS_PER_MINUTE,
        startMinutes: currentOffset,
      });
      currentOffset = currentOffset + entry.runtime;
    }

    return result;
  }, [entries]);

  return (
    <div className="flex border-b last:border-b-0 hover:bg-muted/20 transition-colors">
      {/* Day Label + Add Button */}
      <div
        className="flex-shrink-0 border-r bg-muted/30 flex items-center justify-between px-2 py-2"
        style={{ width: DAY_LABEL_WIDTH }}
      >
        <div className="flex flex-col">
          <span className="font-semibold text-base hidden sm:block">{dayName}</span>
          <span className="font-semibold text-base sm:hidden">{shortName}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onAddClick}
          title={`Add to ${dayName}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Shows Grid Area */}
      <div
        className="relative flex-1 min-h-[70px]"
        style={{ width: gridWidth }}
      >
        {entries.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-base">
            <Calendar className="h-4 w-4 mr-2 opacity-50" />
            <span>No shows scheduled</span>
          </div>
        ) : (
          showPositions.map((pos) => (
            <ShowBlock
              key={pos.entry.id}
              entry={pos.entry}
              left={pos.left}
              width={pos.width}
              startMinutes={pos.startMinutes}
              onClick={() => onShowClick(pos.entry, pos.startMinutes)}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Show Block Component
interface ShowBlockProps {
  entry: EnrichedScheduleEntry;
  left: number;
  width: number;
  startMinutes: number;
  onClick: () => void;
}

function ShowBlock({ entry, left, width, startMinutes, onClick }: ShowBlockProps) {
  const startTimeStr = formatTime(startMinutes);
  const endTimeStr = formatTime(startMinutes + entry.runtime);

  // Episode info display
  const episodeInfo = entry.currentEpisode
    ? `S${entry.currentEpisode.season}E${entry.currentEpisode.episode}`
    : entry.mediaType === 'movie' ? 'Movie' : '';

  // Determine if the block is wide enough for full content
  // Adjusted thresholds since we no longer have poster
  const isCompact = width < 80;
  const isVeryCompact = width < 50;

  return (
    <button
      onClick={onClick}
      className="absolute top-1 bottom-1 rounded overflow-hidden border border-border/50 bg-background hover:border-primary/70 hover:bg-muted/50 transition-all cursor-pointer group"
      style={{ left, width: Math.max(width - 2, 20) }} // -2 for spacing between blocks
      title={`${entry.title} ${episodeInfo ? `(${episodeInfo})` : ''} - ${startTimeStr} to ${endTimeStr}`}
    >
      {/* Content */}
      <div className={`h-full flex flex-col justify-center px-2 py-0.5 ${isVeryCompact ? 'items-center px-1' : ''}`}>
        {isVeryCompact ? (
          // Very compact - just show first letter
          <span className="text-sm font-medium">{entry.title.charAt(0)}</span>
        ) : isCompact ? (
          // Compact - title only, truncated
          <span className="text-sm font-medium truncate">{entry.title}</span>
        ) : (
          // Full display - title + episode info + time
          <>
            <span className="text-sm font-medium truncate">{entry.title}</span>
            {episodeInfo && (
              <span className="text-xs text-muted-foreground">{episodeInfo}</span>
            )}
            {width > 100 && (
              <span className="text-xs text-muted-foreground truncate">
                {startTimeStr} - {endTimeStr}
              </span>
            )}
          </>
        )}
      </div>
    </button>
  );
}
