import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Task — Prioritas Tugas Otomatis",
  description:
    "Kelola tugas kuliah dan organisasimu dengan algoritma EDF dan notifikasi Telegram.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}