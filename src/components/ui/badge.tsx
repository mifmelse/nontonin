import { cn } from "@/lib/utils";

type BadgeVariant = "genre" | "rating" | "status" | "rank" | "default";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  genre: "bg-primary-surface text-yellow-400 font-semibold",
  rating: "bg-transparent text-rating font-semibold",
  status: "bg-emerald-400/12 text-emerald-400 font-semibold",
  rank: "bg-gradient-to-br from-primary to-primary-light text-black font-black shadow-[0_2px_8px_var(--color-primary-glow)]",
  default: "bg-bg-elevated text-text-secondary",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-2.5 py-0.5 text-[10px] leading-tight whitespace-nowrap",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
