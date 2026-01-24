'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
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
import { createClient } from '@/lib/supabase/client';
import { deleteProfile } from '@/lib/services/profile';
import type { Profile, MaturityLevel } from '@/lib/database.types';

interface ProfileListClientProps {
  profiles: Profile[];
}

/**
 * Get a readable label for maturity level.
 */
function getMaturityLabel(level: MaturityLevel): string {
  const labels: Record<MaturityLevel, string> = {
    kids: 'Kids',
    teen: 'Teen',
    adult: 'Adult',
  };
  return labels[level];
}

/**
 * Get badge variant for maturity level.
 */
function getMaturityVariant(level: MaturityLevel): 'default' | 'secondary' | 'outline' {
  const variants: Record<MaturityLevel, 'default' | 'secondary' | 'outline'> = {
    kids: 'default',
    teen: 'outline',
    adult: 'secondary',
  };
  return variants[level];
}

/**
 * Get the avatar color class using Cinema Lounge palette
 */
function getAvatarColor(profile: Profile): string {
  const colors = [
    'bg-primary',
    'bg-secondary',
    'bg-tertiary',
    'bg-genre-drama',
    'bg-genre-action',
    'bg-genre-scifi',
    'bg-genre-documentary',
    'bg-genre-animation',
  ];

  // Derive from name
  const charCode = profile.name.charCodeAt(0) || 0;
  return colors[charCode % colors.length];
}

/**
 * Profile list with edit/delete actions
 */
export function ProfileListClient({ profiles: initialProfiles }: ProfileListClientProps) {
  const router = useRouter();
  const [profiles, setProfiles] = useState(initialProfiles);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDeleteConfirm() {
    if (!profileToDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      const supabase = createClient();
      const result = await deleteProfile(supabase, profileToDelete.id);

      if (result.error) {
        setError(result.error.message);
        return;
      }

      // Remove from local state
      setProfiles(profiles.filter((p) => p.id !== profileToDelete.id));
      setDeleteDialogOpen(false);
      setProfileToDelete(null);

      // Refresh server data
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete profile');
    } finally {
      setIsDeleting(false);
    }
  }

  function openDeleteDialog(profile: Profile) {
    setProfileToDelete(profile);
    setDeleteDialogOpen(true);
    setError(null);
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {profiles.map((profile, index) => {
          const initial = profile.name.charAt(0).toUpperCase();
          const avatarColor = getAvatarColor(profile);

          return (
            <div
              key={profile.id}
              className="flex flex-col p-6 rounded-xl border border-primary/10 bg-card shadow-cinema hover:shadow-cinema-lg hover:border-primary/20 transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Profile info */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={cn(
                    'flex items-center justify-center',
                    'w-16 h-16 rounded-2xl',
                    'text-2xl font-serif font-semibold text-primary-foreground',
                    'shadow-cinema',
                    avatarColor
                  )}
                >
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-lg text-foreground truncate">{profile.name}</p>
                  <Badge
                    variant={getMaturityVariant(profile.maturity_level)}
                    size="sm"
                    className="mt-1"
                  >
                    {getMaturityLabel(profile.maturity_level)}
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-auto pt-4 border-t border-primary/5">
                <Link href={`/app/profiles/${profile.id}/edit`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30"
                  onClick={() => openDeleteDialog(profile)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif">Delete Profile</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the profile &quot;{profileToDelete?.name}&quot;?
              This action cannot be undone and will remove all associated watch history and settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
