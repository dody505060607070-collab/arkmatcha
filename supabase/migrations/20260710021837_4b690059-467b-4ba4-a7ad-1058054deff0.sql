
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS hero_label TEXT DEFAULT 'Ceremonial · Japan',
  ADD COLUMN IF NOT EXISTS hero_tagline TEXT DEFAULT 'Vivid. Smooth. Born in Japan. One tin, endless calm.',
  ADD COLUMN IF NOT EXISTS hero_cta_text TEXT DEFAULT 'Shop now',
  ADD COLUMN IF NOT EXISTS hero_cta_link TEXT DEFAULT '/shop',
  ADD COLUMN IF NOT EXISTS featured_label TEXT DEFAULT 'Featured Product',
  ADD COLUMN IF NOT EXISTS seo_title TEXT DEFAULT 'Ark Matcha | Ceremonial Grade Matcha Made in Japan',
  ADD COLUMN IF NOT EXISTS seo_description TEXT DEFAULT 'Ceremonial grade matcha in 30g and 50g elegant tins. Made in Japan.',
  ADD COLUMN IF NOT EXISTS announcement_text TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS announcement_visible BOOLEAN DEFAULT false;
