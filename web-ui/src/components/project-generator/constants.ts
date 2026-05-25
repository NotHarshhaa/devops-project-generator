import {
  FolderOpen,
  Terminal,
  GitBranch,
  Layers,
  Package,
  Cpu,
  Activity,
  Shield,
} from "lucide-react";

export { DEFAULT_PROJECT_CONFIG as DEFAULT_CONFIG } from "@/lib/constants";

export const STEP_ICONS: Record<string, React.ElementType> = {
  project: FolderOpen,
  pipeline: Terminal,
  ci: GitBranch,
  infra: Layers,
  deploy: Package,
  envs: Cpu,
  observability: Activity,
  security: Shield,
};

export const QUICK_START_TEMPLATES = [
  { name: "web-app", desc: "Web Application", iconKey: "code" as const },
  { name: "api-service", desc: "API Microservice", iconKey: "database" as const },
  { name: "infra-platform", desc: "Infrastructure Platform", iconKey: "cloud" as const },
  { name: "data-pipeline", desc: "Data Pipeline", iconKey: "settings" as const },
];
