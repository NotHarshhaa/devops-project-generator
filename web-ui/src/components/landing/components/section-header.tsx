import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface SectionHeaderProps {
  badge: ReactNode;
  title: ReactNode;
  description?: string;
  className?: string;
  align?: "center" | "left";
}

export function SectionHeader({
  badge,
  title,
  description,
  className = "mb-12 sm:mb-16",
  align = "center",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-3xl ${alignClass} ${className}`}>
      <Badge
        variant="outline"
        className="mb-3.5 gap-1.5 px-3 py-1 text-xs font-mono uppercase tracking-wider border-brand/30 text-brand bg-brand/5 rounded-full"
      >
        {badge}
      </Badge>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
