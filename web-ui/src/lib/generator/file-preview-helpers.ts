import { ProjectConfig } from "@/lib/types";
import { generateEnhancedProject } from "./generate-project";

export interface PreviewableFile {
  name: string;
  path: string;
  relativePath: string;
  category: "infra" | "deploy" | "ci" | "security" | "observability" | "scripts" | "app" | "docs";
  categoryLabel: string;
  language: "yaml" | "hcl" | "dockerfile" | "markdown" | "makefile" | "shell" | "json" | "toml";
  content: string;
  lineCount: number;
  sizeBytes: number;
  description: string;
  badge?: string;
}

export function detectLanguage(path: string): PreviewableFile["language"] {
  const lower = path.toLowerCase();
  if (lower.endsWith(".yml") || lower.endsWith(".yaml")) return "yaml";
  if (lower.endsWith(".tf") || lower.endsWith(".tofu") || lower.endsWith(".hcl")) return "hcl";
  if (lower.includes("dockerfile")) return "dockerfile";
  if (lower.endsWith(".md")) return "markdown";
  if (lower.endsWith(".sh") || lower.endsWith(".bash") || lower.endsWith(".ps1")) return "shell";
  if (lower.endsWith(".json")) return "json";
  if (lower.endsWith(".toml")) return "toml";
  if (lower.includes("makefile")) return "makefile";
  return "yaml";
}

export function detectCategory(path: string): {
  category: PreviewableFile["category"];
  categoryLabel: string;
} {
  const lower = path.toLowerCase();

  if (
    lower.includes("infracost") ||
    lower.includes("gitleaks") ||
    lower.includes("cosign") ||
    lower.includes("sbom") ||
    lower.includes("scorecard") ||
    lower.includes("dependabot") ||
    lower.includes("security") ||
    lower.includes(".pre-commit")
  ) {
    return { category: "security", categoryLabel: "Security & FinOps" };
  }

  if (
    lower.includes("infra/") ||
    lower.includes("terraform") ||
    lower.includes("opentofu") ||
    lower.includes("crossplane") ||
    lower.endsWith(".tf") ||
    lower.endsWith(".tofu")
  ) {
    return { category: "infra", categoryLabel: "IaC & Cloud" };
  }

  if (
    lower.includes("deploy/") ||
    lower.includes("k8s/") ||
    lower.includes("helm") ||
    lower.includes("argocd") ||
    lower.includes("docker-compose") ||
    lower.includes("gateway") ||
    lower.includes("keda")
  ) {
    return { category: "deploy", categoryLabel: "Deploy & K8s" };
  }

  if (
    lower.includes(".github/workflows") ||
    lower.includes("ci/") ||
    lower.includes(".gitlab-ci") ||
    lower.includes("jenkins") ||
    lower.includes("argo/")
  ) {
    return { category: "ci", categoryLabel: "CI/CD Workflows" };
  }

  if (
    lower.includes("monitoring/") ||
    lower.includes("prometheus") ||
    lower.includes("grafana") ||
    lower.includes("otel") ||
    lower.includes("jaeger") ||
    lower.includes("datadog")
  ) {
    return { category: "observability", categoryLabel: "Observability" };
  }

  if (lower.includes("scripts/") || lower.includes("bootstrap") || lower.includes("teardown")) {
    return { category: "scripts", categoryLabel: "Dev Scripts" };
  }

  if (lower.endsWith(".md") || lower.includes("docs/")) {
    return { category: "docs", categoryLabel: "Documentation" };
  }

  return { category: "app", categoryLabel: "App & Sandbox" };
}

