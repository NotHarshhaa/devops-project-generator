"use client";

import { BarChart3, Shield, Database, Eye, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NoDataState() {
  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 overflow-hidden">
      <div className="p-10 sm:p-14 text-center">
        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-brand/10 border border-brand/20 brand-glow mb-5">
          <BarChart3 className="h-8 w-8 text-brand/60" />
        </div>
        <h3 className="text-lg font-bold mb-2">No analytics data yet</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          Generate your first project to start tracking technology trends, popular stacks, and usage insights.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground mb-6">
          <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/50 px-3 py-2">
            <Shield className="h-3.5 w-3.5 text-brand" />
            <span>Privacy-focused</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/50 px-3 py-2">
            <Database className="h-3.5 w-3.5 text-brand" />
            <span>Local storage</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/50 px-3 py-2">
            <Eye className="h-3.5 w-3.5 text-brand" />
            <span>No external tracking</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="gap-2 border-brand/30 text-brand hover:bg-brand/10"
          onClick={() => document.getElementById("generator-section")?.scrollIntoView({ behavior: "smooth" })}
        >
          <Rocket className="h-4 w-4" />
          Go to Generator
        </Button>
      </div>
    </div>
  );
}
