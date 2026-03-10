export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          email: string;
          role: "owner" | "admin" | "user";
          banned: boolean;
          ban_reason: string | null;
          avatar_url: string | null;
          username: string | null;
          is_collection_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          email: string;
          role?: "owner" | "admin" | "user";
          banned?: boolean;
          ban_reason?: string | null;
          avatar_url?: string | null;
          username?: string | null;
          is_collection_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          email?: string;
          role?: "owner" | "admin" | "user";
          banned?: boolean;
          ban_reason?: string | null;
          avatar_url?: string | null;
          username?: string | null;
          is_collection_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          theme: string | null;
          language: string | null;
          timezone: string | null;
          email_notifications: boolean;
          preferences: Record<string, unknown> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          theme?: string | null;
          language?: string | null;
          timezone?: string | null;
          email_notifications?: boolean;
          preferences?: Record<string, unknown> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          theme?: string | null;
          language?: string | null;
          timezone?: string | null;
          email_notifications?: boolean;
          preferences?: Record<string, unknown> | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      invitations: {
        Row: {
          id: string;
          email: string;
          invited_by: string;
          used_by: string | null;
          status: "pending" | "used" | "expired";
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          invited_by: string;
          used_by?: string | null;
          status?: "pending" | "used" | "expired";
          expires_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          invited_by?: string;
          used_by?: string | null;
          status?: "pending" | "used" | "expired";
          expires_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      system_settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          description: string | null;
          updated_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: string;
          description?: string | null;
          updated_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: string;
          description?: string | null;
          updated_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      pending_deletions: {
        Row: {
          id: string;
          user_id: string;
          confirmation_code: string;
          email: string;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          confirmation_code: string;
          email: string;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          confirmation_code?: string;
          email?: string;
          expires_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      cards: {
        Row: {
          id: string;
          user_id: string;
          external_id: string | null;
          name: string;
          supertype: string | null;
          subtypes: string[] | null;
          hp: string | null;
          types: string[] | null;
          rarity: string | null;
          set_name: string | null;
          set_id: string | null;
          number: string | null;
          image_url: string | null;
          artist: string | null;
          condition:
            | "Near Mint"
            | "Lightly Played"
            | "Moderately Played"
            | "Heavily Played"
            | "Damaged";
          quantity: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          external_id?: string | null;
          name: string;
          supertype?: string | null;
          subtypes?: string[] | null;
          hp?: string | null;
          types?: string[] | null;
          rarity?: string | null;
          set_name?: string | null;
          set_id?: string | null;
          number?: string | null;
          image_url?: string | null;
          artist?: string | null;
          condition?:
            | "Near Mint"
            | "Lightly Played"
            | "Moderately Played"
            | "Heavily Played"
            | "Damaged";
          quantity?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          external_id?: string | null;
          name?: string;
          supertype?: string | null;
          subtypes?: string[] | null;
          hp?: string | null;
          types?: string[] | null;
          rarity?: string | null;
          set_name?: string | null;
          set_id?: string | null;
          number?: string | null;
          image_url?: string | null;
          artist?: string | null;
          condition?:
            | "Near Mint"
            | "Lightly Played"
            | "Moderately Played"
            | "Heavily Played"
            | "Damaged";
          quantity?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      card_condition:
        | "Near Mint"
        | "Lightly Played"
        | "Moderately Played"
        | "Heavily Played"
        | "Damaged";
      user_role: "owner" | "admin" | "user";
    };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Card = Database["public"]["Tables"]["cards"]["Row"];
export type CardInsert = Database["public"]["Tables"]["cards"]["Insert"];
export type CardUpdate = Database["public"]["Tables"]["cards"]["Update"];
export type CardCondition = Card["condition"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
