export interface ProjectConfig {
  projectName: string;
  pipeline: PipelineOption;
  ci: CIOption;
  infra: InfraOption;
  deploy: DeployOption;
  envs: EnvOption;
  observability: ObservabilityOption;
  security: SecurityOption;
  devcontainer?: DevContainerOption;
  securityAddons?: string[];
}

export type DevContainerOption = "full" | "minimal" | "none";
export type PipelineOption = "nodejs-typescript" | "python" | "java-maven" | "go" | "docker-multistage" | "docker-multi-stage" | "terraform-module" | "kubernetes-operator" | "microservice";
export type CIOption = "github-actions" | "gitlab-ci" | "jenkins" | "azure-pipelines" | "circleci" | "bitrise" | "none";
export type InfraOption = "aws-vpc-eks" | "azure-vnet-aks" | "gcp-vpc-gke" | "multicloud-terraform" | "terraform-multi-cloud" | "kubernetes-onprem" | "kubernetes-on-prem" | "aws-ecs-fargate" | "ecs-fargate" | "ansible-automation";
export type DeployOption = "blue-green" | "canary" | "rolling" | "gitops-argocd" | "helm-charts" | "kustomize" | "serverless-lambda";
export type EnvOption = "single" | "dev,stage,prod" | "dev,qa,stage,prod" | "dev,prod";
export type ObservabilityOption = "prometheus-grafana" | "elk-stack" | "datadog" | "jaeger-prometheus" | "cloudwatch" | "new-relic";
export type SecurityOption = "nist-csf" | "cis-benchmarks" | "zero-trust" | "soc2" | "soc2-compliance" | "gdpr" | "gdpr-compliance" | "hipaa" | "hipaa-compliance";

export interface OptionCard {
  value: string;
  label: string;
  description: string;
  icon: string;
  recommended?: boolean;
}

export interface StepConfig {
  id: string;
  title: string;
  description: string;
  field: keyof ProjectConfig;
}

export interface GeneratedFile {
  path: string;
  content: string;
  type: "file" | "directory";
}

export interface GenerationResult {
  success: boolean;
  projectName: string;
  files: GeneratedFile[];
  summary: {
    totalFiles: number;
    totalDirs: number;
    components: string[];
  };
}
