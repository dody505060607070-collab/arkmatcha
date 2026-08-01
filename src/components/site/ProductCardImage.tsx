/**
 * Product card image — static main image only.
 * No hover swap, no auto-looping; the secondary image is only shown
 * inside the product page gallery (swipe).
 */
export function ProductCardImage({
  main,
  alt,
  className,
}: {
  main: string;
  secondary?: string | null;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <img
        src={main}
        alt={alt}
        loading="lazy"
        decoding="async"
        width={600}
        height={600}
        className="aspect-square w-full object-cover"
      />
    </div>
  );
}
