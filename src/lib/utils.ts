import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return minutes > 0 ? `${hours}j ${minutes}m` : `${hours}j`;
  }
  return `${minutes}m`;
}

export function formatViews(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}k`;
  }
  return count.toString();
}

export function parseRuntime(runtime: string | undefined): number {
  if (!runtime) return 0;
  const hmsMatch = runtime.match(/^(\d+):(\d+):(\d+)$/);
  if (hmsMatch) {
    return (
      parseInt(hmsMatch[1]) * 3600 +
      parseInt(hmsMatch[2]) * 60 +
      parseInt(hmsMatch[3])
    );
  }
  const msMatch = runtime.match(/^(\d+):(\d+)$/);
  if (msMatch) {
    return parseInt(msMatch[1]) * 60 + parseInt(msMatch[2]);
  }
  const secondsMatch = runtime.match(/^(\d+)$/);
  if (secondsMatch) {
    return parseInt(secondsMatch[1]);
  }
  return 0;
}

export function formatPlayerTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const pad = (n: number) => n.toString().padStart(2, "0");
  if (h > 0) {
    return `${h}:${pad(m)}:${pad(s)}`;
  }
  return `${m}:${pad(s)}`;
}
