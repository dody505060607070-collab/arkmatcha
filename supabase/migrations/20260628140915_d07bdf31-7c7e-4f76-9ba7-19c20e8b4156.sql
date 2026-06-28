REVOKE ALL ON FUNCTION public.ensure_allowed_admin_role() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.ensure_allowed_admin_role() FROM anon;
REVOKE ALL ON FUNCTION public.ensure_allowed_admin_role() FROM authenticated;
DROP FUNCTION IF EXISTS public.ensure_allowed_admin_role();