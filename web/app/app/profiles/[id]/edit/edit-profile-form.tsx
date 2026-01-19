'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileForm } from '@/components/profile-form';
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
import { updateProfile, deleteProfile } from '@/lib/services/profile';
import type { Profile, MaturityLevel } from '@/lib/database.types';

interface EditProfileFormProps {
  profile: Profile;
}

export function EditProfileForm({ profile }: EditProfileFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(data: {
    name: string;
    avatar: string;
    maturity_level: MaturityLevel;
  }) {
    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const result = await updateProfile(supabase, profile.id, data);

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Redirect to profile list
      router.push('/app/profiles');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);

    try {
      const supabase = createClient();
      const result = await deleteProfile(supabase, profile.id);

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Redirect to profile list
      router.push('/app/profiles');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete profile');
      setDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  }

  function handleCancel() {
    router.push('/app/profiles');
  }

  return (
    <div className="space-y-6">
      <ProfileForm
        profile={profile}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />

      {/* Delete section */}
      <div className="pt-6 border-t border-border">
        <h3 className="text-lg font-medium text-destructive mb-2">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Deleting this profile will remove all associated watch history and settings.
          This action cannot be undone.
        </p>
        {error && (
          <p className="text-sm text-destructive mb-4">{error}</p>
        )}
        <Button
          variant="outline"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => setDeleteDialogOpen(true)}
          disabled={isSubmitting || isDeleting}
        >
          Delete Profile
        </Button>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Profile</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the profile &quot;{profile.name}&quot;?
              This action cannot be undone and will remove all associated watch history and settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
