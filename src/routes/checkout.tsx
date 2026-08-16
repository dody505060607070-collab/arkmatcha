import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart";
import { settingsQuery } from "@/lib/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { governoratesWithRates, shippingForWithRates } from "@/lib/egypt-governorates";
import { toast } from "sonner";
import { notifyAdmins } from "@/lib/push-client";
import { redeemDiscountCode } from "@/lib/discount.functions";


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
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const rates = (settings?.shipping_rates ?? null) as Record<string, number> | null;
  const governorates = governoratesWithRates(rates);
  const [governorate, setGovernorate] = useState<string>("");
  const shipping = governorate ? shippingForWithRates(governorate, rates) : 0;
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const applied = useCart((s) => s.discount);
  const discountAmount = applied ? Math.round(subtotal * applied.percent) / 100 : 0;
  const total = Math.max(0, subtotal - discountAmount) + (items.length > 0 ? shipping : 0);

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
    const orderId = crypto.randomUUID();
    const { error } = await supabase.from("orders").insert({
      id: orderId,
      ...parsed.data,
      email: parsed.data.email || null,
      building: parsed.data.building || null,
      notes: parsed.data.notes || null,
      items: items.map((i) => {
        const [id, variant] = i.productId.split(":");
        return {
          id: id,
          product_id: id, // Keep for backward compatibility/clarity
          name: i.name,
          size: i.size,
          price: i.price,
          quantity: i.quantity,
          variant: variant || null,
        };
      }),
      subtotal,
      shipping_fee: shipping,
      discount_code: applied?.code ?? null,
      discount_amount: discountAmount,
      total,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    if (applied) { void redeemDiscountCode({ data: { code: applied.code } }); }
    notifyAdmins("order", orderId);
    clear();
    setDone(true);
  }


  if (done) {
    return (
      <main className="container-soft py-24 text-center max-w-xl mx-auto">
        <h1 className="font-serif text-4xl mb-4">Thank you.</h1>
        <p className="text-[color:var(--muted-foreground)] mb-8">
          Your Ark Matcha order has been received.
        </p>
        <Link to="/" className="btn-primary inline-flex">Back home</Link>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="container-soft py-24 text-center">
        <h1 className="font-serif text-3xl mb-3">Your cart is empty</h1>
        <Link to="/" className="btn-primary inline-flex mt-4">Shop Matcha</Link>
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
            <label className="block"><span className="text-sm">Email</span><input type="email" name="email" className={input} /></label>
            <label className="block sm:col-span-2">
              <span className="text-sm">Governorate * <span className="text-[color:var(--muted-foreground)]">(shipping is added based on your governorate)</span></span>
              <select
                name="governorate"
                required
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
                className={input}
              >
                <option value="">Select your governorate…</option>
                {governorates.map((g) => (
                  <option key={g.value} value={g.value}>{g.label} — EGP {g.shipping}</option>
                ))}
              </select>
            </label>
            <label className="block"><span className="text-sm">City / area *</span><input name="city" required className={input} /></label>
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
          {applied && (
            <div className="mb-4 flex items-center justify-between px-3 py-2 rounded-xl bg-[color:var(--matcha)]/10 border border-[color:var(--matcha)]/20 text-xs">
              <div className="flex items-center gap-2 text-[color:var(--matcha)] font-medium">
                <span>Code applied: <strong>{applied.code}</strong> (−{applied.percent}%)</span>
              </div>
            </div>
          )}
          <dl className="space-y-2 text-sm border-t border-[color:var(--border)] pt-4">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>EGP {subtotal.toFixed(2)}</dd></div>
            {applied && (
              <div className="flex justify-between text-[color:var(--olive)]">
                <dt>Discount ({applied.code} · {applied.percent}%)</dt><dd>− EGP {discountAmount.toFixed(2)}</dd>
              </div>
            )}
            <div className="flex justify-between"><dt>Shipping</dt><dd>{(governorate && shipping > 0) ? `EGP ${shipping.toFixed(2)}` : (governorate ? "Free" : "Select governorate")}</dd></div>
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
