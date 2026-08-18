/**
 * Full data backup — run with: bun scripts/export-backup.ts
 * Requires the hosted database to be running. Writes JSON files to /mnt/documents/ark-backup/.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const url = process.env["SUPABASE_URL"]!;
const key = process.env["SUPABASE_SERVICE_ROLE_KEY"] ?? process.env["SUPABASE_PUBLISHABLE_KEY"]!;
const supabase = createClient(url, key, { auth: { persistSession: false } });

const TABLES = [
  "products",
  "site_settings",
  "orders",
  "reviews",
  "discount_codes",
  "newsletter_subscribers",
  "contact_messages",
  "user_roles",
];

const outDir = "/mnt/documents/ark-backup";
mkdirSync(outDir, { recursive: true });

for (const table of TABLES) {
  const { data, error } = await supabase.from(table).select("*");
  if (error) {
    console.error(`${table}: ${error.message}`);
    continue;
  }
  writeFileSync(`${outDir}/${table}.json`, JSON.stringify(data, null, 2));
  console.log(`${table}: ${data?.length ?? 0} rows saved`);
}
