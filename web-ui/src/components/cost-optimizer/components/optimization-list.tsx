import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Wrench, Target, Clock, ArrowRight } from "lucide-react";
import { CostOptimization } from "../types";
import { getDifficultyBadge, getImpactBadge, getRiskBadge } from "../utils/badges";

interface OptimizationListProps {
  optimizations: CostOptimization[];
}

export function OptimizationList({ optimizations }: OptimizationListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          Optimization Recommendations
        </CardTitle>
        <CardDescription className="text-xs">
          {optimizations.length} data-driven ways to reduce your monthly costs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {optimizations.map((opt, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-sm">{opt.title}</h4>
                    {getDifficultyBadge(opt.difficulty)}
                    {getImpactBadge(opt.impact)}
                    {getRiskBadge(opt.risk)}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{opt.description}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Wrench className="h-3 w-3" />
                      <span className="font-medium">Implementation:</span>
                      <span>{opt.implementation}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      <span className="font-medium">ROI:</span>
                      <span className="text-green-600">{opt.roi}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-bold text-green-500">-${opt.savings}</div>
                  <div className="text-[10px] text-muted-foreground">per month</div>
                  <div className="text-[10px] text-blue-600 font-medium">
                    ${(opt.savings * 12).toFixed(0)}/yr
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    Implementation time:{" "}
                    {opt.difficulty === "easy"
                      ? "1-2 weeks"
                      : opt.difficulty === "medium"
                        ? "1-2 months"
                        : "3-6 months"}
                  </span>
                </div>
                <Button variant="outline" size="sm" className="text-xs">
                  <ArrowRight className="h-3 w-3 mr-1" />
                  Learn more
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
