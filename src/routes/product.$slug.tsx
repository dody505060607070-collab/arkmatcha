import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { productQuery, productsQuery } from "@/lib/queries";
import { Stars } from "@/components/site/Stars";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import { brandAssets, getProductGallery, getProductImage } from "@/lib/brand-assets";

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
      <h1 className="mb-3 font-serif text-3xl">Product not found</h1>
      <Link to="/catalog" className="btn-primary mt-4 inline-flex">
        Back to catalog
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container-soft py-24 text-center">
      <h1 className="font-serif text-2xl">Couldn't load this product.</h1>
      <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">{error.message}</p>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQuery(slug));
  const { data: products } = useSuspenseQuery(productsQuery);
  const add = useCart((s) => s.add);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const navigate = useNavigate();

  const gallery = useMemo(() => {
    const base = getProductGallery(product);
    return Array.from(new Set([...base, brandAssets.matchaPowder]));
  }, [product]);

  const selectedImage = activeImage ?? gallery[0] ?? getProductImage(product.slug, product.image_url);
  const related = products.filter((item) => item.id !== product.id);

  function addToCart() {
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        size: product.size,
        price: product.price,
        image: getProductImage(product.slug, product.image_url),
      },
      quantity,
    );
    toast.success(`${product.name} added to cart`);
  }

  return (
    <main className="container-soft py-12 md:py-16">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:items-start">
        <div className="grid gap-4">
          <div className="soft-panel overflow-hidden p-4">
            <img src={selectedImage} alt={product.name} className="w-full rounded-[1.75rem] object-cover" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {gallery.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveImage(image)}
                className="soft-panel overflow-hidden p-2"
                aria-label={`View image ${index + 1}`}
                style={{
                  borderColor:
                    selectedImage === image
                      ? "color-mix(in oklab, var(--petal-strong) 50%, white 50%)"
                      : undefined,
                }}
              >
                <img src={image} alt={`${product.name} preview ${index + 1}`} className="h-28 w-full rounded-[1rem] object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="soft-panel p-7 md:p-8">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-full bg-[color:var(--pale)] px-2 py-1 text-[10px] uppercase tracking-[0.28em] text-[color:var(--forest)]">
              Made in Japan
            </span>
            <span className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--olive)]">{product.size}</span>
          </div>
          <h1 className="mb-3 font-serif text-4xl md:text-5xl">{product.name}</h1>
          <Stars className="mb-4" />
          <div className="mb-6 font-serif text-2xl text-[color:var(--forest)]">
            {product.price != null ? (
              `EGP ${Number(product.price).toFixed(2)}`
            ) : (
              <span className="text-base italic text-[color:var(--muted-foreground)]">Price coming soon</span>
            )}
          </div>
          <p className="leading-relaxed text-[color:var(--muted-foreground)]">{product.description}</p>

          <div className="mt-7 flex items-center gap-4">
            <div className="flex items-center overflow-hidden rounded-full border border-[color:var(--border)] bg-[color:var(--card)]">
              <button aria-label="Decrease" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="p-3 hover:bg-[color:var(--pale)]">
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[2.5rem] px-4 text-center">{quantity}</span>
              <button aria-label="Increase" onClick={() => setQuantity((value) => value + 1)} className="p-3 hover:bg-[color:var(--pale)]">
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

          <div className="mt-8 text-sm text-[color:var(--muted-foreground)]">Payment is available by Cash on Delivery.</div>
        </div>
      </div>

      <section className="mt-16 md:mt-20">
        <h2 className="mb-6 font-serif text-3xl">Key Benefits</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {product.key_benefits.map((benefit) => (
            <li key={benefit} className="soft-panel px-5 py-4 text-sm">
              {benefit}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 grid gap-8 md:mt-20 md:grid-cols-2">
        <div className="soft-panel p-8">
          <h2 className="mb-2 font-serif text-2xl">Nutrition Facts</h2>
          <p className="mb-4 text-xs uppercase tracking-[0.28em] text-[color:var(--olive)]">{product.nutrition.serving ?? "Per 2g"}</p>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-[color:var(--border)]">
              {[
                ["Energy", product.nutrition.energy],
                ["Protein", product.nutrition.protein],
                ["Fat", product.nutrition.fat],
                ["Sugar", product.nutrition.sugar],
                ["Total Carbohydrate", product.nutrition.carbs],
              ].map(([key, value]) => (
                <tr key={key}>
                  <td className="py-2.5 text-[color:var(--muted-foreground)]">{key}</td>
                  <td className="py-2.5 text-right font-medium">{value ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-xs text-[color:var(--muted-foreground)]">Made in Japan.</p>
        </div>

        <div className="soft-panel flex flex-col gap-6 p-8">
          <div>
            <h3 className="mb-2 font-serif text-xl">Ingredients</h3>
            <p className="text-sm text-[color:var(--muted-foreground)]">{product.ingredients}</p>
          </div>
          <div>
            <h3 className="mb-2 font-serif text-xl">Storage</h3>
            <p className="text-sm text-[color:var(--muted-foreground)]">{product.storage}</p>
          </div>
          <div>
            <h3 className="mb-2 font-serif text-xl">Shipping & Payment</h3>
            <p className="text-sm text-[color:var(--muted-foreground)]">Payment is available by Cash on Delivery.</p>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="mt-16 md:mt-20">
          <h2 className="mb-6 font-serif text-3xl">You may also like</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.id}
                to="/product/$slug"
                params={{ slug: item.slug }}
                className="product-sachet grid items-center gap-4 p-4 sm:grid-cols-[120px_minmax(0,1fr)]"
              >
                <img
                  src={getProductImage(item.slug, item.image_url)}
                  alt={item.name}
                  loading="lazy"
                  className="h-32 w-full rounded-[1.25rem] object-cover"
                />
                <div className="min-w-0">
                  <h3 className="font-serif text-xl">{item.name}</h3>
                  <p className="text-sm text-[color:var(--muted-foreground)]">{item.short_description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
