'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Plus, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/lib/contexts/profile-context';
import { AddToScheduleDialog } from '@/components/add-to-schedule-dialog';
import { ScheduleShowDialog } from '@/components/schedule-show-dialog';
import { ScheduleGridSkeleton } from '@/components/ui/skeleton';
import type { MediaType } from '@/lib/database.types';

// Constants
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_SHORT_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const PIXELS_PER_MINUTE = 3.5; // 3.5px per minute = 210px per hour (wider blocks for readability)
const START_HOUR = 18; // 6:00 PM
const DAY_LABEL_WIDTH = 180; // Width of day label column in pixels

// Genre-based color mapping for show blocks
const GENRE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  comedy: { bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-200' },
  drama: { bg: 'bg-blue-500/20', border: 'border-blue-500/40', text: 'text-blue-200' },
  action: { bg: 'bg-orange-500/20', border: 'border-orange-500/40', text: 'text-orange-200' },
  scifi: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/40', text: 'text-cyan-200' },
  horror: { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-200' },
  romance: { bg: 'bg-pink-500/20', border: 'border-pink-500/40', text: 'text-pink-200' },
  documentary: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-200' },
  animation: { bg: 'bg-violet-500/20', border: 'border-violet-500/40', text: 'text-violet-200' },
  default: { bg: 'bg-slate-500/20', border: 'border-slate-500/40', text: 'text-slate-200' },
};

// Type for current episode info from API
interface CurrentEpisode {
  season: number;
  episode: number;
  title: string;
  stillPath: string | null;
  runtime: number | null;
  airDate: string | null;
  overview: string | null;
  completed: boolean;
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Add to schedule dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addDialogWeekday, setAddDialogWeekday] = useState<number>(0);

  // Show details dialog state
  const [selectedShow, setSelectedShow] = useState<EnrichedScheduleEntry | null>(null);
  const [selectedShowStartTime, setSelectedShowStartTime] = useState<number>(0);

  // Current time state for live indicator
  const [currentTime, setCurrentTime] = useState(new Date());
  const currentWeekday = currentTime.getDay();

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Calculate current time position (only if within viewing hours)
  const currentTimePosition = useMemo(() => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();

    // Only show indicator if current time is after START_HOUR (6 PM)
    if (hours < START_HOUR) return null;

    const minutesFromStart = (hours - START_HOUR) * 60 + minutes;
    return minutesFromStart * PIXELS_PER_MINUTE;
  }, [currentTime]);

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
      <div className="animate-fade-in-up">
        <h1 className="text-4xl font-bold tracking-tight">Weekly Schedule</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          {activeProfile?.name ? `${activeProfile.name}'s` : 'Your'} viewing schedule
        </p>
      </div>

      {/* Loading State - Skeleton */}
      {isLoading && (
        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <ScheduleGridSkeleton />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-16 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <p className="text-lg font-medium text-destructive">{error}</p>
          <p className="text-muted-foreground mt-2">Please try refreshing the page.</p>
        </div>
      )}

      {/* TV Guide Grid */}
      {!isLoading && !error && (
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden shadow-lg animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {/* Scrollable container */}
          <div ref={scrollContainerRef} className="overflow-x-auto">
            <div style={{ minWidth: DAY_LABEL_WIDTH + maxGridWidth + 40 }}>
              {/* Time Header Row */}
              <div className="flex border-b border-border/50 bg-muted/30">
                {/* Empty cell for day labels column */}
                <div
                  className="flex-shrink-0 border-r border-border/50 bg-muted/50 flex items-center justify-center"
                  style={{ width: DAY_LABEL_WIDTH }}
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                {/* Time markers */}
                <div className="relative h-12 flex-1" style={{ width: maxGridWidth }}>
                  {timeMarkers.map((marker, index) => (
                    <div
                      key={index}
                      className="absolute top-0 h-full flex items-center"
                      style={{ left: marker.offset }}
                    >
                      <span className="px-2 py-1 text-sm font-medium text-muted-foreground">
                        {marker.label}
                      </span>
                    </div>
                  ))}
                  {/* Current time indicator in header */}
                  {currentTimePosition !== null && (
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-primary time-indicator-glow z-10"
                      style={{ left: currentTimePosition }}
                    >
                      <div className="absolute -top-1 -left-1.5 w-3.5 h-3.5 rounded-full bg-primary border-2 border-background" />
                    </div>
                  )}
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
                  isToday={weekday === currentWeekday}
                  currentTimePosition={weekday === currentWeekday ? currentTimePosition : null}
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
  isToday?: boolean;
  currentTimePosition?: number | null;
}

function DayRow({ dayName, shortName, entries, gridWidth, onAddClick, onShowClick, isToday = false, currentTimePosition = null }: DayRowProps) {
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
    <div className={`flex border-b border-border/30 last:border-b-0 transition-colors ${isToday ? 'bg-primary/5' : 'hover:bg-muted/20'}`}>
      {/* Day Label + Add Button */}
      <div
        className={`flex-shrink-0 border-r border-border/30 flex items-center justify-between px-3 py-3 ${isToday ? 'bg-primary/10' : 'bg-muted/20'}`}
        style={{ width: DAY_LABEL_WIDTH }}
      >
        <div className="flex flex-col">
          <span className={`font-semibold text-base hidden sm:block ${isToday ? 'text-primary' : ''}`}>
            {dayName}
            {isToday && <span className="ml-2 text-xs font-normal text-primary/70">Today</span>}
          </span>
          <span className={`font-semibold text-base sm:hidden ${isToday ? 'text-primary' : ''}`}>{shortName}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-primary/20 hover:text-primary transition-colors"
          onClick={onAddClick}
          title={`Add to ${dayName}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Shows Grid Area */}
      <div
        className="relative flex-1 min-h-[80px]"
        style={{ width: gridWidth }}
      >
        {entries.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/60 text-sm">
            <Calendar className="h-4 w-4 mr-2 opacity-40" />
            <span>No shows scheduled</span>
          </div>
        ) : (
          showPositions.map((pos, index) => (
            <ShowBlock
              key={pos.entry.id}
              entry={pos.entry}
              left={pos.left}
              width={pos.width}
              startMinutes={pos.startMinutes}
              onClick={() => onShowClick(pos.entry, pos.startMinutes)}
              colorIndex={index}
            />
          ))
        )}
        {/* Current time indicator line for today's row */}
        {currentTimePosition !== null && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-primary z-20 pointer-events-none"
            style={{ left: currentTimePosition }}
          />
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
  colorIndex?: number;
}

// Color palette for show blocks (cycles through these)
const BLOCK_COLORS = [
  { bg: 'bg-blue-500/15', border: 'border-blue-500/30', hover: 'hover:bg-blue-500/25 hover:border-blue-500/50' },
  { bg: 'bg-violet-500/15', border: 'border-violet-500/30', hover: 'hover:bg-violet-500/25 hover:border-violet-500/50' },
  { bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', hover: 'hover:bg-emerald-500/25 hover:border-emerald-500/50' },
  { bg: 'bg-amber-500/15', border: 'border-amber-500/30', hover: 'hover:bg-amber-500/25 hover:border-amber-500/50' },
  { bg: 'bg-rose-500/15', border: 'border-rose-500/30', hover: 'hover:bg-rose-500/25 hover:border-rose-500/50' },
  { bg: 'bg-cyan-500/15', border: 'border-cyan-500/30', hover: 'hover:bg-cyan-500/25 hover:border-cyan-500/50' },
  { bg: 'bg-orange-500/15', border: 'border-orange-500/30', hover: 'hover:bg-orange-500/25 hover:border-orange-500/50' },
  { bg: 'bg-pink-500/15', border: 'border-pink-500/30', hover: 'hover:bg-pink-500/25 hover:border-pink-500/50' },
];

function ShowBlock({ entry, left, width, startMinutes, onClick, colorIndex = 0 }: ShowBlockProps) {
  const startTimeStr = formatTime(startMinutes);
  const endTimeStr = formatTime(startMinutes + entry.runtime);

  // Episode info display
  const episodeInfo = entry.currentEpisode
    ? `S${entry.currentEpisode.season}E${entry.currentEpisode.episode}`
    : entry.mediaType === 'movie' ? 'Movie' : '';

  // Determine if the block is wide enough for full content
  const isCompact = width < 80;
  const isVeryCompact = width < 50;

  // Get color based on index
  const color = BLOCK_COLORS[colorIndex % BLOCK_COLORS.length];

  return (
    <button
      onClick={onClick}
      className={`absolute top-2 bottom-2 rounded-lg overflow-hidden border ${color.bg} ${color.border} ${color.hover} transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-md active:scale-[0.99]`}
      style={{ left, width: Math.max(width - 4, 24) }} // -4 for spacing between blocks
      title={`${entry.title} ${episodeInfo ? `(${episodeInfo})` : ''} - ${startTimeStr} to ${endTimeStr}`}
    >
      {/* Content */}
      <div className={`h-full flex flex-col justify-center px-3 py-1 ${isVeryCompact ? 'items-center px-1' : ''}`}>
        {isVeryCompact ? (
          // Very compact - just show first letter
          <span className="text-sm font-bold">{entry.title.charAt(0)}</span>
        ) : isCompact ? (
          // Compact - title only, truncated
          <span className="text-sm font-semibold truncate">{entry.title}</span>
        ) : (
          // Full display - title + episode info + time
          <>
            <span className="text-sm font-semibold truncate leading-tight">{entry.title}</span>
            {episodeInfo && (
              <span className="text-xs text-muted-foreground/80 font-medium">{episodeInfo}</span>
            )}
            {width > 120 && (
              <span className="text-xs text-muted-foreground/60 truncate mt-0.5">
                {startTimeStr} - {endTimeStr}
              </span>
            )}
          </>
        )}
      </div>
    </button>
  );
}
