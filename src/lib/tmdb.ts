import type { TMDBSearchResponse, TMDBMovieDetail } from "./types";

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

function getApiKey(): string {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error("TMDB_API_KEY is not configured");
  return key;
}

async function searchTMDB(
  title: string,
  year?: string
): Promise<TMDBSearchResponse> {
  const params = new URLSearchParams({
    api_key: getApiKey(),
    query: title,
  });
  if (year) {
    params.set("year", year);
  }

  const res = await fetch(`${TMDB_BASE}/search/movie?${params.toString()}`, {
    next: { revalidate: 604800 },
  });

  if (!res.ok) {
    throw new Error(`TMDB search failed: ${res.status}`);
  }

  return res.json();
}

async function getMovieDetail(tmdbId: number): Promise<TMDBMovieDetail> {
  const params = new URLSearchParams({
    api_key: getApiKey(),
    append_to_response: "credits",
  });

  const res = await fetch(
    `${TMDB_BASE}/movie/${tmdbId}?${params.toString()}`,
    { next: { revalidate: 604800 } }
  );

  if (!res.ok) {
    throw new Error(`TMDB detail failed: ${res.status}`);
  }

  return res.json();
}

export async function matchTMDB(
  title: string,
  year?: string
): Promise<TMDBMovieDetail | null> {
  try {
    if (year) {
      const result = await searchTMDB(title, year);
      if (result.results.length > 0) {
        return getMovieDetail(result.results[0].id);
      }
    }

    const result = await searchTMDB(title);
    if (result.results.length > 0) {
      return getMovieDetail(result.results[0].id);
    }

    return null;
  } catch {
    console.warn(`TMDB match failed for "${title}": falling back to IA`);
    return null;
  }
}

export function getTMDBPosterUrl(
  posterPath: string | null,
  width: "w200" | "w300" | "w500" | "original" = "w500"
): string | null {
  if (!posterPath) return null;
  return `${TMDB_IMAGE_BASE}/${width}${posterPath}`;
}

export function getDirector(detail: TMDBMovieDetail): string {
  const director = detail.credits?.crew.find((c) => c.job === "Director");
  return director?.name || "Unknown";
}
