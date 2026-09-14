import { ProjectConfig, GeneratedFile } from "@/lib/types";
import { generateEnhancedProject } from "./generate-project";

export interface PreviewableFile {
  name: string;
  path: string;
  category: "ci" | "infra" | "deploy" | "app" | "security" | "observability" | "docs";
  language: "yaml" | "hcl" | "dockerfile" | "markdown" | "makefile" | "shell" | "json";
  content: string;
  lineCount: number;
}

export function getPreviewableFiles(config: ProjectConfig): PreviewableFile[] {
  const result = generateEnhancedProject(config);
  const files = result.files.filter((f) => f.type === "file");

  // Select top key files across all DevOps domains
  const previewPaths = [
    { match: ".github/workflows/ci.yml", category: "ci" as const, language: "yaml" as const },
    { match: "terraform/main.tf", category: "infra" as const, language: "hcl" as const },
    { match: "Dockerfile", category: "app" as const, language: "dockerfile" as const },
    { match: "docker-compose.yml", category: "deploy" as const, language: "yaml" as const },
    { match: "k8s/deployment.yaml", category: "deploy" as const, language: "yaml" as const },
    { match: "monitoring/prometheus.yml", category: "observability" as const, language: "yaml" as const },
    { match: "security/policy.json", category: "security" as const, language: "json" as const },
    { match: "Makefile", category: "app" as const, language: "makefile" as const },
    { match: "README.md", category: "docs" as const, language: "markdown" as const },
  ];

  const matched: PreviewableFile[] = [];

  for (const p of previewPaths) {
    const file = files.find((f) => f.path.endsWith(p.match));
    if (file) {
      matched.push({
        name: file.path.split("/").pop() || p.match,
        path: file.path,
        category: p.category,
        language: p.language,
        content: file.content,
        lineCount: file.content.split("\n").length,
      });
    }
  }

  // Fallback: if fewer than 4 matched, fill with other available files
  if (matched.length < 4) {
    for (const f of files) {
      if (!matched.some((m) => m.path === f.path) && f.content.length > 0) {
        matched.push({
          name: f.path.split("/").pop() || "file",
          path: f.path,
          category: "app",
          language: detectLanguage(f.path),
          content: f.content,
          lineCount: f.content.split("\n").length,
        });
      }
      if (matched.length >= 8) break;
    }
  }

  return matched;
}

export function detectLanguage(path: string): PreviewableFile["language"] {
  if (path.endsWith(".yml") || path.endsWith(".yaml")) return "yaml";
  if (path.endsWith(".tf") || path.endsWith(".hcl")) return "hcl";
  if (path.includes("Dockerfile")) return "dockerfile";
  if (path.endsWith(".md")) return "markdown";
  if (path.endsWith(".sh")) return "shell";
  if (path.endsWith(".json")) return "json";
  if (path.includes("Makefile")) return "makefile";
  return "yaml";
}
