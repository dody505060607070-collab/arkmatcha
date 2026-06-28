DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_roles'
      AND policyname = 'approved admins can claim own role'
  ) THEN
    CREATE POLICY "approved admins can claim own role"
      ON public.user_roles
      FOR INSERT
      TO authenticated
      WITH CHECK (
        user_id = auth.uid()
        AND role = 'admin'::public.app_role
        AND lower(auth.jwt() ->> 'email') = ANY (ARRAY['arkmatcha@gmail.com','dody505060607070@gmail.com'])
      );
  END IF;
END $$;