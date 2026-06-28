import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery, settingsQuery } from "@/lib/queries";
import { getProductImage } from "@/lib/brand-assets";
import heroTins from "@/assets/ark-hero-tins.png.asset.json";

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
    <main>
      <section className="container-soft pb-10 pt-4 md:pt-6">
        <div className="relative overflow-hidden rounded-3xl bg-[color:var(--olive)]/5">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[360px]">
              <img
                src={heroTins.url}
                alt="Ark Matcha ceremonial grade tins"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent md:bg-gradient-to-r md:from-transparent md:to-white/10" />
            </div>
            <div className="flex flex-col items-start justify-center gap-4 p-6 md:p-10">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--olive)]">
                Ceremonial · Made in Japan
              </span>
              <h1 className="font-serif text-3xl leading-tight text-[color:var(--petal-strong)] md:text-5xl">
                A quiet ritual,<span className="block italic opacity-80">in every tin.</span>
              </h1>
              <p className="max-w-md text-sm text-[color:var(--olive)] md:text-base">
                Stone-milled, vivid, exceptionally smooth. Crafted for the matcha lover.
              </p>
              <Link
                to="/product/$slug"
                params={{ slug: "ark-matcha-30g" }}
                className="group mt-1 inline-flex items-center gap-2 rounded-full bg-[color:var(--petal-strong)] px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                Shop now
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center font-serif text-xl leading-snug text-[color:var(--petal-strong)] md:mt-14 md:text-3xl">
          Exceptionally smooth organic high ceremonial grade goodness for the matcha lover.
          <span className="block italic opacity-80"> Originated from Japan.</span>
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 md:mt-12 md:gap-8">
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
    </main>
  );
}
