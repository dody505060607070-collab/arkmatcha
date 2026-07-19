import { useQuery } from "@tanstack/react-query";
import { Instagram } from "lucide-react";
import { settingsQuery } from "@/lib/queries";

export function InstagramGrid() {
  const { data: s } = useQuery(settingsQuery);
  const urls = (s?.instagram_grid ?? []).filter((u) => u && u.trim());
  if (urls.length === 0) return null;

  const handle = s?.instagram_url ?? "https://www.instagram.com/arkmatcha";

  return (
    <section className="container-soft pt-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-[color:var(--matcha)]">
            @arkmatcha
          </p>
          <h2 className="mt-2 font-serif text-2xl text-[color:var(--forest)] md:text-3xl">
            From our community
          </h2>
        </div>
        <a
          href={handle}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm text-[color:var(--forest)] hover:underline"
        >
          <Instagram className="h-4 w-4" /> Follow
        </a>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-3">
        {urls.slice(0, 6).map((u, i) => (
          <a
            key={u + i}
            href={handle}
            target="_blank"
            rel="noreferrer"
            className="group relative aspect-square overflow-hidden rounded-xl"
          >
            <img
              src={u}
              alt={`Instagram post ${i + 1}`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
