import { createFileRoute } from "@tanstack/react-router";

type Body = { type?: string; id?: string };

export const Route = createFileRoute("/api/public/notify-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: Body;
        try {
          payload = (await request.json()) as Body;
        } catch {
          return new Response("Bad request", { status: 400 });
        }

        const id = typeof payload.id === "string" ? payload.id : "";
        const type = payload.type === "contact" ? "contact" : "order";
        const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuid.test(id)) return new Response("Bad request", { status: 400 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { broadcastToAdmins } = await import("@/lib/push-send.server");

        try {
          if (type === "contact") {
            const { data } = await supabaseAdmin
              .from("contact_messages")
              .select("name")
              .eq("id", id)
              .maybeSingle();
            if (!data) return new Response("Not found", { status: 404 });
            await broadcastToAdmins({
              title: "📩 رسالة جديدة",
              body: `رسالة من ${data.name}`,
              url: "/admin",
              tag: `contact-${id}`,
            });
          } else {
            const { data } = await supabaseAdmin
              .from("orders")
              .select("full_name, governorate, total")
              .eq("id", id)
              .maybeSingle();
            if (!data) return new Response("Not found", { status: 404 });
            await broadcastToAdmins({
              title: "🎉 طلب جديد على Ark Matcha",
              body: `${data.full_name} — ${data.governorate} — EGP ${Number(data.total ?? 0).toFixed(2)}`,
              url: "/admin",
              tag: `order-${id}`,
            });
          }
        } catch (err) {
          console.error("notify failed", err);
          return new Response("ok");
        }

        return new Response("ok");
      },
    },
  },
});
