"use client";

import { ProjectConfig } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Clock, Users, DollarSign, Layers, Package, Cpu, GitBranch } from "lucide-react";
import { ComplexityMetrics } from "../types";

interface ComplexityCardProps {
  config: ProjectConfig;
  metrics: ComplexityMetrics;
}

export function ComplexityCard({ config, metrics }: ComplexityCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Configuration Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Complexity Score</span>
              <Badge className={`${metrics.bgColor} ${metrics.color} border-0`}>{metrics.level}</Badge>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  metrics.score < 30 ? "bg-green-500" :
                  metrics.score < 50 ? "bg-amber-500" :
                  metrics.score < 75 ? "bg-orange-500" : "bg-red-500"
                }`}
                style={{ width: `${metrics.score}%` }}
              />
            </div>
          </div>
          <div className="text-3xl font-bold">{metrics.score}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {[
            { icon: Clock, label: "Setup Time", value: metrics.estimatedTime, color: "text-blue-500" },
            { icon: Users, label: "Team Size", value: metrics.teamSize, color: "text-green-500" },
            { icon: DollarSign, label: "Est. Monthly", value: metrics.monthlyCost, color: "text-amber-500" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="rounded-lg border bg-card p-3">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`h-3 w-3 ${color}`} />
                <span className="font-medium">{label}</span>
              </div>
              <p className="text-muted-foreground">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            { icon: Layers, label: "Infrastructure", value: config.infra, color: "text-purple-500" },
            { icon: Package, label: "Deployment", value: config.deploy, color: "text-cyan-500" },
            { icon: Cpu, label: "Environments", value: `${config.envs.split(",").length} env(s)`, color: "text-green-500" },
            { icon: GitBranch, label: "CI/CD", value: config.ci, color: "text-red-500" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="rounded-lg border bg-card p-3">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`h-3 w-3 ${color}`} />
                <span className="font-medium">{label}</span>
              </div>
              <p className="text-muted-foreground truncate">{value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
