import type {
  IASearchResponse,
  IASearchDoc,
  IAMetadataResponse,
  IAFile,
  VideoFile,
} from "./types";
import { parseRuntime } from "./utils";

const IA_BASE = "https://archive.org";
const FETCH_TIMEOUT = 15000;

async function fetchWithTimeout(
  url: string,
  options?: RequestInit & { next?: { revalidate?: number } },
  retries = 2,
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return res;
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  throw new Error("Fetch failed after retries");
}

export async function searchArchiveFilms(params: {
  query?: string;
  subject?: string;
  sort?: string;
  rows?: number;
  page?: number;
}): Promise<{ docs: IASearchDoc[]; totalResults: number }> {
  const {
    query,
    subject,
    sort = "downloads desc",
    rows = 20,
    page = 1,
  } = params;

  let q = "mediatype:movies AND collection:feature_films";
  if (query) {
    q += ` AND (${query})`;
  }
  if (subject) {
    q += ` AND subject:(${subject})`;
  }

  const url =
    `${IA_BASE}/advancedsearch.php?` +
    `q=${encodeURIComponent(q)}` +
    `&fl[]=identifier&fl[]=title&fl[]=description&fl[]=year&fl[]=downloads&fl[]=num_favorites` +
    `&sort[]=${encodeURIComponent(sort)}` +
    `&rows=${rows}` +
    `&page=${page}` +
    `&output=json`;

  const res = await fetchWithTimeout(url, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Internet Archive search failed: ${res.status}`);
  }

  const data: IASearchResponse = await res.json();
  return {
    docs: data.response.docs,
    totalResults: data.response.numFound,
  };
}

export async function getArchiveMetadata(
  identifier: string,
): Promise<IAMetadataResponse> {
  const res = await fetchWithTimeout(`${IA_BASE}/metadata/${identifier}`, {
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    throw new Error(`Internet Archive metadata failed: ${res.status}`);
  }

  return res.json();
}

export function extractVideoFiles(
  identifier: string,
  files: IAFile[],
): VideoFile[] {
  return files
    .filter((file) => {
      const name = file.name.toLowerCase();
      const isMp4 = name.endsWith(".mp4");
      const isNotThumbnail =
        !name.includes("thumb") && !name.includes("sample");
      return isMp4 && isNotThumbnail;
    })
    .map((file) => ({
      name: file.name,
      size: parseInt(file.size || "0", 10),
      url: `${IA_BASE}/download/${identifier}/${encodeURIComponent(file.name)}`,
    }))
    .sort((a, b) => b.size - a.size);
}

export function getBestVideoUrl(
  identifier: string,
  files: IAFile[],
): string | null {
  const videoFiles = extractVideoFiles(identifier, files);
  return videoFiles.length > 0 ? videoFiles[0].url : null;
}

export function getArchiveThumbnail(identifier: string): string {
  return `${IA_BASE}/services/img/${identifier}`;
}

export function parseSubjects(
  subject: string | string[] | undefined,
): string[] {
  if (!subject) return [];
  if (Array.isArray(subject)) return subject;
  return subject.split(";").map((s) => s.trim());
}

export function parseCreator(creator: string | string[] | undefined): string {
  if (!creator) return "Unknown";
  if (Array.isArray(creator)) return creator[0] || "Unknown";
  return creator;
}

export function getArchiveDuration(
  files: IAFile[],
  metadataRuntime?: string,
): number {
  const mp4File = files.find((f) => f.name.toLowerCase().endsWith(".mp4"));
  if (mp4File?.length) {
    const seconds = parseFloat(mp4File.length);
    if (!isNaN(seconds) && seconds > 0) return Math.round(seconds);
  }
  return parseRuntime(metadataRuntime);
}
