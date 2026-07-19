import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

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
    "w-full rounded-lg border border-[color:var(--border)] bg-white px-4 py-3 text-base text-[color:var(--forest)] transition focus:border-[color:var(--matcha)] focus:outline-none focus:ring-2 focus:ring-[color:var(--matcha)]/20";
  const labelCls =
    "mb-1.5 block text-sm text-[color:var(--forest)]/70";

  return (
    <main>
      <section className="container-soft py-10 md:py-16">
        <div className="mx-auto max-w-xl">
          <h1 className="font-serif text-4xl text-[color:var(--forest)] md:text-5xl">
            Contact
          </h1>

          <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
            <div>
              <label htmlFor="c-name" className={labelCls}>Name</label>
              <input
                id="c-name"
                className={field}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                maxLength={100}
              />
            </div>

            <div>
              <label htmlFor="c-phone" className={labelCls}>Phone</label>
              <input
                id="c-phone"
                className={field}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                maxLength={40}
              />
            </div>

            <div>
              <label htmlFor="c-email" className={labelCls}>Email</label>
              <input
                id="c-email"
                type="email"
                required
                className={field}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                maxLength={255}
              />
            </div>

            <div>
              <label htmlFor="c-message" className={labelCls}>Message</label>
              <textarea
                id="c-message"
                rows={6}
                className={`${field} resize-none`}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={2000}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: "var(--matcha)" }}
            >
              {loading ? "Sending..." : "Send message"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

