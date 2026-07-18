import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Ark Matcha" },
      {
        name: "description",
        content: "How Ark Matcha handles your personal information.",
      },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main>
      <section className="container-soft prose max-w-3xl py-12 md:py-16">
        <h1 className="font-serif text-4xl text-[color:var(--forest)] md:text-5xl">
          Privacy Policy
        </h1>
        <div className="mt-8 space-y-5 text-sm leading-relaxed text-[color:var(--forest)]">
          <p>
            Ark Matcha respects your privacy. This page explains what we collect and
            how we use it.
          </p>
          <h2 className="font-serif text-xl">Information we collect</h2>
          <p>
            When you place an order or send us a message, we collect your name,
            email, phone number, shipping address, and the contents of your message.
            When you subscribe to our newsletter, we collect your email address.
          </p>
          <h2 className="font-serif text-xl">How we use it</h2>
          <p>
            We use this information solely to fulfill your orders, respond to your
            messages, and — with your consent — send occasional updates. We do not
            sell your data.
          </p>
          <h2 className="font-serif text-xl">Contact</h2>
          <p>
            Questions? Email us at{" "}
            <a
              href="mailto:arkmatcha@gmail.com"
              className="underline"
              style={{ color: "var(--matcha)" }}
            >
              arkmatcha@gmail.com
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
