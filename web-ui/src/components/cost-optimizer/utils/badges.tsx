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
      return "text-muted-foreground";
  }
}

export function getCategoryBarColor(category: string) {
  switch (category) {
    case "infrastructure":
      return "bg-purple-500";
    case "observability":
      return "bg-amber-500";
    case "ci-cd":
      return "bg-blue-500";
    case "security":
      return "bg-red-500";
    case "storage":
      return "bg-green-500";
    case "network":
      return "bg-cyan-500";
    default:
      return "bg-brand";
  }
}

export function getDifficultyBadge(difficulty: string) {
  switch (difficulty) {
    case "easy":
      return <Badge className="bg-emerald-500/10 text-emerald-500 border-0 text-[10px]">Easy</Badge>;
    case "medium":
      return <Badge className="bg-amber-500/10 text-amber-500 border-0 text-[10px]">Medium</Badge>;
    case "hard":
      return <Badge className="bg-red-500/10 text-red-500 border-0 text-[10px]">Hard</Badge>;
  }
}

export function getImpactBadge(impact: string) {
  switch (impact) {
    case "low":
      return <Badge variant="outline" className="text-[10px] border-border/80">Low impact</Badge>;
    case "medium":
      return <Badge variant="outline" className="text-[10px] border-border/80">Medium impact</Badge>;
    case "high":
      return <Badge variant="outline" className="text-[10px] border-brand/30 text-brand">High impact</Badge>;
  }
}

export function getRiskBadge(risk: string) {
  switch (risk) {
    case "low":
      return <Badge className="bg-emerald-500/10 text-emerald-500 border-0 text-[10px]">Low risk</Badge>;
    case "medium":
      return <Badge className="bg-amber-500/10 text-amber-500 border-0 text-[10px]">Medium risk</Badge>;
    case "high":
      return <Badge className="bg-red-500/10 text-red-500 border-0 text-[10px]">High risk</Badge>;
  }
}
