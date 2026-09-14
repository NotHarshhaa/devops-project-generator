import { OptionCard } from "../types";
import {
  pipelineOptions,
  ciOptions,
  infraOptions,
  deployOptions,
  envOptions,
  observabilityOptions,
  securityOptions,
  devcontainerOptions,
} from "./choices";

const optionsByStep: Record<string, OptionCard[]> = {
  pipeline: pipelineOptions,
  ci: ciOptions,
  infra: infraOptions,
  deploy: deployOptions,
  envs: envOptions,
  observability: observabilityOptions,
  security: securityOptions,
  devcontainer: devcontainerOptions,
};

export function getOptionsForStep(stepId: string): OptionCard[] {
  return optionsByStep[stepId] ?? [];
}
