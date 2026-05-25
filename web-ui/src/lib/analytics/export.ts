import { getAnalyticsData } from "./storage";
import { calculateTechnologyStats, getPopularCombinations, getTrendingTechnologies } from "./stats";

export function exportAnalyticsData(): string {
  const data = getAnalyticsData();

  return JSON.stringify(
    {
      summary: {
        totalProjects: data.totalProjects,
        totalSessions: data.sessions.length,
        successRate: 100 - data.performanceMetrics.errorRate,
        avgGenerationTime: data.performanceMetrics.avgGenerationTime,
        userSatisfaction: data.userMetrics.userSatisfaction,
        lastUpdated: new Date(data.lastUpdated).toISOString(),
      },
      technologyStats: calculateTechnologyStats(data.generations),
      popularCombinations: getPopularCombinations(data.generations),
      trendingTechnologies: getTrendingTechnologies(data.generations),
      performanceMetrics: data.performanceMetrics,
      userMetrics: data.userMetrics,
      recentGenerations: data.generations.slice(-10).map((g) => ({
        id: g.id,
        timestamp: new Date(g.timestamp).toISOString(),
        config: g.config,
        generationTime: g.generationTime,
        success: g.success,
        error: g.error,
      })),
    },
    null,
    2
  );
}
