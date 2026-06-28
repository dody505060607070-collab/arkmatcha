import { useState } from "react";
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

  return (
    <section className={compact ? "" : "container-soft py-20"}>
      <div className="max-w-xl mx-auto text-center">
        {!compact && (
          <>
            <h2 className="text-3xl md:text-4xl mb-3">Be First to Know</h2>
            <p className="text-[color:var(--muted-foreground)] mb-8">
              Sign up to receive launch updates and early access.
            </p>
          </>
        )}
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 px-5 py-3 rounded-full bg-[color:var(--cream)] border border-[color:var(--border)] focus:outline-none focus:ring-2 focus:ring-[color:var(--olive)]"
          />
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
            {loading ? "Sending..." : "Notify Me"}
          </button>
        </form>
      </div>
    </section>
  );
}
