import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-gradient-to-br from-primary to-primary-light text-black font-bold shadow-[0_4px_16px_var(--color-primary-glow)] hover:brightness-110 active:scale-[0.98]",
  ghost: "bg-bg-elevated text-text-primary hover:bg-bg-elevated-hover",
};

export function Button({ variant = "primary", children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[var(--radius-button)] px-5 py-2.5 text-sm transition-all duration-150 ease-out cursor-pointer disabled:opacity-50 disabled:pointer-events-none",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
