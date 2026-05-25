"use client";

import { Users, ArrowUp, FileText, Calendar, Target } from "lucide-react";
import type { AnalyticsData } from "@/components/analytics/types";

interface UserMetricsProps {
  analyticsData: AnalyticsData;
}

const userMetrics = [
  {
    icon: ArrowUp,
    label: "Returning users",
    value: (d: AnalyticsData) => String(d.userMetrics.returningUsers),
    sub: "30-day active",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: FileText,
    label: "Projects / user",
    value: (d: AnalyticsData) => d.userMetrics.avgProjectsPerUser.toFixed(1),
    sub: "Average",
    color: "text-brand",
    bg: "bg-brand/10",
  },
  {
    icon: Calendar,
    label: "Most active",
    value: (d: AnalyticsData) => d.userMetrics.mostActiveDay,
    sub: "Day of week",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: Target,
    label: "Satisfaction",
    value: (d: AnalyticsData) => String(d.userMetrics.userSatisfaction),
    sub: "Out of 5",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
] as const;

export function UserMetrics({ analyticsData }: UserMetricsProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 overflow-hidden h-full">
      <div className="px-5 py-4 border-b border-border/60 bg-muted/30">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-emerald-500" />
          <h3 className="text-sm font-semibold">User engagement</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">How users interact with the platform</p>
      </div>
      <div className="p-4 sm:p-5 grid grid-cols-2 gap-3">
        {userMetrics.map(({ icon: Icon, label, value, sub, color, bg }) => (
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
