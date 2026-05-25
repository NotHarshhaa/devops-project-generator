"use client";

import { Button } from "@/components/ui/button";
import { Calculator, Target } from "lucide-react";
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          Cost Optimization Advisor
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Realistic cost estimates and data-driven optimization recommendations
        </p>
      </div>

      <CostSummaryCards
        totalMonthlyCost={totalMonthlyCost}
        totalPotentialSavings={totalPotentialSavings}
        optimizedCost={optimizedCost}
      />

      <CostBreakdown costEstimates={costEstimates} totalMonthlyCost={totalMonthlyCost} />

      <OptimizationList optimizations={optimizations} />

      <CostInsights totalMonthlyCost={totalMonthlyCost} />

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1">
          <Calculator className="h-4 w-4 mr-2" />
          Export Cost Report
        </Button>
        <Button className="flex-1">
          <Target className="h-4 w-4 mr-2" />
          Create Optimization Plan
        </Button>
      </div>
    </div>
  );
}
