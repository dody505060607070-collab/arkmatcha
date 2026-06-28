const REVIEWS = [
  { name: "Hana", text: "Smoothest matcha I've had. A true ritual." },
  { name: "Omar", text: "Vibrant green, naturally sweet, no bitterness." },
  { name: "Lina", text: "The 50g tin lasted me a month of mornings." },
  { name: "Youssef", text: "Ceremonial grade done right." },
  { name: "Maya", text: "Elegant packaging, exceptional taste." },
  { name: "Karim", text: "My new daily ritual. Clean and calm energy." },
];

export function ReviewsMarquee() {
  const items = [...REVIEWS, ...REVIEWS];
  return (
    <section className="border-y border-[color:var(--border)] bg-white py-3 overflow-hidden">
      <div className="marquee-track flex gap-10 whitespace-nowrap text-sm text-[color:var(--petal-strong)]">
        {items.map((r, i) => (
          <span key={i} className="inline-flex items-center gap-2">
            <span className="opacity-70">★</span>
            <span className="italic">"{r.text}"</span>
            <span className="opacity-60">— {r.name}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
