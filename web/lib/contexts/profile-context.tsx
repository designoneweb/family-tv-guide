'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/database.types';

const PROFILE_STORAGE_KEY = 'family-tv-guide-active-profile';

interface ProfileContextValue {
  activeProfileId: string | null;
  activeProfile: Profile | null;
  setActiveProfile: (profileId: string) => void;
  clearActiveProfile: () => void;
  isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

interface ProfileProviderProps {
  children: ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, read profileId from localStorage and verify it exists
  useEffect(() => {
    const loadProfile = async () => {
      const storedProfileId = localStorage.getItem(PROFILE_STORAGE_KEY);

      if (!storedProfileId) {
        setIsLoading(false);
        return;
      }

      // Verify the profile still exists in Supabase
      const supabase = createClient();
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', storedProfileId)
        .single();

      if (error || !profile) {
        // Profile doesn't exist anymore, clear localStorage
        localStorage.removeItem(PROFILE_STORAGE_KEY);
        setIsLoading(false);
        return;
      }

      setActiveProfileId(storedProfileId);
      setActiveProfile(profile);
      setIsLoading(false);
    };

    loadProfile();
  }, []);

  const setActiveProfileHandler = useCallback((profileId: string) => {
    // Save to localStorage
    localStorage.setItem(PROFILE_STORAGE_KEY, profileId);
    setActiveProfileId(profileId);

    // Fetch the profile data
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();

      if (profile) {
        setActiveProfile(profile);
      }
    };

    fetchProfile();
  }, []);

  const clearActiveProfile = useCallback(() => {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    setActiveProfileId(null);
    setActiveProfile(null);
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        activeProfileId,
        activeProfile,
        setActiveProfile: setActiveProfileHandler,
        clearActiveProfile,
        isLoading,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

/**
 * Hook to access the active profile context.
 * Must be used within a ProfileProvider.
 * @throws Error if used outside of ProfileProvider
 */
export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }

  return context;
}
