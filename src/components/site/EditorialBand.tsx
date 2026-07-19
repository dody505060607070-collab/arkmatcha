import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { settingsQuery } from "@/lib/queries";
import heroFlatlay from "@/assets/ark-hero-flatlay.jpeg.asset.json";

export function EditorialBand() {
  const { data: s } = useQuery(settingsQuery);
  const image = s?.editorial_image?.trim() ? s.editorial_image : heroFlatlay.url;
  const quote =
    s?.editorial_quote?.trim() ||
    "A small green pause you'll look forward to.";

  return (
    <section className="container-soft pt-16">
      <div
        className="grid gap-0 overflow-hidden rounded-3xl border border-[color:var(--border)] md:grid-cols-2"
        style={{ background: "color-mix(in oklab, var(--matcha) 4%, var(--background))" }}
      >
        <div className="relative min-h-[280px] md:min-h-[420px]">
          <img
            src={image}
            alt="Ark Matcha ritual"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-4 p-8 md:p-14">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[color:var(--matcha)]">
            The Ark Ritual
          </p>
          <blockquote className="font-serif text-2xl leading-snug text-[color:var(--forest)] md:text-4xl">
            “{quote}”
          </blockquote>
          <div>
            <Link
              to="/shop"
              className="mt-2 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
              style={{ background: "var(--matcha)", color: "#fff" }}
            >
              Start your ritual →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
