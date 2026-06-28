import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { productsQuery } from "@/lib/queries";
import { Stars } from "@/components/site/Stars";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import { getProductImage } from "@/lib/brand-assets";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Catalog — Ark Matcha" },
      { name: "description", content: "Ark Matcha ceremonial grade matcha — 30g and 50g tins, made in Japan." },
      { property: "og:title", content: "Ark Matcha Catalog" },
      { property: "og:url", content: "/catalog" },
    ],
    links: [{ rel: "canonical", href: "/catalog" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: CatalogPage,
});

function CatalogPage() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const [query, setQuery] = useState("");
  const add = useCart((s) => s.add);

  const filtered = useMemo(
    () =>
      products.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.size.toLowerCase().includes(query.toLowerCase()),
      ),
    [products, query],
  );

  return (
    <main className="container-soft py-12 md:py-14">
      <header className="mb-10 text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[color:var(--petal-strong)]">Catalog</p>
        <h1 className="font-serif text-4xl md:text-5xl">Ceremonial Grade Matcha</h1>
      </header>

      <div className="relative mx-auto mb-12 max-w-md">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted-foreground)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search matcha..."
          className="w-full rounded-full border border-[color:var(--border)] bg-[color:var(--card)] py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
        />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {filtered.map((product) => (
          <article key={product.id} className="product-sachet p-5 md:p-6">
            {product.image_visible !== false ? (
              <Link to="/product/$slug" params={{ slug: product.slug }} className="soft-panel block overflow-hidden p-3">
                <img
                  src={getProductImage(product.slug, product.image_url)}
                  alt={product.name}
                  loading="lazy"
                  className="h-[320px] w-full rounded-[1.5rem] object-cover"
                />
              </Link>
            ) : null}

            <div className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[color:var(--olive)]">
              <span className="rounded-full bg-[color:var(--pale)] px-2 py-1 text-[color:var(--forest)]">Made in Japan</span>
              <span>{product.size}</span>
            </div>

            <h2 className="mt-4 font-serif text-2xl text-[color:var(--forest)]">{product.name}</h2>
            <Stars className="mt-2" />
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted-foreground)]">{product.short_description}</p>
            <div className="mt-4 font-serif text-xl text-[color:var(--forest)]">
              {product.price_visible !== false && product.price != null ? (
                <>EGP {Number(product.price).toFixed(2)}</>
              ) : (
                <span className="text-base italic text-[color:var(--muted-foreground)]">Price coming soon</span>
              )}
            </div>


            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  add({
                    productId: product.id,
                    slug: product.slug,
                    name: product.name,
                    size: product.size,
                    price: product.price,
                    image: getProductImage(product.slug, product.image_url),
                  });
                  toast.success(`${product.name} added to cart`);
                }}
                className="btn-primary flex-1"
                disabled={!product.in_stock}
              >
                {product.in_stock ? "Add to Cart" : "Out of stock"}
              </button>
              <Link to="/product/$slug" params={{ slug: product.slug }} className="btn-ghost flex-1">
                View Details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
