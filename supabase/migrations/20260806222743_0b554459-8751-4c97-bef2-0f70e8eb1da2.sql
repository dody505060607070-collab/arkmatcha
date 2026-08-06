-- Fix security warnings by setting search_path and revoking public execute
ALTER FUNCTION public.handle_order_inventory() SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.handle_order_inventory() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.handle_order_inventory() TO service_role;
-- Since it's triggered by an order insertion (which 'anon' can do), we need to grant to 'anon' and 'authenticated'
-- But it's SECURITY DEFINER, so it runs as the owner. 
-- The user who inserts the order needs permission to execute the trigger function.
GRANT EXECUTE ON FUNCTION public.handle_order_inventory() TO anon, authenticated;
