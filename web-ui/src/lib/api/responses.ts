import { NextResponse } from "next/server";
import { ApiErrorResponse } from "./types";
import { ValidationError } from "../validation";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function apiError(
  message: string,
  status = 400,
  options?: { errors?: ValidationError[]; code?: string }
) {
  const body: ApiErrorResponse = { error: message };
  if (options?.errors) body.errors = options.errors;
  if (options?.code) body.code = options.code;
  return NextResponse.json(body, { status });
}
