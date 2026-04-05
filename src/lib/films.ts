import type { Film, IASearchDoc, IAMetadataResponse } from "./types";
import {
  searchArchiveFilms,
  getArchiveMetadata,
  extractVideoFiles,
  getBestVideoUrl,
  getArchiveThumbnail,
  parseSubjects,
  parseCreator,
  getArchiveDuration,
} from "./archive";
import { matchTMDB, getTMDBPosterUrl, getDirector } from "./tmdb";
import { formatDuration } from "./utils";

export const GENRES = [
  { id: "all", label: "Semua", icon: "LayoutGrid", iaSubject: "" },
  { id: "horror", label: "Horror", icon: "Ghost", iaSubject: "horror" },
  { id: "sci-fi", label: "Sci-Fi", icon: "Rocket", iaSubject: "science fiction" },
  { id: "comedy", label: "Comedy", icon: "Laugh", iaSubject: "comedy" },
  { id: "drama", label: "Drama", icon: "Heart", iaSubject: "drama" },
  {
    id: "documentary",
    label: "Documentary",
    icon: "BookOpen",
    iaSubject: "documentary",
  },
  {
    id: "animation",
    label: "Animasi",
    icon: "Pencil",
    iaSubject: "animation",
  },
] as const;

async function enrichSearchDoc(doc: IASearchDoc): Promise<Film> {
  const tmdb = await matchTMDB(doc.title, doc.year);
  const thumbnailUrl = getArchiveThumbnail(doc.identifier);

  if (tmdb) {
    const posterUrl = getTMDBPosterUrl(tmdb.poster_path) || thumbnailUrl;
    return {
      id: doc.identifier,
      title: tmdb.title || doc.title,
      description: tmdb.overview || doc.description || "",
      year: tmdb.release_date?.substring(0, 4) || doc.year || "",
      duration: tmdb.runtime ? formatDuration(tmdb.runtime * 60) : "",
      durationSeconds: tmdb.runtime ? tmdb.runtime * 60 : 0,
      rating: tmdb.vote_average,
      genres: tmdb.genres.map((g) => g.name),
      director: getDirector(tmdb),
      posterUrl,
      thumbnailUrl,
      downloads: doc.downloads || 0,
      favorites: doc.num_favorites || 0,
      videoUrl: null,
      videoFiles: [],
      source: "tmdb",
    };
  }

  return {
    id: doc.identifier,
    title: doc.title,
    description: doc.description || "",
    year: doc.year || "",
    duration: "",
    durationSeconds: 0,
    rating: 0,
    genres: [],
    director: "Unknown",
    posterUrl: thumbnailUrl,
    thumbnailUrl,
    downloads: doc.downloads || 0,
    favorites: doc.num_favorites || 0,
    videoUrl: null,
    videoFiles: [],
    source: "archive",
  };
}

export async function getFilms(params: {
  query?: string;
  genre?: string;
  sort?: string;
  rows?: number;
  page?: number;
}): Promise<{ films: Film[]; totalResults: number }> {
  const genreConfig = GENRES.find((g) => g.id === params.genre);
  const iaSubject =
    genreConfig && genreConfig.id !== "all" ? genreConfig.iaSubject : undefined;

  const sortMap: Record<string, string> = {
    popular: "downloads desc",
    newest: "addeddate desc",
    rating: "avg_rating desc",
  };

  const { docs, totalResults } = await searchArchiveFilms({
    query: params.query,
    subject: iaSubject,
    sort: sortMap[params.sort || "popular"] || "downloads desc",
    rows: params.rows || 20,
    page: params.page || 1,
  });

  const films = await Promise.all(docs.map(enrichSearchDoc));

  return { films, totalResults };
}

export async function getFilmDetail(identifier: string): Promise<Film | null> {
  try {
    const metadata: IAMetadataResponse = await getArchiveMetadata(identifier);
    const { metadata: meta, files } = metadata;

    const videoFiles = extractVideoFiles(identifier, files);
    const videoUrl = getBestVideoUrl(identifier, files);
    const thumbnailUrl = getArchiveThumbnail(identifier);
    const durationSeconds = getArchiveDuration(files, meta.runtime);

    const tmdb = await matchTMDB(meta.title, meta.year);

    if (tmdb) {
      const posterUrl = getTMDBPosterUrl(tmdb.poster_path) || thumbnailUrl;
      return {
        id: identifier,
        title: tmdb.title || meta.title,
        description: tmdb.overview || meta.description || "",
        year: tmdb.release_date?.substring(0, 4) || meta.year || "",
        duration: tmdb.runtime
          ? formatDuration(tmdb.runtime * 60)
          : formatDuration(durationSeconds),
        durationSeconds: tmdb.runtime ? tmdb.runtime * 60 : durationSeconds,
        rating: tmdb.vote_average,
        genres: tmdb.genres.map((g) => g.name),
        director: getDirector(tmdb),
        posterUrl,
        thumbnailUrl,
        downloads: 0,
        favorites: 0,
        videoUrl,
        videoFiles,
        source: "tmdb",
      };
    }

    return {
      id: identifier,
      title: meta.title,
      description: meta.description || "",
      year: meta.year || "",
      duration: formatDuration(durationSeconds),
      durationSeconds,
      rating: 0,
      genres: parseSubjects(meta.subject),
      director: parseCreator(meta.creator),
      posterUrl: thumbnailUrl,
      thumbnailUrl,
      downloads: 0,
      favorites: 0,
      videoUrl,
      videoFiles,
      source: "archive",
    };
  } catch (error) {
    console.error(`Failed to get film detail for ${identifier}:`, error);
    return null;
  }
}

export async function getRelatedFilms(
  film: Film,
  limit: number = 6,
): Promise<Film[]> {
  const genre = film.genres[0];
  if (!genre) {
    const { films } = await getFilms({ rows: limit });
    return films.filter((f) => f.id !== film.id).slice(0, limit);
  }

  const { films } = await getFilms({
    query: genre.toLowerCase(),
    rows: limit + 1,
  });
  return films.filter((f) => f.id !== film.id).slice(0, limit);
}
