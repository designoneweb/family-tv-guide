'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useProfile } from '@/lib/contexts/profile-context';

interface ProfileGuardProps {
  children: React.ReactNode;
}

/**
 * Client component that guards routes requiring an active profile.
 * Redirects to profile selection if no active profile is set.
 * Does not redirect if already on the profile selection page.
 */
export function ProfileGuard({ children }: ProfileGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { activeProfileId, isLoading } = useProfile();

  const isOnProfileSelectPage = pathname === '/app/profiles/select';

  useEffect(() => {
    // Don't redirect while still loading from localStorage
    if (isLoading) return;

    // Don't redirect if already on profile select page
    if (isOnProfileSelectPage) return;

    // Redirect to profile select if no active profile
    if (!activeProfileId) {
      router.replace('/app/profiles/select');
    }
  }, [activeProfileId, isLoading, isOnProfileSelectPage, router]);

  // Show nothing while loading to prevent flash
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // If no profile and not on select page, show nothing (redirect will happen)
  if (!activeProfileId && !isOnProfileSelectPage) {
    return null;
  }

  return <>{children}</>;
}
