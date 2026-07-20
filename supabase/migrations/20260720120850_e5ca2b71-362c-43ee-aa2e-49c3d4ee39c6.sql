DROP POLICY IF EXISTS "Public can read active discount codes" ON public.discount_codes;
REVOKE SELECT ON public.discount_codes FROM anon;