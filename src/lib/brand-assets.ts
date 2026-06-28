import heroDesktopAsset from "@/assets/ark-hero-desktop.png.asset.json";
import heroMobileAsset from "@/assets/ark-hero-mobile.png.asset.json";
import matcha30gAsset from "@/assets/ark-matcha-30g.png.asset.json";
import matcha50gAsset from "@/assets/ark-matcha-50g.png.asset.json";
import matchaPowderAsset from "@/assets/ark-matcha-powder.png.asset.json";
import type { Product } from "@/lib/queries";

export const brandAssets = {
  heroDesktop: heroDesktopAsset.url,
  heroMobile: heroMobileAsset.url,
  matcha30g: matcha30gAsset.url,
  matcha50g: matcha50gAsset.url,
  matchaPowder: matchaPowderAsset.url,
};

export function getProductImage(slug: string, imageUrl?: string | null) {
  if (imageUrl) return imageUrl;
  return slug === "ark-matcha-30g" ? brandAssets.matcha30g : brandAssets.matcha50g;
}

export function getProductGallery(product: Pick<Product, "slug" | "image_url" | "gallery">) {
  const fallback = getProductImage(product.slug, product.image_url);
  return product.gallery?.length ? product.gallery : [fallback];
}
