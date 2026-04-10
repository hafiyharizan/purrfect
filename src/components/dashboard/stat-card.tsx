import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  variant?: "default" | "highlight";
  className?: string;
}

export function StatCard({
  label,
  value,
  subtitle,
  icon,
  variant = "default",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6",
        variant === "highlight"
          ? "bg-primary text-primary-foreground"
          : "bg-highlight",
        className
      )}
    >
      <p
        className={cn(
          "text-xs font-medium uppercase tracking-wide",
          variant === "highlight"
            ? "text-primary-foreground/70"
            : "text-muted-foreground"
        )}
      >
        {label}
      </p>
      <div className="flex items-end gap-2 mt-1">
        <span className="text-3xl font-bold">{value}</span>
        {subtitle && (
          <span
            className={cn(
              "text-sm mb-1",
              variant === "highlight"
                ? "text-primary-foreground/70"
                : "text-muted-foreground"
            )}
          >
            {subtitle}
          </span>
        )}
        {icon}
      </div>
    </div>
  );
}
