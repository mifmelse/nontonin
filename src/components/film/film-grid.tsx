import type { Film } from "@/lib/types";
import { FilmCard } from "./film-card";

interface FilmGridProps {
  films: Film[];
}

export function FilmGrid({ films }: FilmGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {films.map((film) => (
        <FilmCard key={film.id} film={film} />
      ))}
    </div>
  );
}
