import { GenerationResult, ProjectConfig } from "../types";
import { ValidationError } from "../validation";

export interface ApiErrorResponse {
  error: string;
  errors?: ValidationError[];
  code?: string;
}

export interface GenerateRequest {
  config: ProjectConfig;
}

export interface GenerateResponse extends GenerationResult {}

export interface HealthResponse {
  status: "ok";
  version: string;
  endpoints: {
    generate: string;
  };
}
