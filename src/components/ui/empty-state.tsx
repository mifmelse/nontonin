import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: ReactNode;
  title?: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex min-h-[50vh] items-center justify-center px-5", className)}>
      <div className="text-center">
        <div className="flex justify-center text-text-muted">{icon}</div>
        {title && <h1 className="mt-4 text-2xl font-black">{title}</h1>}
        <p className="mt-2 text-sm text-text-muted">{description}</p>
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  );
}
