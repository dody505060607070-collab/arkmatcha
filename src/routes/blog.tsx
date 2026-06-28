import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Instagram, Mail, Phone } from "lucide-react";
import { Newsletter } from "@/components/site/Newsletter";
import { brandAssets } from "@/lib/brand-assets";
import { settingsQuery } from "@/lib/queries";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "About — Ark Matcha" },
      { name: "description", content: "About Ark Matcha — ceremonial grade matcha for calm daily rituals." },
      { property: "og:title", content: "About Ark Matcha" },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery),
  component: BlogPage,
});

export function BlogPage() {
  const { data: settings } = useSuspenseQuery(settingsQuery);

  return (
    <main>
      <section className="container-soft py-12 md:py-16">
        <header className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[color:var(--petal-strong)]">About</p>
          <h1 className="mb-5 font-serif text-4xl md:text-5xl">A calm daily ritual, designed softly.</h1>
          <p className="leading-relaxed text-[color:var(--muted-foreground)]">{settings?.brand_story}</p>
        </header>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_1.05fr] md:items-center">
          <div className="soft-panel overflow-hidden p-4">
            <img
              src={brandAssets.matchaPowder}
              alt="Ceremonial grade matcha powder"
              className="w-full rounded-[1.75rem] object-cover"
            />
          </div>

          <div className="soft-panel p-7 md:p-9">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[color:var(--olive)]">What Makes Ceremonial Grade Matcha Special?</p>
            <h2 className="mb-4 font-serif text-3xl md:text-4xl">Smooth taste, vibrant color, and a finer ritual.</h2>
            <p className="leading-relaxed text-[color:var(--muted-foreground)]">
              Ceremonial grade matcha is known for its smooth taste, fine texture, and vibrant green color. Ark Matcha is made for simple daily rituals, whether you enjoy it warm, iced, or as a creamy matcha latte.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--pale)]/60">
        <div className="container-soft grid gap-8 py-14 md:grid-cols-2 md:items-start">
          <div className="soft-panel p-7 md:p-9">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[color:var(--petal-strong)]">Contact</p>
            <h2 className="mb-4 font-serif text-3xl">Get in touch</h2>
            <p className="mb-6 text-[color:var(--muted-foreground)]">
              For questions, wholesale, or to say hello — we would love to hear from you.
            </p>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[color:var(--petal-strong)]" />
                <a href={`mailto:${settings?.contact_email}`} className="hover:underline">
                  {settings?.contact_email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[color:var(--petal-strong)]" />
                <a
                  href={`https://wa.me/${(settings?.phone ?? "").replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {settings?.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Instagram className="h-4 w-4 text-[color:var(--petal-strong)]" />
                <a href={settings?.instagram_url} target="_blank" rel="noreferrer" className="hover:underline">
                  @arkmatcha
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-block h-4 w-4 text-center text-[color:var(--petal-strong)]">♪</span>
                <a href={settings?.tiktok_url} target="_blank" rel="noreferrer" className="hover:underline">
                  TikTok @arkmatcha
                </a>
              </li>
            </ul>
          </div>

          <div className="soft-panel p-7 md:p-9">
            <Newsletter compact />
          </div>
        </div>
      </section>
    </main>
  );
}
