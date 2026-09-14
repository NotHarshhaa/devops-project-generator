import {
  Activity,
  ArrowRight,
  BarChart3,
  Box,
  Cloud,
  Container,
  Cpu,
  DollarSign,
  FileCode2,
  FileText,
  FolderTree,
  GitBranch,
  Github,
  Globe,
  Layers,
  Linkedin,
  Monitor,
  Network,
  RefreshCw,
  Send,
  Server,
  Settings2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Ship,
  Terminal,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const HERO_TAGS = ["GitHub Actions", "Terraform", "Kubernetes", "Prometheus"] as const;

export const APP_VERSION = "v2.0.0";
export const GITHUB_REPO = "https://github.com/NotHarshhaa/devops-project-generator";

export type WorkspaceTab = "generator" | "config" | "cost" | "analytics" | "diagram";

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bg: string;
}

export interface NewFeatureCard {
  tab: WorkspaceTab;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  hoverGradient: string;
  title: string;
  description: string;
  bullets: string[];
  cta: string;
}

export interface TechOptionItem {
  icon: LucideIcon;
  label: string;
  tag?: string;
}

export interface TechOptionCategory {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  iconColor: string;
  iconBg: string;
  items: TechOptionItem[];
}

export interface ProjectStructureItem {
  indent: number;
  icon: string;
  name: string;
  desc: string;
}

export interface AuthorStat {
  label: string;
  value: string;
  sub: string;
}

export interface SocialLink {
  href: string;
  label: string;
  icon: LucideIcon;
  variant?: "default" | "outline";
}

export const NEW_FEATURE_HIGHLIGHTS = [
  { value: "100%", label: "Local Storage" },
  { value: "Real-Time", label: "Analysis & Tracking" },
  { value: "70%", label: "Potential Cost Savings" },
] as const;

