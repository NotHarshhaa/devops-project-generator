import { ProjectConfig } from "@/lib/types";

export interface CostEstimate {
  component: string;
  monthlyCost: number;
  category: "infrastructure" | "observability" | "ci-cd" | "security" | "storage" | "network";
  icon: React.ElementType;
  description: string;
  variables: string[];
}

export interface CostOptimization {
  title: string;
  description: string;
  savings: number;
  difficulty: "easy" | "medium" | "hard";
  impact: "low" | "medium" | "high";
  roi: string;
  implementation: string;
  risk: "low" | "medium" | "high";
}

export interface CostOptimizerProps {
  config: ProjectConfig;
}
