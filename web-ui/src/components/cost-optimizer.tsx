"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ProjectConfig } from "@/lib/types";
import {
  TrendingDown,
  TrendingUp,
  Lightbulb,
  Server,
  Cloud,
  Zap,
  AlertCircle,
  ArrowRight,
  Calculator,
  PieChart,
  Activity,
  Shield,
  GitBranch,
  Database,
  Globe,
  Clock,
  Users,
  BarChart3,
  Target,
  Wrench,
} from "lucide-react";

interface CostEstimate {
  component: string;
  monthlyCost: number;
  category: "infrastructure" | "observability" | "ci-cd" | "security" | "storage" | "network";
  icon: React.ElementType;
  description: string;
  variables: string[];
}

interface CostOptimization {
  title: string;
  description: string;
  savings: number;
  difficulty: "easy" | "medium" | "hard";
  impact: "low" | "medium" | "high";
  roi: string;
  implementation: string;
  risk: "low" | "medium" | "high";
}

interface RegionalPricing {
  region: string;
  multiplier: number;
}

interface CostOptimizerProps {
  config: ProjectConfig;
}

export function CostOptimizer({ config }: CostOptimizerProps) {
  
  const regionalPricing: RegionalPricing[] = [
    { region: "us-east-1", multiplier: 1.0 },
    { region: "us-west-2", multiplier: 1.05 },
    { region: "eu-west-1", multiplier: 1.15 },
    { region: "ap-southeast-1", multiplier: 0.85 },
    { region: "ap-northeast-1", multiplier: 1.25 },
  ];

  const costEstimates = useMemo<CostEstimate[]>(() => {
    const estimates: CostEstimate[] = [];
    const baseRegion = "us-east-1"; // Default region
    const regionMultiplier = 1.0;

    // Infrastructure costs with realistic 2024 pricing
    if (config.infra.includes("eks")) {
      estimates.push({ 
        component: "AWS EKS Control Plane", 
        monthlyCost: 144 * regionMultiplier, 
        category: "infrastructure", 
        icon: Cloud,
        description: "EKS cluster management fee",
        variables: ["cluster_size", "region"]
      });
      estimates.push({ 
        component: "EKS Worker Nodes (3x t3.large)", 
        monthlyCost: 3 * 60 * regionMultiplier, 
        category: "infrastructure", 
        icon: Server,
        description: "Compute instances for workloads",
        variables: ["instance_type", "instance_count", "utilization"]
      });
      estimates.push({ 
        component: "EKS Add-ons (CoreDNS, kube-proxy)", 
        monthlyCost: 30 * regionMultiplier, 
        category: "infrastructure", 
        icon: Zap,
        description: "Managed Kubernetes add-ons",
        variables: ["add_ons"]
      });
    } else if (config.infra.includes("aks")) {
      estimates.push({ 
        component: "Azure AKS Cluster", 
        monthlyCost: 72 * regionMultiplier, 
        category: "infrastructure", 
        icon: Cloud,
        description: "AKS cluster management fee",
        variables: ["cluster_size", "region"]
      });
      estimates.push({ 
        component: "AKS Worker Nodes (3x Standard_B2s)", 
        monthlyCost: 3 * 55 * regionMultiplier, 
        category: "infrastructure", 
        icon: Server,
        description: "Azure VM instances",
        variables: ["vm_size", "instance_count", "utilization"]
      });
    } else if (config.infra.includes("gke")) {
      estimates.push({ 
        component: "GCP GKE Cluster", 
        monthlyCost: 74 * regionMultiplier, 
        category: "infrastructure", 
        icon: Cloud,
        description: "GKE cluster management fee",
        variables: ["cluster_size", "region"]
      });
      estimates.push({ 
        component: "GKE Worker Nodes (3x e2-medium)", 
        monthlyCost: 3 * 48 * regionMultiplier, 
        category: "infrastructure", 
        icon: Server,
        description: "GCE instances for workloads",
        variables: ["machine_type", "instance_count", "utilization"]
      });
    } else if (config.infra.includes("ecs-fargate")) {
      estimates.push({ 
        component: "AWS ECS Fargate", 
        monthlyCost: 120 * regionMultiplier, 
        category: "infrastructure", 
        icon: Cloud,
        description: "Serverless container compute",
        variables: ["vcpu_hours", "memory_gb", "tasks"]
      });
    } else if (config.infra.includes("terraform-multi-cloud")) {
      estimates.push({ 
        component: "Multi-Cloud Infrastructure", 
        monthlyCost: 350 * regionMultiplier, 
        category: "infrastructure", 
        icon: Cloud,
        description: "Multiple cloud provider resources",
        variables: ["providers", "resource_count", "complexity"]
      });
    } else if (config.infra.includes("kubernetes-on-prem")) {
      estimates.push({ 
        component: "On-Premises Kubernetes", 
        monthlyCost: 800 * regionMultiplier, 
        category: "infrastructure", 
        icon: Server,
        description: "Hardware, maintenance, and operations",
        variables: ["hardware_cost", "maintenance", "staffing"]
      });
    } else {
      estimates.push({ 
        component: "Basic Infrastructure", 
        monthlyCost: 150 * regionMultiplier, 
        category: "infrastructure", 
        icon: Server,
        description: "Minimal infrastructure setup",
        variables: ["server_count", "basic_services"]
      });
    }

    // Observability costs with 2024 pricing
    if (config.observability === "prometheus-grafana") {
      estimates.push({ 
        component: "Prometheus + Grafana (self-hosted)", 
        monthlyCost: 85 * regionMultiplier, 
        category: "observability", 
        icon: Zap,
        description: "Self-hosted monitoring stack",
        variables: ["storage_size", "retention_period", "alert_rules"]
      });
    } else if (config.observability === "elk-stack") {
      estimates.push({ 
        component: "ELK Stack (self-hosted)", 
        monthlyCost: 120 * regionMultiplier, 
        category: "observability", 
        icon: Database,
        description: "Elasticsearch, Logstash, Kibana",
        variables: ["storage_size", "data_nodes", "ingest_volume"]
      });
    } else if (config.observability === "datadog") {
      estimates.push({ 
        component: "DataDog (15 hosts + APM)", 
        monthlyCost: 435 * regionMultiplier, 
        category: "observability", 
        icon: Activity,
        description: "Infrastructure monitoring + APM",
        variables: ["host_count", "custom_metrics", "trace_volume"]
      });
    } else if (config.observability === "new-relic") {
      estimates.push({ 
        component: "New Relic (Pro tier)", 
        monthlyCost: 399 * regionMultiplier, 
        category: "observability", 
        icon: Activity,
        description: "Full-stack observability platform",
        variables: ["users", "data_retention", "features"]
      });
    } else if (config.observability === "cloudwatch") {
      estimates.push({ 
        component: "AWS CloudWatch", 
        monthlyCost: 65 * regionMultiplier, 
        category: "observability", 
        icon: Zap,
        description: "AWS native monitoring",
        variables: ["metrics", "logs", "alarms", "dashboards"]
      });
    } else if (config.observability === "jaeger-prometheus") {
      estimates.push({ 
        component: "Jaeger + Prometheus", 
        monthlyCost: 110 * regionMultiplier, 
        category: "observability", 
        icon: Activity,
        description: "Distributed tracing + metrics",
        variables: ["trace_volume", "storage", "sampling_rate"]
      });
    }

    // CI/CD costs with current pricing
    if (config.ci === "github-actions") {
      estimates.push({ 
        component: "GitHub Actions (Team)", 
        monthlyCost: 42 * regionMultiplier, 
        category: "ci-cd", 
        icon: GitBranch,
        description: "GitHub Actions Team plan",
        variables: ["build_minutes", "storage", "runners"]
      });
    } else if (config.ci === "gitlab-ci") {
      estimates.push({ 
        component: "GitLab CI (Premium)", 
        monthlyCost: 58 * regionMultiplier, 
        category: "ci-cd", 
        icon: GitBranch,
        description: "GitLab Premium CI/CD",
        variables: ["build_minutes", "runners", "storage"]
      });
    } else if (config.ci === "jenkins") {
      estimates.push({ 
        component: "Jenkins (self-hosted)", 
        monthlyCost: 150 * regionMultiplier, 
        category: "ci-cd", 
        icon: Server,
        description: "Self-hosted Jenkins with maintenance",
        variables: ["hardware", "maintenance", "plugins"]
      });
    } else if (config.ci === "azure-pipelines") {
      estimates.push({ 
        component: "Azure Pipelines", 
        monthlyCost: 45 * regionMultiplier, 
        category: "ci-cd", 
        icon: GitBranch,
        description: "Azure DevOps Pipelines",
        variables: ["build_minutes", "parallel_jobs", "agents"]
      });
    }

    // Security costs
    if (config.security.includes("soc2") || config.security.includes("hipaa")) {
      estimates.push({ 
        component: "Advanced Security Suite", 
        monthlyCost: 285 * regionMultiplier, 
        category: "security", 
        icon: Shield,
        description: "Compliance and advanced security tools",
        variables: ["compliance_level", "audit_frequency", "tools"]
      });
    } else if (config.security.includes("nist-csf") || config.security.includes("zero-trust")) {
      estimates.push({ 
        component: "Enterprise Security", 
        monthlyCost: 195 * regionMultiplier, 
        category: "security", 
        icon: Shield,
        description: "NIST CSF and zero-trust implementation",
        variables: ["security_level", "monitoring", "tools"]
      });
    } else if (config.security.includes("cis")) {
      estimates.push({ 
        component: "CIS Benchmarks", 
        monthlyCost: 125 * regionMultiplier, 
        category: "security", 
        icon: Shield,
        description: "CIS security benchmarks and scanning",
        variables: ["benchmark_level", "scan_frequency", "reports"]
      });
    } else {
      estimates.push({ 
        component: "Basic Security", 
        monthlyCost: 45 * regionMultiplier, 
        category: "security", 
        icon: Shield,
        description: "Essential security scanning and monitoring",
        variables: ["scan_frequency", "tools", "coverage"]
      });
    }

    // Storage costs
    const storageCost = 50 * regionMultiplier; // Base storage
    estimates.push({ 
      component: "Storage & Backups", 
      monthlyCost: storageCost, 
      category: "storage", 
      icon: Database,
      description: "Persistent storage and backup solutions",
      variables: ["storage_gb", "backup_retention", "storage_class"]
    });

    // Network costs
    const networkCost = 35 * regionMultiplier; // Base networking
    estimates.push({ 
      component: "Network & Data Transfer", 
      monthlyCost: networkCost, 
      category: "network", 
      icon: Globe,
      description: "Load balancers, data transfer, DNS",
      variables: ["data_transfer_gb", "bandwidth", "connections"]
    });

    // Environment multiplier
    const envCount = config.envs.split(",").length;
    if (envCount > 1) {
      const infraCosts = estimates.filter(e => e.category === "infrastructure");
      const additionalCost = infraCosts.reduce((sum, e) => sum + e.monthlyCost, 0) * (envCount - 1) * 0.6;
      estimates.push({ 
        component: `Additional Environments (${envCount - 1})`, 
        monthlyCost: additionalCost, 
        category: "infrastructure", 
        icon: Server,
        description: "Multi-environment infrastructure costs",
        variables: ["environment_count", "resource_sharing"]
      });
    }

    return estimates;
  }, [config]);

  const optimizations = useMemo<CostOptimization[]>(() => {
    const opts: CostOptimization[] = [];

    // Infrastructure optimizations
    if (config.infra.includes("eks") || config.infra.includes("aks") || config.infra.includes("gke")) {
      opts.push({
        title: "Implement Spot Instances for Non-Prod",
        description: "Use spot instances for development and staging environments. Save up to 90% compared to on-demand pricing while maintaining reliability through diversification.",
        savings: 180,
        difficulty: "medium",
        impact: "high",
        roi: "180% in first year",
        implementation: "Configure spot instance pools with fallback to on-demand",
        risk: "medium"
      });

      opts.push({
        title: "Enable Karpenter Autoscaling",
        description: "Replace cluster autoscaler with Karpenter for faster, more efficient scaling. Reduces over-provisioning by 30-40%.",
        savings: 95,
        difficulty: "medium",
        impact: "high",
        roi: "150% in first year",
        implementation: "Install Karpenter and configure instance types",
        risk: "low"
      });

      opts.push({
        title: "Optimize Node Sizes and Types",
        description: "Right-size instances based on actual utilization patterns. Many clusters over-provision by 40-60%.",
        savings: 120,
        difficulty: "easy",
        impact: "medium",
        roi: "240% in first year",
        implementation: "Analyze metrics and adjust instance types",
        risk: "low"
      });
    }

    // Observability optimizations
    if (config.observability === "datadog" || config.observability === "new-relic") {
      opts.push({
        title: "Hybrid Monitoring Strategy",
        description: "Use self-hosted Prometheus for metrics and keep APM for traces. Reduces costs while maintaining capabilities.",
        savings: 280,
        difficulty: "hard",
        impact: "high",
        roi: "120% in first year",
        implementation: "Deploy Prometheus + Grafana, configure OpenTelemetry",
        risk: "medium"
      });
    }

    if (config.observability === "elk-stack") {
      opts.push({
        title: "Optimize Elasticsearch Storage",
        description: "Implement hot-warm-cold architecture with automated tiering. Reduce storage costs by 60% while maintaining performance.",
        savings: 65,
        difficulty: "medium",
        impact: "medium",
        roi: "130% in first year",
        implementation: "Configure ILM policies and storage tiers",
        risk: "low"
      });
    }

    // Multi-environment optimizations
    const envCount = config.envs.split(",").length;
    if (envCount > 2) {
      opts.push({
        title: "Consolidate Non-Production Environments",
        description: "Share infrastructure between dev and staging using namespaces. Reduces cluster count and management overhead.",
        savings: 150,
        difficulty: "medium",
        impact: "medium",
        roi: "100% in first year",
        implementation: "Use resource quotas and network policies",
        risk: "medium"
      });
    }

    // CI/CD optimizations
    if (config.ci === "github-actions" || config.ci === "gitlab-ci") {
      opts.push({
        title: "Optimize CI/CD Pipeline Caching",
        description: "Implement intelligent caching and dependency management. Reduces build time by 60% and compute costs.",
        savings: 35,
        difficulty: "easy",
        impact: "medium",
        roi: "300% in first year",
        implementation: "Configure cache actions and dependency caching",
        risk: "low"
      });

      opts.push({
        title: "Use Self-Hosted Runners for Compute-Intensive Jobs",
        description: "Deploy self-hosted runners for heavy builds while using cloud runners for quick checks.",
        savings: 85,
        difficulty: "medium",
        impact: "high",
        roi: "170% in first year",
        implementation: "Set up self-hosted runners with auto-scaling",
        risk: "medium"
      });
    }

    // Storage optimizations
    opts.push({
      title: "Implement Storage Lifecycle Policies",
      description: "Automate data tiering and cleanup. Move old data to cheaper storage and delete unnecessary backups.",
      savings: 45,
      difficulty: "easy",
      impact: "medium",
      roi: "200% in first year",
      implementation: "Configure lifecycle policies and retention rules",
      risk: "low"
    });

    // Security optimizations
    if (config.security.includes("soc2") || config.security.includes("hipaa")) {
      opts.push({
        title: "Consolidate Security Tools",
        description: "Replace multiple point solutions with integrated security platform. Reduces tool overlap and licensing costs.",
        savings: 75,
        difficulty: "hard",
        impact: "medium",
        roi: "80% in first year",
        implementation: "Evaluate and migrate to integrated platform",
        risk: "high"
      });
    }

    // General optimizations
    opts.push({
      title: "Implement Reserved Instances/Savings Plans",
      description: "Commit to 1-3 year savings plans for predictable workloads. Save 40-60% compared to on-demand pricing.",
      savings: 140,
      difficulty: "easy",
      impact: "high",
      roi: "400% in first year",
      implementation: "Analyze usage patterns and purchase savings plans",
      risk: "low"
    });

    opts.push({
      title: "Optimize Data Transfer Costs",
      description: "Use CDN, compress data, and optimize network paths. Can reduce data transfer costs by 30-50%.",
      savings: 55,
      difficulty: "medium",
      impact: "medium",
      roi: "150% in first year",
      implementation: "Implement CDN and compression",
      risk: "low"
    });

    return opts;
  }, [config]);

  const totalMonthlyCost = costEstimates.reduce((sum, e) => sum + e.monthlyCost, 0);
  const totalPotentialSavings = optimizations.reduce((sum, o) => sum + o.savings, 0);
  const optimizedCost = Math.max(totalMonthlyCost - totalPotentialSavings, totalMonthlyCost * 0.3); // Min 30% of original

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "infrastructure": return "text-purple-500";
      case "observability": return "text-amber-500";
      case "ci-cd": return "text-blue-500";
      case "security": return "text-red-500";
      case "storage": return "text-green-500";
      case "network": return "text-cyan-500";
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

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low": return <Badge className="bg-green-500/10 text-green-500 border-0 text-xs">Low Risk</Badge>;
      case "medium": return <Badge className="bg-amber-500/10 text-amber-500 border-0 text-xs">Medium Risk</Badge>;
      case "high": return <Badge className="bg-red-500/10 text-red-500 border-0 text-xs">High Risk</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          Cost Optimization Advisor
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Realistic cost estimates and data-driven optimization recommendations
        </p>
      </div>

      {/* Cost Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Current Estimate</CardDescription>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              ${totalMonthlyCost.toFixed(0)}
              <span className="text-sm font-normal text-muted-foreground">/mo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              Based on 2024 pricing
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Potential Savings</CardDescription>
            <CardTitle className="text-2xl font-bold flex items-center gap-2 text-green-500">
              ${totalPotentialSavings.toFixed(0)}
              <span className="text-sm font-normal text-muted-foreground">/mo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-green-500">
              <TrendingDown className="h-3 w-3" />
              {((totalPotentialSavings / totalMonthlyCost) * 100).toFixed(0)}% reduction
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Optimized Cost</CardDescription>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              ${optimizedCost.toFixed(0)}
              <span className="text-sm font-normal text-muted-foreground">/mo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-primary">
              <Target className="h-3 w-3" />
              After optimizations
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Annual Savings</CardDescription>
            <CardTitle className="text-2xl font-bold flex items-center gap-2 text-blue-500">
              ${(totalPotentialSavings * 12).toFixed(0)}
              <span className="text-sm font-normal text-muted-foreground">/yr</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-blue-500">
              <BarChart3 className="h-3 w-3" />
              Total yearly impact
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Detailed Cost Breakdown
          </CardTitle>
          <CardDescription className="text-xs">
            Estimated monthly costs by component with variables
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {costEstimates.map((estimate, idx) => {
              const Icon = estimate.icon;
              const percentage = totalMonthlyCost > 0 ? (estimate.monthlyCost / totalMonthlyCost) * 100 : 0;
              
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
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">${estimate.monthlyCost.toFixed(0)}/mo</span>
                      <span className="text-xs text-muted-foreground">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">{estimate.description}</p>
                  <div className="flex items-center gap-2 ml-6">
                    <span className="text-xs text-muted-foreground">Variables:</span>
                    {estimate.variables.map((variable, vIdx) => (
                      <Badge key={vIdx} variant="outline" className="text-[9px] px-1">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        estimate.category === "infrastructure" ? "bg-purple-500" :
                        estimate.category === "observability" ? "bg-amber-500" :
                        estimate.category === "ci-cd" ? "bg-blue-500" :
                        estimate.category === "security" ? "bg-red-500" :
                        estimate.category === "storage" ? "bg-green-500" :
                        estimate.category === "network" ? "bg-cyan-500" : "bg-gray-500"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
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
            {optimizations.length} data-driven ways to reduce your monthly costs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {optimizations.map((opt, idx) => (
              <div key={idx} className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-sm">{opt.title}</h4>
                      {getDifficultyBadge(opt.difficulty)}
                      {getImpactBadge(opt.impact)}
                      {getRiskBadge(opt.risk)}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{opt.description}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Wrench className="h-3 w-3" />
                        <span className="font-medium">Implementation:</span>
                        <span>{opt.implementation}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        <span className="font-medium">ROI:</span>
                        <span className="text-green-600">{opt.roi}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-bold text-green-500">-${opt.savings}</div>
                    <div className="text-[10px] text-muted-foreground">per month</div>
                    <div className="text-[10px] text-blue-600 font-medium">
                      ${(opt.savings * 12).toFixed(0)}/yr
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Implementation time: {opt.difficulty === "easy" ? "1-2 weeks" : opt.difficulty === "medium" ? "1-2 months" : "3-6 months"}</span>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    <ArrowRight className="h-3 w-3 mr-1" />
                    Learn more
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cost Analysis Insights */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Team Size Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs space-y-1">
              <div>1-2 engineers: ${totalMonthlyCost.toFixed(0)}/mo</div>
              <div>3-5 engineers: ${(totalMonthlyCost * 1.2).toFixed(0)}/mo</div>
              <div>6-10 engineers: ${(totalMonthlyCost * 1.5).toFixed(0)}/mo</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-amber-500" />
              Usage Multipliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs space-y-1">
              <div>Low usage (25%): ${(totalMonthlyCost * 0.7).toFixed(0)}/mo</div>
              <div>Average usage (50%): ${totalMonthlyCost.toFixed(0)}/mo</div>
              <div>High usage (100%): ${(totalMonthlyCost * 1.8).toFixed(0)}/mo</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Globe className="h-4 w-4 text-green-500" />
              Regional Variations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs space-y-1">
              <div>US East: ${totalMonthlyCost.toFixed(0)}/mo</div>
              <div>US West: ${(totalMonthlyCost * 1.05).toFixed(0)}/mo</div>
              <div>Europe: ${(totalMonthlyCost * 1.15).toFixed(0)}/mo</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Disclaimer:</strong> These are estimates based on 2024 pricing data for typical usage patterns. 
          Actual costs vary based on region, usage patterns, negotiated discounts, and specific configurations. 
          Always consult official pricing calculators and consider conducting a thorough cost analysis before making decisions.
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1">
          <Calculator className="h-4 w-4 mr-2" />
          Export Cost Report
        </Button>
        <Button className="flex-1">
          <Target className="h-4 w-4 mr-2" />
          Create Optimization Plan
        </Button>
      </div>
    </div>
  );
}
