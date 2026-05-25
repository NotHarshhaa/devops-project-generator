"use client";

import { BarChart3, Eye, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AnalyticsHeaderProps {
  hasData: boolean;
  showDetailed: boolean;
  onToggleDetailed: () => void;
  onRefresh: () => void;
}

export function AnalyticsHeader({
  hasData,
  showDetailed,
  onToggleDetailed,
  onRefresh,
}: AnalyticsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/10 border border-brand/20 brand-glow">
          <BarChart3 className="h-6 w-6 text-brand" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Project Analytics</h2>
            <Badge variant="outline" className="text-[10px] font-mono border-brand/30 text-brand">
              {hasData ? "Live" : "No data"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {hasData
              ? "Real-time insights from generated projects — stored locally in your browser."
              : "Generate projects to start tracking analytics and trends."}
          </p>
        </div>
      </div>

      <div className="flex gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleDetailed}
          className="gap-2 border-border/80"
          disabled={!hasData}
        >
          <Eye className="h-3.5 w-3.5" />
          {showDetailed ? "Simple" : "Detailed"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="gap-2 border-border/80"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>
    </div>
  );
}
