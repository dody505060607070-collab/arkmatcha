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
  sort_order: number;
};


export type SiteSettings = {
  id: number;
  hero_image: string;
  hero_headline: string;
  hero_subheadline: string;
  coming_soon_text: string;
  brand_story: string;
  contact_email: string;
  phone: string;
  instagram_url: string;
  tiktok_url: string;
  shipping_fee: number;
  footer_text: string;
};

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    return (data ?? []) as unknown as Product[];
  },
});

export const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as Product | null;
    },
  });

export const settingsQuery = queryOptions({
  queryKey: ["site_settings"],
  queryFn: async (): Promise<SiteSettings> => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error) throw error;
    return data as unknown as SiteSettings;
  },
});
