"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Zap, Info, CheckCircle2 } from "lucide-react";
import { Dependency } from "../types";

interface DependencyListProps {
  requirements: Dependency[];
  recommendations: Dependency[];
}

function DependencyItems({ items, variant }: { items: Dependency[]; variant: "required" | "recommended" }) {
  const styles =
    variant === "required"
      ? { bg: "bg-blue-500/5", border: "border-blue-500/20", icon: CheckCircle2, iconColor: "text-blue-500" }
      : { bg: "bg-amber-500/5", border: "border-amber-500/20", icon: Info, iconColor: "text-amber-500" };

  const Icon = styles.icon;

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className={`flex items-start gap-2 text-xs p-2 rounded-lg ${styles.bg} border ${styles.border}`}>
            <Icon className={`h-3 w-3 ${styles.iconColor} mt-0.5 shrink-0`} />
            <div>
              <div className="font-medium">
                {item.from} → {item.to}
              </div>
              <div className="text-muted-foreground">{item.reason}</div>
              {item.impact && (
                <Badge variant="outline" className="mt-1 text-xs">
                  Impact: {item.impact}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

export function DependencyList({ requirements, recommendations }: DependencyListProps) {
  if (requirements.length === 0 && recommendations.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {requirements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              Required Dependencies
            </CardTitle>
            <CardDescription className="text-xs">These dependencies must be satisfied</CardDescription>
          </CardHeader>
          <CardContent>
            <DependencyItems items={requirements} variant="required" />
          </CardContent>
        </Card>
      )}

      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="h-4 w-4 text-amber-500" />
              Recommendations
            </CardTitle>
            <CardDescription className="text-xs">Consider these optimizations</CardDescription>
          </CardHeader>
          <CardContent>
            <DependencyItems items={recommendations} variant="recommended" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
