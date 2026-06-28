import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FileText,
  Apple,
  Share2,
  Settings as SettingsIcon,
  LogOut,
  Search,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { productsQuery, settingsQuery, type Product, type SiteSettings } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

type Section = "overview" | "products" | "orders" | "content" | "nutrition" | "social" | "settings";

const sections: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "content", label: "Website Content", icon: FileText },
  { id: "nutrition", label: "Nutrition Facts", icon: Apple },
  { id: "social", label: "Social Links", icon: Share2 },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

function AdminPage() {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("overview");

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[color:var(--cream)]">
      <aside className="md:w-64 shrink-0 md:min-h-screen bg-[color:var(--forest)] text-[color:var(--cream)] md:sticky md:top-0">
        <div className="p-6">
          <div className="font-serif text-2xl">Ark Matcha</div>
          <p className="text-xs uppercase tracking-widest opacity-70 mt-1">Admin</p>
        </div>
        <nav className="px-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-3 md:pb-6">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm whitespace-nowrap transition-colors ${
                section === s.id
                  ? "bg-[color:var(--cream)] text-[color:var(--forest)]"
                  : "hover:bg-white/10"
              }`}
            >
              <s.icon className="h-4 w-4" />
              {s.label}
            </button>
          ))}
        </nav>
        <div className="px-3 mt-auto md:mt-8 pb-6">
          <button onClick={signOut} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm w-full hover:bg-white/10">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10">
        {section === "overview" && <Overview />}
        {section === "products" && <ProductsAdmin />}
        {section === "orders" && <OrdersAdmin />}
        {section === "content" && <ContentAdmin />}
        {section === "nutrition" && <NutritionAdmin />}
        {section === "social" && <SocialAdmin />}
        {section === "settings" && <SettingsAdmin />}
      </main>
    </div>
  );
}

/* ---------------- Overview ---------------- */
function Overview() {
  const [stats, setStats] = useState({ total: 0, newOrders: 0, revenue: 0, best: "—" });

  useEffect(() => {
    (async () => {
      const { data: orders } = await supabase.from("orders").select("status,total,items");
      const list = orders ?? [];
      const tally: Record<string, number> = {};
      let revenue = 0;
      let total = 0;
      let newOrders = 0;
      for (const o of list) {
        total++;
        if (o.status === "new") newOrders++;
        if (o.status !== "cancelled") revenue += Number(o.total);
        for (const it of (o.items as Array<{ name: string; quantity: number }>) ?? []) {
          tally[it.name] = (tally[it.name] ?? 0) + it.quantity;
        }
      }
      const best = Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
      setStats({ total, newOrders, revenue, best });
    })();
  }, []);

  const cards = [
    { label: "Total orders", value: stats.total },
    { label: "New orders", value: stats.newOrders },
    { label: "Revenue (est.)", value: `EGP ${stats.revenue.toFixed(2)}` },
    { label: "Best seller", value: stats.best },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl mb-6">Overview</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-white p-5 border border-[color:var(--border)]">
            <p className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)]">{c.label}</p>
            <p className="font-serif text-2xl mt-2">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Products ---------------- */
function ProductsAdmin() {
  const { data: products = [] } = useQuery(productsQuery);
  return (
    <div>
      <h1 className="font-serif text-3xl mb-6">Products</h1>
      <div className="space-y-6">
        {products.map((p) => (
          <ProductEditor key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

function ProductEditor({ product }: { product: Product }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: product.name,
    size: product.size,
    short_description: product.short_description,
    description: product.description,
    price: product.price == null ? "" : String(product.price),
    image_url: product.image_url,
    in_stock: product.in_stock,
    image_visible: product.image_visible ?? true,
    price_visible: product.price_visible ?? true,
    ingredients: product.ingredients,
    storage: product.storage,
    key_benefits: product.key_benefits.join("\n"),
  });

  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const { error } = await supabase
      .from("products")
      .update({
        name: form.name,
        size: form.size,
        short_description: form.short_description,
        description: form.description,
        price: form.price === "" ? null : Number(form.price),
        image_url: form.image_url,
        in_stock: form.in_stock,
        ingredients: form.ingredients,
        storage: form.storage,
        key_benefits: form.key_benefits.split("\n").map((s) => s.trim()).filter(Boolean),
        updated_at: new Date().toISOString(),
      })
      .eq("id", product.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["products"] });
    qc.invalidateQueries({ queryKey: ["product", product.slug] });
  }

  const input = "w-full px-3 py-2 rounded-lg bg-white border border-[color:var(--border)] focus:outline-none focus:ring-2 focus:ring-[color:var(--olive)] text-sm";
  return (
    <div className="rounded-2xl bg-white p-6 border border-[color:var(--border)]">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-serif text-xl">{product.name}</h2>
          <p className="text-xs text-[color:var(--muted-foreground)]">{product.slug}</p>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.in_stock} onChange={(e) => setForm({ ...form, in_stock: e.target.checked })} />
          In stock
        </label>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} /></Field>
        <Field label="Size text"><input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} className={input} /></Field>
        <Field label="Price (EGP)"><input type="number" step="0.01" value={form.price} placeholder="Leave blank to hide" onChange={(e) => setForm({ ...form, price: e.target.value })} className={input} /></Field>
        <Field label="Image URL"><input value={form.image_url} placeholder="https://..." onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={input} /></Field>
        <Field label="Short description" className="md:col-span-2"><textarea rows={2} value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} className={input} /></Field>
        <Field label="Full description" className="md:col-span-2"><textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={input} /></Field>
        <Field label="Key benefits (one per line)" className="md:col-span-2"><textarea rows={5} value={form.key_benefits} onChange={(e) => setForm({ ...form, key_benefits: e.target.value })} className={input} /></Field>
        <Field label="Ingredients"><textarea rows={2} value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} className={input} /></Field>
        <Field label="Storage"><textarea rows={2} value={form.storage} onChange={(e) => setForm({ ...form, storage: e.target.value })} className={input} /></Field>
      </div>
      <div className="mt-5 flex justify-end">
        <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">{saving ? "Saving..." : "Save"}</button>
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)]">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

/* ---------------- Orders ---------------- */
type Order = {
  id: string;
  order_number: number;
  full_name: string;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  city: string;
  address: string;
  building: string | null;
  notes: string | null;
  items: Array<{ name: string; size: string; quantity: number; price: number | null }>;
  subtotal: number;
  shipping_fee: number;
  total: number;
  status: "new" | "confirmed" | "out_for_delivery" | "delivered" | "cancelled";
  created_at: string;
};

const STATUSES: Order["status"][] = ["new", "confirmed", "out_for_delivery", "delivered", "cancelled"];

function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders((data ?? []) as unknown as Order[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: Order["status"]) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Status updated");
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  const filtered = useMemo(() => orders.filter((o) => {
    if (filter !== "all" && o.status !== filter) return false;
    if (q) {
      const needle = q.toLowerCase();
      if (!o.full_name.toLowerCase().includes(needle) && !o.phone.includes(needle) && !String(o.order_number).includes(needle) && !o.city.toLowerCase().includes(needle)) return false;
    }
    return true;
  }), [orders, filter, q]);

  return (
    <div>
      <h1 className="font-serif text-3xl mb-6">Orders</h1>
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, phone, city, #" className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-[color:var(--border)] text-sm" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className="px-3 py-2 rounded-lg bg-white border border-[color:var(--border)] text-sm">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
        </select>
      </div>
      {loading ? <p className="text-sm text-[color:var(--muted-foreground)]">Loading...</p> : filtered.length === 0 ? (
        <p className="text-sm text-[color:var(--muted-foreground)]">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((o) => (
            <div key={o.id} className="rounded-2xl bg-white border border-[color:var(--border)] p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-lg">#{o.order_number}</span>
                    <span className="text-xs text-[color:var(--muted-foreground)]">{new Date(o.created_at).toLocaleString()}</span>
                  </div>
                  <div className="mt-1 text-sm">
                    <strong>{o.full_name}</strong> · {o.phone}
                    {o.whatsapp && <> · WA {o.whatsapp}</>}
                  </div>
                  <div className="text-xs text-[color:var(--muted-foreground)]">{o.city} — {o.address}{o.building ? `, ${o.building}` : ""}</div>
                  {o.email && <div className="text-xs text-[color:var(--muted-foreground)]">{o.email}</div>}
                  {o.notes && <div className="text-xs text-[color:var(--muted-foreground)] italic mt-1">"{o.notes}"</div>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value as Order["status"])} className="px-3 py-1.5 rounded-lg border border-[color:var(--border)] bg-white text-sm">
                    {STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
                  </select>
                  <div className="font-serif text-lg">EGP {Number(o.total).toFixed(2)}</div>
                </div>
              </div>
              <ul className="mt-4 text-sm border-t border-[color:var(--border)] pt-3 space-y-1">
                {o.items.map((it, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{it.name} ({it.size}) × {it.quantity}</span>
                    <span>{it.price != null ? `EGP ${(it.price * it.quantity).toFixed(2)}` : "—"}</span>
                  </li>
                ))}
                <li className="flex justify-between text-xs text-[color:var(--muted-foreground)] pt-1">
                  <span>Shipping</span><span>EGP {Number(o.shipping_fee).toFixed(2)}</span>
                </li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function statusLabel(s: Order["status"]) {
  return { new: "New", confirmed: "Confirmed", out_for_delivery: "Out for delivery", delivered: "Delivered", cancelled: "Cancelled" }[s];
}

/* ---------------- Settings shared form ---------------- */
function useSettings() {
  const { data, refetch } = useQuery(settingsQuery);
  return { data, refetch };
}

async function saveSettings(patch: Partial<SiteSettings>, refetch: () => void) {
  const { error } = await supabase.from("site_settings").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", 1);
  if (error) { toast.error(error.message); return; }
  toast.success("Saved");
  refetch();
}

function ContentAdmin() {
  const { data: s, refetch } = useSettings();
  const [form, setForm] = useState<Partial<SiteSettings>>({});
  useEffect(() => { if (s) setForm({
    hero_headline: s.hero_headline,
    hero_subheadline: s.hero_subheadline,
    hero_image: s.hero_image,
    coming_soon_text: s.coming_soon_text,
    brand_story: s.brand_story,
    footer_text: s.footer_text,
  }); }, [s]);

  const input = "w-full px-3 py-2 rounded-lg bg-white border border-[color:var(--border)] text-sm";
  return (
    <div>
      <h1 className="font-serif text-3xl mb-6">Website Content</h1>
      <div className="rounded-2xl bg-white p-6 border border-[color:var(--border)] grid gap-4 max-w-2xl">
        <Field label="Hero headline"><input value={form.hero_headline ?? ""} onChange={(e) => setForm({ ...form, hero_headline: e.target.value })} className={input} /></Field>
        <Field label="Hero subheadline"><textarea rows={2} value={form.hero_subheadline ?? ""} onChange={(e) => setForm({ ...form, hero_subheadline: e.target.value })} className={input} /></Field>
        <Field label="Hero image URL"><input value={form.hero_image ?? ""} onChange={(e) => setForm({ ...form, hero_image: e.target.value })} className={input} placeholder="Leave blank to show default illustration" /></Field>
        <Field label="Coming Soon / Launching Soon banner"><input value={form.coming_soon_text ?? ""} onChange={(e) => setForm({ ...form, coming_soon_text: e.target.value })} className={input} /></Field>
        <Field label="Brand story"><textarea rows={4} value={form.brand_story ?? ""} onChange={(e) => setForm({ ...form, brand_story: e.target.value })} className={input} /></Field>
        <Field label="Footer text"><input value={form.footer_text ?? ""} onChange={(e) => setForm({ ...form, footer_text: e.target.value })} className={input} /></Field>
        <div><button onClick={() => saveSettings(form, refetch)} className="btn-primary">Save</button></div>
      </div>
    </div>
  );
}

function NutritionAdmin() {
  const { data: products = [] } = useQuery(productsQuery);
  const qc = useQueryClient();
  return (
    <div>
      <h1 className="font-serif text-3xl mb-6">Nutrition Facts</h1>
      <div className="space-y-6">
        {products.map((p) => <NutritionEditor key={p.id} product={p} onSaved={() => qc.invalidateQueries({ queryKey: ["products"] })} />)}
      </div>
    </div>
  );
}

function NutritionEditor({ product, onSaved }: { product: Product; onSaved: () => void }) {
  const [form, setForm] = useState(product.nutrition);
  const [saving, setSaving] = useState(false);
  const fields: Array<keyof typeof form> = ["serving", "energy", "protein", "fat", "sugar", "carbs"];
  const input = "w-full px-3 py-2 rounded-lg bg-white border border-[color:var(--border)] text-sm";

  async function save() {
    setSaving(true);
    const { error } = await supabase.from("products").update({ nutrition: form, updated_at: new Date().toISOString() }).eq("id", product.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Saved");
    onSaved();
  }

  return (
    <div className="rounded-2xl bg-white p-6 border border-[color:var(--border)]">
      <h2 className="font-serif text-xl mb-4">{product.name}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {fields.map((k) => (
          <Field key={k} label={k}>
            <input value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className={input} />
          </Field>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">{saving ? "Saving..." : "Save"}</button>
      </div>
    </div>
  );
}

function SocialAdmin() {
  const { data: s, refetch } = useSettings();
  const [form, setForm] = useState<Partial<SiteSettings>>({});
  useEffect(() => { if (s) setForm({
    instagram_url: s.instagram_url,
    tiktok_url: s.tiktok_url,
    contact_email: s.contact_email,
    phone: s.phone,
  }); }, [s]);
  const input = "w-full px-3 py-2 rounded-lg bg-white border border-[color:var(--border)] text-sm";
  return (
    <div>
      <h1 className="font-serif text-3xl mb-6">Social & Contact</h1>
      <div className="rounded-2xl bg-white p-6 border border-[color:var(--border)] grid gap-4 max-w-2xl">
        <Field label="Instagram URL"><input value={form.instagram_url ?? ""} onChange={(e) => setForm({ ...form, instagram_url: e.target.value })} className={input} /></Field>
        <Field label="TikTok URL"><input value={form.tiktok_url ?? ""} onChange={(e) => setForm({ ...form, tiktok_url: e.target.value })} className={input} /></Field>
        <Field label="Contact email"><input value={form.contact_email ?? ""} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} className={input} /></Field>
        <Field label="Phone / WhatsApp"><input value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} /></Field>
        <div><button onClick={() => saveSettings(form, refetch)} className="btn-primary">Save</button></div>
      </div>
    </div>
  );
}

function SettingsAdmin() {
  const { data: s, refetch } = useSettings();
  const [shipping, setShipping] = useState<string>("");
  useEffect(() => { if (s) setShipping(String(s.shipping_fee)); }, [s]);
  const schema = z.object({ shipping: z.string().refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Enter a valid number") });
  async function save() {
    const parsed = schema.safeParse({ shipping });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    await saveSettings({ shipping_fee: Number(shipping) }, refetch);
  }
  return (
    <div>
      <h1 className="font-serif text-3xl mb-6">Settings</h1>
      <div className="rounded-2xl bg-white p-6 border border-[color:var(--border)] grid gap-4 max-w-md">
        <Field label="Shipping fee (EGP)">
          <input value={shipping} onChange={(e) => setShipping(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-[color:var(--border)] text-sm" />
        </Field>
        <div><button onClick={save} className="btn-primary">Save</button></div>
      </div>
    </div>
  );
}
