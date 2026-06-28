CREATE OR REPLACE FUNCTION public.ensure_allowed_admin_role()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_email text;
BEGIN
  SELECT lower(email)
    INTO current_email
    FROM auth.users
   WHERE id = auth.uid();

  IF current_email = ANY (ARRAY['arkmatcha@gmail.com','dody505060607070@gmail.com']) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (auth.uid(), 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    RETURN true;
  END IF;

  RETURN false;
END;
$$;

GRANT EXECUTE ON FUNCTION public.ensure_allowed_admin_role() TO authenticated;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE lower(email) = ANY (ARRAY['arkmatcha@gmail.com','dody505060607070@gmail.com'])
ON CONFLICT (user_id, role) DO NOTHING;