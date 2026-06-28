import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { productQuery, productsQuery } from "@/lib/queries";
import { TinIllustration } from "@/components/site/TinIllustration";
import { Stars } from "@/components/site/Stars";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Ark Matcha ${params.slug.includes("30") ? "30g" : "50g"} | Ceremonial Grade Matcha` },
      { property: "og:url", content: `/product/${params.slug}` },
      { property: "og:type", content: "product" },
    ],
    links: [{ rel: "canonical", href: `/product/${params.slug}` }],
  }),
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!product) throw notFound();
    await context.queryClient.ensureQueryData(productsQuery);
  },
  notFoundComponent: () => (
    <div className="container-soft py-24 text-center">
      <h1 className="font-serif text-3xl mb-3">Product not found</h1>
      <Link to="/catalog" className="btn-primary inline-flex mt-4">Back to catalog</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container-soft py-24 text-center">
      <h1 className="font-serif text-2xl">Couldn't load this product.</h1>
      <p className="text-sm text-[color:var(--muted-foreground)] mt-2">{error.message}</p>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product } = useQuery(productQuery(slug));
  const { data: products = [] } = useQuery(productsQuery);
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  if (!product) return null;
  const variant = product.slug === "ark-matcha-30g" ? "30g" : "50g";
  const related = products.filter((p) => p.id !== product.id);

  function addToCart() {
    if (!product) return;
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        size: product.size,
        price: product.price,
        image: product.image_url,
      },
      qty,
    );
    toast.success(`${product.name} added to cart`);
  }

  return (
    <main className="container-soft py-12 md:py-16">
      <div className="grid md:grid-cols-2 gap-12">
        <div className={`rounded-3xl p-8 md:p-12 ${variant === "30g" ? "bg-[color:var(--cream)]" : "bg-[color:var(--pale)]"}`}>
          <TinIllustration variant={variant} imageUrl={product.image_url || undefined} className="w-full h-auto max-h-[520px]" />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] tracking-widest uppercase px-2 py-1 rounded-full bg-[color:var(--pale)] text-[color:var(--forest)]">
              Made in Japan
            </span>
            <span className="text-[10px] tracking-widest uppercase text-[color:var(--olive)]">{product.size}</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl mb-3">{product.name}</h1>
          <Stars className="mb-4" />
          <div className="font-serif text-2xl text-[color:var(--forest)] mb-6">
            {product.price != null ? `EGP ${Number(product.price).toFixed(2)}` : <span className="italic text-base text-[color:var(--muted-foreground)]">Price coming soon</span>}
          </div>
          <p className="text-[color:var(--muted-foreground)] leading-relaxed">{product.description}</p>

          <div className="mt-7 flex items-center gap-4">
            <div className="flex items-center border border-[color:var(--border)] rounded-full overflow-hidden">
              <button aria-label="Decrease" onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 hover:bg-[color:var(--pale)]">
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 min-w-[2.5rem] text-center">{qty}</span>
              <button aria-label="Increase" onClick={() => setQty((q) => q + 1)} className="p-3 hover:bg-[color:var(--pale)]">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button onClick={addToCart} className="btn-primary flex-1" disabled={!product.in_stock}>
              {product.in_stock ? "Add to Cart" : "Out of stock"}
            </button>
          </div>
          <button
            onClick={() => {
              addToCart();
              navigate({ to: "/checkout" });
            }}
            className="btn-ghost mt-3 w-full"
            disabled={!product.in_stock}
          >
            Buy Now
          </button>

          <div className="mt-8 text-sm text-[color:var(--muted-foreground)]">
            Payment is available by Cash on Delivery.
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <section className="mt-20">
        <h2 className="font-serif text-3xl mb-6">Key Benefits</h2>
        <ul className="grid sm:grid-cols-2 gap-3">
          {product.key_benefits.map((b) => (
            <li key={b} className="px-5 py-4 rounded-2xl bg-[color:var(--card)] border border-[color:var(--border)]">
              · {b}
            </li>
          ))}
        </ul>
      </section>

      {/* Nutrition + Ingredients */}
      <section className="mt-20 grid md:grid-cols-2 gap-8">
        <div className="rounded-3xl p-8 bg-[color:var(--card)] border border-[color:var(--border)]">
          <h2 className="font-serif text-2xl mb-2">Nutrition Facts</h2>
          <p className="text-xs uppercase tracking-widest text-[color:var(--olive)] mb-4">{product.nutrition.serving ?? "per 2g"}</p>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-[color:var(--border)]">
              {[
                ["Energy", product.nutrition.energy],
                ["Protein", product.nutrition.protein],
                ["Fat", product.nutrition.fat],
                ["Sugar", product.nutrition.sugar],
                ["Total Carbohydrate", product.nutrition.carbs],
              ].map(([k, v]) => (
                <tr key={k}>
                  <td className="py-2.5 text-[color:var(--muted-foreground)]">{k}</td>
                  <td className="py-2.5 text-right font-medium">{v ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-[color:var(--muted-foreground)] mt-4">Made in Japan.</p>
        </div>
        <div className="rounded-3xl p-8 bg-[color:var(--card)] border border-[color:var(--border)] flex flex-col gap-6">
          <div>
            <h3 className="font-serif text-xl mb-2">Ingredients</h3>
            <p className="text-sm text-[color:var(--muted-foreground)]">{product.ingredients}</p>
          </div>
          <div>
            <h3 className="font-serif text-xl mb-2">Storage</h3>
            <p className="text-sm text-[color:var(--muted-foreground)]">{product.storage}</p>
          </div>
          <div>
            <h3 className="font-serif text-xl mb-2">Payment</h3>
            <p className="text-sm text-[color:var(--muted-foreground)]">Payment is available by Cash on Delivery.</p>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-serif text-3xl mb-6">You may also like</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {related.map((p) => (
              <Link
                key={p.id}
                to="/product/$slug"
                params={{ slug: p.slug }}
                className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 flex gap-5 items-center hover:-translate-y-0.5 transition-transform"
              >
                <div className={`p-3 rounded-xl ${p.slug === "ark-matcha-30g" ? "bg-[color:var(--cream)]" : "bg-[color:var(--pale)]"}`}>
                  <TinIllustration
                    variant={p.slug === "ark-matcha-30g" ? "30g" : "50g"}
                    imageUrl={p.image_url || undefined}
                    className="h-24 w-auto"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-xl">{p.name}</h3>
                  <p className="text-sm text-[color:var(--muted-foreground)]">{p.short_description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
