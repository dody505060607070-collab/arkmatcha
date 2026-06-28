import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Instagram, LockKeyhole } from "lucide-react";
import { settingsQuery } from "@/lib/queries";

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
    <footer className="mt-14 px-3 pb-4 pt-2">
      <div className="container-soft">
        <div
          className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-[999px] border px-4 py-2.5 text-xs text-[color:var(--forest)] shadow-sm backdrop-blur"
          style={{
            background: "color-mix(in oklab, white 54%, var(--petal) 46%)",
            borderColor: "color-mix(in oklab, white 46%, var(--petal) 54%)",
          }}
        >
          <div className="min-w-0 truncate font-medium">
            <span className="font-serif text-sm">Ark Matcha</span>
            <span className="mx-1.5 hidden sm:inline">·</span>
            <span className="hidden sm:inline">Ceremonial grade matcha made in Japan.</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <a
              href={s?.instagram_url ?? "https://www.instagram.com/arkmatcha?utm_source=qr"}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="glass-bubble h-11 w-11 text-[color:var(--petal-strong)] transition-transform hover:scale-110 active:scale-95"
            >
              <Instagram className="h-6 w-6" />
            </a>
            <a
              href={s?.tiktok_url ?? "https://www.tiktok.com/@arkmatcha?_r=1&_t=ZS-97ZHVb8tPsq"}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="glass-bubble h-11 w-11 text-[color:var(--petal-strong)] transition-transform hover:scale-110 active:scale-95"
            >
              <TikTokIcon className="h-6 w-6" />
            </a>
          </div>

          <div className="justify-self-end">
            <Link to="/auth" aria-label="Admin login" className="glass-bubble h-8 w-8 text-[color:var(--petal-strong)]">
              <LockKeyhole className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
