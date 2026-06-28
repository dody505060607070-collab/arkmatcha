import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/queries";
import { Instagram } from "lucide-react";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M16.6 5.82a4.28 4.28 0 0 1-3.77-2.32h-3.1v11.4a2.6 2.6 0 1 1-2.6-2.6c.26 0 .52.04.76.11V9.27a5.74 5.74 0 0 0-.76-.05 5.73 5.73 0 1 0 5.73 5.73V8.87a7.4 7.4 0 0 0 3.74 1.04V6.8a4.27 4.27 0 0 1 0-.98z" />
    </svg>
  );
}

export function Footer() {
  const { data: s } = useQuery(settingsQuery);
  return (
    <footer className="mt-24 border-t border-[color:var(--border)] bg-[color:var(--pale)]">
      <div className="container-soft py-12 flex flex-col gap-6 items-center text-center">
        <div className="font-serif text-2xl text-[color:var(--forest)]">Ark Matcha</div>
        <p className="text-sm text-[color:var(--muted-foreground)] tracking-wide">
          Ceremonial Grade Matcha · Made in Japan
        </p>
        <div className="flex items-center gap-5">
          <a
            href={s?.instagram_url ?? "#"}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="p-2 rounded-full hover:bg-[color:var(--cream)] transition-colors"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            href={s?.tiktok_url ?? "#"}
            target="_blank"
            rel="noreferrer"
            aria-label="TikTok"
            className="p-2 rounded-full hover:bg-[color:var(--cream)] transition-colors"
          >
            <TikTokIcon className="h-5 w-5" />
          </a>
        </div>
        <div className="text-sm text-[color:var(--muted-foreground)] flex flex-col sm:flex-row gap-3 sm:gap-6">
          <a href={`mailto:${s?.contact_email ?? "arkmatcha@gmail.com"}`} className="hover:text-[color:var(--forest)]">
            {s?.contact_email ?? "arkmatcha@gmail.com"}
          </a>
          <a href={`https://wa.me/${(s?.phone ?? "+20 10 32511516").replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="hover:text-[color:var(--forest)]">
            {s?.phone ?? "+20 10 32511516"}
          </a>
        </div>
        <div className="text-xs text-[color:var(--muted-foreground)]/80 pt-4">
          {s?.footer_text ?? "© Ark Matcha. Ceremonial Grade Matcha. Made in Japan."}
        </div>
      </div>
    </footer>
  );
}
