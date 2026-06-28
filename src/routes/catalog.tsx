import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { productsQuery } from "@/lib/queries";
import { TinIllustration } from "@/components/site/TinIllustration";
import { Stars } from "@/components/site/Stars";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

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
  const { data: products = [] } = useQuery(productsQuery);
  const [q, setQ] = useState("");
  const add = useCart((s) => s.add);

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.size.toLowerCase().includes(q.toLowerCase()),
      ),
    [products, q],
  );

  return (
    <main className="container-soft py-14">
      <header className="text-center mb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-[color:var(--olive)] mb-3">Catalog</p>
        <h1 className="font-serif text-4xl md:text-5xl">Ceremonial Grade Matcha</h1>
      </header>

      <div className="max-w-md mx-auto mb-12 relative">
        <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)]" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search matcha..."
          className="w-full pl-11 pr-4 py-3 rounded-full bg-[color:var(--cream)] border border-[color:var(--border)] focus:outline-none focus:ring-2 focus:ring-[color:var(--olive)]"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-8">
        {filtered.map((p) => (
          <article
            key={p.id}
            className="rounded-3xl bg-[color:var(--card)] border border-[color:var(--border)] p-6 md:p-8 flex flex-col"
          >
            <Link
              to="/product/$slug"
              params={{ slug: p.slug }}
              className={`rounded-2xl mb-6 p-6 flex justify-center ${
                p.slug === "ark-matcha-30g" ? "bg-[color:var(--cream)]" : "bg-[color:var(--pale)]"
              }`}
            >
              <TinIllustration
                variant={p.slug === "ark-matcha-30g" ? "30g" : "50g"}
                imageUrl={p.image_url || undefined}
                className="h-56 w-auto"
              />
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] tracking-widest uppercase px-2 py-1 rounded-full bg-[color:var(--pale)] text-[color:var(--forest)]">
                  Made in Japan
                </span>
                <span className="text-[10px] tracking-widest uppercase text-[color:var(--olive)]">
                  {p.size}
                </span>
              </div>
              <h2 className="font-serif text-2xl">{p.name}</h2>
              <Stars className="mt-1" />
              <p className="mt-3 text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                {p.short_description}
              </p>
              <div className="mt-4 font-serif text-xl text-[color:var(--forest)]">
                {p.price != null ? (
                  <>EGP {Number(p.price).toFixed(2)}</>
                ) : (
                  <span className="text-base text-[color:var(--muted-foreground)] italic">Price coming soon</span>
                )}
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  add({
                    productId: p.id,
                    slug: p.slug,
                    name: p.name,
                    size: p.size,
                    price: p.price,
                    image: p.image_url,
                  });
                  toast.success(`${p.name} added to cart`);
                }}
                className="btn-primary flex-1"
                disabled={!p.in_stock}
              >
                {p.in_stock ? "Add to Cart" : "Out of stock"}
              </button>
              <Link to="/product/$slug" params={{ slug: p.slug }} className="btn-ghost flex-1">
                View Details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
