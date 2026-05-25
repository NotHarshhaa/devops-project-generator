import { ProjectConfig } from "../types";

export interface ProjectGeneration {
  id: string;
  timestamp: number;
  config: ProjectConfig;
  generationTime?: number;
  success?: boolean;
  error?: string;
}

export interface UserSession {
  id: string;
  startTime: number;
  endTime?: number;
  projectCount: number;
  interactions: number;
}

export interface AnalyticsData {
  totalProjects: number;
  generations: ProjectGeneration[];
  sessions: UserSession[];
  lastUpdated: number;
  performanceMetrics: {
    avgGenerationTime: number;
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

export const EMPTY_ANALYTICS: AnalyticsData = {
  totalProjects: 0,
  generations: [],
  sessions: [],
  lastUpdated: Date.now(),
  performanceMetrics: {
    avgGenerationTime: 0,
    errorRate: 0,
    popularTimeOfDay: "N/A",
    peakDay: "N/A",
  },
  userMetrics: {
    returningUsers: 0,
    avgProjectsPerUser: 0,
    mostActiveDay: "N/A",
    userSatisfaction: 0,
  },
};
