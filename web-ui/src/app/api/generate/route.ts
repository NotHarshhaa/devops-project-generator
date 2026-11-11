import { NextRequest } from "next/server";
import { generateProject } from "@/lib/generator";
import { ProjectConfig } from "@/lib/types";
import { validateProjectConfig } from "@/lib/validation";
import { apiSuccess, apiError } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const summaryOnly = searchParams.get("summaryOnly") === "true";
    const dryRun = searchParams.get("dryRun") === "true";

    const config = (await request.json()) as Partial<ProjectConfig>;
    const validation = validateProjectConfig(config);

    if (!validation.valid) {
      return apiError(validation.errors[0]?.message ?? "Invalid configuration", 400, {
        errors: validation.errors,
        code: "VALIDATION_ERROR",
      });
    }

    if (dryRun) {
      return apiSuccess({
        valid: true,
        projectName: config.projectName,
        message: "Configuration validation and dry-run passed successfully",
      });
    }

    const result = generateProject(config as ProjectConfig);

    if (summaryOnly) {
      return apiSuccess({
        success: true,
        projectName: result.projectName,
        summary: result.summary,
      });
    }

    return apiSuccess(result);
  } catch (error) {
    console.error("Generation error:", error);
    return apiError("Failed to generate project", 500, { code: "GENERATION_ERROR" });
  }
}

export async function GET() {
  return apiSuccess({
    version: "2.1.0",
    engine: "DevOps Project Generator Enhanced Engine",
    capabilities: [
      "Multi-stage Docker builds with non-root security",
      "Infrastructure as Code (Terraform 1.5+ & OpenTofu 1.8+ with State Encryption)",
      "Crossplane Kubernetes-native cloud control plane",
      "GitOps with ArgoCD ApplicationSets",
      "Argo Workflows container-native CI",
      "OpenTelemetry Collector with OTLP tracing, metrics, & logs",
      "FinOps automated cost estimation (Infracost)",
      "Supply chain verification (Sigstore Cosign, Syft SBOM, OpenSSF Scorecard)",
      "KEDA Event-driven Kubernetes Autoscaling",
      "Instant local testing with Kind/K3d bootstrapping",
    ],
    example: {
      projectName: "cloud-native-platform",
      pipeline: "nodejs-typescript",
      ci: "github-actions",
      infra: "opentofu-aws",
      deploy: "gitops-argocd",
      envs: "dev,stage,prod",
      observability: "opentelemetry",
      security: "zero-trust",
      devcontainer: "full",
      securityAddons: ["cosign", "sbom", "trivy", "gitleaks", "rbac", "infracost", "precommit", "dependabot"],
    },
  });
}
