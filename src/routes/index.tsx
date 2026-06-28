import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Leaf, Package, Sparkles, Sun, MapPin, ArrowRight } from "lucide-react";
import { Newsletter } from "@/components/site/Newsletter";
import { productsQuery, settingsQuery } from "@/lib/queries";
import { brandAssets, getProductImage } from "@/lib/brand-assets";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ark Matcha | Ceremonial Grade Matcha Made in Japan" },
      { property: "og:title", content: "Ark Matcha — Pure Ritual. Smooth Energy." },
      {
        property: "og:description",
        content: "Ceremonial grade matcha in 30g and 50g elegant tins. Made in Japan.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(productsQuery),
      context.queryClient.ensureQueryData(settingsQuery),
    ]);
  },
  component: Home,
});

function Home() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const { data: settings } = useSuspenseQuery(settingsQuery);

  return (
    <main>
      <section className="container-soft py-6 md:py-8">
        <h1 className="sr-only">{settings?.hero_headline ?? "Pure Ritual. Smooth Energy."}</h1>
        <div className="soft-panel overflow-hidden p-3 md:p-4">
          <picture>
            <source media="(max-width: 767px)" srcSet={settings?.hero_image || brandAssets.heroMobile} />
            <img
              src={settings?.hero_image || brandAssets.heroDesktop}
              alt="Ark Matcha hero showing the 30g and 50g ceremonial grade tins"
              className="w-full rounded-[1.5rem] object-cover object-top max-h-[330px] md:max-h-[460px]"
            />
          </picture>
          <div className="grid gap-4 px-2 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:px-4">
            <p className="min-w-0 text-sm leading-relaxed text-[color:var(--muted-foreground)]">
              {settings?.hero_subheadline ??
                "Ceremonial grade matcha in two elegant sizes, crafted for calm daily moments."}
            </p>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link to="/catalog" className="btn-primary">
                Shop Matcha
              </Link>
              <a href="#ritual" className="btn-ghost">
                Explore the Ritual
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="ritual" className="container-soft py-12 md:py-16">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[color:var(--petal-strong)]">Choose Your Ritual</p>
          <h2 className="font-serif text-3xl md:text-5xl">Two elegant tins for calm daily moments.</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {products.map((product, index) => (
            <Link
              key={product.id}
              to="/product/$slug"
              params={{ slug: product.slug }}
              className="product-sachet grid gap-6 p-6 transition-transform hover:-translate-y-1 md:grid-cols-[minmax(0,1fr)_220px] md:items-center md:p-8"
            >
              <div className="min-w-0">
                <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[color:var(--olive)]">
                  <span>Made in Japan</span>
                  <span>•</span>
                  <span>{product.size}</span>
                </div>
                <h3 className="font-serif text-3xl text-[color:var(--forest)]">{product.name}</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-[color:var(--muted-foreground)]">
                  {index === 0
                    ? "Light, elegant, and perfect for trying your first daily matcha ritual."
                    : "Deeper, richer, and made for your everyday matcha routine."}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--forest)]">
                  View product <ArrowRight className="h-4 w-4" />
                </div>
              </div>

              <div className="soft-panel overflow-hidden p-4">
                <img
                  src={getProductImage(product.slug, product.image_url)}
                  alt={product.name}
                  loading="lazy"
                  className="h-[280px] w-full rounded-[1.5rem] object-cover"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Reviews marquee — thin slider that keeps moving across the page */}
      <ReviewsMarquee />

      {/* Why Ark Matcha — compact pill row */}
      <section className="container-soft py-6 md:py-8">
        <div className="soft-panel px-4 py-4 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs text-[color:var(--forest)] md:text-sm">
            {[
              { icon: Leaf, label: "Ceremonial Grade" },
              { icon: Sparkles, label: "Smooth Energy" },
              { icon: MapPin, label: "Made in Japan" },
              { icon: Package, label: "Beautifully Packed" },
              { icon: Sun, label: "Daily Ritual" },
            ].map((f) => (
              <span key={f.label} className="inline-flex items-center gap-1.5">
                <f.icon className="h-3.5 w-3.5 text-[color:var(--petal-strong)]" />
                <span className="whitespace-nowrap">{f.label}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="container-soft py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_420px] md:items-center">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[color:var(--petal-strong)]">Simple. Clean. Ceremonial.</p>
            <h2 className="mb-4 font-serif text-4xl">A calm green ritual in every 2g serving.</h2>
            <p className="text-[color:var(--muted-foreground)]">
              Every 2g serving is light, smooth, and made for a calm daily matcha ritual.
            </p>
          </div>
          <div className="soft-panel p-7 md:p-8">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-[color:var(--border)]">
                {[
                  ["Energy", "7.48 KJ"],
                  ["Protein", "0.64 g"],
                  ["Fat", "0.00 g"],
                  ["Sugar", "0.00 g"],
                  ["Total Carbohydrate", "1.14 g"],
                ].map(([key, value]) => (
                  <tr key={key}>
                    <td className="py-3 text-[color:var(--muted-foreground)]">{key}</td>
                    <td className="py-3 text-right font-medium text-[color:var(--forest)]">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}

const REVIEWS = [
  { text: "Smoothest matcha I've ever had — calm energy all morning.", name: "Hana, Cairo" },
  { text: "Beautifully packed and the color is so vibrant.", name: "Omar, Alexandria" },
  { text: "My new daily ritual. It just feels premium.", name: "Lina, Dubai" },
  { text: "Tastes clean, no bitterness. Worth every gram.", name: "Sara, Riyadh" },
  { text: "Perfect for a soft latte in the afternoon.", name: "Youssef, Cairo" },
  { text: "Honestly the best ceremonial matcha I've tried.", name: "Mariam, Giza" },
];

function ReviewsMarquee() {
  const items = [...REVIEWS, ...REVIEWS];
  return (
    <section
      aria-label="Customer reviews"
      className="overflow-hidden border-y border-[color:var(--border)] py-3"
      style={{ background: "color-mix(in oklab, white 60%, var(--petal) 40%)" }}
    >
      <div className="marquee-track gap-10 text-xs text-[color:var(--forest)] md:text-sm">
        {items.map((r, i) => (
          <span key={i} className="inline-flex shrink-0 items-center gap-2">
            <span className="text-[color:var(--petal-strong)]">★★★★★</span>
            <span className="opacity-85">“{r.text}”</span>
            <span className="opacity-60">— {r.name}</span>
            <span className="px-3 text-[color:var(--petal-strong)]">•</span>
          </span>
        ))}
      </div>
    </section>
  );
}

