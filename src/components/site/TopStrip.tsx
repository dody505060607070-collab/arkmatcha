import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/queries";

export function TopStrip() {
  const { data: settings } = useQuery(settingsQuery);
  const home = (settings?.content as any)?.home ?? {};
  const visible = home.stripVisible !== false;
  const text: string = (home.stripText && home.stripText.trim()) || "your fav matcha store";
  const font: string = home.stripFont || "Shrikhand";

  useEffect(() => {
    if (!visible || typeof document === "undefined") return;
    const id = `google-font-${font.replace(/\s+/g, "-")}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400&display=swap`;
    document.head.appendChild(link);
  }, [visible, font]);

  if (!visible) return null;

  return (
    <div
      className="w-full py-2 text-center"
      style={{ background: "var(--matcha)", color: "#fff" }}
    >
      <span
        className="text-sm md:text-base tracking-wide"
        style={{ fontFamily: `"${font}", cursive` }}
      >
        {text}
      </span>
    </div>
  );
}
