/**
 * Send a Telegram message via the Bot API.
 * All times displayed use Asia/Jakarta (UTC+7).
 */
export async function sendTelegramMessage(
  chatId: string,
  text: string
): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error("TELEGRAM_BOT_TOKEN is not set");
    return false;
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      console.error("Telegram API error:", err);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to send Telegram message:", err);
    return false;
  }
}

/**
 * Format a notification message in Indonesian with Jakarta timezone.
 */
export function buildNotifMessage(
  tipe: "H-3" | "H-1" | "3jam",
  judul: string,
  deadline: string,
  kategori: string
): string {
  const deadlineDate = new Date(deadline);
  const formatted = deadlineDate.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const kategoriLabel =
    kategori === "kuliah" ? "📚 Kuliah" : "🏛 Organisasi";

  const urgencyMap = {
    "H-3": "⚠️ <b>3 hari lagi!</b>",
    "H-1": "🔴 <b>Besok deadline!</b>",
    "3jam": "🚨 <b>3 JAM LAGI!</b>",
  };

  return `${urgencyMap[tipe]}

📝 <b>${judul}</b>
${kategoriLabel}
🕐 Deadline: ${formatted} WIB

Segera selesaikan tugasmu! 💪`;
}
