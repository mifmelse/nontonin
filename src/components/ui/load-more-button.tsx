"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoadMoreButtonProps {
  buildUrl: (nextPage: number) => string;
  currentPage: number;
}

export function LoadMoreButton({ buildUrl, currentPage }: LoadMoreButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLoadMore = () => {
    startTransition(() => {
      router.push(buildUrl(currentPage + 1), { scroll: false });
    });
  };

  return (
    <div className="flex justify-center pt-4">
      <Button
        variant="ghost"
        onClick={handleLoadMore}
        disabled={isPending}
        className="text-primary hover:text-primary-light"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Memuat...
          </>
        ) : (
          "Muat Lebih Banyak"
        )}
      </Button>
    </div>
  );
}
