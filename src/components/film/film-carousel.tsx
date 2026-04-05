import type { Film } from "@/lib/types";
import type { ReactNode } from "react";
import { FilmCard } from "./film-card";
import Link from "next/link";

interface FilmCarouselProps {
  title: string;
  icon?: ReactNode;
  films: Film[];
  showRanks?: boolean;
  href?: string;
}

export function FilmCarousel({
  title,
  icon,
  films,
  showRanks = false,
  href,
}: FilmCarouselProps) {
  return (
    <section className="space-y-3 px-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base font-extrabold">{title}</span>
          {icon && <span className="text-primary">{icon}</span>}
        </div>
        {href && (
          <Link
            href={href}
            className="text-[11px] font-semibold text-primary hover:text-primary-light transition-colors"
          >
            Lihat semua →
          </Link>
        )}
      </div>
      <div className="scrollbar-hide -mx-5 flex gap-2.5 overflow-x-auto px-5 snap-x snap-mandatory">
        {films.map((film, index) => (
          <FilmCard
            key={film.id}
            film={film}
            rank={showRanks ? index + 1 : undefined}
            className="w-[130px] snap-start"
          />
        ))}
      </div>
    </section>
  );
}
