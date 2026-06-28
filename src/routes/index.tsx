import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery, settingsQuery } from "@/lib/queries";
import { getProductImage } from "@/lib/brand-assets";
import heroFlatlay from "@/assets/ark-hero-flatlay.jpeg.asset.json";

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
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preload", as: "image", href: heroFlatlay.url, fetchpriority: "high" },
    ],
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
          <div className="grid grid-cols-2">
            <div className="relative bg-[color:var(--olive)]/5">
              <img
                src={heroFlatlay.url}
                alt="Ark Matcha ceremonial grade tins"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width={800}
                height={800}
                className="block h-full w-full object-contain"
              />
            </div>

            <div className="flex flex-col items-start justify-center gap-3 p-4 md:gap-5 md:p-10">
              <span className="text-[9px] uppercase tracking-[0.25em] text-[color:var(--olive)] md:text-[11px] md:tracking-[0.3em]">
                Ceremonial · Japan
              </span>
              <h1 className="font-serif text-lg leading-snug text-[color:var(--petal-strong)] md:text-5xl md:leading-tight">
                The ritual<span className="block italic opacity-80">starts here.</span>
              </h1>
              <p className="max-w-md text-[11px] leading-relaxed text-[color:var(--olive)] md:text-base">
                Vivid. Smooth. Born in Japan. One tin, endless calm.
              </p>
              <Link
                to="/shop"
                className="group mt-1 inline-flex items-center gap-2 rounded-full bg-[color:var(--matcha)] px-4 py-2 text-[11px] font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md md:px-6 md:py-3 md:text-sm"
              >
                Shop now
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-[11px] uppercase tracking-[0.35em] text-[color:var(--olive)] md:mt-16">
          Featured Product
        </p>

        <div className="mt-4 grid grid-cols-2 gap-4 md:mt-6 md:gap-8">
          {products.map((product) => {
            const label = product.name;
            return (
              <Link
                key={product.id}
                to="/product/$slug"
                params={{ slug: product.slug }}
                className="group block reveal"
              >
                {product.image_visible !== false ? (
                  <div className="relative overflow-hidden rounded-2xl bg-white">
                    <img
                      src={getProductImage(product.slug, product.image_url)}
                      alt={label}
                      loading="lazy"
                      decoding="async"
                      width={600}
                      height={600}
                      className="aspect-square w-full object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.04]"
                    />
                    {product.in_stock === false && (
                      <span className="absolute left-2 top-2 rounded-full bg-[color:var(--matcha)] px-2.5 py-1 text-[9px] font-medium uppercase tracking-widest text-white shadow-sm">
                        Sold out
                      </span>
                    )}
                    {product.in_stock !== false && (product.discount_percentage ?? 0) > 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-[color:var(--matcha)] px-2.5 py-1 text-[9px] font-medium uppercase tracking-widest text-white shadow-sm">
                        -{product.discount_percentage}%
                      </span>
                    )}
                  </div>
                ) : null}

                <span className="mt-2 block text-[10px] uppercase tracking-[0.2em] text-[color:var(--olive)]">
                  Ark Matcha
                </span>
                <h3 className="mt-0.5 text-sm font-medium text-[color:var(--petal-strong)] md:text-base">
                  {label}
                </h3>
                {product.price_visible !== false && product.price ? (
                  (product.discount_percentage ?? 0) > 0 ? (
                    <p className="mt-1 text-sm md:text-base">
                      <span className="text-[color:var(--petal-strong)]">
                        LE {(Number(product.price) * (1 - product.discount_percentage / 100)).toFixed(2)} EGP
                      </span>
                      <span className="ml-2 text-xs text-[color:var(--muted-foreground)] line-through">
                        {Number(product.price).toFixed(2)}
                      </span>
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-[color:var(--petal-strong)] md:text-base">
                      LE {Number(product.price).toFixed(2)} EGP
                    </p>
                  )
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

