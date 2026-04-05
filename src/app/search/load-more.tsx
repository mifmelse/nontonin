"use client";

import { LoadMoreButton } from "@/components/ui/load-more-button";

interface SearchLoadMoreProps {
  currentPage: number;
  query: string;
}

export function SearchLoadMore({ currentPage, query }: SearchLoadMoreProps) {
  const buildUrl = (nextPage: number) =>
    `/search?q=${encodeURIComponent(query)}&page=${nextPage}`;

  return <LoadMoreButton buildUrl={buildUrl} currentPage={currentPage} />;
}
