'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Loader2, Film, Plus, Library, Search, AlertCircle, Tv, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TitleCard } from '@/components/title-card';
import { TitleCardSkeletonGrid } from '@/components/ui/skeleton';
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
import type { MediaType } from '@/lib/database.types';

interface Provider {
  name: string;
  logoPath: string;
}

interface LibraryTitle {
  id: string;
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  year: string;
  providers: Provider[];
}

type FilterType = 'all' | 'tv' | 'movie';

export function LibraryClient() {
  const [titles, setTitles] = useState<LibraryTitle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<LibraryTitle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch library on mount
  useEffect(() => {
    const fetchLibrary = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/library');
        if (!response.ok) {
          throw new Error('Failed to fetch library');
        }
        const data = await response.json();
        setTitles(data.titles || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load library');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  // Handle remove action - open confirmation dialog
  const handleRemoveClick = useCallback((title: LibraryTitle) => {
    setDeleteTarget(title);
  }, []);

  // Confirm deletion
  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/library/${deleteTarget.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove title');
      }

      // Remove from local state
      setTitles((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    } catch (err) {
      console.error('Error removing title:', err);
      // Could show error toast here
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget]);

  // Cancel deletion
  const handleCancelDelete = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  // Filter titles based on selected filter
  const filteredTitles = titles.filter((title) => {
    if (filter === 'all') return true;
    return title.mediaType === filter;
  });

  // Compute stats by media type
  const stats = useMemo(() => {
    const shows = titles.filter((t) => t.mediaType === 'tv').length;
    const movies = titles.filter((t) => t.mediaType === 'movie').length;
    return { shows, movies };
  }, [titles]);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Ambient gradient background */}
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/5 via-primary/2 to-transparent pointer-events-none -z-10" />

      {/* Header with glass card */}
      <div className="glass rounded-2xl p-6 border border-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 ring-1 ring-primary/20">
              <Library className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">My Library</h1>
              {!isLoading && titles.length > 0 && (
                <p className="text-muted-foreground mt-1">
                  {stats.shows > 0 && <span>{stats.shows} {stats.shows === 1 ? 'Show' : 'Shows'}</span>}
                  {stats.shows > 0 && stats.movies > 0 && <span className="mx-2">•</span>}
                  {stats.movies > 0 && <span>{stats.movies} {stats.movies === 1 ? 'Movie' : 'Movies'}</span>}
                </p>
              )}
            </div>
          </div>
          <Link href="/app/library/search">
            <Button size="lg" className="gap-2 glow-on-hover">
              <Plus className="h-5 w-5" />
              Add Titles
            </Button>
          </Link>
        </div>
      </div>

      {/* Premium Filter Pills */}
      <div className="flex justify-center">
        <div className="inline-flex gap-1 p-1.5 rounded-full glass border border-border/50">
          <Button
            variant={filter === 'all' ? 'default' : 'ghost'}
            onClick={() => setFilter('all')}
            size="sm"
            className={`rounded-full gap-2 transition-all active:scale-[0.98] ${
              filter === 'all' ? 'shadow-md' : 'hover:bg-muted/50'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            All
          </Button>
          <Button
            variant={filter === 'tv' ? 'default' : 'ghost'}
            onClick={() => setFilter('tv')}
            size="sm"
            className={`rounded-full gap-2 transition-all active:scale-[0.98] ${
              filter === 'tv' ? 'shadow-md' : 'hover:bg-muted/50'
            }`}
          >
            <Tv className="h-4 w-4" />
            TV Shows
          </Button>
          <Button
            variant={filter === 'movie' ? 'default' : 'ghost'}
            onClick={() => setFilter('movie')}
            size="sm"
            className={`rounded-full gap-2 transition-all active:scale-[0.98] ${
              filter === 'movie' ? 'shadow-md' : 'hover:bg-muted/50'
            }`}
          >
            <Film className="h-4 w-4" />
            Movies
          </Button>
        </div>
      </div>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Loading State - Skeleton */}
      {isLoading && (
        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <TitleCardSkeletonGrid count={6} />
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

      {/* Empty State - Enhanced */}
      {!isLoading && !error && titles.length === 0 && (
        <div className="text-center py-20 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mb-8 ring-1 ring-primary/10">
            <Film className="h-12 w-12 text-primary/60" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Start Your Collection</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
            Add your favorite shows and movies to track what you&apos;re watching and never miss an episode.
          </p>
          <Link href="/app/library/search">
            <Button size="lg" className="gap-2 glow-on-hover">
              <Search className="h-5 w-5" />
              Browse Titles
            </Button>
          </Link>
        </div>
      )}

      {/* No Results for Filter */}
      {!isLoading && !error && titles.length > 0 && filteredTitles.length === 0 && (
        <div className="text-center py-16 text-muted-foreground animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Film className="h-8 w-8 text-muted-foreground/60" />
          </div>
          <p className="text-lg">No {filter === 'tv' ? 'TV shows' : 'movies'} in your library.</p>
        </div>
      )}

      {/* Title Grid with staggered animation */}
      {!isLoading && filteredTitles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {filteredTitles.map((title) => (
            <TitleCard
              key={title.id}
              tmdbId={title.tmdbId}
              mediaType={title.mediaType}
              title={title.title}
              posterPath={title.posterPath}
              year={title.year}
              providers={title.providers}
              inLibrary={true}
              onRemove={() => handleRemoveClick(title)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && handleCancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Library?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove &quot;{deleteTarget?.title}&quot; from your library?
              This will also remove any schedule entries and progress for this title.
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
    </div>
  );
}
