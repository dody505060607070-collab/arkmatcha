import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpenText, Grid2X2, House, Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";

const links = [
  { to: "/", label: "Home", icon: House },
  { to: "/catalog", label: "Catalog", icon: Grid2X2 },
  { to: "/blog", label: "Blog", icon: BookOpenText },
  { to: "/cart", label: "Cart", icon: ShoppingBag },
] as const;

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 px-3 pt-3">
      <div className="container-soft">
        <div className="glass-bubble grid grid-cols-[minmax(0,1fr)_auto] items-center px-3 py-2 sm:flex sm:justify-between">
          <Link to="/" className="min-w-0 truncate font-serif text-xl text-[color:var(--forest)] sm:text-2xl">
            Ark <span className="italic font-normal">Matcha</span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
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

          <div className="flex items-center gap-2 md:hidden">
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
