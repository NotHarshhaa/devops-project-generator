import { ProjectConfig } from "@/lib/types";
import { CostOptimization } from "../types";

export function getCostOptimizations(config: ProjectConfig): CostOptimization[] {
  const opts: CostOptimization[] = [];

  if (config.infra.includes("eks") || config.infra.includes("aks") || config.infra.includes("gke")) {
    opts.push(
      {
        title: "Implement Spot Instances for Non-Prod",
        description: "Use spot instances for development and staging environments. Save up to 90% compared to on-demand pricing while maintaining reliability through diversification.",
        savings: 180,
        difficulty: "medium",
        impact: "high",
        roi: "180% in first year",
        implementation: "Configure spot instance pools with fallback to on-demand",
        risk: "medium",
      },
      {
        title: "Enable Karpenter Autoscaling",
        description: "Replace cluster autoscaler with Karpenter for faster, more efficient scaling. Reduces over-provisioning by 30-40%.",
        savings: 95,
        difficulty: "medium",
        impact: "high",
        roi: "150% in first year",
        implementation: "Install Karpenter and configure instance types",
        risk: "low",
      },
      {
        title: "Optimize Node Sizes and Types",
        description: "Right-size instances based on actual utilization patterns. Many clusters over-provision by 40-60%.",
        savings: 120,
        difficulty: "easy",
        impact: "medium",
        roi: "240% in first year",
        implementation: "Analyze metrics and adjust instance types",
        risk: "low",
      }
    );
  }

  if (config.observability === "datadog" || config.observability === "new-relic") {
    opts.push({
      title: "Hybrid Monitoring Strategy",
      description: "Use self-hosted Prometheus for metrics and keep APM for traces. Reduces costs while maintaining capabilities.",
      savings: 280,
      difficulty: "hard",
      impact: "high",
      roi: "120% in first year",
      implementation: "Deploy Prometheus + Grafana, configure OpenTelemetry",
      risk: "medium",
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
      risk: "low",
    });
  }

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
      risk: "medium",
    });
  }

  if (config.ci === "github-actions" || config.ci === "gitlab-ci") {
    opts.push(
      {
        title: "Optimize CI/CD Pipeline Caching",
        description: "Implement intelligent caching and dependency management. Reduces build time by 60% and compute costs.",
        savings: 35,
        difficulty: "easy",
        impact: "medium",
        roi: "300% in first year",
        implementation: "Configure cache actions and dependency caching",
        risk: "low",
      },
      {
        title: "Use Self-Hosted Runners for Compute-Intensive Jobs",
        description: "Deploy self-hosted runners for heavy builds while using cloud runners for quick checks.",
        savings: 85,
        difficulty: "medium",
        impact: "high",
        roi: "170% in first year",
        implementation: "Set up self-hosted runners with auto-scaling",
        risk: "medium",
      }
    );
  }

  opts.push({
    title: "Implement Storage Lifecycle Policies",
    description: "Automate data tiering and cleanup. Move old data to cheaper storage and delete unnecessary backups.",
    savings: 45,
    difficulty: "easy",
    impact: "medium",
    roi: "200% in first year",
    implementation: "Configure lifecycle policies and retention rules",
    risk: "low",
  });

  if (config.security.includes("soc2") || config.security.includes("hipaa")) {
    opts.push({
      title: "Consolidate Security Tools",
      description: "Replace multiple point solutions with integrated security platform. Reduces tool overlap and licensing costs.",
      savings: 75,
      difficulty: "hard",
      impact: "medium",
      roi: "80% in first year",
      implementation: "Evaluate and migrate to integrated platform",
      risk: "high",
    });
  }

  opts.push(
    {
      title: "Implement Reserved Instances/Savings Plans",
      description: "Commit to 1-3 year savings plans for predictable workloads. Save 40-60% compared to on-demand pricing.",
      savings: 140,
      difficulty: "easy",
      impact: "high",
      roi: "400% in first year",
      implementation: "Analyze usage patterns and purchase savings plans",
      risk: "low",
    },
    {
      title: "Optimize Data Transfer Costs",
      description: "Use CDN, compress data, and optimize network paths. Can reduce data transfer costs by 30-50%.",
      savings: 55,
      difficulty: "medium",
      impact: "medium",
      roi: "150% in first year",
      implementation: "Implement CDN and compression",
      risk: "low",
    }
  );

  return opts;
}
