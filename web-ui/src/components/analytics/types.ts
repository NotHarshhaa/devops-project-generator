export interface AnalyticsData {
  totalProjects: number;
  activeUsers: number;
  countries: number;
  avgTimeSaved: number;
  totalGenerations: number;
  successRate: number;
  avgGenerationTime: number;
  popularCombinations: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  technologyStats: {
    ci: Record<string, number>;
    infra: Record<string, number>;
    deploy: Record<string, number>;
    observability: Record<string, number>;
    security: Record<string, number>;
  };
  trends: Array<{
    technology: string;
    growth: number;
    category: string;
  }>;
  performanceMetrics: {
    avgLoadTime: number;
    errorRate: number;
    popularTimeOfDay: string;
    peakDay: string;
  };
  userMetrics: {
    returningUsers: number;
    avgProjectsPerUser: number;
    mostActiveDay: string;
    userSatisfaction: number;
  };
}
