import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { reviewsQuery } from "@/lib/queries";

export function ReviewsSection() {
  const { data: reviews } = useQuery(reviewsQuery);
  if (!reviews || reviews.length === 0) return null;

  const avg =
    Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;

  return (
    <section className="container-soft pt-16">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-1 text-[color:var(--matcha)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="h-4 w-4"
              fill={i < Math.round(avg) ? "currentColor" : "none"}
              strokeWidth={1.5}
            />
          ))}
        </div>
        <p className="mt-2 text-xs uppercase tracking-[0.28em] text-[color:var(--forest)]/70">
          {avg.toFixed(1)} · Based on {reviews.length} matcha lovers
        </p>
        <h2 className="mt-4 font-serif text-3xl text-[color:var(--forest)] md:text-4xl">
          Loved by matcha rituals across Egypt
        </h2>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {reviews.slice(0, 3).map((r) => (
          <figure
            key={r.id}
            className="rounded-2xl border border-[color:var(--border)] bg-white/60 p-6 backdrop-blur-sm"
          >
            <div className="flex gap-0.5 text-[color:var(--matcha)]">
              {Array.from({ length: r.rating }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <blockquote className="mt-3 font-serif text-base leading-snug text-[color:var(--forest)] md:text-lg">
              “{r.quote}”
            </blockquote>
            <figcaption className="mt-3 text-xs uppercase tracking-widest text-[color:var(--forest)]/70">
              {r.author_name}
              {r.location ? ` · ${r.location}` : ""}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
