import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAILS = ["arkmatcha@gmail.com", "dody505060607070@gmail.com"] as const;

function isAllowedAdminEmail(email?: string | null) {
  return !!email && (ADMIN_EMAILS as readonly string[]).includes(email.trim().toLowerCase());
}

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    // role check
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);
    let isAdmin = (roles ?? []).some((r) => r.role === "admin");
    if (!isAdmin && isAllowedAdminEmail(data.user.email)) {
      const { error: repairError } = await supabase
        .from("user_roles")
        .upsert({ user_id: data.user.id, role: "admin" }, { onConflict: "user_id,role" });
      isAdmin = !repairError;
    }
    if (!isAdmin) {
      await supabase.auth.signOut();
      throw redirect({ to: "/auth", search: { e: "not_admin" } });
    }
    return { user: data.user };
  },
  component: () => <Outlet />,
});
