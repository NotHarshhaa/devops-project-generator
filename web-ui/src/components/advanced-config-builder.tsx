"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ProjectConfig } from "@/lib/types";
import {
  GitBranch,
  Layers,
  Package,
  Activity,
  Shield,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Network,
  Zap,
  TrendingUp,
  Info,
} from "lucide-react";

interface Dependency {
  from: string;
  to: string;
  type: "required" | "recommended" | "conflict";
  reason: string;
}

interface ConfigBuilderProps {
  config: ProjectConfig;
  onConfigChange?: (config: ProjectConfig) => void;
}

export function AdvancedConfigBuilder({ config, onConfigChange }: ConfigBuilderProps) {
  const [showDependencies, setShowDependencies] = useState(true);

  const dependencies = useMemo<Dependency[]>(() => {
    const deps: Dependency[] = [];

    // Infrastructure dependencies
    if (config.infra.includes("eks") || config.infra.includes("aks") || config.infra.includes("gke")) {
      deps.push({
        from: config.infra,
        to: "kubernetes",
        type: "required",
        reason: "Managed Kubernetes requires K8s deployment strategy",
      });
    }

    // Deployment strategy dependencies
    if (config.deploy === "helm-charts" || config.deploy === "kustomize" || config.deploy === "gitops-argocd") {
      if (!config.infra.includes("kubernetes") && !config.infra.includes("eks") && !config.infra.includes("aks") && !config.infra.includes("gke")) {
        deps.push({
          from: config.deploy,
          to: config.infra,
          type: "conflict",
          reason: "Kubernetes deployment strategy requires Kubernetes infrastructure",
        });
      }
    }

    // Serverless conflicts
    if (config.deploy === "serverless-lambda") {
      if (config.infra !== "ecs-fargate" && !config.infra.includes("aws")) {
        deps.push({
          from: config.deploy,
          to: config.infra,
          type: "conflict",
          reason: "AWS Lambda requires AWS infrastructure",
        });
      }
    }

    // Observability recommendations
    if (config.infra.includes("aws") && config.observability !== "cloudwatch") {
      deps.push({
        from: config.infra,
        to: "cloudwatch",
        type: "recommended",
        reason: "AWS CloudWatch is recommended for AWS infrastructure",
      });
    }

    // Multi-environment recommendations
    if (config.envs === "dev,stage,prod" || config.envs === "dev,qa,stage,prod") {
      if (config.deploy === "blue-green" || config.deploy === "canary") {
        deps.push({
          from: config.envs,
          to: config.deploy,
          type: "recommended",
          reason: "Advanced deployment strategies work well with multiple environments",
        });
      }
    }

    // Security compliance
    if (config.security === "hipaa-compliance" || config.security === "soc2-compliance") {
      deps.push({
        from: config.security,
        to: "observability",
        type: "required",
        reason: "Compliance frameworks require comprehensive observability",
      });
    }

    // CI/CD recommendations
    if (config.infra.includes("aws") && config.ci === "github-actions") {
      deps.push({
        from: config.infra,
        to: config.ci,
        type: "recommended",
        reason: "GitHub Actions integrates well with AWS via OIDC",
      });
    }

    return deps;
  }, [config]);

  const conflicts = dependencies.filter((d) => d.type === "conflict");
  const recommendations = dependencies.filter((d) => d.type === "recommended");
  const requirements = dependencies.filter((d) => d.type === "required");

  const complexityScore = useMemo(() => {
    let score = 0;
    
    // Infrastructure complexity
    if (config.infra.includes("multi-cloud")) score += 30;
    else if (config.infra.includes("eks") || config.infra.includes("aks") || config.infra.includes("gke")) score += 20;
    else score += 10;

    // Deployment complexity
    if (config.deploy === "gitops-argocd") score += 25;
    else if (config.deploy === "canary" || config.deploy === "blue-green") score += 20;
    else score += 10;

    // Environment complexity
    const envCount = config.envs.split(",").length;
    score += envCount * 5;

    // Observability complexity
    if (config.observability === "jaeger-prometheus" || config.observability === "elk-stack") score += 20;
    else score += 10;

    // Security complexity
    if (config.security.includes("compliance")) score += 15;
    else score += 5;

    return Math.min(score, 100);
  }, [config]);

  const getComplexityLevel = (score: number) => {
    if (score < 40) return { label: "Simple", color: "text-green-500", bg: "bg-green-500/10" };
    if (score < 70) return { label: "Moderate", color: "text-amber-500", bg: "bg-amber-500/10" };
    return { label: "Complex", color: "text-red-500", bg: "bg-red-500/10" };
  };

  const complexity = getComplexityLevel(complexityScore);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Network className="h-6 w-6 text-primary" />
          Advanced Configuration Builder
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Analyze dependencies, detect conflicts, and optimize your configuration
        </p>
      </div>

      {/* Complexity Score */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Configuration Complexity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Complexity Score</span>
                <Badge className={`${complexity.bg} ${complexity.color} border-0`}>
                  {complexity.label}
                </Badge>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    complexityScore < 40 ? "bg-green-500" : complexityScore < 70 ? "bg-amber-500" : "bg-red-500"
                  }`}
                  style={{ width: `${complexityScore}%` }}
                />
              </div>
            </div>
            <div className="text-3xl font-bold">{complexityScore}</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="rounded-lg border bg-card p-3">
              <div className="flex items-center gap-2 mb-1">
                <Layers className="h-3 w-3 text-purple-500" />
                <span className="font-medium">Infrastructure</span>
              </div>
              <p className="text-muted-foreground truncate">{config.infra}</p>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-3 w-3 text-cyan-500" />
                <span className="font-medium">Deployment</span>
              </div>
              <p className="text-muted-foreground truncate">{config.deploy}</p>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <div className="flex items-center gap-2 mb-1">
                <Cpu className="h-3 w-3 text-green-500" />
                <span className="font-medium">Environments</span>
              </div>
              <p className="text-muted-foreground truncate">{config.envs.split(",").length} env(s)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conflicts */}
      {conflicts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-2">Configuration Conflicts Detected</div>
            <ul className="space-y-1 text-sm">
              {conflicts.map((conflict, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  <span>
                    <strong>{conflict.from}</strong> conflicts with <strong>{conflict.to}</strong>: {conflict.reason}
                  </span>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Dependencies & Recommendations */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Requirements */}
        {requirements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                Required Dependencies
              </CardTitle>
              <CardDescription className="text-xs">
                These dependencies must be satisfied
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {requirements.map((req, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs p-2 rounded-lg bg-blue-500/5 border border-blue-500/20">
                    <CheckCircle2 className="h-3 w-3 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium">{req.from} → {req.to}</div>
                      <div className="text-muted-foreground">{req.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Info className="h-4 w-4 text-amber-500" />
                Recommendations
              </CardTitle>
              <CardDescription className="text-xs">
                Consider these optimizations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs p-2 rounded-lg bg-amber-500/5 border border-amber-500/20">
                    <Info className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium">{rec.from} → {rec.to}</div>
                      <div className="text-muted-foreground">{rec.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dependency Graph Visualization */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Network className="h-4 w-4" />
                Dependency Graph
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Visual representation of component relationships
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDependencies(!showDependencies)}
            >
              {showDependencies ? "Hide" : "Show"}
            </Button>
          </div>
        </CardHeader>
        {showDependencies && (
          <CardContent>
            <div className="space-y-3">
              {/* Configuration Flow */}
              <div className="flex flex-wrap items-center gap-2 justify-center p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <GitBranch className="h-4 w-4 text-blue-500" />
                  <span className="text-xs font-medium">{config.ci}</span>
                </div>
                <span className="text-muted-foreground">→</span>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <Layers className="h-4 w-4 text-purple-500" />
                  <span className="text-xs font-medium">{config.infra}</span>
                </div>
                <span className="text-muted-foreground">→</span>
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
            </div>
          </CardContent>
        )}
      </Card>

      {/* Summary */}
      {conflicts.length === 0 && (
        <Alert>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-sm">
            <strong className="text-green-500">Configuration Valid!</strong> No conflicts detected. Your configuration is ready to generate.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
