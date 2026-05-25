"use client";

import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AnalyticsData } from "@/components/analytics/types";
import { getCategoryIcon, getCategoryColor } from "@/components/analytics/utils/category-helpers";

interface TrendingTechnologiesProps {
  analyticsData: AnalyticsData;
}

export function TrendingTechnologies({ analyticsData }: TrendingTechnologiesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          Trending Technologies
        </CardTitle>
        <CardDescription className="text-xs">
          Fastest growing technologies this month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {analyticsData.trends.map((trend, idx) => {
            const Icon = getCategoryIcon(trend.category);
            const colorClass = getCategoryColor(trend.category);

            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${trend.category === "ci-cd" ? "blue" : trend.category === "infrastructure" ? "purple" : trend.category === "deployment" ? "cyan" : trend.category === "observability" ? "amber" : "red"}-500/10`}
                  >
                    <Icon className={`h-5 w-5 ${colorClass}`} />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{trend.technology}</div>
                    <div className="text-xs text-muted-foreground capitalize">{trend.category}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500/10 text-green-500 border-0 font-semibold">
                    +{trend.growth}%
                  </Badge>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
