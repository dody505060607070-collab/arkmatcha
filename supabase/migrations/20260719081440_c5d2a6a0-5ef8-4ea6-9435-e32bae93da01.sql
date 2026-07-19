-- Reviews table
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  location text,
  rating integer NOT NULL DEFAULT 5,
  quote text NOT NULL,
  product_slug text,
  featured boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT reviews_rating_range CHECK (rating BETWEEN 1 AND 5)
);
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read featured reviews" ON public.reviews FOR SELECT USING (featured = true);
CREATE POLICY "Admins can manage reviews" ON public.reviews FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Discount codes table
CREATE TABLE public.discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  percent_off integer NOT NULL DEFAULT 10,
  active boolean NOT NULL DEFAULT true,
  usage_limit integer,
  used_count integer NOT NULL DEFAULT 0,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT discount_percent_range CHECK (percent_off BETWEEN 1 AND 100)
);
GRANT SELECT ON public.discount_codes TO anon;
GRANT SELECT ON public.discount_codes TO authenticated;
GRANT ALL ON public.discount_codes TO service_role;
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active discount codes" ON public.discount_codes FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage discount codes" ON public.discount_codes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add editable content fields to site_settings for home strips
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS trust_pills text[] DEFAULT ARRAY['Made in Japan','Ceremonial Grade','Cash on Delivery','Whisked at Home']::text[],
  ADD COLUMN IF NOT EXISTS story_steps jsonb DEFAULT '[{"title":"Sourced in Kyoto","body":"From family-run tea gardens."},{"title":"Stone-milled slow","body":"Preserving color and aroma."},{"title":"Sealed in tins","body":"Freshness until your first bowl."}]'::jsonb,
  ADD COLUMN IF NOT EXISTS instagram_grid text[] DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS editorial_image text DEFAULT '',
  ADD COLUMN IF NOT EXISTS editorial_quote text DEFAULT 'A small green pause you will look forward to.',
  ADD COLUMN IF NOT EXISTS wishlist_enabled boolean NOT NULL DEFAULT true;

-- Seed a few reviews so the section renders immediately
INSERT INTO public.reviews (author_name, location, rating, quote, sort_order)
VALUES
  ('Nour A.', 'Cairo, EG', 5, 'The smoothest matcha I''ve ever tried in Egypt. The tin is beautiful too.', 1),
  ('Yasmin K.', 'Alexandria, EG', 5, 'Bright green color, sweet aroma, no bitterness at all. My daily ritual now.', 2),
  ('Omar S.', 'Cairo, EG', 5, 'Feels like a real Kyoto café at home. Highly recommend the 50g tin.', 3);
