'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface JumpToEpisodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trackedTitleId: string;
  tmdbId: number;
  profileId: string;
  currentSeason: number;
  currentEpisode: number;
  onSuccess: (newSeason: number, newEpisode: number) => void;
}

interface Episode {
  episode_number: number;
  name: string;
}

export function JumpToEpisodeDialog({
  open,
  onOpenChange,
  trackedTitleId,
  tmdbId,
  profileId,
  currentSeason,
  currentEpisode,
  onSuccess,
}: JumpToEpisodeDialogProps) {
  const [isLoadingSeasons, setIsLoadingSeasons] = useState(true);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [totalSeasons, setTotalSeasons] = useState(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  const [selectedSeason, setSelectedSeason] = useState(currentSeason);
  const [selectedEpisode, setSelectedEpisode] = useState(currentEpisode);

  // Fetch TV details to get number of seasons when dialog opens
  useEffect(() => {
    if (!open) return;

    // Reset to current values when opening
    setSelectedSeason(currentSeason);
    setSelectedEpisode(currentEpisode);
    setError(null);

    const fetchTVDetails = async () => {
      setIsLoadingSeasons(true);

      try {
        const response = await fetch(`/api/tmdb/tv/${tmdbId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch TV details');
        }
        const data = await response.json();
        setTotalSeasons(data.number_of_seasons || 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load TV details');
      } finally {
        setIsLoadingSeasons(false);
      }
    };

    fetchTVDetails();
  }, [open, tmdbId, currentSeason, currentEpisode]);

  // Fetch episodes when season changes or dialog opens
  useEffect(() => {
    if (!open || isLoadingSeasons) return;

    const fetchSeasonEpisodes = async () => {
      setIsLoadingEpisodes(true);
      setError(null);

      try {
        const response = await fetch(`/api/tmdb/tv/${tmdbId}/season/${selectedSeason}`);
        if (!response.ok) {
          throw new Error('Failed to fetch season details');
        }
        const data = await response.json();
        const seasonEpisodes: Episode[] = data.episodes || [];
        setEpisodes(seasonEpisodes);

        // If this is the initial load for current season, keep current episode
        // Otherwise reset to episode 1 when season changes
        if (selectedSeason !== currentSeason) {
          setSelectedEpisode(1);
        } else if (selectedEpisode > seasonEpisodes.length) {
          setSelectedEpisode(seasonEpisodes.length > 0 ? 1 : 1);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load episodes');
        setEpisodes([]);
      } finally {
        setIsLoadingEpisodes(false);
      }
    };

    fetchSeasonEpisodes();
  }, [open, tmdbId, selectedSeason, isLoadingSeasons, currentSeason, currentEpisode]);

  // Handle season change
  const handleSeasonChange = (value: string) => {
    const newSeason = parseInt(value, 10);
    setSelectedSeason(newSeason);
    // Episode will be reset in the useEffect when episodes load
  };

  // Handle episode change
  const handleEpisodeChange = (value: string) => {
    setSelectedEpisode(parseInt(value, 10));
  };

  // Check if there are changes
  const hasChanges = selectedSeason !== currentSeason || selectedEpisode !== currentEpisode;

  // Handle save
  const handleSave = async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId,
          trackedTitleId,
          seasonNumber: selectedSeason,
          episodeNumber: selectedEpisode,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save progress');
      }

      onSuccess(selectedSeason, selectedEpisode);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save progress');
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = isLoadingSeasons || isLoadingEpisodes;
  const canSave = hasChanges && !isLoading && !isSaving && episodes.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Jump to Episode</DialogTitle>
          <DialogDescription>
            Select the season and episode you want to jump to.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Error State */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Loading State for initial load */}
          {isLoadingSeasons && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Season and Episode Selects */}
          {!isLoadingSeasons && (
            <div className="grid grid-cols-2 gap-4">
              {/* Season Select */}
              <div className="space-y-2">
                <Label htmlFor="season-select">Season</Label>
                <Select
                  value={selectedSeason.toString()}
                  onValueChange={handleSeasonChange}
                  disabled={isLoading || isSaving}
                >
                  <SelectTrigger id="season-select" className="w-full">
                    <SelectValue placeholder="Season" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((season) => (
                      <SelectItem key={season} value={season.toString()}>
                        Season {season}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Episode Select */}
              <div className="space-y-2">
                <Label htmlFor="episode-select">Episode</Label>
                <Select
                  value={selectedEpisode.toString()}
                  onValueChange={handleEpisodeChange}
                  disabled={isLoading || isSaving || episodes.length === 0}
                >
                  <SelectTrigger id="episode-select" className="w-full">
                    {isLoadingEpisodes ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <SelectValue placeholder="Episode" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {episodes.map((ep) => (
                      <SelectItem key={ep.episode_number} value={ep.episode_number.toString()}>
                        E{ep.episode_number}: {ep.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!canSave}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
