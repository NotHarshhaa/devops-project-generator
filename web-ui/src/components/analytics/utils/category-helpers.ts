import {
  GitBranch,
  Layers,
  Package,
  Activity,
  Shield,
  Zap,
  TrendingUp,
  Minus,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export function getCategoryIcon(category: string) {
  switch (category) {
    case "ci-cd":
      return GitBranch;
    case "infrastructure":
      return Layers;
    case "deployment":
      return Package;
    case "observability":
      return Activity;
    case "security":
      return Shield;
    default:
      return Zap;
  }
}

export function getCategoryColor(category: string) {
  switch (category) {
    case "ci-cd":
      return "text-blue-500";
    case "infrastructure":
      return "text-purple-500";
    case "deployment":
      return "text-cyan-500";
    case "observability":
      return "text-amber-500";
    case "security":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
}

export function getPerformanceIcon(metric: string, value: number) {
  if (metric === "errorRate") {
    return value < 5 ? CheckCircle2 : AlertTriangle;
  }
  return value > 0 ? TrendingUp : Minus;
}

export function getPerformanceColor(metric: string, value: number) {
  if (metric === "errorRate") {
    return value < 5 ? "text-green-500" : "text-red-500";
  }
  return value > 0 ? "text-green-500" : "text-gray-500";
}
