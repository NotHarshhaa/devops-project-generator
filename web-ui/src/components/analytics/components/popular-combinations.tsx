"use client";

import { Award, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AnalyticsData } from "@/components/analytics/types";

interface PopularCombinationsProps {
  analyticsData: AnalyticsData;
}

export function PopularCombinations({ analyticsData }: PopularCombinationsProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-border/60 bg-muted/30">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-semibold">Most popular stack combinations</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Top 5 technology combinations used by the community
        </p>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {analyticsData.popularCombinations.map((combo, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold font-mono ${
                    idx === 0
                      ? "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {idx === 0 ? <Trophy className="h-4 w-4" /> : `#${idx + 1}`}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">{combo.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {combo.count.toLocaleString()} projects
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className="font-mono font-semibold border-brand/30">
                  {combo.percentage.toFixed(1)}%
                </Badge>
                {idx === 0 && (
                  <Badge className="bg-amber-500/10 text-amber-500 border-0 text-[10px]">
                    #1
                  </Badge>
                )}
              </div>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand to-cyan-400 transition-all duration-500 rounded-full"
                style={{ width: `${combo.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
