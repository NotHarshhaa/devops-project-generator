"use client";

import { ProjectConfig } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  FolderOpen,
  Terminal,
  GitBranch,
  Layers,
  Package,
  Cpu,
  Activity,
  Shield,
  Sparkles,
} from "lucide-react";
import { calculateComplexity, getComplexityLabel } from "../utils";

interface StackPreviewPanelProps {
  config: ProjectConfig;
  currentStep: number;
  completedSteps: Set<number>;
}

const stackItems = [
  { key: "projectName" as const, icon: FolderOpen, label: "Project", stepIndex: 0 },
  { key: "pipeline" as const, icon: Terminal, label: "Pipeline", stepIndex: 1 },
  { key: "ci" as const, icon: GitBranch, label: "CI/CD", stepIndex: 2 },
  { key: "infra" as const, icon: Layers, label: "Infra", stepIndex: 3 },
  { key: "deploy" as const, icon: Package, label: "Deploy", stepIndex: 4 },
  { key: "envs" as const, icon: Cpu, label: "Envs", stepIndex: 5 },
  { key: "observability" as const, icon: Activity, label: "Observability", stepIndex: 6 },
  { key: "security" as const, icon: Shield, label: "Security", stepIndex: 7 },
];

export function StackPreviewPanel({ config, currentStep, completedSteps }: StackPreviewPanelProps) {
  const complexity = calculateComplexity(config);
  const complexityLabel = getComplexityLabel(complexity);
  const filledCount = stackItems.filter(
    (item) => completedSteps.has(item.stepIndex) || (item.stepIndex === currentStep && config[item.key])
  ).length;

  return (
    <aside className="hidden xl:flex flex-col w-64 shrink-0 border-l border-border/60 pl-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-4 w-4 text-brand" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Live Stack Preview
        </h3>
      </div>

      <div className="rounded-xl border border-border/60 bg-muted/30 p-3 font-mono text-[11px] space-y-1.5 mb-4">
        <p className="text-brand/80"># devops-project.yaml</p>
        {stackItems.map((item) => {
          const Icon = item.icon;
          const value = config[item.key];
          const isSet = completedSteps.has(item.stepIndex) || (item.stepIndex === currentStep && value);
          const isActive = item.stepIndex === currentStep;

          return (
            <div
              key={item.key}
              className={`flex items-start gap-2 rounded-md px-2 py-1 transition-colors ${
                isActive ? "bg-brand/10 text-brand" : isSet ? "text-foreground/90" : "text-muted-foreground/40"
              }`}
            >
              <Icon className="h-3 w-3 mt-0.5 shrink-0" />
              <span className="truncate">
                <span className="text-muted-foreground">{item.label}:</span>{" "}
                {isSet ? String(value) : "—"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="space-y-3 mt-auto">
        <div className="rounded-xl border border-border/60 p-3">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-muted-foreground">Stack completion</span>
            <span className="font-mono font-semibold">{filledCount}/{stackItems.length}</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-brand/80 transition-all duration-300"
              style={{ width: `${(filledCount / stackItems.length) * 100}%` }}
            />
          </div>
        </div>

        {currentStep >= 2 && (
          <div className="rounded-xl border border-border/60 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Complexity</span>
              <Badge
                variant="outline"
                className={
                  complexityLabel === "Simple"
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : complexityLabel === "Medium"
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                }
              >
                {complexityLabel}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
