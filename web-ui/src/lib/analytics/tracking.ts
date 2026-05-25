import { ProjectConfig } from "../types";
import { AnalyticsData, ProjectGeneration } from "./types";
import { getAnalyticsData, saveAnalyticsData } from "./storage";

function updateUserMetrics(data: AnalyticsData): void {
  const sessions = data.sessions;
  if (sessions.length === 0) return;

  data.userMetrics.returningUsers = sessions.filter((s) => s.projectCount > 1).length;

  const totalProjects = sessions.reduce((sum, s) => sum + s.projectCount, 0);
  data.userMetrics.avgProjectsPerUser = sessions.length > 0 ? totalProjects / sessions.length : 0;

  const dayCounts: Record<string, number> = {};
  sessions.forEach((session) => {
    const day = new Date(session.startTime).toLocaleDateString("en-US", { weekday: "long" });
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });
  data.userMetrics.mostActiveDay = Object.entries(dayCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A";

  const avgSessionDuration =
    sessions.reduce((sum, s) => sum + ((s.endTime || Date.now()) - s.startTime), 0) / sessions.length;
  const successRate = 100 - data.performanceMetrics.errorRate;
  const engagementScore = Math.min(100, data.userMetrics.avgProjectsPerUser * 20 + (avgSessionDuration / 60000) * 20);
  data.userMetrics.userSatisfaction = Math.round((successRate * 0.6 + engagementScore * 0.4) * 5) / 100;
}

export function trackProjectGeneration(
  config: ProjectConfig,
  generationTime?: number,
  success?: boolean,
  error?: string
): void {
  const data = getAnalyticsData();

  const generation: ProjectGeneration = {
    id: `gen-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    timestamp: Date.now(),
    config,
    generationTime,
    success: success !== false,
    error,
  };

  data.generations.push(generation);
  data.totalProjects += 1;
  data.lastUpdated = Date.now();

  if (generationTime) {
    const successful = data.generations.filter((g) => g.success !== false && g.generationTime);
    data.performanceMetrics.avgGenerationTime =
      successful.length > 0
        ? successful.reduce((sum, g) => sum + (g.generationTime || 0), 0) / successful.length
        : 0;
  }

  const errorCount = data.generations.filter((g) => g.success === false).length;
  data.performanceMetrics.errorRate =
    data.generations.length > 0 ? (errorCount / data.generations.length) * 100 : 0;

  if (data.generations.length > 1000) {
    data.generations = data.generations.slice(-1000);
  }

  updateUserMetrics(data);
  saveAnalyticsData(data);
}

export function trackUserSession(): void {
  const data = getAnalyticsData();

  data.sessions.push({
    id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    startTime: Date.now(),
    projectCount: 0,
    interactions: 1,
  });

  if (data.sessions.length > 500) {
    data.sessions = data.sessions.slice(-500);
  }

  saveAnalyticsData(data);
}

export function trackInteraction(): void {
  const data = getAnalyticsData();
  const currentSession = data.sessions[data.sessions.length - 1];
  if (currentSession) {
    currentSession.interactions += 1;
    currentSession.endTime = Date.now();
  }
  saveAnalyticsData(data);
}

export function trackProjectInSession(): void {
  const data = getAnalyticsData();
  const currentSession = data.sessions[data.sessions.length - 1];
  if (currentSession) {
    currentSession.projectCount += 1;
    currentSession.endTime = Date.now();
  }
  saveAnalyticsData(data);
}

export function getPerformanceMetrics() {
  return getAnalyticsData().performanceMetrics;
}

export function getUserMetrics() {
  return getAnalyticsData().userMetrics;
}
