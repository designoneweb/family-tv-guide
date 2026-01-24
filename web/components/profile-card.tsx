'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Profile, MaturityLevel } from '@/lib/database.types';

interface ProfileCardProps {
  profile: Profile;
  onSelect: (profile: Profile) => void;
  isActive?: boolean;
}

/**
 * Get the color for a profile avatar based on the first character of the name.
 * Cinema Lounge palette with rich, warm colors.
 */
function getAvatarColor(name: string): string {
  const colors = [
    'bg-primary', // Cinema Gold
    'bg-secondary', // Velvet Crimson
    'bg-tertiary', // Screen Teal
    'bg-genre-drama',
    'bg-genre-action',
    'bg-genre-scifi',
    'bg-genre-documentary',
    'bg-genre-animation',
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
 * Profile card component for the profile picker grid.
 * Cinema Lounge styling with 120px avatar, hover glow, and maturity badges.
 */
export function ProfileCard({ profile, onSelect, isActive = false }: ProfileCardProps) {
  const initial = profile.name.charAt(0).toUpperCase();
  const avatarColor = getAvatarColor(profile.name);

  return (
    <button
      type="button"
      onClick={() => onSelect(profile)}
      className={cn(
        'group flex flex-col items-center gap-4 p-8 rounded-[20px]',
        'transition-all duration-300 ease-out',
        'hover:bg-interactive focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        isActive && 'bg-interactive ring-2 ring-primary'
      )}
    >
      {/* Avatar - 120px with hover glow */}
      <div
        className={cn(
          'relative flex items-center justify-center',
          'w-[120px] h-[120px] rounded-full',
          'text-4xl font-serif font-semibold text-primary-foreground',
          'transition-all duration-300',
          'group-hover:scale-105 group-hover:shadow-gold-glow',
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
      <span className="font-serif text-xl font-semibold text-foreground">
        {profile.name}
      </span>

      {/* Maturity badge */}
      <Badge variant={getMaturityVariant(profile.maturity_level)} size="sm">
        {getMaturityLabel(profile.maturity_level)}
      </Badge>
    </button>
  );
}
