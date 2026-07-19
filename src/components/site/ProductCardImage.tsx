import { useEffect, useState } from "react";

/**
 * Product card image with two-image animation:
 * - Desktop: hover swaps main → secondary
 * - Mobile (touch): auto-loops main (6s) → secondary (4s) → main …
 */
export function ProductCardImage({
  main,
  secondary,
  alt,
  className,
}: {
  main: string;
  secondary?: string | null;
  alt: string;
  className?: string;
}) {
  const [showSecondary, setShowSecondary] = useState(false);
  const hasSecondary = Boolean(secondary && secondary !== main);

  useEffect(() => {
    if (!hasSecondary) return;
    if (typeof window === "undefined") return;
    // Only auto-swap on touch / no-hover devices
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (!isTouch) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const loop = (isSecondary: boolean) => {
      if (cancelled) return;
      setShowSecondary(isSecondary);
      timer = setTimeout(() => loop(!isSecondary), isSecondary ? 4000 : 6000);
    };
    loop(false);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [hasSecondary]);

  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      onMouseEnter={() => hasSecondary && setShowSecondary(true)}
      onMouseLeave={() => hasSecondary && setShowSecondary(false)}
    >
      <img
        src={main}
        alt={alt}
        loading="lazy"
        decoding="async"
        width={600}
        height={600}
        className={`aspect-square w-full object-cover transition-opacity duration-700 ease-out ${
          showSecondary && hasSecondary ? "opacity-0" : "opacity-100"
        }`}
      />
      {hasSecondary && (
        <img
          src={secondary!}
          alt={alt}
          loading="lazy"
          decoding="async"
          width={600}
          height={600}
          className={`absolute inset-0 aspect-square w-full object-cover transition-opacity duration-700 ease-out ${
            showSecondary ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
