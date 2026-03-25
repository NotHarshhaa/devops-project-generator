"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProjectConfig } from "@/lib/types";
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Lightbulb,
  Server,
  Cloud,
  Zap,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface CostEstimate {
  component: string;
  monthlyCost: number;
  category: "infrastructure" | "observability" | "ci-cd" | "security";
  icon: React.ElementType;
}

interface CostOptimization {
  title: string;
  description: string;
  savings: number;
  difficulty: "easy" | "medium" | "hard";
  impact: "low" | "medium" | "high";
}

interface CostOptimizerProps {
  config: ProjectConfig;
}

export function CostOptimizer({ config }: CostOptimizerProps) {
  const costEstimates = useMemo<CostEstimate[]>(() => {
    const estimates: CostEstimate[] = [];

    // Infrastructure costs
    if (config.infra.includes("eks")) {
      estimates.push({ component: "AWS EKS Cluster", monthlyCost: 73, category: "infrastructure", icon: Cloud });
      estimates.push({ component: "EC2 Worker Nodes (3x t3.medium)", monthlyCost: 100, category: "infrastructure", icon: Server });
    } else if (config.infra.includes("aks")) {
      estimates.push({ component: "Azure AKS Cluster", monthlyCost: 0, category: "infrastructure", icon: Cloud });
      estimates.push({ component: "VM Worker Nodes (3x Standard_B2s)", monthlyCost: 90, category: "infrastructure", icon: Server });
    } else if (config.infra.includes("gke")) {
      estimates.push({ component: "GCP GKE Cluster", monthlyCost: 74, category: "infrastructure", icon: Cloud });
      estimates.push({ component: "GCE Worker Nodes (3x e2-medium)", monthlyCost: 95, category: "infrastructure", icon: Server });
    } else if (config.infra.includes("ecs-fargate")) {
      estimates.push({ component: "AWS ECS Fargate", monthlyCost: 120, category: "infrastructure", icon: Cloud });
    } else if (config.infra.includes("multi-cloud")) {
      estimates.push({ component: "Multi-Cloud Infrastructure", monthlyCost: 250, category: "infrastructure", icon: Cloud });
    } else {
      estimates.push({ component: "Basic Infrastructure", monthlyCost: 50, category: "infrastructure", icon: Server });
    }

    // Observability costs
    if (config.observability === "prometheus-grafana") {
      estimates.push({ component: "Prometheus + Grafana (self-hosted)", monthlyCost: 30, category: "observability", icon: Zap });
    } else if (config.observability === "elk-stack") {
      estimates.push({ component: "ELK Stack (self-hosted)", monthlyCost: 80, category: "observability", icon: Zap });
    } else if (config.observability === "datadog") {
      estimates.push({ component: "DataDog (15 hosts)", monthlyCost: 225, category: "observability", icon: Zap });
    } else if (config.observability === "new-relic") {
      estimates.push({ component: "New Relic", monthlyCost: 199, category: "observability", icon: Zap });
    } else if (config.observability === "cloudwatch") {
      estimates.push({ component: "AWS CloudWatch", monthlyCost: 40, category: "observability", icon: Zap });
    } else if (config.observability === "jaeger-prometheus") {
      estimates.push({ component: "Jaeger + Prometheus", monthlyCost: 45, category: "observability", icon: Zap });
    }

    // CI/CD costs
    if (config.ci === "github-actions") {
      estimates.push({ component: "GitHub Actions (Team)", monthlyCost: 21, category: "ci-cd", icon: Zap });
    } else if (config.ci === "gitlab-ci") {
      estimates.push({ component: "GitLab CI (Premium)", monthlyCost: 29, category: "ci-cd", icon: Zap });
    } else if (config.ci === "jenkins") {
      estimates.push({ component: "Jenkins (self-hosted)", monthlyCost: 50, category: "ci-cd", icon: Server });
    } else if (config.ci === "circleci") {
      estimates.push({ component: "CircleCI (Performance)", monthlyCost: 70, category: "ci-cd", icon: Zap });
    } else if (config.ci === "azure-pipelines") {
      estimates.push({ component: "Azure Pipelines", monthlyCost: 40, category: "ci-cd", icon: Zap });
    }

    // Security costs
    if (config.security.includes("compliance")) {
      estimates.push({ component: "Compliance Monitoring Tools", monthlyCost: 150, category: "security", icon: Zap });
    } else {
      estimates.push({ component: "Basic Security Scanning", monthlyCost: 30, category: "security", icon: Zap });
    }

    // Environment multiplier
    const envCount = config.envs.split(",").length;
    if (envCount > 1) {
      const infraCosts = estimates.filter(e => e.category === "infrastructure");
      const additionalCost = infraCosts.reduce((sum, e) => sum + e.monthlyCost, 0) * (envCount - 1) * 0.7;
      estimates.push({ 
        component: `Additional Environments (${envCount - 1})`, 
        monthlyCost: additionalCost, 
        category: "infrastructure", 
        icon: Server 
      });
    }

    return estimates;
  }, [config]);

  const optimizations = useMemo<CostOptimization[]>(() => {
    const opts: CostOptimization[] = [];

    // Infrastructure optimizations
    if (config.infra.includes("eks") || config.infra.includes("aks") || config.infra.includes("gke")) {
      opts.push({
        title: "Use Spot/Preemptible Instances",
        description: "Switch worker nodes to spot instances for non-production workloads to save up to 70%",
        savings: 70,
        difficulty: "easy",
        impact: "high",
      });

      opts.push({
        title: "Enable Cluster Autoscaling",
        description: "Automatically scale down nodes during off-peak hours",
        savings: 30,
        difficulty: "easy",
        impact: "medium",
      });
    }

    // Observability optimizations
    if (config.observability === "datadog" || config.observability === "new-relic") {
      opts.push({
        title: "Switch to Self-Hosted Monitoring",
        description: "Use Prometheus + Grafana instead of managed services",
        savings: 180,
        difficulty: "medium",
        impact: "high",
      });
    }

    if (config.observability === "elk-stack") {
      opts.push({
        title: "Optimize Log Retention",
        description: "Reduce log retention period from 30 to 7 days for non-critical logs",
        savings: 25,
        difficulty: "easy",
        impact: "low",
      });
    }

    // Multi-environment optimizations
    const envCount = config.envs.split(",").length;
    if (envCount > 2) {
      opts.push({
        title: "Share Non-Production Infrastructure",
        description: "Combine dev and staging environments to reduce infrastructure costs",
        savings: 100,
        difficulty: "medium",
        impact: "medium",
      });
    }

    // CI/CD optimizations
    if (config.ci === "circleci" || config.ci === "azure-pipelines") {
      opts.push({
        title: "Optimize CI/CD Pipeline",
        description: "Use caching and parallel jobs to reduce build minutes",
        savings: 20,
        difficulty: "easy",
        impact: "low",
      });
    }

    // Security optimizations
    if (config.security.includes("compliance")) {
      opts.push({
        title: "Consolidate Security Tools",
        description: "Use integrated security platforms instead of multiple point solutions",
        savings: 50,
        difficulty: "hard",
        impact: "medium",
      });
    }

    // General optimizations
    opts.push({
      title: "Reserved Instances / Savings Plans",
      description: "Commit to 1-year reserved capacity for predictable workloads",
      savings: 40,
      difficulty: "easy",
      impact: "high",
    });

    return opts;
  }, [config]);

  const totalMonthlyCost = costEstimates.reduce((sum, e) => sum + e.monthlyCost, 0);
  const totalPotentialSavings = optimizations.reduce((sum, o) => sum + o.savings, 0);
  const optimizedCost = totalMonthlyCost - totalPotentialSavings;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "infrastructure": return "text-purple-500";
      case "observability": return "text-amber-500";
      case "ci-cd": return "text-blue-500";
      case "security": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return <Badge className="bg-green-500/10 text-green-500 border-0">Easy</Badge>;
      case "medium": return <Badge className="bg-amber-500/10 text-amber-500 border-0">Medium</Badge>;
      case "hard": return <Badge className="bg-red-500/10 text-red-500 border-0">Hard</Badge>;
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "low": return <Badge variant="outline" className="text-xs">Low Impact</Badge>;
      case "medium": return <Badge variant="outline" className="text-xs">Medium Impact</Badge>;
      case "high": return <Badge variant="outline" className="text-xs">High Impact</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-primary" />
          Cost Optimization Advisor
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Estimated monthly costs and optimization recommendations
        </p>
      </div>

      {/* Cost Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Current Estimate</CardDescription>
            <CardTitle className="text-3xl font-bold flex items-center gap-2">
              ${totalMonthlyCost.toFixed(0)}
              <span className="text-sm font-normal text-muted-foreground">/mo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              Based on your configuration
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Potential Savings</CardDescription>
            <CardTitle className="text-3xl font-bold flex items-center gap-2 text-green-500">
              ${totalPotentialSavings.toFixed(0)}
              <span className="text-sm font-normal text-muted-foreground">/mo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-green-500">
              <TrendingDown className="h-3 w-3" />
              {((totalPotentialSavings / totalMonthlyCost) * 100).toFixed(0)}% reduction possible
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Optimized Cost</CardDescription>
            <CardTitle className="text-3xl font-bold flex items-center gap-2">
              ${optimizedCost.toFixed(0)}
              <span className="text-sm font-normal text-muted-foreground">/mo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-primary">
              <Zap className="h-3 w-3" />
              After optimizations
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cost Breakdown</CardTitle>
          <CardDescription className="text-xs">
            Estimated monthly costs by component
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {costEstimates.map((estimate, idx) => {
              const Icon = estimate.icon;
              const percentage = (estimate.monthlyCost / totalMonthlyCost) * 100;
              
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${getCategoryColor(estimate.category)}`} />
                      <span className="font-medium">{estimate.component}</span>
                      <Badge variant="outline" className="text-[10px] px-1.5">
                        {estimate.category}
                      </Badge>
                    </div>
                    <span className="font-semibold">${estimate.monthlyCost.toFixed(0)}/mo</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        estimate.category === "infrastructure" ? "bg-purple-500" :
                        estimate.category === "observability" ? "bg-amber-500" :
                        estimate.category === "ci-cd" ? "bg-blue-500" : "bg-red-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            Optimization Recommendations
          </CardTitle>
          <CardDescription className="text-xs">
            {optimizations.length} ways to reduce your monthly costs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {optimizations.map((opt, idx) => (
              <div key={idx} className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{opt.title}</h4>
                      {getDifficultyBadge(opt.difficulty)}
                    </div>
                    <p className="text-xs text-muted-foreground">{opt.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-bold text-green-500">-${opt.savings}</div>
                    <div className="text-[10px] text-muted-foreground">per month</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  {getImpactBadge(opt.impact)}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ArrowRight className="h-3 w-3" />
                    <span>Learn more</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Note:</strong> These are estimated costs based on typical usage patterns. Actual costs may vary depending on your specific usage, region, and pricing changes. Always consult official pricing calculators for accurate estimates.
        </AlertDescription>
      </Alert>
    </div>
  );
}
