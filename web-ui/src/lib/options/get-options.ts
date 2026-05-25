import { OptionCard } from "../types";
import {
  pipelineOptions,
  ciOptions,
  infraOptions,
  deployOptions,
  envOptions,
  observabilityOptions,
  securityOptions,
} from "./choices";

const optionsByStep: Record<string, OptionCard[]> = {
  pipeline: pipelineOptions,
  ci: ciOptions,
  infra: infraOptions,
  deploy: deployOptions,
  envs: envOptions,
  observability: observabilityOptions,
  security: securityOptions,
};

export function getOptionsForStep(stepId: string): OptionCard[] {
  return optionsByStep[stepId] ?? [];
}
