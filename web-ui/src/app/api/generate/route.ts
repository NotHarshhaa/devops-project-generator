import { NextRequest } from "next/server";
import { generateProject } from "@/lib/generator";
import { ProjectConfig } from "@/lib/types";
import { validateProjectConfig } from "@/lib/validation";
import { apiSuccess, apiError } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const config = (await request.json()) as Partial<ProjectConfig>;
    const validation = validateProjectConfig(config);

    if (!validation.valid) {
      return apiError(validation.errors[0]?.message ?? "Invalid configuration", 400, {
        errors: validation.errors,
        code: "VALIDATION_ERROR",
      });
    }

    const result = generateProject(config as ProjectConfig);
    return apiSuccess(result);
  } catch (error) {
    console.error("Generation error:", error);
    return apiError("Failed to generate project", 500, { code: "GENERATION_ERROR" });
  }
}

export async function GET() {
  return apiSuccess({
    message: "POST a ProjectConfig JSON body to generate a project",
    example: {
      projectName: "my-devops-project",
      pipeline: "nodejs-typescript",
      ci: "github-actions",
      infra: "aws-vpc-eks",
      deploy: "blue-green",
      envs: "dev,stage,prod",
      observability: "prometheus-grafana",
      security: "nist-csf",
    },
  });
}
