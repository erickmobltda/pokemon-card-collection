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
      pokemon_cards: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          rarity:
            | "Common"
            | "Uncommon"
            | "Rare"
            | "Holo Rare"
            | "Ultra Rare"
            | "Secret Rare";
          hp: number;
          photo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          rarity:
            | "Common"
            | "Uncommon"
            | "Rare"
            | "Holo Rare"
            | "Ultra Rare"
            | "Secret Rare";
          hp: number;
          photo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          rarity?:
            | "Common"
            | "Uncommon"
            | "Rare"
            | "Holo Rare"
            | "Ultra Rare"
            | "Secret Rare";
          hp?: number;
          photo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      card_rarity:
        | "Common"
        | "Uncommon"
        | "Rare"
        | "Holo Rare"
        | "Ultra Rare"
        | "Secret Rare";
      user_role: "owner" | "admin" | "user";
    };
    CompositeTypes: { [_ in never]: never };
  };
};

export type PokemonCard =
  Database["public"]["Tables"]["pokemon_cards"]["Row"];
export type PokemonCardInsert =
  Database["public"]["Tables"]["pokemon_cards"]["Insert"];
export type PokemonCardUpdate =
  Database["public"]["Tables"]["pokemon_cards"]["Update"];
export type CardRarity = PokemonCard["rarity"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
