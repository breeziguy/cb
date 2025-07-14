export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      campaign_assignments: {
        Row: {
          campaign_id: string | null
          created_at: string
          creator_id: string | null
          end_date: string | null
          id: string
          notes: string | null
          role: string
          start_date: string | null
          status: string | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          creator_id?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          role: string
          start_date?: string | null
          status?: string | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          creator_id?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          role?: string
          start_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_assignments_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_assignments_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators_old"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_comments: {
        Row: {
          campaign_id: string | null
          content: string
          created_at: string | null
          id: string
          parent_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          campaign_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          campaign_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_comments_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "campaign_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          budget: number | null
          client_id: string | null
          created_at: string
          deliverables: Json | null
          description: string | null
          end_date: string | null
          id: string
          requirements: string[] | null
          start_date: string | null
          status: Database["public"]["Enums"]["campaign_status"] | null
          title: string
          updated_at: string
        }
        Insert: {
          budget?: number | null
          client_id?: string | null
          created_at?: string
          deliverables?: Json | null
          description?: string | null
          end_date?: string | null
          id?: string
          requirements?: string[] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          title: string
          updated_at?: string
        }
        Update: {
          budget?: number | null
          client_id?: string | null
          created_at?: string
          deliverables?: Json | null
          description?: string | null
          end_date?: string | null
          id?: string
          requirements?: string[] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      creators: {
        Row: {
          avatar_url: string | null
          bio: string | null
          category: string
          cover_image_url: string | null
          created_at: string | null
          email: string | null
          engagement_rate: number | null
          followers_count: number | null
          id: string
          industry: string | null
          instagram_profile: string | null
          location: string | null
          name: string
          platforms: Json | null
          portfolio_images: Json | null
          price_range: string | null
          status: Database["public"]["Enums"]["creator_status"] | null
          tiktok_profile: string | null
          updated_at: string | null
          username: string
          video_portfolio: Json | null
          whatsapp_number: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          category: string
          cover_image_url?: string | null
          created_at?: string | null
          email?: string | null
          engagement_rate?: number | null
          followers_count?: number | null
          id?: string
          industry?: string | null
          instagram_profile?: string | null
          location?: string | null
          name: string
          platforms?: Json | null
          portfolio_images?: Json | null
          price_range?: string | null
          status?: Database["public"]["Enums"]["creator_status"] | null
          tiktok_profile?: string | null
          updated_at?: string | null
          username: string
          video_portfolio?: Json | null
          whatsapp_number: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          category?: string
          cover_image_url?: string | null
          created_at?: string | null
          email?: string | null
          engagement_rate?: number | null
          followers_count?: number | null
          id?: string
          industry?: string | null
          instagram_profile?: string | null
          location?: string | null
          name?: string
          platforms?: Json | null
          portfolio_images?: Json | null
          price_range?: string | null
          status?: Database["public"]["Enums"]["creator_status"] | null
          tiktok_profile?: string | null
          updated_at?: string | null
          username?: string
          video_portfolio?: Json | null
          whatsapp_number?: string
        }
        Relationships: []
      }
      creators_old: {
        Row: {
          availability:
            | Database["public"]["Enums"]["creator_availability"]
            | null
          bio: string | null
          created_at: string
          hourly_rate: number | null
          id: string
          location: string | null
          name: string
          portfolio_images: string[] | null
          profile_image: string | null
          social_links: Json | null
          specialties: Database["public"]["Enums"]["creator_specialty"][]
          updated_at: string
        }
        Insert: {
          availability?:
            | Database["public"]["Enums"]["creator_availability"]
            | null
          bio?: string | null
          created_at?: string
          hourly_rate?: number | null
          id?: string
          location?: string | null
          name: string
          portfolio_images?: string[] | null
          profile_image?: string | null
          social_links?: Json | null
          specialties: Database["public"]["Enums"]["creator_specialty"][]
          updated_at?: string
        }
        Update: {
          availability?:
            | Database["public"]["Enums"]["creator_availability"]
            | null
          bio?: string | null
          created_at?: string
          hourly_rate?: number | null
          id?: string
          location?: string | null
          name?: string
          portfolio_images?: string[] | null
          profile_image?: string | null
          social_links?: Json | null
          specialties?: Database["public"]["Enums"]["creator_specialty"][]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          monthly_collabs_used: number | null
          role: Database["public"]["Enums"]["user_role"] | null
          subscription_expires_at: string | null
          subscription_plan:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          total_collabs: number | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          monthly_collabs_used?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          subscription_expires_at?: string | null
          subscription_plan?:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          total_collabs?: number | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          monthly_collabs_used?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          subscription_expires_at?: string | null
          subscription_plan?:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          total_collabs?: number | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      saved_creators: {
        Row: {
          created_at: string
          creator_id: string
          id: string
          notes: string | null
          tags: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          id?: string
          notes?: string | null
          tags?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          id?: string
          notes?: string | null
          tags?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_creators_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators_old"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          current_period_end: string
          current_period_start: string
          id: string
          paystack_subscription_id: string | null
          plan: Database["public"]["Enums"]["subscription_plan"]
          status: Database["public"]["Enums"]["subscription_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          current_period_end: string
          current_period_start: string
          id?: string
          paystack_subscription_id?: string | null
          plan: Database["public"]["Enums"]["subscription_plan"]
          status?: Database["public"]["Enums"]["subscription_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          current_period_end?: string
          current_period_start?: string
          id?: string
          paystack_subscription_id?: string | null
          plan?: Database["public"]["Enums"]["subscription_plan"]
          status?: Database["public"]["Enums"]["subscription_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_creator_interactions: {
        Row: {
          created_at: string | null
          creator_id: string | null
          id: string
          interaction_type: Database["public"]["Enums"]["interaction_type"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id?: string | null
          id?: string
          interaction_type: Database["public"]["Enums"]["interaction_type"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string | null
          id?: string
          interaction_type?: Database["public"]["Enums"]["interaction_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_creator_interactions_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_creator_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_collab_usage: {
        Args: { user_uuid: string }
        Returns: undefined
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      reset_monthly_collabs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      campaign_status:
        | "draft"
        | "pending"
        | "active"
        | "completed"
        | "cancelled"
      creator_availability: "available" | "booked" | "unavailable" | "on_leave"
      creator_specialty:
        | "photography"
        | "videography"
        | "social_media"
        | "lifestyle"
        | "fashion"
        | "food"
        | "tech"
        | "beauty"
      creator_status: "active" | "inactive"
      interaction_type: "view" | "contact" | "collab"
      saved_creator_sort_order:
        | "name_asc"
        | "name_desc"
        | "date_saved_asc"
        | "date_saved_desc"
      subscription_plan: "free" | "basic" | "premium"
      subscription_status: "active" | "inactive" | "cancelled"
      user_role: "user" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never 