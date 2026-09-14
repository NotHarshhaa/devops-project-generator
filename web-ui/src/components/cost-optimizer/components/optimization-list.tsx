import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb, Wrench, Target, Clock, ArrowRight, ChevronUp, CheckCircle2, ShieldAlert } from "lucide-react";
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
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                className="text-xs h-7 gap-1 text-brand hover:text-brand hover:bg-brand/10"
              >
                {expandedIdx === idx ? (
                  <>
                    Hide details
                    <ChevronUp className="h-3 w-3" />
                  </>
                ) : (
                  <>
                    Learn more
                    <ArrowRight className="h-3 w-3" />
                  </>
                )}
              </Button>
            </div>

            {expandedIdx === idx && (
              <div className="mt-3 pt-3 border-t border-border/60 bg-muted/20 rounded-lg p-3 space-y-2 animate-fade-in text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground">Implementation Playbook:</strong>
                    <p className="text-muted-foreground mt-0.5">{opt.implementation}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground">Risk Assessment:</strong>
                    <p className="text-muted-foreground mt-0.5">
                      Classified as <span className="font-semibold uppercase text-amber-500">{opt.risk} risk</span>. Implement in a staging environment first to validate workload SLOs before production rollout.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
