import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_THEME,
  DEFAULT_TYPOGRAPHY,
  settingsQuery,
  type ThemeColors,
  type Typography,
} from "@/lib/queries";

/**
 * ThemeApplier applies admin-configured theme, typography, and font to the
 * live site by injecting a <style id="ark-theme"> tag and a <link> to the
 * chosen Google Font. When the page is embedded in the admin's Live Preview
 * iframe, it also listens for postMessage overrides so admins can see
 * changes before saving.
 */
export function ThemeApplier() {
  const { data } = useQuery(settingsQuery);

  const [previewTheme, setPreviewTheme] = useState<ThemeColors | null>(null);
  const [previewTypo, setPreviewTypo] = useState<Typography | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.parent === window) return; // not in iframe
    const handler = (ev: MessageEvent) => {
      const msg = ev.data;
      if (!msg || msg.type !== "ark-preview") return;
      if (msg.theme) setPreviewTheme(msg.theme);
      if (msg.typography) setPreviewTypo(msg.typography);
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "ark-preview-ready" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);

  const theme = { ...DEFAULT_THEME, ...(data?.theme ?? {}), ...(previewTheme ?? {}) };
  const typo: Typography = {
    ...DEFAULT_TYPOGRAPHY,
    ...(data?.typography ?? {}),
    ...(previewTypo ?? {}),
    hero: { ...DEFAULT_TYPOGRAPHY.hero, ...(data?.typography?.hero ?? {}), ...(previewTypo?.hero ?? {}) },
    heroMobile: { ...DEFAULT_TYPOGRAPHY.heroMobile, ...(data?.typography?.heroMobile ?? {}), ...(previewTypo?.heroMobile ?? {}) },
    product: { ...DEFAULT_TYPOGRAPHY.product, ...(data?.typography?.product ?? {}), ...(previewTypo?.product ?? {}) },
    footer: { ...DEFAULT_TYPOGRAPHY.footer, ...(data?.typography?.footer ?? {}), ...(previewTypo?.footer ?? {}) },
  };

  const fontFamily = typo.fontFamily || "Fraunces";
  const headingFamily = typo.headingFamily || fontFamily;

  const fontHref = useMemo(() => {
    const fams = Array.from(new Set([fontFamily, headingFamily])).filter(Boolean);
    const q = fams
      .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:wght@400;500;600;700`)
      .join("&");
    return `https://fonts.googleapis.com/css2?${q}&display=swap`;
  }, [fontFamily, headingFamily]);

  const fallback = (v: string | undefined, fb: string) => (v && v.trim() ? v : fb);

  const heroBg = fallback(theme.heroBackground, `color-mix(in oklab, ${theme.olive} 5%, transparent)`);
  const heroLabel = fallback(theme.heroLabel, theme.olive);
  const heroHead = fallback(theme.heroHeadline, theme.matcha);
  const heroTag = fallback(theme.heroTagline, theme.olive);
  const ctaBg = fallback(theme.ctaBackground, theme.matcha);
  const ctaText = fallback(theme.ctaText, "#ffffff");
  const featuredLabel = fallback(theme.featuredLabel, theme.olive);
  const productLabel = fallback(theme.productLabel, theme.olive);
  const productTitle = fallback(theme.productTitle, theme.forest);
  const productPrice = fallback(theme.productPrice, theme.olive);
  const cardBg = fallback(theme.cardBackground, "#ffffff");
  const footerBg = fallback(theme.footerBackground, `color-mix(in oklab, white 54%, ${theme.petal} 46%)`);
  const footerText = fallback(theme.footerText, theme.forest);
  const footerAccent = fallback(theme.footerAccent, theme.matcha);
  const annBg = fallback(theme.announcementBackground, theme.matcha);
  const annText = fallback(theme.announcementText, "#ffffff");
  const linkColor = fallback(theme.linkColor, theme.matcha);
  const borderColor = fallback(theme.borderColor, `color-mix(in oklab, ${theme.olive} 20%, white)`);
  const headingColor = fallback(theme.headingColor, theme.forest);
  const mutedText = fallback(theme.mutedText, `color-mix(in oklab, ${theme.text} 60%, white)`);

  const css = `
:root {
  --background: ${theme.background};
  --matcha: ${theme.matcha};
  --forest: ${theme.forest};
  --olive: ${theme.olive};
  --petal: ${theme.petal};
  --petal-strong: ${theme.matcha};
  --foreground: ${theme.text};
  --hero-bg: ${heroBg};
  --hero-label: ${heroLabel};
  --hero-headline: ${heroHead};
  --hero-tagline: ${heroTag};
  --cta-bg: ${ctaBg};
  --cta-text: ${ctaText};
  --featured-label: ${featuredLabel};
  --product-label: ${productLabel};
  --product-title: ${productTitle};
  --product-price: ${productPrice};
  --card-bg: ${cardBg};
  --footer-bg: ${footerBg};
  --footer-text: ${footerText};
  --footer-accent: ${footerAccent};
  --announcement-bg: ${annBg};
  --announcement-text: ${annText};
  --link-color: ${linkColor};
  --border: ${borderColor};
  --heading-color: ${headingColor};
  --muted-foreground: ${mutedText};
}
body, html {
  background-color: ${theme.background};
  color: ${theme.text};
  font-family: "${fontFamily}", ui-serif, Georgia, serif;
  font-size: ${typo.baseSize}px;
}
h1, h2, h3, h4, h5, .font-serif {
  font-family: "${headingFamily}", "${fontFamily}", ui-serif, Georgia, serif;
  color: ${headingColor};
}
a { color: ${linkColor}; }
.ark-hero-label { font-size: ${typo.heroMobile.labelSize}px; color: ${heroLabel}; }
.ark-hero-headline { font-size: ${typo.heroMobile.headlineSize}px; line-height: 1.15; color: ${heroHead}; }
.ark-hero-tagline { font-size: ${typo.heroMobile.taglineSize}px; color: ${heroTag}; }
.ark-product-label { font-size: ${typo.product.labelSize}px; color: ${productLabel}; }
.ark-product-title { font-size: ${typo.product.titleSize}px; color: ${productTitle}; }
.ark-product-price { font-size: ${typo.product.priceSize}px; color: ${productPrice}; }
.ark-footer-text { font-size: ${typo.footer.size}px; }
@media (min-width: 768px) {
  .ark-hero-label { font-size: ${typo.hero.labelSize}px; }
  .ark-hero-headline { font-size: ${typo.hero.headlineSize}px; }
  .ark-hero-tagline { font-size: ${typo.hero.taglineSize}px; }
}
`;

  // Inject the Google Font <link> client-side only. Rendering it during SSR
  // causes a hydration mismatch when the settings-derived `fontHref` differs
  // between the server render and the client's first render.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const id = "ark-theme-font";
    let el = document.getElementById(id) as HTMLLinkElement | null;
    if (!el) {
      el = document.createElement("link");
      el.id = id;
      el.rel = "stylesheet";
      document.head.appendChild(el);
    }
    if (el.href !== fontHref) el.href = fontHref;
  }, [fontHref]);

  return (
    <style dangerouslySetInnerHTML={{ __html: css }} suppressHydrationWarning />
  );
}

