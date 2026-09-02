export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_path: string | null;
  created_at: string;
  updated_at: string;
  contribution_count: number;
  confirmation_count: number;
  reputation_score: number;
  is_verified_contributor: boolean;
};

export type Report = {
  id: string;
  user_id: string;
  category: string;
  subcategory: string;
  title: string | null;
  description: string | null;
  latitude: number;
  longitude: number;
  display_latitude: number;
  display_longitude: number;
  location_accuracy: number | null;
  observed_at: string;
  created_at: string;
  updated_at: string;
  status: string;
  severity: string | null;
  species_name: string | null;
  species_confidence: number | null;
  quantity_estimate: string | null;
  alive_status: string | null;
  verification_score: number;
  confirmation_count: number;
  sensitive_location: boolean;
  moderation_status: string;
  source: string;
  event_id: string | null;
  metadata: Json;
};

export type ReportPublic = Omit<Report, 'latitude' | 'longitude' | 'user_id'> & {
  primary_image_path: string | null;
  reporter_display_name: string | null;
};

export type ReportMedia = {
  id: string;
  report_id: string;
  storage_path: string;
  media_type: string;
  width: number | null;
  height: number | null;
  created_at: string;
  sort_order: number;
  metadata: Json;
};

export type ReportConfirmation = {
  id: string;
  report_id: string;
  user_id: string;
  confirmation_type: string;
  created_at: string;
  notes: string | null;
};

export type SavedReport = {
  id: string;
  user_id: string;
  report_id: string;
  created_at: string;
};

export type ReportDraft = {
  id: string;
  localPhotoUri: string | null;
  latitude: number | null;
  longitude: number | null;
  locationAccuracy: number | null;
  observedAt: string | null;
  subcategory: string | null;
  title: string | null;
  description: string | null;
  severity: string | null;
  speciesName: string | null;
  quantityEstimate: string | null;
  aliveStatus: string | null;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'pending_upload' | 'failed';
  errorMessage: string | null;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      reports: {
        Row: Report;
        Insert: Partial<Report> & {
          user_id: string;
          category: string;
          subcategory: string;
          latitude: number;
          longitude: number;
          display_latitude: number;
          display_longitude: number;
          observed_at: string;
        };
        Update: Partial<Report>;
        Relationships: [];
      };
      report_media: {
        Row: ReportMedia;
        Insert: Partial<ReportMedia> & { report_id: string; storage_path: string };
        Update: Partial<ReportMedia>;
        Relationships: [];
      };
      report_confirmations: {
        Row: ReportConfirmation;
        Insert: Partial<ReportConfirmation> & {
          report_id: string;
          user_id: string;
          confirmation_type: string;
        };
        Update: Partial<ReportConfirmation>;
        Relationships: [];
      };
      saved_reports: {
        Row: SavedReport;
        Insert: Partial<SavedReport> & { user_id: string; report_id: string };
        Update: Partial<SavedReport>;
        Relationships: [];
      };
    };
    Views: {
      reports_public: {
        Row: ReportPublic;
        Relationships: [];
      };
    };
    Functions: {
      reports_in_viewport: {
        Args: {
          min_lat: number;
          min_lng: number;
          max_lat: number;
          max_lng: number;
          filter_group?: string | null;
          verified_only?: boolean;
          since?: string | null;
        };
        Returns: ReportPublic[];
      };
      nearby_reports: {
        Args: {
          lat: number;
          lng: number;
          radius_km?: number;
          limit_count?: number;
        };
        Returns: ReportPublic[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
