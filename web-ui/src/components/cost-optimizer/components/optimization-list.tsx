import { Button } from "@/components/ui/button";
import { Lightbulb, Wrench, Target, Clock, ArrowRight } from "lucide-react";
import { CostOptimization } from "../types";
import { getDifficultyBadge, getImpactBadge, getRiskBadge } from "../utils/badges";

interface OptimizationListProps {
  optimizations: CostOptimization[];
}

function getImplementationTime(difficulty: CostOptimization["difficulty"]) {
  switch (difficulty) {
    case "easy":
      return "1–2 weeks";
    case "medium":
      return "1–2 months";
    default:
      return "3–6 months";
  }
}

export function OptimizationList({ optimizations }: OptimizationListProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 overflow-hidden h-full flex flex-col">
      <div className="px-5 py-4 border-b border-border/60 bg-muted/30">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-semibold">Optimization recommendations</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {optimizations.length} data-driven ways to reduce monthly costs
        </p>
      </div>

      <div className="p-4 sm:p-5 space-y-3 flex-1 overflow-y-auto max-h-[480px]">
        {optimizations.map((opt, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-border/50 bg-background/50 p-4 transition-all hover:border-brand/30 hover:shadow-md hover:shadow-brand/5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  <h4 className="font-semibold text-sm">{opt.title}</h4>
                  {getDifficultyBadge(opt.difficulty)}
                  {getImpactBadge(opt.impact)}
                  {getRiskBadge(opt.risk)}
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{opt.description}</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Wrench className="h-3 w-3 text-brand shrink-0" />
                    <span className="font-medium text-foreground">Implementation:</span>
                    <span>{opt.implementation}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Target className="h-3 w-3 text-emerald-500 shrink-0" />
                    <span className="font-medium text-foreground">ROI:</span>
                    <span className="text-emerald-500 font-mono">{opt.roi}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
                <div className="text-xl font-bold font-mono text-emerald-500">-${opt.savings}</div>
                <div className="text-[10px] text-muted-foreground">per month</div>
                <div className="text-[10px] text-brand font-mono font-medium">
                  ${(opt.savings * 12).toFixed(0)}/yr
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Est. {getImplementationTime(opt.difficulty)}</span>
              </div>
              <Button variant="ghost" size="sm" className="text-xs h-7 gap-1 text-brand hover:text-brand hover:bg-brand/10">
                Learn more
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
