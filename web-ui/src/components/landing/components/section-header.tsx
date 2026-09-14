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
        className="mb-4 gap-1.5 px-3 py-1 text-[10px] font-mono uppercase tracking-widest border-foreground text-foreground"
      >
        {badge}
      </Badge>
      <h2 className="font-display font-normal text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight text-foreground">
        {title}
      </h2>
      {description && (
        <p className="mt-4 font-serif text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
