import type { Kategori } from "@/lib/types";

interface CategoryChipProps {
  kategori: Kategori;
  className?: string;
}

export default function CategoryChip({ kategori, className = "" }: CategoryChipProps) {
  const styles =
    kategori === "kuliah"
      ? "bg-blue-100 text-blue-800"
      : "bg-purple-100 text-purple-800";

  const label = kategori === "kuliah" ? "Kuliah" : "Organisasi";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles} ${className}`}
    >
      {label}
    </span>
  );
}
