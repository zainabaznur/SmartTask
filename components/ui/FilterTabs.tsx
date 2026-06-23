"use client";

export type FilterTab = "semua" | "kuliah" | "organisasi";

interface FilterTabsProps {
  active: FilterTab;
  onChange: (tab: FilterTab) => void;
}

const tabs: { key: FilterTab; label: string }[] = [
  { key: "semua", label: "Semua" },
  { key: "kuliah", label: "Kuliah" },
  { key: "organisasi", label: "Organisasi" },
];

export default function FilterTabs({ active, onChange }: FilterTabsProps) {
  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors border ${
            active === tab.key
              ? "bg-blue-700 text-white border-blue-700"
              : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
