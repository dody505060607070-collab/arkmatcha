import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery, settingsQuery } from "@/lib/queries";
import { getProductImage } from "@/lib/brand-assets";

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
      <section className="container-soft pb-10 pt-6 md:pt-10">
        <p className="mx-auto max-w-2xl text-center font-serif text-xl leading-snug text-[color:var(--petal-strong)] md:text-3xl">
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
