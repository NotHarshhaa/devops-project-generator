"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calculator, Target, DollarSign, Sparkles } from "lucide-react";
import { CostOptimizerProps } from "./types";
import { useCostAnalysis } from "./hooks/use-cost-analysis";
import { CostSummaryCards } from "./components/cost-summary-cards";
import { CostBreakdown } from "./components/cost-breakdown";
import { OptimizationList } from "./components/optimization-list";
import { CostInsights } from "./components/cost-insights";

export function CostOptimizer({ config }: CostOptimizerProps) {
  const {
    costEstimates,
    optimizations,
    totalMonthlyCost,
    totalPotentialSavings,
    optimizedCost,
  } = useCostAnalysis(config);

  const savingsPercent =
    totalMonthlyCost > 0 ? ((totalPotentialSavings / totalMonthlyCost) * 100).toFixed(0) : "0";

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/10 border border-brand/20 brand-glow">
            <DollarSign className="h-6 w-6 text-brand" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Cost Optimization Advisor</h2>
              <Badge variant="outline" className="text-[10px] font-mono border-brand/30 text-brand">
                Live estimate
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground max-w-xl">
              Realistic monthly cost projections and data-driven recommendations for your current stack.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 font-mono text-[10px] sm:text-xs">
          <Badge variant="secondary" className="px-2.5">{config.infra}</Badge>
          <Badge variant="secondary" className="px-2.5">{config.deploy}</Badge>
          <Badge variant="secondary" className="px-2.5">{config.observability}</Badge>
        </div>
      </div>

      <CostSummaryCards
        totalMonthlyCost={totalMonthlyCost}
        totalPotentialSavings={totalPotentialSavings}
        optimizedCost={optimizedCost}
      />

      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-brand/5 to-transparent p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand shrink-0" />
            <p className="text-sm">
              You could save{" "}
              <span className="font-bold font-mono text-emerald-500">${totalPotentialSavings.toFixed(0)}/mo</span>{" "}
              ({savingsPercent}%) by applying {optimizations.length} recommended optimizations.
            </p>
          </div>
          <p className="text-xs text-muted-foreground font-mono shrink-0">
            Optimized → ${optimizedCost.toFixed(0)}/mo
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <CostBreakdown costEstimates={costEstimates} totalMonthlyCost={totalMonthlyCost} />
        <OptimizationList optimizations={optimizations} />
      </div>

      <CostInsights totalMonthlyCost={totalMonthlyCost} />

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button variant="outline" className="flex-1 gap-2 border-border/80 h-11">
          <Calculator className="h-4 w-4" />
          Export Cost Report
        </Button>
        <Button className="flex-1 gap-2 h-11 bg-brand hover:bg-brand/90 text-brand-foreground shadow-lg shadow-brand/20">
          <Target className="h-4 w-4" />
          Create Optimization Plan
        </Button>
      </div>
    </div>
  );
}
