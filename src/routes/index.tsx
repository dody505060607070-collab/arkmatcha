import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { productsQuery, settingsQuery, type Product } from "@/lib/queries";
import { getProductImage } from "@/lib/brand-assets";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Newsletter } from "@/components/site/Newsletter";
import heroFlatlay from "@/assets/ark-hero-flatlay.jpeg.asset.json";
import tileMatcha from "@/assets/ark-matcha-30g-v2.jpeg.asset.json";
import tileWhisk from "@/assets/ark-whisk.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ark Matcha | Ceremonial Grade Matcha Made in Japan" },
      { property: "og:title", content: "Ark Matcha | Ceremonial Grade Matcha" },
      {
        property: "og:description",
        content:
          "Shop Ark Matcha ceremonial grade matcha, available in 30g and 50g premium tins, plus authentic Japanese tools.",
      },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preload", as: "image", href: heroFlatlay.url, fetchpriority: "high" },
    ],
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
  const { data: settings } = useSuspenseQuery(settingsQuery);

  const heroImage = settings?.hero_image?.trim() ? settings.hero_image : heroFlatlay.url;
  const heroCtaText = settings?.hero_cta_text?.trim() || "SHOP ALL";
  const heroCtaLink = settings?.hero_cta_link?.trim() || "/shop";
  const featuredLabel = settings?.featured_label?.trim() || "Featured products";

  return (
    <main>
      <AnnouncementBar />

      {/* HERO — full-width lifestyle image with a single centered pill CTA */}
      <section className="relative w-full overflow-hidden">
        <div className="relative aspect-[4/5] w-full md:aspect-[16/8]">
          <img
            src={heroImage}
            alt="Ark Matcha ceremonial grade tins"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Subtle top-to-bottom lift for legibility */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 55%, color-mix(in oklab, black 18%, transparent) 100%)",
            }}
          />
          <Link
            to={heroCtaLink as "/shop"}
            className="absolute left-1/2 top-[38%] -translate-x-1/2 rounded-full bg-white px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--forest)] shadow-lg transition-transform hover:-translate-y-0.5 md:top-1/2 md:-translate-y-1/2 md:px-10 md:py-4 md:text-sm"
          >
            {heroCtaText}
          </Link>
        </div>
      </section>

      {/* CATEGORY TILES — two image tiles, "SHOP ALL" below */}
      <section className="mt-6 md:mt-10" aria-label="Shop by category">
        <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 md:gap-6 md:px-6">
          <CategoryTile
            data-reveal
            data-reveal-style="left"
            to="/shop"
            image={tileMatcha.url}
            label="MATCHA"
          />
          <CategoryTile
            data-reveal
            data-reveal-style="right"
            data-reveal-delay="1"
            to="/shop"
            image={tileWhisk.url}
            label="ACCESSORIES"
          />
        </div>

        <div className="mt-8 flex justify-center px-4 md:mt-12">
          <Link
            to="/shop"
            data-reveal
            data-reveal-style="fade"
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--forest)] px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--forest)] transition-colors hover:bg-[color:var(--forest)] hover:text-white md:px-10 md:py-4 md:text-sm"
          >
            Shop all
          </Link>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <div data-reveal data-reveal-style="up">
        <FeaturedCarousel products={products} label={featuredLabel} />
      </div>

      {/* NEWSLETTER */}
      <section
        className="container-soft py-20 text-center"
        data-reveal
        data-reveal-style="fade"
      >
        <h2 className="text-4xl font-semibold tracking-tight text-[color:var(--forest)] md:text-5xl">
          Subscribe to our emails
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[color:var(--muted-foreground)]">
          Join our email list for exclusive offers and the latest news.
        </p>
        <div className="mx-auto mt-8 max-w-md">
          <Newsletter compact />
        </div>
        <a
          href={settings?.instagram_url ?? "https://www.instagram.com/arkmatcha"}
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          className="mx-auto mt-10 inline-flex text-[color:var(--forest)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </a>
      </section>
    </main>
  );
}

function CategoryTile({
  to,
  image,
  label,
  ...rest
}: {
  to: string;
  image: string;
  label: string;
} & React.HTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link
      to={to as "/shop"}
      {...rest}
      className="group relative block overflow-hidden rounded-2xl"
    >
      <div className="aspect-[4/5] w-full md:aspect-[4/5]">
        <img
          src={image}
          alt={label}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 55%, color-mix(in oklab, black 45%, transparent) 100%)",
        }}
      />
      <span className="absolute bottom-5 left-5 text-lg font-semibold uppercase tracking-[0.2em] text-white drop-shadow md:bottom-6 md:left-6 md:text-2xl">
        {label}
      </span>
    </Link>
  );
}

function FeaturedCarousel({ products, label }: { products: Product[]; label: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const perView = 2;
  const totalPages = Math.max(1, Math.ceil(products.length / perView));

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.9;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.9;
    const idx = Math.round(el.scrollLeft / step);
    setPage(Math.min(totalPages, Math.floor(idx / perView) + 1));
  };

  return (
    <section className="container-soft pt-20">
      <h2 className="font-serif text-2xl text-[color:var(--forest)] md:text-3xl">
        {label}
      </h2>

      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => {
          const label = product.name;
          return (
            <Link
              key={product.id}
              data-card
              to="/product/$slug"
              params={{ slug: product.slug }}
              className="group block w-[46%] shrink-0 snap-start md:w-[30%]"
            >
              {product.image_visible !== false ? (
                <div
                  className="relative overflow-hidden rounded-2xl"
                  style={{ background: "var(--card-bg, #fff)" }}
                >
                  <img
                    src={getProductImage(product.slug, product.image_url)}
                    alt={label}
                    loading="lazy"
                    decoding="async"
                    width={600}
                    height={600}
                    className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
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

              <h3 className="mt-3 text-center text-sm font-medium text-[color:var(--forest)] md:text-base">
                {label}
              </h3>
              {product.price_visible !== false && product.price ? (
                (product.discount_percentage ?? 0) > 0 ? (
                  <p className="mt-1 text-center text-sm">
                    <span className="text-[color:var(--forest)]">
                      LE{" "}
                      {(
                        Number(product.price) *
                        (1 - product.discount_percentage / 100)
                      ).toFixed(2)}{" "}
                      EGP
                    </span>
                    <span className="ml-2 text-xs text-[color:var(--muted-foreground)] line-through">
                      {Number(product.price).toFixed(2)}
                    </span>
                  </p>
                ) : (
                  <p className="mt-1 text-center text-sm text-[color:var(--forest)]">
                    LE {Number(product.price).toFixed(2)} EGP
                  </p>
                )
              ) : null}
            </Link>
          );
        })}
      </div>

      {products.length > perView && (
        <div className="mt-4 flex items-center justify-center gap-6 text-sm text-[color:var(--forest)]">
          <button
            aria-label="Previous"
            onClick={() => scrollBy(-1)}
            className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-[color:var(--border)]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="tabular-nums">
            {page}/{totalPages}
          </span>
          <button
            aria-label="Next"
            onClick={() => scrollBy(1)}
            className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-[color:var(--border)]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </section>
  );
}
