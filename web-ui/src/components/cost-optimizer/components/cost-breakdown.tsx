import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PieChart } from "lucide-react";
import { CostEstimate } from "../types";
import { getCategoryColor } from "../utils/badges";

interface CostBreakdownProps {
  costEstimates: CostEstimate[];
  totalMonthlyCost: number;
}

export function CostBreakdown({ costEstimates, totalMonthlyCost }: CostBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <PieChart className="h-4 w-4" />
          Detailed Cost Breakdown
        </CardTitle>
        <CardDescription className="text-xs">
          Estimated monthly costs by component with variables
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {costEstimates.map((estimate, idx) => {
              const Icon = estimate.icon;
              const percentage =
                totalMonthlyCost > 0 ? (estimate.monthlyCost / totalMonthlyCost) * 100 : 0;

              return (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${getCategoryColor(estimate.category)}`} />
                      <span className="font-medium">{estimate.component}</span>
                      <Badge variant="outline" className="text-[10px] px-1.5">
                        {estimate.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">${estimate.monthlyCost.toFixed(0)}/mo</span>
                      <span className="text-xs text-muted-foreground">
                        ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">{estimate.description}</p>
                  <div className="flex items-center gap-2 ml-6">
                    <span className="text-xs text-muted-foreground">Variables:</span>
                    {estimate.variables.map((variable, vIdx) => (
                      <Badge key={vIdx} variant="outline" className="text-[9px] px-1">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        estimate.category === "infrastructure"
                          ? "bg-purple-500"
                          : estimate.category === "observability"
                            ? "bg-amber-500"
                            : estimate.category === "ci-cd"
                              ? "bg-blue-500"
                              : estimate.category === "security"
                                ? "bg-red-500"
                                : estimate.category === "storage"
                                  ? "bg-green-500"
                                  : estimate.category === "network"
                                    ? "bg-cyan-500"
                                    : "bg-gray-500"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
