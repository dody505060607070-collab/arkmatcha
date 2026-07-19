import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Instagram } from "lucide-react";
import { settingsQuery } from "@/lib/queries";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M16.5 3a5.5 5.5 0 0 0 5 3.2v3.2a8.6 8.6 0 0 1-5-1.6v7.4A6.6 6.6 0 1 1 10 8.6v3.3a3.3 3.3 0 1 0 3.3 3.3V3h3.2z" />
    </svg>
  );
}

export function Footer() {
  const { data: settings } = useQuery(settingsQuery);
  const instagram =
    settings?.instagram_url?.trim() || "https://www.instagram.com/arkmatcha";
  const tiktok =
    settings?.tiktok_url?.trim() || "https://www.tiktok.com/@arkmatcha";

  const year = new Date().getFullYear();
  return (
    <footer
      className="mt-16 border-t border-[color:var(--border)]"
      style={{ background: "var(--background)" }}
    >
      <div className="container-soft flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-[color:var(--muted-foreground)]">
        <span>© {year}, Ark Matcha</span>

        <div className="flex items-center gap-3">
          <a
            href={instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="grid h-9 w-9 place-items-center rounded-full text-[color:var(--forest)] transition-colors hover:bg-[color:var(--matcha)] hover:text-white"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <a
            href={tiktok}
            target="_blank"
            rel="noreferrer"
            aria-label="TikTok"
            className="grid h-9 w-9 place-items-center rounded-full text-[color:var(--forest)] transition-colors hover:bg-[color:var(--matcha)] hover:text-white"
          >
            <TikTokIcon className="h-4 w-4" />
          </a>
        </div>

        <Link to="/privacy" className="hover:underline">
          Privacy policy
        </Link>
      </div>
    </footer>
  );
}
