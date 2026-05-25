"use client";

import { ProjectConfig } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Clock,
  GitBranch,
  Layers,
  Package,
  Activity,
  Shield,
} from "lucide-react";
import { calculateComplexity } from "../utils";

interface GeneratingViewProps {
  config: ProjectConfig;
}

export function GeneratingView({ config }: GeneratingViewProps) {
  const complexity = calculateComplexity(config);
  const estimatedTime = 1 + complexity * 0.5;

  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-24 gap-4 sm:gap-6 animate-fade-in px-2">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-lg sm:text-xl font-semibold">Generating your project...</h3>
        <p className="text-sm text-muted-foreground">
          Creating {config.projectName} with your selected stack
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Estimated time: {estimatedTime}s</span>
        </div>
      </div>

      <div className="w-full max-w-md space-y-3">
        {[
          { label: "Setting up base structure", done: true, width: "100%", color: "bg-green-500" },
          { label: "Generating pipeline files", done: complexity > 2, width: complexity > 2 ? "100%" : "60%", color: "bg-blue-500" },
          { label: "Configuring infrastructure", done: complexity > 3, width: complexity > 3 ? "100%" : "40%", color: "bg-purple-500" },
          { label: "Setting up deployment", done: false, width: "20%", color: "bg-cyan-500" },
        ].map((step) => (
          <div key={step.label} className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>{step.label}</span>
              <span>{step.done ? "✓" : "..."}</span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div className={`h-full ${step.color} transition-all duration-1000`} style={{ width: step.width }} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {config.ci !== "none" && (
          <Badge variant="secondary" className="gap-1">
            <GitBranch className="h-3 w-3" /> {config.ci}
          </Badge>
        )}
        <Badge variant="secondary" className="gap-1">
          <Layers className="h-3 w-3" /> {config.infra}
        </Badge>
        <Badge variant="secondary" className="gap-1">
          <Package className="h-3 w-3" /> {config.deploy}
        </Badge>
        <Badge variant="secondary" className="gap-1">
          <Activity className="h-3 w-3" /> {config.observability}
        </Badge>
        <Badge variant="secondary" className="gap-1">
          <Shield className="h-3 w-3" /> {config.security}
        </Badge>
      </div>
    </div>
  );
}
