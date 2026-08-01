/** Browser helpers for admin push notifications. */

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) output[i] = raw.charCodeAt(i);
  return output;
}

function bufToBase64Url(buffer: ArrayBuffer | null): string {
  if (!buffer) return "";
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function pushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

async function getRegistration(): Promise<ServiceWorkerRegistration> {
  const existing = await navigator.serviceWorker.getRegistration("/push-sw.js");
  if (existing) return existing;
  return navigator.serviceWorker.register("/push-sw.js", { scope: "/" });
}

export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  if (!pushSupported()) return null;
  const reg = await navigator.serviceWorker.getRegistration("/push-sw.js");
  if (!reg) return null;
  return reg.pushManager.getSubscription();
}

export type SerializedSubscription = {
  endpoint: string;
  p256dh: string;
  auth: string;
  user_agent?: string;
};

export function serializeSubscription(sub: PushSubscription): SerializedSubscription {
  return {
    endpoint: sub.endpoint,
    p256dh: bufToBase64Url(sub.getKey("p256dh")),
    auth: bufToBase64Url(sub.getKey("auth")),
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 400) : undefined,
  };
}

export async function subscribeToPush(publicKey: string): Promise<SerializedSubscription> {
  if (!pushSupported()) throw new Error("المتصفح ده مش بيدعم الإشعارات");
  if (!publicKey) throw new Error("مفتاح الإشعارات غير متاح");

  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("لازم تسمح بالإشعارات من المتصفح");

  const reg = await getRegistration();
  await navigator.serviceWorker.ready;

  const existing = await reg.pushManager.getSubscription();
  if (existing) return serializeSubscription(existing);

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
  });
  return serializeSubscription(sub);
}

export async function unsubscribeFromPush(): Promise<string | null> {
  const sub = await getCurrentSubscription();
  if (!sub) return null;
  const endpoint = sub.endpoint;
  await sub.unsubscribe();
  return endpoint;
}

/** Fire-and-forget notification trigger used by the storefront. */
export function notifyAdmins(type: "order" | "contact", id: string): void {
  try {
    void fetch("/api/public/notify-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id }),
      keepalive: true,
    });
  } catch {
    /* non-blocking */
  }
}
