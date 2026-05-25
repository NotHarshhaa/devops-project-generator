"use client";

import { BarChart3, CheckCircle2, Download } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAnalyticsData } from "@/components/analytics/hooks/use-analytics-data";
import { AnalyticsHeader } from "@/components/analytics/components/analytics-header";
import { MetricsGrid } from "@/components/analytics/components/metrics-grid";
import { PerformanceMetrics } from "@/components/analytics/components/performance-metrics";
import { UserMetrics } from "@/components/analytics/components/user-metrics";
import { PopularCombinations } from "@/components/analytics/components/popular-combinations";
import { NoDataState } from "@/components/analytics/components/no-data-state";
import { TechnologyStats } from "@/components/analytics/components/technology-stats";
import { TrendingTechnologies } from "@/components/analytics/components/trending-technologies";

export function AnalyticsDashboard() {
  const {
    analyticsData,
    showDetailed,
    setShowDetailed,
    handleRefresh,
    hasData,
  } = useAnalyticsData();

  return (
    <div className="space-y-6">
      <AnalyticsHeader
        hasData={hasData}
        showDetailed={showDetailed}
        onToggleDetailed={() => setShowDetailed(!showDetailed)}
        onRefresh={handleRefresh}
      />

      <MetricsGrid analyticsData={analyticsData} />

      {hasData && showDetailed && <PerformanceMetrics analyticsData={analyticsData} />}

      {hasData && showDetailed && <UserMetrics analyticsData={analyticsData} />}

      {hasData && analyticsData.popularCombinations.length > 0 && (
        <PopularCombinations analyticsData={analyticsData} />
      )}

      {!hasData && <NoDataState />}

      {hasData && <TechnologyStats analyticsData={analyticsData} />}

      {hasData && analyticsData.trends.length > 0 && (
        <TrendingTechnologies analyticsData={analyticsData} />
      )}

      {hasData && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Analytics Summary:</strong> Based on {analyticsData.totalProjects} generated projects with {analyticsData.successRate}% success rate.
            Users save an average of {analyticsData.avgTimeSaved} hours per project. All analytics data is stored locally in your browser for privacy.
          </AlertDescription>
        </Alert>
      )}

      {hasData && (
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Export Analytics Report
          </Button>
          <Button className="flex-1">
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate Insights
          </Button>
        </div>
      )}
    </div>
  );
}
