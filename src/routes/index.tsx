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
    <main className="bg-white">
      <section className="container-soft pb-12 pt-6 md:pt-10">
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
                <h3 className="mt-3 text-sm font-medium text-[color:var(--petal-strong)] md:text-base">
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
