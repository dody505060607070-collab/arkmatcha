import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function Newsletter({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });
    setLoading(false);
    if (error) {
      if (error.code === "23505") {
        toast.success("You're already on the list. Thank you.");
      } else {
        toast.error(error.message);
      }
      return;
    }
    toast.success("Thank you. We'll be in touch.");
    setEmail("");
  }

  const form = (
    <form onSubmit={submit} className="relative">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        aria-label="Email"
        className="w-full rounded-md border border-[color:var(--border)] bg-transparent px-4 py-4 pr-14 text-base text-[color:var(--forest)] placeholder:text-[color:var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--matcha)]/40"
      />
      <button
        type="submit"
        disabled={loading}
        aria-label="Subscribe"
        className="absolute right-2 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-md text-[color:var(--forest)] disabled:opacity-50"
      >
        <ArrowRight className="h-5 w-5" />
      </button>
    </form>
  );

  if (compact) return form;

  return (
    <section className="container-soft py-20">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-[color:var(--forest)] md:text-5xl">
          Subscribe to our emails
        </h2>
        <p className="mt-4 text-[color:var(--muted-foreground)]">
          Join our email list for exclusive offers and the latest news.
        </p>
        <div className="mt-8">{form}</div>
      </div>
    </section>
  );
}
