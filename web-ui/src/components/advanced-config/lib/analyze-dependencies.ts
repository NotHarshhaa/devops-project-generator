import { ProjectConfig } from "@/lib/types";
import { Dependency } from "../types";

export function analyzeDependencies(config: ProjectConfig): Dependency[] {
  const deps: Dependency[] = [];

  if (config.infra.includes("eks") || config.infra.includes("aks") || config.infra.includes("gke")) {
    deps.push({
      from: config.infra,
      to: "kubernetes",
      type: "required",
      reason: "Managed Kubernetes requires K8s deployment strategy",
      impact: "high",
      fix: "Switch to kubernetes deployment or choose non-K8s infrastructure",
    });
  }

  if (config.deploy === "helm-charts" || config.deploy === "kustomize" || config.deploy === "gitops-argocd") {
    if (
      !config.infra.includes("eks") &&
      !config.infra.includes("aks") &&
      !config.infra.includes("gke") &&
      !config.infra.includes("kubernetes")
    ) {
      deps.push({
        from: config.deploy,
        to: config.infra,
        type: "conflict",
        reason: "Kubernetes deployment strategy requires Kubernetes infrastructure",
        impact: "high",
        fix: "Choose AWS EKS, Azure AKS, GCP GKE, or Kubernetes on-prem",
        fixAction: { infra: "aws-vpc-eks" },
        actionLabel: "Switch to AWS EKS",
      });
    }
  }

  if (config.deploy === "serverless-lambda") {
    if (!config.infra.includes("ecs-fargate") && !config.infra.includes("aws")) {
      deps.push({
        from: config.deploy,
        to: config.infra,
        type: "conflict",
        reason: "AWS Lambda requires AWS infrastructure",
        impact: "high",
        fix: "Switch to AWS ECS Fargate or other AWS infrastructure",
        fixAction: { infra: "aws-ecs-fargate" },
        actionLabel: "Switch to AWS ECS Fargate",
      });
    }

    if (config.observability === "prometheus-grafana") {
      deps.push({
        from: config.deploy,
        to: config.observability,
        type: "conflict",
        reason: "Prometheus scraping is incompatible with ephemeral, short-lived AWS Lambda executions",
        impact: "high",
        fix: "Switch observability to CloudWatch for native serverless metrics",
        fixAction: { observability: "cloudwatch" },
        actionLabel: "Switch to CloudWatch",
      });
    }
  }

  if (config.infra.includes("aws") && !config.observability.includes("cloudwatch")) {
    deps.push({
      from: config.infra,
      to: "cloudwatch",
      type: "recommended",
      reason: "AWS CloudWatch is recommended for AWS infrastructure",
      impact: "medium",
      fix: "Consider using CloudWatch for better AWS integration",
    });
  }

  if (config.infra.includes("azure") && !config.observability.includes("azure-monitor")) {
    deps.push({
      from: config.infra,
      to: "azure-monitor",
      type: "recommended",
      reason: "Azure Monitor is recommended for Azure infrastructure",
      impact: "medium",
    });
  }

  if (config.infra.includes("gcp") && !config.observability.includes("cloud-monitoring")) {
    deps.push({
      from: config.infra,
      to: "cloud-monitoring",
      type: "recommended",
      reason: "Google Cloud Monitoring is recommended for GCP infrastructure",
      impact: "medium",
    });
  }

  if (config.envs === "dev,stage,prod" || config.envs === "dev,qa,stage,prod") {
    if (config.deploy === "blue-green" || config.deploy === "canary") {
      deps.push({
        from: config.envs,
        to: config.deploy,
        type: "recommended",
        reason: "Advanced deployment strategies work well with multiple environments",
        impact: "medium",
      });
    }

    if (config.ci === "none") {
      deps.push({
        from: config.envs,
        to: config.ci,
        type: "warning",
        reason: "Multi-environment setup benefits from automated CI/CD",
        impact: "high",
        fix: "Enable automated CI/CD pipeline",
        fixAction: { ci: "github-actions" },
        actionLabel: "Enable GitHub Actions",
      });
    }
  }

  if (config.security.includes("soc2") || config.security.includes("hipaa") || config.security.includes("gdpr")) {
    if (!config.observability) {
      deps.push({
        from: config.security,
        to: "observability",
        type: "required",
        reason: "Compliance frameworks require comprehensive observability",
        impact: "high",
        fix: "Add Prometheus/Grafana or Datadog observability",
        fixAction: { observability: "prometheus-grafana" },
        actionLabel: "Add Prometheus/Grafana",
      });
    }

    if (config.deploy === "rolling") {
      deps.push({
        from: config.security,
        to: config.deploy,
        type: "warning",
        reason: "Compliance frameworks benefit from zero-downtime deployment strategies",
        impact: "medium",
        fix: "Switch to Blue-Green deployment",
        fixAction: { deploy: "blue-green" },
        actionLabel: "Switch to Blue-Green",
      });
    }
  }

  if (config.pipeline === "kubernetes-operator") {
    if (
      !config.infra.includes("kubernetes") &&
      !config.infra.includes("eks") &&
      !config.infra.includes("aks") &&
      !config.infra.includes("gke")
    ) {
      deps.push({
        from: config.pipeline,
        to: config.infra,
        type: "conflict",
        reason: "Kubernetes operator pipeline requires Kubernetes infrastructure",
        impact: "high",
        fix: "Choose Kubernetes-based infrastructure",
        fixAction: { infra: "aws-vpc-eks" },
        actionLabel: "Switch to AWS EKS",
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
      fix: "Consider Terraform multi-cloud infrastructure",
      fixAction: { infra: "multicloud-terraform" },
      actionLabel: "Switch to Multi-Cloud Terraform",
    });
  }

  if (config.infra.includes("aws") && config.ci === "github-actions") {
    deps.push({
      from: config.infra,
      to: config.ci,
      type: "recommended",
      reason: "GitHub Actions integrates well with AWS via OIDC",
      impact: "low",
    });
  }

  if (config.infra.includes("azure") && config.ci === "azure-pipelines") {
    deps.push({
      from: config.infra,
      to: config.ci,
      type: "recommended",
      reason: "Azure Pipelines provides native Azure integration",
      impact: "low",
    });
  }

  if (config.pipeline === "microservice" && config.deploy === "rolling") {
    deps.push({
      from: config.pipeline,
      to: config.deploy,
      type: "warning",
      reason: "Microservices benefit from advanced deployment strategies",
      impact: "medium",
      fix: "Consider blue-green, canary, or GitOps deployment",
    });
  }

  return deps;
}
