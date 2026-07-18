import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/queries";

export function AnnouncementBar() {
  const { data: s } = useQuery(settingsQuery);
  const text =
    s?.content?.home?.announcementTagline?.trim() ||
    "Your Favorite Ceremonial Matcha";
  return (
    <div
      className="w-full border-b border-[color:var(--border)]"
      style={{ background: "var(--background)" }}
    >
      <p className="container-soft py-2.5 text-center text-[13px] font-medium tracking-wide text-[color:var(--forest)]">
        {text}
      </p>
    </div>
  );
}
