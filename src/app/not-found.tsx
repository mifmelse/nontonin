import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <EmptyState
      icon={<FileQuestion className="h-14 w-14" />}
      title="Halaman Tidak Ditemukan"
      description="Film yang kamu cari mungkin sudah pindah atau tidak tersedia."
      action={
        <Link href="/">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </Link>
      }
    />
  );
}
