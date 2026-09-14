"use client";

import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calculator, Target, DollarSign, Sparkles, FileSpreadsheet } from "lucide-react";
import { saveAs } from "file-saver";
import { CostOptimizerProps } from "./types";
import { useCostAnalysis } from "./hooks/use-cost-analysis";
import { CostSummaryCards } from "./components/cost-summary-cards";
import { CostBreakdown } from "./components/cost-breakdown";
import { OptimizationList } from "./components/optimization-list";
import { CostInsights } from "./components/cost-insights";

export function CostOptimizer({ config }: CostOptimizerProps) {
  const {
    costEstimates,
    optimizations,
    totalMonthlyCost,
    totalPotentialSavings,
    optimizedCost,
  } = useCostAnalysis(config);

  const savingsPercent =
    totalMonthlyCost > 0 ? ((totalPotentialSavings / totalMonthlyCost) * 100).toFixed(0) : "0";

  const handleExportCostReport = () => {
    const lines = [
      `# Infrastructure Cost & Optimization Report`,
      ``,
      `**Project Name**: ${config.projectName || "devops-project"}`,
      `**Generated On**: ${new Date().toISOString()}`,
      `**Current Estimated Cost**: $${totalMonthlyCost.toFixed(0)}/month ($${(totalMonthlyCost * 12).toFixed(0)}/year)`,
      `**Potential Monthly Savings**: $${totalPotentialSavings.toFixed(0)}/month (${savingsPercent}%)`,
      `**Target Optimized Cost**: $${optimizedCost.toFixed(0)}/month`,
      ``,
      `---`,
      ``,
      `## Monthly Cost Breakdown by Component`,
      ``,
      `| Component | Category | Monthly Cost | Description |`,
      `| :--- | :--- | :--- | :--- |`,
      ...costEstimates.map(
        (c) => `| ${c.component} | ${c.category} | $${c.monthlyCost.toFixed(0)} | ${c.description} |`
      ),
      ``,
      `---`,
      ``,
      `## Optimization Opportunities`,
      ``,
      ...optimizations.map(
        (opt, i) => `### ${i + 1}. ${opt.title} (Save $${opt.savings}/mo)
- **Difficulty**: ${opt.difficulty.toUpperCase()}
- **Impact**: ${opt.impact.toUpperCase()}
- **Risk**: ${opt.risk.toUpperCase()}
- **Expected ROI**: ${opt.roi}
- **Implementation**: ${opt.implementation}
- **Description**: ${opt.description}
`
      ),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
    saveAs(blob, `${config.projectName || "devops-project"}-cost-report.md`);
    toast.success("Cost report exported as Markdown");
  };

  const handleExportCsv = () => {
    const csvRows = [
      ["Component", "Category", "Monthly Cost (USD)", "Annual Cost (USD)", "Description"],
      ...costEstimates.map((c) => [
        `"${c.component}"`,
        `"${c.category}"`,
        c.monthlyCost.toFixed(2),
        (c.monthlyCost * 12).toFixed(2),
        `"${c.description.replace(/"/g, '""')}"`,
      ]),
      [
        "TOTAL",
        "All Categories",
        totalMonthlyCost.toFixed(2),
        (totalMonthlyCost * 12).toFixed(2),
        "Total estimated stack cost",
      ],
      [
        "POTENTIAL SAVINGS",
        "Optimizations",
        totalPotentialSavings.toFixed(2),
        (totalPotentialSavings * 12).toFixed(2),
        `Reduced to $${optimizedCost.toFixed(2)}/mo (${savingsPercent}% savings)`,
      ],
    ];
    const csvContent = csvRows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${config.projectName || "devops-project"}-costs.csv`);
    toast.success("Cost breakdown exported as CSV");
  };

  const handleCreateOptimizationPlan = () => {
    const quickWins = optimizations.filter((o) => o.difficulty === "easy");
    const mediumTerm = optimizations.filter((o) => o.difficulty === "medium");
    const longTerm = optimizations.filter((o) => o.difficulty === "hard");

    const lines = [
      `# Cost Optimization Execution Roadmap`,
      ``,
      `**Project**: ${config.projectName || "devops-project"}`,
      `**Target Total Savings**: $${totalPotentialSavings.toFixed(0)}/mo`,
      ``,
      `## Phase 1: Quick Wins (Weeks 1–2)`,
      quickWins.length > 0
        ? quickWins.map((q) => `- [ ] **${q.title}**: Save $${q.savings}/mo. ${q.implementation}`).join("\n")
        : `- No quick win changes required.`,
      ``,
      `## Phase 2: Medium-Term Improvements (Months 1–2)`,
      mediumTerm.length > 0
        ? mediumTerm.map((m) => `- [ ] **${m.title}**: Save $${m.savings}/mo. ${m.implementation}`).join("\n")
        : `- No medium-term items.`,
      ``,
      `## Phase 3: Long-Term Enterprise Architecture (Months 3+)`,
      longTerm.length > 0
        ? longTerm.map((l) => `- [ ] **${l.title}**: Save $${l.savings}/mo. ${l.implementation}`).join("\n")
        : `- No long-term items.`,
      ``,
      `---`,
      `*Generated automatically by DevOps Project Generator Cost Advisor*`,
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
    saveAs(blob, `${config.projectName || "devops-project"}-optimization-roadmap.md`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/10 border border-brand/20 brand-glow">
            <DollarSign className="h-6 w-6 text-brand" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Cost Optimization Advisor</h2>
              <Badge variant="outline" className="text-[10px] font-mono border-brand/30 text-brand">
                Live estimate
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground max-w-xl">
              Realistic monthly cost projections and data-driven recommendations for your current stack.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 font-mono text-[10px] sm:text-xs">
          <Badge variant="secondary" className="px-2.5">{config.infra}</Badge>
          <Badge variant="secondary" className="px-2.5">{config.deploy}</Badge>
          <Badge variant="secondary" className="px-2.5">{config.observability}</Badge>
        </div>
      </div>

      <CostSummaryCards
        totalMonthlyCost={totalMonthlyCost}
        totalPotentialSavings={totalPotentialSavings}
        optimizedCost={optimizedCost}
      />

      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-brand/5 to-transparent p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand shrink-0" />
            <p className="text-sm">
              You could save{" "}
              <span className="font-bold font-mono text-emerald-500">${totalPotentialSavings.toFixed(0)}/mo</span>{" "}
              ({savingsPercent}%) by applying {optimizations.length} recommended optimizations.
            </p>
          </div>
          <p className="text-xs text-muted-foreground font-mono shrink-0">
            Optimized → ${optimizedCost.toFixed(0)}/mo
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <CostBreakdown costEstimates={costEstimates} totalMonthlyCost={totalMonthlyCost} />
        <OptimizationList optimizations={optimizations} />
      </div>

      <CostInsights totalMonthlyCost={totalMonthlyCost} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <Button onClick={handleExportCostReport} variant="outline" className="gap-2 border-border/80 h-11">
          <Calculator className="h-4 w-4" />
          Export Markdown
        </Button>
        <Button onClick={handleExportCsv} variant="outline" className="gap-2 border-border/80 h-11">
          <FileSpreadsheet className="h-4 w-4" />
          Export CSV
        </Button>
        <Button onClick={handleCreateOptimizationPlan} className="gap-2 h-11 bg-brand hover:bg-brand/90 text-brand-foreground shadow-lg shadow-brand/20">
          <Target className="h-4 w-4" />
          Optimization Plan
        </Button>
      </div>
    </div>
  );
}
