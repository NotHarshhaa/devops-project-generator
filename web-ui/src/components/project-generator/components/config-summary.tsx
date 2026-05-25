"use client";

import { ProjectConfig } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FolderOpen,
  Terminal,
  GitBranch,
  Layers,
  Package,
  Cpu,
  Activity,
  Shield,
} from "lucide-react";
import { calculateComplexity, getComplexityLabel } from "../utils";

interface ConfigSummaryProps {
  config: ProjectConfig;
  currentStep: number;
  completedSteps: Set<number>;
}

export function ConfigSummary({ config, currentStep, completedSteps }: ConfigSummaryProps) {
  if (currentStep <= 0) return null;

  const complexity = calculateComplexity(config);
  const complexityLabel = getComplexityLabel(complexity);

  return (
    <>
      <Separator className="max-w-2xl mx-auto" />
      <div className="max-w-2xl mx-auto px-1 sm:px-0">
        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
          Your selections
        </p>
        <div className="flex flex-wrap gap-2">
          {config.projectName && (
            <Badge variant="outline" className="gap-1.5">
              <FolderOpen className="h-3 w-3" />
              {config.projectName}
            </Badge>
          )}
          {completedSteps.has(1) && (
            <Badge variant="outline" className="gap-1.5">
              <Terminal className="h-3 w-3" />
              {config.pipeline}
            </Badge>
          )}
          {completedSteps.has(2) && config.ci !== "none" && (
            <Badge variant="outline" className="gap-1.5">
              <GitBranch className="h-3 w-3" />
              {config.ci}
            </Badge>
          )}
          {completedSteps.has(3) && (
            <Badge variant="outline" className="gap-1.5">
              <Layers className="h-3 w-3" />
              {config.infra}
            </Badge>
          )}
          {completedSteps.has(4) && (
            <Badge variant="outline" className="gap-1.5">
              <Package className="h-3 w-3" />
              {config.deploy}
            </Badge>
          )}
          {completedSteps.has(5) && (
            <Badge variant="outline" className="gap-1.5">
              <Cpu className="h-3 w-3" />
              {config.envs}
            </Badge>
          )}
          {completedSteps.has(6) && (
            <Badge variant="outline" className="gap-1.5">
              <Activity className="h-3 w-3" />
              {config.observability}
            </Badge>
          )}
          {completedSteps.has(7) && (
            <Badge variant="outline" className="gap-1.5">
              <Shield className="h-3 w-3" />
              {config.security}
            </Badge>
          )}
        </div>

        {currentStep >= 3 && (
          <div className="mt-3 p-2 rounded-lg bg-muted/30">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Project Complexity:</span>
              <Badge
                variant="outline"
                className={
                  complexityLabel === "Simple"
                    ? "bg-green-500/10 text-green-500 border-0"
                    : complexityLabel === "Medium"
                      ? "bg-amber-500/10 text-amber-500 border-0"
                      : "bg-red-500/10 text-red-500 border-0"
                }
              >
                {complexityLabel}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
