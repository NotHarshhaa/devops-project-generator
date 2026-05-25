import { useMemo } from "react";
import { ProjectConfig } from "@/lib/types";
import { analyzeDependencies } from "../lib/analyze-dependencies";
import { calculateComplexityMetrics } from "../lib/complexity-metrics";
import { getConfigOptimizations } from "../lib/optimizations";

export function useConfigAnalysis(config: ProjectConfig) {
  const dependencies = useMemo(() => analyzeDependencies(config), [config]);
  const complexityMetrics = useMemo(() => calculateComplexityMetrics(config), [config]);
  const optimizations = useMemo(() => getConfigOptimizations(config), [config]);

  const conflicts = dependencies.filter((d) => d.type === "conflict");
  const warnings = dependencies.filter((d) => d.type === "warning");
  const recommendations = dependencies.filter((d) => d.type === "recommended");
  const requirements = dependencies.filter((d) => d.type === "required");

  return {
    dependencies,
    complexityMetrics,
    optimizations,
    conflicts,
    warnings,
    recommendations,
    requirements,
  };
}
