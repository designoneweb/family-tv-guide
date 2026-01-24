'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Film, Loader2, CheckCircle, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThinProgress } from '@/components/ui/progress';
import { getPosterUrl, getStillUrl } from '@/lib/tmdb/images';
import { ProviderLogos, type Provider } from '@/components/provider-logos';
import { JumpToEpisodeDialog } from '@/components/jump-to-episode-dialog';
import { cn } from '@/lib/utils';

export interface CurrentEpisode {
  season: number;
  episode: number;
  title: string;
  stillPath: string | null;
  completed?: boolean;
}

export interface TitleCardProps {
  tmdbId: number;
  mediaType: 'tv' | 'movie';
  title: string;
  posterPath: string | null;
  year?: string;
  providers?: Provider[];
  inLibrary?: boolean;
  onAdd?: () => void;
  onRemove?: () => void;
  isLoading?: boolean;
  currentEpisode?: CurrentEpisode | null;
  onMarkWatched?: () => void;
  trackedTitleId?: string;
  isAdvancing?: boolean;
  profileId?: string;
  onJumpToEpisode?: (newSeason: number, newEpisode: number) => void;
  isCaughtUp?: boolean;
  /** Show "New Episode" badge */
  isNewEpisode?: boolean;
  /** Show "Finale" badge */
  isFinale?: boolean;
  /** Show "Premiere" badge */
  isPremiere?: boolean;
  /** Episode progress (for showing progress bar) */
  progress?: { watched: number; total: number };
}

/**
 * Reusable title card component for displaying TV shows and movies.
 * Cinema Lounge styling with gold accents and glassmorphism.
 */
