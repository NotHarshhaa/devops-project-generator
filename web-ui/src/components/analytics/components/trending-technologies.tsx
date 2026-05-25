"use client";

import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AnalyticsData } from "@/components/analytics/types";
import {
  getCategoryIcon,
  getCategoryColor,
  getCategoryBgColor,
} from "@/components/analytics/utils/category-helpers";

interface TrendingTechnologiesProps {
  analyticsData: AnalyticsData;
}

export function TrendingTechnologies({ analyticsData }: TrendingTechnologiesProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-border/60 bg-muted/30">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          <h3 className="text-sm font-semibold">Trending technologies</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">Fastest growing technologies this month</p>
      </div>

      <div className="p-4 sm:p-5 space-y-2">
        {analyticsData.trends.map((trend, idx) => {
          const Icon = getCategoryIcon(trend.category);
          const colorClass = getCategoryColor(trend.category);
          const bgClass = getCategoryBgColor(trend.category);

          return (
            <div
              key={idx}
              className="flex items-center justify-between p-3 sm:p-4 rounded-xl border border-border/50 bg-background/50 transition-all hover:border-brand/30 hover:shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bgClass}`}>
                  <Icon className={`h-5 w-5 ${colorClass}`} />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">{trend.technology}</div>
                  <div className="text-xs text-muted-foreground capitalize">{trend.category}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge className="bg-emerald-500/10 text-emerald-500 border-0 font-mono font-semibold">
                  +{trend.growth}%
                </Badge>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
