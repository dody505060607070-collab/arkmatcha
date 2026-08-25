/**
 * Full backend backup — run with: bun scripts/export-backup.ts
 * Writes every table to backup/data/*.json (+ orders.csv) and downloads
 * every referenced image into backup/images/ with a MANIFEST.txt.
 * Old files in those folders are wiped first, so the backup always
 * reflects the CURRENT state of the site.
 */
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
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
  "push_subscriptions",
];

const root = "backup";
const dataDir = `${root}/data`;
const imgDir = `${root}/images`;
rmSync(dataDir, { recursive: true, force: true });
rmSync(imgDir, { recursive: true, force: true });
mkdirSync(dataDir, { recursive: true });
mkdirSync(imgDir, { recursive: true });

const dumps: Record<string, any[]> = {};

for (const table of TABLES) {
  const { data, error } = await supabase.from(table).select("*");
  if (error) {
    console.error(`${table}: ${error.message}`);
    continue;
  }
  dumps[table] = data ?? [];
  writeFileSync(`${dataDir}/${table}.json`, JSON.stringify(data, null, 2));
  console.log(`${table}: ${data?.length ?? 0} rows saved`);
}

// ---- orders as CSV -------------------------------------------------------
const orders = dumps["orders"] ?? [];
if (orders.length) {
  const cols = Object.keys(orders[0]);
  const esc = (v: unknown) =>
    `"${String(v == null ? "" : typeof v === "object" ? JSON.stringify(v) : v).replace(/"/g, '""')}"`;
  const csv = [cols.join(","), ...orders.map((o) => cols.map((c) => esc(o[c])).join(","))].join("\n");
  writeFileSync(`${dataDir}/orders.csv`, csv);
  console.log(`orders.csv: ${orders.length} rows`);
}

// ---- images --------------------------------------------------------------
const urls = new Set<string>();
const push = (u?: unknown) => {
  if (typeof u === "string" && /^https?:\/\//.test(u)) urls.add(u);
};
for (const p of dumps["products"] ?? []) {
  push(p.image_url);
  for (const g of p.gallery ?? []) push(g);
}
for (const s of dumps["site_settings"] ?? []) {
  push(s.hero_image);
  push(s.logo_url);
  push(s.editorial_image);
  push(s.hero_video_url);
  for (const g of s.instagram_grid ?? []) push(g);
}

const manifest: string[] = [];
for (const u of urls) {
  try {
    const res = await fetch(u);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const type = res.headers.get("content-type") ?? "";
    const ext = type.includes("png") ? "png" : type.includes("webp") ? "webp" : type.includes("mp4") ? "mp4" : "jpg";
    const name = `img-${createHash("sha1").update(u).digest("hex").slice(0, 8)}.${ext}`;
    writeFileSync(`${imgDir}/${name}`, buf);
    manifest.push(`${name}  ${u}`);
    console.log(`image saved: ${name}`);
  } catch (e) {
    console.error(`image failed: ${u} — ${(e as Error).message}`);
    manifest.push(`FAILED        ${u}`);
  }
}
writeFileSync(`${imgDir}/MANIFEST.txt`, manifest.join("\n") + "\n");
writeFileSync(`${root}/BACKUP_INFO.txt`, `Backup generated: ${new Date().toISOString()}\n` +
  TABLES.map((t) => `${t}: ${dumps[t]?.length ?? 0} rows`).join("\n") + `\nimages: ${urls.size}\n`);
console.log("done");
