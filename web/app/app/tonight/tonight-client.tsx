'use client';

import { useState, useEffect } from 'react';
import { Loader2, Calendar, Tv } from 'lucide-react';
import { TitleCard } from '@/components/title-card';
import { useProfile } from '@/lib/contexts/profile-context';
import type { MediaType } from '@/lib/database.types';

interface Provider {
  name: string;
  logoPath: string;
}

interface CurrentEpisode {
  season: number;
  episode: number;
  title: string;
  stillPath: string | null;
}

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
  providers: Provider[];
  currentEpisode: CurrentEpisode | null;
}

const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function TonightClient() {
  const { activeProfileId } = useProfile();
  const [entries, setEntries] = useState<EnrichedScheduleEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current day info
  const today = new Date();
  const currentWeekday = today.getDay(); // 0 = Sunday, matches DB

  // Fetch today's schedule
  useEffect(() => {
    if (!activeProfileId) return;

    const fetchTonightSchedule = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/schedule?profileId=${activeProfileId}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch schedule');
        }

        const data = await response.json();
        const todayEntries: EnrichedScheduleEntry[] =
          data.schedule[currentWeekday] || [];

        // Sort by slot order
        todayEntries.sort((a, b) => a.slotOrder - b.slotOrder);
        setEntries(todayEntries);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load schedule'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTonightSchedule();
  }, [activeProfileId, currentWeekday]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Tonight</h1>
        </div>
        <p className="text-muted-foreground text-lg">{formatDate(today)}</p>
        {!isLoading && !error && (
          <p className="text-muted-foreground mt-1">
            {entries.length} {entries.length === 1 ? 'show' : 'shows'} scheduled
          </p>
        )}
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

      {/* Empty State */}
      {!isLoading && !error && entries.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Tv className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">Nothing scheduled for {WEEKDAY_NAMES[currentWeekday]}.</p>
          <p className="text-sm">
            Add titles to your schedule from the Schedule page.
          </p>
        </div>
      )}

      {/* Title Grid - Art-forward display */}
      {!isLoading && entries.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <TitleCard
              key={entry.id}
              tmdbId={entry.tmdbId}
              mediaType={entry.mediaType}
              title={entry.title}
              posterPath={entry.posterPath}
              year={entry.year}
              providers={entry.providers}
              inLibrary={true}
              currentEpisode={entry.currentEpisode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
