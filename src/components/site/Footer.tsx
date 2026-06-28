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
          className="grid grid-cols-1 gap-3 rounded-[999px] border px-4 py-3 text-xs text-[color:var(--forest)] shadow-sm backdrop-blur md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center"
          style={{
            background: "color-mix(in oklab, white 54%, var(--petal) 46%)",
            borderColor: "color-mix(in oklab, white 46%, var(--petal) 54%)",
          }}
        >


          <div className="min-w-0 text-center font-medium md:text-left">
            <span className="font-serif text-sm">Ark Matcha</span>
            <span className="mx-1.5 hidden md:inline">·</span>
            <span className="block truncate md:inline">Ceremonial grade matcha made in Japan.</span>
          </div>

          <div className="flex items-center justify-center gap-2 md:justify-self-center">
            <a
              href={s?.instagram_url ?? "https://www.instagram.com/arkmatcha?utm_source=qr"}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="glass-bubble h-9 w-9 text-[color:var(--petal-strong)]"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={s?.tiktok_url ?? "https://www.tiktok.com/@arkmatcha?_r=1&_t=ZS-97ZHVb8tPsq"}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="glass-bubble h-9 w-9 text-[color:var(--petal-strong)]"
            >
              <TikTokIcon className="h-4 w-4" />
            </a>
          </div>

          <div className="justify-self-center md:justify-self-end">
            <Link to="/auth" aria-label="Admin login" className="glass-bubble h-9 w-9 text-[color:var(--petal-strong)]">
              <LockKeyhole className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
