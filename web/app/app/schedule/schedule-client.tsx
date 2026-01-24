'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import { Plus, Calendar, Clock, AlertCircle, ChevronLeft, ChevronRight, Tv } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/lib/contexts/profile-context';
import { AddToScheduleDialog } from '@/components/add-to-schedule-dialog';
import { ScheduleShowDialog } from '@/components/schedule-show-dialog';
import { ScheduleGridSkeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { MediaType } from '@/lib/database.types';

// Constants
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_SHORT_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const PIXELS_PER_MINUTE = 4; // 4px per minute = 240px per hour
const START_HOUR = 17; // 5:00 PM
const DAY_LABEL_WIDTH = 100; // Width of day label column in pixels

// Genre-based color mapping using Cinema Lounge palette
const GENRE_COLORS: Record<string, { bg: string; border: string; glow: string }> = {
  comedy: { bg: 'bg-genre-comedy/20', border: 'border-genre-comedy/40', glow: 'shadow-[0_0_20px_rgba(212,168,83,0.2)]' },
  drama: { bg: 'bg-genre-drama/20', border: 'border-genre-drama/40', glow: 'shadow-[0_0_20px_rgba(139,77,107,0.2)]' },
  action: { bg: 'bg-genre-action/20', border: 'border-genre-action/40', glow: 'shadow-[0_0_20px_rgba(194,91,77,0.2)]' },
  scifi: { bg: 'bg-genre-scifi/20', border: 'border-genre-scifi/40', glow: 'shadow-[0_0_20px_rgba(77,123,139,0.2)]' },
  horror: { bg: 'bg-genre-horror/20', border: 'border-genre-horror/40', glow: 'shadow-[0_0_20px_rgba(92,77,107,0.2)]' },
  documentary: { bg: 'bg-genre-documentary/20', border: 'border-genre-documentary/40', glow: 'shadow-[0_0_20px_rgba(107,139,92,0.2)]' },
  animation: { bg: 'bg-genre-animation/20', border: 'border-genre-animation/40', glow: 'shadow-[0_0_20px_rgba(232,155,92,0.2)]' },
  romance: { bg: 'bg-genre-romance/20', border: 'border-genre-romance/40', glow: 'shadow-[0_0_20px_rgba(179,92,123,0.2)]' },
  default: { bg: 'bg-interactive', border: 'border-primary/20', glow: 'shadow-[0_0_20px_rgba(212,168,83,0.1)]' },
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

// Helper to get current week date range
function getWeekDateRange(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dayOfWeek);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}, ${now.getFullYear()}`;
}

// Helper to get date for a weekday
function getDateForWeekday(weekday: number): string {
  const now = new Date();
  const currentDay = now.getDay();
  const diff = weekday - currentDay;
  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + diff);
  return targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

    // Only show indicator if current time is after START_HOUR (5 PM)
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
    // At minimum, show 7 hours (420 minutes) - 5 PM to midnight
    return Math.max(maxMinutes, 420) * PIXELS_PER_MINUTE;
  }, [schedule]);

  // Generate time markers
  const timeMarkers = useMemo(() => {
    const markers: { offset: number; label: string; isHour: boolean }[] = [];
    const totalMinutes = Math.ceil(maxGridWidth / PIXELS_PER_MINUTE);
    // Generate markers every 30 minutes
    for (let minutes = 0; minutes <= totalMinutes; minutes += 30) {
      markers.push({
        offset: minutes * PIXELS_PER_MINUTE,
        label: formatTime(minutes),
        isHour: minutes % 60 === 0,
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

  // Scroll to today
  const scrollToToday = useCallback(() => {
    const todayRow = document.getElementById(`day-row-${currentWeekday}`);
    if (todayRow) {
      todayRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentWeekday]);

  // Check if schedule is empty
  const isScheduleEmpty = useMemo(() => {
    return Object.values(schedule).every(entries => entries.length === 0);
  }, [schedule]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <header className="px-6 lg:px-8 pt-6 pb-4 border-b border-primary/5 animate-fade-in-up">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          {/* Title Section */}
          <div>
            <h1 className="font-serif text-page-title text-foreground">
              Weekly Schedule
            </h1>
            <p className="text-muted-foreground mt-1">
              {activeProfile?.name ? `${activeProfile.name}'s` : 'Your'} viewing week
            </p>
          </div>

          {/* Week Navigation */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-foreground hidden sm:block">
              {getWeekDateRange()}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 glass border border-primary/10 hover:border-primary/30 hover:text-primary"
                disabled
                title="Previous week (coming soon)"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 glass border border-primary/10 hover:border-primary/30 hover:text-primary"
                disabled
                title="Next week (coming soon)"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={scrollToToday}
              className="text-xs"
            >
              Today
            </Button>
          </div>
        </div>
      </header>

      {/* Loading State - Skeleton */}
      {isLoading && (
        <div className="px-6 lg:px-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="max-w-7xl mx-auto">
            <ScheduleGridSkeleton />
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="px-6 lg:px-8 text-center py-16 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <p className="text-lg font-medium text-destructive">{error}</p>
          <p className="text-muted-foreground mt-2">Please try refreshing the page.</p>
        </div>
      )}

      {/* Empty Schedule State */}
      {!isLoading && !error && isScheduleEmpty && (
        <div className="px-6 lg:px-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="relative mb-8">
                <div className="w-32 h-32 rounded-full bg-elevated flex items-center justify-center border border-primary/10">
                  <Calendar className="w-16 h-16 text-primary/40" />
                </div>
                <div className="absolute -right-2 -bottom-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Tv className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h2 className="font-serif text-section text-foreground mb-2">
                Your week is wide open
              </h2>
              <p className="text-muted-foreground max-w-md mb-8">
                Add shows from your library to start planning your viewing week.
              </p>
              <Button
                onClick={() => {
                  setAddDialogWeekday(currentWeekday);
                  setAddDialogOpen(true);
                }}
                className="btn-glow"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Show
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TV Guide Grid */}
      {!isLoading && !error && !isScheduleEmpty && (
        <div className="px-6 lg:px-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="max-w-7xl mx-auto">
            <div className="bg-card rounded-xl border border-primary/10 overflow-hidden shadow-cinema">
              {/* Scrollable container */}
              <div ref={scrollContainerRef} className="overflow-x-auto">
                <div style={{ minWidth: DAY_LABEL_WIDTH + maxGridWidth + 40 }}>
                  {/* Time Header Row */}
                  <div className="flex border-b border-primary/10 glass sticky top-0 z-30">
                    {/* Empty cell for day labels column */}
                    <div
                      className="flex-shrink-0 border-r border-primary/10 bg-card flex items-center justify-center"
                      style={{ width: DAY_LABEL_WIDTH }}
                    >
                      <Clock className="h-4 w-4 text-hint" />
                    </div>
                    {/* Time markers */}
                    <div className="relative h-12 flex-1" style={{ width: maxGridWidth }}>
                      {timeMarkers.map((marker, index) => (
                        <div
                          key={index}
                          className="absolute top-0 h-full flex items-center border-l border-primary/5"
                          style={{ left: marker.offset }}
                        >
                          {marker.isHour && (
                            <span className="px-2 py-1 text-xs font-mono text-hint">
                              {marker.label}
                            </span>
                          )}
                        </div>
                      ))}
                      {/* Current time indicator in header */}
                      {currentTimePosition !== null && (
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-secondary z-10"
                          style={{
                            left: currentTimePosition,
                            boxShadow: '0 0 10px rgba(139, 41, 66, 0.5)',
                          }}
                        >
                          <div className="absolute -top-0 -left-7 px-2 py-0.5 rounded bg-secondary text-secondary-foreground text-[10px] font-mono animate-glow-pulse">
                            {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Day Rows */}
                  {DAY_NAMES.map((dayName, weekday) => (
                    <DayRow
                      key={weekday}
                      id={`day-row-${weekday}`}
                      dayName={dayName}
                      shortName={DAY_SHORT_NAMES[weekday]}
                      dateLabel={getDateForWeekday(weekday)}
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
          </div>
        </div>
      )}

      {/* Floating Add Button (FAB) */}
      {!isLoading && !error && !isScheduleEmpty && (
        <Button
          onClick={() => {
            setAddDialogWeekday(currentWeekday);
            setAddDialogOpen(true);
          }}
          className="fixed bottom-24 md:bottom-8 right-6 w-14 h-14 rounded-full gold-gradient shadow-cinema-lg hover:scale-110 transition-transform z-40 btn-glow"
          title="Add to Schedule"
        >
          <Plus className="h-6 w-6 text-primary-foreground" />
        </Button>
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
  id: string;
  dayName: string;
  shortName: string;
  dateLabel: string;
  entries: EnrichedScheduleEntry[];
  gridWidth: number;
  onAddClick: () => void;
  onShowClick: (entry: EnrichedScheduleEntry, startTime: number) => void;
  isToday?: boolean;
  currentTimePosition?: number | null;
}

function DayRow({ id, dayName, shortName, dateLabel, entries, gridWidth, onAddClick, onShowClick, isToday = false, currentTimePosition = null }: DayRowProps) {
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
    <div
      id={id}
      className={cn(
        'flex border-b border-primary/5 last:border-b-0 transition-colors',
        isToday ? 'bg-primary/5' : 'hover:bg-elevated/50'
      )}
    >
      {/* Day Label Cell */}
      <div
        className={cn(
          'flex-shrink-0 border-r border-primary/10 flex flex-col justify-center px-4 py-4 sticky left-0 z-20',
          isToday ? 'bg-primary/10' : 'bg-card'
        )}
        style={{ width: DAY_LABEL_WIDTH }}
      >
        <div className="flex items-center gap-2">
          <span className={cn(
            'font-semibold hidden sm:block',
            isToday ? 'text-primary' : 'text-foreground'
          )}>
            {dayName}
          </span>
          <span className={cn(
            'font-semibold sm:hidden',
            isToday ? 'text-primary' : 'text-foreground'
          )}>
            {shortName}
          </span>
          {isToday && (
            <span className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
          )}
        </div>
        <span className="text-xs text-muted-foreground mt-0.5">
          {dateLabel}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 mt-2 hover:bg-primary/20 hover:text-primary transition-colors p-0"
          onClick={onAddClick}
          title={`Add to ${dayName}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Shows Grid Area */}
      <div
        className="relative flex-1"
        style={{ width: gridWidth, minHeight: 120 }}
      >
        {entries.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-hint text-sm border border-dashed border-primary/10 m-2 rounded-lg">
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
              index={index}
            />
          ))
        )}
        {/* Current time indicator line for today's row */}
        {currentTimePosition !== null && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-secondary z-20 pointer-events-none"
            style={{
              left: currentTimePosition,
              boxShadow: '0 0 10px rgba(139, 41, 66, 0.5)',
            }}
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
  index?: number;
}

function ShowBlock({ entry, left, width, startMinutes, onClick, index = 0 }: ShowBlockProps) {
  const startTimeStr = formatTime(startMinutes);
  const endTimeStr = formatTime(startMinutes + entry.runtime);

  // Episode info display
  const episodeInfo = entry.currentEpisode
    ? `S${entry.currentEpisode.season}E${entry.currentEpisode.episode}`
    : entry.mediaType === 'movie' ? 'Movie' : '';

  // Determine if the block is wide enough for full content
  const isCompact = width < 140;
  const isVeryCompact = width < 80;

  // Get genre color
  const genreColor = GENRE_COLORS.default;

  return (
    <button
      onClick={onClick}
      className={cn(
        'absolute top-2 bottom-2 rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer group',
        genreColor.bg,
        genreColor.border,
        'hover:scale-[1.02] hover:z-10',
        genreColor.glow
      )}
      style={{
        left,
        width: Math.max(width - 8, 32), // -8 for spacing between blocks
        animationDelay: `${index * 50}ms`,
      }}
      title={`${entry.title} ${episodeInfo ? `(${episodeInfo})` : ''} - ${startTimeStr} to ${endTimeStr}`}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/30 pointer-events-none" />

      {/* Content */}
      <div className={cn(
        'h-full flex gap-3 p-3',
        isVeryCompact ? 'items-center justify-center px-1' : ''
      )}>
        {/* Thumbnail */}
        {!isVeryCompact && entry.posterPath && (
          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-elevated">
            <Image
              src={`https://image.tmdb.org/t/p/w92${entry.posterPath}`}
              alt={entry.title}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        )}

        {/* Info */}
        <div className={cn(
          'flex flex-col justify-center min-w-0 flex-1',
          isVeryCompact && 'items-center'
        )}>
          {isVeryCompact ? (
            // Very compact - just show first letter
            <span className="text-sm font-bold text-foreground">{entry.title.charAt(0)}</span>
          ) : isCompact ? (
            // Compact - title only, truncated
            <span className="text-sm font-semibold text-foreground truncate">{entry.title}</span>
          ) : (
            // Full display
            <>
              <span className="text-sm font-semibold text-foreground truncate leading-tight">
                {entry.title}
              </span>
              {episodeInfo && (
                <span className="text-xs font-mono text-primary mt-0.5">{episodeInfo}</span>
              )}
              {width > 200 && (
                <span className="text-xs text-muted-foreground mt-1">
                  {startTimeStr} - {endTimeStr}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Hover border glow */}
      <div className="absolute inset-0 border-2 border-primary/0 rounded-xl transition-colors group-hover:border-primary/30 pointer-events-none" />
    </button>
  );
}
