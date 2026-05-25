"use client";

import { useState } from "react";
import { ProjectConfig } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  TrendingUp,
  Network,
  CheckCircle2,
  Download,
  Rocket,
  ArrowRight,
  GitBranch,
  Layers,
  Package,
  Activity,
  Shield,
  Cpu,
} from "lucide-react";
import { AdvancedConfigBuilderProps } from "./types";
import { useConfigAnalysis } from "./hooks/use-config-analysis";
import { ComplexityCard } from "./components/complexity-card";
import { DependencyAlerts } from "./components/dependency-alerts";
import { DependencyList } from "./components/dependency-list";

export function AdvancedConfigBuilder({ config }: AdvancedConfigBuilderProps) {
  const [showDependencies, setShowDependencies] = useState(true);
  const [showOptimizations, setShowOptimizations] = useState(false);
  const { complexityMetrics, optimizations, conflicts, warnings, recommendations, requirements } =
    useConfigAnalysis(config);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Advanced Configuration Builder
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Analyze dependencies, detect conflicts, and optimize your configuration
        </p>
      </div>

      <ComplexityCard config={config} metrics={complexityMetrics} />
      <DependencyAlerts conflicts={conflicts} warnings={warnings} />
      <DependencyList requirements={requirements} recommendations={recommendations} />

      {optimizations.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Optimizations Available
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Improve cost, performance, and security
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowOptimizations(!showOptimizations)}>
                {showOptimizations ? "Hide" : "Show"}
              </Button>
            </div>
          </CardHeader>
          {showOptimizations && (
            <CardContent>
              <div className="space-y-3">
                {optimizations.map((opt, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{opt.title}</span>
                        <Badge variant="outline" className="text-xs">{opt.type}</Badge>
                        <Badge variant="secondary" className="text-xs">{opt.difficulty}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{opt.description}</p>
                      <span className="text-xs font-medium text-green-600">{opt.savings}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Network className="h-4 w-4" />
                Architecture Flow
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Visual representation of component relationships
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowDependencies(!showDependencies)}>
              {showDependencies ? "Hide" : "Show"}
            </Button>
          </div>
        </CardHeader>
        {showDependencies && (
          <CardContent>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 justify-center p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <GitBranch className="h-4 w-4 text-blue-500" />
                  <span className="text-xs font-medium">{config.ci}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <Layers className="h-4 w-4 text-purple-500" />
                  <span className="text-xs font-medium">{config.infra}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <Package className="h-4 w-4 text-cyan-500" />
                  <span className="text-xs font-medium">{config.deploy}</span>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Activity className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-medium">{config.observability}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <Shield className="h-4 w-4 text-red-500" />
                  <span className="text-xs font-medium">{config.security}</span>
                </div>
              </div>
              <Separator />
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Cpu className="h-4 w-4 text-green-500" />
                  <span className="text-xs font-medium">{config.envs}</span>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {conflicts.length === 0 && warnings.length === 0 && (
        <Alert>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-sm">
            <strong className="text-green-500">Configuration Valid!</strong> No conflicts detected. Your configuration is ready to generate.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Export Configuration
        </Button>
        <Button className="flex-1">
          <Rocket className="h-4 w-4 mr-2" />
          Generate Project
        </Button>
      </div>
    </div>
  );
}
