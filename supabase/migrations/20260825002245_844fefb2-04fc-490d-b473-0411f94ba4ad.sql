CREATE OR REPLACE FUNCTION public.validate_discount_code(_code text)
RETURNS TABLE(valid boolean, reason text, code text, percent_off integer)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE r public.discount_codes%ROWTYPE;
BEGIN
  SELECT * INTO r FROM public.discount_codes d
   WHERE lower(d.code) = lower(btrim(_code)) LIMIT 1;
  IF r.id IS NULL OR r.active = false THEN
    RETURN QUERY SELECT false, 'Invalid discount code'::text, NULL::text, NULL::integer; RETURN;
  END IF;
  IF r.expires_at IS NOT NULL AND r.expires_at < now() THEN
    RETURN QUERY SELECT false, 'This code has expired'::text, NULL::text, NULL::integer; RETURN;
  END IF;
  IF r.usage_limit IS NOT NULL AND COALESCE(r.used_count,0) >= r.usage_limit THEN
    RETURN QUERY SELECT false, 'This code has reached its usage limit'::text, NULL::text, NULL::integer; RETURN;
  END IF;
  RETURN QUERY SELECT true, NULL::text, r.code, r.percent_off;
END; $$;

GRANT EXECUTE ON FUNCTION public.validate_discount_code(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.redeem_discount_code(_code text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.discount_codes
     SET used_count = COALESCE(used_count,0) + 1, updated_at = now()
   WHERE lower(code) = lower(btrim(_code));
$$;

GRANT EXECUTE ON FUNCTION public.redeem_discount_code(text) TO anon, authenticated;