import { ProjectConfig, GenerationResult } from "../types";
import { ApiErrorResponse } from "./types";

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: ApiErrorResponse["errors"]
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    const error = data as ApiErrorResponse;
    throw new ApiClientError(error.error ?? "Request failed", response.status, error.errors);
  }

  return data as T;
}

export async function generateProjectViaApi(config: ProjectConfig): Promise<GenerationResult> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });

  return parseResponse<GenerationResult>(response);
}

export async function checkApiHealth(): Promise<{ status: string; version: string }> {
  const response = await fetch("/api/health");
  return parseResponse(response);
}
