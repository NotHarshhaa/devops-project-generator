"use client";

import { useMemo } from "react";
import { ProjectConfig } from "@/lib/types";
import { calculateCostEstimates } from "../lib/cost-estimates";
import { getCostOptimizations } from "../lib/optimizations";
import { CostEstimate, CostOptimization } from "../types";

export function useCostAnalysis(config: ProjectConfig) {
  const costEstimates = useMemo<CostEstimate[]>(
    () => calculateCostEstimates(config),
    [config]
  );

  const optimizations = useMemo<CostOptimization[]>(
    () => getCostOptimizations(config),
    [config]
  );

  const totalMonthlyCost = costEstimates.reduce((sum, e) => sum + e.monthlyCost, 0);
  const totalPotentialSavings = optimizations.reduce((sum, o) => sum + o.savings, 0);
  const optimizedCost = Math.max(totalMonthlyCost - totalPotentialSavings, totalMonthlyCost * 0.3);

  return {
    costEstimates,
    optimizations,
    totalMonthlyCost,
    totalPotentialSavings,
    optimizedCost,
  };
}
