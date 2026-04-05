"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <EmptyState
      icon={<AlertTriangle className="h-14 w-14 text-primary" />}
      title="Oops, Ada Masalah"
      description="Terjadi kesalahan saat memuat halaman. Coba lagi?"
      action={
        <Button onClick={reset} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Coba Lagi
        </Button>
      }
    />
  );
}
