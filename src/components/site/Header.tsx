import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Instagram, LogIn, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { brandAssets } from "@/lib/brand-assets";
import { settingsQuery } from "@/lib/queries";

const drawerLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Catalog" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const { data: settings } = useQuery(settingsQuery);
  const logo = settings?.logo_url?.trim() || brandAssets.logo;
  const [open, setOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while drawer open
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40" style={{ background: "var(--background)" }}>
        <div className="container-soft">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center py-4">
            <div className="flex items-center">
              <button
                aria-label="Menu"
                type="button"
                onClick={() => setOpen(true)}
                className="grid h-10 w-10 place-items-center text-[color:var(--forest)]"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>

            <Link
              to="/"
              aria-label="Ark Matcha home"
              className="grid h-14 w-14 place-items-center overflow-hidden rounded-full"
            >
              <img src={logo} alt="Ark Matcha" className="h-full w-full object-contain" />
            </Link>

            <div className="flex items-center justify-end gap-2">
              <button
                aria-label="Search"
                type="button"
                className="grid h-10 w-10 place-items-center text-[color:var(--forest)]"
              >
                <Search className="h-5 w-5" />
              </button>
              <Link
                to="/cart"
                aria-label="Cart"
                className="relative grid h-10 w-10 place-items-center text-[color:var(--forest)]"
              >
                <ShoppingBag className="h-5 w-5" />
                {count > 0 ? (
                  <span className="absolute right-0 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[color:var(--matcha)] px-1 text-[10px] text-white">
                    {count}
                  </span>
                ) : null}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen drawer */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <aside
          className={`absolute inset-0 flex flex-col transition-transform duration-300 ${
            open ? "translate-y-0" : "-translate-y-2"
          }`}
          style={{ background: "var(--background)" }}
        >
          {/* Top bar — X left, logo center, search+cart right */}
          <div className="container-soft">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center py-4">
              <div className="flex items-center">
                <button
                  aria-label="Close menu"
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid h-10 w-10 place-items-center text-[color:var(--forest)]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid h-14 w-14 place-items-center overflow-hidden rounded-full">
                <img src={logo} alt="Ark Matcha" className="h-full w-full object-contain" />
              </div>
              <div className="flex items-center justify-end gap-2">
                <button aria-label="Search" className="grid h-10 w-10 place-items-center text-[color:var(--forest)]">
                  <Search className="h-5 w-5" />
                </button>
                <Link to="/cart" aria-label="Cart" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center text-[color:var(--forest)]">
                  <ShoppingBag className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Nav list — full width rows */}
          <nav className="mt-4 flex flex-col">
            {drawerLinks.map((link, idx) => {
              const active = pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-6 py-4 text-lg text-[color:var(--forest)] ${idx === 0 ? "border-t" : ""} border-b border-[color:var(--border)]`}
                  style={{
                    background: active
                      ? "color-mix(in oklab, var(--forest) 6%, transparent)"
                      : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer — Log in + Instagram bottom-left */}
          <div className="mt-auto border-t border-[color:var(--border)] px-6 py-6">
            <Link
              to="/auth"
              className="flex items-center gap-3 text-[color:var(--forest)]"
            >
              <LogIn className="h-4 w-4" /> Log in
            </Link>
            <a
              href={settings?.instagram_url ?? "https://www.instagram.com/arkmatcha"}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="mt-4 inline-flex items-center gap-2 text-[color:var(--forest)]"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </aside>
      </div>

    </>
  );
}
