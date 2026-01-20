/**
 * Database types for Family TV Guide
 * Manually created to match Supabase schema (no live DB for codegen)
 */

// ============================================================================
// ENUM TYPES
// ============================================================================

export type MaturityLevel = 'kids' | 'teen' | 'adult';
export type MediaType = 'tv' | 'movie';
export type BlurbSource = 'tmdb_truncate' | 'ai';

// ============================================================================
// DATABASE INTERFACE
// ============================================================================

export interface Database {
  public: {
    Tables: {
      households: {
        Row: {
          id: string;
          name: string;
          owner_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          owner_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          owner_id?: string;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          household_id: string;
          name: string;
          avatar: string | null;
          maturity_level: MaturityLevel;
          pin_hash: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          name: string;
          avatar?: string | null;
          maturity_level?: MaturityLevel;
          pin_hash?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          name?: string;
          avatar?: string | null;
          maturity_level?: MaturityLevel;
          pin_hash?: string | null;
          created_at?: string;
        };
      };
      tracked_titles: {
        Row: {
          id: string;
          household_id: string;
          tmdb_id: number;
          media_type: MediaType;
          added_at: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          tmdb_id: number;
          media_type: MediaType;
          added_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          tmdb_id?: number;
          media_type?: MediaType;
          added_at?: string;
        };
      };
      schedule_entries: {
        Row: {
          id: string;
          household_id: string;
          profile_id: string;
          tracked_title_id: string;
          weekday: number;
          slot_order: number;
          enabled: boolean;
        };
        Insert: {
          id?: string;
          household_id: string;
          profile_id: string;
          tracked_title_id: string;
          weekday: number;
          slot_order: number;
          enabled?: boolean;
        };
        Update: {
          id?: string;
          household_id?: string;
          profile_id?: string;
          tracked_title_id?: string;
          weekday?: number;
          slot_order?: number;
          enabled?: boolean;
        };
      };
      tv_progress: {
        Row: {
          id: string;
          profile_id: string;
          tracked_title_id: string;
          season_number: number;
          episode_number: number;
          completed: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          tracked_title_id: string;
          season_number?: number;
          episode_number?: number;
          completed?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          tracked_title_id?: string;
          season_number?: number;
          episode_number?: number;
          completed?: boolean;
          updated_at?: string;
        };
      };
      episode_blurbs: {
        Row: {
          id: string;
          series_tmdb_id: number;
          season_number: number;
          episode_number: number;
          blurb_text: string;
          source: BlurbSource;
          updated_at: string;
        };
        Insert: {
          id?: string;
          series_tmdb_id: number;
          season_number: number;
          episode_number: number;
          blurb_text: string;
          source: BlurbSource;
          updated_at?: string;
        };
        Update: {
          id?: string;
          series_tmdb_id?: number;
          season_number?: number;
          episode_number?: number;
          blurb_text?: string;
          source?: BlurbSource;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

// ============================================================================
// TYPE ALIASES (for convenience)
// ============================================================================

export type Household = Database['public']['Tables']['households']['Row'];
export type HouseholdInsert = Database['public']['Tables']['households']['Insert'];
export type HouseholdUpdate = Database['public']['Tables']['households']['Update'];

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type TrackedTitle = Database['public']['Tables']['tracked_titles']['Row'];
export type TrackedTitleInsert = Database['public']['Tables']['tracked_titles']['Insert'];
export type TrackedTitleUpdate = Database['public']['Tables']['tracked_titles']['Update'];

export type ScheduleEntry = Database['public']['Tables']['schedule_entries']['Row'];
export type ScheduleEntryInsert = Database['public']['Tables']['schedule_entries']['Insert'];
export type ScheduleEntryUpdate = Database['public']['Tables']['schedule_entries']['Update'];

export type TvProgress = Database['public']['Tables']['tv_progress']['Row'];
export type TvProgressInsert = Database['public']['Tables']['tv_progress']['Insert'];
export type TvProgressUpdate = Database['public']['Tables']['tv_progress']['Update'];

export type EpisodeBlurb = Database['public']['Tables']['episode_blurbs']['Row'];
export type EpisodeBlurbInsert = Database['public']['Tables']['episode_blurbs']['Insert'];
export type EpisodeBlurbUpdate = Database['public']['Tables']['episode_blurbs']['Update'];
