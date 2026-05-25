import { TrendingDown, TrendingUp, Target, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CostSummaryCardsProps {
  totalMonthlyCost: number;
  totalPotentialSavings: number;
  optimizedCost: number;
}

const cards = [
  {
    key: "current",
    label: "Current estimate",
    icon: TrendingUp,
    accent: "text-brand",
    border: "border-brand/20",
    bg: "bg-brand/5",
    sub: "Based on 2024 pricing",
    subClass: "text-muted-foreground",
  },
  {
    key: "savings",
    label: "Potential savings",
    icon: TrendingDown,
    accent: "text-emerald-500",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
    sub: "Monthly reduction",
    subClass: "text-emerald-500",
  },
  {
    key: "optimized",
    label: "Optimized cost",
    icon: Target,
    accent: "text-cyan-500",
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/5",
    sub: "After optimizations",
    subClass: "text-cyan-500",
    highlight: true,
  },
  {
    key: "annual",
    label: "Annual savings",
    icon: BarChart3,
    accent: "text-amber-500",
    border: "border-amber-500/20",
    bg: "bg-amber-500/5",
    sub: "Total yearly impact",
    subClass: "text-amber-500",
  },
] as const;

export function CostSummaryCards({
  totalMonthlyCost,
  totalPotentialSavings,
  optimizedCost,
}: CostSummaryCardsProps) {
  const values = {
    current: totalMonthlyCost,
    savings: totalPotentialSavings,
    optimized: optimizedCost,
    annual: totalPotentialSavings * 12,
  };

  const savingsPercent =
    totalMonthlyCost > 0 ? ((totalPotentialSavings / totalMonthlyCost) * 100).toFixed(0) : "0";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => {
      const { key, label, icon: Icon, accent, border, bg, sub, subClass } = card;
      const highlight = "highlight" in card && card.highlight;

      return (
        <div
          key={key}
          className={cn(
            "rounded-2xl border p-4 sm:p-5 transition-colors hover:border-brand/30",
            border,
            bg,
            highlight && "brand-glow"
          )}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl bg-background/60", accent)}>
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
              {label}
            </span>
          </div>
          <div className={cn("text-2xl sm:text-3xl font-bold font-mono tracking-tight", accent)}>
            ${values[key].toFixed(0)}
            {key !== "annual" && (
              <span className="text-sm font-normal text-muted-foreground ml-1">/mo</span>
            )}
            {key === "annual" && (
              <span className="text-sm font-normal text-muted-foreground ml-1">/yr</span>
            )}
          </div>
          <div className={cn("flex items-center gap-1.5 text-[10px] sm:text-xs mt-2", subClass)}>
            <Icon className="h-3 w-3" />
            <span>
              {key === "savings" ? `${savingsPercent}% reduction` : sub}
            </span>
          </div>
        </div>
      );
    })}
    </div>
  );
}
