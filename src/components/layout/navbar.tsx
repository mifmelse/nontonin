"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchBar } from "./search-bar";

const NAV_LINKS = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/browse", label: "Jelajahi", icon: Compass },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-border-subtle bg-bg-base/97 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-light text-sm text-black">
              <Play className="h-3.5 w-3.5 ml-0.5" fill="currentColor" />
            </div>
            <span className="text-[17px] font-extrabold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              nontonin
            </span>
          </Link>
          <div className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-primary-surface font-semibold text-primary"
                      : "text-text-muted hover:text-text-secondary",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
        <SearchBar />
      </div>
    </nav>
  );
}
