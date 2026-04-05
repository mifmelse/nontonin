// Internet Archive raw response types
export interface IASearchResponse {
  response: {
    numFound: number;
    start: number;
    docs: IASearchDoc[];
  };
}

export interface IASearchDoc {
  identifier: string;
  title: string;
  description?: string;
  year?: string;
  downloads?: number;
  num_favorites?: number;
}

export interface IAMetadataResponse {
  metadata: {
    identifier: string;
    title: string;
    description?: string;
    year?: string;
    subject?: string | string[];
    creator?: string | string[];
    runtime?: string;
  };
  files: IAFile[];
}

export interface IAFile {
  name: string;
  format: string;
  size?: string;
  length?: string;
  source?: string;
}

// TMDB response types
export interface TMDBSearchResponse {
  results: TMDBMovie[];
  total_results: number;
}

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface TMDBMovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  runtime: number | null;
  genres: { id: number; name: string }[];
  credits?: {
    crew: { job: string; name: string }[];
  };
}

// App-level unified film type
export interface Film {
  id: string;
  title: string;
  description: string;
  year: string;
  duration: string;
  durationSeconds: number;
  rating: number;
  genres: string[];
  director: string;
  posterUrl: string;
  thumbnailUrl: string;
  downloads: number;
  favorites: number;
  videoUrl: string | null;
  videoFiles: VideoFile[];
  source: "tmdb" | "archive";
}

export interface VideoFile {
  name: string;
  size: number;
  url: string;
}