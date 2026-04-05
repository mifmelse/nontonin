"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { Search } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (trimmed) {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      }
    },
    [query, router],
  );

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Mau nonton apa hari ini?"
        className="w-full rounded-xl border border-border-subtle bg-bg-elevated py-2 pl-9 pr-4 text-xs text-text-primary placeholder:text-text-muted outline-none transition-all focus:border-primary/30 focus:ring-1 focus:ring-primary/20 sm:w-[220px]"
      />
    </form>
  );
}
