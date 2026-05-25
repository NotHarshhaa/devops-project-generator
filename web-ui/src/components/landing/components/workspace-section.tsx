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
  { value: "generator", icon: Rocket, label: "Generator", shortLabel: "Gen" },
  { value: "config", icon: Network, label: "Config Builder", shortLabel: "Config" },
  { value: "cost", icon: DollarSign, label: "Cost Advisor", shortLabel: "Cost" },
  { value: "analytics", icon: BarChart3, label: "Analytics", shortLabel: "Stats" },
];

export function WorkspaceSection({ activeTab, onTabChange }: WorkspaceSectionProps) {
  const { config } = useConfig();

  return (
    <main id="generator-section" className="container mx-auto max-w-7xl px-3 sm:px-4 pb-12 sm:pb-20 scroll-mt-16">
      <div className="text-center mb-6 sm:mb-8 animate-fade-in">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Workspace</p>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          Configure your <span className="text-brand-gradient">DevOps stack</span>
        </h2>
      </div>
      <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as WorkspaceTab)} className="w-full">
        <div className="flex justify-center mb-6 sm:mb-8">
          <TabsList className="inline-flex h-auto p-1 glass-panel rounded-2xl">
            {tabs.map(({ value, icon: Icon, label, shortLabel }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="gap-2 py-2.5 px-4 sm:px-5 text-xs sm:text-sm font-medium rounded-xl transition-all data-[state=active]:bg-brand data-[state=active]:text-brand-foreground data-[state=active]:shadow-md data-[state=inactive]:text-muted-foreground"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{shortLabel}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8">
          <TabsContent value="generator" className="mt-0">
            <ProjectGenerator />
          </TabsContent>
          <TabsContent value="config" className="mt-0">
            <AdvancedConfigBuilder config={config} />
          </TabsContent>
          <TabsContent value="cost" className="mt-0">
            <CostOptimizer config={config} />
          </TabsContent>
          <TabsContent value="analytics" className="mt-0">
            <AnalyticsDashboard />
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