export const WHY_CHOOSE_FEATURES: FeatureItem[] = [
  {
    icon: Workflow,
    title: "CI/CD Pipelines",
    description:
      "Pre-configured GitHub Actions, GitLab CI, or Jenkins pipelines with test, lint, build, and deploy stages.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Layers,
    title: "Infrastructure as Code",
    description:
      "Terraform or CloudFormation templates with best practices — state management, modules, and multi-env support.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: Container,
    title: "Container Ready",
    description:
      "Production Dockerfiles with multi-stage builds, health checks, non-root users, and Compose configs.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Ship,
    title: "Kubernetes Manifests",
    description:
      "Deployments, Services, Namespaces with resource limits, probes, and namespace separation.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: Activity,
    title: "Full Observability",
    description:
      "Logging configs, Prometheus metrics, and alerting rules — from basic logs to full monitoring stacks.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Security Built-In",
    description:
      "Security policies, Trivy scanning configs, network policies, and RBAC — from basic to strict posture.",
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
];

export const NEW_FEATURE_CARDS: NewFeatureCard[] = [
  {
    tab: "config",
    icon: Network,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    hoverGradient: "from-blue-500/10",
    title: "Advanced Config Builder",
    description:
      "Visualize dependencies, detect conflicts, and get smart recommendations with real-time complexity scoring.",
    bullets: [
      "Dependency graph visualization",
      "Automatic conflict detection",
      "Complexity scoring (0-100)",
    ],
    cta: "Try Config Builder",
  },
  {
    tab: "cost",
    icon: DollarSign,
    iconColor: "text-green-500",
    iconBg: "bg-green-500/10",
    hoverGradient: "from-green-500/10",
    title: "Cost Optimization Advisor",
    description:
      "Get accurate cost estimates and optimization recommendations to save up to 70% on your cloud infrastructure.",
    bullets: ["Monthly cost estimation", "Optimization recommendations", "Potential savings calculator"],
    cta: "Try Cost Advisor",
  },
  {
    tab: "analytics",
    icon: BarChart3,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
    hoverGradient: "from-purple-500/10",
    title: "Project Analytics Dashboard",
    description:
      "Track your projects with real-time analytics, technology trends, and popular stack combinations.",
    bullets: ["Real-time project tracking", "Technology distribution charts", "Privacy-first (local storage)"],
    cta: "Try Analytics",
  },
  {
    tab: "diagram",
    icon: Workflow,
    iconColor: "text-foreground",
    iconBg: "bg-foreground/10",
    hoverGradient: "from-foreground/10",
    title: "Live Topology & ADR Exporter",
    description:
      "Inspect full-stack pipeline topology with zero runtime dependencies. Export GitHub-ready Mermaid syntax, vector SVGs, and formal Architecture Decision Records.",
    bullets: ["Vector pipeline topology graph", "Mermaid.js diagram syntax export", "Downloadable ADR-001 documentation"],
    cta: "View Topology",
  },
];

export const TECH_OPTION_CATEGORIES: TechOptionCategory[] = [
  {
    icon: Terminal,
    title: "Application Runtimes",
    subtitle: "Language runtime & framework",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    items: [
      { icon: Terminal, label: "Node.js + TypeScript", tag: "Popular" },
      { icon: Cpu, label: "Python", tag: "Data & AI" },
      { icon: Layers, label: "Java + Maven", tag: "Enterprise" },
      { icon: Box, label: "Go", tag: "Cloud Native" },
    ],
  },
  {
    icon: GitBranch,
    title: "CI/CD Platforms",
    subtitle: "Continuous integration & delivery",
    iconColor: "text-cyan-500",
    iconBg: "bg-cyan-500/10",
    items: [
      { icon: Github, label: "GitHub Actions", tag: "Popular" },
      { icon: Server, label: "GitLab CI" },
      { icon: Settings2, label: "Jenkins" },
      { icon: Workflow, label: "Azure Pipelines" },
    ],
  },
  {
    icon: Layers,
    title: "Infrastructure as Code",
    subtitle: "Terraform modules & cloud topology",
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
    items: [
      { icon: Cloud, label: "AWS VPC + EKS", tag: "Production" },
      { icon: Cloud, label: "Azure VNet + AKS", tag: "Enterprise" },
      { icon: Cloud, label: "GCP VPC + GKE", tag: "Cloud Native" },
      { icon: Layers, label: "Multi-Cloud Terraform", tag: "Universal" },
    ],
  },
  {
    icon: Container,
    title: "Deployment Strategies",
    subtitle: "Zero-downtime release methods",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    items: [
      { icon: RefreshCw, label: "Blue-Green", tag: "Zero Downtime" },
      { icon: Ship, label: "Canary Rollouts", tag: "Progressive" },
      { icon: GitBranch, label: "GitOps ArgoCD", tag: "Recommended" },
      { icon: Container, label: "Rolling Updates", tag: "Standard" },
    ],
  },
  {
    icon: Activity,
    title: "Observability Stack",
    subtitle: "Metrics, tracing & dashboards",
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    items: [
      { icon: BarChart3, label: "Prometheus + Grafana", tag: "Standard" },
      { icon: Activity, label: "OpenTelemetry + Jaeger", tag: "Tracing" },
      { icon: FileText, label: "ELK Stack", tag: "Centralized" },
      { icon: Monitor, label: "DataDog APM", tag: "Enterprise" },
    ],
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    subtitle: "Hardened security benchmarks",
    iconColor: "text-red-500",
    iconBg: "bg-red-500/10",
    items: [
      { icon: ShieldCheck, label: "NIST CSF Framework", tag: "Recommended" },
      { icon: ShieldAlert, label: "Zero Trust Architecture", tag: "Strict" },
      { icon: Shield, label: "CIS Benchmarks", tag: "Hardened" },
      { icon: ShieldCheck, label: "SOC2 Compliance", tag: "Audited" },
    ],
  },
];

export const PROJECT_STRUCTURE: ProjectStructureItem[] = [
  { indent: 1, icon: "📁", name: "app/", desc: "Application source code" },
  { indent: 1, icon: "📁", name: "ci/", desc: "CI/CD pipelines" },
  { indent: 1, icon: "📁", name: "infra/", desc: "Infrastructure as Code" },
  { indent: 1, icon: "📁", name: "deploy/", desc: "Dockerfiles & Compose" },
  { indent: 1, icon: "📁", name: "k8s/", desc: "Kubernetes manifests" },
  { indent: 1, icon: "📁", name: "monitoring/", desc: "Logs, metrics & alerts" },
  { indent: 1, icon: "📁", name: "security/", desc: "Policies & scanning" },
  { indent: 1, icon: "📁", name: "scripts/", desc: "Setup & deploy scripts" },
  { indent: 1, icon: "📄", name: "Makefile", desc: "Build automation" },
  { indent: 1, icon: "📄", name: "README.md", desc: "Project documentation" },
  { indent: 1, icon: "📄", name: ".gitignore", desc: "Git ignore rules" },
];

export const OUTPUT_HIGHLIGHTS: FeatureItem[] = [
  {
    icon: FileCode2,
    title: "Production-Ready Code",
    description:
      "Every generated file follows best practices — health checks, non-root users, resource limits, proper logging.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: FolderTree,
    title: "Organized Structure",
    description:
      "Clean separation of concerns: app code, CI/CD, infra, deployment, monitoring, and security in dedicated directories.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: Settings2,
    title: "Fully Customizable",
    description:
      "Every option is configurable. Mix Docker with Terraform, GitHub Actions with Strict security — any combination works.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: Zap,
    title: "Instant Download",
    description:
      "Generate and download your entire project as a ZIP file. No sign-up, no API keys, no waiting.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

export const AUTHOR_STATS: AuthorStat[] = [
  { label: "Open Source", value: "50+", sub: "Projects" },
  { label: "Community", value: "10K+", sub: "Members" },
  { label: "Experience", value: "5+", sub: "Years" },
];

export const AUTHOR_SOCIAL_LINKS: SocialLink[] = [
  { href: "https://github.com/NotHarshhaa", label: "GitHub", icon: Github, variant: "default" },
  { href: "https://www.linkedin.com/in/NotHarshhaa/", label: "LinkedIn", icon: Linkedin, variant: "outline" },
  { href: "https://notharshhaa.site", label: "Portfolio", icon: Globe, variant: "outline" },
  { href: "https://t.me/prodevopsguy", label: "Telegram", icon: Send, variant: "outline" },
];

export { ArrowRight };
