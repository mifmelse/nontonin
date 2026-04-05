"use client";

import { cn } from "@/lib/utils";
import { GENRES } from "@/lib/films";
import {
  LayoutGrid,
  Ghost,
  Rocket,
  Laugh,
  Heart,
  BookOpen,
  Pencil,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutGrid,
  Ghost,
  Rocket,
  Laugh,
  Heart,
  BookOpen,
  Pencil,
};

interface CategoryPillsProps {
  activeGenre: string;
  onGenreChange: (genre: string) => void;
}

export function CategoryPills({ activeGenre, onGenreChange }: CategoryPillsProps) {
  return (
    <div className="scrollbar-hide -mx-5 flex gap-2 overflow-x-auto px-5 py-1">
      {GENRES.map((genre) => {
        const Icon = ICON_MAP[genre.icon];
        return (
          <button
            key={genre.id}
            onClick={() => onGenreChange(genre.id)}
            className={cn(
              "flex shrink-0 flex-col items-center gap-1 rounded-[var(--radius-card)] px-4 py-2.5 text-center transition-all duration-200 min-w-[72px] cursor-pointer",
              activeGenre === genre.id
                ? "bg-gradient-to-br from-primary to-primary-light text-black shadow-[0_4px_16px_var(--color-primary-glow)]"
                : "bg-bg-elevated text-text-secondary hover:bg-bg-elevated-hover"
            )}
          >
            {Icon && <Icon className="h-5 w-5" />}
            <span className="text-[10px] font-semibold">{genre.label}</span>
          </button>
        );
      })}
    </div>
  );
}
