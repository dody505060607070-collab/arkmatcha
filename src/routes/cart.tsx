import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { settingsQuery } from "@/lib/queries";
import { useContent } from "@/lib/useContent";
import { TinIllustration } from "@/components/site/TinIllustration";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart — Ark Matcha" },
      { property: "og:url", content: "/cart" },
    ],
    links: [{ rel: "canonical", href: "/cart" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery),
  component: CartPage,
});

function CartPage() {
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const subtotal = useCart((s) => s.subtotal());
  const { data: s } = useQuery(settingsQuery);
  const c = useContent();
  const shipping = Number(s?.shipping_fee ?? 0);
  const total = subtotal + (items.length > 0 ? shipping : 0);
  const title = c.cart?.title || "Your Cart";
  const emptyText = c.cart?.empty || "Your cart is empty";
  const checkoutText = c.cart?.checkout || "Checkout";

  if (items.length === 0) {
    return (
      <main className="container-soft py-24 text-center">
        <h1 className="font-serif text-4xl mb-4">{emptyText}</h1>
        <p className="text-[color:var(--muted-foreground)] mb-8">Choose your ritual to get started.</p>
        <Link to="/" className="btn-primary inline-flex">Shop Matcha</Link>
      </main>
    );
  }

  return (
    <main className="container-soft py-12">
      <h1 className="font-serif text-4xl mb-10">{title}</h1>
      <div className="grid md:grid-cols-[1fr_360px] gap-10">
        <ul className="space-y-4">
          {items.map((i) => (
            <li key={i.productId} className="flex gap-5 p-5 rounded-2xl bg-[color:var(--card)] border border-[color:var(--border)] items-center">
              <div className={`shrink-0 rounded-xl p-2 ${i.slug === "ark-matcha-30g" ? "bg-[color:var(--cream)]" : "bg-[color:var(--pale)]"}`}>
                <TinIllustration
                  variant={i.slug === "ark-matcha-30g" ? "30g" : "50g"}
                  imageUrl={i.image || undefined}
                  className="h-20 w-auto"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-lg truncate">{i.name}</h3>
                  <span className="text-xs uppercase text-[color:var(--olive)] tracking-widest whitespace-nowrap">{i.size}</span>
                </div>
                <div className="text-sm text-[color:var(--muted-foreground)] mt-1">
                  {i.price != null ? `EGP ${Number(i.price).toFixed(2)}` : "Price coming soon"}
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center border border-[color:var(--border)] rounded-full overflow-hidden">
                    <button onClick={() => setQuantity(i.productId, i.quantity - 1)} aria-label="Decrease" className="p-2 hover:bg-[color:var(--pale)]">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-3 text-sm min-w-[2rem] text-center">{i.quantity}</span>
                    <button onClick={() => setQuantity(i.productId, i.quantity + 1)} aria-label="Increase" className="p-2 hover:bg-[color:var(--pale)]">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button onClick={() => remove(i.productId)} aria-label="Remove" className="ml-auto text-[color:var(--muted-foreground)] hover:text-[color:var(--destructive)] p-2">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <aside className="h-fit rounded-2xl bg-[color:var(--pale)] p-6 border border-[color:var(--border)]">
          <h2 className="font-serif text-xl mb-5">Order Summary</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-[color:var(--muted-foreground)]">Subtotal</dt><dd>EGP {subtotal.toFixed(2)}</dd></div>
            <div className="flex justify-between"><dt className="text-[color:var(--muted-foreground)]">Shipping</dt><dd>{shipping > 0 ? `EGP ${shipping.toFixed(2)}` : "Free"}</dd></div>
            <div className="border-t border-[color:var(--border)] pt-3 flex justify-between font-serif text-lg">
              <dt>Total</dt><dd>EGP {total.toFixed(2)}</dd>
            </div>
          </dl>
          <Link to="/checkout" className="btn-primary w-full mt-6">{checkoutText}</Link>
          <p className="text-xs text-[color:var(--muted-foreground)] text-center mt-3">Cash on Delivery only</p>
        </aside>
      </div>
    </main>
  );
}
