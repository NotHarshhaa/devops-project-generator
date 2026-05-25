import { ProjectConfig } from "@/lib/types";
import {
  Server,
  Cloud,
  Zap,
  Activity,
  Shield,
  GitBranch,
  Database,
  Globe,
} from "lucide-react";
import { CostEstimate } from "../types";

export function calculateCostEstimates(config: ProjectConfig): CostEstimate[] {
  const estimates: CostEstimate[] = [];
  const regionMultiplier = 1.0;

  if (config.infra.includes("eks")) {
    estimates.push(
      { component: "AWS EKS Control Plane", monthlyCost: 144 * regionMultiplier, category: "infrastructure", icon: Cloud, description: "EKS cluster management fee", variables: ["cluster_size", "region"] },
      { component: "EKS Worker Nodes (3x t3.large)", monthlyCost: 3 * 60 * regionMultiplier, category: "infrastructure", icon: Server, description: "Compute instances for workloads", variables: ["instance_type", "instance_count", "utilization"] },
      { component: "EKS Add-ons (CoreDNS, kube-proxy)", monthlyCost: 30 * regionMultiplier, category: "infrastructure", icon: Zap, description: "Managed Kubernetes add-ons", variables: ["add_ons"] }
    );
  } else if (config.infra.includes("aks")) {
    estimates.push(
      { component: "Azure AKS Cluster", monthlyCost: 72 * regionMultiplier, category: "infrastructure", icon: Cloud, description: "AKS cluster management fee", variables: ["cluster_size", "region"] },
      { component: "AKS Worker Nodes (3x Standard_B2s)", monthlyCost: 3 * 55 * regionMultiplier, category: "infrastructure", icon: Server, description: "Azure VM instances", variables: ["vm_size", "instance_count", "utilization"] }
    );
  } else if (config.infra.includes("gke")) {
    estimates.push(
      { component: "GCP GKE Cluster", monthlyCost: 74 * regionMultiplier, category: "infrastructure", icon: Cloud, description: "GKE cluster management fee", variables: ["cluster_size", "region"] },
      { component: "GKE Worker Nodes (3x e2-medium)", monthlyCost: 3 * 48 * regionMultiplier, category: "infrastructure", icon: Server, description: "GCE instances for workloads", variables: ["machine_type", "instance_count", "utilization"] }
    );
  } else if (config.infra.includes("ecs-fargate")) {
    estimates.push({ component: "AWS ECS Fargate", monthlyCost: 120 * regionMultiplier, category: "infrastructure", icon: Cloud, description: "Serverless container compute", variables: ["vcpu_hours", "memory_gb", "tasks"] });
  } else if (config.infra.includes("terraform-multi-cloud")) {
    estimates.push({ component: "Multi-Cloud Infrastructure", monthlyCost: 350 * regionMultiplier, category: "infrastructure", icon: Cloud, description: "Multiple cloud provider resources", variables: ["providers", "resource_count", "complexity"] });
  } else if (config.infra.includes("kubernetes-on-prem")) {
    estimates.push({ component: "On-Premises Kubernetes", monthlyCost: 800 * regionMultiplier, category: "infrastructure", icon: Server, description: "Hardware, maintenance, and operations", variables: ["hardware_cost", "maintenance", "staffing"] });
  } else {
    estimates.push({ component: "Basic Infrastructure", monthlyCost: 150 * regionMultiplier, category: "infrastructure", icon: Server, description: "Minimal infrastructure setup", variables: ["server_count", "basic_services"] });
  }

  const observabilityCosts: Record<string, Omit<CostEstimate, "category">> = {
    "prometheus-grafana": { component: "Prometheus + Grafana (self-hosted)", monthlyCost: 85 * regionMultiplier, icon: Zap, description: "Self-hosted monitoring stack", variables: ["storage_size", "retention_period", "alert_rules"] },
    "elk-stack": { component: "ELK Stack (self-hosted)", monthlyCost: 120 * regionMultiplier, icon: Database, description: "Elasticsearch, Logstash, Kibana", variables: ["storage_size", "data_nodes", "ingest_volume"] },
    datadog: { component: "DataDog (15 hosts + APM)", monthlyCost: 435 * regionMultiplier, icon: Activity, description: "Infrastructure monitoring + APM", variables: ["host_count", "custom_metrics", "trace_volume"] },
    "new-relic": { component: "New Relic (Pro tier)", monthlyCost: 399 * regionMultiplier, icon: Activity, description: "Full-stack observability platform", variables: ["users", "data_retention", "features"] },
    cloudwatch: { component: "AWS CloudWatch", monthlyCost: 65 * regionMultiplier, icon: Zap, description: "AWS native monitoring", variables: ["metrics", "logs", "alarms", "dashboards"] },
    "jaeger-prometheus": { component: "Jaeger + Prometheus", monthlyCost: 110 * regionMultiplier, icon: Activity, description: "Distributed tracing + metrics", variables: ["trace_volume", "storage", "sampling_rate"] },
  };

  const obs = observabilityCosts[config.observability];
  if (obs) {
    estimates.push({ ...obs, category: "observability" });
  }

  const ciCosts: Record<string, Omit<CostEstimate, "category">> = {
    "github-actions": { component: "GitHub Actions (Team)", monthlyCost: 42 * regionMultiplier, icon: GitBranch, description: "GitHub Actions Team plan", variables: ["build_minutes", "storage", "runners"] },
    "gitlab-ci": { component: "GitLab CI (Premium)", monthlyCost: 58 * regionMultiplier, icon: GitBranch, description: "GitLab Premium CI/CD", variables: ["build_minutes", "runners", "storage"] },
    jenkins: { component: "Jenkins (self-hosted)", monthlyCost: 150 * regionMultiplier, icon: Server, description: "Self-hosted Jenkins with maintenance", variables: ["hardware", "maintenance", "plugins"] },
    "azure-pipelines": { component: "Azure Pipelines", monthlyCost: 45 * regionMultiplier, icon: GitBranch, description: "Azure DevOps Pipelines", variables: ["build_minutes", "parallel_jobs", "agents"] },
  };

  const ci = ciCosts[config.ci];
  if (ci) {
    estimates.push({ ...ci, category: "ci-cd" });
  }

  if (config.security.includes("soc2") || config.security.includes("hipaa")) {
    estimates.push({ component: "Advanced Security Suite", monthlyCost: 285 * regionMultiplier, category: "security", icon: Shield, description: "Compliance and advanced security tools", variables: ["compliance_level", "audit_frequency", "tools"] });
  } else if (config.security.includes("nist-csf") || config.security.includes("zero-trust")) {
    estimates.push({ component: "Enterprise Security", monthlyCost: 195 * regionMultiplier, category: "security", icon: Shield, description: "NIST CSF and zero-trust implementation", variables: ["security_level", "monitoring", "tools"] });
  } else if (config.security.includes("cis")) {
    estimates.push({ component: "CIS Benchmarks", monthlyCost: 125 * regionMultiplier, category: "security", icon: Shield, description: "CIS security benchmarks and scanning", variables: ["benchmark_level", "scan_frequency", "reports"] });
  } else {
    estimates.push({ component: "Basic Security", monthlyCost: 45 * regionMultiplier, category: "security", icon: Shield, description: "Essential security scanning and monitoring", variables: ["scan_frequency", "tools", "coverage"] });
  }

  estimates.push(
    { component: "Storage & Backups", monthlyCost: 50 * regionMultiplier, category: "storage", icon: Database, description: "Persistent storage and backup solutions", variables: ["storage_gb", "backup_retention", "storage_class"] },
    { component: "Network & Data Transfer", monthlyCost: 35 * regionMultiplier, category: "network", icon: Globe, description: "Load balancers, data transfer, DNS", variables: ["data_transfer_gb", "bandwidth", "connections"] }
  );

  const envCount = config.envs.split(",").length;
  if (envCount > 1) {
    const infraCosts = estimates.filter((e) => e.category === "infrastructure");
    const additionalCost = infraCosts.reduce((sum, e) => sum + e.monthlyCost, 0) * (envCount - 1) * 0.6;
    estimates.push({
      component: `Additional Environments (${envCount - 1})`,
      monthlyCost: additionalCost,
      category: "infrastructure",
      icon: Server,
      description: "Multi-environment infrastructure costs",
      variables: ["environment_count", "resource_sharing"],
    });
  }

  return estimates;
}
