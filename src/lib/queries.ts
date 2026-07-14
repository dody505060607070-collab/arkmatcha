import { supabase } from "@/integrations/supabase/client";
import { queryOptions } from "@tanstack/react-query";

export type Product = {
  id: string;
  slug: string;
  name: string;
  size: string;
  short_description: string;
  description: string;
  price: number | null;
  image_url: string;
  gallery: string[];
  key_benefits: string[];
  nutrition: Record<string, string>;
  ingredients: string;
  storage: string;
  in_stock: boolean;
  image_visible: boolean;
  price_visible: boolean;
  discount_percentage: number;
  sort_order: number;
};

export type ThemeColors = {
  background: string;
  matcha: string;
  forest: string;
  olive: string;
  petal: string;
  text: string;
  accent: string;
};

export type TypographySizes = { headlineSize: number; taglineSize: number; labelSize: number };
export type Typography = {
  fontFamily: string;
  headingFamily: string;
  hero: TypographySizes;
  heroMobile: TypographySizes;
  product: { titleSize: number; priceSize: number; labelSize: number };
  footer: { size: number };
  baseSize: number;
};

export type ContentMap = {
  home?: Record<string, string>;
  shop?: { title?: string; subtitle?: string };
  product?: {
    addToCart?: string;
    soldOut?: string;
    ingredientsTitle?: string;
    storageTitle?: string;
    shippingTitle?: string;
    relatedTitle?: string;
  };
  blog?: { title?: string; intro?: string };
  cart?: { title?: string; empty?: string; checkout?: string };
  checkout?: { title?: string; submit?: string };
  footer?: { brandLine?: string; tagline?: string };
};

export type SiteSettings = {
  id: number;
  hero_image: string;
  hero_headline: string;
  hero_subheadline: string;
  hero_label: string;
  hero_tagline: string;
  hero_cta_text: string;
  hero_cta_link: string;
  featured_label: string;
  coming_soon_text: string;
  brand_story: string;
  contact_email: string;
  phone: string;
  instagram_url: string;
  tiktok_url: string;
  shipping_fee: number;
  footer_text: string;
  seo_title: string;
  seo_description: string;
  announcement_text: string;
  announcement_visible: boolean;
  logo_url: string;
  theme: ThemeColors;
  typography: Typography;
  content: ContentMap;
};

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase.from("products").select("*").order("sort_order");
    if (error) throw error;
    return (data ?? []) as unknown as Product[];
  },
});

export const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      return data as unknown as Product | null;
    },
  });

export const settingsQuery = queryOptions({
  queryKey: ["site_settings"],
  queryFn: async (): Promise<SiteSettings> => {
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error) throw error;
    return data as unknown as SiteSettings;
  },
});

/* Defaults used when no override is set */
export const DEFAULT_THEME: ThemeColors = {
  background: "#ECF3E3",
  matcha: "#3D4837",
  forest: "#2A3227",
  olive: "#8A9A6B",
  petal: "#DDE7CE",
  text: "#2A3227",
  accent: "#3D4837",
};

export const DEFAULT_TYPOGRAPHY: Typography = {
  fontFamily: "Fraunces",
  headingFamily: "Fraunces",
  hero: { headlineSize: 44, taglineSize: 15, labelSize: 11 },
  heroMobile: { headlineSize: 18, taglineSize: 11, labelSize: 9 },
  product: { titleSize: 16, priceSize: 14, labelSize: 10 },
  footer: { size: 12 },
  baseSize: 16,
};

export const AVAILABLE_FONTS = [
  "Fraunces",
  "Playfair Display",
  "DM Serif Display",
  "Cormorant Garamond",
  "EB Garamond",
  "Libre Baskerville",
  "Inter",
  "DM Sans",
  "Manrope",
  "Poppins",
] as const;
