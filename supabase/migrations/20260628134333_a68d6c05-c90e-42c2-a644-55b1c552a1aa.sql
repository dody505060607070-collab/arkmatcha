
-- Add visibility toggles for product image and price
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS image_visible boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS price_visible boolean NOT NULL DEFAULT true;

-- Multi-admin: grant admin role automatically for any of the brand admin emails
CREATE OR REPLACE FUNCTION public.handle_new_user_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF lower(NEW.email) = ANY (ARRAY['arkmatcha@gmail.com','dody505060607070@gmail.com']) THEN
    INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $function$;

-- Ensure the trigger is wired on auth.users (idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_admin();

-- Also fire on email confirmation, so a verified address gets admin even if it was
-- created before confirmation and the initial insert did not match
DROP TRIGGER IF EXISTS on_auth_user_confirmed_admin ON auth.users;
CREATE TRIGGER on_auth_user_confirmed_admin
AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW
WHEN (old.email_confirmed_at IS NULL AND new.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.handle_new_user_admin();

-- Backfill: grant admin role to any already-existing user with one of these emails
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role
FROM auth.users u
WHERE lower(u.email) IN ('arkmatcha@gmail.com','dody505060607070@gmail.com')
ON CONFLICT DO NOTHING;
