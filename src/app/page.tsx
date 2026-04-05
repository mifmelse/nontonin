import { getFilms } from "@/lib/films";
import { HomeContent } from "./home-content";

export const revalidate = 3600;

export default async function HomePage() {
  const [trending, newest] = await Promise.all([
    getFilms({ sort: "popular", rows: 10 }),
    getFilms({ sort: "newest", rows: 6 }),
  ]);

  if (trending.films.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-muted">
          Tidak ada film yang tersedia saat ini.
        </p>
      </div>
    );
  }

  const heroFilms = trending.films.slice(0, 5);

  return (
    <HomeContent
      heroFilms={heroFilms}
      trendingFilms={trending.films}
      newestFilms={newest.films}
    />
  );
}
