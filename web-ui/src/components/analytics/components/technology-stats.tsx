"use client";

import { GitBranch, Layers, Package, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AnalyticsData } from "@/components/analytics/types";

interface TechnologyStatsProps {
  analyticsData: AnalyticsData;
}

export function TechnologyStats({ analyticsData }: TechnologyStatsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* CI/CD Platforms */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-blue-500" />
            CI/CD Platforms
          </CardTitle>
          <CardDescription className="text-xs">
            Distribution of CI/CD choices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[250px] pr-4">
            <div className="space-y-3">
              {Object.entries(analyticsData.technologyStats.ci)
                .sort(([, a], [, b]) => b - a)
                .map(([tech, count]) => {
                  const total = Object.values(analyticsData.technologyStats.ci).reduce(
                    (a, b) => a + b,
                    0
                  );
                  const percentage = total > 0 ? (count / total) * 100 : 0;

                  return (
                    <div key={tech} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium capitalize">{tech.replace(/-/g, " ")}</span>
                        <span className="text-muted-foreground">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Infrastructure */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Layers className="h-4 w-4 text-purple-500" />
            Infrastructure Platforms
          </CardTitle>
          <CardDescription className="text-xs">
            Distribution of infrastructure choices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[250px] pr-4">
            <div className="space-y-3">
              {Object.entries(analyticsData.technologyStats.infra)
                .sort(([, a], [, b]) => b - a)
                .map(([tech, count]) => {
                  const total = Object.values(analyticsData.technologyStats.infra).reduce(
                    (a, b) => a + b,
                    0
                  );
                  const percentage = total > 0 ? (count / total) * 100 : 0;

                  return (
                    <div key={tech} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium capitalize">{tech.replace(/-/g, " ")}</span>
                        <span className="text-muted-foreground">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Deployment Strategies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Package className="h-4 w-4 text-cyan-500" />
            Deployment Strategies
          </CardTitle>
          <CardDescription className="text-xs">
            Distribution of deployment choices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[250px] pr-4">
            <div className="space-y-3">
              {Object.entries(analyticsData.technologyStats.deploy)
                .sort(([, a], [, b]) => b - a)
                .map(([tech, count]) => {
                  const total = Object.values(analyticsData.technologyStats.deploy).reduce(
                    (a, b) => a + b,
                    0
                  );
                  const percentage = total > 0 ? (count / total) * 100 : 0;

                  return (
                    <div key={tech} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium capitalize">{tech.replace(/-/g, " ")}</span>
                        <span className="text-muted-foreground">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Observability */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4 text-amber-500" />
            Observability Stacks
          </CardTitle>
          <CardDescription className="text-xs">
            Distribution of observability choices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[250px] pr-4">
            <div className="space-y-3">
              {Object.entries(analyticsData.technologyStats.observability)
                .sort(([, a], [, b]) => b - a)
                .map(([tech, count]) => {
                  const total = Object.values(analyticsData.technologyStats.observability).reduce(
                    (a, b) => a + b,
                    0
                  );
                  const percentage = total > 0 ? (count / total) * 100 : 0;

                  return (
                    <div key={tech} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium capitalize">{tech.replace(/-/g, " ")}</span>
                        <span className="text-muted-foreground">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
