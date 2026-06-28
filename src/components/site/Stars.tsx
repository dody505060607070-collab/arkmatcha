import { Star } from "lucide-react";

export function Stars({ count = 5, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`inline-flex items-center gap-0.5 text-[color:var(--olive)] ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-current" />
      ))}
    </div>
  );
}
