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
      return "text-brand";
  }
}

export function getCategoryBgColor(category: string) {
  switch (category) {
    case "ci-cd":
      return "bg-blue-500/10";
    case "infrastructure":
      return "bg-purple-500/10";
    case "deployment":
      return "bg-cyan-500/10";
    case "observability":
      return "bg-amber-500/10";
    case "security":
      return "bg-red-500/10";
    default:
      return "bg-brand/10";
  }
}

export function getCategoryBarColor(category: string) {
  switch (category) {
    case "ci-cd":
      return "bg-blue-500";
    case "infrastructure":
      return "bg-purple-500";
    case "deployment":
      return "bg-cyan-500";
    case "observability":
      return "bg-amber-500";
    case "security":
      return "bg-red-500";
    default:
      return "bg-brand";
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
