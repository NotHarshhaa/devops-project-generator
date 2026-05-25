"use client";

import {
  Download,
  Users,
  Globe,
  Target,
  Timer,
  Zap,
  TrendingUp,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsData } from "@/components/analytics/types";

interface MetricsGridProps {
  analyticsData: AnalyticsData;
}

export function MetricsGrid({ analyticsData }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="text-xs flex items-center gap-1.5">
            <Download className="h-3 w-3" />
            Total Projects
          </CardDescription>
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            {analyticsData.totalProjects.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1 text-xs text-green-500">
            <TrendingUp className="h-3 w-3" />
            <span>
              +{analyticsData.totalProjects > 0 ? Math.floor(analyticsData.totalProjects * 0.12) : 0} this month
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="text-xs flex items-center gap-1.5">
            <Users className="h-3 w-3" />
            Active Users
          </CardDescription>
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            {analyticsData.activeUsers >= 1000
              ? `${(analyticsData.activeUsers / 1000).toFixed(1)}K`
              : analyticsData.activeUsers}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1 text-xs text-green-500">
            <TrendingUp className="h-3 w-3" />
            <span>+{Math.floor(analyticsData.activeUsers * 0.08)} this month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="text-xs flex items-center gap-1.5">
            <Globe className="h-3 w-3" />
            Countries
          </CardDescription>
          <CardTitle className="text-2xl sm:text-3xl font-bold">{analyticsData.countries}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Globe className="h-3 w-3" />
            <span>Global reach</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="text-xs flex items-center gap-1.5">
            <Target className="h-3 w-3" />
            Success Rate
          </CardDescription>
          <CardTitle className="text-2xl sm:text-3xl font-bold">{analyticsData.successRate}%</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1 text-xs text-green-500">
            <CheckCircle2 className="h-3 w-3" />
            <span>High reliability</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="text-xs flex items-center gap-1.5">
            <Timer className="h-3 w-3" />
            Avg Generation Time
          </CardDescription>
          <CardTitle className="text-2xl sm:text-3xl font-bold">{analyticsData.avgGenerationTime}s</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1 text-xs text-amber-500">
            <Clock className="h-3 w-3" />
            <span>Fast generation</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="text-xs flex items-center gap-1.5">
            <Zap className="h-3 w-3" />
            Time Saved
          </CardDescription>
          <CardTitle className="text-2xl sm:text-3xl font-bold">{analyticsData.avgTimeSaved}h</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Zap className="h-3 w-3" />
            <span>Per project</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
