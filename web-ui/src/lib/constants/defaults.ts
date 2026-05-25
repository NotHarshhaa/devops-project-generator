import { ProjectConfig } from "../types";

export const DEFAULT_PROJECT_CONFIG: ProjectConfig = {
  projectName: "",
  pipeline: "nodejs-typescript",
  ci: "github-actions",
  infra: "aws-vpc-eks",
  deploy: "blue-green",
  envs: "dev,stage,prod",
  observability: "prometheus-grafana",
  security: "nist-csf",
};

/** @deprecated Use DEFAULT_PROJECT_CONFIG */
export const DEFAULT_CONFIG = DEFAULT_PROJECT_CONFIG;
