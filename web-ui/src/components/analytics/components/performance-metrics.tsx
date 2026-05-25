"use client";

import {
  Server,
  Database,
  AlertTriangle,
  Clock,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsData } from "@/components/analytics/types";

interface PerformanceMetricsProps {
  analyticsData: AnalyticsData;
}

export function PerformanceMetrics({ analyticsData }: PerformanceMetricsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Server className="h-4 w-4 text-blue-500" />
          Performance Metrics
        </CardTitle>
        <CardDescription className="text-xs">
          System performance and user experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Database className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Avg Load Time</span>
            </div>
            <div className="text-2xl font-bold text-blue-500">
              {analyticsData.performanceMetrics.avgLoadTime}s
            </div>
            <div className="text-xs text-muted-foreground">Page load</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">Error Rate</span>
            </div>
            <div className="text-2xl font-bold text-amber-500">
              {analyticsData.performanceMetrics.errorRate}%
            </div>
            <div className="text-xs text-muted-foreground">Last 30 days</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Peak Time</span>
            </div>
            <div className="text-lg font-bold text-green-500">
              {analyticsData.performanceMetrics.popularTimeOfDay}
            </div>
            <div className="text-xs text-muted-foreground">Most active</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Peak Day</span>
            </div>
            <div className="text-lg font-bold text-purple-500">
              {analyticsData.performanceMetrics.peakDay}
            </div>
            <div className="text-xs text-muted-foreground">Weekly pattern</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
