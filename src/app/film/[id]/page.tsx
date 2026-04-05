import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFilmDetail, getRelatedFilms } from "@/lib/films";
import { formatViews } from "@/lib/utils";
import { VideoPlayer } from "@/components/player/video-player";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilmCarousel } from "@/components/film/film-carousel";
import { ArrowLeft, Crosshair, ExternalLink } from "lucide-react";

export const revalidate = 86400;

interface FilmPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: FilmPageProps): Promise<Metadata> {
  const { id } = await params;
  const film = await getFilmDetail(id);
  if (!film) return { title: "Film Tidak Ditemukan" };

  return {
    title: `${film.title} (${film.year})`,
    description: film.description.substring(0, 160),
    openGraph: {
      title: `${film.title} (${film.year}) — Nontonin`,
      description: film.description.substring(0, 160),
      images: [film.posterUrl],
    },
  };
}

export default async function FilmDetailPage({ params }: FilmPageProps) {
  const { id } = await params;
  const film = await getFilmDetail(id);

  if (!film) notFound();

  const relatedFilms = await getRelatedFilms(film);

  return (
    <div className="pb-8">
      <div className="px-5 py-3">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali
        </Link>
      </div>

      <VideoPlayer
        src={film.videoUrl}
        embedUrl={`https://archive.org/embed/${film.id}`}
        poster={film.thumbnailUrl}
        title={film.title}
      />

      <div className="space-y-5 px-5 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-black tracking-tight leading-tight">{film.title}</h1>
            {film.director !== "Unknown" && (
              <p className="mt-1 text-xs text-text-muted">Directed by {film.director}</p>
            )}
          </div>
          {film.rating > 0 && (
            <div className="flex shrink-0 h-[46px] w-[46px] flex-col items-center justify-center rounded-[var(--radius-card)] border-2 border-rating/30 bg-gradient-to-br from-rating/15 to-primary-surface">
              <span className="text-sm font-black text-rating">{film.rating.toFixed(1)}</span>
              <span className="text-[7px] text-text-muted">TMDB</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {film.genres.map((genre) => (<Badge key={genre} variant="genre">{genre}</Badge>))}
          {film.year && <Badge>{film.year}</Badge>}
          {film.duration && <Badge>{film.duration}</Badge>}
          <Badge variant="status">Public Domain</Badge>
        </div>

        <div>
          <p className="text-[13px] leading-relaxed text-text-secondary">
            {film.description || "Tidak ada deskripsi tersedia."}
          </p>
        </div>

        {(film.downloads > 0 || film.favorites > 0) && (
          <div className="flex gap-4 rounded-[var(--radius-card)] border border-border-subtle bg-bg-card px-4 py-3">
            {film.downloads > 0 && (
              <div className="flex-1 text-center">
                <div className="text-[15px] font-extrabold">{formatViews(film.downloads)}</div>
                <div className="text-[9px] text-text-muted">Ditonton</div>
              </div>
            )}
            {film.downloads > 0 && film.favorites > 0 && <div className="w-px bg-border-subtle" />}
            {film.favorites > 0 && (
              <div className="flex-1 text-center">
                <div className="text-[15px] font-extrabold">{formatViews(film.favorites)}</div>
                <div className="text-[9px] text-text-muted">Favorit</div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <a
            href={`https://archive.org/details/${film.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="ghost" className="w-full py-3 text-sm gap-2">
              <ExternalLink className="h-4 w-4" />
              Buka di Internet Archive
            </Button>
          </a>
        </div>
      </div>

      {relatedFilms.length > 0 && (
        <div className="mt-8 border-t border-border-subtle pt-5">
          <FilmCarousel title="Kamu Mungkin Suka" icon={<Crosshair className="h-4 w-4" />} films={relatedFilms} />
        </div>
      )}
    </div>
  );
}
