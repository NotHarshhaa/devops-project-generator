import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Target, BarChart3 } from "lucide-react";

interface CostSummaryCardsProps {
  totalMonthlyCost: number;
  totalPotentialSavings: number;
  optimizedCost: number;
}

export function CostSummaryCards({
  totalMonthlyCost,
  totalPotentialSavings,
  optimizedCost,
}: CostSummaryCardsProps) {
  return (
    <div className="grid md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="text-xs">Current Estimate</CardDescription>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            ${totalMonthlyCost.toFixed(0)}
            <span className="text-sm font-normal text-muted-foreground">/mo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            Based on 2024 pricing
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="text-xs">Potential Savings</CardDescription>
          <CardTitle className="text-2xl font-bold flex items-center gap-2 text-green-500">
            ${totalPotentialSavings.toFixed(0)}
            <span className="text-sm font-normal text-muted-foreground">/mo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-xs text-green-500">
            <TrendingDown className="h-3 w-3" />
            {((totalPotentialSavings / totalMonthlyCost) * 100).toFixed(0)}% reduction
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <CardDescription className="text-xs">Optimized Cost</CardDescription>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            ${optimizedCost.toFixed(0)}
            <span className="text-sm font-normal text-muted-foreground">/mo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-xs text-primary">
            <Target className="h-3 w-3" />
            After optimizations
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="text-xs">Annual Savings</CardDescription>
          <CardTitle className="text-2xl font-bold flex items-center gap-2 text-blue-500">
            ${(totalPotentialSavings * 12).toFixed(0)}
            <span className="text-sm font-normal text-muted-foreground">/yr</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-xs text-blue-500">
            <BarChart3 className="h-3 w-3" />
            Total yearly impact
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
