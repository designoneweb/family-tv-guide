'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
 * Get badge color based on maturity level
 */
function getMaturityBadgeClass(level: MaturityLevel): string {
  const classes: Record<MaturityLevel, string> = {
    kids: 'bg-green-600/20 text-green-400 border-green-600/30',
    teen: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
    adult: 'bg-red-600/20 text-red-400 border-red-600/30',
  };
  return classes[level];
}

/**
 * Get the avatar color class from stored value or derive from name
 */
function getAvatarColor(profile: Profile): string {
  const colors = [
    'bg-blue-600',
    'bg-green-600',
    'bg-purple-600',
    'bg-pink-600',
    'bg-orange-600',
    'bg-teal-600',
    'bg-indigo-600',
    'bg-red-600',
  ];

  // If avatar is a valid color class, use it
  if (profile.avatar && colors.includes(profile.avatar)) {
    return profile.avatar;
  }

  // Otherwise derive from name
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((profile) => {
          const initial = profile.name.charAt(0).toUpperCase();
          const avatarColor = getAvatarColor(profile);

          return (
            <div
              key={profile.id}
              className="flex flex-col p-6 rounded-xl border border-border bg-card"
            >
              {/* Profile info */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={cn(
                    'flex items-center justify-center',
                    'w-16 h-16 rounded-full',
                    'text-2xl font-semibold text-white',
                    avatarColor
                  )}
                >
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-lg truncate">{profile.name}</p>
                  <span
                    className={cn(
                      'inline-block mt-1 px-2 py-0.5 text-xs rounded border',
                      getMaturityBadgeClass(profile.maturity_level)
                    )}
                  >
                    {getMaturityLabel(profile.maturity_level)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-auto pt-4 border-t border-border">
                <Link href={`/app/profiles/${profile.id}/edit`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => openDeleteDialog(profile)}
                >
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
            <AlertDialogTitle>Delete Profile</AlertDialogTitle>
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
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
