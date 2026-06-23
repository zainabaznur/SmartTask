import type { Urgency } from "./types";

/**
 * Recalculate urgency at render time based on current time.
 * This is time-sensitive and must NOT rely on the stored column.
 */
export function getUrgencyLevel(deadline: string): Urgency {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffMs = deadlineDate.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours <= 3) return "merah";
  if (diffHours <= 24) return "kuning";
  return "hijau";
}

export function getUrgencyLabel(urgency: Urgency): string {
  return { merah: "Merah", kuning: "Kuning", hijau: "Hijau" }[urgency];
}

export function getUrgencyClasses(urgency: Urgency): {
  card: string;
  badge: string;
  border: string;
} {
  switch (urgency) {
    case "merah":
      return {
        card: "border-l-red-400",
        badge: "bg-red-100 text-red-800 border-red-300",
        border: "border-l-4",
      };
    case "kuning":
      return {
        card: "border-l-yellow-400",
        badge: "bg-yellow-100 text-yellow-800 border-yellow-300",
        border: "border-l-4",
      };
    case "hijau":
      return {
        card: "border-l-green-400",
        badge: "bg-green-100 text-green-800 border-green-300",
        border: "border-l-4",
      };
  }
}
