import { ProjectConfig } from "@/lib/types";

export type DependencyType = "required" | "recommended" | "conflict" | "warning";
export type ImpactLevel = "low" | "medium" | "high";

export interface Dependency {
  from: string;
  to: string;
  type: DependencyType;
  reason: string;
  fix?: string;
  impact?: ImpactLevel;
}

export interface ComplexityMetrics {
  score: number;
  level: "Simple" | "Moderate" | "Complex" | "Expert";
  color: string;
  bgColor: string;
  estimatedTime: string;
  teamSize: string;
  monthlyCost: string;
}

export interface ConfigOptimization {
  type: string;
  title: string;
  description: string;
  savings: string;
  difficulty: string;
}

export interface AdvancedConfigBuilderProps {
  config: ProjectConfig;
  onConfigChange?: (config: ProjectConfig) => void;
  onNavigateToGenerator?: () => void;
}
