import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery, settingsQuery } from "@/lib/queries";
import { getProductImage } from "@/lib/brand-assets";
import matchaSpread from "@/assets/matcha-spread.jpg";
import { ReviewsMarquee } from "@/components/site/ReviewsMarquee";
import { Newsletter } from "@/components/site/Newsletter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ark Matcha | Ceremonial Grade Matcha Made in Japan" },
      { property: "og:title", content: "Ark Matcha — Ceremonial Grade Matcha" },
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

  return (
    <main className="bg-white">
      <section className="container-soft pb-8 pt-4 md:pt-8">
        <p className="mx-auto max-w-2xl text-center font-serif text-xl leading-snug text-[color:var(--petal-strong)] md:text-3xl">
          Exceptionally smooth organic high ceremonial grade goodness for the matcha lover.
          <span className="block italic opacity-80"> Originated from Japan.</span>
        </p>
        <div className="mt-6 overflow-hidden rounded-2xl md:mt-10">
          <img
            src={matchaSpread}
            alt="Ceremonial grade matcha powder spread on a clean surface"
            width={1536}
            height={1024}
            className="h-[220px] w-full object-cover md:h-[420px]"
          />
        </div>
      </section>

      <section className="container-soft pb-12 pt-2 md:pt-4">
        <h1 className="mb-6 font-serif text-3xl text-[color:var(--petal-strong)] md:mb-10 md:text-5xl">
          The Goods
        </h1>

        <div className="grid grid-cols-2 gap-4 md:gap-8">
          {products.map((product) => {
            const label = product.size?.includes("50")
              ? "Ceremonial Grade Matcha 50g"
              : "Ceremonial Grade Matcha 30g";
            return (
              <Link
                key={product.id}
                to="/product/$slug"
                params={{ slug: product.slug }}
                className="group block"
              >
                {product.image_visible !== false ? (
                  <div className="overflow-hidden rounded-2xl bg-white">
                    <img
                      src={getProductImage(product.slug, product.image_url)}
                      alt={label}
                      loading="lazy"
                      className="aspect-square w-full object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.04]"
                    />
                  </div>
                ) : null}
                <span className="mt-2 block text-[10px] uppercase tracking-[0.2em] text-[color:var(--olive)]">
                  Ark Matcha
                </span>
                <h3 className="mt-0.5 text-sm font-medium text-[color:var(--petal-strong)] md:text-base">
                  {label}
                </h3>
                {product.price_visible !== false && product.price ? (
                  <p className="mt-1 text-sm text-[color:var(--petal-strong)] md:text-base">
                    LE {Number(product.price).toFixed(2)} EGP
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-[color:var(--petal-strong)] opacity-70">
                    Price coming soon
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      <ReviewsMarquee />

      <section className="container-soft py-10 md:py-14">
        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-4 text-center">
          {[
            { t: "Simple", d: "Two tins. One ritual." },
            { t: "Clean", d: "Pure, organic, single origin." },
            { t: "Ceremony", d: "Made for the everyday ritual." },
          ].map((p) => (
            <div key={p.t} className="rounded-2xl border border-[color:var(--border)] bg-white px-3 py-4">
              <h3 className="font-serif text-base text-[color:var(--petal-strong)] md:text-lg">{p.t}</h3>
              <p className="mt-1 text-xs text-[color:var(--muted-foreground)] md:text-sm">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-soft py-10 md:py-14">
        <div className="mx-auto max-w-2xl rounded-2xl border border-[color:var(--border)] bg-white p-6 md:p-8">
          <h2 className="text-center font-serif text-2xl text-[color:var(--petal-strong)] md:text-3xl">
            Nutrition Facts
          </h2>
          <p className="mt-1 text-center text-xs text-[color:var(--muted-foreground)]">Per 1g serving</p>
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-sm md:text-base">
            {[
              ["Calories", "3 kcal"],
              ["Protein", "0.3 g"],
              ["Carbohydrates", "0.4 g"],
              ["Fat", "0.05 g"],
              ["Catechins (EGCG)", "60 mg"],
              ["L-Theanine", "14 mg"],
              ["Caffeine", "30 mg"],
              ["Antioxidants", "High"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-dashed border-[color:var(--border)] py-1">
                <dt className="text-[color:var(--muted-foreground)]">{k}</dt>
                <dd className="text-[color:var(--petal-strong)]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
