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
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      discount_codes: {
        Row: {
          active: boolean
          code: string
          created_at: string
          expires_at: string | null
          id: string
          percent_off: number
          updated_at: string
          usage_limit: number | null
          used_count: number
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          expires_at?: string | null
          id?: string
          percent_off?: number
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          percent_off?: number
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
        }
        Relationships: []
      }
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
          discount_amount: number
          discount_code: string | null
          email: string | null
          full_name: string
          governorate: string | null
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
          discount_amount?: number
          discount_code?: string | null
          email?: string | null
          full_name: string
          governorate?: string | null
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
          discount_amount?: number
          discount_code?: string | null
          email?: string | null
          full_name?: string
          governorate?: string | null
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
          discount_percentage: number
          extra_info_body: string | null
          extra_info_title: string | null
          gallery: Json
          id: string
          image_url: string
          image_visible: boolean
          in_stock: boolean
          ingredients: string
          key_benefits: Json
          name: string
          nutrition: Json
          price: number | null
          price_visible: boolean
          quantity: number | null
          short_description: string
          size: string
          slug: string
          sort_order: number
          storage: string
          track_inventory: boolean | null
          updated_at: string
          variants: Json | null
        }
        Insert: {
          created_at?: string
          description?: string
          discount_percentage?: number
          extra_info_body?: string | null
          extra_info_title?: string | null
          gallery?: Json
          id?: string
          image_url?: string
          image_visible?: boolean
          in_stock?: boolean
          ingredients?: string
          key_benefits?: Json
          name: string
          nutrition?: Json
          price?: number | null
          price_visible?: boolean
          quantity?: number | null
          short_description?: string
          size: string
          slug: string
          sort_order?: number
          storage?: string
          track_inventory?: boolean | null
          updated_at?: string
          variants?: Json | null
        }
        Update: {
          created_at?: string
          description?: string
          discount_percentage?: number
          extra_info_body?: string | null
          extra_info_title?: string | null
          gallery?: Json
          id?: string
          image_url?: string
          image_visible?: boolean
          in_stock?: boolean
          ingredients?: string
          key_benefits?: Json
          name?: string
          nutrition?: Json
          price?: number | null
          price_visible?: boolean
          quantity?: number | null
          short_description?: string
          size?: string
          slug?: string
          sort_order?: number
          storage?: string
          track_inventory?: boolean | null
          updated_at?: string
          variants?: Json | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_name: string
          created_at: string
          featured: boolean
          id: string
          location: string | null
          product_slug: string | null
          quote: string
          rating: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          author_name: string
          created_at?: string
          featured?: boolean
          id?: string
          location?: string | null
          product_slug?: string | null
          quote: string
          rating?: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          author_name?: string
          created_at?: string
          featured?: boolean
          id?: string
          location?: string | null
          product_slug?: string | null
          quote?: string
          rating?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          announcement_text: string | null
          announcement_visible: boolean | null
          brand_story: string
          coming_soon_text: string
          contact_email: string
          content: Json
          editorial_image: string | null
          editorial_quote: string | null
          featured_label: string | null
          footer_text: string
          hero_cta_link: string | null
          hero_cta_text: string | null
          hero_headline: string
          hero_image: string
          hero_label: string | null
          hero_subheadline: string
          hero_tagline: string | null
          id: number
          instagram_grid: string[] | null
          instagram_url: string
          logo_url: string | null
          phone: string
          seo_description: string | null
          seo_title: string | null
          shipping_fee: number
          shipping_rates: Json
          story_steps: Json | null
          theme: Json
          tiktok_url: string
          trust_pills: string[] | null
          typography: Json
          updated_at: string
          wishlist_enabled: boolean
        }
        Insert: {
          announcement_text?: string | null
          announcement_visible?: boolean | null
          brand_story?: string
          coming_soon_text?: string
          contact_email?: string
          content?: Json
          editorial_image?: string | null
          editorial_quote?: string | null
          featured_label?: string | null
          footer_text?: string
          hero_cta_link?: string | null
          hero_cta_text?: string | null
          hero_headline?: string
          hero_image?: string
          hero_label?: string | null
          hero_subheadline?: string
          hero_tagline?: string | null
          id?: number
          instagram_grid?: string[] | null
          instagram_url?: string
          logo_url?: string | null
          phone?: string
          seo_description?: string | null
          seo_title?: string | null
          shipping_fee?: number
          shipping_rates?: Json
          story_steps?: Json | null
          theme?: Json
          tiktok_url?: string
          trust_pills?: string[] | null
          typography?: Json
          updated_at?: string
          wishlist_enabled?: boolean
        }
        Update: {
          announcement_text?: string | null
          announcement_visible?: boolean | null
          brand_story?: string
          coming_soon_text?: string
          contact_email?: string
          content?: Json
          editorial_image?: string | null
          editorial_quote?: string | null
          featured_label?: string | null
          footer_text?: string
          hero_cta_link?: string | null
          hero_cta_text?: string | null
          hero_headline?: string
          hero_image?: string
          hero_label?: string | null
          hero_subheadline?: string
          hero_tagline?: string | null
          id?: number
          instagram_grid?: string[] | null
          instagram_url?: string
          logo_url?: string | null
          phone?: string
          seo_description?: string | null
          seo_title?: string | null
          shipping_fee?: number
          shipping_rates?: Json
          story_steps?: Json | null
          theme?: Json
          tiktok_url?: string
          trust_pills?: string[] | null
          typography?: Json
          updated_at?: string
          wishlist_enabled?: boolean
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
