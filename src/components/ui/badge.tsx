import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "destructive" | "outline" | "secondary";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide",
        {
          "bg-primary/10 text-primary": variant === "default",
          "bg-green-100 text-green-700": variant === "success",
          "bg-amber-100 text-amber-700": variant === "warning",
          "bg-red-100 text-red-700": variant === "destructive",
          "border border-border text-muted-foreground": variant === "outline",
          "bg-secondary/30 text-secondary-foreground": variant === "secondary",
        },
        className
      )}
      {...props}
    />
  );
}
