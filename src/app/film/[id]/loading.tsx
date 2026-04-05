import { PlayerSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function FilmDetailLoading() {
  return (
    <div className="pb-8">
      <div className="px-5 py-3">
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="mx-3 sm:mx-0">
        <PlayerSkeleton />
      </div>
      <div className="space-y-4 px-5 pt-5">
        <div className="flex justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-[46px] w-[46px] rounded-[var(--radius-card)]" />
        </div>
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-16 rounded-[var(--radius-pill)]" />
          <Skeleton className="h-5 w-14 rounded-[var(--radius-pill)]" />
          <Skeleton className="h-5 w-12 rounded-[var(--radius-pill)]" />
        </div>
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-12 w-full rounded-[var(--radius-button)]" />
      </div>
    </div>
  );
}
