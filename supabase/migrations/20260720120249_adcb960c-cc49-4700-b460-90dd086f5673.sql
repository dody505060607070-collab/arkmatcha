ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS extra_info_title text,
  ADD COLUMN IF NOT EXISTS extra_info_body text;