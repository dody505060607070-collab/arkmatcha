
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS logo_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS theme jsonb NOT NULL DEFAULT '{
    "background": "#ECF3E3",
    "matcha": "#3D4837",
    "forest": "#2A3227",
    "olive": "#8A9A6B",
    "petal": "#DDE7CE",
    "text": "#2A3227",
    "accent": "#3D4837"
  }'::jsonb,
  ADD COLUMN IF NOT EXISTS typography jsonb NOT NULL DEFAULT '{
    "fontFamily": "Fraunces",
    "headingFamily": "Fraunces",
    "hero": { "headlineSize": 44, "taglineSize": 15, "labelSize": 11 },
    "heroMobile": { "headlineSize": 18, "taglineSize": 11, "labelSize": 9 },
    "product": { "titleSize": 16, "priceSize": 14, "labelSize": 10 },
    "footer": { "size": 12 },
    "baseSize": 16
  }'::jsonb,
  ADD COLUMN IF NOT EXISTS content jsonb NOT NULL DEFAULT '{
    "home": {},
    "shop": { "title": "Shop", "subtitle": "Ceremonial grade matcha, crafted in Japan." },
    "product": {
      "addToCart": "Add to cart",
      "soldOut": "Sold out",
      "ingredientsTitle": "Ingredients",
      "storageTitle": "Storage",
      "shippingTitle": "Shipping",
      "relatedTitle": "You may also like"
    },
    "blog": { "title": "The Ark Journal", "intro": "" },
    "cart": { "title": "Your cart", "empty": "Your cart is empty.", "checkout": "Checkout" },
    "checkout": { "title": "Checkout", "submit": "Place order (Cash on Delivery)" },
    "footer": { "brandLine": "Ark Matcha", "tagline": "Ceremonial grade matcha made in Japan." }
  }'::jsonb;
