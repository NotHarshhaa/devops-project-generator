"use client";

import { BarChart3, Eye, RefreshCw } from "lucide-react";
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
    <div className="flex items-start justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Project Analytics Dashboard
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {hasData ? "Real-time insights from generated projects" : "Generate projects to see analytics"}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleDetailed}
          className="gap-2"
        >
          <Eye className="h-3.5 w-3.5" />
          {showDetailed ? "Simple" : "Detailed"}
        </Button>
        <Button variant="outline" size="sm" onClick={onRefresh} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>
    </div>
  );
}
