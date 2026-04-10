import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-primary-foreground hover:bg-primary/90 rounded-full":
              variant === "primary",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full":
              variant === "secondary",
            "border-2 border-primary text-primary bg-transparent hover:bg-primary/5 rounded-full":
              variant === "outline",
            "text-primary hover:bg-primary/5 rounded-lg":
              variant === "ghost",
            "bg-destructive text-white hover:bg-destructive/90 rounded-full":
              variant === "destructive",
          },
          {
            "h-8 px-4 text-sm": size === "sm",
            "h-10 px-6 text-sm": size === "md",
            "h-12 px-8 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
