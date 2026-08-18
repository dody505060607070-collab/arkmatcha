# Ark Matcha — Full Backup

Everything here is committed to the repo, so connecting GitHub takes it all with you.

## Contents

- `data/*.json` — full row dumps of every backend table:
  - `products.json` (names, prices, images, variants, inventory)
  - `site_settings.json` (theme, typography, hero, copy, shipping rates)
  - `orders.json` (all customer orders: name, phone, address, items, totals)
  - `reviews.json`, `discount_codes.json`, `newsletter_subscribers.json`,
    `contact_messages.json`, `user_roles.json`, `push_subscriptions.json`
- `data/orders.csv` — orders as a spreadsheet (Excel/Sheets friendly)
- `images/` — downloaded copies of every product/hero/logo image
- `images/MANIFEST.txt` — maps each local file to its original URL
- `../supabase/migrations/` — full database schema, RLS, triggers

## Restoring into a new project

1. Enable Cloud in the new project — migrations rebuild all tables.
2. Re-insert rows from `data/*.json` (JSON arrays match the table columns 1:1).
3. Re-upload files from `images/` and update the URLs in `products` /
   `site_settings`, or keep the original Cloudinary URLs (they still work).

Refresh this backup any time with `bun scripts/export-backup.ts`.

> Note: `orders.json` / `orders.csv` contain real customer personal data
> (names, phone numbers, addresses). Keep the GitHub repository **private**.
