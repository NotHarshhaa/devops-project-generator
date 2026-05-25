import { ProjectConfig } from "@/lib/types";

export { calculateComplexity } from "@/lib/generator/complexity";

export function buildCliCommand(config: ProjectConfig): string {
  return `devops-project-generator init --name ${config.projectName} --pipeline ${config.pipeline} --ci ${config.ci} --infra ${config.infra} --deploy ${config.deploy} --envs "${config.envs}" --observability ${config.observability} --security ${config.security}`;
}

export function getComplexityLabel(complexity: number): "Simple" | "Medium" | "Complex" {
  if (complexity <= 3) return "Simple";
  if (complexity <= 6) return "Medium";
  return "Complex";
}
