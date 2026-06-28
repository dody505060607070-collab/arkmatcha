import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";

const links = [
  { to: "/", label: "Home" },
  { to: "/catalog", label: "Catalog" },
  { to: "/blog", label: "Blog" },
  { to: "/cart", label: "Cart" },
];

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[color:var(--cream)]/85 backdrop-blur border-b border-[color:var(--border)]">
      <div className="container-soft flex items-center justify-between h-16">
        <Link to="/" className="font-serif text-2xl tracking-tight text-[color:var(--forest)]">
          Ark <span className="italic font-normal">Matcha</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`relative transition-colors ${
                pathname === l.to
                  ? "text-[color:var(--forest)]"
                  : "text-[color:var(--muted-foreground)] hover:text-[color:var(--forest)]"
              }`}
            >
              {l.label}
              {l.to === "/cart" && count > 0 && (
                <span className="ml-1 text-xs">({count})</span>
              )}
            </Link>
          ))}
          <Link to="/auth" className="text-xs uppercase tracking-widest text-[color:var(--olive)] hover:text-[color:var(--forest)]">
            Admin
          </Link>
        </nav>
        <div className="flex items-center gap-3 md:hidden">
          <Link to="/cart" className="relative p-2">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 text-[10px] bg-[color:var(--forest)] text-[color:var(--cream)] rounded-full px-1.5">
                {count}
              </span>
            )}
          </Link>
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="p-2"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-[color:var(--border)] bg-[color:var(--cream)]">
          <div className="container-soft py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-1 text-base"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/auth"
              onClick={() => setOpen(false)}
              className="py-1 text-xs uppercase tracking-widest text-[color:var(--olive)]"
            >
              Admin Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
