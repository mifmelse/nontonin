import Image from "next/image";
import Link from "next/link";
import type { Film } from "@/lib/types";
import { cn, formatViews } from "@/lib/utils";
import { Eye, Star } from "lucide-react";

interface FilmCardProps {
  film: Film;
  rank?: number;
  className?: string;
}

export function FilmCard({ film, rank, className }: FilmCardProps) {
  return (
    <Link
      href={`/film/${film.id}`}
      className={cn(
        "group block flex-shrink-0 transition-transform duration-200 ease-out hover:scale-[1.02]",
        className,
      )}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[var(--radius-card)] border border-border-subtle bg-bg-card">
        <Image
          src={film.posterUrl}
          alt={film.title}
          fill
          className="object-cover transition-opacity duration-200"
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
        />
        {rank && (
          <div
            className={cn(
              "absolute -left-1 -top-1 z-10 flex h-6 w-6 items-center justify-center rounded-lg text-[11px] font-black shadow-md",
              rank === 1
                ? "bg-gradient-to-br from-primary to-primary-light text-black shadow-[0_2px_8px_var(--color-primary-glow)]"
                : "bg-bg-elevated-hover text-text-primary",
            )}
          >
            #{rank}
          </div>
        )}
        {film.rating > 0 && (
          <div className="absolute right-1.5 top-1.5 rounded-md bg-primary px-1.5 py-0.5 text-[9px] font-bold text-black">
            {film.rating.toFixed(1)}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 pb-2 pt-8 bg-gradient-to-t from-black/70 to-transparent">
          {film.downloads > 0 && (
            <span className="flex items-center gap-0.5 text-[9px] text-text-muted">
              <Eye className="h-2.5 w-2.5" />
              {formatViews(film.downloads)}
            </span>
          )}
          {film.duration && (
            <span className="rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-white">
              {film.duration}
            </span>
          )}
        </div>
        <div className="absolute inset-0 rounded-[var(--radius-card)] opacity-0 transition-opacity duration-200 group-hover:opacity-100 shadow-[0_8px_32px_var(--color-primary-glow)]" />
      </div>
      <div className="mt-2">
        <h3 className="truncate text-xs font-bold text-text-primary">
          {film.title}
        </h3>
        <p className="mt-0.5 text-[10px] text-text-muted">
          {film.year}
          {film.rating > 0 && (
            <>
              {" · "}
              <Star
                className="inline h-2.5 w-2.5 text-rating"
                fill="currentColor"
              />{" "}
              {film.rating.toFixed(1)}
            </>
          )}
        </p>
      </div>
    </Link>
  );
}
