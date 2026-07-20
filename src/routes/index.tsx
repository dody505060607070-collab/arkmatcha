import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery, settingsQuery, type Product } from "@/lib/queries";
import { getProductImage, brandAssets } from "@/lib/brand-assets";
import { Newsletter } from "@/components/site/Newsletter";
import { ProductCardImage } from "@/components/site/ProductCardImage";
import heroEditorial from "@/assets/ark-hero-editorial.jpg.asset.json";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ark Matcha | Ceremonial Grade Matcha Made in Japan" },
      { property: "og:title", content: "Ark Matcha | Ceremonial Grade Matcha Made in Japan" },
      {
        property: "og:description",
        content:
          "Shop Ark Matcha ceremonial grade matcha made in Japan, available in 30g and 50g premium tins. A calm, elegant matcha ritual made for smooth daily energy.",
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
    "Ceremonial grade matcha, whisked at home.";

  const heroCtaText = settings?.hero_cta_text?.trim() || "Shop the collection";
  const heroCtaLink = settings?.hero_cta_link?.trim() || "/shop";
  const featuredLabel = settings?.featured_label?.trim() || "Featured products";
  const logo = settings?.logo_url?.trim() || brandAssets.logo;

  return (
    <main>
      {/* Hero — fills mobile viewport so only image + CTA card show above the fold */}
      <section className="container-soft pt-4 md:pt-6 min-h-[calc(100svh-72px)] md:min-h-0 flex flex-col justify-start">

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
                className="pointer-events-none absolute -right-6 -top-5 h-12 w-12 rotate-12 opacity-90 md:-right-8 md:-top-6 md:h-16 md:w-16 animate-[spin_18s_linear_infinite]"
              />
              <div className="relative -rotate-6 rounded-xl bg-[color:var(--background)] px-3 py-2 shadow-md md:px-4 md:py-2.5">
                <p className="whitespace-pre-line font-serif text-sm leading-[1.05] tracking-tight text-[color:var(--matcha)] md:text-lg">
                  {heroBadge}
                </p>
              </div>
            </div>
          </div>

          {(() => {
            const heroVideo = (settings?.content as any)?.home?.heroVideo?.trim?.();
            if (heroVideo) {
              return (
                <div className="relative">
                  <video
                    src={heroVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    // @ts-ignore
                    disablePictureInPicture
                    controlsList="nodownload noplaybackrate nofullscreen"
                    className="block h-[58svh] max-h-[560px] min-h-[300px] w-full object-cover md:h-[70vh] md:max-h-[680px]"

                  />
                  {/* transparent overlay blocks all pointer interaction */}
                  <div className="absolute inset-0" aria-hidden="true" />
                </div>
              );
            }
            return (
              <img
                src={heroImage}
                alt="Ark Matcha ceremonial grade"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width={1400}
                height={1100}
                className="block h-[58svh] max-h-[560px] min-h-[300px] w-full object-cover md:h-[70vh] md:max-h-[680px]"
              />
            );
          })()}
        </div>

        {/* Explore / CTA card */}
        <div
          className="relative -mt-10 overflow-hidden rounded-3xl px-5 py-5 md:-mt-10 md:px-10 md:py-10"
          style={{
            background: "var(--background)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
            <div className="max-w-xl">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[color:var(--olive)]">
                Ceremonial · Kyoto, Japan
              </p>
              <h1 className="mt-2 font-serif text-2xl leading-tight text-[color:var(--forest)] md:mt-3 md:text-5xl">
                {heroHeadline}
              </h1>
              <p className="mt-2 text-xs leading-relaxed text-[color:var(--forest)]/80 md:mt-3 md:text-base">
                {heroSub}
              </p>
            </div>
            <Link
              to={heroCtaLink as "/shop"}
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium shadow-sm transition-transform hover:-translate-y-0.5 md:px-6 md:py-3"
              style={{ background: "var(--matcha)", color: "#fff" }}
            >
              {heroCtaText} →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured products — stacked grid */}
      <section className="container-soft pt-12">
        <h2 className="font-serif text-2xl text-[color:var(--forest)] md:text-3xl">
          {featuredLabel}
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:gap-6">
          {products.map((product, idx) => {
            const label = product.name;
            const main = getProductImage(product.slug, product.image_url);
            const secondary = pickSecondary(product);
            const side = idx % 2 === 0 ? "left" : "right";
            const delay = ((idx % 5) + 1) as 1 | 2 | 3 | 4 | 5;
            return (
              <Link
                key={product.id}
                to="/product/$slug"
                params={{ slug: product.slug }}
                className="group block"
                data-reveal
                data-reveal-style={side}
                data-reveal-delay={String(delay)}
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
      </section>

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

