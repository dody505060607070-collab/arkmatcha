import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/queries";
import { Newsletter } from "@/components/site/Newsletter";
import { Mail, Phone, Instagram } from "lucide-react";

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

function MatchaSwirl() {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-auto rounded-3xl bg-[color:var(--pale)]">
      <defs>
        <radialGradient id="powder" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7F875F" />
          <stop offset="100%" stopColor="#3D4837" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="150" fill="url(#powder)" />
      <circle cx="200" cy="200" r="150" fill="none" stroke="#1F3326" strokeWidth="2" opacity="0.5" />
      <path d="M120 220 Q200 160 280 220" stroke="#F3EBDD" strokeWidth="3" fill="none" opacity="0.5" />
      <path d="M140 240 Q200 190 260 240" stroke="#F3EBDD" strokeWidth="2" fill="none" opacity="0.4" />
      <text x="200" y="370" textAnchor="middle" fill="#1F3326" fontFamily="Fraunces, serif" fontSize="14" letterSpacing="3">CEREMONIAL MATCHA</text>
    </svg>
  );
}

function BlogPage() {
  const { data: s } = useQuery(settingsQuery);
  return (
    <main>
      <section className="container-soft py-16">
        <header className="text-center mb-12 max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-[color:var(--olive)] mb-3">About</p>
          <h1 className="font-serif text-4xl md:text-5xl mb-5">A Calm Daily Ritual</h1>
          <p className="text-[color:var(--muted-foreground)] leading-relaxed">
            {s?.brand_story}
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="max-w-md">
            <MatchaSwirl />
          </div>
          <div>
            <h2 className="font-serif text-3xl mb-4">What Makes Ceremonial Grade Matcha Special?</h2>
            <p className="text-[color:var(--muted-foreground)] leading-relaxed">
              Ceremonial grade matcha is known for its smooth taste, fine texture, and vibrant green color.
              Ark Matcha is made for simple daily rituals, whether you enjoy it warm, iced, or as a creamy matcha latte.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--pale)]">
        <div className="container-soft py-16 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-serif text-3xl mb-4">Get in touch</h2>
            <p className="text-[color:var(--muted-foreground)] mb-6">
              For questions, wholesale, or to say hello — we're glad to hear from you.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[color:var(--olive)]" />
                <a href={`mailto:${s?.contact_email}`} className="hover:underline">{s?.contact_email}</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[color:var(--olive)]" />
                <a href={`https://wa.me/${(s?.phone ?? "").replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="hover:underline">
                  {s?.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Instagram className="h-4 w-4 text-[color:var(--olive)]" />
                <a href={s?.instagram_url} target="_blank" rel="noreferrer" className="hover:underline">@arkmatcha</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="h-4 w-4 inline-block text-center text-[color:var(--olive)]">♪</span>
                <a href={s?.tiktok_url} target="_blank" rel="noreferrer" className="hover:underline">TikTok @arkmatcha</a>
              </li>
            </ul>
          </div>
          <div className="rounded-3xl bg-[color:var(--cream)] p-8">
            <Newsletter compact />
          </div>
        </div>
      </section>
    </main>
  );
}
