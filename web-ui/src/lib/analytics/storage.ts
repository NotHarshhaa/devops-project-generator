import { AnalyticsData, EMPTY_ANALYTICS } from "./types";

export const STORAGE_KEY = "devops-generator-analytics";

export function getAnalyticsData(): AnalyticsData {
  if (typeof window === "undefined") return { ...EMPTY_ANALYTICS, lastUpdated: Date.now() };

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return {
        ...EMPTY_ANALYTICS,
        ...data,
        sessions: data.sessions || [],
        performanceMetrics: { ...EMPTY_ANALYTICS.performanceMetrics, ...data.performanceMetrics },
        userMetrics: { ...EMPTY_ANALYTICS.userMetrics, ...data.userMetrics },
      };
    }
  } catch (error) {
    console.error("Failed to load analytics data:", error);
  }

  return { ...EMPTY_ANALYTICS, lastUpdated: Date.now() };
}

export function saveAnalyticsData(data: AnalyticsData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save analytics data:", error);
  }
}

export function resetAnalytics(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
