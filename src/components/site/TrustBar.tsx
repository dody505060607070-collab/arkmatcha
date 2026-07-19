import { useQuery } from "@tanstack/react-query";
import { Award, Leaf, ShieldCheck, Truck } from "lucide-react";
import { settingsQuery } from "@/lib/queries";

const ICONS = [Leaf, Award, Truck, ShieldCheck];

export function TrustBar() {
  const { data: s } = useQuery(settingsQuery);
  const pills = (s?.trust_pills && s.trust_pills.length ? s.trust_pills : [
    "Made in Japan",
    "Ceremonial Grade",
    "Cash on Delivery",
    "Whisked at Home",
  ]).slice(0, 6);

  return (
    <section
      className="border-y border-[color:var(--border)]"
      style={{ background: "color-mix(in oklab, var(--matcha) 6%, var(--background))" }}
    >
      <div className="container-soft grid grid-cols-2 gap-3 py-5 md:grid-cols-4 md:gap-6">
        {pills.map((p, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <div key={p + i} className="flex items-center gap-2 text-[color:var(--forest)]">
              <Icon className="h-4 w-4 shrink-0 text-[color:var(--matcha)]" />
              <span className="text-[11px] uppercase tracking-[0.18em] md:text-xs">{p}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
