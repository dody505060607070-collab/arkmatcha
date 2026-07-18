import { Link } from "@tanstack/react-router";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="mt-16 border-t border-[color:var(--border)]"
      style={{ background: "var(--background)" }}
    >
      <div className="container-soft flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-[color:var(--muted-foreground)]">
        <span>© {year}, Ark Matcha</span>
        <Link to="/privacy" className="hover:underline">
          Privacy policy
        </Link>
      </div>
    </footer>
  );
}
