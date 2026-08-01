import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { productQuery, productsQuery } from "@/lib/queries";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import { getProductGallery, getProductImage } from "@/lib/brand-assets";

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
      <Link to="/" className="btn-primary mt-4 inline-flex">
        Back home
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

const KIT_SLUG = "ark-matcha-kit";
const KIT_COLORS = [
  { id: "white", label: "White", swatch: "#F2F2F0", index: 0 },
  { id: "pink", label: "Pink", swatch: "#F1CFCB", index: 1 },
  { id: "butter", label: "Butter", swatch: "#F4E3B0", index: 2 },
];

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQuery(slug));
  const { data: products } = useSuspenseQuery(productsQuery);
  const add = useCart((s) => s.add);
  const [quantity, setQuantity] = useState(1);
  const [colorId, setColorId] = useState(KIT_COLORS[0].id);
  const navigate = useNavigate();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!product) {
    throw notFound();
  }

  const isKit = product.slug === KIT_SLUG;
  const gallery = useMemo(() => {
    const base = getProductGallery(product);
    return Array.from(new Set(base.length ? base : [getProductImage(product.slug, product.image_url)]));
  }, [product]);

  const currentProduct = product;
  const selectedColor = KIT_COLORS.find((c) => c.id === colorId) ?? KIT_COLORS[0];
  const kitImage = gallery[selectedColor.index] ?? gallery[0];

  const discountPct = product.discount_percentage ?? 0;
  const effectivePrice = product.price != null && discountPct > 0
    ? Number(product.price) * (1 - discountPct / 100)
    : product.price != null ? Number(product.price) : null;

  function addToCart() {
    const colorSuffix = isKit ? ` — ${selectedColor.label}` : "";
    add(
      {
        productId: isKit ? `${currentProduct.id}:${selectedColor.id}` : currentProduct.id,
        slug: currentProduct.slug,
        name: `${currentProduct.name}${colorSuffix}`,
        size: currentProduct.size,
        price: effectivePrice,
        image: isKit ? kitImage : getProductImage(currentProduct.slug, currentProduct.image_url),
      },
      quantity,
    );
    toast.success(`${currentProduct.name}${colorSuffix} added to cart`);
  }

  function scrollBy(dir: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  }


  return (
    <main className="container-soft py-8 md:py-12">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:items-start">
        {product.image_visible !== false ? (
          isKit ? (
            <div>
              <div className="overflow-hidden rounded-2xl bg-white">
                <img
                  key={kitImage}
                  src={kitImage}
                  alt={`${product.name} — ${selectedColor.label}`}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width={800}
                  height={800}
                  className="aspect-square w-full object-cover transition-opacity duration-300"
                />

              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--olive)]">
                  Color: {selectedColor.label}
                </span>
                <div className="flex items-center gap-2">
                  {KIT_COLORS.map((c) => {
                    const active = c.id === selectedColor.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        aria-label={c.label}
                        onClick={() => setColorId(c.id)}
                        className={`h-8 w-8 rounded-full border transition ${active ? "ring-2 ring-offset-2 ring-[color:var(--matcha)]" : "border-black/10 hover:scale-105"}`}
                        style={{ backgroundColor: c.swatch }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div
                ref={scrollerRef}
                className="flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden rounded-2xl bg-white scroll-smooth"
                style={{ scrollbarWidth: "none" }}
              >
                {gallery.map((image, index) => (
                  <img
                    key={`${image}-${index}`}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    decoding="async"
                    width={800}
                    height={800}
                    className="aspect-square w-full shrink-0 snap-center object-cover"
                  />
                ))}

              </div>
              {gallery.length > 1 ? (
                <>
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={() => scrollBy(-1)}
                    className="absolute left-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/80 backdrop-blur md:grid"
                  >
                    <ChevronLeft className="h-5 w-5 text-[color:var(--petal-strong)]" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={() => scrollBy(1)}
                    className="absolute right-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/80 backdrop-blur md:grid"
                  >
                    <ChevronRight className="h-5 w-5 text-[color:var(--petal-strong)]" />
                  </button>
                </>
              ) : null}
            </div>
          )
        ) : (
          <div className="soft-panel grid min-h-[280px] place-items-center p-10 text-center">
            <p className="font-serif text-2xl text-[color:var(--forest)]">{product.name}</p>
          </div>
        )}


        <div className="p-1 md:p-2">
          <span className="block text-[10px] uppercase tracking-[0.2em] text-[color:var(--olive)]">
            Ark Matcha
          </span>
          <h1 className="mb-3 font-serif text-3xl md:text-4xl">{product.name}</h1>
          <div className="mb-6 font-serif text-2xl text-[color:var(--petal-strong)]">
            {product.price_visible !== false && product.price != null ? (
              discountPct > 0 ? (
                <span className="flex flex-wrap items-baseline gap-3">
                  <span>EGP {effectivePrice!.toFixed(2)}</span>
                  <span className="text-base text-[color:var(--muted-foreground)] line-through">
                    {Number(product.price).toFixed(2)}
                  </span>
                  <span className="rounded-full bg-[color:var(--matcha)] px-2 py-0.5 text-[10px] uppercase tracking-widest text-white">
                    -{discountPct}%
                  </span>
                </span>
              ) : (
                `EGP ${Number(product.price).toFixed(2)}`
              )
            ) : (
              <span className="text-base italic text-[color:var(--muted-foreground)]">Price coming soon</span>
            )}
          </div>

          {!product.in_stock && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-red-700">
              ✕ Sold out
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="flex items-center overflow-hidden rounded-full border border-[color:var(--border)] bg-white">
              <button aria-label="Decrease" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="p-3 hover:bg-[color:var(--pale)]">
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[2.5rem] px-4 text-center">{quantity}</span>
              <button aria-label="Increase" onClick={() => setQuantity((value) => value + 1)} className="p-3 hover:bg-[color:var(--pale)]">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button onClick={addToCart} className="btn-primary flex-1" disabled={!product.in_stock}>
              {product.in_stock ? "Add to Cart" : "Sold out"}
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

          {product.description ? (
            <p className="mt-6 leading-relaxed text-[color:var(--muted-foreground)]">
              {product.description}
            </p>
          ) : null}
        </div>
      </div>

      <section className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2">
        <div className="soft-panel p-6 md:p-8">
          <h3 className="mb-2 font-serif text-xl">Ingredients</h3>
          <p className="text-sm text-[color:var(--muted-foreground)]">{product.ingredients}</p>
        </div>
        {product.extra_info_title || product.extra_info_body ? (
          <div className="soft-panel p-6 md:p-8">
            {product.extra_info_title ? (
              <h3 className="mb-2 font-serif text-xl">{product.extra_info_title}</h3>
            ) : null}
            {product.extra_info_body ? (
              <p className="whitespace-pre-line text-sm text-[color:var(--muted-foreground)]">{product.extra_info_body}</p>
            ) : null}
          </div>
        ) : null}
        <div className="soft-panel p-6 md:p-8">
          <h3 className="mb-2 font-serif text-xl">Storage</h3>
          <p className="text-sm text-[color:var(--muted-foreground)]">{product.storage}</p>
          <h3 className="mt-5 mb-2 font-serif text-xl">Shipping & Payment</h3>
          <p className="text-sm text-[color:var(--muted-foreground)]">Payment is available by Cash on Delivery.</p>
        </div>
      </section>

      {(() => {
        const related = products.filter((item) => item.id !== product.id);
        if (!related.length) return null;
        return (
          <section className="mt-12 md:mt-16">
            <h2 className="mb-6 font-serif text-2xl md:text-3xl">You may also like</h2>
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
                    decoding="async"
                    width={240}
                    height={240}
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
        );
      })()}
    </main>
  );
}
