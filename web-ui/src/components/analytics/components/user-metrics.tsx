"use client";

import {
  Users,
  ArrowUp,
  FileText,
  Calendar,
  Target,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsData } from "@/components/analytics/types";

interface UserMetricsProps {
  analyticsData: AnalyticsData;
}

export function UserMetrics({ analyticsData }: UserMetricsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="h-4 w-4 text-green-500" />
          User Engagement Metrics
        </CardTitle>
        <CardDescription className="text-xs">
          How users interact with the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ArrowUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Returning Users</span>
            </div>
            <div className="text-2xl font-bold text-green-500">
              {analyticsData.userMetrics.returningUsers}
            </div>
            <div className="text-xs text-muted-foreground">30-day active</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Projects/User</span>
            </div>
            <div className="text-2xl font-bold text-blue-500">
              {analyticsData.userMetrics.avgProjectsPerUser.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Average</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Most Active</span>
            </div>
            <div className="text-lg font-bold text-purple-500">
              {analyticsData.userMetrics.mostActiveDay}
            </div>
            <div className="text-xs text-muted-foreground">Day of week</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">Satisfaction</span>
            </div>
            <div className="text-2xl font-bold text-amber-500">
              {analyticsData.userMetrics.userSatisfaction}
            </div>
            <div className="text-xs text-muted-foreground">Out of 5</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
