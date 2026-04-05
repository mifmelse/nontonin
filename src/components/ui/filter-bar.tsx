"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { GENRES } from "@/lib/films";

const DECADES = [
  { value: "", label: "Semua Tahun" },
  { value: "1920-1929", label: "1920-an" },
  { value: "1930-1939", label: "1930-an" },
  { value: "1940-1949", label: "1940-an" },
  { value: "1950-1959", label: "1950-an" },
  { value: "1960-1969", label: "1960-an" },
  { value: "1970-1979", label: "1970-an" },
];

const SORTS = [
  { value: "popular", label: "Populer" },
  { value: "newest", label: "Terbaru" },
  { value: "rating", label: "Rating Tertinggi" },
];

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentGenre = searchParams.get("genre") || "";
  const currentDecade = searchParams.get("decade") || "";
  const currentSort = searchParams.get("sort") || "popular";

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/browse?${params.toString()}`);
    },
    [router, searchParams]
  );

  const selectClass =
    "appearance-none rounded-[10px] bg-bg-elevated px-3 py-1.5 text-[11px] text-text-secondary border border-border-subtle outline-none cursor-pointer hover:bg-bg-elevated-hover transition-colors focus:border-primary/30";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select value={currentGenre} onChange={(e) => updateParams("genre", e.target.value)} className={selectClass} aria-label="Filter genre">
        <option value="">Genre</option>
        {GENRES.filter((g) => g.id !== "all").map((g) => (
          <option key={g.id} value={g.id}>{g.label}</option>
        ))}
      </select>
      <select value={currentDecade} onChange={(e) => updateParams("decade", e.target.value)} className={selectClass} aria-label="Filter tahun">
        {DECADES.map((d) => (
          <option key={d.value} value={d.value}>{d.label}</option>
        ))}
      </select>
      <div className="ml-auto">
        <select value={currentSort} onChange={(e) => updateParams("sort", e.target.value)} className={selectClass} aria-label="Urutkan">
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>Sort: {s.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
