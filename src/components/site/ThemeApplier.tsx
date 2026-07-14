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

  const css = `
:root {
  --background: ${theme.background};
  --matcha: ${theme.matcha};
  --forest: ${theme.forest};
  --olive: ${theme.olive};
  --petal: ${theme.petal};
  --petal-strong: ${theme.matcha};
  --foreground: ${theme.text};
}
body, html {
  background-color: ${theme.background};
  color: ${theme.text};
  font-family: "${fontFamily}", ui-serif, Georgia, serif;
  font-size: ${typo.baseSize}px;
}
h1, h2, h3, h4, h5, .font-serif {
  font-family: "${headingFamily}", "${fontFamily}", ui-serif, Georgia, serif;
}
.ark-hero-label { font-size: ${typo.heroMobile.labelSize}px; }
.ark-hero-headline { font-size: ${typo.heroMobile.headlineSize}px; line-height: 1.15; }
.ark-hero-tagline { font-size: ${typo.heroMobile.taglineSize}px; }
.ark-product-label { font-size: ${typo.product.labelSize}px; }
.ark-product-title { font-size: ${typo.product.titleSize}px; }
.ark-product-price { font-size: ${typo.product.priceSize}px; }
.ark-footer-text { font-size: ${typo.footer.size}px; }
@media (min-width: 768px) {
  .ark-hero-label { font-size: ${typo.hero.labelSize}px; }
  .ark-hero-headline { font-size: ${typo.hero.headlineSize}px; }
  .ark-hero-tagline { font-size: ${typo.hero.taglineSize}px; }
}
`;

  return (
    <>
      <link rel="stylesheet" href={fontHref} />
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </>
  );
}
