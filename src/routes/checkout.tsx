import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart";
import { settingsQuery } from "@/lib/queries";
import { GOVERNORATES, shippingFor } from "@/lib/egypt-governorates";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Ark Matcha" },
      { property: "og:url", content: "/checkout" },
    ],
    links: [{ rel: "canonical", href: "/checkout" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery),
  component: CheckoutPage,
});

const schema = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name").max(120),
  phone: z.string().trim().min(5).max(40),
  whatsapp: z.string().trim().max(40).optional().or(z.literal("")),
  email: z.string().trim().email("Invalid email").max(254).optional().or(z.literal("")),
  governorate: z.string().trim().min(1, "Please select your governorate").max(80),
  city: z.string().trim().min(1, "Please enter your city or area").max(80),
  address: z.string().trim().min(5, "Please enter your full address").max(400),
  building: z.string().trim().max(200).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const clear = useCart((s) => s.clear);
  const [governorate, setGovernorate] = useState<string>("");
  const shipping = governorate ? shippingFor(governorate) : 0;
  const total = subtotal + (items.length > 0 ? shipping : 0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const raw = Object.fromEntries(form) as Record<string, string>;
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("orders").insert({
      ...parsed.data,
      whatsapp: parsed.data.whatsapp || null,
      email: parsed.data.email || null,
      building: parsed.data.building || null,
      notes: parsed.data.notes || null,
      items: items.map((i) => ({
        product_id: i.productId,
        name: i.name,
        size: i.size,
        price: i.price,
        quantity: i.quantity,
      })),
      subtotal,
      shipping_fee: shipping,
      total,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    clear();
    setDone(true);
  }

  if (done) {
    return (
      <main className="container-soft py-24 text-center max-w-xl mx-auto">
        <h1 className="font-serif text-4xl mb-4">Thank you.</h1>
        <p className="text-[color:var(--muted-foreground)] mb-8">
          Your Ark Matcha order has been received. We will contact you soon to confirm delivery.
        </p>
        <Link to="/" className="btn-primary inline-flex">Back home</Link>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="container-soft py-24 text-center">
        <h1 className="font-serif text-3xl mb-3">Your cart is empty</h1>
        <Link to="/catalog" className="btn-primary inline-flex mt-4">Shop Matcha</Link>
      </main>
    );
  }

  const input = "w-full px-4 py-3 rounded-xl bg-[color:var(--cream)] border border-[color:var(--border)] focus:outline-none focus:ring-2 focus:ring-[color:var(--olive)]";

  return (
    <main className="container-soft py-12">
      <button onClick={() => navigate({ to: "/cart" })} className="text-sm text-[color:var(--muted-foreground)] mb-4">← Back to cart</button>
      <h1 className="font-serif text-4xl mb-10">Checkout</h1>
      <form onSubmit={submit} className="grid md:grid-cols-[1fr_360px] gap-10">
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block"><span className="text-sm">Full name *</span><input name="full_name" required className={input} /></label>
            <label className="block"><span className="text-sm">Phone number *</span><input name="phone" required className={input} /></label>
            <label className="block"><span className="text-sm">WhatsApp number</span><input name="whatsapp" className={input} /></label>
            <label className="block"><span className="text-sm">Email</span><input type="email" name="email" className={input} /></label>
            <label className="block"><span className="text-sm">City *</span><input name="city" required className={input} /></label>
            <label className="block"><span className="text-sm">Building / apartment</span><input name="building" className={input} /></label>
          </div>
          <label className="block"><span className="text-sm">Full address *</span><textarea name="address" required rows={3} className={input} /></label>
          <label className="block"><span className="text-sm">Order notes</span><textarea name="notes" rows={3} className={input} /></label>
        </div>
        <aside className="h-fit rounded-2xl bg-[color:var(--pale)] p-6 border border-[color:var(--border)]">
          <h2 className="font-serif text-xl mb-4">Your order</h2>
          <ul className="space-y-3 text-sm mb-5">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between">
                <span>{i.name} × {i.quantity}</span>
                <span>{i.price != null ? `EGP ${(i.price * i.quantity).toFixed(2)}` : "—"}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 text-sm border-t border-[color:var(--border)] pt-4">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>EGP {subtotal.toFixed(2)}</dd></div>
            <div className="flex justify-between"><dt>Shipping</dt><dd>{shipping > 0 ? `EGP ${shipping.toFixed(2)}` : "Free"}</dd></div>
            <div className="flex justify-between font-serif text-lg pt-2 border-t border-[color:var(--border)] mt-2">
              <dt>Total</dt><dd>EGP {total.toFixed(2)}</dd>
            </div>
          </dl>
          <div className="mt-5 p-4 rounded-xl bg-[color:var(--cream)] text-sm">
            <strong>Cash on Delivery</strong>
            <p className="text-[color:var(--muted-foreground)] mt-1">Pay when your order arrives.</p>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-5 disabled:opacity-60">
            {loading ? "Placing order..." : "Place Order"}
          </button>
        </aside>
      </form>
    </main>
  );
}
