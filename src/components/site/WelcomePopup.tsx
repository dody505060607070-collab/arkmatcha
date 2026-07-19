import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/queries";

const STORAGE_KEY = "ark_welcome_dismissed_v1";

export function WelcomePopup() {
  const { data: settings } = useQuery(settingsQuery);
  const home = (settings?.content as any)?.home ?? {};
  const enabled = home.welcomeEnabled === true;
  const title: string = home.welcomeTitle || "Welcome to Ark Matcha";
  const message: string =
    home.welcomeMessage ||
    "Ceremonial grade matcha, whisked at home. Free shipping across Egypt on select orders.";

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setOpen(true), 900);
    return () => clearTimeout(t);
  }, [enabled]);

  function close() {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  }

  if (!enabled || !open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center px-4 pb-6 md:items-center md:pb-0"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={close}
        aria-hidden
      />
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-3xl p-6 shadow-xl md:p-8"
        style={{ background: "var(--background)", border: "1px solid var(--border)" }}
      >
        <button
          aria-label="Close"
          onClick={close}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-[color:var(--forest)]/70 hover:bg-black/5"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--matcha)]">
          Hello there
        </p>
        <h2 className="mt-2 font-serif text-2xl leading-tight text-[color:var(--forest)] md:text-3xl">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[color:var(--forest)]/75">
          {message}
        </p>
        <button
          onClick={close}
          className="mt-5 inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium text-white"
          style={{ background: "var(--matcha)" }}
        >
          Explore
        </button>
      </div>
    </div>
  );
}
