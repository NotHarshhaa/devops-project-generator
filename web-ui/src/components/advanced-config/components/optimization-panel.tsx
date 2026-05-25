"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { ConfigOptimization } from "../types";

interface OptimizationPanelProps {
  optimizations: ConfigOptimization[];
}

function getTypeStyle(type: string) {
  switch (type.toLowerCase()) {
    case "cost":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-500";
    case "performance":
      return "border-brand/30 bg-brand/10 text-brand";
    case "security":
      return "border-red-500/30 bg-red-500/10 text-red-500";
    default:
      return "border-border/80 bg-muted text-muted-foreground";
  }
}

export function OptimizationPanel({ optimizations }: OptimizationPanelProps) {
  const [expanded, setExpanded] = useState(true);

  if (optimizations.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-border/60 bg-muted/30 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-brand" />
            <h3 className="text-sm font-semibold">Optimizations available</h3>
            <Badge variant="outline" className="text-[10px] font-mono border-brand/30">
              {optimizations.length}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Improve cost, performance, and security
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="gap-1 text-xs h-8 text-brand hover:bg-brand/10"
        >
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          {expanded ? "Collapse" : "Expand"}
        </Button>
      </div>

      {expanded && (
        <div className="p-4 sm:p-5 space-y-3">
          {optimizations.map((opt, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border/50 bg-background/50 p-4 transition-all hover:border-brand/30 hover:shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    <span className="font-semibold text-sm">{opt.title}</span>
                    <Badge variant="outline" className={`text-[10px] capitalize ${getTypeStyle(opt.type)}`}>
                      {opt.type}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] capitalize">
                      {opt.difficulty}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{opt.description}</p>
                </div>
                <div className="shrink-0 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Sparkles className="h-3 w-3 text-emerald-500" />
                    <span className="text-sm font-bold font-mono text-emerald-500">{opt.savings}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
