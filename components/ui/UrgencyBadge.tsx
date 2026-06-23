import type { Urgency } from "@/lib/types";
import { getUrgencyLevel, getUrgencyClasses, getUrgencyLabel } from "@/lib/urgency";

interface UrgencyBadgeProps {
  deadline: string;
  className?: string;
}

export default function UrgencyBadge({ deadline, className = "" }: UrgencyBadgeProps) {
  const urgency: Urgency = getUrgencyLevel(deadline);
  const { badge } = getUrgencyClasses(urgency);

  const dot = {
    merah: "bg-red-500",
    kuning: "bg-yellow-500",
    hijau: "bg-green-500",
  }[urgency];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${badge} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
      {getUrgencyLabel(urgency)}
    </span>
  );
}
