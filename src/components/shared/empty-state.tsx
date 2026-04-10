import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Cat } from "lucide-react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl bg-accent/30 p-12 text-center",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-primary mb-4">
        {icon || <Cat className="h-8 w-8" />}
      </div>
      <h3 className="text-lg font-serif font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
