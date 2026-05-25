import { ProjectConfig } from "@/lib/types";

export function calculateComplexity(cfg: ProjectConfig): number {
  let complexity = 1;

  if (cfg.infra.includes("multi-cloud")) complexity += 3;
  if (cfg.infra.includes("eks") || cfg.infra.includes("aks") || cfg.infra.includes("gke")) complexity += 2;
  if (cfg.infra.includes("on-prem")) complexity += 4;

  if (cfg.deploy.includes("gitops") || cfg.deploy.includes("helm")) complexity += 2;
  if (cfg.deploy.includes("canary")) complexity += 1;
  if (cfg.deploy.includes("serverless")) complexity += 2;

  const envCount = cfg.envs.split(",").length;
  complexity += envCount - 1;

  if (cfg.security.includes("zero-trust") || cfg.security.includes("soc2") || cfg.security.includes("hipaa")) complexity += 3;
  if (cfg.security.includes("cis")) complexity += 2;

  if (cfg.observability.includes("datadog") || cfg.observability.includes("new-relic")) complexity += 2;
  if (cfg.observability.includes("elk")) complexity += 2;

  return complexity;
}

export function buildCliCommand(config: ProjectConfig): string {
  return `devops-project-generator init --name ${config.projectName} --pipeline ${config.pipeline} --ci ${config.ci} --infra ${config.infra} --deploy ${config.deploy} --envs "${config.envs}" --observability ${config.observability} --security ${config.security}`;
}

export function getComplexityLabel(complexity: number): "Simple" | "Medium" | "Complex" {
  if (complexity <= 3) return "Simple";
  if (complexity <= 6) return "Medium";
  return "Complex";
}