export function getFileDescription(path: string): string {
  const lower = path.toLowerCase();

  if (lower.includes("main.tofu")) {
    return "OpenTofu 1.8+ IaC with native PBKDF2 state encryption and AWS EKS modules.";
  }
  if (lower.includes("main.tf")) {
    return "Terraform infrastructure module defining VPC, subnets, and managed Kubernetes cluster.";
  }
  if (lower.includes("xrd-infrastructure")) {
    return "Crossplane CompositeResourceDefinition for Kubernetes-native cloud resources.";
  }
  if (lower.includes("claim-production")) {
    return "Crossplane infrastructure claim deploying production cluster without state lock.";
  }
  if (lower.includes("infracost.yml") || (lower.includes("infracost") && lower.endsWith(".yml"))) {
    return "FinOps PR workflow calculating real-time infrastructure cost differences on code changes.";
  }
  if (lower.includes("keda-scaledobject")) {
    return "KEDA ScaledObject autoscaling pods from 0-20 based on Prometheus traffic metrics.";
  }
  if (lower.includes("gateway.yaml")) {
    return "Kubernetes Gateway API v1 with Gateway and HTTPRoute traffic distribution.";
  }
  if (lower.includes("applicationset.yaml")) {
    return "ArgoCD ApplicationSet automating multi-environment GitOps cluster deployments.";
  }
  if (lower.includes("otel-collector")) {
    return "OpenTelemetry Collector pipeline with OTLP gRPC/HTTP, Prometheus, and Jaeger.";
  }
  if (lower.includes("instrumentation.yaml")) {
    return "OpenTelemetry Operator CRD for zero-code automatic distributed tracing.";
  }
  if (lower.includes("cosign-sign.yml")) {
    return "Sigstore Cosign keyless OIDC signing ensuring tamper-proof container provenance.";
  }
  if (lower.includes("syft-sbom.yml")) {
    return "Automated CycloneDX & SPDX Software Bill of Materials (SBOM) generation.";
  }
  if (lower.includes(".gitleaks.toml")) {
    return "Gitleaks pre-commit rules preventing hardcoded API tokens and private keys.";
  }
  if (lower.includes("security-policies.yaml")) {
    return "Kubernetes PodDisruptionBudget, default-deny NetworkPolicy, and least-privilege RBAC.";
  }
  if (lower.includes("bootstrap-local.sh")) {
    return "One-click script provisioning a local Kind cluster and loading Docker manifests in 60s.";
  }
  if (lower.includes("cost-estimate.sh")) {
    return "Local FinOps script computing cloud infrastructure breakdown before git push.";
  }
  if (lower.includes("devcontainer.json")) {
    return "VS Code DevContainer sandbox pre-loaded with Docker, Kubectl, Terraform, and Helm.";
  }
  if (lower.includes("dockerfile")) {
    return "Multi-stage production container build stripping build tools for minimal attack surface.";
  }
  if (lower.includes("docker-compose.yml")) {
    return "Local multi-container stack provisioning app, PostgreSQL, and Redis cache.";
  }
  if (lower.includes("prometheus.yml") || lower.includes("alerts.yml")) {
    return "Prometheus scrape configurations and alerting rules for SLO and latency monitoring.";
  }
  if (lower.includes("ci.yml")) {
    return "CI/CD pipeline orchestrating test, linting, container builds, and security scans.";
  }
  if (lower.includes("scorecard.yml")) {
    return "OpenSSF Supply Chain Security Scorecard evaluating repository security posture.";
  }
  if (lower.includes(".pre-commit-config.yaml")) {
    return "Pre-commit hooks enforcing YAML linting, Terraform docs, and secret prevention.";
  }
  if (lower.includes(".dependabot.yml")) {
    return "Automated weekly dependency security updates for Actions, Docker, and Terraform.";
  }
  if (lower.includes("readme.md")) {
    return "Comprehensive documentation with quickstart, architecture map, and runbooks.";
  }

  return "Production-ready DevOps configuration artifact compiled for your active stack.";
}

export function getPreviewableFiles(config: ProjectConfig): PreviewableFile[] {
  const result = generateEnhancedProject(config);
  const files = result.files.filter((f) => f.type === "file");

  const previewable: PreviewableFile[] = [];

  for (const file of files) {
    const { category, categoryLabel } = detectCategory(file.path);
    const lang = detectLanguage(file.path);
    const desc = getFileDescription(file.path);
    const parts = file.path.split("/");
    const filename = parts.pop() || "manifest";
    const relativePath = parts.slice(1).join("/") ? `${parts.slice(1).join("/")}/${filename}` : filename;

    previewable.push({
      name: filename,
      path: file.path,
      relativePath,
      category,
      categoryLabel,
      language: lang,
      content: file.content,
      lineCount: file.content ? file.content.split("\n").length : 0,
      sizeBytes: new TextEncoder().encode(file.content || "").length,
      description: desc,
    });
  }

  // Sort logically: Infrastructure, Deployment, Security/FinOps, CI, Observability, Scripts, App, Docs
  const categoryOrder: Record<PreviewableFile["category"], number> = {
    infra: 1,
    deploy: 2,
    security: 3,
    ci: 4,
    observability: 5,
    scripts: 6,
    app: 7,
    docs: 8,
  };

  previewable.sort((a, b) => {
    const catDiff = (categoryOrder[a.category] || 99) - (categoryOrder[b.category] || 99);
    if (catDiff !== 0) return catDiff;
    return a.name.localeCompare(b.name);
  });

  return previewable;
}
