"use client";

import { ProjectConfig } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Clock,
  Users,
  DollarSign,
  Layers,
  Package,
  Cpu,
  GitBranch,
  Activity,
  Shield,
  Terminal,
} from "lucide-react";
import { ComplexityMetrics } from "../types";

interface ComplexityCardProps {
  config: ProjectConfig;
  metrics: ComplexityMetrics;
}

const metricCards = (metrics: ComplexityMetrics) => [
  { icon: Clock, label: "Setup time", value: metrics.estimatedTime, color: "text-brand", bg: "bg-brand/10", border: "border-brand/20" },
  { icon: Users, label: "Team size", value: metrics.teamSize, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { icon: DollarSign, label: "Est. monthly", value: metrics.monthlyCost, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
];

const stackItems = (config: ProjectConfig) => [
  { icon: GitBranch, label: "CI/CD", value: config.ci, color: "text-blue-500" },
  { icon: Layers, label: "Infra", value: config.infra, color: "text-purple-500" },
  { icon: Package, label: "Deploy", value: config.deploy, color: "text-cyan-500" },
  { icon: Activity, label: "Observability", value: config.observability, color: "text-amber-500" },
  { icon: Shield, label: "Security", value: config.security, color: "text-red-500" },
  { icon: Cpu, label: "Environments", value: config.envs, color: "text-emerald-500" },
];

function getScoreBarColor(score: number) {
  if (score < 30) return "bg-emerald-500";
  if (score < 50) return "bg-amber-500";
  if (score < 75) return "bg-orange-500";
  return "bg-red-500";
}

export function ComplexityCard({ config, metrics }: ComplexityCardProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-border/60 bg-muted/30">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-brand" />
          <h3 className="text-sm font-semibold">Configuration analysis</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Complexity scoring and stack overview for your current config
        </p>
      </div>

      <div className="p-4 sm:p-5 space-y-5">
        <div className="rounded-xl border border-border/50 bg-background/50 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Complexity score</span>
                <Badge className={`${metrics.bgColor} ${metrics.color} border-0 font-mono`}>
                  {metrics.level}
                </Badge>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${getScoreBarColor(metrics.score)}`}
                  style={{ width: `${metrics.score}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 font-mono">0 — simple · 100 — expert</p>
            </div>
            <div className="flex flex-col items-center sm:items-end shrink-0">
              <span className="text-4xl sm:text-5xl font-bold font-mono tracking-tight">{metrics.score}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">/ 100</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {metricCards(metrics).map(({ icon: Icon, label, value, color, bg, border }) => (
            <div key={label} className={`rounded-xl border ${border} ${bg} p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-4 w-4 ${color}`} />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {label}
                </span>
              </div>
              <p className={`text-sm font-semibold font-mono ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="h-3.5 w-3.5 text-brand" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Active stack
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {stackItems(config).map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                className="rounded-lg border border-border/50 bg-background/50 px-3 py-2.5 transition-colors hover:border-brand/25"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={`h-3 w-3 ${color}`} />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
                </div>
                <p className="text-xs font-mono font-medium truncate">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
