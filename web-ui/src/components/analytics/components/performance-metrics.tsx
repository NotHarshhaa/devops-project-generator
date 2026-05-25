"use client";

import { Server, Database, AlertTriangle, Clock, Calendar } from "lucide-react";
import type { AnalyticsData } from "@/components/analytics/types";

interface PerformanceMetricsProps {
  analyticsData: AnalyticsData;
}

const perfMetrics = [
  {
    icon: Database,
    label: "Avg load time",
    value: (d: AnalyticsData) => `${d.performanceMetrics.avgLoadTime}s`,
    sub: "Page load",
    color: "text-brand",
    bg: "bg-brand/10",
  },
  {
    icon: AlertTriangle,
    label: "Error rate",
    value: (d: AnalyticsData) => `${d.performanceMetrics.errorRate}%`,
    sub: "Last 30 days",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Clock,
    label: "Peak time",
    value: (d: AnalyticsData) => d.performanceMetrics.popularTimeOfDay,
    sub: "Most active",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Calendar,
    label: "Peak day",
    value: (d: AnalyticsData) => d.performanceMetrics.peakDay,
    sub: "Weekly pattern",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
] as const;

export function PerformanceMetrics({ analyticsData }: PerformanceMetricsProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 overflow-hidden h-full">
      <div className="px-5 py-4 border-b border-border/60 bg-muted/30">
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-brand" />
          <h3 className="text-sm font-semibold">Performance metrics</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">System performance and user experience</p>
      </div>
      <div className="p-4 sm:p-5 grid grid-cols-2 gap-3">
        {perfMetrics.map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div
            key={label}
            className="rounded-xl border border-border/50 bg-background/50 p-4 text-center transition-colors hover:border-brand/25"
          >
            <div className={`flex h-9 w-9 mx-auto items-center justify-center rounded-xl ${bg} mb-2`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div className={`text-lg sm:text-xl font-bold font-mono ${color}`}>
              {value(analyticsData)}
            </div>
            <div className="text-xs font-medium mt-1">{label}</div>
            <div className="text-[10px] text-muted-foreground">{sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
