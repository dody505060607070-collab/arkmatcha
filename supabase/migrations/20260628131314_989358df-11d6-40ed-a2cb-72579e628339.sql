
DROP POLICY "anyone can place an order" ON public.orders;
CREATE POLICY "anyone can place an order" ON public.orders FOR INSERT TO anon, authenticated
WITH CHECK (
  length(full_name) BETWEEN 1 AND 120
  AND length(phone) BETWEEN 5 AND 40
  AND length(city) BETWEEN 1 AND 80
  AND length(address) BETWEEN 1 AND 400
  AND jsonb_array_length(items) BETWEEN 1 AND 50
  AND total >= 0 AND total < 1000000
);

DROP POLICY "anyone subscribe" ON public.newsletter_subscribers;
CREATE POLICY "anyone subscribe" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated
WITH CHECK (length(email) BETWEEN 3 AND 254 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');
