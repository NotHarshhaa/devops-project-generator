import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface SectionHeaderProps {
  badge: ReactNode;
  title: ReactNode;
  description?: string;
  className?: string;
}

export function SectionHeader({ badge, title, description, className = "mb-10 sm:mb-14" }: SectionHeaderProps) {
  return (
    <div className={`text-center ${className}`}>
      <Badge variant="secondary" className="mb-3 gap-1.5 px-2.5 py-1 text-[11px] sm:text-xs">
        {badge}
      </Badge>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
      {description && (
        <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">{description}</p>
      )}
    </div>
  );
}
