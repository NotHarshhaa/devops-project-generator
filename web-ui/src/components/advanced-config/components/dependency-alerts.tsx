"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, AlertCircle, Wrench, Lightbulb } from "lucide-react";
import { Dependency } from "../types";

interface DependencyAlertsProps {
  conflicts: Dependency[];
  warnings: Dependency[];
}

function ConflictItem({ conflict }: { conflict: Dependency }) {
  return (
    <li className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 space-y-2">
      <div className="flex items-start gap-2 text-sm">
        <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
        <span>
          <strong className="font-mono">{conflict.from}</strong>
          <span className="text-muted-foreground"> conflicts with </span>
          <strong className="font-mono">{conflict.to}</strong>
        </span>
      </div>
      <p className="text-xs text-muted-foreground ml-6">{conflict.reason}</p>
      {conflict.fix && (
        <div className="ml-6 rounded-lg border border-red-500/20 bg-background/60 p-2.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-red-500 mb-1">
            <Wrench className="h-3 w-3" />
            Recommended fix
          </div>
          <p className="text-xs text-muted-foreground">{conflict.fix}</p>
        </div>
      )}
    </li>
  );
}

function WarningItem({ warning }: { warning: Dependency }) {
  return (
    <li className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 space-y-2">
      <div className="flex items-start gap-2 text-sm">
        <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
        <span>
          <strong className="font-mono">{warning.from}</strong>
          <span className="text-muted-foreground"> → </span>
          <strong className="font-mono">{warning.to}</strong>
        </span>
      </div>
      <p className="text-xs text-muted-foreground ml-6">{warning.reason}</p>
      {warning.fix && (
        <div className="ml-6 rounded-lg border border-amber-500/20 bg-background/60 p-2.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-500 mb-1">
            <Lightbulb className="h-3 w-3" />
            Suggestion
          </div>
          <p className="text-xs text-muted-foreground">{warning.fix}</p>
        </div>
      )}
    </li>
  );
}

export function DependencyAlerts({ conflicts, warnings }: DependencyAlertsProps) {
  if (conflicts.length === 0 && warnings.length === 0) return null;

  return (
    <div className="space-y-4">
      {conflicts.length > 0 && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 overflow-hidden">
          <div className="px-5 py-3 border-b border-red-500/20 bg-red-500/10">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <h3 className="text-sm font-semibold text-red-500">
                Critical conflicts ({conflicts.length})
              </h3>
            </div>
          </div>
          <div className="p-4 sm:p-5">
            <ul className="space-y-3">
              {conflicts.map((conflict, idx) => (
                <ConflictItem key={idx} conflict={conflict} />
              ))}
            </ul>
          </div>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 overflow-hidden">
          <div className="px-5 py-3 border-b border-amber-500/20 bg-amber-500/10">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-amber-500">
                Warnings ({warnings.length})
              </h3>
            </div>
          </div>
          <div className="p-4 sm:p-5">
            <ul className="space-y-3">
              {warnings.map((warning, idx) => (
                <WarningItem key={idx} warning={warning} />
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
