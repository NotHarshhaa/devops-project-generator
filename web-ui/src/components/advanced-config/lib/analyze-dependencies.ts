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
        fix: "Switch to AWS EKS Fargate or other AWS infrastructure",
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
        fix: "Consider adding GitHub Actions, GitLab CI, or Jenkins",
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
        fix: "Add Prometheus/Grafana, ELK stack, or Datadog",
      });
    }

    if (config.deploy === "rolling") {
      deps.push({
        from: config.security,
        to: config.deploy,
        type: "warning",
        reason: "Compliance frameworks benefit from safer deployment strategies",
        impact: "medium",
        fix: "Consider blue-green or canary deployment",
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
