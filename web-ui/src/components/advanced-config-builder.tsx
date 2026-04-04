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
  Settings,
  DollarSign,
  BarChart3,
  Clock,
  Users,
  ArrowRight,
  Wrench,
  AlertCircle,
  Lightbulb,
  Download,
  Rocket,
} from "lucide-react";

interface Dependency {
  from: string;
  to: string;
  type: "required" | "recommended" | "conflict" | "warning";
  reason: string;
  fix?: string;
  impact?: "low" | "medium" | "high";
}

interface ConfigBuilderProps {
  config: ProjectConfig;
  onConfigChange?: (config: ProjectConfig) => void;
}

interface ComplexityMetrics {
  score: number;
  level: "Simple" | "Moderate" | "Complex" | "Expert";
  color: string;
  bgColor: string;
  estimatedTime: string;
  teamSize: string;
  monthlyCost: string;
}

export function AdvancedConfigBuilder({ config, onConfigChange }: ConfigBuilderProps) {
  const [showDependencies, setShowDependencies] = useState(true);
  const [showOptimizations, setShowOptimizations] = useState(false);

  const dependencies = useMemo<Dependency[]>(() => {
    const deps: Dependency[] = [];

    // Infrastructure dependencies
    if (config.infra.includes("eks") || config.infra.includes("aks") || config.infra.includes("gke")) {
      deps.push({
        from: config.infra,
        to: "kubernetes",
        type: "required",
        reason: "Managed Kubernetes requires K8s deployment strategy",
        impact: "high",
        fix: "Switch to kubernetes deployment or choose non-K8s infrastructure"
      });
    }

    // Deployment strategy dependencies
    if (config.deploy === "helm-charts" || config.deploy === "kustomize" || config.deploy === "gitops-argocd") {
      if (!config.infra.includes("eks") && !config.infra.includes("aks") && !config.infra.includes("gke") && !config.infra.includes("kubernetes")) {
        deps.push({
          from: config.deploy,
          to: config.infra,
          type: "conflict",
          reason: "Kubernetes deployment strategy requires Kubernetes infrastructure",
          impact: "high",
          fix: "Choose AWS EKS, Azure AKS, GCP GKE, or Kubernetes on-prem"
        });
      }
    }

    // Serverless conflicts
    if (config.deploy === "serverless-lambda") {
      if (!config.infra.includes("ecs-fargate") && !config.infra.includes("aws")) {
        deps.push({
          from: config.deploy,
          to: config.infra,
          type: "conflict",
          reason: "AWS Lambda requires AWS infrastructure",
          impact: "high",
          fix: "Switch to AWS EKS Fargate or other AWS infrastructure"
        });
      }
    }

    // Observability recommendations
    if (config.infra.includes("aws") && !config.observability.includes("cloudwatch")) {
      deps.push({
        from: config.infra,
        to: "cloudwatch",
        type: "recommended",
        reason: "AWS CloudWatch is recommended for AWS infrastructure",
        impact: "medium",
        fix: "Consider using CloudWatch for better AWS integration"
      });
    }

    if (config.infra.includes("azure") && !config.observability.includes("azure-monitor")) {
      deps.push({
        from: config.infra,
        to: "azure-monitor",
        type: "recommended",
        reason: "Azure Monitor is recommended for Azure infrastructure",
        impact: "medium"
      });
    }

    if (config.infra.includes("gcp") && !config.observability.includes("cloud-monitoring")) {
      deps.push({
        from: config.infra,
        to: "cloud-monitoring",
        type: "recommended",
        reason: "Google Cloud Monitoring is recommended for GCP infrastructure",
        impact: "medium"
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
          impact: "medium"
        });
      }

      if (config.ci === "none") {
        deps.push({
          from: config.envs,
          to: config.ci,
          type: "warning",
          reason: "Multi-environment setup benefits from automated CI/CD",
          impact: "high",
          fix: "Consider adding GitHub Actions, GitLab CI, or Jenkins"
        });
      }
    }

    // Security compliance requirements
    if (config.security.includes("soc2") || config.security.includes("hipaa") || config.security.includes("gdpr")) {
      if (!config.observability) {
        deps.push({
          from: config.security,
          to: "observability",
          type: "required",
          reason: "Compliance frameworks require comprehensive observability",
          impact: "high",
          fix: "Add Prometheus/Grafana, ELK stack, or Datadog"
        });
      }

      if (config.deploy === "rolling") {
        deps.push({
          from: config.security,
          to: config.deploy,
          type: "warning",
          reason: "Compliance frameworks benefit from safer deployment strategies",
          impact: "medium",
          fix: "Consider blue-green or canary deployment"
        });
      }
    }

    // Pipeline framework dependencies
    if (config.pipeline === "kubernetes-operator") {
      if (!config.infra.includes("kubernetes") && !config.infra.includes("eks") && !config.infra.includes("aks") && !config.infra.includes("gke")) {
        deps.push({
          from: config.pipeline,
          to: config.infra,
          type: "conflict",
          reason: "Kubernetes operator pipeline requires Kubernetes infrastructure",
          impact: "high",
          fix: "Choose Kubernetes-based infrastructure"
        });
      }
    }

    if (config.pipeline === "terraform-module" && !config.infra.includes("terraform")) {
      deps.push({
        from: config.pipeline,
        to: config.infra,
        type: "recommended",
        reason: "Terraform module pipeline works best with Terraform infrastructure",
        impact: "medium",
        fix: "Consider Terraform multi-cloud infrastructure"
      });
    }

    // CI/CD platform recommendations
    if (config.infra.includes("aws") && config.ci === "github-actions") {
      deps.push({
        from: config.infra,
        to: config.ci,
        type: "recommended",
        reason: "GitHub Actions integrates well with AWS via OIDC",
        impact: "low"
      });
    }

    if (config.infra.includes("azure") && config.ci === "azure-pipelines") {
      deps.push({
        from: config.infra,
        to: config.ci,
        type: "recommended",
        reason: "Azure Pipelines provides native Azure integration",
        impact: "low"
      });
    }

    // Performance recommendations
    if (config.pipeline === "microservice" && config.deploy === "rolling") {
      deps.push({
        from: config.pipeline,
        to: config.deploy,
        type: "warning",
        reason: "Microservices benefit from advanced deployment strategies",
        impact: "medium",
        fix: "Consider blue-green, canary, or GitOps deployment"
      });
    }

    return deps;
  }, [config]);

  const conflicts = dependencies.filter((d) => d.type === "conflict");
  const warnings = dependencies.filter((d) => d.type === "warning");
  const recommendations = dependencies.filter((d) => d.type === "recommended");
  const requirements = dependencies.filter((d) => d.type === "required");

  const complexityMetrics = useMemo<ComplexityMetrics>(() => {
    let score = 0;
    
    // Infrastructure complexity
    if (config.infra.includes("terraform-multi-cloud")) score += 35;
    else if (config.infra.includes("eks") || config.infra.includes("aks") || config.infra.includes("gke")) score += 25;
    else if (config.infra.includes("kubernetes")) score += 20;
    else if (config.infra.includes("ecs-fargate")) score += 15;
    else score += 10;

    // Deployment complexity
    if (config.deploy === "gitops-argocd") score += 30;
    else if (config.deploy === "blue-green" || config.deploy === "canary") score += 25;
    else if (config.deploy === "helm-charts" || config.deploy === "kustomize") score += 20;
    else if (config.deploy === "serverless-lambda") score += 15;
    else score += 10;

    // Environment complexity
    const envCount = config.envs.split(",").length;
    score += envCount * 8;

    // Pipeline complexity
    if (config.pipeline === "kubernetes-operator") score += 25;
    else if (config.pipeline === "terraform-module") score += 20;
    else if (config.pipeline === "microservice") score += 20;
    else if (config.pipeline === "docker-multi-stage") score += 15;
    else score += 10;

    // Observability complexity
    if (config.observability === "jaeger-prometheus" || config.observability === "elk-stack") score += 20;
    else if (config.observability === "datadog") score += 15;
    else score += 10;

    // Security complexity
    if (config.security.includes("soc2") || config.security.includes("hipaa")) score += 25;
    else if (config.security === "zero-trust" || config.security === "nist-csf") score += 20;
    else score += 10;

    // CI/CD complexity
    if (config.ci === "jenkins") score += 15;
    else if (config.ci === "gitlab-ci" || config.ci === "azure-pipelines") score += 12;
    else score += 8;

    score = Math.min(score, 100);

    let level: "Simple" | "Moderate" | "Complex" | "Expert";
    let color: string;
    let bgColor: string;
    let estimatedTime: string;
    let teamSize: string;
    let monthlyCost: string;

    if (score < 30) {
      level = "Simple";
      color = "text-green-500";
      bgColor = "bg-green-500/10";
      estimatedTime = "1-2 weeks";
      teamSize = "1-2 developers";
      monthlyCost = "$100-500";
    } else if (score < 50) {
      level = "Moderate";
      color = "text-amber-500";
      bgColor = "bg-amber-500/10";
      estimatedTime = "2-4 weeks";
      teamSize = "2-4 developers";
      monthlyCost = "$500-2,000";
    } else if (score < 75) {
      level = "Complex";
      color = "text-orange-500";
      bgColor = "bg-orange-500/10";
      estimatedTime = "1-2 months";
      teamSize = "4-8 developers";
      monthlyCost = "$2,000-10,000";
    } else {
      level = "Expert";
      color = "text-red-500";
      bgColor = "bg-red-500/10";
      estimatedTime = "2-4 months";
      teamSize = "8+ developers";
      monthlyCost = "$10,000+";
    }

    return {
      score,
      level,
      color,
      bgColor,
      estimatedTime,
      teamSize,
      monthlyCost
    };
  }, [config]);

  const optimizations = useMemo(() => {
    const opts = [];

    // Cost optimizations
    if (config.infra.includes("eks") && config.envs === "single") {
      opts.push({
        type: "cost",
        title: "Downgrade to EKS Fargate",
        description: "For single environment, EKS Fargate is more cost-effective",
        savings: "~40%",
        difficulty: "Easy"
      });
    }

    if (config.observability === "datadog" && config.infra.includes("aws")) {
      opts.push({
        type: "cost",
        title: "Switch to CloudWatch",
        description: "CloudWatch is included with AWS infrastructure",
        savings: "~30%",
        difficulty: "Easy"
      });
    }

    // Performance optimizations
    if (config.deploy === "rolling" && config.envs === "dev,stage,prod") {
      opts.push({
        type: "performance",
        title: "Upgrade to Blue-Green",
        description: "Zero-downtime deployments for production",
        savings: "~50% faster deployments",
        difficulty: "Medium"
      });
    }

    // Security optimizations
    if (!config.security.includes("nist") && !config.security.includes("zero-trust") && !config.security.includes("cis") && config.envs === "dev,stage,prod") {
      opts.push({
        type: "security",
        title: "Add NIST CSF",
        description: "Essential security for multi-environment setups",
        savings: "Reduced risk",
        difficulty: "Medium"
      });
    }

    return opts;
  }, [config]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Advanced Configuration Builder
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Analyze dependencies, detect conflicts, and optimize your configuration
        </p>
      </div>

      {/* Complexity Score & Metrics */}
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
                <Badge className={`${complexityMetrics.bgColor} ${complexityMetrics.color} border-0`}>
                  {complexityMetrics.level}
                </Badge>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    complexityMetrics.score < 30 ? "bg-green-500" : 
                    complexityMetrics.score < 50 ? "bg-amber-500" : 
                    complexityMetrics.score < 75 ? "bg-orange-500" : "bg-red-500"
                  }`}
                  style={{ width: `${complexityMetrics.score}%` }}
                />
              </div>
            </div>
            <div className="text-3xl font-bold">{complexityMetrics.score}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="rounded-lg border bg-card p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-3 w-3 text-blue-500" />
                <span className="font-medium">Setup Time</span>
              </div>
              <p className="text-muted-foreground">{complexityMetrics.estimatedTime}</p>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-3 w-3 text-green-500" />
                <span className="font-medium">Team Size</span>
              </div>
              <p className="text-muted-foreground">{complexityMetrics.teamSize}</p>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-3 w-3 text-amber-500" />
                <span className="font-medium">Est. Monthly</span>
              </div>
              <p className="text-muted-foreground">{complexityMetrics.monthlyCost}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
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
            <div className="rounded-lg border bg-card p-3">
              <div className="flex items-center gap-2 mb-1">
                <GitBranch className="h-3 w-3 text-red-500" />
                <span className="font-medium">CI/CD</span>
              </div>
              <p className="text-muted-foreground truncate">{config.ci}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Conflicts */}
      {conflicts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-2">🚨 Critical Conflicts Detected</div>
            <ul className="space-y-2 text-sm">
              {conflicts.map((conflict, idx) => (
                <li key={idx} className="flex flex-col gap-1">
                  <div className="flex items-start gap-2">
                    <span className="text-destructive">•</span>
                    <span>
                      <strong>{conflict.from}</strong> conflicts with <strong>{conflict.to}</strong>
                    </span>
                  </div>
                  <div className="text-muted-foreground text-xs ml-4">{conflict.reason}</div>
                  {conflict.fix && (
                    <div className="ml-4 mt-1 p-2 bg-destructive/10 rounded border border-destructive/20">
                      <div className="flex items-center gap-1 text-xs">
                        <Wrench className="h-3 w-3" />
                        <span className="font-medium">Fix:</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{conflict.fix}</div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-2">⚠️ Warnings</div>
            <ul className="space-y-2 text-sm">
              {warnings.map((warning, idx) => (
                <li key={idx} className="flex flex-col gap-1">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-500">•</span>
                    <span>
                      <strong>{warning.from}</strong> → <strong>{warning.to}</strong>
                    </span>
                  </div>
                  <div className="text-muted-foreground text-xs ml-4">{warning.reason}</div>
                  {warning.fix && (
                    <div className="ml-4 mt-1 p-2 bg-amber-500/10 rounded border border-amber-500/20">
                      <div className="flex items-center gap-1 text-xs">
                        <Lightbulb className="h-3 w-3" />
                        <span className="font-medium">Suggestion:</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{warning.fix}</div>
                    </div>
                  )}
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
                      {req.impact && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          Impact: {req.impact}
                        </Badge>
                      )}
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
                      {rec.impact && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          Impact: {rec.impact}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Optimizations */}
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOptimizations(!showOptimizations)}
              >
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
                        <Badge variant="outline" className="text-xs">
                          {opt.type}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {opt.difficulty}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{opt.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium text-green-600">{opt.savings}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Dependency Graph Visualization */}
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
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Cpu className="h-4 w-4 text-green-500" />
                  <span className="text-xs font-medium">{config.envs}</span>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Summary */}
      {conflicts.length === 0 && warnings.length === 0 && (
        <Alert>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-sm">
            <strong className="text-green-500">✅ Configuration Valid!</strong> No conflicts detected. Your configuration is ready to generate.
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
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
