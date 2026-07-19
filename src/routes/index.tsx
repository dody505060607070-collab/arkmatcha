import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { productsQuery, settingsQuery, type Product } from "@/lib/queries";
import { getProductImage, brandAssets } from "@/lib/brand-assets";
import { Newsletter } from "@/components/site/Newsletter";
import { ProductCardImage } from "@/components/site/ProductCardImage";
import { TrustBar } from "@/components/site/TrustBar";
import { StoryStrip } from "@/components/site/StoryStrip";
import { ReviewsSection } from "@/components/site/ReviewsSection";
import { EditorialBand } from "@/components/site/EditorialBand";
import { InstagramGrid } from "@/components/site/InstagramGrid";
import heroEditorial from "@/assets/ark-hero-editorial.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ark Matcha | Ceremonial Grade Matcha Made in Japan" },
      { property: "og:title", content: "Ark Matcha | Ceremonial Grade Matcha" },
      {
        property: "og:description",
        content:
          "Shop Ark Matcha ceremonial grade matcha, available in 30g and 50g premium tins.",
      },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preload", as: "image", href: heroEditorial.url, fetchPriority: "high" },
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

  const heroImage = settings?.hero_image?.trim() ? settings.hero_image : heroEditorial.url;
  const heroBadge =
    settings?.content?.home?.heroBadge?.trim() || "SIP THE\nRITUAL";
  const heroHeadline =
    settings?.hero_headline?.trim() || "Slow mornings, brighter days.";
  const heroSub =
    settings?.content?.home?.heroSub?.trim() ||
    "Stone-milled in Japan. Whisked at home. A small green pause you'll look forward to.";
  const heroCtaText = settings?.hero_cta_text?.trim() || "Shop the collection";
  const heroCtaLink = settings?.hero_cta_link?.trim() || "/shop";
  const featuredLabel = settings?.featured_label?.trim() || "Featured products";
  const logo = settings?.logo_url?.trim() || brandAssets.logo;

  return (
    <main>
      {/* Hero */}
      <section className="container-soft pt-4 md:pt-6">
        <div
          className="relative overflow-hidden rounded-3xl"
          style={{ background: "var(--matcha)" }}
        >
          {/* Sticker-style badge with rotating logo behind it */}
          <div className="absolute left-3 top-4 z-20 md:left-8 md:top-8">
            <div className="relative">
              {/* Logo watermark, replaces the star from the reference */}
              <img
                src={logo}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute -right-8 -top-6 h-16 w-16 rotate-12 opacity-90 md:-right-10 md:-top-8 md:h-20 md:w-20 animate-[spin_18s_linear_infinite]"
              />
              <div className="relative -rotate-6 rounded-2xl bg-[color:var(--background)] px-4 py-2.5 shadow-md md:px-5 md:py-3">
                <p className="whitespace-pre-line font-serif text-lg leading-[1.05] tracking-tight text-[color:var(--matcha)] md:text-2xl">
                  {heroBadge}
                </p>
              </div>
            </div>
          </div>

          <img
            src={heroImage}
            alt="Ark Matcha ceremonial grade"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={1400}
            height={1100}
            className="block h-[62vh] max-h-[560px] min-h-[360px] w-full object-cover md:h-[70vh] md:max-h-[680px]"
          />
        </div>

        {/* Explore / CTA card — new copy, less Mellow-esque */}
        <div
          className="relative -mt-8 overflow-hidden rounded-3xl px-6 py-8 md:-mt-10 md:px-10 md:py-10"
          style={{
            background: "var(--background)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[color:var(--olive)]">
                Ceremonial · Kyoto, Japan
              </p>
              <h1 className="mt-3 font-serif text-3xl leading-tight text-[color:var(--forest)] md:text-5xl">
                {heroHeadline}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--forest)]/80 md:text-base">
                {heroSub}
              </p>
            </div>
            <Link
              to={heroCtaLink as "/shop"}
              className="inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-3 text-sm font-medium shadow-sm transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--matcha)", color: "#fff" }}
            >
              {heroCtaText} →
            </Link>
          </div>
        </div>
      </section>

      <TrustBar />
      <FeaturedCarousel products={products} label={featuredLabel} />
      <StoryStrip />
      <ReviewsSection />
      <EditorialBand />
      <InstagramGrid />

      {/* Newsletter */}
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

function pickSecondary(product: Product): string | null {
  const main = getProductImage(product.slug, product.image_url);
  const gallery = (product.gallery ?? []).filter(Boolean);
  const secondary = gallery.find((g) => g && g !== main);
  return secondary ?? null;
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
    <section className="container-soft pt-16">
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
          const main = getProductImage(product.slug, product.image_url);
          const secondary = pickSecondary(product);
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

              <h3 className="mt-3 text-center text-sm font-medium text-[color:var(--forest)] md:text-base">
                {label}
              </h3>
              {product.price_visible !== false && product.price ? (
                (product.discount_percentage ?? 0) > 0 ? (
                  <p className="mt-1 text-center text-sm">
                    <span className="text-[color:var(--forest)]">
                      LE {(Number(product.price) * (1 - product.discount_percentage / 100)).toFixed(2)} EGP
                    </span>
                    <span className="ml-2 text-xs text-[color:var(--forest)]/50 line-through">
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
