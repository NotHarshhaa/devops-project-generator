"use client";

import { BarChart3, CheckCircle2, Download, Sparkles } from "lucide-react";
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
    <div className="space-y-8 animate-fade-in">
      <AnalyticsHeader
        hasData={hasData}
        showDetailed={showDetailed}
        onToggleDetailed={() => setShowDetailed(!showDetailed)}
        onRefresh={handleRefresh}
      />

      <MetricsGrid analyticsData={analyticsData} />

      {!hasData && <NoDataState />}

      {hasData && (
        <>
          {showDetailed && (
            <div className="grid gap-6 xl:grid-cols-2">
              <PerformanceMetrics analyticsData={analyticsData} />
              <UserMetrics analyticsData={analyticsData} />
            </div>
          )}

          {analyticsData.popularCombinations.length > 0 && (
            <PopularCombinations analyticsData={analyticsData} />
          )}

          <TechnologyStats analyticsData={analyticsData} />

          {analyticsData.trends.length > 0 && (
            <TrendingTechnologies analyticsData={analyticsData} />
          )}

          <Alert className="border-brand/20 bg-brand/5">
            <CheckCircle2 className="h-4 w-4 text-brand" />
            <AlertDescription className="text-sm">
              <strong>Analytics summary:</strong> Based on {analyticsData.totalProjects} generated projects with{" "}
              {analyticsData.successRate}% success rate. Users save an average of {analyticsData.avgTimeSaved} hours
              per project. All data is stored locally in your browser.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button variant="outline" className="flex-1 gap-2 border-border/80 h-11">
              <Download className="h-4 w-4" />
              Export Analytics Report
            </Button>
            <Button className="flex-1 gap-2 h-11 bg-brand hover:bg-brand/90 text-brand-foreground shadow-lg shadow-brand/20">
              <BarChart3 className="h-4 w-4" />
              Generate Insights
            </Button>
          </div>
        </>
      )}

      {hasData && !showDetailed && (
        <div className="rounded-2xl border border-brand/20 bg-brand/5 p-4 text-center">
          <Sparkles className="h-4 w-4 text-brand mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Switch to <strong className="text-foreground">Detailed</strong> view for performance and engagement metrics.
          </p>
        </div>
      )}
    </div>
  );
}
