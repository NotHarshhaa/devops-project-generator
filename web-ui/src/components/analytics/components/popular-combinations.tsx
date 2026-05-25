"use client";

import { Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AnalyticsData } from "@/components/analytics/types";

interface PopularCombinationsProps {
  analyticsData: AnalyticsData;
}

export function PopularCombinations({ analyticsData }: PopularCombinationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Award className="h-4 w-4 text-amber-500" />
          Most Popular Stack Combinations
        </CardTitle>
        <CardDescription className="text-xs">
          Top 5 technology combinations used by the community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analyticsData.popularCombinations.map((combo, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{combo.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {combo.count.toLocaleString()} projects
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-semibold">
                    {combo.percentage.toFixed(1)}%
                  </Badge>
                  {idx === 0 && (
                    <Badge className="bg-amber-500/10 text-amber-500 border-0 text-xs">
                      Most Popular
                    </Badge>
                  )}
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                  style={{ width: `${combo.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
