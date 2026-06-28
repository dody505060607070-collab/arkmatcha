
DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_admin();

DROP TRIGGER IF EXISTS on_auth_user_updated_admin ON auth.users;
CREATE TRIGGER on_auth_user_updated_admin
AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_admin();

INSERT INTO public.user_roles(user_id, role)
SELECT id, 'admin'::app_role FROM auth.users
WHERE lower(email) IN ('arkmatcha@gmail.com','dody505060607070@gmail.com')
ON CONFLICT DO NOTHING;
