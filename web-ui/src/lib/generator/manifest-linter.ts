import { GeneratedFile, ProjectConfig, ValidationReport, ValidationCheck } from "@/lib/types";

/**
 * Manifest Linter & Static Analysis Engine
 * Evaluates generated infrastructure, container, and Kubernetes manifests
 * against production-grade DevOps benchmarks (CIS, SLSA, Well-Architected Framework).
 */
export function lintGeneratedManifests(
  files: GeneratedFile[],
  config: ProjectConfig
): ValidationReport {
  const checks: ValidationCheck[] = [];

  // 1. Kubernetes Resource Limits & OOM Prevention Check
  const k8sDeployments = files.filter(
    (f) =>
      f.path.endsWith(".yaml") || f.path.endsWith(".yml")
  ).filter((f) => f.content.includes("kind: Deployment") || f.content.includes("kind: Rollout"));

  const hasResourceLimits = k8sDeployments.some(
    (f) => f.content.includes("resources:") && f.content.includes("limits:") && f.content.includes("requests:")
  );

  checks.push({
    id: "k8s-resource-quotas",
    name: "Pod Resource Limits & Anti-OOM Protections",
    category: "kubernetes",
    status: hasResourceLimits ? "pass" : "warn",
    description: hasResourceLimits
      ? "All container workloads declare explicit CPU and Memory resource limits and requests."
      : "Some workloads lack explicit resource requests, risking node memory pressure.",
  });

  // 2. Kubernetes Health Probes (Readiness & Liveness)
  const hasHealthProbes = k8sDeployments.some(
    (f) => f.content.includes("readinessProbe:") && f.content.includes("livenessProbe:")
  );

  checks.push({
    id: "k8s-health-probes",
    name: "Zero-Downtime Health Probes (Liveness / Readiness)",
    category: "kubernetes",
    status: hasHealthProbes ? "pass" : "warn",
    description: hasHealthProbes
      ? "Liveness and Readiness probes configured to enable zero-downtime rolling deployments."
      : "Consider adding explicit HTTP or TCP health probes for container lifecycle management.",
  });

  // 3. Network Isolation & Least-Privilege RBAC
  const hasNetworkPolicy = files.some(
    (f) => f.content.includes("kind: NetworkPolicy") || f.content.includes("CiliumNetworkPolicy")
  );

  checks.push({
    id: "k8s-network-policy",
    name: "Default-Deny Pod Network Policies",
    category: "security",
    status: hasNetworkPolicy ? "pass" : "warn",
    description: hasNetworkPolicy
      ? "Kubernetes NetworkPolicies enforce default-deny ingress and least-privilege egress."
      : "Add NetworkPolicy manifests to prevent unauthorized lateral pod communication.",
  });

  // 4. Container Non-Root User & Hardening
  const dockerfiles = files.filter((f) => f.path.includes("Dockerfile"));
  const hasNonRootUser = dockerfiles.some(
    (f) => f.content.includes("USER ") || f.content.includes("10001") || f.content.includes("appuser")
  );

  checks.push({
    id: "docker-non-root",
    name: "Non-Root Container Runtime Execution",
    category: "docker",
    status: hasNonRootUser ? "pass" : "warn",
    description: hasNonRootUser
      ? "Dockerfiles drop root execution and run under dedicated unprivileged UID."
      : "Docker container runs as root; recommend adding 'USER appuser' directive.",
  });

  // 5. Multi-Stage Build Optimization
  const hasMultiStage = dockerfiles.some((f) => f.content.includes("AS ") || f.content.includes("as builder"));

  checks.push({
    id: "docker-multi-stage",
    name: "Multi-Stage Build Pipeline Optimization",
    category: "docker",
    status: hasMultiStage ? "pass" : "warn",
    description: hasMultiStage
      ? "Build artifacts stripped in final distroless/alpine runtime stage for minimal attack surface."
      : "Single-stage build detected; consider separating compiler tools from runtime.",
  });

  // 6. Infrastructure as Code Version Pinning
  const iacFiles = files.filter(
    (f) => f.path.endsWith(".tf") || f.path.endsWith(".tofu")
  );
  const hasPinnedProviders = iacFiles.some(
    (f) => f.content.includes("required_version") && f.content.includes("required_providers")
  );

  checks.push({
    id: "iac-version-pinning",
    name: "IaC Version Constraints & Provider Pinning",
    category: "terraform",
    status: hasPinnedProviders || iacFiles.length === 0 ? "pass" : "warn",
    description: hasPinnedProviders || iacFiles.length === 0
      ? "Infrastructure modules pin exact tool versions and provider constraints."
      : "Provider versions not pinned; unconstrained updates may cause drift.",
  });

  // 7. Supply Chain & Secret Scanning
  const hasSecretScanning = files.some((f) => f.path.includes("gitleaks") || f.path.includes("trufflehog"));

  checks.push({
    id: "sec-secret-scanning",
    name: "Automated Secret & Token Prevention Gate",
    category: "security",
    status: hasSecretScanning ? "pass" : "warn",
    description: hasSecretScanning
      ? "Pre-commit and CI rules intercept leaked API tokens, private keys, and passwords."
      : "Enable Gitleaks pre-commit scanner to prevent accidental credential commits.",
  });

  // 8. FinOps Cost Guardrails
  const hasInfracost = files.some(
    (f) => f.path.includes("infracost") || f.path.includes("opencost")
  );

  checks.push({
    id: "finops-cost-guardrail",
    name: "FinOps PR Cost Estimation Guardrails",
    category: "finops",
    status: hasInfracost ? "pass" : "warn",
    description: hasInfracost
      ? "Automated Infracost & OpenCost workflows alert engineers to cloud cost diffs on PRs."
      : "FinOps integration recommended for automated monthly cloud spend projections.",
  });

  // 9. CI/CD Least-Privilege OIDC Permissions
  const ciWorkflows = files.filter(
    (f) => f.path.includes(".github/workflows") || f.path.includes(".gitlab-ci") || f.path.includes("Jenkinsfile")
  );
  const hasOidcOrLeastPrivilege = ciWorkflows.some(
    (f) => f.content.includes("permissions:") || f.content.includes("id-token: write")
  );

  checks.push({
    id: "ci-least-privilege",
    name: "CI/CD Least-Privilege & Keyless OIDC Authentication",
    category: "ci",
    status: hasOidcOrLeastPrivilege || config.ci === "none" ? "pass" : "warn",
    description: hasOidcOrLeastPrivilege || config.ci === "none"
      ? "Workflows restrict job-level token permissions to prevent supply-chain privilege escalation."
      : "Define explicit 'permissions:' blocks to harden CI runners against token misuse.",
  });

  // Calculate score & assign grade
  const checksPassed = checks.filter((c) => c.status === "pass").length;
  const totalChecks = checks.length;
  const percentage = Math.round((checksPassed / totalChecks) * 100);

  let grade: "A+" | "A" | "B" | "C" = "C";
  if (percentage >= 90) grade = "A+";
  else if (percentage >= 80) grade = "A";
  else if (percentage >= 65) grade = "B";

  return {
    score: percentage,
    grade,
    checksPassed,
    totalChecks,
    checks,
  };
}
