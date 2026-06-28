
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Auto-grant admin to the brand email on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_admin()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF lower(NEW.email) = 'arkmatcha@gmail.com' THEN
    INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_admin();

-- Products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  size TEXT NOT NULL,
  short_description TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(10,2),
  image_url TEXT NOT NULL DEFAULT '',
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  key_benefits JSONB NOT NULL DEFAULT '[]'::jsonb,
  nutrition JSONB NOT NULL DEFAULT '{}'::jsonb,
  ingredients TEXT NOT NULL DEFAULT '100% Japanese ceremonial grade matcha powder.',
  storage TEXT NOT NULL DEFAULT 'Store in a cool, dry place away from direct sunlight. Keep tightly closed after opening.',
  in_stock BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products public read" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin manage products" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Site settings (single row)
CREATE TABLE public.site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  hero_image TEXT NOT NULL DEFAULT '',
  hero_headline TEXT NOT NULL DEFAULT 'Pure Ritual. Smooth Energy.',
  hero_subheadline TEXT NOT NULL DEFAULT 'Ceremonial grade matcha in two elegant sizes, crafted for calm daily moments.',
  coming_soon_text TEXT NOT NULL DEFAULT 'Launching Soon — Be part of the first Ark Matcha ritual.',
  brand_story TEXT NOT NULL DEFAULT 'Ark Matcha was created for people who love calm rituals, clean design, and a smooth matcha experience. Every detail was designed to make matcha feel simple, beautiful, and part of your everyday routine.',
  contact_email TEXT NOT NULL DEFAULT 'arkmatcha@gmail.com',
  phone TEXT NOT NULL DEFAULT '+20 10 32511516',
  instagram_url TEXT NOT NULL DEFAULT 'https://www.instagram.com/arkmatcha?utm_source=qr',
  tiktok_url TEXT NOT NULL DEFAULT 'https://www.tiktok.com/@arkmatcha?_r=1&_t=ZS-97ZHVb8tPsq',
  shipping_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  footer_text TEXT NOT NULL DEFAULT '© Ark Matcha. Ceremonial Grade Matcha. Made in Japan.',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin update settings" ON public.site_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin insert settings" ON public.site_settings FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Orders
CREATE TYPE public.order_status AS ENUM ('new','confirmed','out_for_delivery','delivered','cancelled');

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number SERIAL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  email TEXT,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  building TEXT,
  notes TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  status order_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.orders TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can place an order" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin read orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete orders" ON public.orders FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Newsletter
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT SELECT, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone subscribe" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin read subs" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete subs" ON public.newsletter_subscribers FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Seed initial data
INSERT INTO public.site_settings(id) VALUES (1) ON CONFLICT DO NOTHING;

INSERT INTO public.products (slug, name, size, short_description, description, price, image_url, key_benefits, nutrition, sort_order) VALUES
('ark-matcha-30g', 'Ark Matcha 30g', '30g / 1.06 oz',
 'Light, elegant, and perfect for trying your first daily matcha ritual.',
 'Ark Matcha is a ceremonial grade matcha created for calm daily rituals, smooth energy, and a naturally vibrant matcha experience. Carefully packed in elegant tins designed for freshness, simplicity, and a soft premium feel.',
 NULL, '',
 '["Ceremonial grade matcha","Smooth natural energy","Rich vibrant green color","Ideal for hot matcha, iced matcha, and lattes","Packed in premium tins","Made in Japan"]'::jsonb,
 '{"serving":"per 2g","energy":"7.48 KJ","protein":"0.64 g","fat":"0.00 g","sugar":"0.00 g","carbs":"1.14 g"}'::jsonb,
 1),
('ark-matcha-50g', 'Ark Matcha 50g', '50g / 1.76 oz',
 'Deeper, richer, and made for your everyday matcha routine.',
 'Ark Matcha is a ceremonial grade matcha created for calm daily rituals, smooth energy, and a naturally vibrant matcha experience. Carefully packed in elegant tins designed for freshness, simplicity, and a soft premium feel.',
 NULL, '',
 '["Ceremonial grade matcha","Smooth natural energy","Rich vibrant green color","Ideal for hot matcha, iced matcha, and lattes","Packed in premium tins","Made in Japan"]'::jsonb,
 '{"serving":"per 2g","energy":"7.48 KJ","protein":"0.64 g","fat":"0.00 g","sugar":"0.00 g","carbs":"1.14 g"}'::jsonb,
 2);
