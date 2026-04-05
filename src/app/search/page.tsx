import type { Metadata } from "next";
import Link from "next/link";
import { getFilms } from "@/lib/films";
import { FilmGrid } from "@/components/film/film-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { Search, SearchX } from "lucide-react";
import { SearchLoadMore } from "./load-more";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Hasil pencarian "${q}"` : "Pencarian",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const q = params.q;
  const page = parseInt(params.page || "1", 10);

  if (!q || q.trim().length === 0) {
    return (
      <EmptyState
        icon={<Search className="h-10 w-10" />}
        description="Ketik kata kunci untuk mencari film"
      />
    );
  }

  const { films, totalResults } = await getFilms({
    query: q.trim(),
    rows: 20,
    page,
  });

  const hasMore = films.length > 0 && page * 20 < totalResults;

  return (
    <div className="space-y-5 px-5 py-6">
      <div>
        <h1 className="text-xl font-black tracking-tight">Hasil pencarian &ldquo;{q}&rdquo;</h1>
        <p className="mt-1 text-xs text-text-muted">{totalResults} film ditemukan</p>
      </div>
      {films.length > 0 ? (
        <>
          <FilmGrid films={films} />
          {hasMore && <SearchLoadMore currentPage={page} query={q} />}
        </>
      ) : (
        <EmptyState
          icon={<SearchX className="h-10 w-10" />}
          description={`Tidak ada film ditemukan untuk "${q}"`}
          action={
            <Link href="/browse" className="text-xs text-primary hover:underline">
              Jelajahi koleksi kami
            </Link>
          }
          className="min-h-[40vh]"
        />
      )}
    </div>
  );
}
