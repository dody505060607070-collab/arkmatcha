import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell, BellOff, Send, Smartphone, Trash2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import {
  getPushPublicKey,
  savePushSubscription,
  removePushSubscription,
  listPushSubscriptions,
  sendTestPush,
} from "@/lib/push.functions";
import {
  pushSupported,
  isIOS,
  isStandalone,
  getCurrentSubscription,
  subscribeToPush,
  unsubscribeFromPush,
} from "@/lib/push-client";

type DeviceRow = {
  id: string;
  endpoint: string;
  user_agent: string | null;
  created_at: string;
};

export function NotificationsAdmin() {
  const fetchKey = useServerFn(getPushPublicKey);
  const save = useServerFn(savePushSubscription);
  const remove = useServerFn(removePushSubscription);
  const list = useServerFn(listPushSubscriptions);
  const test = useServerFn(sendTestPush);

  const [supported, setSupported] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [devices, setDevices] = useState<DeviceRow[]>([]);
  const [needsInstall, setNeedsInstall] = useState(false);

  async function refresh() {
    try {
      const rows = (await list({})) as DeviceRow[];
      setDevices(rows);
    } catch {
      setDevices([]);
    }
  }

  useEffect(() => {
    setSupported(pushSupported());
    setNeedsInstall(isIOS() && !isStandalone());
    void getCurrentSubscription().then((sub) => setEnabled(Boolean(sub)));
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function enable() {
    setBusy(true);
    try {
      const { key } = await fetchKey({});
      const sub = await subscribeToPush(key);
      await save({ data: sub });
      setEnabled(true);
      toast.success("تم تفعيل الإشعارات على الجهاز ده ✅");
      await refresh();
    } catch (err) {
      toast.error((err as Error).message || "مقدرناش نفعّل الإشعارات");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    try {
      const endpoint = await unsubscribeFromPush();
      if (endpoint) await remove({ data: { endpoint } });
      setEnabled(false);
      toast.success("تم إيقاف الإشعارات على الجهاز ده");
      await refresh();
    } catch (err) {
      toast.error((err as Error).message || "حصلت مشكلة");
    } finally {
      setBusy(false);
    }
  }

  async function removeDevice(row: DeviceRow) {
    setBusy(true);
    try {
      await remove({ data: { endpoint: row.endpoint } });
      toast.success("تم حذف الجهاز");
      await refresh();
    } catch (err) {
      toast.error((err as Error).message || "حصلت مشكلة");
    } finally {
      setBusy(false);
    }
  }

  async function sendTest() {
    setBusy(true);
    try {
      const res = (await test({})) as { sent: number };
      toast.success(`تم إرسال إشعار تجريبي إلى ${res.sent} جهاز`);
    } catch (err) {
      toast.error((err as Error).message || "مقدرناش نبعت الإشعار");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-[color:var(--forest)]">Notifications</h1>
        <p className="mt-1 text-sm text-[color:var(--muted-foreground)]" dir="rtl">
          فعّل الإشعارات على موبايلك عشان يوصلك تنبيه فوري بأي أوردر جديد أو رسالة — حتى لو الموقع مقفول.
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-[color:var(--border)] p-6" dir="rtl">
        {!supported && (
          <p className="text-sm text-red-600">
            المتصفح ده مش بيدعم الإشعارات. جرّب Chrome على أندرويد أو Safari على iOS 16.4+.
          </p>
        )}

        {supported && needsInstall && (
          <div className="mb-5 rounded-xl bg-[color:var(--pale)] p-4 text-sm leading-relaxed">
            <strong>على الآيفون:</strong> لازم تضيف الموقع للشاشة الرئيسية الأول.
            <br />
            افتح الموقع في Safari → زرار المشاركة <span className="font-mono">⬆️</span> → «Add to Home Screen» →
            افتح التطبيق من الأيقونة → ادخل لوحة التحكم وفعّل الإشعارات من هنا.
          </div>
        )}

        {supported && (
          <>
            <div className="flex flex-wrap items-center gap-3">
              {!enabled ? (
                <button onClick={enable} disabled={busy} className="btn-primary inline-flex items-center gap-2 disabled:opacity-60">
                  <Bell className="h-4 w-4" /> تفعيل الإشعارات على الجهاز ده
                </button>
              ) : (
                <button onClick={disable} disabled={busy} className="btn-ghost inline-flex items-center gap-2 disabled:opacity-60">
                  <BellOff className="h-4 w-4" /> إيقاف الإشعارات على الجهاز ده
                </button>
              )}
              <button onClick={sendTest} disabled={busy} className="btn-ghost inline-flex items-center gap-2 disabled:opacity-60">
                <Send className="h-4 w-4" /> إرسال إشعار تجريبي
              </button>
            </div>

            <p className="mt-4 text-xs text-[color:var(--muted-foreground)] leading-relaxed">
              الإشعار بيوصل تلقائيًا لما يجيلك: طلب جديد (أوردر) أو رسالة جديدة من صفحة التواصل. ممكن تفعّل أكتر من
              جهاز (موبايل + لابتوب) وكلهم هيوصلهم نفس الإشعار.
            </p>
          </>
        )}

        <div className="mt-6 border-t border-[color:var(--border)] pt-5">
          <h2 className="text-sm font-semibold mb-3">الأجهزة المفعّلة ({devices.length})</h2>
          {devices.length === 0 ? (
            <p className="text-sm text-[color:var(--muted-foreground)]">مفيش أجهزة مفعّلة لحد دلوقتي.</p>
          ) : (
            <ul className="space-y-2">
              {devices.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-[color:var(--pale)] px-4 py-3 text-sm"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <Smartphone className="h-4 w-4 shrink-0" />
                    <span className="truncate" dir="ltr">
                      {d.user_agent ?? d.endpoint}
                    </span>
                  </span>
                  <button
                    onClick={() => removeDevice(d)}
                    disabled={busy}
                    className="text-red-600 hover:text-red-700 disabled:opacity-60"
                    aria-label="حذف الجهاز"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
