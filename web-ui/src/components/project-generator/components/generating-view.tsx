"use client";

import { ProjectConfig } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Loader2, Terminal } from "lucide-react";
import { calculateComplexity } from "../utils";

interface GeneratingViewProps {
  config: ProjectConfig;
}

const buildSteps = (complexity: number) => [
  { label: "Initializing workspace", status: "done" as const },
  { label: "Generating CI/CD pipelines", status: complexity > 2 ? ("done" as const) : ("active" as const) },
  { label: "Provisioning infrastructure templates", status: complexity > 3 ? ("done" as const) : ("pending" as const) },
  { label: "Packaging deployment manifests", status: "pending" as const },
  { label: "Finalizing security policies", status: "pending" as const },
];

export function GeneratingView({ config }: GeneratingViewProps) {
  const complexity = calculateComplexity(config);
  const steps = buildSteps(complexity);

  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-16 animate-fade-in px-2">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-border/60 overflow-hidden shadow-2xl dark:brand-glow">
          <div className="terminal-panel-header flex items-center gap-2 px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/70" />
              <div className="h-3 w-3 rounded-full bg-amber-500/70" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
            </div>
            <span className="text-[11px] font-mono terminal-dim ml-2">generator — bash</span>
          </div>

          <div className="terminal-panel p-5 font-mono text-xs space-y-2 min-h-[280px]">
            <p className="text-brand">
              <span className="terminal-accent">$</span> devops-project-generator init --name {config.projectName}
            </p>
            <p className="terminal-dim">→ Resolving stack configuration...</p>

            {steps.map((step, i) => (
              <p
                key={step.label}
                className={
                  step.status === "done"
                    ? "terminal-accent"
                    : step.status === "active"
                      ? "text-brand animate-pulse"
                      : "terminal-dim opacity-60"
                }
              >
                {step.status === "done" ? "✓" : step.status === "active" ? "▸" : "○"} {step.label}
                {step.status === "active" && i === steps.findIndex((s) => s.status === "active") && (
                  <Loader2 className="inline h-3 w-3 ml-2 animate-spin" />
                )}
              </p>
            ))}

            <p className="terminal-dim opacity-70 pt-2">pipeline={config.pipeline} · infra={config.infra}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 mt-6 text-center">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-brand" />
            <h3 className="text-lg font-semibold">Building {config.projectName}</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="font-mono text-[10px] border-brand/30">
              {config.ci}
            </Badge>
            <Badge variant="outline" className="font-mono text-[10px] border-brand/30">
              {config.deploy}
            </Badge>
            <Badge variant="outline" className="font-mono text-[10px] border-brand/30">
              {config.security}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
