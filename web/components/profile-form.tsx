'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Profile, MaturityLevel } from '@/lib/database.types';

// Avatar color options for the picker
const AVATAR_COLORS = [
  { name: 'Blue', value: 'bg-blue-600', color: '#2563eb' },
  { name: 'Green', value: 'bg-green-600', color: '#16a34a' },
  { name: 'Purple', value: 'bg-purple-600', color: '#9333ea' },
  { name: 'Pink', value: 'bg-pink-600', color: '#db2777' },
  { name: 'Orange', value: 'bg-orange-600', color: '#ea580c' },
  { name: 'Teal', value: 'bg-teal-600', color: '#0d9488' },
  { name: 'Indigo', value: 'bg-indigo-600', color: '#4f46e5' },
  { name: 'Red', value: 'bg-red-600', color: '#dc2626' },
];

interface ProfileFormProps {
  profile?: Profile;
  onSubmit: (data: { name: string; avatar: string; maturity_level: MaturityLevel }) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

/**
 * Profile form component for creating and editing profiles.
 * Includes name input, avatar color picker, and maturity level select.
 */
export function ProfileForm({ profile, onSubmit, onCancel, isSubmitting = false }: ProfileFormProps) {
  const [name, setName] = useState(profile?.name ?? '');
  const [avatar, setAvatar] = useState(profile?.avatar ?? AVATAR_COLORS[0].value);
  const [maturityLevel, setMaturityLevel] = useState<MaturityLevel>(profile?.maturity_level ?? 'adult');
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!profile;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validate name
    if (!name.trim()) {
      setError('Profile name is required');
      return;
    }

    if (name.trim().length > 50) {
      setError('Profile name must be 50 characters or less');
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        avatar,
        maturity_level: maturityLevel,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name input */}
      <div className="space-y-2">
        <Label htmlFor="name">Profile Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter profile name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          disabled={isSubmitting}
          autoFocus
        />
      </div>

      {/* Maturity level select */}
      <div className="space-y-2">
        <Label htmlFor="maturity_level">Maturity Level</Label>
        <Select
          value={maturityLevel}
          onValueChange={(value: MaturityLevel) => setMaturityLevel(value)}
          disabled={isSubmitting}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select maturity level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kids">Kids - Family-friendly content only</SelectItem>
            <SelectItem value="teen">Teen - Includes PG-13 content</SelectItem>
            <SelectItem value="adult">Adult - All content</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          This controls what content recommendations this profile can see
        </p>
      </div>

      {/* Avatar color picker */}
      <div className="space-y-2">
        <Label>Avatar Color</Label>
        <div className="flex flex-wrap gap-3">
          {AVATAR_COLORS.map((colorOption) => (
            <button
              key={colorOption.value}
              type="button"
              onClick={() => setAvatar(colorOption.value)}
              disabled={isSubmitting}
              className={cn(
                'w-12 h-12 rounded-full transition-all duration-200',
                'ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                'hover:scale-110',
                avatar === colorOption.value && 'ring-2 ring-primary ring-offset-2 scale-110'
              )}
              style={{ backgroundColor: colorOption.color }}
              title={colorOption.name}
              aria-label={`Select ${colorOption.name} color`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Choose a color for this profile&apos;s avatar
        </p>
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <Label>Preview</Label>
        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
          <div
            className={cn(
              'flex items-center justify-center',
              'w-16 h-16 rounded-full',
              'text-2xl font-semibold text-white',
              avatar
            )}
          >
            {name.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-medium">{name || 'Profile Name'}</p>
            <p className="text-sm text-muted-foreground capitalize">{maturityLevel}</p>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Form actions */}
      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Profile'}
        </Button>
      </div>
    </form>
  );
}
