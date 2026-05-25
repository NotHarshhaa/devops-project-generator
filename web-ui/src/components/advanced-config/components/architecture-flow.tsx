"use client";

import { ProjectConfig } from "@/lib/types";
import {
  ArrowRight,
  GitBranch,
  Layers,
  Package,
  Activity,
  Shield,
  Cpu,
  Network,
} from "lucide-react";

interface ArchitectureFlowProps {
  config: ProjectConfig;
}

const flowNodes = (config: ProjectConfig) => [
  { icon: GitBranch, label: config.ci, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/25" },
  { icon: Layers, label: config.infra, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/25" },
  { icon: Package, label: config.deploy, color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/25" },
];

const supportNodes = (config: ProjectConfig) => [
  { icon: Activity, label: config.observability, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/25" },
  { icon: Shield, label: config.security, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/25" },
];

function FlowNode({
  icon: Icon,
  label,
  color,
  bg,
  border,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl ${bg} border ${border} transition-all hover:scale-[1.02]`}>
      <Icon className={`h-4 w-4 shrink-0 ${color}`} />
      <span className="text-xs font-medium font-mono truncate max-w-[120px] sm:max-w-none">{label}</span>
    </div>
  );
}

export function ArchitectureFlow({ config }: ArchitectureFlowProps) {
  const mainFlow = flowNodes(config);
  const support = supportNodes(config);

  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-border/60 bg-muted/30">
        <div className="flex items-center gap-2">
          <Network className="h-4 w-4 text-brand" />
          <h3 className="text-sm font-semibold">Architecture flow</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Visual map of how your stack components connect
        </p>
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        <div className="rounded-xl border border-border/50 bg-background/50 p-4 sm:p-5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-4 text-center">
            Primary pipeline
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {mainFlow.map((node, idx) => (
              <div key={node.label} className="flex items-center gap-2 sm:gap-3">
                <FlowNode {...node} />
                {idx < mainFlow.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-brand/60 shrink-0 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {support.map((node) => (
            <FlowNode key={node.label} {...node} />
          ))}
        </div>

        <div className="flex justify-center">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
            <Cpu className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-medium font-mono">{config.envs}</span>
            <span className="text-[10px] text-muted-foreground">environments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
