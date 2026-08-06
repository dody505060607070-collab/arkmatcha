-- Add variants and inventory tracking to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS track_inventory BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 0;

COMMENT ON COLUMN public.products.variants IS 'Array of variants, each with name, color, and stock quantity. Example: [{"name": "Pink", "color": "#FFC0CB", "quantity": 10}]';

-- Create a function to handle inventory deduction on order
CREATE OR REPLACE FUNCTION public.handle_order_inventory()
RETURNS TRIGGER AS $$
DECLARE
  item JSONB;
  prod_id UUID;
  item_qty INTEGER;
  variant_name TEXT;
BEGIN
  -- NEW.items is expected to be a JSONB array of {id, quantity, variant?}
  FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
  LOOP
    prod_id := (item->>'id')::UUID;
    item_qty := (item->>'quantity')::INTEGER;
    variant_name := item->>'variant';

    -- If variant specified, update variant quantity
    IF variant_name IS NOT NULL THEN
      UPDATE public.products
      SET variants = (
        SELECT jsonb_agg(
          CASE
            WHEN v->>'name' = variant_name THEN
              v || jsonb_build_object('quantity', GREATEST(0, (v->>'quantity')::INTEGER - item_qty))
            ELSE v
          END
        )
        FROM jsonb_array_elements(variants) v
      )
      WHERE id = prod_id AND track_inventory = true;
    ELSE
      -- Otherwise update base quantity
      UPDATE public.products
      SET quantity = GREATEST(0, quantity - item_qty)
      WHERE id = prod_id AND track_inventory = true;
    END IF;
    
    -- Update in_stock flag automatically if total inventory hits 0
    UPDATE public.products
    SET in_stock = CASE 
      WHEN track_inventory = true THEN 
        (quantity > 0 OR EXISTS (
          SELECT 1 FROM jsonb_array_elements(variants) v 
          WHERE (v->>'quantity')::INTEGER > 0
        ))
      ELSE in_stock
    END
    WHERE id = prod_id AND track_inventory = true;
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to deduct inventory when a new order is created
DROP TRIGGER IF EXISTS on_order_created_inventory ON public.orders;
CREATE TRIGGER on_order_created_inventory
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_order_inventory();

-- Update existing Matcha Kit to have variants with quantities if it doesn't already
UPDATE public.products 
SET variants = '[
  {"name": "Pink", "color": "#FFC0CB", "quantity": 10},
  {"name": "White", "color": "#FFFFFF", "quantity": 10},
  {"name": "Butter", "color": "#F3E5AB", "quantity": 10}
]'::jsonb,
track_inventory = true
WHERE name ILIKE '%Matcha Kit%';