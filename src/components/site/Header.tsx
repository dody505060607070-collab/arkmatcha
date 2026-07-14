import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpenText, House, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { brandAssets } from "@/lib/brand-assets";
import { settingsQuery } from "@/lib/queries";

const links = [
  { to: "/", label: "Home", icon: House },
  { to: "/blog", label: "Blog", icon: BookOpenText },
  { to: "/cart", label: "Cart", icon: ShoppingBag },
] as const;

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const { data: settings } = useQuery(settingsQuery);
  const logo = settings?.logo_url?.trim() || brandAssets.logo;
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white">
      <div className="container-soft">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center py-4">
          <div className="flex items-center">
            <button
              aria-label="Menu"
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center text-[color:var(--petal-strong)]"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <Link
            to="/"
            aria-label="Ark Matcha home"
            className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-white"
          >
            <img src={logo} alt="Ark Matcha" className="h-full w-full object-cover" />
          </Link>

          <div className="flex items-center justify-end gap-3">
            <button
              aria-label="Search"
              type="button"
              className="grid h-9 w-9 place-items-center text-[color:var(--petal-strong)]"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative grid h-9 w-9 place-items-center text-[color:var(--petal-strong)]"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 ? (
                <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[color:var(--petal-strong)] px-1 text-[10px] text-white">
                  {count}
                </span>
              ) : null}
            </Link>
          </div>
        </div>

        {open ? (
          <nav className="grid grid-cols-2 gap-2 pb-3">
            {links.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm text-[color:var(--petal-strong)]"
                  style={{
                    background: active ? "color-mix(in oklab, white 70%, var(--petal) 30%)" : "transparent",
                  }}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
