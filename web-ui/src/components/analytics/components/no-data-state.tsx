"use client";

import { BarChart3, Shield, Database, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function NoDataState() {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="text-lg font-semibold mb-2">No Analytics Data Yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Generate your first project to start tracking analytics and insights.
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          All data is stored locally in your browser and never sent to external servers.
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>Privacy-focused</span>
          </div>
          <div className="flex items-center gap-1">
            <Database className="h-3 w-3" />
            <span>Local storage</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>No tracking</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