export function TitleCard({
  tmdbId,
  mediaType,
  title,
  posterPath,
  year,
  providers,
  inLibrary = false,
  onAdd,
  onRemove,
  isLoading = false,
  currentEpisode,
  onMarkWatched,
  trackedTitleId,
  isAdvancing = false,
  profileId,
  onJumpToEpisode,
  isCaughtUp = false,
  isNewEpisode = false,
  isFinale = false,
  isPremiere = false,
  progress,
}: TitleCardProps) {
  const [jumpDialogOpen, setJumpDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const posterUrl = getPosterUrl(posterPath);

  // Get episode still URL if current episode has a still
  const episodeStillUrl = currentEpisode?.stillPath
    ? getStillUrl(currentEpisode.stillPath, 'large')
    : null;

  // Determine which image to use: episode still (16:9) or poster (2:3)
  const useEpisodeStill = mediaType === 'tv' && currentEpisode && episodeStillUrl;
  const displayImageUrl = useEpisodeStill ? episodeStillUrl : posterUrl;
  const aspectRatioClass = useEpisodeStill ? 'aspect-video' : 'aspect-[2/3]';

  // Handle successful jump to episode
  const handleJumpSuccess = (newSeason: number, newEpisode: number) => {
    if (onJumpToEpisode) {
      onJumpToEpisode(newSeason, newEpisode);
    }
  };

  // Check if jump to episode is available (need trackedTitleId and profileId)
  const canJumpToEpisode = currentEpisode && trackedTitleId && profileId && onJumpToEpisode;

  // Determine image link destination
  const imageUrl = mediaType === 'tv'
    ? currentEpisode
      ? `/app/show/${tmdbId}/season/${currentEpisode.season}/episode/${currentEpisode.episode}`
      : `/app/show/${tmdbId}`
    : null;

  // Link to show detail page (only for TV shows)
  const showDetailUrl = mediaType === 'tv' ? `/app/show/${tmdbId}` : null;

  // Determine which badge to show (priority: Finale > Premiere > New Episode)
  const badgeType = isFinale ? 'finale' : isPremiere ? 'premiere' : isNewEpisode ? 'new' : null;

  return (
    <div
      className={cn(
        'group bg-elevated rounded-[20px] overflow-hidden border border-primary/10 shadow-cinema card-hover',
        isHovered && 'shadow-gold-glow'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with gradient overlay */}
      <div className={cn(aspectRatioClass, 'relative overflow-hidden')}>
        {/* Clickable image area */}
        {imageUrl ? (
          <Link href={imageUrl} className="block absolute inset-0">
            {displayImageUrl ? (
              <Image
                src={displayImageUrl}
                alt={currentEpisode ? `${title} - S${currentEpisode.season}E${currentEpisode.episode}` : title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105 img-hover"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-interactive">
                <Film className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </Link>
        ) : (
          <>
            {displayImageUrl ? (
              <Image
                src={displayImageUrl}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105 img-hover"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-interactive">
                <Film className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </>
        )}

        {/* Card overlay gradient for text legibility */}
        <div className="card-overlay absolute inset-0 pointer-events-none" />

        {/* Top badges row */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between pointer-events-none">
          {/* Episode badge (New/Premiere/Finale) */}
          {badgeType && (
            <Badge
              variant={badgeType === 'finale' ? 'finale' : badgeType === 'premiere' ? 'premiere' : 'new'}
              className="pointer-events-auto"
            >
              {badgeType === 'finale' ? (
                <>
                  <Star className="h-3 w-3 mr-1" />
                  Finale
                </>
              ) : badgeType === 'premiere' ? (
                <>
                  <Sparkles className="h-3 w-3 mr-1" />
                  Premiere
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3 mr-1" />
                  New
                </>
              )}
            </Badge>
          )}

          {/* Streaming provider badge - glass effect */}
          {providers && providers.length > 0 && (
            <div className="flex -space-x-1 pointer-events-auto">
              {providers.slice(0, 3).map((provider, idx) => (
                <div
                  key={provider.name}
                  className="w-8 h-8 rounded-[8px] overflow-hidden ring-2 ring-background/50 glass-subtle"
                  style={{ zIndex: 3 - idx }}
                  title={provider.name}
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w45${provider.logoPath}`}
                    alt={provider.name}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom overlay with title on image */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
          {showDetailUrl ? (
            <Link href={showDetailUrl} className="block pointer-events-auto">
              <h3 className="font-serif font-bold text-foreground text-lg leading-tight line-clamp-2 drop-shadow-lg hover:text-primary transition-colors" title={title}>
                {title}
              </h3>
            </Link>
          ) : (
            <h3 className="font-serif font-bold text-foreground text-lg leading-tight line-clamp-2 drop-shadow-lg" title={title}>
              {title}
            </h3>
          )}
        </div>
      </div>

      {/* Progress bar (if available) */}
      {progress && progress.total > 0 && (
        <ThinProgress value={(progress.watched / progress.total) * 100} className="rounded-none" />
      )}

      {/* Info */}
      <div className="p-6 space-y-4">
        {/* Episode info for TV shows */}
        {currentEpisode && (
          canJumpToEpisode ? (
            <button
              onClick={() => setJumpDialogOpen(true)}
              className="episode-number text-sm line-clamp-1 text-left hover:underline cursor-pointer transition-colors"
              title="Click to change episode"
            >
              S{currentEpisode.season}E{currentEpisode.episode}: {currentEpisode.title}
            </button>
          ) : (
            <p className="episode-number text-sm line-clamp-1" title={`S${currentEpisode.season}E${currentEpisode.episode}: ${currentEpisode.title}`}>
              S{currentEpisode.season}E{currentEpisode.episode}: {currentEpisode.title}
            </p>
          )
        )}

        {/* Year and media type row */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {year && <span>{year}</span>}
          <Badge variant="outline" size="sm">
            {mediaType === 'tv' ? 'TV' : 'Movie'}
          </Badge>
        </div>

        {/* Mark Watched button for TV shows */}
        {currentEpisode && onMarkWatched && (
          isCaughtUp ? (
            <div className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-success bg-success/10 rounded-[8px] border border-success/20">
              <CheckCircle className="h-4 w-4" />
              All caught up!
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={onMarkWatched}
              disabled={isAdvancing}
              className="w-full"
            >
              {isAdvancing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Advancing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Watched
                </>
              )}
            </Button>
          )
        )}

        {/* Action button */}
        <div>
          {inLibrary && onRemove ? (
            <Button
              variant="ghost"
              onClick={onRemove}
              disabled={isLoading}
              className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                'Remove'
              )}
            </Button>
          ) : inLibrary && !onRemove ? (
            <Button variant="secondary" disabled className="w-full opacity-60">
              In Library
            </Button>
          ) : onAdd ? (
            <Button onClick={onAdd} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add to Library'
              )}
            </Button>
          ) : null}
        </div>
      </div>

      {/* Jump to Episode Dialog */}
      {canJumpToEpisode && trackedTitleId && profileId && currentEpisode && (
        <JumpToEpisodeDialog
          open={jumpDialogOpen}
          onOpenChange={setJumpDialogOpen}
          trackedTitleId={trackedTitleId}
          tmdbId={tmdbId}
          profileId={profileId}
          currentSeason={currentEpisode.season}
          currentEpisode={currentEpisode.episode}
          onSuccess={handleJumpSuccess}
        />
      )}
    </div>
  );
}
