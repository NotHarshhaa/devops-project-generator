import {
  FolderOpen,
  Terminal,
  GitBranch,
  Layers,
  Package,
  Cpu,
  Activity,
  Shield,
} from "lucide-react";
import { ProjectConfig } from "@/lib/types";

export { DEFAULT_PROJECT_CONFIG as DEFAULT_CONFIG } from "@/lib/constants";

export const STEP_ICONS: Record<string, React.ElementType> = {
  project: FolderOpen,
  pipeline: Terminal,
  ci: GitBranch,
  infra: Layers,
  deploy: Package,
  envs: Cpu,
  observability: Activity,
  security: Shield,
};

export interface QuickStartTemplate {
  name: string;
  title: string;
  desc: string;
  iconKey: "code" | "database" | "cloud" | "settings";
  config: Partial<ProjectConfig>;
}

export const QUICK_START_TEMPLATES: QuickStartTemplate[] = [
  {
    name: "web-app",
    title: "Web Application",
    desc: "Node.js • GitHub Actions • AWS EKS • Blue-Green",
    iconKey: "code",
    config: {
      pipeline: "nodejs-typescript",
      ci: "github-actions",
      infra: "aws-vpc-eks",
      deploy: "blue-green",
      envs: "dev,stage,prod",
      observability: "prometheus-grafana",
      security: "nist-csf",
    },
  },
  {
    name: "api-service",
    title: "API Microservice",
    desc: "Go • GitLab CI • ArgoCD GitOps • Zero Trust",
    iconKey: "database",
    config: {
      pipeline: "go",
      ci: "gitlab-ci",
      infra: "aws-vpc-eks",
      deploy: "gitops-argocd",
      envs: "dev,stage,prod",
      observability: "datadog",
      security: "zero-trust",
    },
  },
  {
    name: "infra-platform",
    title: "Infrastructure Platform",
    desc: "Terraform Module • Multi-Cloud • CloudWatch • SOC2",
    iconKey: "cloud",
    config: {
      pipeline: "terraform-module",
      ci: "github-actions",
      infra: "multicloud-terraform",
      deploy: "rolling",
      envs: "dev,stage,prod",
      observability: "cloudwatch",
      security: "soc2",
    },
  },
  {
    name: "data-pipeline",
    title: "Data Pipeline",
    desc: "Python • Jenkins • GCP GKE • Helm • ELK Stack",
    iconKey: "settings",
    config: {
      pipeline: "python",
      ci: "jenkins",
      infra: "gcp-vpc-gke",
      deploy: "helm-charts",
      envs: "dev,qa,stage,prod",
      observability: "elk-stack",
      security: "cis-benchmarks",
    },
  },
];
