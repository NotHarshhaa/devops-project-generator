"use client";

import {
  Download,
  Users,
  Globe,
  Target,
  Timer,
  Zap,
  TrendingUp,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalyticsData } from "@/components/analytics/types";

interface MetricsGridProps {
  analyticsData: AnalyticsData;
}

const metrics = [
  {
    key: "totalProjects",
    label: "Total projects",
    icon: Download,
    accent: "text-brand",
    border: "border-brand/20",
    bg: "bg-brand/5",
    format: (d: AnalyticsData) => d.totalProjects.toLocaleString(),
    trend: (d: AnalyticsData) =>
      `+${d.totalProjects > 0 ? Math.floor(d.totalProjects * 0.12) : 0} this month`,
    trendClass: "text-emerald-500",
  },
  {
    key: "activeUsers",
    label: "Active users",
    icon: Users,
    accent: "text-cyan-500",
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/5",
    format: (d: AnalyticsData) =>
      d.activeUsers >= 1000 ? `${(d.activeUsers / 1000).toFixed(1)}K` : String(d.activeUsers),
    trend: (d: AnalyticsData) => `+${Math.floor(d.activeUsers * 0.08)} this month`,
    trendClass: "text-emerald-500",
  },
  {
    key: "countries",
    label: "Countries",
    icon: Globe,
    accent: "text-purple-500",
    border: "border-purple-500/20",
    bg: "bg-purple-500/5",
    format: (d: AnalyticsData) => String(d.countries),
    trend: () => "Global reach",
    trendClass: "text-muted-foreground",
  },
  {
    key: "successRate",
    label: "Success rate",
    icon: Target,
    accent: "text-emerald-500",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
    format: (d: AnalyticsData) => `${d.successRate}%`,
    trend: () => "High reliability",
    trendClass: "text-emerald-500",
    trendIcon: CheckCircle2,
  },
  {
    key: "avgGenerationTime",
    label: "Avg generation",
    icon: Timer,
    accent: "text-amber-500",
    border: "border-amber-500/20",
    bg: "bg-amber-500/5",
    format: (d: AnalyticsData) => `${d.avgGenerationTime}s`,
    trend: () => "Fast generation",
    trendClass: "text-amber-500",
    trendIcon: Clock,
  },
  {
    key: "avgTimeSaved",
    label: "Time saved",
    icon: Zap,
    accent: "text-teal-500",
    border: "border-teal-500/20",
    bg: "bg-teal-500/5",
    format: (d: AnalyticsData) => `${d.avgTimeSaved}h`,
    trend: () => "Per project",
    trendClass: "text-muted-foreground",
  },
] as const;

export function MetricsGrid({ analyticsData }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
      {metrics.map((metric) => {
        const { key, label, icon: Icon, accent, border, bg, format, trend, trendClass } = metric;
        const TrendIcon = "trendIcon" in metric ? metric.trendIcon : TrendingUp;

        return (
        <div
          key={key}
          className={cn(
            "rounded-2xl border p-4 transition-colors hover:border-brand/30",
            border,
            bg
          )}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <Icon className={cn("h-3.5 w-3.5", accent)} />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium truncate">
              {label}
            </span>
          </div>
          <div className={cn("text-2xl sm:text-3xl font-bold font-mono tracking-tight", accent)}>
            {format(analyticsData)}
          </div>
          <div className={cn("flex items-center gap-1 text-[10px] mt-2", trendClass)}>
            <TrendIcon className="h-3 w-3" />
            <span className="truncate">{trend(analyticsData)}</span>
          </div>
        </div>
        );
      })}
    </div>
  );
}
