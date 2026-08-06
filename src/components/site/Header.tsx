import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Instagram, LogIn, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { brandAssets } from "@/lib/brand-assets";
import { settingsQuery } from "@/lib/queries";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Catalog" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const [hydrated, setHydrated] = useState(false);
  const { data: settings } = useQuery(settingsQuery);
  const liveSettings = hydrated ? settings : undefined;
  const logo = liveSettings?.logo_url?.trim() || brandAssets.logo;
  const announcement =
    liveSettings?.content?.home?.announcementTagline?.trim() ||
    liveSettings?.announcement_text?.trim() ||
    "Your Favorite Ceremonial Matcha";
  const showAnnouncement = hydrated && liveSettings?.announcement_visible !== false;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
        {/* Tiny announcement, sits ABOVE the logo */}
        {showAnnouncement ? (
          <p className="pt-3 text-center text-[10px] uppercase tracking-[0.28em] text-[color:var(--matcha)] md:text-[11px]">
            {announcement}
          </p>
        ) : null}

        <div className="container-soft">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center py-3">
            <div className="flex items-center gap-1">
              {/* Hamburger — mobile only */}
              <button
                aria-label="Open menu"
                type="button"
                onClick={() => setOpen(true)}
                className="grid h-10 w-10 place-items-center text-[color:var(--forest)] md:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>

            <Link
              to="/"
              aria-label="Ark Matcha home"
              className="grid h-14 w-14 place-items-center overflow-hidden rounded-full md:h-16 md:w-16"
            >
              <img src={logo} alt="Ark Matcha" className="h-full w-full object-contain" />
            </Link>

            <div className="flex items-center justify-end gap-1">
              <button
                aria-label="Search"
                type="button"
                className="grid h-10 w-10 place-items-center text-[color:var(--forest)] transition-opacity hover:opacity-70"
              >
                <Search className="h-5 w-5" />
              </button>
              <Link
                to="/auth"
                search={{ e: undefined }}
                aria-label="Account"
                className="hidden h-10 w-10 place-items-center text-[color:var(--forest)] transition-opacity hover:opacity-70 md:grid"
              >
                <User className="h-5 w-5" />
              </Link>
              <Link
                to="/cart"
                aria-label="Cart"
                className="relative grid h-10 w-10 place-items-center text-[color:var(--forest)] transition-opacity hover:opacity-70"
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

          {/* Desktop nav — centered under the logo */}
          <nav className="hidden items-center justify-center gap-10 pb-3 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-base text-[color:var(--forest)] transition-opacity hover:opacity-70"
                activeProps={{ className: "text-base text-[color:var(--matcha)] font-medium underline underline-offset-8" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

      </header>

      {/* Full-screen mobile drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 flex flex-col transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          style={{ background: "var(--background)" }}
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center px-4 py-4">
            <button
              aria-label="Close menu"
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-10 w-10 place-items-center text-[color:var(--forest)]"
            >
              <X className="h-6 w-6" />
            </button>
            <Link
              to="/"
              aria-label="Ark Matcha home"
              className="grid h-20 w-20 place-items-center overflow-hidden rounded-full"
            >
              <img src={logo} alt="Ark Matcha" className="h-full w-full object-contain" />
            </Link>
            <div className="flex justify-end gap-1">
              <button aria-label="Search" className="grid h-10 w-10 place-items-center text-[color:var(--forest)]">
                <Search className="h-5 w-5" />
              </button>
              <Link to="/cart" aria-label="Cart" className="grid h-10 w-10 place-items-center text-[color:var(--forest)]">
                <ShoppingBag className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <nav className="mt-6 flex flex-1 flex-col">
            {navLinks.map((link) => {
              const active = pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="border-t border-[color:var(--border)] px-6 py-5 font-serif text-2xl text-[color:var(--forest)] last:border-b"
                  style={{
                    background: active
                      ? "color-mix(in oklab, var(--matcha) 8%, transparent)"
                      : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-[color:var(--border)] px-6 py-6">
            <Link to="/auth" search={{ e: undefined }} className="flex items-center gap-3 text-[color:var(--forest)]">
              <LogIn className="h-4 w-4" /> Log in
            </Link>
            <a
              href={liveSettings?.instagram_url ?? "https://www.instagram.com/arkmatcha"}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="mt-4 inline-flex items-center gap-2 text-[color:var(--forest)]"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
