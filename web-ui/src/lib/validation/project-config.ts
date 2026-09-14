import { ProjectConfig } from "../types";
import { steps } from "../options/steps";
import { getOptionsForStep } from "../options/get-options";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

const PROJECT_NAME_PATTERN = /^[a-zA-Z0-9_-]+$/;
const MAX_PROJECT_NAME_LENGTH = 50;

export function validateProjectName(name: string): ValidationError | null {
  if (!name || !name.trim()) {
    return { field: "projectName", message: "Project name is required" };
  }
  if (name.length > MAX_PROJECT_NAME_LENGTH) {
    return { field: "projectName", message: `Project name too long (max ${MAX_PROJECT_NAME_LENGTH} characters)` };
  }
  if (!PROJECT_NAME_PATTERN.test(name)) {
    return {
      field: "projectName",
      message: "Project name can only contain letters, numbers, hyphens, and underscores",
    };
  }
  return null;
}

const ALIAS_MAP: Record<string, string> = {
  "docker-multi-stage": "docker-multistage",
  "terraform-multi-cloud": "multicloud-terraform",
  "kubernetes-on-prem": "kubernetes-onprem",
  "ecs-fargate": "aws-ecs-fargate",
  "soc2-compliance": "soc2",
  "gdpr-compliance": "gdpr",
  "hipaa-compliance": "hipaa",
};

export function validateProjectConfig(config: Partial<ProjectConfig>): ValidationResult {
  const errors: ValidationError[] = [];

  const nameError = validateProjectName(config.projectName ?? "");
  if (nameError) errors.push(nameError);

  for (const step of steps) {
    if (step.field === "projectName") continue;

    let value = config[step.field];
    if (value === undefined || (typeof value === "string" && !value.trim())) {
      errors.push({ field: step.field, message: `${step.title} is required` });
      continue;
    }

    if (typeof value === "string" && ALIAS_MAP[value]) {
      value = ALIAS_MAP[value] as any;
      (config as any)[step.field] = value;
    }

    const options = getOptionsForStep(step.id);
    if (options.length > 0 && !options.some((o) => o.value === value)) {
      errors.push({ field: step.field, message: `Invalid value for ${step.title}` });
    }
  }

  return { valid: errors.length === 0, errors };
}

export function canProceedToNextStep(config: ProjectConfig, stepIndex: number): boolean {
  const step = steps[stepIndex];
  if (!step) return false;

  const value = config[step.field];
  if (step.field === "projectName") {
    return validateProjectName(String(value ?? "")) === null;
  }
  return value !== undefined && value !== "";
}
