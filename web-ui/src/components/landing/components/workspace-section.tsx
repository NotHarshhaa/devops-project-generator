"use client";

import {
  ProjectGenerator,
  AdvancedConfigBuilder,
  CostOptimizer,
  AnalyticsDashboard,
  ArchitectureDiagramView,
  SecurityScorecardView,
} from "@/components";
import { useConfig } from "@/lib/config-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket, Network, DollarSign, BarChart3, Workflow, ShieldCheck } from "lucide-react";
import type { WorkspaceTab } from "../data/landing-content";

interface WorkspaceSectionProps {
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
}

const tabs: { value: WorkspaceTab; icon: typeof Rocket; label: string; shortLabel: string }[] = [
  { value: "generator", icon: Rocket, label: "01. Generator", shortLabel: "Gen" },
  { value: "config", icon: Network, label: "02. Config Builder", shortLabel: "Config" },
  { value: "cost", icon: DollarSign, label: "03. Cost Advisor", shortLabel: "Cost" },
  { value: "analytics", icon: BarChart3, label: "04. Analytics", shortLabel: "Stats" },
  { value: "diagram", icon: Workflow, label: "05. Diagram", shortLabel: "Diagram" },
  { value: "security", icon: ShieldCheck, label: "06. Security Scorecard", shortLabel: "Security" },
];

export function WorkspaceSection({ activeTab, onTabChange }: WorkspaceSectionProps) {
  const { config, updateConfig } = useConfig();

  return (
    <main id="generator-section" className="container mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-24 scroll-mt-20">
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/80 bg-muted/60 text-xs font-mono text-muted-foreground mb-3">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          SYSTEM CONSOLE
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Interactive Architecture Suite
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto">
          Scaffold, inspect, analyze complexity, optimize cloud costs, and verify governance in real time.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as WorkspaceTab)} className="w-full max-w-full">
        <div className="w-full overflow-x-auto pb-3 flex justify-start lg:justify-center mb-6 sm:mb-8 scrollbar-none">
          <TabsList className="inline-flex shrink-0 h-12 p-1.5 rounded-xl border border-border/80 bg-muted/60 backdrop-blur-md gap-1">
            {tabs.map(({ value, icon: Icon, label, shortLabel }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="gap-2 px-3.5 sm:px-4 py-2 text-xs font-medium rounded-lg transition-all duration-150 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground hover:text-foreground whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-cyan-500" strokeWidth={1.8} />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{shortLabel}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/95 p-4 sm:p-6 lg:p-8 shadow-xl shadow-black/5 dark:shadow-black/25 w-full max-w-full overflow-hidden transition-all">
          <TabsContent value="generator" className="mt-0 outline-none">
            <ProjectGenerator />
          </TabsContent>
          <TabsContent value="config" className="mt-0 outline-none">
            <AdvancedConfigBuilder
              config={config}
              onConfigChange={updateConfig}
              onNavigateToGenerator={() => onTabChange("generator")}
            />
          </TabsContent>
          <TabsContent value="cost" className="mt-0 outline-none">
            <CostOptimizer config={config} />
          </TabsContent>
          <TabsContent value="analytics" className="mt-0 outline-none">
            <AnalyticsDashboard />
          </TabsContent>
          <TabsContent value="diagram" className="mt-0 outline-none">
            <ArchitectureDiagramView config={config} />
          </TabsContent>
          <TabsContent value="security" className="mt-0 outline-none">
            <SecurityScorecardView config={config} onUpdateConfig={updateConfig} />
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
