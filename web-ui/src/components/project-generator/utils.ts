import { ProjectConfig } from "@/lib/types";

export { calculateComplexity } from "@/lib/generator/complexity";

const CLI_ENUM_MAP: Record<string, string> = {
  "docker-multi-stage": "docker-multistage",
  "terraform-multi-cloud": "multicloud-terraform",
  "kubernetes-on-prem": "kubernetes-onprem",
  "ecs-fargate": "aws-ecs-fargate",
  "soc2-compliance": "soc2",
  "gdpr-compliance": "gdpr",
  "hipaa-compliance": "hipaa",
};

export function buildCliCommand(config: ProjectConfig): string {
  const pipeline = CLI_ENUM_MAP[config.pipeline] || config.pipeline;
  const infra = CLI_ENUM_MAP[config.infra] || config.infra;
  const security = CLI_ENUM_MAP[config.security] || config.security;

  return `devops-project-generator init --name ${config.projectName || "my-devops-project"} --pipeline ${pipeline} --ci ${config.ci} --infra ${infra} --deploy ${config.deploy} --envs "${config.envs}" --observability ${config.observability} --security ${security}`;
}

export function getComplexityLabel(complexity: number): "Simple" | "Medium" | "Complex" {
  if (complexity <= 3) return "Simple";
  if (complexity <= 6) return "Medium";
  return "Complex";
}
