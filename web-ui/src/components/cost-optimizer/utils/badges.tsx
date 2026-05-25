import { Badge } from "@/components/ui/badge";

export function getCategoryColor(category: string) {
  switch (category) {
    case "infrastructure":
      return "text-purple-500";
    case "observability":
      return "text-amber-500";
    case "ci-cd":
      return "text-blue-500";
    case "security":
      return "text-red-500";
    case "storage":
      return "text-green-500";
    case "network":
      return "text-cyan-500";
    default:
      return "text-gray-500";
  }
}

export function getDifficultyBadge(difficulty: string) {
  switch (difficulty) {
    case "easy":
      return <Badge className="bg-green-500/10 text-green-500 border-0">Easy</Badge>;
    case "medium":
      return <Badge className="bg-amber-500/10 text-amber-500 border-0">Medium</Badge>;
    case "hard":
      return <Badge className="bg-red-500/10 text-red-500 border-0">Hard</Badge>;
  }
}

export function getImpactBadge(impact: string) {
  switch (impact) {
    case "low":
      return <Badge variant="outline" className="text-xs">Low Impact</Badge>;
    case "medium":
      return <Badge variant="outline" className="text-xs">Medium Impact</Badge>;
    case "high":
      return <Badge variant="outline" className="text-xs">High Impact</Badge>;
  }
}

export function getRiskBadge(risk: string) {
  switch (risk) {
    case "low":
      return <Badge className="bg-green-500/10 text-green-500 border-0 text-xs">Low Risk</Badge>;
    case "medium":
      return <Badge className="bg-amber-500/10 text-amber-500 border-0 text-xs">Medium Risk</Badge>;
    case "high":
      return <Badge className="bg-red-500/10 text-red-500 border-0 text-xs">High Risk</Badge>;
  }
}
