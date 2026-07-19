import { useEffect, useState } from "react";
import { X, Check, Copy, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { settingsQuery } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { brandAssets } from "@/lib/brand-assets";

const STORAGE_KEY = "ark_welcome_dismissed_v2";

export function WelcomePopup() {
  const { data: settings } = useQuery(settingsQuery);
  const home = (settings?.content as any)?.home ?? {};

  const enabled = home.welcomeEnabled === true;
  const eyebrow: string = home.welcomeEyebrow || "Members only";
  const title: string = home.welcomeTitle || "A little gift, on us.";
  const message: string =
    home.welcomeMessage ||
    "Join the Ark ritual and unlock 10% off your first tin. Slow mornings start here.";
  const discountLabel: string = home.welcomeDiscountLabel || "10% OFF";
  const discountCode: string = home.welcomeDiscountCode || "ARK10";
  const ctaText: string = home.welcomeCtaText || "Shop the collection";
  const ctaLink: string = home.welcomeCtaLink || "/shop";
  const image: string = home.welcomeImage || "";
  const logo: string = settings?.logo_url?.trim() || brandAssets.logo;

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => {
      setOpen(true);
      requestAnimationFrame(() => setMounted(true));
    }, 1200);
    return () => clearTimeout(t);
  }, [enabled]);

  function close() {
    setMounted(false);
    setTimeout(() => setOpen(false), 250);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  }

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: email.trim().toLowerCase() });
      if (error && !`${error.message}`.toLowerCase().includes("duplicate")) {
        throw error;
      }
      setSubscribed(true);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(discountCode);
      setCopied(true);
      toast.success("Code copied");
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }

  if (!enabled || !open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center px-3 pb-4 md:items-center md:pb-0"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        onClick={close}
        aria-hidden
      />

      <div
        className={`relative w-full max-w-[420px] overflow-hidden rounded-3xl shadow-2xl transition-all duration-300 md:max-w-[860px] ${
          mounted ? "translate-y-0 opacity-100 scale-100" : "translate-y-6 opacity-0 scale-[0.98]"
        }`}
        style={{ background: "var(--background)" }}
      >
        <button
          aria-label="Close"
          onClick={close}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/70 text-[color:var(--forest)] backdrop-blur hover:bg-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Visual side */}
          <div
            className="relative hidden min-h-[420px] overflow-hidden md:block"
            style={{ background: "var(--matcha)" }}
          >
            {image ? (
              <img
                src={image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <>
                {/* Rotating logo watermark */}
                <img
                  src={logo}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.12] animate-[spin_22s_linear_infinite]"
                />
                <div className="relative flex h-full items-center justify-center p-10">
                  <div className="text-center text-white">
                    <p className="font-serif text-[10px] uppercase tracking-[0.4em] opacity-80">
                      Ark Matcha
                    </p>
                    <p className="mt-6 font-serif text-6xl leading-none tracking-tight">
                      {discountLabel}
                    </p>
                    <p className="mt-6 text-xs uppercase tracking-[0.3em] opacity-80">
                      Welcome offer
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>


          {/* Content side */}
          <div className="p-6 md:p-9">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[color:var(--matcha)]">
              {eyebrow}
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-[1.05] text-[color:var(--forest)] md:text-4xl">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--forest)]/75">
              {message}
            </p>

            {/* Mobile discount banner */}
            <div
              className="mt-5 flex items-center justify-between rounded-2xl px-4 py-3 md:hidden"
              style={{ background: "var(--matcha)" }}
            >
              <div className="text-white">
                <p className="text-[9px] uppercase tracking-[0.3em] opacity-80">
                  Welcome offer
                </p>
                <p className="font-serif text-xl">{discountLabel}</p>
              </div>
            </div>

            {!subscribed ? (
              <form onSubmit={subscribe} className="mt-5">
                <label className="text-[11px] uppercase tracking-[0.25em] text-[color:var(--forest)]/60">
                  Your email
                </label>
                <div className="mt-2 flex overflow-hidden rounded-full border border-[color:var(--border)] bg-white focus-within:border-[color:var(--matcha)]">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@arkmatcha.com"
                    className="w-full bg-transparent px-4 py-3 text-sm outline-none"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-1 px-4 text-sm font-medium text-white disabled:opacity-60"
                    style={{ background: "var(--matcha)" }}
                  >
                    {submitting ? "…" : (<>Unlock <ArrowRight className="h-3.5 w-3.5" /></>)}
                  </button>
                </div>
                <p className="mt-3 text-[10px] text-[color:var(--forest)]/50">
                  By subscribing you agree to receive occasional Ark Matcha emails. Unsubscribe anytime.
                </p>
              </form>
            ) : (
              <div className="mt-5">
                <p className="text-[11px] uppercase tracking-[0.25em] text-[color:var(--matcha)]">
                  Your code
                </p>
                <div className="mt-2 flex items-center justify-between rounded-full border border-dashed border-[color:var(--matcha)] bg-[color:var(--matcha)]/5 px-5 py-3">
                  <span className="font-serif text-xl tracking-[0.2em] text-[color:var(--forest)]">
                    {discountCode}
                  </span>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[color:var(--matcha)]"
                  >
                    {copied ? (<><Check className="h-3.5 w-3.5" /> Copied</>) : (<><Copy className="h-3.5 w-3.5" /> Copy</>)}
                  </button>
                </div>
                <Link
                  to={ctaLink as "/shop"}
                  onClick={close}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white"
                  style={{ background: "var(--matcha)" }}
                >
                  {ctaText} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}

            <button
              onClick={close}
              className="mt-4 block w-full text-center text-[11px] uppercase tracking-[0.25em] text-[color:var(--forest)]/50 hover:text-[color:var(--forest)]"
            >
              No thanks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
