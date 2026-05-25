"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Download, Rocket, Network, Sparkles } from "lucide-react";
import { AdvancedConfigBuilderProps } from "./types";
import { useConfigAnalysis } from "./hooks/use-config-analysis";
import { ComplexityCard } from "./components/complexity-card";
import { DependencyAlerts } from "./components/dependency-alerts";
import { DependencyList } from "./components/dependency-list";
import { ArchitectureFlow } from "./components/architecture-flow";
import { OptimizationPanel } from "./components/optimization-panel";

export function AdvancedConfigBuilder({ config }: AdvancedConfigBuilderProps) {
  const { complexityMetrics, optimizations, conflicts, warnings, recommendations, requirements } =
    useConfigAnalysis(config);

  const isValid = conflicts.length === 0 && warnings.length === 0;
  const issueCount = conflicts.length + warnings.length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/10 border border-brand/20 brand-glow">
            <Network className="h-6 w-6 text-brand" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Config Builder</h2>
              <Badge
                variant="outline"
                className={`text-[10px] font-mono ${
                  isValid
                    ? "border-emerald-500/30 text-emerald-500"
                    : "border-amber-500/30 text-amber-500"
                }`}
              >
                {isValid ? "Valid" : `${issueCount} issue${issueCount !== 1 ? "s" : ""}`}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground max-w-xl">
              Analyze dependencies, detect conflicts, and optimize your configuration before generating.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="secondary" className="font-mono text-[10px] px-2.5">
            Score: {complexityMetrics.score}
          </Badge>
          <Badge variant="outline" className={`text-[10px] ${complexityMetrics.color} border-current/30`}>
            {complexityMetrics.level}
          </Badge>
        </div>
      </div>

      <ComplexityCard config={config} metrics={complexityMetrics} />

      <DependencyAlerts conflicts={conflicts} warnings={warnings} />

      {isValid && (
        <Alert className="border-emerald-500/20 bg-emerald-500/5">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <AlertDescription className="text-sm">
            <strong className="text-emerald-500">Configuration valid.</strong> No conflicts detected — your
            stack is ready to generate.
          </AlertDescription>
        </Alert>
      )}

      <DependencyList requirements={requirements} recommendations={recommendations} />

      <div className={optimizations.length > 0 ? "grid gap-6 xl:grid-cols-2" : "space-y-6"}>
        <ArchitectureFlow config={config} />
        {optimizations.length > 0 && <OptimizationPanel optimizations={optimizations} />}
      </div>

      {optimizations.length > 0 && (
        <div className="rounded-2xl border border-brand/20 bg-brand/5 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand shrink-0" />
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">{optimizations.length} optimization{optimizations.length !== 1 ? "s" : ""}</strong>{" "}
              available to reduce complexity, cost, or improve security for this stack.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button variant="outline" className="flex-1 gap-2 border-border/80 h-11">
          <Download className="h-4 w-4" />
          Export Configuration
        </Button>
        <Button className="flex-1 gap-2 h-11 bg-brand hover:bg-brand/90 text-brand-foreground shadow-lg shadow-brand/20">
          <Rocket className="h-4 w-4" />
          Generate Project
        </Button>
      </div>
    </div>
  );
}
