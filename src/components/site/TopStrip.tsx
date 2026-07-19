import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/queries";

export function TopStrip() {
  const { data: settings } = useQuery(settingsQuery);
  const home = (settings?.content as any)?.home ?? {};
  const visible = home.stripVisible !== false;
  const text: string = (home.stripText && home.stripText.trim()) || "your fav' matcha store";

  if (!visible) return null;

  return (
    <div
      className="w-full py-2 flex items-center justify-center"
      style={{ background: "var(--matcha)" }}
    >
      <p
        className="text-white text-[13px] italic tracking-tight font-medium"
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        {text}
      </p>
    </div>
  );
}

