import { ProjectConfig } from "@/lib/types";
import { ConfigOptimization } from "../types";

export function getConfigOptimizations(config: ProjectConfig): ConfigOptimization[] {
  const opts: ConfigOptimization[] = [];

  if (config.infra.includes("eks") && config.envs === "single") {
    opts.push({
      type: "cost",
      title: "Downgrade to EKS Fargate",
      description: "For single environment, EKS Fargate is more cost-effective",
      savings: "~40%",
      difficulty: "Easy",
    });
  }

  if (config.observability === "datadog" && config.infra.includes("aws")) {
    opts.push({
      type: "cost",
      title: "Switch to CloudWatch",
      description: "CloudWatch is included with AWS infrastructure",
      savings: "~30%",
      difficulty: "Easy",
    });
  }

  if (config.deploy === "rolling" && config.envs === "dev,stage,prod") {
    opts.push({
      type: "performance",
      title: "Upgrade to Blue-Green",
      description: "Zero-downtime deployments for production",
      savings: "~50% faster deployments",
      difficulty: "Medium",
    });
  }

  if (
    !config.security.includes("nist") &&
    !config.security.includes("zero-trust") &&
    !config.security.includes("cis") &&
    config.envs === "dev,stage,prod"
  ) {
    opts.push({
      type: "security",
      title: "Add NIST CSF",
      description: "Essential security for multi-environment setups",
      savings: "Reduced risk",
      difficulty: "Medium",
    });
  }

  return opts;
}
