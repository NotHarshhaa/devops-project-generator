import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PieChart } from "lucide-react";
import { CostEstimate } from "../types";
import { getCategoryColor, getCategoryBarColor } from "../utils/badges";

interface CostBreakdownProps {
  costEstimates: CostEstimate[];
  totalMonthlyCost: number;
}

export function CostBreakdown({ costEstimates, totalMonthlyCost }: CostBreakdownProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 overflow-hidden h-full flex flex-col">
      <div className="px-5 py-4 border-b border-border/60 bg-muted/30">
        <div className="flex items-center gap-2">
          <PieChart className="h-4 w-4 text-brand" />
          <h3 className="text-sm font-semibold">Cost breakdown</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Estimated monthly costs by component
        </p>
      </div>

      <ScrollArea className="flex-1 max-h-[480px]">
        <div className="p-4 sm:p-5 space-y-4">
          {costEstimates.map((estimate, idx) => {
            const Icon = estimate.icon;
            const percentage =
              totalMonthlyCost > 0 ? (estimate.monthlyCost / totalMonthlyCost) * 100 : 0;

            return (
              <div
                key={idx}
                className="rounded-xl border border-border/50 bg-background/50 p-3 sm:p-4 space-y-2.5 transition-colors hover:border-brand/25"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/80 ${getCategoryColor(estimate.category)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-medium text-sm">{estimate.component}</span>
                        <Badge variant="outline" className="text-[9px] px-1.5 font-mono border-border/80">
                          {estimate.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {estimate.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold font-mono text-sm">${estimate.monthlyCost.toFixed(0)}</div>
                    <div className="text-[10px] text-muted-foreground">{percentage.toFixed(1)}%</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {estimate.variables.map((variable, vIdx) => (
                    <Badge key={vIdx} variant="secondary" className="text-[9px] px-1.5 font-mono">
                      {variable}
                    </Badge>
                  ))}
                </div>

                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${getCategoryBarColor(estimate.category)}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
