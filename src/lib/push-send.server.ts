import { ApplicationServerKeys, generatePushHTTPRequest } from "webpush-webcrypto";

export type PushTarget = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
  tag?: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

/** Sends one web push. Returns the HTTP status of the push service response. */
export async function sendWebPush(target: PushTarget, payload: PushPayload): Promise<number> {
  const keys = await ApplicationServerKeys.fromJSON({
    publicKey: requireEnv("WEBPUSH_PUBLIC_KEY"),
    privateKey: requireEnv("WEBPUSH_PRIVATE_KEY"),
  });

  const { headers, body, endpoint } = await generatePushHTTPRequest({
    applicationServerKeys: keys,
    payload: JSON.stringify(payload),
    target: {
      endpoint: target.endpoint,
      keys: { p256dh: target.p256dh, auth: target.auth },
    },
    adminContact: process.env["VAPID_SUBJECT"] ?? "mailto:hello@arkmatchaa.shop",
    ttl: 60 * 60 * 12,
    urgency: "high",
  });

  const res = await fetch(endpoint, { method: "POST", headers, body });
  return res.status;
}

/** Sends to every stored admin subscription, pruning dead endpoints. */
export async function broadcastToAdmins(payload: PushPayload): Promise<{ sent: number; removed: number }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth");
  if (error) throw error;

  let sent = 0;
  const dead: string[] = [];

  await Promise.all(
    (data ?? []).map(async (sub) => {
      try {
        const status = await sendWebPush(
          { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
          payload,
        );
        if (status === 404 || status === 410) dead.push(sub.id);
        else if (status >= 200 && status < 300) sent += 1;
      } catch (err) {
        console.error("push send failed", err);
      }
    }),
  );

  if (dead.length > 0) {
    await supabaseAdmin.from("push_subscriptions").delete().in("id", dead);
  }

  return { sent, removed: dead.length };
}
