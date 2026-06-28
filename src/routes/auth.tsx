import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({ e: typeof s.e === "string" ? s.e : undefined }),
  head: () => ({
    meta: [{ title: "Admin — Ark Matcha" }, { name: "robots", content: "noindex" }],
  }),
  component: AuthPage,
});

const ADMIN_EMAILS = ["arkmatcha@gmail.com", "dody505060607070@gmail.com"] as const;
const DEFAULT_ADMIN_EMAIL = ADMIN_EMAILS[0];

function isAllowedAdminEmail(email?: string | null) {
  return !!email && (ADMIN_EMAILS as readonly string[]).includes(email.trim().toLowerCase());
}



function AuthPage() {
  const navigate = useNavigate();
  const { e } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState<string>(DEFAULT_ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (e === "not_admin") toast.error("This account doesn't have admin access.");
  }, [e]);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
      if ((roles ?? []).some((r) => r.role === "admin")) {
        navigate({ to: "/admin" });
      }
    });
  }, [navigate]);

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!(ADMIN_EMAILS as readonly string[]).includes(normalized)) {
      toast.error("Only brand admins can access this area.");
      return;
    }

    setLoading(true);
    if (mode === "signin") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      // Admin role is granted by a database trigger when the whitelisted email is verified.
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      toast.success("Account created. You can sign in now.");
      setMode("signin");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[color:var(--pale)] px-4">
      <div className="w-full max-w-md rounded-3xl bg-[color:var(--cream)] border border-[color:var(--border)] p-8 md:p-10 shadow-sm">
        <a href="/" className="font-serif text-2xl block text-center text-[color:var(--forest)]">Ark Matcha</a>
        <h1 className="font-serif text-3xl text-center mt-3 mb-1">Admin Access</h1>
        <p className="text-center text-sm text-[color:var(--muted-foreground)] mb-6">
          {mode === "signin" ? "Sign in to manage your store." : "Create the admin account."}
        </p>
        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)]">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-xl bg-white border border-[color:var(--border)] focus:outline-none focus:ring-2 focus:ring-[color:var(--olive)]" />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)]">Password</span>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-xl bg-white border border-[color:var(--border)] focus:outline-none focus:ring-2 focus:ring-[color:var(--olive)]" />
          </label>
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
        <div className="mt-5 text-center text-sm">
          {mode === "signin" ? (
            <>First time? <button onClick={() => setMode("signup")} className="underline">Create the admin account</button></>
          ) : (
            <>Already have an account? <button onClick={() => setMode("signin")} className="underline">Sign in</button></>
          )}
        </div>
        <div className="mt-6 text-center">
          <a href="/" className="text-xs text-[color:var(--muted-foreground)] hover:underline">← Back to site</a>
        </div>
      </div>
    </main>
  );
}
