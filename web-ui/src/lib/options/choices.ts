import { OptionCard } from "../types";

export const pipelineOptions: OptionCard[] = [
  { value: "nodejs-typescript", label: "Node.js + TypeScript", description: "CI/CD pipelines for Node.js applications with TypeScript", icon: "code", recommended: true },
  { value: "python", label: "Python", description: "CI/CD pipelines for Python applications with pytest and poetry", icon: "package" },
  { value: "java-maven", label: "Java + Maven", description: "Enterprise-grade CI/CD for Java applications with Maven", icon: "coffee" },
  { value: "go", label: "Go", description: "Fast CI/CD pipelines for Go applications with go mod", icon: "zap" },
  { value: "docker-multi-stage", label: "Docker Multi-Stage", description: "Containerized pipelines with multi-stage Docker builds", icon: "container" },
  { value: "terraform-module", label: "Terraform Module", description: "CI/CD for Terraform modules with automated testing", icon: "layers" },
  { value: "kubernetes-operator", label: "Kubernetes Operator", description: "CI/CD for Kubernetes operators with OLM integration", icon: "ship" },
  { value: "microservice", label: "Microservice", description: "Complex pipelines for microservice architectures", icon: "git-branch" },
];

export const ciOptions: OptionCard[] = [
  { value: "github-actions", label: "GitHub Actions", description: "Native CI/CD for GitHub repositories with YAML workflows", icon: "github", recommended: true },
  { value: "gitlab-ci", label: "GitLab CI", description: "Integrated CI/CD pipelines within GitLab", icon: "gitlab" },
  { value: "jenkins", label: "Jenkins", description: "Self-hosted automation server with extensible plugins", icon: "server" },
  { value: "azure-pipelines", label: "Azure Pipelines", description: "Cloud-native CI/CD with Azure DevOps integration", icon: "cloud" },
  { value: "circleci", label: "CircleCI", description: "Fast, configurable CI/CD with Docker support", icon: "circle" },
  { value: "bitrise", label: "Bitrise", description: "Mobile-first CI/CD for iOS, Android, and web apps", icon: "smartphone" },
  { value: "none", label: "None", description: "Skip CI/CD setup for now", icon: "x" },
];

export const infraOptions: OptionCard[] = [
  { value: "aws-vpc-eks", label: "AWS VPC + EKS", description: "Production-ready VPC with EKS cluster and managed node groups", icon: "cloud", recommended: true },
  { value: "azure-vnet-aks", label: "Azure VNet + AKS", description: "Enterprise VNet with AKS cluster and Azure DevOps integration", icon: "database" },
  { value: "gcp-vpc-gke", label: "GCP VPC + GKE", description: "Secure VPC with GKE cluster and Cloud Build integration", icon: "cpu" },
  { value: "terraform-multi-cloud", label: "Multi-Cloud Terraform", description: "Multi-cloud infrastructure with Terraform modules and state management", icon: "layers" },
  { value: "kubernetes-on-prem", label: "Kubernetes On-Prem", description: "On-premises Kubernetes with metalLB and external storage", icon: "server" },
  { value: "ecs-fargate", label: "AWS ECS Fargate", description: "Serverless container orchestration with AWS Fargate", icon: "container" },
  { value: "ansible-automation", label: "Ansible Automation", description: "Configuration management and automation with Ansible playbooks", icon: "terminal" },
];

export const deployOptions: OptionCard[] = [
  { value: "blue-green", label: "Blue-Green Deployment", description: "Zero-downtime deployments with blue-green infrastructure switching", icon: "git-branch", recommended: true },
  { value: "canary", label: "Canary Deployment", description: "Gradual rollout with traffic splitting and automated monitoring", icon: "bird" },
  { value: "rolling", label: "Rolling Update", description: "Incremental updates with health checks and rollback capabilities", icon: "refresh-cw" },
  { value: "gitops-argocd", label: "GitOps with ArgoCD", description: "Declarative GitOps deployments with ArgoCD and automated sync", icon: "git-merge" },
  { value: "helm-charts", label: "Helm Charts", description: "Package and deploy applications with Helm charts and values", icon: "package" },
  { value: "kustomize", label: "Kustomize", description: "Template-free Kubernetes configuration management", icon: "layers-2" },
  { value: "serverless-lambda", label: "Serverless Lambda", description: "Function-based deployments with API Gateway and Lambda", icon: "cloud-off" },
];

export const envOptions: OptionCard[] = [
  { value: "single", label: "Single", description: "One environment for simple projects or prototypes", icon: "box" },
  { value: "dev,stage,prod", label: "Dev / Stage / Prod", description: "Multi-environment pipeline for production workflows", icon: "git-branch", recommended: true },
  { value: "dev,qa,stage,prod", label: "Dev / QA / Stage / Prod", description: "Comprehensive pipeline with quality assurance stage", icon: "git-branch-plus" },
  { value: "dev,prod", label: "Dev / Prod", description: "Simplified two-environment setup", icon: "git-fork" },
];

export const observabilityOptions: OptionCard[] = [
  { value: "prometheus-grafana", label: "Prometheus + Grafana", description: "Open-source monitoring with Prometheus metrics and Grafana dashboards", icon: "bar-chart", recommended: true },
  { value: "elk-stack", label: "ELK Stack", description: "Comprehensive logging with Elasticsearch, Logstash, and Kibana", icon: "search" },
  { value: "datadog", label: "DataDog", description: "Full-stack observability with APM, logs, and synthetic monitoring", icon: "radar" },
  { value: "jaeger-prometheus", label: "Jaeger + Prometheus", description: "Distributed tracing with Jaeger and metrics with Prometheus", icon: "activity" },
  { value: "cloudwatch", label: "AWS CloudWatch", description: "AWS-native monitoring with metrics, logs, and alarms", icon: "cloud" },
  { value: "new-relic", label: "New Relic", description: "APM and infrastructure monitoring with New Relic One", icon: "cpu" },
];

export const securityOptions: OptionCard[] = [
  { value: "nist-csf", label: "NIST CSF", description: "NIST Cybersecurity Framework with comprehensive controls", icon: "shield", recommended: true },
  { value: "cis-benchmarks", label: "CIS Benchmarks", description: "Center for Internet Security benchmarks for hardening", icon: "shield-check" },
  { value: "zero-trust", label: "Zero Trust Architecture", description: "Zero Trust with mTLS, service mesh, and identity-based access", icon: "shield-x" },
  { value: "soc2-compliance", label: "SOC2 Compliance", description: "SOC2 Type II compliance controls and documentation", icon: "file-check" },
  { value: "gdpr-compliance", label: "GDPR Compliance", description: "GDPR data protection and privacy controls", icon: "lock" },
  { value: "hipaa-compliance", label: "HIPAA Compliance", description: "HIPAA healthcare compliance and audit controls", icon: "heart" },
];
