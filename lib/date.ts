const JAKARTA_TZ = "Asia/Jakarta";

/**
 * Format deadline for display: "Senin, 16 Jun 2026 · 23:59"
 */
export function formatDeadline(deadline: string): string {
  const date = new Date(deadline);
  const dateStr = date.toLocaleDateString("id-ID", {
    timeZone: JAKARTA_TZ,
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("id-ID", {
    timeZone: JAKARTA_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${dateStr} · ${timeStr}`;
}

/**
 * Format for datetime-local input: "2026-06-16T23:59"
 */
export function toInputDatetime(deadline: string): string {
  const date = new Date(deadline);
  const jakartaOffset = 7 * 60;
  const localOffset = date.getTimezoneOffset();
  const adjusted = new Date(
    date.getTime() + (jakartaOffset + localOffset) * 60 * 1000
  );
  return adjusted.toISOString().slice(0, 16);
}

/**
 * Convert datetime-local input value to UTC ISO string (input is in Jakarta time)
 */
export function fromInputDatetime(inputValue: string): string {
  // inputValue is in Jakarta local time (WIB = UTC+7)
  // Tambahkan +07:00 agar JavaScript tahu ini waktu Jakarta
  const date = new Date(inputValue + ":00+07:00");
  return date.toISOString();
}

/**
 * Group tasks by their selesai_at date for history page
 */
export function formatGroupDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("id-ID", {
    timeZone: JAKARTA_TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Get start of current week (Monday) in Jakarta timezone
 */
export function getStartOfWeek(): Date {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: JAKARTA_TZ })
  );
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  now.setDate(diff);
  now.setHours(0, 0, 0, 0);
  return now;
}