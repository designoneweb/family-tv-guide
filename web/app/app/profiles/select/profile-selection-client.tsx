'use client';

import { useRouter } from 'next/navigation';
import { useProfile } from '@/lib/contexts/profile-context';
import { ProfileCard } from '@/components/profile-card';
import type { Profile } from '@/lib/database.types';

interface ProfileSelectionClientProps {
  profiles: Profile[];
}

export function ProfileSelectionClient({ profiles }: ProfileSelectionClientProps) {
  const router = useRouter();
  const { activeProfileId, setActiveProfile } = useProfile();

  const handleSelectProfile = (profile: Profile) => {
    setActiveProfile(profile.id);
    // Navigate to the guide (or app home if guide doesn't exist yet)
    router.push('/app');
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          onSelect={handleSelectProfile}
          isActive={profile.id === activeProfileId}
        />
      ))}
    </div>
  );
}
