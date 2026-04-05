"use client";

import { useState } from "react";
import type { Film } from "@/lib/types";
import { HeroCarousel } from "@/components/film/hero-carousel";
import { CategoryPills } from "@/components/film/category-pills";
import { FilmCarousel } from "@/components/film/film-carousel";
import { Flame, Sparkles } from "lucide-react";

interface HomeContentProps {
  heroFilms: Film[];
  trendingFilms: Film[];
  newestFilms: Film[];
}

export function HomeContent({ heroFilms, trendingFilms, newestFilms }: HomeContentProps) {
  const [activeGenre, setActiveGenre] = useState("all");

  const filteredTrending =
    activeGenre === "all"
      ? trendingFilms
      : trendingFilms.filter((film) =>
          film.genres.some((g) => g.toLowerCase().includes(activeGenre.toLowerCase()))
        );

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Carousel */}
      <HeroCarousel films={heroFilms} />

      {/* Category Pills */}
      <div className="px-5">
        <CategoryPills activeGenre={activeGenre} onGenreChange={setActiveGenre} />
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-border-subtle to-transparent" />

      {/* Trending */}
      <FilmCarousel
        title="Trending"
        icon={<Flame className="h-4 w-4" />}
        films={filteredTrending}
        showRanks
        href="/browse?sort=popular"
      />

      {/* Divider */}
      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-border-subtle to-transparent" />

      {/* Baru Masuk */}
      <FilmCarousel
        title="Baru Masuk"
        icon={<Sparkles className="h-4 w-4" />}
        films={newestFilms}
        href="/browse?sort=newest"
      />
    </div>
  );
}
