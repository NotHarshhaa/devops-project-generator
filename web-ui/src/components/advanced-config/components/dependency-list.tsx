"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Zap, Info, CheckCircle2 } from "lucide-react";
import { Dependency } from "../types";

interface DependencyListProps {
  requirements: Dependency[];
  recommendations: Dependency[];
}

function DependencyItems({ items, variant }: { items: Dependency[]; variant: "required" | "recommended" }) {
  const isRequired = variant === "required";
  const Icon = isRequired ? CheckCircle2 : Info;

  return (
    <ScrollArea className="h-[280px]">
      <div className="space-y-2 pr-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`rounded-xl border p-3 transition-colors hover:border-brand/25 ${
              isRequired
                ? "border-brand/20 bg-brand/5"
                : "border-amber-500/20 bg-amber-500/5"
            }`}
          >
            <div className="flex items-start gap-2.5">
              <Icon
                className={`h-4 w-4 shrink-0 mt-0.5 ${isRequired ? "text-brand" : "text-amber-500"}`}
              />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-xs font-mono">
                  {item.from} → {item.to}
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.reason}</p>
                {item.impact && (
                  <Badge
                    variant="outline"
                    className="mt-2 text-[10px] capitalize border-border/80"
                  >
                    Impact: {item.impact}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function DependencyPanel({
  title,
  description,
  icon: Icon,
  iconColor,
  items,
  variant,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  items: Dependency[];
  variant: "required" | "recommended";
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-border/60 bg-muted/30">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${iconColor}`} />
          <h3 className="text-sm font-semibold">{title}</h3>
          <Badge variant="outline" className="text-[10px] font-mono ml-auto">
            {items.length}
          </Badge>
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">{description}</p>
      </div>
      <div className="p-4 flex-1">
        <DependencyItems items={items} variant={variant} />
      </div>
    </div>
  );
}

export function DependencyList({ requirements, recommendations }: DependencyListProps) {
  if (requirements.length === 0 && recommendations.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {requirements.length > 0 && (
        <DependencyPanel
          title="Required dependencies"
          description="These must be satisfied for a valid config"
          icon={Zap}
          iconColor="text-brand"
          items={requirements}
          variant="required"
        />
      )}
      {recommendations.length > 0 && (
        <DependencyPanel
          title="Recommendations"
          description="Optional improvements to consider"
          icon={Info}
          iconColor="text-amber-500"
          items={recommendations}
          variant="recommended"
        />
      )}
    </div>
  );
}
