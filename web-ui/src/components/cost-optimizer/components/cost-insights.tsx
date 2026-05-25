import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Activity, Globe, AlertCircle } from "lucide-react";

interface CostInsightsProps {
  totalMonthlyCost: number;
}

const insightSections = [
  {
    icon: Users,
    title: "Team size impact",
    color: "text-brand",
    bg: "bg-brand/10",
    border: "border-brand/20",
    rows: (cost: number) => [
      { label: "1–2 engineers", value: cost },
      { label: "3–5 engineers", value: cost * 1.2 },
      { label: "6–10 engineers", value: cost * 1.5 },
    ],
  },
  {
    icon: Activity,
    title: "Usage multipliers",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    rows: (cost: number) => [
      { label: "Low usage (25%)", value: cost * 0.7 },
      { label: "Average usage (50%)", value: cost },
      { label: "High usage (100%)", value: cost * 1.8 },
    ],
  },
  {
    icon: Globe,
    title: "Regional variations",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    rows: (cost: number) => [
      { label: "US East", value: cost },
      { label: "US West", value: cost * 1.05 },
      { label: "Europe", value: cost * 1.15 },
    ],
  },
] as const;

export function CostInsights({ totalMonthlyCost }: CostInsightsProps) {
  return (
    <>
      <div className="grid md:grid-cols-3 gap-3 sm:gap-4">
        {insightSections.map(({ icon: Icon, title, color, bg, border, rows }) => (
          <div key={title} className={`rounded-2xl border ${border} ${bg} p-4 sm:p-5`}>
            <div className="flex items-center gap-2 mb-4">
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-background/60 ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-semibold">{title}</h4>
            </div>
            <div className="space-y-2">
              {rows(totalMonthlyCost).map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between text-xs rounded-lg bg-background/50 px-3 py-2 border border-border/40"
                >
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-mono font-semibold">${value.toFixed(0)}/mo</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Alert className="border-brand/20 bg-brand/5">
        <AlertCircle className="h-4 w-4 text-brand" />
        <AlertDescription className="text-sm">
          <strong>Disclaimer:</strong> Estimates are based on typical 2024 pricing patterns. Actual costs vary by
          region, usage, negotiated discounts, and configuration. Consult official pricing calculators before
          making decisions.
        </AlertDescription>
      </Alert>
    </>
  );
}
