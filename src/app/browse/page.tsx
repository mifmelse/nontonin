import type { Metadata } from "next";
import { Suspense } from "react";
import { getFilms } from "@/lib/films";
import { FilmGrid } from "@/components/film/film-grid";
import { FilterBar } from "@/components/ui/filter-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { BrowseLoadMore } from "./load-more";
import { SlidersHorizontal } from "lucide-react";

export const metadata: Metadata = {
  title: "Jelajahi Film",
  description: "Jelajahi koleksi film domain publik gratis dari Internet Archive.",
};

interface BrowsePageProps {
  searchParams: Promise<{
    genre?: string;
    decade?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);

  let query = "";
  if (params.decade) {
    const [start, end] = params.decade.split("-");
    if (start && end) {
      query = `year:[${start} TO ${end}]`;
    }
  }

  const { films, totalResults } = await getFilms({
    query: query || undefined,
    genre: params.genre,
    sort: params.sort || "popular",
    rows: 20,
    page,
  });

  const hasMore = films.length > 0 && page * 20 < totalResults;

  return (
    <div className="space-y-5 px-5 py-6">
      <div>
        <h1 className="text-xl font-black tracking-tight">Jelajahi Film</h1>
        <p className="mt-1 text-xs text-text-muted">
          {totalResults.toLocaleString()} film domain publik tersedia
        </p>
      </div>
      <Suspense fallback={null}>
        <FilterBar />
      </Suspense>
      {films.length > 0 ? (
        <>
          <FilmGrid films={films} />
          {hasMore && <BrowseLoadMore currentPage={page} searchParams={params} />}
        </>
      ) : (
        <EmptyState
          icon={<SlidersHorizontal className="h-10 w-10" />}
          description="Tidak ada film ditemukan. Coba filter lain?"
          className="min-h-[40vh]"
        />
      )}
    </div>
  );
}
