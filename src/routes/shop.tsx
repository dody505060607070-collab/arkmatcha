import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery } from "@/lib/queries";
import { getProductImage } from "@/lib/brand-assets";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop | Ark Matcha" },
      { name: "description", content: "Shop Ark Matcha ceremonial grade matcha — 30g and 50g tins." },
      { property: "og:title", content: "Shop — Ark Matcha" },
      { property: "og:description", content: "Featured ceremonial grade matcha from Ark Matcha." },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(productsQuery);
  },
  component: Shop,
});

function Shop() {
  const { data: products } = useSuspenseQuery(productsQuery);

  return (
    <main>
      <section className="container-soft pb-12 pt-6 md:pt-10">
        <p className="text-center text-[11px] uppercase tracking-[0.35em] text-[color:var(--olive)]">
          Featured Product
        </p>
        <h1 className="mt-2 text-center font-serif text-2xl text-[color:var(--petal-strong)] md:text-3xl">
          The Ark Matcha Collection
        </h1>

        <div className="mt-8 grid grid-cols-2 gap-4 md:mt-10 md:gap-8">
          {products.map((product) => {
            const label = product.name;

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
