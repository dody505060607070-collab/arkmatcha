export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          address: string
          building: string | null
          city: string
          created_at: string
          email: string | null
          full_name: string
          id: string
          items: Json
          notes: string | null
          order_number: number
          phone: string
          shipping_fee: number
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          whatsapp: string | null
        }
        Insert: {
          address: string
          building?: string | null
          city: string
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          items?: Json
          notes?: string | null
          order_number?: number
          phone: string
          shipping_fee?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          whatsapp?: string | null
        }
        Update: {
          address?: string
          building?: string | null
          city?: string
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          items?: Json
          notes?: string | null
          order_number?: number
          phone?: string
          shipping_fee?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          whatsapp?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string
          description: string
          gallery: Json
          id: string
          image_url: string
          in_stock: boolean
          ingredients: string
          key_benefits: Json
          name: string
          nutrition: Json
          price: number | null
          short_description: string
          size: string
          slug: string
          sort_order: number
          storage: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          gallery?: Json
          id?: string
          image_url?: string
          in_stock?: boolean
          ingredients?: string
          key_benefits?: Json
          name: string
          nutrition?: Json
          price?: number | null
          short_description?: string
          size: string
          slug: string
          sort_order?: number
          storage?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          gallery?: Json
          id?: string
          image_url?: string
          in_stock?: boolean
          ingredients?: string
          key_benefits?: Json
          name?: string
          nutrition?: Json
          price?: number | null
          short_description?: string
          size?: string
          slug?: string
          sort_order?: number
          storage?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          brand_story: string
          coming_soon_text: string
          contact_email: string
          footer_text: string
          hero_headline: string
          hero_image: string
          hero_subheadline: string
          id: number
          instagram_url: string
          phone: string
          shipping_fee: number
          tiktok_url: string
          updated_at: string
        }
        Insert: {
          brand_story?: string
          coming_soon_text?: string
          contact_email?: string
          footer_text?: string
          hero_headline?: string
          hero_image?: string
          hero_subheadline?: string
          id?: number
          instagram_url?: string
          phone?: string
          shipping_fee?: number
          tiktok_url?: string
          updated_at?: string
        }
        Update: {
          brand_story?: string
          coming_soon_text?: string
          contact_email?: string
          footer_text?: string
          hero_headline?: string
          hero_image?: string
          hero_subheadline?: string
          id?: number
          instagram_url?: string
          phone?: string
          shipping_fee?: number
          tiktok_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
      order_status:
        | "new"
        | "confirmed"
        | "out_for_delivery"
        | "delivered"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
      order_status: [
        "new",
        "confirmed",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
    },
  },
} as const
