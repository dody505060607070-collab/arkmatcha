import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { productsQuery, settingsQuery } from "@/lib/queries";
import { TinIllustration } from "@/components/site/TinIllustration";
import { Newsletter } from "@/components/site/Newsletter";
import { Leaf, Sparkles, Package, MapPin, Sun } from "lucide-react";

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
  const { data: products = [] } = useQuery(productsQuery);
  const { data: settings } = useQuery(settingsQuery);

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[color:var(--pale)]">
        <div className="container-soft grid md:grid-cols-2 gap-12 items-center py-16 md:py-24">
          <div className="order-2 md:order-1">
            <p className="text-xs tracking-[0.3em] uppercase text-[color:var(--olive)] mb-5">
              Ceremonial Grade · Made in Japan
            </p>
            <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] text-[color:var(--forest)]">
              {settings?.hero_headline ?? "Pure Ritual. Smooth Energy."}
            </h1>
            <p className="mt-6 text-lg text-[color:var(--muted-foreground)] max-w-md">
              {settings?.hero_subheadline ??
                "Ceremonial grade matcha in two elegant sizes, crafted for calm daily moments."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/catalog" className="btn-primary">Shop Matcha</Link>
              <a href="#ritual" className="btn-ghost">Explore the Ritual</a>
            </div>
          </div>
          <div className="order-1 md:order-2 relative">
            {settings?.hero_image ? (
              <img
                src={settings.hero_image}
                alt="Ark Matcha ceremonial ritual"
                className="w-full h-[420px] md:h-[520px] object-cover rounded-3xl shadow-lg"
              />
            ) : (
              <div className="relative aspect-[4/5] md:aspect-square rounded-3xl bg-gradient-to-br from-[color:var(--stone)] via-[color:var(--cream)] to-[color:var(--pale)] flex items-end justify-center p-8 shadow-inner">
                <div className="flex gap-4 items-end">
                  <TinIllustration variant="30g" className="w-32 md:w-44" />
                  <TinIllustration variant="50g" className="w-40 md:w-56" />
                </div>
                <div className="absolute top-6 left-6 text-xs tracking-widest text-[color:var(--olive)] uppercase">
                  Two Sizes · 30g & 50g
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Coming soon banner */}
      <section className="bg-[color:var(--forest)] text-[color:var(--cream)]">
        <div className="container-soft py-4 text-center text-sm tracking-widest uppercase">
          {settings?.coming_soon_text ?? "Launching Soon"}
        </div>
      </section>

      {/* Products */}
      <section id="ritual" className="container-soft py-20">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-[color:var(--olive)] mb-3">
            Two Sizes
          </p>
          <h2 className="font-serif text-4xl md:text-5xl">Choose Your Ritual</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {products.map((p) => (
            <Link
              key={p.id}
              to="/product/$slug"
              params={{ slug: p.slug }}
              className="group rounded-3xl bg-[color:var(--card)] p-8 md:p-10 transition-all hover:-translate-y-1 hover:shadow-xl shadow-sm border border-[color:var(--border)]"
            >
              <div className={`rounded-2xl mb-6 p-6 flex justify-center ${
                p.slug === "ark-matcha-30g" ? "bg-[color:var(--cream)]" : "bg-[color:var(--pale)]"
              }`}>
                <TinIllustration
                  variant={p.slug === "ark-matcha-30g" ? "30g" : "50g"}
                  imageUrl={p.image_url || undefined}
                  className="h-64 w-auto"
                />
              </div>
              <div className="flex items-baseline justify-between">
                <h3 className="font-serif text-2xl">{p.name}</h3>
                <span className="text-xs tracking-widest text-[color:var(--olive)] uppercase">{p.size}</span>
              </div>
              <p className="mt-3 text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                {p.short_description}
              </p>
              <div className="mt-5 text-sm font-medium text-[color:var(--forest)] group-hover:underline">
                View product →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="bg-[color:var(--pale)]">
        <div className="container-soft py-20">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl">Why Ark Matcha</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { icon: Leaf, label: "Ceremonial Grade" },
              { icon: Sparkles, label: "Smooth Natural Energy" },
              { icon: MapPin, label: "Made in Japan" },
              { icon: Package, label: "Beautifully Packed" },
              { icon: Sun, label: "Made for Daily Rituals" },
            ].map((f) => (
              <div key={f.label} className="text-center p-6 rounded-2xl bg-[color:var(--cream)]/60">
                <f.icon className="h-6 w-6 mx-auto mb-3 text-[color:var(--olive)]" />
                <p className="text-sm font-medium">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nutrition preview */}
      <section className="container-soft py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[color:var(--olive)] mb-3">
              Per 2g serving
            </p>
            <h2 className="font-serif text-4xl mb-4">Simple. Clean. Ceremonial.</h2>
            <p className="text-[color:var(--muted-foreground)]">
              Every 2g serving is light, smooth, and made for a calm daily matcha ritual.
            </p>
          </div>
          <div className="rounded-3xl bg-[color:var(--card)] p-8 border border-[color:var(--border)]">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-[color:var(--border)]">
                {[
                  ["Energy", "7.48 KJ"],
                  ["Protein", "0.64 g"],
                  ["Fat", "0.00 g"],
                  ["Sugar", "0.00 g"],
                  ["Total Carbohydrate", "1.14 g"],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <td className="py-3 text-[color:var(--muted-foreground)]">{k}</td>
                    <td className="py-3 text-right font-medium">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Brand story */}
      <section className="bg-[color:var(--cream)] border-y border-[color:var(--border)]">
        <div className="container-soft py-20 max-w-3xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-5">Matcha Made Simple</h2>
          <p className="text-[color:var(--muted-foreground)] leading-relaxed">
            {settings?.brand_story}
          </p>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
