import { ProjectConfig } from "./types";

export interface ProjectGeneration {
  id: string;
  timestamp: number;
  config: ProjectConfig;
}

export interface AnalyticsData {
  totalProjects: number;
  generations: ProjectGeneration[];
  lastUpdated: number;
}

const STORAGE_KEY = "devops-generator-analytics";

export function getAnalyticsData(): AnalyticsData {
  if (typeof window === "undefined") {
    return {
      totalProjects: 0,
      generations: [],
      lastUpdated: Date.now(),
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load analytics data:", error);
  }

  return {
    totalProjects: 0,
    generations: [],
    lastUpdated: Date.now(),
  };
}

export function saveAnalyticsData(data: AnalyticsData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save analytics data:", error);
  }
}

export function trackProjectGeneration(config: ProjectConfig): void {
  const data = getAnalyticsData();
  
  const generation: ProjectGeneration = {
    id: `gen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    config,
  };

  data.generations.push(generation);
  data.totalProjects += 1;
  data.lastUpdated = Date.now();

  // Keep only last 1000 generations to avoid storage issues
  if (data.generations.length > 1000) {
    data.generations = data.generations.slice(-1000);
  }

  saveAnalyticsData(data);
}

export function calculateTechnologyStats(generations: ProjectGeneration[]) {
  const stats = {
    ci: {} as Record<string, number>,
    infra: {} as Record<string, number>,
    deploy: {} as Record<string, number>,
    observability: {} as Record<string, number>,
    security: {} as Record<string, number>,
  };

  generations.forEach((gen) => {
    const { config } = gen;
    
    stats.ci[config.ci] = (stats.ci[config.ci] || 0) + 1;
    stats.infra[config.infra] = (stats.infra[config.infra] || 0) + 1;
    stats.deploy[config.deploy] = (stats.deploy[config.deploy] || 0) + 1;
    stats.observability[config.observability] = (stats.observability[config.observability] || 0) + 1;
    stats.security[config.security] = (stats.security[config.security] || 0) + 1;
  });

  return stats;
}

export function getPopularCombinations(generations: ProjectGeneration[]) {
  const combinations = new Map<string, { count: number; config: ProjectConfig }>();

  generations.forEach((gen) => {
    const key = `${gen.config.infra}|${gen.config.ci}|${gen.config.deploy}`;
    const existing = combinations.get(key);
    
    if (existing) {
      existing.count += 1;
    } else {
      combinations.set(key, { count: 1, config: gen.config });
    }
  });

  return Array.from(combinations.entries())
    .map(([key, value]) => ({
      name: `${value.config.infra} + ${value.config.ci} + ${value.config.deploy}`,
      count: value.count,
      percentage: (value.count / generations.length) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

export function getTrendingTechnologies(generations: ProjectGeneration[]) {
  if (generations.length < 10) return [];

  const recentCount = Math.min(50, Math.floor(generations.length / 2));
  const recent = generations.slice(-recentCount);
  const older = generations.slice(0, -recentCount);

  const recentStats = calculateTechnologyStats(recent);
  const olderStats = calculateTechnologyStats(older);

  const trends: Array<{ technology: string; growth: number; category: string }> = [];

  // Calculate growth for each technology
  const categories = [
    { key: 'ci', name: 'ci-cd' },
    { key: 'infra', name: 'infrastructure' },
    { key: 'deploy', name: 'deployment' },
    { key: 'observability', name: 'observability' },
    { key: 'security', name: 'security' },
  ];

  categories.forEach(({ key, name }) => {
    const recentCat = recentStats[key as keyof typeof recentStats];
    const olderCat = olderStats[key as keyof typeof olderStats];

    Object.keys(recentCat).forEach((tech) => {
      const recentPercentage = (recentCat[tech] / recentCount) * 100;
      const olderPercentage = ((olderCat[tech] || 0) / older.length) * 100;
      const growth = recentPercentage - olderPercentage;

      if (growth > 0) {
        trends.push({
          technology: tech.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          growth: Math.round(growth),
          category: name,
        });
      }
    });
  });

  return trends.sort((a, b) => b.growth - a.growth).slice(0, 5);
}

export function resetAnalytics(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
