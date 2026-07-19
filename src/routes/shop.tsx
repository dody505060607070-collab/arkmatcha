import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { productsQuery, settingsQuery, type Product } from "@/lib/queries";
import { getProductImage } from "@/lib/brand-assets";
import { useContent } from "@/lib/useContent";
import { Newsletter } from "@/components/site/Newsletter";
import { ProductCardImage } from "@/components/site/ProductCardImage";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Products | Ark Matcha" },
      { name: "description", content: "Shop Ark Matcha ceremonial grade matcha — 30g and 50g tins." },
      { property: "og:title", content: "Products — Ark Matcha" },
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

type Availability = "all" | "in_stock" | "sold_out";
type PriceSort = "featured" | "price_asc" | "price_desc";
type AlphaSort = "none" | "az" | "za";

function pickSecondary(product: Product): string | null {
  const main = getProductImage(product.slug, product.image_url);
  const gallery = (product.gallery ?? []).filter(Boolean);
  const secondary = gallery.find((g) => g && g !== main);
  return secondary ?? null;
}

function Shop() {
  const { data: allProducts } = useSuspenseQuery(productsQuery);
  const c = useContent();
  const title = c.shop?.title || "Products";

  const products = allProducts;

  return (
    <main>
      <section className="container-soft pt-8 md:pt-12">
        <h1 className="font-serif text-4xl text-[color:var(--forest)] md:text-6xl">
          {title}
        </h1>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {products.map((product) => {
            const label = product.name;
            const main = getProductImage(product.slug, product.image_url);
            const secondary = pickSecondary(product);
            return (
              <Link
                key={product.id}
                to="/product/$slug"
                params={{ slug: product.slug }}
                className="group block reveal"
              >
                {product.image_visible !== false ? (
                  <div className="relative overflow-hidden rounded-2xl bg-white">
                    <ProductCardImage main={main} secondary={secondary} alt={label} />
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

                <span className="mt-2 block text-[10px] uppercase tracking-[0.2em] text-[color:var(--matcha)]">
                  Ark Matcha
                </span>
                <h3 className="mt-0.5 text-sm font-medium text-[color:var(--forest)] md:text-base">
                  {label}
                </h3>
                {product.price_visible !== false && product.price ? (
                  (product.discount_percentage ?? 0) > 0 ? (
                    <p className="mt-1 text-sm md:text-base">
                      <span className="text-[color:var(--forest)]">
                        LE {(Number(product.price) * (1 - product.discount_percentage / 100)).toFixed(2)} EGP
                      </span>
                      <span className="ml-2 text-xs text-[color:var(--forest)]/50 line-through">
                        {Number(product.price).toFixed(2)}
                      </span>
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-[color:var(--forest)] md:text-base">
                      LE {Number(product.price).toFixed(2)} EGP
                    </p>
                  )
                ) : (
                  <p className="mt-1 text-xs text-[color:var(--forest)]/70">
                    Price coming soon
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Newsletter — matches the home page style */}
      <section className="container-soft py-16 text-center">
        <h2 className="font-serif text-3xl text-[color:var(--forest)] md:text-4xl">
          Subscribe to our emails
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-[color:var(--forest)]/70">
          Join our email list for exclusive offers and the latest news.
        </p>
        <div className="mx-auto mt-6 max-w-md">
          <Newsletter compact />
        </div>
      </section>
    </main>
  );
}
