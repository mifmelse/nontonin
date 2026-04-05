"use client";

import { LoadMoreButton } from "@/components/ui/load-more-button";

interface BrowseLoadMoreProps {
  currentPage: number;
  searchParams: Record<string, string | undefined>;
}

export function BrowseLoadMore({ currentPage, searchParams }: BrowseLoadMoreProps) {
  const buildUrl = (nextPage: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set("page", nextPage.toString());
    return `/browse?${params.toString()}`;
  };

  return <LoadMoreButton buildUrl={buildUrl} currentPage={currentPage} />;
}
