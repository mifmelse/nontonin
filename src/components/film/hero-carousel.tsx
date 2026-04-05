"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Film } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatViews, cn } from "@/lib/utils";
import {
  Flame,
  Eye,
  Play,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface HeroCarouselProps {
  films: Film[];
}

export function HeroCarousel({ films }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = films.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + total) % total),
    [total],
  );
  const goTo = useCallback((i: number) => setCurrent(i), []);

  useEffect(() => {
    if (isPaused || total <= 1) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % total), 6000);
    return () => clearInterval(id);
  }, [isPaused, total]);

  const film = films[current];
  if (!film) return null;

  return (
    <section
      className="group relative min-h-[420px] sm:min-h-[480px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background — crossfade */}
      {films.map((f, i) => (
        <div
          key={f.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-in-out",
            i === current ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={f.posterUrl}
            alt=""
            fill
            className="object-cover blur-2xl scale-110 opacity-30"
            sizes="100vw"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/80 to-bg-base/40 z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg-base/90 via-bg-base/50 to-transparent z-[1]" />

      {/* Content — crossfade */}
      <div className="relative z-10">
        {films.map((f, i) => (
          <div
            key={f.id}
            className={cn(
              "transition-all duration-500 ease-in-out",
              i === current
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none absolute inset-0",
            )}
          >
            {(i === current || Math.abs(i - current) <= 1) && (
              <HeroSlide film={f} />
            )}
          </div>
        ))}
      </div>

      {/* Navigation arrows — visible on hover (desktop) and always on mobile */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white/70 backdrop-blur-sm transition-all hover:bg-black/60 hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Slide sebelumnya"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white/70 backdrop-blur-sm transition-all hover:bg-black/60 hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Slide berikutnya"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {total > 1 && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
          {films.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300 p-0",
                i === current
                  ? "w-6 bg-primary"
                  : "w-2 bg-white/30 hover:bg-white/50",
              )}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Auto-slide progress bar */}
      {total > 1 && !isPaused && (
        <div className="absolute bottom-0 left-0 z-20 h-0.5 w-full bg-white/5">
          <div className="h-full bg-primary/50 animate-hero-progress" />
        </div>
      )}
    </section>
  );
}

function HeroSlide({ film }: { film: Film }) {
  return (
    <div className="flex flex-col items-center gap-6 px-5 pb-14 pt-12 sm:flex-row sm:items-end sm:gap-8 sm:px-8 sm:pb-16 sm:pt-16">
      {/* Poster */}
      <div className="relative mx-auto shrink-0 sm:mx-0">
        <div className="relative h-[240px] w-[165px] sm:h-[280px] sm:w-[190px] overflow-hidden rounded-2xl shadow-[0_12px_48px_var(--color-primary-glow)] ring-1 ring-white/10">
          <Image
            src={film.posterUrl}
            alt={film.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 165px, 190px"
          />
        </div>
        <div className="absolute -right-2 -top-2 rounded-lg border-2 border-primary bg-bg-base px-2 py-0.5 text-[9px] font-extrabold text-primary shadow-md">
          HD
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 text-center sm:text-left sm:pb-2">
        <div className="flex flex-wrap justify-center gap-1.5 sm:justify-start">
          <Badge variant="rank" className="text-[10px] gap-1">
            <Flame className="h-3 w-3" />
            Featured
          </Badge>
          {film.genres.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="default">
              {genre}
            </Badge>
          ))}
        </div>

        <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl leading-[1.1]">
          {film.title}
        </h2>

        {film.director !== "Unknown" && (
          <p className="mt-1.5 text-xs text-text-muted">by {film.director}</p>
        )}

        <FilmMeta film={film} />

        <p className="mt-4 line-clamp-3 max-w-xl text-sm leading-relaxed text-text-secondary">
          {film.description}
        </p>

        <div className="mt-6 flex items-center justify-center gap-3 sm:justify-start">
          <Link href={`/film/${film.id}`}>
            <Button className="gap-2 px-7 py-3 text-sm">
              <Play className="h-4 w-4" fill="currentColor" />
              Tonton Sekarang
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Shared film metadata row (rating, year, duration, views) */
export function FilmMeta({
  film,
  className,
}: {
  film: Film;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mt-3 flex items-center justify-center gap-3 text-xs sm:justify-start",
        className,
      )}
    >
      {film.rating > 0 && (
        <span className="flex items-center gap-1 text-rating font-semibold">
          <Star className="h-3.5 w-3.5" fill="currentColor" />
          {film.rating.toFixed(1)}
        </span>
      )}
      {film.year && (
        <>
          <span className="h-1 w-1 rounded-full bg-text-muted" />
          <span className="text-text-secondary">{film.year}</span>
        </>
      )}
      {film.duration && (
        <>
          <span className="h-1 w-1 rounded-full bg-text-muted" />
          <span className="text-text-secondary">{film.duration}</span>
        </>
      )}
      {film.downloads > 0 && (
        <>
          <span className="h-1 w-1 rounded-full bg-text-muted" />
          <span className="flex items-center gap-1 text-text-secondary">
            <Eye className="h-3 w-3" />
            {formatViews(film.downloads)}
          </span>
        </>
      )}
    </div>
  );
}
