import { cn } from "@/lib/utils";
import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  alt: string;
  fallback: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({
  src,
  alt,
  fallback,
  size = "md",
  className,
}: AvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const imageSizes = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  };

  if (src) {
    return (
      <div
        className={cn(
          "relative rounded-full overflow-hidden shrink-0",
          sizeClasses[size],
          className
        )}
      >
        <Image
          src={src}
          alt={alt}
          width={imageSizes[size]}
          height={imageSizes[size]}
          className="object-cover w-full h-full"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-secondary text-primary font-medium shrink-0",
        sizeClasses[size],
        className
      )}
    >
      {fallback}
    </div>
  );
}
