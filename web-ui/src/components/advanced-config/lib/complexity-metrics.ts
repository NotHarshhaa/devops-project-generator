import { ProjectConfig } from "@/lib/types";
import { ComplexityMetrics } from "../types";

export function calculateComplexityMetrics(config: ProjectConfig): ComplexityMetrics {
  let score = 0;

  if (config.infra.includes("terraform-multi-cloud")) score += 35;
  else if (config.infra.includes("eks") || config.infra.includes("aks") || config.infra.includes("gke")) score += 25;
  else if (config.infra.includes("kubernetes")) score += 20;
  else if (config.infra.includes("ecs-fargate")) score += 15;
  else score += 10;

  if (config.deploy === "gitops-argocd") score += 30;
  else if (config.deploy === "blue-green" || config.deploy === "canary") score += 25;
  else if (config.deploy === "helm-charts" || config.deploy === "kustomize") score += 20;
  else if (config.deploy === "serverless-lambda") score += 15;
  else score += 10;

  score += config.envs.split(",").length * 8;

  if (config.pipeline === "kubernetes-operator") score += 25;
  else if (config.pipeline === "terraform-module") score += 20;
  else if (config.pipeline === "microservice") score += 20;
  else if (config.pipeline === "docker-multi-stage") score += 15;
  else score += 10;

  if (config.observability === "jaeger-prometheus" || config.observability === "elk-stack") score += 20;
  else if (config.observability === "datadog") score += 15;
  else score += 10;

  if (config.security.includes("soc2") || config.security.includes("hipaa")) score += 25;
  else if (config.security === "zero-trust" || config.security === "nist-csf") score += 20;
  else score += 10;

  if (config.ci === "jenkins") score += 15;
  else if (config.ci === "gitlab-ci" || config.ci === "azure-pipelines") score += 12;
  else score += 8;

  score = Math.min(score, 100);

  if (score < 30) {
    return {
      score,
      level: "Simple",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      estimatedTime: "1-2 weeks",
      teamSize: "1-2 developers",
      monthlyCost: "$100-500",
    };
  }
  if (score < 50) {
    return {
      score,
      level: "Moderate",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      estimatedTime: "2-4 weeks",
      teamSize: "2-4 developers",
      monthlyCost: "$500-2,000",
    };
  }
  if (score < 75) {
    return {
      score,
      level: "Complex",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      estimatedTime: "1-2 months",
      teamSize: "4-8 developers",
      monthlyCost: "$2,000-10,000",
    };
  }
  return {
    score,
    level: "Expert",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    estimatedTime: "2-4 months",
    teamSize: "8+ developers",
    monthlyCost: "$10,000+",
  };
}
