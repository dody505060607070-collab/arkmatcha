import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | Ark Matcha" },
      {
        name: "description",
        content:
          "Get in touch with Ark Matcha — questions, wholesale, or feedback about our ceremonial matcha.",
      },
      { property: "og:title", content: "Contact — Ark Matcha" },
      {
        property: "og:description",
        content: "Send us a message and we'll get back to you.",
      },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().max(100).optional(),
  email: z.string().trim().email({ message: "Please enter a valid email" }).max(255),
  phone: z.string().trim().max(40).optional(),
  message: z
    .string()
    .trim()
    .min(1, { message: "Please write a message" })
    .max(2000),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name || "Anonymous",
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      message: parsed.data.message,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Message sent. We'll be in touch soon.");
    setForm({ name: "", email: "", phone: "", message: "" });
  }

  const field =
    "peer w-full rounded-xl border border-[color:var(--border)] bg-white/60 px-4 pt-5 pb-2 text-base text-[color:var(--forest)] placeholder-transparent transition focus:border-[color:var(--matcha)] focus:outline-none focus:ring-2 focus:ring-[color:var(--matcha)]/20";
  const label =
    "pointer-events-none absolute left-4 top-2 text-[10px] uppercase tracking-[0.2em] text-[color:var(--forest)]/60 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-[color:var(--forest)]/50 peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.2em] peer-focus:text-[color:var(--matcha)]";

  return (
    <main>
      <section className="container-soft py-10 md:py-16">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[color:var(--matcha)]">
            We'd love to hear from you
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-[color:var(--forest)] md:text-6xl">
            Get in touch
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[color:var(--forest)]/70 md:text-base">
            Questions, wholesale, or a story to share — send us a note and we'll reply within 24 hours.
          </p>
        </div>

        {/* Card */}
        <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-3xl border border-[color:var(--border)] bg-white/50 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.15)] backdrop-blur md:mt-14">
          <div className="grid md:grid-cols-[minmax(0,1fr)_1.2fr]">
            {/* Info panel */}
            <aside
              className="relative overflow-hidden p-8 md:p-10"
              style={{ background: "var(--matcha)", color: "#fff" }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20"
                style={{ background: "radial-gradient(closest-side, #fff, transparent 70%)" }}
              />
              <h2 className="font-serif text-2xl md:text-3xl">Reach us</h2>
              <p className="mt-2 text-sm text-white/80">
                Ark Matcha · Ceremonial grade from Japan.
              </p>

              <ul className="mt-8 space-y-5 text-sm">
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                  <a href="mailto:arkmatcha@gmail.com" className="hover:underline">
                    arkmatcha@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Cash on delivery · Egypt</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Shipping across all governorates</span>
                </li>
                <li className="flex items-start gap-3">
                  <Instagram className="mt-0.5 h-4 w-4 shrink-0" />
                  <a
                    href="https://www.instagram.com/arkmatcha"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    @arkmatcha
                  </a>
                </li>
              </ul>

              <p className="mt-10 text-xs uppercase tracking-[0.28em] text-white/60">
                Response time · under 24h
              </p>
            </aside>

            {/* Form panel */}
            <form onSubmit={submit} className="flex flex-col gap-4 p-6 md:p-10">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="relative">
                  <input
                    id="c-name"
                    className={field}
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    maxLength={100}
                  />
                  <label htmlFor="c-name" className={label}>
                    Name
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="c-phone"
                    className={field}
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    maxLength={40}
                  />
                  <label htmlFor="c-phone" className={label}>
                    Phone
                  </label>
                </div>
              </div>

              <div className="relative">
                <input
                  id="c-email"
                  className={field}
                  type="email"
                  required
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  maxLength={255}
                />
                <label htmlFor="c-email" className={label}>
                  Email *
                </label>
              </div>

              <div className="relative">
                <textarea
                  id="c-message"
                  className={`${field} resize-none`}
                  placeholder="Message"
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  maxLength={2000}
                />
                <label htmlFor="c-message" className={label}>
                  Message
                </label>
              </div>

              <div className="mt-2 flex items-center justify-between gap-4">
                <p className="text-xs text-[color:var(--forest)]/60">
                  By sending, you agree to be contacted about your inquiry.
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full px-7 py-3 text-sm font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                  style={{ background: "var(--matcha)" }}
                >
                  {loading ? "Sending..." : "Send message →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

