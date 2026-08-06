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
  extra_info_title: string | null;
  extra_info_body: string | null;
  track_inventory: boolean;
  quantity: number;
  variants: Array<{
    name: string;
    color: string;
    quantity: number;
  }>;
};

export type ThemeColors = {
  background: string;
  matcha: string;
  forest: string;
  olive: string;
  petal: string;
  text: string;
  accent: string;

  /* Section-specific overrides (all optional — fall back to the base palette) */
  heroBackground?: string;
  heroLabel?: string;
  heroHeadline?: string;
  heroTagline?: string;
  ctaBackground?: string;
  ctaText?: string;
  featuredLabel?: string;

  productLabel?: string;
  productTitle?: string;
  productPrice?: string;
  cardBackground?: string;

  footerBackground?: string;
  footerText?: string;
  footerAccent?: string;

  announcementBackground?: string;
  announcementText?: string;

  linkColor?: string;
  borderColor?: string;
  headingColor?: string;
  mutedText?: string;
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
  /* Home CMS strips */
  trust_pills: string[] | null;
  story_steps: { title: string; body: string }[] | null;
  instagram_grid: string[] | null;
  editorial_image: string | null;
  editorial_quote: string | null;
  wishlist_enabled: boolean;
  shipping_rates: Record<string, number> | null;
};

export type Review = {
  id: string;
  author_name: string;
  location: string | null;
  rating: number;
  quote: string;
  product_slug: string | null;
  featured: boolean;
  sort_order: number;
};

export type DiscountCode = {
  id: string;
  code: string;
  percent_off: number;
  active: boolean;
  usage_limit: number | null;
  used_count: number;
  expires_at: string | null;
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

export const reviewsQuery = queryOptions({
  queryKey: ["reviews"],
  queryFn: async (): Promise<Review[]> => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("featured", true)
      .order("sort_order");
    if (error) throw error;
    return (data ?? []) as unknown as Review[];
  },
});

export const allReviewsQuery = queryOptions({
  queryKey: ["reviews-all"],
  queryFn: async (): Promise<Review[]> => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    return (data ?? []) as unknown as Review[];
  },
});

