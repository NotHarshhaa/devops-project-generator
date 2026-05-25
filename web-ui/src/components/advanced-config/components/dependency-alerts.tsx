"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, AlertCircle, Wrench, Lightbulb } from "lucide-react";
import { Dependency } from "../types";

interface DependencyAlertsProps {
  conflicts: Dependency[];
  warnings: Dependency[];
}

export function DependencyAlerts({ conflicts, warnings }: DependencyAlertsProps) {
  return (
    <>
      {conflicts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-2">Critical Conflicts Detected</div>
            <ul className="space-y-2 text-sm">
              {conflicts.map((conflict, idx) => (
                <li key={idx} className="flex flex-col gap-1">
                  <div className="flex items-start gap-2">
                    <span className="text-destructive">•</span>
                    <span>
                      <strong>{conflict.from}</strong> conflicts with <strong>{conflict.to}</strong>
                    </span>
                  </div>
                  <div className="text-muted-foreground text-xs ml-4">{conflict.reason}</div>
                  {conflict.fix && (
                    <div className="ml-4 mt-1 p-2 bg-destructive/10 rounded border border-destructive/20">
                      <div className="flex items-center gap-1 text-xs">
                        <Wrench className="h-3 w-3" />
                        <span className="font-medium">Fix:</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{conflict.fix}</div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {warnings.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-2">Warnings</div>
            <ul className="space-y-2 text-sm">
              {warnings.map((warning, idx) => (
                <li key={idx} className="flex flex-col gap-1">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-500">•</span>
                    <span>
                      <strong>{warning.from}</strong> → <strong>{warning.to}</strong>
                    </span>
                  </div>
                  <div className="text-muted-foreground text-xs ml-4">{warning.reason}</div>
                  {warning.fix && (
                    <div className="ml-4 mt-1 p-2 bg-amber-500/10 rounded border border-amber-500/20">
                      <div className="flex items-center gap-1 text-xs">
                        <Lightbulb className="h-3 w-3" />
                        <span className="font-medium">Suggestion:</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{warning.fix}</div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
