import { apiSuccess } from "@/lib/api";

export async function GET() {
  return apiSuccess({
    status: "ok",
    version: "2.0.0",
    endpoints: {
      generate: "/api/generate",
      health: "/api/health",
    },
  });
}