export const discountCodesQuery = queryOptions({
  queryKey: ["discount_codes"],
  queryFn: async (): Promise<DiscountCode[]> => {
    const { data, error } = await supabase
      .from("discount_codes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as DiscountCode[];
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

export type FontCategory =
  | "Serif"
  | "Sans"
  | "Display"
  | "Handwriting"
  | "Monospace"
  | "Funky";

export type FontEntry = { name: string; category: FontCategory };

export const FONT_CATALOG: FontEntry[] = [
  // ————— Serif (elegant / editorial) —————
  { name: "Fraunces", category: "Serif" },
  { name: "Playfair Display", category: "Serif" },
  { name: "DM Serif Display", category: "Serif" },
  { name: "DM Serif Text", category: "Serif" },
  { name: "Cormorant Garamond", category: "Serif" },
  { name: "Cormorant", category: "Serif" },
  { name: "EB Garamond", category: "Serif" },
  { name: "Libre Baskerville", category: "Serif" },
  { name: "Lora", category: "Serif" },
  { name: "Merriweather", category: "Serif" },
  { name: "Crimson Pro", category: "Serif" },
  { name: "Crimson Text", category: "Serif" },
  { name: "Cardo", category: "Serif" },
  { name: "Spectral", category: "Serif" },
  { name: "Source Serif 4", category: "Serif" },
  { name: "Noto Serif", category: "Serif" },
  { name: "PT Serif", category: "Serif" },
  { name: "Bitter", category: "Serif" },
  { name: "Instrument Serif", category: "Serif" },
  { name: "Newsreader", category: "Serif" },
  { name: "Prata", category: "Serif" },
  { name: "Italiana", category: "Serif" },
  { name: "Marcellus", category: "Serif" },
  { name: "Tenor Sans", category: "Serif" },

  // ————— Sans-serif (modern / clean) —————
  { name: "Inter", category: "Sans" },
  { name: "DM Sans", category: "Sans" },
  { name: "Manrope", category: "Sans" },
  { name: "Poppins", category: "Sans" },
  { name: "Montserrat", category: "Sans" },
  { name: "Work Sans", category: "Sans" },
  { name: "Plus Jakarta Sans", category: "Sans" },
  { name: "Space Grotesk", category: "Sans" },
  { name: "Outfit", category: "Sans" },
  { name: "Figtree", category: "Sans" },
  { name: "Nunito", category: "Sans" },
  { name: "Nunito Sans", category: "Sans" },
  { name: "Rubik", category: "Sans" },
  { name: "Karla", category: "Sans" },
  { name: "Barlow", category: "Sans" },
  { name: "Raleway", category: "Sans" },
  { name: "Open Sans", category: "Sans" },
  { name: "Lato", category: "Sans" },
  { name: "Roboto", category: "Sans" },
  { name: "Urbanist", category: "Sans" },
  { name: "Sora", category: "Sans" },
  { name: "Epilogue", category: "Sans" },
  { name: "Archivo", category: "Sans" },
  { name: "Onest", category: "Sans" },
  { name: "Geist", category: "Sans" },

  // ————— Display (bold statement) —————
  { name: "Abril Fatface", category: "Display" },
  { name: "Bebas Neue", category: "Display" },
  { name: "Anton", category: "Display" },
  { name: "Archivo Black", category: "Display" },
  { name: "Big Shoulders Display", category: "Display" },
  { name: "Oswald", category: "Display" },
  { name: "Righteous", category: "Display" },
  { name: "Alfa Slab One", category: "Display" },
  { name: "Bricolage Grotesque", category: "Display" },
  { name: "Syne", category: "Display" },
  { name: "Unbounded", category: "Display" },
  { name: "Bodoni Moda", category: "Display" },
  { name: "Yeseva One", category: "Display" },
  { name: "Josefin Sans", category: "Display" },
  { name: "Comfortaa", category: "Display" },

  // ————— Handwriting / Script —————
  { name: "Caveat", category: "Handwriting" },
  { name: "Dancing Script", category: "Handwriting" },
  { name: "Pacifico", category: "Handwriting" },
  { name: "Sacramento", category: "Handwriting" },
  { name: "Great Vibes", category: "Handwriting" },
  { name: "Satisfy", category: "Handwriting" },
  { name: "Kalam", category: "Handwriting" },
  { name: "Shadows Into Light", category: "Handwriting" },
  { name: "Homemade Apple", category: "Handwriting" },
  { name: "Parisienne", category: "Handwriting" },
  { name: "Allura", category: "Handwriting" },
  { name: "Cookie", category: "Handwriting" },

  // ————— Monospace —————
  { name: "JetBrains Mono", category: "Monospace" },
  { name: "Space Mono", category: "Monospace" },
  { name: "IBM Plex Mono", category: "Monospace" },
  { name: "Fira Code", category: "Monospace" },
  { name: "Roboto Mono", category: "Monospace" },
  { name: "DM Mono", category: "Monospace" },

  // ————— Funky / Decorative —————
  { name: "Rubik Mono One", category: "Funky" },
  { name: "Rubik Glitch", category: "Funky" },
  { name: "Rubik Puddles", category: "Funky" },
  { name: "Rubik Bubbles", category: "Funky" },
  { name: "Rubik Wet Paint", category: "Funky" },
  { name: "Rubik Iso", category: "Funky" },
  { name: "Rubik Marker Hatch", category: "Funky" },
  { name: "Rubik Beastly", category: "Funky" },
  { name: "Rubik Distressed", category: "Funky" },
  { name: "Rubik Spray Paint", category: "Funky" },
  { name: "Rubik Vinyl", category: "Funky" },
  { name: "Rubik Gemstones", category: "Funky" },
  { name: "Rubik Storm", category: "Funky" },
  { name: "Rubik Broken Fax", category: "Funky" },
  { name: "Rubik Doodle Shadow", category: "Funky" },
  { name: "Bungee", category: "Funky" },
  { name: "Bungee Shade", category: "Funky" },
  { name: "Bungee Inline", category: "Funky" },
  { name: "Monoton", category: "Funky" },
  { name: "Faster One", category: "Funky" },
  { name: "Press Start 2P", category: "Funky" },
  { name: "VT323", category: "Funky" },
  { name: "Bowlby One", category: "Funky" },
  { name: "Titan One", category: "Funky" },
  { name: "Lilita One", category: "Funky" },
  { name: "Fugaz One", category: "Funky" },
  { name: "Bagel Fat One", category: "Funky" },
  { name: "Modak", category: "Funky" },
  { name: "Silkscreen", category: "Funky" },
  { name: "Pixelify Sans", category: "Funky" },
  { name: "Rampart One", category: "Funky" },
  { name: "Codystar", category: "Funky" },
  { name: "Bungee Spice", category: "Funky" },
  { name: "Shrikhand", category: "Funky" },
  { name: "Passion One", category: "Funky" },
  { name: "Ultra", category: "Funky" },
];

export const FONT_CATEGORIES: FontCategory[] = [
  "Serif",
  "Sans",
  "Display",
  "Handwriting",
  "Monospace",
  "Funky",
];

export const AVAILABLE_FONTS = FONT_CATALOG.map((f) => f.name);
