'use client';

import { cn } from '@/lib/utils';
import type { Profile, MaturityLevel } from '@/lib/database.types';

interface ProfileCardProps {
  profile: Profile;
  onSelect: (profile: Profile) => void;
  isActive?: boolean;
}

/**
 * Get the color for a profile avatar based on the first character of the name.
 * Creates a deterministic color from the profile name.
 */
function getAvatarColor(name: string): string {
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
  const charCode = name.charCodeAt(0) || 0;
  return colors[charCode % colors.length];
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
 * Profile card component for the profile picker grid.
 * Displays avatar (colored circle with initial), name, and optional maturity badge.
 */
export function ProfileCard({ profile, onSelect, isActive = false }: ProfileCardProps) {
  const initial = profile.name.charAt(0).toUpperCase();
  const avatarColor = getAvatarColor(profile.name);

  return (
    <button
      type="button"
      onClick={() => onSelect(profile)}
      className={cn(
        'group flex flex-col items-center gap-3 p-6 rounded-xl',
        'transition-all duration-200 ease-in-out',
        'hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        isActive && 'bg-muted ring-2 ring-primary'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'relative flex items-center justify-center',
          'w-24 h-24 rounded-full',
          'text-3xl font-semibold text-white',
          'transition-transform duration-200',
          'group-hover:scale-105',
          avatarColor
        )}
      >
        {profile.avatar ? (
          // If avatar URL exists, show image (future enhancement)
          <span>{initial}</span>
        ) : (
          <span>{initial}</span>
        )}
      </div>

      {/* Name */}
      <span className="text-lg font-medium text-foreground">
        {profile.name}
      </span>

      {/* Maturity badge (subtle) */}
      <span className="text-xs text-muted-foreground">
        {getMaturityLabel(profile.maturity_level)}
      </span>
    </button>
  );
}
