-- Discount codes should not be publicly readable. Only admins manage them
-- via the authenticated admin dashboard; storefront discounts come from
-- site_settings, not this table.
DROP POLICY IF EXISTS "Public can read active discount codes" ON public.discount_codes;
REVOKE SELECT ON public.discount_codes FROM anon;
