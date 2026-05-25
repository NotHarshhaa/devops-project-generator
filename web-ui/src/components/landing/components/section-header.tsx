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
  className = "mb-10 sm:mb-14",
  align = "center",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-3xl ${alignClass} ${className}`}>
      <Badge
        variant="outline"
        className="mb-4 gap-1.5 px-3 py-1 text-[11px] sm:text-xs border-brand/30 bg-brand/5 text-brand"
      >
        {badge}
      </Badge>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">{title}</h2>
      {description && (
        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">{description}</p>
      )}
    </div>
  );
}
