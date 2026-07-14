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
  Share2,
  Settings as SettingsIcon,
  LogOut,
  Search,
  RefreshCcw,
  Trash2,
  Sparkles,
  Mail,
  Megaphone,
  Info,
  Globe,
  Palette,
  Type as TypeIcon,
  Image as ImageIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  productsQuery,
  settingsQuery,
  DEFAULT_THEME,
  DEFAULT_TYPOGRAPHY,
  AVAILABLE_FONTS,
  type Product,
  type SiteSettings,
  type ThemeColors,
  type Typography,
  type ContentMap,
} from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

type Section =
  | "overview"
  | "design"
  | "hero"
  | "products"
  | "orders"
  | "content"
  | "social"
  | "newsletter"
  | "seo"
  | "announcement"
  | "settings";

const sections: { id: Section; label: string; labelAr: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", labelAr: "نظرة عامة", icon: LayoutDashboard },
  { id: "design", label: "Design Studio", labelAr: "استوديو التصميم", icon: Palette },
  { id: "hero", label: "Hero Section", labelAr: "الواجهة الرئيسية", icon: Sparkles },
  { id: "content", label: "Content", labelAr: "نصوص الصفحات", icon: FileText },
  { id: "products", label: "Products", labelAr: "المنتجات", icon: Package },
  { id: "orders", label: "Orders", labelAr: "الطلبات", icon: ShoppingBag },
  { id: "social", label: "Social & Contact", labelAr: "السوشيال والتواصل", icon: Share2 },
  { id: "newsletter", label: "Newsletter", labelAr: "قائمة البريد", icon: Mail },
  { id: "seo", label: "SEO", labelAr: "تحسين محركات البحث", icon: Globe },
  { id: "announcement", label: "Announcement Bar", labelAr: "شريط الإعلان", icon: Megaphone },
  { id: "settings", label: "Settings", labelAr: "الإعدادات", icon: SettingsIcon },
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
      <aside className="md:w-72 shrink-0 md:min-h-screen bg-gradient-to-b from-[color:var(--forest)] to-[#2a3227] text-[color:var(--cream)] md:sticky md:top-0">
        <div className="p-6">
          <div className="font-serif text-2xl">Ark Matcha</div>
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-70 mt-1">Admin Dashboard · لوحة التحكم</p>
        </div>
        <nav className="px-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-3 md:pb-6">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all ${
                section === s.id
                  ? "bg-[color:var(--cream)] text-[color:var(--forest)] shadow-sm"
                  : "hover:bg-white/10"
              }`}
            >
              <s.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">
                <span className="block leading-tight">{s.label}</span>
                <span
                  className={`block text-[10px] leading-tight ${
                    section === s.id ? "text-[color:var(--olive)]" : "opacity-60"
                  }`}
                  dir="rtl"
                >
                  {s.labelAr}
                </span>
              </span>
            </button>
          ))}
        </nav>
        <div className="px-3 mt-auto md:mt-8 pb-6">
          <button onClick={signOut} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm w-full hover:bg-white/10">
            <LogOut className="h-4 w-4" /> Sign out · تسجيل خروج
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10 max-w-7xl">
        {section === "overview" && <Overview />}
        {section === "design" && <DesignAdmin />}
        {section === "hero" && <HeroAdmin />}
        {section === "products" && <ProductsAdmin />}
        {section === "orders" && <OrdersAdmin />}
        {section === "content" && <ContentAdmin />}
        {section === "social" && <SocialAdmin />}
        {section === "newsletter" && <NewsletterAdmin />}
        {section === "seo" && <SeoAdmin />}
        {section === "announcement" && <AnnouncementAdmin />}
        {section === "settings" && <SettingsAdmin />}
      </main>
    </div>
  );
}

/* ---------------- Reusable helpers ---------------- */

function HelpPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      dir="rtl"
      className="mb-6 rounded-2xl border border-[color:var(--olive)]/20 bg-gradient-to-br from-[color:var(--cream)] to-white p-5 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[color:var(--forest)] text-[color:var(--cream)]">
          <Info className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <h3 className="font-serif text-lg text-[color:var(--forest)]">{title}</h3>
          <div className="mt-1.5 space-y-1.5 text-sm leading-relaxed text-[color:var(--forest)]/80">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-serif text-3xl text-[color:var(--forest)]">{title}</h1>
      <p className="mt-1 text-sm text-[color:var(--muted-foreground)]" dir="rtl">
        {subtitle}
      </p>
    </div>
  );
}

const inputClass =
  "w-full px-3 py-2 rounded-lg bg-white border border-[color:var(--border)] focus:outline-none focus:ring-2 focus:ring-[color:var(--olive)] text-sm";

function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)]">{label}</span>
      {hint ? (
        <span className="mt-0.5 block text-[11px] text-[color:var(--muted-foreground)]/80" dir="rtl">
          {hint}
        </span>
      ) : null}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

/* ---------------- Overview ---------------- */
function Overview() {
  const [stats, setStats] = useState({ total: 0, newOrders: 0, revenue: 0, best: "—", subs: 0 });

  useEffect(() => {
    (async () => {
      const [{ data: orders }, { count: subs }] = await Promise.all([
        supabase.from("orders").select("status,total,items"),
        supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
      ]);
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
      setStats({ total, newOrders, revenue, best, subs: subs ?? 0 });
    })();
  }, []);

  const cards = [
    { label: "Total orders", labelAr: "إجمالي الطلبات", value: stats.total },
    { label: "New orders", labelAr: "طلبات جديدة", value: stats.newOrders },
    { label: "Revenue (est.)", labelAr: "الإيرادات التقديرية", value: `EGP ${stats.revenue.toFixed(2)}` },
    { label: "Best seller", labelAr: "الأكثر مبيعًا", value: stats.best },
    { label: "Newsletter subs", labelAr: "مشتركو النشرة", value: stats.subs },
  ];

  return (
    <div>
      <PageHeader title="Overview" subtitle="نظرة سريعة على أداء المتجر — الطلبات والإيرادات والأكثر مبيعًا." />
      <HelpPanel title="أهلاً بك في لوحة التحكم">
        <p>
          من هنا تقدر تتحكم في كل حاجة في الموقع: الصور، النصوص، الأسعار، المنتجات، الطلبات، ومحركات البحث. كل قسم فيه شرح
          بسيط بالعربي فوقه.
        </p>
        <p>ابدأ من الأقسام على الشمال، وكل تغيير بيتحفظ لما تدوس زرار <b>Save</b>.</p>
      </HelpPanel>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-white p-5 border border-[color:var(--border)] shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[color:var(--muted-foreground)]">{c.label}</p>
            <p className="mt-2 font-serif text-2xl text-[color:var(--forest)]">{c.value}</p>
            <p className="mt-1 text-[11px] text-[color:var(--muted-foreground)]" dir="rtl">
              {c.labelAr}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Hero Admin ---------------- */
function HeroAdmin() {
  const { data: s, refetch } = useQuery(settingsQuery);
  const [form, setForm] = useState<Partial<SiteSettings>>({});
  useEffect(() => {
    if (s)
      setForm({
        hero_image: s.hero_image,
        hero_label: s.hero_label,
        hero_headline: s.hero_headline,
        hero_tagline: s.hero_tagline,
        hero_cta_text: s.hero_cta_text,
        hero_cta_link: s.hero_cta_link,
        featured_label: s.featured_label,
      });
  }, [s]);

  return (
    <div>
      <PageHeader title="Hero Section" subtitle="التحكم الكامل في الواجهة الأولى اللي بتظهر لأي زائر على الصفحة الرئيسية." />
      <HelpPanel title="إيه هو الـ Hero Section؟">
        <p>
          ده أول جزء من الموقع بيشوفه الزائر — الصورة الكبيرة والعنوان والزرار. أي تعديل هنا بيتغير على طول في الصفحة
          الرئيسية.
        </p>
        <ul className="list-inside list-disc space-y-1 pr-2">
          <li><b>Hero Image URL</b>: رابط الصورة الأساسية (سيبها فاضية عشان تستخدم الصورة الافتراضية).</li>
          <li><b>Label</b>: النص الصغير فوق العنوان (مثال: "Ceremonial · Japan").</li>
          <li><b>Headline</b>: العنوان الكبير بخط Fraunces.</li>
          <li><b>Tagline</b>: الوصف اللي تحت العنوان.</li>
          <li><b>CTA Text/Link</b>: كلمة الزرار والصفحة اللي بيوديها (مثلاً <code>/shop</code>).</li>
          <li><b>Featured label</b>: النص اللي بيظهر فوق شبكة المنتجات.</li>
        </ul>
      </HelpPanel>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 border border-[color:var(--border)] shadow-sm">
          <div className="grid gap-4">
            <Field label="Hero Image URL" hint="رابط الصورة — سيبها فاضية للصورة الافتراضية">
              <input value={form.hero_image ?? ""} onChange={(e) => setForm({ ...form, hero_image: e.target.value })} className={inputClass} placeholder="https://..." />
            </Field>
            <Field label="Label (small text above headline)" hint="النص الصغير فوق العنوان">
              <input value={form.hero_label ?? ""} onChange={(e) => setForm({ ...form, hero_label: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Headline" hint="العنوان الرئيسي الكبير">
              <input value={form.hero_headline ?? ""} onChange={(e) => setForm({ ...form, hero_headline: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Tagline" hint="الوصف تحت العنوان">
              <textarea rows={2} value={form.hero_tagline ?? ""} onChange={(e) => setForm({ ...form, hero_tagline: e.target.value })} className={inputClass} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="CTA Button Text" hint="نص الزرار">
                <input value={form.hero_cta_text ?? ""} onChange={(e) => setForm({ ...form, hero_cta_text: e.target.value })} className={inputClass} />
              </Field>
              <Field label="CTA Link" hint="الصفحة اللي بيوديها الزرار">
                <input value={form.hero_cta_link ?? ""} onChange={(e) => setForm({ ...form, hero_cta_link: e.target.value })} className={inputClass} placeholder="/shop" />
              </Field>
            </div>
            <Field label="Featured products label" hint="نص فوق شبكة المنتجات">
              <input value={form.featured_label ?? ""} onChange={(e) => setForm({ ...form, featured_label: e.target.value })} className={inputClass} />
            </Field>
            <div>
              <button onClick={() => saveSettings(form, refetch)} className="btn-primary">Save changes</button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-[color:var(--olive)]/40 bg-gradient-to-br from-white to-[color:var(--cream)] p-6">
          <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted-foreground)]">Live preview · معاينة مباشرة</p>
          <div className="overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white">
            <div className="grid grid-cols-2">
              <div className="bg-[color:var(--olive)]/5 aspect-square">
                {form.hero_image ? (
                  <img src={form.hero_image} alt="preview" className="h-full w-full object-contain" />
                ) : (
                  <div className="grid h-full place-items-center text-xs text-[color:var(--muted-foreground)]">Default image</div>
                )}
              </div>
              <div className="flex flex-col justify-center gap-2 p-4">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[color:var(--olive)]">{form.hero_label}</span>
                <h2 className="font-serif text-base text-[color:var(--petal-strong)]">{form.hero_headline}</h2>
                <p className="text-[10px] text-[color:var(--olive)]">{form.hero_tagline}</p>
                <span className="mt-1 inline-flex w-fit rounded-full bg-[color:var(--matcha)] px-3 py-1 text-[10px] font-medium text-white">{form.hero_cta_text}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Products ---------------- */
function ProductsAdmin() {
  const qc = useQueryClient();
  const { data: products = [] } = useQuery(productsQuery);
  const [creating, setCreating] = useState(false);

  async function addProduct() {
    setCreating(true);
    const stamp = Date.now().toString(36);
    const slug = `new-product-${stamp}`;
    const { error } = await supabase.from("products").insert({
      slug,
      name: "New Product",
      size: "",
      short_description: "",
      description: "",
      price: null,
      image_url: "",
      gallery: [],
      in_stock: true,
      image_visible: true,
      price_visible: true,
      sort_order: (products.length ?? 0) + 1,
    });
    setCreating(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Product added — edit the details below");
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  async function deleteProduct(p: Product) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Product deleted");
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
        <PageHeader title="Products" subtitle="إدارة كل منتجات المتجر — الأسماء والأسعار والصور والمخزون." />
        <button onClick={addProduct} disabled={creating} className="btn-primary disabled:opacity-60">
          {creating ? "Adding..." : "+ Add product"}
        </button>
      </div>
      <HelpPanel title="إزاي تدير المنتجات؟">
        <ul className="list-inside list-disc space-y-1 pr-2">
          <li><b>Add product</b>: يضيف منتج جديد فارغ، وبعدين تعبّي بياناته.</li>
          <li><b>Discount %</b>: اكتب رقم من 0 لـ 100 (مثلاً 20 يعني خصم 20%).</li>
          <li><b>In stock / Sold out</b>: دوس عشان توقف البيع أو تفتحه.</li>
          <li><b>Show image / Show price</b>: تقدر تخفي الصورة أو السعر لو المنتج لسه مش جاهز.</li>
          <li><b>Gallery</b>: كل رابط صورة في سطر لوحده — بتظهر في carousel جوة صفحة المنتج.</li>
          <li><b>Delete</b>: بيمسح المنتج نهائيًا — استخدمه بحذر.</li>
        </ul>
      </HelpPanel>
      <div className="space-y-6">
        {products.map((p) => (
          <ProductEditor key={p.id} product={p} onDelete={() => deleteProduct(p)} />
        ))}
        {products.length === 0 && (
          <p className="text-sm text-[color:var(--muted-foreground)]">No products yet. Click "Add product" to create one.</p>
        )}
      </div>
    </div>
  );
}

function ProductEditor({ product, onDelete }: { product: Product; onDelete?: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: product.name,
    size: product.size,
    short_description: product.short_description,
    description: product.description,
    price: product.price == null ? "" : String(product.price),
    discount_percentage: String(product.discount_percentage ?? 0),
    image_url: product.image_url,
    gallery: (product.gallery ?? []).join("\n"),
    in_stock: product.in_stock,
    image_visible: product.image_visible ?? true,
    price_visible: product.price_visible ?? true,
    ingredients: product.ingredients,
    storage: product.storage,
  });

  const [saving, setSaving] = useState(false);

  const discountNum = Math.max(0, Math.min(100, Number(form.discount_percentage) || 0));
  const priceNum = form.price === "" ? null : Number(form.price);
  const finalPrice = priceNum != null && discountNum > 0 ? priceNum * (1 - discountNum / 100) : priceNum;

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
        discount_percentage: discountNum,
        image_url: form.image_url,
        gallery: form.gallery.split("\n").map((s) => s.trim()).filter(Boolean),
        in_stock: form.in_stock,
        image_visible: form.image_visible,
        price_visible: form.price_visible,
        ingredients: form.ingredients,
        storage: form.storage,
        updated_at: new Date().toISOString(),
      })
      .eq("id", product.id);

    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["products"] });
    qc.invalidateQueries({ queryKey: ["product", product.slug] });
  }

  return (
    <div className="rounded-2xl bg-white p-6 border border-[color:var(--border)] shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl">{product.name}</h2>
          <p className="text-xs text-[color:var(--muted-foreground)]">{product.slug}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <button
            type="button"
            onClick={() => setForm({ ...form, in_stock: !form.in_stock })}
            className={`px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest transition-colors ${
              form.in_stock
                ? "bg-[color:var(--olive)]/10 text-[color:var(--olive)] border border-[color:var(--olive)]/30"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {form.in_stock ? "● In stock" : "✕ Sold out"}
          </button>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.image_visible} onChange={(e) => setForm({ ...form, image_visible: e.target.checked })} />
            Show image
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.price_visible} onChange={(e) => setForm({ ...form, price_visible: e.target.checked })} />
            Show price
          </label>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Name" hint="اسم المنتج"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} /></Field>
        <Field label="Size text" hint="الحجم (مثلاً 30g)"><input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} className={inputClass} /></Field>
        <Field label="Price (EGP)" hint="السعر — سيبها فاضية عشان تخفيها"><input type="number" step="0.01" value={form.price} placeholder="Leave blank to hide" onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} /></Field>
        <Field label="Discount %" hint="نسبة الخصم من 0 لـ 100">
          <div className="flex items-center gap-3">
            <input type="number" min="0" max="100" step="1" value={form.discount_percentage} onChange={(e) => setForm({ ...form, discount_percentage: e.target.value })} className={inputClass} />
            {discountNum > 0 && priceNum != null && (
              <span className="text-xs whitespace-nowrap text-[color:var(--olive)]">
                → EGP {finalPrice!.toFixed(2)}
              </span>
            )}
          </div>
        </Field>
        <Field label="Image URL (main)" hint="رابط الصورة الرئيسية"><input value={form.image_url} placeholder="https://..." onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={inputClass} /></Field>
        <Field label="Gallery images (one URL per line)" hint="صور إضافية — كل رابط في سطر" className="md:col-span-2"><textarea rows={4} value={form.gallery} placeholder={"https://...\nhttps://..."} onChange={(e) => setForm({ ...form, gallery: e.target.value })} className={inputClass} /></Field>
        <Field label="Short description" hint="وصف قصير يظهر تحت الاسم" className="md:col-span-2"><textarea rows={2} value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} className={inputClass} /></Field>
        <Field label="Full description" hint="الوصف الكامل في صفحة المنتج" className="md:col-span-2"><textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} /></Field>
        <Field label="Ingredients" hint="المكونات"><textarea rows={2} value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} className={inputClass} /></Field>
        <Field label="Storage" hint="طريقة التخزين"><textarea rows={2} value={form.storage} onChange={(e) => setForm({ ...form, storage: e.target.value })} className={inputClass} /></Field>
      </div>
      <div className="mt-5 flex justify-between gap-3">
        {onDelete ? (
          <button onClick={onDelete} className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-red-200 text-red-700 bg-red-50 hover:bg-red-100">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        ) : <span />}
        <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">{saving ? "Saving..." : "Save"}</button>
      </div>
    </div>
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
  governorate: string | null;
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
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (error) {
      setOrders([]);
      setError(error.message);
      toast.error(error.message);
      setLoading(false);
      return;
    }
    setOrders((data ?? []) as unknown as Order[]);
    setLoading(false);
  }
  useEffect(() => {
    load();
    const channel = supabase
      .channel("admin-orders-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function setStatus(id: string, status: Order["status"]) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Status updated");
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  async function removeOrder(o: Order) {
    if (!confirm(`Delete order #${o.order_number} from ${o.full_name}? This cannot be undone.`)) return;
    const { error } = await supabase.from("orders").delete().eq("id", o.id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Order #${o.order_number} deleted`);
    setOrders((prev) => prev.filter((x) => x.id !== o.id));
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
      <PageHeader title="Orders" subtitle="كل طلبات العملاء — الحالة، بيانات التوصيل، والدفع كاش عند الاستلام." />
      <HelpPanel title="إدارة الطلبات">
        <ul className="list-inside list-disc space-y-1 pr-2">
          <li>الطلبات بتحدث تلقائيًا (Live) — أي طلب جديد يظهر فورًا.</li>
          <li>غيّر حالة الطلب من القائمة اليمين: <b>New → Confirmed → Out for delivery → Delivered</b>، أو <b>Cancelled</b>.</li>
          <li>ابحث بالاسم أو الموبايل أو رقم الطلب أو المدينة.</li>
          <li>زرار الحذف بيمسح الطلب نهائيًا.</li>
        </ul>
      </HelpPanel>
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, phone, city, #" className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-[color:var(--border)] text-sm" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className="px-3 py-2 rounded-lg bg-white border border-[color:var(--border)] text-sm">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
        </select>
        <button type="button" onClick={load} disabled={loading} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-[color:var(--border)] text-sm disabled:opacity-60">
          <RefreshCcw className="h-4 w-4" /> Refresh
        </button>
      </div>
      {error ? (
        <div className="rounded-2xl bg-white border border-[color:var(--border)] p-5 text-sm text-red-700">
          Orders could not load: {error}
        </div>
      ) : loading ? <p className="text-sm text-[color:var(--muted-foreground)]">Loading...</p> : filtered.length === 0 ? (
        <p className="text-sm text-[color:var(--muted-foreground)]">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((o) => (
            <div key={o.id} className="rounded-2xl bg-white border border-[color:var(--border)] p-5 shadow-sm">
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
                  <div className="text-xs text-[color:var(--muted-foreground)]">{o.governorate ? `${o.governorate} · ` : ""}{o.city} — {o.address}{o.building ? `, ${o.building}` : ""}</div>
                  <div className="text-[10px] uppercase tracking-widest text-[color:var(--olive)] mt-1">Cash on Delivery</div>
                  {o.email && <div className="text-xs text-[color:var(--muted-foreground)]">{o.email}</div>}
                  {o.notes && <div className="text-xs text-[color:var(--muted-foreground)] italic mt-1">"{o.notes}"</div>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value as Order["status"])} className={`px-3 py-1.5 rounded-lg border border-[color:var(--border)] bg-white text-sm ${statusTone(o.status)}`}>
                    {STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
                  </select>
                  <div className="font-serif text-lg">EGP {Number(o.total).toFixed(2)}</div>
                  <button
                    type="button"
                    onClick={() => removeOrder(o)}
                    title="Delete order"
                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-red-200 text-red-700 bg-red-50 hover:bg-red-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
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
                  <span>Subtotal</span><span>EGP {Number(o.subtotal).toFixed(2)}</span>
                </li>
                <li className="flex justify-between text-xs text-[color:var(--muted-foreground)]">
                  <span>Shipping{o.governorate ? ` · ${o.governorate}` : ""}</span><span>EGP {Number(o.shipping_fee).toFixed(2)}</span>
                </li>
                <li className="flex justify-between text-sm font-medium pt-1 border-t border-[color:var(--border)] mt-1">
                  <span>Total (Cash on Delivery)</span><span>EGP {Number(o.total).toFixed(2)}</span>
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

function statusTone(s: Order["status"]) {
  return {
    new: "text-amber-700",
    confirmed: "text-blue-700",
    out_for_delivery: "text-indigo-700",
    delivered: "text-emerald-700",
    cancelled: "text-red-700",
  }[s];
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
  const [form, setForm] = useState<{
    brand_story?: string;
    footer_text?: string;
    content?: ContentMap;
  }>({});
  useEffect(() => {
    if (s)
      setForm({
        brand_story: s.brand_story,
        footer_text: s.footer_text,
        content: s.content ?? {},
      });
  }, [s]);

  const c: ContentMap = form.content ?? {};
  function setC(path: string, key: string, value: string) {
    setForm((prev) => ({
      ...prev,
      content: {
        ...(prev.content ?? {}),
        [path]: { ...((prev.content ?? {}) as any)[path], [key]: value },
      } as ContentMap,
    }));
  }

  const pages: { key: keyof ContentMap; title: string; titleAr: string; fields: { k: string; label: string; hint: string; multi?: boolean }[] }[] = [
    { key: "shop", title: "Shop page", titleAr: "صفحة المتجر", fields: [
      { k: "subtitle", label: "Small label above title", hint: "النص الصغير فوق العنوان" },
      { k: "title", label: "Page title", hint: "عنوان الصفحة" },
    ]},
    { key: "product", title: "Product page", titleAr: "صفحة المنتج", fields: [
      { k: "addToCart", label: "Add to cart button", hint: "نص زرار الإضافة للسلة" },
      { k: "soldOut", label: "Sold out label", hint: "نص علامة نفذت الكمية" },
      { k: "ingredientsTitle", label: "Ingredients section title", hint: "عنوان قسم المكونات" },
      { k: "storageTitle", label: "Storage section title", hint: "عنوان قسم التخزين" },
      { k: "shippingTitle", label: "Shipping section title", hint: "عنوان قسم الشحن" },
      { k: "relatedTitle", label: "Related products title", hint: "عنوان المنتجات المشابهة" },
    ]},
    { key: "blog", title: "Blog / About page", titleAr: "صفحة القصة", fields: [
      { k: "title", label: "Page headline", hint: "العنوان الرئيسي", multi: false },
      { k: "intro", label: "Intro paragraph", hint: "المقدمة", multi: true },
    ]},
    { key: "cart", title: "Cart page", titleAr: "صفحة السلة", fields: [
      { k: "title", label: "Cart title", hint: "عنوان صفحة السلة" },
      { k: "empty", label: "Empty state text", hint: "لما السلة فاضية" },
      { k: "checkout", label: "Checkout button", hint: "نص زرار الدفع" },
    ]},
    { key: "checkout", title: "Checkout page", titleAr: "صفحة الدفع", fields: [
      { k: "title", label: "Checkout title", hint: "عنوان صفحة الدفع" },
      { k: "submit", label: "Submit button", hint: "زرار تأكيد الطلب" },
    ]},
    { key: "footer", title: "Footer", titleAr: "الفوتر", fields: [
      { k: "brandLine", label: "Brand name", hint: "اسم البراند في الفوتر" },
      { k: "tagline", label: "Tagline", hint: "الجملة اللي جنب الاسم" },
    ]},
  ];

  return (
    <div>
      <PageHeader title="Content" subtitle="نصوص كل الصفحات في مكان واحد — عدّل واحفظ، والموقع يتحدث فورًا." />
      <HelpPanel title="نصوص الصفحات">
        <p>هنا تقدر تتحكم في كل النصوص المكتوبة في الموقع — كل صفحة ليها قسم بحقولها.</p>
        <ul className="list-inside list-disc space-y-1 pr-2">
          <li><b>Brand story</b>: قصة البراند في صفحة About / Blog.</li>
          <li>باقي الأقسام لكل صفحة نصوصها القابلة للتعديل.</li>
        </ul>
      </HelpPanel>

      <div className="grid gap-5 max-w-3xl">
        <div className="rounded-2xl bg-white p-6 border border-[color:var(--border)] shadow-sm grid gap-4">
          <Field label="Brand story" hint="قصة البراند اللي بتظهر في صفحة القصة">
            <textarea rows={5} value={form.brand_story ?? ""} onChange={(e) => setForm({ ...form, brand_story: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Footer text (legacy)" hint="نص إضافي في الفوتر">
            <input value={form.footer_text ?? ""} onChange={(e) => setForm({ ...form, footer_text: e.target.value })} className={inputClass} />
          </Field>
        </div>

        {pages.map((p) => (
          <div key={p.key} className="rounded-2xl bg-white p-6 border border-[color:var(--border)] shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-lg text-[color:var(--forest)]">{p.title}</h3>
              <span className="text-xs text-[color:var(--muted-foreground)]" dir="rtl">{p.titleAr}</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {p.fields.map((f) => {
                const val = ((c as any)[p.key] ?? {})[f.k] ?? "";
                return (
                  <Field key={f.k} label={f.label} hint={f.hint} className={f.multi ? "md:col-span-2" : ""}>
                    {f.multi ? (
                      <textarea rows={4} value={val} onChange={(e) => setC(p.key as string, f.k, e.target.value)} className={inputClass} />
                    ) : (
                      <input value={val} onChange={(e) => setC(p.key as string, f.k, e.target.value)} className={inputClass} />
                    )}
                  </Field>
                );
              })}
            </div>
          </div>
        ))}

        <div>
          <button
            onClick={() => saveSettings({ brand_story: form.brand_story, footer_text: form.footer_text, content: form.content } as Partial<SiteSettings>, refetch)}
            className="btn-primary"
          >
            Save all content
          </button>
        </div>
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
  return (
    <div>
      <PageHeader title="Social & Contact" subtitle="روابط السوشيال ميديا وبيانات التواصل." />
      <HelpPanel title="بيانات التواصل">
        <p>الروابط دي بتظهر في الفوتر وفي أي مكان في الموقع فيه أيقونات السوشيال.</p>
      </HelpPanel>
      <div className="rounded-2xl bg-white p-6 border border-[color:var(--border)] shadow-sm grid gap-4 max-w-2xl">
        <Field label="Instagram URL"><input value={form.instagram_url ?? ""} onChange={(e) => setForm({ ...form, instagram_url: e.target.value })} className={inputClass} /></Field>
        <Field label="TikTok URL"><input value={form.tiktok_url ?? ""} onChange={(e) => setForm({ ...form, tiktok_url: e.target.value })} className={inputClass} /></Field>
        <Field label="Contact email"><input value={form.contact_email ?? ""} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} className={inputClass} /></Field>
        <Field label="Phone / WhatsApp"><input value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} /></Field>
        <div><button onClick={() => saveSettings(form, refetch)} className="btn-primary">Save</button></div>
      </div>
    </div>
  );
}

/* ---------------- Newsletter ---------------- */
type Subscriber = { id: string; email: string; created_at: string };

function NewsletterAdmin() {
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setSubs((data ?? []) as Subscriber[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function removeSub(s: Subscriber) {
    if (!confirm(`Remove ${s.email}?`)) return;
    const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", s.id);
    if (error) { toast.error(error.message); return; }
    setSubs((prev) => prev.filter((x) => x.id !== s.id));
    toast.success("Removed");
  }

  function exportCsv() {
    const csv = ["email,created_at", ...subs.map((s) => `${s.email},${s.created_at}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "newsletter_subscribers.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <PageHeader title="Newsletter" subtitle="كل العملاء اللي اشتركوا في النشرة البريدية." />
      <HelpPanel title="قائمة المشتركين">
        <p>هنا هتلاقي كل عناوين البريد اللي اتسجلت من الفوتر. تقدر تحمّلها ملف CSV وتستخدمها في أي أداة إيميلات.</p>
      </HelpPanel>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-[color:var(--muted-foreground)]">{subs.length} subscribers</p>
        <button onClick={exportCsv} disabled={subs.length === 0} className="btn-primary disabled:opacity-60">Export CSV</button>
      </div>
      <div className="rounded-2xl bg-white border border-[color:var(--border)] shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-5 text-sm text-[color:var(--muted-foreground)]">Loading...</p>
        ) : subs.length === 0 ? (
          <p className="p-5 text-sm text-[color:var(--muted-foreground)]">No subscribers yet.</p>
        ) : (
          <ul className="divide-y divide-[color:var(--border)]">
            {subs.map((s) => (
              <li key={s.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <div>
                  <div>{s.email}</div>
                  <div className="text-[11px] text-[color:var(--muted-foreground)]">{new Date(s.created_at).toLocaleString()}</div>
                </div>
                <button onClick={() => removeSub(s)} className="text-xs text-red-700 hover:underline inline-flex items-center gap-1">
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ---------------- SEO ---------------- */
function SeoAdmin() {
  const { data: s, refetch } = useSettings();
  const [form, setForm] = useState<Partial<SiteSettings>>({});
  useEffect(() => { if (s) setForm({ seo_title: s.seo_title, seo_description: s.seo_description }); }, [s]);
  return (
    <div>
      <PageHeader title="SEO" subtitle="العنوان والوصف اللي بيظهروا في Google والشير على السوشيال." />
      <HelpPanel title="تحسين محركات البحث">
        <ul className="list-inside list-disc space-y-1 pr-2">
          <li><b>SEO Title</b>: عنوان الصفحة اللي بيظهر في نتائج Google (أقل من 60 حرف).</li>
          <li><b>SEO Description</b>: الوصف اللي بيظهر تحت العنوان (أقل من 160 حرف).</li>
          <li>ملاحظة: التغييرات دي بتُحفظ في قاعدة البيانات وممكن نربطها لاحقًا بالـ head tags تلقائيًا.</li>
        </ul>
      </HelpPanel>
      <div className="rounded-2xl bg-white p-6 border border-[color:var(--border)] shadow-sm grid gap-4 max-w-2xl">
        <Field label="SEO Title"><input value={form.seo_title ?? ""} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} className={inputClass} /></Field>
        <Field label="SEO Description"><textarea rows={3} value={form.seo_description ?? ""} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} className={inputClass} /></Field>
        <div><button onClick={() => saveSettings(form, refetch)} className="btn-primary">Save</button></div>
      </div>
    </div>
  );
}

/* ---------------- Announcement Bar ---------------- */
function AnnouncementAdmin() {
  const { data: s, refetch } = useSettings();
  const [form, setForm] = useState<Partial<SiteSettings>>({});
  useEffect(() => { if (s) setForm({ announcement_text: s.announcement_text, announcement_visible: s.announcement_visible }); }, [s]);
  return (
    <div>
      <PageHeader title="Announcement Bar" subtitle="شريط علوي بيظهر لكل الزوار — مناسب للعروض أو الأخبار." />
      <HelpPanel title="شريط الإعلان">
        <p>شريط لونه أخضر بيظهر فوق الموقع لأي زائر. استخدمه لعرض شحن مجاني، خصم، أو خبر.</p>
        <p>لما تشيل علامة <b>Visible</b> الشريط بيختفي.</p>
      </HelpPanel>
      <div className="rounded-2xl bg-white p-6 border border-[color:var(--border)] shadow-sm grid gap-4 max-w-2xl">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.announcement_visible ?? false} onChange={(e) => setForm({ ...form, announcement_visible: e.target.checked })} />
          Visible · ظاهر
        </label>
        <Field label="Announcement text"><input value={form.announcement_text ?? ""} onChange={(e) => setForm({ ...form, announcement_text: e.target.value })} className={inputClass} placeholder="Free shipping on orders over EGP 1000" /></Field>
        <div><button onClick={() => saveSettings(form, refetch)} className="btn-primary">Save</button></div>
      </div>
    </div>
  );
}

/* ---------------- Settings ---------------- */
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
      <PageHeader title="Settings" subtitle="الإعدادات العامة للمتجر — سعر الشحن الافتراضي." />
      <HelpPanel title="إعدادات المتجر">
        <p>سعر الشحن الافتراضي بيتحدد هنا. لو المحافظة ليها سعر مخصص، السعر بتاعها بيتطبق تلقائيًا في الـ Checkout.</p>
      </HelpPanel>
      <div className="rounded-2xl bg-white p-6 border border-[color:var(--border)] shadow-sm grid gap-4 max-w-md">
        <Field label="Default shipping fee (EGP)" hint="سعر الشحن الافتراضي بالجنيه">
          <input value={shipping} onChange={(e) => setShipping(e.target.value)} className={inputClass} />
        </Field>
        <div><button onClick={save} className="btn-primary">Save</button></div>
      </div>
    </div>
  );
}
