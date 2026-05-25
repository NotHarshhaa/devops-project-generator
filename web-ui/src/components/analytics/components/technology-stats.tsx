"use client";

import { GitBranch, Layers, Package, Activity } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AnalyticsData } from "@/components/analytics/types";
import { getCategoryBarColor } from "@/components/analytics/utils/category-helpers";

interface TechnologyStatsProps {
  analyticsData: AnalyticsData;
}

const categories = [
  {
    key: "ci" as const,
    title: "CI/CD platforms",
    description: "Distribution of CI/CD choices",
    icon: GitBranch,
    color: "text-blue-500",
    category: "ci-cd",
  },
  {
    key: "infra" as const,
    title: "Infrastructure",
    description: "Infrastructure as Code tools",
    icon: Layers,
    color: "text-purple-500",
    category: "infrastructure",
  },
  {
    key: "deploy" as const,
    title: "Deployment",
    description: "Deployment strategy choices",
    icon: Package,
    color: "text-cyan-500",
    category: "deployment",
  },
  {
    key: "observability" as const,
    title: "Observability",
    description: "Monitoring stack choices",
    icon: Activity,
    color: "text-amber-500",
    category: "observability",
  },
] as const;

function StatPanel({
  title,
  description,
  icon: Icon,
  color,
  category,
  data,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  category: string;
  data: Record<string, number>;
}) {
  const entries = Object.entries(data).sort(([, a], [, b]) => b - a);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-border/60 bg-muted/30">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${color}`} />
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">{description}</p>
      </div>
      <ScrollArea className="h-[220px]">
        <div className="p-4 space-y-3">
          {entries.map(([tech, count]) => {
            const percentage = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={tech} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium capitalize font-mono">{tech.replace(/-/g, " ")}</span>
                  <span className="text-muted-foreground font-mono">{percentage.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${getCategoryBarColor(category)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

export function TechnologyStats({ analyticsData }: TechnologyStatsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {categories.map(({ key, title, description, icon, color, category }) => (
        <StatPanel
          key={key}
          title={title}
          description={description}
          icon={icon}
          color={color}
          category={category}
          data={analyticsData.technologyStats[key]}
        />
      ))}
    </div>
  );
}
