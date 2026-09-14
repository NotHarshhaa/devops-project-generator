"use client";

import {
  ProjectGenerator,
  AdvancedConfigBuilder,
  CostOptimizer,
  AnalyticsDashboard,
} from "@/components";
import { useConfig } from "@/lib/config-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket, Network, DollarSign, BarChart3 } from "lucide-react";
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
];

export function WorkspaceSection({ activeTab, onTabChange }: WorkspaceSectionProps) {
  const { config, updateConfig } = useConfig();

  return (
    <main id="generator-section" className="container mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-24 scroll-mt-20">
      <div className="text-center mb-8 sm:mb-12">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
          [ SYSTEM CONSOLE ]
        </p>
        <h2 className="font-display font-normal text-3xl sm:text-4xl md:text-5xl tracking-tight text-foreground">
          Interactive Architecture Suite
        </h2>
        <div className="h-0.5 w-16 bg-foreground mx-auto mt-4" />
      </div>

      <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as WorkspaceTab)} className="w-full max-w-full overflow-hidden">
        <div className="w-full overflow-x-auto pb-2 flex justify-start sm:justify-center mb-6 sm:mb-8">
          <TabsList className="inline-flex shrink-0 h-auto p-0 border-2 border-foreground bg-background">
            {tabs.map(({ value, icon: Icon, label, shortLabel }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="gap-1.5 sm:gap-2.5 py-2.5 sm:py-3 px-3 sm:px-6 text-[11px] sm:text-xs font-mono uppercase tracking-wider rounded-none border-r last:border-r-0 border-foreground/30 transition-colors duration-100 data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=inactive]:text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
              >
                <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{shortLabel}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="border-2 border-foreground bg-card p-3 sm:p-6 lg:p-8 shadow-none w-full max-w-full overflow-hidden">
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
        </div>
      </Tabs>
    </main>
  );
}
