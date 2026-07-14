import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery, settingsQuery } from "@/lib/queries";
import { getProductImage } from "@/lib/brand-assets";
import { useContent } from "@/lib/useContent";

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
    await Promise.all([
      context.queryClient.ensureQueryData(productsQuery),
      context.queryClient.ensureQueryData(settingsQuery),
    ]);
  },
  component: Shop,
});

function Shop() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const c = useContent();
  const subtitle = c.shop?.subtitle || "Featured Product";
  const title = c.shop?.title || "The Ark Matcha Collection";

  return (
    <main>
      <section className="container-soft pb-12 pt-6 md:pt-10">
        <p className="text-center text-[11px] uppercase tracking-[0.35em] text-[color:var(--olive)]">
          {subtitle}
        </p>
        <h1 className="mt-2 text-center font-serif text-2xl text-[color:var(--petal-strong)] md:text-3xl">
          {title}
        </h1>

        <div className="mt-8 grid grid-cols-2 gap-4 md:mt-10 md:gap-8">
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
