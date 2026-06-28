import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpenText, Grid2X2, House, Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { brandAssets } from "@/lib/brand-assets";

const links = [
  { to: "/", label: "Home", icon: House },
  { to: "/catalog", label: "Catalog", icon: Grid2X2 },
  { to: "/blog", label: "Blog", icon: BookOpenText },
  { to: "/cart", label: "Cart", icon: ShoppingBag },
] as const;

function Logo() {
  return (
    <Link
      to="/"
      aria-label="Ark Matcha home"
      className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-[color:var(--border)] bg-white shadow-sm sm:h-12 sm:w-12"
    >
      <img src={brandAssets.logo} alt="Ark Matcha" className="h-full w-full object-cover" />
    </Link>
  );
}

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 px-3 pt-3">
      <div className="container-soft">
        <div className="glass-bubble grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 py-2">
          <Logo />

          <nav className="hidden items-center justify-center gap-2 md:flex">
            {links.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.to;
              const isCart = link.to === "/cart";
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="glass-bubble px-4 py-2 text-sm text-[color:var(--forest)]"
                  style={{
                    background: active
                      ? "color-mix(in oklab, white 48%, var(--petal) 52%)"
                      : undefined,
                  }}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{link.label}</span>
                  {isCart && count > 0 ? <span className="text-xs">{count}</span> : null}
                </Link>
              );
            })}
          </nav>

          {/* Spacer for mobile to keep logo on the left while right cluster sits on the right */}
          <div className="md:hidden" />

          <div className="flex items-center justify-end gap-2 md:hidden">
            <Link to="/cart" className="glass-bubble relative h-10 w-10 text-[color:var(--forest)]" aria-label="Cart">
              <ShoppingBag className="h-4 w-4" />
              {count > 0 ? (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[color:var(--forest)] px-1 text-[10px] text-[color:var(--cream)]">
                  {count}
                </span>
              ) : null}
            </Link>
            <button
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="glass-bubble h-10 w-10 text-[color:var(--forest)]"
              type="button"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>

          {/* Right slot on desktop balances the logo width so the centered nav stays truly centered */}
          <div className="hidden h-11 w-11 md:block" />
        </div>

        {open ? (
          <div className="mt-3 soft-panel p-3 md:hidden">
            <nav className="grid grid-cols-2 gap-2">
              {links.map((link) => {
                const Icon = link.icon;
                const isCart = link.to === "/cart";
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="glass-bubble justify-start px-4 py-3 text-sm text-[color:var(--forest)]"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{link.label}</span>
                    {isCart && count > 0 ? <span className="ml-auto text-xs">{count}</span> : null}
                  </Link>
                );
              })}
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
