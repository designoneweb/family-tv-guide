'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Loader2, Film, Plus, Library, Search, AlertCircle, Tv, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TitleCard } from '@/components/title-card';
import { TitleCardSkeletonGrid } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
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
    <div className="space-y-6">
      {/* Page Header */}
      <header className="px-6 lg:px-8 pt-6 pb-4 border-b border-primary/5 animate-fade-in-up">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          {/* Title Section */}
          <div>
            <h1 className="font-serif text-page-title text-foreground">
              Library
            </h1>
            {!isLoading && titles.length > 0 && (
              <p className="text-muted-foreground mt-1">
                {stats.shows > 0 && <span>{stats.shows} {stats.shows === 1 ? 'Show' : 'Shows'}</span>}
                {stats.shows > 0 && stats.movies > 0 && <span className="mx-2">•</span>}
                {stats.movies > 0 && <span>{stats.movies} {stats.movies === 1 ? 'Movie' : 'Movies'}</span>}
              </p>
            )}
          </div>

          {/* Add Button (Desktop) */}
          <Link href="/app/library/search" className="hidden sm:block">
            <Button className="btn-glow">
              <Plus className="h-4 w-4 mr-2" />
              Add Title
            </Button>
          </Link>
        </div>
      </header>

      {/* Filters Section */}
      <div className="px-6 lg:px-8 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Media Type Filter */}
            <div className="inline-flex p-1 rounded-full glass border border-primary/10">
              <button
                onClick={() => setFilter('all')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  filter === 'all'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <LayoutGrid className="h-4 w-4" />
                All
              </button>
              <button
                onClick={() => setFilter('tv')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  filter === 'tv'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Tv className="h-4 w-4" />
                TV Shows
              </button>
              <button
                onClick={() => setFilter('movie')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  filter === 'movie'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Film className="h-4 w-4" />
                Movies
              </button>
            </div>

            {/* Could add sort dropdown here */}
          </div>
        </div>
      </div>

      {/* Loading State - Skeleton */}
      {isLoading && (
        <div className="px-6 lg:px-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="max-w-7xl mx-auto">
            <TitleCardSkeletonGrid count={8} />
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

      {/* Empty State - No titles */}
      {!isLoading && !error && titles.length === 0 && (
        <div className="px-6 lg:px-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="relative mb-8">
                <div className="w-32 h-32 rounded-full bg-elevated flex items-center justify-center border border-primary/10">
                  <Library className="w-16 h-16 text-primary/40" />
                </div>
                <div className="absolute -right-2 -bottom-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Film className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h2 className="font-serif text-section text-foreground mb-2">
                Your library is empty
              </h2>
              <p className="text-muted-foreground max-w-md mb-8">
                Start building your collection by searching for shows and movies you want to track.
              </p>
              <Link href="/app/library/search">
                <Button className="btn-glow">
                  <Search className="w-4 h-4 mr-2" />
                  Search Titles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* No Results for Filter */}
      {!isLoading && !error && titles.length > 0 && filteredTitles.length === 0 && (
        <div className="px-6 lg:px-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-elevated flex items-center justify-center border border-primary/10 mb-6">
                {filter === 'tv' ? (
                  <Tv className="w-10 h-10 text-muted-foreground/40" />
                ) : (
                  <Film className="w-10 h-10 text-muted-foreground/40" />
                )}
              </div>
              <h3 className="font-serif text-xl text-foreground mb-2">
                No {filter === 'tv' ? 'TV Shows' : 'Movies'} found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or add some {filter === 'tv' ? 'TV shows' : 'movies'} to your library.
              </p>
              <Button
                variant="outline"
                onClick={() => setFilter('all')}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Title Grid */}
      {!isLoading && filteredTitles.length > 0 && (
        <div className="px-6 lg:px-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 stagger-children">
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
          </div>
        </div>
      )}

      {/* Floating Add Button (Mobile FAB) */}
      <Link
        href="/app/library/search"
        className="fixed bottom-24 md:hidden right-6 w-14 h-14 rounded-full gold-gradient shadow-cinema-lg flex items-center justify-center z-40 btn-glow hover:scale-110 transition-transform"
      >
        <Plus className="h-6 w-6 text-primary-foreground" />
      </Link>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && handleCancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif">Remove from Library?</AlertDialogTitle>
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
