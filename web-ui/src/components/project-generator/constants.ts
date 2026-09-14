import {
  FolderOpen,
  Terminal,
  GitBranch,
  Layers,
  Package,
  Cpu,
  Activity,
  Shield,
  Container,
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
  devcontainer: Container,
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
    name: "modern-web-app",
    title: "Modern Web App",
    desc: "Node.js • GitHub Actions • AWS EKS • Blue-Green • Prometheus",
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
    name: "enterprise-microservices",
    title: "Enterprise Microservices",
    desc: "Java Maven • GitLab CI • Azure AKS • ArgoCD GitOps • SOC2",
    iconKey: "database",
    config: {
      pipeline: "java-maven",
      ci: "gitlab-ci",
      infra: "azure-vnet-aks",
      deploy: "gitops-argocd",
      envs: "dev,stage,prod",
      observability: "datadog",
      security: "soc2",
    },
  },
  {
    name: "cloud-native-go",
    title: "Cloud-Native Go",
    desc: "Go • GitHub Actions • GCP GKE • Canary • Zero Trust",
    iconKey: "code",
    config: {
      pipeline: "go",
      ci: "github-actions",
      infra: "gcp-vpc-gke",
      deploy: "canary",
      envs: "dev,stage,prod",
      observability: "jaeger-prometheus",
      security: "zero-trust",
    },
  },
  {
    name: "serverless-aws",
    title: "Serverless AWS Platform",
    desc: "Python • GitHub Actions • AWS Fargate • Lambda • CloudWatch",
    iconKey: "cloud",
    config: {
      pipeline: "python",
      ci: "github-actions",
      infra: "aws-ecs-fargate",
      deploy: "serverless-lambda",
      envs: "dev,prod",
      observability: "cloudwatch",
      security: "cis-benchmarks",
    },
  },
  {
    name: "multicloud-platform",
    title: "Multi-Cloud IaC Platform",
    desc: "Terraform Module • GitHub Actions • Multi-Cloud • Rolling • SOC2",
    iconKey: "cloud",
    config: {
      pipeline: "terraform-module",
      ci: "github-actions",
      infra: "multicloud-terraform",
      deploy: "rolling",
      envs: "dev,stage,prod",
      observability: "prometheus-grafana",
      security: "soc2",
    },
  },
  {
    name: "data-ai-pipeline",
    title: "Data & AI Pipeline",
    desc: "Python • Jenkins • AWS EKS • Helm Charts • ELK • HIPAA",
    iconKey: "settings",
    config: {
      pipeline: "python",
      ci: "jenkins",
      infra: "aws-vpc-eks",
      deploy: "helm-charts",
      envs: "dev,qa,stage,prod",
      observability: "elk-stack",
      security: "hipaa",
    },
  },
];
